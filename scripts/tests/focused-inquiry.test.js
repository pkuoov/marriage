import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { caseContentIdentity } from '../../src/runtime/savedContentIdentity.js';
import { refreshSavedExchangeCopy } from '../../src/runtime/savedContentRefresh.js';
import { testimonyWallKey } from '../../src/runtime/decisivePresentModel.js';
import { dailyAccusationReadiness } from '../../src/runtime/sceneAdvance.js';
import { migrateState } from '../../src/state.js';
const packet = JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/01-credit.json', import.meta.url)));
const brief = { ...packet, id: 'credit' };
const index = brief.sceneVersions.findIndex(scene => scene.testimonyWall);
const scene = brief.sceneVersions[index];
const key = testimonyWallKey(brief, scene, index);

test('重写后的证词不能沿用旧命中，当前案之外的进度和全局预算保留', () => {
  const old = { id: 'credit', contentIdentity: caseContentIdentity(brief) };
  delete old.contentIdentity.sceneVersions[index].testimonyRevision;
  const input = { chapter: 1, scene: 'decisivePresentHit', caseBrief: brief,
    testimonyWallProgress: { [key]: { act: 2, completed: true }, other: { act: 2 } },
    decisivePresentProgress: { [key]: { hit: true }, [`${key}:act2`]: { hit: true }, other: { attempts: 1 } },
    caseActionLog: { credit: { [`version:${index}`]: true, 'version:0': true } },
    caseBudgets: { credit: { remaining: 4 } } };
  const migrated = refreshSavedExchangeCopy(input, [brief], [old]);
  assert.equal(migrated.scene, 'testimonyWall');
  assert.equal(migrated.testimonyWallProgress[key], undefined);
  assert.deepEqual(migrated.decisivePresentProgress, { other: { attempts: 1 } });
  assert.equal(migrated.caseActionLog.credit[`version:${index}`], undefined);
  assert.equal(migrated.caseActionLog.credit['version:0'], true);
  assert.deepEqual(migrated.caseBudgets, input.caseBudgets);
  assert.equal(input.testimonyWallProgress[key].act, 2);
  const stable = refreshSavedExchangeCopy(input, [brief], [{ id: 'credit', contentIdentity: caseContentIdentity(brief) }]);
  assert.equal(stable.scene, 'decisivePresentHit');
  assert.equal(stable.testimonyWallProgress[key].act, 2);
  const completed = refreshSavedExchangeCopy({ ...input, scene: 'storyInterlude' }, [brief], [old]);
  assert.equal(completed.scene, 'storyInterlude');
  assert.equal(completed.testimonyWallProgress[key].act, 2);
});

test('未问清材料不能收麦，完成本案各段与两份材料即可收麦', () => {
  const actions = new Set([...brief.nightStructure.segment1SceneIndexes, ...brief.nightStructure.segment2SceneIndexes].map(i => `version:${i}`));
  assert.equal(dailyAccusationReadiness(brief, action => actions.has(action)).ready, false);
  actions.add('evidenceCheck:0');
  assert.equal(dailyAccusationReadiness(brief, action => actions.has(action)).ready, false);
  actions.add('evidenceCheck:1');
  assert.equal(dailyAccusationReadiness(brief, action => actions.has(action)).ready, true);
});

import { initialQuickDetectiveState, normalizeQuickDetectiveState, applyQuickIssueSelection, advanceQuickMissReaction, advanceQuickConfrontation, quickRoundPatienceForState, quickFlowVersion } from '../../src/runtime/quickDetectiveModel.js';
const quick = JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/quick-cases/02-one-missed-message.json', import.meta.url)));

