import {
  advanceQuickConfrontation,
  advanceQuickMissReaction,
  advanceQuickTranscript,
  advanceQuickVerdict,
  applyQuickStatementLineSelection,
  endQuickCaseEarly,
  initialQuickDetectiveState,
  normalizeQuickDetectiveState,
  quickDetectiveIsComplete,
  retryQuickStatement
} from "../../runtime/quickDetectiveModel.js";
import { statementPressureFor } from "../../runtime/statementReviewModel.js";
import {
  quickDetectiveActiveLine,
  quickDetectiveCaseSelectHtml,
  quickDetectiveConfrontationHtml,
  quickDetectiveIntroHtml,
  quickDetectiveIssueSelectionHtml,
  quickDetectiveMissReactionHtml,
  quickDetectivePatience,
  quickDetectivePatienceLostHtml,
  quickDetectiveStageHtml,
  quickDetectiveTranscriptHtml,
  quickDetectiveVerdictHtml
} from "../quickDetectiveView.js";
import { createDialogueController, syncDialoguePortraitFocus } from "../../runtime/dialoguePresentation.js";

export function createQuickDetectiveScreens(ctx) {
  let quickAutoTimerId = 0;

  function openQuickDetectiveSelect() {
    clearQuickAutoAdvance();
    const state = ctx.getState();
    ctx.clearQuestionRewindHistory();
    ctx.commitTitlePlayerName();
    ctx.resetQuickTransientState();
    state.quickDetectiveReturn = null;
    state.screen = "quickDetectiveSelect";
    ctx.saveState();
    ctx.render();
  }

  function startQuickDetective(caseId = "", returnContext = undefined) {
    clearQuickAutoAdvance();
    const state = ctx.getState();
    const packet = ctx.quickDetectiveCaseFor(ctx.storyKeyFromUrl(), caseId);
    if (!packet) return;
    ctx.clearQuestionRewindHistory();
    ctx.resetQuickTransientState();
    state.screen = "quickDetective";
    state.quickDetective = initialQuickDetectiveState(packet);
    if (returnContext !== undefined) state.quickDetectiveReturn = returnContext;
    ctx.saveState();
    ctx.render();
  }

  function activeQuickDetectiveCase() {
    const state = ctx.getState();
    return ctx.quickDetectiveCaseFor(ctx.storyKeyFromUrl(), state.quickDetective?.caseId);
  }

  function renderQuickDetectiveSelect() {
    clearQuickAutoAdvance();
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
    clearQuickAutoAdvance();
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
      missReaction: () => quickDetectiveMissReactionHtml(packet, quickState, { hostName: state.playerName }),
      confrontation: () => quickDetectiveConfrontationHtml(packet, quickState, { hostName: state.playerName }),
      patienceLost: () => quickDetectivePatienceLostHtml(packet, quickState, { comment: ctx.quickPatienceLostComment?.() ?? null }),
      verdict: () => quickDetectiveVerdictHtml(packet, quickState, {
        hostName: state.playerName,
        returnLabel: state.quickDetectiveReturn ? "回到主线" : "返回案件选择"
      })
    }[quickState.scene] ?? (() => quickDetectiveIntroHtml(packet, { hostName: state.playerName }));
    const quickTransition = quickScreenTransition(packet, quickState);
    root.innerHTML = ctx.personalizeHostHtml(ctx.liveFrameHtml({
      productName: ctx.productName,
      modeLabel: "快速侦探",
      audioSettings: ctx.getAudioSettings(),
      backdropClass: "backdrop-live quick-detective-backdrop",
      label: packet.label,
      chapter: packet.title,
      text: body(),
      visualHud: quickDetectiveStageHtml(packet, quickState, { hostName: state.playerName }),
      screenClass: `quick-detective-screen quick-scene-${quickState.scene} dialogue-mode-${quickDialogueMode(quickState)}${quickTransition ? " key-reveal-answer" : ""}`,
      pixelTransition: quickTransition,
      rewindAvailable: ctx.canRewindQuestionNow(),
      controlDeckHtml: ctx.liveControlDeckHtml({
        onAirLabel: "直播快案",
        label: quickDeckLabel(quickState),
        segment: Math.max(1, Number(quickState.roundIndex ?? 0) + 1),
        total: Math.max(1, packet.disclosureRounds?.length ?? 1),
        pressure: statementPressureFor(quickDetectivePatience(packet, quickState), { mode: quickDialogueMode(quickState) }),
        mode: quickDialogueMode(quickState),
        progressLabel: quickState.scene === "intro" ? "等待接通" : "",
        progressNote: quickState.scene === "intro" ? "线路还没接进来。" : ""
      }),
      showRecordButton: false
    }), state.playerName);
    ctx.bind('[data-action="title"]', () => {
      clearQuickAutoAdvance();
      ctx.returnToTitle();
    });
    ctx.bind('[data-action="reset"]', () => startQuickDetective(packet.id));
    ctx.bind("[data-quick-begin]", () => updateQuickDetective({ ...quickState, scene: "transcript", turnIndex: 0, turnLineIndex: 0 }));
    ctx.bind("[data-quick-next-turn]", () => updateQuickDetective(advanceQuickTranscript(packet, quickState)));
    ctx.bind("[data-quick-review-line]", (event) => updateQuickDetective(applyQuickStatementLineSelection(packet, quickState, event.currentTarget.dataset.quickReviewLine)));
    ctx.bind("[data-quick-after-miss]", () => updateQuickDetective(advanceQuickMissReaction(packet, quickState)));
    ctx.bind("[data-quick-next-confrontation]", () => updateQuickDetective(advanceQuickConfrontation(packet, quickState)));
    ctx.bind("[data-quick-retry-statement]", () => updateQuickDetective(retryQuickStatement(packet, quickState)));
    ctx.bind("[data-quick-end-early]", () => updateQuickDetective(endQuickCaseEarly(packet, quickState)));
    ctx.bind("[data-quick-next-verdict]", () => updateQuickDetective(advanceQuickVerdict(packet, quickState)));
    ctx.bind("[data-quick-restart]", () => startQuickDetective(packet.id));
    ctx.bind("[data-quick-select]", finishQuickDetective);
    ctx.bindAudioControls({ root, onToggleSound: ctx.render });
    ctx.syncSceneAudio({ briefId: `quick-${packet.id}`, scene: "sceneReview", backdropClass: "backdrop-live" });
    ctx.resetViewportScroll();
    mountQuickDialogue(packet, quickState);
    ctx.queueDefaultFocus();
  }

  function finishQuickDetective() {
    const state = ctx.getState();
    const returnContext = state.quickDetectiveReturn;
    if (!returnContext) return openQuickDetectiveSelect();
    state.quickDetectiveReturn = null;
    state.screen = "chapter";
    state.scene = returnContext.scene ?? "caseBridge";
    ctx.saveState();
    ctx.render();
  }

  function updateQuickDetective(nextQuickState) {
    clearQuickAutoAdvance();
    const state = ctx.getState();
    state.quickDetective = nextQuickState;
    ctx.saveState();
    ctx.render();
  }

  function mountQuickDialogue(packet, quickState) {
    const root = ctx.getRoot();
    const box = root.querySelector("[data-quick-dialogue-box]");
    if (!box) return;
    const activeLine = quickDetectiveActiveLine(packet, quickState, ctx.getState().playerName);
    if (!activeLine?.text) return;
    const line = {
      ...activeLine,
      text: ctx.personalizeHostText(activeLine.text, ctx.getState().playerName)
    };
    const actionButton = root.querySelector({
      transcript: "[data-quick-next-turn]",
      confrontation: "[data-quick-next-confrontation]",
      missReaction: "[data-quick-after-miss]",
      verdict: "[data-quick-next-verdict]"
    }[quickState.scene] ?? "");
    if (actionButton) actionButton.hidden = true;
    const speed = ctx.getState().settings?.textSpeed ?? "normal";
    const autoPair = false;
    box.dataset.quickAutoPair = autoPair ? "true" : "false";
    let controller = null;
    controller = createDialogueController({
      box,
      pages: [{ lines: [line] }],
      choices: null,
      speed,
      hostName: ctx.getState().playerName,
      onPageStart: (page) => syncDialoguePortraitFocus(root, page),
      onShown: () => {
        if (!autoPair) {
          if (actionButton) {
            actionButton.hidden = false;
            actionButton.focus?.({ preventScroll: true });
          }
          box.dataset.dialogueDone = "true";
          return;
        }
        const indicator = box.querySelector(".avg-continue");
        if (indicator) indicator.hidden = true;
        quickAutoTimerId = globalThis.setTimeout(() => {
          quickAutoTimerId = 0;
          if (box.isConnected === false) return;
          advanceQuickLine(packet, quickState);
        }, 450);
      }
    });
    box.addEventListener("click", () => {
      if (!controller.complete) {
        controller.advance();
        return;
      }
      if (!autoPair) {
        actionButton?.focus?.({ preventScroll: true });
        return;
      }
      clearQuickAutoAdvance();
      advanceQuickLine(packet, quickState);
    });
    controller.start();
  }

  function advanceQuickLine(packet, quickState) {
    const next = {
      transcript: () => advanceQuickTranscript(packet, quickState),
      confrontation: () => advanceQuickConfrontation(packet, quickState),
      missReaction: () => advanceQuickMissReaction(packet, quickState),
      verdict: () => advanceQuickVerdict(packet, quickState)
    }[quickState.scene]?.();
    if (next) updateQuickDetective(next);
  }

  function clearQuickAutoAdvance() {
    if (!quickAutoTimerId) return;
    globalThis.clearTimeout(quickAutoTimerId);
    quickAutoTimerId = 0;
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

  function quickScreenTransition(packet = {}, quickState = {}) {
    const reveal = quickRevealTransition(packet, quickState);
    if (reveal) return reveal;
    if (!["transcript", "issueSelection"].includes(quickState.scene)) return null;
    const round = packet.disclosureRounds?.[Number(quickState.roundIndex ?? 0)] ?? {};
    const phase = quickState.scene === "issueSelection" ? "review" : "listen";
    const key = `quick:${packet.id}:${round.id ?? quickState.roundIndex ?? 0}:${phase}`;
    if (!ctx.consumePixelTransition(key)) return null;
    return phase === "review"
      ? { kind: "phase", visualVariant: "review", eyebrow: "回到刚才那段", label: "逐句追问" }
      : { kind: "phase", visualVariant: "listen", eyebrow: "先听完这段", label: "来电人陈述" };
  }

  function quickDialogueMode(quickState = {}) {
    if (quickState.scene === "issueSelection" || quickState.scene === "patienceLost") return "replay";
    if (quickState.scene === "missReaction") return "interrupt";
    if (quickState.scene === "confrontation") return "interrupt";
    return "listen";
  }

  function quickDeckLabel(quickState = {}) {
    return {
      transcript: "听完这段",
      issueSelection: "拉回刚才那段",
      missReaction: "来电人把话收紧",
      confrontation: "打断这一句",
      patienceLost: "这段已经问散",
      verdict: "收住这通电话"
    }[quickState.scene] ?? "连线中";
  }

  return {
    openQuickDetectiveSelect,
    startQuickDetective,
    renderQuickDetectiveSelect,
    renderQuickDetective
  };
}
