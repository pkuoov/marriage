import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "steam-demo-01";
const checkOnly = process.argv.includes("--check");
const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const review = await readJson(`content/packs/${packId}/dialogue-adjacency-review.json`);
const packets = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
const MICRO_LOGIC_FIELDS = ["premiseAnchor", "sourceKind", "sourceProves", "sourceDoesNotProve", "answerAnchor", "answerAdds", "nextLegalQuestion"];
const MICRO_LOGIC_SOURCE_KINDS = new Set(["caller-statement", "quoted-message", "document-readout", "audio-playback", "host-calculation", "confirmed-followup"]);
const SPOKEN_NARRATOR_LEAK = /我看窗外[，,；; ]*他看酒|现在那两个字卡在这儿|一个把我写成.{0,18}手上怎么能|镜头(?:切|推|拉|给|对准)|画面(?:切|定格|推|拉)|特写(?:给|在|：)|旁白[：:]/;
const outputPath = resolve(root, "docs", "generated", `${packId}-dialogue-adjacency-report.md`);
const errors = [...validateReview(), ...validateMicroLogicContracts()];
if (errors.length) throw new Error(`dialogue adjacency review failed:\n${errors.join("\n")}`);
const output = renderReport();

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== output) throw new Error(`dialogue adjacency report is stale; run npm run content:adjacency-report -- ${packId}`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(`Dialogue adjacency report ready: ${outputPath}`);
}

function validateReview() {
  const findings = [];
  const packetsById = new Map(packets.map((packet) => [packet.caseId, packet]));
  const reviewedIds = review.reviewedCaseIds ?? [];
  for (const caseId of reviewedIds) {
    const packet = packetsById.get(caseId);
    const caseReview = review.cases?.[caseId];
    if (!packet) {
      findings.push(`${caseId}: reviewedCaseIds points to a missing case`);
      continue;
    }
    if (!caseReview) {
      findings.push(`${caseId}: review payload is missing`);
      continue;
    }
    validateCase(packet, caseReview, findings);
  }
  for (const caseId of Object.keys(review.cases ?? {})) {
    if (!reviewedIds.includes(caseId)) findings.push(`${caseId}: review payload exists but reviewedCaseIds does not include it`);
  }
  return findings;
}

function validateMicroLogicContracts() {
  const findings = [];
  for (const packet of packets) {
    for (const [sceneIndex, scene] of (packet.sceneVersions ?? []).entries()) {
      const invariant = sceneSetupText(scene);
      for (const [optionIndex, option] of (scene.questionOptions ?? []).entries()) {
        if (option.correct !== true) continue;
        const label = `${packet.caseId}.sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].logicContract`;
        const contract = option.logicContract;
        if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
          findings.push(`${label}: missing`);
          continue;
        }
        MICRO_LOGIC_FIELDS.forEach((field) => {
          if (typeof contract[field] !== "string" || contract[field].trim().length < 2) findings.push(`${label}.${field}: must contain concrete text`);
        });
        if (!MICRO_LOGIC_SOURCE_KINDS.has(contract.sourceKind)) findings.push(`${label}.sourceKind: unsupported value ${contract.sourceKind}`);
        if (contract.premiseAnchor && !invariant.includes(contract.premiseAnchor)) findings.push(`${label}.premiseAnchor: not found in fixed scene setup`);
        if (contract.answerAnchor && !String(option.answer ?? "").includes(contract.answerAnchor)) findings.push(`${label}.answerAnchor: not found in normal answer`);
        if (contract.sourceProves === contract.sourceDoesNotProve) findings.push(`${label}: proves and doesNotProve must be different scopes`);
      }
      const closerLines = loadBearingCloserLines(scene);
      const closure = scene.closureContract;
      const closureLabel = `${packet.caseId}.sceneVersions[${sceneIndex}].closureContract`;
      if (closerLines.length && !closure) findings.push(`${closureLabel}: missing for load-bearing sceneCloser`);
      if (!closerLines.length && closure) findings.push(`${closureLabel}: present on a non-load-bearing sceneCloser`);
      if (closure) {
        ["entryAnchor", "closerAnchor", "adds", "openEdge"].forEach((field) => {
          if (typeof closure[field] !== "string" || closure[field].trim().length < 2) findings.push(`${closureLabel}.${field}: must contain concrete text`);
        });
        if (closure.routeIndependent !== true) findings.push(`${closureLabel}.routeIndependent: must be true`);
        const closerText = closerLines.map((line) => line.text).join("\n");
        if (closure.closerAnchor && !closerText.includes(closure.closerAnchor)) findings.push(`${closureLabel}.closerAnchor: not found in fixed closer`);
        const available = `${cumulativeInvariantText(packet, sceneIndex)}\n${closerText}`;
        if (closure.entryAnchor && !available.includes(closure.entryAnchor)) findings.push(`${closureLabel}.entryAnchor: not found in invariant context or audible closer interruption`);
      }
    }
    narratorLeakEntries(packet).forEach((entry) => findings.push(`${packet.caseId}.${entry.path}: spoken narrator leak “${entry.text}”`));
  }
  return findings;
}

