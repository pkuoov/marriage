import { generateCasesForMode } from "./caseModes.js?v=0.20.87";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js?v=0.20.68";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.20.68";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.20.78";
import { platformRuntime } from "./platformRuntime.js?v=0.20.68";
import { NPCS } from "./story.js?v=0.20.68";
import { dailyAccusationChoices } from "./dailyChoices.js?v=0.20.68";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "./runtime/inputNavigation.js?v=0.20.68";
import { materialOperationOutcome } from "./runtime/materialOperation.js?v=0.20.87";
import { answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedEvidencePickForState, selectedEvidencePicksForState, selectedInvestigationPickForState, selectedInvestigationPicksForState, selectedScenePickForState, selectedScenePicksForState, truthBoundaryMissesForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "./runtime/caseStateSelectors.js?v=0.20.68";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, truthBoundaryAftertaste, truthBoundaryReview } from "./runtime/recapModel.js?v=0.20.68";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, questionPressureReaction, questionPressureSignal } from "./runtime/livePressure.js?v=0.20.68";
import { normalizeRouteChoice, routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js?v=0.20.68";
import { afterEvidenceScene as nextSceneAfterEvidence, answerKey, applyActionMark, caseKey, casePatienceLost, dailyAccusationReadiness as accusationReadinessForCase, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, initialCaseBudget, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, recordPatienceLostState, retryPatienceLostState, sceneReviewModel } from "./runtime/sceneAdvance.js?v=0.20.76";
import { storyInterludeNextLine, storyInterludeObjectLabel, storyInterludeRecapLine } from "./runtime/storyInterludeModel.js?v=0.20.68";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "./runtime/storyPackSummaryModel.js?v=0.20.68";
import { callDialogueHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "./ui/callFlowView.js?v=0.20.68";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js?v=0.20.68";
import { evidenceCheckScreenHtml, investigationBackflowScreenHtml } from "./ui/evidenceView.js?v=0.20.87";
import { audiencePatienceHudHtml, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "./ui/liveCallView.js?v=0.20.68";
import { liveControlDeckHtml, liveFrameHtml } from "./ui/liveFrameView.js?v=0.20.77";
import { finalQuoteComparisonHtml, solvedRecapFlowView, solvedRecapPagesHtml } from "./ui/recapView.js?v=0.20.68";
import { routeTrailHtml } from "./ui/routeTrailView.js?v=0.20.68";
import { focusedQuestionOptions, sceneDialogueOptions, sceneQuestionChoicesHtml } from "./ui/sceneQuestions.js?v=0.20.82";
import { activeSceneExchangeHtml, completedSceneExchangeHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml } from "./ui/sceneReviewView.js?v=0.20.68";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "./ui/storyInterludeView.js?v=0.20.68";
import { storyPackCompleteHtml, storyPackShareText } from "./ui/storyPackCompleteView.js?v=0.20.68";
import { titleScreenHtml } from "./ui/titleView.js?v=0.20.68";
import { CONTENT_ADVISORS } from "./generated/contentPackIndex.js?v=0.20.87";

const app = document.querySelector("#app");
const PRODUCT_NAME = "直播间大侦探";
const DEFAULT_ATTRS = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };

let state = normalizeDailyState(loadState() ?? structuredClone(baseState));
let meta = loadMeta();
let gamepadPollingStarted = false;
let gamepadPreviousButtons = {};
let lastGamepadMoveAt = 0;

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.dataset.action === "sound") return;
  playSfx(button.classList.contains("primary") || button.dataset.accuse ? "confirm" : "click");
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || keyEventInTextInput(event)) return;
  const intent = keyboardNavigationIntent(event.key);
  if (intent === "confirm") {
    const button = document.activeElement?.matches?.("button") ? document.activeElement : preferredDefaultButton();
    if (!button) return;
    event.preventDefault();
    activateButton(button);
    return;
  }
  if (intent === "next") {
    event.preventDefault();
    moveButtonFocus(1);
    return;
  }
  if (intent === "previous") {
    event.preventDefault();
    moveButtonFocus(-1);
    return;
  }
  if (intent === "review") {
    if (!toggleReviewPanel()) return;
    event.preventDefault();
    return;
  }
  if (intent === "back") {
    const backButton = preferredBackButton();
    if (!backButton) return;
    event.preventDefault();
    activateButton(backButton);
  }
});

globalThis.addEventListener?.("gamepadconnected", () => startGamepadPolling());
startGamepadPolling();

function normalizeDailyState(saved) {
  const mode = saved?.caseMode === "daily" ? "daily" : "episode";
  return {
    ...structuredClone(baseState),
    ...saved,
    screen: saved?.screen === "chapter" ? "chapter" : "title",
    caseMode: mode,
    chapter: Math.max(1, Number(saved?.chapter ?? 1)),
    attrs: { ...DEFAULT_ATTRS, ...(saved?.attrs ?? {}) },
    caseBriefs: Array.isArray(saved?.caseBriefs) ? saved.caseBriefs : [],
    caseBrief: saved?.caseBrief ?? saved?.caseBriefs?.[0] ?? null,
    scene: saved?.scene ?? "caseOpen",
    dialogueProgress: saved?.dialogueProgress ?? {},
    sceneAnswers: saved?.sceneAnswers ?? {},
    sceneQuestionPicks: saved?.sceneQuestionPicks ?? {},
    sceneDialoguePicks: saved?.sceneDialoguePicks ?? {},
    evidenceCheckPicks: saved?.evidenceCheckPicks ?? {},
    investigationPicks: saved?.investigationPicks ?? {},
    truthBoundaryPicks: saved?.truthBoundaryPicks ?? {},
    truthBoundaryMisses: saved?.truthBoundaryMisses ?? {},
    routeChoiceLog: saved?.routeChoiceLog ?? {},
    caseActionLog: saved?.caseActionLog ?? {},
    caseBudgets: saved?.caseBudgets ?? {},
    contradictionLog: saved?.contradictionLog ?? {},
    accusationHistory: Array.isArray(saved?.accusationHistory) ? saved.accusationHistory : [],
    solvedCaseIds: Array.isArray(saved?.solvedCaseIds) ? saved.solvedCaseIds : [],
    caseInterludes: saved?.caseInterludes ?? {},
    lastReaction: saved?.lastReaction ?? null,
    lastPressureSignal: saved?.lastPressureSignal ?? null,
    lastPressureAxis: saved?.lastPressureAxis ?? null,
    patienceLostContext: saved?.patienceLostContext ?? null,
    settings: { ...baseState.settings, ...(saved?.settings ?? {}) }
  };
}

function saveState() {
  saveStateSnapshot(state);
}

function activeCaseBrief() {
  return state.caseBriefs?.[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? state.caseBrief ?? null;
}

function isStoryPackMode() {
  return state.caseMode !== "daily";
}

function dailyKeyFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("dailyKey") || undefined;
  } catch {
    return undefined;
  }
}

