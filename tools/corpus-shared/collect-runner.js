import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { enrichExistingVideo, pickDialogueSeeds } from "./bili-enrich.js";

export function parseCorpusArgs(argv, defaults = {}) {
  const find = (name) => argv.find((arg) => arg.startsWith(`${name}=`))?.split("=")[1];
  return {
    topN: Number(find("--top") ?? defaults.topN ?? 20),
    pagesN: Number(find("--pages") ?? defaults.pagesN ?? 6),
    hostFilter: find("--host"),
    resume: argv.includes("--resume"),
    enrichOnly: argv.includes("--enrich-only"),
    force: argv.includes("--force"),
    missingCid: argv.includes("--missing-cid"),
    maxVideos: Number(find("--max-videos") ?? 0),
    dialogueLimit: Number(find("--dialogue-limit") ?? 10)
  };
}

export function stamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

export async function loadLatest(root) {
  try {
    return JSON.parse(await readFile(resolve(root, "data/raw/latest.json"), "utf8"));
  } catch {
    return null;
  }
}

export async function saveLatest(root, data, { topN, copyStamp = true } = {}) {
  const outDir = resolve(root, "data/raw");
  await mkdir(outDir, { recursive: true });
  const latestPath = resolve(outDir, "latest.json");
  await writeFile(latestPath, `${JSON.stringify(data, null, 2)}\n`);
  if (copyStamp) {
    const outPath = resolve(outDir, `${stamp()}-bilibili-top${topN ?? data.topN ?? 20}.json`);
    await writeFile(outPath, `${JSON.stringify(data, null, 2)}\n`);
    return outPath;
  }
  return latestPath;
}

export function mergeHosts(previous, nextHosts) {
  if (!previous) {
    return { hosts: nextHosts };
  }
  const map = new Map(nextHosts.map((entry) => [entry.host.id, entry]));
  const hosts = previous.hosts.map((entry) => map.get(entry.host.id) ?? entry);
  for (const entry of nextHosts) {
    if (!hosts.some((item) => item.host.id === entry.host.id)) hosts.push(entry);
  }
  return { ...previous, hosts };
}

function shouldSkipVideo(video, { resume, force, missingCid }) {
  if (missingCid) {
    return Boolean(video.view?.cid) || ["available", "empty"].includes(video.danmakuMeta?.status);
  }
  if (force) return false;
  if (!resume) return false;
  return Boolean(video.enrich?.complete);
}

export async function enrichHostEntry(entry, { args, logPath, onProgress }) {
  const videos = entry.videos || [];
  const seeds = new Set(
    pickDialogueSeeds(videos, args.dialogueLimit).map((video) => video.bvid || video.view?.bvid)
  );
  let processed = 0;
  const nextVideos = [];
  for (const video of videos) {
    if (args.maxVideos && processed >= args.maxVideos) {
      nextVideos.push(video);
      continue;
    }
    if (shouldSkipVideo(video, args)) {
      nextVideos.push(video);
      continue;
    }
    const enriched = await enrichExistingVideo(video, entry.host, { logPath, fetchSubtitle: true });
    nextVideos.push(enriched);
    processed += 1;
    const line = `  ${entry.host.id} #${enriched.rank ?? processed} dm=${enriched.danmakuMeta?.status} sub=${enriched.subtitleMeta?.status} cmt=${enriched.commentBundle?.status}`;
    console.log(line);
    if (onProgress) await onProgress([...nextVideos, ...videos.slice(nextVideos.length)]);
  }
  return { ...entry, videos: nextVideos, dialogueSeedCount: seeds.size };
}

export function logPathFor(root) {
  return resolve(root, "data/raw/request-log.jsonl");
}
