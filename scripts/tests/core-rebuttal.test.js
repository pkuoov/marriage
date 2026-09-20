import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decisivePresentOutcome, pressTestimonyStatement, selectTestimonyEvidence, softPresentOnStatement, testimonyResponseForAct } from "../../src/runtime/decisivePresentModel.js";
import { decisivePresentHitHtml } from "../../src/ui/decisivePresentView.js";
import { initialQuickDetectiveState, quickCanEndEarly, endQuickCaseEarly, normalizeQuickDetectiveState, advanceQuickTranscript, advanceQuickConfrontation, quickConfrontationLinesForState, quickIssueOptionsForRound, applyQuickIssueSelection, quickFlowVersion, quickRoundPatienceForState } from "../../src/runtime/quickDetectiveModel.js";
import { quickDetectiveConfrontationHtml } from "../../src/ui/quickDetectiveView.js";
import { statementReplayOptionIndex, statementReplayPageChoicesHtml } from "../../src/ui/statementReviewView.js";
import { statementLinesFromText } from "../../src/runtime/statementReviewModel.js";
const read = (path) => JSON.parse(readFileSync(new URL(`../../content/packs/steam-demo-01/${path}.json`, import.meta.url), "utf8"));
const cases = ["01-credit", "04-workplace", "03-profile", "02-tony"].map((id) => read(`cases/${id}`));

test("所有明确接受的材料都可命中同一承重句，选错句仍扣一次，命中界面保留实际材料", () => {
  for (const packet of cases) for (const scene of packet.sceneVersions.filter((s) => s.testimonyWall)) {
    for (const [index, act] of scene.testimonyWall.acts.entries()) {
      const present = act.decisivePresent;
      for (const id of [present.evidenceId, ...(present.acceptedEvidenceIds ?? [])]) {
        const card = present.materialCards.find((item) => item.id === id);
        assert.ok(card, `${packet.caseId}/${id}`);
        const hit = decisivePresentOutcome(scene, {}, id, present.statementId, { act: index + 1 });
        assert.equal(hit.kind, "hit"); assert.equal(hit.progress.attempts, 0); assert.equal(hit.progress.selectedEvidenceId, id);
        const html = decisivePresentHitHtml({ scene, wallAct: act, selectedEvidenceId: hit.progress.selectedEvidenceId });
        assert.ok(html.includes(card.label));
        const wrong = act.statements.find((item) => item.id !== present.statementId);
        const miss = decisivePresentOutcome(scene, {}, id, wrong.id, { act: index + 1 });
        assert.equal(miss.kind, "miss"); assert.equal(miss.missKind, "statement"); assert.equal(miss.progress.attempts, 1);
        let wall = { act: index + 1 };
        for (const statement of act.statements.filter((item) => item.reveals?.includes(present.statementId))) wall = pressTestimonyStatement(scene, wall, statement.id);
        wall = selectTestimonyEvidence(wall, id);
        wall = softPresentOnStatement(scene, wall, present.statementId);
        assert.equal(testimonyResponseForAct(act, wall).text, act.softAnchorResponse);
      }
      assert.equal(decisivePresentOutcome(scene, {}, "unregistered", present.statementId, { act: index + 1 }).kind, "miss");
    }
  }
});

test("案一两张原话卡逐字来自本次出示前的必播对白", () => {
  const scene = cases[0].sceneVersions.find((item) => item.id === "credit-loyalty-test");
  for (const [index, act] of scene.testimonyWall.acts.entries()) {
    const card = act.decisivePresent.materialCards.find((item) => item.id === act.decisivePresent.evidenceId);
    const source = card.sourceBeat;
    assert.equal(source.sceneId, scene.id);
    const sourceActIndex = scene.testimonyWall.acts.findIndex((item) => item.id === source.actId);
    const lines = source.field === "beforeVersion" ? scene.beforeVersion.lines : scene.testimonyWall.acts[sourceActIndex].openerLines;
    assert.ok(source.field === "beforeVersion" || sourceActIndex <= index);
    assert.ok(lines[source.lineIndex].text.includes(card.excerpt));
  }
});

test("同一句原话上的连续追问按未完成 ID 推进，重绘后仍落在原句", () => {
  for (const id of ["credit-anniversary-agency", "credit-bank-flow"]) {
    const scene = cases[0].sceneVersions.find((item) => item.id === id);
    const completed = [];
    for (const optionId of scene.questionSequence) {
      const optionIndex = scene.questionOptions.findIndex((item) => item.id === optionId);
      const option = scene.questionOptions[optionIndex];
      const matches = statementLinesFromText(scene.version, { prefix: scene.id }).filter((line) => line.text.includes(option.sourceAnchor));
      assert.equal(matches.length, 1);
      assert.equal(statementReplayOptionIndex(scene, matches[0], optionId), optionIndex);
      const html = statementReplayPageChoicesHtml({ scene, sceneIndex: 3, line: matches[0], completedOptionIds: [...completed] });
      assert.ok(html.includes(`data-scene-question="3:${optionIndex}"`), `${id}/${optionId}`);
      completed.push(optionId);
    }
  }
});