function storyKeyFromUrl() {
  try {
    const params = new URLSearchParams(globalThis.location?.search ?? "");
    return params.get("storyKey") || params.get("packKey") || params.get("weeklyKey") || undefined;
  } catch {
    return undefined;
  }
}

function modeFromUrl() {
  try {
    const mode = new URLSearchParams(globalThis.location?.search ?? "").get("mode");
    return mode === "daily" ? "daily" : "episode";
  } catch {
    return "episode";
  }
}

function startStoryPack() {
  const mode = modeFromUrl();
  const caseBriefs = generateCasesForMode(mode, NPCS, DEFAULT_ATTRS, {
    dailyKey: dailyKeyFromUrl(),
    storyKey: storyKeyFromUrl(),
    runNumber: meta.runs ?? 0
  });
  state = normalizeDailyState({
    ...structuredClone(baseState),
    screen: "chapter",
    scene: "caseOpen",
    profileDone: true,
    caseMode: mode,
    chapter: 1,
    attrs: DEFAULT_ATTRS,
    caseBriefs,
    caseBrief: caseBriefs[0]
  });
  saveState();
  render();
}

function storyPreviewBriefs() {
  try {
    return generateCasesForMode(modeFromUrl(), NPCS, DEFAULT_ATTRS, {
      dailyKey: dailyKeyFromUrl(),
      storyKey: storyKeyFromUrl(),
      runNumber: meta.runs ?? 0
    });
  } catch {
    return [];
  }
}

function resetToTitle() {
  clearStateSnapshot();
  state = normalizeDailyState(structuredClone(baseState));
  state.screen = "title";
  saveState();
  render();
}

function render() {
  if (!app) return;
  if (state.screen === "title") return renderTitle();
  if (!activeCaseBrief()) return renderTitle();
  return renderDailyCase();
}

function renderTitle() {
  const previews = storyPreviewBriefs();
  const preview = previews[0] ?? null;
  const storyPack = modeFromUrl() !== "daily";
  const title = storyPack ? "Steam 试玩版" : preview?.dailyShareTitle ?? preview?.label ?? "今日来电有点东西";
  const hook = storyPack ? preview?.storyThemeIntro ?? preview?.weeklyThemeIntro ?? "热线已经接进来。资料在后台，她已经开口了。" : preview?.publicHook ?? "一通匿名来电已经接进来，第一句还没说完。";
  const object = storyPack ? "热线已接入" : preview?.storyClueObject ?? "今日通话摘录";
  app.innerHTML = titleScreenHtml({ productName: PRODUCT_NAME, storyPack, title, hook, object });
  bind("[data-start-story]", startStoryPack);
  queueDefaultFocus();
}

function renderDailyCase() {
  const brief = activeCaseBrief();
  if (state.scene === "sceneReview") return renderSceneReview(brief);
  if (state.scene === "evidenceCheck") return renderEvidenceCheck(brief);
  if (state.scene === "investigationBackflow") return renderInvestigationBackflow(brief);
  if (state.scene === "deepFollowup") return renderDeepFollowup(brief);
  if (state.scene === "testimony" || state.scene === "evidence") {
    state.scene = "sceneReview";
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
    };
    saveState();
    return renderSceneReview(brief);
  }
  if (state.scene === "accusation") return renderAccusation(brief);
  if (state.scene === "patienceLost") return renderPatienceLost(brief);
  if (state.scene === "caseSolved") return renderSolved(brief);
  if (state.scene === "storyInterlude") return renderStoryInterlude(brief);
  if (state.scene === "runComplete") return renderRunComplete(brief);
  return renderCaseOpen(brief);
}

function liveChapterTitle(brief = {}) {
  return isStoryPackMode() ? "热线连线" : brief.storyArcTitle ?? "今日来电";
}

function renderCaseOpen(brief) {
  const lines = compactDialogueLines(brief.openingDialogue ?? []);
  frame({
    brief,
    mood: "listening",
    label: "直播连线",
    chapter: liveChapterTitle(brief),
    text: callDialogueHtml(lines),
    choices: flowGroupHtml(`<button class="primary" data-scene="sceneReview" type="button">继续</button>`)
  });
  bindSceneButtons();
}

function renderSceneReview(brief) {
  const review = sceneReviewModel({
    brief,
    index: currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
    actionDone: (key) => actionDone(brief, key),
    issueBadge: issueCompletion(brief).badge,
    hasDeepFollowup: hasDeepFollowup(brief)
  });
  const { index, scene, done, lastStage, nextStage, nextLabel } = review;
  const sceneForView = sceneWithShownCard(brief, scene);
  const pick = selectedScenePickForState(state, brief, index);
  const dialoguePicks = askedDialoguePicksForState(state, brief, index);
  frame({
    brief,
    mood: "thinking",
    label: "继续对话",
    chapter: liveChapterTitle(brief),
    text: sceneReviewHtml({
      index,
      done,
      completedExchangeHtml: done ? completedSceneExchangeHtml(completedSceneExchangeForState(state, brief, sceneForView, index, pick)) : "",
      activeExchangeHtml: done ? "" : activeSceneExchangeHtml({ scene: sceneForView, dialoguePicks }),
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief, { excludeIndex: index }))
    }),
    choices: done
      ? sceneReviewDoneChoicesHtml({ lastStage, nextStage, nextLabel })
      : sceneQuestionChoicesHtml(index, scene, dialoguePicks)
  });
  bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
  bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
  bind("[data-next-scene-stage]", () => setIndex(brief, "sceneReview", index + 1));
  bindSceneButtons();
}

function sceneWithShownCard(brief = {}, scene = {}) {
  if (!scene?.showsCard) return scene;
  const shownCard = (brief.evidenceCards ?? []).find((card) => card.id === scene.showsCard);
  return shownCard ? { ...scene, shownCard } : scene;
}

