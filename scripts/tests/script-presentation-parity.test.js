import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { answerDialogueLines } from "../../src/runtime/dialogueContent.js";
import { sceneQuestionAnswerHtml } from "../../src/ui/sceneReviewView.js";
import { sceneReadingGroups, documentReadingQuestions } from "../lib/scene-reading.js";
import { liveCounterBeatTriggerMet } from "../../src/runtime/liveCounterModel.js";
import { latestChoiceReviewRowsForState } from "../../src/runtime/caseStateSelectors.js";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(await read("content/packs/steam-demo-01/manifest.json"));
const packets = await Promise.all(manifest.sequence.map(async ({ caseId }) => JSON.parse(await read(`content/packs/steam-demo-01/cases/${caseId}.json`))));
const continuous = await read("docs/generated/steam-demo-01-continuous-story-script.md");
const director = await read("docs/generated/steam-demo-01-director-script.md");
const pure = await read("docs/generated/steam-demo-01-pure-story-script.md");

test("阅读稿保留分散通话日期，私下咨询与数日后公开回访分场", () => {
  const workplace = packets.find(packet => packet.caseId === "04-workplace");
  const recap = manifest.nightShell.interludes.find(entry => entry.afterCaseId === workplace.caseId).broadcastRecap;
  for (const script of [continuous, director, pure]) {
    for (const packet of packets) {
      for (const date of packet.nightStructure.sessionDates) assert.ok(script.includes(`【通话日期：${date}】`));
    }
    const privateHeading = script.indexOf("｜单独咨询");
    const privateStart = script.indexOf(workplace.overnightStructure.linearCallback.lines[0].text, privateHeading);
    const publicHeading = script.indexOf(`### ${recap.kicker}`);
    assert.ok(privateHeading >= 0 && privateStart > privateHeading && publicHeading > privateStart);
    for (const line of recap.lines) assert.ok(script.indexOf(line.text, publicHeading) > publicHeading);
  }
});

test("四案连续台本先完整陈述，再进入同阶段追问", () => {
  for (const packet of packets) {
    const [group] = sceneReadingGroups(packet, packet.nightStructure.segment1SceneIndexes);
    assert.ok(group.indexes.length >= (packet.dialoguePresentation?.focusedInquiry ? 1 : 2));
    const scenes = group.indexes.map((index) => packet.sceneVersions[index]);
    const positions = scenes.map((scene) => continuous.indexOf(scene.version));
    assert.ok(positions.every((position) => position >= 0));
    assert.ok(positions.every((position, index) => !index || position > positions[index - 1]));
    const question = scenes[0].questionOptions.find((option) => option.correct);
    assert.ok(continuous.indexOf(`**林旭阳：** ${question.question}`, positions[0]) > positions.at(-1), packet.caseId);
  }
});

test("导演台本收录实际多人物回答，不能只写备用短答", () => {
  let checked = 0;
  for (const packet of packets) {
    for (const index of [...packet.nightStructure.segment1SceneIndexes, ...packet.nightStructure.segment2SceneIndexes]) {
      const scene = packet.sceneVersions[index];
      if (scene.interactionMode === "testimonyWall") continue;
      for (const option of scene.questionOptions.filter((item) => item.correct && item.lines?.length)) {
        for (const line of option.lines) if (line.text) assert.ok(director.includes(line.text), `${packet.caseId}/${option.id}: ${line.text}`);
        checked++;
      }
    }
  }
  assert.ok(checked >= 15);
});

test("实机与阅读稿共用回答优先级，保留说话人及停顿", () => {
  const answer = { question: "问", answer: "过时短答", lines: [{ speaker: "男方", text: "完整回答" }, { role: "pause" }, { role: "host", text: "接着问" }] };
  assert.deepEqual(answerDialogueLines(answer), answer.lines);
  const html = sceneQuestionAnswerHtml(answer);
  assert.doesNotMatch(html, /过时短答/);
  assert.match(html, /男方/);
  assert.match(html, /完整回答/);
  assert.match(html, /call-pause/);
  assert.ok(html.indexOf("完整回答") < html.indexOf("接着问"));
  assert.deepEqual(answerDialogueLines({ answer: "仅有短答" }), [{ role: "caller", text: "仅有短答" }]);
  const brief = { id: "case", sceneVersions: [{ id: "scene", version: "原陈述" }] };
  const state = { caseActionLog: { case: { "version:0": true } }, sceneQuestionPicks: { "case:scene:0": answer } };
  const history = latestChoiceReviewRowsForState(state, brief);
  assert.ok(history.some((line) => line.speaker === "男方" && line.text === "完整回答"));
  assert.ok(!history.some((line) => line.text === "过时短答"));
});

