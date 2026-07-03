export function focusedQuestionOptions(options = []) {
  const normalized = (options ?? []).filter(Boolean);
  if (normalized.length <= 2) return normalized;
  const core = normalized.find((option) => option.contradiction);
  const detour = normalized.find((option) => !option.contradiction);
  return [core, detour].filter(Boolean);
}

export function sceneQuestionChoicesHtml(sceneIndex, options = [], askedDialoguePicks = []) {
  const asked = new Set((askedDialoguePicks ?? []).map((item) => item.optionIndex));
  const dialogueOptions = questionOptionsByKind(options, "dialogue").filter(({ optionIndex }) => !asked.has(optionIndex));
  const criticalOptions = questionOptionsByKind(options, "key");
  const rows = [
    ...dialogueOptions.map(({ option, optionIndex }) => choiceQuestionButton(sceneIndex, optionIndex, option, "dialogue")),
    ...criticalOptions.map(({ option, optionIndex }) => choiceQuestionButton(sceneIndex, optionIndex, option, "key"))
  ].join("");
  return choiceGroup("这句怎么问", rows || `<p class="choice-note">这段没岔口。</p>`, "scene-question-group");
}

function questionOptionsByKind(options = [], kind = "key") {
  const wantCritical = kind === "key";
  return options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => Boolean(option.contradiction) === wantCritical);
}

function choiceQuestionButton(sceneIndex, optionIndex, option = {}, kind = "key") {
  const attr = kind === "dialogue" ? "data-scene-dialogue" : "data-scene-question";
  return `
    <button class="choice-question" ${attr}="${sceneIndex}:${optionIndex}" type="button">
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