test('补问先读问答，保存恢复后留在本段且不扣旧预算', () => {
  const round = quick.disclosureRounds[0];
  let state = { ...initialQuickDetectiveState(quick), scene: 'issueSelection', resolvedConfrontationIds: ['care-or-display'], roundPatience: { [round.id]: { max: round.patience, remaining: 1 } } };
  state = applyQuickIssueSelection(quick, state, 'founder-busy');
  assert.equal(quickRoundPatienceForState(quick, state).remaining, 1);
  state = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), quick);
  state = advanceQuickMissReaction(quick, state);
  assert.equal(state.scene, 'missReaction');
  assert.equal(quickRoundPatienceForState(quick, state).remaining, 1);
  state = advanceQuickMissReaction(quick, state);
  assert.equal(state.scene, 'issueSelection');
  assert.equal(state.resolvedConfrontationIds.includes('message-or-drunkenness'), false);
  assert.equal(state.roundIndex, 0);
  assert.equal(quickRoundPatienceForState(quick, state).remaining, 1);
  assert.deepEqual(advanceQuickMissReaction(quick, state), state);
});

test('旧快案按稳定段落身份迁移，保留前段结果与耐心，不跳过新回答', () => {
  const old = structuredClone(quick); old.contentRevision = 'old';
  let saved = { ...initialQuickDetectiveState(old), scene: 'confrontation', roundIndex: 3, activeConfrontationId: 'nightlife-pattern', confrontationLineIndex: 3, resolvedConfrontationIds: ['care-or-display', 'message-or-drunkenness', 'third-person-at-table', 'how-he-knew', 'apology-and-post'], roundPatience: { 'social-feed': { max: 4, remaining: 2 } } };
  saved.flowVersion = quickFlowVersion(old).replace('quick-v6|old|', 'quick-v5|');
  const restored = normalizeQuickDetectiveState(saved, quick);
  assert.equal(restored.roundIndex, quick.disclosureRounds.findIndex(round => round.id === 'social-feed'));
  assert.equal(restored.scene, 'transcript');
  assert.equal(restored.confrontationLineIndex, 0);
  assert.deepEqual(restored.resolvedConfrontationIds, ['message-or-drunkenness', 'third-person-at-table', 'how-he-knew']);
  assert.equal(quickRoundPatienceForState(quick, restored).remaining, 2);
});

test('拆开身份与解释后，旧合并段存档回到身份问询，保留前段结果与已结案存档', () => {
  const old = structuredClone(quick);
  old.contentRevision = 'before-split';
  const [explanation] = old.disclosureRounds.splice(2, 1);
  for (const field of ['turnIds', 'issueOptionIds', 'requiredConfrontationIds']) {
    old.disclosureRounds[1][field].push(...explanation[field]);
  }
  old.disclosureRounds[1].previousRoundIds = ['explanation-to-him'];
  const saved = { ...initialQuickDetectiveState(old), scene: 'issueSelection', roundIndex: 1,
    resolvedConfrontationIds: ['care-or-display', 'message-or-drunkenness', 'third-person-at-table'] };
  const restored = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(saved)), quick);
  assert.equal(restored.roundIndex, 1);
  assert.equal(restored.scene, 'transcript');
  assert(restored.resolvedConfrontationIds.includes('message-or-drunkenness'));
  assert(!restored.resolvedConfrontationIds.includes('third-person-at-table'));
  const completed = normalizeQuickDetectiveState({ ...saved, scene: 'verdict', roundIndex: 2 }, quick);
  assert.equal(completed.scene, 'verdict');
  assert.equal(quick.disclosureRounds[completed.roundIndex].id, 'social-feed');
});

test('快案二先问清第三人，再问如何解释；中途保存不倒序、不重播身份', () => {
  const identityIndex = quick.disclosureRounds.findIndex(round => round.id === 'changed-version');
  let state = { ...initialQuickDetectiveState(quick), scene: 'issueSelection', roundIndex: identityIndex,
    resolvedConfrontationIds: ['message-or-drunkenness'] };
  assert.deepEqual(quickAvailableInquiryOptions(quick, state).map(option => option.id), ['third-person']);
  assert.deepEqual(applyQuickIssueSelection(quick, state, 'how-he-knew'), state);
  state = applyQuickIssueSelection(quick, state, 'third-person');
  state = advanceQuickConfrontation(quick, state);
  const midway = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), quick);
  assert.equal(midway.activeConfrontationId, 'third-person-at-table');
  assert.equal(midway.confrontationLineIndex, state.confrontationLineIndex);
  state = midway;
  for (let step = 0; step < 30 && state.scene === 'confrontation'; step++) {
    state = advanceQuickConfrontation(quick, state);
  }
  state = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), quick);
  assert.equal(quick.disclosureRounds[state.roundIndex].id, 'explanation-to-him');
  assert(state.resolvedConfrontationIds.includes('third-person-at-table'));
  assert.deepEqual(quickAvailableInquiryOptions(quick, state).map(option => option.id), ['how-he-knew']);
  assert.deepEqual(quick.disclosureRounds[state.roundIndex].turnIds, ['how-he-knew-version']);
});

