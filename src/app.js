import { generateCasesForMode } from "./caseModes.js?v=0.20.68";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js?v=0.20.68";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.20.68";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.20.68";
import { platformRuntime } from "./platformRuntime.js?v=0.20.68";
import { NPCS } from "./story.js?v=0.20.68";
import { dailyAccusationChoices } from "./dailyChoices.js?v=0.20.68";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "./runtime/inputNavigation.js?v=0.20.68";
import { materialOperationOutcome } from "./runtime/materialOperation.js?v=0.20.68";
import { dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, truthBoundaryAftertaste, truthBoundaryReview } from "./runtime/recapModel.js?v=0.20.68";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, questionPressureReaction, questionPressureSignal } from "./runtime/livePressure.js?v=0.20.68";
import { normalizeRouteChoice, routeAxisForChoice, routeAxisProfileFromChoices, routeChoicesFromPicks, routeToneForChoice } from "./runtime/routeLog.js?v=0.20.68";
import { routeTrailModel } from "./runtime/routeMapModel.js?v=0.20.68";
import { afterEvidenceScene as nextSceneAfterEvidence, answerKey, applyActionMark, caseKey, casePatienceLost, dailyAccusationReadiness as accusationReadinessForCase, evidenceAnsweredCount as countAnsweredEvidence, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, initialCaseBudget, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, sceneReviewModel, unlockedInvestigationEntries } from "./runtime/sceneAdvance.js?v=0.20.68";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "./runtime/storyPackSummaryModel.js?v=0.20.68";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js?v=0.20.68";
import { evidenceOperationHtml, evidencePickFeedbackHtml } from "./ui/evidenceView.js?v=0.20.68";
import { audiencePatienceHudHtml, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "./ui/liveCallView.js?v=0.20.68";
import { finalQuoteComparisonHtml, solvedRecapFlowView, solvedRecapPagesHtml } from "./ui/recapView.js?v=0.20.68";
import { focusedQuestionOptions, sceneQuestionChoicesHtml } from "./ui/sceneQuestions.js?v=0.20.68";
import { activeSceneExchangeHtml, completedSceneExchangeHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml } from "./ui/sceneReviewView.js?v=0.20.68";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "./ui/storyInterludeView.js?v=0.20.68";
import { storyPackCompleteHtml, storyPackShareText } from "./ui/storyPackCompleteView.js?v=0.20.68";
import { titleScreenHtml } from "./ui/titleView.js?v=0.20.68";

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

function choiceGroup(label, content, className = "", note = "") {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group ${className}">
      <div class="choice-label">
        <span>${escapeHtml(label)}</span>
        ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      </div>
      <div class="choice-stack">${content}</div>
    </section>
  `;
}

function flowGroup(content) {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group flow-group">
      <div class="choice-stack">${content}</div>
    </section>
  `;
}

function liveChapterTitle(brief = {}) {
  return isStoryPackMode() ? "热线连线" : brief.storyArcTitle ?? "今日来电";
}

function storyInterludeRecapLine(brief = {}, result = {}, route = {}, interlude = {}, backflow = {}) {
  const percent = Number(result.issuePercent ?? 0);
  const backflowLine = backflow.line ? backflow.line : "";
  if (percent < 50) return `${interlude.summary ?? "刚才那通挂得早，弹幕还在翻开场那句。"}${backflowLine}`;
  const routeLabel = route.label ? `你刚才一直压着${route.label}问。` : "";
  const recap = brief.storyInterludeRecap ?? brief.weeklyInterludeRecap ?? interlude.summary;
  return recap ? `${recap}${routeLabel}${backflowLine}` : (backflowLine || "这边刚挂，后台又亮了。");
}

function storyInterludeObjectLabel(brief = {}) {
  return brief.storyObjectLabel ?? brief.weeklyObjectLabel ?? brief.storyClueObject ?? brief.clueObject ?? "新材料";
}

function storyInterludeNextLine(brief = {}) {
  if (!brief) return "后台又亮了一路麦。";
  const bridge = brief.storyBridge ?? brief.weeklyBridge ?? "";
  if (bridge) return bridge;
  return "后台又亮了一路麦。";
}

function renderCaseOpen(brief) {
  const lines = compactDialogueLines(brief.openingDialogue ?? []);
  frame({
    brief,
    mood: "listening",
    label: "直播连线",
    chapter: liveChapterTitle(brief),
    text: `
      <div class="call-dialogue">
        ${lines.map((line) => callLine(brief, line)).join("")}
      </div>
    `,
    choices: flowGroup(`<button class="primary" data-scene="sceneReview" type="button">继续</button>`)
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
  const pick = selectedScenePick(brief, index);
  const options = focusedQuestionOptions(scene.questionOptions ?? []);
  frame({
    brief,
    mood: "thinking",
    label: "继续对话",
    chapter: liveChapterTitle(brief),
    text: sceneReviewHtml({
      index,
      done,
      completedExchangeHtml: done ? completedSceneExchangeForReview(brief, scene, index, pick) : "",
      activeExchangeHtml: done ? "" : activeSceneExchangeHtml({ scene, dialoguePicks: askedDialoguePicks(brief, index) }),
      reviewHtml: keyChoiceReview(brief)
    }),
    choices: done
      ? sceneReviewDoneChoicesHtml({ lastStage, nextStage, nextLabel })
      : sceneQuestionChoicesHtml(index, options, askedDialoguePicks(brief, index))
  });
  bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
  bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
  bind("[data-next-scene-stage]", () => setIndex(brief, "sceneReview", index + 1));
  bindSceneButtons();
}

function renderEvidenceCheck(brief) {
  const index = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
  const model = evidenceCheckModel({
    brief,
    index,
    pick: selectedEvidencePick(brief, index),
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
    text: `
      <p><b>${escapeHtml(check.title ?? "材料检视")}</b></p>
      ${evidenceOperationHtml(check, pick, index)}
      <p>${escapeHtml(check.prompt ?? "这份材料里，哪一块最该先指出？")}</p>
      ${pick ? evidencePickFeedbackHtml(pick) : ""}
      ${keyChoiceReview(brief)}
    `,
    choices: pick
      ? flowGroup(lastCheck
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
    entries: unlockedInvestigationEntriesFor(brief),
    selectedPick: (index) => selectedInvestigationPick(brief, index)
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
    text: `
      <p><b>${escapeHtml(hook.surface ?? "后台进来一条私信")}</b></p>
      <p>${escapeHtml(hook.appearsNowBecause ?? "收麦后，有人补了一张图。")}</p>
      ${evidenceOperationHtml(hook, pick, index)}
      <p>${escapeHtml(hook.prompt ?? "这条回流里，哪一句最该圈出来？")}</p>
      ${pick ? evidencePickFeedbackHtml(pick) : ""}
      ${keyChoiceReview(brief)}
    `,
    choices: pick
      ? flowGroup(`<button class="primary" data-after-investigation type="button">${nextLabel}</button>`)
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
      <div class="call-dialogue">
        ${callLine(brief, { role: "host", text: followup.question })}
        ${callLine(brief, { role: "caller", text: followup.answer })}
      </div>
      <p class="hint">${escapeHtml(followup.note)}</p>
    `,
    choices: flowGroup(`<button class="primary" data-scene="accusation" type="button">选一句原话</button>`)
  });
  bindSceneButtons();
}

function renderPatienceLost(brief) {
  frame({
    brief,
    mood: "tense",
    label: "听众散了",
    chapter: liveChapterTitle(brief),
    text: `
      <div class="call-dialogue">
        ${callLine(brief, { role: "host", text: "先收一下。弹幕已经散了，这通麦再问下去只会变成各说各的。" })}
        ${callLine(brief, { role: "caller", text: "我也有点乱。要不这通先到这儿，我回去把材料和原话再整理一下。" })}
      </div>
      <p class="hint">这案没有收麦。直播间的耐心被消耗完了。</p>
    `,
    choices: flowGroup(`
      <button class="primary" data-retry-case type="button">重问本案</button>
      ${isStoryPackMode() ? `<button data-after-patience-lost type="button">${isFinalStoryPackCase() ? "查看整晚收麦" : "接下一路麦"}</button>` : `<button data-action="title" type="button">回标题</button>`}
    `)
  });
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bind("[data-after-patience-lost]", () => {
    if (isFinalStoryPackCase()) return moveScene("runComplete");
    advanceToNextStoryPackCase("刚才那路麦散了，后台又亮起一路。");
  });
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
      <p><b>选一句原话</b></p>
      <p>聊到这儿，你会选哪句原话往下接？</p>
      ${keyChoiceReview(brief)}
    `,
    choices: choiceGroup("收哪句", choices.map((choice) => `<button data-accuse="${escapeHtml(choice.accuse)}" data-accuse-label="${escapeHtml(choice.label)}" data-accuse-response="${escapeHtml(choice.response ?? "")}" type="button">${escapeHtml(choice.label)}</button>`).join(""), "single-choice-group", "从刚才的话里挑")
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
  const route = routeAxisProfile(brief, result);
  const pressure = storyPressureRows([brief], {
    budgetFor: ensureBudget,
    choicesFor: routeChoicesForCase,
    foundCountFor: (item) => contradictions(item).length
  })[0]?.profile ?? {};
  const quoteComparison = finalQuoteComparison(brief, result);
  const boundary = truthBoundaryReview(brief);
  const boundaryPicks = truthBoundaryPicksFor(brief);
  const boundaryMisses = truthBoundaryMissesFor(brief);
  const boundaryLine = truthBoundaryAftertaste(boundary, boundaryPicks, boundaryMisses);
  const finalScene = isFinalStoryPackCase();
  const pages = solvedRecapPagesHtml({
    rank,
    issue,
    result,
    route,
    routeTrail: routeTrailHtml(brief),
    pressure,
    quoteComparison,
    conclusion,
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

function renderStoryInterlude(brief) {
  const nextBrief = state.caseBriefs?.[Number(state.chapter ?? 1)] ?? null;
  const result = normalizedDailyResult(brief);
  const route = routeAxisProfile(brief, result);
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
    choices: flowGroup(storyInterludeChoicesHtml())
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
  const routeProfiles = briefs.map((brief, index) => routeAxisProfile(brief, results[index] ?? {}));
  const summary = storyPackSummaryModel({
    briefs,
    results,
    routeProfiles,
    boundaryRows: storyBoundaryRows(briefs, {
      picksFor: truthBoundaryPicksFor,
      missesFor: truthBoundaryMissesFor
    }),
    pressureRows: storyPressureRows(briefs, {
      budgetFor: ensureBudget,
      choicesFor: routeChoicesForCase,
      foundCountFor: (item) => contradictions(item).length
    }),
    materialRows: storyMaterialRows(briefs, {
      evidencePicksFor: selectedEvidencePicksFor,
      investigationPicksFor: selectedInvestigationPicksFor
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
    choices: flowGroup(`
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

function liveControlDeck(brief = {}, label = "") {
  const pressure = currentLivePressure(brief);
  const total = Math.max(1, keyQuestionLimit(brief));
  const segment = Math.max(1, Math.min(total, answeredSceneCount(brief) + 1));
  const firstMaterial = evidenceChecksFor(brief)[0] ?? {};
  const material = brief.storyClueObject ?? brief.clueObject ?? firstMaterial.title ?? "通话摘录";
  return `
    <aside class="control-deck" aria-label="直播控场台">
      <section class="deck-card deck-card-live">
        <span><i></i>ON AIR</span>
        <b>${escapeHtml(isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中")}</b>
        <small>${escapeHtml(label || "连线中")}</small>
      </section>
      <section class="deck-card">
        <span>连线段落</span>
        <b>${segment}/${total}</b>
        <small>麦没断，话还在往下走。</small>
      </section>
      <section class="deck-card deck-card-pressure">
        <span>听众耐心</span>
        <b>${pressure.remaining}/${pressure.max}</b>
        <small>${escapeHtml(pressure.patienceLabel)}</small>
      </section>
      <section class="deck-card deck-card-material">
        <span>后台材料</span>
        <b>${escapeHtml(material)}</b>
        <small>先放在台面边上。</small>
      </section>
    </aside>
  `;
}

function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true }) {
  const modeLabel = isStoryPackMode() ? "试玩连线" : "今日来电";
  const backdropClass = caseBackdropClass(brief);
  const visualHud = showCaseHud
    ? `${caseProgressStrip(brief)}${audiencePatienceHud(brief)}${liveCommentStrip(brief)}${portraitLayer(brief, mood)}`
    : storyPackSummaryHud();
  app.innerHTML = `
    <main>
      <header class="topbar">
        <button data-action="title" type="button" aria-label="回到标题页">${PRODUCT_NAME}</button>
        <nav aria-label="章节"><span class="active"><i></i>${modeLabel}</span></nav>
        <button data-action="sound" type="button">音效 ${isSoundEnabled() ? "开" : "关"}</button>
        <button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>
      </header>
      <section class="story-grid case-vn-grid live-console-shell">
        ${showCaseHud ? liveControlDeck(brief, label) : ""}
        <article class="vn-stage">
          <div class="visual-scene backdrop-office ${backdropClass}" aria-hidden="true">
            <div class="scene-label">${escapeHtml(label)}</div>
            ${visualHud}
          </div>
          <div class="dialogue-card" aria-live="polite">
            <p class="eyebrow">${escapeHtml(chapter)}</p>
            ${text}
            ${reactionLine()}
            <div class="choices">${choices}</div>
          </div>
        </article>
      </section>
    </main>
  `;
  const hadPressureCue = Boolean(state.lastReaction || state.lastPressureSignal);
  if (hadPressureCue) {
    state.lastReaction = null;
    state.lastPressureSignal = null;
    state.lastPressureAxis = null;
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

function callLine(brief, line = {}) {
  const role = line.role === "host" || line.speaker === "你" ? "host" : "caller";
  const speaker = role === "host" ? "你" : "咨询者";
  const text = line.text ?? line.version ?? line.line ?? "";
  return `
    <div class="call-line ${role}">
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function compactDialogueLines(lines) {
  const normalized = (lines ?? []).filter((line) => line?.text);
  const totalLength = normalized.reduce((sum, line) => sum + String(line.text ?? "").length, 0);
  return normalized.slice(0, totalLength > 170 ? 2 : 4);
}

function completedSceneExchangeForReview(brief, scene, index, pick = {}) {
  return completedSceneExchangeHtml({
    scene,
    dialoguePicks: askedDialoguePicks(brief, index),
    pick,
    fallbackAnswer: state.sceneAnswers?.[answerKey(brief, currentIndex(brief, "sceneReview", brief.sceneVersions?.length ?? 1))] ?? ""
  });
}

function keyChoiceReview(brief) {
  const scenes = brief.sceneVersions ?? [];
  const lastAnsweredIndex = scenes.reduce((last, _, index) => actionDone(brief, `version:${index}`) ? index : last, -1);
  const lastDialogueIndex = scenes.reduce((last, _, index) => askedDialoguePicks(brief, index).length ? index : last, -1);
  if (lastAnsweredIndex < 0 && lastDialogueIndex < 0) return "";
  const rows = lastAnsweredIndex >= 0
    ? [
        { role: "caller", text: scenes[lastAnsweredIndex]?.version ?? "" },
        { role: "host", text: selectedScenePick(brief, lastAnsweredIndex)?.question ?? "" },
        { role: "caller", text: selectedScenePick(brief, lastAnsweredIndex)?.answer ?? "" }
      ].filter((line) => line.text)
    : lastDialogueIndex >= 0
      ? [
          { role: "caller", text: scenes[lastDialogueIndex]?.version ?? "" },
          ...askedDialoguePicks(brief, lastDialogueIndex).flatMap((pick) => [
            { role: "host", text: pick.question },
            { role: "caller", text: pick.answer }
          ])
        ].filter((line) => line.text)
      : [];
  return `
    <details class="choice-review">
      <summary>
        <span>上一段</span>
      </summary>
      <div class="call-dialogue review-dialogue">
        ${rows.map((line) => callLine(brief, line)).join("")}
      </div>
    </details>
  `;
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

function handleSceneDialogueButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const option = options[optionIndex] ?? options[0];
  if (!brief || !option) return;
  const key = answerKey(brief, sceneIndex);
  const current = state.sceneDialoguePicks?.[key] ?? [];
  if (!current.some((item) => item.optionIndex === optionIndex)) {
    state.sceneDialoguePicks = {
      ...(state.sceneDialoguePicks ?? {}),
      [key]: [
        ...current,
        {
          optionIndex,
          question: option.question ?? "",
          answer: option.answer ?? "",
          routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
          routeTone: option.routeTone ?? routeToneForChoice(option)
        }
      ]
    };
  }
  markAction(brief, `dialogue:${sceneIndex}:${optionIndex}`, { spend: true });
  state.lastReaction = questionPressureReaction(option, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  if (audiencePatienceLost(brief)) return;
  saveState();
  render();
}

function handleSceneQuestionButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const option = options[optionIndex] ?? options[0];
  if (!brief || !option) return;
  markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
  markAction(brief, `version:${sceneIndex}`);
  if (option.contradiction) {
    recordContradiction(brief, option.contradiction);
    recordContradiction(brief, scene.contradiction);
  }
  else {
    state.lastReaction = questionPressureReaction(option, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  }
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  state.sceneAnswers = {
    ...(state.sceneAnswers ?? {}),
    [answerKey(brief, sceneIndex)]: option.answer ?? ""
  };
  state.sceneQuestionPicks = {
    ...(state.sceneQuestionPicks ?? {}),
    [answerKey(brief, sceneIndex)]: {
      question: option.question ?? "",
      answer: option.answer ?? "",
      contradiction: option.contradiction ?? "",
      routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
      routeTone: option.routeTone ?? routeToneForChoice(option),
      correct: Boolean(option.contradiction)
    }
  };
  recordRouteChoice(brief, sceneIndex, option, scene);
  if (audiencePatienceLost(brief)) return;
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
        [evidenceAnswerKey(brief, checkIndex)]: outcome.pick
      };
      recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, outcome.routeChoice, { version: check.material ?? "" });
      state.lastReaction = materialPressureReaction(outcome, check);
      state.lastPressureSignal = materialPressureSignal(outcome);
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (outcome.spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) {
        state.scene = "patienceLost";
        saveState();
        return render();
      }
      saveState();
      render();
    });
  });
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
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) {
        state.scene = "patienceLost";
        saveState();
        return render();
      }
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
  const total = brief.sceneVersions?.length ?? 1;
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [`${caseKey(brief)}:${area}`]: Math.max(0, Math.min(index, total - 1))
  };
  saveState();
  render();
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
    contradictionCount: contradictions(brief).length,
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
  state.scene = unlockedInvestigationEntriesFor(brief).some((entry) => !selectedInvestigationPick(brief, entry.index)) ? "investigationBackflow" : "caseSolved";
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
    contradictionCount: contradictions(brief).length,
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
    foundContradictions: contradictions(brief),
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
    contradictionCount: contradictions(brief).length,
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
        routeAxis: routeAxisProfile(brief, result).axis,
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
    axisProfile: routeAxisProfile(brief, result)
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
  state.lastReaction = message;
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
  const patch = applyActionMark({
    caseActionLog: state.caseActionLog,
    caseId: key,
    actionKey,
    budget: ensureBudget(brief),
    spend
  });
  state.caseBudgets = { ...(state.caseBudgets ?? {}), [key]: patch.budget };
  state.caseActionLog = patch.caseActionLog;
}

function audiencePatienceLost(brief) {
  const budget = ensureBudget(brief);
  if (!casePatienceLost({
    budget,
    answeredScenes: answeredSceneCount(brief),
    requiredScenes: keyQuestionLimit(brief),
    answeredEvidence: answeredEvidenceCountFor(brief),
    requiredEvidence: evidenceChecksFor(brief).length
  })) return false;
  state.scene = "patienceLost";
  state.lastReaction = null;
  state.lastPressureSignal = null;
  state.lastPressureAxis = null;
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

function contradictions(brief) {
  return state.contradictionLog?.[caseKey(brief)] ?? [];
}

function answeredSceneCount(brief) {
  return (brief.sceneVersions ?? []).filter((_, index) => actionDone(brief, `version:${index}`)).length;
}

function selectedScenePick(brief, index) {
  const pick = state.sceneQuestionPicks?.[answerKey(brief, index)] ?? null;
  if (!pick) return null;
  return {
    ...pick,
    routeAxis: pick.routeAxis ?? routeAxisForChoice(pick),
    routeTone: pick.routeTone ?? routeToneForChoice(pick)
  };
}

function selectedEvidencePick(brief, index) {
  return state.evidenceCheckPicks?.[evidenceAnswerKey(brief, index)] ?? null;
}

function selectedEvidencePicksFor(brief) {
  return evidenceChecksFor(brief)
    .map((_, index) => selectedEvidencePick(brief, index))
    .filter(Boolean);
}

function selectedInvestigationPick(brief, index) {
  return state.investigationPicks?.[investigationAnswerKey(brief, index)] ?? null;
}

function selectedInvestigationPicksFor(brief) {
  return (brief.investigationHooks ?? [])
    .map((_, index) => selectedInvestigationPick(brief, index))
    .filter(Boolean);
}

function truthBoundaryPicksFor(brief) {
  return state.truthBoundaryPicks?.[caseKey(brief)] ?? {};
}

function truthBoundaryMissesFor(brief) {
  return state.truthBoundaryMisses?.[caseKey(brief)] ?? {};
}

function unlockedInvestigationEntriesFor(brief) {
  return unlockedInvestigationEntries(brief, {
    foundContradictions: contradictions(brief),
    actionDone: (actionKey) => actionDone(brief, actionKey)
  });
}

function answeredEvidenceCountFor(brief) {
  return countAnsweredEvidence(brief, (actionKey) => actionDone(brief, actionKey));
}

function sceneAfterEvidenceFor(brief) {
  return nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
}

function askedDialoguePicks(brief, index) {
  return state.sceneDialoguePicks?.[answerKey(brief, index)] ?? [];
}

function selectedScenePicks(brief) {
  return (brief.sceneVersions ?? []).map((_, index) => selectedScenePick(brief, index)).filter(Boolean);
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
  const picked = selectedScenePicks(brief);
  const pickedQuestions = picked.map((item) => item.question).filter(Boolean);
  const deep = issue.badge ? deepFollowupFor(brief) : null;

  if (issue.badge && brief.conclusionWhenCleared) {
    return {
      ...brief.conclusionWhenCleared,
      deepQuestion: deep?.question ?? brief.conclusionWhenCleared.deepQuestion ?? ""
    };
  }

  const branch = conclusionBranchFor(brief, pickedQuestions);
  if (branch) {
    return {
      summary: branch.summary ?? "",
      deepQuestion: branch.deepQuestion ?? "",
      followup: branch.followup ?? "",
      truth: branch.truth ?? brief.truth ?? ""
    };
  }

  if (issue.badge) {
    return {
      summary: brief.stageJudgement ?? "这一轮几个别扭点都问到了。",
      deepQuestion: deep?.question ?? "",
      followup: brief.followupTwist ?? "后续回拨里，咨询者愿意把刚才没说出口的部分补上。",
      truth: brief.truth ?? "别急着站一边，先把双方没说全的地方补齐。"
    };
  }

  return {
    summary: issue.revealed.length ? `这轮摆到台面上的是：${issue.revealed.join(" / ")}。` : "这一轮听到了委屈，真正别扭的地方还没上桌。",
    deepQuestion: "",
    followup: issue.revealed.length ? "后续回拨里，话还没完，评论区会继续抓着没说出口的地方吵。" : brief.followupTwist ?? "",
    truth: brief.truth ?? "这案不能只按第一印象走，得看每个人少说了哪半截。"
  };
}

function conclusionBranchFor(brief = {}, pickedQuestions = []) {
  const text = pickedQuestions.join(" ");
  return (brief.conclusionBranches ?? []).find((branch) => {
    const pattern = branch.match ?? branch.pattern ?? "";
    if (!pattern) return false;
    try {
      return new RegExp(pattern).test(text);
    } catch {
      return text.includes(pattern);
    }
  }) ?? null;
}

function routeChoicesForCase(brief) {
  const key = caseKey(brief);
  const logged = state.routeChoiceLog?.[key];
  if (Array.isArray(logged) && logged.length) return logged;
  return routeChoicesFromPicks(selectedScenePicks(brief));
}

function routeAxisProfile(brief, result = {}) {
  void result;
  return routeAxisProfileFromChoices(routeChoicesForCase(brief));
}

function routeTrailHtml(brief) {
  const nodes = routeTrailModel({
    choices: routeChoicesForCase(brief),
    keyQuestionCount: keyQuestionLimit(brief),
    investigationIndexBase: investigationRouteIndexBase(brief)
  });
  if (!nodes.length) return "";
  return `
    <div class="route-trail">
      ${nodes.map((item) => routeTrailItemHtml(item)).join("")}
    </div>
  `;
}

function routeTrailItemHtml(item) {
  return `
    <span>
      <em>${escapeHtml(item.mark)}</em>
      <b>${escapeHtml(item.label)}</b>
      ${item.question ? `<small>${escapeHtml(item.question)}</small>` : ""}
    </span>
  `;
}

function currentLivePressure(brief, mood = "listening") {
  const sceneHint = currentScenePressureHint(brief);
  return livePressureProfile({
    budget: ensureBudget(brief),
    foundCount: contradictions(brief).length,
    intentHook: liveIntentHookFor(brief),
    pressureSignal: state.lastPressureSignal ?? "",
    routeAxis: state.lastPressureAxis ?? "",
    routeAxisComments: brief.routeAxisComments ?? {},
    scene: state.scene,
    sceneHint,
    mood
  });
}

function storyInterludeBackflowProfile(brief = {}) {
  return investigationBackflowProfile(selectedInvestigationPicksFor(brief));
}

function caseProgressStrip(brief) {
  if (!brief) return "";
  return caseProgressStripHtml({
    total: keyQuestionLimit(brief),
    answered: answeredSceneCount(brief),
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
