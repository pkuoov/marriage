import { execFile } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { copyRuntimeAssets } from "./runtime-assets.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const execFileAsync = promisify(execFile);

await mkdir(dist, { recursive: true });
await cleanStaticBuildTargets();

await cp(resolve(root, "index.html"), resolve(dist, "index.html"));
await cp(resolve(root, "src"), resolve(dist, "src"), { recursive: true });

const cacheToken = await resolveCacheToken();
await stampStaticReferences(cacheToken);
const assets = await copyRuntimeAssets({
  root,
  targetRoot: dist,
  sourcePaths: [resolve(dist, "index.html"), resolve(dist, "src")]
});

console.log(`Static H5 build ready: ${dist} (cache token: ${cacheToken}, ${assets.copied.length} assets, ${assets.skippedPlanned.length} planned placeholders)`);

async function cleanStaticBuildTargets() {
  const targets = ["index.html", "src", "assets", "content"];
  await Promise.all(targets.map((target) => rm(resolve(dist, target), { recursive: true, force: true })));
}

async function resolveCacheToken() {
  const explicit = sanitizeToken(process.env.BUILD_ID);
  if (explicit) return explicit;
  const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const version = sanitizeToken(packageJson.version) || "0";
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--short", "HEAD"], { cwd: root });
    const hash = sanitizeToken(stdout.trim());
    if (hash) return `${version}-${hash}`;
  } catch {
    // Source archives may not include .git; a timestamp still invalidates stale static assets.
  }
  return `${version}-${Date.now().toString(36)}`;
}

function sanitizeToken(value = "") {
  return String(value).trim().replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function stampStaticReferences(token) {
  const indexPath = resolve(dist, "index.html");
  const indexSource = await readFile(indexPath, "utf8");
  await writeFile(indexPath, stampHtmlReferences(indexSource, token));
  await stampSourceTree(resolve(dist, "src"), token);
}

async function stampSourceTree(directory, token) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return stampSourceTree(path, token);
    if (!entry.isFile() || (!entry.name.endsWith(".js") && !entry.name.endsWith(".css"))) return undefined;
    const source = await readFile(path, "utf8");
    const stamped = entry.name.endsWith(".js")
      ? stampJavaScriptReferences(source, token)
      : stampCssReferences(source, token);
    if (stamped !== source) await writeFile(path, stamped);
    return undefined;
  }));
}

function stampHtmlReferences(source, token) {
  return source.replace(/(\b(?:href|src)=["'])(\.[^"'?#]+)(["'])/g, (_, before, specifier, after) => (
    `${before}${withCacheToken(specifier, token)}${after}`
  ));
}

function stampJavaScriptReferences(source, token) {
  return source
    .replace(/(\bfrom\s+["'])(\.[^"'?#]+)(["'])/g, (_, before, specifier, after) => (
      `${before}${withCacheToken(specifier, token)}${after}`
    ))
    .replace(/(^\s*import\s+["'])(\.[^"'?#]+)(["'])/gm, (_, before, specifier, after) => (
      `${before}${withCacheToken(specifier, token)}${after}`
    ))
    .replace(/(["'])(\.{1,2}\/assets\/[^"'?#]+)(["'])/g, (_, before, specifier, after) => (
      `${before}${withCacheToken(specifier, token)}${after}`
    ));
}

function stampCssReferences(source, token) {
  return source
    .replace(/(@import\s+(?:url\(\s*)?["'])(\.{1,2}\/[^"'?#)]+)(["']\s*\)?\s*;)/g, (_, before, specifier, after) => (
      `${before}${withCacheToken(specifier, token)}${after}`
    ))
    .replace(/(url\(\s*["']?)(\.{1,2}\/[^"'?#)]+)(["']?\s*\))/g, (_, before, specifier, after) => (
      `${before}${withCacheToken(specifier, token)}${after}`
    ));
}

function withCacheToken(specifier, token) {
  return `${specifier}?v=${token}`;
}