test('补问记录保存后保留，非法旧字段不影响继续问询', () => {
  const input = { evidenceInquiryAsked: { current: ['refund-date', 'refund-date', 3], old: null } };
  assert.deepEqual(migrateState(JSON.parse(JSON.stringify(input))).evidenceInquiryAsked, { current: ['refund-date'] });
  assert.deepEqual(migrateState({ evidenceInquiryAsked: [] }).evidenceInquiryAsked, {});
});

test('三个改稿证词墙均重置当前旧命中；不改变其他案进度', () => {
  for (const slug of ['02-tony','03-profile','04-workplace']) {
    const b = { ...JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/cases/${slug}.json`, import.meta.url))), id: slug };
    const i = b.sceneVersions.findIndex(s => s.testimonyWall);
    const k = testimonyWallKey(b,b.sceneVersions[i],i);
    const old = {id:slug, contentIdentity:caseContentIdentity(b)};
    delete old.contentIdentity.sceneVersions[i].testimonyRevision;
    const result = refreshSavedExchangeCopy({chapter:1,caseBrief:b,scene:'decisivePresentHit',testimonyWallProgress:{[k]:{act:2,completed:true}},caseActionLog:{[slug]:{[`version:${i}`]:true}},caseBudgets:{other:{remaining:4}}},[b],[old]);
    assert.equal(result.scene,'testimonyWall');
    assert.equal(result.testimonyWallProgress[k],undefined);
    assert.equal(result.caseBudgets.other.remaining,4);
  }
});

test('已退役的额外深问存档能进入短收麦，不卡在空问题', () => {
  const b = { ...JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/02-tony.json', import.meta.url))), id: 'tony' };
  const actions = Object.fromEntries([...b.nightStructure.segment1SceneIndexes,...b.nightStructure.segment2SceneIndexes].map(i => [`version:${i}`,true]));
  const restored = refreshSavedExchangeCopy({ chapter:1,scene:'deepFollowup',caseBrief:b,caseActionLog:{tony:actions}},[b]);
  assert.equal(restored.scene,'solved');
});

import { createTestimonyWallScreens } from '../../src/ui/screens/testimonyWallScreens.js';
import { liveControlDeckHtml } from '../../src/ui/liveFrameView.js';
import { quickAvailableInquiryOptions } from '../../src/runtime/quickDetectiveModel.js';

test('七个材料问询直接选择问句；反复错问、保存恢复不扣费、不跳段，问清后播放回答', () => {
  for (const slug of ['01-credit','02-tony','03-profile','04-workplace']) {
    const b = { ...JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/cases/${slug}.json`, import.meta.url))), id: slug };
    const i = b.sceneVersions.findIndex(s => s.testimonyWall), scene = b.sceneVersions[i];
    for (let a=0;a<scene.testimonyWall.acts.length;a++) {
      const act = scene.testimonyWall.acts[a], wk = testimonyWallKey(b,scene,i);
      let state = {scene:'testimonyWall',testimonyWallProgress:{[wk]:{act:a+1,preludeSeen:true}},caseBudgets:{[slug]:{remaining:0}},decisivePresentProgress:{[testimonyWallKey(b,scene,i,a+1)]:{attempts:2}}};
      const binds = new Map(); let shown, advanced = false;
      const noop = () => {};
      const screens = createTestimonyWallScreens({
        getState:()=>state,currentIndex:()=>i,sceneWithShownCard:(_b,s)=>s,sceneWithCallbackRevision:(_b,s)=>s,
        frame:value=>{shown=value;binds.clear();},bind:(selector,callback)=>binds.set(selector,callback),bindSceneButtons:noop,
        saveState:noop,render:noop,liveChapterTitle:()=>'',callDialogueHtml:lines=>lines.map(l=>l.text).join('\n'),flowGroupHtml:value=>value,
        caseKey:b=>b.id,answerKey:()=>slug+':answer',markAction:noop,recordContradiction:noop,recordRouteChoice:noop,
        continueAfterFocusedEvidence:()=>{advanced=true;},playAudioCueOnce:noop
      });
      const before = JSON.stringify([state.caseBudgets,state.decisivePresentProgress]);
      for(let attempt=0;attempt<3;attempt++) {
        screens.renderTestimonyWall(b);
        assert.ok(!shown.text.includes('<select'));
        if (attempt) {
          assert.ok(shown.text.includes("data-inquiry-context"));
          assert.ok(shown.text.includes(act.inquiry.openingLines.filter(line => line.role === "caller").at(-1).text));
        }
        assert.ok(!shown.choices.includes('data-testimony-press'));
        const miss=act.inquiry.options.find(o=>!o.correct);
        binds.get('[data-evidence-inquiry]')({currentTarget:{dataset:{evidenceInquiry:miss.id}}});
        state=JSON.parse(JSON.stringify(state)); screens.renderTestimonyWall(b);
        assert.ok(shown.text.includes(miss.lines[0].text));
        assert.equal(JSON.stringify([state.caseBudgets,state.decisivePresentProgress]),before);
        binds.get('[data-inquiry-continue]')();
        assert.equal(state.scene,'testimonyWall');assert.equal(advanced,false);
      }
      screens.renderTestimonyWall(b);
      const correct=act.inquiry.options.find(o=>o.correct);
      binds.get('[data-evidence-inquiry]')({currentTarget:{dataset:{evidenceInquiry:correct.id}}});
      assert.equal(state.scene,'decisivePresentHit');
      screens.renderDecisivePresentHit(b);
      assert.ok(shown.text.startsWith(correct.question));
      correct.lines.forEach(line=>assert.ok(shown.text.includes(line.text)));
      if(a===scene.testimonyWall.acts.length-1) (scene.sceneCloser?.lines??[]).forEach(line=>assert.ok(shown.text.includes(line.text)));
      binds.get('[data-inquiry-continue]')();
      assert.equal(advanced,a===scene.testimonyWall.acts.length-1);
    }
  }
});

