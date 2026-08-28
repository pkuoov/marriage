import { getJson, getText, stripHtml } from "./http.js";

const SEARCH_ORDERS = ["click", "pubdate"];

export function playCount(item) {
  const raw = item.view?.stat?.view ?? item.play ?? 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function mapSearchHit(item, keyword, order) {
  return {
    bvid: item.bvid,
    aid: item.aid,
    mid: item.mid,
    author: item.author,
    title: stripHtml(item.title),
    description: stripHtml(item.description),
    duration: item.duration,
    play: Number(item.play) || 0,
    pubdate: item.pubdate,
    tag: item.tag,
    source: `search-${order}`,
    keyword
  };
}

export function mapRelatedHit(item) {
  return {
    bvid: item.bvid,
    aid: item.aid,
    mid: item.owner?.mid,
    author: item.owner?.name,
    title: item.title,
    description: item.desc,
    duration: item.duration,
    play: item.stat?.view || 0,
    pubdate: item.pubdate,
    tag: "",
    source: "related"
  };
}

export async function searchVideos(keyword, page = 1, order = "click") {
  const data = await getJson("https://api.bilibili.com/x/web-interface/search/type", {
    search_type: "video",
    keyword,
    page,
    page_size: 20,
    order
  });
  return (data?.result ?? []).map((item) => mapSearchHit(item, keyword, order));
}

export async function searchIndex(keywords, pagesN) {
  const pool = [];
  for (const keyword of keywords) {
    for (const order of SEARCH_ORDERS) {
      for (let page = 1; page <= pagesN; page += 1) {
        pool.push(...(await searchVideos(keyword, page, order)));
      }
    }
  }
  return pool;
}

function mapView(data) {
  if (!data) return null;
  return {
    bvid: data.bvid,
    aid: data.aid,
    title: data.title,
    description: data.desc,
    owner: data.owner,
    stat: data.stat,
    pubdate: data.pubdate,
    duration: data.duration,
    cid: data.cid,
    tname: data.tname,
    dynamic: data.dynamic
  };
}

export async function videoView(bvid, aid) {
  const byBvid = bvid ? await getJson("https://api.bilibili.com/x/web-interface/view", { bvid }, { retries: 2 }) : null;
  if (byBvid?.cid) return mapView(byBvid);
  if (aid) {
    const byAid = await getJson("https://api.bilibili.com/x/web-interface/view", { aid }, { retries: 2 });
    if (byAid?.cid) return mapView(byAid);
  }
  return mapView(byBvid);
}

export async function videoDetail(bvid) {
  return getJson("https://api.bilibili.com/x/web-interface/view/detail", { bvid });
}

export async function videoReplies(oid, { sort = 0, pn = 1, ps = 20 } = {}) {
  const data = await getJson("https://api.bilibili.com/x/v2/reply", {
    type: 1,
    oid,
    sort,
    ps,
    pn
  });
  return (data?.replies ?? []).map((reply) => ({
    uname: reply.member?.uname,
    message: reply.content?.message,
    like: reply.like,
    sort,
    pn
  }));
}

export async function collectReplies(oid) {
  if (!oid) return [];
  const hot = await videoReplies(oid, { sort: 0, pn: 1, ps: 20 });
  const liked = await videoReplies(oid, { sort: 2, pn: 1, ps: 10 });
  const seen = new Set();
  return [...hot, ...liked].filter((reply) => {
    const key = `${reply.uname}:${reply.message}`;
    if (!reply.message || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function danmakuSample(cid, limit = 24) {
  if (!cid) return [];
  const xml = await getText("https://api.bilibili.com/x/v1/dm/list.so", { oid: cid });
  if (!xml || xml.includes("风控") || !xml.includes("<d ")) return [];
  const hits = [...xml.matchAll(/<d p="[^"]*">([^<]+)<\/d>/g)];
  return hits
    .map((match) => stripHtml(match[1]))
    .filter((line) => line.length >= 2 && line.length <= 40)
    .slice(0, limit);
}

export function relatedFromDetail(detail) {
  return (detail?.Related ?? []).map(mapRelatedHit);
}

export function tagsFromDetail(detail) {
  return (detail?.Tags ?? []).map((tag) => tag.tag_name).filter(Boolean);
}

export function hotRepliesFromDetail(detail) {
  return (detail?.HotReplies ?? detail?.hot_replies ?? []).flatMap((thread) => {
    const top = thread?.content?.message || thread?.replies?.[0];
    if (typeof top === "string") return [{ uname: thread.member?.uname, message: top, like: thread.like, sort: "detail-hot" }];
    return [];
  });
}

export function dedupeVideos(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.bvid || seen.has(item.bvid)) return false;
    seen.add(item.bvid);
    return true;
  });
}

export async function expandRelated(seeds, matches, limit = 8) {
  const extra = [];
  for (const item of seeds.slice(0, limit)) {
    const detail = await videoDetail(item.bvid);
    extra.push(...relatedFromDetail(detail).filter((related) => matches(related)));
  }
  return extra;
}

export async function enrichVideo(item) {
  const view = await videoView(item.bvid);
  const detail = view ? await videoDetail(item.bvid) : null;
  const aid = view?.aid;
  const replies = await collectReplies(aid);
  const tags = tagsFromDetail(detail);
  const danmaku = await danmakuSample(view?.cid);
  return {
    ...item,
    play: view?.stat?.view ?? item.play,
    view,
    replies,
    tags,
    danmaku,
    description: view?.description || item.description || "",
    tname: view?.tname || "",
    subtitles: []
  };
}
