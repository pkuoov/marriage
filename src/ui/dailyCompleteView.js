export function dailyCompleteHtml({
  issueLineText = "",
  route = {},
  issue = {},
  rank = "",
  result = {},
  pickedQuote = "",
  quoteComparisonHtml = "",
  caught = ""
} = {}) {
  return `
    <p><b>今日收麦</b></p>
    <p>${escapeHtml(issueLineText)}</p>
    <section class="share-result-card">
      <div class="share-card-head"><span>今日来电</span><em>${escapeHtml(route.label)}</em></div>
      <div class="share-player-type">
        <span>你是</span>
        <b>${escapeHtml(route.playerType)}</b>
      </div>
      <p class="share-card-title">${escapeHtml(route.shareTitle)}</p>
      <div class="issue-meter"><span style="width:${Number(issue.percent ?? 0)}%"></span></div>
      <p class="issue-score">${escapeHtml(rank)}</p>
      ${result.dailyBadge ? `<div class="daily-badge-card compact"><span>今日收麦</span><b>能挂麦了</b></div>` : ""}
      <p class="share-card-finding"><span>你接的那句</span>${escapeHtml(pickedQuote)}</p>
      ${quoteComparisonHtml}
      <p class="share-card-finding"><span>今晚瓜点</span>${escapeHtml(caught)}</p>
      <small>${escapeHtml(route.shareQuestion)}</small>
    </section>
  `;
}

export function dailyCompleteChoicesHtml() {
  return flowGroup(`
    <button class="primary" data-copy-result type="button">复制吃瓜文案</button>
    <button data-action="title" type="button">回标题</button>
  `);
}

export function dailyCompleteShareText({ route = {}, pickedQuote = "" } = {}) {
  return `${route.shareTitle ?? ""}\n我是：${route.playerType ?? ""}\n我接的那句：${pickedQuote}\n${route.shareQuestion ?? ""}`;
}

function flowGroup(content) {
  return `<div class="choice-flow">${content}</div>`;
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
