import test from "node:test";
import assert from "node:assert/strict";
import { courtRecordHtml, mountCourtRecord } from "../../src/ui/courtRecordView.js";
import { createDialogueController, startDialogueAfterTransition } from "../../src/runtime/dialoguePresentation.js";
import { documentById, documentRowById, earnedDocumentQuestionsFor, replaceDocumentQuestions, toggleDocumentMarks } from "../../src/runtime/documentMarkModel.js";
import { createOvernightDocumentScreens } from "../../src/ui/screens/overnightDocumentScreens.js";

const cafe = {
  evidencePair: [{ id: "chat", title: "聊天截图", detail: "聊天备注" }, { id: "hotel", title: "酒店订单", detail: "订单备注" }],
  transferEvidence: { id: "parallel-transfer-ledger", title: "转账流水", rows: ["尚未揭露的流水"] }
};

test("案卷只收录查看或出示过的原件，兼容旧存档的出示记录", () => {
  const empty = courtRecordHtml({}, { cafe });
  assert.match(empty, /暂时没有记录/);
  assert.doesNotMatch(empty, /聊天备注|订单备注|尚未揭露的流水/);
  const seen = courtRecordHtml({ cafePrologueInspectedIds: ["chat"], cafePrologueMarks: ["hotel"] }, { cafe });
  assert.match(seen, /聊天备注/);
  assert.match(seen, /订单备注/);
  assert.match(seen, /21:24/);
  assert.doesNotMatch(seen, /尚未揭露的流水/);
  assert.doesNotMatch(seen, /data-cafe-material-document="hotel" hidden/);
  assert.match(courtRecordHtml({ cafePrologueInspectedIds: ["parallel-transfer-ledger"] }, { cafe }), /尚未揭露的流水/);
});

test("案卷每次打开刷新同一场景内新增的对话和材料", () => {
  const previousDocument = globalThis.document;
  const overlay = { hidden: true, innerHTML: "", querySelectorAll: () => [], querySelector: () => null, addEventListener() {} };
  globalThis.document = { createElement: () => overlay, activeElement: null };
  try {
    const state = { dialogueBacklog: [], cafePrologueInspectedIds: [] };
    const record = mountCourtRecord({ append() {}, querySelectorAll: () => [] }, { state, cafe });
    record.open();
    assert.doesNotMatch(overlay.innerHTML, /刚说完的句子/);
    record.close();
    state.dialogueBacklog.push({ speaker: "来电人", text: "刚说完的句子" });
    state.cafePrologueInspectedIds.push("hotel");
    record.open();
    assert.match(overlay.innerHTML, /刚说完的句子/);
    assert.match(overlay.innerHTML, /订单备注/);
  } finally { globalThis.document = previousDocument; }
});

const ledger = {
  id: "ledger", title: "账单", markLimit: 2,
  rows: ["a", "b", "c"].map((rowId) => ({ rowId, date: rowId, amount: rowId })),
  rowQuestions: { a: [{ question: "问 a", answer: "答 a" }], c: [{ question: "问 c", answer: "答 c" }] },
  crossQuestions: [{ rows: ["a", "b"], question: "问交叉", answer: "答交叉" }]
};

test("圈选达到上限后仍能取消，取消行会撤掉交叉追问且保留其他材料的问题", () => {
  const full = ["a", "b"];
  assert.equal(toggleDocumentMarks(ledger, full, "c"), full);
  const removed = toggleDocumentMarks(ledger, full, "b");
  assert.deepEqual(removed, ["a"]);
  assert.deepEqual(toggleDocumentMarks(ledger, removed, "c"), ["a", "c"]);
  assert.equal(toggleDocumentMarks(ledger, full, "missing"), full);
  const other = { id: "other:row:1", documentId: "other", question: "另一份材料" };
  const earned = replaceDocumentQuestions([...earnedDocumentQuestionsFor(ledger, full), other], ledger, removed);
  assert.deepEqual(earned.map((question) => question.question), ["另一份材料", "问 a"]);
});

test("文档点击只保存草稿；确认才记录最终圈选，清理旧存档的误选记录", () => {
  const previousDocument = globalThis.document;
  globalThis.document = { querySelectorAll: () => [] };
  try {
    const brief = { id: "case", documents: [ledger] };
    const dayScene = { id: "review", body: { documentId: ledger.id } };
    const state = {
      routeChoiceLog: { case: [{ sceneIndex: 1.001, tone: "document-row", answer: "旧误选" }, { sceneIndex: 2, tone: "day-scene" }] },
      caseActionLog: { case: { "document:ledger:b": true, "other-action": true } }
    };
    let overnight = { documentMarks: { ledger: ["a", "b"] }, documentEarnedQuestions: earnedDocumentQuestionsFor(ledger, ["a", "b"]), dayScenesDone: [] };
    const handlers = new Map();
    let confirmed = 0;
    const screens = createOvernightDocumentScreens({
      getState: () => state, documentById, documentRowById, earnedDocumentQuestionsFor,
      ensureOvernight: () => overnight, updateOvernight: (_brief, patch) => { overnight = { ...overnight, ...patch }; },
      caseKey: () => "case", bind: (selector, fn) => handlers.set(selector, fn),
      dayFrame() {}, flowGroupHtml: (html) => html, escapeHtml: (value) => String(value ?? ""),
      saveState() {}, render() {}, bindSceneButtons() {}, playAudioCueOnce() {},
      markAction: (_brief, key) => { state.caseActionLog.case[key] = true; },
      recordRouteChoice: (_brief, sceneIndex, option) => { state.routeChoiceLog.case.push({ sceneIndex, ...option }); }
    }, { overnightRouteIndexFor: () => 1, completeDayScene: () => { confirmed += 1; overnight.dayScenesDone.push("review"); } });
    screens.renderDocumentDayScene(brief, dayScene);
    const select = (id) => handlers.get("[data-document-row]")({ currentTarget: { getAttribute: () => id } });
    select("b");
    select("c");
    assert.deepEqual(overnight.documentMarks.ledger, ["a", "c"]);
    assert.deepEqual(overnight.documentEarnedQuestions, []);
    assert.deepEqual(state.caseActionLog.case, { "other-action": true });
    assert.deepEqual(state.routeChoiceLog.case, [{ sceneIndex: 2, tone: "day-scene" }]);
    handlers.get("[data-complete-day-scene]")();
    assert.equal(confirmed, 1);
    assert.deepEqual(overnight.documentEarnedQuestions.map((question) => question.question), ["问 a", "问 c"]);
    assert.equal(state.caseActionLog.case["document:ledger:b"], undefined);
    assert.equal(state.caseActionLog.case["document:ledger:a"], true);
    assert.equal(state.caseActionLog.case["document:ledger:c"], true);
    assert.equal(state.routeChoiceLog.case.filter((row) => row.routeTone === "document-row").length, 2);
    select("a");
    assert.deepEqual(overnight.documentMarks.ledger, ["a", "c"], "已确认文档不再修改");
  } finally { globalThis.document = previousDocument; }
});

