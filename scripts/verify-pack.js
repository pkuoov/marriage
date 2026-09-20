import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { RUNTIME_CASE_CONTENT_STATUS, RUNTIME_CASE_REQUIRED_FIELDS } from "../src/runtime/contentCase.js";
import { assertDialogueTexture, spokenPunctuationLeaks } from "../src/runtime/dialogueTexture.js";
import { splitDialogueSentences } from "../src/runtime/dialoguePresentation.js";
import { statementStagesForBrief } from "../src/runtime/statementReviewModel.js";
import { STORY_PACKS } from "../src/storyPacks.js";
import { CONTENT_CAST, CONTENT_HELPER_NPCS } from "../src/generated/contentPackIndex.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv[2] ?? "steam-demo-01";
const results = [];

function test(id, name, fn) {
  try {
    fn();
    results.push({ id, name, ok: true });
  } catch (error) {
    results.push({ id, name, ok: false, error });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}｜expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function warnAndFail(message) {
  console.warn(`WARN ${message}`);
  throw new Error(message);
}

function assertSoftEqual(actual, expected, message) {
  if (actual !== expected) {
    warnAndFail(`${message}｜expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${message}｜expected ${expectedText}, got ${actualText}`);
  }
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertArrayMin(value, minLength, message) {
  assert(Array.isArray(value) && value.length >= minLength, message);
}

function assertSingleQuestionTurn(value, label) {
  if (typeof value !== "string") return;
  const questionMarks = value.match(/[？?]/g) ?? [];
  assert(questionMarks.length <= 1, `${label} 同一话轮只能问一件事，不能塞入多个问号`);
}

function assertSingleQuestionTurns(value, label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSingleQuestionTurns(item, `${label}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    const childLabel = `${label}.${key}`;
    if (["question", "hostLine", "prompt", "entryQuestion"].includes(key)) assertSingleQuestionTurn(child, childLabel);
    assertSingleQuestionTurns(child, childLabel);
  });
}

function assertBeatLines(lines, label) {
  assertArrayMin(lines, 1, `${label} 至少需要一拍`);
  lines.forEach((line, lineIndex) => {
    assert(["caller", "host", "stage", "pause"].includes(line?.role), `${label}[${lineIndex}].role 不合法`);
    if (line.role !== "pause") assertNonEmptyString(line.text, `${label}[${lineIndex}].text 不能为空`);
  });
}

function assertOneCorrect(options, message) {
  assertEqual((options ?? []).filter((option) => option.correct === true).length, 1, message);
}

function assertThrows(fn, pattern, message) {
  try {
    fn();
  } catch (error) {
    assert(pattern.test(String(error?.message ?? error)), `${message}｜异常不匹配: ${error?.message ?? error}`);
    return;
  }
  throw new Error(`${message}｜expected throw`);
}

function assertAtLeastOneCorrect(options, message) {
  assert((options ?? []).some((option) => option.correct === true), message);
}

const MICRO_LOGIC_SOURCE_KINDS = new Set([
  "caller-statement",
  "quoted-message",
  "document-readout",
  "audio-playback",
  "host-calculation",
  "confirmed-followup"
]);

const SPOKEN_NARRATOR_LEAK = /我看窗外[，,；; ]*他看酒|现在那两个字卡在这儿|一个把我写成.{0,18}手上怎么能|替(?:他|她|谁)收口|紧跟着|紧接着|镜头(?:切|推|拉|给|对准)|画面(?:切|定格|推|拉)|特写(?:给|在|：)|旁白[：:]/;

function sceneInvariantText(scene = {}) {
  return [
    ...(scene.beforeVersion?.lines ?? []).filter((line) => line?.role !== "stage" && line?.role !== "pause").map((line) => line.text),
    scene.entryQuestion,
    scene.version,
    ...(scene.afterVersion?.lines ?? []).filter((line) => line?.role !== "stage" && line?.role !== "pause").map((line) => line.text)
  ].filter(Boolean).join("\n");
}

function assertMicroLogicContract(option, scene, label) {
  const contract = option.logicContract;
  assert(contract && typeof contract === "object" && !Array.isArray(contract), `${label} 核心追问缺少 logicContract`);
  ["premiseAnchor", "sourceKind", "sourceProves", "sourceDoesNotProve", "answerAnchor", "answerAdds", "nextLegalQuestion"].forEach((field) => {
    assertNonEmptyString(contract[field], `${label}.logicContract.${field} 不能为空`);
  });
  assert(MICRO_LOGIC_SOURCE_KINDS.has(contract.sourceKind), `${label}.logicContract.sourceKind 不合法: ${contract.sourceKind}`);
  assert(sceneInvariantText(scene).includes(contract.premiseAnchor), `${label}.logicContract.premiseAnchor 未命中本场固定前提: ${contract.premiseAnchor}`);
  const answerSurface = [
    option.answer,
    ...(option.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role)).map((line) => line.text)
  ].filter(Boolean).join("\n");
  assert(answerSurface.includes(contract.answerAnchor), `${label}.logicContract.answerAnchor 未命中玩家可见正常回答: ${contract.answerAnchor}`);
  assert(contract.sourceProves !== contract.sourceDoesNotProve, `${label}.logicContract 必须区分材料能证明与不能证明的范围`);
  assert(contract.answerAdds.length >= 8, `${label}.logicContract.answerAdds 必须写清回答新增事实或拒答边界`);
  assert(contract.nextLegalQuestion.length >= 8, `${label}.logicContract.nextLegalQuestion 必须写清下一问上限`);
}

function loadBearingCloserLines(scene = {}) {
  return (scene.sceneCloser?.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role) && line?.nonLoadBearing !== true && line?.text);
}

function cumulativeInvariantText(packet = {}, sceneIndex = 0) {
  const chunks = (packet.openingDialogue ?? []).map((line) => line.text).filter(Boolean);
  (packet.sceneVersions ?? []).slice(0, sceneIndex + 1).forEach((scene, index) => {
    chunks.push(sceneInvariantText(scene));
    if (index < sceneIndex) chunks.push(...(scene.sceneCloser?.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role)).map((line) => line.text));
  });
  return chunks.filter(Boolean).join("\n");
}

function assertClosureContract(packet, scene, sceneIndex, label) {
  const closerLines = loadBearingCloserLines(scene);
  if (!closerLines.length) {
    assert(scene.closureContract === undefined, `${label}.closureContract 只能用于承重场尾`);
    return;
  }
  const contract = scene.closureContract;
  assert(contract && typeof contract === "object" && !Array.isArray(contract), `${label} 承重 sceneCloser 缺少 closureContract`);
  ["entryAnchor", "closerAnchor", "adds", "openEdge"].forEach((field) => {
    assertNonEmptyString(contract[field], `${label}.closureContract.${field} 不能为空`);
  });
  assertEqual(contract.routeIndependent, true, `${label}.closureContract.routeIndependent 必须为 true`);
  const closerText = closerLines.map((line) => line.text).join("\n");
  assert(closerText.includes(contract.closerAnchor), `${label}.closureContract.closerAnchor 未命中承重场尾`);
  const available = `${cumulativeInvariantText(packet, sceneIndex)}\n${closerText}`;
  assert(available.includes(contract.entryAnchor), `${label}.closureContract.entryAnchor 未命中固定上下文或场尾中的可听见打断`);
  assert(contract.adds.length >= 8, `${label}.closureContract.adds 必须写清场尾新增或恢复的线程`);
  assert(contract.openEdge.length >= 6, `${label}.closureContract.openEdge 必须留下一个明确未决问题`);
}

function assertNoDuplicateTransitionQuestions(packet = {}) {
  const scenes = packet.sceneVersions ?? [];
  scenes.slice(0, -1).forEach((scene, sceneIndex) => {
    const closerHostLine = loadBearingCloserLines(scene)
      .filter((line) => line.role === "host" || line.role === "caller" || line.role === "respondent")
      .at(-1);
    const finalHostQuestion = closerHostLine?.role === "host" ? closerHostLine.text : "";
    const nextEntryQuestion = scenes[sceneIndex + 1]?.entryQuestion ?? "";
    if (/[？?]\s*$/.test(finalHostQuestion) && /[？?]\s*$/.test(nextEntryQuestion)) {
      throw new Error(
        `${packet.caseId} ${scene.id} 场尾和下一场 entryQuestion 连续发问：${closerHostLine} / ${nextEntryQuestion}`
      );
    }
  });
}

function spokenSurfaceEntries(packet = {}) {
  const entries = [];
  const add = (path, text) => {
    if (typeof text === "string" && text.trim()) entries.push({ path, text });
  };
  const addLines = (path, lines = []) => lines.forEach((line, index) => {
    if (!["stage", "pause"].includes(line?.role)) add(`${path}[${index}]`, line?.text);
  });
  (packet.openingDialogue ?? []).forEach((line, index) => add(`openingDialogue[${index}]`, line.text));
  (packet.sceneVersions ?? []).forEach((scene, sceneIndex) => {
    const base = `sceneVersions[${sceneIndex}]`;
    add(`${base}.entryQuestion`, scene.entryQuestion);
    add(`${base}.version`, scene.version);
    add(`${base}.revisedVersion`, scene.revisedVersion);
    addLines(`${base}.beforeVersion.lines`, scene.beforeVersion?.lines);
    addLines(`${base}.afterVersion.lines`, scene.afterVersion?.lines);
    addLines(`${base}.sceneCloser.lines`, scene.sceneCloser?.lines);
    for (const group of ["casualQuestions", "dialogueOptions", "questionOptions"]) {
      (scene[group] ?? []).forEach((option, optionIndex) => {
        const optionPath = `${base}.${group}[${optionIndex}]`;
        add(`${optionPath}.question`, option.question);
        add(`${optionPath}.answer`, option.answer);
        add(`${optionPath}.guardedAnswer`, option.guardedAnswer);
        addLines(`${optionPath}.lines`, option.lines);
        addLines(`${optionPath}.resistanceBeat.lines`, option.resistanceBeat?.lines);
      });
    }
  });
  add("deepFollowup.question", packet.deepFollowup?.question);
  add("deepFollowup.answer", packet.deepFollowup?.answer);
  addLines("deepFollowup.resistanceBeat.lines", packet.deepFollowup?.resistanceBeat?.lines);
  Object.entries(packet.overnightStructure?.callbackOpeners ?? {}).forEach(([openerId, opener]) => {
    add(`overnightStructure.callbackOpeners.${openerId}.line`, opener?.line);
    add(`overnightStructure.callbackOpeners.${openerId}.firstConflict.hostLine`, opener?.firstConflict?.hostLine);
    add(`overnightStructure.callbackOpeners.${openerId}.firstConflict.callerLine`, opener?.firstConflict?.callerLine);
    add(`overnightStructure.callbackOpeners.${openerId}.firstConflict.callerFollowupLine`, opener?.firstConflict?.callerFollowupLine);
  });
  addLines("overnightStructure.returnLead.lines", packet.overnightStructure?.returnLead?.lines);
  addLines("overnightStructure.returnBeat.lines", packet.overnightStructure?.returnBeat?.lines);
  (packet.overnightStructure?.liveCounterBeats ?? []).forEach((beat, beatIndex) => {
    addLines(`overnightStructure.liveCounterBeats[${beatIndex}].lines`, beat.lines);
    (beat.choices ?? []).forEach((choice, choiceIndex) => {
      add(`overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}].label`, choice.label);
      addLines(`overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}].lines`, choice.lines);
    });
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
  (packet.careChoices ?? []).forEach((choice, index) => {
    add(`careChoices[${index}].hostLine`, choice.hostLine);
    addLines(`careChoices[${index}].lines`, choice.lines);
  });
  return entries;
}

function assertNoSpokenNarratorLeak(packet, label) {
  const leaks = spokenSurfaceEntries(packet).filter((entry) => SPOKEN_NARRATOR_LEAK.test(entry.text));
  assert(leaks.length === 0, `${label} 人物台词混入第三方镜头、旁白或作者题眼: ${leaks.slice(0, 3).map((entry) => entry.path).join("、")}`);
}

function assertEvidenceOperation(operation, label, { requireMaterialRows = false } = {}) {
  assertNonEmptyString(operation.id, `${label} 缺少 id`);
  assertNonEmptyString(operation.title, `${label} 缺少 title`);
  assertNonEmptyString(operation.prompt, `${label} 缺少 prompt`);
  assertNonEmptyString(operation.material, `${label} 缺少 material`);
  if (operation.pityLine !== undefined) {
    assertNonEmptyString(operation.pityLine, `${label} pityLine 若存在必须是非空字符串`);
    assert(!/[圈]|那一栏|哪一块/.test(operation.pityLine), `${label} pityLine 不能替玩家点位置`);
  }
  if (requireMaterialRows || operation.materialRows !== undefined) {
    assertArrayMin(operation.materialRows, 2, `${label} materialRows 至少需要两行`);
    operation.materialRows.forEach((row, rowIndex) => {
      assertNonEmptyString(row, `${label}.materialRows[${rowIndex}] 不能为空`);
    });
  }
  assertArrayMin(operation.options, 3, `${label} 至少需要三个材料圈点选项`);
  if (operation.spokenInquiry) {
    assert(operation.options.some(option => option.correct), `${label} 问询须有可推进的问法`);
  } else if (operation.selectionMode === "priority") {
    assertEqual(operation.options.filter((option) => option.correct === true).length, 2, `${label} 先问哪个模式必须恰好有两个成立方向`);
  } else {
    assert(operation.selectionMode === undefined || operation.selectionMode === "single", `${label} selectionMode 只能是 single 或 priority`);
    assertOneCorrect(operation.options, `${label} 必须且只能有一个正确圈点`);
  }
  operation.options.forEach((option, optionIndex) => {
    assertNonEmptyString(option.label, `${label}.options[${optionIndex}] 缺少 label`);
    assertNonEmptyString(option.feedback, `${label}.options[${optionIndex}] 缺少 feedback`);
    if (option.reactionLine !== undefined) assertNonEmptyString(option.reactionLine, `${label}.options[${optionIndex}] reactionLine 若存在必须是非空字符串`);
    if (option.revisesScene !== undefined) {
      assert(Boolean(option.correct), `${label}.options[${optionIndex}] 只有正确圈点可以触发证言重述`);
      assert(Number.isInteger(option.revisesScene), `${label}.options[${optionIndex}] revisesScene 必须是场景下标`);
    }
    assertNonEmptyString(option.routeAxis, `${label}.options[${optionIndex}] 缺少 routeAxis`);
    if (option.correct) assertNonEmptyString(option.contradiction, `${label}.options[${optionIndex}] 正确圈点缺少 contradiction`);
  });
}

function assertDifficultyProfile(profile, label) {
  assert(profile && typeof profile === "object", `${label} 缺少 difficultyProfile`);
  assert(Number.isInteger(profile.tier) && profile.tier >= 1, `${label} difficultyProfile.tier 必须是正整数`);
  assertNonEmptyString(profile.label, `${label} difficultyProfile.label 不能为空`);
  assert(Number.isInteger(profile.budgetDelta), `${label} difficultyProfile.budgetDelta 必须是整数`);
  assert(Number.isInteger(profile.truthBoundaryPromptLimit), `${label} difficultyProfile.truthBoundaryPromptLimit 必须是整数`);
  assert(profile.truthBoundaryPromptLimit >= 0, `${label} 事实边界题量须为非负整数，简短收尾可为零`);
}

function assertTaskProfile(profile, label) {
  assert(profile && typeof profile === "object", `${label} 缺少 taskProfile`);
  assertNonEmptyString(profile.id, `${label} taskProfile.id 不能为空`);
  assertNonEmptyString(profile.label, `${label} taskProfile.label 不能为空`);
  assertNonEmptyString(profile.recommendedSpecialtyId, `${label} taskProfile.recommendedSpecialtyId 不能为空`);
  assertNonEmptyString(profile.summary, `${label} taskProfile.summary 不能为空`);
}

function assertCaseClosing(closing, label) {
  assert(closing && typeof closing === "object", `${label} 缺少正式 caseClosing`);
  ["title", "verdict", "nextStep"].forEach((field) => assertNonEmptyString(closing[field], `${label}.caseClosing 缺少 ${field}`));
  ["beats", "confirmed", "unresolved"].forEach((field) => assertArrayMin(closing[field], 1, `${label}.caseClosing.${field} 不能为空`));
}

function assertCareChoices(choices, label) {
  assertArrayMin(choices, 1, `${label}.careChoices 至少有一句收麦`);
  const expectedIds = ["pragmatic", "affirm", "accompany"];
  assert(new Set(choices.map(choice => choice.id)).size === choices.length, "收麦 ID 不重复");
  choices.forEach((choice, index) => {
    assert(expectedIds.includes(choice?.id), `${label}.careChoices[${index}] id 必须是 ${expectedIds[index]}`);
    assertNonEmptyString(choice.label, `${label}.careChoices[${index}].label 不能为空`);
    assertNonEmptyString(choice.hostLine, `${label}.careChoices[${index}].hostLine 不能为空`);
    assertArrayMin(choice.lines, 1, `${label}.careChoices[${index}].lines 不能为空`);
    assert(!("score" in choice) && !("correct" in choice), `${label}.careChoices[${index}] 不得判分`);
    assert(!JSON.stringify(choice).includes("(拍)"), `${label}.careChoices[${index}] 必须用独立 pause 拍`);
  });
}

function assertCaseTitle(title, label) {
  assert(title && typeof title === "object", `${label} 缺少正式 caseTitle`);
  assertNonEmptyString(title.title, `${label}.caseTitle 缺少 title`);
  assert(title.intro === undefined && title.subtitle === undefined, `${label}.caseTitle 只保留案名，不得提前写案情摘要或副标题`);
}

function assertHelpRequest(request, label) {
  assert(request && typeof request === "object", `${label} 缺少 helpRequest`);
  assert(["explanation", "interest"].includes(request.kind), `${label}.helpRequest.kind 必须是 explanation 或 interest`);
  assertNonEmptyString(request.request, `${label}.helpRequest.request 不能为空`);
}

function assertCallerIntentProfile(profile, label) {
  assert(profile && typeof profile === "object" && !Array.isArray(profile), `${label} 缺少 callerIntentProfile`);
  ["openGoal", "preferredAnswer", "audienceTilt", "protectedInterest", "defaultTactic", "concessionLimit"].forEach((field) => {
    assertNonEmptyString(profile[field], `${label}.callerIntentProfile.${field} 不能为空`);
  });
  assertArrayMin(profile.painPoints, 3, `${label}.callerIntentProfile.painPoints 至少登记三个承重痛点`);
  const topics = new Set();
  profile.painPoints.forEach((painPoint, index) => {
    ["topic", "threatens", "firstResponse", "afterProof", "minimumLeak"].forEach((field) => {
      assertNonEmptyString(painPoint?.[field], `${label}.callerIntentProfile.painPoints[${index}].${field} 不能为空`);
    });
    assert(!topics.has(painPoint.topic), `${label}.callerIntentProfile.painPoints topic 不得重复：${painPoint.topic}`);
    topics.add(painPoint.topic);
    assert(painPoint.firstResponse !== painPoint.afterProof, `${label}.callerIntentProfile.painPoints[${index}] 首次防守与证据后的改口必须不同`);
  });
}

function assertHostIdentity(packet = {}, label = "") {
  const hostNames = new Set(["林旭阳", "主播·林旭阳"]);
  const lines = [
    ...(packet.openingDialogue ?? []),
    ...((packet.overnightStructure?.postHangupContact?.lines) ?? []),
    ...((packet.nightStructure?.postHangupContact?.lines) ?? [])
  ];
  lines.filter((line) => line?.role === "host" || line?.speaker === "你" || hostNames.has(line?.speaker)).forEach((line, index) => {
    assert(hostNames.has(line.speaker), `${label} host line ${index + 1} 必须显示林旭阳，不能用裸“你”`);
  });
}

function truthBoundaryItemCount(packet = {}) {
  return ["true", "edited", "unknown"].reduce((sum, field) => sum + (packet.truthBoundary?.[field] ?? []).length, 0);
}

function assertRuntimeLengthPlan(packet, manifestItem, label) {
  const plan = packet.runtimeLengthPlan;
  const promptLimit = manifestItem?.difficultyProfile?.truthBoundaryPromptLimit;
  assert(plan && typeof plan === "object", `${label} 缺少 runtimeLengthPlan`);
  assertSoftEqual(plan.liveBeatCount, (packet.dialoguePresentation?.focusedInquiry ? new Set([...(packet.nightStructure?.segment1SceneIndexes ?? []), ...(packet.nightStructure?.segment2SceneIndexes ?? [])]).size : packet.sceneVersions?.length ?? 0), `${label} runtimeLengthPlan.liveBeatCount 必须等于实际来电段落数`);
  assertSoftEqual(plan.materialBoardCount, packet.evidenceChecks?.length ?? 0, `${label} runtimeLengthPlan.materialBoardCount 必须等于实际材料板数量`);
  assertSoftEqual(plan.backflowCount, packet.investigationHooks?.length ?? 0, `${label} runtimeLengthPlan.backflowCount 必须等于实际后台回流数量`);
  assertSoftEqual(plan.truthBoundaryPromptCount, packet.dialoguePresentation?.compactClosing ? 0 : promptLimit, `${label} runtimeLengthPlan.truthBoundaryPromptCount 必须等于 manifest 出题上限`);
  assert(truthBoundaryItemCount(packet) >= plan.truthBoundaryPromptCount, `${label} truthBoundary 池子不能少于实际出题数`);
  assertNonEmptyString(plan.caseSpecificPressure, `${label} runtimeLengthPlan.caseSpecificPressure 不能为空`);
  assertArrayMin(plan.whatPlayerDoesBesidesRead, 1, `${label} runtimeLengthPlan.whatPlayerDoesBesidesRead 应列出实际可玩的操作，不设种类配额`);
}

function normalizeQuoteText(value) {
  return normalizeOverlapText(String(value ?? "").replace(/^“|”$/g, "").replace(/其实/g, ""));
}

function normalizeQuoteCandidateText(value) {
  return String(value ?? "")
    .trim()
    .replace(/^“|”$/g, "")
    .replace(/[。！？!?；;，,、：:]+$/u, "")
    .trim();
}

function ungatedSurfaceText(packet = {}) {
  return collectTextFrom([
    packet.openingComplaint,
    packet.openingDialogue?.map((line) => line.text),
    packet.sceneVersions?.map((scene) => [
      scene.version,
      scene.beforeVersion?.lines?.map((line) => line.text),
      scene.afterVersion?.lines?.map((line) => line.text),
      scene.sceneCloser?.lines?.map((line) => line.text)
    ]),
    packet.evidenceCards?.map((card) => [card.title, card.front, card.detail]),
    packet.evidenceChecks?.map((check) => [check.title, check.material, check.prompt]),
    packet.investigationHooks?.map((hook) => [hook.surface, hook.appearsNowBecause, hook.title, hook.material, hook.prompt])
  ]);
}

function collectTextFrom(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(collectTextFrom).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(collectTextFrom).join("\n");
  return "";
}

function assertQuotePickCandidates(packet = {}, label = "") {
  const choiceLabels = (packet.accusationChoices ?? []).map((choice) => normalizeQuoteCandidateText(choice.label));
  const candidateLabels = (packet.quotePickCandidates ?? []).map(normalizeQuoteCandidateText);
  if (JSON.stringify(candidateLabels) !== JSON.stringify(choiceLabels)) {
    warnAndFail(`${label} quotePickCandidates 必须与实际 accusationChoices 顺序一致｜expected ${JSON.stringify(choiceLabels)}, got ${JSON.stringify(candidateLabels)}`);
  }
  const surfaceText = normalizeQuoteText(ungatedSurfaceText(packet) + "\n" + (packet.sceneVersions ?? []).flatMap(scene => (scene.testimonyWall?.acts ?? []).flatMap(act => (act.statements ?? []).map(statement => statement.text))).join("\n"));
  (packet.accusationChoices ?? []).forEach((choice, index) => {
    const quote = normalizeQuoteText(choice.label);
    if (choice.requiresRevisedSceneId) {
      const sourceScene = (packet.sceneVersions ?? []).find((scene) => scene.id === choice.requiresRevisedSceneId);
      assert(sourceScene?.revisedVersionTriggers, `${label} 第 ${index + 1} 条门控引语缺少有效重述触发器`);
      assert(normalizeQuoteText(sourceScene?.revisedVersion).includes(quote), `${label} 第 ${index + 1} 条门控引语不在重述文本里: ${choice.label}`);
      return;
    }
    assert(surfaceText.includes(quote), `${label} 第 ${index + 1} 条最终引语没有无门控出处: ${choice.label}`);
  });
}

function assertDetectiveAuthoringLedger(packet = {}, label = "") {
  const scenes = packet.sceneVersions ?? [];
  const sceneIds = new Set();
  scenes.forEach((scene, sceneIndex) => {
    assertNonEmptyString(scene.id, `${label} sceneVersions[${sceneIndex}] 启用侦探账本后必须有 id`);
    assert(!sceneIds.has(scene.id), `${label} sceneVersions id 重复: ${scene.id}`);
    sceneIds.add(scene.id);
    assert(scene.clueRole === undefined || ["setup", "misdirect", "missing-edge", "reversal", "payoff"].includes(scene.clueRole), `${label} sceneVersions[${sceneIndex}].clueRole 不合法`);
    if (scene.falseFrame !== undefined) assertNonEmptyString(scene.falseFrame, `${label} sceneVersions[${sceneIndex}].falseFrame 不能为空`);
    if (scene.payoffFor !== undefined) assert(Array.isArray(scene.payoffFor), `${label} sceneVersions[${sceneIndex}].payoffFor 必须是数组`);
  });
  scenes.forEach((scene, sceneIndex) => {
    (scene.payoffFor ?? []).forEach((sceneId) => {
      assert(sceneIds.has(sceneId), `${label} sceneVersions[${sceneIndex}].payoffFor 指向不存在的 scene id: ${sceneId}`);
    });
  });
  (packet.evidenceChecks ?? []).forEach((check, checkIndex) => {
    if (check.revalues !== undefined) assert(Array.isArray(check.revalues), `${label} evidenceChecks[${checkIndex}].revalues 必须是数组`);
    (check.revalues ?? []).forEach((sceneId) => {
      assert(sceneIds.has(sceneId), `${label} evidenceChecks[${checkIndex}].revalues 指向不存在的 scene id: ${sceneId}`);
    });
  });
  (packet.accusationChoices ?? []).forEach((choice, choiceIndex) => {
    assertNonEmptyString(choice.quoteSourceSceneId, `${label} accusationChoices[${choiceIndex}] 缺少 quoteSourceSceneId`);
    assert(sceneIds.has(choice.quoteSourceSceneId), `${label} accusationChoices[${choiceIndex}].quoteSourceSceneId 指向不存在的 scene id`);
  });
}

function assertCrossCaseEchoes(packet = {}, caseOrder = [], label = "") {
  if (packet.crossCaseEchoes === undefined) return;
  assert(Array.isArray(packet.crossCaseEchoes), `${label} crossCaseEchoes 必须是数组`);
  const currentIndex = caseOrder.indexOf(packet.caseId);
  packet.crossCaseEchoes.forEach((echo, echoIndex) => {
    assertNonEmptyString(echo.requiresCaseId, `${label} crossCaseEchoes[${echoIndex}] 缺少 requiresCaseId`);
    assertNonEmptyString(echo.text, `${label} crossCaseEchoes[${echoIndex}] 缺少 text`);
    const requiredIndex = caseOrder.indexOf(echo.requiresCaseId);
    assert(requiredIndex >= 0, `${label} crossCaseEchoes[${echoIndex}] requiresCaseId 不在当前包内`);
    assert(requiredIndex < currentIndex, `${label} crossCaseEchoes[${echoIndex}] requiresCaseId 必须是包内更早的案子`);
  });
}

function assertHostDisclosure(packet = {}, label = "") {
  if (packet.hostDisclosure === undefined) return;
  assert(!Array.isArray(packet.hostDisclosure), `${label} hostDisclosure 每案至多一条`);
  assert(packet.hostDisclosure && typeof packet.hostDisclosure === "object", `${label} hostDisclosure 必须是对象`);
  const anchor = packet.hostDisclosure.anchor ?? "";
  assertNonEmptyString(anchor, `${label} hostDisclosure 缺少 anchor`);
  assertNonEmptyString(packet.hostDisclosure.text, `${label} hostDisclosure 缺少 text`);
  assert(!/[圈]|那一栏|哪一块/.test(packet.hostDisclosure.text), `${label} hostDisclosure 文本不能替玩家点位置`);
  if (anchor.startsWith("afterScene:")) {
    const rawIndex = Number(anchor.split(":")[1]);
    assert(Number.isInteger(rawIndex) && rawIndex >= 1, `${label} hostDisclosure afterScene anchor 必须是一基场景序号`);
    assert(rawIndex <= (packet.sceneVersions?.length ?? 0), `${label} hostDisclosure afterScene anchor 指向不存在的场景`);
    return;
  }
  assert(["afterBackflow", "beforeDeepFollowup", "atStageJudgement"].includes(anchor), `${label} hostDisclosure anchor 不合法`);
}

function assertStanceSnapshot(packet = {}, label = "") {
  if (packet.stanceSnapshot === undefined) return;
  const snapshot = packet.stanceSnapshot;
  assert(snapshot && typeof snapshot === "object" && !Array.isArray(snapshot), `${label} stanceSnapshot 必须是对象`);
  const afterScene = Number(snapshot.afterScene ?? 0);
  assert(Number.isInteger(afterScene) && afterScene >= 1, `${label} stanceSnapshot.afterScene 必须是一基场景序号`);
  assert(afterScene <= (packet.sceneVersions?.length ?? 0), `${label} stanceSnapshot.afterScene 指向不存在的场景`);
  assertNonEmptyString(snapshot.prompt, `${label} stanceSnapshot.prompt 不能为空`);
  assertArrayMin(snapshot.options, 1, `${label} 已配置 stanceSnapshot 须有可用项`);
  snapshot.options.forEach((option, optionIndex) => {
    assertNonEmptyString(option.id, `${label} stanceSnapshot.options[${optionIndex}] 缺少 id`);
    assertNonEmptyString(option.label, `${label} stanceSnapshot.options[${optionIndex}] 缺少 label`);
    assertNonEmptyString(option.summary, `${label} stanceSnapshot.options[${optionIndex}] 缺少 summary`);
    assert(option.correct === undefined, `${label} stanceSnapshot.options[${optionIndex}] 不得设置 correct，立场快照不判分`);
  });
}

function assertCallMedium(packet = {}, label = "") {
  const medium = packet.callMedium ?? "voice";
  assert(["voice", "video"].includes(medium), `${label} callMedium 必须是 voice 或 video`);
}

function sentenceSetFrom(value) {
  return String(value ?? "")
    .split(/[。！？!?；;]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assertDelegation(packet = {}, label = "") {
  if (packet.delegation === undefined) return;
  const delegation = packet.delegation;
  assert(delegation && typeof delegation === "object" && !Array.isArray(delegation), `${label} delegation 必须是对象`);
  const expectedMoment = packet.nightStructure?.enabled ? "interlude:send-appraisal" : "actBreak:2";
  assertEqual(delegation.moment, expectedMoment, `${label} delegation.moment 必须是 ${expectedMoment}`);
  assertNonEmptyString(delegation.material?.id, `${label} delegation.material 缺少 id`);
  assertNonEmptyString(delegation.material?.label, `${label} delegation.material 缺少 label`);
  const materialIds = new Set([
    ...(packet.evidenceCards ?? []).map((card) => card.id),
    ...(packet.evidenceChecks ?? []).map((check) => check.id),
    ...(packet.investigationHooks ?? []).map((hook) => hook.id)
  ]);
  assert(materialIds.has(delegation.material.id), `${label} delegation.material.id 指向不存在的材料: ${delegation.material.id}`);
  assert(delegation.outcomes && typeof delegation.outcomes === "object" && !Array.isArray(delegation.outcomes), `${label} delegation.outcomes 必须是对象`);
  advisorIdList.forEach((advisorId) => {
    assert(delegation.outcomes[advisorId], `${label} delegation.outcomes 缺少 ${advisorId}`);
  });
  assertEqual(Object.keys(delegation.outcomes).length, advisorIdList.length, `${label} delegation.outcomes 只能覆盖四位注册顾问`);
  const strongCount = Object.values(delegation.outcomes).filter((outcome) => outcome?.tone === "strong").length;
  assert(strongCount <= 1, `${label} delegation strong 回单最多一条`);
  const advisorSentences = new Set((packet.advisorNotes ?? []).flatMap((note) => sentenceSetFrom(note.text)));
  Object.entries(delegation.outcomes).forEach(([advisorId, outcome]) => {
    assert(advisorIds.has(advisorId), `${label} delegation.outcomes 未注册顾问: ${advisorId}`);
    assert(DELEGATION_TONES.has(outcome?.tone), `${label} delegation.outcomes.${advisorId}.tone 不合法`);
    assertNonEmptyString(outcome?.text, `${label} delegation.outcomes.${advisorId}.text 不能为空`);
    assert(!DELEGATION_FORBIDDEN_TEXT.test(outcome.text), `${label} delegation.outcomes.${advisorId}.text 不能替玩家点位置`);
    sentenceSetFrom(outcome.text).forEach((sentence) => {
      assert(!advisorSentences.has(sentence), `${label} delegation.outcomes.${advisorId}.text 不能复用 advisorNotes 整句: ${sentence}`);
    });
  });
}

function assertNightStructure(packet = {}, label = "") {
  const structure = packet.nightStructure;
  if (structure === undefined) return;
  assert(structure && typeof structure === "object" && !Array.isArray(structure), `${label} nightStructure 必须是对象`);
  if (structure.enabled !== true) return;
  assertArrayMin(structure.segment1SceneIndexes, 1, `${label} nightStructure.segment1SceneIndexes 不能为空`);
  assertArrayMin(structure.segment2SceneIndexes, 1, `${label} nightStructure.segment2SceneIndexes 不能为空`);
  [...structure.segment1SceneIndexes, ...structure.segment2SceneIndexes].forEach((sceneIndex) => {
    assert(Number.isInteger(sceneIndex), `${label} nightStructure 场景下标必须是整数`);
    assert(sceneIndex >= 0 && sceneIndex < (packet.sceneVersions?.length ?? 0), `${label} nightStructure 场景下标越界: ${sceneIndex}`);
  });
  assertNonEmptyString(structure.hangup?.line, `${label} nightStructure.hangup.line 不能为空`);
  assertNonEmptyString(structure.hangup?.hostLine, `${label} nightStructure.hangup.hostLine 不能为空`);
  assertNonEmptyString(structure.hangup?.stageDirection, `${label} nightStructure.hangup.stageDirection 不能为空`);
  const interlude = structure.interlude;
  assert(interlude && typeof interlude === "object" && !Array.isArray(interlude), `${label} nightStructure.interlude 必须是对象`);
  if (interlude.flowMode === "linear") {
    assertEqual(interlude.budget, 0, `${label} 线性幕间不得增加行动预算`);
    assert(Array.isArray(interlude.actions), `${label} 线性幕间 actions 必须是数组`);
    assert(interlude.actions.length > 0 || packet.overnightStructure?.dayScenes?.length > 0, `${label} 无幕间任务时必须有后续白天场景`);
  } else {
  assert(Number.isInteger(interlude.budget) && interlude.budget > 0, `${label} nightStructure.interlude.budget 必须是正整数`);
  assert(Number.isInteger(interlude.minActions) && interlude.minActions >= 1, `${label} nightStructure.interlude.minActions 必须是正整数`);
  assert(Number.isInteger(interlude.maxActions) && interlude.maxActions >= interlude.minActions, `${label} nightStructure.interlude.maxActions 不能小于 minActions`);
  assert(interlude.budget >= interlude.maxActions, `${label} nightStructure.interlude.budget 不能小于 maxActions`);
  assertArrayMin(interlude.actions, 2, `${label} nightStructure.interlude.actions 至少需要两个真正不同的行动位`);
  }
  const actionIds = new Set();
  interlude.actions.forEach((action, actionIndex) => {
    assertNonEmptyString(action.id, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 id`);
    assert(!actionIds.has(action.id), `${label} nightStructure.interlude.actions id 重复: ${action.id}`);
    actionIds.add(action.id);
    assertNonEmptyString(action.label, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 label`);
    assertNonEmptyString(action.summary, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 summary`);
    if (action.kind === "interruptToast" || interlude.flowMode === "linear") {
      if (action.cost !== undefined) assert(Number.isInteger(action.cost) && action.cost >= 0, `${label} nightStructure.interlude.actions[${actionIndex}].cost 必须是非负整数`);
    } else {
      assert(Number.isInteger(action.cost) && action.cost > 0, `${label} nightStructure.interlude.actions[${actionIndex}].cost 必须是正整数`);
    }
    assertNonEmptyString(action.kind, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 kind`);
    if (action.npcVerb !== undefined) assert(["refuse", "interrupt", "conflict"].includes(action.npcVerb), `${label} nightStructure.interlude.actions[${actionIndex}].npcVerb 不合法`);
    if (action.kind === "advisorConflict") {
      assertArrayMin(action.options, 2, `${label} nightStructure.interlude.actions[${actionIndex}].options 至少需要两项`);
      action.options.forEach((option, optionIndex) => {
        assertNonEmptyString(option.id, `${label} nightStructure.interlude.actions[${actionIndex}].options[${optionIndex}] 缺少 id`);
        assertNonEmptyString(option.label, `${label} nightStructure.interlude.actions[${actionIndex}].options[${optionIndex}] 缺少 label`);
        assertNonEmptyString(option.advisorLine, `${label} nightStructure.interlude.actions[${actionIndex}].options[${optionIndex}] 缺少 advisorLine`);
        assert(!DELEGATION_FORBIDDEN_TEXT.test(option.advisorLine), `${label} nightStructure.interlude.actions[${actionIndex}].options[${optionIndex}] 顾问文案不能替玩家点位置`);
      });
    }
    if (action.kind === "interruptToast") {
      assertNonEmptyString(action.text, `${label} nightStructure.interlude.actions[${actionIndex}] interruptToast 缺少 text`);
    }
  });
  assert(
    interlude.flowMode === "linear" || interlude.actions.some((action) => ["advisorCall", "advisorConflict", "interruptToast", "backflowEarly"].includes(action.kind)),
    `${label} nightStructure.interlude.actions 至少需要一个由场外人物触发的行动位`
  );
  if (packet.overnightStructure) {
    assert(!(structure.callbackOpeners ?? []).length, `${label} 存在 overnightStructure 时不得保留第二套 nightStructure.callbackOpeners`);
    assert(structure.hangup.stageDirection === packet.overnightStructure.hangupLine, `${label} nightStructure.hangup.stageDirection 必须与 overnightStructure.hangupLine 对齐`);
    assert(structure.hangup.hostLine === packet.overnightStructure.hostHoldLine, `${label} nightStructure.hangup.hostLine 必须与 overnightStructure.hostHoldLine 对齐`);
    assertNonEmptyString(interlude.continueLabel, `${label} nightStructure.interlude.continueLabel 不能为空`);
    assert(interlude.continueLabel.includes("白天") && !interlude.continueLabel.includes("回拨"), `${label} nightStructure.interlude.continueLabel 进入白天地图库时必须明确写“白天”，不能误写“回拨”`);
  } else {
    assertArrayMin(structure.callbackOpeners, 1, `${label} nightStructure.callbackOpeners 不能为空`);
    assert(structure.callbackOpeners.some((opener) => opener.id === "opener-soft" && Array.isArray(opener.requiresAny) && opener.requiresAny.length === 0), `${label} nightStructure.callbackOpeners 必须包含无 requiresAny 的 opener-soft`);
    structure.callbackOpeners.forEach((opener, openerIndex) => {
      assertNonEmptyString(opener.id, `${label} nightStructure.callbackOpeners[${openerIndex}] 缺少 id`);
      assert(Array.isArray(opener.requiresAny), `${label} nightStructure.callbackOpeners[${openerIndex}].requiresAny 必须是数组`);
      assertNonEmptyString(opener.label, `${label} nightStructure.callbackOpeners[${openerIndex}] 缺少 label`);
      assertNonEmptyString(opener.hostLine, `${label} nightStructure.callbackOpeners[${openerIndex}] 缺少 hostLine`);
      assertNonEmptyString(opener.callerRevisedOpening, `${label} nightStructure.callbackOpeners[${openerIndex}] 缺少 callerRevisedOpening`);
      if (opener.requiresChoiceId !== undefined) assertNonEmptyString(opener.requiresChoiceId, `${label} nightStructure.callbackOpeners[${openerIndex}].requiresChoiceId 不能为空`);
      if (opener.blocksIfInventory !== undefined) assert(Array.isArray(opener.blocksIfInventory), `${label} nightStructure.callbackOpeners[${openerIndex}].blocksIfInventory 必须是数组`);
    });
  }
  assert(structure.returnStance && typeof structure.returnStance === "object" && !Array.isArray(structure.returnStance), `${label} nightStructure.returnStance 必须是对象`);
  ["defensive", "open", "neutral"].forEach((stance) => {
    assertNonEmptyString(structure.returnStance.lines?.[stance], `${label} nightStructure.returnStance.lines.${stance} 不能为空`);
  });
}

function assertOvernightStructure(packet = {}, label = "") {
  const structure = packet.overnightStructure;
  if (structure === undefined) return;
  assert(structure && typeof structure === "object" && !Array.isArray(structure), `${label} overnightStructure 必须是对象`);
  assertNonEmptyString(structure.hangupAnchor, `${label} overnightStructure.hangupAnchor 不能为空`);
  const anchorIndex = (packet.sceneVersions ?? []).findIndex((scene) => collectTextFrom(scene).includes(structure.hangupAnchor));
  assert(anchorIndex >= 0, `${label} overnightStructure.hangupAnchor 未命中任何 sceneVersions`);
  if (packet.nightStructure?.enabled === true) {
    const segment1LastIndex = packet.nightStructure.segment1SceneIndexes?.at(-1);
    assert(Number.isInteger(packet.nightStructure.hangup?.afterSceneIndex), `${label} nightStructure.hangup.afterSceneIndex 必须显式定位夜 A 末场`);
    assertEqual(
      packet.nightStructure.hangup.afterSceneIndex,
      segment1LastIndex,
      `${label} nightStructure.hangup.afterSceneIndex 必须等于 segment1 最后一场`
    );
    assertEqual(
      anchorIndex,
      packet.nightStructure.hangup.afterSceneIndex,
      `${label} overnightStructure.hangupAnchor 必须命中夜 A 最后一段，不能提前命中相似台词`
    );
  }
  assertNonEmptyString(structure.hangupLine, `${label} overnightStructure.hangupLine 不能为空`);
  if (structure.postHangupContact !== undefined) {
    assertNonEmptyString(structure.postHangupContact?.label, `${label} overnightStructure.postHangupContact.label 不能为空`);
    assertArrayMin(structure.postHangupContact?.lines, 2, `${label} overnightStructure.postHangupContact.lines 至少需要两句`);
    structure.postHangupContact.lines.forEach((line, lineIndex) => {
      assertNonEmptyString(line?.speaker, `${label} overnightStructure.postHangupContact.lines[${lineIndex}].speaker 不能为空`);
      assertNonEmptyString(line?.text, `${label} overnightStructure.postHangupContact.lines[${lineIndex}].text 不能为空`);
    });
  }
  assertNonEmptyString(structure.hostHoldLine, `${label} overnightStructure.hostHoldLine 不能为空`);
  if (structure.snapshotEcho !== undefined) {
    assert(structure.snapshotEcho && typeof structure.snapshotEcho === "object" && !Array.isArray(structure.snapshotEcho), `${label} overnightStructure.snapshotEcho 必须是对象`);
    const stanceIds = (packet.stanceSnapshot?.options ?? []).map((option) => option.id).sort();
    const echoIds = Object.keys(structure.snapshotEcho).sort();
    assertDeepEqual(echoIds, stanceIds, `${label} overnightStructure.snapshotEcho 必须逐项回应 stanceSnapshot`);
    Object.entries(structure.snapshotEcho).forEach(([optionId, line]) => {
      assertNonEmptyString(line, `${label} overnightStructure.snapshotEcho.${optionId} 不能为空`);
    });
  }
  if (structure.liveCounterBeats !== undefined) {
    assertArrayMin(structure.liveCounterBeats, 0, `${label} overnightStructure.liveCounterBeats 不能为空`);
    const beatIds = new Set();
    structure.liveCounterBeats.forEach((beat, beatIndex) => {
      assertNonEmptyString(beat.id, `${label} overnightStructure.liveCounterBeats[${beatIndex}] 缺少 id`);
      assert(!beatIds.has(beat.id), `${label} overnightStructure.liveCounterBeats id 重复: ${beat.id}`);
      beatIds.add(beat.id);
      assert(["interruptToast", "emotionalChoice"].includes(beat.kind), `${label} overnightStructure.liveCounterBeats[${beatIndex}].kind 必须是 interruptToast 或 emotionalChoice`);
      assertEqual(beat.cost, 0, `${label} overnightStructure.liveCounterBeats[${beatIndex}].cost 必须为 0`);
      const placementIndexes = [beat.beforeSceneIndex, beat.afterSceneIndex].filter(Number.isInteger);
      assertEqual(placementIndexes.length, 1, `${label} overnightStructure.liveCounterBeats[${beatIndex}] 必须且只能声明一个场前/场后位置`);
      const placementIndex = placementIndexes[0];
      assert(placementIndex > anchorIndex && placementIndex < (packet.sceneVersions?.length ?? 0), `${label} overnightStructure.liveCounterBeats[${beatIndex}] 必须落在夜 B 场景之间`);
      assertNonEmptyString(beat.from, `${label} overnightStructure.liveCounterBeats[${beatIndex}].from 不能为空`);
      assert(Boolean(beat.text || (beat.lines ?? []).length), `${label} overnightStructure.liveCounterBeats[${beatIndex}] 缺少可见内容`);
      if (beat.text) {
        const hasProfile = typeof beat.speakerProfileId === "string" && beat.speakerProfileId.length > 0;
        const isDocument = beat.voiceAttribution === "document";
        assert(hasProfile || isDocument, `${label} overnightStructure.liveCounterBeats[${beatIndex}] 的第三方文字必须声明 speakerProfileId 或 voiceAttribution=document`);
      }
      if (beat.lines !== undefined) assertBeatLines(beat.lines, `${label} overnightStructure.liveCounterBeats[${beatIndex}].lines`);
      (beat.choices ?? []).forEach((choice, choiceIndex) => {
        assertNonEmptyString(choice.id, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 缺少 id`);
        assertNonEmptyString(choice.directionLabel, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 必须只向玩家显示处理方向`);
        assertNonEmptyString(choice.label, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 缺少 label`);
        if (beat.choiceMode === "sequence") assertEqual(choice.directionLabel, choice.label, `${label} 顺序接话应显示实际台词`);
        else {
          assert(choice.directionLabel !== choice.label, `${label} 互斥方向与实际台词分别编写`);
          assertNonEmptyString(choice.recapAftertaste, `${label} 互斥分支记录所选结果`);
        }
        assert(!choice.recapAftertaste.includes("主播"), `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}].recapAftertaste 必须用第一人称回看，不能把玩家写回主播身后`);
        assert(choice.correct === undefined, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 不得判对错`);
        if (choice.lines !== undefined) {
          assertBeatLines(choice.lines, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}].lines`);
          assert(choice.lines.filter((line) => line.role !== "pause").length <= 3, `${label} liveCounter 情绪支线最多三行收束`);
        }
        if (choice.stanceNudge !== undefined) assert(["open", "defensive", "neutral"].includes(choice.stanceNudge), `${label} liveCounter stanceNudge 非法`);
        if (choice.endingImpact !== undefined) assertEqual(choice.endingImpact, "platform-data-loss", `${label} liveCounter endingImpact 目前只支持 platform-data-loss`);
        if (choice.questionOverride) {
          assertNonEmptyString(choice.questionOverride.sceneId, `${label} liveCounter questionOverride 缺少 sceneId`);
          const targetScene = (packet.sceneVersions ?? []).find((scene) => scene.id === choice.questionOverride.sceneId);
          assert(targetScene, `${label} liveCounter questionOverride 指向不存在的场景`);
          assert(Number.isInteger(choice.questionOverride.optionIndex), `${label} liveCounter questionOverride.optionIndex 必须是整数`);
          assert(targetScene?.questionOptions?.[choice.questionOverride.optionIndex], `${label} liveCounter questionOverride.optionIndex 越界`);
          assertNonEmptyString(choice.questionOverride.question, `${label} liveCounter questionOverride.question 不能为空`);
        }
      });
      if (beat.kind === "emotionalChoice") assertEqual((beat.choices ?? []).length, 3, `${label} 情绪应对必须提供哄/顶/不接话三选`);
    });
  }
  assertNonEmptyString(structure.dayIntro, `${label} overnightStructure.dayIntro 不能为空`);
  if (structure.flowMode === "linear") {
    assertEqual(structure.dayBudget, 0, `${label} 线性调查不得增加时间格`);
    assertArrayMin(structure.dayScenes, 1, `${label} 线性调查必须有场景`);
    assertBeatLines(structure.linearCallback?.lines, `${label} 线性回拨必须有衔接对白`);
    assert((structure.dayScenes ?? []).every((scene) => !scene.body?.choice), `${label} 必要材料不能仍被取舍选项拆开`);
  } else {
  assert(Number.isInteger(structure.dayBudget) && structure.dayBudget > 0, `${label} overnightStructure.dayBudget 必须是正整数`);
  assert(Number.isInteger(structure.minDayScenes) && structure.minDayScenes > 0, `${label} overnightStructure.minDayScenes 必须是正整数`);
  assert(structure.minDayScenes <= structure.dayBudget, `${label} overnightStructure.minDayScenes 不能超过 dayBudget`);
  assertArrayMin(structure.dayScenes, 3, `${label} overnightStructure.dayScenes 至少需要三处`);
  assert(structure.dayBudget < structure.dayScenes.length, `${label} overnightStructure.dayBudget 必须小于地点数`);
  }
  const sceneIds = new Set();
  const earnedIds = new Set();
  structure.dayScenes.forEach((scene, sceneIndex) => {
    assertNonEmptyString(scene.id, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 id`);
    assert(!sceneIds.has(scene.id), `${label} overnightStructure.dayScenes id 重复: ${scene.id}`);
    sceneIds.add(scene.id);
    assertNonEmptyString(scene.label, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 label`);
    assertNonEmptyString(scene.backdropClass, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 backdropClass`);
    assert(["lab", "visit", "home", "studio", "document", "observe", "sitIn", "doorstep"].includes(scene.kind), `${label} overnightStructure.dayScenes[${sceneIndex}].kind 不合法`);
    assertNonEmptyString(scene.body?.access, `${label} overnightStructure.dayScenes[${sceneIndex}].body.access 必须记录作者核验的联系与授权边界`);
    assertNonEmptyString(scene.body?.sourceNote, `${label} overnightStructure.dayScenes[${sceneIndex}].body.sourceNote 必须给玩家说明场景来源`);
    if (Array.isArray(scene.body?.beats)) {
      assert(scene.body.beats.length > 0, `${label} overnightStructure.dayScenes[${sceneIndex}].body.beats 不能为空`);
      scene.body.beats.forEach((beat, beatIndex) => {
        assertNonEmptyString(beat?.text, `${label} overnightStructure.dayScenes[${sceneIndex}].body.beats[${beatIndex}].text 不能为空`);
      });
    }
    if (scene.body?.choice) {
      assertNonEmptyString(scene.body.choice.prompt, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.prompt 不能为空`);
      assertArrayMin(scene.body.choice.options, 2, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options 至少两项`);
      scene.body.choice.options.forEach((option, optionIndex) => {
        assertNonEmptyString(option?.id, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].id 不能为空`);
        assertNonEmptyString(option?.label, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].label 不能为空`);
        if (option?.resultText !== undefined) {
          assertNonEmptyString(option.resultText, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].resultText 不能为空`);
        }
        if (option?.resultBeats !== undefined) {
          assertArrayMin(option.resultBeats, 1, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].resultBeats 不能为空`);
          option.resultBeats.forEach((beat, beatIndex) => {
            assertNonEmptyString(beat?.text, `${label} overnightStructure.dayScenes[${sceneIndex}].body.choice.options[${optionIndex}].resultBeats[${beatIndex}].text 不能为空`);
          });
        }
      });
    }
    if (scene.kind === "document") {
      assertNonEmptyString(scene.body?.documentId, `${label} overnightStructure.dayScenes[${sceneIndex}].body.documentId 不能为空`);
      assert((packet.documents ?? []).some((document) => document.id === scene.body.documentId), `${label} overnightStructure.dayScenes[${sceneIndex}].body.documentId 指向不存在的 documents`);
    } else {
      assertNonEmptyString(scene.body?.text, `${label} overnightStructure.dayScenes[${sceneIndex}].body.text 不能为空`);
      const choiceOptions = scene.body?.choice?.options ?? [];
      const choiceAlwaysGrants = choiceOptions.length > 0 && choiceOptions.every((option) => typeof option?.grantsEarnedItemId === "string" && option.grantsEarnedItemId.trim());
      assert(scene.body?.earnedItemId || choiceAlwaysGrants, `${label} overnightStructure.dayScenes[${sceneIndex}] 必须由 body.earnedItemId 或每个 choice 分支产出带回物`);
    }
    if (scene.body?.earnedItemId) earnedIds.add(scene.body.earnedItemId);
    (scene.body?.choice?.options ?? []).forEach((option) => {
      if (option?.grantsEarnedItemId) earnedIds.add(option.grantsEarnedItemId);
    });
    if (scene.body?.timelineSort !== undefined) {
      const timeline = scene.body.timelineSort;
      assertArrayMin(timeline.cards, 2, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.cards 至少两张`);
      assertDeepEqual([...timeline.correctOrder].sort(), [...timeline.cards].sort(), `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.correctOrder 必须与 cards 使用同一组卡片`);
      assert(JSON.stringify(timeline.correctOrder) !== JSON.stringify(timeline.cards), `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.cards 不能按正确顺序预排`);
      assertNonEmptyString(timeline.payoffLine, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.payoffLine 不能为空`);
      assertNonEmptyString(timeline.missLine, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.missLine 不能为空`);
    }
  });
  const openerIds = new Set(Object.keys(structure.callbackOpeners ?? {}));
  openerIds.forEach((earnedId) => {
    assert(!/(?:追问边|轮订边|标准表边|六折边|删评边|订座与灯|五万拒答)/.test(earnedId), `${label} callback opener 玩家可见名仍含设计黑话: ${earnedId}`);
  });
  earnedIds.forEach((earnedId) => {
    if (structure.flowMode === "linear" && structure.linearCallback) return;
    assert(openerIds.has(earnedId), `${label} overnightStructure.callbackOpeners 缺少 earnedItem opener: ${earnedId}`);
    assertNonEmptyString(structure.callbackOpeners?.[earnedId]?.line, `${label} overnightStructure.callbackOpeners.${earnedId}.line 不能为空`);
  });
  const firstConflictHostLines = new Set();
  Object.entries(structure.callbackOpeners ?? {}).forEach(([earnedId, opener]) => {
    assert(opener.firstConflict && typeof opener.firstConflict === "object" && !Array.isArray(opener.firstConflict), `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict 必须是对象`);
    const firstConflictHostLine = opener.firstConflict.hostLine ?? opener.firstConflict.lines?.find((line) => line.role === "host")?.text;
    assertNonEmptyString(firstConflictHostLine, `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict 必须有主播起手句`);
    if (opener.firstConflict.lines !== undefined) {
      assertBeatLines(opener.firstConflict.lines, `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict.lines`);
      assert(opener.firstConflict.lines.some((line) => line.role === "caller" && line.text), `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict.lines 必须有咨询者回答`);
    } else {
      assertNonEmptyString(opener.firstConflict.callerLine, `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict.callerLine 不能为空`);
    }
    if (opener.firstConflict.callerFollowupLine !== undefined) {
      assertNonEmptyString(opener.firstConflict.callerFollowupLine, `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict.callerFollowupLine 不能为空`);
      assertEqual(opener.firstConflict.pauseAfterCallerLine, true, `${label} firstConflict 分拍续句前必须声明 pauseAfterCallerLine`);
    }
    assert(!firstConflictHostLines.has(firstConflictHostLine), `${label} overnightStructure.callbackOpeners.${earnedId}.firstConflict 主播起手句不得与另一带回物共用同一句`);
    firstConflictHostLines.add(firstConflictHostLine);
  });
  if (structure.interludeEarnedItemMap !== undefined) {
    assert(structure.interludeEarnedItemMap && typeof structure.interludeEarnedItemMap === "object" && !Array.isArray(structure.interludeEarnedItemMap), `${label} overnightStructure.interludeEarnedItemMap 必须是对象`);
    const interludeInventoryIds = new Set();
    (packet.nightStructure?.interlude?.actions ?? []).forEach((action) => {
      (action.grantsInventory ?? []).forEach((id) => interludeInventoryIds.add(id));
      [...(action.options ?? []), ...(action.choices ?? [])].forEach((option) => {
        (option.grantsInventory ?? []).forEach((id) => interludeInventoryIds.add(id));
      });
    });
    (packet.investigationHooks ?? []).forEach((hook) => {
      (hook.replyChoices ?? []).forEach((option) => {
        (option.grantsInventory ?? []).forEach((id) => interludeInventoryIds.add(id));
      });
    });
    Object.entries(structure.interludeEarnedItemMap).forEach(([inventoryId, mappedIds]) => {
      assertNonEmptyString(inventoryId, `${label} overnightStructure.interludeEarnedItemMap 的 inventory id 不能为空`);
      assert(interludeInventoryIds.has(inventoryId), `${label} overnightStructure.interludeEarnedItemMap 来源未由幕间产出: ${inventoryId}`);
      const targets = Array.isArray(mappedIds) ? mappedIds : [mappedIds];
      assertArrayMin(targets, 1, `${label} overnightStructure.interludeEarnedItemMap.${inventoryId} 不能为空`);
      targets.forEach((earnedId) => {
        assertNonEmptyString(earnedId, `${label} overnightStructure.interludeEarnedItemMap.${inventoryId} 目标不能为空`);
        assert(structure.flowMode === "linear" && structure.linearCallback || openerIds.has(earnedId), `${label} overnightStructure.interludeEarnedItemMap.${inventoryId} 缺少 callback opener: ${earnedId}`);
      });
    });
  }
  assertNonEmptyString(structure.callbackFallback?.line, `${label} overnightStructure.callbackFallback.line 不能为空`);
  assertNonEmptyString(structure.postures?.againstCaller, `${label} overnightStructure.postures.againstCaller 不能为空`);
  assertNonEmptyString(structure.postures?.withCaller, `${label} overnightStructure.postures.withCaller 不能为空`);
  if (structure.returnLead !== undefined) assertBeatLines(structure.returnLead?.lines, `${label} overnightStructure.returnLead.lines`);
  if (structure.returnBeat !== undefined) assertBeatLines(structure.returnBeat?.lines, `${label} overnightStructure.returnBeat.lines`);
  if (structure.callerQuestion != null) {
    assertNonEmptyString(structure.callerQuestion.prompt, `${label} overnightStructure.callerQuestion.prompt 不能为空`);
    assertArrayMin(structure.callerQuestion.options, 3, `${label} overnightStructure.callerQuestion.options 至少三项`);
    structure.callerQuestion.options.forEach((option, optionIndex) => {
      assertNonEmptyString(option.id, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 id`);
      assertNonEmptyString(option.label, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 label`);
      if (option.lines !== undefined) assertBeatLines(option.lines, `${label} overnightStructure.callerQuestion.options[${optionIndex}].lines`);
      else assertNonEmptyString(option.callerLine, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 callerLine 或 lines`);
      (option.hostChoices ?? []).forEach((choice, choiceIndex) => {
        assertNonEmptyString(choice.id, `${label} overnightStructure.callerQuestion.options[${optionIndex}].hostChoices[${choiceIndex}] 缺少 id`);
        assertNonEmptyString(choice.label, `${label} overnightStructure.callerQuestion.options[${optionIndex}].hostChoices[${choiceIndex}] 缺少 label`);
        assertBeatLines(choice.lines, `${label} overnightStructure.callerQuestion.options[${optionIndex}].hostChoices[${choiceIndex}].lines`);
        assert(["open", "defensive", "neutral"].includes(choice.stanceNudge), `${label} callerQuestion hostChoices stanceNudge 不合法`);
        assert(choice.correct === undefined, `${label} callerQuestion hostChoices 不得设置 correct`);
      });
      assertNonEmptyString(option.routeAxis, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 routeAxis`);
      assert(option.correct === undefined, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 不得设置 correct`);
    });
  }
}

function assertDocuments(packet = {}, label = "") {
  if (packet.documents === undefined) return;
  assertArrayMin(packet.documents, 1, `${label} documents 至少需要一份文档`);
  packet.documents.forEach((document, documentIndex) => {
    assertNonEmptyString(document.id, `${label} documents[${documentIndex}] 缺少 id`);
    assertNonEmptyString(document.title, `${label} documents[${documentIndex}] 缺少 title`);
    assertNonEmptyString(document.intro, `${label} documents[${documentIndex}] 缺少 intro`);
    assert(document.markLimit === undefined || Number.isInteger(document.markLimit) && document.markLimit > 0, `${label} documents[${documentIndex}].markLimit 必须是正整数`);
    assertArrayMin(document.rows, 2, `${label} documents[${documentIndex}].rows 至少两行`);
    const configuredColumns = Array.isArray(document.columns) && document.columns.length
      ? document.columns
      : null;
    if (configuredColumns) {
      assertArrayMin(configuredColumns, 2, `${label} documents[${documentIndex}].columns 至少两列`);
      const columnKeys = new Set();
      configuredColumns.forEach((column, columnIndex) => {
        assertNonEmptyString(column.key, `${label} documents[${documentIndex}].columns[${columnIndex}] 缺少 key`);
        assertNonEmptyString(column.label, `${label} documents[${documentIndex}].columns[${columnIndex}] 缺少 label`);
        assert(!columnKeys.has(column.key), `${label} documents[${documentIndex}].columns key 重复: ${column.key}`);
        columnKeys.add(column.key);
      });
    }
    if (document.dateMode !== undefined) {
      assert(document.dateMode === "relative", `${label} documents[${documentIndex}].dateMode 目前只支持 relative`);
    }
    const rowIds = new Set();
    let previousDateValue = -1;
    document.rows.forEach((row, rowIndex) => {
      assertNonEmptyString(row.rowId, `${label} documents[${documentIndex}].rows[${rowIndex}] 缺少 rowId`);
      assert(!rowIds.has(row.rowId), `${label} documents[${documentIndex}] rowId 重复: ${row.rowId}`);
      rowIds.add(row.rowId);
      if (configuredColumns) {
        configuredColumns.forEach((column) => assertNonEmptyString(row[column.key], `${label} documents[${documentIndex}].rows[${rowIndex}].${column.key} 不能为空`));
      } else {
        assert(/^\d{2}-\d{2}$/.test(row.date ?? ""), `${label} documents[${documentIndex}].rows[${rowIndex}].date 必须是 MM-DD`);
        const dateValue = Number(String(row.date).replace("-", ""));
        assert(dateValue >= previousDateValue, `${label} documents[${documentIndex}].rows 日期必须升序`);
        previousDateValue = dateValue;
        assert(["入账", "支出", "提醒", "空行"].includes(row.kind), `${label} documents[${documentIndex}].rows[${rowIndex}].kind 不合法`);
        ["amount", "party", "memo"].forEach((field) => assertNonEmptyString(row[field], `${label} documents[${documentIndex}].rows[${rowIndex}].${field} 不能为空`));
      }
    });
    Object.entries(document.rowQuestions ?? {}).forEach(([rowId, questions]) => {
      assert(rowIds.has(rowId), `${label} documents[${documentIndex}].rowQuestions 引用不存在 rowId: ${rowId}`);
      assertArrayMin(questions, 1, `${label} documents[${documentIndex}].rowQuestions.${rowId} 至少一题`);
      questions.forEach((question, questionIndex) => {
        assertNonEmptyString(question.question, `${label} documents[${documentIndex}].rowQuestions.${rowId}[${questionIndex}].question 不能为空`);
        assertNonEmptyString(question.answer, `${label} documents[${documentIndex}].rowQuestions.${rowId}[${questionIndex}].answer 不能为空`);
        assertNonEmptyString(question.routeAxis, `${label} documents[${documentIndex}].rowQuestions.${rowId}[${questionIndex}].routeAxis 不能为空`);
      });
    });
    (document.crossQuestions ?? []).forEach((question, questionIndex) => {
      assertArrayMin(question.rows, 2, `${label} documents[${documentIndex}].crossQuestions[${questionIndex}].rows 至少两行`);
      question.rows.forEach((rowId) => assert(rowIds.has(rowId), `${label} documents[${documentIndex}].crossQuestions[${questionIndex}] 引用不存在 rowId: ${rowId}`));
      assertNonEmptyString(question.question, `${label} documents[${documentIndex}].crossQuestions[${questionIndex}].question 不能为空`);
      assertNonEmptyString(question.answer, `${label} documents[${documentIndex}].crossQuestions[${questionIndex}].answer 不能为空`);
      assertNonEmptyString(question.contradiction, `${label} documents[${documentIndex}].crossQuestions[${questionIndex}].contradiction 不能为空`);
    });
  });
  assertDocumentNumberConsistency(packet, label);
}

function assertDocumentNumberConsistency(packet = {}, label = "") {
  const text = collectTextFrom(packet);
  const rows = (packet.documents ?? []).flatMap((document) => document.rows ?? []);
  if (rows.some((row) => row.party === "新阳信贷有限公司" && row.amount === "¥50,000")) {
    assert(/新阳信贷.*五万|50,000.*新阳信贷|五万/.test(text), `${label} 新阳信贷五万必须进入事实或证言文本`);
  }
  if (rows.some((row) => row.party === "转出·尾号 3301" && row.amount === "¥49,800")) {
    assert(text.includes("49,800") && text.includes("3301"), `${label} 49,800 与 3301 必须进入事实或证言文本`);
  }
  if (rows.some((row) => row.amount === "¥8,214")) {
    assert(text.includes("8,214"), `${label} 8,214 必须进入文本互检池`);
  }
  if (rows.some((row) => row.date === "07-08" && row.kind === "空行")) {
    assert(text.includes("8 号"), `${label} 8 号空行必须与证言/事实互检`);
  }
}

function assertDocumentTimelineConsistency(packet = {}, label = "") {
  const rows = (packet.documents ?? []).flatMap((document) => document.rows ?? []);
  if (!rows.length) return;
  const rowDates = new Set(rows.map((row) => row.date));
  const summaryText = collectTextFrom([
    packet.truth,
    respondentNotesFor(packet).map((note) => note.text)
  ]);
  const claimText = collectTextFrom([
    summaryText,
    packet.followupTwist,
    packet.dailyShareBody,
    packet.truthBoundary,
    packet.evidenceCards,
    packet.evidenceChecks,
    packet.documents?.map((document) => [document.rowQuestions, document.crossQuestions])
  ]);

  for (const match of claimText.matchAll(/([一二两三四五六七八九十]+)月([一二两三四五六七八九十]+)[日号]/gu)) {
    const month = chineseInteger(match[1]);
    const day = chineseInteger(match[2]);
    const mmdd = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    assert(rowDates.has(mmdd), `${label} 时间文本“${match[0]}”在 documents 行中没有对应日期 ${mmdd}`);
  }

  const loanRow = rows.find((row) => row.memo === "贷款发放" || /信贷/.test(row.party ?? ""));
  const transferRow = loanRow
    ? rows.find((row) => row.kind === "支出" && row.memo === "转账" && rowDateValue(row.date) > rowDateValue(loanRow.date))
    : null;
  if (loanRow && transferRow) {
    const actualDays = daysBetweenMmDd(loanRow.date, transferRow.date);
    for (const match of claimText.matchAll(/(?:贷款到账|五万(?:贷款)?(?:入账|进(?:来)?))[^。！？\n]{0,8}?([零一二两三四五六七八九十百\d]+)\s*天后/gu)) {
      const claimedDays = chineseInteger(match[1]);
      assertEqual(claimedDays, actualDays, `${label} “${match[0]}”必须由 documents ${loanRow.date}→${transferRow.date} 行级日期计算`);
    }
  }

  for (const match of summaryText.matchAll(/(?:离职|失业)[^。！？\n]{0,8}?([零一二两三四五六七八九十百\d]+)\s*(天|个?月)/gu)) {
    const departureRow = rows.find((row) => /离职|失业|解除劳动/.test(collectTextFrom(row)));
    assert(departureRow, `${label} truth/respondentNote 写了“${match[0]}”，但 documents 没有可计算离职时长的起点行`);
    const latestRow = rows.reduce((latest, row) => rowDateValue(row.date) > rowDateValue(latest.date) ? row : latest, rows[0]);
    const actualDays = daysBetweenMmDd(departureRow.date, latestRow.date);
    const claimed = chineseInteger(match[1]);
    const matchesRows = match[2] === "天"
      ? claimed === actualDays
      : Math.abs(claimed * 30 - actualDays) <= 15;
    assert(matchesRows, `${label} truth/respondentNote 的“${match[0]}”与 documents ${departureRow.date}→${latestRow.date} 不符`);
  }
}

function chineseInteger(value = "") {
  if (/^\d+$/.test(value)) return Number(value);
  const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  let total = 0;
  let current = 0;
  for (const char of String(value)) {
    if (char in digits) current = digits[char];
    else if (char === "十") {
      total += (current || 1) * 10;
      current = 0;
    } else if (char === "百") {
      total += (current || 1) * 100;
      current = 0;
    }
  }
  return total + current;
}

function rowDateValue(mmdd = "") {
  const [month, day] = String(mmdd).split("-").map(Number);
  return Date.UTC(2024, month - 1, day);
}

function daysBetweenMmDd(start = "", end = "") {
  return Math.round((rowDateValue(end) - rowDateValue(start)) / 86400000);
}

function assertLurkerNote(packet = {}, label = "") {
  if (packet.lurkerNote === undefined) return;
  const note = packet.lurkerNote;
  assert(note && typeof note === "object" && !Array.isArray(note), `${label} lurkerNote 必须是对象`);
  assertNonEmptyString(note.presenceLine, `${label} lurkerNote.presenceLine 不能为空`);
  assertNonEmptyString(note.deletedFragment, `${label} lurkerNote.deletedFragment 不能为空`);
  assert(!/8\s*号|五万多|5万多/.test(note.deletedFragment), `${label} lurkerNote.deletedFragment 不能触碰 8 号或五万多`);
  const commentsText = collectTextFrom(comments);
  assert(!commentsText.includes(note.deletedFragment), `${label} lurkerNote.deletedFragment 不得进入弹幕或终局评论墙`);
  assert(!commentsText.includes(note.presenceLine), `${label} lurkerNote.presenceLine 不得进入弹幕或终局评论墙`);
}

const INVESTIGATION_SOURCE_BADGES = {
  dm: "后台私信",
  "mixed-inbox": "混合收件箱",
  "respondent-note": "对方留言",
  "store-manager-note": "店长留言",
  "leader-note": "领导批注",
  "department-assistant": "部门助理记录",
  "introducer-note": "介绍人留言",
  "cousin-note": "表姐说明"
};

const RESPONDENT_NOTE_THIRD_PARTY_PATTERN = /介绍人|表姐|店长|部门助理|领导|前同事|闺蜜|亲戚|朋友|助理|同事/;

function assertInvestigationSourceRules(packet = {}, label = "") {
  const hooks = packet.investigationHooks ?? [];
  const respondentHooks = hooks.filter((hook) => hook.source === "respondent-note");
  assert(respondentHooks.length <= 1, `${label} respondent-note 每案至多一条`);
  hooks.forEach((hook, hookIndex) => {
    assert(INVESTIGATION_SOURCE_BADGES[hook.source], `${label} investigationHooks[${hookIndex}] source 未注册: ${hook.source}`);
    if (hook.source !== "respondent-note") return;
    const senderText = collectTextFrom([hook.surface, hook.title, hook.appearsNowBecause]).trim();
    assert(!RESPONDENT_NOTE_THIRD_PARTY_PATTERN.test(senderText), `${label} investigationHooks[${hookIndex}] respondent-note 只能来自本案对方，不能标第三方`);
  });
}

function respondentNotesFor(packet = {}) {
  if (packet.respondentNote === undefined) return [];
  return Array.isArray(packet.respondentNote) ? packet.respondentNote : [packet.respondentNote];
}

function collectTextLength(value) {
  if (typeof value === "string") return value.trim().length;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + collectTextLength(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + collectTextLength(item), 0);
  return 0;
}

function normalizeOverlapText(value) {
  return String(value ?? "").replace(/[^\p{L}\p{N}]/gu, "");
}

function longestCommonSubstringLength(left, right) {
  const a = normalizeOverlapText(left);
  const b = normalizeOverlapText(right);
  if (!a || !b) return 0;
  let best = 0;
  let previous = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        current[j] = previous[j - 1] + 1;
        best = Math.max(best, current[j]);
      }
    }
    previous = current;
  }
  return best;
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(root, path), "utf8"));
}

function stripManualCacheTokens(value) {
  return JSON.parse(JSON.stringify(value).replace(/\?v=\d+(?:\.\d+)+/g, ""));
}

const manifest = stripManualCacheTokens(await readJson(`content/packs/${packId}/manifest.json`));
const runtimePack = STORY_PACKS[packId];
const caseFiles = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
const quickCaseFiles = await Promise.all(
  (manifest.quickCases ?? []).map((caseId) => readJson(`content/packs/${packId}/quick-cases/${caseId}.json`))
);
const comments = await readJson(`content/packs/${packId}/comments.json`);
const routeArchetypes = await readJson(`content/packs/${packId}/route-archetypes.json`);
const advisorRegistry = await readJson("content/characters/advisors.json").catch(() => ({ advisors: [] }));
const helperRegistry = await readJson("content/characters/helper-npcs.json").catch(() => ({ helpers: [] }));
const castRegistry = await readJson("content/characters/cast.json").catch(() => ({ cast: [] }));
const storyProjectPaths = [
  "story.md",
  "characters/_index.md",
  "worldbuilding/_index.md",
  "plot/_index.md",
  "plot/timeline.md",
  "chapters/_index.md",
  "scenes/_index.md",
  "continuity/state.md",
  "continuity/questions/_index.md",
  "continuity/promises/_index.md",
  "glossary/_index.md"
];
const storyProjectFiles = new Map(await Promise.all(storyProjectPaths.map(async (path) => [
  path,
  await readFile(resolve(root, path), "utf8").catch(() => null)
])));
const callerArtPaths = [...new Set(manifest.sequence.flatMap((item) => [
  item.callerArt,
  ...Object.values(item.callerArtVariants ?? {})
]).filter(Boolean))];
const callerArtFiles = new Map(await Promise.all(callerArtPaths.map(async (artPath) => {
  const cleanPath = String(artPath).replace(/^\.\//, "").replace(/\?.*$/, "");
  return [artPath, await readFile(resolve(root, cleanPath)).catch(() => null)];
})));
const callerNativePixelFiles = new Map(await Promise.all(callerArtPaths.map(async (artPath) => {
  const cleanPath = String(artPath).replace(/^\.\//, "").replace(/\?.*$/, "");
  const nativePath = cleanPath.replace(/\.png$/, "_256.png");
  return [artPath, await readFile(resolve(root, nativePath)).catch(() => null)];
})));
const p0PortraitPaths = [...new Set([
  ...manifest.sequence.flatMap((item) => [item.respondentArt, ...Object.values(item.respondentArtVariants ?? {})]),
  ...quickCaseFiles.flatMap((packet) => [
    packet.presentation?.host?.artSrc,
    ...Object.values(packet.presentation?.host?.artVariants ?? {}),
    packet.presentation?.caller?.artSrc,
    ...Object.values(packet.presentation?.caller?.artVariants ?? {})
  ])
].filter(Boolean))];
const p0PortraitFiles = new Map(await Promise.all(p0PortraitPaths.map(async (artPath) => {
  const cleanPath = String(artPath).replace(/^\.\//, "").replace(/\?.*$/, "");
  return [artPath, await readFile(resolve(root, cleanPath)).catch(() => null)];
})));
const p0PortraitNativeFiles = new Map(await Promise.all(p0PortraitPaths.map(async (artPath) => {
  const cleanPath = String(artPath).replace(/^\.\//, "").replace(/\?.*$/, "");
  const underscorePath = cleanPath.replace(/\.png$/, "_256.png");
  const dashPath = cleanPath.replace(/\.png$/, "-256.png");
  const file = await readFile(resolve(root, underscorePath)).catch(() => readFile(resolve(root, dashPath)).catch(() => null));
  return [artPath, file];
})));
const evidenceBoardFiles = new Map(await Promise.all(manifest.sequence.map(async (item) => {
  const artPath = item.evidenceBoard;
  const cleanPath = String(artPath ?? "").replace(/^\.\//, "").replace(/\?.*$/, "");
  return [artPath, cleanPath ? await readFile(resolve(root, cleanPath)).catch(() => null) : null];
})));
const p1InterludePortraitPaths = ["daily", "teasing", "serious"].map((pose) => `assets/generated/advisors/zhao-lawyer/zhao-lawyer-${pose}-pixel.png`);
const p1InterludePortraitFiles = new Map(await Promise.all(p1InterludePortraitPaths.map(async (artPath) => [
  artPath,
  {
    runtime: await readFile(resolve(root, artPath)).catch(() => null),
    native: await readFile(resolve(root, artPath.replace(/\.png$/, "_256.png"))).catch(() => null)
  }
])));
const p1EndingCgPaths = [
  "assets/generated/cg/chenzhi-news-push-pixel.png",
  "assets/generated/cg/envelope-2019-pixel.png"
];
const p1EndingCgFiles = new Map(await Promise.all(p1EndingCgPaths.map(async (artPath) => [
  artPath,
  await readFile(resolve(root, artPath)).catch(() => null)
])));
const advisorIds = new Set((advisorRegistry.advisors ?? []).map((advisor) => advisor.id));
const advisorIdList = [...advisorIds];
const caseOrder = manifest.sequence.map((item) => item.caseId);
const DELEGATION_TONES = new Set(["strong", "partial", "offDomain"]);
const DELEGATION_FORBIDDEN_TEXT = /圈|那一栏|哪一块/;

test("PACK-001", "manifest matches runtime story pack definition", () => {
  assert(runtimePack, `运行时故事包不存在: ${packId}`);
  assertEqual(manifest.id, packId, "manifest id 必须等于包 id");
  assert(Number(manifest.size) >= 1, "故事包至少要有一案");
  assertEqual(manifest.size, runtimePack.size, "manifest size 必须和运行时定义一致");
  assertDeepEqual(manifest.theme, runtimePack.theme, "manifest theme 必须和运行时定义一致");
  assertDeepEqual(manifest.caseLabels, runtimePack.caseLabels, "manifest caseLabels 必须和运行时定义一致");
  assertDeepEqual(manifest.sequence, runtimePack.sequence, "manifest sequence 必须和运行时定义一致");
  const manifestText = JSON.stringify(manifest);
  assert(!manifestText.includes("我是孟") && !manifestText.includes("孟（主持人）"), "manifest 不得保留旧主播身份");
  (manifest.nightShell?.lines ?? []).filter((line) => line?.role === "host" || line?.speaker === "你").forEach((line) => {
    assert(["林旭阳", "主播·林旭阳"].includes(line.speaker), "nightShell 主播必须显示林旭阳，不能用裸“你”");
  });
});

test("PACK-002", "manifest keeps distinct playable cases", () => {
  assertEqual(manifest.sequence.length, manifest.size, "sequence 数量必须等于 size");
  assertEqual((manifest.caseLabels ?? []).length, manifest.size, "caseLabels 数量必须等于 size");
  assertEqual(new Set(manifest.sequence.map((item) => item.caseId)).size, manifest.size, "caseId 不能重复");
  assertEqual(new Set(manifest.sequence.map((item) => item.plotId)).size, manifest.size, "plotId 不能重复");
  manifest.sequence.forEach((item, index) => {
    ["caseId", "plotId", "sceneId", "complainantId", "respondentId", "act", "objectLabel", "backdropClass", "callerArt"].forEach((field) => {
      assert(item[field], `第 ${index + 1} 案缺少 ${field}`);
    });
    assert(item.bridge === undefined, `第 ${index + 1} 案不得保留接通前案情旁白；求助和材料必须由通话内获得`);
    assertDifficultyProfile(item.difficultyProfile, `第 ${index + 1} 案`);
    if (index > 0) {
      assert(item.difficultyProfile.tier >= manifest.sequence[index - 1].difficultyProfile.tier, `第 ${index + 1} 案 difficultyProfile.tier 不能倒退`);
    }
    assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png$/.test(item.callerArt), `第 ${index + 1} 案 callerArt 必须指向不带手写缓存戳的匿名来电人 PNG`);
    assert(callerArtFiles.get(item.callerArt), `第 ${index + 1} 案 callerArt 文件不存在`);
    assert(pngHasAlpha(callerArtFiles.get(item.callerArt)), `第 ${index + 1} 案 callerArt 必须是真透明 PNG，不能使用烘入棋盘格的 RGB 图`);
    Object.entries(item.callerArtVariants ?? {}).forEach(([kind, artPath]) => {
      assert(["neutral", "guarded", "pause"].includes(kind), `第 ${index + 1} 案 callerArtVariants 不支持 ${kind}`);
      assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png$/.test(artPath), `第 ${index + 1} 案 ${kind} 立绘必须指向不带手写缓存戳的匿名 callers PNG`);
      assert(callerArtFiles.get(artPath), `第 ${index + 1} 案 ${kind} 立绘文件不存在`);
      assert(pngHasAlpha(callerArtFiles.get(artPath)), `第 ${index + 1} 案 ${kind} 立绘必须含真实 alpha 通道`);
    });
    if (item.callerArtStyle !== undefined) {
      assert(["pixel"].includes(item.callerArtStyle), `第 ${index + 1} 案 callerArtStyle 不支持 ${item.callerArtStyle}`);
    }
    if (item.callerArtStyle === "pixel") {
      assertDeepEqual(Object.keys(item.callerArtVariants ?? {}).sort(), ["guarded", "neutral", "pause"], `第 ${index + 1} 案像素立绘必须一次交付 neutral / guarded / pause 三态`);
      assertEqual(item.callerArt, item.callerArtVariants.neutral, `第 ${index + 1} 案 callerArt 必须与像素 neutral 同源`);
      Object.entries(item.callerArtVariants).forEach(([kind, artPath]) => {
        const runtimeMeta = pngMetadata(callerArtFiles.get(artPath));
        const nativeMeta = pngMetadata(callerNativePixelFiles.get(artPath));
        assert(runtimeMeta?.width === 1024 && runtimeMeta?.height === 2048, `第 ${index + 1} 案 ${kind} 像素立绘发运尺寸必须是 1024x2048`);
        assert(nativeMeta?.width === 256 && nativeMeta?.height === 512 && nativeMeta.hasAlpha, `第 ${index + 1} 案 ${kind} 像素立绘必须保留 256x512 真透明母版`);
      });
    }
    assert(item.evidenceBoard, `第 ${index + 1} 案必须挂载材料合成图`);
    const evidenceMeta = pngMetadata(evidenceBoardFiles.get(item.evidenceBoard));
    assert(evidenceMeta?.width === 1600 && evidenceMeta?.height === 900, `第 ${index + 1} 案材料合成图必须是 1600x900`);
    if (item.respondentArtVariants !== undefined) {
      assertDeepEqual(Object.keys(item.respondentArtVariants ?? {}).sort(), ["guarded", "neutral"], `第 ${index + 1} 案 respondentArtVariants 必须交付 neutral / guarded 双态`);
      Object.entries(item.respondentArtVariants).forEach(([kind, artPath]) => {
        const runtimeMeta = pngMetadata(p0PortraitFiles.get(artPath));
        const nativeMeta = pngMetadata(p0PortraitNativeFiles.get(artPath));
        assert(runtimeMeta?.width === 1024 && runtimeMeta?.height === 2048 && runtimeMeta.hasAlpha, `第 ${index + 1} 案 ${kind} 对方立绘必须是 1024x2048 真透明 PNG`);
        assert(nativeMeta?.width === 256 && nativeMeta?.height === 512 && nativeMeta.hasAlpha, `第 ${index + 1} 案 ${kind} 对方立绘必须保留 256x512 真透明母版`);
      });
    }
    assert(!/下一案|第[一二三四五六七八九十\d]+\s*案|\d+\s*\/\s*\d+/.test(item.objectLabel), `第 ${index + 1} 案 objectLabel 不能是目录话术`);
  });
});

test("PACK-002B", "interlude portraits and ending CG assets keep their production contract", () => {
  p1InterludePortraitPaths.forEach((artPath) => {
    const files = p1InterludePortraitFiles.get(artPath) ?? {};
    const runtimeMeta = pngMetadata(files.runtime);
    const nativeMeta = pngMetadata(files.native);
    assert(runtimeMeta?.width === 1024 && runtimeMeta?.height === 2048 && runtimeMeta.hasAlpha, `赵律师案间立绘必须是 1024x2048 真透明 PNG: ${artPath}`);
    assert(nativeMeta?.width === 256 && nativeMeta?.height === 512 && nativeMeta.hasAlpha, `赵律师案间立绘必须保留 256x512 真透明母版: ${artPath}`);
  });
  p1EndingCgPaths.forEach((artPath) => {
    const meta = pngMetadata(p1EndingCgFiles.get(artPath));
    assert(meta?.width === 1672 && meta?.height === 941, `尾声 CG 必须保持 1672x941 的 16:9 画幅: ${artPath}`);
  });
  assert(manifest.nightShell?.interludes?.at(-1)?.worldEcho?.artSrc?.includes("chenzhi-news-push-pixel.png"), "宸直公共结果必须挂载新闻推送 CG");
  assert(manifest.nightShell?.epilogue?.closingCg?.src?.includes("envelope-2019-pixel.png"), "整晚尾声必须挂载 2019 文件袋 CG");
});

test("PACK-021", "quick cases keep selectable numbers and stable catalog order", () => {
  assertEqual(quickCaseFiles.length, (manifest.quickCases ?? []).length, "manifest 中每个快案都必须有可加载的案件文件");
  assertEqual(new Set(quickCaseFiles.map((packet) => packet.id)).size, quickCaseFiles.length, "快案 id 不能重复");
  assertEqual(new Set(quickCaseFiles.map((packet) => packet.caseNumber)).size, quickCaseFiles.length, "快案编号不能重复");
  quickCaseFiles.forEach((packet, index) => {
    assertEqual(packet.id, manifest.quickCases[index], `第 ${index + 1} 宗快案必须遵循 manifest 的选择页顺序`);
    assertDeepEqual(Object.keys(packet.presentation?.host?.artVariants ?? {}).sort(), ["listening", "pressing", "questioning", "verdict"], `第 ${index + 1} 宗快案主播必须有听、问、压、结论四态`);
    const soloCommentary = packet.format === "solo-commentary";
    if (soloCommentary) assertNonEmptyString(packet.presentation?.source?.name, `第 ${index + 1} 宗单人口播快案必须登记上屏材料`);
    else assertDeepEqual(Object.keys(packet.presentation?.caller?.artVariants ?? {}).sort(), ["guarded", "neutral", "pause"], `第 ${index + 1} 宗快案来电人必须有 neutral / guarded / pause 三态`);
    [
      ...Object.values(packet.presentation.host.artVariants),
      ...(soloCommentary ? [] : Object.values(packet.presentation.caller.artVariants))
    ].forEach((artPath) => {
      const runtimeMeta = pngMetadata(p0PortraitFiles.get(artPath));
      const nativeMeta = pngMetadata(p0PortraitNativeFiles.get(artPath));
      assert(runtimeMeta?.width === 1024 && runtimeMeta?.height === 2048 && runtimeMeta.hasAlpha, `第 ${index + 1} 宗快案立绘必须是 1024x2048 真透明 PNG: ${artPath}`);
      assert(nativeMeta?.width === 256 && nativeMeta?.height === 512 && nativeMeta.hasAlpha, `第 ${index + 1} 宗快案立绘必须保留 256x512 真透明母版: ${artPath}`);
    });
    assert(/^\d{2}$/.test(packet.caseNumber), `${packet.id} caseNumber 必须是两位数字`);
    assertNonEmptyString(packet.title, `${packet.id} 缺少选择页标题`);
    if (packet.format !== "solo-commentary") assertCallerIntentProfile(packet.callerIntentProfile, packet.id);
  });
});

function pngHasAlpha(buffer) {
  return Boolean(pngMetadata(buffer)?.hasAlpha);
}

function pngMetadata(buffer) {
  if (!buffer || buffer.length < 26) return null;
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    hasAlpha: [4, 6].includes(buffer[25])
  };
}

test("PACK-003", "case pressure packets are complete", () => {
  const requiredFields = [
    "caseId",
    "plotId",
    "dramaticAnchor",
    "whyTonight",
    "helpRequest",
    "objectPurpose",
    "callerStake",
    "otherStake",
    "thirdPressure",
    "selfServingOmission"
  ];
  caseFiles.forEach((casePacket, index) => {
    const manifestItem = manifest.sequence[index];
    assertEqual(casePacket.caseId, manifestItem.caseId, `${casePacket.caseId} caseId 必须和 manifest 对齐`);
    assertEqual(casePacket.plotId, manifestItem.plotId, `${casePacket.caseId} plotId 必须和 manifest 对齐`);
    assert([RUNTIME_CASE_CONTENT_STATUS.metadataOnly, RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded].includes(casePacket.runtimeContentStatus), `${casePacket.caseId} runtimeContentStatus 必须是已知状态`);
    requiredFields.forEach((field) => {
      assert(casePacket[field], `${casePacket.caseId} 缺少 ${field}`);
    });
    assertHelpRequest(casePacket.helpRequest, casePacket.caseId);
    assertCallerIntentProfile(casePacket.callerIntentProfile, casePacket.caseId);
    if (casePacket.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.metadataOnly) {
      RUNTIME_CASE_REQUIRED_FIELDS.forEach((runtimeField) => {
        assert(!(runtimeField in casePacket), `${casePacket.caseId} 若写入 ${runtimeField}，必须先切到 runtime-loaded，不能继续做影子字段`);
      });
    } else {
      RUNTIME_CASE_REQUIRED_FIELDS.forEach((runtimeField) => {
        assert(casePacket[runtimeField] !== undefined, `${casePacket.caseId} runtime-loaded 缺少 ${runtimeField}`);
      });
      assertTaskProfile(casePacket.taskProfile, casePacket.caseId);
      assertRuntimeLengthPlan(casePacket, manifestItem, casePacket.caseId);
      const axisCommentValues = Object.values(casePacket.routeAxisComments ?? {}).flat();
      assert(Array.isArray(axisCommentValues), "弹幕可为空");
      axisCommentValues.forEach((comment, commentIndex) => {
        assertNonEmptyString(comment, `${casePacket.caseId} routeAxisComments[${commentIndex}] 不能为空`);
      });
      assertCaseClosing(casePacket.caseClosing, casePacket.caseId);
      assertCareChoices(casePacket.careChoices, casePacket.caseId);
      assertCaseTitle(casePacket.caseTitle, casePacket.caseId);
      assertHostIdentity(casePacket, casePacket.caseId);
    }
    ["true", "edited", "unknown"].forEach((field) => {
      assert(Array.isArray(casePacket.truthBoundary?.[field]), `${casePacket.caseId} truthBoundary.${field} 须为数组，不设事实条数配额`);
    });
    assert(Array.isArray(casePacket.quotePickCandidates), `${casePacket.caseId} quotePickCandidates 须为数组`);
    assert(Array.isArray(casePacket.accusationChoices), `${casePacket.caseId} accusationChoices 须为数组`);
    if (!casePacket.dialoguePresentation?.compactClosing) {
      assert(casePacket.accusationChoices.length > 0, `${casePacket.caseId} 旧收麦消费者需要可用原话；简短收尾不要求候选`);
    }
    assertQuotePickCandidates(casePacket, casePacket.caseId);
    (casePacket.accusationChoices ?? []).forEach((choice, choiceIndex) => {
      assert(choice.label && /^“.+”$/.test(choice.label), `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦必须像原话`);
      assert(choice.accuse || choice.accuseRole, `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦缺少责任指向`);
      assert(choice.response, `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦缺少主播回应`);
    });
  });
  const transitionInterludes = (manifest.nightShell?.interludes ?? []).slice(0, -1);
  assertEqual(transitionInterludes.length, Math.max(0, manifest.sequence.length - 1), "每两案之间必须保留一段工作室幕间");
  assertEqual(transitionInterludes[0]?.afterCaseId, "01-credit", "第一段幕间必须接在案一之后");
  assertEqual(transitionInterludes[1]?.afterCaseId, "04-workplace", "第二段幕间必须接在案二之后");
  [transitionInterludes[0], transitionInterludes[1]].forEach((interlude, index) => {
    assert(interlude?.transitionQuote === undefined, `第 ${index + 1} 段幕间不得再追加古文引页`);
  });
  const newsPush = transitionInterludes[2]?.transitionQuote;
  assert(newsPush && typeof newsPush === "object", "第三段幕间必须保留宸直新闻推送");
  assertEqual(newsPush.kind, "news-push", "第三段幕间只能使用新闻推送，不得换成格言卡");
  ["headline", "text", "source"].forEach((field) => assertNonEmptyString(newsPush[field], `第三段新闻推送缺少 ${field}`));
  assert(newsPush.bridge === undefined, "新闻推送不得用作者旁白预告下一案");
});

test("PACK-004", "comments and route archetypes are present", () => {
  assertEqual(comments.themeId, manifest.theme.id, "comments themeId 必须和 manifest theme 对齐");
  assert((comments.commentSeeds ?? []).every((item) => typeof item === "string" && item.trim()), "已配置的评论种子必须是可见文本");
  assert(manifest.theme?.thesis?.includes("对自己有利的那一截"), "包级主题必须点明来电人只展示对自己有利的部分");
  assert(manifest.theme?.commentPrompt?.includes("材料对上的") && manifest.theme?.commentPrompt?.includes("材料没写的"), "观察题必须奖励已对上的直说、未写明的停住");
  assert(comments.highRevealTone?.includes("该点的那句") && comments.highRevealTone?.includes("点到了"), "高揭示奖励必须回到玩家点中的具体说法");
  assert(comments.lowRevealTone?.includes("省掉的那句") && comments.lowRevealTone?.includes("还没听出来"), "低揭示反馈必须指出来电人仍有没说出的话");
  const archetypes = routeArchetypes.archetypes ?? [];
  ["money-flow", "document-edge", "caller-credibility", "process-control", "identity-wording"].forEach((axis) => {
    assert(archetypes.some((item) => item.id === axis), `路线原型缺少 ${axis}`);
  });
});

test("PACK-004A", "rage-bait contracts keep bounded player payoff while atmosphere remains optional", () => {
  assert(comments.recurringAntagonists === undefined, "弹幕不得再按固定反派编制逐案出场");
  assert(comments.fixedRetreatBeat === undefined, "弹幕不得再共用整齐败退模板");

  const allPackets = [...caseFiles, ...quickCaseFiles];
  assertEqual(allPackets.length, 7, "拱火债务表必须覆盖四主案和三快案");
  allPackets.forEach((packet) => {
    const label = packet.caseId ?? packet.id;
    const contract = packet.rageBaitContract;
    assert(contract && typeof contract === "object", `${label} 缺少 rageBaitContract`);
    assertArrayMin(contract.tierPlan, 1, `${label} tierPlan 不能为空`);
    assertArrayMin(contract.debts, 1, `${label} 至少登记一笔发债`);
    const sourceText = `${JSON.stringify(packet)}\n${label === "01-credit" ? JSON.stringify(manifest.nightShell?.prologue?.coldOpen ?? {}) : ""}`;
    contract.debts.forEach((debt, debtIndex) => {
      const debtLabel = `${label} rageBaitContract.debts[${debtIndex}]`;
      assertNonEmptyString(debt.id, `${debtLabel} 缺少 id`);
      assert(["Tier 1", "Tier 2", "Tier 3", "Tier 4"].includes(debt.tier), `${debtLabel}.tier 不合法`);
      assertNonEmptyString(debt.issue?.location, `${debtLabel} 缺少发债位置`);
      assertNonEmptyString(debt.issue?.quote, `${debtLabel} 缺少发债原句`);
      assert(sourceText.includes(debt.issue.quote), `${debtLabel} 发债原句必须存在于真源`);
      assertNonEmptyString(debt.interest?.location, `${debtLabel} 缺少首期付息位置`);
      assertNonEmptyString(debt.interest?.payoff, `${debtLabel} 缺少首期付息内容`);
      assertNonEmptyString(debt.interest?.holdingLimit, `${debtLabel} 缺少持债上限`);
      assertEqual(debt.principal?.trigger, "player-input", `${debtLabel} 本金必须由玩家输入结清`);
      assertNonEmptyString(debt.principal?.location, `${debtLabel} 缺少本金结清位置`);
      assertNonEmptyString(debt.principal?.payoff, `${debtLabel} 缺少本金结清内容`);
      assertNonEmptyString(debt.nextDebt?.location, `${debtLabel} 缺少挂断钩位置`);
      assertNonEmptyString(debt.nextDebt?.quote, `${debtLabel} 缺少下一笔债`);
    });
  });

  caseFiles.forEach((packet) => {
    const contract = packet.rageBaitContract;
    const activeScene = packet.sceneVersions?.find((scene) => scene.id === contract.activeProvocationSceneId);
    const activeOption = activeScene?.questionOptions?.find((option) => option.routeAxis === "active-provocation");
    if (contract.activeProvocationSceneId || activeOption) {
      assert(activeOption?.correct === true, `${packet.caseId} 已声明主动回放时必须走现有正确问答通道`);
      assert(activeScene.questionSequence?.length ? activeOption.suspicionLabel === activeOption.question : /重放|重读|读全|听完|问她要回放/.test(activeOption?.suspicionLabel ?? ""), `${packet.caseId} 顺序追问显示实际台词，旧回放动作保持具体`);
      assert(!/弹幕|课代表|替我选|替我下手/.test(activeOption?.suspicionLabel ?? ""), `${packet.caseId} 主动回放按钮不得写成编导口令`);
      if (activeOption?.resistanceBeat) assertBeatLines(activeOption.resistanceBeat.lines, `${packet.caseId} 主动回放后的来电人回应`);
      const roomReaction = packet.routeAxisComments?.["active-provocation"]?.[0];
      if (roomReaction) {
        assert(!/@讲道理先劝和|@他也是为你好|前面那句我收回|当我没说/.test(roomReaction), `${packet.caseId} 现场反应不得套用固定账号整齐败退模板`);
      }
    }
    const wallScene = packet.sceneVersions?.find((scene) => scene.testimonyWall);
    const wink = wallScene?.testimonyWall?.acts?.[0];
    if (wink?.winkLine) {
      assert(!/弹幕|课代表|替我选|替我下手|盯着哪一栏/.test(wink.winkLine), `${packet.caseId} 高潮前不得强塞主播与弹幕的编排默契`);
      assert(["tier2-player-cue", "tier3-accomplice"].includes(wink.winkTier), `${packet.caseId} 已使用高潮提示时必须声明合法层级`);
    }
  });

  const firstCase = caseFiles[0]?.rageBaitContract;
  assert(!firstCase.tierPlan.includes("Tier 3") && !firstCase.tierPlan.includes("Tier 4"), "首案只许 Tier 1—2");
  const tier4Owners = allPackets.filter((packet) => (packet.rageBaitContract?.tier4Assets ?? []).length).map((packet) => packet.caseId ?? packet.id).sort();
  assertDeepEqual(tier4Owners, ["01-no-conditions", "02-tony"], "Tier 4 只允许保留 Tony 名单反转与快案一‘什么都不图’");
  allPackets.flatMap((packet) => packet.rageBaitContract?.tier4Assets ?? []).forEach((asset) => {
    assert(Number(asset.availableAfterCaseNumber) >= 2, `${asset.id} 不得早于第二案结案投放`);
  });
  assert(!(quickCaseFiles.find((packet) => packet.id === "02-one-missed-message")?.rageBaitContract?.tierPlan ?? []).includes("Tier 4"), "收缩试玩范围的快案二不得含 Tier 4");
  assert(!(quickCaseFiles.find((packet) => packet.id === "03-labeled-fiction")?.rageBaitContract?.tierPlan ?? []).includes("Tier 4"), "快案三不得含 Tier 4");
});

test("PACK-005", "runtime-loaded cases expose playable nested content", () => {
  caseFiles
    .filter((casePacket) => casePacket.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded)
    .forEach((casePacket) => {
      assertNonEmptyString(casePacket.label, `${casePacket.caseId} label 不能为空`);
      assertNonEmptyString(casePacket.openingComplaint, `${casePacket.caseId} openingComplaint 不能为空`);
      assertArrayMin(casePacket.openingDialogue, 2, `${casePacket.caseId} openingDialogue 至少要有来回两句`);
      assertSingleQuestionTurns(casePacket, casePacket.caseId);
      assertNoDuplicateTransitionQuestions(casePacket);
      casePacket.openingDialogue.forEach((line, lineIndex) => {
        assertNonEmptyString(line.role, `${casePacket.caseId} openingDialogue[${lineIndex}] 缺少 role`);
        assertNonEmptyString(line.text, `${casePacket.caseId} openingDialogue[${lineIndex}] 缺少 text`);
      });

      assertArrayMin(casePacket.sceneVersions, 1, `${casePacket.caseId} sceneVersions 不能为空`);
      const statementStages = statementStagesForBrief(casePacket);
      const playableReplayIndexes = [...new Set([
        ...(casePacket.nightStructure?.segment1SceneIndexes ?? []),
        ...(casePacket.nightStructure?.segment2SceneIndexes ?? [])
      ])].filter((sceneIndex) => casePacket.sceneVersions?.[sceneIndex]?.interactionMode === "lineReplay").sort((left, right) => left - right);
      const stagedIndexes = statementStages.flatMap((stage) => stage.sceneIndexes).sort((left, right) => left - right);
      assertDeepEqual(stagedIndexes, playableReplayIndexes, `${casePacket.caseId} 陈述阶段必须且只能覆盖全部可玩 lineReplay 场景`);
      statementStages.forEach((stage) => {
        assert(stage.minimumReviewCount >= stage.sceneIndexes.length, `${casePacket.caseId}/${stage.id} 必须完成本阶段的关键追问`);
        const possibleReviewCount = stage.sceneIndexes.reduce((total, sceneIndex) => total + 1 + (casePacket.sceneVersions?.[sceneIndex]?.casualQuestions ?? []).length, 0);
        assert(stage.minimumReviewCount <= possibleReviewCount, `${casePacket.caseId}/${stage.id} 要求的回放次数超过可点内容`);
        const intermediateIndexes = stage.sceneIndexes.slice(0, -1);
        intermediateIndexes.forEach((sceneIndex) => {
          assert(casePacket.sceneVersions?.[sceneIndex]?.afterScene === undefined, `${casePacket.caseId}/${stage.id} 不得跨过段中材料门槛`);
          assert(Number(casePacket.stanceSnapshot?.afterScene ?? -1) !== sceneIndex + 1, `${casePacket.caseId}/${stage.id} 不得跨过段中立场快照`);
          assert(Number(casePacket.nightStructure?.hangup?.afterSceneIndex ?? -1) !== sceneIndex, `${casePacket.caseId}/${stage.id} 不得跨过段中挂断`);
          assert(!(casePacket.overnightStructure?.liveCounterBeats ?? []).some((beat) => Number(beat.afterSceneIndex) === sceneIndex), `${casePacket.caseId}/${stage.id} 不得跨过段中现场打断`);
        });
        stage.sceneIndexes.slice(1).forEach((sceneIndex) => {
          assert(!(casePacket.overnightStructure?.liveCounterBeats ?? []).some((beat) => Number(beat.beforeSceneIndex) === sceneIndex), `${casePacket.caseId}/${stage.id} 不得跳过场前现场打断`);
        });
      });
      assertDetectiveAuthoringLedger(casePacket, casePacket.caseId);
      const evidenceCardIds = new Set((casePacket.evidenceCards ?? []).map((card) => card.id).filter(Boolean));
      const evidenceCheckIds = new Set((casePacket.evidenceChecks ?? []).map((check) => check.id).filter(Boolean));
      casePacket.sceneVersions.forEach((scene, sceneIndex) => {
        assertNonEmptyString(scene.speakerId, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 speakerId`);
        const hasAuthoredLead = typeof scene.entryQuestion === "string" && scene.entryQuestion.trim().length > 0;
        const hasHostLead = (scene.beforeVersion?.lines ?? []).some((line) => line?.role === "host");
        assert(hasAuthoredLead || hasHostLead || (sceneIndex === 0 && casePacket.openingDialogue?.at(-1)?.role === "caller" && scene.speaker === "咨询者"), `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少自然入场问句，正文不能以孤立独白开页`);
        assertNonEmptyString(scene.version, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 version`);
        assertNonEmptyString(scene.helperHint, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少备用 helperHint，隐藏期间仍需保留可恢复数据`);
        assert(!/(正确答案|答案是|选第|路线轴|money-flow|document-edge|process-control)/i.test(scene.helperHint), `${casePacket.caseId} sceneVersions[${sceneIndex}].helperHint 即使隐藏也不能点答案或后台路线`);
        assertNonEmptyString(scene.doubt, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 doubt`);
        assertNonEmptyString(scene.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 contradiction`);
        assert(["mixed", "partial", "guarded", "clear"].includes(scene.reliability), `${casePacket.caseId} sceneVersions[${sceneIndex}] reliability 不合法`);
        assertNonEmptyString(scene.pressureHint?.intentHook, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 pressureHint.intentHook`);
        assert(["guarded", "tense", "listening"].includes(scene.pressureHint?.callerGuard), `${casePacket.caseId} sceneVersions[${sceneIndex}] pressureHint.callerGuard 不合法`);
        if (scene.pressureHint?.expression !== undefined) {
          assert(["blink", "pause", "shift"].includes(scene.pressureHint.expression?.kind), `${casePacket.caseId} sceneVersions[${sceneIndex}] pressureHint.expression.kind 不合法`);
          assertNonEmptyString(scene.pressureHint.expression?.text, `${casePacket.caseId} sceneVersions[${sceneIndex}] pressureHint.expression.text 不能为空`);
        }
        for (const beatField of ["beforeVersion", "afterVersion", "sceneCloser"]) {
          if (scene[beatField] !== undefined) assertBeatLines(scene[beatField]?.lines, `${casePacket.caseId} sceneVersions[${sceneIndex}].${beatField}.lines`);
        }
        assertClosureContract(casePacket, scene, sceneIndex, `${casePacket.caseId} sceneVersions[${sceneIndex}]`);
        if (scene.showsCard !== undefined) {
          assertNonEmptyString(scene.showsCard, `${casePacket.caseId} sceneVersions[${sceneIndex}].showsCard 不能为空`);
          assert(evidenceCardIds.has(scene.showsCard), `${casePacket.caseId} sceneVersions[${sceneIndex}].showsCard 指向不存在的 evidenceCards id: ${scene.showsCard}`);
        }
        if (scene.afterScene !== undefined) {
          assert(scene.afterScene && typeof scene.afterScene === "object" && !Array.isArray(scene.afterScene), `${casePacket.caseId} sceneVersions[${sceneIndex}].afterScene 必须是对象`);
          assertEqual(scene.afterScene.kind, "evidenceCheck", `${casePacket.caseId} sceneVersions[${sceneIndex}].afterScene.kind 目前只支持 evidenceCheck`);
          assertNonEmptyString(scene.afterScene.checkId, `${casePacket.caseId} sceneVersions[${sceneIndex}].afterScene 缺少 checkId`);
          assert(evidenceCheckIds.has(scene.afterScene.checkId), `${casePacket.caseId} sceneVersions[${sceneIndex}].afterScene.checkId 指向不存在的 evidenceChecks id: ${scene.afterScene.checkId}`);
        }
        if (scene.casualQuestions !== undefined) {
          assertArrayMin(scene.casualQuestions, 1, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions 若存在至少需要一条`);
          const keyQuestions = new Set((scene.questionOptions ?? []).map((option) => option.question));
          scene.casualQuestions.forEach((option, optionIndex) => {
            assertNonEmptyString(option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}] 缺少 question`);
            assertNonEmptyString(option.answer, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}] 缺少 answer`);
            assert(!keyQuestions.has(option.question), `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}] 不能复用关键选择文案`);
            if (option.lines !== undefined) assertBeatLines(option.lines, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}].lines`);
            if (option.guardedAnswer) {
              assertNonEmptyString(option.guardedAnswer, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}] guardedAnswer 不能为空`);
            }
          });
        }
        if (scene.interactionMode !== "testimonyWall") assertArrayMin(scene.questionOptions, 1, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要一个关键追问选项`);
        if (scene.interactionMode !== "testimonyWall") assertAtLeastOneCorrect(scene.questionOptions, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要一个核心追问`);
        assertEqual(
          scene.questionOptions.filter((option) => option.suspicionLabel !== undefined).length,
          scene.questionOptions.length,
          `${casePacket.caseId} sceneVersions[${sceneIndex}] 所有承重选项都必须只显示疑点方向，不能把完整问句放到按钮上`
        );
        scene.questionOptions.forEach((option, optionIndex) => {
          assertNonEmptyString(option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 question`);
          assertNonEmptyString(option.answer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 answer`);
          assertNonEmptyString(option.suspicionLabel, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].suspicionLabel 不能为空`);
          assert(option.suspicionLabel.length <= (scene.questionSequence?.length ? 100 : 24), `${casePacket.caseId} 追问按钮超过可读长度`);
          assert(scene.questionSequence?.length ? option.suspicionLabel === option.question : !/[？?。！!]$/.test(option.suspicionLabel), `${casePacket.caseId} 顺序按钮应显示实际追问，旧怀疑标签保持短语`);
          if (!scene.questionSequence?.length) assert(option.suspicionLabel !== option.question, `${casePacket.caseId} 非顺序疑点标签应区别于实际问句`);
          if (option.revealTransition !== undefined) {
            assert(option.correct === true, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 核心反转过场只能挂在正确方向上`);
            assertNonEmptyString(option.revealTransition?.id, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].revealTransition 缺少 id`);
            assertEqual(option.revealTransition?.kind, "reveal", `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].revealTransition.kind 必须为 reveal`);
            assertNonEmptyString(option.revealTransition?.label, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].revealTransition 缺少短促提示`);
          }
          if (option.guardedAnswer) {
            assertNonEmptyString(option.guardedAnswer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] guardedAnswer 不能为空`);
            assert(
              longestCommonSubstringLength(option.guardedAnswer, casePacket.deepFollowup?.answer) < 14,
              `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] guardedAnswer 不能提前复用 deepFollowup 的自白金句`
            );
          }
          if (option.resistanceBeat !== undefined) {
            assertBeatLines(option.resistanceBeat?.lines, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].resistanceBeat.lines`);
          }
          assertNonEmptyString(option.routeAxis, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeAxis`);
          assertNonEmptyString(option.routeTone, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeTone`);
          if (option.correct) {
            assertNonEmptyString(option.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 核心追问缺少 contradiction`);
            assertMicroLogicContract(option, scene, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}]`);
          }
        });
      });

      const revealRoutes = casePacket.sceneVersions.flatMap((scene, sceneIndex) =>
        (scene.questionOptions ?? [])
          .map((option, optionIndex) => ({ option, sceneIndex, optionIndex }))
          .filter(({ option }) => option.revealTransition)
      );
      const revealInterrupts = [
        ...(casePacket.nightStructure?.interlude?.actions ?? []),
        ...(casePacket.overnightStructure?.liveCounterBeats ?? [])
      ].filter((action) => action.kind === "interruptToast" && action.revealTransition);
      // Reveal transitions are authored when needed, not a one-per-case quota.

      assert(Array.isArray(casePacket.evidenceChecks), `${casePacket.caseId} evidenceChecks 须为数组，可为空`);
      casePacket.evidenceChecks.forEach((check, checkIndex) => {
        assertEvidenceOperation(check, `${casePacket.caseId} evidenceChecks[${checkIndex}]`, { requireMaterialRows: true });
        (check.options ?? []).forEach((option, optionIndex) => {
          if (option.revisesScene === undefined) return;
          const scene = casePacket.sceneVersions?.[option.revisesScene];
          assert(scene, `${casePacket.caseId} evidenceChecks[${checkIndex}].options[${optionIndex}] revisesScene 指向不存在的场景`);
          assertNonEmptyString(scene.revisedVersion, `${casePacket.caseId} evidenceChecks[${checkIndex}].options[${optionIndex}] revisesScene 指向的场景缺少 revisedVersion`);
        });
      });

      assert(Array.isArray(casePacket.investigationHooks), `${casePacket.caseId} investigationHooks 须为数组，可为空`);
      assertInvestigationSourceRules(casePacket, casePacket.caseId);
      casePacket.investigationHooks.forEach((hook, hookIndex) => {
        assertNonEmptyString(hook.source, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 source`);
        assertNonEmptyString(hook.triggerAction ?? hook.triggerContradiction, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 triggerContradiction`);
        assertNonEmptyString(hook.proves, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 proves`);
        assertNonEmptyString(hook.stillCannotProve, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 stillCannotProve`);
        assertEvidenceOperation(hook, `${casePacket.caseId} investigationHooks[${hookIndex}]`);
      });

      (casePacket.advisorNotes ?? []).forEach((note, noteIndex) => {
        assertNonEmptyString(note.advisorId, `${casePacket.caseId} advisorNotes[${noteIndex}] 缺少 advisorId`);
        assert(advisorIds.has(note.advisorId), `${casePacket.caseId} advisorNotes[${noteIndex}] advisorId 不在注册表中`);
        assertNonEmptyString(note.appearsNowBecause, `${casePacket.caseId} advisorNotes[${noteIndex}] 缺少 appearsNowBecause`);
        assertNonEmptyString(note.text, `${casePacket.caseId} advisorNotes[${noteIndex}] 缺少 text`);
        assert(!/[圈]|那一栏|哪一块/.test(note.text), `${casePacket.caseId} advisorNotes[${noteIndex}] 顾问文案不能替玩家点位置`);
      });
      assert((casePacket.advisorNotes ?? []).length <= 2, `${casePacket.caseId} advisorNotes 每案最多两条`);
      if (casePacket.respondentNote !== undefined) {
        const respondentNotes = respondentNotesFor(casePacket);
        assert(respondentNotes.length <= 1, `${casePacket.caseId} respondentNote 每案最多一条`);
        respondentNotes.forEach((note, noteIndex) => {
          if (note.source !== undefined) assertEqual(note.source, "respondent-note", `${casePacket.caseId} respondentNote[${noteIndex}] source 必须是 respondent-note`);
          assertNonEmptyString(note.appearsNowBecause, `${casePacket.caseId} respondentNote[${noteIndex}] 缺少 appearsNowBecause`);
          assertNonEmptyString(note.text, `${casePacket.caseId} respondentNote[${noteIndex}] 缺少 text`);
        });
      }
      assertCrossCaseEchoes(casePacket, caseOrder, casePacket.caseId);
      assertHostDisclosure(casePacket, casePacket.caseId);
      assertStanceSnapshot(casePacket, casePacket.caseId);
      assertCallMedium(casePacket, casePacket.caseId);
      assertDocuments(casePacket, casePacket.caseId);
      assertNightStructure(casePacket, casePacket.caseId);
      assertOvernightStructure(casePacket, casePacket.caseId);
      assertDelegation(casePacket, casePacket.caseId);
      assertLurkerNote(casePacket, casePacket.caseId);
      assertDialogueTexture(casePacket);
      assertNoSpokenNarratorLeak(casePacket, casePacket.caseId);
      const spokenPunctuation = spokenPunctuationLeaks(casePacket);
      assert(
        spokenPunctuation.length === 0,
        `${casePacket.caseId} 说话面不得混入半角逗号、冒号或分号: ${spokenPunctuation.slice(0, 3).map((entry) => entry.path).join("、")}`
      );

      if (casePacket.deepFollowup?.question || casePacket.deepFollowup?.answer) {
        assertNonEmptyString(casePacket.deepFollowup.question, `${casePacket.caseId} 已配置追问须有 question`);
        assertNonEmptyString(casePacket.deepFollowup.answer, `${casePacket.caseId} 已配置追问须有 answer`);
      }
      if (casePacket.deepFollowup?.resistanceBeat !== undefined) {
        assertBeatLines(casePacket.deepFollowup.resistanceBeat?.lines, `${casePacket.caseId} deepFollowup.resistanceBeat.lines`);
      }
      // Author notes may be empty when the case has no such pressure or omission.
      assert(typeof casePacket.selfServingOmission === "string", `${casePacket.caseId} selfServingOmission 须为字符串`);
      assert(typeof casePacket.thirdPressure === "string", `${casePacket.caseId} thirdPressure 须为字符串`);
      ["stageJudgement", "storyInterludeRecap", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"].forEach((field) => {
        assertNonEmptyString(casePacket[field], `${casePacket.caseId} ${field} 不能为空`);
        const prosePunctuation = casePacket[field].replace(/\d{1,3}(?:,\d{3})+/g, "");
        assert(!/[,:;]/.test(prosePunctuation), `${casePacket.caseId} ${field} 玩家可见中文正文不得混入半角逗号、冒号或分号`);
      });
    });
});

