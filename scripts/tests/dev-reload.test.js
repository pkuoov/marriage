import test from "node:test";
import assert from "node:assert/strict";
import { shouldReloadForChange } from "../lib/dev-reload.js";

test("人工试玩反馈与审稿产物不触发页面重载", () => {
  for (const filename of [
    "docs/unfinished-backlog.md", "docs/generated/narrative-flow-report.md",
    "docs/generated/review.json", "project-skills/case-scriptwriting/SKILL.md",
    "characters/quick1-caller-luo.md", "chapters/chapter-01.md", "story.md",
    "scripts/verify-logic.js", "output/replay.png", "dist/playable/src/app.js",
    "assets/audio/review/bgm-review.html", "content/editor/notes.md"
  ]) assert.equal(shouldReloadForChange(filename), false, filename);
});

test("页面及实际游戏资源修改仍可自动刷新", () => {
  for (const filename of [
    "index.html", "src/app.js", "src/styles.css", "src/runtime/recapModel.js",
    "src/generated/contentPackIndex.js", "content/packs/steam-demo-01/cases/01-credit.json",
    "assets/audio/pursuit.ogg", "assets/generated/backgrounds/studio.webp",
    "assets/fonts/pixel.woff2", "src\\runtime\\recapModel.js"
  ]) assert.equal(shouldReloadForChange(filename), true, filename);
});

test("临时文件、依赖及不完整的目录事件不刷新", () => {
  for (const filename of [
    undefined, null, "", "src", "assets", "content", "src/.app.js",
    "src/app.js~", "src/app.js.swp", "src/node_modules/tool.js",
    ".git/index", "assets/.DS_Store", "../src/app.js", "/src/app.js"
  ]) assert.equal(shouldReloadForChange(filename), false, String(filename));
});
