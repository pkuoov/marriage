import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const desktopDir = resolve(root, "dist", "desktop-electron");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredFiles = [
  "main.cjs",
  "preload.cjs",
  "package.json",
  "playable/index.html"
];

for (const file of requiredFiles) {
  assert(await exists(resolve(desktopDir, file)), `Desktop smoke missing ${file}`);
}

const packageJson = JSON.parse(await readFile(resolve(desktopDir, "package.json"), "utf8"));
const indexHtml = await readFile(resolve(desktopDir, "playable", "index.html"), "utf8");
const mainSource = await readFile(resolve(desktopDir, "main.cjs"), "utf8");
const preloadSource = await readFile(resolve(desktopDir, "preload.cjs"), "utf8");

assert(packageJson.main === "main.cjs", "Desktop package main must point to Electron main.cjs");
assert(packageJson.scripts?.start === "electron .", "Desktop package must expose an Electron start script");
assert(mainSource.includes("loadFile"), "Electron main must load the offline playable file");
assert(preloadSource.includes("livestreamDetectiveDesktop"), "Preload must expose the desktop bridge");
assert(!/localhost|127\.0\.0\.1|http\.server/i.test(`${indexHtml}\n${mainSource}`), "Desktop smoke found dev-server dependency");

console.log(`Desktop smoke passed: ${desktopDir}`);
