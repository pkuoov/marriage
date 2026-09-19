import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { completedChoicePrefix, nextSequentialChoice, completedSequenceAnswer } from "../../src/runtime/sequentialChoices.js";
import { refreshSavedExchangeCopy } from "../../src/runtime/savedContentRefresh.js";
import { currentLiveCounterPick } from "../../src/runtime/liveCounterModel.js";
import { liveCounterBeatHtml } from "../../src/ui/liveCounterBeatView.js";
import { statementReplayPageChoicesHtml } from "../../src/ui/statementReviewView.js";
import { validateContentRevision } from "../lib/content-contracts.js";

const read = path => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const packets = await Promise.all(["01-credit", "04-workplace", "03-profile", "02-tony"].map(async id => JSON.parse(await read(`content/packs/steam-demo-01/cases/${id}.json`))));
const legacyFixture = JSON.parse(await readFile(new URL("./fixtures/legacy-credit-interactions.json", import.meta.url), "utf8"));

test("顺序进度只认连续的稳定 ID；缺步、插入和删除不能误判完成", () => {
  const choices = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(completedChoicePrefix(choices, ["a", "c"]), ["a"]);
  assert.equal(nextSequentialChoice(choices, ["a", "c"]).id, "b");
  assert.equal(nextSequentialChoice(choices, ["a", "b", "c"]), null);
  assert.equal(nextSequentialChoice([{ id: "new" }, ...choices], ["a", "b", "c"]).id, "new");
});

test("四案实际夜间追问全部按序，短答与多人对白不能分叉", () => {
  for (const packet of packets) {
    validateContentRevision(packet);
    for (const index of [...packet.nightStructure.segment1SceneIndexes, ...packet.nightStructure.segment2SceneIndexes]) {
      const scene = packet.sceneVersions[index];
      if (scene.interactionMode === "testimonyWall") continue;
      assert.deepEqual(scene.questionSequence, scene.questionOptions.map(option => option.id));
    }
  }
  const broken = structuredClone(packets[0]);
  broken.sceneVersions[0].questionOptions[0].answer += "旧稿";
  assert.throws(() => validateContentRevision(broken), /fallback answer differs/);
  broken.sceneVersions[0].questionSequence.push("不存在的选项");
  assert.throws(() => validateContentRevision(broken), /questionSequence/);
});

test("回答中途读档不会提前完成；已播两问的上一问记录保留完整交锋", () => {
  const scene = structuredClone(packets[0].sceneVersions[0]);
  const brief = { id: "case", sceneVersions: [scene] };
  const first = scene.questionOptions[0];
  const state = { scene: "sceneQuestionAnswer", chapter: 1, caseBrief: brief, caseActionLog: { case: { "version:0": true } }, sceneQuestionFocus: { caseId: "case", sceneIndex: 0, kind: "key", optionIndex: 0 }, sceneQuestionPicks: { "case:scene:0": { ...first, optionId: first.id, completedOptionIds: [first.id] } } };
  const refreshed = refreshSavedExchangeCopy(state, [brief], [brief]);
  assert.equal(refreshed.caseActionLog.case["version:0"], undefined);
  assert.deepEqual(refreshed.sceneQuestionPicks["case:scene:0"].completedOptionIds, [first.id]);
  const full = completedSequenceAnswer(scene, { ...scene.questionOptions[1], completedOptionIds: scene.questionSequence });
  assert.equal(full.question, first.question);
  assert.ok(full.lines.some(line => line.text === scene.questionOptions[1].question));
  assert.ok(full.lines.some(line => line.text.includes("承诺")));
});

test("顺序追问中返回回放仍显示下一问，不给已问过的按钮造成死路", () => {
  const scene = packets[0].sceneVersions[0];
  const html = statementReplayPageChoicesHtml({ scene, sceneIndex: 0, line: { id: "residence", text: "不住在一起，他住他的，我住我的。" }, completedOptionIds: [scene.questionSequence[0]] });
  assert.match(html, /data-scene-question="0:1"/);
  assert.doesNotMatch(html, /data-scene-question="0:0"/);
  assert.doesNotMatch(html, /关键选择/);
  assert.match(html, /询问这句/);
  assert.match(html, /不询问/);
});