function validateCase(packet, caseReview, findings) {
  const opening = packet.openingDialogue ?? [];
  const openingAudit = caseReview.opening ?? [];
  if (openingAudit.length !== Math.max(0, opening.length - 1)) {
    findings.push(`${packet.caseId}.opening: expected ${Math.max(0, opening.length - 1)} adjacency rows, got ${openingAudit.length}`);
  }
  openingAudit.forEach((row, index) => {
    validateAnchor(row.fromAnchor, opening[index]?.text, `${packet.caseId}.opening[${index}].fromAnchor`, findings);
    validateAnchor(row.toAnchor, opening[index + 1]?.text, `${packet.caseId}.opening[${index}].toAnchor`, findings);
    validateRelation(row.relation, `${packet.caseId}.opening[${index}].relation`, findings);
  });

  let invariantContext = opening.map((line) => line.text ?? "").join("\n");
  for (const [sceneIndex, scene] of (packet.sceneVersions ?? []).entries()) {
    const label = `${packet.caseId}.sceneVersions[${sceneIndex}](${scene.id ?? "missing-id"})`;
    const sceneReview = caseReview.scenes?.[scene.id];
    if (!sceneReview) {
      findings.push(`${label}: adjacency review is missing`);
      continue;
    }
    const setupText = sceneSetupText(scene);
    validateAnchor(sceneReview.entry?.fromAnchor, invariantContext, `${label}.entry.fromAnchor`, findings);
    validateAnchor(sceneReview.entry?.toAnchor, setupText, `${label}.entry.toAnchor`, findings);
    validateRelation(sceneReview.entry?.relation, `${label}.entry.relation`, findings);
    if (!["continue", "resumed-thread", "interrupt"].includes(sceneReview.entry?.mode)) {
      findings.push(`${label}.entry.mode: expected continue, resumed-thread, or interrupt`);
    }

    const availableContext = `${invariantContext}\n${setupText}`;
    validateOptionGroup(scene.questionOptions ?? [], sceneReview.questionOptions ?? [], availableContext, `${label}.questionOptions`, findings);
    const freeOptions = (scene.casualQuestions ?? []).length ? scene.casualQuestions : scene.dialogueOptions ?? [];
    validateOptionGroup(freeOptions, sceneReview.freeQuestions ?? [], availableContext, `${label}.freeQuestions`, findings);

    const closerText = spokenLines(scene.sceneCloser?.lines).join("\n");
    if (closerText) {
      if (!sceneReview.closer) findings.push(`${label}.closer: route-independent closer review is missing`);
      else {
        validateAnchor(sceneReview.closer.anchor, closerText, `${label}.closer.anchor`, findings);
        validateRelation(sceneReview.closer.relation, `${label}.closer.relation`, findings);
        if (sceneReview.closer.routeIndependent !== true) findings.push(`${label}.closer.routeIndependent: must be true after checking every key answer path`);
      }
    } else if (sceneReview.closer) {
      findings.push(`${label}.closer: review exists but the scene has no closer`);
    }
    invariantContext += `\n${setupText}\n${closerText}`;
  }
  const unknownSceneIds = Object.keys(caseReview.scenes ?? {}).filter(
    (sceneId) => !(packet.sceneVersions ?? []).some((scene) => scene.id === sceneId)
  );
  unknownSceneIds.forEach((sceneId) => findings.push(`${packet.caseId}.${sceneId}: review points to a missing scene`));
}

