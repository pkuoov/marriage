import { generateCasesForMode } from "./caseModes.js?v=0.20.26";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js?v=0.20.26";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.20.26";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.20.26";
import { platformRuntime } from "./platformRuntime.js?v=0.20.26";
import { NPCS } from "./story.js?v=0.20.26";
import { dailyAccusationChoices } from "./dailyChoices.js?v=0.20.26";

const app = document.querySelector("#app");
const PRODUCT_NAME = "直播间大侦探";
const DEFAULT_ATTRS = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };

let state = normalizeDailyState(loadState() ?? structuredClone(baseState));
let meta = loadMeta();

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.dataset.action === "sound") return;
  playSfx(button.classList.contains("primary") || button.dataset.accuse ? "confirm" : "click");
});

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
  const hook = storyPack ? preview?.storyThemeIntro ?? preview?.weeklyThemeIntro ?? "热线已经接进来。资料在后台，先听这通。" : preview?.publicHook ?? "一通匿名来电已经接进来，关键就藏在第一句没说完的话里。";
  const object = storyPack ? "热线已接入" : preview?.storyClueObject ?? "今日通话摘录";
  app.innerHTML = `
    <main>
      <section class="title-screen">
        <div class="title-copy">
          <p class="eyebrow">${storyPack ? "Steam 首发试玩" : "今日匿名来电"}</p>
          <h1>${PRODUCT_NAME}</h1>
          <p>${escapeHtml(title)}</p>
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
}

function renderDailyCase() {
  const brief = activeCaseBrief();
  if (state.scene === "sceneReview") return renderSceneReview(brief);
  if (state.scene === "evidenceCheck") return renderEvidenceCheck(brief);
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

function storyInterludeRecapLine(brief = {}, result = {}, route = {}, interlude = {}) {
  const percent = Number(result.issuePercent ?? 0);
  if (percent < 50) return interlude.summary ?? "这通没完全收住，弹幕还停在开场那句。";
  const routeLabel = route.label ? `你这轮一直沿着${route.label}往下压。` : "";
  const lines = {
    "lost-job-hidden-credit": `账单摊开以后，那句“挡几天”已经不是原来的意思。${routeLabel}`,
    "tony-multi-dating": `那张表一露，甜话就不只是在谈感情。${routeLabel}`,
    "education-income-fake-profile": `资料图是真的，没放出来的那几栏也是真的。${routeLabel}`,
    "workplace-reimbursement-screenshot": `审批截图能堵住一句质问，堵不住钱去了哪里。${routeLabel}`,
    "house-name-security-test": `房本和还贷分成两套话以后，“一家人”就没那么好用了。${routeLabel}`
  };
  return lines[brief.plotId] ?? interlude.summary ?? "这通先收在这里，后面的电话已经排进来了。";
}

function storyInterludeObjectLabel(brief = {}) {
  const labels = {
    "lost-job-hidden-credit": "账单",
    "tony-multi-dating": "表格",
    "education-income-fake-profile": "资料图",
    "workplace-reimbursement-screenshot": "审批截图",
    "house-name-security-test": "协议草稿"
  };
  return labels[brief.plotId] ?? "新材料";
}

function storyInterludeNextLine(brief = {}) {
  if (!brief) return "新的电话已经排进来。";
  const bridge = brief.storyBridge ?? brief.weeklyBridge ?? "";
  if (bridge) return bridge;
  const lines = {
    "tony-multi-dating": "下一通别急着骂暧昧，先看店里那张表。",
    "education-income-fake-profile": "下一通带来几张资料图，图是真的，话未必说全。",
    "workplace-reimbursement-screenshot": "下一通换到公司，截图看着完整，钱却还没回来。",
    "house-name-security-test": "下一通聊房本和还贷，亲近话后面接着现金流。"
  };
  return lines[brief.plotId] ?? "新的电话已经排进来。";
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
  const scenes = brief.sceneVersions ?? [];
  const index = currentIndex(brief, "sceneReview", scenes.length || 1);
  const scene = scenes[index] ?? {};
  const done = actionDone(brief, `version:${index}`);
  const pick = selectedScenePick(brief, index);
  const options = focusedQuestionOptions(scene.questionOptions ?? []);
  const dialogueOptions = dialogueQuestionOptions(options);
  const criticalOptions = criticalQuestionOptions(options);
  const lastStage = index >= scenes.length - 1;
  const hasEvidence = evidenceChecksFor(brief).length > 0;
  const canDeepFollow = issueCompletion(brief).badge && hasDeepFollowup(brief);
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
            ? `<button class="primary" data-scene="${hasEvidence ? "evidenceCheck" : canDeepFollow ? "deepFollowup" : "accusation"}" type="button">${hasEvidence ? "看材料" : canDeepFollow ? "再深入一句" : "选一句原话"}</button>`
            : `<button class="primary" data-next-scene-stage type="button">继续</button>`}
        `)
      : sceneQuestionChoicesHtml(brief, index, dialogueOptions, criticalOptions)
  });
  bindSceneDialogueButtons(brief, scene, options);
  bindSceneQuestionButtons(brief, scene, options);
  bind("[data-next-scene-stage]", () => setIndex(brief, "sceneReview", index + 1));
  bindSceneButtons();
}

