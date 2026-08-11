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
assert(mainSource.includes("desktop-settings.json"), "Electron main must persist desktop window settings");
assert(mainSource.includes("before-input-event"), "Electron main must register fullscreen and zoom shortcuts");
assert(mainSource.includes("setFullScreen"), "Electron main must support fullscreen toggling");
assert(mainSource.includes("setZoomFactor"), "Electron main must support zoom factor changes");
assert(mainSource.includes("crash-logs"), "Electron main must write crash logs under userData");
assert(mainSource.includes("render-process-gone"), "Electron main must capture renderer crashes");
assert(mainSource.includes("requestSingleInstanceLock"), "Electron main must keep a single desktop instance");
assert(mainSource.includes("--release-smoke-report="), "Electron main must expose the hidden Windows release smoke entry");
assert(mainSource.includes("offlineResolverBlocked"), "Windows release smoke must block external host resolution");
assert(mainSource.includes("portable-save-roundtrip"), "Windows release smoke must exercise the real file-save bridge");
assert(mainSource.includes("[data-start-story], [data-continue-story], [data-request-new-game]"), "Windows release smoke must accept fresh and resumable title states");
assert(preloadSource.includes("livestreamDetectiveDesktop"), "Preload must expose the desktop bridge");
assert(!/localhost|127\.0\.0\.1|http\.server/i.test(`${indexHtml}\n${mainSource}`), "Desktop smoke found dev-server dependency");

console.log(`Desktop smoke passed: ${desktopDir}`);
