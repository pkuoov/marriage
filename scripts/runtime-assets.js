import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { AUDIO_CUES } from "../src/audioCatalog.js";

const SOURCE_EXTENSIONS = new Set([".html", ".js", ".css"]);

export function assetReferencesInText(source = "") {
  const references = new Set();
  const patterns = [
    /["']((?:\.\.\/|\.\/)?assets\/[^"']+)["']/g,
    /url\(\s*["']?((?:\.\.\/|\.\/)?assets\/[^"')]+)["']?\s*\)/g
  ];
  patterns.forEach((pattern) => {
    for (const match of String(source).matchAll(pattern)) {
      const normalized = normalizeAssetReference(match[1]);
      if (normalized) references.add(normalized);
    }
  });
  return [...references].sort();
}

export function normalizeAssetReference(value = "") {
  const withoutQuery = String(value).trim().split(/[?#]/, 1)[0].replaceAll("\\", "/");
  const assetIndex = withoutQuery.indexOf("assets/");
  if (assetIndex < 0) return "";
  const relative = withoutQuery.slice(assetIndex);
  if (!relative || relative.split("/").includes("..")) return "";
  return relative;
}

export async function copyRuntimeAssets({ root, targetRoot, sourceTexts = [], sourcePaths = [] } = {}) {
  const texts = [...sourceTexts, ...(await readSourceTexts(sourcePaths))];
  const references = new Set(texts.flatMap(assetReferencesInText));
  const optional = await plannedAssetReferences(root);
  const copied = [];
  const skippedPlanned = [];
  const missing = [];

  for (const reference of references) {
    const sourcePath = resolve(root, reference);
    const targetPath = resolve(targetRoot, reference);
    try {
      await mkdir(dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
      copied.push(reference);
    } catch (error) {
      if (error?.code === "ENOENT" && optional.has(reference)) skippedPlanned.push(reference);
      else if (error?.code === "ENOENT") missing.push(reference);
      else throw error;
    }
  }

  if (missing.length) {
    throw new Error(`Runtime asset references are missing:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  }
  return { copied, skippedPlanned };
}

async function readSourceTexts(paths = []) {
  const files = [];
  for (const path of paths) await collectSourceFiles(path, files);
  return Promise.all(files.map((path) => readFile(path, "utf8")));
}

async function collectSourceFiles(path, files) {
  const extension = extname(path);
  if (SOURCE_EXTENSIONS.has(extension)) {
    files.push(path);
    return;
  }
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOTDIR") return;
    throw error;
  }
  for (const entry of entries) {
    const child = resolve(path, entry.name);
    if (entry.isDirectory()) await collectSourceFiles(child, files);
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) files.push(child);
  }
}

async function plannedAssetReferences(root) {
  const planned = new Set(Object.values(AUDIO_CUES)
    .filter((cue) => cue?.status === "planned")
    .map((cue) => normalizeAssetReference(cue.src))
    .filter(Boolean));
  await collectPlannedJsonAssets(resolve(root, "content", "packs"), planned);
  return planned;
}

async function collectPlannedJsonAssets(path, planned) {
  const entries = await readdir(path, { withFileTypes: true });
  for (const entry of entries) {
    const child = resolve(path, entry.name);
    if (entry.isDirectory()) {
      await collectPlannedJsonAssets(child, planned);
      continue;
    }
    if (!entry.isFile() || extname(entry.name) !== ".json") continue;
    const parsed = JSON.parse(await readFile(child, "utf8"));
    walkPlannedObjects(parsed, planned);
  }
}

function walkPlannedObjects(value, planned) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value) && value.status === "planned") {
    [value.assetPath, value.src].map(normalizeAssetReference).filter(Boolean).forEach((path) => planned.add(path));
  }
  Object.values(value).forEach((child) => walkPlannedObjects(child, planned));
}
