import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { extractFlow, generateBrief, validateFlow } from "../verify-narrative-flow.js";
import { assertDialogueTexture } from "../../src/runtime/dialogueTexture.js";

const sample = () => extractFlow(generateBrief("2026-06-24"), "2026-06-24");
const errors = flow => validateFlow(flow).filter(issue => issue.severity === "error");

test("daily structure has no scene or question-count authoring quota", () => {
  for (const sceneCount of [1, 9]) {
    for (const questionCount of [1, 5]) {
      const flow = sample();
      flow.scenes = Array.from({ length: sceneCount }, (_, index) => ({
        ...structuredClone(flow.scenes[0]), id: `scene-${index}`,
        options: Array.from({ length: questionCount }, (_, optionIndex) => ({
          ...structuredClone(flow.scenes[0].options[0]), id: `question-${optionIndex}`, question: "几时开始的？"
        }))
      }));
      assert.equal(errors(flow).some(issue => ["SCENE_COUNT", "CHOICE_COUNT", "QUESTION_TEXT"].includes(issue.code)), false);
    }
  }
});

test("removing prose quotas keeps missing content and source checks blocking", () => {
  const flow = sample();
  flow.scenes[0].options[0].question = " ";
  flow.scenes[0].options[0].answer = "";
  flow.deepFollowup = { question: "这笔钱后来呢？", answer: "还没回来。", sourceSceneId: flow.scenes[0].id, sourceAnchor: "一条从未播放的原话" };
  const codes = errors(flow).map(issue => issue.code);
  assert.ok(codes.includes("QUESTION_TEXT"));
  assert.ok(codes.includes("CHOICE_FEEDBACK"));
  assert.ok(codes.includes("DEEP_FOLLOWUP_CONTINUITY"));
  flow.scenes = [];
  assert.ok(errors(flow).some(issue => issue.code === "SCENE_COUNT"));
});

test("keyword matches remain review candidates, not automatic semantic verdicts", () => {
  const flow = sample();
  flow.scenes[0].options[0].question = "先相信他这一句，后面发生了什么？";
  const candidate = validateFlow(flow).find(issue => issue.code === "NO_CLICK_CHOICE");
  assert.equal(candidate?.severity, "review");
  assert.equal(errors(flow).some(issue => issue.code === "NO_CLICK_CHOICE"), false);
});

test("dialogue texture counts ordinary exchanges without imposing filler or noise quotas", () => {
  const packet = {
    caseId: "texture-without-quota", texturePass: true, voiceTics: [],
    voiceTicArc: { scene: "随当前交流变化" },
    openingDialogue: ["窗户开着。", "风挺大的。", "我关一下。", "现在听得清。"].map(text => ({ role: "caller", text, nonLoadBearing: true }))
  };
  const result = assertDialogueTexture(packet);
  assert.equal(result.valid, true);
  assert.equal(result.metrics.nonLoadBearingCount, 4);
  assert.equal(result.metrics.interruptionCount, 0);
  assert.equal(result.metrics.longRambleCount, 0);
});


test("candidate generator accepts one source without a hook and honors explicit output paths", () => {
  const dir = mkdtempSync(join(tmpdir(), "love-authoring-"));
  try {
    const input = join(dir, "source.json");
    writeFileSync(input, JSON.stringify({ cards: [{ id: "one-source", conflictTypes: ["债务"] }] }));
    const script = fileURLToPath(new URL("../generate-daily-case-drafts.js", import.meta.url));
    for (const equalsSyntax of [false, true]) {
      const output = join(dir, `draft-${equalsSyntax}.json`);
      const args = equalsSyntax ? [`--input=${input}`, `--out=${output}`] : ["--input", input, "--out", output];
      execFileSync(process.execPath, [script, ...args], { stdio: "pipe" });
      const payload = JSON.parse(readFileSync(output, "utf8"));
      assert.equal(payload.draftCount, 1);
      assert.deepEqual(payload.drafts[0].basedOnCardIds, ["one-source"]);
      assert.equal(payload.drafts[0].status, "needs-human-review");
      assert.ok(payload.drafts[0].storyPackHook.trim());
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});


test("focused inquiry needs no late reveal, extra material board or backflow quota", () => {
  const flow = sample();
  flow.compactClosing = false;
  flow.deepFollowup = {};
  flow.evidenceChecks = [];
  flow.investigationHooks = [];
  const removedQuotas = ["DEEP_FOLLOWUP", "DEEP_FOLLOWUP_CONTINUITY", "EVIDENCE_CHECK", "INVESTIGATION_BACKFLOW"];
  assert.equal(errors(flow).some(issue => removedQuotas.includes(issue.code)), false);
  flow.deepFollowup = { question: "钱用在哪儿了？" };
  assert.ok(errors(flow).some(issue => issue.code === "DEEP_FOLLOWUP"));
  flow.investigationHooks = [{ id: "missing-source", options: [] }];
  assert.ok(errors(flow).some(issue => issue.code === "INVESTIGATION_TRIGGER"));
  assert.ok(errors(flow).some(issue => issue.code === "INVESTIGATION_BOUNDARY"));
});
