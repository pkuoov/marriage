import { CHOICE_COST_META } from "../runtime/choiceCostModel.js";

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
  return choiceGroup(`
    ${questionSectionHtml({
      className: "question-section-dialogue",
      title: "补问背景",
      hint: "先听细节，不收束当前这句话。",
      content: dialogueRows
    })}
    ${questionSectionHtml({
      className: "question-section-key",
      title: "追原话",
      hint: "选一句继续；绕开要点可能消耗听众耐心。",
      content: keyRows
    })}
  `, "scene-question-group");
}

export function sceneQuestionMenuHtml(sceneIndex, scene = {}, askedDialoguePicks = [], { helper = null, helperRevealed = false } = {}) {
  return `
    <section class="question-menu-card" aria-label="连线追问">
      <header>
        <b>这句话，你想往哪儿追？</b>
        <small>标着“疑点方向”的选项只选方向，具体问法由林旭阳开口。</small>
      </header>
      ${helperPromptHtml(sceneIndex, scene, helper, helperRevealed)}
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
      <span class="choice-label"><span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span></span>
      <small class="choice-cost-meta">${asked ? "已问过" : CHOICE_COST_META.dialogueQuestion}</small>
    </button>
  `;
}

function keyQuestionButton(sceneIndex, optionIndex, option = {}) {
  const directionOnly = Boolean(option.suspicionLabel);
  return `
    <button class="choice-question ${directionOnly ? "choice-question-direction" : ""}" data-scene-question="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-label">
        ${directionOnly ? `<small class="choice-direction-kicker">疑点方向</small>` : ""}
        <span class="choice-text">${escapeHtml(playerQuestionLabel(option))}</span>
      </span>
      <small class="choice-cost-meta">${CHOICE_COST_META.keyQuestion}</small>
    </button>
  `;
}

export function playerQuestionLabel(option = {}) {
  return option.suspicionLabel ?? option.question ?? "接着问";
}

function helperPromptHtml(sceneIndex, scene = {}, helper = null, helperRevealed = false) {
  const hint = String(scene.helperHint ?? "").trim();
  if (!helper?.id || !hint) return "";
  if (!helperRevealed) {
    return `
      <aside class="helper-prompt helper-prompt-closed" aria-label="场下求助">
        <span><b>${escapeHtml(helper.name ?? "场下帮手")}</b><small>${escapeHtml(helper.role ?? "场下观察员")}</small></span>
        <button data-scene-helper="${sceneIndex}" type="button">求助 ${escapeHtml(helper.name ?? "场下帮手")}</button>
      </aside>
    `;
  }
  return `
    <aside class="helper-prompt helper-prompt-open" aria-label="${escapeHtml(helper.name ?? "场下帮手")}的提示">
      <span class="helper-avatar" aria-hidden="true">V</span>
      <p><b>${escapeHtml(helper.name ?? "场下帮手")}</b><small>${escapeHtml(helper.role ?? "场下观察员")}</small>${escapeHtml(hint)}</p>
    </aside>
  `;
}

function questionSectionHtml({ className = "", title = "", hint = "", content = "" } = {}) {
  if (!content?.trim()) return "";
  return `
    <section class="question-section ${className}">
      <header class="question-section-head">
        <b>${escapeHtml(title)}</b>
        <small>${escapeHtml(hint)}</small>
      </header>
      <div class="choice-stack">${content}</div>
    </section>
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