test('简化控场台不显示假进度、耐心或尚未收到空卡；已收材料仍可打开', () => {
  const empty=liveControlDeckHtml({simpleInquiry:true,segment:4,total:4});
  assert.ok(!/听众耐心|这一段问完|尚未收到/.test(empty));
  const received=liveControlDeckHtml({simpleInquiry:true,material:'受理页',materialCount:2});
  assert.ok(received.includes('data-material-open'));
  assert.ok(received.includes('受理页'));
});

test('快案可选问法排除已回答及已解释的错问，单一剩余问题可直接接话', () => {
  const state={...initialQuickDetectiveState(quick),scene:'issueSelection',roundIndex:quick.disclosureRounds.findIndex(round=>round.id==='explanation-to-him'),resolvedConfrontationIds:['message-or-drunkenness','third-person-at-table'],attemptedIssueIds:['founder-busy']};
  const options=quickAvailableInquiryOptions(quick,state);
  assert.ok(options.every(option=>option.id!=='founder-busy'));
  assert.equal(options.length,1);
  assert.equal(options[0].id,'how-he-knew');
  const next=applyQuickIssueSelection(quick,state,options[0].id);
  assert.equal(next.scene,'confrontation');
  assert.equal(next.confrontationLineIndex,0);
});

test('旧材料选择页和断线页恢复到当前问询，保留其他段与历史预算', () => {
  for(const savedScene of ['testimonyMaterials','decisivePresentMaterial','decisivePresentTarget','patienceLost']) {
    const saved={chapter:1,caseBrief:brief,scene:savedScene,
      patienceLostContext:{caseId:brief.id,area:'sceneReview',index,retryScene:'testimonyWall',spent:true},
      caseBudgets:{credit:{remaining:0,used:4}},caseActionLog:{credit:{'version:0':true}},
      dialogueProgress:{'credit:sceneReview':index},testimonyWallProgress:{[key]:{act:2}},
      decisivePresentProgress:{[`${key}:act2`]:{attempts:2}}};
    const result=refreshSavedExchangeCopy(saved,[brief]);
    assert.equal(result.scene,'testimonyWall');
    assert.equal(result.testimonyWallProgress[key].act,2);
    assert.equal(result.caseActionLog.credit['version:0'],true);
    assert.deepEqual(result.caseBudgets,saved.caseBudgets);
  }
});


