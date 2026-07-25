import { copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "dist", "playable");
const tempRoot = resolve(root, "dist", ".playable-");
const entry = resolve(root, "src", "app.js");

export async function buildPlayable() {
  await mkdir(resolve(root, "dist"), { recursive: true });
  const tempDir = await mkdtemp(tempRoot);
  try {
    await copyTree(resolve(root, "assets"), resolve(tempDir, "assets"));
    await copyTree(resolve(root, "content"), resolve(tempDir, "content"));

    const bundle = await bundleModule(entry);
    const css = await readFile(resolve(root, "src", "styles.css"), "utf8");
    const playableCss = css.replaceAll("../assets/", "./assets/");
    const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="深夜热线：直播间侦探是一款现实直播间推理游戏，玩家通过匿名来电、截图和原话追问事实边界。" />
    <meta name="theme-color" content="#120f12" />
    <title>深夜热线：直播间侦探</title>
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
    await writeFile(resolve(tempDir, "index.html"), html);
    await rm(outDir, { recursive: true, force: true });
    await rename(tempDir, outDir);
    console.log(`Playable offline build ready: ${outDir}`);
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
  await buildPlayable();
}

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
    .replace(/^\s*import\s+\{([^}]+)\}\s+from\s+["'][^"']+["'];?\s*$/gm, (_, imports) => importAliasDeclarations(imports))
    .replace(/^\s*import\s+[^"']+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ")
    .replace(/^\s*export\s*\{[^}]+\};?\s*$/gm, "");
}

function importAliasDeclarations(imports) {
  return imports
    .split(",")
    .map((item) => item.trim())
    .map((item) => item.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/))
    .filter(Boolean)
    .map((match) => `const ${match[2]} = ${match[1]};`)
    .join("\n");
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

async function copyTree(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const source = resolve(sourceDir, entry.name);
    const target = resolve(targetDir, entry.name);
    if (entry.isDirectory()) {
      await copyTree(source, target);
      continue;
    }
    if (entry.isFile()) {
      await copyFile(source, target);
    }
  }
}
