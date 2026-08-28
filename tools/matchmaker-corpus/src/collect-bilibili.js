import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { markDuplicates } from "../../corpus-shared/bili-enrich.js";
import {
  enrichHostEntry,
  loadLatest,
  logPathFor,
  mergeHosts,
  parseCorpusArgs,
  saveLatest
} from "../../corpus-shared/collect-runner.js";
import { dedupeVideos, expandRelated, playCount, searchIndex } from "../../corpus-shared/bili-media.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseCorpusArgs(process.argv, { topN: 20, pagesN: 6 });
const topN = args.topN;
const pagesN = args.pagesN;
const hostFilter = args.hostFilter;

const DATING_KEEP = [
  "婚", "恋", "相亲", "说媒", "月老", "红娘", "择偶", "对象",
  "结婚", "离婚", "领证", "彩礼", "嫁", "娶", "老婆", "老公",
  "男友", "女友", "前任", "复合", "恐婚", "单身", "连麦", "连过",
  "定位", "画像", "短择", "上择", "下嫁", "门当户对",
  "两性", "男女", "女权", "备胎", "雌竞",
  "顶美", "顶帅", "最好看", "最帅",
  "颜值", "女生", "男生", "女人", "男人", "女孩", "男孩",
  "A8", "A9", "千万局", "中产局", "单身大集", "捞女",
  "孩子", "生孩", "二胎", "三胎", "生育", "富养",
  "小红书", "医美", "看不上", "养得起", "条件"
];

const DATING_DROP = [
  "加班", "垄断", "外包", "企业总是", "狐妖", "詹姆斯", "票房",
  "洗纹身", "三国杀", "漫剧", "春晚", "Steam"
];

function textOf(item) {
  return `${item.author ?? ""} ${item.title ?? ""}`;
}

function topicBlob(item) {
  return `${item.title ?? ""} ${item.description ?? ""} ${item.tag ?? ""}`;
}

function isDatingTopic(host, item) {
  const blob = topicBlob(item);
  const dropped = DATING_DROP.some((token) => blob.includes(token));
  const kept = DATING_KEEP.some((token) => blob.includes(token));
  if (dropped && !kept) return false;
  if (kept) return true;
  const author = item.author ?? "";
  const preferred = (host.preferAuthors ?? []).some((name) => author.includes(name));
  return Boolean(host.shopDefaultDating && preferred);
}

function matchesHost(host, item) {
  const author = item.author ?? "";
  const title = item.title ?? "";
  const blob = textOf(item);
  if ((host.requireAuthors ?? []).length && !(host.requireAuthors ?? []).some((name) => author.includes(name))) {
    return false;
  }
  const preferred = (host.preferAuthors ?? []).some((name) => author.includes(name));
  const phrased = (host.mustPhraseAny ?? host.mustAny ?? []).some((token) => blob.includes(token));
  if ((host.mustPhraseAny ?? host.mustAny ?? []).length && !phrased && !preferred) return false;
  const excluded = (host.excludeTitleAny ?? host.excludeAny ?? []).some((token) => title.includes(token));
  if (excluded) return false;
  if (host.talkOnly && /社会博弈|杰哥讲|粉丝连麦/.test(title)) return false;
  if (preferred) return true;
  return phrased;
}

function preferScore(host, item) {
  const author = item.author ?? "";
  if ((host.preferAuthors ?? []).some((name) => author.includes(name))) return 2;
  if ((host.mustAny ?? []).some((token) => author.includes(token))) return 1;
  return 0;
}

function pickTop(host, items) {
  const named = dedupeVideos(items).filter((item) => matchesHost(host, item));
  const topical = named.filter((item) => isDatingTopic(host, item));
  const ranked = topical.sort((left, right) => {
    const playGap = playCount(right) - playCount(left);
    if (playGap) return playGap;
    return preferScore(host, right) - preferScore(host, left);
  });
  return {
    namedCount: named.length,
    topicalCount: topical.length,
    droppedOffTopic: named.length - topical.length,
    videos: ranked.slice(0, topN)
  };
}

async function searchHost(host) {
  const pool = await searchIndex(host.keywords, pagesN);
  const firstCut = pickTop(host, pool);
  const related = await expandRelated(firstCut.videos, (item) => matchesHost(host, item) && isDatingTopic(host, item));
  const picked = pickTop(host, [...pool, ...related]);
  console.log(
    `  pool ${dedupeVideos(pool).length} | related ${related.length} | named ${picked.namedCount} | dating ${picked.topicalCount} | drop ${picked.droppedOffTopic}`
  );
  return {
    host,
    ranking: "search click+pubdate, related expand, dating filter, sort by view",
    candidateCount: dedupeVideos(pool).length,
    relatedCount: related.length,
    namedCount: picked.namedCount,
    topicalCount: picked.topicalCount,
    droppedOffTopic: picked.droppedOffTopic,
    videos: markDuplicates(picked.videos).map((video, index) => ({ ...video, rank: index + 1 }))
  };
}

async function main() {
  const accounts = JSON.parse(await readFile(resolve(root, "accounts.json"), "utf8"));
  const selected = accounts.hosts.filter((host) => !hostFilter || host.id === hostFilter);
  if (!selected.length) throw new Error(`unknown --host=${hostFilter}`);

  const previous = await loadLatest(root);
  if (args.enrichOnly && !previous) throw new Error("没有 latest.json，不能 --enrich-only");

  const logPath = logPathFor(root);
  let working = previous
    ? { ...previous, collectedAt: new Date().toISOString(), topN }
    : { collectedAt: new Date().toISOString(), platform: "bilibili", ranking: "play", topN, hosts: [] };

  if (!args.enrichOnly) {
    const searched = [];
    for (const host of selected) {
      if (args.resume && previous?.hosts.some((entry) => entry.host.id === host.id && entry.videos?.length)) {
        console.log(`resume skip search: ${host.id}`);
        continue;
      }
      console.log(`collect top ${topN} by play: ${host.name}${host.coverage ? ` [${host.coverage}]` : ""}`);
      searched.push(await searchHost(host));
    }
    working = { ...working, ...mergeHosts(working, searched), collectedAt: new Date().toISOString(), topN };
    await saveLatest(root, working, { topN, copyStamp: false });
  }

  const targets = working.hosts.filter((entry) => selected.some((host) => host.id === entry.host.id));
  for (const entry of targets) {
    console.log(`enrich ${entry.host.id} (${entry.videos.length})`);
    const enriched = await enrichHostEntry(entry, {
      args,
      logPath,
      onProgress: async (videos) => {
        entry.videos = videos;
        await saveLatest(root, working, { topN, copyStamp: false });
      }
    });
    Object.assign(entry, enriched);
    await saveLatest(root, working, { topN, copyStamp: false });
  }

  const outPath = await saveLatest(root, working, { topN, copyStamp: true });
  console.log(`wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
