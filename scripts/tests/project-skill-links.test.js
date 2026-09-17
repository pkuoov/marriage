import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const skillRoot = resolve(root, "project-skills");
const direction = resolve(skillRoot, "case-scriptwriting/references/current-project-direction.md");
const filesUnder = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? filesUnder(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
const links = source => [...source.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map(match => match[1]);

test("项目技能引用可读取，不因重整入口而留下断链", () => {
  for (const file of filesUnder(skillRoot).filter(file => file.endsWith(".md"))) {
    const source = readFileSync(file, "utf8");
    for (const href of links(source)) {
      if (/^(?:https?:|#)/.test(href)) continue;
      const target = resolve(dirname(file), decodeURIComponent(href.split("#")[0]));
      assert.ok(existsSync(target), `${file}: missing ${href}`);
    }
  }
});

test("每个项目技能能找到同一份现行约定，正文格式有效", () => {
  for (const entry of readdirSync(skillRoot, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const file = resolve(skillRoot, entry.name, "SKILL.md");
    const source = readFileSync(file, "utf8");
    assert.match(source, /^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/);
    assert.ok(links(source).some(href => resolve(dirname(file), href.split("#")[0]) === direction), file);
  }
});