test("PACK-005A", "evidence inquiries keep playable questions, source references and legacy identities", () => {
  const act2OpenerLocks = {
    "01-credit": [],
    "02-tony": ["十二万", "合同"],
    "03-profile": ["二十八万八", "二十万", "我爸"],
    "04-workplace": []
  };
  for (const packet of caseFiles) {
    const walls = (packet.sceneVersions ?? []).filter((scene) => scene.interactionMode === "testimonyWall");
    for (const scene of walls) {
      const legacyStatements = scene.testimonyWall?.statements ?? [];
      const acts = scene.testimonyWall?.acts ?? [];
      assert(acts.length > 0, `${packet.caseId} 已配置证词墙须有可播放段落`);
      const [act1, act2] = acts;
      assertDeepEqual(act1.statements, legacyStatements, `${packet.caseId} act1 必须原样沿用旧 testimonyWall.statements`);
      assertDeepEqual(act1.decisivePresent, scene.decisivePresent, `${packet.caseId} act1 必须原样沿用旧 decisivePresent 落点`);
      acts.forEach((act, actIndex) => {
        if (packet.dialoguePresentation?.focusedInquiry) {
          const inquiry = act.inquiry;
          assert((inquiry?.openingLines ?? []).length > 0, `${packet.caseId}/${act.id} 直接问询须有必播开场`);
          for (const line of inquiry.openingLines) {
            assertNonEmptyString(line.role, `${packet.caseId}/${act.id} 开场缺少说话人`);
            assertNonEmptyString(line.text, `${packet.caseId}/${act.id} 开场缺少对白`);
          }
          const options = inquiry.options ?? [];
          assert(options.length > 1, `${packet.caseId}/${act.id} 选择页须有不同问法；唯一接话应直接播放`);
          assert(options.some((option) => option.correct), `${packet.caseId}/${act.id} 缺少可推进问法`);
          assert(new Set(options.map((option) => option.id)).size === options.length, `${packet.caseId}/${act.id} 问法 ID 重复`);
          assert(new Set(options.map((option) => option.question)).size === options.length, `${packet.caseId}/${act.id} 问句重复`);
          for (const option of options) {
            assertNonEmptyString(option.id, `${packet.caseId}/${act.id} 问法缺少 ID`);
            assertNonEmptyString(option.question, `${packet.caseId}/${act.id} 问法缺少完整问句`);
            assert(typeof option.correct === "boolean", `${packet.caseId}/${act.id}/${option.id} 缺少推进标记`);
            assert((option.lines ?? []).length > 0, `${packet.caseId}/${act.id}/${option.id} 缺少实际回应`);
            for (const line of option.lines) {
              assertNonEmptyString(line.role, `${packet.caseId}/${act.id}/${option.id} 回应缺少说话人`);
              assertNonEmptyString(line.text, `${packet.caseId}/${act.id}/${option.id} 回应缺少对白`);
            }
          }
        }
        assert((act.statements ?? []).length > 0, `${packet.caseId}/${act.id} 须有可播放原话`);
        (act.statements ?? []).forEach((statement, statementIndex) => {
          assertNonEmptyString(statement.id, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 id`);
          assertNonEmptyString(statement.text, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 text`);
          assertNonEmptyString(statement.pressResponse, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 pressResponse`);
          assertNonEmptyString(statement.presentResponse, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 presentResponse`);
        });
        assert(typeof act.midSummary === "string", `${packet.caseId} acts[${actIndex}] 中场小结应为字符串；无必要时留空，避免提前下结论`);
        const present = act.decisivePresent;
        if (!act.inquiry) assert(Number.isInteger(present?.maxAttempts) && present.maxAttempts > 0, `${packet.caseId} act${actIndex + 1} 尝试次数须为正整数`);
        assert((act.statements ?? []).some((statement) => statement.id === present?.statementId), `${packet.caseId} act${actIndex + 1} 决定性证词句不存在`);
        assert((present?.materialCards ?? []).length > 0, `${packet.caseId} act${actIndex + 1} 证据问询须有可读材料`);
        const correctCard = present.materialCards.find((card) => card.id === present.evidenceId);
        assert(correctCard, `${packet.caseId} act${actIndex + 1} 关联材料不存在`);
        ["callerLine", "hostLine", "boundaryLine", "contradiction"].forEach((field) => assertNonEmptyString(present[field], `${packet.caseId} acts[${actIndex}].decisivePresent.${field} 不能为空`));
        const acceptedIds = [present.evidenceId, ...(present.acceptedEvidenceIds ?? [])];
        assert(new Set(acceptedIds).size === acceptedIds.length, `${packet.caseId} 出示材料 ID 不得重复`);
        for (const id of acceptedIds) assert(present.materialCards.some((card) => card.id === id), `${packet.caseId} 兼容材料必须实际存在：${id}`);
        if (correctCard.sourceBeat) {
          const source = correctCard.sourceBeat;
          const sourceScene = packet.sceneVersions.find((item) => item.id === source.sceneId);
          assert(sourceScene?.id === scene.id, `${packet.caseId} 当场原话必须指向本场已播的来源`);
          const sourceActIndex = (sourceScene.testimonyWall?.acts ?? []).findIndex((item) => item.id === source.actId);
          const sourceLines = source.field === "beforeVersion" ? sourceScene.beforeVersion?.lines
            : source.field === "openerLines" && sourceActIndex >= 0 && sourceActIndex <= actIndex
              ? sourceScene.testimonyWall.acts[sourceActIndex].openerLines : [];
          assert(sourceLines?.[source.lineIndex]?.text?.includes(correctCard.excerpt), `${packet.caseId} 原话卡必须逐字来自本次出示前的必播对白`);
          return;
        }
        const evidenceParts = String(present.evidenceId).split(":");
        const documentId = evidenceParts[0];
        const document = (packet.documents ?? []).find((item) => item.id === documentId);
        if (document) {
          const rowIds = correctCard.sourceRowIds ?? evidenceParts.slice(1).join(":").split("+");
          rowIds.forEach((rowId) => assert(document.rows.some((row) => row.rowId === rowId), `${packet.caseId} act${actIndex + 1} 决定性材料指向不存在的文档行 ${rowId}`));
        } else {
          const evidenceCheck = (packet.evidenceChecks ?? []).find((item) => item.id === documentId);
          if (evidenceCheck) {
            assertEqual(evidenceParts.slice(1).join(":"), "summary", `${packet.caseId} act${actIndex + 1} 材料检视来源必须使用 summary 锚点`);
            assert((evidenceCheck.materialRows ?? []).length > 0, `${packet.caseId} act${actIndex + 1} 材料检视来源缺少可见材料行`);
            return;
          }
          const sourceScene = (packet.sceneVersions ?? []).find((item) => item.id === documentId);
          const statementId = evidenceParts.slice(1).join(":");
          const sourceStatement = sourceScene?.testimonyWall?.acts?.[0]?.statements?.find((statement) => statement.id === statementId);
          assert(sourceScene && sourceStatement, `${packet.caseId} act${actIndex + 1} 决定性材料必须来自已有文档行或第一幕证词`);
          assert(correctCard.kind?.includes("原话回放"), `${packet.caseId} act${actIndex + 1} 第一幕证词来源必须标为原话回放`);
          assert(correctCard.excerpt?.includes(sourceStatement.text), `${packet.caseId} act${actIndex + 1} 原话回放必须逐字包含来源证词`);
        }
      });
      if (act2) {
        assertNonEmptyString(act2.revisedFrame, `${packet.caseId} act2 必须登记 revisedFrame`);
        const act2OpenerText = (act2.openerLines ?? []).map((line) => line.text ?? "").join(" ");
        assert((act2.openerLines ?? []).length > 0, `${packet.caseId} act2 开场须可播放`);
        (act2.openerFactKeywords ?? []).forEach((keyword) => assert(act2OpenerText.includes(keyword), `${packet.caseId} act2 openerLines 必须承认首幕决定性事实 ${keyword}`));
        (act2OpenerLocks[packet.caseId] ?? []).forEach((keyword) => assert(act2OpenerText.includes(keyword), `${packet.caseId} act2 openerLines 必须保留锁定承认词 ${keyword}`));
        const act1Texts = new Set((act1.statements ?? []).map((statement) => statement.text));
        const act2Bearing = (act2.statements ?? []).find((statement) => statement.id === act2.decisivePresent?.statementId);
        assert(act2Bearing && !act1Texts.has(act2Bearing.text), `${packet.caseId} act2 承重句不得等于 act1 任一证词`);
        (act2.decisivePresent?.boundaryLineKeyPhrases ?? []).forEach((phrase) => {
          assert(act2.decisivePresent.boundaryLine.includes(phrase), `${packet.caseId} act2 boundaryLine 必须包含登记短语 ${phrase}`);
          assert(!act2Bearing.text.includes(phrase), `${packet.caseId} act2 承重句不得提前说出最终事实边界 ${phrase}`);
        });
        const transformed = (act2.statements ?? []).filter((statement) => statement.survivesFromAct1);
        transformed.forEach((statement) => {
          const source = (act1.statements ?? []).find((candidate) => candidate.id === statement.survivesFromAct1);
          assert(source, `${packet.caseId} act2 变形证词指向不存在的 act1 句 ${statement.survivesFromAct1}`);
        });
      }
    }
    const profile = packet.dialoguePresentation ?? {};
    assert(profile.speedTiers?.strained && profile.speedTiers?.stalled, `${packet.caseId} dialoguePresentation 必须有两档额外字速`);
    ["host", "caller", "respondent"].forEach((role) => assert(Number(profile.blipPitchHz?.[role]) > 0, `${packet.caseId} 缺少 ${role} blip 音高`));
    (packet.sceneVersions ?? []).filter((candidate) => candidate.interactionMode !== "testimonyWall").forEach((candidate) => {
      assert(splitDialogueSentences(candidate.version ?? "").every((line) => line.trim()), `${packet.caseId}/${candidate.id} 回放句不得为空`);
    });
  }

  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const caseOnePresent = caseOne.sceneVersions.find((scene) => scene.decisivePresent)?.decisivePresent;
  assertEqual(caseOnePresent?.evidenceId, "credit-savings-agreement:chat", "案1代存反驳必须核对约定原话");
  assertEqual(caseOnePresent?.statementId, "credit-consumption-gloss", "案1必须把流水出示在粉饰消费证词上");
  assert(!caseOne.documents?.some((document) => document.rows?.some((row) => row.rowId === "r16")), "案1近五个月流水不得伪造十四个月汇总行 r16");
  assert(JSON.stringify(caseOne.sceneVersions).includes("¥17,500 × 14"), "固定转账汇总保留在证词材料中");

  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourScene = caseFour.sceneVersions.find((scene) => scene.decisivePresent);
  assertEqual(caseFourScene?.decisivePresent?.evidenceId, "case4-department-ledger:q06", "案4夜二直接核跨部门待付");
  assert(caseFourScene.testimonyWall.acts[0].statements.some(statement => statement.id === "work-process-complete"), "重排后仍保留跨部门待付的稳定证词身份");

  ["02-tony", "03-profile"].forEach((caseId) => {
    const packet = caseFiles.find((candidate) => candidate.caseId === caseId);
    const present = packet.sceneVersions.find((scene) => scene.decisivePresent)?.decisivePresent;
    assertNonEmptyString(present?.selectionReason, `${caseId} 必须解释 A→B 翻转证据选择理由`);
    assert(/不证明|不能证明|保留|未知/.test(present.selectionReason), `${caseId} 选择理由必须写明事实边界`);
  });

  manifest.sequence.forEach((item) => {
    assertDeepEqual(Object.keys(item.callerArtVariantPlan ?? {}).sort(), ["broken", "shaken"], `${item.caseId} 必须登记动摇与破防两档 planned 立绘`);
    Object.values(item.callerArtVariantPlan).forEach((plan) => {
      assertEqual(plan.status, "planned", `${item.caseId} 未交付立绘必须明确标成 planned`);
      assert(["pause", "guarded"].includes(plan.fallback), `${item.caseId} planned 立绘必须有现有差分 fallback`);
    });
  });
  caseFiles.flatMap((packet) => packet.crossCaseEchoes ?? []).forEach((echo) => {
    assertNonEmptyString(echo.id, "跨案回收必须有稳定 flashback id");
    assertNonEmptyString(echo.quote, "跨案回收必须带前案原句");
    assertNonEmptyString(echo.sourceCaseLabel, "跨案回收必须显示案件编号");
  });
});

