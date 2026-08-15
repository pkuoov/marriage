import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = process.argv[2] || resolve(root, "dist", "steam", "windows-runtime-smoke.json");
const report = JSON.parse(await readFile(reportPath, "utf8"));

assert(report.platform === "win32", `Runtime smoke must execute on win32; found ${report.platform}.`);
assert(report.arch === "x64", `Runtime smoke must execute the x64 package; found ${report.arch}.`);
assert(report.offlineResolverBlocked === true, "Runtime smoke must block external host resolution.");
assert(!report.error, `Packaged runtime reported an error: ${report.error}`);
assert(report.renderer?.protocol === "file:", `Packaged runtime must load from file:, found ${report.renderer?.protocol}.`);
assert(report.renderer?.startButton === true, "Packaged runtime did not expose a playable title action.");
assert(report.renderer?.desktopBridge === true, "Packaged runtime did not expose the desktop save bridge.");
assert(report.saveBridge?.roundTrip === true, "Packaged save bridge failed write/read round-trip.");
assert(report.saveBridge?.listed === true, "Packaged save bridge did not list a file-backed slot.");
assert(report.saveBridge?.exported === true, "Packaged save bridge failed cloud export preparation.");
assert(report.saveBridge?.removed === true, "Packaged save bridge failed cleanup.");

console.log(`Windows runtime smoke verified: Electron ${report.electron}, offline title load and file-save round-trip passed.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