test("旧互斥接麦存档不跳过新的完整退礼物与公开范围交流", () => {
  const beat = packets[2].overnightStructure.liveCounterBeats.find(beat => beat.id === "profile-gift-mic-request");
  const oldPick = { choiceId: "ask-caller-before-mic", completedChoiceIds: ["refund-then-scope"] };
  assert.equal(currentLiveCounterPick(beat, oldPick), null);
  const html = liveCounterBeatHtml(beat, currentLiveCounterPick(beat, oldPick));
  assert.doesNotMatch(html, /data-live-counter-choice=/);
  assert.ok(html.includes(beat.lines[0].text));
  assert.ok(html.includes("退款处理中"));
  assert.ok(html.includes("其他账户不公开"));
  assert.ok(html.includes("接进来"));
});

test("现场不泄露精确余额；试问不区分命中提示；连续台本收齐顺序收麦", async () => {
  const credit = packets[0];
  const end = credit.sceneVersions.find(scene => scene.id === "credit-loyalty-test").afterVersion.lines;
  assert.ok(end.every(line => !line.text.includes("一万一千六百")));
  const script = await read("docs/generated/steam-demo-01-continuous-story-script.md");
  for (const packet of packets) {
    for (const choice of packet.careChoices) assert.ok(script.includes(choice.hostLine));
    for (const scene of packet.sceneVersions.filter(scene => scene.testimonyWall)) {
      for (const act of scene.testimonyWall.acts) {
        assert.ok(act.statements.every(statement => statement.presentResponse === act.softAnchorResponse));
      }
    }
  }
});

import { callerQuestionProgress, advanceCallerQuestion } from "../../src/runtime/callerQuestionSequence.js";
import { reconcileSavedOvernightProgress } from "../../src/runtime/savedContentRefresh.js";

test("反问逐步回应：越步、双击、旧互斥结果不能跳过交流", () => {
  const question = legacyFixture.callerQuestion;
  const ids = question.options.map(option => option.id);
  assert.equal(question.choiceMode, "sequence");
  const legacy = { callerQuestionChoiceId: ids[2] };
  assert.equal(callerQuestionProgress(question, legacy).next.id, ids[0]);
  assert.equal(callerQuestionProgress(question, legacy).picked, null);
  assert.equal(advanceCallerQuestion(question, legacy, ids[1]), legacy);
  let saved = legacy;
  for (const [i, id] of ids.entries()) {
    saved = advanceCallerQuestion(question, saved, id);
    assert.deepEqual(saved.callerQuestionCompletedIds, ids.slice(0, i + 1));
    assert.equal(advanceCallerQuestion(question, saved, id), saved);
    assert.equal(callerQuestionProgress(question, JSON.parse(JSON.stringify(saved))).picked.id, id);
    assert.equal(callerQuestionProgress(question, saved).complete, i === ids.length - 1);
    saved = { ...saved, callerQuestionChoiceId: null };
  }
  const reordered = { ...question, options: [question.options[1], question.options[0], question.options[2]] };
  assert.deepEqual(callerQuestionProgress(reordered, { callerQuestionCompletedIds: [ids[0]] }).completedIds, []);
});

test("读档修复反问完成标记，不删除已听前缀或其他历史动作", () => {
  const brief = { ...packets[0], id: "case", overnightStructure: { ...packets[0].overnightStructure, callerQuestion: legacyFixture.callerQuestion } };
  const id = brief.overnightStructure.callerQuestion.options[0].id;
  const state = { scene: "callerQuestion", caseActionLog: { case: { "overnight:callerQuestion": true, other: true } }, caseOvernights: { case: { callerQuestionChoiceId: id } } };
  const fresh = reconcileSavedOvernightProgress(state, [brief]);
  assert.equal(fresh.caseActionLog.case["overnight:callerQuestion"], undefined);
  assert.equal(fresh.caseActionLog.case.other, true);
  assert.equal(fresh.caseOvernights.case.callerQuestionChoiceId, null);
  state.caseOvernights.case.callerQuestionCompletedIds = [id];
  const middle = reconcileSavedOvernightProgress(state, [brief]);
  assert.deepEqual(middle.caseOvernights.case.callerQuestionCompletedIds, [id]);
  assert.equal(middle.caseOvernights.case.callerQuestionChoiceId, id);
});
