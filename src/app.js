import { ATTRIBUTES, CASE_CHAPTERS, CHAPTERS, DETECTIVE_SPECIALTIES, HIDDEN_TYPES, HUMAN_PATTERNS, MOTIVES, NPCS, PACKAGING_CHOICES, QUESTIONNAIRE } from "./story.js?v=0.14.0";
import { buildStoryEvidenceArchiveCards, visibleReferencedStoryEvidence } from "./caseArchive.js?v=0.14.0";
import { buildCaseDeck, caseEventsFor } from "./caseEngine.js?v=0.14.0";
import { caseModeConfig, generateCasesForMode, normalizeCaseMode } from "./caseModes.js?v=0.14.0";
import { accusationLabel, caseAccusationHint, caseStructureText, evidenceInsightFor, explanationForExpected, runCompleteLineFor, structuralResponsibilityText, timelineGapText } from "./caseNarration.js?v=0.14.0";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, calculateInspirationMax, expectedAccusationForCase, nextInspirationContradictionForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase, structuralExpectedAccusationForCase } from "./caseRuntime.js?v=0.14.0";
import { difficultyLabelForCase, requiredContradictionsForCase } from "./difficulty.js?v=0.14.0";
import { shuffle } from "./random.js?v=0.14.0";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.14.0";
import { BASE_POINTS, CHARACTER_ART, MAX_META_BONUS, PUBLIC_PLAYER_GENDER, SAVE_SLOTS, activeSaveSlot, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot, setActiveSaveSlot } from "./state.js?v=0.14.0";
import { platformRuntime } from "./platformRuntime.js?v=0.14.0";
import { clampBurst, effectiveInternalBurst, effectiveMotiveBurst, initialInternalBurst, initialMotiveBurst, internalBurstChance, internalBurstLine, motiveBurstChance, motiveRevealLine, randomPick, randomRange } from "./relationshipEngine.js?v=0.14.0";
import { handleChapter2Choice, handleChapter3Choice, handleChapter4Choice, handleChapter5Choice, handleChapter6Choice, handleChapter7Choice, handleChapter8Choice, handleChapter9Choice, handleChapter10Choice } from "./legacy/choiceHandlers.js?v=0.14.0";
import { renderChapter9 as renderEndingChapter9, renderChapter10 as renderEndingChapter10 } from "./legacy/endingChapters.js?v=0.14.0";
import { createEarlyChapterRenderers } from "./legacy/earlyChapters.js?v=0.14.0";
import { createMidChapterRenderers } from "./legacy/midChapters.js?v=0.14.0";
import { createScreenRenderers } from "./screens.js?v=0.14.0";
import { renderStatusPanel } from "./statusView.js?v=0.14.0";
import { accusationView, caseOpenView, confessionTimelineView, evidenceView, sceneReviewView, testimonyView } from "./views/caseInvestigationViews.js?v=0.14.0";
import { aftermathView, caseInterludeView, caseSolvedView, runCompleteView } from "./views/caseRecapViews.js?v=0.14.0";
import { contentWarningView, settingsView } from "./views/systemViews.js?v=0.14.0";

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
  state.saveSlot = activeSaveSlot();
  state.screen = "creator";
  clearStateSnapshot(state.saveSlot);
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

function chooseCaseMode(mode) {
  state.caseMode = normalizeCaseMode(mode);
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
  state.storyEvidenceArchive = [];
  state.candidateAccess = {};
  generateNpcSeeds();
  state.caseBriefs = generateCasesForMode(state.caseMode, NPCS, state.attrs, { runNumber: meta.runs ?? 0 });
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
    const role = ["story", "arc"].includes(state.caseMode)
      ? storyThreadRole(brief, index, briefs)
      : index === 1
        ? "上一案被指向的人作为旁证进入本案"
        : index === 2
          ? "前两案的叙事模式成为告解镜像"
          : index === 0
            ? "本周目开案"
            : `第 ${index + 1} 案：前案声誉与人物牵连延续至此`;
    if (linkedNpcId) {
      brief.threadLink = {
        linkedNpcId,
        role,
        line: brief.storyClue ?? `${linkedNpc?.name ?? "上一案当事人"} 的旧案记录会影响本案旁听席对同类叙事的第一反应。`
      };
    } else {
      brief.threadLink = {
        linkedNpcId: null,
        role,
        line: brief.storyClue ?? "今晚的第一案会决定侦探局本周目的基础声誉。"
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

function storyThreadRole(brief, index, briefs) {
  if (state.caseMode === "story") {
    if (index === 0) return "主播主线开案：从客户对话识别问题";
    if (index === briefs.length - 1) return "主播季终复盘：归纳婚恋风险类型";
    return `第 ${index + 1} 案：上一案的问题类型换壳出现`;
  }
  if (brief.tutorialChapter) return "试播训练：识别第一处矛盾";
  if (brief.storySetIndex === 1 && brief.storyCaseInSet === 1) return "匿名资料包第一次进入直播间";
  if (brief.storySetIndex === 2 && brief.storyCaseInSet === 1) return "旧档回声：终局资料夹被重新打开";
  if (index === briefs.length - 1) return "模板告解终局";
  if (brief.storySetIndex === 2) return "旧案线索在本案回响";
  return "上一案材料进入本案";
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
  if (state.caseMode === "story") platformRuntime.achievements.unlock("complete_story_mode");
  if (state.caseMode === "story" && solvedCount === totalCases) platformRuntime.achievements.unlock("perfect_story_mode");
  if (state.caseMode === "arc") platformRuntime.achievements.unlock("complete_arc_mode");
  if (state.caseMode === "anchor") platformRuntime.achievements.unlock("complete_anchor_mode");
  addLog(`本周目结算：获得 ${gained} 点永久机动点。`, "周目经验");
  saveMeta();
  saveState();
  platformRuntime.cloud.syncNow();
  render();
}

function render() {
  if (!state.settings?.contentWarningAccepted) return renderContentWarning();
  if (state.screen === "title") return renderTitle();
  if (state.screen === "settings") return renderSettings();
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
  document.querySelector("[data-accept-streamline]")?.addEventListener("click", () => {
    state.settings = { ...(state.settings ?? {}), contentWarningAccepted: true, streamlineMode: true };
    saveState();
    render();
  });
}

function renderSettings() {
  const currentSlot = activeSaveSlot();
  layout(settingsView({
    currentSlot,
    slots: SAVE_SLOTS,
    soundEnabled: isSoundEnabled(),
    textSpeed: state.settings?.textSpeed,
    streamlineMode: Boolean(state.settings?.streamlineMode)
  }));
  document.querySelectorAll("[data-save-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const slot = setActiveSaveSlot(button.dataset.saveSlot);
      state = loadState() ?? { ...structuredClone(baseState), saveSlot: slot, screen: "settings" };
      state.screen = "settings";
      saveState();
      render();
    });
  });
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
  document.querySelector("[data-streamline-mode]")?.addEventListener("click", () => {
    state.settings = { ...(state.settings ?? {}), streamlineMode: !state.settings?.streamlineMode };
    saveState();
    renderSettings();
  });
  document.querySelector("[data-clear-current-slot]")?.addEventListener("click", () => {
    const slot = activeSaveSlot();
    clearStateSnapshot(slot);
    state = { ...structuredClone(baseState), saveSlot: slot, screen: "settings" };
    saveState();
    render();
  });
}

