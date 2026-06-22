import { caseModeConfig } from "./caseModes.js?v=0.14.0";

export function renderStatusPanel({ state, currentNpc }) {
  const npc = currentNpc();
  if (state.caseBrief && !state.investigationComplete) return renderCompactCaseStatus(state, npc);
  return `
    <h2>侦探手账</h2>
    <h3>侦探局战况</h3>
    <p>声誉 ${state.agencyReputation ?? 0}｜舆论热度 ${state.publicHeat ?? 0}</p>
    ${renderCaseStatus(state)}
  `;
}

function renderCompactCaseStatus(state, npc) {
  const brief = state.caseBrief;
  const key = brief.id ?? `case-${state.chapter}`;
  const total = state.caseBriefs?.length ?? 0;
  const mode = caseModeConfig(state.caseMode).label;
  const title = brief.storyArcTitle ?? brief.label;
  const contradictions = state.contradictionLog?.[key] ?? [];
  const budget = state.caseBudgets?.[key];
  const budgetLine = budget ? `${budget.remaining}/${budget.max}` : "未开始";
  return `
    <h2>直播手账</h2>
    <div class="compact-status">
      <p><b>${mode}</b><span>第 ${state.chapter}/${total || "?"} 案</span></p>
      <p><b>${title}</b><span>难度 ${brief.difficulty ?? "?"}</span></p>
      <p><b>追问配额</b><span>${budgetLine}</span></p>
      <p><b>已抓矛盾</b><span>${contradictions.length ? contradictions.length : "0"} 处</span></p>
      ${npc ? `<p><b>当前连线</b><span>${npc.name}</span></p>` : ""}
    </div>
    ${contradictions.length ? `<p class="muted">最近：${contradictions.slice(-1)[0]}</p>` : `<p class="muted">先别急着站队，第一处矛盾还没落笔。</p>`}
  `;
}

function renderCaseStatus(state) {
  if (state.caseBrief && !state.investigationComplete) {
    const total = state.caseBriefs?.length ?? 0;
    const mode = caseModeConfig(state.caseMode).label;
    const title = state.caseBrief.storyArcTitle ?? state.caseBrief.label;
    const setLine = state.caseBrief.storySetName ? `<p class="muted">${state.caseBrief.storySetName}</p>` : "";
    return `<h3>后台案件</h3><p>${mode}｜第 ${state.chapter}/${total || "?"} 案</p>${setLine}<p>${title}｜难度 ${state.caseBrief.difficulty}</p><p class="muted">${state.caseBrief.storyArcSummary ?? state.caseBrief.publicHook}</p>${state.caseBrief.storyClueObject ? `<p class="muted">悬念物：${state.caseBrief.storyClueObject}</p>` : ""}`;
  }
  if (state.investigationComplete) {
    const archiveCount = state.caseArchive?.length ?? 0;
    return `<h3>调查归档</h3><p>已归档 ${archiveCount} 起案件</p><p class="muted">候选排序受旧案牵连、声誉和舆论热度影响。</p>`;
  }
  return "";
}