test("PACK-006", "theatrical license lurker budget stays singular", () => {
  const lurkerCases = caseFiles.filter((casePacket) => casePacket.lurkerNote !== undefined);
  assert(lurkerCases.length <= 1, `每包至多一个案子使用 lurkerNote，当前 ${lurkerCases.length} 个`);
});

test("PACK-007", "interlude NPC appearances must change evidence, route, or callback", () => {
  caseFiles.forEach((casePacket) => {
    (casePacket.nightStructure?.interlude?.actions ?? [])
      .filter((action) => action.npcVerb)
      .forEach((action) => {
        const outcomes = [...(action.choices ?? []), ...(action.options ?? [])];
        const changesPlay = (action.grantsInventory ?? []).length > 0 || outcomes.some((outcome) =>
          (outcome.grantsInventory ?? []).length > 0 || outcome.routeAxis || outcome.questionOverride
        );
        assert(changesPlay, `${casePacket.caseId} ${action.id} 让 NPC 出场却不改变材料、路线或回拨`);
      });
  });
});

test("PACK-008", "offstage helper NPC remains registered but player-hidden", () => {
  const helpers = helperRegistry.helpers ?? [];
  const vBro = helpers.find((helper) => helper.id === "v-bro");
  assert(vBro, "场下求助 NPC 注册表必须包含 v-bro");
  assertNonEmptyString(vBro.boundary, "V哥必须声明求助边界");
  assert(CONTENT_HELPER_NPCS["v-bro"], "V哥必须进入运行时内容索引");
  assert(vBro.playerVisible === false, "V哥当前必须保持玩家不可见，直到重新通过节奏验收");
  assert(CONTENT_HELPER_NPCS["v-bro"].playerVisible === false, "运行时内容索引必须保留 V哥隐藏状态");
  assert(!advisorIds.has("v-bro"), "V哥不能混入专业顾问注册表");
});

