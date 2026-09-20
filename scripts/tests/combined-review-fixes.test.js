import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { refreshSavedCaseContent, refreshSavedExchangeCopy } from '../../src/runtime/savedContentRefresh.js';
import { earnedDocumentQuestionsFor } from '../../src/runtime/documentMarkModel.js';
import { documentIsReceived } from '../../src/runtime/materialVisibility.js';
import { statementStageProgress } from '../../src/runtime/statementReviewModel.js';
import { sceneDialogueOptions } from '../../src/ui/sceneQuestions.js';
const read = (id) => ({ ...JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/cases/${id}.json`, import.meta.url))), id });
const option = (id, question, answer = '回答') => ({ id, question, answer, correct: true });
const brief = (options) => ({ id: 'save', sceneVersions: [{ id: 'scene-a', version: '已经说过的事实。', questionOptions: options }] });
const state = (b, pick) => ({ caseBriefs: [b], scene: 'sceneQuestionAnswer', sceneQuestionFocus: { caseId: 'save', sceneIndex: 0, kind: 'key', optionIndex: 0 }, sceneQuestionPicks: { 'save:scene:0': pick }, caseBudgets: { save: { remaining: 2 } }, caseActionLog: { save: { 'version:0': true, 'sceneQuestion:0:0': true } } });

test('删题不按旧索引代选，活动回答退出且预算不重复结算', () => {
  const old = brief([option('removed', '旧题')]);
  const input = state(old, { optionId: 'removed', optionIndex: 0, question: '旧题', answer: '旧答' });
  const result = refreshSavedExchangeCopy(input, [brief([option('other', '另一题')])], [old]);
  assert.equal(result.sceneQuestionFocus, null);
  assert.equal(result.scene, 'sceneLineReplay');
  assert.equal(result.sceneQuestionPicks['save:scene:0'], undefined);
  assert.deepEqual(result.caseBudgets, input.caseBudgets);
  assert.equal(result.caseActionLog.save['sceneQuestion:0:0'], undefined);
});

test('插入重排后沿稳定身份恢复选项和已完成动作', () => {
  const old = brief([option('kept', '原问')]);
  const input = state(old, { optionId: 'kept', optionIndex: 0, question: '原问', answer: '原答' });
  const result = refreshSavedExchangeCopy(input, [brief([option('new', '新问'), option('kept', '修订问', '修订答')])], [old]);
  assert.equal(result.sceneQuestionPicks['save:scene:0'].optionIndex, 1);
  assert.equal(result.sceneAnswers['save:scene:0'], '修订答');
  assert.equal(result.sceneQuestionFocus.optionIndex, 1);
  assert.equal(result.caseActionLog.save['sceneQuestion:0:1'], true);
  assert.equal(result.caseActionLog.save['sceneQuestion:0:0'], undefined);
});

test('旧关键问迁入普通问答，当前不扣费，历史预算保持', () => {
  const old = brief([{ ...option('scene-a:questionOptions:0', '到账日期呢？'), correct: false }]);
  const input = state(old, { optionIndex: 0, question: '到账日期呢？', answer: '别问了', correct: false });
  input.sceneQuestionFocus.pendingPenalty = 'statement-key';
  const current = brief([option('main', '三张图一样吗？')]);
  current.sceneVersions[0].casualQuestions = [{ id: 'scene-a:questionOptions:0', question: '具体哪天到账？', answer: '没给日期' }];
  const result = refreshSavedExchangeCopy(input, [current], [old]);
  assert.equal(result.sceneQuestionFocus.kind, 'dialogue');
  assert.equal(result.sceneQuestionFocus.pendingPenalty, null);
  assert.equal(result.sceneDialoguePicks['save:scene:0'][0].answer, '没给日期');
  assert.deepEqual(result.caseBudgets, input.caseBudgets);
});

test('删除的活动探问不会保留旧台词快照', () => {
  const current = brief([]);
  const input = { scene: 'sceneQuestionAnswer', sceneQuestionFocus: { caseId: 'save', sceneIndex: 0, kind: 'probe', probeId: 'gone', pick: { question: '被删问', answer: '被删答' } } };
  const result = refreshSavedExchangeCopy(input, [current]);
  assert.equal(result.sceneQuestionFocus, null);
});

test('证据选项重排按身份匹配，无身份无文字时不猜测旧索引', () => {
  const old = { ...brief([]), evidenceChecks: [{ id: 'check', options: [{ id: 'choice', label: '原标注', feedback: '旧' }] }] };
  const current = structuredClone(old);
  current.evidenceChecks[0].options = [{ id: 'new', label: '新选项' }, { id: 'choice', label: '更新标注', feedback: '新' }];
  const input = { evidenceCheckPicks: { 'save:evidence:0': { optionIndex: 0, label: '原标注' } } };
  const result = refreshSavedExchangeCopy(input, [current], [old]);
  assert.equal(result.evidenceCheckPicks['save:evidence:0'].optionIndex, 1);
  assert.equal(result.evidenceCheckPicks['save:evidence:0'].feedback, '新');
  assert.equal(refreshSavedExchangeCopy({ evidenceCheckPicks: { 'save:evidence:0': { optionIndex: 0 } } }, [current]).evidenceCheckPicks['save:evidence:0'], undefined);
});

test('读档重建材料追问，保留已答和活动状态，删除的问题不复活', () => {
  const old = { ...brief([]), overnightStructure: { flowMode: 'linear', dayScenes: [] }, documents: [{ id: 'doc', rows: [{ rowId: 'r1' }, { rowId: 'r2' }], rowQuestions: { r1: [{ id: 'q1', question: '旧问', answer: '旧答' }], r2: [{ id: 'gone', question: '删问', answer: '删答' }] } }] };
  const current = structuredClone(old);
  current.documents[0].rowQuestions = { r1: [{ id: 'q1', question: '新问', answer: '新答' }] };
  const questions = earnedDocumentQuestionsFor(old.documents[0], ['r1', 'r2']);
  const input = { caseBriefs: [old], chapter: 1, caseOvernights: { save: { segment: 'night2', documentMarks: { doc: ['r1','r2'] }, documentEarnedQuestions: questions, documentAnsweredQuestions: { q1: true, gone: true }, activeDocumentQuestionId: 'q1' } } };
  const result = refreshSavedCaseContent(input, { generateCases: () => [current] });
  const o = result.caseOvernights.save;
  assert.deepEqual(o.documentEarnedQuestions.map((q) => q.answer), ['新答']);
  assert.deepEqual(o.documentAnsweredQuestions, { q1: true });
  assert.equal(o.activeDocumentQuestionId, 'q1');
});

test('后三案首份文档挂断时不泄露，新到材料进入常驻案卷', () => {
  for (const slug of ['02-tony', '03-profile', '04-workplace']) {
    const b = read(slug), doc = b.documents[0];
    assert.equal(documentIsReceived({ caseOvernights: { [b.id]: { hangupDone: true, segment: 'night1' } } }, b, doc), false);
    assert.equal(documentIsReceived({ caseOvernights: { [b.id]: { segment: 'day' } } }, b, doc), true);
    if (b.documents[1]) {
      const later = b.documents[1], receipt = later.availableAt;
      const key = `${b.id}:testimony:${receipt.sceneId}`;
      assert.equal(documentIsReceived({}, b, later), false);
      assert.equal(documentIsReceived({ testimonyWallProgress: { [key]: { act: receipt.act, preludeSeen: true } } }, b, later), true);
    }
  }
});

test('材料只供查阅；每段必要动作完成后不强制凑闲聊次数', () => {
  const p = read('03-profile'), doc = p.documents[0];
  assert.deepEqual(doc.crossQuestions ?? [], []);
  assert.deepEqual(earnedDocumentQuestionsFor(doc, ['p04', 'p06', 'p07']), []);
  for (const slug of ['02-tony', '03-profile', '04-workplace']) {
    const b = read(slug);
    for (const stage of b.statementStages ?? []) assert.equal(statementStageProgress({ brief: b, stage, actionDone: (key) => stage.sceneIndexes.some((i) => key === `version:${i}`) }).complete, true);
  }
});

test('缺少手写普通问答时不自动补套话；第一案材料只留原件信息', () => {
  assert.deepEqual(sceneDialogueOptions({}, [{ question: '关键问', answer: '答' }]), []);
  const b = read('01-credit');
  assert.doesNotMatch(b.evidenceCards.find((c) => c.id === 'daily-credit-anniversary').detail, /单向投喂|体面不是/);
});

test('旧版材料问题文本改动后仍沿原定义迁移，后续刷新不再依赖句子哈希', () => {
  const old = { ...brief([]), overnightStructure: { flowMode: 'linear', dayScenes: [] }, documents: [{ id: 'doc', rows: [{ rowId: 'r1' }], rowQuestions: { r1: [{ question: '旧问', answer: '旧答' }] } }] };
  const current = structuredClone(old);
  current.documents[0].rowQuestions.r1[0] = { id: 'doc:row:r1:0', question: '新问', answer: '新答' };
  const [q] = earnedDocumentQuestionsFor(old.documents[0], ['r1']);
  const input = { caseBriefs: [old], caseOvernights: { save: { documentMarks: { doc: ['r1'] }, documentEarnedQuestions: [q], documentAnsweredQuestions: { [q.id]: true }, activeDocumentQuestionId: q.id } } };
  const result = refreshSavedCaseContent(input, { generateCases: () => [current] });
  assert.equal(result.caseOvernights.save.activeDocumentQuestionId, 'doc:row:r1:0');
  assert.equal(result.caseOvernights.save.documentAnsweredQuestions['doc:row:r1:0'], true);
});

test('商务函旧选择刷新当前回应，历史推荐损失仍保留', () => {
  const current = read('02-tony');
  const beat = current.overnightStructure.liveCounterBeats.find((b) => b.id === 'tony-business-letter');
  const choice = beat.choices[0], key = `${current.id}:${beat.id}`;
  const result = refreshSavedExchangeCopy({ liveCounterPicks: { [key]: { choiceId: choice.id, label: '旧问表', recapAftertaste: '旧回答', endingImpact: 'platform-data-loss' } } }, [current]);
  assert.equal(result.liveCounterPicks[key].label, choice.label);
  assert.equal(result.liveCounterPicks[key].recapAftertaste, choice.recapAftertaste);
  assert.equal(result.liveCounterPicks[key].endingImpact, 'platform-data-loss');
});

test('整场与材料题移动后，活动入口及完成标记跟随身份', () => {
  const old = brief([option('kept', '旧问')]);
  old.evidenceChecks = [{ id: 'check-a', options: [{ id: 'ev-a', label: '原件' }] }];
  const input = state(old, { optionId: 'kept', optionIndex: 0, question: '旧问' });
  input.caseActionLog.save['evidenceCheck:0:0'] = true;
  input.caseActionLog.save['evidenceCheck:0'] = true;
  input.evidenceCheckPicks = { 'save:evidence:0': { optionId: 'ev-a', optionIndex: 0, label: '原件' } };
  const current = structuredClone(old);
  current.sceneVersions.unshift({ id: 'new-scene', questionOptions: [] });
  current.evidenceChecks.unshift({ id: 'new-check', options: [] });
  current.evidenceChecks[1].options.unshift({ id: 'new-ev', label: '新增' });
  const result = refreshSavedExchangeCopy(input, [current], [old]);
  assert.equal(result.sceneQuestionFocus.sceneIndex, 1);
  assert.equal(result.dialogueProgress['save:sceneReview'], 1);
  assert.equal(result.caseActionLog.save['version:1'], true);
  assert.equal(result.caseActionLog.save['evidenceCheck:1:1'], true);
  assert.equal(result.caseActionLog.save['evidenceCheck:0:0'], undefined);
  assert.equal(result.evidenceCheckPicks['save:evidence:1'].optionId, 'ev-a');
});

test('每句回放都有询问和不询问，按钮不泄露实际问法', async () => {
  const { statementReplayPageChoicesHtml } = await import('../../src/ui/statementReviewView.js');
  const html = statementReplayPageChoicesHtml({ scene: { id: 's', version: '普通的一句话。' }, line: { id: 's:0', text: '普通的一句话。' } });
  assert.match(html, /data-scene-review-line/);
  assert.match(html, /询问这句/);
  assert.match(html, /不询问/);
  assert.doesNotMatch(html, /有什么关系|关键选择/);
  assert.match(html, /data-scene-replay-next/);
});

test('同一句上的普通核实不会被关键按钮隐藏到段落结束以后', async () => {
  const { statementReplayPageChoicesHtml } = await import('../../src/ui/statementReviewView.js');
  const s = { id: 's', version: '同一张图又发来了。', questionOptions: [{ question: '图有新增吗？', sourceAnchor: '同一张图', correct: true }], casualQuestions: [{ question: '给过到账日期吗？', sourceAnchor: '同一张图', answer: '没有' }] };
  const html = statementReplayPageChoicesHtml({ scene: s, line: { id: 's:0', text: s.version } });
  assert.match(html, /data-scene-dialogue/);
  const after = statementReplayPageChoicesHtml({ scene: s, line: { id: "s:0", text: s.version }, resolvedDialogueOptionIndexes: [0] });
  assert.match(after, /data-scene-question/);
  assert.doesNotMatch(html + after, /key-choice-label/);
});

test('伪造正确标记但排序仍错的旧存档不能进入第二夜', async () => {
  const { canEnterOvernightCallback, timelineSortComplete } = await import('../../src/runtime/nightOvernightModel.js');
  const scene = JSON.parse(readFileSync(new URL('./fixtures/legacy-credit-interactions.json', import.meta.url))).dayScene;
  const packet = read('01-credit');
  packet.overnightStructure.dayScenes = [scene];
  const overnight = {
    dayScenesDone: packet.overnightStructure.dayScenes.map(item => item.id),
    timelineSorts: { [scene.id]: { order: scene.body.timelineSort.cards, submitted: true, correct: true } }
  };
  assert.equal(timelineSortComplete(scene, overnight), false);
  assert.equal(canEnterOvernightCallback(packet, overnight), false);
  overnight.timelineSorts[scene.id].order = scene.body.timelineSort.correctOrder;
  assert.equal(timelineSortComplete(scene, overnight), true);
});

import { isPrivateConsultation } from '../../src/runtime/consultationModel.js';
import { liveControlDeckHtml } from '../../src/ui/liveFrameView.js';
import { storyInterludeStageHtml } from '../../src/ui/storyInterludeView.js';

test('私下咨询只在第二夜启用，控台不显示直播及观众数', () => {
  const work = read('04-workplace');
  assert.equal(isPrivateConsultation(null), false);
  assert.equal(isPrivateConsultation(work, {caseOvernights: {[work.id]: {segment:'day'}}}), false);
  const active = isPrivateConsultation(work, {caseOvernights: {[work.id]: {segment:'night2'}}});
  assert.equal(active, true);
  assert.equal(isPrivateConsultation(read('02-tony'), {caseOvernights: {[work.id]: {segment:'night2'}}}), false);
  const html = liveControlDeckHtml({privateConsultation: active, simpleInquiry: true});
  assert.ok(html.includes('PRIVATE CALL'));
  assert.ok(!/ON AIR|deck-live-metrics|听众耐心/.test(html));
  assert.ok(liveControlDeckHtml().includes('ON AIR'));
  const recap = storyInterludeStageHtml({afterCaseId:'03-profile', broadcasting:true});
  assert.ok(recap.includes('ON AIR'));
  assert.ok(!/OFF AIR|interlude-zhao|interlude-remote-chip/.test(recap));
});

test('撤销职场广告选项只清理该旧代价，不重置进度或其他案件后果', () => {
  const work = read('04-workplace');
  const beat = work.overnightStructure.liveCounterBeats.find(b => b.supersedesChoiceIds);
  for (const choiceId of beat.supersedesChoiceIds) {
    const key = `${work.id}:${beat.id}`;
    const input = {liveCounterPicks:{[key]:{choiceId, endingImpact:'platform-data-loss'},other:{choiceId:'keep-asking-table',endingImpact:'platform-data-loss'}},caseActionLog:{[work.id]:{[`liveCounterBeat:${beat.id}`]:true}},scene:'liveCounterBeat',activeLiveCounterBeatId:beat.id};
    const result = refreshSavedExchangeCopy(input,[work]);
    assert.equal(result.liveCounterPicks[key],undefined);
    assert.deepEqual(result.liveCounterPicks.other,input.liveCounterPicks.other);
    assert.deepEqual(result.caseActionLog,input.caseActionLog);
    assert.equal(result.activeLiveCounterBeatId,beat.id);
  }
});
