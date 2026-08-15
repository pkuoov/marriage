import { HOST_NAME } from "../hostProfile.js";

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

export function flowGroupHtml(content, { label = "", note = "" } = {}) {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group flow-group">
      ${label || note ? `
        <div class="flow-group-copy">
          ${label ? `<span>${escapeHtml(label)}</span>` : ""}
          ${note ? `<small>${escapeHtml(note)}</small>` : ""}
        </div>
      ` : ""}
      <div class="choice-stack">${content}</div>
    </section>
  `;
}

export function choiceButtonBodyHtml(label = "", meta = "", detail = "") {
  return `
    <span class="choice-button-body">
      <span class="choice-button-main">
        <b>${escapeHtml(label)}</b>
        ${detail ? `<span>${escapeHtml(detail)}</span>` : ""}
      </span>
      ${meta ? `<small class="choice-cost-meta">${escapeHtml(meta)}</small>` : ""}
    </span>
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
  const autoAdvanceAttr = line.autoAdvanceNext === true ? ' data-auto-advance-next="true"' : "";
  return `
    <div class="call-line ${role}"${autoAdvanceAttr}>
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

export function callDialogueHtml(lines = [], className = "", { autoPairQuestions = false } = {}) {
  const rows = (lines ?? []).filter((line) => line?.role === "pause" || line?.text || line?.version || line?.line);
  if (!rows.length) return "";
  return `
    <div class="call-dialogue ${escapeHtml(className)}">
      ${rows.map((line, index) => callLineHtml({
        ...line,
        autoAdvanceNext: line.autoAdvanceNext === true || autoPairQuestions && isQuestionAnswerPair(line, rows[index + 1])
      })).join("")}
    </div>
  `;
}

function isQuestionAnswerPair(line = {}, nextLine = null) {
  if (!nextLine || ["pause", "stage"].includes(line.role) || ["pause", "stage"].includes(nextLine.role)) return false;
  const role = spokenRole(line);
  const nextRole = spokenRole(nextLine);
  const text = String(line.text ?? line.version ?? line.line ?? "").trim();
  return role !== nextRole && ["host", "caller"].includes(role) && ["host", "caller"].includes(nextRole) && /[？?][」』”’\"']?$/.test(text);
}

function spokenRole(line = {}) {
  return line.role === "host" || line.speaker === "你" || line.speaker === HOST_NAME ? "host" : "caller";
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
