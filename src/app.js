import { generateCasesForMode } from "./caseModes.js?v=0.20.65";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js?v=0.20.65";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.20.65";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.20.65";
import { platformRuntime } from "./platformRuntime.js?v=0.20.65";
import { NPCS } from "./story.js?v=0.20.65";
import { dailyAccusationChoices } from "./dailyChoices.js?v=0.20.65";
import { materialOperationOutcome } from "./runtime/materialOperation.js?v=0.20.65";
import { dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, storyCommentWall, storyMaterialProfile, storyPackAftertaste, storyPackAxes, storyPackBestAxis, storyPackClosingLine, storyPlayerType, storyQuoteProfile, storyShareTitle, storyThemeProfile, truthBoundaryAftertaste, truthBoundaryPackProfile, truthBoundaryReview } from "./runtime/recapModel.js?v=0.20.65";
import { livePressureProfile, materialPressureReaction, pressurePackProfile, pressureRecapProfile, questionPressureReaction } from "./runtime/livePressure.js?v=0.20.65";
import { compactRouteQuestion, normalizeRouteChoice, routeAxisForChoice, routeAxisLabel, routeAxisProfileFromChoices, routeChoicesFromPicks, routeToneForChoice } from "./runtime/routeLog.js?v=0.20.65";
import { afterEvidenceScene as nextSceneAfterEvidence, answerKey, applyActionMark, caseKey, casePatienceLost, dailyAccusationReadiness as accusationReadinessForCase, evidenceAnsweredCount as countAnsweredEvidence, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, initialCaseBudget, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, sceneReviewModel, unlockedInvestigationEntries } from "./runtime/sceneAdvance.js?v=0.20.65";
import { evidenceOperationHtml, evidencePickFeedbackHtml } from "./ui/evidenceView.js?v=0.20.65";
import { focusedQuestionOptions, sceneQuestionChoicesHtml } from "./ui/sceneQuestions.js?v=0.20.65";

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
  const key = event.key;
  if (key === "Enter" || key === " ") {
    const button = document.activeElement?.matches?.("button") ? document.activeElement : preferredDefaultButton();
    if (!button) return;
    event.preventDefault();
    activateButton(button);
    return;
  }
  if (["ArrowDown", "ArrowRight", "s", "S", "d", "D"].includes(key)) {
    event.preventDefault();
    moveButtonFocus(1);
    return;
  }
  if (["ArrowUp", "ArrowLeft", "w", "W", "a", "A"].includes(key)) {
    event.preventDefault();
    moveButtonFocus(-1);
    return;
  }
  if (key === "Escape") {
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
  app.innerHTML = `
    <main>
      <section class="title-screen">
        <div class="title-copy">
          <p class="eyebrow">${storyPack ? "Steam 首发试玩" : "今日匿名来电"}</p>
          <h1>${PRODUCT_NAME}</h1>
          <p>${escapeHtml(title)}</p>
          <div class="title-console-strip" aria-hidden="true">
            <span><b>ON AIR</b><small>热线待接</small></span>
            <span><b>REC</b><small>后台留档</small></span>
            <span><b>LIVE</b><small>弹幕入场</small></span>
          </div>
          <div class="quick-play-card case-file-ledger daily-hook-card">
            <span>${escapeHtml(object)}</span>
            <b>${escapeHtml(hook)}</b>
            <small>${storyPack ? "麦已经亮了。" : "同一天同一通电话。你接哪句，朋友进来就能对答案。"}</small>
          </div>
          <div class="title-actions">
            <button class="primary" data-start-story type="button">${storyPack ? "接通" : "我来接一句"}</button>
          </div>
        </div>
      </section>
    </main>
  `;
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
    text: `
      <p><b>第 ${index + 1} 段来电</b></p>
      <div class="call-dialogue">
        ${done
          ? completedSceneExchange(brief, scene, index, pick)
          : activeSceneExchange(brief, scene, index)}
      </div>
      ${keyChoiceReview(brief)}
    `,
    choices: done
      ? flowGroup(`
          ${lastStage
            ? `<button class="primary" data-scene="${nextStage}" type="button">${nextLabel}</button>`
            : `<button class="primary" data-next-scene-stage type="button">继续</button>`}
        `)
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
    state.scene = afterEvidenceScene(brief);
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
      ${evidenceOperationHtml(hook, pick, entry.index)}
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
  const readiness = dailyAccusationReadiness(brief);
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
  const pressure = casePressureRecap(brief);
  const quoteComparison = finalQuoteComparison(brief, result);
  const boundary = truthBoundaryReview(brief);
  const boundaryPicks = truthBoundaryPicksFor(brief);
  const boundaryMisses = truthBoundaryMissesFor(brief);
  const boundaryLine = truthBoundaryAftertaste(boundary, boundaryPicks, boundaryMisses);
  const finalScene = isFinalStoryPackCase();
  const pages = [
    `
      <section class="recap-score-card">
        <div class="recap-score-head"><span>收麦回看</span><em>${escapeHtml(rank)}</em></div>
        <div class="recap-score-main">
          <b>${Number(issue.percent ?? 0)}</b>
          <span>% 已问到</span>
        </div>
        <div class="recap-score-grid">
          <span><b>${issue.revealed.length ? "有抓手" : "刚开口"}</b><small>麦上记录</small></span>
          <span><b>${result.dailyBadge ? "能挂麦" : "还会吵"}</b><small>弹幕</small></span>
        </div>
        <p>${escapeHtml(issueLine(issue, result))}</p>
        <div class="route-map-card">
          <span>本案路线</span>
          <b>${escapeHtml(route.label)}</b>
          <small>${escapeHtml(route.summary)}</small>
          ${routeTrailHtml(brief)}
        </div>
        <div class="pressure-recap-card">
          <span>现场压力</span>
          <b>${escapeHtml(pressure.label)}</b>
          <small>${escapeHtml(pressure.line)}</small>
        </div>
        <p><strong>你接住的那句</strong>：${escapeHtml(result.dailyAccuseLabel ?? "还没选最后那句")}。</p>
        ${result.dailyResponse ? `<p><strong>主播接法</strong>：${escapeHtml(result.dailyResponse)}</p>` : ""}
        ${quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : ""}
      </section>
    `,
    `
      <p><b>台面上的话</b></p>
      <p>${issue.revealed.length ? issue.revealed.map(escapeHtml).join(" / ") : "这轮只听到表层，评论区还会继续吵。"}</p>
    `,
    `
      <p><b>主播收话</b></p>
      <p>${escapeHtml(conclusion.summary)}</p>
      ${conclusion.deepQuestion ? `<p class="hint"><strong>多问一句</strong>：${escapeHtml(conclusion.deepQuestion)}</p>` : ""}
    `,
    `
      <p><b>后续回拨</b></p>
      <p>${escapeHtml(conclusion.followup)}</p>
    `,
    truthBoundaryReviewHtml(boundary, boundaryPicks),
    `
      <p><b>连线收住</b></p>
      ${boundaryLine ? `<p class="hint">${escapeHtml(boundaryLine)}</p>` : ""}
      <p>${escapeHtml(conclusion.truth)}</p>
    `
  ];
  const index = Math.max(0, Math.min(step, pages.length - 1));
  const isBoundaryPage = pages[index]?.includes("truth-boundary-card");
  const canLeaveBoundary = !isBoundaryPage || truthBoundaryComplete(boundary, boundaryPicks);
  frame({
    brief,
    mood: "listening",
    label: "连线回看",
    chapter: liveChapterTitle(brief),
    text: `<div class="recap-page-kicker"><span>回看</span><b>${index + 1}/${pages.length}</b></div>${pages[index]}`,
    choices: index < pages.length - 1
      ? flowGroup(`${canLeaveBoundary ? `<button class="primary" data-recap-next type="button">继续回看</button>` : `<button class="primary" disabled type="button">先把这几句放完</button>`}<button data-retry-case type="button">从头再问</button>`)
      : flowGroup(`<button class="primary" data-after-recap type="button">${isStoryPackMode() ? finalScene ? "查看整晚收麦" : "接下一路麦" : "查看今日结果"}</button><button data-retry-case type="button">从头再问</button>`)
  });
  document.querySelectorAll("[data-truth-boundary-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const promptId = button.getAttribute("data-truth-boundary-prompt");
      const answer = button.getAttribute("data-truth-boundary-pick");
      if (!promptId || !answer) return;
      const key = caseKey(brief);
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
    state.recapStep = index + 1;
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
    text: `
      <section class="story-interlude-card">
        <span>上一通留下</span>
        <b>${escapeHtml(route.label)}</b>
        <p>${escapeHtml(storyInterludeRecapLine(brief, result, route, interlude, backflow))}</p>
      </section>
      <section class="story-interlude-card next">
        <span>新来电接入</span>
        <b>${escapeHtml(storyInterludeObjectLabel(nextBrief))}</b>
        <p>${escapeHtml(storyInterludeNextLine(nextBrief))}</p>
      </section>
    `,
    choices: flowGroup(`<button class="primary" data-enter-next-case type="button">接下一路麦</button><button data-retry-case type="button">回头重问</button>`)
  });
  bind("[data-enter-next-case]", () => advanceToNextStoryPackCase());
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bindSceneButtons();
}

