import { HOST_NAME } from "../hostProfile.js?v=0.20.95";

export function choiceGroupHtml(label, content, className = "", note = "") {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group ${escapeHtml(className)}">
      <div class="choice-label">
        <span>${escapeHtml(label)}</span>
        ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      </div>
      <div class="choice-stack">${content}</div>
    </section>
  `;
}

export function flowGroupHtml(content) {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group flow-group">
      <div class="choice-stack">${content}</div>
    </section>
  `;
}

export function callLineHtml(line = {}) {
  if (line.role === "pause") return '<div class="call-pause" aria-hidden="true"></div>';
  if (line.role === "stage") {
    return `<div class="call-stage-direction"><span>${escapeHtml(line.text ?? "")}</span></div>`;
  }
  const role = line.role === "host" || line.speaker === "你" || line.speaker === HOST_NAME
    ? "host"
    : line.role === "director" ? "other" : "caller";
  const speaker = role === "host" ? HOST_NAME : line.speaker ?? "咨询者";
  const text = line.text ?? line.version ?? line.line ?? "";
  return `
    <div class="call-line ${role}">
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

export function callDialogueHtml(lines = [], className = "") {
  const rows = (lines ?? []).filter((line) => line?.role === "pause" || line?.text || line?.version || line?.line);
  if (!rows.length) return "";
  return `
    <div class="call-dialogue ${escapeHtml(className)}">
      ${rows.map((line) => callLineHtml(line)).join("")}
    </div>
  `;
}

export function choiceReviewHtml(rows = []) {
  const content = callDialogueHtml(rows, "review-dialogue");
  if (!content) return "";
  return `
    <details class="choice-review call-log-drawer">
      <summary>
        <span>上一问</span>
      </summary>
      <div class="call-log-drawer-body">
        ${content}
      </div>
    </details>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
