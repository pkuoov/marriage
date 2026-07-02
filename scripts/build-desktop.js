import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "dist", "desktop-electron");
const shellDir = resolve(root, "desktop", "electron");

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(resolve(root, "dist", "playable"), resolve(outDir, "playable"), { recursive: true });
await copyFile(resolve(shellDir, "main.cjs"), resolve(outDir, "main.cjs"));
await copyFile(resolve(shellDir, "preload.cjs"), resolve(outDir, "preload.cjs"));
await writeFile(resolve(outDir, "package.json"), `${JSON.stringify({
  name: "livestream-detective-desktop-shell",
  private: true,
  main: "main.cjs"
}, null, 2)}\n`);

console.log(`Desktop shell build ready: ${outDir}`);