function renderEvidenceCheck(brief) {
  const index = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
  const model = evidenceCheckModel({
    brief,
    index,
    pick: selectedEvidencePickForState(state, brief, index),
    issueBadge: issueCompletion(brief).badge,
    hasDeepFollowup: hasDeepFollowup(brief)
  });
  const { check, pick, lastCheck, nextStage, nextLabel } = model;
  if (model.missing) {
    state.scene = sceneAfterEvidenceFor(brief);
    saveState();
    return render();
  }
  frame({
    brief,
    mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
    label: "看材料",
    chapter: liveChapterTitle(brief),
    text: evidenceCheckScreenHtml({
      check,
      pick,
      index,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: pick
      ? flowGroupHtml(lastCheck
        ? `<button class="primary" data-scene="${nextStage}" type="button">${nextLabel}</button>`
        : `<button class="primary" data-next-evidence-check type="button">继续看材料</button>`)
      : ""
  });
  bindEvidenceCheckButtons(brief, check);
  bind("[data-next-evidence-check]", () => setIndex(brief, "evidenceCheck", index + 1));
  bindSceneButtons();
}

function renderInvestigationBackflow(brief) {
  const model = investigationBackflowModel({
    entries: unlockedInvestigationEntriesForState(state, brief),
    selectedPick: (index) => selectedInvestigationPickForState(state, brief, index)
  });
  const { hook, pick, index, nextLabel } = model;
  if (model.missing) {
    state.scene = "caseSolved";
    saveState();
    return render();
  }
  frame({
    brief,
    mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
    label: "后台私信",
    chapter: liveChapterTitle(brief),
    text: investigationBackflowScreenHtml({
      hook,
      pick,
      index,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: pick
      ? flowGroupHtml(`<button class="primary" data-after-investigation type="button">${nextLabel}</button>`)
      : ""
  });
  bindInvestigationButtons(brief, hook, index);
  bind("[data-after-investigation]", () => moveScene("caseSolved"));
  bindSceneButtons();
}

function renderDeepFollowup(brief) {
  const issue = issueCompletion(brief);
  if (!issue.badge || !hasDeepFollowup(brief)) {
    state.scene = "accusation";
    saveState();
    return renderAccusation(brief);
  }
  const followup = deepFollowupFor(brief, issue);
  frame({
    brief,
    mood: "focused",
    label: "深入一问",
    chapter: liveChapterTitle(brief),
    text: `
      ${callDialogueHtml([
        { role: "host", text: followup.question },
        { role: "caller", text: followup.answer }
      ])}
      <p class="hint">${escapeHtml(followup.note)}</p>
    `,
    choices: flowGroupHtml(`<button class="primary" data-scene="accusation" type="button">选一句往下追</button>`)
  });
  bindSceneButtons();
}

function renderPatienceLost(brief) {
  frame({
    brief,
    mood: "tense",
    label: "这通断了",
    chapter: liveChapterTitle(brief),
    text: `
      ${callDialogueHtml([
        { role: "host", text: "停一下，这里接乱了。" },
        { role: "caller", text: "嗯，我刚才也乱了。我们从前面那句重新说吧。" }
      ])}
      <p class="hint">这案还没收住。回到刚才那一步重新接。</p>
    `,
    choices: flowGroupHtml(`
      <button class="primary" data-retry-lost-step type="button">从这句重来</button>
      <button data-action="title" type="button">回标题</button>
    `)
  });
  bind("[data-retry-lost-step]", () => retryPatienceLostStep(brief));
  bindSceneButtons();
}

function renderAccusation(brief) {
  const readiness = accusationReadinessForBrief(brief);
  if (!readiness.ready) {
    state.lastReaction = readiness.message;
    state.scene = "sceneReview";
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
    };
    saveState();
    return render();
  }
  const choices = dailyAccusationChoices(brief);
  frame({
    brief,
    mood: "tense",
    label: "收住话头",
    chapter: liveChapterTitle(brief),
    text: `
      <p><b>选一句往下追</b></p>
      <p>下面哪句最该继续追？</p>
      ${choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))}
    `,
    choices: choiceGroupHtml("往下追", choices.map((choice) => `<button data-accuse="${escapeHtml(choice.accuse)}" data-accuse-label="${escapeHtml(choice.label)}" data-accuse-response="${escapeHtml(choice.response ?? "")}" type="button">${escapeHtml(choice.label)}</button>`).join(""), "single-choice-group", "从刚才听到的话里选一句")
  });
  document.querySelectorAll("[data-accuse]").forEach((button) => {
    button.addEventListener("click", () => resolveAccusationFromButton(brief, button));
  });
  bindSceneButtons();
}

function renderSolved(brief) {
  const result = normalizedDailyResult(brief);
  const step = Number(state.recapStep ?? 0);
  const issue = issueCompletion(brief);
  const rank = recapRankLabel(issue);
  const conclusion = dailyConclusion(brief, result, issue);
  const route = routeAxisProfileForState(state, brief, result);
  const pressure = storyPressureRows([brief], {
    budgetFor: ensureBudget,
    choicesFor: (item) => routeChoicesForState(state, item),
    foundCountFor: (item) => contradictionsForState(state, item).length
  })[0]?.profile ?? {};
  const quoteComparison = finalQuoteComparison(brief, result);
  const boundary = truthBoundaryReview(brief);
  const boundaryPicks = truthBoundaryPicksForState(state, brief);
  const boundaryMisses = truthBoundaryMissesForState(state, brief);
  const boundaryLine = truthBoundaryAftertaste(boundary, boundaryPicks, boundaryMisses);
  const finalScene = isFinalStoryPackCase();
  const pages = solvedRecapPagesHtml({
    rank,
    issue,
    result,
    route,
    routeTrail: routeTrailHtml({
      choices: routeChoicesForState(state, brief),
      keyQuestionCount: keyQuestionLimit(brief),
      investigationIndexBase: investigationRouteIndexBase(brief)
    }),
    pressure,
    quoteComparison,
    conclusion,
    offMicLetters: offMicLettersForBrief(brief, CONTENT_ADVISORS),
    boundary,
    boundaryPicks,
    boundaryLine,
    issueLineText: issueLine(issue, result)
  });
  const recap = solvedRecapFlowView({
    pages,
    step,
    boundary,
    boundaryPicks,
    afterLabel: isStoryPackMode() ? finalScene ? "查看整晚收麦" : "接下一路麦" : "查看今日结果"
  });
  frame({
    brief,
    mood: "listening",
    label: "连线回看",
    chapter: liveChapterTitle(brief),
    text: recap.text,
    choices: recap.choices
  });
  document.querySelectorAll("[data-truth-boundary-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const promptId = button.getAttribute("data-truth-boundary-prompt");
      const answer = button.getAttribute("data-truth-boundary-pick");
      if (!promptId || !answer) return;
      const key = caseKey(brief);
      if (state.truthBoundaryPicks?.[key]?.[promptId]) return;
      const prompt = (boundary.prompts ?? []).find((item) => item.id === promptId);
      const miss = prompt && answer !== prompt.expected;
      state.truthBoundaryPicks = {
        ...(state.truthBoundaryPicks ?? {}),
        [key]: {
          ...(state.truthBoundaryPicks?.[key] ?? {}),
          [promptId]: answer
        }
      };
      if (miss) {
        state.truthBoundaryMisses = {
          ...(state.truthBoundaryMisses ?? {}),
          [key]: {
            ...(state.truthBoundaryMisses?.[key] ?? {}),
            [promptId]: Number(state.truthBoundaryMisses?.[key]?.[promptId] ?? 0) + 1
          }
        };
      }
      saveState();
      render();
    });
  });
  bind("[data-recap-next]", () => {
    state.recapStep = recap.index + 1;
    saveState();
    render();
  });
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bind("[data-after-recap]", () => {
    if (isStoryPackMode() && !isFinalStoryPackCase()) {
      state.scene = "storyInterlude";
      saveState();
      return render();
    }
    moveScene("runComplete");
  });
  bindSceneButtons();
}