test("自动接话与可选交流不扣耐心，逐句读档后完整走完两宗快案", () => {
  for (const id of ["01-no-conditions", "02-one-missed-message"]) {
    const packet = read(`quick-cases/${id}`);
    let state = { ...initialQuickDetectiveState(packet), scene: "transcript" };
    const heard = new Set();
    let steps = 0;
    while (state.scene !== "verdict" && steps++ < 160) {
      if (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
      else if (state.scene === "confrontation") {
        const item = packet.confrontations.find((item) => item.id === state.activeConfrontationId);
        heard.add(item.id);
        if (item.kind === "conversation") {
          const round = packet.disclosureRounds[state.roundIndex];
          assert.ok(quickDetectiveConfrontationHtml(packet, state).includes("连线继续"));
          if ((round.autoConfrontationIds ?? []).includes(item.id)) {
            assert.equal(state.activeIssueId, null);
            assert.ok(!quickIssueOptionsForRound(packet, state).some((option) => option.confrontationId === item.id));
          } else {
            assert.ok(state.activeIssueId);
            // Required fact-checking can be player-selected without becoming an accusation.
            if (id === "01-no-conditions") assert.ok(!round.requiredConfrontationIds.includes(item.id), "生育顾虑等普通交流可以选择，但不能设为通关要求");
          }
        }
        const expectedLine = quickConfrontationLinesForState(packet, state)[state.confrontationLineIndex];
        state = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), packet);
        assert.deepEqual(quickConfrontationLinesForState(packet, state)[state.confrontationLineIndex], expectedLine);
        const patience = quickRoundPatienceForState(packet, state);
        const round = state.roundIndex;
        state = advanceQuickConfrontation(packet, state);
        if (round === state.roundIndex) assert.deepEqual(quickRoundPatienceForState(packet, state), patience);
      } else {
        assert.equal(state.scene, "issueSelection");
        const option = quickIssueOptionsForRound(packet, state).find((option) => option.confrontationId && !state.resolvedConfrontationIds.includes(option.confrontationId));
        assert.ok(option); state = applyQuickIssueSelection(packet, state, option.id);
      }
    }
    assert.equal(state.scene, "verdict");
    const reachable = new Set();
    for (const round of packet.disclosureRounds ?? []) {
      for (const id of round.requiredConfrontationIds ?? []) reachable.add(id);
      for (const id of round.autoConfrontationIds ?? []) reachable.add(id);
    }
    for (const requiredId of reachable) assert.ok(heard.has(requiredId));
    assert.ok(Object.values(state.roundPatience).every((value) => value.remaining === value.max));
  }
});

test("锚点修正保留进度，结构重排按段落身份迁移", () => {
  const packet = read("quick-cases/02-one-missed-message");
  const old = structuredClone(packet); old.issueOptions.find((item) => item.id === "nightlife-pattern").sourceAnchor = "六次酒吧或者 KTV";
  const roundIndex = packet.disclosureRounds.findIndex(round => round.id === "social-feed");
  const state = { ...initialQuickDetectiveState(old), scene: "issueSelection", roundIndex, resolvedConfrontationIds: ["care-or-display", "message-or-drunkenness", "third-person-at-table", "how-he-knew"] };
  const restored = normalizeQuickDetectiveState(state, packet);
  assert.equal(restored.roundIndex, roundIndex); assert.deepEqual(restored.resolvedConfrontationIds, state.resolvedConfrontationIds);
  assert.equal(restored.activeConfrontationId, null);
  assert.equal(restored.scene, "issueSelection");
  assert.deepEqual(quickIssueOptionsForRound(packet, restored).map(item => item.id), ["nightlife-pattern", "apology-post"]);
  assert.equal(restored.flowVersion, quickFlowVersion(packet));
  old.disclosureRounds.reverse();
  assert.equal(normalizeQuickDetectiveState({ ...state, flowVersion: quickFlowVersion(old) }, packet).roundIndex, 0);
});


test("普通交流不计为已找到疑点，也不提前解锁结案", () => {
  const packet = read("quick-cases/01-no-conditions");
  let state = advanceQuickTranscript(packet, { ...initialQuickDetectiveState(packet), scene: "transcript" });
  while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  assert.equal(quickCanEndEarly(packet, state), false);
  assert.equal(endQuickCaseEarly(packet, state), state);
  state.resolvedConfrontationIds.push("two-fathers");
  assert.equal(quickCanEndEarly(packet, state), true);
});