test("PACK-CALENDAR", "eight nights, deadlines, and the old bill use distinct dates", () => {
  const calendar = manifest.storyCalendar;
  assert(calendar, "试玩包必须登记统一节目日历");
  const dayMs = 86400000;
  const firstDay = Date.parse(`${calendar.firstNightDate}T00:00:00+08:00`);
  const lastDay = firstDay + (calendar.nightCount - 1) * dayMs;
  const meetingDay = Date.parse(`${calendar.workplaceMeetingDate}T00:00:00+08:00`);
  const deadline = Date.parse(calendar.platformDeadline);
  assertEqual(calendar.nightCount, caseFiles.length * 2, "四案必须占八个不同夜次");
  assertEqual(new Date(firstDay + 8 * 3600000).getUTCDay(), 1, "第一晚日历起点为周一");
  assertEqual(meetingDay, lastDay, "职场总结会在第八日，尾声不能仍说下周才开会");
  assert(deadline > lastDay + dayMs && deadline < lastDay + dayMs + 12 * 3600000, "方案期限必须落在第八晚后的次日上午");
  assertEqual(Date.parse(`${calendar.case3DinnerDate}T00:00:00+08:00`), firstDay + 6 * dayMs, "第六晚取消的饭局原定第七日周日");
  const monthNumber = (month) => Number(month.slice(0, 4)) * 12 + Number(month.slice(5, 7));
  assertEqual(monthNumber(calendar.hostMisjudgmentMonth) - monthNumber(calendar.hostStartedMonth), 6, "误判发生于开播约半年后");
  assertEqual(monthNumber(calendar.firstNightDate) - monthNumber(calendar.hostMisjudgmentMonth), 24, "两年前的误判不得与旧账单原件日期混同");
  assert(calendar.oldBillDate < `${calendar.hostStartedMonth}-01`, "2019 是较早的账单日期，不是开播后的节目日期");
  const epilogue = manifest.nightShell.epilogue;
  const opening = collectTextFrom(manifest.nightShell.prologue.lines);
  assert(opening.includes("2024 年 7 月 15 日") && opening.includes("二十三号早上九点"), "开场必须给出故事日期和不会跨周漂移的截止日");
  assert(!/下周/.test([epilogue.good, epilogue.bad, epilogue.platformCost].join(" ")), "各数据结局不得把方案期限再次推到下周");
  assert(epilogue.bad.includes("天亮后九点") && epilogue.platformCost.includes("明早九点"), "两个催方案结局都须承接同一次早九点期限");
  const workCallback = epilogue.unreadMessages.find((message) => message.caseId === "04-workplace");
  assert(workCallback.base.includes("今天开会") && !collectTextFrom(workCallback).includes("下周一"), "第八晚回访承接当天已开会，不能重发会前承诺");
  assert(epilogue.close.includes("原件日期") && epilogue.close.includes(calendar.oldBillDate) && epilogue.close.includes("直播回放索引：2022 年 7 月"), "旧账单与误判节目日期必须分别呈现给玩家");
  const work = caseFiles.find((packet) => packet.caseId === "04-workplace");
  assert(collectTextFrom(work).includes("二十二号，下周一"), "职场会议原话需与节目日历对应");
  const activityDay = Date.parse(`${calendar.workplaceActivityDate}T00:00:00+08:00`);
  assert((firstDay + 3 * dayMs - activityDay) / dayMs >= 21, "第二幕回拨时发票确已放了三个星期");
  const documentId = `LX-${calendar.workplaceActivityDate.slice(2, 4)}${calendar.workplaceActivityDate.slice(5, 7)}-018`;
  assert(work.documents.some((document) => document.rows.some((row) => row.rowId === "q04" && row.memo.includes(documentId))), "立项编号月份须与六月活动相符");
});

