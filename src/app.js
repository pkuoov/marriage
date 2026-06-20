import { ATTRIBUTES, CASE_CHAPTERS, CHAPTERS, DETECTIVE_SPECIALTIES, HIDDEN_TYPES, HUMAN_PATTERNS, MOTIVES, NPCS, PACKAGING_CHOICES, QUESTIONNAIRE } from "./story.js?v=0.14.0";
import { buildCaseDeck, caseEventsFor, generateCaseSequence } from "./caseEngine.js?v=0.14.0";
import { shuffle } from "./random.js?v=0.14.0";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.14.0";
import { BASE_POINTS, CHARACTER_ART, MAX_META_BONUS, PUBLIC_PLAYER_GENDER, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.14.0";
import { clampBurst, effectiveInternalBurst, effectiveMotiveBurst, initialInternalBurst, initialMotiveBurst, internalBurstChance, internalBurstLine, motiveBurstChance, motiveRevealLine, randomPick, randomRange } from "./relationshipEngine.js?v=0.14.0";
import { handleChapter2Choice, handleChapter3Choice, handleChapter4Choice, handleChapter5Choice, handleChapter6Choice, handleChapter7Choice, handleChapter8Choice, handleChapter9Choice, handleChapter10Choice } from "./choiceHandlers.js?v=0.14.0";
import { renderChapter9 as renderEndingChapter9, renderChapter10 as renderEndingChapter10 } from "./endingChapters.js?v=0.14.0";
import { createEarlyChapterRenderers } from "./earlyChapters.js?v=0.14.0";
import { createMidChapterRenderers } from "./midChapters.js?v=0.14.0";
import { createScreenRenderers } from "./screens.js?v=0.14.0";
import { renderStatusPanel } from "./statusView.js?v=0.14.0";

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

function saveState() { saveStateSnapshot(state); }

function saveMeta() { saveMetaSnapshot(meta); }

function resetGame() {
  state = structuredClone(baseState);
  state.screen = "creator";
  clearStateSnapshot();
  render();
}

function totalAttrs(attrs = state.attrs) { return ATTRIBUTES.reduce((sum, item) => sum + attrs[item.id], 0); }

function totalPoints() { return BASE_POINTS + (meta.bonusPoints ?? 0); }

function canAdd(attrId) {
  return state.attrs[attrId] < 10 && totalAttrs() < totalPoints();
}

function canRemove(attrId) {
  return state.attrs[attrId] > 0;
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

function applySpecialtyBoost(attrs) {
  const specialty = DETECTIVE_SPECIALTIES.find((item) => item.id === state.specialty);
  if (!specialty) return attrs;
  return {
    ...attrs,
    [specialty.attr]: Math.min(10, (attrs[specialty.attr] ?? 4) + specialty.boost)
  };
}

function chooseSpecialty(id) {
  state.specialty = id;
  saveState();
  render();
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
  if (name === "affection") {
    const seed = currentSeed();
    if (seed) seed.affection = Math.max(0, Math.min(60, (seed.affection ?? 0) + amount * 2));
  }
}

function generateNpcSeeds() {
  const typeBag = shuffle(["sincere", "sincere", "sincere", "selfish"]);
  const extras = shuffle(["sincere", "selfish", "flawed", "controlling"]).slice(0, 2);
  const types = shuffle([...typeBag, ...extras]);
  let controllingUsed = false;

  const seeds = {};
  NPCS.forEach((npc, index) => {
    let hiddenType = types[index];
    if (hiddenType === "controlling" && controllingUsed) hiddenType = "flawed";
    if (hiddenType === "controlling") controllingUsed = true;

    const motive = hiddenType === "sincere" ? null : randomPick(npc.motiveWeights);
    const humanPattern = pickHumanPattern(npc, hiddenType, motive);
    const pattern = HUMAN_PATTERNS[humanPattern];
    seeds[npc.id] = {
      hiddenType,
      humanPattern,
      motive,
      affection: initialNpcAffection(npc),
      internalBurst: clampBurst(initialInternalBurst(hiddenType) + (pattern?.initialInternalDelta ?? 0)),
      motiveBurst: clampBurst(initialMotiveBurst(hiddenType, motive) + (pattern?.initialMotiveDelta ?? 0)),
      burstEvents: [],
      motiveRevealed: false,
      revealed: []
    };
  });

  state.npcSeeds = seeds;
  state.caseDeck = buildCaseDeck(NPCS, seeds, state.attrs);
  state.appliedCaseEvents = [];
  addLog("本周目候选对象池的隐藏底色与不良动机已生成。", "系统");
}

function pickHumanPattern(npc, hiddenType, motive) {
  if (hiddenType === "controlling") return "npdMask";
  const bag = ["steadyRepair", "avoidantPleaser"];
  if (["xu", "he", "zhou"].includes(npc.id)) bag.push("spoiledHeir", "spoiledHeir");
  if (["lin", "shen"].includes(npc.id) || ["classJump", "familyResource", "money"].includes(motive)) bag.push("pragmaticClimber", "pragmaticClimber");
  if (hiddenType === "selfish") bag.push("pragmaticClimber", "spoiledHeir"); else if (hiddenType === "flawed") bag.push("avoidantPleaser", "pragmaticClimber");
  return randomPick(bag);
}

function initialNpcAffection(npc) {
  const { wealth, family, looks, education, eq } = state.attrs;
  const wealthBias = ["xu", "lin", "shen"].includes(npc.id) ? wealth * 0.4 : wealth * 0.25;
  const familyBias = ["zhou", "shen", "chen"].includes(npc.id) ? family * 0.35 : family * 0.2;
  const looksBias = ["he", "xu", "zhou"].includes(npc.id) ? looks * 0.45 : looks * 0.25;
  const eduBias = ["lin", "shen"].includes(npc.id) ? education * 0.45 : education * 0.2;
  const eqBias = ["lin", "shen", "he"].includes(npc.id) ? eq * 0.42 : eq * 0.28;
  return Math.round(18 + wealthBias + familyBias + looksBias + eduBias + eqBias);
}

function finalizeCharacter() {
  state.gender = PUBLIC_PLAYER_GENDER;
  if (!state.specialty) state.specialty = "verification";
  state.attrs = applySpecialtyBoost(randomizeInvestigationProfile());
  state.profileDone = true;
  state.investigationComplete = false;
  state.caseArchive = [];
  state.candidateAccess = {};
  generateNpcSeeds();
  state.caseBriefs = generateCaseSequence(NPCS, state.attrs);
  weaveCaseThread();
  state.caseBrief = state.caseBriefs[0] ?? null;
  state.solvedCaseIds = [];
  state.accusationHistory = [];
  state.agencyReputation = 0;
  state.publicHeat = 0;
  state.caseInterludes = {};
  primePremeditatedCases();
  state.screen = "chapter";
  if (state.caseBrief?.complainantId) {
    state.primaryNpcId = state.caseBrief.complainantId;
    state.secondaryNpcId = state.caseBrief.respondentId;
    state.selectedFirstDates = [state.caseBrief.complainantId, state.caseBrief.respondentId].filter(Boolean);
    applyCaseStage(state.caseBrief.complainantId, "screening");
    addLog(`${state.caseBrief.label}：${state.caseBrief.openingComplaint}`, "侦探案件");
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
    const previous = briefs[index - 1];
    const linkedNpcId = index === 0 ? null : previous?.respondentId ?? previous?.complainantId ?? null;
    const linkedNpc = getNpc(linkedNpcId);
    const role = index === 1 ? "上一案被指向的人作为旁证进入本案" : index === 2 ? "前两案的叙事模式成为告解镜像" : "本周目开案";
    if (linkedNpcId) {
      brief.threadLink = {
        linkedNpcId,
        role,
        line: `${linkedNpc?.name ?? "上一案当事人"} 的旧案记录会影响本案旁听席对同类叙事的第一反应。`
      };
    } else {
      brief.threadLink = {
        linkedNpcId: null,
        role,
        line: "今晚的第一案会决定侦探局本周目的基础声誉。"
      };
    }
    return {
      caseId: brief.id,
      plotId: brief.plotId,
      mode: brief.caseMode,
      linkedNpcId,
      role
    };
  });
}

function primePremeditatedCases() {
  (state.caseBriefs ?? []).forEach((brief) => {
    const actorId = brief?.premeditatedActorId;
    const seed = actorId ? getSeed(actorId) : null;
    if (!seed) return;
    if (!seed.motive) seed.motive = randomPick(getNpc(actorId)?.motiveWeights ?? ["money", "control", "cover"]);
    seed.hiddenType = seed.hiddenType === "sincere" ? "selfish" : seed.hiddenType;
    seed.motiveBurst = clampBurst(Math.max(seed.motiveBurst ?? 0, 72));
    seed.internalBurst = clampBurst(Math.max(seed.internalBurst ?? 0, 42));
    seed.premeditated = true;
  });
}

function choosePackaging(choice) {
  state.packaging = choice.id;
  if (choice.id === "honest") state.flags.boundary += 1;
  if (choice.id === "boost") {
    state.flags.reality += 1;
    state.flags.evidenceClarity += 1;
  }
  if (choice.id === "hide") {
    state.flags.riskTolerance += 1;
    state.flags.clientCredibility += 1;
  }
  if (choice.id === "delegate") {
    state.flags.agencyControl += 1;
    state.flags.audiencePressure += 1;
  }
  addLog(choice.effect, "包装");
  state.scene = "questionnaire";
  saveState();
  render();
}

function answerQuestion(questionId, answerId) {
  state.questionnaire[questionId] = answerId;
  if (answerId === "love" || answerId === "growth") state.flags.romance += 1;
  if (answerId === "money" || answerId === "realistic") state.flags.reality += 1;
  if (answerId === "parents") state.flags.parentDependency += 1;
  if (answerId === "reject" || answerId === "ask" || answerId === "lie") state.flags.boundary += 1;
  if (answerId === "ask" || answerId === "growth") state.flags.evidenceClarity += 1;
  if (answerId === "emotion" || answerId === "realistic") state.flags.falseAccusationRisk += 1;

  const allDone = QUESTIONNAIRE.every((q) => state.questionnaire[q.id]);
  if (allDone) state.scene = "recommendations";
  saveState();
  render();
}

function toggleFirstDate(npcId) {
  const exists = state.selectedFirstDates.includes(npcId);
  if (exists) {
    state.selectedFirstDates = state.selectedFirstDates.filter((id) => id !== npcId);
  } else if (state.selectedFirstDates.length < 3) {
    state.selectedFirstDates.push(npcId);
  }
  saveState();
  render();
}

function startFirstDates() {
  if (state.selectedFirstDates.length !== 3) return;
  state.selectedFirstDates.forEach((npcId) => applyCaseStage(npcId, "screening"));
  state.scene = "firstDates";
  saveState();
  render();
}

function completeFirstDates(action) {
  if (action === "background") {
    state.flags.suspicion += 1;
    state.flags.evidenceClarity += 1;
  }
  if (action === "redLady") {
    state.flags.agencyControl += 1;
    state.flags.falseAccusationRisk += 1;
  }
  if (action === "continue") state.flags.clientCredibility += 1;
  state.scene = "speedDatingNight";
  saveState();
  render();
}

function selectPrimary(npcId) {
  state.primaryNpcId = npcId;
  applyCaseStage(npcId, "dating");
  state.chapter = 2;
  state.scene = "chapter2Start";
  addLog(`你决定把 ${getNpc(npcId).name} 作为主要追问对象。`, "侦探追问");
  saveState();
  render();
}

function selectSecondary(npcId) {
  state.secondaryNpcId = npcId === state.secondaryNpcId ? null : npcId;
  saveState();
  render();
}

function canStopLoss() {
  const f = state.flags;
  if ((f.suspicion ?? 0) >= 5 && (f.boundary ?? 0) >= 4) return true;
  if (state.chapter >= 5 && (f.weddingPressure ?? 0) + (f.parentConflict ?? 0) + (f.suspicion ?? 0) >= 9 && (f.boundary ?? 0) >= 5) return true;
  if (state.chapter >= 6 && (f.householdPressure ?? 0) + (f.parentConflict ?? 0) + (f.suspicion ?? 0) >= 10 && (f.boundary ?? 0) >= 6) return true;
  if (state.chapter >= 7 && ((f.debtPressure ?? 0) + (f.suspicion ?? 0) >= 8 || ((f.assetProtection ?? 0) >= 7 && (f.boundary ?? 0) >= 8))) return true;
  if (state.chapter >= 8 && (f.childPressure ?? 0) + (f.householdPressure ?? 0) + (f.parentConflict ?? 0) >= 11 && (f.boundary ?? 0) >= 8) return true;
  return false;
}

function endPrimaryRelationship(reason = "你决定不再推进这段关系。", options = {}) {
  const oldPrimary = currentNpc();
  const secondary = getNpc(state.secondaryNpcId);
  const allowSwitch = options.allowSwitch ?? state.chapter <= 4;

  if (oldPrimary && !state.terminatedNpcIds.includes(oldPrimary.id)) {
    state.terminatedNpcIds.push(oldPrimary.id);
  }
  state.lastStopLossReason = reason;
  addLog(`${oldPrimary?.name ?? "这段关系"}终止：${reason}`, "止损");

  if (allowSwitch && secondary && secondary.id !== oldPrimary?.id) {
    state.lastRouteLesson = reason;
    state.primaryNpcId = secondary.id;
    state.secondaryNpcId = null;
    state.routeSwitches += 1;
    state.runSettled = false;
    applyCaseStage(secondary.id, "dating");
    state.chapter = 2;
    state.scene = "routeSwitchTransition";
    addLog(`观察对象 ${secondary.name} 重新成为主线。`, "换线");
    saveState();
    render();
    return;
  }

  state.scene = options.scene ?? "stopLossEnding";
  saveState();
  render();
}

function choiceContext() {
  return {
    state,
    bumpFlag,
    applyCurrentCaseStage,
    shouldOfferSecondaryDecision,
    currentNpc,
    getSeed,
    clampBurst,
    addLog,
    endPrimaryRelationship
  };
}

function finishChoice(alreadyRendered) {
  if (alreadyRendered) return;
  saveState();
  render();
}

function renderContext() {
  return {
    state,
    currentNpc,
    storyFrame,
    saveState,
    render,
    chapter9Choice,
    chapter10Choice,
    setScreen,
    settleRunExperience,
    totalPoints,
    choiceBtn
  };
}

function chapter2Choice(kind, value) {
  finishChoice(handleChapter2Choice(choiceContext(), kind, value));
}

function chapter3Choice(kind, value) {
  finishChoice(handleChapter3Choice(choiceContext(), kind, value));
}

function chapter4Choice(kind, value) {
  finishChoice(handleChapter4Choice(choiceContext(), kind, value));
}

function chapter5Choice(kind, value) {
  finishChoice(handleChapter5Choice(choiceContext(), kind, value));
}

function chapter6Choice(kind, value) {
  finishChoice(handleChapter6Choice(choiceContext(), kind, value));
}

function chapter7Choice(kind, value) {
  finishChoice(handleChapter7Choice(choiceContext(), kind, value));
}

function chapter8Choice(kind, value) {
  finishChoice(handleChapter8Choice(choiceContext(), kind, value));
}

function chapter9Choice(kind, value) {
  finishChoice(handleChapter9Choice(choiceContext(), kind, value));
}

function chapter10Choice(kind, value) {
  finishChoice(handleChapter10Choice(choiceContext(), kind, value));
}

function getNpc(id) {
  return NPCS.find((npc) => npc.id === id);
}

function getSeed(id) {
  return state.npcSeeds[id];
}

function currentNpc() {
  return getNpc(state.primaryNpcId) ?? getNpc(state.selectedFirstDates[0]);
}

function currentSeed() {
  const npc = currentNpc();
  return npc ? getSeed(npc.id) : null;
}

function motiveForCurrent() {
  const seed = currentSeed();
  return seed?.motive ? MOTIVES[seed.motive] : null;
}

function getCaseEvents(npcId, stage) {
  return caseEventsFor(state.caseDeck, npcId, stage);
}

function caseLine(npcId, stage) {
  const events = getCaseEvents(npcId, stage);
  return events[0]?.line ?? "";
}

function currentCaseLine(stage) {
  const npc = currentNpc();
  return npc ? visibleCaseLine(npc.id, stage) : "";
}

function visibleCaseLine(npcId, stage) {
  const line = caseLine(npcId, stage);
  if (!line) return "";

  const sensitivity = (state.attrs.eq ?? 0) * 10 + (state.attrs.education ?? 0) * 4 + (state.flags.suspicion ?? 0) * 5;
  if (sensitivity >= 70) return line;
  if (sensitivity >= 45 && markVagueSignalSeen()) return "你感觉这件事背后有更深的动机，但还说不清具体是什么。";
  if (!state.insightHintSeen && markVagueSignalSeen()) {
    state.insightHintSeen = true;
    saveState();
    return "你隐约觉得这个细节重要，但你的情商、经验或信息量还不足以把它拼成线索。";
  }
  return "";
}

function applyCaseStage(npcId, stage) {
  const events = getCaseEvents(npcId, stage);
  events.forEach((event, index) => {
    const key = `${npcId}:${stage}:${event.caseId}:${index}`;
    if (state.appliedCaseEvents.includes(key)) return;

    const seed = getSeed(npcId);
    if (!seed) return;

    seed.internalBurst = clampBurst((seed.internalBurst ?? 0) + (event.internalDelta ?? 0));
    seed.motiveBurst = clampBurst((seed.motiveBurst ?? 0) + (event.motiveDelta ?? 0));
    Object.entries(event.flags ?? {}).forEach(([flag, amount]) => bumpFlag(flag, amount));
    state.appliedCaseEvents.push(key);
    addLog(`${getNpc(npcId).name}｜${event.caseTitle}：${event.line}`, "案例");
    maybeTriggerBurst(npcId, stage);
  });
}

function applyCurrentCaseStage(stage) {
  const npc = currentNpc();
  if (npc) applyCaseStage(npc.id, stage);
}

function maybeTriggerBurst(npcId, stage) {
  const seed = getSeed(npcId);
  if (!seed) return;

  if (Math.random() < internalBurstChance(seed)) {
    const line = internalBurstLine(seed);
    seed.burstEvents.push({ stage, type: "internal", line });
    state.lastBurstEvent = { npcId, stage, type: "internal", line };
    addLog(`${getNpc(npcId).name}：${line}`, "内在爆发");
  }

  if (!seed.motiveRevealed && Math.random() < motiveBurstChance(seed)) {
    const npc = getNpc(npcId);
    const line = motiveRevealLine(seed, npc);
    seed.motiveRevealed = true;
    seed.burstEvents.push({ stage, type: "motive", line });
    state.lastBurstEvent = { npcId, stage, type: "motive", line };
    state.interruptEvent = { npcId, stage, type: "motive", line };
    addLog(`${getNpc(npcId).name}：${line}`, "动机爆发");
  }
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
  addLog(`本周目结算：获得 ${gained} 点永久机动点。`, "周目经验");
  saveMeta();
  saveState();
  render();
}

function render() {
  if (state.screen === "title") return renderTitle();
  if (state.screen === "creator") return renderCreator();
  if (state.screen === "chapter") return renderChapter();
  return renderTitle();
}

function layout(content, options = {}) {
  app.innerHTML = `
    <section class="shell ${options.sceneClass ?? ""}">
      <header class="topbar">
        <button class="brand" data-action="title" type="button">婚恋侦探局</button>
        <nav class="tabs" aria-label="章节">
          ${CHAPTERS.map((chapter) => `<span class="${state.chapter === Number(chapter.id.slice(2)) ? "active" : ""}">${chapter.title.split("：")[0]}</span>`).join("")}
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
  return { state, meta, layout, setScreen, totalPoints, totalAttrs, canRemove, canAdd, saveState, render, finalizeCharacter, chooseSpecialty, app, resetGame, isSoundEnabled, toggleSound };
}

function screenRenderers() { return createScreenRenderers(screenContext()); }

function renderTitle() { screenRenderers().renderTitle(); }

function renderCreator() { screenRenderers().renderCreator(); }

function renderChapter() {
  if (state.interruptEvent) return renderBurstInterruption();
  if (state.caseBriefs?.length && !state.investigationComplete) return renderCaseInvestigation();
  const renderers = [renderChapter1, renderChapter2, renderChapter3, renderChapter4, renderChapter5, renderChapter6, renderChapter7, renderChapter8, renderChapter9, renderChapter10];
  return (renderers[state.chapter - 1] ?? renderTitle)();
}

function activeCaseBrief() {
  const index = Math.max(0, Math.min((state.chapter ?? 1) - 1, (state.caseBriefs?.length ?? 1) - 1));
  const brief = state.caseBriefs?.[index] ?? state.caseBrief;
  state.caseBrief = brief;
  ensureCaseBudget(brief);
  if (brief?.complainantId && !state.primaryNpcId) state.primaryNpcId = brief.complainantId;
  return brief;
}

function renderCaseInvestigation() {
  const brief = activeCaseBrief();
  if (!brief) return renderTitle();
  const chapter = CASE_CHAPTERS[state.chapter - 1]?.title ?? `第 ${state.chapter} 案`;
  if (state.scene === "sceneReview") return renderCaseSceneReview(brief, chapter);
  if (state.scene === "testimony") return renderCaseTestimony(brief, chapter);
  if (state.scene === "evidence") return renderCaseEvidence(brief, chapter);
  if (state.scene === "accusation") return renderCaseAccusation(brief, chapter);
  if (state.scene === "caseSolved") return renderCaseSolved(brief, chapter);
  if (state.scene === "caseInterlude") return renderCaseInterlude(brief, chapter);
  if (state.scene === "runComplete") return renderCaseRunComplete(brief, chapter);
  if (state.scene === "caseAftermath") return renderCaseAftermath(brief, chapter);
  return renderCaseOpen(brief, chapter);
}

function renderCaseOpen(brief, chapter) {
  state.primaryNpcId = brief.complainantId;
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  storyFrame({
    chapter,
    text: `
      <p><b>案由</b>：${brief.label}｜${caseDifficultyText(brief)}</p>
      <p>${brief.openingComplaint}</p>
      <p class="hint">${brief.publicHook}</p>
      <div class="scene-list">
        <p><b>栏目</b>：${brief.modeLabel ?? "婚恋 case"}</p>
        <p><b>先诉苦的人</b>：${complainant?.name ?? "未知"}</p>
        <p><b>另一方</b>：${respondent?.name ?? "未知"}</p>
        <p><b>本案结构</b>：${caseStructureText(brief)}</p>
        <p><b>调查资源</b>：${budgetLine(brief)}</p>
        <p><b>本周目线索</b>：${brief.threadLink?.line ?? "本案暂无前案旁证。"}</p>
        <p><b>侦探局战况</b>：${agencyBattleLine()}</p>
        ${meta.bonusPoints >= 15 ? `<p><b>提前预警</b>：${earlyWarningText(brief)}</p>` : ""}
      </div>
    `,
    choices: `
      <button class="primary" data-case-scene="sceneReview" type="button">复盘当时场景</button>
      <button data-case-scan ${caseActionDisabled(brief, "scan:summary")} type="button">先看案卷摘要，直达证据卡</button>
    `
  });
  document.querySelector("[data-case-scene]")?.addEventListener("click", () => moveCaseScene("sceneReview"));
  document.querySelector("[data-case-scan]")?.addEventListener("click", () => {
    if (!spendCaseAction(brief, "scan:summary")) return rerenderWithSave();
    bumpFlag("evidenceClarity", 1);
    const cardTitles = evidenceCardTitles(brief);
    recordEvidenceInsight(brief, `案卷摘要先把情绪压低：本案需要重点核对 ${cardTitles.slice(0, 2).join("、")}。`);
    state.lastReaction = `案卷摘要消耗了一次追问机会，但你提前锁定了 ${cardTitles[0]}。`;
    moveCaseScene("evidence");
  });
}

function renderCaseSceneReview(brief, chapter) {
  if (brief.caseMode === "confession") return renderConfessionTimeline(brief, chapter);
  const contradictions = contradictionsForCase(brief);
  storyFrame({
    chapter,
    text: `
      <p><b>现场复原：${brief.scene.name}</b></p>
      <p class="hint">${budgetLine(brief)}</p>
      <p>${brief.scene.description}</p>
      <p class="side-signal">${brief.scene.dialogue}</p>
      <p>注意：场景复原不是事实本身，只是当事人带着立场复述的版本。你需要比对版本，而不是相信讲得更顺的那个人。</p>
      <div class="scene-list">
        ${brief.sceneVersions.map((item, index) => `
          <p><b>${item.speaker}</b>：${item.version}<br><span>${item.doubt}</span><br><button data-version="${index}" ${caseActionDisabled(brief, `version:${index}`)} type="button">${actionDone(brief, `version:${index}`) ? "已比对" : "比对这个版本"}</button></p>
        `).join("")}
      </div>
      ${contradictions.length ? `<p class="signal signal-yellow">已发现迷惑点：${contradictions.slice(-2).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-scene-question="complainant" ${caseActionDisabled(brief, "scene:complainant")} type="button">追问先诉苦者</button>
      <button data-scene-question="respondent" ${caseActionDisabled(brief, "scene:respondent")} type="button">追问另一方</button>
      <button data-scene-question="details" ${caseActionDisabled(brief, "scene:details")} type="button">追问现场细节</button>
      <button class="primary" data-case-scene="testimony" type="button">进入证词交叉追问</button>
    `
  });
  document.querySelectorAll("[data-version]").forEach((button) => {
    button.addEventListener("click", () => {
      const actionKey = `version:${button.dataset.version}`;
      if (!spendCaseAction(brief, actionKey)) return rerenderWithSave();
      const item = brief.sceneVersions[Number(button.dataset.version)];
      if (item?.speakerId) state.primaryNpcId = item.speakerId;
      recordContradiction(brief, item?.contradiction ?? "这个现场版本有无法自洽的地方。");
      state.lastReaction = `迷惑点：${item?.contradiction ?? "这个现场版本有无法自洽的地方。"}`;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-scene-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.sceneQuestion;
      if (!spendCaseAction(brief, `scene:${target}`)) return rerenderWithSave();
      if (target === "complainant") state.primaryNpcId = brief.complainantId;
      if (target === "respondent") state.primaryNpcId = brief.respondentId;
      if (target === "details") bumpFlag("evidenceClarity", 1);
      applyCaseStage(state.primaryNpcId ?? brief.complainantId, stageForCase(brief));
      moveCaseScene("testimony");
    });
  });
  document.querySelector("[data-case-scene]")?.addEventListener("click", () => moveCaseScene("testimony"));
}