function renderEvidenceCheck(brief) {
  const checks = evidenceChecksFor(brief);
  const index = currentIndex(brief, "evidenceCheck", checks.length || 1);
  const check = checks[index];
  if (!check) {
    state.scene = afterEvidenceScene(brief);
    saveState();
    return render();
  }
  const pick = selectedEvidencePick(brief, index);
  const lastCheck = index >= checks.length - 1;
  const nextScene = afterEvidenceScene(brief);
  frame({
    brief,
    mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
    label: "看材料",
    chapter: liveChapterTitle(brief),
    text: `
      <p><b>${escapeHtml(check.title ?? "材料检视")}</b></p>
      <section class="evidence-check-card">
        <span>手边材料</span>
        <p>${escapeHtml(check.material ?? "")}</p>
      </section>
      <p>${escapeHtml(check.prompt ?? "这份材料里，哪一块最该先指出？")}</p>
      ${pick ? evidencePickFeedbackHtml(pick) : ""}
      ${keyChoiceReview(brief)}
    `,
    choices: pick
      ? flowGroup(lastCheck
        ? `<button class="primary" data-scene="${nextScene}" type="button">${nextScene === "deepFollowup" ? "再深入一句" : "选一句原话"}</button>`
        : `<button class="primary" data-next-evidence-check type="button">继续看材料</button>`)
      : choiceGroup("圈哪一处", (check.options ?? []).map((option, optionIndex) => `
          <button data-evidence-check="${index}:${optionIndex}" type="button">${escapeHtml(option.label ?? "这块")}</button>
        `).join(""), "evidence-choice-group")
  });
  bindEvidenceCheckButtons(brief, check);
  bind("[data-next-evidence-check]", () => setIndex(brief, "evidenceCheck", index + 1));
  bindSceneButtons();
}