function layout(content, options = {}) {
  app.innerHTML = `
    <section class="shell ${options.sceneClass ?? ""}">
      <header class="topbar">
        <button class="brand" data-action="title" type="button">婚恋侦探局</button>
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
  return { state, meta, layout, setScreen, totalPoints, totalAttrs, canRemove, canAdd, saveState, render, finalizeCharacter, chooseSpecialty, chooseCaseMode, app, resetGame, isSoundEnabled, toggleSound };
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
  let changed = false;
  if (state.caseBrief !== brief) {
    state.caseBrief = brief;
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
  if (state.scene === "runComplete") return renderCaseRunComplete(brief, "本轮复盘");
  if (state.scene === "caseAftermath") return renderCaseAftermath(brief, chapter);
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
  if (state.caseMode === "anchor") return `${count} 起主播随机案`;
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
  const view = caseOpenView({
    chapter,
    brief,
    playthroughLabel: playthroughLabel(),
    coldOpen: storyColdOpenLine(brief),
    opening,
    difficultyText: caseDifficultyText(brief),
    complainantName: complainant?.name ?? "未知",
    respondentName: respondent?.name ?? "未知",
    structureText: caseStructureText(brief),
    budgetText: budgetLine(brief),
    threadLine: brief.threadLink?.line ?? "本案暂无前案旁证。",
    agencyBattle: agencyBattleLine(),
    earlyWarning: meta.bonusPoints >= 15 ? earlyWarningText(brief) : "",
    showStreamline: Boolean(brief.contentWarning && state.settings?.streamlineMode),
    scanDisabled: caseActionDisabled(brief, "scan:summary")
  });
  storyFrame({ ...view, choices: `${view.choices}${inspirationChoice(brief)}` });
  document.querySelector("[data-case-scene]")?.addEventListener("click", () => moveCaseScene("sceneReview"));
  document.querySelector("[data-streamline-case]")?.addEventListener("click", () => {
    recordEvidenceInsight(brief, `绿色模式核查：跳过敏感证词细读，只保留 ${brief.storyClueObject ?? "关键时间线"}、转账节点和公开材料。`);
    recordContradiction(brief, `绿色模式时间线：${timelineGapText(brief)}`);
    state.lastReaction = "绿色模式已启用：本案会尽量绕开敏感证词细读，改为硬性时间线核查。";
    moveCaseScene("evidence");
  });
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
  const beat = sceneDramaBeat(brief);
  const view = sceneReviewView({
    chapter,
    brief,
    budgetText: budgetLine(brief),
    beat,
    contradictions,
    versionStates: brief.sceneVersions.map((_, index) => ({
      disabled: caseActionDisabled(brief, `version:${index}`),
      done: actionDone(brief, `version:${index}`)
    })),
    questionStates: {
      complainant: caseActionDisabled(brief, "scene:complainant"),
      respondent: caseActionDisabled(brief, "scene:respondent"),
      details: caseActionDisabled(brief, "scene:details")
    }
  });
  storyFrame({ ...view, choices: `${view.choices}${inspirationChoice(brief)}` });
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
  const markStates = {};
  (brief.confessionTimeline ?? []).forEach((node) => {
    Object.keys(markLabels).forEach((mark) => {
      const actionKey = `confession:${node.id}:${mark}`;
      markStates[`${node.id}:${mark}`] = {
        disabled: marks[node.id] || caseActionDisabled(brief, actionKey) ? "disabled" : ""
      };
    });
  });
  storyFrame(confessionTimelineView({
    chapter,
    brief,
    budgetText: budgetLine(brief),
    coldOpen: confessionColdOpen(brief),
    marks,
    markLabels,
    markStates,
    contradictions,
    inspiration: inspirationChoice(brief)
  }));
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
  const testimonyBeat = testimonyDramaBeat(brief);
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
  const presentStates = brief.testimony.map((_, index) => (!selectedCard || caseActionDisabled(brief, `present:${index}:${selectedCard?.id ?? "none"}`) ? "disabled" : ""));
  storyFrame(testimonyView({
    chapter,
    brief,
    budgetText: budgetLine(brief),
    testimonyBeat,
    selectedCard,
    notes,
    contradictions,
    followupStates,
    presentStates,
    specialtySkill: specialtySkillChoice(brief),
    inspiration: inspirationChoice(brief)
  }));
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
  document.querySelector("[data-specialty-skill]")?.addEventListener("click", () => useSpecialtySkill(brief));
}

function renderCaseEvidence(brief, chapter) {
  const contradictions = contradictionsForCase(brief);
  const insights = insightsForCase(brief);
  const hiddenHint = contradictions.length >= 2 || (state.flags.evidenceClarity ?? 0) >= 4
    ? `<p class="signal signal-yellow">你注意到：${brief.hiddenFacts[0]} 和 ${brief.exaggerations[0]} 是本案最容易被包装的地方。</p>`
    : `<p class="signal signal-yellow">你还不能直接看见真相。场景复原和证词里至少还有 ${Math.max(0, 2 - contradictions.length)} 个矛盾点需要追问。</p>`;
  storyFrame(evidenceView({
    chapter,
    brief,
    budgetText: budgetLine(brief),
    archiveBlock: storyEvidenceArchiveLine(brief),
    tutorialPracticeBlock: renderTutorialConfessionPractice(brief),
    contradictionCount: contradictions.length,
    insights,
    timelineHint: meta.bonusPoints >= 10 ? timelineGapText(brief) : "",
    contradictions,
    hiddenHint,
    evidenceStates: {
      timeline: caseActionDisabled(brief, "evidence:timeline"),
      money: caseActionDisabled(brief, "evidence:money"),
      motive: caseActionDisabled(brief, "evidence:motive")
    },
    specialtySkill: specialtySkillChoice(brief),
    inspiration: inspirationChoice(brief)
  }));
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
  document.querySelector("[data-specialty-skill]")?.addEventListener("click", () => useSpecialtySkill(brief));
  document.querySelectorAll("[data-case-scene]").forEach((button) => {
    button.addEventListener("click", () => moveCaseScene(button.dataset.caseScene));
  });
  document.querySelectorAll("[data-cross-evidence]").forEach((button) => {
    button.addEventListener("click", () => useCrossCaseEvidence(brief, button.dataset.crossEvidence));
  });
  document.querySelectorAll("[data-tutorial-confession]").forEach((button) => {
    button.addEventListener("click", () => {
      const [nodeId, mark] = button.dataset.tutorialConfession.split(":");
      useTutorialConfessionMark(brief, nodeId, mark);
    });
  });
}

function renderCaseAccusation(brief, chapter) {
  if (brief?.tutorialChapter && !tutorialReadyForAccusation(brief)) {
    state.lastReaction = "训练案还不能阶段指认。先完成一次现场版本比对、一次证词追问、一次证据出示。";
    state.scene = "evidence";
    saveState();
    return renderCaseEvidence(brief, chapter);
  }
  const complainant = getNpc(brief.complainantId);
  const respondent = getNpc(brief.respondentId);
  const structuralChoice = structuralExpectedAccusation(brief)
    ? `<button data-accuse="${structuralExpectedAccusation(brief)}" type="button">${structuralAccusationButtonText(brief)}</button>`
    : "";
  storyFrame(accusationView({
    chapter,
    brief,
    budgetText: budgetLine(brief),
    contradictions: contradictionsForCase(brief),
    hint: caseAccusationHint(brief),
    complainantName: complainant?.name ?? "先诉苦者",
    respondentName: respondent?.name ?? "另一方",
    structuralChoice,
    inspiration: inspirationChoice(brief)
  }));
  document.querySelectorAll("[data-accuse]").forEach((button) => {
    button.addEventListener("click", () => resolveAccusation(brief, button.dataset.accuse));
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
  const view = caseSolvedView({
    chapter,
    brief,
    result,
    actorName: actor?.name,
    solved,
    contradictionCount: contradictionsForCase(brief).length,
    structuralResponsibility: structuralExpectedAccusation(brief) ? structuralResponsibilityText(brief) : "",
    hasNextCase: Boolean(state.caseBriefs?.[state.chapter])
  });
  storyFrame(view);
  document.querySelector("[data-next-case]")?.addEventListener("click", () => {
    state.scene = "caseInterlude";
    saveState();
    render();
  });
}

function renderCaseInterlude(brief, chapter) {
  const interlude = interludeForCase(brief);
  const nextBrief = state.caseBriefs?.[state.chapter] ?? null;
  const nextHook = nextBrief ? nextPlaythroughTease(nextBrief) : finalPlaythroughTease();
  const view = caseInterludeView({
    currentTitle: caseChapterTitle(brief, state.chapter - 1),
    interlude,
    nextHook,
    transition: brief.storyTransition,
    followupTwist: brief.followupTwist,
    reputation: state.agencyReputation ?? 0,
    heat: state.publicHeat ?? 0,
    nextCarryover: nextBrief ? nextCaseCarryoverLine(nextBrief) : `${caseSetLabel()}已结束，进入本轮总复盘。`,
    nextThreadLine: nextBrief?.threadLink?.line ?? "",
    nextTitle: nextBrief ? caseChapterTitle(nextBrief, state.chapter) : ""
  });
  storyFrame(view);
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
  const interludeLines = (state.caseBriefs ?? []).map((caseBrief) => {
    const interlude = interludeForCase(caseBrief);
    return `${caseBrief.modeLabel ?? caseBrief.label}：声誉 ${signed(interlude.reputationDelta)}，热度 ${signed(interlude.heatDelta)}。${interlude.summary}`;
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
    interludeLines
  });
  storyFrame(view);
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
  storyFrame(aftermathView({ aftermathLines }));
  document.querySelector("[data-complete-run-title]")?.addEventListener("click", completeRunAndReturnToTitle);
}

function completeRunAndReturnToTitle() {
  const keep = {
    saveSlot: state.saveSlot,
    settings: state.settings,
    specialty: state.specialty
  };
  state = {
    ...structuredClone(baseState),
    ...keep,
    screen: "title"
  };
  saveState();
  platformRuntime.cloud.syncNow();
  render();
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
  addLog(`${caseSetLabel()}已归档，侦探局生成当事人后续片段。`, "案件后续");
}

function compressedRelationLine(access, fallbackRole) {
  if (!access) return `${fallbackRole}没有留下足够材料，只能进入普通后续观察。`;
  if ((access.riskTags ?? []).includes("旧案核心风险")) return `旧案核心风险被记录，后续关系推进被建议暂停。`;
  if ((access.riskTags ?? []).includes("旧案中部分澄清")) return `部分争议被澄清，后续更适合慢速观察，不适合立刻承诺。`;
  if (access.score >= 70) return `关系风险暂时可控，但仍建议保留证据和边界。`;
  if (access.score <= 40) return `信任基础偏弱，后续大概率进入冷处理或止损。`;
  return `进入观察期，关键要看是否继续回避旧案里的同类问题。`;
}

// Legacy romance chapters are kept as a material branch; the current main flow ends in compressed aftermath.
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
  addLog(`${caseSetLabel()}已归档，良缘算法根据你的声誉、舆论热度和案卷牵连重新排序候选人。`, "婚恋入口");
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
  const { result, enoughContradictions } = resolveAccusationForCase({
    brief,
    accused,
    contradictionCount: contradictionsForCase(brief).length,
    requiredContradictions: requiredContradictionsForAccusation(brief)
  });
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
    state.lastReaction = "你把叙事重新压回证据链，旁听席的风向安静了一瞬。";
  } else {
    bumpFlag("audiencePressure", 1);
    state.lastReaction = enoughContradictions ? "这个判断有点急，旁听席的情绪替事实多走了一步。" : "你还没抓到足够矛盾点，这次指认更像直觉，不像破案。";
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
  archiveStoryEvidence(brief, result);
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
  if (scene === "accusation" && brief?.tutorialChapter && !tutorialReadyForAccusation(brief)) {
    state.lastReaction = "训练案还不能阶段指认。先完成一次现场版本比对、一次证词追问、一次证据出示，再让孟姐放你上手。";
    state.scene = "evidence";
    saveState();
    render();
    return;
  }
  state.scene = scene;
  saveState();
  render();
}

function tutorialReadyForAccusation(brief) {
  if (!brief?.tutorialChapter) return true;
  return actionDoneWithPrefix(brief, "version:")
    && actionDoneWithPrefix(brief, "followup:")
    && actionDoneWithPrefix(brief, "present:");
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

function archivedStoryEvidence() {
  return Array.isArray(state.storyEvidenceArchive) ? state.storyEvidenceArchive : [];
}

function archivedEvidenceById(id) {
  return archivedStoryEvidence().find((item) => item.id === id) ?? null;
}

function referencedStoryEvidence(brief) {
  return visibleReferencedStoryEvidence(brief, archivedStoryEvidence());
}

function storyEvidenceArchiveLine(brief) {
  const refs = referencedStoryEvidence(brief);
  if (!refs.length) {
    if (brief.storyBridgeClue && contradictionsForCase(brief).length > 0) {
      return `<p class="side-signal"><b>跨套关联</b>：${brief.storyBridgeClue}</p>`;
    }
    return "";
  }
  return `
    <div class="scene-list">
      <p><b>旧案档案可调取</b></p>
      ${refs.map((item) => `
        <p><b>${item.type}｜${item.title}</b><br>
        <span>${item.caseTitle} 归档：${item.contradiction}</span><br>
        <button data-cross-evidence="${item.id}" ${crossEvidenceUsed(brief, item.id) ? "disabled" : ""} type="button">${crossEvidenceUsed(brief, item.id) ? "已调取" : "调取这份旧案证据"}</button></p>
      `).join("")}
    </div>
    ${brief.storyBridgeClue && contradictionsForCase(brief).length > 0 ? `<p class="side-signal"><b>跨套关联</b>：${brief.storyBridgeClue}</p>` : ""}
  `;
}

function crossEvidenceUsed(brief, evidenceId) {
  return actionDone(brief, `cross:${evidenceId}`);
}

function useCrossCaseEvidence(brief, evidenceId) {
  const item = archivedEvidenceById(evidenceId);
  if (!item) {
    state.lastReaction = "旧案档案里没有找到这份证据，暂时无法形成跨案命中。";
    return rerenderWithSave();
  }
  if (!spendCaseAction(brief, `cross:${evidenceId}`, 0)) return rerenderWithSave();
  const insight = `调取旧案《${item.caseTitle}》中的${item.type}《${item.title}》，确认本案不是孤立争议。`;
  const contradiction = `跨案证据命中：${item.contradiction}`;
  recordEvidenceInsight(brief, insight);
  recordContradiction(brief, contradiction);
  bumpFlag("evidenceClarity", 1);
  state.lastReaction = `跨案证据命中：${item.title} 和本案线索接上了。`;
  saveState();
  render();
}

function archiveStoryEvidence(brief, result) {
  if (!brief?.fixedStory) return;
  const key = caseNoteKey(brief);
  const existing = archivedStoryEvidence().filter((item) => item.caseId !== brief.id);
  const cards = buildStoryEvidenceArchiveCards({
    brief,
    caseKey: key,
    foundContradictions: contradictionsForCase(brief),
    result
  });
  state.storyEvidenceArchive = [...existing, ...cards].slice(-40);
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

function renderTutorialConfessionPractice(brief) {
  const nodes = brief.tutorialConfessionPractice ?? [];
  if (!nodes.length) return "";
  const marks = confessionMarksForCase(brief);
  const markLabels = {
    hurtByOther: "被坑",
    selfBlind: "自欺",
    hurtOther: "可能伤了别人"
  };
  return `
    <div class="scene-list">
      <p><b>迷你告解练习</b><br><span>终局会出现告解时间线。这里先练一次：把一句自述标成“被坑”“自欺”或“可能伤了别人”。</span></p>
      ${nodes.map((node, index) => `
        <p><b>${index + 1}. ${node.label}</b>：${node.text}<br>
        <span>${marks[node.id] ? `你的标注：${markLabels[marks[node.id]]}` : "尚未标注"}</span><br>
        ${Object.entries(markLabels).map(([mark, label]) => `
          <button data-tutorial-confession="${node.id}:${mark}" ${marks[node.id] ? "disabled" : ""} type="button">${label}</button>
        `).join("")}
        </p>
      `).join("")}
    </div>
  `;
}

function useTutorialConfessionMark(brief, nodeId, mark) {
  const node = (brief.tutorialConfessionPractice ?? []).find((item) => item.id === nodeId);
  if (!node) return rerenderWithSave();
  recordConfessionMark(brief, nodeId, mark);
  if (mark === node.correctMark) {
    bumpFlag("evidenceClarity", 1);
    recordContradiction(brief, node.contradiction);
    recordEvidenceInsight(brief, `迷你告解练习成立：${node.contradiction}`);
    state.lastReaction = `迷你告解标注成立：${node.contradiction}`;
  } else {
    bumpFlag("audiencePressure", 1);
    state.lastReaction = "这个告解标注有点偏。终局里，讲得像自省的话也要回到事实和边界。";
  }
  saveState();
  render();
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
    recordContradiction(brief, card.contradiction);
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

function budgetLine(brief) {
  const budget = caseBudget(brief);
  const toolText = (meta.bonusPoints ?? 0) >= 5 ? "｜加班助理 +1" : "";
  return `剩余追问/整理次数 ${budget.remaining}/${budget.max}${toolText}`;
}

function inspirationMax(brief) {
  return calculateInspirationMax({
    brief,
    caseMode: state.caseMode,
    bonusPoints: meta.bonusPoints ?? 0
  });
}

function inspirationUsed(brief) {
  return Number(state.inspirationUsage?.[caseNoteKey(brief)] ?? 0);
}

function inspirationRemaining(brief) {
  return Math.max(0, inspirationMax(brief) - inspirationUsed(brief));
}

function nextInspirationContradiction(brief) {
  return nextInspirationContradictionForCase(brief, contradictionsForCase(brief));
}

function inspirationChoice(brief) {
  const remaining = inspirationRemaining(brief);
  const next = nextInspirationContradiction(brief);
  const disabled = remaining <= 0 || !next ? "disabled" : "";
  const remainingText = brief?.tutorialChapter ? "训练案不限" : `剩余 ${remaining}`;
  return `<button data-inspiration ${disabled} type="button">启发道具：指出矛盾点（${remainingText}）</button>`;
}

function specialtySkillChoice(brief) {
  if (!state.specialty) return "";
  const used = actionDone(brief, `skill:${state.specialty}`);
  const labels = {
    audit: "专长技能：财务一键透视",
    emotion: "专长技能：微表情捕捉",
    verification: "专长技能：时间线重组"
  };
  return `<button data-specialty-skill ${used ? "disabled" : ""} type="button">${used ? "专长技能已使用" : labels[state.specialty] ?? "专长技能"}</button>`;
}

function useSpecialtySkill(brief) {
  const skill = state.specialty ?? "verification";
  if (!spendCaseAction(brief, `skill:${skill}`, 0)) return rerenderWithSave();
  if (skill === "audit") {
    const insight = evidenceInsightFor(brief, "money");
    recordEvidenceInsight(brief, `财务一键透视：${insight}`);
    if (/钱|债|房|彩礼|转账|贷款|账户|资源|消费/.test(`${brief.truth}${brief.hiddenFacts?.join("")}${brief.evidence?.join("")}`)) {
      recordContradiction(brief, `财务一键透视：${insight}`);
    }
    state.lastReaction = "财务一键透视已整理：涉及金额、债务、资源和转账的材料被优先标出。";
  } else if (skill === "emotion") {
    const stanceText = {
      trueVictim: "受害叙事较稳定，但仍需证据支撑。",
      halfTruth: "当事人正在说半真话，防御和真实伤害混在一起。",
      badActorFirst: "先诉苦者有恶人先告状倾向。",
      personalityMismatch: "双方更像成熟度和现实预期错配。",
      selfDoubt: "告解里自责过重，可能遮住对方行为。",
      selfJustifying: "告解里自我辩护过强，需要拆主动选择。"
    }[brief.stance] ?? "情绪表现不稳定，需要回到证据。";
    recordEvidenceInsight(brief, `微表情捕捉：${stanceText}`);
    state.lastReaction = `微表情捕捉：${stanceText}`;
  } else {
    const insight = timelineGapText(brief);
    recordEvidenceInsight(brief, `时间线重组：${insight}`);
    recordContradiction(brief, `时间线重组：${insight}`);
    state.lastReaction = "时间线重组已完成：系统把证词里的时间节点重新排列，并标出最可疑的缺口。";
  }
  bumpFlag("evidenceClarity", 1);
  saveState();
  render();
}

function useInspirationHint(brief) {
  const key = caseNoteKey(brief);
  const remaining = inspirationRemaining(brief);
  const contradiction = nextInspirationContradiction(brief);
  if (remaining <= 0) {
    state.lastReaction = "本案启发道具已经用完。现在只能靠已有证据继续推。";
    return rerenderWithSave();
  }
  if (!contradiction) {
    state.lastReaction = "启发道具没有发现新的矛盾点。你已经把本案可提示的证据线索抓完了。";
    return rerenderWithSave();
  }
  state.inspirationUsage = {
    ...(state.inspirationUsage ?? {}),
    [key]: inspirationUsed(brief) + 1
  };
  bumpFlag("evidenceClarity", 1);
  recordContradiction(brief, contradiction);
  recordEvidenceInsight(brief, `启发道具指出：${contradiction}`);
  state.lastReaction = `启发道具指出一个可作为证据使用的矛盾点：${contradiction}`;
  saveState();
  render();
}

function actionDone(brief, actionKey) {
  return Boolean(state.caseActionLog?.[caseNoteKey(brief)]?.[actionKey]);
}

function actionDoneWithPrefix(brief, prefix) {
  const actions = state.caseActionLog?.[caseNoteKey(brief)] ?? {};
  return Object.keys(actions).some((key) => key.startsWith(prefix));
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
  const needed = requiredContradictionsForAccusation(brief);
  const label = difficultyLabelForCase(brief);
  const note = brief?.difficultyProfile?.note ? `｜${brief.difficultyProfile.note}` : "";
  return `${label}：至少找 ${needed} 处矛盾再指认${note}`;
}

function solvedCaseDetails(brief, result) {
  const found = contradictionsForCase(brief);
  const keyItems = allCaseContradictions(brief).slice(0, 4);
  const hit = keyItems.filter((item) => found.includes(item));
  const missed = keyItems.filter((item) => !found.includes(item)).slice(0, 3);
  const expected = result?.expected ?? expectedAccusation(brief);
  const relationshipExpected = result?.relationshipExpected ?? relationshipExpectedAccusation(brief);
  const structuralExpected = result?.structuralExpected ?? structuralExpectedAccusation(brief);
  return {
    accusedLabel: accusationLabel(brief, result?.accused),
    expectedLabel: accusationLabel(brief, expected),
    responsibilityLayer: structuralExpected
      ? `本案关系层更接近 ${accusationLabel(brief, relationshipExpected)}；主线结构层更接近 ${accusationLabel(brief, structuralExpected)}。`
      : "",
    hit,
    missed,
    why: explanationForExpected(brief, expected)
  };
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

function currentPlaythroughNumber() {
  return (meta.runs ?? 0) + 1;
}

function playthroughLabel() {
  const run = currentPlaythroughNumber();
  if (run === 1) return "第一周目";
  if (run === 2) return "第二周目";
  return `第 ${run} 周目`;
}

function playthroughOpening(brief) {
  if (brief.fixedStory) {
    const expectedCases = caseModeConfig(state.caseMode).expectedCases;
    const fallbackTotal = Array.isArray(expectedCases) ? expectedCases[0] : expectedCases;
    const total = state.caseBriefs?.length ?? fallbackTotal;
    const setLabel = brief.storySetName ? `${brief.storySetName}｜` : "";
    if (brief.tutorialChapter) {
      return {
        hook: `试播训练档。${brief.storyArcSummary ?? "先学会从第一版叙事里抓矛盾。"}`,
        director: "孟姐把厚案卷暂时压住：“先别急。第一处矛盾找不准，后面所有漂亮话都会带偏你。”",
        pressure: brief.tutorialTip ?? "孟姐会带你走完现场、证词、证据和指认。"
      };
    }
    if (state.caseMode === "story") {
      return {
        hook: `${setLabel}第 ${brief.order}/${total} 案。${brief.storyArcSummary ?? "主播主线案卷已经接入。"}`,
        director: brief.order === 1
          ? "孟姐打开直播间：“我们不是替客户骂人，是从 TA 怎么说话里找问题。”"
          : "孟姐把上一案关键词贴到白板上：“换一个客户，问题可能换壳；判断方法不能丢。”",
        pressure: brief.storySuspense ?? "主播主线会持续训练你：听话术、找证据、看收益、分责任。"
      };
    }
    return {
      hook: `${setLabel}连环剧场第 ${brief.order}/${total} 案。${brief.storyArcSummary ?? "固定主线案卷已经接入。"}`,
      director: brief.storySetIndex === 1 && brief.storyCaseInSet === 1
        ? "孟姐关掉弹幕预览：“从这份匿名资料包开始，所有讲得太顺的关系都要拆开看。”"
        : brief.storySetIndex === 2 && brief.storyCaseInSet === 1
          ? "孟姐把旧资料夹重新打开：“这不是新坑，是有人开始把旧坑做成产品。”"
          : "孟姐把上一案材料贴到白板上：“别把它当新案，它是上一案留下的回声。”",
      pressure: brief.storySuspense ?? "这条主线会持续回收前案伏笔，不能只按单案输赢判断。"
    };
  }
  const run = currentPlaythroughNumber();
  const complainant = getNpc(brief.complainantId)?.name ?? "来访者";
  const respondent = getNpc(brief.respondentId)?.name ?? "另一方";
  if (run === 1) {
    const hooks = {
      premarital: {
        hook: "侦探局第一次正式开播，弹幕还把这当成情感调解。三分钟后，第一张转账截图被投到屏幕上，气氛变了。",
        director: `孟姐压低声音：“记住，${complainant} 先哭，不代表 ${respondent} 就一定先错。”`,
        pressure: "新手局没有旧案经验，旁听席最容易被第一版故事带走。"
      },
      married: {
        hook: "第一案刚让直播间安静下来，第二通连线就把婚姻里的账本、父母和旧承诺一起倒了出来。",
        director: "律师顾问提醒你：婚后案不能只查感情，要查谁把共同生活变成了单向责任。",
        pressure: "第一案的判断会影响当事人愿意给你多少真实材料。"
      },
      confession: {
        hook: "凌晨场没有双方对质，只有一个人坐在镜头前，说自己想告解。越像忏悔，越要确认 TA 有没有把自己也包装成受害者。",
        director: "孟姐说：“别急着安慰。告解也可能是一种重新剪辑。”",
        pressure: "第一周目的终局考验不是抓坏人，而是看见关系问题怎么被选择、利益和自尊共同放大。"
      }
    };
    return hooks[brief.caseMode] ?? hooks.premarital;
  }
  if (run === 2) {
    const hooks = {
      premarital: {
        hook: "二周目一开场，系统没有给你更简单的题。它给了一段几乎完美的诉苦：时间、眼泪、截图都很齐。",
        director: `孟姐看着你：“上一周目你学会了怀疑。这一周目，别把怀疑误用成偏见。”`,
        pressure: "旧经验会帮你更快抓线索，也会诱导你把相似的人判成同一种人。"
      },
      married: {
        hook: "第二案像是专门反咬你的经验：每个人都承认一点错，每个人都留下一块关键空白。",
        director: "后台提示：二周目的婚后案会更强调责任比例，而不是单一反派。",
        pressure: "如果你只寻找“谁坏”，就会错过“谁在什么环节推动了伤害”。"
      },
      confession: {
        hook: "告解者没有哭，甚至讲得很清醒。清醒不等于诚实，有时只是更会替自己写结案陈词。",
        director: "律师顾问说：“这次你要拆的不是谎言，是一套听起来很成熟的自我辩护。”",
        pressure: "二周目会考你能不能同时保留共情和证据标准。"
      }
    };
    return hooks[brief.caseMode] ?? hooks.premarital;
  }
  return {
    hook: "侦探局已经进入稳定播出，但每一组关系都在提醒你：熟练不等于看透。",
    director: "孟姐把新案卷推过来：“按流程，但别被流程催眠。”",
    pressure: "高周目更看重效率、矛盾命中和误伤控制。"
  };
}

function storyColdOpenLine(brief) {
  if (!brief.storyColdOpen) return "";
  return `<p class="episode-hook"><b>冷开场</b>：${brief.storyColdOpen}</p>`;
}

function sceneDramaBeat(brief) {
  if (brief.fixedStory) {
    return brief.storySuspense ?? `${brief.scene.name} 不是孤立现场，它会把上一案的未解线索推到台前。`;
  }
  const complainant = getNpc(brief.complainantId)?.name ?? "来访者";
  const respondent = getNpc(brief.respondentId)?.name ?? "另一方";
  const run = currentPlaythroughNumber();
  if (run === 1 && brief.order === 1) {
    return `${complainant} 的版本听起来完整，${respondent} 的版本却只多出一个细节：那天不是第一次谈到这件事。第一个周目最容易犯的错，就是把“讲得顺”当成“讲得真”。`;
  }
  if (run === 2) {
    return `场景被复原成两套几乎都合理的说法。你已经知道要找矛盾，但这次更重要的是判断：矛盾来自撒谎，还是来自两个人都在保护自己。`;
  }
  return `${brief.scene.name} 像一张被折过的纸，每个人摊开时都只露出对自己有利的折痕。`;
}

function confessionColdOpen(brief) {
  const name = getNpc(brief.complainantId)?.name ?? "告解者";
  if (brief.fixedStory) {
    return `${brief.storySuspense ?? `${name} 的告解不是结论，而是最后一层需要核验的叙事。`} ${brief.storyMislead ?? ""}`;
  }
  if (currentPlaythroughNumber() === 1) {
    return `${name} 开口第一句不是“TA 对不起我”，而是“我好像也有问题”。这句话很容易让人放松警惕，但侦探局只相信被核验过的自省。`;
  }
  if (currentPlaythroughNumber() === 2) {
    return `${name} 把每个节点都讲得像复盘报告，连自己的脆弱都摆得很体面。二周目的难点是：成熟表达也可能遮住真实收益。`;
  }
  return `${name} 的告解需要被拆成节点，而不是被当成完整答案。`;
}

function testimonyDramaBeat(brief) {
  const complainant = getNpc(brief.complainantId)?.name ?? "先诉苦者";
  const respondent = getNpc(brief.respondentId)?.name ?? "另一方";
  if (brief.fixedStory) {
    return `主线追问：${brief.storyMislead ?? brief.storySuspense ?? "这句证词不仅属于本案，也可能在下一案被重新解释。"}`;
  }
  if (currentPlaythroughNumber() === 1) {
    return `灯光切到交叉追问，${complainant} 和 ${respondent} 的台词第一次真正咬在一起。你不需要赢过他们，只需要让前后说法互相照见。`;
  }
  if (currentPlaythroughNumber() === 2) {
    return `二周目的证词不会把破绽直接递给你。真正的破口藏在“我也有错”和“但 TA 更过分”之间。`;
  }
  return "证词越多，越要把每句话放回证据卡和时间线里。";
}

function nextPlaythroughTease(nextBrief) {
  if (state.caseMode === "arc") {
    if (nextBrief?.tutorialChapter) return `下一份是试播训练档：${nextBrief.storyArcSummary ?? "先学会找第一处矛盾。"}`;
    if (nextBrief?.storySetIndex === 2 && nextBrief?.storyCaseInSet === 1) {
      return `旧资料夹开始反噬：${nextBrief.storyColdOpen ?? nextBrief.storyArcSummary ?? "被归档的材料重新咬住了新的来电。"}`;
    }
    return nextBrief?.storyColdOpen
      ? `下一案冷开场：${nextBrief.storyColdOpen}`
      : `下一案会继续回收主线证据：${nextBrief?.storyArcSummary ?? "固定主线继续推进。"}`;
  }
  if (state.caseMode === "story") {
    return nextBrief?.storyColdOpen
      ? `下一通客户连线：${nextBrief.storyColdOpen}`
      : `下一案会换一种婚恋问题继续训练判断：${nextBrief?.storyArcSummary ?? "主播主线继续推进。"}`;
  }
  if (currentPlaythroughNumber() === 1) {
    return `下一案不是升级版吵架，而是换一种关系阶段继续追问：如果婚前没查清，婚后会用账本和责任重新出现。`;
  }
  if (currentPlaythroughNumber() === 2) {
    return `下一案会故意让熟悉的风险换一张脸。上一案的经验能用，但不能照抄。`;
  }
  return `${nextBrief.modeLabel ?? "下一案"} 已经接入，上一案的声誉和舆论会先你一步进入直播间。`;
}

function finalPlaythroughTease() {
  if (state.caseMode === "arc") return "红线笔记、匿名资料包和模板后台已经收束。最后要复盘的不是谁最坏，而是真实痛苦如何被包装、复制、收费。";
  if (state.caseMode === "story") return "主播主线已经收束。最后要复盘的不是谁最坏，而是你能不能从客户对话里判断问题究竟长在哪里。";
  if (currentPlaythroughNumber() === 1) return "第一周目的最后一题已经结束，但真正留下来的不是答案，是你第一次学会慢一点相信叙事。";
  if (currentPlaythroughNumber() === 2) return "第二周目结束时，系统不再奖励单纯怀疑，而是奖励你能把怀疑、共情和证据同时拿稳。";
  return "本周目已经收束，下一组案件会继续考验你的判断习惯。";
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
          ${visualPortraitLayer(persona)}
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
        ${renderCaseCastPanel()}
        ${side}
      </aside>
    </section>
  `, { sceneClass: `chapter-${state.chapter}` });

  document.querySelectorAll("[data-inspiration]").forEach((button) => {
    button.addEventListener("click", () => {
      const brief = activeCaseBrief();
      if (brief) useInspirationHint(brief);
    });
  });

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