test("PACK-009", "document-derived timeline claims stay aligned with row dates", () => {
  caseFiles.forEach((casePacket) => assertDocumentTimelineConsistency(casePacket, casePacket.caseId));
  const creditCase = caseFiles.find((casePacket) => casePacket.caseId === "01-credit");
  assert(creditCase, "PACK-009 需要案 1 流水夹具");
  assertThrows(
    () => assertDocumentTimelineConsistency({ ...creditCase, truth: "他离职已经四十七天。" }, "01-credit fixture"),
    /没有可计算离职时长的起点行/,
    "truth 不得写 documents 无法推出的离职天数"
  );
  assertThrows(
    () => assertDocumentTimelineConsistency({ ...creditCase, truth: "贷款到账三天后，49,800 转出。" }, "01-credit fixture"),
    /07-05→07-14/,
    "truth 的贷款转出间隔必须由流水行计算"
  );
});

test("PACK-010", "every manifest role resolves to a fixed personality and voice profile", () => {
  const requiredProfileFields = ["id", "name", "kind", "caseIds", "surfaceNames", "personality", "motivation", "fear", "defense", "voice", "knowledgeBoundary"];
  const profiles = castRegistry.cast ?? [];
  const profileIds = new Set();
  assert(profiles.length > 0, "固定角色注册表不能为空");
  profiles.forEach((profile, profileIndex) => {
    requiredProfileFields.forEach((field) => assert(profile[field] !== undefined, `cast[${profileIndex}] 缺少 ${field}`));
    assertNonEmptyString(profile.id, `cast[${profileIndex}].id 不能为空`);
    assert(!profileIds.has(profile.id), `固定角色 id 重复: ${profile.id}`);
    profileIds.add(profile.id);
    assertArrayMin(profile.caseIds, 1, `${profile.id}.caseIds 不能为空`);
    assertArrayMin(profile.surfaceNames, 1, `${profile.id}.surfaceNames 不能为空`);
    assertNonEmptyString(profile.personality?.core, `${profile.id}.personality.core 不能为空`);
    assertNonEmptyString(profile.personality?.stressResponse, `${profile.id}.personality.stressResponse 不能为空`);
    assertNonEmptyString(profile.voice?.rhythm, `${profile.id}.voice.rhythm 不能为空`);
    assertArrayMin(profile.voice?.habits, 1, `${profile.id}.voice.habits 不能为空`);
    assertArrayMin(profile.voice?.avoid, 1, `${profile.id}.voice.avoid 不能为空`);
    if (["host", "caller", "respondent"].includes(profile.kind)) {
      ["nightA", "day", "nightB", "ending"].forEach((phase) => {
        assertNonEmptyString(profile.voiceArc?.[phase], `${profile.id}.voiceArc.${phase} 不能为空`);
      });
    }
    assert(CONTENT_CAST[profile.id], `${profile.id} 必须进入运行时内容索引`);
  });
  manifest.sequence.forEach((item) => {
    assertArrayMin(item.castProfileIds, 2, `${item.caseId} 必须声明逐案 castProfileIds`);
    item.castProfileIds.forEach((profileId) => {
      assert(profileIds.has(profileId), `${item.caseId} 引用了不存在的固定角色: ${profileId}`);
      assert(CONTENT_CAST[profileId], `${item.caseId}/${profileId} 未进入运行时内容索引`);
      const profile = CONTENT_CAST[profileId];
      assert(profile.caseIds.includes("*") || profile.caseIds.includes(item.caseId), `${profileId} 的 caseIds 不包含 ${item.caseId}`);
    });
    const casePacket = caseFiles.find((packet) => packet.caseId === item.caseId);
    const allowedSurfaceNames = new Set(profiles
      .filter((profile) => profile.caseIds.includes("*") || item.castProfileIds.includes(profile.id))
      .flatMap((profile) => profile.surfaceNames));
    const usedSurfaceNames = new Set();
    const visit = (value, parentKey = "") => {
      if (Array.isArray(value)) {
        if (parentKey === "cast") value.filter((entry) => typeof entry === "string").forEach((entry) => usedSurfaceNames.add(entry));
        value.forEach((entry) => visit(entry, parentKey));
        return;
      }
      if (!value || typeof value !== "object") return;
      Object.entries(value).forEach(([key, entry]) => {
        if (key === "speaker" && typeof entry === "string") usedSurfaceNames.add(entry);
        if (key === "speakerProfileId" && typeof entry === "string") {
          assert(profileIds.has(entry), `${item.caseId} 引用了不存在的 speakerProfileId: ${entry}`);
          const profile = profiles.find((candidate) => candidate.id === entry);
          assert(item.castProfileIds.includes(entry) || profile?.caseIds?.includes("*"), `${item.caseId}/${entry} 必须进入 manifest castProfileIds 或声明为全局角色`);
        }
        visit(entry, key);
      });
    };
    visit(casePacket);
    for (const surfaceName of usedSurfaceNames) {
      assert(allowedSurfaceNames.has(surfaceName), `${item.caseId} 的出声者“${surfaceName}”没有逐案固定声纹卡`);
    }
  });
  for (const advisorId of advisorIds) assert(profileIds.has(advisorId), `顾问 ${advisorId} 缺少固定声纹卡`);
  for (const helper of helperRegistry.helpers ?? []) assert(profileIds.has(helper.id), `求助 NPC ${helper.id} 缺少固定声纹卡`);
});