function offMicLettersForBrief(brief = {}, advisors = {}) {
  const advisorRows = (brief.advisorNotes ?? []).map((note) => {
    const advisor = advisors[note.advisorId] ?? {};
    const title = [advisor.name, advisor.domain].filter(Boolean).join(" · ");
    return {
      kind: "advisor",
      badge: title || "顾问留言",
      appearsNowBecause: note.appearsNowBecause ?? "",
      text: note.text ?? ""
    };
  });
  const respondent = brief.respondentNote ? [{
    kind: "respondent",
    badge: "对方留言",
    appearsNowBecause: brief.respondentNote.appearsNowBecause ?? "",
    text: brief.respondentNote.text ?? ""
  }] : [];
  return [...advisorRows, ...respondent].filter((letter) => letter.text);
}

function renderStoryInterlude(brief) {
  const nextBrief = state.caseBriefs?.[Number(state.chapter ?? 1)] ?? null;
  const result = normalizedDailyResult(brief);
  const route = routeAxisProfileForState(state, brief, result);
  const interlude = state.caseInterludes?.[brief.id] ?? {};
  const backflow = storyInterludeBackflowProfile(brief);
  frame({
    brief,
    mood: "focused",
    label: "案间过渡",
    chapter: "案间",
    text: storyInterludeHtml({
      previousLabel: route.label,
      previousLine: storyInterludeRecapLine(brief, result, route, interlude, backflow),
      nextObjectLabel: storyInterludeObjectLabel(nextBrief),
      nextLine: storyInterludeNextLine(nextBrief)
    }),
    choices: flowGroupHtml(storyInterludeChoicesHtml())
  });
  bind("[data-enter-next-case]", () => advanceToNextStoryPackCase());
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bindSceneButtons();
}

function renderRunComplete(brief) {
  if (isStoryPackMode()) return renderStoryPackComplete();
  const result = normalizedDailyResult(brief);
  const route = routeProfileForBrief(brief, result);
  const issue = issueCompletion(brief);
  const rank = recapRankLabel(issue);
  const pickedQuote = result.dailyAccuseLabel ?? "还没选最后那句";
  const quoteComparison = finalQuoteComparison(brief, result);
  const caught = issue.revealed[0] ?? route.shareBody;
  const quoteComparisonHtml = quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : "";
  frame({
    brief,
    mood: "focused",
    label: "今日收麦",
    chapter: "今日收麦",
    text: dailyCompleteHtml({
      issueLineText: issueResultLine(issue, result),
      route,
      issue,
      rank,
      result,
      pickedQuote,
      quoteComparisonHtml,
      caught
    }),
    choices: dailyCompleteChoicesHtml()
  });
  bind("[data-copy-result]", async () => {
    const text = dailyCompleteShareText({ route, pickedQuote });
    try {
      await navigator.clipboard?.writeText(text);
      state.lastReaction = "吃瓜文案已复制。";
    } catch {
      state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
    }
    render();
  });
  bind('[data-action="title"]', resetToTitle);
  postDailySharePayload(brief, route, result);
}

function renderStoryPackComplete() {
  const briefs = state.caseBriefs ?? [];
  const results = briefs.map((brief) => normalizedDailyResult(brief));
  const solved = results.filter((result) => result.accused).length;
  const routeProfiles = briefs.map((brief, index) => routeAxisProfileForState(state, brief, results[index] ?? {}));
  const summary = storyPackSummaryModel({
    briefs,
    results,
    routeProfiles,
    boundaryRows: storyBoundaryRows(briefs, {
      picksFor: (brief) => truthBoundaryPicksForState(state, brief),
      missesFor: (brief) => truthBoundaryMissesForState(state, brief)
    }),
    pressureRows: storyPressureRows(briefs, {
      budgetFor: ensureBudget,
      choicesFor: (brief) => routeChoicesForState(state, brief),
      foundCountFor: (item) => contradictionsForState(state, item).length
    }),
    materialRows: storyMaterialRows(briefs, {
      evidencePicksFor: (brief) => selectedEvidencePicksForState(state, brief),
      investigationPicksFor: (brief) => selectedInvestigationPicksForState(state, brief)
    })
  });
  frame({
    brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
    mood: "focused",
    label: "试玩收麦",
    chapter: "试玩收麦",
    showCaseHud: false,
    text: storyPackCompleteHtml({
      briefs,
      results,
      routeProfiles,
      ...summary
    }),
    choices: flowGroupHtml(`
      <button class="primary" data-copy-weekly-result type="button">复制收麦文案</button>
      <button data-action="title" type="button">回标题</button>
    `)
  });
  bind("[data-copy-weekly-result]", async () => {
    const text = storyPackShareText({
      theme: summary.theme,
      displayBest: summary.displayBest,
      pressureProfile: summary.pressureProfile,
      materialProfile: summary.materialProfile,
      quoteProfile: summary.quoteProfile,
      hiddenThreadProfile: summary.hiddenThreadProfile,
      playerType: summary.playerType
    });
    try {
      await navigator.clipboard?.writeText(text);
      state.lastReaction = "收麦文案已复制。";
    } catch {
      state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
    }
    render();
  });
  bind('[data-action="title"]', resetToTitle);
}

function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true }) {
  const modeLabel = isStoryPackMode() ? "试玩连线" : "今日来电";
  const backdropClass = caseBackdropClass(brief);
  const visualHud = showCaseHud
    ? `${caseProgressStrip(brief)}${audiencePatienceHud(brief)}${liveCommentStrip(brief)}${portraitLayer(brief, mood)}`
    : storyPackSummaryHud();
  const total = Math.max(1, keyQuestionLimit(brief));
  const firstMaterial = evidenceChecksFor(brief)[0] ?? {};
  const currentMaterial = brief.storyClueObject ?? brief.clueObject ?? firstMaterial.title ?? "通话摘录";
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel,
    soundEnabled: isSoundEnabled(),
    backdropClass,
    label,
    chapter,
    text,
    reactionHtml: reactionLine(),
    choices,
    visualHud,
    material: currentMaterial,
    screenEffect: state.lastScreenEffect ?? "",
    controlDeckHtml: showCaseHud
      ? liveControlDeckHtml({
          onAirLabel: isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中",
          label,
          segment: answeredSceneCountForState(state, brief) + 1,
          total,
          pressure: currentLivePressure(brief),
          material: currentMaterial
        })
      : ""
  });
  const hadPressureCue = Boolean(state.lastReaction || state.lastPressureSignal || state.lastScreenEffect);
  if (hadPressureCue) {
    state.lastReaction = null;
    state.lastPressureSignal = null;
    state.lastPressureAxis = null;
    state.lastScreenEffect = null;
    saveState();
  }
  bind('[data-action="title"]', resetToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bind('[data-action="sound"]', () => {
    toggleSound();
    render();
  });
  queueDefaultFocus();
}

function caseBackdropClass(brief = {}) {
  return brief.backdropClass ?? "backdrop-live";
}

