import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const runContentBuilder = promisify(execFile);

// Every executable entry point calls this, including direct Node/Electron builds.
export async function ensureContentIndex(root) {
  await runContentBuilder(process.execPath, [resolve(root, "scripts/build-content-index.js")], { cwd: root });
}