test("PACK-011", "player-visible NPC material keeps structured voice attribution", () => {
  const profilesById = new Map((castRegistry.cast ?? []).map((profile) => [profile.id, profile]));
  caseFiles.forEach((casePacket) => {
    for (const hook of casePacket.investigationHooks ?? []) {
      const hasProfile = typeof hook.speakerProfileId === "string" && hook.speakerProfileId.length > 0;
      const isDocument = hook.voiceAttribution === "document";
      assert(hasProfile || isDocument, `${casePacket.caseId}/${hook.id} 必须声明 speakerProfileId 或 voiceAttribution=document`);
      if (hasProfile) assert(profilesById.has(hook.speakerProfileId), `${casePacket.caseId}/${hook.id} 的 speakerProfileId 不存在`);
    }
    for (const action of casePacket.nightStructure?.interlude?.actions ?? []) {
      for (const option of action.options ?? []) {
        if (!option.advisorLine) continue;
        assertNonEmptyString(option.advisorId, `${casePacket.caseId}/${action.id}/${option.id} 有 advisorLine 时必须声明 advisorId`);
        assert(profilesById.get(option.advisorId)?.kind === "advisor", `${casePacket.caseId}/${option.id} 的 advisorId 必须指向顾问声纹卡`);
      }
    }
  });
});

test("PACK-012", "epilogue unread callbacks stay typed, attributed, and non-evidentiary", () => {
  const messages = manifest.nightShell?.epilogue?.unreadMessages ?? [];
  const profilesById = new Map((castRegistry.cast ?? []).map((profile) => [profile.id, profile]));
  assertEqual(messages.length, 5, "尾声必须有四条案件回访和一条陌生号码");
  assertEqual(messages.filter((message) => message.caseId).length, 4, "前四条必须逐案回访");
  assertEqual(messages.filter((message) => message.attachment).length, 2, "仅灯箱照和群名片使用图片占位");
  messages.forEach((message, index) => {
    assertNonEmptyString(message.base, `epilogue.unreadMessages[${index}].base 不能为空`);
    assertNonEmptyString(message.speakerProfileId, `epilogue.unreadMessages[${index}] 必须固定声纹`);
    assert(profilesById.has(message.speakerProfileId), `epilogue.unreadMessages[${index}] speakerProfileId 不存在`);
    const typedStrings = [message.base, ...Object.values(message.echoes ?? {})];
    assert(typedStrings.every((text) => !/[,:;]/.test(text)), `epilogue.unreadMessages[${index}] 打字面必须统一使用中文全角标点`);
    assert(typedStrings.every((text) => !/3301|王\*\*|新阳信贷|返点账户|学费来源/.test(text)), `epilogue.unreadMessages[${index}] 不得夹带未决事实或新证据`);
    if (message.caseId) {
      assertDeepEqual(Object.keys(message.echoes ?? {}), ["pragmatic", "affirm", "accompany"], `epilogue.unreadMessages[${index}] 必须回声三种关怀选择`);
      const manifestItem = manifest.sequence.find((item) => item.caseId === message.caseId);
      assert(manifestItem?.castProfileIds?.includes(message.speakerProfileId), `${message.caseId}/${message.speakerProfileId} 必须进入逐案 castProfileIds`);
    } else {
      assert(!message.echoes, "陌生号码不得有选择回声");
      assert(manifest.sequence.some((item) => item.castProfileIds?.includes(message.speakerProfileId)), "陌生号码也必须进入固定角色表");
    }
  });
  const caseTwoCallback = messages.find((message) => message.caseId === "02-tony");
  assert(caseTwoCallback?.base?.includes("周把转账和回单原图又交了一遍") && caseTwoCallback?.base?.includes("我也把自己的聊天和十二万转账交了"), "案二尾声必须有一次已经发生的分别留证动作，不能只停在建群或准备行动");
  assert(caseTwoCallback?.base?.includes("没去店里堵人"), "案二行动落地必须保持克制，不能写成胜利式围堵");
  const caseOneCallback = messages.find((message) => message.caseId === "01-credit");
  assert(caseOneCallback?.base?.includes("二十万现在动不了") && caseOneCallback?.base?.includes("什么时候能拿回来他也不知道"), "宸直新闻后必须回到案一人物，同时保留清偿时间未知");
  assert(caseTwoCallback?.base?.includes("Tony 还是只说已经提交") && caseTwoCallback?.base?.includes("到底进没进产品，还是不知道"), "宸直新闻后必须回到案二材料，同时保留资金是否入产品未知");
});

test("PACK-012B", "the cafe closes after hotel and money disputes; testing stays in the aftermath", () => {
  const prologue = manifest.nightShell?.cafePrologue ?? {};
  const cafeText = collectTextFrom(prologue.cafe);
  const aftermathText = collectTextFrom(prologue.aftermath);
  const forensicText = collectTextFrom(prologue.forensic);
  const parentageRequest = prologue.cafe?.legalRequests?.items?.find((item) => item.id === "parentage-and-child-contact") ?? {};
  const parentageBlockText = collectTextFrom(prologue.cafe?.parentageBlockLines ?? []);
  const sameNightZhaoLine = (prologue.aftermath?.openingLines ?? []).filter((line) => line.speakerProfileId === "zhao-lawyer").map((line) => line.text ?? "").join(" ");
  const sameNightHostLine = (prologue.aftermath?.openingLines ?? []).filter((line) => line.speakerProfileId === "host-lin-xuyang").map((line) => line.text ?? "").join(" ");
  assertEqual(prologue.id, "prologue-cafe-opening", "咖啡厅必须登记为试玩开篇，不能保留半年后终章 id");
  assertEqual(prologue.timeline, "现在 · 傍晚", "咖啡厅必须在现在开场，四宗热线属于两年前的回忆");
  assertEqual(prologue.title, "序章", "咖啡厅开篇只保留序章题名，不得再挂‘还有一笔账’一类作者标题");
  assertEqual(prologue.cafe?.evidencePair?.length, 2, "咖啡厅第一步必须由聊天定位与酒店订单两页共同成立");
  assertDeepEqual(prologue.cafe?.evidencePair?.map((item) => item.id), ["chat", "hotel"], "咖啡厅对时材料顺序必须稳定");
  assert(prologue.cafe?.firstClaim?.includes("没去澜桥酒店") && prologue.cafe?.moneyClaim?.includes("没转过钱"), "咖啡厅必须保留两句可由玩家亲手缩窄的否认");
  const hotelEvidenceText = collectTextFrom(prologue.cafe?.evidencePair ?? []);
  assert(hotelEvidenceText.includes("你怎么会有我手机里的截图") && hotelEvidenceText.includes("平板还登着你的账号"), "聊天截图第一次摊开时必须由妻子追问来源，并由男方当场交代取得路径");
  assert(cafeText.includes("你和妻子赵律师按约来到咖啡厅") && cafeText.includes("林老师，赵律师"), "赵律师必须以林旭阳妻子的身份同行到场，不能留在免提里");
  assert(cafeText.includes("我准备离婚") && cafeText.includes("孩子以后怎么安排"), "玩家第一次操作前必须听懂男方的离婚诉求和孩子安排冲突");
  assert(cafeText.includes("离婚可以谈") && cafeText.includes("孩子的事没什么好谈的"), "开篇必须让妻子当场反击，把家庭争议和录像压力同时推起来");
  const openingSpokenText = collectTextFrom((prologue.cafe?.openingLines ?? []).filter((line) => line.type !== "narration" && line.type !== "stage"));
  assert(!openingSpokenText.includes("三页") && !openingSpokenText.includes("哪三页"), "人物不得替教学界面朗读材料页数");
  assert(!openingSpokenText.includes("昨天也说好了") && !openingSpokenText.includes("镜头先压到桌面"), "录像边界必须由人物当场接话，不能写成免责声明或导演口令");
  assert(openingSpokenText.includes("省得后面谁说了又不承认") && openingSpokenText.includes("你们不点头") && openingSpokenText.includes("不会发"), "林旭阳必须用口语说明录像用途和发布前确认");
  assert(prologue.cafe.revisedAccountLines.some(line => line.speaker === "男方" && line.text.includes("转账通知")), "转账对质前必须交代男方取得材料的来源");
  const revisedAccountText = collectTextFrom(prologue.cafe?.revisedAccountLines ?? []);
  assert(revisedAccountText.includes("自己住的酒店") && revisedAccountText.includes("住了一晚") && revisedAccountText.includes("没转过钱"), "第二段说法必须先承认入住，再用独住和无转账重建整套解释");
  assertEqual(prologue.cafe?.revisedClaimStatements?.length, 4, "第二段说法必须摊成四句可选原话");
  assertEqual(prologue.cafe?.revisedClaimStatements?.find((statement) => statement.correct)?.id, "money-denial", "第二轮必须由玩家点中新的转账否认，不能自动替玩家跳到流水");
  assert(prologue.cafe?.evidencePair?.every((item) => /\d{2}:\d{2}/.test(item.detail ?? "")), "两张对时材料必须直接呈现原始时间字段");
  assert((prologue.cafe?.transferEvidence?.rows ?? []).length === 3, "转账材料必须把三笔原始记录逐行呈现");
  assert(!(prologue.cafe?.transferEvidence?.detail ?? "").includes("与聊天联系人同名"), "转账卡不得直接写跨材料同名推断");
  assert(!cafeText.includes("赵律师（免提）"), "咖啡厅不得残留赵律师远程免提设定");
  assertEqual(prologue.cafe?.legalRequests?.items?.length, 3, "咖啡厅必须把离婚、共同财产和亲子／孩子见面诉求拆成三项");
  assertDeepEqual(prologue.cafe?.legalRequests?.items?.map((item) => item.id), ["divorce-evidence", "marital-property", "parentage-and-child-contact"], "三项法律诉求的顺序与用途必须稳定");
  const zhaoRole = prologue.cafe?.legalRequests?.zhaoRole ?? "";
  assert(zhaoRole.includes("接受男方当场咨询") && zhaoRole.includes("不代理诉讼") && cafeText.includes("他请我来") && !cafeText.includes("还没到起诉离婚的程度") && forensicText.includes("双方委托的") && forensicText.includes("不是法院委托的"), "赵律师协助谈判但不替男方决定诉讼；鉴定意见须说明双方委托及法院审查边界");
  const legalRequestText = collectTextFrom(prologue.cafe?.legalRequests ?? {});
  assert(legalRequestText.includes("原手机") && legalRequestText.includes("申请财产保全") && parentageRequest.request?.includes("现场采样"), "法律诉求记录必须登记电子材料、财产保全与亲子初检三条可行路径，现场口播不朗读操作清单");
  assert(prologue.cafe.legalRequests.items.every((item) => item.request && item.nextAction && item.boundary), "每项法律诉求都必须同时登记请求、下一步和证明上限");
  assert(parentageRequest.nextAction?.includes("初步材料") && parentageRequest.boundary?.includes("不能直接改变法律亲子关系"), "亲子诉求板必须先登记个人委托初检，并保留其法律效力边界");
  assertEqual(parentageBlockText, "", "桌边只有酒店与转账两层，不得恢复亲子对质第三环");
  assert(!parentageBlockText.includes("个人委托") && !parentageBlockText.includes("最可行的一步"), "个人委托初检路径不得在女方与镜头面前公开讨论");
  assert(!cafeText.includes("排除生物学父子关系"), "亲子技术结果不得在咖啡厅公开出现");
  assert(cafeText.includes("断章取义") && cafeText.includes("先发原片") && prologue.cafe?.pressureChoices?.length === 1, "录像中断必须让表哥拿出自己的录屏，关掉录像后只保留真实可执行的继续谈");
  assert(!cafeText.includes("礼物") && !cafeText.includes("直播间") && !cafeText.includes("停播"), "咖啡厅是预录谈判素材，不得混入直播打赏或现场停播逻辑");
  assert(aftermathText.includes("三笔钱都是借款") && aftermathText.includes("敢乱剪辑做视频") && aftermathText.includes("孩子的事也没什么好说的"), "妻子离场后必须继续否认并回应公开风险，不能在咖啡厅命中后立即完整认错");
  assert(sameNightZhaoLine.includes("材料") && sameNightHostLine.includes("机构的公开联系方式") && sameNightHostLine.includes("需要谁到场"), "散场后保留机构咨询与材料交接，不强制重复法律讲解");
  assert(sameNightHostLine.includes("哪些能用，也先问机构") && sameNightHostLine.includes("到家给我打个电话"), "林旭阳必须让男方按机构意见行动，同时守住不追人、不碰孩子的边界");
  assert(aftermathText.indexOf("机构的公开联系方式") < aftermathText.indexOf("沙发靠背缝里还有个硅胶咬胶"), "先交代主播推荐机构，男方到家后再报告咬胶");
  assertDeepEqual(prologue.aftermath?.routes?.map((route) => route.id), ["toy", "account"], "序章后续必须按旧物、家庭账的顺序处理");
  assert(aftermathText.includes("硅胶咬胶") && aftermathText.includes("个人委托") && aftermathText.includes("固定同额转出"), "同晚保留两项交接来源；司法结果仍须等后续材料");
  const accountRouteText = collectTextFrom(prologue.aftermath?.routes?.find((route) => route.id === "account") ?? {});
  assert(accountRouteText.includes("在我名下") && accountRouteText.includes("明细我能下载") && accountRouteText.includes("周会计"), "家庭账路线必须先说明账户属于男方、材料由本人下载，并明确不碰妻子个人账户");
  assert(accountRouteText.includes("我自己去银行APP里下"), "电子回单必须由账户本人取得，不能让主播或顾问凭空等待银行材料");
  assert(!aftermathText.includes("等完整回单") && !forensicText.includes("完整回单只多核"), "序章不得把节目组写成能向银行或执法机关调取回单的主体");
  assert(forensicText.includes("双方带孩子到机构") && forensicText.includes("现场采样") && forensicText.includes("没有用那只咬胶") && forensicText.includes("排除生物学父子关系"), "鉴定结果必须来自双方同意、身份核验及现场采样，不能用不明旧物替代");
  assert(forensicText.indexOf("随后同意") < forensicText.indexOf("现场采样") && forensicText.indexOf("现场采样") < forensicText.indexOf("排除生物学父子关系"), "同意和现场采样须先于结果披露");
  assert(forensicText.includes("得由法院决定") && forensicText.includes("孩子以后怎么安排，你们跟律师私下谈"), "初步意见不得越级写成法院必然准许鉴定或法律亲子关系已经改变");
  assert(forensicText.includes("从自己的银行APP里下来了") && forensicText.includes("收款人不是顾*"), "鉴定结果后的收款户名反证必须来自男方本人下载的电子回单");
  assert(forensicText.indexOf("排除生物学父子关系") < forensicText.indexOf("收款人不是顾*"), "先交亲子技术结果，再挂家庭账新债");
  assert((prologue.truthBoundary?.unknown ?? []).some((line) => line.includes("生物学父亲")), "尾声必须保留生父身份未知");
  assert((prologue.truthBoundary?.unknown ?? []).some((line) => line.includes("女方何时知道") && line.includes("为什么仍然结婚")), "玩家边界必须保留女方知情时间与婚姻目的尚未证明");
  assert((prologue.truthBoundary?.unknown ?? []).some((line) => line.includes("固定转账")), "尾声必须保留固定转账收款人与缘由未知");
  assert(prologue.puzzleLedger?.failureBoundary?.includes("不能在咖啡厅公开亲子结果") && prologue.puzzleLedger?.failureBoundary?.includes("不能用鉴定结果倒推女方何时知道"), "谜题耦合账本必须登记咖啡厅亲子红线与动机证明边界");
  assert(prologue.authorTruth?.wifePregnancyKnowledge?.includes("怀孕时已经知道孩子不是男方的"), "作者真相必须锁定女方在怀孕时已经知道非亲生");
  assert(prologue.authorTruth?.wifeMarriageMotive?.includes("取得婚内钱款后离开"), "作者真相必须锁定女方结婚是为了取得钱款后离开");
  assert(prologue.authorTruth?.disclosureBoundary?.includes("不能证明女方此前何时知情或为何结婚"), "作者真相不得越级进入试玩事实结论");
  assert(!`${cafeText}\n${aftermathText}\n${forensicText}`.includes("目的就是取得婚内钱款后离开"), "女方真实婚姻目的不得在现有玩家可见对话中无证据说破");
  assertEqual(prologue.rageBaitContract?.debts?.length, 2, "咖啡厅序章的两笔拱火债都必须登记付息与结清位置");
});

test("PACK-013", "warmth props close their arcs and the personal livestream stays solo", () => {
  const hostProfile = castRegistry.cast?.find((profile) => profile.id === "host-lin-xuyang");
  assertEqual(hostProfile?.gender, "男", "主播性别背景必须固定");
  assertEqual(hostProfile?.age, 33, "主播年龄背景必须固定为三十三岁");
  assertEqual(hostProfile?.formerOccupation, "互联网大厂法务", "主播前职业不得退回媒体机构从业者");
  assertEqual(hostProfile?.streamerTenure, "两年半", "主播年限必须固定为两年半");
  assertEqual(hostProfile?.relationships?.find((relationship) => relationship.with === "zhao-lawyer")?.publicLabel, "妻子", "赵律师与林旭阳的关系必须保持夫妻设定");
  assert(hostProfile?.personality?.stressResponse?.includes("收笑") && !hostProfile?.voice?.avoid?.includes("提前猜动机"), "主播遇到具体绕答即可加压，人物档案不得恢复禁止推测动机的旧规则");
  assert(hostProfile?.voice?.habits?.some((habit) => habit.includes("点名具体伤害")), "主播声纹必须允许直接指出行为与目的，不等待本人认错");
  assert(hostProfile?.voice?.avoid?.includes("把克制写成没有立场"), "主播不得重新退回没有立场的逻辑机器");
  const zhaoProfile = castRegistry.cast?.find((profile) => profile.id === "zhao-lawyer");
  assertEqual(zhaoProfile?.occupation, "执业律师", "赵律师的职业必须固定为执业律师");
  assert(hostProfile?.relationships?.find((relationship) => relationship.with === "zhao-lawyer")?.dynamic?.includes("大学同学"), "林旭阳与赵律师的大学同学关系必须写入固定人物档案");
  const openingLines = manifest.nightShell?.prologue?.lines ?? [];
  const backgroundLine = openingLines.find((line) => line.type === "background" && line.speaker === "林旭阳");
  const spouseMessage = openingLines.find((line) => line.speaker === "老婆的微信");
  const producerLine = openingLines.find((line) => line.speakerProfileId === "producer-lao-fang");
  assert(producerLine?.speaker.includes("现场") && openingLines.some((line) => line.text?.includes("老方正站在桌边")), "老方观察工牌必须有现场依据");
  assertEqual(backgroundLine?.speaker, "林旭阳", "开播前最后一个准备动作必须由主播本人接住");
  assert(openingLines.some((line) => line.type === "narration" && line.text?.includes("工牌") && line.text?.includes("戴上耳机")), "开篇准备动作须放在旁白，不能由主播朗读自己的动作");
  assertEqual(spouseMessage?.speakerProfileId, "zhao-lawyer", "序章生活消息必须绑定赵律师角色档案，不靠履历独白硬塞关系");
  assert(!openingLines.some((line) => line.text?.includes("三十三岁了") || line.text?.includes("一晃两年半")), "开篇不得在进门动作中一次性朗读主播履历");
  const prologueText = spouseMessage?.text ?? "";
  const caseThreeInterlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === "03-profile");
  const epilogue = manifest.nightShell?.epilogue ?? {};
  assert(prologueText.includes("汤在冰箱"), "汤弧线缺少序章留下拍");
  assert(caseThreeInterlude?.afterLines?.some((line) => line.text?.includes("热过的汤")), "汤弧线缺少案间在场拍");
  assert(epilogue.home?.includes("保温盒空了。你顺手洗了"), "汤弧线缺少回家收尾拍，且必须保持玩家第一人称行动视角");
  assert(epilogue.platformCost?.includes("推荐位没了"), "玩家顶住平台压力后，终局必须显示推荐位代价，不能仍由总分覆盖");
  assert(prologueText.includes("有个东西我塞你包里了"), "赵律师序章留言必须像恋人托放东西，不得写成材料交接");
  assert(!prologueText.includes("案卷") && !prologueText.includes("收播后再看"), "赵律师私下留言不得使用案卷交接腔");
  assert(epilogue.close?.includes("从包里拿出那个牛皮纸文件袋"), "文件袋必须回收序章的生活化托放动作");
  assert(epilogue.opening?.includes("你摘下耳机"), "整晚尾声必须继续让玩家以林旭阳的身份行动，不能突然退回旁观视角");
  assert(epilogue.close?.startsWith("你从包里"), "正式版钩子的最后一个动作必须由玩家亲手完成");
  assert(epilogue.close?.includes("你两年前没问完的那通"), "文件袋便签没有形成正式版主线钩子");
  assert(!epilogue.close?.includes("留给后续正式内容"), "玩家可见文件袋不得夹带编剧说明");
  const goLiveLine = manifest.nightShell?.prologue?.coldOpen?.setupLines?.find((line) => line.type === "stage" && line.text?.includes("开始直播"));
  const streamStartLine = manifest.nightShell?.prologue?.lines?.find((line) => line.type === "narration" && line.text?.includes("推开直播间的门"));
  assert(streamStartLine?.text?.includes("晚上八点，你推开直播间的门"), "普通情感连麦必须从晚上八点开播，允许前置日历日期");
  assert(streamStartLine?.text?.includes("你推开直播间的门"), "运行时序幕舞台动作必须使用第二人称，把玩家和林旭阳保持为同一行动者");
  assert(!collectTextFrom(manifest.nightShell?.prologue).includes("凌晨一点"), "序幕不得残留凌晨一点开播设定");
  assertEqual(goLiveLine?.speaker, "旁白", "个人主播开播倒计时必须写成舞台动作，不得成为工作人员台词");
  assertEqual(goLiveLine?.audioCueId, "sfx.broadcast.on-air", "个人主播开播只允许平台提示音，不得使用人声倒数");
  const authoredContent = JSON.stringify({ manifest, caseFiles });
  assert(!authoredContent.includes("导播"), "个人主播内容包不得出现导播角色或导播动作");
  assert(!authoredContent.includes("三、二、一"), "个人主播内容包不得出现电视台式人声倒数");
  assert(!authoredContent.includes('"role":"director"') && !authoredContent.includes('"speakerProfileId":"director"'), "个人主播内容包不得保留导播运行时角色");
  const caseThree = caseFiles.find((packet) => packet.caseId === "03-profile");
});

