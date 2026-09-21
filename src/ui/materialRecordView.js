// Only pass received cards here. Reasoning notes and contradiction answers are
// deliberately excluded: the document viewer displays the source material.
export function materialRecordHtml(items = []) {
  return items.map((item) => `<article class="readable-material" data-received-material="${escapeHtml(item.id)}">
    <header><small>${escapeHtml(item.kind ?? "已收到的材料")}</small><h3>${escapeHtml(item.label ?? "材料")}</h3></header>
    ${item.front ? `<p>${escapeHtml(item.front)}</p>` : ""}
    ${item.sourceTable ? sourceTableHtml(item.sourceTable) : ""}
    ${item.detail ? `<p class="material-reading-note">${escapeHtml(item.detail)}</p>` : ""}
  </article>`).join("");
}
function sourceTableHtml(table) {
  return `<div class="material-source-table"><table><thead><tr>${(table.columns ?? []).map(column => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${(table.rows ?? []).map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]); }
