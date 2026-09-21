import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialQuickDetectiveState, normalizeQuickDetectiveState, quickStatementLinesForRound, applyQuickStatementLineSelection, advanceQuickMissReaction, quickRoundPatienceForState, quickMissLine, quickConfrontationLinesForState, advanceQuickConfrontation } from "../../src/runtime/quickDetectiveModel.js";
import { quickDetectiveActiveLine, quickDetectiveMissReactionHtml } from "../../src/ui/quickDetectiveView.js";

const read = (name) => JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/quick-cases/${name}.json`, import.meta.url)));
const packet = read("02-one-missed-message");
const option = packet.issueOptions.find((o) => o.id === "founder-busy");
function select(p = packet, id = option.id, roundIndex = 0) {
  const state = { ...initialQuickDetectiveState(p), scene: "issueSelection", roundIndex, resolvedConfrontationIds: [...(p.disclosureRounds[roundIndex].autoConfrontationIds ?? [])] };
  const o = p.issueOptions.find((o) => o.id === id);
  const line = quickStatementLinesForRound(p, state).find((l) => l.text.includes(o.sourceAnchor));
  return applyQuickStatementLineSelection(p, state, line.id);
}

test("手机放哪儿是独立路线，读档后答完不补问另一选项", () => {
  let s = select();
  assert.equal(quickDetectiveActiveLine(packet, s).text, option.question);
  s = advanceQuickConfrontation(packet, s);
  s = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(s)), packet);
  assert.equal(quickDetectiveActiveLine(packet, s).role, "caller");
  s = advanceQuickConfrontation(packet, s);
  assert.equal(s.scene, "transcript");
  assert.equal(s.roundIndex, 1);
  assert.ok(s.resolvedConfrontationIds.includes("phone-in-bag"));
  assert.ok(!s.resolvedConfrontationIds.includes("message-or-drunkenness"));
});

test("普通无锚点句也先提问，不在选句时扣费", () => {
  const base = { ...initialQuickDetectiveState(packet), scene: "issueSelection" };
  const neutral = quickStatementLinesForRound(packet, base).find(l => !packet.issueOptions.some(o => l.text.includes(o.sourceAnchor)));
  const s = applyQuickStatementLineSelection(packet, base, neutral.id);
  assert.equal(quickMissLine(s).role, "host");
  assert.ok(quickMissLine(s).text);
  assert.equal(quickRoundPatienceForState(packet, s).remaining, quickRoundPatienceForState(packet, base).remaining);
});

test("不同原句保留自己的开头，重载不跳句，共享追问完成只记一次", () => {
  const legacyPacket = structuredClone(packet);
  delete legacyPacket.disclosureRounds[0].autoConfrontationIds;
  legacyPacket.disclosureRounds[0].issueOptionIds = ["flower-request", ...(legacyPacket.disclosureRounds[0].issueOptionIds ?? [])];
  for (const [p, id, round] of [[legacyPacket, "flower-request", 0]]) {
    let s = select(p, id, round);
    const o = p.issueOptions.find(o => o.id === id);
    const lines = quickConfrontationLinesForState(p, s);
    assert.deepEqual(lines.slice(0, o.confrontationOpeningLines.length), o.confrontationOpeningLines);
    s = advanceQuickConfrontation(p, s);
    s = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(s)), p);
    assert.equal(quickDetectiveActiveLine(p, s).text, lines[1].text);
    for (let i = 1; i < lines.length; i++) s = advanceQuickConfrontation(p, s);
    assert.equal(s.resolvedConfrontationIds.filter(id => id === o.confrontationId).length, 1);
    if (s.scene === "issueSelection") assert.ok(quickStatementLinesForRound(p, s).find(l => l.id === s.activeSourceLineId)?.text.includes(o.sourceAnchor));
  }
});

test("新增选句开头不改变旧版正在播放的共享问答偏移", () => {
  const s = { ...select(), scene: "confrontation", activeIssueId: undefined, activeConfrontationId: "care-or-display", confrontationLineIndex: 1 };
  const restored = normalizeQuickDetectiveState(s, packet);
  assert.equal(quickConfrontationLinesForState(packet, restored)[1].text, packet.confrontations.find(c => c.id === s.activeConfrontationId).lines[1].text);
});

import { evidenceOperationHtml } from '../../src/ui/evidenceView.js';
import { refreshSavedExchangeCopy } from '../../src/runtime/savedContentRefresh.js';
import { statementLinesFromText } from '../../src/runtime/statementReviewModel.js';
const credit = JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/01-credit.json', import.meta.url)));

test('案一首次出示的旧图保留日期配文，收麦后不再重复出题', () => {
  const hook = credit.investigationHooks.find(h => h.id === 'credit-friend-dm');
  const check = credit.evidenceChecks.find(c => c.id === 'credit-anniversary-footprint');
  const action = credit.nightStructure.interlude.actions.find(a => a.hookId === hook.id);
  assert.equal(action, undefined);
  assert.equal(credit.nightStructure.interlude.flowMode, 'linear');
  for (const key of ['postedAt','location','caption','comment']) {
    assert.equal(check.socialPost[key], hook.socialPost[key]);
    assert.ok(evidenceOperationHtml(check).includes(check.socialPost[key]));
  }
  assert.match(check.socialPost.postedAt,/两年前/);
  assert.match(check.socialPost.caption,/第三次/);
  assert.ok(credit.sceneVersions[3].questionOptions.at(-1).question.includes('只去过一次'));
});

test('没有结构化朋友圈的材料仍展示原始材料行', () => {
  const html = evidenceOperationHtml({title:'探店材料',materialRows:['餐费 300 元','合作入账 0 元']});
  assert.ok(html.includes('餐费 300 元'));
  assert.ok(html.includes('合作入账 0 元'));
  assert.ok(!html.includes('朋友圈用户'));
});

test('回放末尾存档可恢复，已完成的问答前缀和其他历史不丢失', () => {
  const brief={...credit,id:'credit-test'};
  const scene=brief.sceneVersions[6],stage=brief.statementStages.find(s=>s.sceneIndexes.includes(6));
  const first=scene.questionOptions[0];
  const state={chapter:1,caseBrief:brief,scene:'sceneLineReplay',activeStatementLineId:`${stage.id}:end`,dialogueProgress:{'credit-test:sceneReview':6},caseActionLog:{'credit-test':{history:true}},sceneQuestionPicks:{'credit-test:scene:6':{...first,optionId:first.id,completedOptionIds:[first.id]}}};
  const fresh=refreshSavedExchangeCopy(JSON.parse(JSON.stringify(state)),[brief],[brief]);
  assert.equal(fresh.activeStatementLineId,state.activeStatementLineId);
  assert.deepEqual(fresh.sceneQuestionPicks['credit-test:scene:6'].completedOptionIds,[first.id]);
  assert.equal(fresh.caseActionLog['credit-test'].history,true);
  assert.equal(fresh.caseActionLog['credit-test']['version:6'],undefined);
});

test('重复询问已完成问题，读档保持整组对白，不串到同句的普通追问', () => {
  const brief = {...credit, id:'credit-repeat-test'};
  brief.sceneVersions = structuredClone(brief.sceneVersions);
  brief.sceneVersions[6].reviewProbes = JSON.parse(readFileSync(new URL('./fixtures/legacy-credit-interactions.json', import.meta.url))).deviceProbes;
  const scene = brief.sceneVersions[6];
  for (const option of scene.questionOptions) {
    for (const legacy of [false, true]) {
      const line = statementLinesFromText(scene.version, {prefix:scene.id}).find(l=>l.text.includes(option.sourceAnchor));
      const probe = (scene.reviewProbes ?? []).find(p=>line.text.includes(p.sourceAnchor));
      const key = `${brief.id}:scene:6`;
      const completedOptionIds = scene.questionSequence.slice(0, scene.questionOptions.indexOf(option)+1);
      const state = {
        caseBrief:brief, scene:'sceneQuestionAnswer', activeStatementLineId:line.id,
        dialogueProgress:{[`${brief.id}:sceneReview`]:6},
        sceneQuestionPicks:{[key]:{...option, optionId:option.id, optionIndex:scene.questionOptions.indexOf(option), completedOptionIds}},
        caseActionLog:{[brief.id]:{history:true}},
        sceneQuestionFocus:{caseId:brief.id,sceneIndex:6,kind:'probe',lineId:line.id,
          probeId:legacy ? probe?.id : null, resolvedOptionId:legacy ? undefined : option.id,
          pick:{question:option.question,answer:option.answer,lines:option.lines}}
      };
      const restored = refreshSavedExchangeCopy(JSON.parse(JSON.stringify(state)), [brief], [brief]);
      assert.equal(restored.scene, 'sceneQuestionAnswer');
      assert.equal(restored.sceneQuestionFocus.resolvedOptionId, option.id);
      assert.equal(restored.sceneQuestionFocus.probeId, null);
      assert.equal(restored.sceneQuestionFocus.pick.question, option.question);
      assert.equal(restored.sceneQuestionFocus.pick.answer, option.answer);
      assert.deepEqual(restored.sceneQuestionFocus.pick.lines, option.lines);
      assert.deepEqual(restored.sceneQuestionPicks[key].completedOptionIds, completedOptionIds);
      assert.deepEqual(restored.caseActionLog, state.caseActionLog);
    }
  }
});

test('普通追问读档保留来电人与主播交替的整组回答', () => {
  const brief = structuredClone({...credit, id:'credit-probe-test'});
  brief.sceneVersions[6].reviewProbes = JSON.parse(readFileSync(new URL('./fixtures/legacy-credit-interactions.json', import.meta.url))).deviceProbes;
  const scene = brief.sceneVersions[6], probe = scene.reviewProbes[0];
  scene.version = '拍摄设备是给我买的。'; // Legacy fixture tests saved dialogue mechanics independently of the revised live scene.
  probe.lines = [{role:'caller',text:probe.answer},{role:'host',text:'好，我知道了。'}];
  const line = statementLinesFromText(scene.version, {prefix:scene.id}).find(l=>l.text.includes(probe.sourceAnchor));
  const state = {caseBrief:brief,scene:'sceneQuestionAnswer',dialogueProgress:{[`${brief.id}:sceneReview`]:6},
    sceneQuestionFocus:{caseId:brief.id,sceneIndex:6,kind:'probe',lineId:line.id,probeId:probe?.id,pick:{...probe}}};
  const restored = refreshSavedExchangeCopy(JSON.parse(JSON.stringify(state)),[brief],[brief]);
  assert.equal(restored.scene,'sceneQuestionAnswer');
  assert.deepEqual(restored.sceneQuestionFocus.pick.lines,probe.lines);
});

import { applyQuickIssueSelection } from '../../src/runtime/quickDetectiveModel.js';
import { quickInquiryHistoryLines, quickSourceDocumentHtml } from '../../src/ui/quickDetectiveView.js';

test('四组二选一逐条恢复后只出口所选问法，不排队补问', () => {
  for (const [id, roundIndex, choices] of [
    ['01-no-conditions', 1, ['benefactor-source', 'father-identity']],
    ['01-no-conditions', 2, ['mortgage-pressure', 'report-disclosure']],
    ['02-one-missed-message', 0, ['missed-message-state', 'founder-busy']],
    ['02-one-missed-message', 3, ['nightlife-pattern', 'apology-post']]
  ]) for (const choice of choices) {
    const p = read(id);
    let state = applyQuickIssueSelection(p, { ...initialQuickDetectiveState(p), scene: 'issueSelection', roundIndex, resolvedConfrontationIds: p.disclosureRounds.slice(0, roundIndex).flatMap(r => r.requiredConfrontationIds) }, choice);
    const selected = p.issueOptions.find(o => o.id === choice).confrontationId;
    const alternate = p.issueOptions.find(o => o.id === choices.find(x => x !== choice)).confrontationId;
    while (state.scene === 'confrontation') {
      state = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), p);
      assert.equal(state.activeConfrontationId, selected);
      state = advanceQuickConfrontation(p, state);
    }
    assert.ok(state.roundIndex > roundIndex || state.scene === 'verdict');
    assert.ok(!state.resolvedConfrontationIds.includes(alternate));
  }
});

test('快案回看保留早先的一百万与房贷，不泄露未选问答', () => {
  const p = read('01-no-conditions');
  const state = { ...initialQuickDetectiveState(p), roundIndex: 2, resolvedConfrontationIds: ['two-fathers'], attemptedIssueIds: ['benefactor-source'] };
  const history = quickInquiryHistoryLines(p, state).map(l => l.text).join('\n');
  assert.match(history, /一百万/);
  assert.match(history, /房贷/);
  assert.ok(history.includes(p.confrontations.find(c => c.id === 'two-fathers').lines[0].text));
  assert.ok(!history.includes(p.issueOptions.find(o => o.id === 'father-identity').question));
});

test('长文原页列出已转未转及文末虚构，原文与回应分开', () => {
  const p = read('03-labeled-fiction');
  const html = quickSourceDocumentHtml(p);
  for (const phrase of ['演员许念', '三千万', '五千万美元我没有转', '中间人', '纯属虚构。']) assert.ok(html.includes(phrase));
  assert.equal(p.sourceDocument.paragraphs.at(-1), '纯属虚构。');
  assert.ok(!p.presentation.source.roleLabel.includes('虚构'));
});
