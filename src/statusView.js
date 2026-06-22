import { ATTRIBUTES, HUMAN_PATTERNS } from "./story.js?v=0.14.0";
import { compactProfileText, relationshipStatusLines } from "./profileView.js?v=0.14.0";

export function renderStatusPanel({ state, currentNpc, currentSeed }) {
  const npc = currentNpc();
  const latest = state.log.find((item) => item.type !== "系统");
  return `
    <h2>侦探手账</h2>
    <div class="relationship-states">
      ${relationshipStatusLines(state).map((line) => `<p>${line}</p>`).join("")}
    </div>
    <h3>侦探局战况</h3>
    <p>声誉 ${state.agencyReputation ?? 0}｜舆论热度 ${state.publicHeat ?? 0}</p>
    ${renderStopLossStatus(state, npc)}
    <h3>调查画像</h3>
    <p>${compactProfileText(state, ATTRIBUTES).join("｜")}</p>
    ${renderCaseStatus(state)}
    ${npc ? `<h3>人物印象</h3><p>${npc.name}｜${npc.archetype}</p><p class="muted">${npc.intro}</p>${patternMoodLine(state, currentSeed())}` : ""}
    ${latest ? `<h3>近况</h3><p>${latest.text}</p>` : ""}
  `;
}

function renderCaseStatus(state) {
  if (state.caseBrief && !state.investigationComplete) {
    const total = state.caseBriefs?.length ?? 0;
    const mode = state.caseMode === "anchor" ? "主播模式" : "故事模式";
    const title = state.caseBrief.storyArcTitle ?? state.caseBrief.label;
    const setLine = state.caseBrief.storySetName ? `<p class="muted">${state.caseBrief.storySetName}</p>` : "";
    const bridgeLine = state.caseBrief.storyBridgeClue ? `<p class="muted">跨套关联：${state.caseBrief.storyBridgeClue}</p>` : "";
    return `<h3>后台案件</h3><p>${mode}｜第 ${state.chapter}/${total || "?"} 案</p>${setLine}<p>${title}｜难度 ${state.caseBrief.difficulty}</p><p class="muted">${state.caseBrief.storyArcSummary ?? state.caseBrief.publicHook}</p>${state.caseBrief.storyClueObject ? `<p class="muted">悬念物：${state.caseBrief.storyClueObject}</p>` : ""}${bridgeLine}`;
  }
  if (state.investigationComplete) {
    const archiveCount = state.caseArchive?.length ?? 0;
    return `<h3>调查归档</h3><p>已归档 ${archiveCount} 起案件</p><p class="muted">候选排序受旧案牵连、声誉和舆论热度影响。</p>`;
  }
  return "";
}

function renderStopLossStatus(state, npc) {
  if (!npc || state.chapter < 3) return "";
  const f = state.flags;
  const suspicion = f.suspicion ?? 0;
  const boundary = f.boundary ?? 0;
  let ready = false;

  if (state.chapter <= 4) ready = suspicion >= 5 && boundary >= 4;
  else if (state.chapter === 5) ready = (f.weddingPressure ?? 0) + (f.parentConflict ?? 0) + suspicion >= 9 && boundary >= 5;
  else if (state.chapter === 6) ready = (f.householdPressure ?? 0) + (f.parentConflict ?? 0) + suspicion >= 10 && boundary >= 6;
  else if (state.chapter === 7) ready = (f.debtPressure ?? 0) + suspicion >= 8 || ((f.assetProtection ?? 0) >= 7 && boundary >= 8);
  else if (state.chapter === 8) ready = (f.childPressure ?? 0) + (f.householdPressure ?? 0) + (f.parentConflict ?? 0) >= 11 && boundary >= 8;
  else return "";

  return ready
    ? `<div class="stop-loss-status status-ready"><span class="status-badge badge-ready">直觉很清楚</span><p class="criteria-desc">你已经认真想过离开。</p></div>`
    : `<div class="stop-loss-status status-locked"><span class="status-badge badge-locked">还在犹豫</span><p class="criteria-desc">有些不舒服还没变成答案。</p></div>`;
}

function patternMoodLine(state, seed) {
  if (!seed?.humanPattern) return "";
  const insight = (state.attrs.eq ?? 0) * 10 + (state.flags.suspicion ?? 0) * 5;
  const pattern = HUMAN_PATTERNS[seed.humanPattern];
  if (insight < 55 && !seed.motiveRevealed) return `<p class="muted">你还说不清 TA 的底色。</p>`;
  return `<p class="muted">${pattern.signal}</p>`;
}
