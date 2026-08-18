import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { RUNTIME_CASE_CONTENT_STATUS, RUNTIME_CASE_REQUIRED_FIELDS } from "../src/runtime/contentCase.js";
import { assertDialogueTexture, spokenPunctuationLeaks } from "../src/runtime/dialogueTexture.js";
import { splitDialogueSentences } from "../src/runtime/dialoguePresentation.js";
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

const SPOKEN_NARRATOR_LEAK = /我看窗外[，,；; ]*他看酒|现在那两个字卡在这儿|一个把我写成.{0,18}手上怎么能|镜头(?:切|推|拉|给|对准)|画面(?:切|定格|推|拉)|特写(?:给|在|：)|旁白[：:]/;

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
      .filter((line) => line.role === "host")
      .at(-1)?.text ?? "";
    const nextEntryQuestion = scenes[sceneIndex + 1]?.entryQuestion ?? "";
    if (/[？?]\s*$/.test(closerHostLine) && /[？?]\s*$/.test(nextEntryQuestion)) {
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
  if (operation.selectionMode === "priority") {
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
  assert(profile.truthBoundaryPromptLimit >= 5, `${label} 事实边界题量不能低于 5`);
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
  assertArrayMin(choices, 3, `${label}.careChoices 必须有三项`);
  const expectedIds = ["pragmatic", "affirm", "accompany"];
  assert(choices.length === expectedIds.length, `${label}.careChoices 只能有三项`);
  choices.forEach((choice, index) => {
    assert(choice?.id === expectedIds[index], `${label}.careChoices[${index}] id 必须是 ${expectedIds[index]}`);
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
  assertSoftEqual(plan.liveBeatCount, packet.sceneVersions?.length ?? 0, `${label} runtimeLengthPlan.liveBeatCount 必须等于实际来电段落数`);
  assertSoftEqual(plan.materialBoardCount, packet.evidenceChecks?.length ?? 0, `${label} runtimeLengthPlan.materialBoardCount 必须等于实际材料板数量`);
  assertSoftEqual(plan.backflowCount, packet.investigationHooks?.length ?? 0, `${label} runtimeLengthPlan.backflowCount 必须等于实际后台回流数量`);
  assertSoftEqual(plan.truthBoundaryPromptCount, promptLimit, `${label} runtimeLengthPlan.truthBoundaryPromptCount 必须等于 manifest 出题上限`);
  assert(truthBoundaryItemCount(packet) >= plan.truthBoundaryPromptCount, `${label} truthBoundary 池子不能少于实际出题数`);
  assertNonEmptyString(plan.caseSpecificPressure, `${label} runtimeLengthPlan.caseSpecificPressure 不能为空`);
  assertArrayMin(plan.whatPlayerDoesBesidesRead, 4, `${label} runtimeLengthPlan.whatPlayerDoesBesidesRead 至少列出四种读以外的操作`);
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
  const surfaceText = normalizeQuoteText(ungatedSurfaceText(packet));
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
    assert(["setup", "misdirect", "missing-edge", "reversal", "payoff"].includes(scene.clueRole), `${label} sceneVersions[${sceneIndex}].clueRole 不合法`);
    assertNonEmptyString(scene.falseFrame, `${label} sceneVersions[${sceneIndex}] 缺少 falseFrame`);
    assertArrayMin(scene.payoffFor, 1, `${label} sceneVersions[${sceneIndex}].payoffFor 至少指向一处伏笔或回收`);
  });
  scenes.forEach((scene, sceneIndex) => {
    (scene.payoffFor ?? []).forEach((sceneId) => {
      assert(sceneIds.has(sceneId), `${label} sceneVersions[${sceneIndex}].payoffFor 指向不存在的 scene id: ${sceneId}`);
    });
  });
  (packet.evidenceChecks ?? []).forEach((check, checkIndex) => {
    assertArrayMin(check.revalues, 1, `${label} evidenceChecks[${checkIndex}].revalues 至少指向一个场景`);
    (check.revalues ?? []).forEach((sceneId) => {
      assert(sceneIds.has(sceneId), `${label} evidenceChecks[${checkIndex}].revalues 指向不存在的 scene id: ${sceneId}`);
    });
  });
  scenes.forEach((scene, sceneIndex) => {
    const guarded = (scene.questionOptions ?? []).filter((option) => option.guardedAnswer);
    assert(guarded.length >= 1, `${label} sceneVersions[${sceneIndex}] 至少需要一条 guardedAnswer`);
    assert(guarded.some((option) => {
      const normalAnswer = [
        option.answer,
        ...(option.lines ?? []).filter((line) => !["stage", "pause"].includes(line?.role)).map((line) => line?.text),
      ].filter(Boolean).join("\n");
      return option.guardedAnswer.length < normalAnswer.length;
    }), `${label} ${scene.id} 至少一条 guardedAnswer 必须短于普通回答`);
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
  assertArrayMin(snapshot.options, 3, `${label} stanceSnapshot.options 至少需要三项`);
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
  assert(Number.isInteger(interlude.budget) && interlude.budget > 0, `${label} nightStructure.interlude.budget 必须是正整数`);
  assert(Number.isInteger(interlude.minActions) && interlude.minActions >= 1, `${label} nightStructure.interlude.minActions 必须是正整数`);
  assert(Number.isInteger(interlude.maxActions) && interlude.maxActions >= interlude.minActions, `${label} nightStructure.interlude.maxActions 不能小于 minActions`);
  assert(interlude.budget >= interlude.maxActions, `${label} nightStructure.interlude.budget 不能小于 maxActions`);
  assertArrayMin(interlude.actions, 2, `${label} nightStructure.interlude.actions 至少需要两个真正不同的行动位`);
  const actionIds = new Set();
  interlude.actions.forEach((action, actionIndex) => {
    assertNonEmptyString(action.id, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 id`);
    assert(!actionIds.has(action.id), `${label} nightStructure.interlude.actions id 重复: ${action.id}`);
    actionIds.add(action.id);
    assertNonEmptyString(action.label, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 label`);
    assertNonEmptyString(action.summary, `${label} nightStructure.interlude.actions[${actionIndex}] 缺少 summary`);
    if (action.kind === "interruptToast") {
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
    interlude.actions.some((action) => ["advisorCall", "advisorConflict", "interruptToast", "backflowEarly"].includes(action.kind)),
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
    assertArrayMin(structure.liveCounterBeats, 1, `${label} overnightStructure.liveCounterBeats 不能为空`);
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
        assert(choice.directionLabel !== choice.label, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 不能把主播完整台词直接写在按钮上`);
        assertNonEmptyString(choice.recapAftertaste, `${label} overnightStructure.liveCounterBeats[${beatIndex}].choices[${choiceIndex}] 必须为玩家的处理方式留下回看余味`);
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
  assert(Number.isInteger(structure.dayBudget) && structure.dayBudget > 0, `${label} overnightStructure.dayBudget 必须是正整数`);
  assert(Number.isInteger(structure.minDayScenes) && structure.minDayScenes > 0, `${label} overnightStructure.minDayScenes 必须是正整数`);
  assert(structure.minDayScenes <= structure.dayBudget, `${label} overnightStructure.minDayScenes 不能超过 dayBudget`);
  assertArrayMin(structure.dayScenes, 3, `${label} overnightStructure.dayScenes 至少需要三处`);
  assert(structure.dayBudget < structure.dayScenes.length, `${label} overnightStructure.dayBudget 必须小于地点数`);
  const sceneIds = new Set();
  const earnedIds = new Set();
  structure.dayScenes.forEach((scene, sceneIndex) => {
    assertNonEmptyString(scene.id, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 id`);
    assert(!sceneIds.has(scene.id), `${label} overnightStructure.dayScenes id 重复: ${scene.id}`);
    sceneIds.add(scene.id);
    assertNonEmptyString(scene.label, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 label`);
    assertNonEmptyString(scene.backdropClass, `${label} overnightStructure.dayScenes[${sceneIndex}] 缺少 backdropClass`);
    assert(["lab", "visit", "home", "studio", "document", "observe", "sitIn", "doorstep"].includes(scene.kind), `${label} overnightStructure.dayScenes[${sceneIndex}].kind 不合法`);
    assertNonEmptyString(scene.body?.access, `${label} overnightStructure.dayScenes[${sceneIndex}].body.access 必须向玩家说明联系与授权来源`);
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
        assert(openerIds.has(earnedId), `${label} overnightStructure.interludeEarnedItemMap.${inventoryId} 缺少 callback opener: ${earnedId}`);
      });
    });
  }
  assertNonEmptyString(structure.callbackFallback?.line, `${label} overnightStructure.callbackFallback.line 不能为空`);
  assertNonEmptyString(structure.postures?.againstCaller, `${label} overnightStructure.postures.againstCaller 不能为空`);
  assertNonEmptyString(structure.postures?.withCaller, `${label} overnightStructure.postures.withCaller 不能为空`);
  if (structure.returnLead !== undefined) assertBeatLines(structure.returnLead?.lines, `${label} overnightStructure.returnLead.lines`);
  if (structure.returnBeat !== undefined) assertBeatLines(structure.returnBeat?.lines, `${label} overnightStructure.returnBeat.lines`);
  if (structure.callerQuestion !== undefined) {
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
    assert(Number.isInteger(document.markLimit) && document.markLimit > 0, `${label} documents[${documentIndex}].markLimit 必须是正整数`);
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
    assertDeepEqual(Object.keys(packet.presentation?.caller?.artVariants ?? {}).sort(), ["guarded", "neutral", "pause"], `第 ${index + 1} 宗快案来电人必须有 neutral / guarded / pause 三态`);
    [
      ...Object.values(packet.presentation.host.artVariants),
      ...Object.values(packet.presentation.caller.artVariants)
    ].forEach((artPath) => {
      const runtimeMeta = pngMetadata(p0PortraitFiles.get(artPath));
      const nativeMeta = pngMetadata(p0PortraitNativeFiles.get(artPath));
      assert(runtimeMeta?.width === 1024 && runtimeMeta?.height === 2048 && runtimeMeta.hasAlpha, `第 ${index + 1} 宗快案立绘必须是 1024x2048 真透明 PNG: ${artPath}`);
      assert(nativeMeta?.width === 256 && nativeMeta?.height === 512 && nativeMeta.hasAlpha, `第 ${index + 1} 宗快案立绘必须保留 256x512 真透明母版: ${artPath}`);
    });
    assert(/^\d{2}$/.test(packet.caseNumber), `${packet.id} caseNumber 必须是两位数字`);
    assertNonEmptyString(packet.title, `${packet.id} 缺少选择页标题`);
    assertCallerIntentProfile(packet.callerIntentProfile, packet.id);
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
      assert(axisCommentValues.length >= 4, `${casePacket.caseId} 至少需要 4 条路线轴弹幕`);
      axisCommentValues.forEach((comment, commentIndex) => {
        assertNonEmptyString(comment, `${casePacket.caseId} routeAxisComments[${commentIndex}] 不能为空`);
      });
      assertCaseClosing(casePacket.caseClosing, casePacket.caseId);
      assertCareChoices(casePacket.careChoices, casePacket.caseId);
      assertCaseTitle(casePacket.caseTitle, casePacket.caseId);
      assertHostIdentity(casePacket, casePacket.caseId);
    }
    ["true", "edited", "unknown"].forEach((field) => {
      assert((casePacket.truthBoundary?.[field] ?? []).length > 0, `${casePacket.caseId} truthBoundary.${field} 不能为空`);
    });
    const boundaryItems = ["true", "edited", "unknown"].flatMap((field) => casePacket.truthBoundary?.[field] ?? []);
    assert(boundaryItems.length >= 6, `${casePacket.caseId} truthBoundary 至少需要 6 条，不能退回三栏各一的小测验`);
    assert((casePacket.truthBoundary?.true ?? []).length >= 2, `${casePacket.caseId} truthBoundary.true 至少需要 2 条，避免固定成三栏各一`);
    assert((casePacket.quotePickCandidates ?? []).length >= 3, `${casePacket.caseId} 至少需要三句原话候选`);
    assert((casePacket.accusationChoices ?? []).length >= 3, `${casePacket.caseId} 至少需要三句最终收麦原话`);
    assertQuotePickCandidates(casePacket, casePacket.caseId);
    (casePacket.accusationChoices ?? []).forEach((choice, choiceIndex) => {
      assert(choice.label && /^“.+”$/.test(choice.label), `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦必须像原话`);
      assert(choice.accuse || choice.accuseRole, `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦缺少责任指向`);
      assert(choice.response, `${casePacket.caseId} 第 ${choiceIndex + 1} 句最终收麦缺少主播回应`);
    });
  });
  const transitionInterludes = (manifest.nightShell?.interludes ?? []).slice(0, -1);
  assertEqual(transitionInterludes.length, Math.max(0, manifest.sequence.length - 1), "每两案之间必须有一张名言引页");
  transitionInterludes.forEach((interlude, index) => {
    const quote = interlude.transitionQuote;
    assert(quote && typeof quote === "object", `第 ${index + 1} 张案间引页缺少 transitionQuote`);
    ["text", "source"].forEach((field) => assertNonEmptyString(quote[field], `第 ${index + 1} 张案间引页缺少 ${field}`));
    assert(quote.bridge === undefined, `第 ${index + 1} 张案间引页不得用作者旁白预告下一案`);
    assert(!quote.text.startsWith("“") && !quote.text.endsWith("”"), `第 ${index + 1} 张案间引页原文不应自带外层引号`);
  });
});

test("PACK-004", "comments and route archetypes are present", () => {
  assertEqual(comments.themeId, manifest.theme.id, "comments themeId 必须和 manifest theme 对齐");
  assert((comments.commentSeeds ?? []).length >= Math.min(4, manifest.size), "评论种子数量要覆盖当前故事包规模");
  assert(manifest.theme?.thesis?.includes("对自己有利的那一截"), "包级主题必须点明来电人只展示对自己有利的部分");
  assert(manifest.theme?.commentPrompt?.includes("材料对上的") && manifest.theme?.commentPrompt?.includes("材料没写的"), "观察题必须奖励已对上的直说、未写明的停住");
  assert(comments.highRevealTone?.includes("该点的那句") && comments.highRevealTone?.includes("点到了"), "高揭示奖励必须回到玩家点中的具体说法");
  assert(comments.lowRevealTone?.includes("省掉的那句") && comments.lowRevealTone?.includes("还没听出来"), "低揭示反馈必须指出来电人仍有没说出的话");
  const archetypes = routeArchetypes.archetypes ?? [];
  ["money-flow", "document-edge", "caller-credibility", "process-control", "identity-wording"].forEach((axis) => {
    assert(archetypes.some((item) => item.id === axis), `路线原型缺少 ${axis}`);
  });
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

      assertArrayMin(casePacket.sceneVersions, 3, `${casePacket.caseId} sceneVersions 至少要有三段可追问内容`);
      assertArrayMin(casePacket.sceneVersions, 5, `${casePacket.caseId} 试玩包案件至少需要五段来电，不能退回短问答`);
      assertDetectiveAuthoringLedger(casePacket, casePacket.caseId);
      assert(
        casePacket.sceneVersions.some((scene) => (scene.questionOptions ?? []).some((option) => option.guardedAnswer)),
        `${casePacket.caseId} 至少需要一条 guardedAnswer，让现场防备有写好的回答后果`
      );
      const evidenceCardIds = new Set((casePacket.evidenceCards ?? []).map((card) => card.id).filter(Boolean));
      const evidenceCheckIds = new Set((casePacket.evidenceChecks ?? []).map((check) => check.id).filter(Boolean));
      casePacket.sceneVersions.forEach((scene, sceneIndex) => {
        assertNonEmptyString(scene.speakerId, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 speakerId`);
        const hasAuthoredLead = typeof scene.entryQuestion === "string" && scene.entryQuestion.trim().length > 0;
        const hasHostLead = (scene.beforeVersion?.lines ?? []).some((line) => line?.role === "host");
        assert(hasAuthoredLead || hasHostLead, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少自然入场问句，正文不能以孤立独白开页`);
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
        assertArrayMin(scene.questionOptions, 2, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要两个追问选项`);
        assertAtLeastOneCorrect(scene.questionOptions, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要一个核心追问`);
        assertEqual(
          scene.questionOptions.filter((option) => option.suspicionLabel !== undefined).length,
          scene.questionOptions.length,
          `${casePacket.caseId} sceneVersions[${sceneIndex}] 所有承重选项都必须只显示疑点方向，不能把完整问句放到按钮上`
        );
        scene.questionOptions.forEach((option, optionIndex) => {
          assertNonEmptyString(option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 question`);
          assertNonEmptyString(option.answer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 answer`);
          assertNonEmptyString(option.suspicionLabel, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].suspicionLabel 不能为空`);
          assert(option.suspicionLabel.length <= 24, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].suspicionLabel 过长，不再是疑点短标签`);
          assert(!/[？?。！!]$/.test(option.suspicionLabel), `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}].suspicionLabel 应是方向，不是完整语句`);
          assert(option.suspicionLabel !== option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 疑点标签不能原样复制主播问句`);
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
      assertEqual(revealRoutes.length + revealInterrupts.length, 1, `${casePacket.caseId} 必须且只能有一个玩家挣到的案内核心反转过场`);

      assertArrayMin(casePacket.evidenceChecks, 1, `${casePacket.caseId} 至少需要一个材料检视`);
      if (casePacket.caseId === "04-workplace") {
        assertArrayMin(casePacket.evidenceChecks, 2, "04-workplace 必须有两份材料检视，体现职场流程压力");
      }
      casePacket.evidenceChecks.forEach((check, checkIndex) => {
        assertEvidenceOperation(check, `${casePacket.caseId} evidenceChecks[${checkIndex}]`, { requireMaterialRows: true });
        (check.options ?? []).forEach((option, optionIndex) => {
          if (option.revisesScene === undefined) return;
          const scene = casePacket.sceneVersions?.[option.revisesScene];
          assert(scene, `${casePacket.caseId} evidenceChecks[${checkIndex}].options[${optionIndex}] revisesScene 指向不存在的场景`);
          assertNonEmptyString(scene.revisedVersion, `${casePacket.caseId} evidenceChecks[${checkIndex}].options[${optionIndex}] revisesScene 指向的场景缺少 revisedVersion`);
        });
      });

      assertArrayMin(casePacket.investigationHooks, 1, `${casePacket.caseId} 至少需要一个后台回流`);
      assertInvestigationSourceRules(casePacket, casePacket.caseId);
      casePacket.investigationHooks.forEach((hook, hookIndex) => {
        assertNonEmptyString(hook.source, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 source`);
        assertNonEmptyString(hook.triggerContradiction, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 triggerContradiction`);
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

      assertNonEmptyString(casePacket.deepFollowup?.question, `${casePacket.caseId} deepFollowup.question 不能为空`);
      assertNonEmptyString(casePacket.deepFollowup?.answer, `${casePacket.caseId} deepFollowup.answer 不能为空`);
      assertNonEmptyString(casePacket.deepFollowup?.note, `${casePacket.caseId} deepFollowup.note 不能为空`);
      if (casePacket.deepFollowup?.resistanceBeat !== undefined) {
        assertBeatLines(casePacket.deepFollowup.resistanceBeat?.lines, `${casePacket.caseId} deepFollowup.resistanceBeat.lines`);
      }
      assertNonEmptyString(casePacket.selfServingOmission, `${casePacket.caseId} 必须写出来电人对自己不利的修剪`);
      assertNonEmptyString(casePacket.thirdPressure, `${casePacket.caseId} 必须有第三压力源`);
      assert((casePacket.evidenceChecks?.length ?? 0) + (casePacket.investigationHooks?.length ?? 0) >= 2, `${casePacket.caseId} 至少需要两份可读材料`);
      assert(collectTextLength({
        openingDialogue: casePacket.openingDialogue,
        sceneVersions: casePacket.sceneVersions,
        evidenceChecks: casePacket.evidenceChecks,
        investigationHooks: casePacket.investigationHooks,
        deepFollowup: casePacket.deepFollowup,
        stageJudgement: casePacket.stageJudgement,
        followupTwist: casePacket.followupTwist,
        truth: casePacket.truth
      }) >= 2600, `${casePacket.caseId} 文本体量过薄，不能支撑试玩包单案`);
      ["stageJudgement", "storyInterludeRecap", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"].forEach((field) => {
        assertNonEmptyString(casePacket[field], `${casePacket.caseId} ${field} 不能为空`);
        const prosePunctuation = casePacket[field].replace(/\d{1,3}(?:,\d{3})+/g, "");
        assert(!/[,:;]/.test(prosePunctuation), `${casePacket.caseId} ${field} 玩家可见中文正文不得混入半角逗号、冒号或分号`);
      });
    });
});

test("PACK-005A", "each long case has one two-act testimony wall with bounded decisive presents", () => {
  let hiddenStatementCount = 0;
  const act2OpenerLocks = {
    "01-credit": ["17500", "十四个月"],
    "02-tony": ["十二万", "帮我买"],
    "03-profile": ["二十八万八", "二十万", "不对等"],
    "04-workplace": ["没走完", "付款"]
  };
  for (const packet of caseFiles) {
    const walls = (packet.sceneVersions ?? []).filter((scene) => scene.interactionMode === "testimonyWall");
    assertEqual(walls.length, 1, `${packet.caseId} 必须且只能有一场 testimonyWall`);
    const scene = walls[0];
    const legacyStatements = scene.testimonyWall?.statements ?? [];
    const acts = scene.testimonyWall?.acts ?? [];
    assertEqual(acts.length, 2, `${packet.caseId} 证词墙必须恰好两幕`);
    const [act1, act2] = acts;
    assertDeepEqual(act1.statements, legacyStatements, `${packet.caseId} act1 必须原样沿用旧 testimonyWall.statements`);
    assertDeepEqual(act1.decisivePresent, scene.decisivePresent, `${packet.caseId} act1 必须原样沿用旧 decisivePresent 落点`);
    assert(legacyStatements.length >= 4 && legacyStatements.length <= 6, `${packet.caseId} act1 证词墙必须有 4 到 6 句`);
    assert((act2.statements ?? []).length >= 3 && (act2.statements ?? []).length <= 4, `${packet.caseId} act2 必须有 3 到 4 句`);
    [act1, act2].forEach((act, actIndex) => {
      (act.statements ?? []).forEach((statement, statementIndex) => {
        assertNonEmptyString(statement.id, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 id`);
        assertNonEmptyString(statement.text, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 text`);
        assertNonEmptyString(statement.pressResponse, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 pressResponse`);
        assertNonEmptyString(statement.presentResponse, `${packet.caseId} acts[${actIndex}].statements[${statementIndex}] 缺少 presentResponse`);
        if (statement.hidden) hiddenStatementCount += 1;
      });
      assertNonEmptyString(act.midSummary, `${packet.caseId} acts[${actIndex}] 缺少主播中场小结`);
      const present = act.decisivePresent;
      assertEqual(present?.maxAttempts, 2, `${packet.caseId} act${actIndex + 1} 决定性 PRESENT 必须严格限两次`);
      assert((act.statements ?? []).some((statement) => statement.id === present?.statementId), `${packet.caseId} act${actIndex + 1} 决定性证词句不存在`);
      assert((present?.materialCards ?? []).length >= 3, `${packet.caseId} act${actIndex + 1} 正式指认前必须展示材料卡选择器`);
      const correctCard = present.materialCards.find((card) => card.id === present.evidenceId);
      assert(correctCard, `${packet.caseId} act${actIndex + 1} 决定性材料不在选择器中`);
      ["callerLine", "hostLine", "boundaryLine", "contradiction"].forEach((field) => assertNonEmptyString(present[field], `${packet.caseId} acts[${actIndex}].decisivePresent.${field} 不能为空`));
      const evidenceParts = String(present.evidenceId).split(":");
      const documentId = evidenceParts[0];
      const document = (packet.documents ?? []).find((item) => item.id === documentId);
      if (document) {
        const rowIds = correctCard.sourceRowIds ?? evidenceParts.slice(1).join(":").split("+");
        rowIds.forEach((rowId) => assert(document.rows.some((row) => row.rowId === rowId), `${packet.caseId} act${actIndex + 1} 决定性材料指向不存在的文档行 ${rowId}`));
      } else {
        const sourceScene = (packet.sceneVersions ?? []).find((item) => item.id === documentId);
        const statementId = evidenceParts.slice(1).join(":");
        const sourceStatement = sourceScene?.testimonyWall?.acts?.[0]?.statements?.find((statement) => statement.id === statementId);
        assert(sourceScene && sourceStatement, `${packet.caseId} act${actIndex + 1} 决定性材料必须来自已有文档行或第一幕证词`);
        assert(correctCard.kind?.includes("原话回放"), `${packet.caseId} act${actIndex + 1} 第一幕证词来源必须标为原话回放`);
        assert(correctCard.excerpt?.includes(sourceStatement.text), `${packet.caseId} act${actIndex + 1} 原话回放必须逐字包含来源证词`);
      }
    });
    assert(scene.testimonyWall?.reliefBeat?.comment && scene.testimonyWall?.reliefBeat?.hostLine, `${packet.caseId} climax 前缺少喜剧泄压拍`);
    assertNonEmptyString(act2.revisedFrame, `${packet.caseId} act2 必须登记 revisedFrame`);
    const act2OpenerText = (act2.openerLines ?? []).map((line) => line.text ?? "").join(" ");
    assert((act2.openerLines ?? []).length >= 2, `${packet.caseId} act2 必须先播放来电人与主播的改口开场`);
    assert((act2.openerFactKeywords ?? []).length >= 1, `${packet.caseId} act2 必须登记首幕决定性事实关键词`);
    (act2.openerFactKeywords ?? []).forEach((keyword) => assert(act2OpenerText.includes(keyword), `${packet.caseId} act2 openerLines 必须承认首幕决定性事实 ${keyword}`));
    (act2OpenerLocks[packet.caseId] ?? []).forEach((keyword) => assert(act2OpenerText.includes(keyword), `${packet.caseId} act2 openerLines 必须保留锁定承认词 ${keyword}`));
    const act1Texts = new Set((act1.statements ?? []).map((statement) => statement.text));
    const act2Bearing = (act2.statements ?? []).find((statement) => statement.id === act2.decisivePresent?.statementId);
    assert(act2Bearing && !act1Texts.has(act2Bearing.text), `${packet.caseId} act2 承重句不得等于 act1 任一证词`);
    assert((act2.decisivePresent?.boundaryLineKeyPhrases ?? []).length >= 1, `${packet.caseId} act2 必须登记 boundaryLine 关键短语锁`);
    (act2.decisivePresent?.boundaryLineKeyPhrases ?? []).forEach((phrase) => {
      assert(act2.decisivePresent.boundaryLine.includes(phrase), `${packet.caseId} act2 boundaryLine 必须包含登记短语 ${phrase}`);
      assert(!act2Bearing.text.includes(phrase), `${packet.caseId} act2 承重句不得提前说出最终事实边界 ${phrase}`);
    });
    assert(act2.decisivePresent.evidenceId !== act1.decisivePresent.evidenceId, `${packet.caseId} act2 不得复用 act1 的决定性证据`);
    const transformed = (act2.statements ?? []).filter((statement) => statement.survivesFromAct1);
    assert(transformed.length >= 1, `${packet.caseId} act2 至少一条证词必须由 act1 存活说法变形而来`);
    transformed.forEach((statement) => {
      const source = (act1.statements ?? []).find((candidate) => candidate.id === statement.survivesFromAct1);
      assert(source, `${packet.caseId} act2 变形证词指向不存在的 act1 句 ${statement.survivesFromAct1}`);
      assert(statement.text !== source.text, `${packet.caseId} act2 变形证词必须改写措辞，不能原样重复`);
    });
    assertEqual((act2.comparison ?? []).length, (act1.statements ?? []).length, `${packet.caseId} act2 对照表必须覆盖 act1 每句证词`);
    const profile = packet.dialoguePresentation ?? {};
    assert(profile.speedTiers?.strained && profile.speedTiers?.stalled, `${packet.caseId} dialoguePresentation 必须有两档额外字速`);
    ["host", "caller", "respondent"].forEach((role) => assert(Number(profile.blipPitchHz?.[role]) > 0, `${packet.caseId} 缺少 ${role} blip 音高`));
    (packet.sceneVersions ?? []).filter((candidate) => candidate.interactionMode !== "testimonyWall").forEach((candidate) => {
      assert(splitDialogueSentences(candidate.version ?? "").length <= 5, `${packet.caseId}/${candidate.id} version 超过 5 句`);
    });
  }
  assert(hiddenStatementCount >= 1, "至少一案必须由 PRESS 揭出隐藏矛盾句");

  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const caseOnePresent = caseOne.sceneVersions.find((scene) => scene.decisivePresent)?.decisivePresent;
  assertEqual(caseOnePresent?.evidenceId, "case1-bank-flow:r16", "案1必须锁定月转 17500 × 14 个月流水行");
  assertEqual(caseOnePresent?.statementId, "credit-consumption-gloss", "案1必须把流水出示在粉饰消费证词上");
  assert(JSON.stringify(caseOne.documents).includes("月转 17500 × 14 个月"), "案1文档必须保留锁定原句");

  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourScene = caseFour.sceneVersions.find((scene) => scene.decisivePresent);
  assertEqual(caseFourScene?.decisivePresent?.evidenceId, "case4-payment-ledger:q07", "案4必须锁定缺失付款栏 q07");
  assert(caseFourScene.testimonyWall.statements.find((statement) => statement.id === caseFourScene.decisivePresent.statementId)?.text.includes("流程都走完了"), "案4决定性证词必须保留‘流程都走完了’");

  ["02-tony", "03-profile"].forEach((caseId) => {
    const packet = caseFiles.find((candidate) => candidate.caseId === caseId);
    const present = packet.sceneVersions.find((scene) => scene.decisivePresent)?.decisivePresent;
    assertNonEmptyString(present?.selectionReason, `${caseId} 必须解释 A→B 翻转证据选择理由`);
    assert(/不证明|保留|未知/.test(present.selectionReason), `${caseId} 选择理由必须写明事实边界`);
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
    /07-05→07-19/,
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
    assert(typedStrings.every((text) => !/[，：；]/.test(text)), `epilogue.unreadMessages[${index}] 打字面标点不合规`);
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
  assert(caseTwoCallback?.base?.includes("Tony 还是只说已经提交") && caseTwoCallback?.base?.includes("到底进没进产品,还是不知道"), "宸直新闻后必须回到案二材料，同时保留资金是否入产品未知");
});

test("PACK-013", "warmth props close their arcs and the personal livestream stays solo", () => {
  const hostProfile = castRegistry.cast?.find((profile) => profile.id === "host-lin-xuyang");
  assertEqual(hostProfile?.gender, "男", "主播性别背景必须固定");
  assertEqual(hostProfile?.age, 33, "主播年龄背景必须固定为三十三岁");
  assertEqual(hostProfile?.formerOccupation, "互联网大厂法务", "主播前职业不得退回媒体机构从业者");
  assertEqual(hostProfile?.streamerTenure, "两年半", "主播年限必须固定为两年半");
  assertEqual(hostProfile?.relationships?.find((relationship) => relationship.with === "zhao-lawyer")?.publicLabel, "妻子", "赵律师与林旭阳的关系必须保持夫妻设定");
  assert(hostProfile?.personality?.stressResponse?.includes("证据已经对齐") && hostProfile?.personality?.stressResponse?.includes("收笑"), "主播人物档案必须固定事实闭合后的动怒触发点");
  assert(hostProfile?.voice?.habits?.some((habit) => habit.includes("点名具体伤害")), "主播声纹必须允许证据闭合后作出明确价值判断");
  assert(hostProfile?.voice?.avoid?.includes("把克制写成没有立场"), "主播不得重新退回没有立场的逻辑机器");
  const zhaoProfile = castRegistry.cast?.find((profile) => profile.id === "zhao-lawyer");
  assertEqual(zhaoProfile?.occupation, "执业律师", "赵律师的职业必须固定为执业律师");
  assert(hostProfile?.relationships?.find((relationship) => relationship.with === "zhao-lawyer")?.dynamic?.includes("大学同学"), "林旭阳与赵律师的大学同学关系必须写入固定人物档案");
  const backgroundLine = manifest.nightShell?.prologue?.lines?.find((line) => line.type === "background");
  assertEqual(backgroundLine?.speaker, "林旭阳", "主播履历必须由本人第一人称介绍");
  assert(backgroundLine?.text?.includes("互联网大厂做法务") && backgroundLine?.text?.includes("两年半"), "开篇必须交代前职业、失业转折和主播年限");
  assert(backgroundLine?.text?.includes("老婆") && backgroundLine?.text?.includes("大学同学") && backgroundLine?.text?.includes("执业律师"), "开篇自我介绍必须交代赵律师是大学同学、妻子和执业律师");
  assert(backgroundLine?.text?.includes("我老婆姓赵"), "开篇必须先交代妻子的姓氏，后续出现‘赵律师’时玩家才能认出她");
  const prologueText = manifest.nightShell?.prologue?.lines?.find((line) => line.speaker === "老婆")?.text ?? "";
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
  assert(epilogue.close?.includes("你当年没问完的那通"), "文件袋便签没有形成正式版主线钩子");
  assert(!epilogue.close?.includes("留给后续正式内容"), "玩家可见文件袋不得夹带编剧说明");
  const goLiveLine = manifest.nightShell?.prologue?.lines?.find((line) => line.type === "stage" && line.text?.includes("开始直播"));
  const streamStartLine = manifest.nightShell?.prologue?.lines?.find((line) => line.type === "narration" && line.text?.includes("推开直播间的门"));
  assert(streamStartLine?.text?.startsWith("晚上八点"), "普通情感连麦必须从晚上八点开播，不能设在凌晨一点");
  assert(streamStartLine?.text?.includes("你推开直播间的门"), "运行时序幕舞台动作必须使用第二人称，把玩家和林旭阳保持为同一行动者");
  assert(!collectTextFrom(manifest.nightShell?.prologue).includes("凌晨一点"), "序幕不得残留凌晨一点开播设定");
  assertEqual(goLiveLine?.speaker, "旁白", "个人主播开播倒计时必须写成舞台动作，不得成为工作人员台词");
  assertEqual(goLiveLine?.audioCueId, "sfx.broadcast.on-air", "个人主播开播只允许平台提示音，不得使用人声倒数");
  const authoredContent = JSON.stringify({ manifest, caseFiles });
  assert(!authoredContent.includes("导播"), "个人主播内容包不得出现导播角色或导播动作");
  assert(!authoredContent.includes("三、二、一"), "个人主播内容包不得出现电视台式人声倒数");
  assert(!authoredContent.includes('"role":"director"') && !authoredContent.includes('"speakerProfileId":"director"'), "个人主播内容包不得保留导播运行时角色");
  const caseThree = caseFiles.find((packet) => packet.caseId === "03-profile");
  assertEqual(assertDialogueTexture(caseThree).metrics.oneTimeCallerCount, 1, "案 3 oneTimeTic 必须维持唯一");
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
  assert(bankFlow.rowQuestions?.r13?.length && bankFlow.rowQuestions?.r14?.length && bankFlow.rowQuestions?.r15?.length, "三条资金行必须各有玩家可选追问");
  for (const rowId of ["r13", "r14", "r15"]) {
    for (const [index, question] of (bankFlow.rowQuestions?.[rowId] ?? []).entries()) {
      const contract = question.logicContract;
      assert(contract?.sourceRows?.includes(rowId), `${rowId} 追问 ${index} 必须登记自己的材料来源`);
      ["sourceProves", "sourceDoesNotProve", "answerAnchor", "answerAdds", "nextLegalQuestion"].forEach((field) => {
        assertNonEmptyString(contract?.[field], `${rowId} 追问 ${index}.logicContract.${field} 不能为空`);
      });
      assert(question.answer.includes(contract.answerAnchor), `${rowId} 追问 ${index} 的回答没有落到合同锚点`);
      assert(contract.sourceProves !== contract.sourceDoesNotProve, `${rowId} 追问 ${index} 必须区分材料能证明和不能证明的内容`);
    }
  }
  const trustCrossQuestion = bankFlow.crossQuestions?.find((question) => ["r13", "r14", "r15"].every((rowId) => question.rows?.includes(rowId)));
  assert(trustCrossQuestion, "三条信托资金行必须有跨行追问");
  assertDeepEqual(trustCrossQuestion.logicContract?.sourceRows, ["r13", "r14", "r15"], "信托跨行追问必须登记完整来源");
  assert(trustCrossQuestion.answer.includes(trustCrossQuestion.logicContract?.answerAnchor), "信托跨行追问回答必须守住资金同一性边界");
  assert(caseOne.respondentNote?.text?.includes("从澄川借的") && caseOne.respondentNote?.text?.includes("买了宸直的产品"), "流水只给相邻关系后，必须由当事人补足资金用途的第二来源");
  assert(caseOne.respondentNote?.text?.includes("能翻倍"), "超额收益动机必须通过当事人原话落地");

  const trustPromise = (manifest.crossCasePromises ?? []).find((promise) => promise.id === "chenzhi-trust-payment-crisis");
  assertEqual(trustPromise?.corporateSeed?.caseId, "04-workplace", "宸直企业线必须在职场案落下共享硬件公司种子");
  assertEqual(trustPromise?.corporateSeed?.entityId, "qixing-shared-tech", "职场案企业种子必须指向虚构的栖行共享科技");
  ["主要股东", "共享硬件", "层层返费", "估值"].forEach((anchor) => {
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
    afterVersion: profileMotiveScene?.afterVersion,
    question: profileMotiveQuestion,
    judgement: caseThree?.stageJudgement,
    closingBeats: caseThree?.caseClosing?.beats,
    confirmed: caseThree?.caseClosing?.confirmed
  });
  assert(profileMotiveText.includes("父母都是普通上班") && profileMotiveText.includes("婚房也帮不上"), "案三必须由父母调查问出男方普通家境，不能只停在 MBA 标签");
  assert(profileMotiveText.includes("没说骗") && profileMotiveText.includes("彩礼就该多拿一点"), "案三父母必须借家境落差加价，不能继续把它写成单纯受骗反应");
  assert(profileMotiveQuestion?.suspicionLabel?.includes("有没有叫停"), "案三承重按钮必须让玩家判断咨询者知情后有没有叫停");
  assert(profileMotiveText.includes("条件更好") && profileMotiveText.includes("这些付出是应该的"), "案三必须在事实状态中保留咨询者的条件优越感及其对男方投入的理所当然");

  const firstTailText = JSON.stringify(interludesByCaseId.get("01-credit") ?? {});
  assert(firstTailText.includes("收益写得很高"), "案一小尾声必须由赵律师补入高收益合同风险");
  assert(firstTailText.includes("一轮一轮往外融"), "案一小尾声必须说明大盘子对外部融资的依赖");

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
  assert(caseOneDeviceText.includes("这一万二是花在我身上") && caseOneDeviceText.includes("不是我签的"), "案一设备段必须承认一万二是咨询者的直接受益，同时保留分期签字边界");
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
  assert(returnLeadText.includes("有人来问了几句话") && returnLeadText.includes("我现在不太想说"), "案二第二夜回拨必须先让咨询者继续闪躲");
  assert(returnLeadText.includes("你现在安全吗") && returnLeadText.includes("安全"), "案二主播追问前必须先接住咨询者当下的安全处境");
  assert(!/民警|警察|警车|报案|十二万|酒吧|宸直|高利贷/.test(returnLeadText), "案二回拨先行拍不得自动交出玩家应问出的来人、职业和资金答案");

  const whoMessagedScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-who-messaged");
  const whoMessagedText = JSON.stringify(whoMessagedScene ?? {});
  assert(whoMessagedScene?.questionOptions?.some((option) => option.correct && /警察/.test(JSON.stringify({ answer: option.answer, lines: option.lines })) && /放高利贷/.test(JSON.stringify({ answer: option.answer, lines: option.lines })) && /涉案/.test(JSON.stringify({ answer: option.answer, lines: option.lines }))), "Tony 案必须由玩家问出警察因高利贷放款人涉案、按借款人来找");
  assert(whoMessagedText.includes("我在酒吧做营销") && whoMessagedText.includes("订台") && whoMessagedText.includes("看桌") && whoMessagedText.includes("酒") && whoMessagedText.includes("提成"), "案二必须在问出来人后的场尾才问出具体职业与结算方式");
  assert(whoMessagedScene?.sceneCloser?.lines?.some((line) => line.text?.includes("为什么会去借这种钱")), "案二职业追问必须位于玩家选择后的场尾，不能放在 afterVersion 提前播放");
  assert(!whoMessagedScene?.afterVersion, "案二不得用 afterVersion 在玩家选择前泄露来人与职业");
  assert(whoMessagedText.includes("酒桌上听的") && whoMessagedText.includes("后来才去问他"), "案二必须明确高息来自酒桌，也不是 Tony 第一次告诉她的");

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
  assert(`${caseTwo?.caseClosing?.beats?.map((beat) => beat.text).join(" ") ?? ""}${caseTwo?.careChoices?.map((choice) => choice.hostLine).join(" ") ?? ""}`.includes("留晚档"), "案二结案不得因销售动机倒销 Tony 真实发生过的照顾");
  assert(callerProfile?.background?.includes("酒吧做营销") && callerProfile?.background?.includes("提成") && callerProfile?.background?.includes("轮休在家"), "案二来电人的固定角色档案必须登记职业、结算方式和连麦地点");

  const caseTwoInterlude = interludesByCaseId.get("02-tony");
  const caseFourInterlude = interludesByCaseId.get("04-workplace");
  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourOpeningText = JSON.stringify(caseFour?.openingDialogue ?? []);
  const supplierRoute = caseFour?.overnightStructure?.dayScenes?.find((scene) => scene.id === "day-work-supplier-visit");
  const supplierRouteText = JSON.stringify(supplierRoute ?? {});
  const caseFourTailText = JSON.stringify(caseFourInterlude ?? {});
  assert(caseFourOpeningText.includes("栖行共享科技") && caseFourOpeningText.includes("共享充电柜和储物柜") && caseFourOpeningText.includes("宸直是主要股东之一"), "职场案开场必须先把共享硬件业务与宸直股东关系说清");
  ["招商主管", "区域经理", "采购经办", "点位协调费", "渠道维护费", "采购配合费"].forEach((anchor) => {
    assert(supplierRouteText.includes(anchor), `供应商白天路线缺少 ${anchor}`);
  });
  assert(supplierRouteText.includes("六万八是公司报销") && supplierRouteText.includes("两件事别混着问"), "三层返费不得污染咨询者六万八的正式报销路径");
  ["押金二十九", "一次一块五", "维护费和场地分成", "估值", "私人飞机", "法国", "酒庄"].forEach((anchor) => {
    assert(caseFourTailText.includes(anchor), `职场案案后讨论缺少 ${anchor}`);
  });
  assert(caseFourTailText.includes("八卦不能拿来算公司的账"), "公子八卦必须留在案后讨论，并明确不能替代公司账目证据");
  assertEqual(caseFourInterlude?.worldEcho, undefined, "第二通职场案结尾不得提前宣布宸直全面兑付危机");
  assert(caseTwoInterlude?.worldEcho?.headline?.includes("全部产品暂停兑付"), "最后一通 Tony 案结尾必须回收宸直全面兑付危机");
  assert(caseTwoInterlude?.worldEcho?.doesNotProve?.includes("最后一通里何的十二万元") && caseTwoInterlude?.worldEcho?.doesNotProve?.includes("周的一百万元"), "最终公共事件必须保留 Tony 案两笔资金各自的证明边界");
});

test("PACK-015", "case 4 exposes a seven-row relative-time payment document", () => {
  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const paymentLedger = caseFour?.documents?.find((document) => document.id === "case4-payment-ledger");
  assert(paymentLedger, "案四必须新增她整理的七条报销记录");
  assertEqual(paymentLedger.dateMode, "relative", "案四文档必须显式声明相对时间，不能伪造月日");
  assertEqual(paymentLedger.rows?.length, 7, "案四流转记录必须有七行");
  assertEqual(paymentLedger.columns?.length, 4, "案四流转记录必须显式定义四个玩家可见字段");
  assertEqual(paymentLedger.rows?.find((row) => row.rowId === "q05")?.date, "九天后", "财务延后通知必须写成九天后，不能写歧义 D+9");
  ["q02", "q04", "q06"].forEach((rowId) => {
    assert(paymentLedger.rowQuestions?.[rowId]?.length, `案四 ${rowId} 必须有行级追问`);
  });
  assertEqual(paymentLedger.crossQuestions?.length, 2, "案四必须有两组跨行追问");
  assert(paymentLedger.crossQuestions?.some((question) => ["q01", "q02"].every((rowId) => question.rows?.includes(rowId))), "案四必须比较公开流程与十七分钟后的私聊");
  assert(paymentLedger.crossQuestions?.some((question) => ["q04", "q06"].every((rowId) => question.rows?.includes(rowId))), "案四必须比较活动立项页与正式报销缺失行，明确立项不能替代报销申请");
  const dayScene = caseFour?.overnightStructure?.dayScenes?.find((scene) => scene.id === "day-work-payment-ledger");
  assertEqual(dayScene?.body?.documentId, paymentLedger.id, "案四白天文档场景必须接到新增流转记录");
  assertEqual(dayScene?.body?.earnedItemId, "她整理的报销时间线", "案四文档场景必须授予同名回拨物");
  assert(caseFour?.overnightStructure?.callbackOpeners?.["她整理的报销时间线"]?.firstConflict, "案四新增时间线必须有第一轮冲突");
  assert(paymentLedger.rows?.find((row) => row.rowId === "q01")?.memo?.includes("报价比较"), "案四公开流程必须写清对公付款需要比较报价");
  assert(paymentLedger.rows?.find((row) => row.rowId === "q02")?.memo?.includes("比价来不及") && paymentLedger.rows?.find((row) => row.rowId === "q02")?.memo?.includes("个人卡"), "案四私聊必须写清绕过比价后为何改刷咨询者个人卡");
  assert(paymentLedger.rows?.find((row) => row.rowId === "q04")?.date?.includes("活动前一天通过") && paymentLedger.rows?.find((row) => row.rowId === "q04")?.memo?.includes("旧立项页"), "案四立项必须钉死为活动前已批且活动后反复重发的旧页");
  assert(paymentLedger.rows?.find((row) => row.rowId === "q06")?.memo?.includes("LX 编号只能查询活动立项"), "案四 q06 必须改为正式报销申请编号缺口，不得把供应商返利塞进主材料板");
  const leaderScene = caseFour?.sceneVersions?.find((scene) => scene.id === "work-leader-note");
  const leaderCoreRouteText = JSON.stringify(leaderScene?.questionOptions?.find((option) => option.correct) ?? {});
  assert(leaderScene?.beforeVersion === undefined && leaderCoreRouteText.includes("三个星期") && leaderCoreRouteText.includes("为什么不自己提报销"), "职场案第二夜必须先听完领导表扬，再由玩家沿核心方向追问发票为何放了三个星期");
});

test("PACK-016", "case 1 keeps two anonymous money edges and one institutional payoff", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const visibleCaseText = JSON.stringify(caseOne);
  assert(!visibleCaseText.includes("王**是谁"), "案一不得再把流水半姓写成独立猜人题");
  assert(!visibleCaseText.includes("王**的具体身份"), "案一未知清单不得把半姓另计一条身份线");
  assert(caseOne?.truthBoundary?.unknown?.some((item) => item.includes("每月 8 号") && item.includes("七月中断")), "案一未知清单必须把王姓转账并回 8 号供血规律");
  assert(caseOne?.truthBoundary?.unknown?.some((item) => item.includes("尾号 3301")), "案一必须保留 3301 私人尾号线");
  assert(caseOne?.truthBoundary?.unknown?.some((item) => item.includes("宸直信托") && item.includes("兑付状态")), "案一必须把宸直保留为机构结果线");
  const bankFlow = caseOne?.documents?.find((document) => document.id === "case1-bank-flow");
  const flowRows = bankFlow?.rows ?? [];
  assert(bankFlow?.title?.includes("关键交易摘录") && bankFlow?.intro?.includes("没有余额列") && bankFlow?.intro?.includes("不是完整收支表"), "案一银行材料必须明确是摘录，不能伪装成完整资金账本");
  assert(bankFlow?.intro?.includes("第一夜挂断前") && bankFlow?.intro?.includes("对方为了催她转账") && bankFlow?.intro?.includes("这次同意核的是这几页"), "案一银行摘录必须交代由男方主动提供、来电人转交，以及节目只获准核这几页");
  assert((caseOne?.nightStructure?.hangup?.line ?? "").includes("他刚又发来一个文件") && (caseOne?.nightStructure?.hangup?.line ?? "").includes("姓名和卡号都遮了"), "案一第一夜挂断前必须在麦上完成银行摘录的来源与遮名动作");
  const postSalaryGap = bankFlow?.crossQuestions?.find((question) => ["r04", "r04a", "r04b"].every((rowId) => question.rows?.includes(rowId)));
  assert(postSalaryGap?.answer?.includes("不知道") && postSalaryGap?.logicContract?.sourceDoesNotProve?.includes("期初余额"), "案一停薪后资金缺口必须保留未知，不能由咨询者猜成信用卡透支");
  assert(flowRows.some((row) => row.party?.includes("王**")), "案一流水行必须保留王姓半姓原始字段");
  assert(flowRows.some((row) => row.party === "宸直信托有限公司"), "案一不得删除宸直种子行");
  const timelineOpener = caseOne?.overnightStructure?.callbackOpeners?.["周会计的时间线"]?.line ?? "";
  assert(timelineOpener.includes("翻到七月 8 号，空的"), "周会计时间线回拨必须只钉住七月断流");
  assert(!/王\\*\\*是谁|王\\*\\*的具体身份/.test(timelineOpener), "周会计时间线回拨不得追猜王姓身份");
});

test("PACK-017", "case 1 does not overcue the ordinary bonus excuse", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const layoffScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-layoff-gap");
  assert(layoffScene, "案一必须保留失业时间差场景");
  assert(layoffScene.pressureHint?.expression === undefined, "奖金晚发首次出现时不需要额外表演标记替玩家画重点");
  assert(!JSON.stringify(caseOne).includes("把“奖金晚发”四个字记在纸上"), "案一不得恢复记纸条式强调动作");
});

test("PACK-017B", "case 1 wine-ordering actions stay causal and fit one reply page", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const anniversaryScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-anniversary-agency");
  assert(anniversaryScene, "案一必须保留纪念日晚餐场景");
  assert(anniversaryScene.version.includes("他看中一瓶，我说太贵了"), "酒水段必须先交代男方看中、咨询者反对，再落到最终下单");
  assert(anniversaryScene.version.includes("他还是点了") && anniversaryScene.version.includes("我没再拦"), "酒水段必须写清最终动作和咨询者的选择");
  assert(!anniversaryScene.version.includes("他把酒单推到我面前"), "不得用推酒单制造选酒主语，再突然改口“酒是他点的”");
  assert(anniversaryScene.version.length <= 92, "纪念日晚餐回答必须留在一个回答分页内，不能把动作因果拆断");
});

test("PACK-017C", "case 1 separates residence, salary control, and fixed support", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  assert(JSON.stringify(caseOne?.openingDialogue ?? []).includes("一年半左右"), "交往时长必须覆盖十四个月固定转账，不能保留旧的半年设定");
  const livingScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-living-arrangement");
  assert(livingScene, "案一必须保留居住与日常支出场景");
  assert(JSON.stringify(livingScene.beforeVersion ?? {}).includes("你们平时住在一起吗"), "居住情况必须先由主播作流程问话确认");
  assert((livingScene.version ?? "").includes("不住在一起"), "咨询者必须明确回答两人没有同住");
  assert(!(livingScene.version ?? "").includes("租"), "分住回答不得提前暴露咨询者租房，房租必须等第二天材料出现");
  const salaryQuestion = livingScene.questionOptions?.find((option) => option.correct && option.logicContract?.answerAnchor === "转我一半");
  assert(salaryQuestion, "玩家必须能把工资卡控制与固定转账分开追问");
  assert(salaryQuestion?.correct === true, "固定半薪必须是本场承重追问");
  assert((salaryQuestion?.question ?? "").includes("工资卡") && !(salaryQuestion?.question ?? "").includes("会交给你吗"), "工资追问必须先确认工资卡归谁持有，不得用含糊的上交问法");
  const salaryQuestionSurface = JSON.stringify({ answer: salaryQuestion.answer, lines: salaryQuestion.lines });
  assert(salaryQuestionSurface.includes("转我一半"), "工资追问必须先让咨询者承认男方固定转给她一半工资");
  assert(salaryQuestionSurface.includes("十四个月"), "工资追问必须补出一年多固定给付的可计算时长");
  assert(!salaryQuestionSurface.includes("他会固定转钱给你吗"), "确认工资卡后不得用同义问题再问一次固定转账");
  assert(!/(一万七千五|实发三万五)/.test(salaryQuestionSurface), "首次问到固定给付时不得让咨询者立刻提交完整金额报告，具体金额由后续流水确认");
  assert(!/(房租|三次电话)/.test(salaryQuestionSurface), "工资追问只回答固定转账，不得把第二天房租线挤进同一屏");
  assert((salaryQuestion.logicContract?.sourceDoesNotProve ?? "").includes("不能证明双方日常收入与支出彼此独立"), "没有同住和没拿工资卡不得被误写为经济独立");
  assert((salaryQuestion.logicContract?.nextLegalQuestion ?? "").includes("不能据此把男方自行签下的借款与信托认购归给咨询者"), "咨询者的索取不得越级改写男方借款与认购责任");
  const rentScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-rent-beneficiary");
  assert(!rentScene, "案一不得为了送出房租线索增设突兀的独立口供场景");
  const fixedSupportCheck = caseOne?.evidenceChecks?.find((check) => check.id === "credit-fixed-support");
  assert(fixedSupportCheck, "案一材料板必须让玩家比较工资与固定给付");
  assert(fixedSupportCheck.materialRows?.some((row) => row.includes("¥17,500 × 14 = ¥245,000")), "固定给付材料板必须显示十四个月累计金额");
  assert(fixedSupportCheck.options?.some((option) => option.correct && option.label?.includes("二十四万五") && option.label?.includes("十五万")), "固定给付材料板必须把累计转入与男方的存款估算放在一起比较");
  assert(fixedSupportCheck.options?.some((option) => !option.correct && option.feedback?.includes("不代表现在还剩十五万")), "固定给付材料板必须明确累计转入不等于当前余额");
  const bankFlow = caseOne?.documents?.find((document) => document.id === "case1-bank-flow");
  assertEqual(bankFlow?.rows?.find((row) => row.rowId === "r01")?.amount, "¥35,000", "三月工资必须与男方月收入设定一致");
  assertEqual(bankFlow?.rows?.find((row) => row.rowId === "r02")?.amount, "¥35,000", "四月工资必须与男方月收入设定一致");
  assertEqual(bankFlow?.rows?.find((row) => row.rowId === "r01a")?.amount, "¥17,500", "工资到账日必须有固定半薪转出");
  assertEqual(bankFlow?.rows?.find((row) => row.rowId === "r01b")?.amount, "¥10,000", "三月必须有一笔双月房租支出");
  assertEqual(bankFlow?.rows?.find((row) => row.rowId === "r04b")?.amount, "¥10,000", "五月必须再次出现同额双月房租支出");
  assert((bankFlow?.rows?.find((row) => row.rowId === "r01b")?.memo ?? "").includes("3—4月") && (bankFlow?.rows?.find((row) => row.rowId === "r04b")?.memo ?? "").includes("5—6月"), "两笔房租行必须明确各自覆盖两个月，不能伪装成每月支出");
  assert(!bankFlow?.rows?.some((row) => ["r02b", "r06b"].includes(row.rowId)), "双月房租不得继续保留四月和六月的旧月付行");
  assert(!bankFlow?.rowQuestions?.r01b, "完整流水不得在房租白天路线之后重复追问同一个住户事实");
  const supportScene = caseOne?.overnightStructure?.dayScenes?.find((scene) => scene.id === "day-support-payments");
  assert(supportScene, "第二天必须让玩家把双月房租从完整流水中单独圈出来");
  assertEqual(supportScene?.body?.choice?.options?.length, 2, "房租账页必须允许玩家选择先问住户还是是否另付");
  const rentHomeOpener = caseOne?.overnightStructure?.callbackOpeners?.["两个月一次的房租"];
  assert(JSON.stringify(rentHomeOpener?.firstConflict ?? {}).includes("是我住的"), "房租受益人只能在玩家带回问题并由主播问出后由咨询者承认");
  assert(JSON.stringify(rentHomeOpener?.firstConflict ?? {}).includes("房租不在一万七千五里面") && JSON.stringify(rentHomeOpener?.firstConflict ?? {}).includes("他自己住的地方也要另外花钱"), "房租回答必须把双月一万元、每月半薪与男方自己的住房成本拆开");
  assert((bankFlow?.rows?.find((row) => row.rowId === "r09")?.memo ?? "").includes("未见对尾号 6624 的固定转出"), "七月空行必须同时记录固定给付中断");
  const loyaltyScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-loyalty-test");
  const endorsementQuestion = loyaltyScene?.questionOptions?.find((option) => option.suspicionLabel === "她想从主播这里拿走什么");
  assert(endorsementQuestion?.correct === true, "第二夜必须让玩家追问来电人真正想获得的公开背书");
  assert(endorsementQuestion?.question?.includes("想让我替你说一句别转"), "公开背书追问必须回扣来电人想让主播替她拒绝转账的现实诉求");
  const endorsementAnswer = [
    endorsementQuestion?.answer,
    ...(endorsementQuestion?.lines ?? []).map((line) => line?.text),
  ].filter(Boolean).join("\n");
  assert(endorsementAnswer.includes("把回放发给他") && endorsementAnswer.includes("前面十四个月") && endorsementAnswer.includes("不想再跟他一笔一笔讲"), "来电人必须承认自己想借直播回避说明固定转账去向");
  assert(!JSON.stringify(caseOne).includes("帮我挡"), "案一垫款语境不得使用不自然的‘帮我挡’");
});

test("PACK-017D", "case 1 pays off the late-bonus euphemism without moving debt responsibility", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const loyaltyScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-loyalty-test");
  const severanceCard = caseOne?.evidenceCards?.find((card) => card.id === "daily-credit-severance");
  assert(loyaltyScene, "案一第二夜必须保留忠诚测试场景");
  assert(JSON.stringify(loyaltyScene.afterVersion ?? {}).includes("解除劳动合同补偿金"), "第二夜必须揭示所谓奖金的实际名目");
  assert(JSON.stringify(loyaltyScene.afterVersion ?? {}).includes("月工资三万五"), "离职结算通知必须与流水工资相互校验");
  assert(JSON.stringify(loyaltyScene.beforeVersion ?? {}).includes("你手里少说有十五万") && JSON.stringify(loyaltyScene.beforeVersion ?? {}).includes("只让你先拿八万"), "第二夜必须让男方亲口说明八万元请求的余额估算");
  assertEqual(loyaltyScene.showsCard, "daily-credit-severance", "补偿金揭示必须落到同名证据卡");
  assert((severanceCard?.front ?? "").includes("¥35,000"), "结算通知必须写明离职前月工资");
  assert((severanceCard?.front ?? "").includes("¥105,000"), "结算通知必须写明待发离职补偿金额");
  assert((severanceCard?.detail ?? "").includes("预计支付不等于已经到账"), "待发补偿不得被写成现有还款能力");
  assert((caseOne.deepFollowup?.question ?? "").includes("至少有十五万"), "深入追问必须沿男方估算追咨询者的实际余额");
  const deepFollowupText = JSON.stringify(caseOne.deepFollowup ?? {});
  assert(deepFollowupText.includes("一万一千六百多") && deepFollowupText.includes("十四个月的钱"), "咨询者必须报出余额并承认十四个月固定转账已基本花完");
  assert((caseOne.respondentNote?.text ?? "").includes("十四个月") && (caseOne.respondentNote?.text ?? "").includes("二十四万五"), "男方留言必须独立确认固定转账时长与累计金额");
  assert((caseOne.respondentNote?.text ?? "").includes("借款是我签的") && (caseOne.respondentNote?.text ?? "").includes("宸直也是我自己买的"), "女方催款可以构成压力，但不得替男方免除借款与认购责任");
});

test("PACK-017E", "case 1 earns the bill on air instead of preloading it in the bridge", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const billScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-eight-wan-bill");
  const firstSequenceItem = manifest.sequence.find((item) => item.caseId === "01-credit");
  assert(caseOne && billScene && firstSequenceItem, "案一与信用卡账单场景必须存在");
  assert(firstSequenceItem.bridge === undefined, "接通前不得用 bridge 旁白概括案情或递入材料");
  assert(caseOne.caseTitle?.intro === undefined, "标题卡不得在接通前替来电人概括求助或摆出材料");
  assert(caseOne.caseTitle?.subtitle === undefined, "案一标题卡不得用副标题提前概括收入与双方责任");
  const arrivalLines = billScene.beforeVersion?.lines ?? [];
  const requestIndex = arrivalLines.findIndex((line) => line.role === "host" && line.text.includes("发到后台"));
  const arrivalIndex = arrivalLines.findIndex((line) => line.role === "stage" && line.text.includes("后台多了一份账单") && line.text.includes("姓名和卡号都遮住了"));
  assert(requestIndex >= 0, "主播必须在麦上请咨询者遮名上传账单");
  assert(arrivalIndex > requestIndex, "后台账单必须在主播提出上传要求之后出现");
  ["八万出头", "餐厅", "一万二", "男装"].forEach((marker) => {
    assert(billScene.version.includes(marker), `账单上传后仍须保留玩家要核对的可见项目：${marker}`);
  });
  assert(billScene.version.includes("五千左右") && billScene.version.includes("一件大衣就两千多"), "案一男装必须改为约五千，并给出两千多一件大衣这个生活常识锚点");
  assert(!billScene.version.includes("跟我都有关系"), "咨询者第一次念账单时不能主动替约四万共同消费补上自己的受益主语");
  assert(!billScene.version.includes("差不多四万"), "咨询者第一次念账单时不能先报出后续由主播加总的共同消费金额");
  assert(billScene.questionOptions?.find((option) => option.correct)?.question?.includes("我把账单加了一下"), "约四万共同消费必须明确来自主播对后台账单的加总");
  assert(!/拿这句话挡着自己|把文件夹抱紧/.test(JSON.stringify(billScene)), "案一账单场景不得使用作者心理总结或来源不明的文件夹动作");
});

test("PACK-017E1", "case title cards do not narrate the call before pickup", () => {
  caseFiles.forEach((packet) => {
    assertNonEmptyString(packet.caseTitle?.title, `${packet.caseId} 标题卡必须保留案名`);
    assert(packet.caseTitle?.intro === undefined && packet.caseTitle?.subtitle === undefined, `${packet.caseId} 标题卡只能显示案名；求助、材料和判断必须等接通后出现`);
  });
});

test("PACK-017E2", "case 1 separates modest menswear, shared spending, and the unexplained gap on the first night", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const billScene = caseOne?.sceneVersions?.find((scene) => scene.id === "credit-eight-wan-bill");
  const gapQuestion = billScene?.questionOptions?.find((option) => option.correct);
  const menswearQuestion = billScene?.questionOptions?.find((option) => option.suspicionLabel?.includes("男装"));
  const billCard = caseOne?.evidenceCards?.find((card) => card.id === "daily-credit-card-bill");
  const billCheck = caseOne?.evidenceChecks?.find((check) => check.id === "credit-after-layoff-spend");
  assert(menswearQuestion?.question?.includes("一件大衣两千多") && menswearQuestion?.question?.includes("能说明他平时挥霍吗"), "主播必须用生活常识反问，不能把失业后的普通男装自动判成挥霍");
  assert(!menswearQuestion?.question?.includes("冬天"), "案一时间锁在七月，主播不能为了大衣判断凭空把现场说成冬天");
  assert(menswearQuestion?.answer?.includes("单看五千") && menswearQuestion?.answer?.includes("已经没工作了"), "咨询者必须把不满落在失业后仍消费，而不是夸大男装本身的金额");
  assert(menswearQuestion?.correct === false, "五千元男装只能作为普通消费判断，不能挤掉第一夜的金额缺口");
  assert(!menswearQuestion?.resistanceBeat, "男装页只承担普通消费判断，共同消费的反驳必须另起后续场景");
  assert(/(?:四万左右|差不多四万)/.test(gapQuestion?.question ?? "") && gapQuestion?.question?.includes("五千左右") && gapQuestion?.question?.includes("至少三万五"), "第一夜必须先把八万拆成共同消费、个人男装和未说明缺口");
  assert(gapQuestion?.answer?.includes("反正不是乱来的钱") && gapQuestion?.answer?.includes("今晚先转"), "金额缺口被问到后，男方必须回避用途并继续催款");
  assert((billCard?.detail ?? "").includes("约四万") && (billCard?.detail ?? "").includes("约五千") && (billCard?.detail ?? "").includes("至少三万五"), "证据卡必须与三桶金额一致");
  assert(JSON.stringify(billCheck).includes("两个人一起花掉的四万左右，数更大"), "材料检视必须把责任重心放回共同虚荣消费");
  assert((caseOne.truth ?? "").includes("不足以证明他个人挥霍") && (caseOne.truth ?? "").includes("一句带过"), "真相字段必须保留男方个人消费不高与女方避重就轻两个结论");
  assert(!/一万五.{0,12}男装|男装.{0,12}一万五|1\.5 万.{0,12}男装/.test(JSON.stringify(caseOne)), "案一不得残留约一万五男装旧口径");
});

test("PACK-017F", "case 1 hangup comments split after both sides are exposed", () => {
  const caseOne = caseFiles.find((packet) => packet.caseId === "01-credit");
  const hangupLine = caseOne?.overnightStructure?.hangupLine ?? "";
  assert(hangupLine.includes("别转") && hangupLine.includes("这八万就该转"), "案一第一夜暴露双方问题后，弹幕必须同时出现不转与该转的意见");
  assertEqual(caseOne?.nightStructure?.hangup?.stageDirection, hangupLine, "案一两套隔夜结构必须共享同一条分裂弹幕");
  assert(!(caseOne?.overnightStructure?.snapshotEcho?.["respondent-shifted-debt"] ?? "").includes("你们都让我别转"), "案一第二夜不得把分裂弹幕回忆成所有人一致劝阻");
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
  assert(caseTwoBenefits.includes("十二万") && caseTwoBenefits.includes("一百万") && caseTwoBenefits.includes("我先问的"), "案二必须把代投落到金额、门槛和谁先开口");
  assert(caseTwoBenefits.includes("走他户") || caseTwoBenefits.includes("走我户"), "案二必须把代投账户口径落到原话");
  assert(caseTwoBenefits.includes("是我转的"), "案二必须由来电人承认钱是自己转的");
  assert(!JSON.stringify(caseTwo?.evidenceChecks ?? []).includes("没敢数"), "案二不得把同一晚已经主动报过的人数写成此前不敢数");
  assert(caseTwo?.respondentNote?.text?.includes("十二万") && caseTwo?.respondentNote?.text?.includes("走我户") && caseTwo?.respondentNote?.text?.includes("我不上麦"), "Tony 留言必须回应代投、账户口径，并保持不上麦");
  const pushColumnScene = caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-next-push-column");
  assert(pushColumnScene?.entryQuestion?.includes("昨晚你已经看见") && pushColumnScene?.version?.includes("昨晚就看完了"), "案二必须固定第一夜已经看完名单，第二夜不得再演第一次发现");
  assert(pushColumnScene?.questionOptions?.some((option) => option.correct && option.question.includes("这张表如果发出去") && option.answer.includes("所以我才裁图")), "案二第二夜必须追公开名单会同时暴露来电人的哪些信息");
  assert(caseTwo?.truthBoundary?.unknown?.some((item) => item.includes("Tony") && item.includes("资格")), "案二必须把 Tony 是否有资格替顾客安排理财保留为未知");
  assert(caseTwo?.sceneVersions?.find((scene) => scene.id === "tony-exclusive-voice")?.version?.includes("长得好看"), "案二必须在固定相识陈述里建立咨询者主动看中 Tony 外表，不能只到结案突然批颜值");
  const otherCallerHook = caseTwo?.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(otherCallerHook?.materialRows?.some((row) => row.includes("把转账与回单交警方核原件")), "案二另一位顾客的材料必须有可执行的原件核对动作");
  assert(otherCallerHook?.options?.some((option) => option.label === "转账与回单放在一起核"), "案二后台私信选项必须落到原件核对");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m05" && row.amount === "¥120,000"), "案二行级材料必须保留十二万转账");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m03" && String(row.memo ?? "").includes("走Tony户")), "案二行级材料必须保留走他户备注");
  assert(caseTwoLedger?.rows?.some((row) => row.rowId === "m02" && row.amount === "¥1,000,000"), "案二行级材料必须保留周的一百万已买行");
  assert(caseTwo?.stageJudgement?.includes("十二万") && caseTwo?.stageJudgement?.includes("回单"), "案二结案必须把要回单和十二万拆开处理");
  assert(caseTwo?.stageJudgement?.includes("自己开口让他代投") && caseTwo?.stageJudgement?.includes("改口恋爱诈骗") && caseTwo?.stageJudgement?.includes("这个说法我不认"), "案二主播必须对主动代投后改口恋爱诈骗作出明确判断");

  const caseThree = caseFiles.find((packet) => packet.caseId === "03-profile");
  const caseThreeText = JSON.stringify(caseThree ?? {});
  const familyScene = caseThree?.sceneVersions?.find((scene) => scene.id === "profile-family-chat-origin");
  const fundsDocument = caseThree?.documents?.find((document) => document.id === "case3-credential-balance");
  const fundsRows = new Map((fundsDocument?.rows ?? []).map((row) => [row.rowId, row]));
  assert(caseThreeText.includes("领证前") && caseThreeText.includes("自己的卡里"), "案三必须写清彩礼支付时点和女方个人收款账户");
  assert(caseThreeText.includes("婚宴和首饰另算"), "案三必须把婚宴首饰从彩礼数字中拆出");
  assert(familyScene?.version?.includes("拿二十万给我留着"), "案三必须让父亲的二十万元保留给女儿个人的用途");
  assert(!(caseThree?.overnightStructure?.callbackOpeners?.["家里群原话"]?.firstConflict?.callerLine ?? "").includes("八万四"), "案三家里群回拨只能承认自己的钱没说，不能提前报出深入一问的八万四");
  const caseThreeDeepText = JSON.stringify(caseThree?.deepFollowup ?? {});
  assert(caseThreeDeepText.includes("八万四") && caseThreeDeepText.includes("六万") && caseThreeDeepText.includes("领证以后") && caseThreeDeepText.includes("添家电、搬家"), "案三必须通过短问短答问出咨询者自己的存款、上限和使用时点");
  assert(fundsRows.get("p04")?.memo?.includes("领证前转入女方个人账户"), "案三材料行必须写清彩礼进入谁的账户");
  assert(fundsRows.get("p07")?.memo?.includes("不包含在 28.8 万内"), "案三材料行必须单列婚宴与首饰");
  assert(caseThree?.stageJudgement?.includes("他不答应二十八万八") && caseThree?.stageJudgement?.includes("不是骗你"), "案三结案必须明确拒绝二十八万八的付款条件不等于欺骗");
  assert(caseThree?.stageJudgement?.includes("按差价收费") && caseThree?.stageJudgement?.includes("你赞成"), "案三结案必须点名查完普通家境后加价，并把条件归回咨询者本人");
  assert(!caseThree?.investigationHooks?.some((hook) => hook?.stillCannotProve?.includes("女方只图钱")), "案三未知边界不得再用‘不能证明只图钱’替已锁死的加价行为免责");
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
  assertEqual(sloganCount, 1, "「这不是 A，是 B」口号只保留案三「这不是谈结婚，是按差价收费」一处");
  caseFiles.forEach((casePacket) => {
    assert(!casePacket.stanceSnapshot?.prompt?.includes("站哪边"), `${casePacket.caseId} 立场快照必须问行为，不问站队`);
  });
  const byId = new Map(caseFiles.map((casePacket) => [casePacket.caseId, casePacket]));
  assert(byId.get("01-credit")?.stageJudgement?.includes("公开替你说") && byId.get("01-credit")?.stageJudgement?.includes("每月一万七千五") && byId.get("01-credit")?.stageJudgement?.includes("房租另付"), "案一必须用十四个月的固定转账与房租点名公开赦免用途");
  assert(byId.get("04-workplace")?.stageJudgement?.includes("是假话") && byId.get("04-workplace")?.stageJudgement?.includes("返费") && byId.get("04-workplace")?.stageJudgement?.includes("垫钱"), "案四必须直说流程假话并点到公司返费与个人垫钱");
  assert(byId.get("03-profile")?.stageJudgement?.includes("按差价收费") && byId.get("03-profile")?.stageJudgement?.includes("查完普通家境"), "案三必须点名查完普通家境后按差价收费");
  assert(byId.get("02-tony")?.stageJudgement?.includes("裁掉金额栏") && byId.get("02-tony")?.stageJudgement?.includes("自己人") && byId.get("02-tony")?.stageJudgement?.includes("不给原件"), "案二必须分别点名来电人裁图和 Tony 拿亲密称呼收钱后不给材料");
});

test("PACK-020", "all four long cases keep one causal layered-disguise chain", () => {
  const pilots = [
    {
      caseId: "01-credit",
      expectedStages: [
        "credit-moral-backing",
        "credit-separate-finances",
        "credit-selective-bill",
        "credit-gift-relabel",
        "credit-hidden-balance"
      ],
      protectedMarkers: ["一分钱也不出", "固定给付", "实际余额"],
      revisionMarkers: ["想让你替我说", "工资一到账，转我一半", "差不多四万，是跟我有关", "这一万二是花在我身上", "一万一千六百多"]
    },
    {
      caseId: "02-tony",
      expectedStages: [
        "tony-list-as-harem",
        "tony-dating-was-real",
        "tony-list-is-leads",
        "tony-proxy-invest",
        "tony-flip-on-rumor"
      ],
      protectedMarkers: ["要回这笔钱", "恋爱为名", "不够起投"],
      revisionMarkers: ["我要这个位置", "右边几列没发", "我先问的", "酒桌上听的", "所以我才裁图"]
    },
    {
      caseId: "03-profile",
      expectedStages: [
        "profile-mother-as-source",
        "profile-tuition-as-assets",
        "profile-salary-card-as-total",
        "profile-family-money-as-shared",
        "profile-own-money-later"
      ],
      protectedMarkers: ["没有诚意", "领证前", "八万四"],
      revisionMarkers: ["我没拦", "觉得他手里应该还有钱。就这个", "到昨晚，我手里就这一张", "这几句我都没说", "六万。剩下的我得留着"]
    },
    {
      caseId: "04-workplace",
      expectedStages: [
        "work-opportunity-left-out",
        "work-process-seen",
        "work-late-notice-cover",
        "work-approval-means-payment",
        "work-acknowledgement-without-record"
      ],
      protectedMarkers: ["六万八", "负责人署名", "绕过报备"],
      revisionMarkers: ["那时候我是真想让老板把这次活动交给我", "我点开了，也回了“收到”", "等一下，时间不对", "不是报销单", "那我是不是就不用再单独发了"]
    }
  ];

  for (const pilot of pilots) {
    const packet = caseFiles.find((candidate) => candidate.caseId === pilot.caseId);
    const chain = packet?.deceptionChain;
    assertEqual(chain?.owner, "caller", `${pilot.caseId} 多层伪装链当前必须由来电人承担`);
    assertNonEmptyString(chain?.protectedPurpose, `${pilot.caseId} 多层伪装链必须登记共同保护目的`);
    for (const marker of pilot.protectedMarkers) {
      assert(chain.protectedPurpose.includes(marker), `${pilot.caseId} 共同保护目的缺少 ${marker}`);
    }
    assertDeepEqual((chain?.stages ?? []).map((stage) => stage.id), pilot.expectedStages, `${pilot.caseId} 多层伪装链阶段顺序漂移`);
    assert(new Set(chain.stages.map((stage) => stage.id)).size === chain.stages.length, `${pilot.caseId} 多层伪装链阶段 id 不得重复`);
    const playableRefs = [
      ...(packet?.sceneVersions ?? []).map((scene) => scene.id),
      ...(packet?.documents ?? []).map((document) => document.id),
      ...(packet?.overnightStructure?.liveCounterBeats ?? []).map((beat) => beat.id),
      "deepFollowup"
    ];
    chain.stages.forEach((stage, stageIndex) => {
      ["pressureTrigger", "surfaceVersion", "editedFact", "immediateUtility", "fairTrace", "playerTest", "forcedRevision", "adviceImpact"].forEach((field) => {
        assertNonEmptyString(stage[field], `${pilot.caseId} deceptionChain.stages[${stageIndex}].${field} 不能为空`);
      });
      assert(stage.surfaceVersion !== stage.forcedRevision, `${pilot.caseId} deceptionChain.stages[${stageIndex}] 必须在受压后改变口径`);
      assert(stage.immediateUtility !== stage.adviceImpact, `${pilot.caseId} deceptionChain.stages[${stageIndex}] 必须区分角色即时获益与揭开后的建议变化`);
      assert(playableRefs.some((ref) => stage.playerTest.includes(ref)), `${pilot.caseId} deceptionChain.stages[${stageIndex}].playerTest 必须指向已有场景、材料或深问`);
    });
    const playableText = JSON.stringify(packet);
    for (const marker of pilot.revisionMarkers) {
      assert(playableText.includes(marker), `${pilot.caseId} 多层伪装链缺少可玩改口锚点：${marker}`);
    }
  }

  const caseTwo = caseFiles.find((packet) => packet.caseId === "02-tony");
  assert(caseTwo?.selfServingOmission?.includes("开场已经说出要回这笔钱"), "案二内部账本必须承认开场已经公开要钱诉求");
  assert(!(caseTwo?.truthBoundary?.edited ?? []).some((item) => item.includes("开场没有说") && item.includes("要回")), "案二不得把玩家已经听见的要钱诉求继续登记为隐瞒");

  const caseFour = caseFiles.find((packet) => packet.caseId === "04-workplace");
  const caseFourOpening = (caseFour?.openingDialogue ?? []).map((line) => line.text).join(" ");
  const groupMessageBeat = caseFour?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "work-group-repayment-message");
  assert(caseFourOpening.includes("工作群输入框") && caseFourOpening.includes("还没发"), "案四必须在开场种下未发送的追款消息");
  assert(JSON.stringify(groupMessageBeat ?? {}).includes("那我是不是就不用再单独发了"), "案四第二夜必须让含糊群消息诱发第五层退让");
  assert(groupMessageBeat?.from === "平台强制贴片" && (groupMessageBeat?.choices ?? []).length === 2, "案四必须用强制贴片打破前三案的固定节拍，并留给玩家两种处理");
  assert(groupMessageBeat?.choices?.some((choice) => choice.endingImpact === "platform-data-loss"), "案四先念完群消息必须付出退出推荐的真实代价");
  assert(groupMessageBeat?.choices?.some((choice) => JSON.stringify(choice.lines ?? []).includes("撤回") && JSON.stringify(choice.lines ?? []).includes("截到")), "案四先静音路线必须失去公开原话但留下可归因截图");
  const caseFourDeepText = JSON.stringify(caseFour?.deepFollowup ?? {});
  assert(caseFourDeepText.includes("个人卡刷的") && caseFourDeepText.includes("发票原件") && caseFourDeepText.includes("正式报销单号") && caseFourDeepText.includes("预计付款日期"), "案四结案必须在主播逐项收窄后，用实际发送文案回收开场草稿");
  assertBeatLines(caseFour?.deepFollowup?.resistanceBeat?.lines, "案四最终改写页必须保留主播和咨询者共同改写的过程");
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
