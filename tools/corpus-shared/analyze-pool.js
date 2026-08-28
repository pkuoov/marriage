import { mkdir, writeFile } from "node:fs/promises";
import { markDuplicates } from "./bili-enrich.js";
import {
  anonymizeLine,
  classifyTitleShape,
  coveragePhenomena,
  revisionFromTurns,
  titleBand,
  turnsFromVideo
} from "./speech-turns.js";

function playOf(video) {
  return video.view?.stat?.view ?? video.play ?? 0;
}

function countBy(items, pick) {
  const bag = new Map();
  for (const item of items) {
    const key = pick(item);
    if (!key) continue;
    bag.set(key, (bag.get(key) ?? 0) + 1);
  }
  return [...bag.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 16)
    .map(([token, count]) => ({ token, count }));
}

const MATCHMAKER_NEG = /几分了|打分|顶美|顶帅|上嫁|验资|矮约等于|素颜分|女明星脸|这种脸|活该单身/;
const LAWYER_HOWTO = /会见怎么说|取证步骤|怎么取证|转移财产|把钱转到|藏起来|卡缓刑|怎么告才能/;
const LAWYER_HARM = /砍了几刀|捅进去|强奸过程|怎么打死/;
const ZHAO_CONFLICT = /你离得好|卡bug/;

function videoText(video) {
  const comments = (video.commentBundle?.hot ?? video.replies ?? []).map((row) => row.message || "");
  const danmaku = (video.danmakuMeta?.items ?? []).map((row) => row.text || row);
  return [video.title, video.view?.title, ...comments.slice(0, 20), ...danmaku.slice(0, 40)].filter(Boolean).join("\n");
}

function trafficSafety(domain, videos) {
  if (domain === "matchmaker") {
    return videos.filter((video) => MATCHMAKER_NEG.test(videoText(video))).length;
  }
  return videos.filter((video) => LAWYER_HOWTO.test(videoText(video)) || LAWYER_HARM.test(videoText(video)) || ZHAO_CONFLICT.test(videoText(video))).length;
}

function flattenVideos(raw) {
  return raw.hosts.flatMap((entry) =>
    (entry.videos || []).map((video, index) => ({ video, host: entry.host, index }))
  );
}

