const OBJECTS = ["卡", "房", "彩礼", "流水", "回单", "抚养费", "工资", "房子", "领证", "转账"];

const HOST_SHOP = {
  "jie-ge": "挡神人",
  "da-chao": "门槛",
  "ao-ye": "货架",
  "jin-da-wang": "判决",
  "tian-shu": "审讯",
  "chen-nan": "判决",
  "feng-yuxi": "假设题",
  "guo-qingzi": "刑案连麦",
  "guo-yanjiao": "婚姻听坑"
};

const MATCHMAKER_NEGATIVE =
  /几分了|打分|顶美|顶帅|上嫁|验资|矮约等于|素颜分|正态分布的7分|女明星脸/;
const MATCHMAKER_SHAME = /丑死|活该单身|这种脸|这种岁数还/;
const LAWYER_HOWTO =
  /会见怎么说|取证步骤|怎么取证|转移财产|把钱转到|藏起来|卡缓刑|怎么告才能|净身出户教程/;
const LAWYER_HARM = /砍了几刀|捅进去|奸|强奸过程|怎么打死/;
const ZHAO_CONFLICT = /你离得好|卡bug|立刻执行完/;

const REVISION_MARK = /不是[，,]?我的意思|其实是这样|我重新说|事情是这样|不是这个意思|我再说一遍/;
const PERMISSION = /能不能|可不可以|有没有机会|还能不能/;
const NARROW = /是不是|有没有|对不对|能不能先/;
const AVOID = /先不说|跟这个无关|不是这个问题|这个不好说/;
const MINIMAL = /也没有完全|差不多吧|可能吧|也不是说/;
const HARD = /相亲是筛选|不等于|不构成|谁主张谁举证|先救人|只能找/;

function tokens(text = "") {
  return String(text)
    .split(/[^\u4e00-\u9fffA-Za-z0-9]+/)
    .filter((token) => token.length >= 2);
}

function overlapFlag(current, previous) {
  if (!previous) return false;
  return current.startMs < previous.endMs;
}

function guessSpeaker(text, domain, previous) {
  const hostScore =
    (text.includes("你") && /[？?]/.test(text) ? 2 : 0) +
    (HARD.test(text) ? 2 : 0) +
    (NARROW.test(text) ? 1 : 0) +
    (domain === "lawyer" && /不构成|不等于|先救人|先停手/.test(text) ? 2 : 0);
  const callerScore =
    (/^(我|我妈|我们家|他给我|她给我)/.test(text) ? 2 : 0) +
    (PERMISSION.test(text) ? 2 : 0) +
    (/要求不高|看不上|养得起|我是女的/.test(text) ? 1 : 0);
  if (hostScore >= callerScore + 2) return { speaker: "host", confidence: 0.72 };
  if (callerScore >= hostScore + 2) return { speaker: "caller", confidence: 0.7 };
  if (previous?.speaker === "host") return { speaker: "caller", confidence: 0.38 };
  if (previous?.speaker === "caller") return { speaker: "host", confidence: 0.38 };
  return { speaker: "unknown", confidence: 0.2 };
}

function speechMoves(text, speaker) {
  const moves = [];
  if (speaker === "host" && /那|所以|你刚才|这个/.test(text)) moves.push("接话");
  if (OBJECTS.some((item) => text.includes(item))) moves.push("追物件");
  if (PERMISSION.test(text)) moves.push("要求许可");
  if (NARROW.test(text)) moves.push("缩小问题");
  if (AVOID.test(text)) moves.push("回避");
  if (MINIMAL.test(text)) moves.push("最小承认");
  if (REVISION_MARK.test(text) && text.length >= 12) moves.push("整套改口");
  if (HARD.test(text)) moves.push(speaker === "host" && /不构成|不等于|先救人/.test(text) ? "程序拦截" : "强硬点名");
  if (/只能找|不构成|相亲是筛选/.test(text) && text.length <= 28) moves.push("结案判断");
  if (!moves.length) moves.push(speaker === "host" ? "接话" : "最小承认");
  return [...new Set(moves)];
}

function emotionShift(text, previousText = "") {
  if (/[0-9一二三四五六七八九十]+万|卡里|转账|抚养费/.test(text) && text.length <= 24) return "precise-on-money";
  if (/你说话难听|凭什么|你懂什么/.test(text)) return "breaking";
  if (/不是[！!]|你听我说|我急了/.test(text)) return "irritated";
  if (MINIMAL.test(text) || AVOID.test(text)) return "guarded";
  if (previousText.length > 30 && text.length < 8) return "guarded";
  return "none";
}

function adjacentAnchor(current, previous) {
  if (!previous) return "";
  const prevTokens = tokens(previous);
  const hit = tokens(current).find((token) => prevTokens.includes(token));
  return hit || "";
}

function objectAnchor(text) {
  return OBJECTS.find((item) => text.includes(item)) || "";
}

