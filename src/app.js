import { ATTRIBUTES, CHAPTERS, HIDDEN_TYPES, HUMAN_PATTERNS, MOTIVES, NPCS, PACKAGING_CHOICES, QUESTIONNAIRE } from "./story.js?v=0.14.0";
import { buildCaseDeck, caseEventsFor } from "./caseEngine.js?v=0.14.0";
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
  if (!state.gender || totalAttrs() !== totalPoints()) return;
  state.profileDone = true;
  generateNpcSeeds();
  state.screen = "chapter";
  if (state.startMode === "freeLove") {
    const npc = randomPick(NPCS.filter((item) => item.gender !== state.gender));
    state.primaryNpcId = npc.id; state.selectedFirstDates = [npc.id]; state.chapter = 2; state.scene = "freeLoveIntro"; state.flags.affection += 2;
    applyCaseStage(npc.id, "dating"); addLog(`自由恋爱开局：你已经和 ${npc.name} 交往了一段时间。`, "开局");
  } else {
    state.chapter = 1;
    state.scene = "intro";
  }
  saveState();
  render();
}

function choosePackaging(choice) {
  state.packaging = choice.id;
  if (choice.id === "honest") state.flags.boundary += 1;
  if (choice.id === "boost") state.flags.reality += 1;
  if (choice.id === "hide") state.flags.riskTolerance += 1;
  if (choice.id === "delegate") state.flags.agencyControl += 1;
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
  if (action === "background") state.flags.suspicion += 1;
  if (action === "redLady") state.flags.agencyControl += 1;
  if (action === "continue") state.flags.affection += 1;
  state.scene = "speedDatingNight";
  saveState();
  render();
}

function selectPrimary(npcId) {
  state.primaryNpcId = npcId;
  applyCaseStage(npcId, "dating");
  state.chapter = 2;
  state.scene = "chapter2Start";
  addLog(`你决定继续了解 ${getNpc(npcId).name}。`, "关系");
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
    (state.flags.educationPressure ?? 0);
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
        <button class="brand" data-action="title" type="button">中国式婚恋：十年一梦</button>
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
  return { state, meta, layout, setScreen, totalPoints, totalAttrs, canRemove, canAdd, saveState, render, finalizeCharacter, app, resetGame, isSoundEnabled, toggleSound };
}

function screenRenderers() { return createScreenRenderers(screenContext()); }

function renderTitle() { screenRenderers().renderTitle(); }

function renderCreator() { screenRenderers().renderCreator(); }

function renderChapter() {
  if (state.interruptEvent) return renderBurstInterruption();
  const renderers = [renderChapter1, renderChapter2, renderChapter3, renderChapter4, renderChapter5, renderChapter6, renderChapter7, renderChapter8, renderChapter9, renderChapter10];
  return (renderers[state.chapter - 1] ?? renderTitle)();
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
