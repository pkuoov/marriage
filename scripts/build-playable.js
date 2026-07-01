import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "dist", "playable");
const entry = resolve(root, "src", "app.js");

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(resolve(root, "assets"), resolve(outDir, "assets"), {
  recursive: true,
  filter: (source) => basename(source) !== ".DS_Store"
});
await cp(resolve(root, "content"), resolve(outDir, "content"), {
  recursive: true,
  filter: (source) => basename(source) !== ".DS_Store"
});

const bundle = await bundleModule(entry);
const css = await readFile(resolve(root, "src", "styles.css"), "utf8");
const playableCss = css.replaceAll("../assets/", "./assets/");
const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="直播间大侦探是一款现实直播间推理游戏，玩家通过匿名来电、截图和原话追问事实边界。" />
    <meta name="theme-color" content="#120f12" />
    <title>直播间大侦探</title>
    <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml" />
    <style>
${playableCss}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
(() => {
"use strict";
${bundle}
})();
    </script>
  </body>
</html>
`;

assertPlayableHtml(html);
await writeFile(resolve(outDir, "index.html"), html);
console.log(`Playable offline build ready: ${outDir}`);

async function bundleModule(filePath, seen = new Set(), ordered = []) {
  const resolved = resolve(filePath);
  if (seen.has(resolved)) return "";
  seen.add(resolved);
  const source = await readFile(resolved, "utf8");
  const imports = [...source.matchAll(/^\s*import\s+[^"']+["']([^"']+)["'];?\s*$/gm)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith("."));
  for (const specifier of imports) {
    const child = resolve(dirname(resolved), specifier.split("?")[0]);
    await bundleModule(child, seen, ordered);
  }
  ordered.push({ filePath: resolved, source });
  if (resolved !== resolve(entry)) return "";
  return ordered.map(({ filePath: modulePath, source: moduleSource }) => {
    const relative = modulePath.replace(`${root}/`, "").replace(/^src\//, "");
    return `\n/* bundled: ${relative} */\n${stripModuleSyntax(moduleSource)}\n`;
  }).join("\n");
}

function stripModuleSyntax(source) {
  return source
    .replace(/^\s*import\s+[^"']+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ")
    .replace(/^\s*export\s*\{[^}]+\};?\s*$/gm, "");
}

function assertPlayableHtml(html) {
  if (/<script\s+type=["']module["']/i.test(html)) {
    throw new Error("Playable build must not depend on module loading.");
  }
  if (/from\s+["']\.\/|import\s+/.test(html)) {
    throw new Error("Playable build still contains local import syntax.");
  }
  if (/src\/app\.js|src\/styles\.css/.test(html)) {
    throw new Error("Playable build still references source files.");
  }
  const script = html.match(/<script>([\s\S]+)<\/script>/)?.[1] ?? "";
  new Function(script);
}