function safetyForText(text, domain) {
  const tags = [];
  if (domain === "matchmaker") {
    if (MATCHMAKER_NEGATIVE.test(text) || MATCHMAKER_SHAME.test(text)) tags.push("negative-example-only");
    if (/上嫁|验资/.test(text)) tags.push("howto-blocked");
  }
  if (domain === "lawyer") {
    if (LAWYER_HOWTO.test(text)) tags.push("howto-blocked");
    if (LAWYER_HARM.test(text)) tags.push("harm-process");
    if (ZHAO_CONFLICT.test(text)) tags.push("zhao-persona-conflict");
    if (tags.length) tags.push("negative-example-only");
  }
  return tags;
}

function usableChannels({ domain, hostId, speaker, safetyTags, moves }) {
  if (safetyTags.includes("negative-example-only") || safetyTags.includes("howto-blocked")) {
    return { usableChannel: [], forbiddenChannel: ["host-lin", "zhao-lawyer", "caller"] };
  }
  if (domain === "matchmaker") {
    if (speaker === "caller") return { usableChannel: ["caller"], forbiddenChannel: [] };
    if (speaker === "host") return { usableChannel: ["comment"], forbiddenChannel: ["host-lin"] };
    return { usableChannel: ["danmaku", "comment"], forbiddenChannel: ["host-lin"] };
  }
  if (speaker === "caller") return { usableChannel: ["caller"], forbiddenChannel: [] };
  if (hostId === "feng-yuxi") {
    return { usableChannel: ["guest-advisor"], forbiddenChannel: ["zhao-lawyer"] };
  }
  if (hostId === "guo-yanjiao" && moves.includes("强硬点名")) {
    return { usableChannel: ["guest-advisor"], forbiddenChannel: ["zhao-lawyer"] };
  }
  if (moves.includes("程序拦截") || moves.includes("结案判断")) {
    return { usableChannel: ["zhao-lawyer", "guest-advisor"], forbiddenChannel: [] };
  }
  return { usableChannel: ["guest-advisor"], forbiddenChannel: ["zhao-lawyer"] };
}

export function internalSourceId(corpus, hostId, index, windowIndex) {
  return `${corpus}-${hostId}-${String(index + 1).padStart(2, "0")}-w${windowIndex + 1}`;
}

export function buildSegments(body, domain) {
  const segments = [];
  for (const row of body) {
    const previous = segments.at(-1);
    const guess = guessSpeaker(row.rawText, domain, previous);
    const interrupted = Boolean(previous && /你听我说|等一下|不是/.test(row.rawText) && overlapFlag(row, previous));
    segments.push({
      speaker: guess.speaker,
      startMs: row.startMs,
      endMs: Math.max(row.endMs, row.startMs),
      rawText: row.rawText,
      normalizedText: row.normalizedText || row.rawText,
      confidence: guess.confidence,
      overlap: overlapFlag(row, previous),
      interrupted
    });
  }
  return segments;
}

function sliceWindows(segments, maxTurns = 14, maxMs = 90000) {
  if (!segments.length) return [];
  const windows = [];
  let start = 0;
  while (start < segments.length) {
    let end = start;
    while (
      end + 1 < segments.length &&
      end + 1 - start < maxTurns &&
      segments[end + 1].endMs - segments[start].startMs <= maxMs
    ) {
      end += 1;
    }
    windows.push(segments.slice(start, end + 1));
    start = end + 1;
  }
  return windows.filter((window) => window.length >= 6);
}

function speakerCounts(segments) {
  const host = segments.filter((row) => row.speaker === "host").length;
  const caller = segments.filter((row) => row.speaker === "caller").length;
  return { host, caller, exchanges: Math.min(host, caller) };
}

function phenomenonFlags(segments) {
  const flags = {
    followWord: false,
    dodge: false,
    interruptNarrow: false,
    fullRevision: false,
    suddenShort: false,
    objectFirst: false,
    stopAfterJudgment: false
  };
  for (let index = 1; index < segments.length; index += 1) {
    const prev = segments[index - 1];
    const curr = segments[index];
    if (curr.speaker === "host" && adjacentAnchor(curr.rawText, prev.rawText)) flags.followWord = true;
    if (curr.speaker === "caller" && (AVOID.test(curr.rawText) || NARROW.test(prev.rawText) && !curr.rawText.includes(objectAnchor(prev.rawText)))) {
      flags.dodge = true;
    }
    if (curr.speaker === "host" && (curr.interrupted || NARROW.test(curr.rawText))) flags.interruptNarrow = true;
    if (curr.speaker === "caller" && REVISION_MARK.test(curr.rawText) && curr.rawText.length >= 16) flags.fullRevision = true;
    if (prev.rawText.length >= 18 && curr.rawText.length <= 6) flags.suddenShort = true;
    if (objectAnchor(curr.rawText) && !/因为|所以|为了/.test(curr.rawText.slice(0, 4))) flags.objectFirst = true;
    if (curr.speaker === "host" && HARD.test(curr.rawText) && curr.rawText.length <= 24) flags.stopAfterJudgment = true;
  }
  return flags;
}