test("PACK-014", "cross-case public shocks keep a seeded promise and a non-retroactive boundary", () => {
  const entities = manifest.fictionalEntities ?? [];
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  assertEqual(entitiesById.size, entities.length, "虚构机构 id 不得重复");
  entities.forEach((entity, index) => {
    assertNonEmptyString(entity.id, `fictionalEntities[${index}].id 不能为空`);
    assertNonEmptyString(entity.displayName, `fictionalEntities[${index}].displayName 不能为空`);
    assertEqual(entity.fictional, true, `${entity.id} 必须明确标记为虚构机构`);
  });

  const sequenceIndex = new Map(manifest.sequence.map((item, index) => [item.caseId, index]));
  const interludesByCaseId = new Map((manifest.nightShell?.interludes ?? []).map((item) => [item.afterCaseId, item]));
  for (const promise of manifest.crossCasePromises ?? []) {
    const entity = entitiesById.get(promise.entityId);
    assert(entity, `${promise.id} 指向不存在的虚构机构`);
    assertEqual(promise.status, "paid-off", `${promise.id} 必须明确登记回收状态`);
    const seedCase = caseFiles.find((packet) => packet.caseId === promise.seed?.caseId);
    const seedDocument = seedCase?.documents?.find((document) => document.id === promise.seed?.documentId);
    const seedRows = new Set((seedDocument?.rows ?? []).map((row) => row.rowId));
    assert(seedCase && seedDocument, `${promise.id} 的种子案件或材料不存在`);
    for (const rowId of promise.seed?.rowIds ?? []) assert(seedRows.has(rowId), `${promise.id} 的种子行 ${rowId} 不存在`);
    assert(sequenceIndex.get(promise.payoff?.afterCaseId) > sequenceIndex.get(promise.seed?.caseId), `${promise.id} 必须在后案回收，不能当场宣布结果`);

    const reinforcement = interludesByCaseId.get(promise.reinforcement?.afterCaseId);
    assert(JSON.stringify(reinforcement ?? {}).includes(entity.displayName), `${promise.id} 的案尾加固没有提到 ${entity.displayName}`);
    const payoffInterlude = interludesByCaseId.get(promise.payoff?.afterCaseId);
    const worldEcho = payoffInterlude?.worldEcho;
    assertEqual(worldEcho?.id, promise.payoff?.worldEchoId, `${promise.id} 的世界回声 id 不匹配`);
    assertEqual(worldEcho?.promiseId, promise.id, `${promise.id} 的世界回声没有反向登记承诺`);
    ["kicker", "actionLabel", "headline", "body", "proves", "doesNotProve"].forEach((field) => {
      assertNonEmptyString(worldEcho?.[field], `${promise.id}.worldEcho.${field} 不能为空`);
    });
    assert(worldEcho.doesNotProve.includes("不能"), `${promise.id} 必须明写不能倒推的事实边界`);
    assert(worldEcho.proves !== worldEcho.doesNotProve, `${promise.id} 必须区分公共事件与个案证明力`);
  }

  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const bankFlow = caseOne.documents.find((document) => document.id === "case1-bank-flow");
  const rowsById = new Map(bankFlow.rows.map((row) => [row.rowId, row]));
  assertEqual(rowsById.get("r13")?.amount, "¥200,000", "案一必须有二十万金融服务借款入账");
  assertEqual(rowsById.get("r14")?.amount, "¥100,000", "案一必须有第一笔十万信托认购");
  assertEqual(rowsById.get("r15")?.amount, "¥100,000", "案一必须有第二笔十万信托认购");
  const loanScene = caseOne.sceneVersions.find(scene => scene.id === "credit-bank-flow");
  const loanLines = loanScene.beforeVersion.lines;
  const loanReceipt = loanLines.findIndex(line => line.role === "stage" && /男方.*回复.*借款/.test(line.text));
  const loanUse = loanLines.findIndex(line => line.role === "host" && /承认.*借二十万/.test(line.text));
  assert(loanReceipt >= 0 && loanUse > loanReceipt, "借款用途先收到男方材料，再由主播转述，不能倒推相邻转账");
  assertEqual((bankFlow.crossQuestions ?? []).length, 0, "不再逐行组合后重复问同一笔借款");

  const trustPromise = (manifest.crossCasePromises ?? []).find((promise) => promise.id === "chenzhi-trust-payment-crisis");
  assertEqual(trustPromise?.corporateSeed?.caseId, "04-workplace", "宸直企业线必须在职场案落下共享硬件公司种子");
  assertEqual(trustPromise?.corporateSeed?.entityId, "qixing-shared-tech", "职场案企业种子必须指向虚构的栖行共享科技");
  ["包干", "层层返费", "押金", "关联往来"].forEach((anchor) => {
    assert(trustPromise?.corporateSeed?.anchors?.includes(anchor), `栖行企业种子缺少 ${anchor} 锚点`);
  });
  assertEqual(trustPromise?.secondarySeed?.caseId, "02-tony", "宸直线后段代投种子必须登记在 Tony 案");
  assertDeepEqual(trustPromise?.secondarySeed?.anchors, ["名单", "十二万", "走我户", "宸直信托"], "Tony 案种子必须登记名单、金额、代投口径和机构四个锚点");
  assertEqual(trustPromise?.tertiarySeed?.caseId, "03-profile", "宸直线第三个案内种子必须登记在案三女方家庭未到期资产");
  assertDeepEqual(trustPromise?.tertiarySeed?.anchors, ["二十八万八", "三十万", "九月底到期", "宸直"], "案三种子必须登记彩礼、金额、期限和机构四个锚点");
  assertEqual(trustPromise?.payoff?.afterCaseId, "02-tony", "宸直线必须到最后一通 Tony 案结尾才正式爆发");

  const caseThree = caseFiles.find((packet) => packet.caseId === "03-profile");
  const caseThreeText = JSON.stringify(caseThree ?? {});
  const caseThreeFundsDocument = caseThree?.documents?.find((document) => document.id === "case3-credential-balance");
  const caseThreeRows = new Map((caseThreeFundsDocument?.rows ?? []).map((row) => [row.rowId, row]));
  assert(caseThreeText.includes("二十三万八") && caseThreeText.includes("自己交"), "案三必须明确 MBA 学费由男方本人承担");
  assert(caseThreeText.includes("二十八万八") && caseThreeText.includes("二十八万六"), "案三必须把彩礼要求与男方资金上限放在同一条因果链");
  assert(caseThreeText.includes("宸直") && caseThreeText.includes("九月底到期"), "案三必须在正式暴雷前种下女方家庭未到期资产的期限边界");
  assert(caseThree?.selfServingOmission?.includes("领证前进自己的个人账户") && caseThree?.selfServingOmission?.includes("婚宴和首饰另算"), "案三重大隐瞒必须包含彩礼的收款账户、支付时点和另算项目");
  assert(caseThree?.selfServingOmission?.includes("八万四") && caseThree?.selfServingOmission?.includes("先留在女方一侧"), "案三重大隐瞒必须包含咨询者自己的存款和女方资金用途");
  assert(!caseThree?.selfServingOmission?.includes("没有说母亲已经托介绍人问二十八万八"), "案三不得把开场已经承认的彩礼传话继续登记成隐瞒");
  assert(caseThree?.truthBoundary?.unknown?.some((item) => item.includes("九月底") && item.includes("兑付")), "案三不得提前结算宸直兑付结果");
  assertEqual(caseThreeRows.get("p06")?.memo, "从下述 30 万宸直中划出；到期后给女儿自己留着", "案三父亲口头安排的二十万必须属于下述三十万宸直，并保留给女儿个人的用途");
  assert(caseThreeRows.get("p04")?.memo?.includes("领证前转入女方个人账户"), "案三彩礼行必须写清支付时点和收款账户");
  assert(caseThreeRows.get("p07")?.memo?.includes("不包含在 28.8 万内") && caseThreeRows.get("p07")?.memo?.includes("男方另行承担"), "案三材料必须单列婚宴与首饰，不得压进彩礼总词");
  assertEqual(caseThreeRows.get("p05")?.amount, "¥300,000", "案三宸直持有页仍须保留三十万元原始金额");
  const profileMotiveScene = caseThree?.sceneVersions?.find((scene) => scene.id === "profile-caller-repeats-label");
  const profileMotiveQuestion = profileMotiveScene?.questionOptions?.find((option) => option.correct);
  const profileMotiveText = JSON.stringify({
    version: profileMotiveScene?.version,
    afterVersion: profileMotiveScene?.afterVersion,
    question: profileMotiveQuestion,
    judgement: caseThree?.stageJudgement,
    closingBeats: caseThree?.caseClosing?.beats,
    confirmed: caseThree?.caseClosing?.confirmed
  });
  assert(profileMotiveText.includes("父母都是普通上班") && profileMotiveText.includes("婚房也帮不上"), "案三必须由父母调查问出男方普通家境，不能只停在 MBA 标签");
  assert(profileMotiveQuestion?.correct === true && /彩礼就(?:该多拿|多拿|多问|多)一点/.test(profileMotiveText), "案三父母必须借家境落差加价，不能继续把它写成单纯受骗反应");
  assert(profileMotiveQuestion?.question?.includes("你也这么想"), "案三承重追问继续问咨询者自己的态度，不由按钮替玩家归纳");
  assert(profileMotiveText.includes("工作和家庭更稳") && /彩礼就(?:该多拿|多拿|多问|多)一点/.test(profileMotiveText), "案三必须问出她把工作家庭差距当作多拿彩礼的理由，不凭作者设定断言日常付出观");

  const firstTailText = JSON.stringify(interludesByCaseId.get("01-credit") ?? {});
  assert(firstTailText.includes("收益") && firstTailText.includes("兑付纠纷"), "案一小尾声必须由赵律师补入高收益合同风险");
  assert(firstTailText.includes("合同") && firstTailText.includes("借款利息"), "案一尾声研究借款成本与产品兑付安排，不提前讲完整资金链");

  const caseTwo = caseFiles.find((packet) => packet.caseId === "02-tony");
  const tonyVoiceScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-exclusive-voice");
  const tonyVoiceQuestions = JSON.stringify(tonyVoiceScene?.casualQuestions ?? []);
  assert(tonyVoiceQuestions.includes("也就你肯听我说这些") && tonyVoiceQuestions.includes("那条语音我一直留着"), "案二必须在玩家追问后说清语音由 Tony 发来、咨询者一直保存，不能把“留过”写成来源不明");
  assert(!tonyVoiceScene?.version?.includes("我留过一条语音"), "案二语音来源不得退回录制者与保存者混淆的说法");
  const hangupScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-bar-rumor-hangup");
  const hangupCloserLines = hangupScene?.sceneCloser?.lines ?? [];
  const hangupCloserText = hangupCloserLines.map((line) => line.text ?? "").join(" ");
  assert(hangupCloserText.includes("窗外忽然扫进一片白光") && hangupCloserText.includes("门外传来两下敲门声"), "案二第一夜场尾必须按强光、拉帘和敲门留下开放边");
  assert(hangupCloserLines.some((line) => line.audioCueId === "sfx.case2.door-knock"), "案二第一夜敲门必须接入专属音效");
  assert(caseTwo?.nightStructure?.hangup?.hostLine?.includes("确认安全"), "案二独立挂断页必须让主播先确认安全");
  assert(!hangupCloserText.includes("警笛") && !/警车|民警|警察|报案|高利贷/.test(hangupCloserText), "案二第一夜不得用警笛或身份词提前解释来讯");
  assert(!JSON.stringify(caseOne).includes("警笛") && !JSON.stringify(caseOne).includes("sfx.case2.door-knock"), "案一不得出现警笛文字或案二专属敲门音效");
  const caseOneDeviceScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-bank-flow");
  const caseOneDeviceText = JSON.stringify(caseOneDeviceScene ?? {});
  assert(caseOne.sceneVersions[2].version.includes("设备，在我家"), "第一夜已经承认设备由她使用，不在第二夜重复审归属");
  assert(!/把灯拖过来|金属灯架|拍到凌晨一点|开箱那晚|sfx\.case1\.lamp-drag/.test(caseOneDeviceText), "案一不得再用拖灯、开箱补演或音效重复证明设备归属");
  assertEqual(hangupScene?.closureContract?.openEdge, "昨晚是谁敲门，她为什么立刻下线，来人跟她隐瞒的钱有没有关系。", "案二敲门场尾必须登记明确开放边");
  const caseTwoHangupLine = caseTwo?.nightStructure?.hangup?.line ?? "";
  assert(caseTwoHangupLine.includes("真有事") && caseTwoHangupLine.includes("明天再说"), "案二挂断页必须承接敲门并保留含糊借口");
  assert(!/亮|帘/.test(caseTwoHangupLine), "案二挂断页不得重复上一屏已经演过的动作");
  assert(caseTwo?.nightStructure?.hangup?.hostLine?.includes("确认安全"), "案二挂断页必须让主播先处理当下安全");
  assert(!/民警|警察|警车|报案|酒吧|高利贷/.test(JSON.stringify(caseTwo?.nightStructure?.hangup ?? {})), "案二第一夜不能提前揭晓来人或职业");
  assert(/电话.*断/.test(caseTwo?.overnightStructure?.hangupLine ?? ""), "案二隔夜结构必须保留突然断线的动作结果");

  const returnLeadLines = caseTwo?.overnightStructure?.returnLead?.lines ?? [];
  const returnLeadText = returnLeadLines.map((line) => line.text ?? "").join(" ");
  assert(returnLeadText.includes("十二万"), "案二回拨尽快回到追款，门口来人不占主位");
  assert(returnLeadText.includes("你现在安全吗") && returnLeadText.includes("安全"), "案二主播追问前必须先接住咨询者当下的安全处境");
  assert(!/酒吧|宸直|高利贷/.test(returnLeadText), "案二回拨先行拍不得自动交出玩家应问出的来人、职业和资金答案");

  const whoMessagedScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-who-messaged");
  const whoMessagedText = JSON.stringify(whoMessagedScene ?? {});
  assert(/警察.*借款/.test(whoMessagedScene.version) && whoMessagedScene.version.includes("没问 Tony"), "必经陈述先区分警方核实与 Tony 收款");
  const moneyQuestion = whoMessagedScene.questionOptions.find(option => whoMessagedScene.questionSequence.includes(option.id));
  assert(moneyQuestion?.correct && /十二万/.test(moneyQuestion.question), "警方过场之后直接追她今晚要回的钱");
  assert(/酒吧/.test(moneyQuestion.answer) && /小姐妹|酒桌/.test(moneyQuestion.answer), "高息来源在必经回答，不只存在作者备注");

  const trustBeat = caseTwo?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "tony-trust-screenshot-followup");
  const trustText = (trustBeat?.lines ?? []).map((line) => line.text ?? "").join(" ");
  assert(trustBeat?.beforeSceneIndex > caseTwo?.nightStructure?.segment2SceneIndexes?.[0], "案二宸直补充材料必须晚于首个夜 B 正式场景");
  assert(trustText.includes("宸直") && trustText.includes("认购回单"), "案二后段独立拍必须带出同机构理财种子");
  assert(trustText.includes("只有她转来的图") && trustText.includes("十二万进没进产品"), "案二必须在对白中区分转发截图与她自己那笔钱是否入产品");
  assert(trustText.includes("不能") && trustText.includes("是不是同一笔钱"), "案二必须由咨询者承认回单与转账的资金同一性尚未确认");
  assert(
    caseTwo?.truthBoundary?.unknown?.some(
      (item) => item.includes("十二万") && item.includes("宸直")
    ),
    "案二必须把十二万是否入产品留给未知"
  );
  const businessBeat = caseTwo?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "tony-business-letter");
  const publicFollowup = businessBeat?.choices?.find((choice) => choice.id === "keep-asking-table");
  assertEqual(publicFollowup?.endingImpact, "platform-data-loss", "案二继续公开追表必须写入平台数据代价");
  assert(JSON.stringify(publicFollowup?.lines ?? []).includes("本场停止推荐"), "案二平台代价必须当场可见，不能只藏进尾声状态");

  const openingText = JSON.stringify(caseTwo?.openingDialogue ?? {});
  const exclusiveText = JSON.stringify(caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-exclusive-voice") ?? {});
  const benefitsText = JSON.stringify(caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-caller-benefits") ?? {});
  const callerProfile = castRegistry.cast.find((profile) => profile.id === "case2-caller-he");
  assert(openingText.includes("今天轮休") && openingText.includes("在家"), "案二第一夜必须交代咨询者为何在晚间待在家中");
  assert(exclusiveText.includes("上班时间跟别人不太一样") && exclusiveText.includes("经常要见人") && exclusiveText.includes("头发隔一阵就得弄"), "案二第一夜只能通过具体追问展示职业造成的作息、见人与美发需求");
  assert(!/酒吧|订台|桌台|提成/.test(openingText), "案二具体职业必须留到第二夜由玩家问出");
  assert(!openingText.includes("气氛组") && !JSON.stringify(caseTwo).includes("客服主管"), "案二不得再把两个岗位拼成方便剧情的混合职业");
  assert(exclusiveText.includes("人家上自己的班") && exclusiveText.includes("最晚那档"), "Tony 的情绪价值必须先落成不泄露职业的当面维护与具体照顾");
  assert(benefitsText.includes("提成有时候当晚就结") && benefitsText.includes("染发") && benefitsText.includes("护理"), "案二第二夜必须交代快钱如何转成高频美发消费");
  assert(JSON.stringify(caseTwo.sceneVersions.find((scene) => scene.id === "tony-exclusive-voice")).includes("留最晚那档"), "Tony 的照顾必须留在实际相处段落，不强制收麦复述安慰");
  assert(callerProfile?.background?.includes("酒吧做营销") && callerProfile?.background?.includes("提成") && callerProfile?.background?.includes("轮休在家"), "案二来电人的固定角色档案必须登记职业、结算方式和连麦地点");

  const caseTwoInterlude = interludesByCaseId.get("02-tony");
  const caseFourInterlude = interludesByCaseId.get("04-workplace");
  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourOpeningText = JSON.stringify(caseFour?.openingDialogue ?? []);
  const supplierRoute = caseFour?.overnightStructure?.dayScenes?.find((scene) => scene.id === "day-work-supplier-visit");
  const supplierRouteText = JSON.stringify(supplierRoute ?? {});
  const caseFourTailText = JSON.stringify(caseFourInterlude ?? {});
  assert(caseFourOpeningText.includes("六万八是谁让你垫的") && caseFourOpeningText.includes("主管私聊让我先垫"), "职场案开场必须先问清垫款是谁让垫的");
  assert(!caseFourOpeningText.includes("宸直") && !caseFourOpeningText.includes("押金"), "职场案开场不得提前讲押金归集和跨案股东");
  ["招商主管", "区域经理", "采购经办", "点位协调费", "渠道维护费", "采购配合费"].forEach((anchor) => {
    assert(supplierRouteText.includes(anchor), `供应商白天路线缺少 ${anchor}`);
  });
  assert(supplierRouteText.includes("陈那笔还没报下来") && supplierRouteText.includes("以前这三笔"), "供应商对话区分陈本次未报销和以往三笔返费，无需额外教玩家分类");
  assert(caseFourTailText.includes("融资稿") && caseFourTailText.includes("关联往来") && caseFourTailText.includes("宸直"), "案后保留后续材料的来处，不要求关灯后复讲经营数字");
  assert(caseFourTailText.includes("对不上"), "案后材料不能自动归到陈的报销或案一认购上");
  assertEqual(caseFourInterlude?.worldEcho, undefined, "第二通职场案结尾不得提前宣布宸直全面兑付危机");
  assert(caseTwoInterlude?.worldEcho?.headline?.includes("全部产品暂停兑付"), "最后一通 Tony 案结尾必须回收宸直全面兑付危机");
  assert(caseTwoInterlude?.worldEcho?.doesNotProve?.includes("何的十二万元") && caseTwoInterlude?.worldEcho?.doesNotProve?.includes("周的一百万元"), "最终公共事件必须保留 Tony 案两笔资金各自的证明边界");
});

test("PACK-015", "workplace keeps early settlement evidence separate from second-night department records", () => {
  const packet = caseFiles.find((item) => item.caseId === "04-workplace");
  const early = packet.documents.find((item) => item.id === "case4-payment-ledger");
  const late = packet.documents.find((item) => item.id === "case4-department-ledger");
  assert(early && late, "两夜材料须分别登记，不能让白天文档提前泄露晚间回信");
  assert(early.rows.some((row) => row.rowId === "q05" && row.memo.includes("协调费")), "第一夜需要过往超额结算依据");
  assert(!JSON.stringify(early).includes("运营") && !JSON.stringify(early).includes("BX-2406-027"), "第二夜受理事实不得出现在白天材料");
  const day = packet.overnightStructure.dayScenes.find((item) => item.kind === "document");
  assertEqual(day.body.documentId, early.id, "白天只接早期材料");
  assert(packet.overnightStructure.callbackOpeners[day.body.earnedItemId]?.firstConflict, "材料带回必须改变第一问");
  const acts = packet.sceneVersions.find((item) => item.testimonyWall).testimonyWall.acts;
  for (const act of acts) {
    const present = act.decisivePresent;
    const rowId = present.evidenceId.split(":")[1];
    const row = late.rows.find((item) => item.rowId === rowId);
    assert(row && present.materialCards.some((card) => card.id === present.evidenceId && card.excerpt === row.memo), "指认卡必须忠实复现已登记的原始字段");
  }
  assertEqual(acts[0].decisivePresent.evidenceId, `${late.id}:q06`, "先核跨部门待付，走到公司资金问题");
  assertEqual(acts.length, 1, "已认过的四千不再单独审一幕");
  for (const option of acts[0].inquiry.options.filter(option => option.correct)) {
    const received = option.lines.findIndex(line => line.role === "stage" && /主管.*消息.*后台/.test(line.text));
    const quoted = option.lines.findIndex(line => line.role === "caller" && /预收款/.test(line.text));
    assert(received >= 0 && quoted > received, "每条可推进路线都先收主管消息，再谈后续收款填旧报销");
  }
  assert(late.rows.find((row) => row.rowId === "q07").memo.includes("已登记实际垫款"), "个人费用已经登记，不能退回未提交设定");
  assert(late.rows.find((row) => row.rowId === "q09").memo.includes("个人收款"), "中层已收返费必须有独立回执，不能凭包干推定");
  const earlyReply = JSON.stringify(packet.sceneVersions.find((item) => item.id === "work-leader-note").questionOptions);
  assert(!earlyReply.includes("两个人都交齐了"), "不能在前一场已经确认齐全，后一场又怀疑缺件");
});

test("PACK-016", "case 1 keeps bank records distinct from the boyfriend explanation", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const doc = packet.documents[0];
  assert(doc.intro.includes("男方") && doc.intro.includes("没有余额列"), "材料注明直接来源与摘录范围");
  const loan = packet.evidenceChecks.find(c => c.id === "credit-leveraged-trust");
  assert(loan.material.includes("本人说明") && loan.material.includes("借款用于") === false, "材料保留可归因的本人说明");
  assert(loan.materialRows.some(row => row.includes("借款用于")), "投资用途来自男方说明");
  assert(!packet.investigationHooks.some(h => /前同事/.test(h.title)), "不恢复无关前同事支线");
});
test("PACK-017", "case 1 does not overcue the ordinary bonus excuse", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const layoffScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-layoff-gap");
  assert(layoffScene, "案一必须保留失业时间差场景");
  assert(layoffScene.pressureHint?.expression === undefined, "奖金晚发首次出现时不需要额外表演标记替玩家画重点");
  assert(!JSON.stringify(caseOne).includes("把“奖金晚发”四个字记在纸上"), "案一不得恢复记纸条式强调动作");
});

test("PACK-017A", "case 1 opening uses a normal call-in rhythm before relationship questions", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const opening = caseOne?.openingDialogue ?? [];
  assert(opening.length >= 13, "案一开场必须留足接通、关系、用途、金额、期限与真实意愿的来回");
  assert((opening[0]?.text ?? "").includes("主播你好") && (opening[0]?.text ?? "").includes("问个自己的事"), "案一第一句必须是正常问候和来意，不能硬造危机钩子");
  assert(!/(八万|男朋友|信用卡|转账页面|先别骂)/.test(opening[0]?.text ?? ""), "案一第一句不得重新打包金额、关系、账单和预防挨骂");
  assert((opening[1]?.text ?? "").includes("我在听") && (opening[2]?.text ?? "").includes("男朋友刚才找我"), "主播请讲后，咨询者才应逐层说明男友的代垫请求");
  assert((opening[2]?.text ?? "").includes("转到后台那段") && (opening[3]?.text ?? "").includes("今晚转") && (opening[3]?.text ?? "").includes("你转了吗"), "案一接通后双方必须记得开播前已经转入后台的语音和‘今晚先转’");
  assert(opening.findIndex((line) => (line.text ?? "").includes("八万")) > opening.findIndex((line) => (line.text ?? "").includes("信用卡")), "案一必须先问清是什么钱，再自然追到金额");
  assert(JSON.stringify(opening).includes("八万") && JSON.stringify(opening).includes("奖金晚发") && JSON.stringify(opening).includes("以前给我花过的钱"), "案一开场递进不能删掉既有金额、借口和施压来源");
  assert((opening.at(-1)?.text ?? "").includes("一年半"), "案一开场最后才落到交往时长，随后才能追同住和固定给付");
});

test("PACK-017B", "case 1 asks wine and high spending before the second night", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const bill = packet.sceneVersions[2];
  const wine = bill.questionOptions[0];
  assert(wine.id.endsWith(":wine") && wine.question.includes("酒水"), "第一夜先问酒水");
  assert(wine.answer.includes("酒是他挑的") && wine.answer.includes("店是我想去的"), "双方消费行动明确");
  assert(JSON.stringify(wine.lines).includes("你的消费也不低"), "直接指出高消费");
});
test("PACK-017C", "case 1 concentrates fixed-support questions in the received-material prelude", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const text = JSON.stringify(wall.beforeVersion);
  for (const amount of ["十四个月", "二十四万五", "房租", "十五万"]) assert(text.includes(amount), `前置材料明确 ${amount}`);
  assert(!packet.evidenceChecks.some(c => c.id === "credit-fixed-support"), "不另设一轮固定转账重复题");
  assert(!packet.overnightStructure.callerQuestion, "不在收尾再问八万");
});
test("PACK-017D", "case 1 receives severance before closing and permits balance refusal", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const text = JSON.stringify(wall.afterVersion);
  const receipt = packet.sceneVersions.find(scene => scene.id === "credit-bank-flow").beforeVersion.lines;
  assert(receipt.some(line => line.role === "stage" && /男方.*离职结算通知/.test(line.text)), "离职通知先由男方递交，不在收尾新开一层");
  assert(!text.includes("一万一千六百多"), "现场不披露作者掌握的精确余额");
  assert(text.includes("你有什么话当着直播间直接跟他说吧"), "本人表态");
  assert(text.includes("反正八万我不转，之前给我的就是主动赠与"), "保留用户指定拒付原话");
  assert(!packet.deepFollowup.question && packet.careChoices.length === 1, "收尾不再扩展问答");
});
test("PACK-017E", "case 1 identifies the boyfriend before receiving his direct materials", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const before = packet.sceneVersions[2].beforeVersion.lines;
  const identify = before.findIndex(l => l.role === "caller" && l.text.startsWith("是他"));
  const receipt = before.findIndex(l => l.role === "stage" && l.text.includes("男方发来"));
  assert(identify >= 0 && receipt > identify, "先确认后台账号，再展示原件");
  assert(JSON.stringify(before).includes("他不上麦"), "明确男方只发后台材料");
});
test("PACK-017E1", "case title cards do not narrate the call before pickup", () => {
  caseFiles.forEach((packet) => {
    assertNonEmptyString(packet.caseTitle?.title, `${packet.caseId} 标题卡必须保留案名`);
    assert(packet.caseTitle?.intro === undefined && packet.caseTitle?.subtitle === undefined, `${packet.caseId} 标题卡只能显示案名；求助、材料和判断必须等接通后出现`);
  });
});

