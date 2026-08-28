import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "steam-demo-01";
const checkOnly = process.argv.includes("--check");
const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const mainCases = await Promise.all(manifest.sequence.map(async (entry) => ({
  kind: "主案",
  label: entry.caseId,
  packet: await readJson(`content/packs/${packId}/cases/${entry.caseId}.json`)
})));
const quickCases = await Promise.all((manifest.quickCases ?? []).map(async (id) => ({
  kind: "快案",
  label: id,
  packet: await readJson(`content/packs/${packId}/quick-cases/${id}.json`)
})));
const prologueEntry = manifest.nightShell?.cafePrologue?.rageBaitContract
  ? [{
      kind: "试玩序章",
      label: manifest.nightShell.cafePrologue.id,
      packet: manifest.nightShell.cafePrologue
    }]
  : [];
const entries = [...prologueEntry, ...mainCases, ...quickCases];

if (entries.length !== 8) throw new Error(`${packId} 债务表必须覆盖咖啡厅序章、四主案与三快案，实际 ${entries.length}`);
for (const { label, packet } of entries) validateContract(label, packet.rageBaitContract);

const outputPath = resolve(root, "docs", `${packId}-rage-debt-ledger.md`);
const output = renderReport(entries);
if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== output) throw new Error(`rage debt report is stale; run node scripts/build-rage-debt-report.js ${packId}`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(`Rage debt ledger ready: ${outputPath}`);
}

function validateContract(label, contract = {}) {
  if (!Array.isArray(contract.tierPlan) || !contract.tierPlan.length) throw new Error(`${label} 缺少 tierPlan`);
  if (!Array.isArray(contract.debts) || !contract.debts.length) throw new Error(`${label} 至少登记一笔发债`);
  for (const debt of contract.debts) {
    if (!debt.id || !debt.tier) throw new Error(`${label} 债务缺少 id 或 tier`);
    if (!debt.issue?.location || !debt.issue?.quote) throw new Error(`${label}/${debt.id} 缺少发债位置或原句`);
    if (!debt.interest?.location || !debt.interest?.payoff || !debt.interest?.holdingLimit) throw new Error(`${label}/${debt.id} 缺少付息位置、内容或持债上限`);
    if (!debt.principal?.location || debt.principal?.trigger !== "player-input" || !debt.principal?.payoff) throw new Error(`${label}/${debt.id} 本金结清必须由玩家输入触发`);
    if (!debt.nextDebt?.location || !debt.nextDebt?.quote) throw new Error(`${label}/${debt.id} 缺少下一笔债的挂钩`);
  }
}

function renderReport(entries) {
  const lines = [
    "# steam-demo-01 拱火债务表",
    "",
    "> 本表由咖啡厅序章、四主案和三快案的 JSON 真源自动生成。发债是让玩家生气或产生确定预判的原句；付息是同场或同段的小反转；本金是玩家亲手触发的决定性指认、对质或判词；挂钩只发行下一笔债，不提前替未知事实下结论。",
    ""
  ];
  for (const { kind, label, packet } of entries) {
    const contract = packet.rageBaitContract;
    const title = packet.caseTitle?.title ?? packet.title ?? packet.storyArcTitle ?? label;
    lines.push(`## ${kind}｜${label}｜${title}`, "");
    lines.push(`- 投放层级：${contract.tierPlan.join(" → ")}`);
    if (contract.activeProvocationSceneId) lines.push(`- 主动复读：${contract.activeProvocationSceneId}`);
    if ((contract.tier4Assets ?? []).length) {
      for (const asset of contract.tier4Assets) {
        lines.push(`- Tier 4 资产：${asset.label}（第 ${asset.availableAfterCaseNumber} 案结束后可投放）——预判“${asset.playerPrediction}”；反转“${asset.reversal}”`);
      }
    } else {
      lines.push("- Tier 4 资产：无");
    }
    lines.push("", "| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |", "|---|---|---|---|---|---|---|");
    for (const debt of contract.debts) {
      lines.push(`| ${cell(debt.id)} | ${cell(debt.tier)} | ${cell(`${debt.issue.location}：“${debt.issue.quote}”`)} | ${cell(`${debt.interest.location}（${debt.interest.trigger}）：${debt.interest.payoff}`)} | ${cell(debt.interest.holdingLimit)} | ${cell(`${debt.principal.location}（${debt.principal.trigger}）：${debt.principal.payoff}`)} | ${cell(`${debt.nextDebt.location}：“${debt.nextDebt.quote}”`)} |`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}