function renderRunComplete(brief) {
  if (isStoryPackMode()) return renderStoryPackComplete();
  const result = normalizedDailyResult(brief);
  const route = dailyRouteProfile(brief, result);
  const issue = issueCompletion(brief);
  const rank = recapRankLabel(issue);
  const pickedQuote = result.dailyAccuseLabel ?? "还没选最后那句";
  const quoteComparison = finalQuoteComparison(brief, result);
  const caught = issue.revealed[0] ?? route.shareBody;
  frame({
    brief,
    mood: "focused",
    label: "今日收麦",
    chapter: "今日收麦",
    text: `
      <p><b>今日收麦</b></p>
      <p>${escapeHtml(issueResultLine(issue, result))}</p>
      <section class="share-result-card">
        <div class="share-card-head"><span>今日来电</span><em>${escapeHtml(route.label)}</em></div>
        <div class="share-player-type">
          <span>你是</span>
          <b>${escapeHtml(route.playerType)}</b>
        </div>
        <p class="share-card-title">${escapeHtml(route.shareTitle)}</p>
        <div class="issue-meter"><span style="width:${issue.percent}%"></span></div>
        <p class="issue-score">${escapeHtml(rank)}</p>
        ${result.dailyBadge ? `<div class="daily-badge-card compact"><span>今日收麦</span><b>能挂麦了</b></div>` : ""}
        <p class="share-card-finding"><span>你接的那句</span>${escapeHtml(pickedQuote)}</p>
        ${quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : ""}
        <p class="share-card-finding"><span>今晚瓜点</span>${escapeHtml(caught)}</p>
        <small>${escapeHtml(route.shareQuestion)}</small>
      </section>
    `,
    choices: flowGroup(`
      <button class="primary" data-copy-result type="button">复制吃瓜文案</button>
      <button data-action="title" type="button">回标题</button>
    `)
  });
  bind("[data-copy-result]", async () => {
    const text = `${route.shareTitle}\n我是：${route.playerType}\n我接的那句：${pickedQuote}\n${route.shareQuestion}`;
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
  const avgPercent = Math.round(results.reduce((sum, result) => sum + Number(result.issuePercent ?? 0), 0) / Math.max(1, briefs.length));
  const routeProfiles = briefs.map((brief, index) => routeAxisProfile(brief, results[index] ?? {}));
  const displayBest = storyPackBestAxis(avgPercent, storyPackAxes(routeProfiles));
  const theme = storyThemeProfile(briefs);
  const boundaryProfile = storyBoundaryProfile(briefs);
  const pressureProfile = storyPressureProfile(briefs);
  const materialProfile = storyPackMaterialProfile(briefs);
  const quoteProfile = storyQuoteProfile(results);
  const comments = storyCommentWall({
    briefs,
    results,
    routes: routeProfiles,
    best: displayBest,
    avgPercent,
    theme,
    boundaryProfile,
    pressureProfile,
    materialProfile,
    quoteProfile
  });
  frame({
    brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
    mood: "focused",
    label: "试玩收麦",
    chapter: "试玩收麦",
    showCaseHud: false,
    text: `
      <p><b>今晚收麦</b></p>
      <p>今晚四路麦都挂了。你最常回头看的，是：${escapeHtml(displayBest.label)}。</p>
      <section class="share-result-card">
        <div class="share-card-head"><span>${escapeHtml(theme.title)}</span><em>${escapeHtml(displayBest.label)}</em></div>
        <div class="share-player-type">
          <span>你是</span>
          <b>${escapeHtml(storyPlayerType(avgPercent, displayBest))}</b>
        </div>
        <p class="share-card-title">${escapeHtml(storyShareTitle(avgPercent, displayBest))}</p>
        <p class="weekly-theme-thesis">${escapeHtml(theme.thesis)}</p>
        <p class="issue-score">${escapeHtml(storyPackAftertaste(avgPercent))}</p>
        ${boundaryProfile.total ? `
          <div class="weekly-boundary-line">
            <span>事实边界</span>
            <b>${escapeHtml(boundaryProfile.label)}</b>
            <p>${escapeHtml(boundaryProfile.line)}</p>
          </div>
        ` : ""}
        ${pressureProfile.total ? `
          <div class="weekly-boundary-line">
            <span>现场压力</span>
            <b>${escapeHtml(pressureProfile.label)}</b>
            <p>${escapeHtml(pressureProfile.line)}</p>
          </div>
        ` : ""}
        ${materialProfile.total ? `
          <div class="weekly-boundary-line">
            <span>材料圈点</span>
            <b>${escapeHtml(materialProfile.label)}</b>
            <p>${escapeHtml(materialProfile.line)}</p>
          </div>
        ` : ""}
        ${quoteProfile.total ? `
          <div class="weekly-boundary-line">
            <span>收麦原话</span>
            <b>${escapeHtml(quoteProfile.label)}</b>
            <p>${escapeHtml(quoteProfile.line)}</p>
          </div>
        ` : ""}
        <div class="weekly-result-list">
          ${briefs.map((item, index) => {
            const result = results[index] ?? {};
            const route = routeProfiles[index] ?? routeAxisProfile(item, result);
            return `<p><span>${index + 1}. ${escapeHtml(item.label)}</span><b>${escapeHtml(route.label)}</b><small>${escapeHtml(result.dailyAccuseLabel ?? "未收麦")}</small></p>`;
          }).join("")}
        </div>
        <div class="comment-wall">
          <span>评论区审判墙</span>
          ${comments.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
        </div>
        <small>${escapeHtml(storyPackClosingLine(avgPercent, displayBest))}</small>
      </section>
    `,
    choices: flowGroup(`
      <button class="primary" data-copy-weekly-result type="button">复制收麦文案</button>
      <button data-action="title" type="button">回标题</button>
    `)
  });
  bind("[data-copy-weekly-result]", async () => {
    const text = `《直播间大侦探》试玩收麦\n${theme.title}\n我今晚常看的线：${displayBest.label}\n现场压力：${pressureProfile.label}\n材料圈点：${materialProfile.label}\n收麦原话：${quoteProfile.label}\n${storyPlayerType(avgPercent, displayBest)}`;
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
  const hadReaction = Boolean(state.lastReaction);
  if (hadReaction) {
    state.lastReaction = null;
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
  const classes = {
    "lost-job-hidden-credit": "backdrop-credit",
    "house-name-security-test": "backdrop-house",
    "education-income-fake-profile": "backdrop-profile",
    "workplace-reimbursement-screenshot": "backdrop-work",
    "tony-multi-dating": "backdrop-tony"
  };
  return classes[brief.plotId] ?? "backdrop-live";
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

function activeSceneExchange(brief, scene, index) {
  return [
    callLine(brief, { ...scene, text: scene.version, role: "caller" }),
    ...askedDialoguePicks(brief, index).flatMap((pick) => [
      callLine(brief, { role: "host", text: pick.question }),
      callLine(brief, { role: "caller", text: pick.answer })
    ])
  ].join("");
}

function completedSceneExchange(brief, scene, index, pick = {}) {
  return [
    callLine(brief, { ...scene, text: scene.version, role: "caller" }),
    ...askedDialoguePicks(brief, index).flatMap((item) => [
      callLine(brief, { role: "host", text: item.question }),
      callLine(brief, { role: "caller", text: item.answer })
    ]),
    keyChoiceExchange(brief, scene, pick)
  ].join("");
}

function keyChoiceExchange(brief, scene, pick = {}) {
  const question = pick.question ?? scene.questionOptions?.find((option) => option.contradiction)?.question ?? "这句我想再问清楚一点。";
  const answer = pick.answer ?? state.sceneAnswers?.[answerKey(brief, currentIndex(brief, "sceneReview", brief.sceneVersions?.length ?? 1))] ?? "";
  return [
    callLine(brief, { role: "host", text: question }),
    answer ? callLine(brief, { role: "caller", text: answer }) : ""
  ].join("");
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

function moveButtonFocus(direction) {
  const buttons = focusableButtons();
  if (!buttons.length) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = currentIndex >= 0
    ? (currentIndex + direction + buttons.length) % buttons.length
    : direction > 0 ? 0 : buttons.length - 1;
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
  handleGamepadButton(gamepad, 3, () => activateButton(preferredReviewButton()));
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
  const horizontal = Number(gamepad.axes?.[0] ?? 0);
  const vertical = Number(gamepad.axes?.[1] ?? 0);
  const strongest = Math.abs(horizontal) > Math.abs(vertical) ? horizontal : vertical;
  if (Math.abs(strongest) < 0.55) return;
  const now = Date.now();
  if (now - lastGamepadMoveAt < 220) return;
  moveButtonFocus(strongest > 0 ? 1 : -1);
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
  }
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
    const readiness = dailyAccusationReadiness(brief);
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
  result.dailyRoute = dailyRouteProfile(brief, result);
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

function dailyAccusationReadiness(brief) {
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

function dailyRouteProfile(brief, result = {}) {
  return buildDailyRouteProfile(brief, result, {
    issue: issueCompletion(brief),
    axisProfile: routeAxisProfile(brief, result)
  });
}

function finalQuoteComparisonHtml(comparison) {
  const pickedCaption = comparison.sameQuote ? "就接这句" : "你接的那句";
  if (comparison.sameQuote) {
    return `
      <div class="quote-compare-card quote-compare-card-single">
        <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}<em>这句够了。</em></p>
      </div>
    `;
  }
  const bestCaption = "换个口子";
  return `
    <div class="quote-compare-card">
      <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}</p>
      <p><span>${escapeHtml(bestCaption)}</span><b>${escapeHtml(comparison.bestLabel)}</b>${comparison.bestResponse ? `<small>${escapeHtml(comparison.bestResponse)}</small>` : ""}</p>
    </div>
  `;
}

function truthBoundaryReviewHtml(review, picks = {}) {
  if (!review?.columns?.length) {
    return `
      <p><b>事实边界</b></p>
      <p>这通还没留下足够边界。</p>
    `;
  }
  return `
    <section class="truth-boundary-card">
      <p><b>${escapeHtml(review.title)}</b></p>
      <p>${escapeHtml(review.line)}</p>
      ${truthBoundaryChallengeHtml(review, picks)}
      <div class="truth-boundary-grid">
        ${review.columns.map((column) => `
          <div class="truth-boundary-column truth-boundary-${escapeHtml(column.key)}">
            <span>${escapeHtml(column.label)}</span>
            <ul>
              ${column.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function truthBoundaryChallengeHtml(review, picks = {}) {
  if (!review?.prompts?.length) return "";
  return `
    <div class="truth-boundary-challenge">
      ${review.prompts.map((prompt) => {
        const picked = picks[prompt.id] ?? "";
        const settled = picked && picked === prompt.expected;
        return `
          <div class="truth-boundary-prompt ${picked ? settled ? "settled" : "unsettled" : ""}">
            <p>${escapeHtml(prompt.text)}</p>
            <div class="truth-boundary-options">
              ${review.choices.map((choice) => `
                <button class="${picked === choice.key ? "selected" : ""}" data-truth-boundary-prompt="${escapeHtml(prompt.id)}" data-truth-boundary-pick="${escapeHtml(choice.key)}" type="button">${escapeHtml(choice.label)}</button>
              `).join("")}
            </div>
            ${picked ? `<small>${settled ? "这句放得住。" : "这句还不能这么放。"}</small>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
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
    answeredEvidence: evidenceAnsweredCount(brief),
    requiredEvidence: evidenceChecksFor(brief).length
  })) return false;
  state.scene = "patienceLost";
  state.lastReaction = null;
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

function truthBoundaryComplete(review, picks = {}) {
  return (review?.prompts ?? []).every((prompt) => picks[prompt.id] === prompt.expected);
}

function unlockedInvestigationEntriesFor(brief) {
  return unlockedInvestigationEntries(brief, {
    foundContradictions: contradictions(brief),
    actionDone: (actionKey) => actionDone(brief, actionKey)
  });
}

function evidenceAnsweredCount(brief) {
  return countAnsweredEvidence(brief, (actionKey) => actionDone(brief, actionKey));
}

function afterEvidenceScene(brief) {
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
  if (brief.plotId === "education-income-fake-profile") {
    return {
      question: "那我多问一句，你自己的家庭经济状况怎么样？你自己一个月工资多少，够花吗？",
      answer: "我自己也不是特别宽裕，所以我才更在意他收入到底落不落地。我嘴上说家里想看稳定，其实我也想知道以后这笔钱是不是能进小家。",
      note: "这不是给男方洗白，是把女方自己的利益位置也问出来。"
    };
  }
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

  if (brief.plotId === "education-income-fake-profile") {
    if (issue.badge) {
      return {
        summary: "照她一开始的说法，问题像是男方资料不干净：MBA 被说成名校毕业，收入和花销也对不上。可一路问下来，她最放不下的其实是收入到底有多少、以后钱怎么管。MBA 的事她不是完全没感觉，只是借着见父母这次一起问了。",
        deepQuestion: deep.question,
        followup: "后续回拨里，她承认自己也想知道对方一个月到底赚多少、够不够花、愿不愿意把钱放进未来的小家。对方那句“是不是工资卡也要交出来”难听，但确实戳中了没说出口的地方。",
        truth: "这案别只按“骗学历”判，也别只骂女方看钱。男方把局部真实说得太漂亮，女方借父母的口继续摸收入。要往下谈，就得把学历、收入、花钱习惯和婚后管钱方式摊开。"
      };
    }
    if (pickedQuestions.some((item) => /MBA|学历|本科|介绍/.test(item))) {
      return {
        summary: "你这轮主要盯住了学历那句。男方没有凭空编学校，但把 MBA 放进“名校毕业”里，别人很容易听成另一回事。",
        deepQuestion: "",
        followup: "电话挂到这里还会吵下去。学历那句先浮上来了，后面的饭局也不会轻松。",
        truth: "学历是入口，不是整件事。后半段吵起来的，其实是收入、花销和婚后钱归谁管。"
      };
    }
    if (pickedQuestions.some((item) => /流水|工资|收入|花销|存款/.test(item))) {
      return {
        summary: "你这轮盯的是收入和流水。她不是只想听一句“稳定”，她想知道钱每个月到底怎么来、怎么花、以后进不进小家。",
        deepQuestion: "",
        followup: "电话挂到这里，饭桌上的空气已经变了。流水不是一张图的问题，学历那句也会被重新翻出来。",
        truth: "流水不只是看真假，已经挨着婚后工资透明和共同账户那道线了。"
      };
    }
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
  const choices = routeChoicesForCase(brief);
  if (!choices.length) return "";
  return `
    <div class="route-trail">
      ${choices.map((item) => routeTrailItemHtml(item, brief)).join("")}
    </div>
  `;
}

function routeTrailItemHtml(item, brief = {}) {
  const label = routeAxisLabel(item.axis);
  const question = compactRouteQuestion(item.question);
  const sceneIndex = Number(item.sceneIndex ?? 0);
  const mark = sceneIndex >= investigationRouteIndexBase(brief) ? "回" : sceneIndex >= keyQuestionLimit(brief) ? "料" : sceneIndex + 1;
  return `
    <span>
      <em>${escapeHtml(mark)}</em>
      <b>${escapeHtml(label)}</b>
      ${question ? `<small>${escapeHtml(question)}</small>` : ""}
    </span>
  `;
}

function currentLivePressure(brief, mood = "listening") {
  return livePressureProfile({
    budget: ensureBudget(brief),
    foundCount: contradictions(brief).length,
    intentHook: liveIntentHookFor(brief),
    reaction: state.lastReaction ?? "",
    scene: state.scene,
    sceneText: currentSceneText(brief),
    mood
  });
}

function casePressureRecap(brief) {
  return pressureRecapProfile({
    budget: ensureBudget(brief),
    choices: routeChoicesForCase(brief),
    foundCount: contradictions(brief).length
  });
}

function storyBoundaryProfile(briefs = []) {
  return truthBoundaryPackProfile(briefs.map((brief) => ({
    label: brief.label,
    review: truthBoundaryReview(brief),
    picks: truthBoundaryPicksFor(brief),
    misses: truthBoundaryMissesFor(brief)
  })));
}

function storyInterludeBackflowProfile(brief = {}) {
  return investigationBackflowProfile(selectedInvestigationPicksFor(brief));
}

function storyPressureProfile(briefs = []) {
  return pressurePackProfile(briefs.map((brief) => ({
    label: brief.label,
    profile: casePressureRecap(brief)
  })));
}

function storyPackMaterialProfile(briefs = []) {
  return storyMaterialProfile(briefs.map((brief) => ({
    label: brief.label,
    picks: [
      ...selectedEvidencePicksFor(brief),
      ...selectedInvestigationPicksFor(brief)
    ]
  })));
}

function caseProgressStrip(brief) {
  if (!brief) return "";
  const total = keyQuestionLimit(brief);
  const answered = answeredSceneCount(brief);
  const segment = Math.max(1, Math.min(total || 1, answered + 1));
  return `
    <div class="case-progress-strip">
      <span>第 ${segment}/${total || 1} 段</span>
      <span>${escapeHtml(isStoryPackMode() ? "匿名来电" : brief.label ?? "连线中")}</span>
    </div>
  `;
}

function audiencePatienceHud(brief) {
  const pressure = currentLivePressure(brief);
  const percent = Math.round(pressure.ratio * 100);
  return `
    <div class="audience-patience patience-${pressure.level}" aria-label="听众忍耐度 ${pressure.remaining}/${pressure.max}">
      <span>听众忍耐</span>
      <b>${pressure.remaining}/${pressure.max}</b>
      <i><em style="width:${percent}%"></em></i>
    </div>
  `;
}

function storyPackSummaryHud() {
  const total = state.caseBriefs?.length || 1;
  const solved = state.caseBriefs?.filter((brief) => state.solvedCaseIds?.includes(brief.id)).length ?? total;
  return `
    <div class="weekly-summary-visual">
      <span>试玩已收麦</span>
      <b>${solved}/${total}</b>
      <small>麦都收进来了，评论区开始吵后半场。</small>
    </div>
  `;
}

function liveCommentStrip(brief) {
  const pressure = currentLivePressure(brief);
  return `<div class="live-comment-strip">${pressure.comments.map((item) => `<span class="live-comment">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function liveIntentHookFor(brief) {
  const text = currentSceneText(brief);
  if (/老板娘|年卡|投店|带客|活动|朋友多|稳情绪|你和别人不一样|只有我能接住/.test(text)) return "甜话后面接要求";
  if (/不写才像一家人|协议|投入确认|像一家人|不信我|房本|还贷/.test(text)) return "亲近话压着账";
  if (/介绍人|名校|MBA|学校好|收入稳|条件不错|流水|工资卡/.test(text)) return "条件话被托了一层";
  if (/主责|审批|预算|复盘|付款|供应商|流程|报销/.test(text)) return "流程词说得太熟";
  if (/结婚|低我一头|怕你知道|最低还款|周转|今晚就要|挡几天/.test(text)) return "心疼话后面接钱";
  return "话太顺了";
}

function portraitLayer(brief, mood = "listening") {
  const expression = callerExpressionFor(brief, mood);
  const moodLabels = {
    anxious: "紧张",
    focused: "盯资料",
    listening: "听线",
    tense: "绷住",
    thinking: "接话"
  };
  const npc = NPCS.find((item) => item.id === brief.complainantId) ?? NPCS[0];
  return `
	    <div class="case-duel-portraits">
	      <figure class="case-portrait mood-${mood} active">
	        <img src="${CHARACTER_ART[npc.id]}" alt="" />
	        <div class="call-expression expression-${escapeHtml(expression.kind)}"><span>${escapeHtml(expression.text)}</span></div>
	        <figcaption><span>匿名来电｜${moodLabels[mood] ?? "听线"}</span><b>来电形象</b></figcaption>
	      </figure>
	    </div>
	  `;
}

function callerExpressionFor(brief, mood = "listening") {
  const pressure = currentLivePressure(brief, mood);
  if (pressure.expression) return pressure.expression;
  const budget = ensureBudget(brief);
  const remaining = Number(budget.remaining ?? budget.max ?? 1);
  const max = Math.max(1, Number(budget.max ?? 1));
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const reaction = String(state.lastReaction ?? "");
  const sceneText = currentSceneText(brief);

  if (state.scene === "patienceLost") return { kind: "pause", text: "眼神空了一下" };
  if (remaining / max <= 0.28) return { kind: "pause", text: "停了很久才开口" };
  if (/麦温|人声|弹幕有人替/.test(reaction)) return { kind: "blink", text: "连眨了两下" };
  if (/来电人自己|自己身上|工资|流水/.test(reaction)) return { kind: "shift", text: "把话咽回去半秒" };
  if (/老板娘|年卡|投店|带客|只有我能接住|你和别人不一样/.test(sceneText)) return { kind: "shift", text: "像把稿背到一半" };
  if (/主责|审批|预算|复盘|付款|供应商|流程|报销/.test(sceneText)) return { kind: "pause", text: "流程词说得很顺" };
  if (/介绍人|名校|MBA|条件不错|工资卡|流水/.test(sceneText)) return { kind: "blink", text: "笑了一下又停住" };
  if (/不写才像一家人|不信我|协议|房本|还贷/.test(sceneText)) return { kind: "shift", text: "听到亲近话就低头" };
  if (/结婚|低我一头|最低还款|周转|今晚就要/.test(sceneText)) return { kind: "pause", text: "那句说得太熟了" };
  if (state.scene === "deepFollowup") return { kind: "pause", text: "指尖停在屏幕上" };
  if (mood === "tense") return { kind: "shift", text: "握着手机没松手" };
  if (mood === "focused") return { kind: "pause", text: "低头翻图，停了三秒" };
  if (mood === "thinking") {
    const beats = [
      { kind: "blink", text: "连眨两下" },
      { kind: "shift", text: "眼神往旁边躲" },
      { kind: "pause", text: "吸了口气才接" },
      { kind: "shift", text: "把手机攥紧了" }
    ];
    return beats[sceneIndex % beats.length];
  }
  if (mood === "anxious") return { kind: "blink", text: "睫毛抖了一下" };
  return { kind: "blink", text: "麦里轻轻吸气" };
}

function currentSceneText(brief) {
  const scenes = brief?.sceneVersions ?? [];
  const index = currentIndex(brief, "sceneReview", scenes.length || 1);
  const scene = scenes[index] ?? {};
  const pick = selectedScenePick(brief, index) ?? {};
  const dialogue = askedDialoguePicks(brief, index);
  return [
    brief?.publicHook,
    scene.version,
    ...(scene.questionOptions ?? []).map((option) => option.question),
    pick.question,
    pick.answer,
    ...dialogue.flatMap((item) => [item.question, item.answer])
  ].filter(Boolean).join(" ");
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