function dialogueFixture(options = {}) {
  const lines = [{ textContent: "" }];
  const pageLines = { innerHTML: "", querySelectorAll: () => lines };
  const indicator = {};
  const box = { isConnected: true, dataset: {}, classList: { toggle() {} }, querySelector: (selector) => selector === ".avg-page-lines" ? pageLines : indicator };
  let completeTransition;
  const finished = new Promise((resolve) => { completeTransition = resolve; });
  const transition = {
    removed: false, remove() { this.removed = true; },
    getAnimations: () => [{ playState: "running", effect: { getComputedTiming: () => ({ endTime: 1200 }) }, finished }]
  };
  const shown = [];
  const pages = [{ text: "第一句", speaker: "来电人", role: "caller" }, { text: "第二句", speaker: "来电人", role: "caller" }];
  const controller = createDialogueController({ box, pages, speed: "instant", onShown: (page) => shown.push(page.text), ...options });
  const root = { isConnected: true, querySelector: () => transition };
  return { root, controller, transition, completeTransition, shown, box };
}

async function withAnimationFrame(fn) {
  const oldCancel = globalThis.cancelAnimationFrame;
  globalThis.cancelAnimationFrame = () => {};
  try { await fn(); } finally { globalThis.cancelAnimationFrame = oldCancel; }
}

const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

test("过场结束前即时文字和点击都不推进；结束后才开始自动阅读计时", () => withAnimationFrame(async () => {
  const oldTimeout = globalThis.setTimeout;
  const oldClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let timerId = 0;
  globalThis.setTimeout = (fn) => { timers.set(++timerId, fn); return timerId; };
  globalThis.clearTimeout = (id) => timers.delete(id);
  try {
    const f = dialogueFixture({ autoMode: true });
    startDialogueAfterTransition(f.root, f.controller);
    f.controller.advance();
    assert.deepEqual(f.shown, []);
    assert.equal(timers.size, 0);
    f.completeTransition();
    await flush();
    assert.deepEqual(f.shown, ["第一句"]);
    assert.equal(f.controller.pageIndex, 0);
    assert.equal(timers.size, 1);
    f.controller.destroy();
    assert.equal(timers.size, 0);
  } finally { globalThis.setTimeout = oldTimeout; globalThis.clearTimeout = oldClearTimeout; }
}));

test("过场期间打开案卷会保留暂停，离开场景不会启动旧对白", () => withAnimationFrame(async () => {
  const f = dialogueFixture();
  startDialogueAfterTransition(f.root, f.controller);
  f.controller.setPaused(true);
  f.completeTransition();
  await flush();
  assert.deepEqual(f.shown, []);
  f.controller.setPaused(false);
  assert.deepEqual(f.shown, ["第一句"]);
  f.controller.destroy();
  const departed = dialogueFixture();
  startDialogueAfterTransition(departed.root, departed.controller);
  departed.controller.destroy();
  departed.completeTransition();
  await flush();
  assert.deepEqual(departed.shown, []);
}));

test("快进跳过过场，等待中的过场结束不会重复启动；无动画直接显示", () => withAnimationFrame(async () => {
  const f = dialogueFixture();
  startDialogueAfterTransition(f.root, f.controller);
  f.controller.setFastForward(true);
  assert.equal(f.transition.removed, true);
  assert.deepEqual(f.shown, ["第一句"]);
  f.completeTransition();
  await flush();
  assert.deepEqual(f.shown, ["第一句"]);
  f.controller.destroy();
  const initialFast = dialogueFixture({ fastForward: true });
  startDialogueAfterTransition(initialFast.root, initialFast.controller, { fastForward: true });
  assert.equal(initialFast.transition.removed, true);
  assert.deepEqual(initialFast.shown, ["第一句"]);
  initialFast.controller.destroy();
  const noAnimation = dialogueFixture();
  noAnimation.transition.getAnimations = () => [];
  startDialogueAfterTransition(noAnimation.root, noAnimation.controller);
  assert.deepEqual(noAnimation.shown, ["第一句"]);
  noAnimation.controller.destroy();
}));
