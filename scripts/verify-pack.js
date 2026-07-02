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