function compactDialogueLines(lines) {
  const normalized = (lines ?? []).filter((line) => line?.text);
  const totalLength = normalized.reduce((sum, line) => sum + String(line.text ?? "").length, 0);
  return normalized.slice(0, totalLength > 170 ? 2 : 4);
}

function bind(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", handler);
  });
}

function bindChoiceActivation(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    let lastPointerAt = 0;
    element.addEventListener("pointerup", () => {
      lastPointerAt = Date.now();
      handler(element);
    });
    element.addEventListener("click", () => {
      if (Date.now() - lastPointerAt < 350) return;
      handler(element);
    });
  });
}

function queueDefaultFocus() {
  requestAnimationFrame(() => setupDefaultFocus());
}

function setupDefaultFocus() {
  focusButton(preferredDefaultButton());
}

function preferredDefaultButton() {
  return app?.querySelector(
    ".choices button.primary:not(:disabled), .choices button[data-primary='true']:not(:disabled), .choices button:not(:disabled), .title-actions button:not(:disabled), .topbar button:not(:disabled)"
  ) ?? null;
}

function preferredBackButton() {
  return app?.querySelector('[data-action="title"]:not(:disabled), [data-retry-case]:not(:disabled)') ?? null;
}

function preferredReviewButton() {
  return app?.querySelector('[data-recap-next]:not(:disabled), [data-after-recap]:not(:disabled)') ?? null;
}

function toggleReviewPanel() {
  const panel = app?.querySelector(".choice-review");
  if (!panel) return false;
  panel.open = !panel.open;
  return true;
}

function moveButtonFocus(direction) {
  const buttons = focusableButtons();
  if (!buttons.length) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = nextFocusIndex({ currentIndex, total: buttons.length, direction });
  focusButton(buttons[nextIndex]);
}

function focusableButtons() {
  return Array.from(app?.querySelectorAll("button:not(:disabled)") ?? []).filter(isVisibleElement);
}

function isVisibleElement(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function focusButton(button) {
  if (!button) return;
  try {
    button.focus({ preventScroll: true });
  } catch {
    button.focus();
  }
}

function activateButton(button) {
  if (!button || button.disabled) return;
  button.click();
}

function startGamepadPolling() {
  if (gamepadPollingStarted) return;
  if (typeof requestAnimationFrame !== "function") return;
  if (typeof globalThis.navigator?.getGamepads !== "function") return;
  gamepadPollingStarted = true;
  requestAnimationFrame(pollGamepads);
}

function pollGamepads() {
  const gamepad = firstActiveGamepad();
  if (gamepad) handleGamepadInput(gamepad);
  requestAnimationFrame(pollGamepads);
}

function firstActiveGamepad() {
  return Array.from(globalThis.navigator?.getGamepads?.() ?? []).find((item) => item?.connected) ?? null;
}

function handleGamepadInput(gamepad) {
  handleGamepadButton(gamepad, 0, () => {
    const button = document.activeElement?.matches?.("button") ? document.activeElement : preferredDefaultButton();
    activateButton(button);
  });
  handleGamepadButton(gamepad, 1, () => activateButton(preferredBackButton()));
  handleGamepadButton(gamepad, 3, () => {
    if (!toggleReviewPanel()) activateButton(preferredReviewButton());
  });
  handleGamepadButton(gamepad, 12, () => moveButtonFocus(-1));
  handleGamepadButton(gamepad, 13, () => moveButtonFocus(1));
  handleGamepadButton(gamepad, 14, () => moveButtonFocus(-1));
  handleGamepadButton(gamepad, 15, () => moveButtonFocus(1));
  handleGamepadAxis(gamepad);
}

function handleGamepadButton(gamepad, buttonIndex, handler) {
  const key = `${gamepad.index}:${buttonIndex}`;
  const pressed = Boolean(gamepad.buttons?.[buttonIndex]?.pressed);
  if (pressed && !gamepadPreviousButtons[key]) handler();
  gamepadPreviousButtons[key] = pressed;
}

function handleGamepadAxis(gamepad) {
  const now = Date.now();
  const direction = gamepadAxisDirection({ axes: gamepad.axes, lastMoveAt: lastGamepadMoveAt, now });
  if (!direction) return;
  moveButtonFocus(direction);
  lastGamepadMoveAt = now;
}

function keyEventInTextInput(event) {
  const target = event.target;
  const tagName = target?.tagName;
  return target?.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function bindSceneButtons() {
  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.addEventListener("click", () => moveScene(button.dataset.scene));
  });
}

function handleSceneQuestionButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const option = options[optionIndex] ?? options[0];
  if (!brief || !option) return;
  const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
  const answer = answerVariant.answer;
  markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
  markAction(brief, `version:${sceneIndex}`);
  if (option.contradiction) {
    recordContradiction(brief, option.contradiction);
    recordContradiction(brief, scene.contradiction);
  }
  else {
    state.lastReaction = questionPressureReaction({ ...option, answer }, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  }
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  state.sceneAnswers = {
    ...(state.sceneAnswers ?? {}),
    [answerKey(brief, sceneIndex)]: answer
  };
  state.sceneQuestionPicks = {
    ...(state.sceneQuestionPicks ?? {}),
    [answerKey(brief, sceneIndex)]: {
      question: option.question ?? "",
      answer,
      contradiction: option.contradiction ?? "",
      routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
      routeTone: option.routeTone ?? routeToneForChoice(option),
      correct: Boolean(option.contradiction),
      guarded: answerVariant.guarded
    }
  };
  recordRouteChoice(brief, sceneIndex, option, scene);
  if (audiencePatienceLost(brief, {
    area: "sceneReview",
    index: sceneIndex,
    actionKeys: [`sceneQuestion:${sceneIndex}:${optionIndex}`, `version:${sceneIndex}`],
    answerKey: answerKey(brief, sceneIndex),
    routeIndex: sceneIndex,
    spent: !option.contradiction,
    removeQuestionPick: true
  })) return;
  saveState();
  render();
}

function handleSceneDialogueButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const dialogueRows = sceneDialogueOptions(scene, options);
  const option = dialogueRows[optionIndex]?.option ?? null;
  if (!brief || !option) return;
  const key = answerKey(brief, sceneIndex);
  const current = state.sceneDialoguePicks?.[key] ?? [];
  if (current.some((pick) => Number(pick.optionIndex) === Number(optionIndex))) return;
  const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
  state.sceneDialoguePicks = {
    ...(state.sceneDialoguePicks ?? {}),
    [key]: [
      ...current,
      {
        optionIndex,
        question: option.question ?? "",
        answer: answerVariant.answer,
        routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
        routeTone: option.routeTone ?? routeToneForChoice(option),
        guarded: answerVariant.guarded
      }
    ]
  };
  state.lastReaction = questionPressureReaction({ ...option, answer: answerVariant.answer }, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  saveState();
  render();
}

function sceneChoiceContext(sceneIndex) {
  const brief = activeCaseBrief();
  const scene = brief?.sceneVersions?.[sceneIndex] ?? {};
  return {
    brief,
    scene,
    options: focusedQuestionOptions(scene.questionOptions ?? [])
  };
}

