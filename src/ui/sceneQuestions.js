import { CHOICE_COST_META } from "../runtime/choiceCostModel.js";
import { sceneQuestionSequence } from "../runtime/sequentialChoices.js";

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
    .filter(({ option }) => !option.contradiction && (option.dialogueQuestion || option.freeQuestion))
    .map(({ option, sourceIndex }, optionIndex) => normalizeDialogueOption({
      ...option,
      sourceIndex,
      question: option.dialogueQuestion ?? option.freeQuestion
    }, optionIndex));
}

export function sceneQuestionChoicesHtml(sceneIndex, scene = {}, askedDialoguePicks = []) {
  const keyOptions = focusedQuestionOptions(scene?.questionOptions ?? []);
  const dialogueOptions = sceneDialogueOptions(scene, keyOptions);
  const askedIndexes = new Set((askedDialoguePicks ?? []).map((pick) => Number(pick.optionIndex)));
  const dialogueLimit = Math.max(0, 4 - keyOptions.length);
  const dialogueRows = dialogueOptions
    .filter(({ optionIndex }) => !askedIndexes.has(optionIndex))
    .slice(0, dialogueLimit)
    .map(({ option, optionIndex }) => dialogueQuestionButton(sceneIndex, optionIndex, option))
    .join("");
  const keyRows = keyOptions
    .filter((option) => !scene.questionSequence?.length || option.id === sceneQuestionSequence(scene)[0]?.id)
    .map((option) => keyQuestionButton(sceneIndex, keyOptions.indexOf(option), option))
    .join("");
  return choiceGroup(`${dialogueRows}${keyRows}`, "scene-question-group");
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

function dialogueQuestionButton(sceneIndex, optionIndex, option = {}) {
  return `
    <button class="choice-question" data-scene-dialogue="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-label"><span class="choice-text">${escapeHtml(option.question ?? "接着问")}</span></span>
    </button>
  `;
}

function keyQuestionButton(sceneIndex, optionIndex, option = {}) {
  return `
    <button class="choice-question choice-question-direction" data-scene-question="${sceneIndex}:${optionIndex}" type="button">
      <span class="choice-label">
        <span class="choice-text">${escapeHtml(playerQuestionLabel(option))}</span>
      </span>
      <small class="choice-cost-meta">${CHOICE_COST_META.keyQuestion}</small>
    </button>
  `;
}

export function playerQuestionLabel(option = {}) {
  return option.suspicionLabel ?? option.question ?? "接着问";
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
