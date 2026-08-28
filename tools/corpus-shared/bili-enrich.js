import { appendRequestLog, getJsonResult, getPlainJson, getTextResult, hasLoginCookie, stripHtml } from "./http.js";
import { playCount, videoView } from "./bili-media.js";

const COMMENT_AI = /总结君|视频总结|AI总结|智能摘要|一键总结|字幕组AI|内容总结/;
const COMMENT_CONTACT = /微信|v信|V信|加微|咨询电话|课程报名|私信领|q群|QQ群|\b1[3-9]\d{9}\b/;
const COMMENT_EMOJI_ONLY = /^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}\d\p{P}]+$/u;
const COMMENT_SLUR =
  /母狗|公狗|死全家|滚出中国|支那|野种|残疾就该|穷逼去死|女拳死|男权死/;
const COMMENT_REGION_FIGHT = /河南人|东北人|安徽人|江西人|山东人|广东人|江苏人/;

export function parseDurationSeconds(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "");
  if (/^\d+$/.test(text)) return Number(text);
  const parts = text.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export function videoDuration(video) {
  return parseDurationSeconds(video.view?.duration ?? video.duration);
}

function logRequest(logPath, name, result, extra = {}) {
  return appendRequestLog(logPath, {
    name,
    ok: result.ok,
    status: result.status,
    reason: result.reason ?? null,
    httpStatus: result.httpStatus ?? null,
    attempts: result.attempts ?? 1,
    code: result.code,
    url: result.url,
    ...extra
  });
}

export function classifySourceType(host, video) {
  const title = `${video.title ?? ""} ${video.view?.title ?? ""}`;
  const author = video.view?.owner?.name || video.author || "";
  const preferred = (host.preferAuthors ?? []).some((name) => author.includes(name));
  if (/会诊|联合/.test(title) || (title.includes("陈楠") && title.includes("天书"))) return "joint-consult";
  if (host.coverage === "desk-repost") return "repost";
  if (host.coverage === "clip-up" || host.coverage === "no-official-traffic") return preferred ? "clip" : "clip";
  if (preferred || host.coverage === "official" || host.coverage === "talk-up") return "official";
  return "clip";
}

export function jointParticipants(host, video) {
  if (classifySourceType(host, video) !== "joint-consult") return [host.id];
  const title = `${video.title ?? ""} ${video.view?.title ?? ""}`;
  const people = new Set([host.id]);
  if (title.includes("陈楠")) people.add("chen-nan");
  if (title.includes("天书")) people.add("tian-shu");
  return [...people];
}

export function titleFingerprint(title = "", duration = 0) {
  const normalized = String(title)
    .toLowerCase()
    .replace(/[^\u4e00-\u9fffA-Za-z0-9]/g, "");
  const bucket = Math.round(parseDurationSeconds(duration) / 10) * 10;
  return `${normalized}:${bucket}`;
}

export function markDuplicates(videos) {
  const byBvid = new Map();
  const byAid = new Map();
  const byTitle = new Map();
  for (const video of videos) {
    video.duplicateOf = null;
    const bvid = video.bvid || video.view?.bvid;
    const aid = video.aid || video.view?.aid;
    const finger = titleFingerprint(video.view?.title || video.title, videoDuration(video));
    if (bvid && byBvid.has(bvid)) {
      video.duplicateOf = byBvid.get(bvid);
      continue;
    }
    if (aid && byAid.has(aid)) {
      video.duplicateOf = byAid.get(aid);
      continue;
    }
    if (finger && byTitle.has(finger)) {
      video.duplicateOf = byTitle.get(finger);
      video.sameLivestream = true;
      continue;
    }
    if (bvid) byBvid.set(bvid, bvid);
    if (aid) byAid.set(aid, bvid || String(aid));
    if (finger) byTitle.set(finger, bvid || finger);
  }
  return videos;
}

function keepComment(message = "", uname = "") {
  const text = stripHtml(message);
  if (!text || text.length < 2) return false;
  if (COMMENT_AI.test(uname) || COMMENT_AI.test(text)) return false;
  if (COMMENT_CONTACT.test(text)) return false;
  if (COMMENT_SLUR.test(text)) return false;
  if (COMMENT_EMOJI_ONLY.test(text)) return false;
  if (COMMENT_REGION_FIGHT.test(text) && text.length < 18) return false;
  return true;
}

