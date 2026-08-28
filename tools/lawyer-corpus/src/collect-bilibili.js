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
const args = parseCorpusArgs(process.argv, { topN: 30, pagesN: 6 });
const topN = args.topN;
const pagesN = args.pagesN;
const hostFilter = args.hostFilter;

function textOf(item) {
  return `${item.author ?? ""} ${item.title ?? ""}`;
}

function matchesHost(host, item) {
  const author = item.author ?? "";
  const title = item.title ?? "";
  const blob = textOf(item);
  const preferred = (host.preferAuthors ?? []).some((name) => author.includes(name));
  const phrased = (host.mustPhraseAny ?? []).some((token) => blob.includes(token));
  if ((host.mustPhraseAny ?? []).length && !phrased && !preferred) return false;
  const excluded = (host.excludeTitleAny ?? []).some((token) => title.includes(token));
  if (excluded && !preferred) return false;
  if (preferred) return true;
  return phrased;
}

function preferScore(host, item) {
  const author = item.author ?? "";
  if ((host.preferAuthors ?? []).some((name) => author.includes(name))) return 2;
  if ((host.mustPhraseAny ?? []).some((token) => author.includes(token))) return 1;
  return 0;
}

function pickTop(host, items) {
  return dedupeVideos(items)
    .filter((item) => matchesHost(host, item))
    .sort((left, right) => {
      const playGap = playCount(right) - playCount(left);
      if (playGap) return playGap;
      return preferScore(host, right) - preferScore(host, left);
    })
    .slice(0, topN);
}

async function searchHost(host) {
  const pool = await searchIndex(host.keywords, pagesN);
  const firstCut = pickTop(host, pool);
  const related = await expandRelated(firstCut, (item) => matchesHost(host, item));
  const ranked = markDuplicates(pickTop(host, [...pool, ...related]));
  console.log(`  pool ${dedupeVideos(pool).length} | related ${related.length} | named ${ranked.length}`);
  return {
    host,
    ranking: "search click+pubdate, related expand, sort by view; no topic filter",
    candidateCount: dedupeVideos(pool).length,
    relatedCount: related.length,
    videos: ranked.map((video, index) => ({ ...video, rank: index + 1 }))
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