export function annotateWindow({ window, hostId, domain, sourceId, sourceType, transcriptSource }) {
  const first = window[0];
  const last = window.at(-1);
  const joined = window.map((row) => row.rawText).join("");
  const moves = [...new Set(window.flatMap((row) => speechMoves(row.rawText, row.speaker)))];
  const safetyTags = [...new Set(safetyForText(joined, domain))];
  const channels = usableChannels({ domain, hostId, speaker: "mixed", safetyTags, moves });
  const emotions = window.map((row, index) => emotionShift(row.rawText, window[index - 1]?.rawText));
  const emotionShiftValue = emotions.find((item) => item !== "none") || "none";
  return {
    sourceId,
    hostId,
    sourceType,
    startMs: first.startMs,
    endMs: last.endMs,
    transcriptSource,
    segments: window,
    sceneShop: HOST_SHOP[hostId] || "",
    speechMove: moves,
    emotionShift: emotionShiftValue,
    adjacentAnchor: adjacentAnchor(window[1]?.rawText || "", first.rawText),
    objectAnchor: objectAnchor(joined),
    usableChannel: channels.usableChannel,
    forbiddenChannel: channels.forbiddenChannel,
    safetyTags,
    phenomena: phenomenonFlags(window),
    exchangeCount: speakerCounts(window).exchanges
  };
}

export function turnsFromVideo({ video, host, domain, corpus, index }) {
  const body = video.subtitleMeta?.body || [];
  if (!body.length) return [];
  const segments = buildSegments(body, domain);
  const windows = sliceWindows(segments);
  return windows.slice(0, 3).map((window, windowIndex) =>
    annotateWindow({
      window,
      hostId: host.id,
      domain,
      sourceId: internalSourceId(corpus, host.id, index, windowIndex),
      sourceType: video.sourceQuality?.sourceType || "clip",
      transcriptSource: video.subtitleMeta?.transcriptSource || "official-subtitle"
    })
  );
}

export function revisionFromTurns(turns) {
  const rows = [];
  for (const turn of turns) {
    const segs = turn.segments || [];
    const revisionAt = segs.findIndex((row) => row.speaker === "caller" && REVISION_MARK.test(row.rawText) && row.rawText.length >= 16);
    if (revisionAt < 3) continue;
    const before = segs.slice(0, revisionAt).filter((row) => row.speaker === "caller");
    const after = segs.slice(revisionAt).filter((row) => row.speaker === "caller");
    if (before.length < 1 || after.length < 1) continue;
    const versionA = before.map((row) => row.rawText).join("");
    const versionA2 = after.map((row) => row.rawText).join("");
    if (versionA.length < 12 || versionA2.length < 12) continue;
    const triggerSeg = segs[revisionAt - 1];
    rows.push({
      sourceId: turn.sourceId,
      hostId: turn.hostId,
      event: objectAnchor(versionA) || turn.objectAnchor || "同一事件",
      versionA: versionA.slice(0, 80),
      cracks: [turn.adjacentAnchor].filter(Boolean),
      trigger: triggerSeg?.rawText.slice(0, 40) || "",
      emotionBridge: turn.emotionShift === "none" ? "突然精确" : turn.emotionShift,
      versionA2: versionA2.slice(0, 80),
      newLoadBearingClaim: after[0].rawText.slice(0, 40),
      secondCrack: objectAnchor(versionA2) && versionA2.includes("不是") ? "新口径仍绕开物件" : "",
      sceneShop: turn.sceneShop
    });
  }
  return rows;
}

export function classifyTitleShape(title = "") {
  if (/[？?]/.test(title) || /能不能|为什么|凭什么/.test(title)) return "问句";
  if (/不是.{1,8}是|看得上.{0,6}养不起|普通.{0,4}不普通/.test(title)) return "对仗";
  if (/\d|万|千|百分之/.test(title)) return "数字带单位";
  if (/你能找|来了个|遇到/.test(title)) return "催或现场";
  return "故事或判决";
}

export function anonymizeLine(text = "", limit = 24) {
  return String(text)
    .replace(/BV[0-9A-Za-z]+/g, "")
    .replace(/微信[号:]?\s*\w+/g, "")
    .replace(/1[3-9]\d{9}/g, "")
    .replace(/冯予希|郭庆梓|郭延娇|杰哥相亲|大超说媒|月老鳌烨|金大王说媒|天书定位|陈楠说媒|183的冯/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

export function titleBand(play = 0) {
  if (play >= 500000) return "高播";
  if (play >= 100000) return "中播";
  return "低播";
}

export function coveragePhenomena(turns) {
  const flags = { followWord: 0, dodge: 0, interruptNarrow: 0, fullRevision: 0, suddenShort: 0, objectFirst: 0, stopAfterJudgment: 0 };
  for (const turn of turns) {
    for (const key of Object.keys(flags)) {
      if (turn.phenomena?.[key]) flags[key] += 1;
    }
  }
  return flags;
}
