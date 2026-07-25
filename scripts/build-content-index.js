import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RUNTIME_CASE_CONTENT_FIELDS, RUNTIME_CASE_CONTENT_STATUS, RUNTIME_CASE_REQUIRED_FIELDS, runtimeCaseContentSummary } from "../src/runtime/contentCase.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packsDir = resolve(root, "content", "packs");
const advisorsPath = resolve(root, "content", "characters", "advisors.json");
const helperNpcsPath = resolve(root, "content", "characters", "helper-npcs.json");
const castPath = resolve(root, "content", "characters", "cast.json");
const outputPath = resolve(root, "src", "generated", "contentPackIndex.js");
const checkOnly = process.argv.includes("--check");

const { contentPacks, contentCases } = await loadContentPacks();
const contentAdvisors = await loadAdvisors();
const contentHelperNpcs = await loadHelperNpcs();
const contentCast = await loadCast();
for (const pack of Object.values(contentPacks)) {
  for (const item of pack.sequence ?? []) {
    assert(Array.isArray(item.castProfileIds) && item.castProfileIds.length >= 2, `${item.caseId} castProfileIds must list the case cast`);
    for (const profileId of item.castProfileIds) {
      assert(contentCast[profileId], `${item.caseId} references unknown cast profile ${profileId}`);
    }
  }
}
const source = stripManualCacheTokens(
  renderContentIndex(contentPacks, contentCases, contentAdvisors, contentHelperNpcs, contentCast)
);

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== source) {
    throw new Error("content pack runtime index is stale; run npm run content:index");
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, source);
  console.log(`Content pack runtime index ready: ${outputPath}`);
}

async function loadContentPacks() {
  const entries = await readdir(packsDir, { withFileTypes: true });
  const packIds = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const packs = {};
  const cases = {};
  for (const packId of packIds) {
    const manifest = await readJson(resolve(packsDir, packId, "manifest.json"));
    const comments = await readJson(resolve(packsDir, packId, "comments.json"));
    assert(manifest.id === packId, `${packId} manifest id must match folder name`);
    assert(comments.themeId === manifest.theme?.id, `${packId} comments themeId must match manifest theme`);
    packs[manifest.id] = {
      id: manifest.id,
      title: manifest.title,
      size: manifest.size,
      theme: manifest.theme,
      nightShell: manifest.nightShell,
      comments,
      caseLabels: manifest.caseLabels,
      sequence: manifest.sequence
    };
    cases[manifest.id] = {};
    for (const item of manifest.sequence ?? []) {
      const packet = await readJson(resolve(packsDir, packId, "cases", `${item.caseId}.json`));
      cases[manifest.id][item.caseId] = runtimeIndexCase(packet, item);
    }
  }
  return { contentPacks: packs, contentCases: cases };
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadAdvisors() {
  const registry = await readJson(advisorsPath).catch(() => ({ advisors: [] }));
  const advisors = {};
  for (const advisor of registry.advisors ?? []) {
    assert(advisor.id, "advisor id is required");
    advisors[advisor.id] = advisor;
  }
  return advisors;
}

async function loadHelperNpcs() {
  const registry = await readJson(helperNpcsPath).catch(() => ({ helpers: [] }));
  const helpers = {};
  for (const helper of registry.helpers ?? []) {
    assert(helper.id, "helper NPC id is required");
    assert(helper.name, `${helper.id} helper NPC name is required`);
    helpers[helper.id] = helper;
  }
  return helpers;
}

async function loadCast() {
  const registry = await readJson(castPath).catch(() => ({ cast: [] }));
  const cast = {};
  for (const profile of registry.cast ?? []) {
    assert(profile.id, "cast profile id is required");
    assert(profile.name, `${profile.id} cast profile name is required`);
    assert(!cast[profile.id], `duplicate cast profile id: ${profile.id}`);
    cast[profile.id] = profile;
  }
  return cast;
}

function runtimeIndexCase(packet, manifestItem) {
  assert(packet.caseId === manifestItem.caseId, `${manifestItem.caseId} caseId must match manifest sequence`);
  assert(packet.plotId === manifestItem.plotId, `${manifestItem.caseId} plotId must match manifest sequence`);
  if (packet.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded) {
    for (const field of RUNTIME_CASE_REQUIRED_FIELDS) {
      assert(packet[field] !== undefined, `${packet.caseId} runtime-loaded content is missing ${field}`);
    }
    return RUNTIME_CASE_CONTENT_FIELDS.reduce((next, field) => {
      if (packet[field] !== undefined) next[field] = packet[field];
      return next;
    }, runtimeCaseContentSummary(packet));
  }
  assert(packet.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.metadataOnly, `${packet.caseId} must use a known runtimeContentStatus`);
  for (const field of RUNTIME_CASE_REQUIRED_FIELDS) {
    assert(packet[field] === undefined, `${packet.caseId} is metadata-only but includes runtime field ${field}`);
  }
  return runtimeCaseContentSummary(packet);
}

function renderContentIndex(packs, cases, advisors, helperNpcs, cast) {
  const defaultKey = packs["steam-demo-01"] ? "steam-demo-01" : Object.keys(packs)[0];
  assert(defaultKey, "at least one content pack manifest is required");
  return `// Generated by scripts/build-content-index.js. Do not edit by hand.
export const DEFAULT_CONTENT_PACK_KEY = ${JSON.stringify(defaultKey)};

export const CONTENT_ADVISORS = ${JSON.stringify(advisors, null, 2)};

export const CONTENT_HELPER_NPCS = ${JSON.stringify(helperNpcs, null, 2)};

export const CONTENT_CAST = ${JSON.stringify(cast, null, 2)};

export const CONTENT_PACKS = ${JSON.stringify(packs, null, 2)};

export const CONTENT_CASES = ${JSON.stringify(cases, null, 2)};
`;
}

function stripManualCacheTokens(source) {
  return source.replace(/\?v=\d+(?:\.\d+)+/g, "");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
