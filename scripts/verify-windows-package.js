import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "dist", "steam");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const expectedName = `LivestreamDetectiveDemo-${packageJson.version}-x64.exe`;
const entries = await readdir(outputDir, { withFileTypes: true });
const executables = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".exe"));

assert(executables.length === 1, `Expected exactly one Windows executable in ${outputDir}; found ${executables.length}.`);
assert(executables[0].name === expectedName, `Expected ${expectedName}; found ${executables[0].name}.`);

const artifactPath = resolve(outputDir, expectedName);
const info = await stat(artifactPath);
assert(info.size >= 20 * 1024 * 1024, `Windows executable is suspiciously small: ${info.size} bytes.`);

const header = Buffer.alloc(2);
const stream = createReadStream(artifactPath, { start: 0, end: 1 });
let offset = 0;
for await (const chunk of stream) {
  chunk.copy(header, offset);
  offset += chunk.length;
}
assert(header.toString("ascii") === "MZ", "Windows executable does not have an MZ/PE header.");

const sha256 = await fileSha256(artifactPath);
const checksumName = `${expectedName}.sha256`;
const report = {
  artifact: expectedName,
  bytes: info.size,
  sha256,
  verifiedAt: new Date().toISOString(),
  verificationHost: { platform: process.platform, arch: process.arch, node: process.versions.node }
};

await writeFile(resolve(outputDir, checksumName), `${sha256}  ${expectedName}\n`);
await writeFile(resolve(outputDir, "windows-package-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Windows package verified: ${expectedName} (${info.size} bytes, sha256 ${sha256})`);

async function fileSha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