test("PACK-017E2", "case 1 bill retains three spending categories without another menswear quiz", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const bill = packet.sceneVersions[2];
  const question = bill.questionOptions[1].question;
  for (const value of ["四万", "五千", "三万五"]) assert(question.includes(value), `保留金额 ${value}`);
  assert(!bill.casualQuestions?.length && !bill.afterScene, "不重复男装或账单材料问答");
});
test("PACK-017F", "case 1 handoff has two attributable submissions and no audience interruption", () => {
  const packet = caseFiles.find(p => p.caseId === "01-credit");
  const wall = packet.sceneVersions.find(s => s.testimonyWall);
  const handoff = packet.nightStructure.hangup.stageDirection;
  assert(handoff.includes("男方") && handoff.includes("匿名观众"), "两个来源分别交代");
  assertEqual(packet.overnightStructure.hangupLine, handoff, "共用同一收麦过程");
  assert(!packet.overnightStructure.liveCounterBeats.length, "删除弹幕和转发链插话");
});
test("PACK-018", "structured story project stays connected to runtime canon", () => {
  for (const [path, contents] of storyProjectFiles) {
    assertNonEmptyString(contents, `故事工程缺少 ${path}`);
  }

  const storyBible = storyProjectFiles.get("story.md");
  assert(storyBible.includes("schema-version: 2"), "story.md 必须使用 Story Skills schema v2");
  assert(storyBible.includes("status: revising"), "试玩仍在改稿期，story.md 状态必须是 revising");
  assert(storyBible.includes("content/packs/steam-demo-01/manifest.json"), "story.md 必须链接运行时故事包真源");
  assert(storyBible.includes("content/characters/cast.json"), "story.md 必须链接角色声纹真源");
  assert(storyBible.includes("docs/generated/") && storyBible.includes("禁止直接改稿"), "story.md 必须声明生成稿不可直接修改");

  const chapterIndex = storyProjectFiles.get("chapters/_index.md");
  const sceneIndex = storyProjectFiles.get("scenes/_index.md");
  manifest.sequence.forEach((item, index) => {
    const chapterId = `chapter-${String(index + 1).padStart(2, "0")}`;
    assert(chapterIndex.includes(`](${chapterId}.md)`), `章节注册表缺少 ${chapterId}`);
    const registeredRows = sceneIndex.split("\n").filter((line) => line.startsWith(`| ${chapterId} |`));
    assertEqual(registeredRows.length, 4, `${chapterId} 必须登记夜 A、白天、夜 B、案后四个宏场景`);
    assert(registeredRows.every((line) => line.includes(`${chapterId}-scene-`)), `${chapterId} 的四个宏场景必须都链接到对应场景文件`);
  });

  const characterIndex = storyProjectFiles.get("characters/_index.md");
  ["host-lin-xuyang", "zhao-lawyer", "v-bro", "case1-caller-shen", "case2-caller-he", "case3-caller-lin", "case4-caller-chen"].forEach((profileId) => {
    assert(characterIndex.includes(`](${profileId}.md)`), `角色注册表缺少核心人物 ${profileId}`);
  });

  const promiseIndex = storyProjectFiles.get("continuity/promises/_index.md");
  assert(promiseIndex.includes("chenzhi-trust-crisis.md"), "跨案信托暗线必须进入故事工程伏笔注册表");
  const questionIndex = storyProjectFiles.get("continuity/questions/_index.md");
  assert(questionIndex.includes("case1-unknown-money.md") && questionIndex.includes("case4-repayment-gap.md"), "案件有意未决项必须进入连续性问题注册表");

  const continuityState = storyProjectFiles.get("continuity/state.md");
  assert(!continuityState.includes("女方家的婚礼钱尚未到期"), "案三连续性台账不得把留给女儿本人的宸直资金写成婚礼钱");
  assert(continuityState.includes("父亲说其中二十万元到期后留给女儿本人"), "案三连续性台账必须与案身保持同一资金用途");
});

test("PACK-019", "cases 2 and 3 keep countable benefit and remedy boundaries", () => {
  const caseTwo = caseFiles.find((packet) => packet.caseId === "02-tony");
  const caseTwoBenefits = JSON.stringify(caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-caller-benefits") ?? {});
  const caseTwoLedger = caseTwo?.documents?.find((document) => document.id === "case2-member-training");
  assertEqual(caseTwo?.helpRequest?.kind, "interest", "案二必须是行动型求助，不能只问关系定义");
  assert(caseTwoBenefits.includes("十二万") && caseTwoBenefits.includes("一百万") && /我先问/.test(caseTwoBenefits), "案二必须把代投落到金额、门槛和谁先开口");
  assert(/走他户|走我户|并进他的户/.test(caseTwoBenefits), "案二必须把代投账户口径落到原话");
  assert(caseTwoBenefits.includes("是我转的"), "案二必须由来电人承认钱是自己转的");
  assert(!JSON.stringify(caseTwo?.evidenceChecks ?? []).includes("没敢数"), "案二不得把同一晚已经主动报过的人数写成此前不敢数");
  assert(caseTwo?.respondentNote?.text?.includes("十二万") && caseTwo?.respondentNote?.text?.includes("走我户") && caseTwo?.respondentNote?.text?.includes("我不上麦"), "Tony 留言必须回应代投、账户口径，并保持不上麦");
  const pushColumnScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-next-push-column");
  assert(pushColumnScene?.entryQuestion?.includes("昨晚你已经看见") && pushColumnScene?.version?.includes("昨晚就看完了"), "案二必须固定第一夜已经看完名单，第二夜不得再演第一次发现");
  assert(pushColumnScene?.testimonyWall?.acts?.[0]?.statements?.some((statement) => statement.id === "tony-cropped-to-protect-self" && statement.text.includes("裁")), "案二第二夜必须追公开名单会同时暴露来电人的哪些信息");
  assert(caseTwo?.truthBoundary?.unknown?.some((item) => item.includes("Tony") && item.includes("资格")), "案二必须把 Tony 是否有资格替顾客安排理财保留为未知");
  assert(caseTwo?.truthBoundary?.unknown?.some((item) => item.includes("Tony") && item.includes("佣金")), "案二不得把 Tony 的佣金或报酬写成已确认事实");
  assert(caseTwo?.otherBenefit?.includes("个人账户") && caseTwo?.otherBenefit?.includes("原件"), "案二必须写清 Tony 的现实利益是控制个人账户与产品原件，不得退回泛化销售话术");
  assert(caseTwo?.respondentNote?.text?.includes("材料当然先在我这儿"), "Tony 留言必须露出他把产品材料留在自己一端的默认立场");
  assert(caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-exclusive-voice")?.version?.includes("长得好看"), "案二必须在固定相识陈述里建立咨询者主动看中 Tony 外表，不能只到结案突然批颜值");
  const otherCallerHook = caseTwo?.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(otherCallerHook?.materialRows?.some((row) => row.includes("把转账与回单交警方核原件")), "案二另一位顾客的材料必须有可执行的原件核对动作");
  assert(otherCallerHook?.options?.some((option) => option.label === "转账与回单放在一起核"), "案二后台私信选项必须落到原件核对");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m05" && row.amount === "¥120,000"), "案二行级材料必须保留十二万转账");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m03" && String(row.memo ?? "").includes("走Tony户")), "案二行级材料必须保留走他户备注");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m02" && row.amount === "¥1,000,000"), "案二行级材料必须保留周的一百万已买行");
  assert(caseTwo?.stageJudgement?.includes("十二万") && caseTwo?.stageJudgement?.includes("回单"), "案二结案必须把要回单和十二万拆开处理");
  assert(caseTwo?.caseClosing?.nextStep?.includes("同时说明代投安排") && caseTwo?.dialoguePresentation?.compactClosing, "追款保留完整代投背景，深问仍允许争执感情误导，不强迫双方认同点评");

  const caseThree = caseFiles.find((packet) => packet.caseId === "03-profile");
  const caseThreeText = JSON.stringify(caseThree ?? {});
  const familyScene = caseThree?.sceneVersions?.find((scene) => scene.id === "profile-family-chat-origin");
  const fundsDocument = caseThree?.documents?.find((document) => document.id === "case3-credential-balance");
  const fundsRows = new Map((fundsDocument?.rows ?? []).map((row) => [row.rowId, row]));
  assert(caseThreeText.includes("领证前") && caseThreeText.includes("自己的卡里"), "案三必须写清彩礼支付时点和女方个人收款账户");
  assert(caseThreeText.includes("婚宴和首饰另算"), "案三必须把婚宴首饰从彩礼数字中拆出");
  assert(familyScene?.version?.includes("拿二十万给我留着"), "案三必须让父亲的二十万元保留给女儿个人的用途");
  assert(!(caseThree?.overnightStructure?.callbackOpeners?.["家里群原话"]?.firstConflict?.callerLine ?? "").includes("八万四"), "案三家里群回拨只能承认自己的钱没说，不能提前报出双人调解时的八万四");
  const caseThreeDeepText = JSON.stringify(caseThree?.sceneVersions?.find((scene) => scene.id === "profile-income-and-card") ?? {});
  assert(caseThreeDeepText.includes("八万四") && caseThreeDeepText.includes("六万") && caseThreeDeepText.includes("领证以后") && caseThreeDeepText.includes("添家电、搬家"), "案三必须通过短问短答问出咨询者自己的存款、上限和使用时点");
  assert(fundsRows.get("p04")?.memo?.includes("领证前转入女方个人账户"), "案三材料行必须写清彩礼进入谁的账户");
  assert(fundsRows.get("p07")?.memo?.includes("不包含在 28.8 万内"), "案三材料行必须单列婚宴与首饰");
  assert(caseThree?.caseClosing?.nextStep?.includes("共同账户没有获她同意") && caseThree?.caseClosing?.unresolved?.some((item) => item.includes("男方其他账户")), "结案保持条件未谈成与其他资产未知，口播可以继续追她拒绝对等条件的目的");
  assert(!caseThree?.investigationHooks?.some((hook) => hook?.stillCannotProve?.includes("女方只图钱")), "案三未知边界不得再用‘不能证明只图钱’替已锁死的加价行为免责");
});

test("PACK-019-ROUTE", "mandatory convergence discloses facts and microphone consent before using them", () => {
  const tony = caseFiles.find((packet) => packet.caseId === "02-tony");
  const policeScene = tony.sceneVersions.find((scene) => scene.id === "tony-who-messaged");
  assert(/警察.*核实/.test(policeScene.version), "先交代敲门来人，不将借款变成新主线");
  const trigger = policeScene.questionOptions.find(option => option.lines?.some(line => /赎回/.test(line.text)));
  assert(trigger && policeScene.questionSequence.includes(trigger.id), "听到兑付风险才翻手机必须在必经问答，不能只留在旧可选字段");
  const source = trigger.lines.findIndex(line => line.role === "caller" && /赎回/.test(line.text));
  assert(source >= 0 && trigger.lines[source].text.indexOf("赎回") < trigger.lines[source].text.indexOf("翻"), "她先听到风险，再去翻手机");
  const profile = caseFiles.find((packet) => packet.caseId === "03-profile");
  const beats = profile.overnightStructure.liveCounterBeats;
  const request = beats.find((beat) => beat.id === "profile-gift-mic-request");
  const consent = beats.find((beat) => beat.id === "profile-mediation-consent");
  const requestLines = [...request.lines, ...(request.choices ?? []).flatMap((choice) => choice.lines)];
  assert(requestLines.filter((line) => line.speaker?.startsWith("男方")).every((line) => line.speaker === "男方（后台文字）"), "连麦申请阶段男方只能通过后台文字发言");
  const consentLines = [...requestLines, ...consent.lines];
  const consentIndex = consentLines.findIndex((line) => (line.speaker === "咨询者" || line.role === "caller" && !line.speaker) && /接.*进来/.test(line.text));
  const connectIndex = consentLines.findIndex((line) => line.role === "stage" && line.text.includes("麦克风接通"));
  const maleIndex = consentLines.findIndex((line) => line.speaker === "男方");
  assert(consentIndex >= 0 && connectIndex > consentIndex && maleIndex > connectIndex, "各礼物选择汇合后，女方确认、接通、男方语音必须依次发生");
});

test("PACK-019A", "spoken judgements do not read the whole closing card aloud", () => {
  caseFiles.forEach((casePacket) => {
    const judgement = casePacket?.stageJudgement ?? "";
    const beats = judgement.split(/(?<=[。！？])/).map((item) => item.trim()).filter(Boolean);
    assert(beats.every((beat) => beat.length <= 72), `${casePacket?.caseId} 结案口播允许长，但每一拍不能继续压成材料摘要`);
    assert(!/这些.{0,24}都是真的[；，].{0,24}也是真的/.test(judgement), `${casePacket?.caseId} 结案口播不得使用“这些都是真的、那些也是真的”的对称清单腔`);
  });
});

test("PACK-019B", "pressure dialogue does not regress to tidy self-analysis", () => {
  const retiredPressureLines = [
    "那三万五不是我不说，是他不说",
    "不是否认，是那种大家都懂的笑",
    "说明他不是拿不出，是不愿意拿",
    "我把群聊按时间重新翻了一遍",
    "这些我都没告诉你，是我的问题"
  ];

  caseFiles.forEach((casePacket) => {
    const spokenText = JSON.stringify({
      openingDialogue: casePacket.openingDialogue,
      sceneVersions: casePacket.sceneVersions,
      deepFollowup: casePacket.deepFollowup,
      respondentNote: casePacket.respondentNote,
      stageJudgement: casePacket.stageJudgement,
      caseClosing: casePacket.caseClosing
    });
    retiredPressureLines.forEach((line) => {
      assert(!spokenText.includes(line), `${casePacket.caseId} 高压台词不得退回完整自我分析：“${line}”`);
    });
  });
});

test("PACK-019C", "closing point surfaces name locked behavior before preserving unknowns", () => {
  const decisiveHostLines = caseFiles.flatMap((casePacket) => (casePacket.sceneVersions ?? []).flatMap((scene) => [
    scene?.decisivePresent?.hostLine,
    ...(scene?.testimonyWall?.acts ?? []).map((act) => act?.decisivePresent?.hostLine)
  ])).filter(Boolean);
  const pointSurfaceText = JSON.stringify({
    thesis: manifest.theme?.thesis,
    commentPrompt: manifest.theme?.commentPrompt,
    hiddenThread: manifest.theme?.hiddenThread,
    highRevealTone: comments.highRevealTone,
    lowRevealTone: comments.lowRevealTone,
    cases: caseFiles.map((casePacket) => ({
      caseId: casePacket.caseId,
      hostWoundHook: casePacket.hostWoundHook,
      stanceSnapshot: casePacket.stanceSnapshot,
      stageJudgement: casePacket.stageJudgement,
      caseClosing: casePacket.caseClosing,
      careChoices: casePacket.careChoices
    })),
    decisiveHostLines
  });
  assert(!/先别替谁下结论|不能证明女方只图钱|别只骂一方|别上纲上线|你没有急着判人|今晚谁都别|先别急|谁也不容易|不宜定性|不好说死|比较复杂|先把话说开|市场都这样|双方都有问题|各打五十大板/.test(pointSurfaceText), "点名面不得再用和稀泥句撤销已经锁死的判断");
  const spokenPointSurfaceText = JSON.stringify({
    theme: manifest.theme,
    commentSeeds: comments.commentSeeds,
    highRevealTone: comments.highRevealTone,
    lowRevealTone: comments.lowRevealTone,
    cases: caseFiles.map((casePacket) => ({
      stageJudgement: casePacket.stageJudgement,
      closingTitle: casePacket.caseClosing?.title,
      closingVerdict: casePacket.caseClosing?.verdict,
      stanceNote: casePacket.stanceSnapshot?.note,
      afterPickLine: casePacket.stanceSnapshot?.afterPickLine,
      careHostLines: (casePacket.careChoices ?? []).map((choice) => choice.hostLine)
    })),
    decisiveHostLines
  });
  assert(!/站不住|开脱|锁死|留白|粉饰|受害者叙事|零散共同消费|由他解释|这两件另算|结案会.{0,8}点名|锁死哪件|这不是财务慢，也不是/.test(spokenPointSurfaceText), "主播与弹幕点名面不得使用模板判词或编剧工作词");
  const sloganCount = [
    ...caseFiles.map((casePacket) => casePacket.stageJudgement ?? ""),
    ...decisiveHostLines
  ].reduce((count, line) => count + (line.match(/这不是[^。！？]{0,32}[，,]是/g)?.length ?? 0), 0);
  assertEqual(sloganCount, 0, "结案口播用具体行为说明责任，不强制保留「这不是 A，是 B」口号");
  caseFiles.forEach((casePacket) => {
    assert(!casePacket.stanceSnapshot?.prompt?.includes("站哪边"), `${casePacket.caseId} 立场快照必须问行为，不问站队`);
  });
  const byId = new Map(caseFiles.map((casePacket) => [casePacket.caseId, casePacket]));
  assert(byId.get("04-workplace")?.stageJudgement?.includes("垫钱") && byId.get("04-workplace")?.stageJudgement?.includes("旧立项页") && !byId.get("04-workplace")?.stageJudgement?.includes("返费"), "案四必须点名催垫款和以旧页应付催款，不提前使用案后返费表");
  assert(JSON.stringify(byId.get("03-profile")?.caseClosing?.confirmed ?? []).includes("赞成完整付款条件"), "案三保留实际加价与本人赞成的来源，判词可以继续追条件不改的目的");
  assert(byId.get("02-tony")?.caseClosing?.nextStep?.includes("同时说明代投安排") && (byId.get("02-tony")?.caseClosing?.unresolved ?? []).some((item) => item.includes("十二万是否已经买成")), "案二追款保留完整背景，也保留对实际交付的追问，不能以她主动买代替资金回答");
});

test("PACK-019D", "fable hooks weld into existing cases without replacing their mainlines", () => {
  const byId = new Map(caseFiles.map((casePacket) => [casePacket.caseId, casePacket]));
  const caseOne = byId.get("01-credit");
  const caseThree = byId.get("03-profile");
  const caseFour = byId.get("04-workplace");
  const caseTwo = byId.get("02-tony");
  const caseOneWall = caseOne?.sceneVersions?.find((scene) => scene.testimonyWall)?.testimonyWall;
  const caseOneActOne = caseOneWall?.acts?.[0];
  const caseThreeWall = caseThree?.sceneVersions?.find((scene) => scene.testimonyWall)?.testimonyWall;
  const caseThreeActTwo = caseThreeWall?.acts?.at(-1);
  const caseThreeLedger = caseThree?.documents?.find((document) => document.id === "case3-credential-balance");
  const quickTwo = quickCaseFiles.find((packet) => packet.id === "02-one-missed-message");
  const quickClosingRequest = quickTwo?.turns?.find((turn) => turn.id === "closing-request");
  const quickEndingLines = quickTwo?.ending?.summaryPages?.[0]?.lines ?? [];
  const workplaceInbox = caseFour?.investigationHooks?.find((hook) => hook.id === "work-postcase-inbox");
  const tonyTrainingCard = caseTwo?.investigationHooks?.find((hook) => hook.id === "tony-manager-training-note");
  const inboxFireBack = workplaceInbox?.replyChoices?.find((choice) => choice.id === "inbox-fire-back");
  const inboxReplyEcho = caseThree?.crossCaseEchoes?.find((echo) => echo.id === "case3-echo-work-inbox-reply");
  const workplaceActOnePresent = caseFour?.sceneVersions?.find((scene) => scene.testimonyWall)?.testimonyWall?.acts?.[0]?.decisivePresent;
  const cafe = manifest.nightShell?.cafePrologue?.cafe;
  const cafeAccount = manifest.nightShell?.cafePrologue?.aftermath?.routes?.find((route) => route.id === "account");
  const workplaceInterlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === "04-workplace");
  const profileInterlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === "03-profile");

  assertEqual(manifest.sequence.length, 4, "Fable 焊入不得新增撞题主案");
  assertEqual(caseOneWall?.presentationSkin, "voice-matrix", "案一证词墙必须启用语音方阵外观");
  assertEqual(caseOneActOne?.presentationSkin, "voice-matrix", "案一第一幕必须保留语音方阵外观");
  assertEqual(caseOneActOne?.decisivePresent?.evidenceId, "credit-savings-agreement:chat", "案一代存约定必须由原话支撑");
  assertEqual(caseOneActOne?.decisivePresent?.statementId, "credit-consumption-gloss", "案一 Fable 焊入不得改决定性证词落点");

  assert(caseThreeActTwo?.statements?.some((statement) => statement.text?.includes("只差两千")), "案三必须保留差两千态度句");
  assert(JSON.stringify(caseThree).includes("profile-family-chat-origin") && JSON.stringify(caseThree).includes("第二路麦克风接通"), "案三必须保留出处页与第二路麦，不重写彩礼主线");
  assert(caseThreeLedger?.rows?.some((row) => row.rowId === "p08" && row.memo?.includes("只差两千") && row.party?.includes("介绍人")), "案三必须把‘差两千就是态度’的介绍人转发页做成可核材料");
  assert(caseThreeActTwo?.decisivePresent?.materialCards?.some((card) => card.id === "case3-credential-balance:p08"), "案三第二幕必须允许玩家把出处页放进材料卡对照");
  assertEqual(caseThreeActTwo?.decisivePresent?.evidenceId, "case3-credential-balance:p03", "案三出处页只能补来源，不能替换第二幕决定性工资卡落点");

  const tonyDoorText = JSON.stringify(caseTwo?.nightStructure?.overnight?.dayActions ?? caseTwo?.overnightStructure ?? {});
  assert(tonyDoorText.includes("自己人") && tonyDoorText.includes("别又跟我说那个") && tonyDoorText.includes("我没钱"), "Tony 案必须由熟客原话证明‘自己人’后面接过推介");
  assert(tonyTrainingCard?.material?.includes("上周那个，你听完了吗") && tonyTrainingCard?.material?.includes("听过了，没钱"), "Tony 案必须把熟客‘上周听过’升级为可出示截图，而不是只留现场传闻");
  assert(tonyTrainingCard?.material?.includes("自己人") && tonyTrainingCard?.material?.includes("晚档给你留"), "Tony 话术卡必须把亲密称呼、排期和私下跟进焊在同一张材料上");
  assert(tonyTrainingCard?.material?.includes("店只做美发"), "Tony 案必须继续把私人代投与门店业务分开");
  assert(tonyTrainingCard?.stillCannotProve?.includes("没写上周听的是什么"), "Tony 熟客截图必须守住产品内容未知，不能用模糊的‘那个’坐实理财推销");
  assert(!caseTwo?.stageJudgement?.includes("培训") && !caseTwo?.stageJudgement?.includes("课程"), "Tony 的目的不得被改写成培训组织主线");

  assert(!workplaceInbox, "供应商回执直接到场，不再分六封信筛选");
  assert(caseFour.sceneVersions.at(-1).beforeVersion.lines.some(line => line.text.includes("供应商")), "删筛信后仍保留回执来源");
  assert(quickEndingLines.some(line => line.role === "caller" && line.text.includes("道歉")), "快案二结束在她仍要求道歉的态度");

  assertEqual(cafe?.clipDraft?.title, "她说没去酒店，怎么让她当场改口", "序章必须出现攻略体切片标题");
  assertEqual((JSON.stringify(cafe).match(/你们敢断章取义剪完再发/g) ?? []).length, 1, "表哥以断章取义风险回应，不能提前判输赢");
  assert(cafeAccount?.rows?.some((row) => row.when === "每月 18 日" && row.status?.includes("私教课时") && row.status?.includes("个人账户")), "每月十八日必须换成课程类摘要，同时仍落到遮名个人账户");
  assert(JSON.stringify(cafeAccount).includes("十八号还有一笔固定转出") && JSON.stringify(cafeAccount).includes("跟十八号这笔对不上") && JSON.stringify(cafeAccount).includes("房贷") && JSON.stringify(cafeAccount).includes("车贷"), "课程类摘要不得吞掉房贷车贷排除过程");

  assert(JSON.stringify(workplaceInterlude).includes("融资稿") && JSON.stringify(workplaceInterlude).includes("押金"), "职场收播在滚动垫款消息之后取得融资稿，继续追查公司的资金来源");
  assert(JSON.stringify(profileInterlude).includes("打码课纲") && JSON.stringify(profileInterlude).includes("完整课纲") && JSON.stringify(profileInterlude).includes("自称买过婚恋课的观众") && JSON.stringify(profileInterlude).includes("退款"), "第三通展示打码课纲并留下来源待查，不给人物补购买事实");
  assertEqual(manifest.theme?.hiddenThread?.phraseEcho?.rule, "相似措辞只能提示继续核对来源，不能证明来电人买过课、彼此认识或受同一人指使。", "同构话术暗线必须登记证明上限");
});

test("PACK-020", "optional author notes keep stable IDs without a disguise-chain quota", () => {
  for (const packet of caseFiles) {
    const chain = packet.deceptionChain;
    if (chain === undefined) continue;
    assert(chain && typeof chain === "object", `${packet.caseId} deceptionChain 若保留须为对象`);
    const stages = chain.stages ?? [];
    assert(Array.isArray(stages), `${packet.caseId} 已配置 stages 须为数组`);
    assert(new Set(stages.map(stage => stage.id)).size === stages.length, `${packet.caseId} 已登记阶段 ID 不得重复`);
    stages.forEach((stage, index) => {
      assertNonEmptyString(stage.id, `${packet.caseId} stages[${index}] 缺少稳定 ID`);
      if (stage.playerTest !== undefined) assert(typeof stage.playerTest === "string", `${packet.caseId} stages[${index}].playerTest 须为作者说明文本`);
      // Free prose is not a reference schema. Source IDs/anchors are validated at their real consumer.
    });
  }

  const caseTwo = caseFiles.find((packet) => packet.caseId === "02-tony");
  assert(caseTwo?.selfServingOmission?.includes("开场已经说出要回这笔钱"), "案二内部账本必须承认开场已经公开要钱诉求");
  assert(!(caseTwo?.truthBoundary?.edited ?? []).some((item) => item.includes("开场没有说") && item.includes("要回")), "案二不得把玩家已经听见的要钱诉求继续登记为隐瞒");

  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourOpening = (caseFour?.openingDialogue ?? []).map((line) => line.text).join(" ");
  const groupMessageBeat = caseFour?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "work-group-repayment-message");
  assert(caseFourOpening.includes("公司群里问") && caseFourOpening.includes("没敢发"), "案四必须在开场种下未发送的追款消息");
  assert(JSON.stringify(groupMessageBeat ?? {}).includes("各部门别单独催"), "案四第二夜用跨部门通知扩大付款压力");
  assert(groupMessageBeat?.from === "平台强制贴片", "当前已配置贴片消息须保留其来源；不要求固定选项数量");
  assert(groupMessageBeat?.choices?.some((choice) => choice.endingImpact === "platform-data-loss"), "案四先念完群消息必须付出退出推荐的真实代价");
  assert(groupMessageBeat?.choices?.some((choice) => JSON.stringify(choice.lines ?? []).includes("撤回") && JSON.stringify(choice.lines ?? []).includes("截到")), "案四先静音路线必须失去公开原话但留下可归因截图");
  const closingLines = caseFour.sceneVersions.find(scene => scene.id === "work-split-ownership").sceneCloser.lines;
  assertEqual(closingLines.filter((line) => line.role === "stage" && line.text.includes("他发出两条群消息")).length, 1, "结案只发送一次");
  assert(!JSON.stringify(caseFour.deepFollowup).includes("发了。"), "深问不得提前发送，避免非深问路线丢失行动或结尾回退");
  // The form author is under semantic review (W1); do not lock the contradictory wording.
  assert(!/还没发|没发出去/.test(JSON.stringify(caseFour.careChoices)), "关怀阶段不得退回未发送状态");
  assertBeatLines(closingLines, "案四固定结尾须让所有路线都完成追款与费用说明");
  const selfAnnotationText = JSON.stringify(caseFiles);
  for (const staleLine of ["我怕问重了像查岗", "我就没把自己当普通顾客", "这么说，我就不用问他为什么单独记那一列了"]) {
    assert(!selfAnnotationText.includes(staleLine), `来电人不得替作者完整命名自己的防御机制：${staleLine}`);
  }
});

const failed = results.filter((result) => !result.ok);
for (const result of results) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.id} ${result.name}`);
  if (!result.ok) console.error(result.error?.stack ?? result.error);
}

if (failed.length) {
  process.exitCode = 1;
} else {
  console.log(`Pack verification passed: ${packId}`);
}
