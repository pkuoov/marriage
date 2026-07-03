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
  const role = line.role === "host" || line.speaker === "你" ? "host" : "caller";
  const speaker = role === "host" ? "你" : "咨询者";
  const text = line.text ?? line.version ?? line.line ?? "";
  return `
    <div class="call-line ${role}">
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

export function callDialogueHtml(lines = [], className = "") {
  const rows = (lines ?? []).filter((line) => line?.text || line?.version || line?.line);
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
    <details class="choice-review">
      <summary>
        <span>上一段</span>
      </summary>
      ${content}
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
