import { readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const IMPORT_PATTERN = /^[ \t]*@import[ \t]+(?:url\([ \t]*)?["']([^"']+)["'][ \t]*\)?[ \t]*;[ \t]*(?:\r?\n|$)/gm;
const URL_PATTERN = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;

export function bundleCssSync(entryPath) {
  const entry = normalizePath(entryPath);
  return bundleFile(entry, dirname(entry), []);
}

function bundleFile(filePath, outputDirectory, stack) {
  const resolved = resolve(filePath);
  if (stack.includes(resolved)) {
    const chain = [...stack, resolved].map((path) => relative(process.cwd(), path)).join(" -> ");
    throw new Error(`Circular CSS import: ${chain}`);
  }

  const source = readFileSync(resolved, "utf8");
  const nextStack = [...stack, resolved];
  let cursor = 0;
  let bundled = "";

  for (const match of source.matchAll(IMPORT_PATTERN)) {
    bundled += rebaseUrls(source.slice(cursor, match.index), dirname(resolved), outputDirectory);
    const specifier = match[1].split(/[?#]/, 1)[0];
    if (!specifier.startsWith(".")) {
      throw new Error(`Only local CSS imports can be bundled: ${match[1]} in ${resolved}`);
    }
    bundled += bundleFile(resolve(dirname(resolved), specifier), outputDirectory, nextStack);
    cursor = match.index + match[0].length;
  }

  bundled += rebaseUrls(source.slice(cursor), dirname(resolved), outputDirectory);
  return bundled;
}

function rebaseUrls(source, sourceDirectory, outputDirectory) {
  if (sourceDirectory === outputDirectory) return source;
  return source.replace(URL_PATTERN, (full, quote, value) => {
    const specifier = String(value).trim();
    if (!specifier.startsWith(".") || specifier.startsWith("//")) return full;
    const suffixIndex = specifier.search(/[?#]/);
    const pathPart = suffixIndex < 0 ? specifier : specifier.slice(0, suffixIndex);
    const suffix = suffixIndex < 0 ? "" : specifier.slice(suffixIndex);
    let rebased = relative(outputDirectory, resolve(sourceDirectory, pathPart)).split(sep).join("/");
    if (!rebased.startsWith(".")) rebased = `./${rebased}`;
    return `url(${quote}${rebased}${suffix}${quote})`;
  });
}

function normalizePath(value) {
  return value instanceof URL ? fileURLToPath(value) : resolve(value);
}
