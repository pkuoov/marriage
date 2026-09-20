import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { statementLinesFromText, statementStageForScene, statementStageProgress } from "../../src/runtime/statementReviewModel.js";
import { statementReplayPageChoicesHtml } from "../../src/ui/statementReviewView.js";
import { evidenceOperationHtml, evidencePickFeedbackHtml } from "../../src/ui/evidenceView.js";
import { createFocusInputControl } from "../../src/ui/focusInputControl.js";
import { unlockedMaterialProfile } from "../../src/runtime/materialVisibility.js";
import { createRecapScreens } from "../../src/ui/screens/recapScreens.js";
import { refreshSavedExchangeCopy } from "../../src/runtime/savedContentRefresh.js";
import { normalizedCafePrologueProgress, cafePrologueCanOpenForensic, cafePrologueSceneForStep } from "../../src/runtime/prologueCafeModel.js";
import { storyInterludeHtml } from "../../src/ui/storyInterludeView.js";
import { titleScreenHtml } from "../../src/ui/titleView.js";
const credit = JSON.parse(readFileSync(new URL("../../content/packs/steam-demo-01/cases/01-credit.json", import.meta.url)));

test("案间只播放当前阶段；点开新闻后不重新播放案间交流与先前假设", () => {
  const base = { shellLines: [{ role: "host", text: "桌边的交流" }], shellAfterLines: [{ text: "手机收到推送" }] };
  const opening = storyInterludeHtml(base);
  assert.match(opening, /桌边的交流/);
  assert.match(opening, /手机收到推送/);
  const hypothesis = { response: "先前材料支持的假设" };
  const selected = storyInterludeHtml({ ...base, worldEchoHypothesis: hypothesis });
  assert.match(selected, /先前材料支持的假设/);
  assert.doesNotMatch(selected, /桌边的交流|手机收到推送/);
  const news = storyInterludeHtml({ ...base, worldEchoHypothesis: hypothesis, worldEcho: { headline: "新闻标题", body: "公告第一段\n\n公告第二段" } });
  assert.match(news, /新闻标题[\s\S]*公告第一段[\s\S]*公告第二段/);
  assert.doesNotMatch(news, /桌边的交流|先前材料支持的假设/);
});

test("已完成的旅程在标题页明确提供重看片尾，未完成仍是继续直播", () => {
  assert.match(titleScreenHtml({ canContinue: true, journeyComplete: true }), /重看片尾/);
  assert.doesNotMatch(titleScreenHtml({ canContinue: true, journeyComplete: true }), /继续上次直播/);
  assert.match(titleScreenHtml({ canContinue: true }), /继续上次直播/);
});

test("旧存档的回答与材料反馈同步新台词，保留进度和既有预算", () => {
  const brief = { ...credit, id: "credit-save" };
  const state = {
    scene: "sceneQuestionAnswer",
    sceneQuestionFocus: { caseId: brief.id, sceneIndex: 0, kind: "key", optionIndex: 1, pendingPenalty: "statement-key" },
    sceneQuestionPicks: { "credit-save:scene:0": { question: brief.sceneVersions[0].questionOptions[1].question, answer: "旧的自曝回答", guarded: true, correct: false } },
    sceneAnswers: { "credit-save:scene:0": "旧的自曝回答" },
    evidenceCheckPicks: { "credit-save:evidence:0": { optionIndex: 2, optionId: brief.evidenceChecks[0].options[2].id, feedback: "旧的含糊反馈" } },
    caseActionLog: { "credit-save": { "version:0": true } },
    caseBudgets: { "credit-save": { remaining: 3 } },
    lastReaction: "弹幕一下分成了两拨。", lastPityLine: "先看材料的教程"
  };
  const refreshed = refreshSavedExchangeCopy(state, [brief]);
  assert.match(refreshed.sceneAnswers["credit-save:scene:0"], /日常都是一起花销/);
  assert.equal(refreshed.sceneQuestionFocus.pendingPenalty, null);
  assert.equal(refreshed.evidenceCheckPicks["credit-save:evidence:0"].feedback, brief.evidenceChecks[0].options[2].feedback);
  assert.equal(refreshed.caseActionLog["credit-save"]["version:0"], undefined, "旧单选不代表顺序追问已经全部听完");
  assert.equal(state.caseActionLog["credit-save"]["version:0"], true, "迁移不改写传入快照");
  assert.deepEqual(refreshed.caseBudgets, state.caseBudgets);
  assert.equal(refreshed.lastReaction, null);
  assert.equal(refreshed.lastPityLine, null);
  assert.equal(state.sceneAnswers["credit-save:scene:0"], "旧的自曝回答", "刷新不改写传入快照");
});

test("八万账单按序问清酒水和用途即可继续，普通衣服消费不承担通关门槛", () => {
  const index = credit.sceneVersions.findIndex((scene) => scene.id === "credit-eight-wan-bill");
  const stage = statementStageForScene(credit, index);
  assert.equal(statementStageProgress({ brief: credit, stage }).complete, false);
  const progress = statementStageProgress({ brief: credit, stage, actionDone: (key) => key === `version:${index}` });
  assert.equal(progress.complete, true);
  assert.equal(progress.dialogueReviewCount, 0);
  const scene = credit.sceneVersions[index];
  assert.match(scene.questionOptions[0].question, /酒水/);
  assert.equal(scene.afterScene, undefined);
  assert.ok(!credit.evidenceChecks.some(item => item.id === "credit-after-layoff-spend"));
});