function renderConfessionTimeline(brief, chapter) {
  const marks = confessionMarksForCase(brief);
  const contradictions = contradictionsForCase(brief);
  const markLabels = {
    hurtByOther: "被坑",
    selfBlind: "自欺",
    hurtOther: "可能伤了别人"
  };
  storyFrame({
    chapter,
    text: `
      <p><b>告解时间线</b></p>
      <p class="hint">${budgetLine(brief)}</p>
      <p>这次不是比对两个人谁说得更顺，而是把当事人的经历拆成节点。每个节点都要判断：TA 是被坑、在自欺，还是也可能伤了别人。</p>
      <div class="scene-list">
        ${(brief.confessionTimeline ?? []).map((node, index) => `
          <p><b>${index + 1}. ${node.label}</b>：${node.text}<br>
          <span>${marks[node.id] ? `你的标注：${markLabels[marks[node.id]]}` : "尚未标注"}</span><br>
          ${Object.entries(markLabels).map(([mark, label]) => {
            const actionKey = `confession:${node.id}:${mark}`;
            return `<button data-confession="${node.id}:${mark}" ${marks[node.id] || caseActionDisabled(brief, actionKey) ? "disabled" : ""} type="button">${label}</button>`;
          }).join("")}
          </p>
        `).join("")}
      </div>
      ${contradictions.length ? `<p class="signal signal-yellow">已发现自述断点：${contradictions.slice(-3).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-case-scene="testimony" type="button">继续听 TA 告解</button>
      <button class="primary" data-case-scene="evidence" type="button">整理自我核验证据</button>
    `
  });
  document.querySelectorAll("[data-confession]").forEach((button) => {
    button.addEventListener("click", () => {
      const [nodeId, mark] = button.dataset.confession.split(":");
      const node = (brief.confessionTimeline ?? []).find((item) => item.id === nodeId);
      const actionKey = `confession:${nodeId}:${mark}`;
      if (!node || !spendCaseAction(brief, actionKey)) return rerenderWithSave();
      recordConfessionMark(brief, nodeId, mark);
      if (mark === node.correctMark) {
        bumpFlag("evidenceClarity", 1);
        recordContradiction(brief, node.contradiction);
        state.lastReaction = `标注成立：${node.contradiction}`;
      } else {
        bumpFlag("audiencePressure", 1);
        state.lastReaction = `这个标注有点偏：此处更像“${markLabels[node.correctMark]}”，不是“${markLabels[mark]}”。`;
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseTestimony(brief, chapter) {
  const notes = notesForCase(brief);
  const contradictions = contradictionsForCase(brief);
  const selectedCard = selectedEvidenceCard(brief);
  storyFrame({
    chapter,
    text: `
      <p><b>证词交叉追问</b></p>
      <p class="hint">${budgetLine(brief)}</p>
      <p>每一句话都可能是假话、含糊话、半真话，或者当事人不愿意说完整的真话。直播间里最有力的证据，往往是 TA 前面自己说过的话。</p>
      <p class="signal signal-yellow">当前出示卡：${selectedCard ? `${selectedCard.type}｜${selectedCard.title}` : "未选择。你可以先从下方证据卡选一张。"}</p>
      <div class="scene-list">
        ${(brief.evidenceCards ?? []).map((card) => `
          <p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span><br><button data-select-card="${card.id}" type="button">${selectedCard?.id === card.id ? "已选中" : "选为出示证据"}</button></p>
        `).join("")}
      </div>
      <div class="scene-list">
        ${brief.testimony.map((item, index) => `
          <p><b>${item.speaker}</b> <span class="status-badge badge-locked">${item.surface}</span>：${item.line}<br>
          ${(item.followups ?? []).map((followup, followupIndex) => {
            const actionKey = `followup:${index}:${followupIndex}`;
            return `<button data-followup="${index}:${followupIndex}" ${caseActionDisabled(brief, actionKey)} type="button">${actionDone(brief, actionKey) ? "已追问" : followup.question}</button>`;
          }).join("")}
          <button data-present="${index}" ${!selectedCard || caseActionDisabled(brief, `present:${index}:${selectedCard?.id ?? "none"}`) ? "disabled" : ""} type="button">出示当前证据</button>
          </p>
        `).join("")}
      </div>
      ${notes.length ? `<p class="reaction">已追问：${notes.slice(-2).join(" / ")}</p>` : ""}
      ${contradictions.length ? `<p class="signal signal-yellow">已发现矛盾：${contradictions.slice(-3).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回到现场复原</button>
      <button class="primary" data-case-scene="evidence" type="button">整理证据卡</button>
    `
  });
  document.querySelectorAll("[data-select-card]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedEvidenceCard = {
        ...(state.selectedEvidenceCard ?? {}),
        [caseNoteKey(brief)]: button.dataset.selectCard
      };
      state.lastReaction = "证据卡已放到直播台面上。接下来选择一句证词出示。";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-present]").forEach((button) => {
    button.addEventListener("click", () => presentEvidenceToTestimony(brief, Number(button.dataset.present)));
  });
  document.querySelectorAll("[data-followup]").forEach((button) => {
    button.addEventListener("click", () => {
      const [testimonyIndex, followupIndex] = button.dataset.followup.split(":").map(Number);
      const actionKey = `followup:${testimonyIndex}:${followupIndex}`;
      if (!spendCaseAction(brief, actionKey)) return rerenderWithSave();
      const item = brief.testimony[testimonyIndex];
      const followup = item?.followups?.[followupIndex];
      if (item?.speakerId) state.primaryNpcId = item.speakerId;
      bumpFlag("evidenceClarity", 1);
      recordInterrogation(brief, `${item?.speaker ?? "证词"}：${followup?.question ?? item?.hint}`);
      if (followup?.contradiction) recordContradiction(brief, followup.contradiction);
      state.lastReaction = `追问结果：${followup?.result ?? item?.hint ?? "这句话需要回到时间线里看。"}`;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseEvidence(brief, chapter) {
  const contradictions = contradictionsForCase(brief);
  const insights = insightsForCase(brief);
  const hiddenHint = contradictions.length >= 2 || (state.flags.evidenceClarity ?? 0) >= 4
    ? `<p class="signal signal-yellow">你注意到：${brief.hiddenFacts[0]} 和 ${brief.exaggerations[0]} 是本案最容易被包装的地方。</p>`
    : `<p class="signal signal-yellow">你还不能直接看见真相。场景复原和证词里至少还有 ${Math.max(0, 2 - contradictions.length)} 个矛盾点需要追问。</p>`;
  storyFrame({
    chapter,
    text: `
      <p><b>证据卡</b></p>
      <p class="hint">${budgetLine(brief)}</p>
      <div class="scene-list">
        ${(brief.evidenceCards ?? []).map((card) => `<p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span><br><span>${card.detail}</span></p>`).join("")}
      </div>
      ${insights.length ? `<p><b>证据整理发现</b>：${insights.join(" / ")}</p>` : ""}
      ${meta.bonusPoints >= 10 ? `<p class="signal signal-yellow">时间线追踪工具提示：${timelineGapText(brief)}</p>` : ""}
      ${contradictions.length ? `<p><b>已抓到的迷惑点/矛盾点</b>：${contradictions.join(" / ")}</p>` : ""}
      ${hiddenHint}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回现场复原继续比对</button>
      <button data-case-scene="testimony" type="button">回证词继续追问</button>
      <button data-evidence="timeline" ${caseActionDisabled(brief, "evidence:timeline")} type="button">按时间线重排</button>
      <button data-evidence="money" ${caseActionDisabled(brief, "evidence:money")} type="button">优先查钱和资源</button>
      <button data-evidence="motive" ${caseActionDisabled(brief, "evidence:motive")} type="button">回到动机和收益</button>
      <button class="primary" data-case-scene="accusation" type="button">进入阶段指认</button>
    `
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
      recordContradiction(brief, `证据整理：${insight}`);
      state.lastReaction = `证据整理发现：${insight}`;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseAccusation(brief, chapter) {
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  storyFrame({
    chapter,
    text: `
      <p><b>阶段指认</b></p>
      <p class="hint">${budgetLine(brief)}</p>
      <p>${brief.caseMode === "confession" ? "你不需要审判这位告解者，但必须判断 TA 的自述里哪里是被坑、哪里是自欺、哪里可能也伤害了别人。" : "你不需要一次性给出全部法律结论，但必须判断目前谁的叙事最需要被拆开。没有抓到足够矛盾点时，任何指认都可能只是被台词带着走。"}</p>
      <p><b>已发现矛盾点</b>：${contradictionsForCase(brief).length ? contradictionsForCase(brief).join(" / ") : "暂无，建议回去追问。"}</p>
      <p class="hint">${caseAccusationHint(brief)}</p>
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回现场复原</button>
      <button data-case-scene="testimony" type="button">回证词追问</button>
      <button data-accuse="${brief.complainantId}" type="button">${brief.caseMode === "confession" ? `重点拆 ${complainant?.name ?? "告解者"} 的自述` : `重点指向 ${complainant?.name ?? "先诉苦者"}`}</button>
      <button data-accuse="${brief.respondentId}" type="button">重点指向 ${respondent?.name ?? "另一方"}</button>
      <button data-accuse="both" type="button">${brief.caseMode === "confession" ? "自我选择和对方行为都要查" : "双方都有隐瞒"}</button>
      <button data-accuse="noPremeditated" type="button">${brief.caseMode === "confession" ? "暂判不是骗局，是选择机制失衡" : "暂判无预谋，只是关系失衡"}</button>
    `
  });
  document.querySelectorAll("[data-accuse]").forEach((button) => {
    button.addEventListener("click", () => resolveAccusation(brief, button.dataset.accuse));
  });
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
}

function renderCaseSolved(brief, chapter) {
  const result = state.accusationHistory.find((item) => item.caseId === brief.id);
  const actor = getNpc(brief.premeditatedActorId);
  const solved = solvedCaseDetails(brief, result);
  storyFrame({
    chapter,
    text: `
      <p><b>本案复盘</b></p>
      <p>${result?.correct ? "你抓住了关键矛盾。" : "你的判断还不够稳，旁听席的情绪干扰了事实排序。"}</p>
      <p><b>你的指认</b>：${solved.accusedLabel}。<b>后台更接近</b>：${solved.expectedLabel}。</p>
      <p><b>已抓矛盾点</b>：${result?.contradictionCount ?? contradictionsForCase(brief).length} 个。</p>
      <p><b>关键矛盾命中</b>：${solved.hit.length ? solved.hit.join(" / ") : "没有命中关键矛盾，只抓到外围疑点。"}</p>
      <p><b>错过的关键点</b>：${solved.missed.length ? solved.missed.join(" / ") : "本案关键矛盾基本覆盖。"}</p>
      <p><b>为什么指向这里</b>：${solved.why}</p>
      <p><b>后台真相</b>：${brief.truth}</p>
      <p><b>隐藏事实</b>：${brief.hiddenFacts.join("、")}</p>
      <p><b>包装/夸大</b>：${brief.exaggerations.join("、")}</p>
      ${brief.premeditated ? `<p><b>预谋角色</b>：${actor?.name ?? "未知"}。TA 从一开始就带着非纯洁婚恋目的进入关系。</p>` : `<p><b>模式判断</b>：${brief.modeBrief ?? "本案不保证存在预谋，性格问题、家庭压力和半真半假同样可能造成伤害。"}</p>`}
    `,
    choices: `<button class="primary" data-next-case type="button">${state.chapter < 3 ? "查看案间战况" : "查看最终战况"}</button>`
  });
  document.querySelector("[data-next-case]")?.addEventListener("click", () => {
    state.scene = "caseInterlude";
    saveState();
    render();
  });
}

function renderCaseInterlude(brief, chapter) {
  const interlude = interludeForCase(brief);
  const nextBrief = state.caseBriefs?.[state.chapter] ?? null;
  storyFrame({
    chapter: "侦探局战况",
    text: `
      <p><b>${CASE_CHAPTERS[state.chapter - 1]?.title ?? chapter} 结案后</b></p>
      <p>${interlude.summary}</p>
      <div class="scene-list">
        <p><b>声誉变化</b>：${signed(interlude.reputationDelta)}｜当前 ${state.agencyReputation}</p>
        <p><b>舆论热度</b>：${signed(interlude.heatDelta)}｜当前 ${state.publicHeat}</p>
        <p><b>下一案影响</b>：${nextBrief ? nextCaseCarryoverLine(nextBrief) : "三案已结束，进入本周目总复盘。"}</p>
        ${nextBrief?.threadLink ? `<p><b>人物牵连</b>：${nextBrief.threadLink.line}</p>` : ""}
      </div>
    `,
    choices: nextBrief
      ? `<button class="primary" data-enter-next-case type="button">进入${CASE_CHAPTERS[state.chapter]?.title ?? "下一案"}</button>`
      : `<button class="primary" data-finish-run type="button">完成本周目复盘</button>`
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
  const interludeLines = (state.caseBriefs ?? []).map((caseBrief) => {
    const interlude = interludeForCase(caseBrief);
    return `${caseBrief.modeLabel ?? caseBrief.label}：声誉 ${signed(interlude.reputationDelta)}，热度 ${signed(interlude.heatDelta)}。${interlude.summary}`;
  });
  storyFrame({
    chapter,
    text: `
      <p><b>本周目三案复盘</b></p>
      <p>你完成了三起连环婚恋案件，其中 ${correct} 起抓住了关键矛盾。</p>
      <p><b>最终战况</b>：声誉 ${state.agencyReputation ?? 0}｜舆论热度 ${state.publicHeat ?? 0}。</p>
      <p>第一案是婚前 case，训练你在承诺前核验包装和风险；第二案是婚后 case，训练你拆共同生活里的责任、账本和边界；第三案是告解模式，训练你站进当事人的视角，同时看见被坑、自欺和可能伤人的部分。</p>
      <div class="scene-list">
        ${interludeLines.map((line) => `<p>${line}</p>`).join("")}
      </div>
    `,
    choices: `
      <button class="primary" data-case-aftermath type="button">查看当事人后续片段</button>
      <button data-action="title" type="button">先回标题</button>
    `
  });
  document.querySelector("[data-case-aftermath]")?.addEventListener("click", () => {
    prepareCompressedAftermath();
    state.scene = "caseAftermath";
    saveState();
    render();
  });
}

function renderCaseAftermath(brief, chapter) {
  const access = state.candidateAccess ?? {};
  const aftermathLines = (state.caseArchive ?? []).map((archive) => {
    const complainant = getNpc(archive.complainantId);
    const respondent = getNpc(archive.respondentId);
    const expectedLabel = accusationLabel({ caseMode: "aftermath" }, archive.result?.expected);
    const correctText = archive.result?.correct ? "关键判断站住了" : "判断留下争议";
    const complainantAccess = access[archive.complainantId];
    const respondentAccess = access[archive.respondentId];
    return `
      <p><b>${archive.modeLabel ?? "旧案"}：${archive.label}</b><br>
      ${correctText}。核心问题更接近：${expectedLabel}。<br>
      ${complainant?.name ?? "来访者"}：${compressedRelationLine(complainantAccess, "来访者")}<br>
      ${respondent?.name ?? "另一方"}：${compressedRelationLine(respondentAccess, "另一方")}
      </p>
    `;
  });
  storyFrame({
    chapter: "关系后续",
    text: `
      <p><b>当事人后续片段</b></p>
      <p>侦探局不再展开十年恋爱模拟，只保留案件后的关系余波。真正重要的是：你的判断让谁更早止损，谁被误伤，谁还在重复同一套选择。</p>
      <div class="scene-list">
        ${aftermathLines.join("")}
      </div>
      <p class="hint">长线恋爱章节暂时降级为素材库，主体验回到逆转裁判式连环案件。</p>
    `,
    choices: `
      <button class="primary" data-action="title" type="button">回到标题，开始下一组案件</button>
    `
  });
}

function prepareCompressedAftermath() {
  state.caseArchive = (state.caseBriefs ?? []).map((brief) => ({
    id: brief.id,
    label: brief.label,
    modeLabel: brief.modeLabel,
    complainantId: brief.complainantId,
    respondentId: brief.respondentId,
    truth: brief.truth,
    result: state.accusationHistory.find((item) => item.caseId === brief.id) ?? null
  }));
  state.candidateAccess = buildCandidateAccess();
  applyCandidateAccessToSeeds();
  addLog("三案调查已归档，侦探局生成当事人后续片段。", "案件后续");
}

function compressedRelationLine(access, fallbackRole) {
  if (!access) return `${fallbackRole}没有留下足够材料，只能进入普通后续观察。`;
  if ((access.riskTags ?? []).includes("旧案核心风险")) return `旧案核心风险被记录，后续关系推进被建议暂停。`;
  if ((access.riskTags ?? []).includes("旧案中部分澄清")) return `部分争议被澄清，后续更适合慢速观察，不适合立刻承诺。`;
  if (access.score >= 70) return `关系风险暂时可控，但仍建议保留证据和边界。`;
  if (access.score <= 40) return `信任基础偏弱，后续大概率进入冷处理或止损。`;
  return `进入观察期，关键要看是否继续回避旧案里的同类问题。`;
}

function enterRomanceFromInvestigation() {
  state.caseArchive = (state.caseBriefs ?? []).map((brief) => ({
    id: brief.id,
    label: brief.label,
    modeLabel: brief.modeLabel,
    complainantId: brief.complainantId,
    respondentId: brief.respondentId,
    truth: brief.truth,
    result: state.accusationHistory.find((item) => item.caseId === brief.id) ?? null
  }));
  state.candidateAccess = buildCandidateAccess();
  applyCandidateAccessToSeeds();
  state.investigationComplete = true;
  state.caseBrief = state.caseBriefs?.[0] ?? null;
  state.chapter = 1;
  state.scene = "recommendations";
  state.selectedFirstDates = recommendedCandidateIds();
  state.primaryNpcId = null;
  state.secondaryNpcId = null;
  addLog("三案调查已归档，良缘算法根据你的声誉、舆论热度和案卷牵连重新排序候选人。", "婚恋入口");
  saveState();
  render();
}

function buildCandidateAccess() {
  const reputation = state.agencyReputation ?? 0;
  const heat = state.publicHeat ?? 0;
  const access = {};
  NPCS.forEach((npc) => {
    access[npc.id] = {
      score: 55 + reputation * 5 - heat * 3,
      trustDelta: reputation >= 4 ? 8 : reputation < 0 ? -8 : 0,
      riskTags: [],
      sources: []
    };
  });

  (state.caseArchive ?? []).forEach((archive) => {
    const ids = [archive.complainantId, archive.respondentId].filter(Boolean);
    ids.forEach((id) => {
      if (!access[id]) return;
      access[id].sources.push(`${archive.modeLabel ?? "旧案"}：${archive.label}`);
      access[id].score += archive.result?.correct ? 6 : -4;
      access[id].trustDelta += archive.result?.correct ? 3 : -3;
    });
    const expected = archive.result?.expected;
    if (access[expected]) {
      access[expected].score -= archive.result?.correct ? 18 : 6;
      access[expected].trustDelta -= archive.result?.correct ? 10 : 3;
      access[expected].riskTags.push(archive.result?.correct ? "旧案核心风险" : "旧案疑点未清");
    }
    if (archive.result?.correct) {
      ids.filter((id) => id !== expected).forEach((id) => {
        if (!access[id]) return;
        access[id].score += 8;
        access[id].trustDelta += 5;
        access[id].riskTags.push("旧案中部分澄清");
      });
    }
  });

  const ranked = Object.entries(access).sort((a, b) => b[1].score - a[1].score);
  const guaranteed = new Set(ranked.slice(0, 3).map(([id]) => id));
  ranked.forEach(([id, item]) => {
    item.score = Math.max(0, Math.min(100, Math.round(item.score)));
    item.trustDelta = Math.max(-20, Math.min(20, Math.round(item.trustDelta)));
    item.unlocked = guaranteed.has(id) || item.score >= 45;
    item.riskTags = [...new Set(item.riskTags)].slice(0, 3);
    item.sources = [...new Set(item.sources)].slice(0, 2);
  });
  return access;
}

function applyCandidateAccessToSeeds() {
  Object.entries(state.candidateAccess ?? {}).forEach(([npcId, access]) => {
    const seed = getSeed(npcId);
    if (!seed) return;
    seed.affection = Math.max(0, Math.min(70, (seed.affection ?? initialNpcAffection(getNpc(npcId))) + (access.trustDelta ?? 0)));
    if ((access.riskTags ?? []).includes("旧案核心风险")) {
      seed.motiveBurst = clampBurst(Math.max(seed.motiveBurst ?? 0, 58));
      seed.internalBurst = clampBurst(Math.max(seed.internalBurst ?? 0, 45));
    }
  });
}

function recommendedCandidateIds() {
  return Object.entries(state.candidateAccess ?? {})
    .filter(([, item]) => item.unlocked)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([id]) => id);
}

function resolveAccusation(brief, accused) {
  const expected = expectedAccusation(brief);
  const enoughContradictions = contradictionsForCase(brief).length >= (brief.premeditated ? 3 : 2);
  const correct = (accused === expected || (expected === "both" && accused === "both")) && enoughContradictions;
  const result = { caseId: brief.id, accused, expected, correct, contradictionCount: contradictionsForCase(brief).length };
  state.accusationHistory = [
    ...(state.accusationHistory ?? []).filter((item) => item.caseId !== brief.id),
    result
  ];
  if (!state.solvedCaseIds.includes(brief.id)) state.solvedCaseIds.push(brief.id);
  applyCaseOutcome(brief, result);
  if (correct) {
    bumpFlag("evidenceClarity", 1);
    state.lastReaction = "你把叙事重新压回证据链，旁听席的风向安静了一瞬。";
  } else {
    bumpFlag("audiencePressure", 1);
    state.lastReaction = enoughContradictions ? "这个判断有点急，旁听席的情绪替事实多走了一步。" : "你还没抓到足够矛盾点，这次指认更像直觉，不像破案。";
  }
  moveCaseScene("caseSolved");
}

function applyCaseOutcome(brief, result) {
  const key = caseNoteKey(brief);
  if (state.caseInterludes?.[key]) return;
  const contradictionCount = result.contradictionCount ?? contradictionsForCase(brief).length;
  const efficient = contradictionCount >= 3 && (caseBudget(brief).remaining ?? 0) >= 1;
  const reputationDelta = result.correct ? (efficient ? 3 : 2) : -1;
  const heatDelta = result.correct ? (brief.caseMode === "confession" ? 0 : -1) : 2;
  state.agencyReputation = Math.max(-3, Math.min(9, (state.agencyReputation ?? 0) + reputationDelta));
  state.publicHeat = Math.max(0, Math.min(9, (state.publicHeat ?? 0) + heatDelta));
  const summary = result.correct
    ? efficient
      ? "你不仅判断对了，还没有把当事人的耐心耗光。后台愿意把更完整的材料交给你。"
      : "你判断对了，但推进过程偏消耗。下一案能拿到信任，但配合度不会无限上升。"
    : "这案的判断没有站稳。旁听席开始争论侦探局是不是被讲故事的人带跑了。";
  state.caseInterludes = {
    ...(state.caseInterludes ?? {}),
    [key]: { reputationDelta, heatDelta, summary, efficient, at: Date.now() }
  };
}

function expectedAccusation(brief) {
  if (brief.premeditated) return brief.premeditatedActorId;
  if (brief.stance === "selfJustifying") return brief.complainantId;
  if (brief.stance === "selfDoubt") return "both";
  if (brief.stance === "badActorFirst") return brief.complainantId;
  if (brief.stance === "trueVictim") return brief.respondentId;
  if (brief.stance === "personalityMismatch") return "noPremeditated";
  return "both";
}

function caseStructureText(brief) {
  if (brief.caseMode === "premarital") return "婚前关系核验：先查择偶定位、承诺、彩礼房产、婚史孩子和债务有没有被包装。";
  if (brief.caseMode === "married") return "婚后共同生活案：先查共同财务、家务育儿、出轨边界、亲子和双方家庭责任。";
  if (brief.caseMode === "confession") return "告解模式：随机当事人自述经历，玩家站在 TA 的视角查被坑、自欺和可能伤人的部分。";
  return brief.premeditated ? "预谋案：确定存在非纯洁婚恋目的。" : "普通案：可能只是性格问题，也可能有人半真半假。";
}

function caseAccusationHint(brief) {
  if (brief.caseMode === "premarital") return "婚前案不急着判输赢，先判断这段关系是否已经带着不该进入婚姻的风险。";
  if (brief.caseMode === "married") return "婚后案不只看谁更委屈，要把共同生活、财务责任和家庭边界拆开。";
  if (brief.caseMode === "confession") return "告解模式不是自责模式，也不是控诉模式；重点是识别关系问题如何被双方共同放大。";
  return brief.premeditated ? "本案存在预谋，需要追钱、资源、时间线和收益。" : "本案可能只是性格、沟通、家庭压力，也可能半真半假。";
}

function moveCaseScene(scene) {
  state.scene = scene;
  saveState();
  render();
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

function selectedEvidenceCard(brief) {
  const id = state.selectedEvidenceCard?.[caseNoteKey(brief)];
  return (brief.evidenceCards ?? []).find((card) => card.id === id) ?? null;
}

function evidenceCardTitles(brief) {
  const titles = (brief.evidenceCards ?? []).map((card) => `${card.type}《${card.title}》`);
  return titles.length ? titles : ["一张关键证据卡"];
}

function confessionMarksForCase(brief) {
  return state.confessionMarks?.[caseNoteKey(brief)] ?? {};
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

function presentEvidenceToTestimony(brief, testimonyIndex) {
  const card = selectedEvidenceCard(brief);
  const testimony = brief.testimony?.[testimonyIndex];
  if (!card || !testimony) return;
  const actionKey = `present:${testimonyIndex}:${card.id}`;
  if (!spendCaseAction(brief, actionKey)) return rerenderWithSave();
  const hit = (card.targets ?? []).includes(testimony.kind);
  if (hit) {
    bumpFlag("evidenceClarity", 1);
    recordEvidenceInsight(brief, `${card.type}《${card.title}》命中 ${testimony.speaker} 的“${testimony.surface}”。`);
    recordContradiction(brief, `出示证据：${card.contradiction}`);
    state.lastReaction = `出示成功：${card.detail}`;
  } else {
    bumpFlag("audiencePressure", 1);
    state.lastReaction = `出示偏了：${card.title} 和这句“${testimony.surface}”没有直接咬合，旁听席开始质疑你在硬扣证据。`;
  }
  saveState();
  render();
}

function recordConfessionMark(brief, nodeId, mark) {
  const key = caseNoteKey(brief);
  state.confessionMarks = {
    ...(state.confessionMarks ?? {}),
    [key]: {
      ...(state.confessionMarks?.[key] ?? {}),
      [nodeId]: mark
    }
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
  const base = brief?.caseMode === "confession" ? 6 : 7;
  const toolBonus = (meta.bonusPoints ?? 0) >= 5 ? 1 : 0;
  const reputationBonus = (state.agencyReputation ?? 0) >= 4 ? 1 : 0;
  const heatPenalty = (state.publicHeat ?? 0) >= 5 ? -1 : 0;
  return Math.max(4, base + toolBonus + reputationBonus + heatPenalty);
}

function caseBudget(brief) {
  return ensureCaseBudget(brief) ?? { max: 0, remaining: 0, used: 0 };
}

function budgetLine(brief) {
  const budget = caseBudget(brief);
  const toolText = (meta.bonusPoints ?? 0) >= 5 ? "｜加班助理 +1" : "";
  return `剩余追问/整理次数 ${budget.remaining}/${budget.max}${toolText}`;
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
    state.lastReaction = "本案追问配额已经用完。你必须带着现有线索做阶段判断。";
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

function evidenceInsightFor(brief, type) {
  if (type === "timeline") return timelineGapText(brief);
  if (type === "money") {
    const moneyCard = (brief.evidenceCards ?? []).find((card) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源|消费|订单|截图/.test(`${card.title}${card.front}${card.detail}`));
    const moneyItem = [...(brief.hiddenFacts ?? []), ...(brief.evidence ?? [])].find((item) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源/.test(item));
    return `${moneyCard ? `${moneyCard.type}《${moneyCard.title}》` : moneyItem ?? brief.evidence?.[0] ?? "账目材料"} 是利益路径的入口，先看谁从关系推进里获得了确定收益。`;
  }
  if (type === "motive") {
    return `动机不是看谁哭得更真，而是看谁能从 ${brief.hiddenFacts?.[0] ?? "关键事实"} 和 ${brief.exaggerations?.[0] ?? "条件包装"} 里获得好处。`;
  }
  return "这份证据只能证明局部事实，不能替任何一方自动背书。";
}

function timelineGapText(brief) {
  const gap = [...(brief.hiddenFacts ?? []), ...(brief.exaggerations ?? [])].find((item) => /时间|婚史|孩子|产检|同居|前任|离婚|失业|借钱|承诺/.test(item));
  return `${gap ?? brief.hiddenFacts?.[0] ?? "关键事实"} 的出现时间，比当事人讲述里的情绪高潮更值得先排。`;
}

function earlyWarningText(brief) {
  if (brief.caseMode === "premarital") return "婚前案高发风险：资料包装、彩礼房产、债务前置、婚育史隐瞒。";
  if (brief.caseMode === "married") return "婚后案高发风险：共同债务、家务育儿默认分配、情绪外包、亲子/前任边界。";
  if (brief.caseMode === "confession") return "告解模式高发风险：只控诉对方、只责备自己、回避自己在关系里的收益。";
  return "本案需要先查时间线、钱和谁从关系推进里获益。";
}

function agencyBattleLine() {
  const reputation = state.agencyReputation ?? 0;
  const heat = state.publicHeat ?? 0;
  const repText = reputation >= 5 ? "口碑很稳" : reputation >= 2 ? "口碑上升" : reputation < 0 ? "信任受损" : "刚开播";
  const heatText = heat >= 5 ? "舆论很吵" : heat >= 2 ? "旁听席开始站队" : "舆论平稳";
  return `${repText}｜${heatText}`;
}

function interludeForCase(brief) {
  const key = caseNoteKey(brief);
  return state.caseInterludes?.[key] ?? {
    reputationDelta: 0,
    heatDelta: 0,
    summary: "本案已经复盘，但战况记录缺失。侦探局只能按中性状态进入下一案。"
  };
}

function signed(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function nextCaseCarryoverLine(nextBrief) {
  const reputation = state.agencyReputation ?? 0;
  const heat = state.publicHeat ?? 0;
  const budget = caseBudgetMax(nextBrief);
  if (reputation >= 4 && heat < 5) return `上一案建立了信任，下一案初始配合度更高，调查配额调整为 ${budget}。`;
  if (heat >= 5) return `上一案引发争议，下一案当事人更防御，调查配额调整为 ${budget}。`;
  if (reputation < 0) return `侦探局判断被质疑，下一案需要用更硬的证据重新建立可信度，调查配额为 ${budget}。`;
  return `上一案影响有限，下一案按常规资源进入，调查配额为 ${budget}。`;
}

function caseDifficultyText(brief) {
  const needed = brief?.premeditated ? 3 : 2;
  if ((brief?.difficulty ?? 0) >= 8) return `高复杂度：至少找 ${needed + 1} 处矛盾再指认`;
  if ((brief?.difficulty ?? 0) >= 6) return `中高复杂度：至少找 ${needed} 处矛盾再指认`;
  return `入门复杂度：至少找 ${needed} 处矛盾再指认`;
}

function allCaseContradictions(brief) {
  const sceneItems = (brief.sceneVersions ?? []).map((item) => item.contradiction).filter(Boolean);
  const testimonyItems = (brief.testimony ?? []).flatMap((item) => (item.followups ?? []).map((followup) => followup.contradiction).filter(Boolean));
  const confessionItems = (brief.confessionTimeline ?? []).map((item) => item.contradiction).filter(Boolean);
  return [...new Set([...sceneItems, ...testimonyItems, ...confessionItems])];
}

function solvedCaseDetails(brief, result) {
  const found = contradictionsForCase(brief);
  const keyItems = allCaseContradictions(brief).slice(0, 4);
  const hit = keyItems.filter((item) => found.includes(item));
  const missed = keyItems.filter((item) => !found.includes(item)).slice(0, 3);
  const expected = result?.expected ?? expectedAccusation(brief);
  return {
    accusedLabel: accusationLabel(brief, result?.accused),
    expectedLabel: accusationLabel(brief, expected),
    hit,
    missed,
    why: explanationForExpected(brief, expected)
  };
}

function accusationLabel(brief, value) {
  if (value === "both") return brief.caseMode === "confession" ? "自我选择和对方行为都要查" : "双方都有隐瞒";
  if (value === "noPremeditated") return brief.caseMode === "confession" ? "不是骗局，核心是选择机制失衡" : "暂判无预谋，只是关系失衡";
  return getNpc(value)?.name ?? "未指认";
}

function explanationForExpected(brief, expected) {
  if (brief.caseMode === "confession") {
    if (expected === brief.complainantId) return "这类告解最危险的地方，是当事人用自责或委屈包装自己的主动选择。";
    if (expected === "both") return "告解模式的关键不是找唯一坏人，而是同时看见外部伤害和自己的选择机制。";
    return "这段经历更像关系失衡，不足以稳定指向预谋骗局。";
  }
  if (expected === brief.complainantId) return "先诉苦者的版本最需要被拆开：TA 先占据受害者位置，但关键时间线和收益路径不完整。";
  if (expected === brief.respondentId) return "另一方更接近核心风险来源：先诉苦者的痛感成立，但仍要用证据而不是情绪来确认。";
  if (expected === "both") return "双方都在修剪叙事，本案的学习点是责任比例，而不是把一个人简化成纯坏人。";
  return "核心更像沟通、性格和家庭压力叠加，直接按预谋处理会过度推断。";
}

function stageForCase(brief) {
  if (brief.stage) return brief.stage;
  if (brief.caseMode === "premarital") return "marriageTalk";
  if (brief.caseMode === "married") return "firstYear";
  if (brief.caseMode === "confession") return "dating";
  if (brief.order === 1) return "dating";
  if (brief.order === 2) return "marriageTalk";
  return "wedding";
}

function renderBurstInterruption() {
  const event = state.interruptEvent;
  const npc = getNpc(event.npcId) ?? currentNpc();
  layout(`
    <section class="burst-screen">
      <div class="burst-portrait">
        <img src="${CHARACTER_ART[npc?.id] ?? CHARACTER_ART.meng}" alt="" />
      </div>
      <article class="burst-card">
        <p class="eyebrow">动机爆发</p>
        <h1>${npc?.name ?? "TA"}</h1>
        <p class="burst-line">${event.line}</p>
        <p class="muted">这不是旁白记录，而是你必须当场处理的关系事实。</p>
        <button class="primary" data-resolve-burst type="button">你处理了这件事</button>
      </article>
    </section>
  `, { sceneClass: "burst-mode" });
  document.querySelector("[data-resolve-burst]")?.addEventListener("click", () => {
    state.interruptEvent = null;
    saveState();
    render();
  });
}

function storyFrame({ chapter, text, choices, side = "" }) {
  maybeApplySecondaryPressure();
  const persona = visualPersona();
  layout(`
    <section class="story-grid">
      <article class="vn-stage">
        <div class="visual-scene ${backdropClass()}" aria-hidden="true">
          <div class="scene-label">${sceneLabel()}</div>
          <div class="character-shadow"></div>
          <img class="character-standee" src="${persona.art}" alt="" />
        </div>
        <div class="dialogue-card">
          <p class="eyebrow">${chapter}</p>
          <div class="speaker-name">${persona.name}</div>
          ${renderBurstAlert()}
          ${secondaryNpcLine()}
          ${reactionLine()}
          ${text}
          ${dangerSignalLine()}
          <div class="choices">${choices}</div>
        </div>
      </article>
      <aside class="status-card">
        ${renderStatusPanel({ state, currentNpc, currentSeed })}
        ${side}
      </aside>
    </section>
  `, { sceneClass: `chapter-${state.chapter}` });

  setTimeout(() => {
    const card = document.querySelector(".dialogue-card");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 50);
}

function maybeApplySecondaryPressure() {
  const primary = currentNpc();
  const secondary = getNpc(state.secondaryNpcId);
  if (!primary || !secondary || primary.id === secondary.id) return;
  if (!/^chapter\d+Start$/.test(state.scene)) return;

  const key = `${state.chapter}:${primary.id}:${secondary.id}`;
  if (state.secondaryPressureChapters.includes(key)) return;

  const seed = getSeed(primary.id);
  if (seed) seed.motiveBurst = clampBurst((seed.motiveBurst ?? 0) + 4);
  state.secondaryPressureChapters.push(key);
  addLog(`${secondary.name} 仍在观察名单里，${primary.name} 察觉到关系并非完全锁定。`, "关系压力");
  saveState();
}

function secondaryNpcLine() {
  const primary = currentNpc();
  const secondary = getNpc(state.secondaryNpcId);
  if (!primary || !secondary || primary.id === secondary.id) return "";
  if (!/^chapter\d+Start$/.test(state.scene)) return "";

  return `<p class="side-signal">手机里，${secondary.name} 发来一条不轻不重的消息。你意识到，观察对象没有消失，只是站在这段关系的余光里。</p>`;
}

function reactionLine() { const text = state.lastReaction; if (!text) return ""; state.lastReaction = null; saveState(); return `<p class="reaction">${text}</p>`; }

function shouldOfferSecondaryDecision() {
  const primary = currentNpc();
  const secondary = getNpc(state.secondaryNpcId);
  if (state.secondaryMessageHandled) return false;
  if (!primary || !secondary || primary.id === secondary.id) return false;
  return state.chapter === 4;
}

function dangerSignalLine() {
  const npc = currentNpc();
  const seed = currentSeed();
  if (!npc || !seed || state.chapter < 2) return "";

  const red = seed.motiveRevealed || effectiveMotiveBurst(seed) >= 70 || effectiveInternalBurst(seed) >= 70;
  const yellow = effectiveInternalBurst(seed) >= 20 || (seed.motiveBurst ?? 0) >= 45;
  const insight = (state.attrs.eq ?? 0) * 10 + (state.attrs.education ?? 0) * 3 + (state.flags.suspicion ?? 0) * 4;

  if (red) return `<p class="signal signal-red">危险信号：${npc.red}</p>`;
  if (!yellow) return "";
  const key = `${npc.id}:${state.chapter}:yellow`;
  if (state.seenDangerSignals?.includes(key)) return "";
  if (yellow && insight >= 58) {
    const pattern = HUMAN_PATTERNS[seed.humanPattern];
    state.seenDangerSignals = [...(state.seenDangerSignals ?? []), key]; saveState();
    return `<p class="signal signal-yellow">微妙信号：${pattern?.signal ?? npc.yellow}</p>`;
  }
  if (!markVagueSignalSeen()) return "";
  state.seenDangerSignals = [...(state.seenDangerSignals ?? []), key]; saveState();
  return `<p class="signal signal-yellow">你感觉这句话哪里不舒服，但暂时还没抓住重点。</p>`;
}

function markVagueSignalSeen() {
  if (state.vagueSignalSeen) return false;
  state.vagueSignalSeen = true; saveState();
  return true;
}

function renderBurstAlert() {
  const event = state.lastBurstEvent;
  const npc = currentNpc();
  if (!event || !npc || event.npcId !== npc.id) return "";

  const label = event.type === "motive" ? "动机显影" : "内在爆发";
  return `<p class="burst-alert"><b>${label}</b>：${event.line}</p>`;
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
  return { name: "孟姐", art: CHARACTER_ART.meng };
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
    return brief?.scene?.name ?? "侦探局";
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

function choiceBtn(dataAttr, label, req = null) {
  if (!req) {
    return `<button ${dataAttr} type="button">${label}</button>`;
  }
  const [attr, minVal] = Object.entries(req)[0];
  const currentVal = state.attrs[attr] ?? 0;
  const passed = currentVal >= minVal;
  const attrChinese = {
    eq: "情商",
    education: "学历",
    wealth: "财富",
    looks: "外貌",
    family: "家庭"
  }[attr] || attr;

  if (passed) {
    return `<button ${dataAttr} type="button"><span class="badge-check badge-pass">[${attrChinese} ≥ ${minVal}]</span> ${label}</button>`;
  } else {
    return `<button ${dataAttr} disabled class="btn-disabled" type="button" title="需要 ${attrChinese} ≥ ${minVal}，当前为 ${currentVal}"><span class="badge-check badge-fail">[锁定: ${attrChinese} < ${minVal}]</span> ${label}</button>`;
  }
}

function earlyChapterContext() {
  return {
    state,
    storyFrame,
    saveState,
    render,
    choosePackaging,
    answerQuestion,
    toggleFirstDate,
    startFirstDates,
    completeFirstDates,
    selectPrimary,
    selectSecondary,
    getNpc,
    getSeed,
    visibleCaseLine,
    currentNpc,
    motiveForCurrent,
    currentCaseLine,
    chapter2Choice,
    chapter3Choice,
    canStopLoss,
    endPrimaryRelationship,
    setScreen,
    settleRunExperience,
    totalPoints,
    choiceBtn
  };
}

function earlyChapterRenderers() { return createEarlyChapterRenderers(earlyChapterContext()); }

function renderChapter1() { earlyChapterRenderers().renderChapter1(); }

function renderChapter2() { earlyChapterRenderers().renderChapter2(); }

function renderChapter3() { earlyChapterRenderers().renderChapter3(); }

function midChapterContext() {
  return {
    state,
    currentNpc,
    currentSeed,
    motiveForCurrent,
    storyFrame,
    currentCaseLine,
    getNpc,
    chapter4Choice,
    chapter5Choice,
    chapter6Choice,
    chapter7Choice,
    chapter8Choice,
    saveState,
    render,
    setScreen,
    canStopLoss,
    endPrimaryRelationship,
    settleRunExperience,
    totalPoints,
    choiceBtn
  };
}

function midChapterRenderers() { return createMidChapterRenderers(midChapterContext()); }

function renderChapter4() { midChapterRenderers().renderChapter4(); }

function renderChapter5() { midChapterRenderers().renderChapter5(); }

function renderChapter6() { midChapterRenderers().renderChapter6(); }

function renderChapter7() { midChapterRenderers().renderChapter7(); }

function renderChapter8() { midChapterRenderers().renderChapter8(); }

function renderChapter9() { renderEndingChapter9(renderContext()); }

function renderChapter10() { renderEndingChapter10(renderContext()); }

render();
