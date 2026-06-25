import { ATTRIBUTES, CASE_CHAPTERS, CHAPTERS, NPCS } from "./story.js?v=0.19.36";
import { caseModeConfig, generateCasesForMode, normalizeCaseMode } from "./caseModes.js?v=0.19.36";
import { accusationLabel, caseAccusationHint, evidenceInsightFor, explanationForExpected, runCompleteLineFor, structuralResponsibilityText } from "./caseNarration.js?v=0.19.36";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase, structuralExpectedAccusationForCase } from "./caseRuntime.js?v=0.19.36";
import { requiredContradictionsForCase } from "./difficulty.js?v=0.19.36";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.19.36";
import { CHARACTER_ART, MAX_META_BONUS, PUBLIC_PLAYER_GENDER, activeSaveSlot, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.19.36";
import { platformRuntime } from "./platformRuntime.js?v=0.19.36";
import { createScreenRenderers } from "./screens.js?v=0.19.36";
import { accusationView, caseOpenView, evidenceView, sceneReviewView, testimonyView } from "./views/caseInvestigationViews.js?v=0.19.36";
import { caseInterludeView, caseSolvedView, runCompleteView } from "./views/caseRecapViews.js?v=0.19.36";
import { contentWarningView, settingsView } from "./views/systemViews.js?v=0.19.36";

const app = document.querySelector("#app");

let state = loadState() ?? structuredClone(baseState);
let meta = loadMeta();

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.disabled) {
    playSfx("warning");
    return;
  }
  if (button.dataset.nextChapter) {
    playSfx("page");
    return;
  }
  if (button.dataset.settleRun || button.classList.contains("primary")) {
    playSfx("confirm");
    return;
  }
  if (button.dataset.action === "sound") return;
  playSfx("click");
});

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomRange(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function saveState() { saveStateSnapshot(state); }

function saveMeta() { saveMetaSnapshot(meta); }

function resetGame() {
  state = structuredClone(baseState);
  state.saveSlot = activeSaveSlot();
  state.screen = "creator";
  clearStateSnapshot(state.saveSlot);
  render();
}

function randomizeInvestigationProfile() {
  const attrs = {};
  ATTRIBUTES.forEach((attr) => {
    attrs[attr.id] = randomRange(2, 8);
  });
  const boost = randomPick(ATTRIBUTES).id;
  attrs[boost] = Math.min(10, attrs[boost] + randomRange(1, 2));
  return attrs;
}

function setScreen(screen) {
  state.screen = screen;
  saveState();
  render();
}

function addLog(text, type = "记录") {
  state.log.unshift({ type, text });
  state.log = state.log.slice(0, 12);
}

function bumpFlag(name, amount = 1) {
  state.flags[name] = Math.max(0, (state.flags[name] ?? 0) + amount);
}

function finalizeCharacter() {
  state.gender = PUBLIC_PLAYER_GENDER;
  if (!state.specialty) state.specialty = "verification";
  state.attrs = randomizeInvestigationProfile();
  state.profileDone = true;
  state.investigationComplete = false;
  state.caseBriefs = generateCasesForMode(state.caseMode, NPCS, state.attrs, { runNumber: meta.runs ?? 0, specialty: state.specialty, dailyKey: dailyKeyFromUrl() });
  weaveCaseThread();
  state.caseBrief = state.caseBriefs[0] ?? null;
  state.solvedCaseIds = [];
  state.accusationHistory = [];
  state.agencyReputation = 0;
  state.publicHeat = 0;
  state.caseInterludes = {};
  state.caseBudgets = {};
  state.caseActionLog = {};
  state.contradictionLog = {};
  state.evidenceInsights = {};
  state.interrogationNotes = {};
  state.inspirationUsage = {};
  state.selectedEvidenceCard = {};
  state.dialogueProgress = {};
  state.flags = structuredClone(baseState.flags);
  state.lastReaction = null;
  state.runSettled = false;
  state.screen = "chapter";
  if (state.caseBrief?.complainantId) {
    state.primaryNpcId = state.caseBrief.complainantId;
    state.secondaryNpcId = state.caseBrief.respondentId;
    state.selectedFirstDates = [state.caseBrief.complainantId, state.caseBrief.respondentId].filter(Boolean);
    addLog(`${state.caseBrief.label}：${state.caseBrief.openingComplaint}`, "直播连线");
  } else {
    state.selectedFirstDates = [];
  }
  state.chapter = 1;
  state.scene = "caseOpen";
  saveState();
  render();
}

function weaveCaseThread() {
  const briefs = state.caseBriefs ?? [];
  state.caseThread = briefs.map((brief, index) => {
    const role = "今日连线：好友挑战短案";
    brief.threadLink = {
      linkedNpcId: null,
      role,
      line: brief.storyClue ?? "今天只接一通匿名来电，判断都从对话里来。"
    };
    return {
      caseId: brief.id,
      plotId: brief.plotId,
      mode: brief.caseMode,
      linkedNpcId: null,
      role
    };
  });
}

function getNpc(id) {
  return NPCS.find((npc) => npc.id === id);
}

function currentNpc() {
  return getNpc(state.primaryNpcId) ?? getNpc(state.selectedFirstDates[0]);
}

function settleRunExperience() {
  if (state.runSettled) return;
  const pressureScore =
    (state.flags.suspicion ?? 0) +
    (state.flags.parentConflict ?? 0) +
    (state.flags.weddingPressure ?? 0) +
    (state.flags.childPressure ?? 0) +
    (state.flags.householdPressure ?? 0) +
    (state.flags.midlifePressure ?? 0) +
    (state.flags.educationPressure ?? 0) +
    (state.flags.macroEconomyPressure ?? 0) +
    (state.flags.investmentExposure ?? 0) +
    (state.flags.scamExposure ?? 0) +
    (state.flags.exReentryRisk ?? 0) +
    (state.flags.infidelityRisk ?? 0) +
    (state.flags.audiencePressure ?? 0) +
    (state.flags.falseAccusationRisk ?? 0);
  const previousRuns = meta.runs ?? 0;
  const gained = previousRuns < 3 ? 5 : pressureScore >= 8 ? 3 : randomRange(2, 3);
  const solvedCount = (state.accusationHistory ?? []).filter((item) => item.correct).length;
  const totalCases = state.caseBriefs?.length ?? 0;
  meta.runs = (meta.runs ?? 0) + 1;
  meta.bonusPoints = Math.min(MAX_META_BONUS, (meta.bonusPoints ?? 0) + gained);
  meta.history = [
    {
      gained,
      pressureScore,
      at: new Date().toISOString()
    },
    ...(meta.history ?? [])
  ].slice(0, 12);
  state.runSettled = true;
  platformRuntime.achievements.setStat("runs_completed", meta.runs);
  platformRuntime.achievements.setStat("cases_solved_correctly", solvedCount);
  platformRuntime.achievements.unlock("complete_daily_case");
  addLog(`本轮结算：记录 ${gained} 点长期经验。`, "经验记录");
  saveMeta();
  saveState();
  platformRuntime.cloud.syncNow();
  render();
}

function render() {
  if (!state.settings?.contentWarningAccepted) return renderContentWarning();
  if (state.screen === "title") return renderTitle();
  if (state.screen === "settings") return renderSettings();
  if (state.screen === "contribute") return renderContribution();
  if (state.screen === "creator") return renderCreator();
  if (state.screen === "chapter") return renderChapter();
  return renderTitle();
}

function renderContentWarning() {
  app.innerHTML = contentWarningView();
  document.querySelector("[data-accept-content-warning]")?.addEventListener("click", () => {
    state.settings = { ...(state.settings ?? {}), contentWarningAccepted: true };
    saveState();
    render();
  });
}

function renderSettings() {
  layout(settingsView({
    soundEnabled: isSoundEnabled(),
    textSpeed: state.settings?.textSpeed
  }));
  document.querySelector("[data-settings-sound]")?.addEventListener("click", () => {
    toggleSound();
    renderSettings();
  });
  document.querySelectorAll("[data-text-speed]").forEach((button) => {
    button.addEventListener("click", () => {
      state.settings = { ...(state.settings ?? {}), textSpeed: button.dataset.textSpeed };
      saveState();
      renderSettings();
    });
  });
  document.querySelector("[data-clear-current-slot]")?.addEventListener("click", () => {
    clearStateSnapshot();
    state = { ...structuredClone(baseState), saveSlot: activeSaveSlot(), screen: "settings" };
    saveState();
    render();
  });
}

function renderContribution() {
  const submissions = meta.communityCaseSubmissions ?? [];
  app.innerHTML = `
    <section class="creator contribution-screen">
      <div class="panel">
        <p class="eyebrow">案例线索</p>
        <h1>贡献一个婚恋判断题</h1>
        <p class="muted">请只写抽象套路、冲突结构和你觉得该追问的问题。不要写真实姓名、账号、公司、学校、手机号、地址或可识别细节。</p>
        ${state.lastReaction ? `<p class="reaction">${state.lastReaction}</p>` : ""}
        <form class="contribution-form" data-contribution-form>
          <label>
            <span>冲突类型</span>
            <select name="theme">
              <option value="house">房产 / 洗房 / 共同还贷</option>
              <option value="transfer">恋爱转账 / 借赠争议</option>
              <option value="agreement">婚前协议 / 资产隔离</option>
              <option value="trust">信托 / 保险 / 受益人</option>
              <option value="emotion">情绪话术 / 安全感 / 多线关系</option>
              <option value="fraud">反诈 / 平台 / 中介套路</option>
            </select>
          </label>
          <label>
            <span>第一版说法</span>
            <textarea name="caseText" maxlength="260" required placeholder="例如：对方说婚前房写父母名下很正常，但婚后希望用共同账户还贷。"></textarea>
          </label>
          <label>
            <span>你觉得该追问什么</span>
            <textarea name="question" maxlength="180" required placeholder="例如：房本是谁、首付谁出、婚后还贷算什么、退出时怎么补偿。"></textarea>
          </label>
          <label>
            <span>反套路方式或争议点</span>
            <textarea name="countermeasure" maxlength="180" placeholder="例如：婚前协议、流水留痕、份额确认被说成不信任。"></textarea>
          </label>
          <label class="consent-row">
            <input name="consent" type="checkbox" required>
            <span>我确认已去除可识别个人信息，并同意它被抽象改写成游戏素材。</span>
          </label>
          <div class="title-actions creator-actions">
            <button class="primary" type="submit">提交线索</button>
            <button class="secondary" data-action="title" type="button">返回主页</button>
          </div>
        </form>
      </div>
      <aside class="panel loadout-panel">
        <p class="eyebrow">审核规则</p>
        <h2>只收结构，不收原案</h2>
        <div class="scene-list compact-record">
          <p>优先：新套路、新话术、新反制方式、容易被朋友判出分歧的争议。</p>
          <p>拒收：真实姓名、偷拍视频、完整聊天记录、可识别爆料、现实求助。</p>
          <p>入库后会改写为虚构人物、虚构金额和虚构时间线。</p>
        </div>
        <p class="hint">本机已保存 ${submissions.length} 条待审核线索。</p>
      </aside>
    </section>
  `;
  document.querySelector("[data-contribution-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submission = normalizeContribution({
      theme: form.get("theme"),
      caseText: form.get("caseText"),
      question: form.get("question"),
      countermeasure: form.get("countermeasure")
    });
    if (!submission.caseText || !submission.question) {
      state.lastReaction = "线索还太短，至少要写清第一版说法和你想追问的问题。";
      saveState();
      renderContribution();
      return;
    }
    meta.communityCaseSubmissions = [submission, ...(meta.communityCaseSubmissions ?? [])].slice(0, 20);
    saveMeta();
    platformRuntime.wechat.postMessage({ type: "case-submission", submission });
    state.lastReaction = "线索已收下。后续会先抽象成套路卡，再决定是否进入每日案。";
    saveState();
    renderContribution();
  });
  bindCommon();
}