function evidencePickFeedbackHtml(pick = {}) {
  return `
    <section class="evidence-result-card ${pick.correct ? "hit" : "miss"}">
      <span>${pick.correct ? "圈中了" : "没咬住"}</span>
      <b>${escapeHtml(pick.label ?? "")}</b>
      <p>${escapeHtml(pick.feedback ?? "")}</p>
    </section>
  `;
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
      ${isStoryPackMode() ? `<button data-after-patience-lost type="button">${isFinalStoryPackCase() ? "查看整晚收麦" : "接入下一通"}</button>` : `<button data-action="title" type="button">回标题</button>`}
    `)
  });
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bind("[data-after-patience-lost]", () => {
    if (isFinalStoryPackCase()) return moveScene("runComplete");
    advanceToNextStoryPackCase("上一通没收住，直播间把话题切到新的来电。");
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
  const quoteComparison = finalQuoteComparison(brief, result);
  const finalScene = isFinalStoryPackCase();
  const pages = [
    `
      <section class="recap-score-card">
        <div class="recap-score-head"><span>这通收住</span><em>${escapeHtml(rank)}</em></div>
        <div class="recap-score-main">
          <b>${Number(issue.percent ?? 0)}</b>
          <span>% 话头收住</span>
        </div>
        <div class="recap-score-grid">
          <span><b>${issue.revealed.length ? "有东西" : "刚起味"}</b><small>这轮听感</small></span>
          <span><b>${result.dailyBadge ? "收住了" : "还在吵"}</b><small>评论区</small></span>
        </div>
        <p>${escapeHtml(issueLine(issue, result))}</p>
        <div class="route-map-card">
          <span>本案路线</span>
          <b>${escapeHtml(route.label)}</b>
          <small>${escapeHtml(route.summary)}</small>
          ${routeTrailHtml(brief)}
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
    `
      <p><b>连线收住</b></p>
      <p>${escapeHtml(conclusion.truth)}</p>
    `
  ];
  const index = Math.max(0, Math.min(step, pages.length - 1));
  frame({
    brief,
    mood: "listening",
    label: "连线回看",
    chapter: liveChapterTitle(brief),
    text: `<div class="recap-page-kicker"><span>回看</span><b>${index + 1}/${pages.length}</b></div>${pages[index]}`,
    choices: index < pages.length - 1
      ? flowGroup(`<button class="primary" data-recap-next type="button">继续回看</button><button data-retry-case type="button">从头再问</button>`)
      : flowGroup(`<button class="primary" data-after-recap type="button">${isStoryPackMode() ? finalScene ? "查看整晚收麦" : "接入下一通" : "查看今日结果"}</button><button data-retry-case type="button">从头再问</button>`)
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
  frame({
    brief,
    mood: "focused",
    label: "案间过渡",
    chapter: "案间",
    text: `
      <section class="story-interlude-card">
        <span>上一通留下</span>
        <b>${escapeHtml(route.label)}</b>
        <p>${escapeHtml(storyInterludeRecapLine(brief, result, route, interlude))}</p>
      </section>
      <section class="story-interlude-card next">
        <span>新来电接入</span>
        <b>${escapeHtml(storyInterludeObjectLabel(nextBrief))}</b>
        <p>${escapeHtml(storyInterludeNextLine(nextBrief))}</p>
      </section>
    `,
    choices: flowGroup(`<button class="primary" data-enter-next-case type="button">接入下一通</button><button data-retry-case type="button">回头重问</button>`)
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
        ${result.dailyBadge ? `<div class="daily-badge-card compact"><span>今日收麦</span><b>这通聊开了</b></div>` : ""}
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
  const axes = summarizeStoryPackAxes(briefs, results);
  const best = axes[0] ?? { label: "现场听感线", count: 0 };
  const displayBest = avgPercent < 40 ? { axis: "live-instinct", count: best.count, label: "外围听感线" } : best;
  const theme = storyThemeForBriefs(briefs);
  const comments = storyCommentWall(briefs, results, displayBest, avgPercent, theme);
  frame({
    brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
    mood: "focused",
    label: "试玩收麦",
    chapter: "试玩收麦",
    showCaseHud: false,
    text: `
      <p><b>今晚收麦</b></p>
      <p>今晚四通都挂断了。你这一路最常盯的是：${escapeHtml(displayBest.label)}。</p>
      <section class="share-result-card">
        <div class="share-card-head"><span>${escapeHtml(theme.title)}</span><em>${escapeHtml(displayBest.label)}</em></div>
        <div class="share-player-type">
          <span>你是</span>
          <b>${escapeHtml(storyPlayerType(avgPercent, displayBest))}</b>
        </div>
        <p class="share-card-title">${escapeHtml(storyShareTitle(avgPercent, displayBest))}</p>
        <p class="weekly-theme-thesis">${escapeHtml(theme.thesis)}</p>
        <p class="issue-score">${escapeHtml(storyPackAftertaste(avgPercent))}</p>
        <div class="weekly-result-list">
          ${briefs.map((item, index) => {
            const result = results[index] ?? {};
            const route = routeAxisProfile(item, result);
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
    const text = `《直播间大侦探》试玩收麦\n${theme.title}\n我的主播倾向：${storyPlayerType(avgPercent, displayBest)}\n最常走：${displayBest.label}`;
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
  app.innerHTML = `
    <main>
      <header class="topbar">
        <button data-action="title" type="button" aria-label="回到标题页">${PRODUCT_NAME}</button>
        <nav aria-label="章节"><span class="active">${modeLabel}</span></nav>
        <button data-action="sound" type="button">音效 ${isSoundEnabled() ? "开" : "关"}</button>
        <button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>
      </header>
      <section class="story-grid case-vn-grid">
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

function focusedQuestionOptions(options = []) {
  const normalized = (options ?? []).filter(Boolean);
  if (normalized.length <= 2) return normalized;
  const core = normalized.find((option) => option.contradiction);
  const detour = normalized.find((option) => !option.contradiction);
  return [core, detour].filter(Boolean);
}

function dialogueQuestionOptions(options = []) {
  return options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => !option.contradiction);
}

function criticalQuestionOptions(options = []) {
  return options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => option.contradiction);
}

function sceneQuestionChoicesHtml(brief, sceneIndex, dialogueOptions = [], criticalOptions = []) {
  const asked = new Set(askedDialoguePicks(brief, sceneIndex).map((item) => item.optionIndex));
  const availableDialogue = dialogueOptions.filter(({ optionIndex }) => !asked.has(optionIndex));
  const rows = [
    ...availableDialogue.map(({ option, optionIndex }) => choiceQuestionButton(sceneIndex, optionIndex, option, "dialogue")),
    ...criticalOptions.map(({ option, optionIndex }) => choiceQuestionButton(sceneIndex, optionIndex, option, "key"))
  ].join("");
  return choiceGroup("你问", rows || `<p class="choice-note">这段没岔口。</p>`, "scene-question-group");
}

function choiceQuestionButton(sceneIndex, optionIndex, option = {}, kind = "key") {
  const attr = kind === "dialogue" ? "data-scene-dialogue" : "data-scene-question";
  return `
    <button class="choice-question" ${attr}="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span>
    </button>
  `;
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

function keyQuestionLimit(brief) {
  return brief.sceneVersions?.length ?? 0;
}

function bind(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", handler);
  });
}

function bindSceneButtons() {
  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.addEventListener("click", () => moveScene(button.dataset.scene));
  });
}

function bindSceneDialogueButtons(brief, scene, options) {
  document.querySelectorAll("[data-scene-dialogue]").forEach((button) => {
    button.addEventListener("click", () => {
      const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
      const option = options[optionIndex] ?? options[0];
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
      state.lastReaction = outerAngleReaction(option);
      if (audiencePatienceLost(brief)) return;
      saveState();
      render();
    });
  });
}

function bindSceneQuestionButtons(brief, scene, options) {
  document.querySelectorAll("[data-scene-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
      const option = options[optionIndex] ?? options[0];
      markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
      markAction(brief, `version:${sceneIndex}`);
      if (option.contradiction) {
        recordContradiction(brief, option.contradiction);
        recordContradiction(brief, scene.contradiction);
      }
      else {
        state.lastReaction = outerAngleReaction(option);
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
    });
  });
}