function bindEvidenceCheckButtons(brief, check = {}) {
  document.querySelectorAll("[data-evidence-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const [checkIndex, optionIndex] = button.dataset.evidenceCheck.split(":").map(Number);
      const outcome = materialOperationOutcome(check, checkIndex, optionIndex);
      markAction(brief, `evidenceCheck:${checkIndex}:${optionIndex}`, { spend: outcome.spend });
      markAction(brief, `evidenceCheck:${checkIndex}`);
      if (outcome.contradiction) {
        recordContradiction(brief, outcome.contradiction);
      }
      state.evidenceCheckPicks = {
        ...(state.evidenceCheckPicks ?? {}),
        [evidenceAnswerKey(brief, checkIndex)]: evidencePickWithRevision(brief, outcome.pick)
      };
      recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, outcome.routeChoice, { version: check.material ?? "" });
      state.lastReaction = materialPressureReaction(outcome, check);
      state.lastPressureSignal = materialPressureSignal(outcome);
      if (outcome.correct) state.lastScreenEffect = "material-hit";
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (outcome.spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
        area: "evidenceCheck",
        index: checkIndex,
        actionKeys: [`evidenceCheck:${checkIndex}:${optionIndex}`, `evidenceCheck:${checkIndex}`],
        answerKey: evidenceAnswerKey(brief, checkIndex),
        routeIndex: keyQuestionLimit(brief) + checkIndex,
        spent: true,
        removeEvidencePick: true
      });
      saveState();
      render();
    });
  });
}

function evidencePickWithRevision(brief, pick = {}) {
  if (!pick.correct || pick.revisesScene === undefined) return pick;
  const scene = brief?.sceneVersions?.[Number(pick.revisesScene)] ?? null;
  if (!scene?.revisedVersion) return pick;
  return {
    ...pick,
    revisedVersion: scene.revisedVersion
  };
}

function bindInvestigationButtons(brief, hook = {}, hookIndex = 0) {
  document.querySelectorAll("[data-evidence-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.evidenceCheck.split(":")[1] ?? 0);
      const outcome = materialOperationOutcome(hook, hookIndex, optionIndex);
      const spend = hook.spendOnMiss === true && outcome.spend;
      markAction(brief, `investigation:${hookIndex}:${optionIndex}`, { spend });
      markAction(brief, `investigation:${hookIndex}`);
      if (outcome.contradiction) {
        recordContradiction(brief, outcome.contradiction);
      }
      state.investigationPicks = {
        ...(state.investigationPicks ?? {}),
        [investigationAnswerKey(brief, hookIndex)]: outcome.pick
      };
      recordRouteChoice(
        brief,
        investigationRouteIndexBase(brief) + hookIndex,
        {
          ...outcome.routeChoice,
          routeAxis: hook.routeAxis ?? outcome.routeChoice.routeAxis,
          routeTone: outcome.correct ? "backflow-hit" : "backflow-miss"
        },
        { version: hook.material ?? "" }
      );
      state.lastReaction = investigationPickReaction(outcome, hook);
      state.lastPressureSignal = materialPressureSignal(outcome);
      if (outcome.correct) state.lastScreenEffect = "material-hit";
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
        area: "investigationBackflow",
        index: hookIndex,
        actionKeys: [`investigation:${hookIndex}:${optionIndex}`, `investigation:${hookIndex}`],
        answerKey: investigationAnswerKey(brief, hookIndex),
        routeIndex: investigationRouteIndexBase(brief) + hookIndex,
        spent: true,
        removeInvestigationPick: true
      });
      saveState();
      render();
    });
  });
}

function moveScene(scene) {
  const brief = activeCaseBrief();
  if (scene === "accusation") {
    const readiness = accusationReadinessForBrief(brief);
    if (!readiness.ready) {
      state.lastReaction = readiness.message;
      state.scene = "sceneReview";
      state.dialogueProgress = {
        ...(state.dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
      };
      saveState();
      return render();
    }
  }
  state.scene = scene;
  saveState();
  render();
}

function setIndex(brief, area, index) {
  setIndexValue(brief, area, index);
  saveState();
  render();
}

function setIndexValue(brief, area, index) {
  const total = area === "sceneReview" ? brief.sceneVersions?.length ?? 1 : area === "evidenceCheck" ? evidenceChecksFor(brief).length || 1 : unlockedInvestigationEntriesForState(state, brief).length || 1;
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [`${caseKey(brief)}:${area}`]: Math.max(0, Math.min(index, total - 1))
  };
}

function areaTotalForRetry(brief, area) {
  if (area === "sceneReview") return brief.sceneVersions?.length ?? 1;
  if (area === "evidenceCheck") return evidenceChecksFor(brief).length || 1;
  if (area === "investigationBackflow") return unlockedInvestigationEntriesForState(state, brief).length || 1;
  return 1;
}

function currentIndex(brief, area, total) {
  return Math.max(0, Math.min(Number(state.dialogueProgress?.[`${caseKey(brief)}:${area}`] ?? 0), Math.max(0, total - 1)));
}

function firstUnansweredSceneIndex(brief) {
  return firstOpenSceneIndex(brief, (actionKey) => actionDone(brief, actionKey));
}

function resolveAccusationFromButton(brief, button) {
  const accuseLabel = button.getAttribute("data-accuse-label") ?? button.textContent?.trim() ?? "";
  const response = button.getAttribute("data-accuse-response") ?? "";
  const accused = button.getAttribute("data-accuse") ?? "";
  const issue = issueCompletion(brief);
  const resolved = resolveAccusationForCase({
    brief,
    accused,
    contradictionCount: issue.revealed.length,
    requiredContradictions: issue.total
  });
  const issueCleared = Boolean(issue.badge);
  const quoteHit = accused === resolved.result.expected;
  const result = {
    caseId: brief.id,
    accused,
    expected: resolved.result.expected,
    relationshipExpected: resolved.result.relationshipExpected,
    structuralExpected: resolved.result.structuralExpected,
    correct: issueCleared,
    contradictionCount: contradictionsForState(state, brief).length,
    issuePercent: issue.percent,
    issueRevealed: issue.revealed,
    issueMissed: issue.missed,
    dailyBadge: issueCleared,
    quoteHit
  };
  result.dailyAccuseLabel = accuseLabel;
  result.dailyResponse = response;
  result.dailyRoute = routeProfileForBrief(brief, result);
  state.accusationHistory = upsertByCaseId(state.accusationHistory, result);
  state.solvedCaseIds = [...new Set([...(state.solvedCaseIds ?? []), brief.id])];
  applyOutcome(brief, result);
  recordDailyMeta(brief, result, issue);
  state.scene = unlockedInvestigationEntriesForState(state, brief).some((entry) => !selectedInvestigationPickForState(state, brief, entry.index)) ? "investigationBackflow" : "caseSolved";
  state.recapStep = 0;
  saveState();
  render();
}

