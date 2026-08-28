import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeSpeechReports } from "../../corpus-shared/analyze-pool.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = resolve(root, process.argv[2] ?? "data/raw/latest.json");

async function main() {
  const raw = JSON.parse(await readFile(inputPath, "utf8"));
  const accounts = JSON.parse(await readFile(resolve(root, "accounts.json"), "utf8"));
  const built = await writeSpeechReports(resolve(root, "out"), raw, {
    domain: "matchmaker",
    corpus: "mm",
    accounts
  });
  console.log(
    `analyzed ${built.totals.videos} videos / ${built.totals.turns} turns / ${built.totals.danmaku} danmaku -> out/`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