function bindEvidenceCheckButtons(brief, check = {}) {
  document.querySelectorAll("[data-evidence-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const [checkIndex, optionIndex] = button.dataset.evidenceCheck.split(":").map(Number);
      const option = check.options?.[optionIndex] ?? check.options?.[0] ?? {};
      const correct = Boolean(option.correct);
      markAction(brief, `evidenceCheck:${checkIndex}:${optionIndex}`, { spend: !correct });
      markAction(brief, `evidenceCheck:${checkIndex}`);
      if (correct) {
        recordContradiction(brief, option.contradiction ?? check.contradiction);
      }
      state.evidenceCheckPicks = {
        ...(state.evidenceCheckPicks ?? {}),
        [evidenceAnswerKey(brief, checkIndex)]: {
          optionIndex,
          label: option.label ?? "",
          feedback: option.feedback ?? "",
          contradiction: option.contradiction ?? check.contradiction ?? "",
          routeAxis: option.routeAxis ?? "document-edge",
          correct
        }
      };
      recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, {
        question: check.prompt ?? "",
        answer: option.label ?? "",
        contradiction: correct ? option.contradiction ?? check.contradiction ?? "" : "",
        routeAxis: option.routeAxis ?? "document-edge",
        routeTone: correct ? "evidence-hit" : "evidence-miss"
      }, { version: check.material ?? "" });
      state.lastReaction = null;
      if (!correct && Number(ensureBudget(brief).remaining ?? 0) <= 0) {
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
  const scenes = brief.sceneVersions ?? [];
  const index = scenes.findIndex((_, sceneIndex) => !actionDone(brief, `version:${sceneIndex}`));
  return index >= 0 ? index : Math.max(0, scenes.length - 1);
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
  state.scene = "caseSolved";
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

function issueLine(issue, result = {}) {
  if (issue.badge) return "几句要紧话都摆上桌了，弹幕现在可以各吵各的。";
  if (issue.percent >= 75) return "这通聊到后面，弹幕已经不太能按开场那套吵了。";
  if (issue.percent >= 50) return "这通听出了几处不顺耳，后面的火还没完全压住。";
  if (issue.percent > 0) return "你闻到味儿了，麦里还有些话没浮上来。";
  return "这轮听了个热闹，真正别扭的地方还藏在话缝里。";
}

function issueResultLine(issue, result = {}) {
  if (issue.badge) return "这通基本聊开了，剩下就看弹幕站哪边。";
  if (issue.percent >= 75) return "这口瓜已经咂出味了，弹幕还会抓着边角继续吵。";
  if (issue.percent >= 50) return "这通连线听出了几处别扭，适合发给朋友一起吵。";
  if (issue.percent > 0) return "你闻到一点味道，但麦里还有话没出来。";
  return "今天像是听了个开头，瓜还卡在话缝里。";
}

function recapRankLabel(issue) {
  if (issue.badge) return "聊开";
  if (issue.percent >= 75) return "差一口";
  if (issue.percent >= 50) return "半口瓜";
  if (issue.percent > 0) return "闻到味";
  return "听个热闹";
}

function relationshipExpectedForResult(brief) {
  return relationshipExpectedAccusationForCase(brief);
}

function dailyAccusationReadiness(brief) {
  const required = keyQuestionLimit(brief);
  const sceneCount = (brief.sceneVersions ?? []).filter((_, index) => actionDone(brief, `version:${index}`)).length;
  if (sceneCount < required) return { ready: false, message: "这通还没走到收麦点，先把当前这段问完。" };
  const evidenceRequired = evidenceChecksFor(brief).length;
  const evidenceCount = evidenceAnsweredCount(brief);
  if (evidenceCount < evidenceRequired) return { ready: false, message: "材料还没看完，先把缺的那一块指出来。" };
  return { ready: true, message: "" };
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
  const percent = Number(result.issuePercent ?? issueCompletion(brief).percent);
  const quoteHit = Boolean(result.quoteHit);
  const axisProfile = routeAxisProfile(brief, result);
  const routeLabel = percent >= 100 && quoteHit
    ? "收麦稳准型"
    : percent >= 100 ? "一路问到底型" : percent >= 75 ? "瓜心摸到型" : percent >= 50 ? "半口瓜型" : "热闹开场型";
  const playerType = dailyPlayerType({ percent, quoteHit, accused: result.accused, axis: axisProfile.axis });
  const picked = result.dailyAccuseLabel ? `你最后接住了${result.dailyAccuseLabel}。` : "";
  const firstReveal = result.issueRevealed?.[0] ? `你先接住的是：${result.issueRevealed[0]}。` : "";
  if (brief.plotId === "education-income-fake-profile") {
    return {
      label: routeLabel,
      playerType,
      shareTitle: "存款证明都发了，怎么反而更怪？",
      shareBody: firstReveal || picked || "他不是全假，她也不是只想求安心，流水后面还藏着工资怎么管。",
      shareQuestion: "你听完会觉得是包装，是筛选，还是两边都在试探婚后的钱？"
    };
  }
  return {
    label: routeLabel,
    playerType,
    shareTitle: brief.dailyShareTitle ?? "今日来电有点东西",
    shareBody: firstReveal || picked || brief.dailyShareBody || "我听到了那句没说完的话。",
    shareQuestion: brief.dailyShareQuestion ?? "你会从哪一句开始追？"
  };
}

function dailyPlayerType({ percent, quoteHit, accused, axis }) {
  if (percent >= 100 && quoteHit) return "瓜心狙击手";
  if (percent >= 75 && axis === "caller-credibility") return "反向追问主播";
  if (percent >= 75 && axis === "document-edge") return "截图拆边主播";
  if (percent >= 75 && axis === "money-flow") return "钱流雷达主播";
  if (percent >= 100) return "会听但爱绕路";
  if (percent >= 75) return "差一口主播";
  if (percent >= 50 && accused === "both") return "灰区雷达";
  if (percent >= 50) return "半口瓜侦探";
  if (percent > 0) return "闻味型观众";
  return "弹幕带跑型";
}

function finalQuoteComparison(brief, result = {}) {
  const choices = dailyAccusationChoices(brief);
  const expected = expectedAccusationForCase(brief);
  const best = choices.find((choice) => choice.accuse === expected) ?? choices.find((choice) => choice.accuse === "both") ?? choices[0];
  if (!best) return null;
  const pickedLabel = result.dailyAccuseLabel ?? "";
  const sameQuote = pickedLabel === best.label;
  return {
    pickedLabel: pickedLabel || "还没选最后那句",
    pickedResponse: result.dailyResponse ?? "",
    bestLabel: best.label,
    bestResponse: best.response ?? "",
    sameQuote
  };
}

function finalQuoteComparisonHtml(comparison) {
  const pickedCaption = comparison.sameQuote ? "这句能收住" : "你接的那句";
  if (comparison.sameQuote) {
    return `
      <div class="quote-compare-card quote-compare-card-single">
        <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}<em>接到这里，这通就能收麦了。</em></p>
      </div>
    `;
  }
  const bestCaption = "也可以这样收";
  return `
    <div class="quote-compare-card">
      <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}</p>
      <p><span>${escapeHtml(bestCaption)}</span><b>${escapeHtml(comparison.bestLabel)}</b>${comparison.bestResponse ? `<small>${escapeHtml(comparison.bestResponse)}</small>` : ""}</p>
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
  const alreadyDone = actionDone(brief, actionKey);
  const budget = ensureBudget(brief);
  if (spend && !alreadyDone) {
    budget.remaining = Math.max(0, Number(budget.remaining ?? 0) - 1);
    budget.used = Number(budget.used ?? 0) + 1;
  }
  state.caseActionLog = {
    ...(state.caseActionLog ?? {}),
    [caseKey(brief)]: {
      ...(state.caseActionLog?.[caseKey(brief)] ?? {}),
      [actionKey]: true
    }
  };
}

function audiencePatienceLost(brief) {
  const budget = ensureBudget(brief);
  const allAnswered = answeredSceneCount(brief) >= keyQuestionLimit(brief) && evidenceAnsweredCount(brief) >= evidenceChecksFor(brief).length;
  if (Number(budget.remaining ?? 0) > 0 || allAnswered) return false;
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
    [key]: { max, remaining: max, used: 0 }
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
  const entry = {
    sceneIndex,
    axis: option.routeAxis ?? routeAxisForChoice(option, scene),
    tone: option.routeTone ?? routeToneForChoice(option),
    core: Boolean(option.contradiction),
    question: option.question ?? "",
    answer: option.answer ?? ""
  };
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

function outerAngleReaction(option = {}) {
  if (/太细|不太好听|尴尬/.test(option.answer ?? "")) return "弹幕先吵起尺度：问得细不细，和这张资料为什么出现，是两件事。";
  if (/本科|项目|学制|校名/.test(option.answer ?? "")) return "直播间开始扒标签：图能说明一截，但没说明完整那截。";
  if (/花销|余额|每个月|团购|停车费/.test(option.answer ?? "")) return "弹幕顺着钱吵起来：一笔小钱不定性，但长期别扭会把问题推回流水。";
  if (/工资|流水|小家|不舒服/.test(option.answer ?? "")) return "麦里安静了一下：拒绝流水未必心虚，但这句已经碰到婚后钱怎么管。";
  if (/审批|财务|付款|收款|返款|垫款/.test(option.answer ?? "")) return "弹幕开始对截图：流程慢是一种可能，截图少一页就是另一种味道。";
  if (routeToneForChoice(option) === "softening") return "弹幕有人替 TA 补了一句，麦温往下掉了一格。";
  if (routeToneForChoice(option) === "caller-skeptical") return "这句绕回了来电人自己，弹幕短暂安静了一下。";
  return "直播间接住了这个角度，但人声开始有点散。";
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

function evidenceChecksFor(brief) {
  return Array.isArray(brief?.evidenceChecks) ? brief.evidenceChecks : [];
}

function evidenceAnsweredCount(brief) {
  return evidenceChecksFor(brief).filter((_, index) => actionDone(brief, `evidenceCheck:${index}`)).length;
}

function afterEvidenceScene(brief) {
  return issueCompletion(brief).badge && hasDeepFollowup(brief) ? "deepFollowup" : "accusation";
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
      truth: brief.truth ?? "这通别急着站一边，先把双方没说全的地方补齐。"
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
  return selectedScenePicks(brief).map((pick, index) => ({
    sceneIndex: index,
    axis: pick.routeAxis ?? routeAxisForChoice(pick),
    tone: pick.routeTone ?? routeToneForChoice(pick),
    core: Boolean(pick.contradiction),
    question: pick.question ?? "",
    answer: pick.answer ?? ""
  }));
}

function routeAxisProfile(brief, result = {}) {
  const choices = routeChoicesForCase(brief);
  const counts = routeAxisCounts(choices);
  const [axis, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? ["live-instinct", 0];
  const coreHits = choices.filter((item) => item.core).length;
  const skeptical = choices.filter((item) => item.tone === "caller-skeptical").length;
  const softening = choices.filter((item) => item.tone === "softening").length;
  const label = routeAxisLabel(axis);
  let summary = "你一路按现场听感往前接，路线还没有明显偏向。";
  if (choices.length) {
    if (skeptical > softening && skeptical >= 2) summary = "你不急着相信来电人的版本，会先追她自己没说全的利益和压力。";
    else if (softening > skeptical && softening >= 2) summary = "你会先替双方留下余地，等材料和后续话头自己露出缺口。";
    else if (coreHits === choices.length) summary = "你每段都接得很紧，这通后面就没那么容易散掉。";
    else summary = `你主要沿着${label}推进，中间也绕去听了几句外围解释。`;
  }
  return { axis, label, count, summary, coreHits, total: choices.length };
}

function routeAxisCounts(choices) {
  return choices.reduce((counts, item) => {
    const axis = item.axis ?? "live-instinct";
    counts[axis] = Number(counts[axis] ?? 0) + 1;
    return counts;
  }, {});
}

function routeAxisForChoice(option = {}, scene = {}) {
  const text = `${option.question ?? ""} ${option.answer ?? ""} ${scene.version ?? ""}`;
  if (/你当时|你自己|你妈|家里|心疼|怕|委屈|表现|抢署名|要不要|主动|你是不是|你有没有|起疑|绕着|不踏实|怎么接|怎么回|怎么理解|自己人|拦过|改口|为什么先答应|更慌/.test(option.question ?? "")) return "caller-credibility";
  if (/学历|本科|MBA|名校|老板娘|身份|女朋友|唯一|主责|署名|版本|介绍人|标签|条件/.test(text)) return "identity-wording";
  if (/流水|工资|收入|花销|存款|钱|账|还款|还贷|垫款|返款|付款|收款|费用/.test(text)) return "money-flow";
  if (/截图|图|材料|资料|证明|合同|协议|表|账单|审批|付款状态|账户/.test(text)) return "document-edge";
  if (/流程|财务|供应商|对接人|入口|越级|项目组/.test(text)) return "process-control";
  if (/他|她|TA|对方/.test(option.question ?? "")) return "counterparty-credibility";
  return option.contradiction ? "core-thread" : "outer-thread";
}

function routeToneForChoice(option = {}) {
  const text = `${option.question ?? ""} ${option.answer ?? ""}`;
  if (/你当时|你自己|你妈|是不是也|主动|心疼|想要|接受|表现|抢署名|先谈|起疑|绕着|不踏实|怎么接|怎么回|怎么理解|自己人|拦过|改口|为什么先答应|更慌/.test(text)) return "caller-skeptical";
  if (/有没有可能|会不会|是不是就一定|只是|正常|先只|能不能先/.test(text)) return "softening";
  if (option.contradiction) return "pressure-point";
  return "detour";
}

function routeAxisLabel(axis) {
  const labels = {
    "money-flow": "钱流结构线",
    "document-edge": "材料缺口线",
    "identity-wording": "身份话术线",
    "process-control": "入口控制线",
    "caller-credibility": "来电人可信度线",
    "counterparty-credibility": "对方叙事线",
    "core-thread": "核心矛盾线",
    "outer-thread": "外围试探线",
    "live-instinct": "现场听感线"
  };
  return labels[axis] ?? "现场听感线";
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
  const mark = Number(item.sceneIndex ?? 0) >= keyQuestionLimit(brief) ? "料" : Number(item.sceneIndex ?? 0) + 1;
  return `
    <span>
      <em>${escapeHtml(mark)}</em>
      <b>${escapeHtml(label)}</b>
      ${question ? `<small>${escapeHtml(question)}</small>` : ""}
    </span>
  `;
}

function compactRouteQuestion(question = "") {
  const normalized = String(question).replace(/\s+/g, "");
  if (!normalized) return "";
  return normalized.length > 18 ? `${normalized.slice(0, 18)}...` : normalized;
}

function summarizeStoryPackAxes(briefs, results) {
  const counts = {};
  briefs.forEach((brief, index) => {
    const axis = routeAxisProfile(brief, results[index] ?? {}).axis;
    counts[axis] = Number(counts[axis] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([axis, count]) => ({ axis, count, label: routeAxisLabel(axis) }))
    .sort((a, b) => b.count - a.count);
}

function storyThemeForBriefs(briefs = []) {
  const first = briefs.find(Boolean) ?? {};
  return {
    title: first.storyThemeTitle ?? first.weeklyThemeTitle ?? "今晚收麦",
    thesis: first.storyThemeThesis ?? first.weeklyThemeThesis ?? "几通来电听完，别只听谁声音大，要看最后谁被叫去买单。",
    commentPrompt: first.storyThemeCommentPrompt ?? first.weeklyThemeCommentPrompt ?? "评论区吵到后半夜，吵的都是每个人没说完的半句。"
  };
}

function storyCommentWall(briefs, results, best, avgPercent, theme) {
  const rows = briefs.map((brief, index) => {
    const result = results[index] ?? {};
    const route = routeAxisProfile(brief, result);
    return { brief, result, route };
  });
  const strongest = [...rows].sort((a, b) => Number(b.result.issuePercent ?? 0) - Number(a.result.issuePercent ?? 0))[0];
  const weakest = [...rows].sort((a, b) => Number(a.result.issuePercent ?? 0) - Number(b.result.issuePercent ?? 0))[0];
  const strongestPercent = Number(strongest?.result.issuePercent ?? 0);
  const comments = [
    `「${theme.commentPrompt}」`,
    avgPercent < 40
      ? "「这主播这一集更像在听现场热闹，几通麦都有话没完全翻出来。」"
      : `「这主播这一集明显偏${best.label}，不是爱站队，是看哪句话能落到责任上。」`
  ];
  if (strongest?.brief && strongestPercent > 0) {
    comments.push(`「${strongest.brief.label}那案问得最稳，${strongest.route.label}一出来，前面的体面话就不能按原样听了。」`);
  } else {
    comments.push("「这几通还停在表层，材料、钱和责任几条线都还没完全露出来。」");
  }
  if (avgPercent < 40) {
    comments.push("「这不是站队问题，是今晚几通麦都留了半句话。」");
  } else if (weakest?.brief && Number(weakest.result.issuePercent ?? 0) < 100) {
    comments.push(`「${weakest.brief.label}还差一点，没问到的那半句才是评论区会继续吵的地方。」`);
  } else if (avgPercent >= 90) {
    comments.push("「这几通都问到骨头上了，这种复盘才像现实版逆转裁判，不靠吼，靠把话问实。」");
  } else {
    comments.push("「好看的点是它没有硬判好坏，谁修剪事实、谁转嫁成本，都得一条条摊开。」");
  }
  return comments.slice(0, 4);
}

function storyPlayerType(avgPercent, best) {
  if (avgPercent >= 90 && best.axis === "caller-credibility") return "反向追问型主播";
  if (avgPercent >= 90) return "收麦很稳的主播";
  if (avgPercent < 40) return "外围听感主播";
  if (avgPercent < 65) return "现场嗅觉型主播";
  if (best.axis === "money-flow") return "钱流雷达主播";
  if (best.axis === "document-edge") return "截图拆边主播";
  if (best.axis === "process-control") return "入口控制型主播";
  return "稳扎稳打型主播";
}

function storyShareTitle(avgPercent, best) {
  if (avgPercent >= 90) return "这一晚几通来电，基本都被我问到瓜心了。";
  if (avgPercent < 40) return "这一晚几通来电，我还停在表层热闹里。";
  if (avgPercent < 65) return "这集闻到了一点味儿，但几句最要紧的话还没问出来。";
  if (best.axis === "caller-credibility") return "我这一集最常回头问来电人：你自己还有哪句没说？";
  return `我这一集最常走${best.label}，几通听下来味道不一样。`;
}

function storyPackAftertaste(avgPercent) {
  if (avgPercent >= 90) return "四通麦都压到了后半句。";
  if (avgPercent < 40) return "今晚更多是在听热闹。";
  if (avgPercent < 65) return "有几句话浮上来了。";
  return "几条线都露了头。";
}

function storyPackClosingLine(avgPercent, best = {}) {
  if (avgPercent >= 90) return "这晚问得紧，四通里那些省掉的钱、边界和责任都露了面。";
  if (avgPercent < 40) return "这晚还有不少话没翻出来，适合重开一遍换条线追。";
  if (best.axis === "document-edge") return "你这一晚总爱回头看图，看截图里少了哪一页、哪一边。";
  if (best.axis === "money-flow") return "你这一晚总盯钱最后落到谁身上。";
  return "这晚有几处接住了，也有几句还卡在原话里。";
}

function answerKey(brief, index) {
  return `${caseKey(brief)}:scene:${index}`;
}

function evidenceAnswerKey(brief, index) {
  return `${caseKey(brief)}:evidence:${index}`;
}

function caseKey(brief) {
  return brief?.id ?? "daily";
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
  const budget = ensureBudget(brief);
  const max = Math.max(1, Number(budget.max ?? 1));
  const remaining = Math.max(0, Math.min(max, Number(budget.remaining ?? max)));
  const percent = Math.round((remaining / max) * 100);
  const level = percent <= 28 ? "low" : percent <= 55 ? "mid" : "high";
  return `
    <div class="audience-patience patience-${level}" aria-label="听众忍耐度 ${remaining}/${max}">
      <span>听众忍耐</span>
      <b>${remaining}/${max}</b>
      <i><em style="width:${percent}%"></em></i>
    </div>
  `;
}

function storyPackSummaryHud() {
  const total = state.caseBriefs?.length || 4;
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
  const found = contradictions(brief).length;
  const hook = liveIntentHookFor(brief);
  const comments = found >= 2
    ? ["弹幕刷得快", hook, "话还没完"]
    : found === 1
      ? ["开始对上了", hook, "话没说满"]
      : ["刚接进来", "弹幕在等", hook];
  return `<div class="live-comment-strip">${comments.map((item) => `<span class="live-comment">${item}</span>`).join("")}</div>`;
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