function visualPortraitLayer(persona) {
  if (state.caseBriefs?.length && !state.investigationComplete) {
    const brief = activeCaseBrief();
    const complainant = getNpc(brief?.complainantId);
    const respondent = getNpc(brief?.respondentId);
    const activeId = state.primaryNpcId ?? complainant?.id;
    const people = [
      { role: "先诉苦", npc: complainant },
      { role: "另一方", npc: respondent }
    ].filter((item) => item.npc);
    return `
      <div class="case-duel-portraits">
        ${people.map((item) => `
          <figure class="case-portrait ${activeId === item.npc.id ? "active" : ""}">
            <img src="${CHARACTER_ART[item.npc.id]}" alt="" />
            <figcaption><span>${item.role}</span><b>${item.npc.name}</b></figcaption>
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

function renderCaseCastPanel() {
  if (!state.caseBriefs?.length || state.investigationComplete) return "";
  const brief = activeCaseBrief();
  const complainant = getNpc(brief?.complainantId);
  const respondent = getNpc(brief?.respondentId);
  if (!complainant || !respondent) return "";
  const currentId = state.primaryNpcId ?? complainant.id;
  return `
    <div class="case-cast-panel">
      <h3>本案当事人</h3>
      ${[["先诉苦者", complainant], ["另一方", respondent]].map(([role, npc]) => `
        <div class="case-cast-row ${currentId === npc.id ? "active" : ""}">
          <img src="${CHARACTER_ART[npc.id]}" alt="" />
          <p><b>${npc.name}</b><span>${role}｜${npc.archetype}</span></p>
        </div>
      `).join("")}
    </div>
  `;
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