function normalizeContribution(input) {
  return {
    id: `user-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    theme: String(input.theme ?? "verification").slice(0, 32),
    caseText: scrubContributionText(input.caseText, 260),
    question: scrubContributionText(input.question, 180),
    countermeasure: scrubContributionText(input.countermeasure, 180),
    status: "local-pending-review",
    createdAt: new Date().toISOString()
  };
}

function scrubContributionText(value, maxLength) {
  return String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[邮箱已隐藏]")
    .replace(/1[3-9]\d{9}/g, "[手机号已隐藏]")
    .replace(/@[^\s，。,.]{2,24}/g, "[账号已隐藏]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function layout(content, options = {}) {
  app.innerHTML = `
    <section class="shell ${options.sceneClass ?? ""}">
      <header class="topbar">
        <button class="brand" data-action="title" type="button">婚恋侦探事务所</button>
        <nav class="tabs" aria-label="章节">
          ${topbarTabs()}
        </nav>
        <button class="ghost iconish" data-action="sound" type="button">${isSoundEnabled() ? "音效 开" : "音效 关"}</button>
        <button class="ghost" data-action="reset" type="button">重开</button>
      </header>
      <div class="stage">
        ${content}
      </div>
    </section>
  `;
  bindCommon();
}

function bindCommon() {
  document.querySelector('[data-action="reset"]')?.addEventListener("click", resetGame);
  document.querySelector('[data-action="title"]')?.addEventListener("click", () => setScreen("title"));
  document.querySelector('[data-action="sound"]')?.addEventListener("click", () => {
    toggleSound();
    render();
  });
}

function screenContext() {
  return { state, meta, layout, setScreen, saveState, render, finalizeCharacter, app, resetGame, isSoundEnabled, toggleSound };
}

function screenRenderers() { return createScreenRenderers(screenContext()); }

function renderTitle() { screenRenderers().renderTitle(); }

function renderCreator() { screenRenderers().renderCreator(); }

function dailyKeyFromUrl() {
  try {
    const key = new URLSearchParams(globalThis.location?.search ?? "").get("dailyKey");
    return /^\d{4}-\d{2}-\d{2}$/.test(key ?? "") ? key : undefined;
  } catch {
    return undefined;
  }
}

function renderChapter() {
  if (state.caseBriefs?.length && !state.investigationComplete) return renderCaseInvestigation();
  return renderTitle();
}

function activeCaseBrief() {
  const index = Math.max(0, Math.min((state.chapter ?? 1) - 1, (state.caseBriefs?.length ?? 1) - 1));
  const brief = state.caseBriefs?.[index] ?? state.caseBrief;
  let changed = false;
  if (state.caseBrief !== brief) {
    state.caseBrief = brief;
    changed = true;
  }
  if (normalizeBriefCopy(brief)) changed = true;
  if (brief?.plotId === "education-income-fake-profile" && String(state.lastReaction ?? "").includes("我没开口要证明")) {
    state.lastReaction = "我当时停了一下：是他主动发的。我没开口让他发这些，他自己先把标签摆出来了。";
    changed = true;
  }
  const hadBudget = brief ? Boolean(state.caseBudgets?.[caseNoteKey(brief)]) : true;
  ensureCaseBudget(brief);
  if (!hadBudget) changed = true;
  if (brief?.complainantId && !state.primaryNpcId) {
    state.primaryNpcId = brief.complainantId;
    changed = true;
  }
  if (changed) saveState();
  return brief;
}

function normalizeBriefCopy(brief) {
  if (!brief) return false;
  let changed = false;
  const taskSummaries = {
    audit: "钱说得急，谁来扛却还没落到人。",
    emotion: "情绪很满，有人一直把问题推回爱不爱。",
    verification: "标签都好看，截图却总少一块。"
  };
  if (brief.taskProfile?.id && taskSummaries[brief.taskProfile.id] && brief.taskProfile.summary !== taskSummaries[brief.taskProfile.id]) {
    const taskLabels = {
      audit: "钱款说不清",
      emotion: "情绪卡住了",
      verification: "资料有雾"
    };
    brief.taskProfile = {
      ...brief.taskProfile,
      label: taskLabels[brief.taskProfile.id] ?? brief.taskProfile.label,
      summary: taskSummaries[brief.taskProfile.id]
    };
    changed = true;
  }
  const dailySummaries = {
    "lost-job-hidden-credit": "这通先听清：钱从哪里来、花到谁身上、最后谁来扛。",
    "house-name-security-test": "这通先稳住：房子、还贷、退路，哪一句没说清。",
    "tony-multi-dating": "这通看反应：谁被放进不同分组，谁在被哄着付出。",
    "education-income-fake-profile": "这通先听清：证明为什么出现，又是谁借父母的嘴把话推过去。"
  };
  if (brief.plotId && dailySummaries[brief.plotId] && brief.storyArcSummary !== dailySummaries[brief.plotId]) {
    brief.storyArcSummary = dailySummaries[brief.plotId];
    changed = true;
  }
  const dailyTitles = {
    "lost-job-hidden-credit": "8 万信用卡周转",
    "house-name-security-test": "婚前房与共同还贷",
    "tony-multi-dating": "理发店排班表",
    "education-income-fake-profile": "存款证明"
  };
  if (brief.plotId && dailyTitles[brief.plotId]) {
    if (brief.label !== dailyTitles[brief.plotId]) {
      brief.label = dailyTitles[brief.plotId];
      changed = true;
    }
    const safeStoryTitle = `今日连线：${dailyTitles[brief.plotId]}`;
    if (brief.storyArcTitle !== safeStoryTitle) {
      brief.storyArcTitle = safeStoryTitle;
      changed = true;
    }
  }
  if (brief.dailyCase && brief.scene?.name !== "直播连线") {
    brief.scene = { ...(brief.scene ?? {}), name: "直播连线" };
    changed = true;
  }
  if (normalizeOpeningDialogueLines(brief)) changed = true;
  if (normalizePlayableFakeProfileCase(brief)) changed = true;
  if (normalizeHiddenClueConfig(brief)) changed = true;
  if (normalizeDailyOpeningAtmosphere(brief)) changed = true;
  return changed;
}

function normalizeDailyOpeningAtmosphere(brief) {
  if (!brief) return false;
  const opening = dailyOpeningAtmosphereLines(brief);
  if (!opening) return false;
  const current = Array.isArray(brief.openingDialogue) ? brief.openingDialogue : [];
  const currentSignature = current
    .filter((line) => line.role !== "other")
    .map((line) => `${line.role}:${line.text}`)
    .join("|");
  const nextSignature = opening.map((line) => `${line.role}:${line.text}`).join("|");
  if (currentSignature === nextSignature) return false;
  brief.openingDialogue = opening;
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [dialogueProgressKey(brief, "caseOpen")]: 0
  };
  return true;
}

function dailyOpeningAtmosphereLines(brief) {
  const name = getNpc(brief.complainantId)?.name ?? brief.openingDialogue?.find((line) => line.role === "caller")?.speaker ?? "来访者";
  const plotId = inferDailyPlotId(brief);
  const templates = {
    "lost-job-hidden-credit": [
      { speaker: name, role: "caller", text: "主播你好，我有点不敢跟朋友讲。TA 让我先垫 8 万信用卡，可那周我们还去了很贵的纪念日晚餐。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好，这事听着不只是手头紧。TA 第一次提钱时，原话怎么说？", mood: "listening" }
    ],
    "house-name-security-test": [
      { speaker: name, role: "caller", text: "主播你好，我不是非要房子。婚前房写 TA 父母名下，可婚后又说我们一起还贷才像一家人。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。合同上写谁、家里怎么说还贷，你从这两处讲。", mood: "listening" }
    ],
    "tony-multi-dating": [
      { speaker: name, role: "caller", text: "主播你好，我现在手还是凉的。我看到一张排班表，里面不是名字，是“情绪稳定”“能投店”这种备注。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。看到那张表之前，他平时怎么和你相处？", mood: "listening" }
    ],
    "education-income-fake-profile": [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。你们怎么认识的，现在聊到哪一步了？", mood: "listening" },
      { speaker: name, role: "caller", text: "我们是相亲认识的，最近聊到见父母。我之前跟家里说过他条件不错，我妈就问得细了一点。", mood: "thinking" },
      { speaker: "你", role: "host", text: "她具体问了什么？你当时怎么接的？", mood: "listening" },
      { speaker: name, role: "caller", text: "我妈问学校、工作、收入稳不稳，还顺口问了一句有没有点积蓄。我跟他说的时候可能没那么顺口。他第二天发来几张截图，最后还补了一张存款证明。", mood: "anxious" }
    ]
  };
  return templates[plotId] ?? null;
}

function inferDailyPlotId(brief) {
  if (brief?.plotId) return brief.plotId;
  const text = `${brief?.label ?? ""} ${brief?.storyArcTitle ?? ""} ${brief?.publicHook ?? ""}`;
  if (text.includes("三张截图") || text.includes("存款证明")) return "education-income-fake-profile";
  if (text.includes("8 万信用卡") || text.includes("信用卡周转")) return "lost-job-hidden-credit";
  if (text.includes("婚前房") || text.includes("共同还贷")) return "house-name-security-test";
  if (text.includes("理发店排班表") || text.includes("排班表")) return "tony-multi-dating";
  return brief?.plotId ?? null;
}

function normalizeOpeningDialogueLines(brief) {
  if (!Array.isArray(brief?.openingDialogue)) return false;
  let changed = false;
  brief.openingDialogue = brief.openingDialogue.map((line) => {
    const text = normalizedOpeningLineText(brief.plotId, line.role, line.text);
    if (text !== line.text) {
      changed = true;
      return { ...line, text };
    }
    return line;
  });
  return changed;
}

function normalizedHostOpeningText(plotId, fallback) {
  const mapped = {
    "lost-job-hidden-credit": "晚上好，这事听着不只是手头紧。TA 第一次提钱时，原话怎么说？",
    "house-name-security-test": "晚上好。合同上写谁、家里怎么说还贷，你从这两处讲。",
    "tony-multi-dating": "晚上好。看到那张表之前，他平时怎么和你相处？",
    "education-income-fake-profile": "她具体问了什么？你当时怎么接的？"
  }[plotId];
  const text = String(fallback ?? "");
  if (mapped && /别先问|你先说|先别|先不用|先把|被裁掉的是哪三栏|怎么认识|怎么介绍自己条件|一开始.*介绍/.test(text)) return mapped;
  return text.replace(/^先别[^。？?]*[。？?]\s*/, "");
}

function normalizedOpeningLineText(plotId, role, fallback) {
  if (role === "host") return normalizedHostOpeningText(plotId, fallback);
  const text = String(fallback ?? "");
  const callerMapped = {
    "lost-job-hidden-credit": "主播你好，我有点不敢跟朋友讲。TA 让我先垫 8 万信用卡，可那周我们还去了很贵的纪念日晚餐。",
    "house-name-security-test": "主播你好，我不是非要房子。婚前房写 TA 父母名下，可婚后又说我们一起还贷才像一家人。",
    "tony-multi-dating": "主播你好，我现在手还是凉的。我看到一张排班表，里面不是名字，是“情绪稳定”“能投店”这种备注。",
    "education-income-fake-profile": "主播你好，我想问下我男朋友的事。"
  }[plotId];
  if (role === "caller" && callerMapped && !text.includes("主播你好")) return callerMapped;
  if (
    plotId === "education-income-fake-profile" &&
    role === "caller" &&
    /公司抬头|硕士项目年限|收入流水|他听说以后，第二天主动发/.test(text)
  ) {
    return "我妈问学校、工作、收入稳不稳，还顺口问了一句有没有点积蓄。我跟他说的时候可能没那么顺口。他第二天发来几张截图，最后还补了一张存款证明。";
  }
  return text;
}

function normalizeHiddenClueConfig(brief) {
  if (brief?.plotId !== "education-income-fake-profile") return false;
  let changed = false;
  const groups = [
    [
      "存款证明的出现不是单方主动展示，咨询者转述父母问题时也把压力递了过去。",
      "存款证明是双方你推我接出来的，不是单方凭空炫耀。"
    ],
    [
      "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。",
      "对方把补材料的问题推成信任问题，避开了具体内容。"
    ],
    [
      "多份材料同时避开择偶定位核心。",
      "咨询者也在用存款证明维护自己先前转述过的体面印象。",
      "证明真假被拿来挡住证明用途、时间和完整性的追问。",
      "存款证明被用来换取饭局继续，但完整信息被推到见面之后。"
    ]
  ];
  if (JSON.stringify(brief.explicitClueGroups ?? []) !== JSON.stringify(groups)) {
    brief.explicitClueGroups = groups;
    changed = true;
  }
  const cards = Array.isArray(brief.evidenceCards) ? brief.evidenceCards : [];
  brief.evidenceCards = cards.map((card) => {
    if (card.id === "daily-profile-job" && card.type === "岗位核验") {
      changed = true;
      return { ...card, type: "岗位材料" };
    }
    return card;
  });
  if (!brief.evidenceCards.some((card) => card.id === "daily-profile-deposit")) {
    brief.evidenceCards.push({
      id: "daily-profile-deposit",
      type: "存款证明",
      title: "余额截图",
      front: "余额数字清楚，开户时间、冻结状态和账户用途没露出。",
      detail: "能证明有一笔钱，不等于证明这笔钱稳定、可用、属于长期积蓄。",
      targets: ["truthWithGap", "sceneHint"],
      contradiction: "存款证明只露余额，不露时间、冻结状态和账户用途。"
    });
    changed = true;
  }
  return changed;
}

function legacyBackendLabel() {
  return ["后", "台"].join("");
}

function normalizePlayableFakeProfileCase(brief) {
  if (brief?.plotId !== "education-income-fake-profile") return false;
  let changed = false;
  const hadDepositStory = JSON.stringify({
    sceneVersions: brief.sceneVersions,
    testimony: brief.testimony,
    stageJudgement: brief.stageJudgement,
    dailyShareBody: brief.dailyShareBody
  }).includes("存款证明");
  const complainant = "咨询者";
  const respondent = "对方";
  const sceneVersions = [
    {
      speakerId: brief.complainantId,
      speaker: complainant,
      version: "见父母前，我手里现在是三张截图，加一张存款证明。学校、工作、收入是他先发的；但存款那张，我真说不清是他主动补，还是我把我妈的话转得太像在要。",
      doubt: "材料不是凭空出现的，存款证明尤其卡在父母、咨询者和对方三个人的面子中间。",
      contradiction: "存款证明的出现不是单方主动展示，咨询者转述父母问题时也把压力递了过去。",
      reliability: "mixed",
      questionOptions: [
        { question: "你把你转给他的原话说一下。", answer: "我说的是：我妈可能会问收入稳不稳、有没有点存款，你别到时候被问住。说完我自己也觉得，这话不像只是提醒。", contradiction: "咨询者借父母的提问，把存款压力提前递给了对方。", correct: true },
        { question: "存款证明这四个字是谁先说的？", answer: "我想了一下：不是我妈直接说证明，是我转述得太像在要一个能交代的东西。", correct: false },
        { question: "你当时为什么收下那张证明？", answer: "因为我已经跟家里说他条件不错。看到那张证明，我确实松了一口气。", correct: false }
      ]
    },
      {
        speakerId: brief.complainantId,
        speaker: complainant,
        version: "我刚才又看了一眼，几张图都不像 P 的。学校那张有校徽，公司那张有尾缀，收入那张有数字，存款证明上也有余额。可每一张都停在最好看的地方。",
        doubt: "这不是当场打假，而是用真的局部制造足够体面的第一印象。",
      contradiction: "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。",
      reliability: "partial",
      questionOptions: [
        { question: "你让他把几张图边上那一块补全了吗？", answer: "我把图往上划了：学校那张右边多出项目名称，公司那张下面露出签约主体，收入那张后面还有绩效说明。存款证明没露开户时间和是否冻结。", contradiction: "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。", correct: true },
        { question: "他听见你问原图，第一反应是什么？", answer: "我记得他回得很快：你要这么想我也没办法。图没补全，话先变成了信不信任。", correct: false },
        { question: "如果他愿意补全原图，你还会介意吗？", answer: "如果他愿意把学制、合同主体、完整收入和存款证明边缘都补全，我会少一点不安。可问题不是介不介意，是为什么一开始只露够我拿回家交代的那部分。", correct: false }
      ]
    },
      {
        speakerId: brief.complainantId,
        speaker: complainant,
        version: "我把他后来那句回复念出来：“你家里要看稳定，我给了；你又说我像在表演。那我到底要怎么做？先把饭吃了，别一上来就把我当面试。”",
      doubt: "这句不只是防御，也把父母的筛选、咨询者的转述和他的体面展示全搅在一起。",
      contradiction: "对方把补全材料的问题推成被面试，但没有解释为什么每份材料都只露到够体面的地方。",
      reliability: "partial",
      questionOptions: [
          { question: "他这句里最想让你接受的是什么？", answer: "他想让我承认：是我家先把问题问得像筛选，所以他发材料只是被逼出来的体面。", correct: false },
          { question: "你再看一遍，他有没有解释存款证明缺的那几项？", answer: "没有。他只反复说证明是真的，把问题从完整信息挪到真假二选一。", contradiction: "证明真假被拿来挡住证明用途、时间和完整性的追问。", correct: true }
      ]
    }
  ];
  const hasWrongSceneQuestionShape = (brief.sceneVersions ?? []).some((item) => {
    const options = item?.questionOptions ?? [];
    return options.filter((option) => option.correct !== false).length !== 1;
  });
  if (
    !JSON.stringify(brief.sceneVersions ?? []).includes("存款证明") ||
    hasWrongSceneQuestionShape ||
    brief.sceneVersions?.[0]?.version?.includes("985、硕士、金融、父母稳定") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("缺口都落在关系决策") ||
    JSON.stringify(brief.sceneVersions ?? []).includes(`把原图边缘发${legacyBackendLabel()}`) ||
    JSON.stringify(brief.sceneVersions ?? []).includes("这句解释最该怎么问") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("回拨新情况") ||
    JSON.stringify(brief.sceneVersions ?? []).includes(`我把三张截图发${legacyBackendLabel()}`) ||
    JSON.stringify(brief.sceneVersions ?? []).includes(`${legacyBackendLabel()}把三张图`) ||
    JSON.stringify(brief.sceneVersions ?? []).includes("我没开口要证明") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("边缘一补出来") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("学制那行、合同主体和收入完整页") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("条件听着已经不错") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("三张图都是真的") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("她想了一下") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("她把图往上划") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("对方解释说") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("林鹿") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("周砚") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("我手里有三张截图。每张都挺体面") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("怕我多想") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("最想推进") ||
    JSON.stringify(brief.sceneVersions ?? []).includes("急着推进") ||
    brief.sceneVersions?.[0]?.questionOptions?.some((option) => option.question === "你最想先核哪一栏？")
  ) {
    brief.sceneVersions = sceneVersions;
    changed = true;
  }
  if (
    !JSON.stringify(brief.testimony ?? []).includes("存款证明") ||
    brief.testimony?.[0]?.line?.includes("每一句都比实际情况听起来高半档") ||
    brief.testimony?.[1]?.line?.includes("公司抬头、学制和收入栏被裁掉") ||
    JSON.stringify(brief.testimony ?? []).includes("简历截图") ||
    JSON.stringify(brief.testimony ?? []).includes(`${legacyBackendLabel()}把没露出的地方`) ||
    JSON.stringify(brief.testimony ?? []).includes("主播记事") ||
    JSON.stringify(brief.testimony ?? []).includes("资料核验不是势利") ||
    JSON.stringify(brief.testimony ?? []).includes("你知道她会按更高那档理解吗") ||
    JSON.stringify(brief.testimony ?? []).includes("你把原话复述一遍") ||
    JSON.stringify(brief.testimony ?? []).includes("你是不是想找更有钱") ||
    JSON.stringify(brief.testimony ?? []).includes("林鹿") ||
    JSON.stringify(brief.testimony ?? []).includes("周砚") ||
    JSON.stringify(brief.testimony ?? []).includes("还喜不喜欢")
  ) {
    brief.testimony = [
      {
        speakerId: brief.complainantId,
        speaker: complainant,
        line: "“我不是想查他存款。我也承认，我之前跟家里说过他条件不错，所以他发来那张证明时，我其实松了一口气。”",
        kind: "halfLie",
        surface: "咨询者自己的面子压力",
        hint: "她也有自己的位置要维护，这会影响她为什么一开始没有追问。",
        followups: [
          { question: "所以你也不想让家里觉得自己看走眼？", result: "我其实有点不敢承认：对。我已经把话说出去了，所以我也希望那张证明是真的够稳。", contradiction: "咨询者也在用存款证明维护自己先前转述过的体面印象。" },
          { question: "你家里真正想从这些材料里确认什么？", result: "我妈嘴上说是看稳定，其实是想知道我带回去的人能不能跟我之前说的条件对上。我也怕前后说法打脸，他也怕饭局前被看低，所以那几张图才会变得这么有用。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: complainant,
        line: "“那些图都不一定假。学校标识、公司尾缀、薪资数字和存款余额都是真的一部分。只是它们刚好够我拿去跟家里交代。”",
        kind: "truthWithGap",
        surface: "真图没露出的地方",
        hint: "现在要看几份材料少掉的是不是同一种信息。",
        followups: [
          { question: "你把没露出来的边缘按顺序说一遍。", result: "我一张张看下来：学制、合同主体、完整收入页，还有存款证明的开户时间和冻结状态，都是父母真正会追问的部分。", contradiction: "多份材料同时避开择偶定位核心。" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: complainant,
        line: "“后来他回我：你家不是想看稳定吗？我给了，又说我表演。那这饭还吃不吃？”",
        kind: "sceneHint",
        surface: "聊天原话",
        hint: "这时候不用替谁定性，只看他有没有把话说全。",
        followups: [
          { question: "你把这句后面他怎么接的说完。", result: "他后面接的是：先见了面，别让一张证明把两个人都弄得难看。", contradiction: "存款证明被用来换取饭局继续，但完整信息被推到见面之后。" }
        ]
      }
    ];
    changed = true;
  }
  const dailyFields = {
    publicHook: "见父母前，他发来学校、工作、收入截图，还补了一张存款证明。最怪的不是图，而是谁先把存款这两个字说出口。",
    storyClueObject: "几张资料截图和一张存款证明",
    openingComplaint: "咨询者连线说：“我想问下我男朋友的事。我们是相亲认识的，最近聊到见父母，他发了学校、工作、收入截图，后面又补了一张存款证明。我越看越觉得，这事不像他一个人突然想出来的。”",
    stageJudgement: "听到这里：这通电话不能直接定骗。学制、合同主体、收入和存款证明都只露好看的局部，父母真正会追问的完整信息被留在饭局后面。",
    followupTwist: "后续回拨：对方没有否认裁切，只说“你们家不是要看稳定吗，先把饭吃了”。咨询者沉默了一下，说她也不确定那句是不是自己先递过去的。",
    dailyShareTitle: "存款证明都发了，怎么反而更怪？",
    dailyShareBody: "今晚最好吵的是：存款证明不是突然冒出来的，谁先想看都说不清。",
    dailyShareQuestion: "你听完会觉得是包装，是试探，还是双方都在借父母的嘴？",
    truth: "存款证明不一定假，但它的出现本身就是关系压力的一部分。父母的筛选、咨询者的面子和对方的体面展示一起把饭局推向了更高门槛。"
  };
  Object.entries(dailyFields).forEach(([key, value]) => {
    if (brief[key] !== value) {
      brief[key] = value;
      changed = true;
    }
  });
  if (changed && !hadDepositStory) {
    clearCaseAttemptState(brief);
    state.scene = "caseOpen";
    state.lastReaction = null;
  }
  const staleAccusation = (state.accusationHistory ?? []).some((item) =>
    item.caseId === brief.id &&
    item.dailyAccuseLabel &&
    !String(item.dailyAccuseLabel).includes("存款证明")
  );
  if (staleAccusation) {
    clearCaseAttemptState(brief);
    state.scene = "caseOpen";
    state.lastReaction = null;
    changed = true;
  }
  return changed;
}

function renderCaseInvestigation() {
  const brief = activeCaseBrief();
  if (!brief) return renderTitle();
  const chapter = caseChapterTitle(brief, state.chapter - 1);
  if (state.scene === "sceneReview") return renderCaseSceneReview(brief, chapter);
  if (state.scene === "testimony") return renderCaseTestimony(brief, chapter);
  if (state.scene === "evidence") return renderCaseEvidence(brief, chapter);
  if (state.scene === "accusation") return renderCaseAccusation(brief, chapter);
  if (state.scene === "caseSolved") return renderCaseSolved(brief, chapter);
  if (state.scene === "caseInterlude") return renderCaseInterlude(brief, chapter);
  if (state.scene === "runComplete") return renderCaseRunComplete(brief, "今晚收麦");
  return renderCaseOpen(brief, chapter);
}

function topbarTabs() {
  if (state.caseBriefs?.length && !state.investigationComplete) {
    return state.caseBriefs.map((brief, index) => `<span class="${state.chapter === index + 1 ? "active" : ""}">${caseShortTitle(brief, index)}</span>`).join("");
  }
  return CHAPTERS.map((chapter) => `<span class="${state.chapter === Number(chapter.id.slice(2)) ? "active" : ""}">${chapter.title.split("：")[0]}</span>`).join("");
}

function caseShortTitle(brief, index) {
  if (brief?.storyArcTitle) return brief.storyArcTitle.split("：")[0];
  return CASE_CHAPTERS[index]?.title?.split("：")[0] ?? `第 ${index + 1} 案`;
}

function caseChapterTitle(brief, index) {
  return brief?.storyArcTitle ?? CASE_CHAPTERS[index]?.title ?? `第 ${index + 1} 案：${brief?.modeLabel ?? "婚恋 case"}`;
}

function caseSetLabel() {
  const count = state.caseBriefs?.length ?? 0;
  return `${caseModeConfig(state.caseMode).title}（共 ${count} 案）`;
}

function caseSetSummary() {
  return caseModeConfig(state.caseMode).summary;
}

function renderCaseOpen(brief, chapter) {
  state.primaryNpcId = brief.complainantId;
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  const opening = playthroughOpening(brief);
  let openingDialogue = openingDialogueForCase(brief, opening, complainant?.name ?? "来访者", respondent?.name ?? "另一方");
  if (openingDialogue.length < 2) {
    const openingText = openingDialogue.map((line) => line.text ?? "").join(" ");
    const inferredPlotId = /男朋友|相亲|截图/.test(openingText)
      ? "education-income-fake-profile"
      : null;
    const inferredOpening = dailyOpeningAtmosphereLines({
      ...brief,
      plotId: inferredPlotId ?? brief.plotId,
      storyArcTitle: `${brief.storyArcTitle ?? ""} ${chapter ?? ""}`
    });
    if (inferredOpening?.length) {
      openingDialogue = inferredOpening
        .filter((line) => line.role !== "other")
        .map((line) => ({
          ...line,
          speaker: line.role === "host" ? "你" : "咨询者"
        }));
    }
  }
  const openingStep = Math.max(0, openingDialogue.length - 1);
  const currentOpeningLine = openingDialogue[openingStep] ?? openingDialogue[0] ?? null;
  const visibleOpeningDialogue = openingDialogue;
  const hasMoreOpening = false;
  window.__loveOpeningNext = null;
  const view = caseOpenView({
    chapter,
    brief,
    openingDialogue: visibleOpeningDialogue,
    hasMoreOpening,
    openingTotal: openingDialogue.length,
    openingStep,
    showStreamline: false,
    scanDisabled: caseActionDisabled(brief, "scan:summary")
  });
  storyFrame({
    ...view,
    speakerName: currentOpeningLine?.speaker,
    portraitMood: currentOpeningLine?.mood ?? (currentOpeningLine?.role === "host" ? "listening" : "anxious")
  });
  document.querySelector("[data-case-scene]")?.addEventListener("click", () => moveCaseScene("sceneReview"));
  document.querySelector("[data-case-scan]")?.addEventListener("click", () => {
    if (!spendCaseAction(brief, "scan:summary")) return rerenderWithSave();
    bumpFlag("evidenceClarity", 1);
    recordEvidenceInsight(brief, "先把来电里没讲完的那一句记下来。");
    state.lastReaction = "你压低声音：先别急，听她把话说完。";
    moveCaseScene("evidence");
  });
}

function renderCaseSceneReview(brief, chapter) {
  const sceneIndex = currentSceneVersionIndex(brief);
  const currentVersion = brief.sceneVersions?.[sceneIndex] ?? brief.sceneVersions?.[0] ?? null;
  const totalVersions = brief.sceneVersions?.length ?? 0;
  const completedDialogueCount = (brief.sceneVersions ?? []).filter((_, index) => actionDone(brief, `version:${index}`)).length;
  const view = sceneReviewView({
    chapter,
    brief,
    sceneIndex,
    currentVersion,
    totalVersions,
    versionStates: (brief.sceneVersions ?? []).map((_, index) => ({
      disabled: caseActionDisabled(brief, `version:${index}`),
      done: actionDone(brief, `version:${index}`)
    })),
    optionStates: (brief.sceneVersions ?? []).map((item, index) => {
      const options = Array.isArray(item?.questionOptions) && item.questionOptions.length
        ? item.questionOptions
        : sceneQuestionOptionsForRuntime(item, index);
      return options.map((_, optionIndex) => ({
        disabled: caseActionDisabled(brief, `sceneQuestion:${index}:${optionIndex}`)
      }));
    }),
    canDiscussProblem: completedDialogueCount >= Math.min(2, Math.max(1, totalVersions))
  });
  storyFrame({ ...view, portraitMood: "thinking" });
  document.querySelectorAll("[data-version-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const [versionIndex, optionIndex] = button.dataset.versionQuestion.split(":").map(Number);
      const actionKey = `sceneQuestion:${versionIndex}:${optionIndex}`;
      if (!spendCaseAction(brief, actionKey)) return rerenderWithSave();
      const item = brief.sceneVersions[versionIndex];
      const option = sceneQuestionOption(item, versionIndex, optionIndex);
      if (item?.speakerId && (item.speakerId === brief.complainantId || shouldShowRespondentLive(brief))) state.primaryNpcId = item.speakerId;
      if (option.correct !== false) {
        spendCaseAction(brief, `version:${versionIndex}`, 0);
        recordContradiction(brief, option.contradiction ?? item?.contradiction ?? "这个现场版本有无法自洽的地方。");
        state.lastReaction = option.answer ?? "TA 又把前后话补了一句。";
      } else {
        registerLiveMisstep(brief);
        state.lastReaction = option.answer ?? liveMisstepReply(item, "scene");
      }
      saveState();
      render();
    });
  });
  document.querySelector("[data-scene-version-prev]")?.addEventListener("click", () => setSceneVersionIndex(brief, sceneIndex - 1));
  document.querySelector("[data-scene-version-next]")?.addEventListener("click", () => setSceneVersionIndex(brief, sceneIndex + 1));
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function sceneQuestionOption(item, index, optionIndex) {
  const options = Array.isArray(item?.questionOptions) && item.questionOptions.length
    ? item.questionOptions
    : sceneQuestionOptionsForRuntime(item, index);
  return options[optionIndex] ?? options[0];
}

function sceneQuestionOptionsForRuntime(item, index) {
  return [
    {
      question: index === 2 ? "这份材料只能证明哪一部分？" : "你刚才省略的是哪一段？",
      answer: item?.contradiction ?? "这段说法里有一个事实缺口被问出来了。",
      contradiction: item?.contradiction,
      correct: true
    },
    {
      question: index === 0 ? "你先说说，这句话当时让你最难受的是哪一段？" : "这句先放着，听下一句怎么接。",
      answer: `${item?.speaker ?? "对方"} 顺着情绪继续讲，但关键事实暂时没有往前走。`,
      correct: false
    }
  ];
}

function renderCaseTestimony(brief, chapter) {
  const testimonyIndex = currentTestimonyIndex(brief);
  const currentTestimony = brief.testimony?.[testimonyIndex] ?? brief.testimony?.[0] ?? null;
  if (currentTestimony?.speakerId && (currentTestimony.speakerId === brief.complainantId || shouldShowRespondentLive(brief))) {
    state.primaryNpcId = currentTestimony.speakerId;
  }
  const followupStates = {};
  brief.testimony.forEach((item, index) => {
    (item.followups ?? []).forEach((_, followupIndex) => {
      const actionKey = `followup:${index}:${followupIndex}`;
      followupStates[`${index}:${followupIndex}`] = {
        disabled: caseActionDisabled(brief, actionKey),
        done: actionDone(brief, actionKey)
      };
    });
  });
  storyFrame({
    ...testimonyView({
      chapter,
      brief,
      testimonyIndex,
      currentTestimony,
      followupStates
    }),
    portraitMood: testimonyMood(currentTestimony)
  });
  document.querySelectorAll("[data-followup]").forEach((button) => {
    button.addEventListener("click", () => {
      const [testimonyIndex, followupIndex] = button.dataset.followup.split(":").map(Number);
      const actionKey = `followup:${testimonyIndex}:${followupIndex}`;
      if (!spendCaseAction(brief, actionKey)) return rerenderWithSave();
      const item = brief.testimony[testimonyIndex];
      const followup = item?.followups?.[followupIndex];
      if (item?.speakerId && (item.speakerId === brief.complainantId || shouldShowRespondentLive(brief))) state.primaryNpcId = item.speakerId;
      if (followup?.correct === false) {
        registerLiveMisstep(brief);
        state.lastReaction = followup.result ?? liveMisstepReply(item, "testimony");
        saveState();
        render();
        return;
      }
      bumpFlag("evidenceClarity", 1);
      recordInterrogation(brief, followup?.question ?? item?.hint);
      if (followup?.contradiction) recordContradiction(brief, followup.contradiction);
      state.lastReaction = followup?.result ?? "TA 把刚才没说完的地方又补了一句。";
      saveState();
      render();
    });
  });
  document.querySelector("[data-testimony-prev]")?.addEventListener("click", () => setTestimonyIndex(brief, testimonyIndex - 1));
  document.querySelector("[data-testimony-next]")?.addEventListener("click", () => setTestimonyIndex(brief, testimonyIndex + 1));
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseEvidence(brief, chapter) {
  const readiness = dailyAccusationReadiness(brief);
  storyFrame({
    ...evidenceView({
      chapter,
      brief,
      evidenceStates: {
        timeline: caseActionDisabled(brief, "evidence:timeline"),
        money: caseActionDisabled(brief, "evidence:money"),
        motive: caseActionDisabled(brief, "evidence:motive")
      },
      canAccuse: readiness.ready,
      readinessHint: readiness.message
    }),
    portraitMood: "focused"
  });
  document.querySelectorAll("[data-evidence]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.evidence;
      if (!spendCaseAction(brief, `evidence:${type}`)) return rerenderWithSave();
      bumpFlag("evidenceClarity", 1);
      if (type === "money") bumpFlag("assetProtection", 1);
      if (type === "motive") bumpFlag("suspicion", 1);
      const insight = evidenceInsightFor(brief, type);
      recordEvidenceInsight(brief, insight);
      recordContradiction(brief, `追问整理：${insight}`);
      state.lastReaction = "你把刚才那几句放慢念了一遍。";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseAccusation(brief, chapter) {
  const readiness = dailyAccusationReadiness(brief);
  if (!readiness.ready) {
    state.lastReaction = readiness.message;
    state.scene = "testimony";
    saveState();
    return render();
  }
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  const structuralChoice = structuralExpectedAccusation(brief)
    ? `<button data-accuse="${structuralExpectedAccusation(brief)}" type="button">${structuralAccusationButtonText(brief)}</button>`
    : "";
  storyFrame({
    ...accusationView({
      chapter,
      brief,
      hint: caseAccusationHint(brief),
      complainantName: brief.dailyCase ? "咨询者" : complainant?.name ?? "先诉苦者",
      respondentName: brief.dailyCase ? "对方" : respondent?.name ?? "另一方",
      structuralChoice
    }),
    portraitMood: "tense"
  });
  document.querySelectorAll("[data-accuse]").forEach((button) => {
    button.addEventListener("click", () => resolveAccusation(brief, button.dataset.accuse, button.dataset.accuseLabel));
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function structuralAccusationButtonText(brief) {
  if (brief.structuralActorId === "platform") return "指向平台 / 第三方操盘";
  if (brief.structuralActorId === "thirdParty") return "指向第三方操盘者";
  return "指向结构性操盘者";
}

function renderCaseSolved(brief, chapter) {
  const result = state.accusationHistory.find((item) => item.caseId === brief.id);
  const actor = getNpc(brief.premeditatedActorId);
  const solved = solvedCaseDetails(brief, result);
  const recapStep = Number(state.dialogueProgress?.[dialogueProgressKey(brief, "caseSolved")] ?? 0);
  const view = caseSolvedView({
    chapter,
    brief,
    result,
    actorName: actor?.name,
    solved,
    contradictionCount: contradictionsForCase(brief).length,
    structuralResponsibility: structuralExpectedAccusation(brief) ? structuralResponsibilityText(brief) : "",
    hasNextCase: Boolean(state.caseBriefs?.[state.chapter]),
    recapStep
  });
  storyFrame({ ...view, speakerName: "你" });
  document.querySelector("[data-recap-next]")?.addEventListener("click", () => {
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [dialogueProgressKey(brief, "caseSolved")]: recapStep + 1
    };
    saveState();
    render();
  });
  document.querySelector("[data-next-case]")?.addEventListener("click", () => {
    state.scene = "caseInterlude";
    saveState();
    render();
  });
  document.querySelectorAll("[data-retry-case]").forEach((button) => {
    button.addEventListener("click", () => resetCaseAttempt(brief));
  });
}

function resetCaseAttempt(brief) {
  clearCaseAttemptState(brief);
  state.scene = "caseOpen";
  state.lastReaction = "直播间把麦重新接回开头。这一次可以换一种问法。";
  ensureCaseBudget(brief);
  saveState();
  render();
}

function clearCaseAttemptState(brief) {
  const key = caseNoteKey(brief);
  state.caseActionLog = omitStateKey(state.caseActionLog, key);
  state.contradictionLog = omitStateKey(state.contradictionLog, key);
  state.evidenceInsights = omitStateKey(state.evidenceInsights, key);
  state.interrogationNotes = omitStateKey(state.interrogationNotes, key);
  state.caseBudgets = omitStateKey(state.caseBudgets, key);
  state.inspirationUsage = omitStateKey(state.inspirationUsage, key);
  state.selectedEvidenceCard = omitStateKey(state.selectedEvidenceCard, key);
  state.caseInterludes = omitStateKey(state.caseInterludes, key);
  state.accusationHistory = (state.accusationHistory ?? []).filter((item) => item.caseId !== brief.id);
  state.solvedCaseIds = (state.solvedCaseIds ?? []).filter((id) => id !== brief.id);
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [dialogueProgressKey(brief, "caseOpen")]: 0,
    [dialogueProgressKey(brief, "sceneReview")]: 0,
    [dialogueProgressKey(brief, "testimony")]: 0,
    [dialogueProgressKey(brief, "caseSolved")]: 0,
    [dialogueProgressKey(brief, "caseInterlude")]: 0
  };
}

function omitStateKey(source, key) {
  const next = { ...(source ?? {}) };
  delete next[key];
  return next;
}

function renderCaseInterlude(brief, chapter) {
  const interlude = interludeForCase(brief);
  const nextBrief = state.caseBriefs?.[state.chapter] ?? null;
  const nextHook = nextBrief ? nextPlaythroughTease(nextBrief) : finalPlaythroughTease();
  const interludeLines = interludeDialogueForCase({
    brief,
    currentTitle: caseChapterTitle(brief, state.chapter - 1),
    interlude,
    nextHook,
    transition: brief.storyTransition,
    followupTwist: brief.followupTwist,
    nextCarryover: nextBrief ? nextCaseCarryoverLine(nextBrief) : `${caseSetLabel()}已结束，进入今晚回看。`,
    nextThreadLine: nextBrief?.threadLink?.line ?? ""
  });
  const interludeStep = Number(state.dialogueProgress?.[dialogueProgressKey(brief, "caseInterlude")] ?? 0);
  const view = caseInterludeView({
    currentTitle: caseChapterTitle(brief, state.chapter - 1),
    brief,
    interlude,
    interludeLines,
    interludeStep,
    reputation: state.agencyReputation ?? 0,
    heat: state.publicHeat ?? 0,
    nextTitle: nextBrief ? caseChapterTitle(nextBrief, state.chapter) : ""
  });
  storyFrame({
    ...view,
    speakerName: view.speakerName ?? "你",
    caseStage: false,
    hideStatus: true,
    personaOverride: { name: "你", art: CHARACTER_ART.meng }
  });
  document.querySelector("[data-interlude-next]")?.addEventListener("click", () => {
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [dialogueProgressKey(brief, "caseInterlude")]: interludeStep + 1
    };
    saveState();
    render();
  });
  document.querySelector("[data-enter-next-case]")?.addEventListener("click", () => {
    state.chapter += 1;
    state.scene = "caseOpen";
    state.caseBrief = state.caseBriefs[state.chapter - 1];
    state.primaryNpcId = state.caseBrief?.complainantId ?? null;
    state.secondaryNpcId = state.caseBrief?.respondentId ?? null;
    saveState();
    render();
  });
  document.querySelector("[data-finish-run]")?.addEventListener("click", () => {
    state.scene = "runComplete";
    settleRunExperience();
  });
}

function renderCaseRunComplete(brief, chapter) {
  const correct = state.accusationHistory.filter((item) => item.correct).length;
  const totalCases = state.caseBriefs?.length ?? 0;
  const interludeLines = state.caseMode === "daily"
    ? []
    : (state.caseBriefs ?? []).map((caseBrief) => {
      const interlude = interludeForCase(caseBrief);
      return `${caseBrief.modeLabel ?? caseBrief.label}：${interlude.summary}`;
    });
  const view = runCompleteView({
    chapter,
    correct,
    totalCases,
    caseSetLabel: caseSetLabel(),
    runLine: runCompleteLine(correct),
    reputation: state.agencyReputation ?? 0,
    heat: state.publicHeat ?? 0,
    caseSetSummary: caseSetSummary(),
    interludeLines,
    shareCard: state.caseMode === "daily" ? dailyShareCard(correct, totalCases) : null
  });
  storyFrame({ ...view, speakerName: "你" });
  document.querySelectorAll('[data-action="title"]').forEach((button) => {
    button.addEventListener("click", () => setScreen("title"));
  });
  if (state.caseMode === "daily") postDailySharePayload(correct, totalCases);
  document.querySelector("[data-copy-daily-result]")?.addEventListener("click", async () => {
    const card = dailyShareCard(correct, totalCases);
    const text = `${card.kicker}${card.routeLabel ? `｜${card.routeLabel}` : ""}\n${card.title}\n今晚瓜点：${card.finding}\n${card.footer}`;
    try {
      await navigator.clipboard?.writeText(text);
      recordEvidenceInsight(brief, "今日连线挑战文案已复制。");
    } catch {
      recordEvidenceInsight(brief, text);
    }
    saveState();
    render();
  });
}

function postDailySharePayload(correct, totalCases) {
  const brief = activeCaseBrief();
  const card = dailyShareCard(correct, totalCases);
  platformRuntime.wechat.postMessage({
    type: "daily-share",
    dailyKey: brief?.dailyKey,
    caseId: brief?.id,
    title: card.title,
    body: card.body,
    footer: card.footer,
    routeLabel: card.routeLabel,
    path: `/pages/index/index?mode=daily&dailyKey=${encodeURIComponent(brief?.dailyKey ?? "")}`
  });
}

function dailyShareCard(correct, totalCases) {
  const brief = activeCaseBrief();
  const result = state.accusationHistory.find((item) => item.caseId === brief?.id);
  const solved = correct >= Math.max(1, totalCases);
  let route = result?.dailyRoute ?? dailyRouteProfile(brief, result ?? { correct: solved }, solved);
  if (brief?.plotId === "education-income-fake-profile") {
    route = dailyRouteProfile(brief, result ?? { correct: solved }, solved);
  }
  const title = route?.shareTitle ?? brief?.dailyShareTitle ?? (solved ? "我识破了今日连线" : "我被今日连线带偏了");
  const body = route?.shareBody ?? brief?.dailyShareBody ?? (solved
    ? `《${brief?.label ?? "今日短案"}》这口瓜，表面是一句解释，里面藏着另一层关系账。`
    : `《${brief?.label ?? "今日短案"}》这口瓜，第一版听着顺，后面越听越不对劲。`);
  const footer = route?.shareQuestion ?? (result?.correct
    ? (brief?.dailyShareQuestion ?? "你听完会站哪边？")
    : (brief?.dailyShareQuestion ?? "你听完会不会也先信第一版？"));
  return {
    kicker: "今日连线",
    title,
    body,
    finding: shareFindingText(body),
    footer,
    cta: "发给朋友，一起听这通电话。",
    routeLabel: route?.label?.replace(/侦探$/, "") ?? ""
  };
}

function shareFindingText(body = "") {
  return String(body)
    .replace(/^我抓到的是[：:]\s*/, "")
    .replace(/^我抓到的关键是/, "")
    .replace(/^我抓到的关键不是/, "不是")
    .replace(/^今晚最好吵的是[：:]\s*/, "")
    .trim();
}

function dailyRouteProfile(brief, result = {}, enoughContradictions = true) {
  const key = caseNoteKey(brief);
  const actions = Object.keys(state.caseActionLog?.[key] ?? {});
  const contradictions = contradictionsForCase(brief).join(" ");
  const insights = insightsForCase(brief).join(" ");
  const text = `${contradictions} ${insights}`;
  const scores = {
    time: countRouteSignals(text, /时间|47 天|47天|社保|断缴|学制|公司抬头|裁切|日期|流水确认/) + countActionSignals(actions, /timeline|verification/),
    money: countRouteSignals(text, /债|信用卡|还款|消费|账单|转账|办卡|投资|房贷|房本|首付|产权|还贷|账户|份额|补偿|协议|装修|现金流|存款|余额/) + countActionSignals(actions, /money|audit/),
    emotion: countRouteSignals(text, /情绪|专属|理解|脆弱|安全感|不信任|防御|老板娘|话术|边界|关系测试/) + countActionSignals(actions, /motive|emotion/),
    asset: countRouteSignals(text, /房本|产权|首付|还贷|补偿|协议|装修|共同账户|资产|洗房/),
    profile: countRouteSignals(text, /截图|学历|学校|公司|收入|岗位|裁切|材料|标签|包装|存款证明|余额/) + countActionSignals(actions, /verification/)
  };
  const tooEarly = !enoughContradictions || (result.contradictionCount ?? 0) < 2;
  if (tooEarly) {
    return {
      label: "过早站队型",
      shareTitle: brief?.dailyShareTitle ?? "我被今日连线带偏了",
      shareBody: "我还没听够原话就站队了，第一版说法比我想象中更会带节奏。",
      shareQuestion: brief?.dailyShareQuestion ?? "你来试试：会先问时间、钱，还是情绪？"
    };
  }
  if (brief?.plotId === "education-income-fake-profile" || scores.profile >= 2) {
    return {
      label: "资料敏感型",
      shareTitle: "存款证明都发了，怎么反而更怪？",
      shareBody: "今晚最好吵的是：存款证明不是突然冒出来的，谁先想看都说不清。",
      shareQuestion: "你听完会觉得是包装，是试探，还是双方都在借父母的嘴？"
    };
  }
  if (scores.asset >= 2) {
    return {
      label: "资产边界型",
      shareTitle: brief?.dailyShareTitle ?? "我抓住了今日连线的资产边界",
      shareBody: "我没有只吵爱不爱，而是先拆权属、现金流和退出补偿。",
      shareQuestion: brief?.dailyShareQuestion ?? "你会先问房本、首付，还是婚后还贷？"
    };
  }
  if (scores.money >= scores.time && scores.money >= scores.emotion) {
    return {
      label: "资金流敏感型",
      shareTitle: brief?.dailyShareTitle ?? "我从钱的流向判了今日连线",
      shareBody: brief?.dailyShareBody ?? "我先追钱和资源怎么流动，再判断这是不是普通困难。",
      shareQuestion: brief?.dailyShareQuestion ?? "你会先问钱，还是先问 TA 的解释？"
    };
  }
  if (scores.time > scores.emotion) {
    return {
      label: "时间线敏感型",
      shareTitle: brief?.dailyShareTitle ?? "我从时间线拆开了今日连线",
      shareBody: "我先把每句话放回日期里看，很多解释一遇到时间点就露出缺口。",
      shareQuestion: brief?.dailyShareQuestion ?? "你会从哪一个时间点开始追问？"
    };
  }
  if (scores.emotion >= 2 && !result.correct) {
    return {
      label: "同情心先行型",
      shareTitle: "我差点被今日连线说服了",
      shareBody: "我理解了 TA 的委屈，但漏掉了谁得好处、谁没说完。",
      shareQuestion: brief?.dailyShareQuestion ?? "你会不会也先相信 TA 的第一版说法？"
    };
  }
  if (scores.emotion >= 2) {
    return {
      label: "话术敏感型",
      shareTitle: brief?.dailyShareTitle ?? "我从话术里听出今日连线的问题",
      shareBody: "我没有只看情绪浓度，而是追问这些话术后面接了什么要求。",
      shareQuestion: brief?.dailyShareQuestion ?? "你觉得这句话算锤，还是只算情绪？"
    };
  }
  return {
    label: result.correct ? "边界清醒型" : "直觉误判型",
    shareTitle: brief?.dailyShareTitle ?? (result.correct ? "我识破了今日连线" : "我被今日连线带偏了"),
    shareBody: brief?.dailyShareBody ?? (result.correct ? "我听到了最别扭那句，但朋友未必会走同一条询问路线。" : "我先站队了，但原话还没听够。"),
    shareQuestion: brief?.dailyShareQuestion ?? "你会先问时间、钱，还是情绪？"
  };
}

function countRouteSignals(text, pattern) {
  return (String(text).match(new RegExp(pattern.source, "g")) ?? []).length;
}

function countActionSignals(actions, pattern) {
  return actions.filter((action) => pattern.test(action)).length;
}

function resolveAccusation(brief, accused, accuseLabel = "") {
  const readiness = dailyAccusationReadiness(brief);
  if (!readiness.ready) {
    state.lastReaction = readiness.message;
    state.scene = "testimony";
    saveState();
    return render();
  }
  const { result, enoughContradictions } = resolveAccusationForCase({
    brief,
    accused,
    contradictionCount: contradictionsForCase(brief).length,
    requiredContradictions: requiredContradictionsForAccusation(brief)
  });
  if (brief.dailyCase && accuseLabel) result.dailyAccuseLabel = accuseLabel;
  if (brief.dailyCase) result.dailyRoute = dailyRouteProfile(brief, result, enoughContradictions);
  state.accusationHistory = [
    ...(state.accusationHistory ?? []).filter((item) => item.caseId !== brief.id),
    result
  ];
  if (!state.solvedCaseIds.includes(brief.id)) state.solvedCaseIds.push(brief.id);
  applyCaseOutcome(brief, result);
  if (result.correct) {
    bumpFlag("evidenceClarity", 1);
    platformRuntime.achievements.unlock("first_correct_accusation");
    if (contradictionsForCase(brief).length >= Math.min(allCaseContradictions(brief).length, requiredContradictionsForAccusation(brief) + 1)) {
      platformRuntime.achievements.unlock("perfect_case");
    }
    state.lastReaction = brief.dailyCase
      ? `你停在“${accuseLabel || accusationLabel(brief, accused)}”这一句，弹幕突然静了一拍。`
      : "你把叙事重新压回材料和时间线，弹幕安静了一瞬。";
  } else {
    bumpFlag("audiencePressure", 1);
    state.lastReaction = brief.dailyCase
      ? `你点了“${accuseLabel || accusationLabel(brief, accused)}”，弹幕吵起来了：这句有味儿，但还不是最炸的那一下。`
      : enoughContradictions ? "这个判断有点急，弹幕的情绪替事实多走了一步。" : "你还没抓到足够矛盾点，这次判断更像直觉，不像分析。";
  }
  platformRuntime.cloud.syncNow();
  moveCaseScene("caseSolved");
}

function applyCaseOutcome(brief, result) {
  const key = caseNoteKey(brief);
  if (state.caseInterludes?.[key]) return;
  const contradictionCount = result.contradictionCount ?? contradictionsForCase(brief).length;
  const outcome = calculateCaseOutcome({
    brief,
    result,
    contradictionCount,
    budgetRemaining: caseBudget(brief).remaining ?? 0,
    agencyReputation: state.agencyReputation ?? 0,
    publicHeat: state.publicHeat ?? 0
  });
  state.agencyReputation = outcome.agencyReputation;
  state.publicHeat = outcome.publicHeat;
  state.caseInterludes = {
    ...(state.caseInterludes ?? {}),
    [key]: outcome.interlude
  };
}

function expectedAccusation(brief) {
  return expectedAccusationForCase(brief);
}

function structuralExpectedAccusation(brief) {
  return structuralExpectedAccusationForCase(brief);
}

function relationshipExpectedAccusation(brief) {
  return relationshipExpectedAccusationForCase(brief);
}

function requiredContradictionsForAccusation(brief) {
  return requiredContradictionsForCase(brief);
}

function moveCaseScene(scene) {
  const brief = activeCaseBrief();
  if (scene === "accusation") {
    const readiness = dailyAccusationReadiness(brief);
    if (!readiness.ready) {
      state.lastReaction = readiness.message;
      state.scene = "testimony";
      saveState();
      return render();
    }
  }
  state.scene = scene;
  saveState();
  render();
}

function dailyAccusationReadiness(brief) {
  if (!brief?.dailyCase && brief?.caseMode !== "daily") return { ready: true, message: "" };
  const totalScenes = brief.sceneVersions?.length ?? 0;
  const sceneCount = completedSceneVersionCount(brief);
  const followupCount = completedFollowupCount(brief);
  const requiredFollowups = requiredDailyFollowupCount(brief);
  if (totalScenes && sceneCount < totalScenes) {
    return { ready: false, message: "第一版说法还没听完，现在开盘太早。" };
  }
  if (followupCount < requiredFollowups) {
    const missing = requiredFollowups - followupCount;
    return { ready: false, message: `还缺${missing}句补充原话，瓜点还没咂出来。` };
  }
  return { ready: true, message: "" };
}

function completedSceneVersionCount(brief) {
  return (brief?.sceneVersions ?? []).filter((_, index) => actionDone(brief, `version:${index}`)).length;
}

function requiredDailyFollowupCount(brief) {
  const available = (brief?.testimony ?? []).reduce((sum, item) => sum + ((item.followups ?? []).length ? 1 : 0), 0);
  if (!available) return 0;
  return Math.min(2, available);
}

function completedFollowupCount(brief) {
  let count = 0;
  (brief?.testimony ?? []).forEach((item, testimonyIndex) => {
    (item.followups ?? []).forEach((_, followupIndex) => {
      if (actionDone(brief, `followup:${testimonyIndex}:${followupIndex}`)) count += 1;
    });
  });
  return count;
}

function caseNoteKey(brief) {
  return brief?.id ?? `case-${state.chapter}`;
}

function notesForCase(brief) {
  return state.interrogationNotes?.[caseNoteKey(brief)] ?? [];
}

function contradictionsForCase(brief) {
  return state.contradictionLog?.[caseNoteKey(brief)] ?? [];
}

function insightsForCase(brief) {
  return state.evidenceInsights?.[caseNoteKey(brief)] ?? [];
}

function recordInterrogation(brief, note) {
  const key = caseNoteKey(brief);
  const current = state.interrogationNotes?.[key] ?? [];
  state.interrogationNotes = {
    ...(state.interrogationNotes ?? {}),
    [key]: [...current, note].slice(-8)
  };
}

function recordContradiction(brief, contradiction) {
  const key = caseNoteKey(brief);
  const current = state.contradictionLog?.[key] ?? [];
  if (current.includes(contradiction)) return;
  state.contradictionLog = {
    ...(state.contradictionLog ?? {}),
    [key]: [...current, contradiction].slice(-8)
  };
  bumpFlag("suspicion", 1);
}

function recordEvidenceInsight(brief, insight) {
  const key = caseNoteKey(brief);
  const current = state.evidenceInsights?.[key] ?? [];
  if (current.includes(insight)) return;
  state.evidenceInsights = {
    ...(state.evidenceInsights ?? {}),
    [key]: [...current, insight].slice(-6)
  };
}

function ensureCaseBudget(brief) {
  if (!brief) return null;
  const key = caseNoteKey(brief);
  const max = caseBudgetMax(brief);
  const current = state.caseBudgets?.[key];
  if (current && typeof current.remaining === "number") return current;
  state.caseBudgets = {
    ...(state.caseBudgets ?? {}),
    [key]: { max, remaining: max, used: 0 }
  };
  return state.caseBudgets[key];
}

function caseBudgetMax(brief) {
  return calculateCaseBudgetMax({
    brief,
    bonusPoints: meta.bonusPoints ?? 0,
    agencyReputation: state.agencyReputation ?? 0,
    publicHeat: state.publicHeat ?? 0
  });
}

function caseBudget(brief) {
  return ensureCaseBudget(brief) ?? { max: 0, remaining: 0, used: 0 };
}

function actionDone(brief, actionKey) {
  return Boolean(state.caseActionLog?.[caseNoteKey(brief)]?.[actionKey]);
}

function caseActionDisabled(brief, actionKey) {
  const budget = caseBudget(brief);
  return actionDone(brief, actionKey) || budget.remaining <= 0 ? "disabled" : "";
}

function spendCaseAction(brief, actionKey, cost = 1) {
  if (actionDone(brief, actionKey)) {
    state.lastReaction = "这条线已经记录过了，重复追问只会消耗当事人的耐心。";
    return false;
  }
  const budget = caseBudget(brief);
  if (budget.remaining < cost) {
    registerLiveMisstep(brief, 2);
    state.publicHeat = Math.min(9, (state.publicHeat ?? 0) + 1);
    state.lastReaction = "弹幕开始急了：别再绕了，先拿现有说法往下判断。";
    return false;
  }
  const key = caseNoteKey(brief);
  budget.remaining -= cost;
  budget.used += cost;
  state.caseBudgets = {
    ...(state.caseBudgets ?? {}),
    [key]: budget
  };
  state.caseActionLog = {
    ...(state.caseActionLog ?? {}),
    [key]: {
      ...(state.caseActionLog?.[key] ?? {}),
      [actionKey]: true
    }
  };
  return true;
}

function rerenderWithSave() {
  saveState();
  render();
}

function interludeForCase(brief) {
  const key = caseNoteKey(brief);
  return state.caseInterludes?.[key] ?? {
    reputationDelta: 0,
    heatDelta: 0,
    summary: "这通电话已经回看，但后续记录缺失。只能按中性状态进入下一通。"
  };
}

function nextCaseCarryoverLine(nextBrief) {
  const reputation = state.agencyReputation ?? 0;
  const heat = state.publicHeat ?? 0;
  const budget = caseBudgetMax(nextBrief);
  if (reputation >= 4 && heat < 5) return `上一通建立了信任，下一通初始配合度更高，可追问次数调整为 ${budget}。`;
  if (heat >= 5) return `上一通引发争议，下一通来电人更防御，可追问次数调整为 ${budget}。`;
  if (reputation < 0) return `上一通听法被质疑，下一通需要用更具体的说法重新稳住节奏，可追问次数为 ${budget}。`;
  return `上一通影响有限，下一通按常规节奏进入，可追问次数为 ${budget}。`;
}

function solvedCaseDetails(brief, result) {
  const found = contradictionsForCase(brief);
  const keyItems = allCaseContradictions(brief).slice(0, 4);
  const hit = keyItems.filter((item) => found.includes(item));
  const missed = keyItems.filter((item) => !found.includes(item)).slice(0, 3);
  const expected = result?.expected ?? expectedAccusation(brief);
  const relationshipExpected = result?.relationshipExpected ?? relationshipExpectedAccusation(brief);
  const structuralExpected = result?.structuralExpected ?? structuralExpectedAccusation(brief);
  const daily = brief?.dailyCase || brief?.caseMode === "daily";
  return {
    accusedLabel: daily ? (result?.dailyAccuseLabel ?? dailyExpectedAccuseLabel(brief, result?.accused)) : accusationLabel(brief, result?.accused),
    expectedLabel: daily ? dailyExpectedAccuseLabel(brief, expected) : accusationLabel(brief, expected),
    responsibilityLayer: structuralExpected
      ? `这通电话里更像 ${accusationLabel(brief, relationshipExpected)} 没说全；背后推手更像 ${accusationLabel(brief, structuralExpected)}。`
      : "",
    hit,
    missed,
    why: explanationForExpected(brief, expected)
  };
}

function dailyExpectedAccuseLabel(brief, expected) {
  if (!brief) return "还没说清";
  if (brief.plotId === "lost-job-hidden-credit") {
    if (expected === brief.respondentId) return "失业是真，但体面账也是真的";
  }
  if (brief.plotId === "house-name-security-test") {
    if (expected === brief.respondentId) return "产权归父母，还贷进共同账户";
  }
  if (brief.plotId === "tony-multi-dating") {
    if (expected === brief.respondentId) return "不是聊天多，是把人按用途分组";
  }
  if (brief.plotId === "education-income-fake-profile") {
    if (expected === "both") return "存款证明是谁推出来的说不清";
  }
  return accusationLabel(brief, expected);
}

function currentPlaythroughNumber() {
  return (meta.runs ?? 0) + 1;
}

function playthroughOpening(brief) {
  return {
    hook: brief.storyArcSummary ?? brief.publicHook ?? "今日只接一通匿名来电。",
    director: "你把麦打开：“先听 TA 怎么说，别急着替任何一方下结论。”",
    pressure: brief.storySuspense ?? "先听 TA 怎么说，别急着替任何一方接话。"
  };
}

function interludeDialogueForCase({ brief, currentTitle, interlude, nextHook, transition, followupTwist, nextCarryover, nextThreadLine }) {
  if (brief?.dailyCase || brief?.caseMode === "daily") {
    return [
      {
        speaker: "你",
        label: `${currentTitle} 结案后`,
        text: interlude.summary
      },
      followupTwist ? {
        speaker: "咨询者",
        label: "后续补充",
        text: followupTwist.replace(/^后续回拨：/, "").replace(/^后续新情况：/, "")
      } : null,
      {
        speaker: "你",
        label: "今日结果",
        text: "这通电话先收在这里。真正的分歧，留给看完的人继续判断。"
      }
    ].filter(Boolean);
  }
  return [
    {
      speaker: "你",
      label: `${currentTitle} 结案后`,
      text: interlude.summary,
      detail: "先把情绪放一放，再看下一段余波。"
    },
    followupTwist ? {
      speaker: "消息",
      label: "回拨消息",
      text: followupTwist.replace(/^后续新情况：/, ""),
      detail: "这不是新案，只是上一案留下的回音。它会改变下一通电话里，你对“完整叙事”的警惕。"
    } : null,
    transition ? {
      speaker: "资料",
      label: "新资料进线",
      text: transition,
      detail: "资料没有替你下结论，只把下一案的第一个疑点放到了台面上。"
    } : null,
    {
      speaker: "你",
      label: "下一通连线",
      text: nextHook,
      detail: nextThreadLine || nextCarryover
    }
  ].filter(Boolean);
}

function openingDialogueForCase(brief, opening, complainantName, respondentName) {
  const dailyOpening = dailyOpeningAtmosphereLines(brief);
  if (dailyOpening?.length) {
    return dailyOpening
      .filter((line) => line.role !== "other")
      .map((line) => ({
        ...line,
        speaker: line.role === "host" ? "你" : "咨询者"
      }));
  }
  if (brief.openingDialogue?.length) {
    return brief.openingDialogue
      .filter((line) => line.role !== "other")
      .map((line) => ({
        ...line,
        speaker: line.role === "host" ? "你" : "咨询者"
      }));
  }
  const firstQuote = brief.openingComplaint?.match(/[“"]([^”"]{4,48})[”"]/)?.[1];
  const complainantLine = firstQuote ?? brief.storyArcSummary ?? brief.publicHook ?? "我想把这件事说清楚。";
  return [
    { speaker: "咨询者", role: "caller", text: `主播你好，${complainantLine}` },
    { speaker: "你", role: "host", text: "晚上好，先不急着下结论。你把这通电话里最别扭的地方慢慢讲。" }
  ];
}

function dialogueProgressKey(brief, scene) {
  return `${caseNoteKey(brief)}:${scene}`;
}

function currentSceneVersionIndex(brief) {
  const total = brief.sceneVersions?.length ?? 0;
  const maxIndex = Math.max(0, total - 1);
  return Math.max(0, Math.min(Number(state.dialogueProgress?.[dialogueProgressKey(brief, "sceneReview")] ?? 0), maxIndex));
}

function setSceneVersionIndex(brief, index) {
  const total = brief.sceneVersions?.length ?? 0;
  const nextIndex = Math.max(0, Math.min(index, Math.max(0, total - 1)));
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [dialogueProgressKey(brief, "sceneReview")]: nextIndex
  };
  const item = brief.sceneVersions?.[nextIndex];
  if (item?.speakerId && (item.speakerId === brief.complainantId || shouldShowRespondentLive(brief))) state.primaryNpcId = item.speakerId;
  saveState();
  render();
}

function currentTestimonyIndex(brief) {
  const total = brief.testimony?.length ?? 0;
  const maxIndex = Math.max(0, total - 1);
  return Math.max(0, Math.min(Number(state.dialogueProgress?.[dialogueProgressKey(brief, "testimony")] ?? 0), maxIndex));
}

function setTestimonyIndex(brief, index) {
  const total = brief.testimony?.length ?? 0;
  const nextIndex = Math.max(0, Math.min(index, Math.max(0, total - 1)));
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [dialogueProgressKey(brief, "testimony")]: nextIndex
  };
  const item = brief.testimony?.[nextIndex];
  if (item?.speakerId && (item.speakerId === brief.complainantId || shouldShowRespondentLive(brief))) state.primaryNpcId = item.speakerId;
  saveState();
  render();
}

function testimonyMood(item) {
  if (!item) return "listening";
  if (item.kind === "halfLie" || item.kind === "truthWithGap") return "guarded";
  if (item.kind === "reluctant" || item.kind === "defensive") return "tense";
  if (item.kind === "sceneHint" || item.kind === "shadowVersion") return "focused";
  if (item.kind === "selfDoubt") return "reflecting";
  return "anxious";
}

function nextPlaythroughTease(nextBrief) {
  return nextBrief
    ? `下一通匿名来电已经排队：${nextBrief.storyArcSummary ?? "继续从对话里找问题。"}`
    : "明天会换一通匿名来电。";
}

function finalPlaythroughTease() {
  return "今日连线已经结束。最适合发给朋友的不是答案，而是：你会从哪一句开始追问？";
}

function runCompleteLine(correct) {
  const total = state.caseBriefs?.length ?? 3;
  return runCompleteLineFor({
    correct,
    total,
    caseMode: state.caseMode,
    playthroughNumber: currentPlaythroughNumber()
  });
}

function storyFrame({ chapter, text, choices, side = "", speakerName = "", caseStage = true, hideStatus = false, personaOverride = null, portraitMood = "" }) {
  const persona = personaOverride ?? visualPersona();
  const inCase = Boolean(caseStage && state.caseBriefs?.length && !state.investigationComplete);
  const visibleSpeakerName = inCase ? anonymousCaseSpeakerName(speakerName || persona.name) : (speakerName || persona.name);
  layout(`
    <section class="story-grid ${inCase ? "case-vn-grid" : ""}">
      <article class="vn-stage">
          <div class="visual-scene ${backdropClass()}" aria-hidden="true">
            <div class="scene-label">${sceneLabel()}</div>
          ${inCase ? liveCommentStrip() : ""}
          ${visualPortraitLayer(persona, portraitMood)}
        </div>
        <div class="dialogue-card">
          <p class="eyebrow">${chapter}</p>
          ${inCase ? "" : `<div class="speaker-name">${visibleSpeakerName}</div>`}
          ${text}
          ${reactionLine()}
          ${inCase ? dialogueBacklogBlock() : ""}
          <div class="choices">${choices}</div>
        </div>
      </article>
    </section>
  `, { sceneClass: `chapter-${state.chapter}` });

  setTimeout(() => {
    if (inCase && isMobileViewport()) {
      const stage = document.querySelector(".vn-stage");
      const topbar = document.querySelector(".topbar");
      if (stage) {
        const offset = (topbar?.getBoundingClientRect().height ?? 0) + 6;
        const top = window.scrollY + stage.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      return;
    }
    const card = document.querySelector(".dialogue-card");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 50);
}

function isMobileViewport() {
  return Boolean(window.matchMedia?.("(max-width: 860px)").matches);
}

function anonymousCaseSpeakerName(name = "") {
  if (state.caseMode !== "daily") return name;
  if (!name || name === "你") return name || "你";
  const brief = activeCaseBrief();
  const complainant = getNpc(brief?.complainantId);
  const respondent = getNpc(brief?.respondentId);
  if (name === complainant?.name || name === "来访者") return "咨询者";
  if (name === respondent?.name || name === "另一方") return "对方";
  return name;
}

function liveCommentStrip() {
  const brief = activeCaseBrief();
  if (!brief) return "";
  const pressure = state.flags.audiencePressure ?? 0;
  const heat = state.publicHeat ?? 0;
  const budget = caseBudget(brief);
  const found = contradictionsForCase(brief).length;
  const pool = liveCommentPool({ brief, pressure, heat, remaining: budget.remaining, found });
  return `<div class="live-comment-strip">${pool.map((item) => `<span class="live-comment">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function dialogueBacklogBlock() {
  const brief = activeCaseBrief();
  if (!brief) return "";
  const lines = seenDialogueLines(brief).slice(-10);
  if (lines.length <= 1) return "";
  return `
    <details class="dialogue-backlog">
      <summary>通话回放</summary>
      <div>
        ${lines.map((line) => `<p><b>${escapeHtml(line.speaker)}</b>：${escapeHtml(line.text)}</p>`).join("")}
      </div>
    </details>
  `;
}

function reactionLine() {
  const text = sanitizeReactionText(state.lastReaction);
  if (!text) return "";
  state.lastReaction = null;
  saveState();
  return `<p class="reaction">${text}</p>`;
}

function sanitizeReactionText(text) {
  const value = String(text ?? "");
  if (!value) return "";
  if (/对方主动展示体面材料|金融企业标签遮住|择偶定位|未核验/.test(value)) {
    return "你点点头：先让 TA 继续说。";
  }
  return value;
}

function registerLiveMisstep(brief, amount = 1) {
  bumpFlag("audiencePressure", amount);
  const pressure = state.flags.audiencePressure ?? 0;
  if (pressure >= 4) state.publicHeat = Math.min(9, (state.publicHeat ?? 0) + 1);
  if (brief) {
    recordEvidenceInsight(brief, "直播间对这条追问出现分歧。");
  }
}

function liveMisstepReply(item = {}, stage = "scene") {
  const speaker = item.speaker ?? "对方";
  if (stage === "testimony") {
    return `${speaker} 没顺着补事实，只把话题带回自己的委屈。弹幕开始催你换个问法。`;
  }
  return `${speaker} 接住了情绪，但关键事实没多出来。弹幕有人刷：这句先别追偏。`;
}

function liveCommentPool({ brief, pressure, heat, remaining, found }) {
  if (remaining <= 0) return ["别绕了", "该判断了", "现在线索够不够"];
  if (heat >= 5 || pressure >= 4) return ["主播别硬扣", "让 TA 说原话", "这句没接上"];
  if (pressure >= 1) return ["这问法有点偏", "原话呢", "别替谁解释"];
  if (found >= 2) return ["有东西了", "这句前后对不上", "继续追原话"];
  return ["来了来了", "麦里有点东西", "弹幕别吵"];
}

function seenDialogueLines(brief) {
  const lines = [];
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  const opening = openingDialogueForCase(
    brief,
    playthroughOpening(brief),
    complainant?.name ?? "咨询者",
    respondent?.name ?? "对方"
  );
  opening.forEach((line) => {
    lines.push({
      speaker: callHistorySpeaker(brief, line.speaker, line.role),
      text: line.text ?? ""
    });
  });
  if (sceneReached("sceneReview")) {
    const current = currentSceneVersionIndex(brief);
    (brief.sceneVersions ?? []).slice(0, current + 1).forEach((item) => {
      lines.push({
        speaker: callHistorySpeaker(brief, item.speaker, item.speakerId === brief.respondentId ? "other" : "caller"),
        text: item.version ?? ""
      });
    });
  }
  if (sceneReached("testimony")) {
    const current = currentTestimonyIndex(brief);
    (brief.testimony ?? []).slice(0, current + 1).forEach((item) => {
      lines.push({
        speaker: callHistorySpeaker(brief, item.speaker, item.speakerId === brief.respondentId ? "other" : "caller"),
        text: item.line ?? ""
      });
    });
  }
  notesForCase(brief).slice(-4).forEach((note) => {
    lines.push({ speaker: "追问", text: note });
  });
  return lines.filter((line) => line.text);
}

function sceneReached(scene) {
  const order = {
    caseOpen: 0,
    sceneReview: 1,
    evidence: 2,
    testimony: 3,
    accusation: 4,
    caseSolved: 5,
    caseInterlude: 6,
    runComplete: 7
  };
  return (order[state.scene] ?? 0) >= (order[scene] ?? 0);
}

function callHistorySpeaker(brief, speaker = "来电", role = "") {
  if (role === "host" || speaker === "你") return "你";
  if (speaker === "消息" || speaker === "资料" || speaker === "追问") return speaker;
  if (state.caseMode !== "daily") return speaker || "来电";
  if (/材料|账单|截图|草稿|排班表|回拨|录音|合同|摘录|记事/.test(speaker ?? "")) return speaker;
  if (role === "other" || speaker === "另一方" || speaker === "对方") return "咨询者转述";
  return "咨询者";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shouldShowRespondentLive(brief) {
  return !brief?.dailyCase && brief?.consultationMode === "mediation";
}

function visualPortraitLayer(persona, portraitMood = "") {
  if (state.caseBriefs?.length && !state.investigationComplete) {
    const brief = activeCaseBrief();
    const complainant = getNpc(brief?.complainantId);
    const respondent = getNpc(brief?.respondentId);
    const activeId = state.primaryNpcId ?? complainant?.id;
    const mood = portraitMood || moodForScene();
    const showRespondent = shouldShowRespondentLive(brief) && state.scene !== "caseOpen";
    const people = !showRespondent
      ? [{ role: "咨询者", npc: complainant }].filter((item) => item.npc)
      : [
          { role: "咨询者", npc: complainant },
          { role: "另一方", npc: respondent }
        ].filter((item) => item.npc);
    return `
      <div class="case-duel-portraits">
        ${people.map((item) => `
          <figure class="case-portrait mood-${activeId === item.npc.id ? mood : "listening"} ${activeId === item.npc.id ? "active" : ""}">
            <img src="${CHARACTER_ART[item.npc.id]}" alt="" />
            <figcaption><span>${item.role}｜${moodLabel(activeId === item.npc.id ? mood : "listening")}</span><b>${state.caseMode === "daily" ? item.role : item.npc.name}</b></figcaption>
          </figure>
        `).join("")}
      </div>
    `;
  }
  return `
    <div class="character-shadow"></div>
    <img class="character-standee" src="${persona.art}" alt="" />
  `;
}

function moodForScene() {
  if (state.scene === "caseOpen") return "listening";
  if (state.scene === "sceneReview") return "thinking";
  if (state.scene === "testimony") return "anxious";
  if (state.scene === "evidence") return "focused";
  if (state.scene === "accusation") return "tense";
  return "listening";
}

function moodLabel(mood) {
  const labels = {
    anxious: "紧张",
    focused: "盯资料",
    guarded: "防御",
    listening: "听线",
    reflecting: "回想",
    tense: "绷住",
    thinking: "接话"
  };
  return labels[mood] ?? "听线";
}

function visualPersona() {
  const npc = currentNpc();
  if (state.caseBriefs?.length && !state.investigationComplete && npc) {
    return { name: npc.name, art: CHARACTER_ART[npc.id] };
  }
  if (npc && state.chapter > 1) {
    return { name: npc.name, art: CHARACTER_ART[npc.id] };
  }
  if (npc && ["firstDates", "speedDatingNight"].includes(state.scene)) {
    return { name: npc.name, art: CHARACTER_ART[npc.id] };
  }
  return { name: "你", art: CHARACTER_ART.meng };
}

function backdropClass() {
  if (state.chapter === 10) {
    return "backdrop-school";
  }
  if (state.chapter === 9) return "backdrop-home";

  const map = {
    1: "backdrop-office",
    2: "backdrop-cafe",
    3: "backdrop-parents",
    4: "backdrop-banquet",
    5: "backdrop-wedding",
    6: "backdrop-home",
    7: "backdrop-housing",
    8: "backdrop-hospital"
  };
  return map[state.chapter] ?? "backdrop-office";
}

function sceneLabel() {
  if (state.caseBriefs?.length && !state.investigationComplete) {
    const brief = activeCaseBrief();
    if (state.scene === "caseOpen") return "直播连线";
    if (state.scene === "sceneReview") return "继续听来电";
    if (state.scene === "testimony") return "继续听来电";
    if (state.scene === "evidence") return "继续听来电";
    if (state.scene === "accusation") return "收住话头";
    if (state.scene === "caseInterlude") return brief?.dailyCase ? "今日余波" : "后续余波";
    if (state.scene === "caseSolved") return "连线回看";
    return brief?.scene?.name ?? "直播间";
  }
  if (state.chapter === 10) {
    return "小学门口";
  }
  if (state.chapter === 9) return "婚后多年";

  const labels = {
    1: "婚介公司",
    2: "咖啡约会",
    3: "见家长前",
    4: "谈婚论嫁",
    5: "婚礼现场",
    6: "婚后家中",
    7: "售楼处",
    8: "医院候诊"
  };
  return labels[state.chapter] ?? "婚姻剧场";
}

render();
