import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const week = args.week ?? weekKey(new Date());
const configPath = resolve(root, args.config ?? "docs/daily-intelligence-creators.example.json");
const outPath = resolve(root, args.out ?? `.local/daily-intelligence/creator-manual-source-${week}.json`);

const config = JSON.parse(await readFile(configPath, "utf8"));
const sources = (config.sources ?? [])
  .filter((source) => ["creator-watch", "lawyer-topic"].includes(source.kind))
  .map((source) => ({
    label: `${source.label}：人工摘录`,
    type: "manual",
    kind: `${source.kind}-manual`,
    tags: source.tags ?? [],
    reviewHint: source.query ?? source.label,
    items: [
      emptyItem(source, 1),
      emptyItem(source, 2)
    ]
  }));

const payload = {
  notes: [
    "每周人工看重点账号/律师号后填写。",
    "只摘录新套路、新话术、新方法论，不复制原文，不写真实人物。",
    "未使用的 placeholder 可以删除；不要把待填写条目提交进正式素材。"
  ],
  week,
  sources
};

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Creator review template written: ${outPath}`);

function emptyItem(source, index) {
  return {
    title: `待填写 ${index}：${source.label} 的本周新套路/方法论`,
    url: "",
    publishedAt: "",
    snippet: "填写 40-100 字抽象摘要：冲突结构、关键话术、反制方式、容易被误读的点。必须补一个可戏剧化物件/原话，以及谁先推动说不清的灰区。"
  };
}

function weekKey(date) {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((day - yearStart) / 86400000) + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
