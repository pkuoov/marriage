import { copyFile, cp, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPlayable } from "./build-playable.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "dist", "desktop-electron");
const tempRoot = resolve(root, "dist", ".desktop-electron-");
const lockDir = resolve(root, "dist", ".desktop-build.lock");
const shellDir = resolve(root, "desktop", "electron");

await mkdir(resolve(root, "dist"), { recursive: true });
await withBuildLock(async () => {
  await buildPlayable();
  const tempDir = await mkdtemp(tempRoot);

  try {
    await cp(resolve(root, "dist", "playable"), resolve(tempDir, "playable"), { recursive: true });
    await copyFile(resolve(shellDir, "main.cjs"), resolve(tempDir, "main.cjs"));
    await copyFile(resolve(shellDir, "preload.cjs"), resolve(tempDir, "preload.cjs"));
    await writeFile(resolve(tempDir, "package.json"), `${JSON.stringify({
      name: "livestream-detective-demo",
      version: "0.1.0",
      productName: "Livestream Detective Demo",
      private: true,
      main: "main.cjs",
      scripts: {
        start: "electron ."
      }
    }, null, 2)}\n`);

    await rm(outDir, { recursive: true, force: true });
    await rename(tempDir, outDir);
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }
});

console.log(`Desktop shell build ready: ${outDir}`);

async function withBuildLock(task) {
  const startedAt = Date.now();
  while (true) {
    try {
      await mkdir(lockDir);
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (Date.now() - startedAt > 30000) {
        throw new Error(`Timed out waiting for desktop build lock: ${lockDir}`);
      }
      await new Promise((resolveWait) => setTimeout(resolveWait, 120));
    }
  }
  try {
    await task();
  } finally {
    await rm(lockDir, { recursive: true, force: true });
  }
}
