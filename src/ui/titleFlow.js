import { generateCasesForMode } from "../caseModes.js";
import { dailyKeyFromUrl, modeFromUrl, storyKeyFromUrl } from "../runtime/urlMode.js";
import { isSceneReviewScene } from "../runtime/liveSceneKinds.js";
import { caseKey } from "../runtime/sceneAdvance.js";
import { resetAudioCueHistory, getAudioSettings } from "../sound.js";
import { baseState, clearStateSnapshot, normalizeRuntimeState } from "../state.js";
import { NPCS } from "../story.js";
import { isPrivateConsultation } from "../runtime/consultationModel.js";
import { normalizePlayerName, personalizeHostHtml, personalizeHostText, playerFamiliarName } from "../playerIdentity.js";
import { quickDetectiveCasesFor } from "../storyPacks.js";
import { HOST_PROFILE } from "../hostProfile.js";
import { titleScreenHtml } from "./titleView.js";
import { bindAudioControls, syncSceneAudio } from "./audioController.js";

export function createTitleFlow(bound) {
  const {
    app,
    PRODUCT_NAME,
    saveState,
    render,
    commit,
    bind,
    queueDefaultFocus,
    activeCaseBrief,
    clearQuestionRewindHistory
  } = bound;

  function startStoryPack() {
    clearQuestionRewindHistory();
    commitTitlePlayerName();
    const quickDetectiveCompletedIds = [...(bound.getState().quickDetectiveCompletedIds ?? [])];
    bound.confirmingNewGame = false;
    resetAudioCueHistory();
    bound.pixelTransitions = new Set();
    const mode = modeFromUrl();
    const caseBriefs = generateCasesForMode(mode, NPCS, bound.defaultAttrs, {
      dailyKey: dailyKeyFromUrl(),
      storyKey: storyKeyFromUrl(),
      runNumber: bound.meta.runs ?? 0
    });
    // Replace the whole state object; memoized screen handlers follow through ctx.getState().
    bound.setState(normalizeRuntimeState({
      ...structuredClone(baseState),
      playerName: bound.getState().playerName,
      quickDetectiveCompletedIds,
      screen: "chapter",
      scene: mode === "daily"
        ? "caseOpen"
        : bound.nightShellForStoryKey(caseBriefs[0]?.storyKey ?? storyKeyFromUrl())?.cafePrologue
          ? "cafePrologue"
          : bound.nightShellForStoryKey(caseBriefs[0]?.storyKey ?? storyKeyFromUrl())?.prologue
            ? "nightShellPrologue"
            : "caseOpen",
      profileDone: true,
      caseMode: mode,
      chapter: 1,
      attrs: bound.defaultAttrs,
      caseBriefs,
      caseBrief: caseBriefs[0]
    }));
    saveState();
    render();
  }

  function storyPreviewBriefs() {
    try {
      return generateCasesForMode(modeFromUrl(), NPCS, bound.defaultAttrs, {
        dailyKey: dailyKeyFromUrl(),
        storyKey: storyKeyFromUrl(),
        runNumber: bound.meta.runs ?? 0
      });
    } catch {
      return [];
    }
  }

  function continueStoryPack() {
    if (!canContinueJourney()) return startStoryPack();
    commitTitlePlayerName();
    bound.confirmingNewGame = false;
    commit((state) => {
      state.screen = "chapter";
    });
  }

  function returnToTitle() {
    clearQuestionRewindHistory();
    bound.confirmingNewGame = false;
    bound.pixelTransitions = new Set();
    commit((state) => {
      state.screen = "title";
    });
  }

  function resetToTitle() {
    clearQuestionRewindHistory();
    const playerName = normalizePlayerName(bound.getState().playerName);
    const quickDetectiveCompletedIds = [...(bound.getState().quickDetectiveCompletedIds ?? [])];
    clearStateSnapshot();
    bound.confirmingNewGame = false;
    bound.pixelTransitions = new Set();
    // Replace the whole state object; memoized screen handlers follow through ctx.getState().
    bound.setState(normalizeRuntimeState(structuredClone(baseState)));
    commit((state) => {
      state.playerName = playerName;
      state.quickDetectiveCompletedIds = quickDetectiveCompletedIds;
      state.screen = "title";
    });
  }

  function renderTitle() {
    const previews = storyPreviewBriefs();
    const preview = previews[0] ?? null;
    const storyPack = modeFromUrl() !== "daily";
    const title = storyPack ? "Steam 试玩版" : preview?.dailyShareTitle ?? preview?.label ?? "今日来电有点东西";
    const hook = storyPack ? "" : preview?.publicHook ?? "一通匿名来电已经接进来，第一句还没说完。";
    const object = storyPack ? "" : preview?.storyClueObject ?? "今日通话摘录";
    const canContinue = canContinueJourney();
    const playerName = normalizePlayerName(bound.titleNameDraft ?? bound.getState().playerName);
    app.innerHTML = personalizeHostHtml(titleScreenHtml({
      productName: PRODUCT_NAME,
      storyPack,
      title,
      hook,
      object,
      host: { ...HOST_PROFILE, name: playerName },
      audioSettings: getAudioSettings(),
      canContinue,
      resumeLabel: resumeStageLabel(),
      journeyComplete: storyPack && bound.getState().scene === "runComplete",
      confirmNewGame: (canContinue || Boolean(bound.getState().saveLoadError)) && bound.confirmingNewGame,
      saveLoadError: bound.getState().saveLoadError,
      quickModeAvailable: storyPack && quickDetectiveCasesFor(storyKeyFromUrl()).length > 0,
      playerName
    }), playerName);
    bind("[data-player-name]", (event) => {
      bound.titleNameDraft = event.currentTarget.value;
    }, "input");
    bind("[data-start-story]", startStoryPack);
    bind("[data-start-quick-detective]", () => bound.openQuickSelect());
    bind("[data-continue-story]", continueStoryPack);
    bind("[data-request-new-game]", () => {
      bound.confirmingNewGame = true;
      renderTitle();
    });
    bind("[data-confirm-new-game]", startStoryPack);
    bind("[data-cancel-new-game]", () => {
      bound.confirmingNewGame = false;
      renderTitle();
    });
    bindAudioControls({ root: app, onToggleSound: render });
    syncSceneAudio({ scene: "title" });
    queueDefaultFocus();
  }

  function canContinueJourney() {
    return Boolean(!bound.getState().saveLoadError && bound.getState().caseBriefs?.length && activeCaseBrief());
  }

  function resumeStageLabel() {
    const scene = bound.getState().scene ?? "caseOpen";
    if (isPrivateConsultation(activeCaseBrief(), bound.getState()) && !["storyInterlude", "caseBridge", "caseTitle", "runComplete"].includes(scene)) return "上次停在：单独咨询";
    if (scene === "nightShellPrologue") return "上次停在：开播前";
    if (["dayActOpening", "dayMap", "dayScene"].includes(scene)) return "上次停在：白天调查";
    if (["overnightCallback", "callbackOpener", "callbackOpenerBeat", "overnightNight2", "documentReconcile", "liveCounterBeat"].includes(scene)) return "上次停在：第二晚回拨";
    if (["hangupBeat", "overnightHangup", "overnightPostLive", "interludeDesk"].includes(scene) || scene.startsWith("interlude")) return "上次停在：收麦调查台";
    if (scene === "accusation") return "上次停在：最终追问";
    if (scene === "caseBridge") return "上次停在：幕间引页";
    if (scene === "caseTitle") return "上次停在：幕标题";
    if (["caseSolved", "careChoice", "caseClosure", "storyInterlude"].includes(scene)) return "上次停在：收麦回看";
    if (["cafePrologue", "cafePrologueAftermath"].includes(scene)) return "上次停在：咖啡厅序章";
    if (scene === "cafePrologueForensic") return "上次停在：鉴定回告";
    if (scene === "runComplete") return "试玩已完成 · 可重看片尾";
    if (scene === "nightShellEpilogue") return "上次停在：天亮前";
    return "上次停在：直播连线";
  }

  function renderDailyCase() {
    const brief = activeCaseBrief();
    const screens = bound.dailyScreens();
    if (bound.getState().scene === "sceneQuestionMenu") return screens.renderSceneQuestionMenu(brief);
    if (bound.getState().scene === "sceneQuestionAnswer") return screens.renderSceneQuestionAnswer(brief);
    if (bound.getState().scene === "sceneLineReplay") return screens.renderSceneLineReplay(brief);
    if (bound.getState().scene === "statementPatienceLost") return screens.renderStatementPatienceLost(brief);
    if (bound.getState().scene === "testimonyPrelude") return screens.renderTestimonyPrelude(brief);
    if (bound.getState().scene === "testimonyWall") return screens.renderTestimonyWall(brief);
    if (bound.getState().scene === "testimonyMaterials") return screens.renderTestimonyMaterials(brief, "soft");
    if (bound.getState().scene === "decisivePresentMaterial") return screens.renderTestimonyMaterials(brief, "decisive");
    if (bound.getState().scene === "decisivePresentTarget") return screens.renderDecisivePresentTarget(brief);
    if (bound.getState().scene === "decisivePresentHit") return screens.renderDecisivePresentHit(brief);
    if (isSceneReviewScene(bound.getState().scene)) return screens.renderSceneReview(brief);
    if (bound.getState().scene === "nightShellPrologue") return screens.renderNightShellPrologue(brief);
    if (bound.getState().scene === "nightShellEpilogue") return screens.renderNightShellEpilogue(brief);
    if (bound.getState().scene === "cafePrologue") return screens.renderCafePrologue(brief);
    if (bound.getState().scene === "cafePrologueAftermath") return screens.renderCafePrologueAftermath(brief);
    if (bound.getState().scene === "cafePrologueForensic") return screens.renderCafePrologueForensic(brief);
    if (bound.getState().scene === "stanceSnapshot") return screens.renderStanceSnapshot(brief);
    if (bound.getState().scene === "overnightHangup") return screens.renderOvernightHangup(brief);
    if (bound.getState().scene === "overnightPostLive") return screens.renderOvernightPostLive(brief);
    if (bound.getState().scene === "dayActOpening") return screens.renderDayActOpening(brief);
    if (bound.getState().scene === "dayMap") return screens.renderDayMap(brief);
    if (bound.getState().scene === "dayScene") return screens.renderDayScene(brief);
    if (bound.getState().scene === "overnightCallback") return screens.renderOvernightCallback(brief);
    if (bound.getState().scene === "documentReconcile") return screens.renderDocumentReconcile(brief);
    if (bound.getState().scene === "liveCounterBeat") return screens.renderLiveCounterBeat(brief);
    if (bound.getState().scene === "hangupBeat") return screens.renderHangupBeat(brief);
    if (bound.getState().scene === "interludeDesk") return screens.renderInterludeDesk(brief);
    if (bound.getState().scene === "callbackOpener") return screens.renderCallbackOpener(brief);
    if (bound.getState().scene === "callbackOpenerBeat") return screens.renderCallbackOpenerBeat(brief);
    if (bound.getState().scene === "afterSceneEvidence") return screens.renderAfterSceneEvidence(brief);
    if (bound.getState().scene === "evidenceCheck") return screens.renderEvidenceCheck(brief);
    if (bound.getState().scene === "delegation") return screens.renderDelegation(brief);
    if (bound.getState().scene === "investigationBackflow") return screens.renderInvestigationBackflow(brief);
    if (bound.getState().scene === "callerQuestion") return screens.renderCallerQuestion(brief);
    if (bound.getState().scene === "deepFollowup") return screens.renderDeepFollowup(brief);
    if (bound.getState().scene === "testimony" || bound.getState().scene === "evidence") {
      bound.getState().scene = "sceneReview";
      bound.getState().dialogueProgress = {
        ...(bound.getState().dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: bound.firstPendingSceneIndex(brief)
      };
      saveState();
      return screens.renderSceneReview(brief);
    }
    if (bound.getState().scene === "accusation") return screens.renderAccusation(brief);
    if (bound.getState().scene === "patienceLost") return screens.renderPatienceLost(brief);
    if (bound.getState().scene === "caseSolved") return screens.renderSolved(brief);
    if (bound.getState().scene === "careChoice") return screens.renderCareChoice(brief);
    if (bound.getState().scene === "caseClosure") return screens.renderCaseClosure(brief);
    if (bound.getState().scene === "storyInterlude") return screens.renderStoryInterlude(brief);
    if (bound.getState().scene === "caseBridge") return screens.renderCaseBridge(brief);
    if (bound.getState().scene === "caseTitle") return screens.renderCaseTitle(brief);
    if (bound.getState().scene === "runComplete") return screens.renderRunComplete(brief);
    return screens.renderCaseOpen(brief);
  }

  function commitTitlePlayerName() {
    const previousName = normalizePlayerName(bound.getState().playerName);
    const input = document.querySelector("[data-player-name]");
    const nextName = normalizePlayerName(input?.value ?? bound.titleNameDraft ?? previousName);
    bound.getState().playerName = nextName;
    if (previousName !== nextName) {
      const previousFamiliarName = playerFamiliarName(previousName);
      const nextFamiliarName = playerFamiliarName(nextName);
      bound.getState().dialogueBacklog = (bound.getState().dialogueBacklog ?? []).map((line) => ({
        ...line,
        speaker: personalizeHostText(line?.speaker ?? "", nextName).replaceAll(previousName, nextName),
        text: personalizeHostText(line?.text ?? "", nextName)
          .replaceAll(`${previousFamiliarName}哥`, `${nextFamiliarName}哥`)
          .replaceAll(previousName, nextName)
      }));
    }
    bound.titleNameDraft = null;
    return nextName;
  }

  return {
    startStoryPack,
    storyPreviewBriefs,
    continueStoryPack,
    returnToTitle,
    resetToTitle,
    renderTitle,
    canContinueJourney,
    resumeStageLabel,
    renderDailyCase,
    commitTitlePlayerName
  };
}