function validateOptionGroup(options, audits, availableContext, label, findings) {
  if (audits.length !== options.length) findings.push(`${label}: expected ${options.length} rows, got ${audits.length}`);
  options.forEach((option, index) => {
    const audit = audits[index];
    if (!audit) return;
    const answerText = visibleAnswerText(option);
    validateAnchor(audit.contextAnchor, availableContext, `${label}[${index}].contextAnchor`, findings);
    validateAnchor(audit.questionAnchor, option.question, `${label}[${index}].questionAnchor`, findings);
    validateAnchor(audit.answerAnchor, answerText, `${label}[${index}].answerAnchor`, findings);
    if (option.guardedAnswer) validateAnchor(audit.guardedAnswerAnchor, option.guardedAnswer, `${label}[${index}].guardedAnswerAnchor`, findings);
    else if (audit.guardedAnswerAnchor) findings.push(`${label}[${index}].guardedAnswerAnchor: option has no guarded answer`);
    validateRelation(audit.relation, `${label}[${index}].relation`, findings);
  });
}

function validateAnchor(anchor, source, label, findings) {
  if (typeof anchor !== "string" || anchor.trim().length < 2) {
    findings.push(`${label}: anchor must contain at least two characters`);
    return;
  }
  if (!String(source ?? "").includes(anchor)) findings.push(`${label}: “${anchor}” is not present in its source text`);
}

function validateRelation(relation, label, findings) {
  const text = String(relation ?? "").trim();
  if (text.length < 10) findings.push(`${label}: explain the concrete cause-and-response link in at least ten characters`);
  if (/^(承接上文|回应问题|自然过渡|继续追问)[。.]?$/.test(text)) findings.push(`${label}: generic relation labels are not review evidence`);
}

