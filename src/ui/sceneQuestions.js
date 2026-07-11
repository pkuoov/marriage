export function focusedQuestionOptions(options = []) {
  return (options ?? []).filter(Boolean);
}

export function sceneDialogueOptions(scene = {}, keyOptions = focusedQuestionOptions(scene?.questionOptions ?? [])) {
  const casual = Array.isArray(scene.casualQuestions) ? scene.casualQuestions.filter(Boolean) : [];
  if (casual.length) return casual.map((option, optionIndex) => normalizeDialogueOption(option, optionIndex));
  const authored = Array.isArray(scene.dialogueOptions) ? scene.dialogueOptions.filter(Boolean) : [];
  if (authored.length) return authored.map((option, optionIndex) => normalizeDialogueOption(option, optionIndex));
  return keyOptions
    .map((option, sourceIndex) => ({ option, sourceIndex }))
    .filter(({ option }) => !option.contradiction)
    .map(({ option, sourceIndex }, optionIndex) => normalizeDialogueOption({
      ...option,
      sourceIndex,
      question: option.dialogueQuestion ?? option.freeQuestion ?? fallbackDialogueQuestion(option, scene, optionIndex)
    }, optionIndex));
}

export function sceneQuestionChoicesHtml(sceneIndex, scene = {}, askedDialoguePicks = []) {
  const keyOptions = focusedQuestionOptions(scene?.questionOptions ?? []);
  const dialogueOptions = sceneDialogueOptions(scene, keyOptions);
  const askedIndexes = new Set((askedDialoguePicks ?? []).map((pick) => Number(pick.optionIndex)));
  const dialogueRows = dialogueOptions
    .map(({ option, optionIndex }) => dialogueQuestionButton(sceneIndex, optionIndex, option, askedIndexes.has(optionIndex)))
    .join("");
  const keyRows = keyOptions
    .map((option, optionIndex) => keyQuestionButton(sceneIndex, optionIndex, option))
    .join("");
  return choiceGroup(`${dialogueRows}${keyRows}`, "scene-question-group");
}

export function sceneQuestionMenuHtml(sceneIndex, scene = {}, askedDialoguePicks = []) {
  return `
    <section class="question-menu-card" aria-label="连线追问">
      <header>
        <b>这句话，你想先问哪一句？</b>
      </header>
      <div class="question-menu-options">
        ${sceneQuestionChoicesHtml(sceneIndex, scene, askedDialoguePicks)}
      </div>
    </section>
  `;
}

function normalizeDialogueOption(option = {}, optionIndex = 0) {
  return {
    option: {
      ...option,
      optionIndex
    },
    optionIndex
  };
}

function fallbackDialogueQuestion(option = {}, scene = {}, optionIndex = 0) {
  if (option.dialogueQuestion || option.freeQuestion) return option.dialogueQuestion ?? option.freeQuestion;
  const axis = option.routeAxis ?? "";
  if (axis === "caller-credibility") return "你当时怎么想的？";
  if (axis === "money-flow") return "钱这块当时怎么说的？";
  if (axis === "document-edge") return "这张图当时是怎么发过来的？";
  if (axis === "identity-wording") return "这句话当时怎么说的？";
  if (scene?.version?.includes("截图") || scene?.version?.includes("资料")) return "这东西当时怎么拿出来的？";
  return optionIndex === 0 ? "先把前后问清楚。" : "你当时怎么回他的？";
}

function dialogueQuestionButton(sceneIndex, optionIndex, option = {}, asked = false) {
  return `
    <button class="choice-question" data-scene-dialogue="${sceneIndex}:${optionIndex}" type="button" ${asked ? "disabled" : ""}>
      <span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span>
    </button>
  `;
}

function keyQuestionButton(sceneIndex, optionIndex, option = {}) {
  return `
    <button class="choice-question" data-scene-question="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span>
    </button>
  `;
}

function choiceGroup(content, className = "") {
  if (!content?.trim()) return "";
  return `
    <section class="choice-group ${className}">
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