export function buildSpeechOutputs(raw, { domain, corpus, accounts }) {
  const coverageById = Object.fromEntries((accounts.hosts || []).map((host) => [host.id, host.coverage ?? "search"]));
  const dialogueTurns = [];
  const hostReports = raw.hosts.map((entry) => {
    markDuplicates(entry.videos || []);
    const host = entry.host;
    const turns = (entry.videos || []).flatMap((video, index) =>
      turnsFromVideo({ video, host, domain, corpus, index })
    );
    dialogueTurns.push(...turns);
    const videos = entry.videos || [];
    const danmakuAvailable = videos.filter((video) => video.danmakuMeta?.status === "available").length;
    const danmakuFailed = videos.filter((video) =>
      ["risk-controlled", "request-failed", "no-cid"].includes(video.danmakuMeta?.status)
    );
    const subtitleAvailable = videos.filter((video) => video.subtitleMeta?.status === "available").length;
    const loginRequired = videos.filter((video) => video.subtitleMeta?.status === "login-required").length;
    const multiTurn = turns.filter((turn) => turn.exchangeCount >= 3 || turn.segments.length >= 6);
    const negatives = turns.filter((turn) => turn.safetyTags.includes("negative-example-only"));
    const howto = turns.filter((turn) => turn.safetyTags.includes("howto-blocked") || turn.safetyTags.includes("harm-process"));
    const zhao = turns.filter((turn) => turn.safetyTags.includes("zhao-persona-conflict"));
    const commentShapes = videos.flatMap((video) => (video.commentBundle?.hot ?? video.replies ?? []).map((row) => row.message));
    const danmakuShapes = videos.flatMap((video) => (video.danmakuMeta?.items ?? []).map((row) => row.text || row));
    const hostLines = turns.flatMap((turn) => turn.segments.filter((row) => row.speaker === "host").map((row) => row.rawText));
    const callerLines = turns.flatMap((turn) => turn.segments.filter((row) => row.speaker === "caller").map((row) => row.rawText));

    return {
      id: host.id,
      name: host.name,
      coverage: host.coverage ?? coverageById[host.id] ?? "search",
      videoCount: videos.length,
      candidateCount: entry.candidateCount,
      namedCount: entry.namedCount,
      topicalCount: entry.topicalCount,
      droppedOffTopic: entry.droppedOffTopic,
      titles: videos.map((video, index) => ({
        rank: video.rank ?? index + 1,
        play: playOf(video),
        band: titleBand(playOf(video)),
        sourceType: video.sourceQuality?.sourceType || "",
        shape: classifyTitleShape(video.view?.title || video.title || "")
      })),
      titleShapes: countBy(
        videos.map((video) => classifyTitleShape(video.view?.title || video.title || "")),
        (item) => item
      ),
      hostLines: hostLines.slice(0, 8).map((line) => anonymizeLine(line, 28)),
      callerLines: callerLines.slice(0, 8).map((line) => anonymizeLine(line, 28)),
      commentShapes: commentShapes.slice(0, 10).map((line) => anonymizeLine(line, 28)),
      danmakuShapes: danmakuShapes.slice(0, 12).map((line) => anonymizeLine(line, 20)),
      negatives: negatives.length,
      trafficNegatives: trafficSafety(domain, videos),
      howto: howto.length,
      zhao,
      multiTurnCount: multiTurn.length,
      turnCount: turns.length,
      danmakuAvailable,
      danmakuStatuses: countBy(videos, (video) => video.danmakuMeta?.status || "missing"),
      danmakuFailed: danmakuFailed.map((video) => video.danmakuMeta?.status),
      subtitleAvailable,
      loginRequired,
      subtitleStatuses: countBy(videos, (video) => video.subtitleMeta?.status || "missing"),
      commentStatus: countBy(videos, (video) => video.commentBundle?.status || (video.replies?.length ? "available" : "missing")),
      phenomena: coveragePhenomena(turns),
      gap: turns.length < 6 ? (loginRequired ? "无登录字幕，话轮不足" : "可连续听懂的话轮不足") : null
    };
  });

  const revisions = revisionFromTurns(dialogueTurns);
  const totals = {
    videos: hostReports.reduce((sum, host) => sum + host.videoCount, 0),
    comments: flattenVideos(raw).reduce((sum, row) => sum + (row.video.replies?.length || 0), 0),
    danmaku: flattenVideos(raw).reduce((sum, row) => sum + (row.video.danmakuMeta?.count || 0), 0),
    turns: dialogueTurns.length,
    revisions: revisions.length,
    matchmakerNegatives: domain === "matchmaker" ? hostReports.reduce((sum, host) => sum + host.negatives + host.trafficNegatives, 0) : 0,
    lawyerIsolated: domain === "lawyer" ? hostReports.reduce((sum, host) => sum + host.howto + host.zhao.length + host.trafficNegatives, 0) : 0
  };

  return { hostReports, dialogueTurns, revisions, totals };
}

function listTokens(rows) {
  if (!rows?.length) return "无";
  return rows.map((row) => `${row.token}×${row.count}`).join("、");
}