function normalizedDailyResult(brief) {
  const current = state.accusationHistory?.find((item) => item.caseId === brief.id);
  const issue = issueCompletion(brief);
  return {
    ...(current ?? {}),
    caseId: brief.id,
    accused: current?.accused ?? null,
    expected: expectedAccusationForCase(brief),
    relationshipExpected: current?.relationshipExpected ?? relationshipExpectedForResult(brief),
    correct: current?.correct ?? false,
    dailyAccuseLabel: current?.dailyAccuseLabel ?? "还没选最后那句",
    dailyResponse: current?.dailyResponse ?? "",
    contradictionCount: contradictionsForState(state, brief).length,
    issuePercent: issue.percent,
    issueRevealed: issue.revealed,
    issueMissed: issue.missed,
    dailyBadge: current?.dailyBadge ?? false,
    quoteHit: current?.quoteHit ?? false
  };
}

function issueCompletion(brief) {
  return calculateIssueCompletion({
    brief,
    foundContradictions: contradictionsForState(state, brief),
    requiredLimit: keyQuestionLimit(brief)
  });
}

function relationshipExpectedForResult(brief) {
  return relationshipExpectedAccusationForCase(brief);
}

function accusationReadinessForBrief(brief) {
  return accusationReadinessForCase(brief, (actionKey) => actionDone(brief, actionKey));
}

function applyOutcome(brief, result) {
  if (state.caseInterludes?.[brief.id]) return;
  const budget = ensureBudget(brief);
  const outcome = calculateCaseOutcome({
    result,
    contradictionCount: contradictionsForState(state, brief).length,
    budgetRemaining: budget.remaining
  });
  state.caseInterludes = { ...(state.caseInterludes ?? {}), [brief.id]: outcome.interlude };
}

function recordDailyMeta(brief, result, issue) {
  meta = {
    ...meta,
    runs: Number(meta.runs ?? 0) + 1,
    history: [
      {
        caseId: brief.id,
        dailyKey: brief.dailyKey,
        plotId: brief.plotId,
        issuePercent: issue.percent,
        dailyBadge: Boolean(result.dailyBadge),
        routeAxis: routeAxisProfileForState(state, brief, result).axis,
        playerType: dailyPlayerType({
          percent: issue.percent,
          quoteHit: result.quoteHit,
          accused: result.accused
        }),
        at: Date.now()
      },
      ...(Array.isArray(meta.history) ? meta.history : [])
    ].slice(0, 30)
  };
  saveMetaSnapshot(meta);
}

function routeProfileForBrief(brief, result = {}) {
  return buildDailyRouteProfile(brief, result, {
    issue: issueCompletion(brief),
    axisProfile: routeAxisProfileForState(state, brief, result)
  });
}

function postDailySharePayload(brief, route, result) {
  const mode = isStoryPackMode() ? "episode" : "daily";
  const storyKey = brief.storyKey ?? brief.weeklyKey ?? "";
  platformRuntime.postMessage({
    type: "daily-share",
    dailyKey: brief.dailyKey,
    storyKey,
    solved: Boolean(result.dailyBadge),
    issuePercent: Number(result.issuePercent ?? 0),
    dailyBadge: Boolean(result.dailyBadge),
    playerType: route.playerType,
    title: route.shareTitle,
    body: route.shareBody,
    question: route.shareQuestion,
    path: `/pages/index/index?mode=${mode}&dailyKey=${encodeURIComponent(brief.dailyKey ?? "")}&storyKey=${encodeURIComponent(storyKey)}`
  });
}

function isFinalStoryPackCase() {
  return Number(state.chapter ?? 1) >= (state.caseBriefs?.length ?? 1);
}

function advanceToNextStoryPackCase(message = "新的来电接进来，上一通留给弹幕吵。") {
  state.chapter = Math.min(Number(state.chapter ?? 1) + 1, state.caseBriefs?.length ?? 1);
  state.caseBrief = activeCaseBrief();
  state.scene = "caseOpen";
  state.recapStep = 0;
  state.patienceLostContext = null;
  state.lastReaction = message;
  saveState();
  render();
}

function retryPatienceLostStep(brief) {
  const context = state.patienceLostContext ?? {};
  state = retryPatienceLostState({
    state,
    brief,
    context,
    budget: ensureBudget(brief),
    areaTotal: areaTotalForRetry(brief, context.area ?? "sceneReview")
  });
  saveState();
  render();
}

function resetCaseAttempt(brief) {
  const key = caseKey(brief);
  state.scene = "caseOpen";
  state.dialogueProgress = removeKeyPrefix(state.dialogueProgress, `${key}:`);
  state.sceneAnswers = removeKeyPrefix(state.sceneAnswers, `${key}:`);
  state.sceneQuestionPicks = removeKeyPrefix(state.sceneQuestionPicks, `${key}:`);
  state.sceneDialoguePicks = removeKeyPrefix(state.sceneDialoguePicks, `${key}:`);
  state.evidenceCheckPicks = removeKeyPrefix(state.evidenceCheckPicks, `${key}:`);
  state.investigationPicks = removeKeyPrefix(state.investigationPicks, `${key}:`);
  state.truthBoundaryPicks = omitRecordKey(state.truthBoundaryPicks, key);
  state.truthBoundaryMisses = omitRecordKey(state.truthBoundaryMisses, key);
  state.routeChoiceLog = { ...(state.routeChoiceLog ?? {}), [key]: [] };
  state.caseActionLog = omitRecordKey(state.caseActionLog, key);
  state.contradictionLog = omitRecordKey(state.contradictionLog, key);
  state.accusationHistory = (state.accusationHistory ?? []).filter((item) => item.caseId !== key);
  state.solvedCaseIds = (state.solvedCaseIds ?? []).filter((item) => item !== key);
  state.caseInterludes = omitRecordKey(state.caseInterludes, key);
  state.caseBudgets = omitRecordKey(state.caseBudgets, key);
  state.recapStep = 0;
  state.patienceLostContext = null;
  saveState();
  render();
}

function upsertByCaseId(items = [], result) {
  const next = (items ?? []).filter((item) => item.caseId !== result.caseId);
  return [...next, result];
}

function removeKeyPrefix(record = {}, prefix) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => !key.startsWith(prefix)));
}

function omitRecordKey(record = {}, keyToOmit) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => key !== keyToOmit));
}

function markAction(brief, actionKey, { spend = false } = {}) {
  const key = caseKey(brief);
  const previousRemaining = Number(ensureBudget(brief).remaining ?? 0);
  const patch = applyActionMark({
    caseActionLog: state.caseActionLog,
    caseId: key,
    actionKey,
    budget: ensureBudget(brief),
    spend
  });
  state.caseBudgets = { ...(state.caseBudgets ?? {}), [key]: patch.budget };
  state.caseActionLog = patch.caseActionLog;
  if (patch.budget && Number(patch.budget.remaining ?? 0) < previousRemaining) {
    state.lastScreenEffect = state.lastScreenEffect ?? "patience-drop";
  }
}