function renderReport() {
  const lines = [];
  const reviewed = new Set(review.reviewedCaseIds ?? []);
  lines.push(`# 《${manifest.title}》逐话轮承接审查`, "");
  lines.push("> 本表从实际 JSON 字段生成。机器只能确认登记的抓词仍存在，不能据此证明语义因果已经成立。人工复审还必须检查：问题有没有新增尚未出现的前提、上一个问题是否得到回应、连续两句是否重复发问，以及回答第一拍是否正面作答。", "");
  lines.push("## 覆盖状态", "", "| 案件 | 状态 | 场数 |", "|---|---|---:|");
  for (const packet of packets) lines.push(`| ${cell(packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.caseId)} | ${reviewed.has(packet.caseId) ? "锚点合同已覆盖" : "待登记锚点合同"} | ${(packet.sceneVersions ?? []).length} |`);
  lines.push("");

  lines.push("## 四案微因果合同覆盖", "", "> 承重追问必须从本场固定台词取得前提，写清材料的证明边界、回答新增事实和下一问上限。第三方镜头或作者题眼不得留在人物台词中。", "");
  lines.push("| 案件 | 承重追问 | 追问合同 | 承重场尾 | 场尾合同 | 人物旁白高风险 |", "|---|---:|---:|---:|---:|---:|");
  for (const packet of packets) {
    const options = microLogicOptions(packet);
    const closers = loadBearingClosers(packet);
    lines.push(`| ${cell(packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.caseId)} | ${options.length} | ${options.filter((item) => item.option.logicContract).length} | ${closers.length} | ${closers.filter((item) => item.scene.closureContract).length} | ${narratorLeakEntries(packet).length} |`);
  }
  lines.push("");

  for (const packet of packets) {
    lines.push(`### 微因果合同｜${packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.caseId}`, "", "| 场景 | 承重追问 | 来源 | 固定前提 | 能证明 | 不能证明 | 回答新增 | 下一问上限 |", "|---|---|---|---|---|---|---|---|");
    for (const { scene, option } of microLogicOptions(packet)) {
      const contract = option.logicContract ?? {};
      lines.push(`| ${cell(scene.id)} | ${cell(option.question)} | ${cell(contract.sourceKind)} | ${cell(contract.premiseAnchor)} | ${cell(contract.sourceProves)} | ${cell(contract.sourceDoesNotProve)} | ${cell(contract.answerAdds)} | ${cell(contract.nextLegalQuestion)} |`);
    }
    lines.push("", "#### 场尾闭环", "", "| 场景 | 进入锚点 | 场尾锚点 | 新增／恢复 | 保留的未决问题 | 路线独立 |", "|---|---|---|---|---|---|");
    for (const { scene } of loadBearingClosers(packet)) {
      const contract = scene.closureContract ?? {};
      lines.push(`| ${cell(scene.id)} | ${cell(contract.entryAnchor)} | ${cell(contract.closerAnchor)} | ${cell(contract.adds)} | ${cell(contract.openEdge)} | ${contract.routeIndependent === true ? "是" : "否"} |`);
    }
    lines.push("");
  }

  for (const packet of packets) {
    if (!reviewed.has(packet.caseId)) continue;
    const caseReview = review.cases[packet.caseId];
    lines.push(`## ${packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.caseId}`, "", `复审日期：${caseReview.reviewedAt ?? "未登记"}`, "");
    lines.push("### 开场", "", "| 上一句 | 下一句 | 承接理由 |", "|---|---|---|");
    caseReview.opening.forEach((audit, index) => {
      lines.push(`| ${cell(packet.openingDialogue[index]?.text)} | ${cell(packet.openingDialogue[index + 1]?.text)} | ${cell(audit.relation)} |`);
    });
    lines.push("");

    for (const [sceneIndex, scene] of (packet.sceneVersions ?? []).entries()) {
      const sceneReview = caseReview.scenes[scene.id];
      const freeOptions = (scene.casualQuestions ?? []).length ? scene.casualQuestions : scene.dialogueOptions ?? [];
      lines.push(`### ${sceneIndex + 1}. ${scene.id}`, "");
      lines.push(`- 入场方式：${sceneReview.entry.mode}`);
      lines.push(`- 入场承接：${sceneReview.entry.fromAnchor} / ${sceneReview.entry.toAnchor}。${sceneReview.entry.relation}`);
      if (sceneReview.closer) lines.push(`- 场尾承接：${sceneReview.closer.relation}`);
      lines.push("", "| 类型 | 上文抓词 | 主播问题 | 咨询者回答 | 防备回答 | 逐句关系 |", "|---|---|---|---|---|---|");
      renderOptionRows(lines, "关键", scene.questionOptions ?? [], sceneReview.questionOptions ?? []);
      renderOptionRows(lines, "补问", freeOptions, sceneReview.freeQuestions ?? []);
      lines.push("");
    }
  }
  lines.push("## 人工语义复审状态", "");
  const pending = packets.filter((packet) => !reviewed.has(packet.caseId));
  if (!pending.length) lines.push("四案的锚点合同均已登记；这不等于语义已锁定。每次试玩发现跳跃后，仍须回看前后至少两个话轮并重新生成本表。", "");
  else pending.forEach((packet) => lines.push(`- ${packet.caseId}：${packet.caseTitle?.title ?? packet.storyArcTitle ?? "未命名"}`));
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function microLogicOptions(packet) {
  return (packet.sceneVersions ?? []).flatMap((scene) => (scene.questionOptions ?? [])
    .filter((option) => option.correct === true)
    .map((option) => ({ scene, option })));
}

function loadBearingCloserLines(scene = {}) {
  return (scene.sceneCloser?.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role) && line?.nonLoadBearing !== true && line?.text);
}

function loadBearingClosers(packet) {
  return (packet.sceneVersions ?? []).filter((scene) => loadBearingCloserLines(scene).length).map((scene) => ({ scene }));
}

