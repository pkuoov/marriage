export function focusedQuestionOptions(options = []) {
  const normalized = (options ?? []).filter(Boolean);
  if (normalized.length <= 2) return normalized;
  const core = normalized.find((option) => option.contradiction);
  const detour = normalized.find((option) => !option.contradiction);
  return [core, detour].filter(Boolean);
}

export function sceneQuestionChoicesHtml(sceneIndex, options = [], askedDialoguePicks = []) {
  void askedDialoguePicks;
  const rows = options
    .map((option, optionIndex) => choiceQuestionButton(sceneIndex, optionIndex, option))
    .join("");
  return choiceGroup("这句怎么问", rows || `<p class="choice-note">这段没岔口。</p>`, "scene-question-group");
}

function choiceQuestionButton(sceneIndex, optionIndex, option = {}) {
  return `
    <button class="choice-question" data-scene-question="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span>
    </button>
  `;
}

function choiceGroup(label, content, className = "", note = "") {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group ${className}">
      <div class="choice-label">
        <span>${escapeHtml(label)}</span>
        ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      </div>
      <div class="choice-stack">${content}</div>
    </section>
  `;
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
