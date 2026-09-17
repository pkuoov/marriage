import test from "node:test";
import assert from "node:assert/strict";
import { decisiveHitTiming, mountDecisiveHitPresentation } from "../../src/runtime/decisiveHitPresentation.js";
import { createOvernightDocumentScreens } from "../../src/ui/screens/overnightDocumentScreens.js";
import { unlockedMaterialProfile } from "../../src/runtime/materialVisibility.js";
import { materialRecordHtml } from "../../src/ui/materialRecordView.js";

function hitFixture(options = {}) {
  const timers = new Map();
  const events = new Map();
  let id = 0;
  let stingers = 0;
  const root = { isConnected: true, classList: new Set() };
  const button = { isConnected: true, disabled: true, focus() { this.focused = true; } };
  const skipButton = { hidden: false, addEventListener: (name, fn) => events.set(name, fn), removeEventListener: (name) => events.delete(name) };
  skipButton.ownerDocument = { activeElement: skipButton };
  const dispose = mountDecisiveHitPresentation({ root, button, skipButton, timing: decisiveHitTiming(options), continueLabel: "继续", onStinger: () => stingers++, schedule: (fn) => { timers.set(++id, fn); return id; }, cancel: (key) => timers.delete(key) });
  return { root, button, skipButton, timers, events, dispose, stingers: () => stingers };
}

test("跳过演出立即显示回应、恢复焦点并取消尚未播放的音效", () => {
  const f = hitFixture();
  assert.equal(f.timers.size, 2);
  f.events.get("click")();
  assert.equal(f.button.disabled, false);
  assert.equal(f.button.textContent, "继续");
  assert.equal(f.button.focused, true);
  assert.equal(f.skipButton.hidden, true);
  assert.equal(f.root.classList.has("sequence-settled"), true);
  assert.equal(f.timers.size, 0);
  assert.equal(f.stingers(), 0);
  f.dispose();
  assert.equal(f.events.size, 0);
});

test("关闭特效、即时文字和系统减少动态都不强制等待", () => {
  for (const options of [{ screenEffects: "off" }, { fastForward: true }, { reducedMotion: true }]) {
    const f = hitFixture(options);
    assert.equal(f.timers.size, 0);
    assert.equal(f.button.disabled, false);
    assert.equal(f.stingers(), 0);
    f.dispose();
  }
  assert.equal(decisiveHitTiming({ screenEffects: "reduced" }).settleMs, 400);
});

test("离开场景后旧演出不能播放音效或更改按钮", () => {
  const f = hitFixture();
  f.root.isConnected = false;
  for (const fn of [...f.timers.values()]) fn();
  assert.equal(f.stingers(), 0);
  assert.equal(f.button.disabled, true);
  f.dispose();
  assert.equal(f.timers.size, 0);
});

test("时间线支持单张移除、撤销末张，提交后不再变更", () => {
  let overnight = { timelineSorts: { other: { order: ["保留"] } } };
  let saves = 0;
  const screen = createOvernightDocumentScreens({ ensureOvernight: () => overnight, updateOvernight: (_, patch) => { overnight = { ...overnight, ...patch }; }, saveState: () => saves++, render() {} }, {});
  const brief = { id: "case" };
  const scene = { id: "sort", body: { timelineSort: { cards: ["a", "b", "c"] } } };
  for (const id of ["a", "b", "c", "c", "unknown"]) screen.selectTimelineCard(brief, scene, id);
  assert.equal(saves, 3);
  screen.removeTimelineCard(brief, scene, 1);
  assert.deepEqual(overnight.timelineSorts.sort.order, ["a", "c"]);
  screen.removeTimelineCard(brief, scene);
  assert.deepEqual(overnight.timelineSorts.sort.order, ["a"]);
  assert.deepEqual(overnight.timelineSorts.other.order, ["保留"]);
  const before = saves;
  screen.removeTimelineCard(brief, scene, 99);
  overnight.timelineSorts.sort.submitted = true;
  screen.removeTimelineCard(brief, scene);
  screen.selectTimelineCard(brief, scene, "b");
  assert.equal(saves, before);
});

test("材料阅读只显示已收到的原文，并转义正文而不暴露内部判断", () => {
  const brief = { id: "case", sceneVersions: [{ showsCard: "one" }, { showsCard: "two" }], evidenceCards: [{ id: "one", title: "已收到", front: "<script>原文</script>", detail: "原文备注", contradiction: "内部答案" }, { id: "two", title: "尚未收到", front: "未解锁正文" }] };
  const state = { caseActionLog: { case: { "version:0": true } } };
  const items = unlockedMaterialProfile({ state, brief }).items;
  const html = materialRecordHtml(items);
  assert.equal(items.length, 1);
  assert.match(html, /&lt;script&gt;原文/);
  assert.match(html, /原文备注/);
  assert.doesNotMatch(html, /内部答案|未解锁正文|<script>/);
  assert.equal(unlockedMaterialProfile({ state, brief, visible: false }).count, 0);
});