test("单句询问统一两个选项，不显示关键标注", () => {
  const scene = credit.sceneVersions[0];
  const line = statementLinesFromText(scene.version, { prefix: scene.id }).find((item) => item.text.includes("不住在一起"));
  assert.ok(line);
  const html = statementReplayPageChoicesHtml({ scene, line });
  assert.equal((html.match(/data-scene-(?:question=|dialogue=|review-line=|replay-next)/g) ?? []).length, 2);
  assert.doesNotMatch(html, /key-choice-label/);
  const nextHtml = statementReplayPageChoicesHtml({ scene, line, completedOptionIds: [scene.questionSequence[0]] });
  assert.equal((nextHtml.match(/data-scene-(?:question=|dialogue=|review-line=|replay-next)/g) ?? []).length, 2);
  assert.match(nextHtml, /data-scene-question="0:1"/);
  assert.match(html, /不询问/);
  assert.equal(scene.questionOptions.every((option) => option.correct), true);
  assert.match(scene.questionOptions[1].answer, /日常都是一起花销/);
  assert.equal(scene.questionOptions[1].missReaction, undefined);
});

test("错选显示操作结果和对应理由，不播放正确分支的新事实", () => {
  const pick = { correct: false, feedback: "照片看不出花了多少钱。", reactionLine: "尚未获知的转账人", revisedVersion: "尚未披露的事实" };
  assert.match(evidenceOperationHtml({}, pick), /未选中关键线索/);
  const html = evidencePickFeedbackHtml(pick);
  assert.match(html, /照片看不出花了多少钱/);
  assert.doesNotMatch(html, /尚未获知|尚未披露|这条先放着/);
});

test("Esc 没有关闭层时不选中重听或标题；忽略隐藏的关闭按钮", () => {
  const button = (visible, close) => ({ getBoundingClientRect: () => ({ width: visible ? 100 : 0, height: visible ? 40 : 0 }), matches: () => close });
  const hiddenClose = button(false, true), rewind = button(true, false), visibleClose = button(true, true);
  let buttons = [hiddenClose, rewind];
  const control = createFocusInputControl({ app: { querySelector: () => null, querySelectorAll: () => buttons } });
  assert.equal(control.preferredBackButton(), null);
  buttons.push(visibleClose);
  assert.equal(control.preferredBackButton(), visibleClose);
});

test("挂断前不显示未收到的流水，收到后提供原件行而非全案结论", () => {
  const brief = { id: "fixture", storyClueObject: "未来的结案结论", documents: [{ id: "ledger", title: "交易摘录", rows: [{ date: "05-08", amount: "10000", party: "王**", memo: "转账" }] }], overnightStructure: { dayScenes: [{ kind: "document", body: { documentId: "ledger" } }] } };
  assert.equal(unlockedMaterialProfile({ brief }).count, 0);
  const profile = unlockedMaterialProfile({ brief, state: { caseOvernights: { fixture: { hangupDone: true, segment: "day" } } } });
  assert.equal(profile.label, "交易摘录");
  assert.match(profile.items[0].front, /05-08.*10000.*王\*\*/);
  assert.doesNotMatch(JSON.stringify(profile), /未来的结案结论/);
});

test("散场后依次调查亲子与家庭支出，旧存档只补尚未看过的一段", () => {
  function fixture(order = []) {
    const state = { cafePrologueStep: 7, cafePrologueOrder: order };
    const handlers = new Map(); let rendered;
    const routes = [{ id: "toy", title: "亲子", lines: [{ text: "亲子后续" }] }, { id: "account", title: "家庭支出", lines: [{ text: "家庭账后续" }] }];
    const screens = createRecapScreens({ getState: () => state, normalizedCafePrologueProgress, cafePrologueCanOpenForensic, cafePrologueSceneForStep,
      nightShellForBrief: () => ({ cafePrologue: { aftermath: { routes } } }), cafePrologueHeaderHtml: () => "", cafePrologueDialogueHtml: (lines) => lines.map((line) => line.text).join(""),
      cafeAccountBoardHtml: () => "", flowGroupHtml: (html) => html, escapeHtml: String,
      frame: (value) => { rendered = value; }, bind: (key, fn) => handlers.set(key, fn), bindSceneButtons() {}, saveState() {}, render() {}, moveScene: (scene) => { state.scene = scene; }
    });
    return { state, show() { screens.renderCafePrologueAftermath({}); return rendered; }, next() { handlers.get("[data-cafe-aftermath-next]")(); } };
  }
  const fresh = fixture();
  assert.match(fresh.show().text, /亲子后续/);
  fresh.next();
  assert.deepEqual(fresh.state.cafePrologueOrder, ["toy"]);
  assert.match(fresh.show().text, /家庭账后续/);
  fresh.next();
  assert.deepEqual(fresh.state.cafePrologueOrder, ["toy", "account"]);
  assert.equal(fresh.state.scene, "nightShellPrologue");
  const legacy = fixture(["account"]);
  assert.match(legacy.show().text, /亲子后续/);
  assert.match(legacy.show().choices, /回看这几个月的来电/);
  legacy.next();
  assert.equal(legacy.state.scene, "nightShellPrologue");
  const finishedLegacy = fixture(["toy"]);
  finishedLegacy.state.caseBriefs = [{ id: "done" }];
  finishedLegacy.state.solvedCaseIds = ["done"];
  assert.match(finishedLegacy.show().choices, /继续查看回告/);
  finishedLegacy.next();
  assert.equal(finishedLegacy.state.scene, "cafePrologueForensic");
});