test('旧快案挂断存档回到本段问询，保留已完成交流和历史预算', () => {
  const round = quick.disclosureRounds[0];
  const saved = { ...initialQuickDetectiveState(quick), scene: 'patienceLost',
    resolvedConfrontationIds: ['care-or-display'],
    roundPatience: { [round.id]: { max: round.patience, remaining: 0 } } };
  const restored = normalizeQuickDetectiveState(saved, quick);
  assert.equal(restored.scene, 'issueSelection');
  assert.equal(restored.roundIndex, 0);
  assert.deepEqual(restored.resolvedConfrontationIds, saved.resolvedConfrontationIds);
  assert.equal(restored.roundPatience[round.id].remaining, 0);
  assert.equal(restored.roundPatience[round.id].max, round.patience);
});

import { materialInquiryLines, materialOperationOutcome } from '../../src/runtime/materialOperation.js';
test('材料问询每个选项都播放所选问句和真实回应，包括错问', () => {
  for (const slug of ['01-credit','02-tony','03-profile','04-workplace']) {
    const b=JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/cases/${slug}.json`,import.meta.url)));
    for (const check of b.evidenceChecks ?? []) for (const [index,option] of check.options.entries()) {
      const {pick}=materialOperationOutcome(check,0,index);
      const lines=materialInquiryLines(check,pick);
      assert.equal(lines[0].text,option.question);
      assert.ok(lines.slice(1).some(line=>line.text===option.reactionLine));
      assert.ok(!lines.some(line=>line.text===option.feedback && line.text!==option.question));
    }
  }
});
test('职场审批在首次挂断前问完，旧幕间入口只保留静态查看', () => {
  const b=JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/04-workplace.json',import.meta.url)));
  const index=b.sceneVersions.findIndex(scene=>scene.id==='work-approval-only');
  assert.ok(b.nightStructure.segment1SceneIndexes.includes(index));
  assert.equal(b.sceneVersions[index].afterScene.checkId,'work-approval-missing');
  assert.equal(b.nightStructure.interlude.actions.find(action=>action.id==='recheck-approval-page').readOnlyAfterCall,true);
});

import { createInterludeScreens } from '../../src/ui/screens/interludeScreens.js';
import { evidenceCheckScreenHtml } from '../../src/ui/evidenceView.js';
test('挂断后的旧存档只读审批原页，不重新出现现场问答', () => {
  const b=JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/04-workplace.json',import.meta.url)));
  const action=b.nightStructure.interlude.actions.find(action=>action.readOnlyAfterCall);
  const binds=new Map(); let shown, completed=false, marked=false;
  const screens=createInterludeScreens({getState:()=>({}),evidenceChecksFor:()=>b.evidenceChecks,
    selectedEvidencePickForState:()=>null,actionDone:()=>marked,dayFrame:value=>shown=value,
    flowGroupHtml:value=>value,bind:(key,value)=>binds.set(key,value),bindSceneButtons:()=>{},
    markAction:()=>marked=true,completeInterludeAction:()=>completed=true});
  screens.renderInterludeEvidence(b,action);
  assert.ok(!shown.text.includes('call-dialogue'));
  assert.ok(!shown.text.includes('data-evidence-check='));
  assert.ok(shown.choices.includes('data-read-legacy-material'));
  binds.get('[data-read-legacy-material]')();
  assert.equal(completed,true); assert.equal(marked,true);
  shown=null; screens.renderInterludeEvidence(b,action); assert.equal(shown,null);
});
test('材料页面实际渲染所选问题和错误回应，不渲染旧评题旁白', () => {
  const check=brief.evidenceChecks.find(check => check.options.some(option => !option.correct)), index=check.options.findIndex(option=>!option.correct);
  const option=check.options[index], {pick}=materialOperationOutcome(check,1,index);
  const html=evidenceCheckScreenHtml({check,pick});
  assert.ok(html.includes(option.question)); assert.ok(html.includes(option.reactionLine));
  assert.ok(!html.includes(option.feedback));
});

test('职场旧四千问询退役，只迁移仍保留的待付款问询进度', () => {
  const work = JSON.parse(readFileSync(new URL('../../content/packs/steam-demo-01/cases/04-workplace.json', import.meta.url)));
  work.id = 'work-save';
  const index = work.sceneVersions.findIndex(scene => scene.id === 'work-split-ownership');
  const scene = work.sceneVersions[index];
  const key = testimonyWallKey(work, scene, index);
  const old = { id: work.id, contentIdentity: caseContentIdentity(work) };
  old.contentIdentity.sceneVersions[index].testimonyRevision = Object.keys(scene.testimonyWall.previousActOrders)[0];
  for (const act of [1, 2]) {
    const input = { chapter: 1, scene: 'testimonyWall', caseBrief: work,
      dialogueProgress: { 'work-save:sceneReview': index },
      caseActionLog: { 'work-save': { 'version:0': true } },
      testimonyWallProgress: { [key]: { act, preludeSeen: true, completedActs: act === 2 ? [1] : [] } },
      decisivePresentProgress: { [key]: { resolved: true }, ...(act === 2 ? { [`${key}:act2`]: { resolved: true } } : {}) },
      evidenceInquiryPicks: { [key]: 'act2-ask', ...(act === 2 ? { [`${key}:act2`]: 'act1-ask' } : {}) },
      evidenceInquiryHeard: { [key]: true, ...(act === 2 ? { [`${key}:act2`]: true } : {}) },
      caseBudgets: { 'work-save': { remaining: 4 } }
    };
    const result = refreshSavedExchangeCopy(input, [work], [old]);
    assert.equal(result.testimonyWallProgress[key].act, 1);
    assert.equal(result.evidenceInquiryPicks[key], act === 2 ? 'act1-ask' : undefined);
    assert.equal(result.decisivePresentProgress[key]?.resolved, act === 2 ? true : undefined);
    assert.equal(result.evidenceInquiryPicks[`${key}:act2`], undefined);
    assert.equal(result.caseActionLog['work-save']['version:0'], true);
    assert.deepEqual(result.caseBudgets, input.caseBudgets);
    assert.equal(input.evidenceInquiryPicks[key], 'act2-ask');
    const closed = refreshSavedExchangeCopy({ ...input, scene: 'careChoice' }, [work], [old]);
    assert.equal(closed.scene, 'careChoice', '已收麦的存档不退回问询');
  }
});


import { quickTranscriptDialogueLines } from '../../src/ui/quickDetectiveView.js';

test('快案首读保留提问与回应，不把下一段材料混进来；保存可恢复当前说话页', () => {
  const packet = {
    id: 'conversation', format: 'call',
    turns: [
      { id: 'first', host: '今天来问什么？', caller: '想请你介绍对象。' },
      { id: 'later', host: '钱是谁给的？', caller: '后段才回答。' }
    ],
    disclosureRounds: [{ id: 'intro', turnIds: ['first'] }, { id: 'funds', turnIds: ['later'] }]
  };
  const state = { ...initialQuickDetectiveState(packet), scene: 'transcript' };
  assert.deepEqual(quickTranscriptDialogueLines(packet, state, '主播甲'), [
    { role: 'host', speaker: '主播甲', text: '今天来问什么？' },
    { role: 'caller', speaker: '来电人', text: '想请你介绍对象。' }
  ]);
  state.transcriptReading = { key: 'conversation:transcript:0', pageIndex: 1, complete: true, done: false };
  const restored = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), packet);
  assert.deepEqual(restored.transcriptReading, state.transcriptReading);
});
