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

function assertEvidenceOperation(operation, label) {
  assertNonEmptyString(operation.id, `${label} 缺少 id`);
  assertNonEmptyString(operation.title, `${label} 缺少 title`);
  assertNonEmptyString(operation.prompt, `${label} 缺少 prompt`);
  assertNonEmptyString(operation.material, `${label} 缺少 material`);
  assertArrayMin(operation.options, 3, `${label} 至少需要三个材料圈点选项`);
  assertOneCorrect(operation.options, `${label} 必须且只能有一个正确圈点`);
  operation.options.forEach((option, optionIndex) => {
    assertNonEmptyString(option.label, `${label}.options[${optionIndex}] 缺少 label`);
    assertNonEmptyString(option.feedback, `${label}.options[${optionIndex}] 缺少 feedback`);
    assertNonEmptyString(option.routeAxis, `${label}.options[${optionIndex}] 缺少 routeAxis`);
    if (option.correct) assertNonEmptyString(option.contradiction, `${label}.options[${optionIndex}] 正确圈点缺少 contradiction`);
  });
}

function collectTextLength(value) {
  if (typeof value === "string") return value.trim().length;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + collectTextLength(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + collectTextLength(item), 0);
  return 0;
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
    ["caseId", "plotId", "sceneId", "complainantId", "respondentId", "act", "objectLabel", "backdropClass", "bridge"].forEach((field) => {
      assert(item[field], `第 ${index + 1} 案缺少 ${field}`);
    });
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
    }
    ["true", "edited", "unknown"].forEach((field) => {
      assert((casePacket.truthBoundary?.[field] ?? []).length > 0, `${casePacket.caseId} truthBoundary.${field} 不能为空`);
    });
    assert((casePacket.quotePickCandidates ?? []).length >= 3, `${casePacket.caseId} 至少需要三句原话候选`);
    assert((casePacket.accusationChoices ?? []).length >= 3, `${casePacket.caseId} 至少需要三句最终收麦原话`);
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
      casePacket.sceneVersions.forEach((scene, sceneIndex) => {
        assertNonEmptyString(scene.speakerId, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 speakerId`);
        assertNonEmptyString(scene.version, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 version`);
        assertNonEmptyString(scene.doubt, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 doubt`);
        assertNonEmptyString(scene.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}] 缺少 contradiction`);
        assert(["mixed", "partial", "guarded", "clear"].includes(scene.reliability), `${casePacket.caseId} sceneVersions[${sceneIndex}] reliability 不合法`);
        assertArrayMin(scene.questionOptions, 2, `${casePacket.caseId} sceneVersions[${sceneIndex}] 至少需要两个追问选项`);
        assertOneCorrect(scene.questionOptions, `${casePacket.caseId} sceneVersions[${sceneIndex}] 必须且只能有一个核心追问`);
        scene.questionOptions.forEach((option, optionIndex) => {
          assertNonEmptyString(option.question, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 question`);
          assertNonEmptyString(option.answer, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 answer`);
          assertNonEmptyString(option.routeAxis, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeAxis`);
          assertNonEmptyString(option.routeTone, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 缺少 routeTone`);
          if (option.correct) assertNonEmptyString(option.contradiction, `${casePacket.caseId} sceneVersions[${sceneIndex}].questionOptions[${optionIndex}] 核心追问缺少 contradiction`);
        });
      });

      assertArrayMin(casePacket.evidenceChecks, 1, `${casePacket.caseId} 至少需要一个材料检视`);
      casePacket.evidenceChecks.forEach((check, checkIndex) => {
        assertEvidenceOperation(check, `${casePacket.caseId} evidenceChecks[${checkIndex}]`);
      });

      assertArrayMin(casePacket.investigationHooks, 1, `${casePacket.caseId} 至少需要一个后台回流`);
      casePacket.investigationHooks.forEach((hook, hookIndex) => {
        assertNonEmptyString(hook.source, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 source`);
        assertNonEmptyString(hook.triggerContradiction, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 triggerContradiction`);
        assertNonEmptyString(hook.proves, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 proves`);
        assertNonEmptyString(hook.stillCannotProve, `${casePacket.caseId} investigationHooks[${hookIndex}] 缺少 stillCannotProve`);
        assertEvidenceOperation(hook, `${casePacket.caseId} investigationHooks[${hookIndex}]`);
      });

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