function cumulativeInvariantText(packet, sceneIndex) {
  const chunks = (packet.openingDialogue ?? []).map((line) => line.text).filter(Boolean);
  (packet.sceneVersions ?? []).slice(0, sceneIndex + 1).forEach((scene, index) => {
    chunks.push(sceneSetupText(scene));
    if (index < sceneIndex) chunks.push(...(scene.sceneCloser?.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role)).map((line) => line.text));
  });
  return chunks.filter(Boolean).join("\n");
}

function narratorLeakEntries(packet) {
  const entries = [];
  const add = (path, text) => {
    if (typeof text === "string" && SPOKEN_NARRATOR_LEAK.test(text)) entries.push({ path, text });
  };
  (packet.openingDialogue ?? []).forEach((line, index) => add(`openingDialogue[${index}]`, line.text));
  (packet.sceneVersions ?? []).forEach((scene, sceneIndex) => {
    add(`sceneVersions[${sceneIndex}].entryQuestion`, scene.entryQuestion);
    add(`sceneVersions[${sceneIndex}].version`, scene.version);
    add(`sceneVersions[${sceneIndex}].revisedVersion`, scene.revisedVersion);
    for (const field of ["beforeVersion", "afterVersion", "sceneCloser"]) {
      (scene[field]?.lines ?? []).forEach((line, lineIndex) => {
        if (!["stage", "pause"].includes(line?.role)) add(`sceneVersions[${sceneIndex}].${field}.lines[${lineIndex}]`, line.text);
      });
    }
    for (const field of ["casualQuestions", "dialogueOptions", "questionOptions"]) {
      (scene[field] ?? []).forEach((option, optionIndex) => {
        add(`sceneVersions[${sceneIndex}].${field}[${optionIndex}].question`, option.question);
        add(`sceneVersions[${sceneIndex}].${field}[${optionIndex}].answer`, option.answer);
        add(`sceneVersions[${sceneIndex}].${field}[${optionIndex}].guardedAnswer`, option.guardedAnswer);
      });
    }
  });
  (packet.overnightStructure?.dayScenes ?? []).forEach((dayScene, sceneIndex) => {
    (dayScene.body?.beats ?? []).forEach((beat, beatIndex) => add(`overnightStructure.dayScenes[${sceneIndex}].body.beats[${beatIndex}]`, beat?.text));
    (dayScene.body?.choice?.options ?? []).forEach((option, optionIndex) => {
      (option.resultBeats ?? []).forEach((beat, beatIndex) => add(`overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].resultBeats[${beatIndex}]`, beat?.text));
    });
  });
  (packet.nightStructure?.interlude?.actions ?? []).forEach((action, actionIndex) => {
    add(`nightStructure.interlude.actions[${actionIndex}].text`, action.text);
    (action.options ?? []).forEach((option, optionIndex) => add(`nightStructure.interlude.actions[${actionIndex}].options[${optionIndex}].advisorLine`, option.advisorLine));
  });
  return entries;
}

function renderOptionRows(lines, type, options, audits) {
  options.forEach((option, index) => {
    const audit = audits[index] ?? {};
    lines.push(`| ${type} ${index + 1} | ${cell(audit.contextAnchor)} | ${cell(option.question)} | ${cell(visibleAnswerText(option))} | ${cell(option.guardedAnswer ?? "-")} | ${cell(audit.relation)} |`);
  });
}

function sceneSetupText(scene = {}) {
  return [
    ...spokenLines(scene.beforeVersion?.lines),
    scene.entryQuestion ?? "",
    scene.version ?? "",
    ...spokenLines(scene.afterVersion?.lines)
  ].filter(Boolean).join("\n");
}

function spokenLines(lines = []) {
  return (lines ?? []).filter((line) => line?.text).map((line) => line.text);
}

function visibleAnswerText(option = {}) {
  const lines = spokenLines(option.lines);
  return lines.length ? lines.join("\n") : String(option.answer ?? "");
}

function cell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(root, path), "utf8"));
}
