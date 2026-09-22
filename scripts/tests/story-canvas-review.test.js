import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LIVE_SCENES, isSceneReviewScene, keepsScenePressure } from "../../src/runtime/liveSceneKinds.js";
import { generateDailyCaseSequence } from "../../src/caseEngine.js";
import { CONTENT_CASES } from "../../src/generated/contentPackIndex.js";
import { NPCS } from "../../src/story.js";
import { baseState } from "../../src/state.js";
import { collectCharacterDialogue } from "../build-character-dialogue-report.js";

const readCase = (id) => JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/cases/${id}.json`, import.meta.url), "utf8"));

test("信用卡第二场从缺转发问，不把尚未听过的在职状态冒充前述原话", () => {
  const b = readCase("01-credit");
  const first = b.sceneVersions.find((s) => s.id === "credit-living-arrangement");
  const second = b.sceneVersions.find((s) => s.id === "credit-layoff-gap");
  const entry = second.beforeVersion.lines.map((l) => l.text ?? "").join("");
  assert.match(JSON.stringify(first), /这个月|没来/);
  assert.match(entry, /这个月.*钱.*没来/);
  assert.doesNotMatch(entry, /你不是说.*上班|你说.*还在上班/);
  assert.match(second.version, /工资记录没发.*社保/);
});

test("匿名餐厅旧图在第一夜收到，来源不再依赖前同事和流水解谜", () => {
  const b = readCase("01-credit");
  const hook = b.investigationHooks.find(h => h.id === "credit-friend-dm");
  assert.equal(hook.source, "dm");
  assert.match(JSON.stringify(hook), /匿名/);
  assert.equal(hook.triggerAction, "version:2");
  assert.match(hook.socialPost.postedAt, /两年前/);
  assert.ok(!b.investigationHooks.some(h => h.id === "credit-ex-coworker-note"));
  assert.ok(!b.nightStructure.interlude.actions.some(a => a.hookId === hook.id), "第一夜已核对的旧图不能在收麦后再次出题");
});

test("回放、立场与材料沿用压力和连线声音，但保留自己的页面路由", () => {
  for (const scene of ["sceneLineReplay", "stanceSnapshot", "afterSceneEvidence"]) {
    assert.equal(keepsScenePressure(scene), true);
    assert.equal(LIVE_SCENES.has(scene), true);
    assert.equal(isSceneReviewScene(scene), false);
  }
  for (const scene of ["dayScene", "caseSolved", "interludeDesk"]) assert.equal(keepsScenePressure(scene), false);
  assert.equal(isSceneReviewScene("overnightNight2"), true);
});

test("内容包已登记的案件缺失或退回仅元数据时必须报错，不能顶上旧台词", () => {
  const cases = CONTENT_CASES["steam-demo-01"];
  const saved = cases["01-credit"];
  const options = { storyKey: "steam-demo-01", plotId: saved.plotId };
  try {
    delete cases["01-credit"];
    assert.throws(() => generateDailyCaseSequence(NPCS, baseState.attrs, options), /01-credit.*缺少可运行正文/);
    cases["01-credit"] = { ...saved, runtimeContentStatus: "metadata-only" };
    assert.throws(() => generateDailyCaseSequence(NPCS, baseState.attrs, options), /缺少可运行正文/);
  } finally { cases["01-credit"] = saved; }
  const [brief] = generateDailyCaseSequence(NPCS, baseState.attrs, options);
  assert.equal(brief.sceneVersions[0].id, saved.sceneVersions[0].id);
});

test("人物台词导出遵守帮助角色不可见状态", async () => {
  const result = await collectCharacterDialogue();
  assert.equal(result.lines.some((line) => line.path.endsWith(".helperHint")), false);
});

test("Tony 第二幕先展示具体履行问题和收款人的回避，结果仍保留未成交确认", () => {
  const b = readCase("02-tony");
  const act = b.sceneVersions.find((s) => s.id === "tony-next-push-column").testimonyWall.acts[1];
  const chat = act.openerLines.find((l) => l.role === "stage" && l.text.includes("后台打开完整聊天"));
  assert.match(chat.text, /十二万.*买成.*Tony：.*已经提交/);
  assert.ok(act.openerLines.indexOf(chat) >= 0);
  assert.match(act.statements[0].text, /已提交.*买进去了/);
  assert.ok(b.truthBoundary.unknown.some((l) => l.includes("十二万是否已经买成")));
  assert.match(act.decisivePresent.hostLine, /合同.*催/, "主播回应已经披露的催合同经历");
  assert.doesNotMatch(act.decisivePresent.hostLine, /刘海|修头发/, "不能抢在咨询者后面的生活回忆之前引用它");
});

import { liveCounterBeatHtml } from '../../src/ui/liveCounterBeatView.js';
import { liveCounterBeatAfterScene } from '../../src/runtime/liveCounterModel.js';

test('设备约定和账单计算在实际播放场次内，归属不再当新秘密', () => {
  const p = readCase('01-credit');
  const index = p.sceneVersions.findIndex(s => s.id === 'credit-eight-wan-bill');
  assert.ok(p.nightStructure.segment1SceneIndexes.includes(index));
  const scene = p.sceneVersions[index];
  const device = scene.questionOptions.find(q => q.id === 'credit-eight-wan-bill:device-installment');
  const gap = scene.questionOptions.find(q => q.id === 'credit-eight-wan-bill:questionOptions:0');
  assert.ok(scene.questionSequence.indexOf(device.id) < scene.questionSequence.indexOf(gap.id));
  assert.ok(device.materialRows.some(r => r.includes('分期')));
  assert.equal(gap.logicContract.sourceKind, 'host-calculation');
  assert.ok(device.lines.some(l => l.role === 'caller' && l.text.includes('没签过分期')));
});

test('彩礼反驳在饭局取消后可达，选中后不复播前言或另一条回应', () => {
  const p = readCase('03-profile');
  const beats = p.overnightStructure.liveCounterBeats;
  const beat = beats.find(b => b.id === 'profile-marriage-price');
  const cancellation = beats.find(b => b.id === 'profile-weekend-dinner-cancelled');
  assert.ok(beats.indexOf(beat) > beats.indexOf(cancellation));
  const already = new Set(beats.slice(0, beats.indexOf(beat)).map(b => `liveCounterBeat:${b.id}`));
  assert.equal(liveCounterBeatAfterScene(p, beat.afterSceneIndex, id => already.has(id)).id, beat.id);
  assert.equal(beat.choiceMode, 'single');
  assert.equal(beat.choices.length, 2);
  const before = liveCounterBeatHtml(beat);
  assert.ok(before.includes(beat.lines.at(-1).text));
  for (const choice of beat.choices) {
    assert.ok(before.includes(`data-live-counter-choice="${choice.id}"`));
    const html = liveCounterBeatHtml(beat, { choiceId: choice.id });
    assert.ok(!html.includes(beat.lines[0].text));
    assert.ok(html.includes(choice.lines[0].text));
    assert.ok(!html.includes(beat.choices.find(c => c.id !== choice.id).lines[0].text));
  }
});
