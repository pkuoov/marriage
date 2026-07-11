import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { RUNTIME_CASE_CONTENT_STATUS, RUNTIME_CASE_REQUIRED_FIELDS } from "../src/runtime/contentCase.js?v=0.20.68";
import { STORY_PACKS } from "../src/storyPacks.js?v=0.20.68";

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

function assertOneCorrect(options, message) {
  assertEqual((options ?? []).filter((option) => option.correct === true).length, 1, message);
}

function assertAtLeastOneCorrect(options, message) {
  assert((options ?? []).some((option) => option.correct === true), message);
}

function assertEvidenceOperation(operation, label) {
  assertNonEmptyString(operation.id, `${label} 缺少 id`);
  assertNonEmptyString(operation.title, `${label} 缺少 title`);
  assertNonEmptyString(operation.prompt, `${label} 缺少 prompt`);
  assertNonEmptyString(operation.material, `${label} 缺少 material`);
  if (operation.pityLine !== undefined) {
    assertNonEmptyString(operation.pityLine, `${label} pityLine 若存在必须是非空字符串`);
    assert(!/[圈]|那一栏|哪一块/.test(operation.pityLine), `${label} pityLine 不能替玩家点位置`);
  }
  if (operation.materialRows !== undefined) {
    assertArrayMin(operation.materialRows, 2, `${label} materialRows 至少需要两行`);
    operation.materialRows.forEach((row, rowIndex) => {
      assertNonEmptyString(row, `${label}.materialRows[${rowIndex}] 不能为空`);
    });
  }
  assertArrayMin(operation.options, 3, `${label} 至少需要三个材料圈点选项`);
  assertOneCorrect(operation.options, `${label} 必须且只能有一个正确圈点`);
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
    packet.sceneVersions?.map((scene) => scene.version),
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
  (packet.accusationChoices ?? []).map((choice) => normalizeQuoteText(choice.label)).forEach((quote, index) => {
    assert(surfaceText.includes(quote), `${label} 第 ${index + 1} 条最终引语没有无门控出处: ${packet.accusationChoices?.[index]?.label}`);
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
  assertArrayMin(interlude.actions, 4, `${label} nightStructure.interlude.actions 至少需要四个行动位`);
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
    interlude.actions.some((action) => ["advisorCall", "advisorConflict", "interruptToast"].includes(action.kind)),
    `${label} nightStructure.interlude.actions 至少需要一个 NPC 行动位`
  );
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
  const anchorIndex = (packet.sceneVersions ?? []).findIndex((scene) => String(scene?.version ?? "").includes(structure.hangupAnchor));
  assert(anchorIndex >= 0, `${label} overnightStructure.hangupAnchor 未命中任何 sceneVersions`);
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
  assertNonEmptyString(structure.dayIntro, `${label} overnightStructure.dayIntro 不能为空`);
  assert(Number.isInteger(structure.dayBudget) && structure.dayBudget > 0, `${label} overnightStructure.dayBudget 必须是正整数`);
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
    assert(["lab", "visit", "home", "studio", "document"].includes(scene.kind), `${label} overnightStructure.dayScenes[${sceneIndex}].kind 不合法`);
    if (scene.kind === "document") {
      assertNonEmptyString(scene.body?.documentId, `${label} overnightStructure.dayScenes[${sceneIndex}].body.documentId 不能为空`);
      assert((packet.documents ?? []).some((document) => document.id === scene.body.documentId), `${label} overnightStructure.dayScenes[${sceneIndex}].body.documentId 指向不存在的 documents`);
    } else {
      assertNonEmptyString(scene.body?.text, `${label} overnightStructure.dayScenes[${sceneIndex}].body.text 不能为空`);
      assertNonEmptyString(scene.body?.earnedItemId, `${label} overnightStructure.dayScenes[${sceneIndex}].body.earnedItemId 不能为空`);
      earnedIds.add(scene.body.earnedItemId);
    }
    if (scene.body?.timelineSort !== undefined) {
      const timeline = scene.body.timelineSort;
      assertArrayMin(timeline.cards, 2, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.cards 至少两张`);
      assertDeepEqual(timeline.correctOrder, timeline.cards, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.correctOrder 必须与 cards 同序`);
      assertNonEmptyString(timeline.payoffLine, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.payoffLine 不能为空`);
      assertNonEmptyString(timeline.missLine, `${label} overnightStructure.dayScenes[${sceneIndex}].timelineSort.missLine 不能为空`);
    }
  });
  const openerIds = new Set(Object.keys(structure.callbackOpeners ?? {}));
  earnedIds.forEach((earnedId) => {
    assert(openerIds.has(earnedId), `${label} overnightStructure.callbackOpeners 缺少 earnedItem opener: ${earnedId}`);
    assertNonEmptyString(structure.callbackOpeners?.[earnedId]?.line, `${label} overnightStructure.callbackOpeners.${earnedId}.line 不能为空`);
  });
  assertNonEmptyString(structure.callbackFallback?.line, `${label} overnightStructure.callbackFallback.line 不能为空`);
  assertNonEmptyString(structure.postures?.againstCaller, `${label} overnightStructure.postures.againstCaller 不能为空`);
  assertNonEmptyString(structure.postures?.withCaller, `${label} overnightStructure.postures.withCaller 不能为空`);
  if (structure.callerQuestion !== undefined) {
    assertNonEmptyString(structure.callerQuestion.prompt, `${label} overnightStructure.callerQuestion.prompt 不能为空`);
    assertArrayMin(structure.callerQuestion.options, 3, `${label} overnightStructure.callerQuestion.options 至少三项`);
    structure.callerQuestion.options.forEach((option, optionIndex) => {
      assertNonEmptyString(option.id, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 id`);
      assertNonEmptyString(option.label, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 label`);
      assertNonEmptyString(option.callerLine, `${label} overnightStructure.callerQuestion.options[${optionIndex}] 缺少 callerLine`);
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
    const rowIds = new Set();
    let previousDateValue = -1;
    document.rows.forEach((row, rowIndex) => {
      assertNonEmptyString(row.rowId, `${label} documents[${documentIndex}].rows[${rowIndex}] 缺少 rowId`);
      assert(!rowIds.has(row.rowId), `${label} documents[${documentIndex}] rowId 重复: ${row.rowId}`);
      rowIds.add(row.rowId);
      assert(/^\d{2}-\d{2}$/.test(row.date ?? ""), `${label} documents[${documentIndex}].rows[${rowIndex}].date 必须是 MM-DD`);
      const dateValue = Number(String(row.date).replace("-", ""));
      assert(dateValue >= previousDateValue, `${label} documents[${documentIndex}].rows 日期必须升序`);
      previousDateValue = dateValue;
      assert(["入账", "支出", "提醒", "空行"].includes(row.kind), `${label} documents[${documentIndex}].rows[${rowIndex}].kind 不合法`);
      ["amount", "party", "memo"].forEach((field) => assertNonEmptyString(row[field], `${label} documents[${documentIndex}].rows[${rowIndex}].${field} 不能为空`));
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
  if (text.includes("社保断缴早于第一次借钱")) {
    assert(text.includes("47 天"), `${label} 47 天阶梯不得丢失`);
  }
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

const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const runtimePack = STORY_PACKS[packId];
const caseFiles = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
const comments = await readJson(`content/packs/${packId}/comments.json`);
const routeArchetypes = await readJson(`content/packs/${packId}/route-archetypes.json`);
const advisorRegistry = await readJson("content/characters/advisors.json").catch(() => ({ advisors: [] }));
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
});

test("PACK-002", "manifest keeps distinct playable cases", () => {
  assertEqual(manifest.sequence.length, manifest.size, "sequence 数量必须等于 size");
  assertEqual((manifest.caseLabels ?? []).length, manifest.size, "caseLabels 数量必须等于 size");
  assertEqual(new Set(manifest.sequence.map((item) => item.caseId)).size, manifest.size, "caseId 不能重复");
  assertEqual(new Set(manifest.sequence.map((item) => item.plotId)).size, manifest.size, "plotId 不能重复");
  manifest.sequence.forEach((item, index) => {
    ["caseId", "plotId", "sceneId", "complainantId", "respondentId", "act", "objectLabel", "backdropClass", "callerArt", "bridge"].forEach((field) => {
      assert(item[field], `第 ${index + 1} 案缺少 ${field}`);
    });
    assertDifficultyProfile(item.difficultyProfile, `第 ${index + 1} 案`);
    if (index > 0) {
      assert(item.difficultyProfile.tier >= manifest.sequence[index - 1].difficultyProfile.tier, `第 ${index + 1} 案 difficultyProfile.tier 不能倒退`);
    }
    assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png(\?v=[\w.-]+)?$/.test(item.callerArt), `第 ${index + 1} 案 callerArt 必须指向匿名来电人 PNG`);
    assert(!/下一案|第[一二三四五六七八九十\d]+\s*案|\d+\s*\/\s*\d+/.test(item.objectLabel), `第 ${index + 1} 案 objectLabel 不能是目录话术`);
  });
});

test("PACK-003", "case pressure packets are complete", () => {
  const requiredFields = [
    "caseId",
    "plotId",
    "dramaticAnchor",
    "whyTonight",
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
});

test("PACK-004", "comments and route archetypes are present", () => {
  assertEqual(comments.themeId, manifest.theme.id, "comments themeId 必须和 manifest theme 对齐");
  assert((comments.commentSeeds ?? []).length >= Math.min(4, manifest.size), "评论种子数量要覆盖当前故事包规模");
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
      casePacket.openingDialogue.forEach((line, lineIndex) => {
        assertNonEmptyString(line.role, `${casePacket.caseId} openingDialogue[${lineIndex}] 缺少 role`);
        assertNonEmptyString(line.text, `${casePacket.caseId} openingDialogue[${lineIndex}] 缺少 text`);
      });

      assertArrayMin(casePacket.sceneVersions, 3, `${casePacket.caseId} sceneVersions 至少要有三段可追问内容`);
      assertArrayMin(casePacket.sceneVersions, 5, `${casePacket.caseId} 试玩包案件至少需要五段来电，不能退回短问答`);
      assert(
        casePacket.sceneVersions.some((scene) => (scene.questionOptions ?? []).some((option) => option.guardedAnswer)),
        `${casePacket.caseId} 至少需要一条 guardedAnswer，让现场防备有写好的回答后果`
      );
      const evidenceCardIds = new Set((casePacket.evidenceCards ?? []).map((card) => card.id).filter(Boolean));
      const evidenceCheckIds = new Set((casePacket.evidenceChecks ?? []).map((check) => check.id).filter(Boolean));
      casePacket.sceneVersions.forEach((scene, sceneIndex) => {
        assertNonEmptyString(scene.speakerId, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 speakerId`);
        assertNonEmptyString(scene.version, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 version`);
        assertNonEmptyString(scene.doubt, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 doubt`);
        assertNonEmptyString(scene.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 contradiction`);
        assert(["mixed", "partial", "guarded", "clear"].includes(scene.reliability), `${casePacket.caseId} sceneVersions[${sceneIndex}] reliability 不合法`);
        assertNonEmptyString(scene.pressureHint?.intentHook, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 pressureHint.intentHook`);
        assert(["guarded", "tense", "listening"].includes(scene.pressureHint?.callerGuard), `${casePacket.caseId} sceneVersions[${sceneIndex}] pressureHint.callerGuard 不合法`);
        assert(["blink", "pause", "shift"].includes(scene.pressureHint?.expression?.kind), `${casePacket.caseId} sceneVersions[${sceneIndex}] pressureHint.expression.kind 不合法`);
        assertNonEmptyString(scene.pressureHint?.expression?.text, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 pressureHint.expression.text`);
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
            if (option.guardedAnswer) {
              assertNonEmptyString(option.guardedAnswer, `${casePacket.caseId} sceneVersions[${sceneIndex}].casualQuestions[${optionIndex}] guardedAnswer 不能为空`);
            }
          });
        }
        assertArrayMin(scene.questionOptions, 2, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要两个追问选项`);
        assertAtLeastOneCorrect(scene.questionOptions, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要一个核心追问`);
        scene.questionOptions.forEach((option, optionIndex) => {
          assertNonEmptyString(option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 question`);
          assertNonEmptyString(option.answer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 answer`);
          if (option.guardedAnswer) {
            assertNonEmptyString(option.guardedAnswer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] guardedAnswer 不能为空`);
            assert(
              longestCommonSubstringLength(option.guardedAnswer, casePacket.deepFollowup?.answer) < 14,
              `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] guardedAnswer 不能提前复用 deepFollowup 的自白金句`
            );
          }
          assertNonEmptyString(option.routeAxis, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeAxis`);
          assertNonEmptyString(option.routeTone, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeTone`);
          if (option.correct) assertNonEmptyString(option.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 核心追问缺少 contradiction`);
        });
      });

      assertArrayMin(casePacket.evidenceChecks, 1, `${casePacket.caseId} 至少需要一个材料检视`);
      if (casePacket.caseId === "04-workplace") {
        assertArrayMin(casePacket.evidenceChecks, 2, "04-workplace 必须有两份材料检视，体现职场流程压力");
      }
      casePacket.evidenceChecks.forEach((check, checkIndex) => {
        assertEvidenceOperation(check, `${casePacket.caseId} evidenceChecks[${checkIndex}]`);
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

      assertNonEmptyString(casePacket.deepFollowup?.question, `${casePacket.caseId} deepFollowup.question 不能为空`);
      assertNonEmptyString(casePacket.deepFollowup?.answer, `${casePacket.caseId} deepFollowup.answer 不能为空`);
      assertNonEmptyString(casePacket.deepFollowup?.note, `${casePacket.caseId} deepFollowup.note 不能为空`);
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
      });
    });
});

test("PACK-006", "theatrical license lurker budget stays singular", () => {
  const lurkerCases = caseFiles.filter((casePacket) => casePacket.lurkerNote !== undefined);
  assert(lurkerCases.length <= 1, `每包至多一个案子使用 lurkerNote，当前 ${lurkerCases.length} 个`);
});

test("PACK-007", "NPC verbs cover refuse interrupt and conflict", () => {
  const verbs = new Set(caseFiles.flatMap((casePacket) =>
    (casePacket.nightStructure?.interlude?.actions ?? []).map((action) => action.npcVerb).filter(Boolean)
  ));
  if (verbs.size === 0) return;
  ["refuse", "interrupt", "conflict"].forEach((verb) => {
    assert(verbs.has(verb), `故事包缺少 NPC ${verb} 动词`);
  });
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