function mapReply(reply, { sort, layer = "top", ownerMid } = {}) {
  const message = reply.content?.message || "";
  const uname = reply.member?.uname || "";
  const mid = reply.member?.mid;
  if (!keepComment(message, uname)) return null;
  return {
    uname,
    mid,
    message: stripHtml(message),
    like: reply.like || 0,
    ctime: reply.ctime,
    rpid: reply.rpid,
    rcount: reply.rcount || 0,
    sort,
    layer,
    isAuthor: Boolean(ownerMid && mid && Number(mid) === Number(ownerMid))
  };
}

export async function fetchCommentBundle(oid, ownerMid, { logPath, bvid } = {}) {
  if (!oid) {
    return {
      status: "request-failed",
      failReason: "no-aid",
      hot: [],
      liked: [],
      recent: [],
      author: [],
      debate: [],
      all: []
    };
  }

  const queries = [
    { key: "hot", sort: 2, pn: 1, ps: 20 },
    { key: "liked", sort: 1, pn: 1, ps: 10 },
    { key: "recent", sort: 0, pn: 1, ps: 10 }
  ];
  const buckets = { hot: [], liked: [], recent: [] };
  let anyOk = false;
  let lastReason = null;

  for (const query of queries) {
    const result = await getJsonResult("https://api.bilibili.com/x/v2/reply", {
      type: 1,
      oid,
      sort: query.sort,
      ps: query.ps,
      pn: query.pn
    });
    await logRequest(logPath, "reply", result, { bvid, sort: query.sort });
    if (!result.ok) {
      lastReason = result.reason;
      continue;
    }
    anyOk = true;
    const mapped = (result.data?.replies ?? [])
      .flatMap((reply) => {
        const top = mapReply(reply, { sort: query.key, layer: "top", ownerMid });
        const children = (reply.replies ?? [])
          .map((child) => mapReply(child, { sort: query.key, layer: "reply", ownerMid }))
          .filter(Boolean);
        return [top, ...children].filter(Boolean);
      });
    buckets[query.key] = mapped;
  }

  const all = [];
  const seen = new Set();
  for (const row of [...buckets.hot, ...buckets.liked, ...buckets.recent]) {
    const key = `${row.rpid || row.uname}:${row.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    all.push(row);
  }

  const author = all.filter((row) => row.isAuthor);
  const debate = buckets.hot.filter((row) => row.layer === "reply" || (row.rcount ?? 0) >= 3).slice(0, 12);

  return {
    status: anyOk ? (all.length ? "available" : "empty") : lastReason || "request-failed",
    failReason: anyOk ? null : lastReason || "request-failed",
    hot: buckets.hot,
    liked: buckets.liked,
    recent: buckets.recent,
    author,
    debate,
    all
  };
}

export function parseDanmakuXml(xml) {
  const hits = [...String(xml).matchAll(/<d p="([^"]+)">([^<]*)<\/d>/g)];
  return hits
    .map((match) => {
      const fields = match[1].split(",");
      const timeSec = Number(fields[0]);
      const text = stripHtml(match[2]);
      if (!text || text.length < 2 || text.length > 80) return null;
      return {
        timeMs: Number.isFinite(timeSec) ? Math.round(timeSec * 1000) : 0,
        mode: Number(fields[1]) || 1,
        sentAt: Number(fields[4]) || 0,
        userHash: fields[6] || "",
        dmid: fields[7] || "",
        text
      };
    })
    .filter(Boolean);
}

export async function fetchDanmaku(cid, { logPath, bvid } = {}) {
  if (!cid) {
    return { status: "no-cid", failReason: "no-cid", items: [], count: 0 };
  }
  const result = await getTextResult("https://api.bilibili.com/x/v1/dm/list.so", { oid: cid });
  await logRequest(logPath, "danmaku", result, { bvid, cid });
  if (!result.ok) {
    const status = result.reason === "risk-controlled" ? "risk-controlled" : "request-failed";
    return { status, failReason: result.reason || "request-failed", items: [], count: 0 };
  }
  const text = result.text || "";
  const head = text.slice(0, 400);
  if (!text.includes("<d ")) {
    if (/风控|风险控制/.test(head)) {
      return { status: "risk-controlled", failReason: "risk-controlled", items: [], count: 0 };
    }
    return { status: "empty", failReason: null, items: [], count: 0 };
  }
  const items = parseDanmakuXml(text);
  return { status: items.length ? "available" : "empty", failReason: null, items, count: items.length };
}

function pickSubtitleTrack(subtitles = []) {
  const ranked = [...subtitles].sort((left, right) => {
    const score = (item) => {
      const lan = `${item.lan || ""} ${item.lan_doc || ""}`;
      if (item.type === 0 && /zh|中文/.test(lan)) return 3;
      if (/ai-zh|中文（自动/.test(lan)) return 2;
      if (/zh|中文/.test(lan)) return 1;
      return 0;
    };
    return score(right) - score(left);
  });
  return ranked.find((item) => item.subtitle_url) || null;
}

function mapSubtitleBody(body = []) {
  return body
    .map((row) => {
      const text = stripHtml(row.content || "");
      if (!text) return null;
      return {
        startMs: Math.round((row.from || 0) * 1000),
        endMs: Math.round((row.to || row.from || 0) * 1000),
        rawText: text,
        normalizedText: text.replace(/\s+/g, " ").trim()
      };
    })
    .filter(Boolean);
}

export async function fetchSubtitles(video, { logPath } = {}) {
  const bvid = video.bvid || video.view?.bvid;
  const aid = video.view?.aid || video.aid;
  const cid = video.view?.cid;
  if (!cid || !aid) {
    return { status: "request-failed", failReason: "no-cid", tracks: [], body: [], transcriptSource: null };
  }
  if (!hasLoginCookie()) {
    return {
      status: "login-required",
      failReason: "need-login-subtitle",
      tracks: [],
      body: [],
      transcriptSource: null
    };
  }

  let player = await getJsonResult("https://api.bilibili.com/x/player/wbi/v2", { aid, cid, bvid }, { retries: 1 });
  await logRequest(logPath, "player-wbi-v2", player, { bvid, cid });
  if (!player.ok) {
    player = await getJsonResult("https://api.bilibili.com/x/player/v2", { aid, cid, bvid }, { retries: 2 });
    await logRequest(logPath, "player-v2", player, { bvid, cid });
  }
  const playerData = player.ok ? player.data : null;
  const needLogin = Boolean(playerData?.need_login_subtitle) || !hasLoginCookie();
  const tracks = playerData?.subtitle?.subtitles ?? [];
  const track = pickSubtitleTrack(tracks);

  if (!player.ok && player.reason === "risk-controlled") {
    return { status: "risk-controlled", failReason: "risk-controlled", tracks: [], body: [], transcriptSource: null };
  }

  if (!track) {
    if (needLogin || playerData?.need_login_subtitle) {
      return {
        status: "login-required",
        failReason: "need-login-subtitle",
        tracks,
        body: [],
        transcriptSource: null
      };
    }
    return { status: "empty", failReason: null, tracks, body: [], transcriptSource: null };
  }

  const url = track.subtitle_url.startsWith("//") ? `https:${track.subtitle_url}` : track.subtitle_url;
  const file = await getPlainJson(url, {});
  await logRequest(logPath, "subtitle-file", file, { bvid });
  if (!file.ok) {
    return {
      status: file.reason === "risk-controlled" ? "risk-controlled" : "request-failed",
      failReason: file.reason || "request-failed",
      tracks,
      body: [],
      transcriptSource: null
    };
  }
  const body = mapSubtitleBody(file.data?.body ?? file.data ?? []);
  const ai = /ai-zh|自动/.test(`${track.lan || ""} ${track.lan_doc || ""}`);
  return {
    status: body.length ? "available" : "empty",
    failReason: null,
    tracks,
    body,
    transcriptSource: ai ? "creator-caption" : "official-subtitle",
    lan: track.lan,
    lanDoc: track.lan_doc
  };
}

export function attachDanmakuToWindows(items, windows = []) {
  if (!windows.length) {
    return items.map((item) => ({ ...item, fragmentId: null }));
  }
  return items.map((item) => {
    const window = windows.find((row) => item.timeMs >= row.startMs && item.timeMs <= row.endMs);
    return { ...item, fragmentId: window?.sourceId ?? null };
  });
}

export function sourceQuality(host, video) {
  const view = video.view || {};
  const stat = view.stat || {};
  return {
    sourceType: classifySourceType(host, video),
    participants: jointParticipants(host, video),
    official: classifySourceType(host, video) === "official",
    author: view.owner?.name || video.author || "",
    authorMid: view.owner?.mid || video.mid || null,
    pubdate: view.pubdate || video.pubdate || null,
    duration: videoDuration(video),
    play: stat.view ?? playCount(video),
    like: stat.like ?? null,
    reply: stat.reply ?? null,
    danmakuCount: stat.danmaku ?? null,
    cid: view.cid || null,
    aid: view.aid || video.aid || null,
    bvid: video.bvid || view.bvid || null,
    traceable: Boolean(view.aid && view.cid),
    edited: /混剪|合集|精剪|剪辑/.test(video.title || view.title || ""),
    sameLivestream: Boolean(video.sameLivestream),
    duplicateOf: video.duplicateOf || null
  };
}

export function isDialogueCandidate(video) {
  const title = `${video.title ?? ""} ${video.view?.title ?? ""}`;
  if (/混剪|合集|精选|盘点/.test(title)) return false;
  const duration = videoDuration(video);
  if (duration > 0 && duration < 90) return false;
  if (duration > 3600) return false;
  return true;
}

export function pickDialogueSeeds(videos, limit = 10) {
  return [...videos]
    .filter(isDialogueCandidate)
    .sort((left, right) => {
      const talk = (video) => (/连麦|现场|会诊|连线|直播/.test(video.title || "") ? 1 : 0);
      const talkGap = talk(right) - talk(left);
      if (talkGap) return talkGap;
      return videoDuration(right) - videoDuration(left);
    })
    .slice(0, limit);
}

export async function enrichExistingVideo(video, host, { logPath, fetchSubtitle = true } = {}) {
  const bvid = video.bvid || video.view?.bvid;
  let view = video.view;
  if (!view?.cid || !view?.aid) {
    view = (await videoView(bvid, video.aid || view?.aid)) || view;
  }
  const comments = await fetchCommentBundle(view?.aid || video.aid, view?.owner?.mid || video.mid, { logPath, bvid });
  const danmaku = await fetchDanmaku(view?.cid, { logPath, bvid });
  const subtitles = fetchSubtitle
    ? await fetchSubtitles({ ...video, view }, { logPath })
    : video.subtitleMeta || { status: "skipped", body: [], tracks: [] };

  const next = {
    ...video,
    play: view?.stat?.view ?? video.play,
    view,
    tags: video.tags?.length ? video.tags : [],
    replies: comments.all,
    commentBundle: {
      status: comments.status,
      failReason: comments.failReason,
      hot: comments.hot,
      liked: comments.liked,
      recent: comments.recent,
      author: comments.author,
      debate: comments.debate
    },
    danmaku: danmaku.items.map((item) => item.text),
    danmakuMeta: {
      status: danmaku.status,
      failReason: danmaku.failReason,
      count: danmaku.count,
      items: danmaku.items
    },
    subtitles: (subtitles.body || []).map((row) => row.rawText),
    subtitleMeta: subtitles,
    sourceQuality: sourceQuality(host, { ...video, view }),
    description: view?.description || video.description || "",
    tname: view?.tname || video.tname || "",
    enrich: {
      complete: true,
      completedAt: new Date().toISOString(),
      subtitleStatus: subtitles.status,
      danmakuStatus: danmaku.status,
      commentStatus: comments.status
    }
  };
  next.sourceQuality = sourceQuality(host, next);
  return next;
}
