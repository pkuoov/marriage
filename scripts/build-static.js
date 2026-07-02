import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await mkdir(dist, { recursive: true });
await cleanStaticBuildTargets();

await cp(resolve(root, "index.html"), resolve(dist, "index.html"));
await cp(resolve(root, "src"), resolve(dist, "src"), { recursive: true });
await cp(resolve(root, "assets"), resolve(dist, "assets"), { recursive: true });
await cp(resolve(root, "content"), resolve(dist, "content"), { recursive: true });

console.log(`Static H5 build ready: ${dist}`);

async function cleanStaticBuildTargets() {
  const targets = ["index.html", "src", "assets", "content"];
  await Promise.all(targets.map((target) => rm(resolve(dist, target), { recursive: true, force: true })));
}