export function renderPatterns({ domain, collectedAt, topN, hostReports, totals }) {
  const title = domain === "matchmaker" ? "说媒口语素材库" : "律师口语素材库";
  const lines = [
    `# ${title}`,
    "",
    `采集时间：${collectedAt}`,
    `流量池：${totals.videos} 条（Top${topN}）。话轮池：${totals.turns} 段。弹幕条目：${totals.danmaku}。评论条目：${totals.comments}。`,
    `说明：标题形状只反映传播。真实话轮只来自字幕。没有字幕的条目不得用标题冒充台词。报告已去掉真名、可检索标题和 BVID。`,
    ""
  ];

  lines.push("## 标题形状", "");
  for (const host of hostReports) {
    lines.push(`- ${host.id}（${host.coverage}）：${listTokens(host.titleShapes)}`);
    for (const row of host.titles.slice(0, 8)) {
      lines.push(`  - #${row.rank} ${row.band}｜${row.sourceType || "未标"}｜${row.shape}`);
    }
  }

  lines.push("", "## 主播真实话轮", "");
  for (const host of hostReports) {
    if (!host.hostLines.length) {
      lines.push(`- ${host.id}：缺口。${host.gap || "无可用字幕话轮"}`);
      continue;
    }
    lines.push(`- ${host.id}：`);
    for (const line of host.hostLines) lines.push(`  - ${line}`);
  }

  lines.push("", "## 当事人真实话轮", "");
  for (const host of hostReports) {
    if (!host.callerLines.length) {
      lines.push(`- ${host.id}：缺口。${host.gap || "无可用字幕话轮"}`);
      continue;
    }
    lines.push(`- ${host.id}：`);
    for (const line of host.callerLines) lines.push(`  - ${line}`);
  }

  lines.push("", "## 热评形状", "");
  for (const host of hostReports) {
    lines.push(`- ${host.id}：`);
    if (!host.commentShapes.length) {
      lines.push("  - 无可用热评");
      continue;
    }
    for (const line of host.commentShapes) lines.push(`  - ${line}`);
  }

  lines.push("", "## 弹幕形状", "");
  for (const host of hostReports) {
    const statuses = listTokens(host.danmakuStatuses);
    lines.push(`- ${host.id}（${statuses}）：`);
    if (!host.danmakuShapes.length) {
      lines.push("  - 无可用弹幕文本");
      continue;
    }
    for (const line of host.danmakuShapes) lines.push(`  - ${line}`);
  }

  lines.push("", "## 禁止进入游戏的负例", "");
  if (domain === "matchmaker") {
    lines.push(`- 打分 / 上嫁 / 群体羞辱：${totals.matchmakerNegatives} 段。这些不得进入林旭阳台词池。`);
  } else {
    lines.push(`- 操作教程 / 伤害过程 / 赵律师人格冲突：${totals.lawyerIsolated} 段。只进负例库。`);
  }
  lines.push("- 标题金句、热评命名和弹幕中译中必须分栏使用，不能混成一种观众声口。");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function renderCoverage({ domain, collectedAt, hostReports, totals }) {
  const lines = [
    `# ${domain === "matchmaker" ? "说媒" : "律师"}语料覆盖报告`,
    "",
    `时间：${collectedAt}`,
    "",
    "## 验收计数",
    "",
    `- 视频：${totals.videos}`,
    `- 评论：${totals.comments}`,
    `- 弹幕：${totals.danmaku}`,
    `- 可用话轮片段：${totals.turns}`,
    `- 完整 A→A′：${totals.revisions}`,
    ""
  ];

  lines.push("## 各声纹", "");
  for (const host of hostReports) {
    const ph = host.phenomena;
    lines.push(`### ${host.id}`);
    lines.push("");
    lines.push(`- 覆盖标签：${host.coverage}`);
    lines.push(`- 流量池：${host.videoCount}`);
    lines.push(`- 真实多轮片段：${host.multiTurnCount}（全部话轮窗 ${host.turnCount}）`);
    lines.push(`- 接话 ${ph.followWord}／躲闪 ${ph.dodge}／打断收窄 ${ph.interruptNarrow}／整套改口 ${ph.fullRevision}／突然变短 ${ph.suddenShort}／物件先出 ${ph.objectFirst}／判断后停住 ${ph.stopAfterJudgment}`);
    lines.push(`- 弹幕状态：${listTokens(host.danmakuStatuses)}；有效弹幕视频 ${host.danmakuAvailable}`);
    lines.push(`- 字幕状态：${listTokens(host.subtitleStatuses)}；登录墙 ${host.loginRequired}`);
    lines.push(`- 评论状态：${listTokens(host.commentStatus)}`);
    if (host.gap) lines.push(`- 缺口：${host.gap}。不得用其他人的内容补齐。`);
    if (domain === "matchmaker") lines.push(`- 打分／上嫁／羞辱负例：话轮 ${host.negatives}，流量池标题/评/弹幕 ${host.trafficNegatives}`);
    if (domain === "lawyer") lines.push(`- 教程／伤害／赵律师冲突隔离：话轮 ${host.howto + host.zhao.length}，流量池 ${host.trafficNegatives}`);
    lines.push("");
  }

  lines.push("## 缺口说明", "");
  lines.push("- 弹幕为空必须区分 `empty` / `risk-controlled` / `request-failed` / `no-cid`，不能把接口失败写成没有弹幕。");
  lines.push("- 匿名接口拿不到字幕时记为 `login-required`。未授权不下载音视频，不把标题写成真实台词。");
  if (domain === "matchmaker") {
    lines.push("- 陈楠、大超若达不到 6 个可连续听懂片段，只登记缺口，不得用其他人补齐。");
  } else {
    lines.push("- 冯予希整活与郭延娇切片不得改写成赵律师默认声口。");
  }
  lines.push("- 写作报告已匿名，不含真名、完整原片标题、BVID、课程或联系方式。");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function toJsonl(rows) {
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}${rows.length ? "\n" : ""}`;
}

function publicTurn(turn) {
  return {
    sourceId: turn.sourceId,
    hostId: turn.hostId,
    sourceType: turn.sourceType,
    startMs: turn.startMs,
    endMs: turn.endMs,
    transcriptSource: turn.transcriptSource,
    segments: turn.segments.map((row) => ({
      speaker: row.speaker,
      startMs: row.startMs,
      endMs: row.endMs,
      rawText: anonymizeLine(row.rawText, 40),
      normalizedText: anonymizeLine(row.normalizedText, 40),
      confidence: row.confidence,
      overlap: row.overlap,
      interrupted: row.interrupted
    })),
    sceneShop: turn.sceneShop,
    speechMove: turn.speechMove,
    emotionShift: turn.emotionShift,
    adjacentAnchor: turn.adjacentAnchor,
    objectAnchor: turn.objectAnchor,
    usableChannel: turn.usableChannel,
    forbiddenChannel: turn.forbiddenChannel,
    safetyTags: turn.safetyTags
  };
}

function publicRevision(row) {
  return {
    event: row.event,
    versionA: anonymizeLine(row.versionA, 40),
    cracks: row.cracks,
    trigger: anonymizeLine(row.trigger, 32),
    emotionBridge: row.emotionBridge,
    versionA2: anonymizeLine(row.versionA2, 40),
    newLoadBearingClaim: anonymizeLine(row.newLoadBearingClaim, 32),
    secondCrack: row.secondCrack,
    hostId: row.hostId,
    sourceId: row.sourceId,
    sceneShop: row.sceneShop
  };
}

export async function writeSpeechReports(outDir, raw, options) {
  const built = buildSpeechOutputs(raw, options);
  await mkdir(outDir, { recursive: true });
  await writeFile(
    `${outDir}/dialogue-turns.jsonl`,
    toJsonl(built.dialogueTurns.map(publicTurn))
  );
  await writeFile(
    `${outDir}/revision-patterns.jsonl`,
    toJsonl(built.revisions.map(publicRevision))
  );
  await writeFile(
    `${outDir}/patterns.md`,
    renderPatterns({
      domain: options.domain,
      collectedAt: raw.collectedAt,
      topN: raw.topN,
      hostReports: built.hostReports,
      totals: built.totals
    })
  );
  await writeFile(
    `${outDir}/coverage-report.md`,
    renderCoverage({
      domain: options.domain,
      collectedAt: raw.collectedAt,
      hostReports: built.hostReports,
      totals: built.totals
    })
  );
  await writeFile(
    `${outDir}/summary.json`,
    `${JSON.stringify(
      {
        collectedAt: raw.collectedAt,
        domain: options.domain,
        totals: built.totals,
        hosts: built.hostReports.map((host) => ({
          id: host.id,
          coverage: host.coverage,
          videoCount: host.videoCount,
          multiTurnCount: host.multiTurnCount,
          turnCount: host.turnCount,
          danmakuAvailable: host.danmakuAvailable,
          subtitleAvailable: host.subtitleAvailable,
          loginRequired: host.loginRequired,
          gap: host.gap,
          phenomena: host.phenomena
        }))
      },
      null,
      2
    )}\n`
  );
  return built;
}
