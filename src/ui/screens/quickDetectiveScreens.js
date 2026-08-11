import {
  advanceQuickConfrontation,
  advanceQuickTranscript,
  advanceQuickVerdict,
  applyQuickIssueSelection,
  initialQuickDetectiveState,
  normalizeQuickDetectiveState,
  quickDetectiveIsComplete
} from "../../runtime/quickDetectiveModel.js";
import {
  quickDetectiveCaseSelectHtml,
  quickDetectiveConfrontationHtml,
  quickDetectiveIntroHtml,
  quickDetectiveIssueSelectionHtml,
  quickDetectiveStageHtml,
  quickDetectiveTranscriptHtml,
  quickDetectiveVerdictHtml
} from "../quickDetectiveView.js";

export function createQuickDetectiveScreens(ctx) {
  function openQuickDetectiveSelect() {
    const state = ctx.getState();
    ctx.clearQuestionRewindHistory();
    ctx.commitTitlePlayerName();
    ctx.resetQuickTransientState();
    state.screen = "quickDetectiveSelect";
    ctx.saveState();
    ctx.render();
  }

  function startQuickDetective(caseId = "") {
    const state = ctx.getState();
    const packet = ctx.quickDetectiveCaseFor(ctx.storyKeyFromUrl(), caseId);
    if (!packet) return;
    ctx.clearQuestionRewindHistory();
    ctx.resetQuickTransientState();
    state.screen = "quickDetective";
    state.quickDetective = initialQuickDetectiveState(packet);
    ctx.saveState();
    ctx.render();
  }

  function activeQuickDetectiveCase() {
    const state = ctx.getState();
    return ctx.quickDetectiveCaseFor(ctx.storyKeyFromUrl(), state.quickDetective?.caseId);
  }

  function renderQuickDetectiveSelect() {
    const state = ctx.getState();
    const root = ctx.getRoot();
    const packets = ctx.quickDetectiveCasesFor(ctx.storyKeyFromUrl());
    if (!packets.length) {
      state.screen = "title";
      return ctx.renderTitle();
    }
    root.innerHTML = ctx.personalizeHostHtml(ctx.liveFrameHtml({
      productName: ctx.productName,
      modeLabel: "快速侦探",
      audioSettings: ctx.getAudioSettings(),
      backdropClass: "backdrop-live quick-case-select-backdrop",
      label: "快案档案",
      chapter: `${packets.length} 宗案件可选`,
      text: quickDetectiveCaseSelectHtml(packets, state.quickDetectiveCompletedIds),
      visualHud: "",
      screenClass: "quick-case-select-screen",
      controlDeckHtml: "",
      showRecordButton: false,
      showResetButton: false
    }), state.playerName);
    ctx.bind('[data-action="title"], [data-quick-select-title]', ctx.returnToTitle);
    ctx.bind("[data-quick-case-id]", (event) => startQuickDetective(event.currentTarget.dataset.quickCaseId));
    ctx.bindAudioControls({ root, onToggleSound: ctx.render });
    ctx.syncSceneAudio({ scene: "title" });
    ctx.resetViewportScroll();
    ctx.queueDefaultFocus();
  }

  function renderQuickDetective() {
    const state = ctx.getState();
    const root = ctx.getRoot();
    const packet = activeQuickDetectiveCase();
    if (!packet) {
      state.screen = "title";
      return ctx.renderTitle();
    }
    state.quickDetective = normalizeQuickDetectiveState(state.quickDetective, packet);
    const quickState = state.quickDetective;
    if (quickDetectiveIsComplete(packet, quickState) && !(state.quickDetectiveCompletedIds ?? []).includes(packet.id)) {
      state.quickDetectiveCompletedIds = [...(state.quickDetectiveCompletedIds ?? []), packet.id];
      ctx.saveState();
    }
    const body = {
      intro: () => quickDetectiveIntroHtml(packet, { hostName: state.playerName }),
      transcript: () => quickDetectiveTranscriptHtml(packet, quickState, { hostName: state.playerName }),
      issueSelection: () => quickDetectiveIssueSelectionHtml(packet, quickState),
      confrontation: () => quickDetectiveConfrontationHtml(packet, quickState, { hostName: state.playerName }),
      verdict: () => quickDetectiveVerdictHtml(packet, quickState, { hostName: state.playerName })
    }[quickState.scene] ?? (() => quickDetectiveIntroHtml(packet, { hostName: state.playerName }));
    const quickTransition = quickRevealTransition(packet, quickState);
    root.innerHTML = ctx.personalizeHostHtml(ctx.liveFrameHtml({
      productName: ctx.productName,
      modeLabel: "快速侦探",
      audioSettings: ctx.getAudioSettings(),
      backdropClass: "backdrop-live quick-detective-backdrop",
      label: packet.label,
      chapter: packet.title,
      text: body(),
      visualHud: quickDetectiveStageHtml(packet, quickState, { hostName: state.playerName }),
      screenClass: `quick-detective-screen quick-scene-${quickState.scene}${quickTransition ? " key-reveal-answer" : ""}`,
      pixelTransition: quickTransition,
      rewindAvailable: ctx.canRewindQuestionNow(),
      controlDeckHtml: "",
      showRecordButton: false
    }), state.playerName);
    ctx.bind('[data-action="title"]', ctx.returnToTitle);
    ctx.bind('[data-action="reset"]', () => startQuickDetective(packet.id));
    ctx.bind("[data-quick-begin]", () => updateQuickDetective({ ...quickState, scene: "transcript", turnIndex: 0, turnLineIndex: 0 }));
    ctx.bind("[data-quick-next-turn]", () => updateQuickDetective(advanceQuickTranscript(packet, quickState)));
    ctx.bind("[data-quick-issue]", (event) => updateQuickDetective(applyQuickIssueSelection(packet, quickState, event.currentTarget.dataset.quickIssue)));
    ctx.bind("[data-quick-next-confrontation]", () => updateQuickDetective(advanceQuickConfrontation(packet, quickState)));
    ctx.bind("[data-quick-next-verdict]", () => updateQuickDetective(advanceQuickVerdict(packet, quickState)));
    ctx.bind("[data-quick-restart]", () => startQuickDetective(packet.id));
    ctx.bind("[data-quick-select]", openQuickDetectiveSelect);
    ctx.bindAudioControls({ root, onToggleSound: ctx.render });
    ctx.syncSceneAudio({ briefId: `quick-${packet.id}`, scene: "sceneReview", backdropClass: "backdrop-live" });
    ctx.resetViewportScroll();
    ctx.queueDefaultFocus();
  }

  function updateQuickDetective(nextQuickState) {
    const state = ctx.getState();
    state.quickDetective = nextQuickState;
    ctx.saveState();
    ctx.render();
  }

  function quickRevealTransition(packet = {}, quickState = {}) {
    if (quickState.scene !== "confrontation") return null;
    const confrontation = (packet.confrontations ?? []).find((item) => item.id === quickState.activeConfrontationId);
    const transition = confrontation?.revealTransition;
    if (Number(quickState.confrontationLineIndex ?? 0) !== Number(transition?.lineIndex ?? 0)) return null;
    if (!transition?.id) return null;
    const key = `quick:${packet.id}:${transition.id}`;
    if (!ctx.consumePixelTransition(key)) return null;
    return { ...transition, kind: "reveal" };
  }

  return {
    openQuickDetectiveSelect,
    startQuickDetective,
    renderQuickDetectiveSelect,
    renderQuickDetective
  };
}