test("代表路线只允许白天收到且能标全的材料，回拨问题跟随所选行", () => {
  const packet = packets.find((item) => item.caseId === "03-profile");
  const marks = { "case3-credential-balance": ["p04", "p06", "p07"] };
  const questions = documentReadingQuestions(packet, marks);
  assert.deepEqual(questions, []);
  const callback = continuous.indexOf(packet.overnightStructure.linearCallback.lines[0].text);
  for (const question of questions) assert.ok(continuous.indexOf(question.question, callback) > callback);
  assert.throws(() => documentReadingQuestions(packet, {}), /valid, reachable/);
  assert.throws(() => documentReadingQuestions(packet, { "case3-credential-balance": ["p04", "p06", "p07", "p03"] }), /valid, reachable/);
  assert.throws(() => documentReadingQuestions(packet, { ...marks, "not-yet-received": ["row"] }), /not received/);
  const beat = packet.overnightStructure.liveCounterBeats.find((item) => item.triggerAny);
  assert.equal(liveCounterBeatTriggerMet(beat, { documentMarks: marks }), true);
  assert.equal(liveCounterBeatTriggerMet(beat, { documentMarks: {} }), false);
});

test("案一后台来信一次读完，阅读稿不保留排序或最终引语补问", () => {
  const packet = packets[0];
  assert.equal(packet.overnightStructure.dayScenes.length, 1);
  assert.ok(!packet.overnightStructure.dayScenes[0].body.timelineSort);
  const text = packet.overnightStructure.dayScenes[0].body.sourceNote;
  assert.ok(continuous.includes(text));
  assert.ok(director.includes(text));
  const first = continuous.split("# 附录｜")[0].split("## 深入一问")[0];
  assert.ok(first.includes("## 收麦"));
});

import { STORY_PACK_CREDITS } from "../../src/runtime/storyPackCredits.js";
import { storyPackCompleteHtml } from "../../src/ui/storyPackCompleteView.js";

test("序章完整首述、双线交接回告与片尾都进入主阅读路线，可选案卷分离", () => {
  const main = continuous.split("# 附录｜")[0];
  const cafe = manifest.nightShell.cafePrologue;
  for (const line of cafe.cafe.initialAccountLines) assert.ok(main.includes(line.text));
  const firstAction = main.indexOf(cafe.cafe.inquiries[0].options.find(option => option.correct).question);
  assert.ok(main.indexOf(cafe.cafe.initialAccountLines.at(-1).text) < firstAction);
  for (const route of cafe.aftermath.routes) {
    for (const line of [...route.lines, ...route.handoffLines]) if (line.text) assert.ok(main.includes(line.text));
    if (route.id === "account") {
      const lastLine = [...route.lines, ...route.handoffLines].filter(line => line.text).at(-1).text;
      for (const row of route.rows) assert.ok(main.indexOf(`- ${row.when}｜${row.label}｜${row.status}`) > main.indexOf(lastLine), "account summary must follow the spoken exchange");
    }
  }
  for (const line of [...cafe.forensic.openingLines, ...cafe.forensic.accountClueLines]) if (line.text) assert.ok(main.includes(line.text));
  const credits = storyPackCompleteHtml();
  let previous = -1;
  for (const line of STORY_PACK_CREDITS) {
    assert.ok(credits.includes(line));
    const current = main.indexOf(line);
    assert.ok(current > previous);
    previous = current;
  }
  assert.doesNotMatch(main, /界面边界说明|与上段互斥|另一种先手|可选案卷｜/);
  for (const packet of packets) {
    assert.ok(continuous.split("# 附录｜可选完整案卷")[1].includes(packet.caseClosing.verdict));
    for (const option of packet.overnightStructure.callerQuestion?.options ?? []) {
      assert.ok(main.includes(option.label));
      for (const line of option.lines ?? []) assert.ok(main.includes(line.text));
      if (option.callerLine) assert.ok(main.includes(option.callerLine));
    }
  }
});

test("Tony 原话材料引用此前必经陈述，不借用未播放的旧证词墙", () => {
  const packet = packets.find(item => item.caseId === "02-tony");
  const source = packet.sceneVersions.find(scene => scene.id === "tony-caller-benefits");
  const later = packet.sceneVersions.find(scene => scene.id === "tony-next-push-column");
  const card = later.testimonyWall.acts.flatMap(act => act.decisivePresent.materialCards)
    .find(item => item.id === "tony-next-push-column:tony-heard-threshold-before");
  const quote = card.excerpt.replace(/^[‘“]|[’”]$/g, "");
  assert.ok(source.version.includes(quote));
  const main = continuous.split("# 附录｜")[0];
  assert.ok(main.indexOf(source.version) >= 0);
  assert.ok(main.indexOf(source.version) < main.indexOf(card.excerpt));
});
