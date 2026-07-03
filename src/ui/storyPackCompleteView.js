export function storyPackCompleteHtml({
  displayBest = {},
  theme = {},
  boundaryProfile = {},
  pressureProfile = {},
  materialProfile = {},
  quoteProfile = {},
  objectProfile = {},
  hiddenThreadProfile = {},
  briefs = [],
  results = [],
  routeProfiles = [],
  comments = [],
  playerType = "",
  shareTitle = "",
  aftertaste = "",
  closingLine = "",
  callCountText = "这几路麦"
} = {}) {
  return `
    <p><b>今晚收麦</b></p>
    <p>${escapeHtml(storyPackCallLine(callCountText))}你最常回头看的，是：${escapeHtml(displayBest.label)}。</p>
    <section class="share-result-card">
      <div class="share-card-head"><span>${escapeHtml(theme.title)}</span><em>${escapeHtml(displayBest.label)}</em></div>
      <div class="share-player-type">
        <span>你是</span>
        <b>${escapeHtml(playerType)}</b>
      </div>
      <p class="share-card-title">${escapeHtml(shareTitle)}</p>
      <p class="weekly-theme-thesis">${escapeHtml(theme.thesis)}</p>
      <p class="issue-score">${escapeHtml(aftertaste)}</p>
      ${weeklyProfileLine("事实边界", boundaryProfile)}
      ${weeklyProfileLine("现场压力", pressureProfile)}
      ${weeklyProfileLine("材料圈点", materialProfile)}
      ${weeklyProfileLine("收麦原话", quoteProfile)}
      ${weeklyProfileLine("这晚翻过", objectProfile)}
      ${hiddenThreadCardHtml(hiddenThreadProfile)}
      <div class="weekly-result-list">
        ${briefs.map((item, index) => {
          const result = results[index] ?? {};
          const route = routeProfiles[index] ?? {};
          return `<p><span>${index + 1}. ${escapeHtml(item.label)}</span><b>${escapeHtml(route.label)}</b><small>${escapeHtml(result.dailyAccuseLabel ?? "未收麦")}</small></p>`;
        }).join("")}
      </div>
      <div class="comment-wall">
        <span>评论区审判墙</span>
        ${comments.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </div>
      <small>${escapeHtml(closingLine)}</small>
    </section>
  `;
}

export function storyPackShareText({
  theme = {},
  displayBest = {},
  pressureProfile = {},
  materialProfile = {},
  quoteProfile = {},
  hiddenThreadProfile = {},
  playerType = ""
} = {}) {
  return [
    "《直播间大侦探》试玩收麦",
    theme.title ?? "",
    `我今晚常看的线：${displayBest.label ?? ""}`,
    `现场压力：${pressureProfile.label ?? ""}`,
    `材料圈点：${materialProfile.label ?? ""}`,
    `收麦原话：${quoteProfile.label ?? ""}`,
    hiddenThreadProfile?.label ? `散场暗线：${hiddenThreadProfile.label}` : "",
    playerType
  ].filter(Boolean).join("\n");
}

function weeklyProfileLine(label, profile = {}) {
  if (!profile.total) return "";
  return `
    <div class="weekly-boundary-line">
      <span>${escapeHtml(label)}</span>
      <b>${escapeHtml(profile.label)}</b>
      <p>${escapeHtml(profile.line)}</p>
    </div>
  `;
}

function hiddenThreadCardHtml(profile = {}) {
  if (!profile.total) return "";
  return `
    <div class="hidden-thread-card">
      <span>${escapeHtml(profile.title ?? "今晚暗线")}</span>
      <b>${escapeHtml(profile.label ?? "")}</b>
      <p>${escapeHtml(profile.line ?? "")}</p>
      ${Array.isArray(profile.beats) && profile.beats.length ? `<ol>${profile.beats.map((beat) => `<li>${escapeHtml(beat)}</li>`).join("")}</ol>` : ""}
    </div>
  `;
}

function storyPackCallLine(callCountText = "这几路麦") {
  return callCountText === "这一路麦" ? `${callCountText}挂了。` : `${callCountText}都挂了。`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