function audiencePatienceLost(brief, context = {}) {
  const budget = ensureBudget(brief);
  if (!casePatienceLost({
    budget,
    answeredScenes: answeredSceneCountForState(state, brief),
    requiredScenes: keyQuestionLimit(brief),
    answeredEvidence: answeredEvidenceCountForState(state, brief),
    requiredEvidence: evidenceChecksFor(brief).length
  })) return false;
  recordPatienceLost(brief, context);
  return true;
}

function recordPatienceLost(brief, context = {}) {
  state = recordPatienceLostState({ state, brief, context });
  saveState();
  render();
  return true;
}

function actionDone(brief, actionKey) {
  return Boolean(state.caseActionLog?.[caseKey(brief)]?.[actionKey]);
}

function ensureBudget(brief) {
  const key = caseKey(brief);
  if (state.caseBudgets?.[key]) return state.caseBudgets[key];
  const max = calculateCaseBudgetMax({ brief });
  state.caseBudgets = {
    ...(state.caseBudgets ?? {}),
    [key]: initialCaseBudget(max)
  };
  return state.caseBudgets[key];
}

function recordContradiction(brief, contradiction) {
  if (!contradiction) return;
  const key = caseKey(brief);
  const current = state.contradictionLog?.[key] ?? [];
  if (current.includes(contradiction)) return;
  state.contradictionLog = {
    ...(state.contradictionLog ?? {}),
    [key]: [...current, contradiction].slice(-32)
  };
}

function recordRouteChoice(brief, sceneIndex, option = {}, scene = {}) {
  const key = caseKey(brief);
  const current = (state.routeChoiceLog?.[key] ?? []).filter((item) => item.sceneIndex !== sceneIndex);
  const entry = normalizeRouteChoice(sceneIndex, option, scene);
  state.routeChoiceLog = {
    ...(state.routeChoiceLog ?? {}),
    [key]: [...current, entry].sort((a, b) => a.sceneIndex - b.sceneIndex)
  };
}

function sceneAfterEvidenceFor(brief) {
  return nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
}

function hasDeepFollowup(brief) {
  return Boolean(deepFollowupFor(brief).question);
}

function deepFollowupFor(brief) {
  if (brief.deepFollowup?.question) return brief.deepFollowup;
  return {
    question: "那我多问一句，如果把情绪先放一边，这件事最后是谁要承担成本？",
    answer: "她停了一下，说：我刚才一直在讲委屈，其实最怕的是最后又变成我来兜底。",
    note: "问到这一步，就别只听委屈了，得问最后谁兜底。"
  };
}

function dailyConclusion(brief, result, issue) {
  const picked = selectedScenePicksForState(state, brief);
  const pickedQuestions = picked.map((item) => item.question).filter(Boolean);
  const deep = issue.badge ? deepFollowupFor(brief) : null;
  return dailyConclusionModel(brief, result, issue, { pickedQuestions, deepFollowup: deep });
}

function currentLivePressure(brief, mood = "listening") {
  const sceneHint = currentScenePressureHint(brief);
  const pressure = livePressureProfile({
    budget: ensureBudget(brief),
    foundCount: contradictionsForState(state, brief).length,
    intentHook: liveIntentHookFor(brief),
    pressureSignal: state.lastPressureSignal ?? "",
    routeAxis: state.lastPressureAxis ?? "",
    routeAxisComments: brief.routeAxisComments ?? {},
    scene: state.scene,
    sceneHint,
    mood
  });
  return withCrossCaseEchoes(pressure, brief);
}

function withCrossCaseEchoes(pressure = {}, brief = {}) {
  const echo = eligibleCrossCaseEcho(brief);
  const comments = Array.isArray(pressure.comments) ? [...pressure.comments] : [];
  if (!echo || comments.length === 0) return pressure;
  comments[stableEchoIndex(`${brief.id}:${echo.requiresCaseId}:${echo.text}`, comments.length)] = echo.text;
  return { ...pressure, comments };
}

function eligibleCrossCaseEcho(brief = {}) {
  if (!isStoryPackMode()) return null;
  const echoes = Array.isArray(brief.crossCaseEchoes) ? brief.crossCaseEchoes : [];
  if (!echoes.length) return null;
  const solvedContentCaseIds = new Set((state.caseBriefs ?? [])
    .filter((item) => (state.solvedCaseIds ?? []).includes(item.id))
    .map((item) => item.runtimeContentCaseId ?? item.caseId)
    .filter(Boolean));
  return echoes.find((echo) => solvedContentCaseIds.has(echo.requiresCaseId)) ?? null;
}

function stableEchoIndex(seed = "", length = 1) {
  const safeLength = Math.max(1, Number(length ?? 1));
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % safeLength;
}

function storyInterludeBackflowProfile(brief = {}) {
  return investigationBackflowProfile(selectedInvestigationPicksForState(state, brief));
}

function caseProgressStrip(brief) {
  if (!brief) return "";
  return caseProgressStripHtml({
    total: keyQuestionLimit(brief),
    answered: answeredSceneCountForState(state, brief),
    label: isStoryPackMode() ? "匿名来电" : brief.label ?? "连线中"
  });
}

function audiencePatienceHud(brief) {
  return audiencePatienceHudHtml(currentLivePressure(brief));
}

function storyPackSummaryHud() {
  const total = state.caseBriefs?.length || 1;
  const solved = state.caseBriefs?.filter((brief) => state.solvedCaseIds?.includes(brief.id)).length ?? total;
  return storyPackSummaryHudHtml({ total, solved });
}

function liveCommentStrip(brief) {
  return liveCommentStripHtml(currentLivePressure(brief));
}

function liveIntentHookFor(brief) {
  return currentScenePressureHint(brief).intentHook ?? "话太顺了";
}

function portraitLayer(brief, mood = "listening") {
  const npc = NPCS.find((item) => item.id === brief.complainantId) ?? NPCS[0];
  const artSrc = casePortraitArt(brief, npc);
  return portraitLayerHtml({ artSrc, mood, expression: callerExpressionFor(brief, mood) });
}

function casePortraitArt(brief, npc) {
  return brief.callerArt ?? CHARACTER_ART[npc.id] ?? CHARACTER_ART.meng;
}

function callerExpressionFor(brief, mood = "listening") {
  const pressure = currentLivePressure(brief, mood);
  const budget = ensureBudget(brief);
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  return callerExpressionForView({ pressure, budget, scene: state.scene, sceneIndex, mood });
}

function currentScenePressureHint(brief) {
  if (state.scene !== "sceneReview") return {};
  const scenes = brief?.sceneVersions ?? [];
  const index = currentIndex(brief, "sceneReview", scenes.length || 1);
  return scenes[index]?.pressureHint ?? {};
}

function reactionLine() {
  const text = state.lastReaction;
  if (!text) return "";
  return `<p class="reaction">${escapeHtml(text)}</p>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

render();
