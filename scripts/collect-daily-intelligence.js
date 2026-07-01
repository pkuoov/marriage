import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const configPath = resolve(root, args.config ?? "docs/daily-intelligence-sources.example.json");
const outPath = resolve(root, args.out ?? `.local/daily-intelligence/${weekKey(new Date())}.json`);

async function main() {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const observedAt = new Date().toISOString();
  const items = [];

  for (const source of config.sources ?? []) {
    const sourceItems = await readSource(source);
    sourceItems.forEach((item) => {
      items.push(toIntelligenceCard({ source, item, observedAt }));
    });
  }

  const deduped = dedupeCards(items)
    .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));

  const payload = {
    generatedAt: observedAt,
    week: weekKey(new Date()),
    sourceCount: config.sources?.length ?? 0,
    cardCount: deduped.length,
    cards: deduped.filter((card) => card.quality.keep),
    rejectedCards: deduped.filter((card) => !card.quality.keep)
  };

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Daily intelligence cards written: ${outPath}`);
}

async function readSource(source) {
  if (source.type === "manual") {
    return (source.items ?? [])
      .filter((item) => !isPlaceholderItem(item))
      .map((item) => ({
        ...item,
        url: item.url ?? source.url,
        publishedAt: item.publishedAt ?? source.publishedAt
      }));
  }
  if (source.type === "bing-news" || source.type === "bing-web") {
    const url = bingRssUrl(source.query ?? source.label, source.type);
    const text = await fetchText(url);
    return parseRss(text).map((item) => ({ ...item, searchQuery: source.query }));
  }
  if (!source.url) return [];
  const text = await fetchText(source.url);
  if (source.type === "rss") return parseRss(text);
  return [parsePage(text, source.url)];
}

function isPlaceholderItem(item) {
  return /待填写|placeholder/i.test(`${item?.title ?? ""} ${item?.snippet ?? ""}`);
}

function bingRssUrl(query, type) {
  const endpoint = type === "bing-news" ? "https://www.bing.com/news/search" : "https://www.bing.com/search";
  return `${endpoint}?q=${encodeURIComponent(query)}&format=rss`;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MarriageDetectiveIntelligenceBot/0.1 (+local content research)"
    }
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

function parseRss(xml) {
  const itemBlocks = matchBlocks(xml, "item");
  const entryBlocks = itemBlocks.length ? [] : matchBlocks(xml, "entry");
  return (itemBlocks.length ? itemBlocks : entryBlocks).map((block) => ({
    title: decodeXml(firstTag(block, "title")),
    url: decodeXml(firstTag(block, "link") || firstHref(block)),
    publishedAt: decodeXml(firstTag(block, "pubDate") || firstTag(block, "published") || firstTag(block, "updated")),
    snippet: stripHtml(decodeXml(firstTag(block, "description") || firstTag(block, "summary") || firstTag(block, "content:encoded")))
  })).filter((item) => item.title);
}

function parsePage(html, url) {
  return {
    title: stripHtml(decodeXml(firstTag(html, "title"))),
    url,
    publishedAt: "",
    snippet: decodeXml(metaContent(html, "description") || metaContent(html, "og:description") || "")
  };
}

function toIntelligenceCard({ source, item, observedAt }) {
  const itemText = `${item.title ?? ""} ${item.snippet ?? ""}`;
  const sourceText = `${itemText} ${(source.tags ?? []).join(" ")}`;
  const conflictTypes = pickMatches(itemText, CONFLICT_PATTERNS);
  const countermeasures = pickMatches(itemText, COUNTERMEASURE_PATTERNS);
  const talkTracks = pickMatches(itemText, TALK_TRACK_PATTERNS);
  const fallbackConflictTypes = conflictTypes.length ? conflictTypes : pickMatches(sourceText, CONFLICT_PATTERNS);
  const fallbackCountermeasures = countermeasures.length ? countermeasures : pickMatches(sourceText, COUNTERMEASURE_PATTERNS);
  const fallbackTalkTracks = talkTracks.length ? talkTracks : pickMatches(sourceText, TALK_TRACK_PATTERNS);
  const quality = scoreCardQuality({ source, item, conflictTypes: fallbackConflictTypes, countermeasures: fallbackCountermeasures, talkTracks: fallbackTalkTracks });
  const misreadRisks = buildMisreadRisks(fallbackConflictTypes, fallbackCountermeasures, fallbackTalkTracks);
  const playableQuestions = buildPlayableQuestions(fallbackConflictTypes, fallbackCountermeasures);
  const hook = buildHook(fallbackConflictTypes, fallbackCountermeasures, fallbackTalkTracks);
  return {
    id: stableId(`${source.label ?? source.url}:${item.url ?? item.title}`),
    sourceLabel: source.label ?? "未命名来源",
    sourceKind: source.kind ?? "public-content",
    sourceUrl: item.url ?? source.url ?? "",
    sourceTitle: item.title ?? "",
    publishedAt: normalizeDate(item.publishedAt),
    observedAt,
    conflictTypes: fallbackConflictTypes,
    talkTracks: fallbackTalkTracks,
    countermeasures: fallbackCountermeasures,
    quality,
    misreadRisks,
    playableQuestions,
    hook,
    abstraction: buildAbstraction(fallbackConflictTypes, fallbackCountermeasures, fallbackTalkTracks)
  };
}

function scoreCardQuality({ source, item, conflictTypes, countermeasures, talkTracks }) {
  const text = `${item.title ?? ""} ${item.snippet ?? ""}`;
  const rejectReasons = [];
  if (NOISE_PATTERNS.some((pattern) => pattern.test(text))) rejectReasons.push("明显非公共事件内容噪声");
  if (source.kind === "creator-watch" && !creatorQueryHit(source.query, text)) rejectReasons.push("未命中账号观察关键词");
  const signalScore = conflictTypes.length * 2 + countermeasures.length * 2 + talkTracks.length;
  if (signalScore < 2) rejectReasons.push("缺少可转写的公共事件/法律/资产/流程信号");
  return {
    keep: rejectReasons.length === 0,
    score: signalScore,
    rejectReasons
  };
}

function creatorQueryHit(query = "", text = "") {
  const firstToken = String(query).trim().split(/\s+/)[0];
  if (!firstToken || firstToken.length < 2) return true;
  return text.includes(firstToken);
}

const CONFLICT_PATTERNS = [
  ["房产/洗房", /房|房本|房产|加名|还贷|首付|产权|装修|婚房|洗房/],
  ["债务转嫁", /债|信用卡|欠款|共债|贷款|征信|失信|周转|还款/],
  ["彩礼婚礼", /彩礼|嫁妆|婚礼|酒席|订婚|退婚|礼金/],
  ["恋爱转账", /转账|红包|借款|赠与|代付|借条/],
  ["婚前协议", /婚前协议|财产协议|协议|公证|份额|声明/],
  ["信托/保险安排", /信托|基金|保险|受益人|家族资产|资产隔离/],
  ["资料包装", /学历|收入|工作|岗位|包装|简历|裁切|人设/],
  ["多线关系", /暧昧|养鱼|多线|出轨|前任|情绪价值|陪伴/],
  ["亲密边界勒索", /亲密|偷拍视频|报警|威胁|勒索|酒后|边界/],
  ["平台/中介套路", /婚介|平台|中介|课程|测评|报告|顾问|模板/]
];

const COUNTERMEASURE_PATTERNS = [
  ["资金流水留痕", /流水|转账记录|付款记录|消费记录|留痕/],
  ["份额/权属确认", /份额|产权|权属|加名|登记|房本/],
  ["婚前/财产协议", /婚前协议|财产协议|协议|约定|退出机制/],
  ["借条/赠与声明", /借条|赠与声明|借款合意|赠与|备注/],
  ["公证/律师核验", /公证|律师|核验|审查|合同/],
  ["信托/保险隔离", /信托|保险|受益人|资产隔离|家族基金/],
  ["征信/工商核验", /征信|工商|公司|社保|收入证明|学历认证/]
];

const TALK_TRACK_PATTERNS = [
  ["安全感", /安全感|诚意|态度/],
  ["不信任/太算计", /不信任|算计|现实|精明|伤感情/],
  ["正常夫妻不用算", /一家人|夫妻|不用算|别算这么清/],
  ["父母只是帮忙", /父母|家里安排|帮忙|暂时过渡/],
  ["怕你离开", /怕你|离开|嫌弃|看不起/],
  ["圈里都这么说", /圈里|大家都|行业|都这么介绍/]
];

const NOISE_PATTERNS = [
  /天气|预报|气象|temperature|weather/i,
  /漢字|画数|部首|書き順|読み方|意味|ウィクショナリー|コトバンク|Weblio/i,
  /초등학교|학교정보|사이트맵|나무위키/i,
  /dictionary|辞書|字典/i
];

function buildMisreadRisks(conflictTypes, countermeasures, talkTracks) {
  const risks = [];
  if (countermeasures.length) risks.push("合理保护可能被对方曲解成不信任或算计。");
  if (conflictTypes.includes("房产/洗房")) risks.push("只看是否加名会漏掉权属和现金流是否一致。");
  if (conflictTypes.includes("信托/保险安排")) risks.push("复杂结构可能是资产隔离，也可能遮住真实受益人。");
  if (talkTracks.length) risks.push("情绪话术可能把核验问题改写成爱不爱的问题。");
  return risks.length ? risks : ["第一版叙事可能把事实争点改写成价值观争吵。"];
}

function buildPlayableQuestions(conflictTypes, countermeasures) {
  const questions = ["先问时间线", "先问钱和资源"];
  if (conflictTypes.includes("房产/洗房")) questions.push("先问权属和还贷");
  if (conflictTypes.includes("信托/保险安排")) questions.push("先问真实受益人");
  if (countermeasures.includes("婚前/财产协议")) questions.push("先问协议保护谁、限制谁");
  questions.push("先问情绪动机");
  return [...new Set(questions)].slice(0, 5);
}

function buildHook(conflictTypes, countermeasures, talkTracks) {
  if (conflictTypes.includes("房产/洗房")) return "婚前资产边界被说成不信任，到底是保护自己，还是关系测试？";
  if (conflictTypes.includes("信托/保险安排")) return "复杂资产安排摆上桌面，真正要查的是谁控制、谁受益。";
  if (conflictTypes.includes("债务转嫁")) return "对方说只是短期困难，但账本可能已经把责任推给你。";
  if (countermeasures.length) return `TA 提到${countermeasures[0]}，这到底是保护边界，还是转移成本？`;
  if (talkTracks.length) return `一句“${talkTracks[0]}”后面，可能藏着真正的条件。`;
  return "开场那几句越顺，越要先找被省略的事实。";
}

function buildAbstraction(conflictTypes, countermeasures, talkTracks) {
  return {
    conflict: conflictTypes[0] ?? "关系叙事争议",
    countermeasure: countermeasures[0] ?? "事实核验",
    talkTrack: talkTracks[0] ?? "第一版叙事",
    storyPackUse: "转写为四案故事集候选短案，不保留真实人物和完整案情。"
  };
}

function pickMatches(text, patterns) {
  return patterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function dedupeCards(cards) {
  const seen = new Set();
  return cards.filter((card) => {
    const titleKey = normalizeTitle(card.sourceTitle);
    const key = titleKey || card.sourceUrl || `${card.sourceLabel}:${card.sourceTitle}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeTitle(title = "") {
  return String(title)
    .replace(/\s+/g, "")
    .replace(/[|｜_—-].*$/g, "")
    .replace(/[“”"':：,，.。!！?？]/g, "")
    .slice(0, 42);
}

function matchBlocks(text, tag) {
  return [...text.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((match) => match[1]);
}

function firstTag(text, tag) {
  return text.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.trim() ?? "";
}

function firstHref(text) {
  return text.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? "";
}

function metaContent(html, name) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${escapeRegExp(name)}["'])(?=[^>]*content=["']([^"']*)["'])[^>]*>`, "i");
  return html.match(pattern)?.[1] ?? "";
}

function stripHtml(text = "") {
  return String(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXml(text = "") {
  return String(text)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeDate(value = "") {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function stableId(text) {
  let hash = 2166136261;
  for (const char of String(text)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `intel-${(hash >>> 0).toString(36)}`;
}

function weekKey(date) {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((day - yearStart) / 86400000) + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

await main();
