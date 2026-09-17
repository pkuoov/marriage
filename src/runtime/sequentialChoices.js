// Progress is an ordered prefix of stable authored IDs, never an array index.
export function completedChoicePrefix(choices = [], completedIds = []) {
  const completed = new Set(completedIds);
  const prefix = [];
  for (const choice of choices) {
    if (!completed.has(choice.id)) break;
    prefix.push(choice.id);
  }
  return prefix;
}

export function nextSequentialChoice(choices = [], completedIds = []) {
  return choices[completedChoicePrefix(choices, completedIds).length] ?? null;
}

export function sceneQuestionSequence(scene = {}) {
  return (scene.questionSequence ?? []).map((id) => scene.questionOptions?.find((option) => option.id === id)).filter(Boolean);
}

export function completedSequenceAnswer(scene = {}, pick = null) {
  const sequence = sceneQuestionSequence(scene);
  const ids = completedChoicePrefix(sequence, pick?.completedOptionIds);
  if (!pick || ids.length < 2) return pick;
  const answered = sequence.slice(0, ids.length);
  return {
    ...pick,
    question: answered[0].question,
    resistanceBeat: null,
    reactionLine: "",
    lines: answered.flatMap((option, index) => [
      ...(index ? [{ role: "host", text: option.question }] : []),
      ...(option.resistanceBeat?.lines ?? []),
      ...answerDialogueLines(option),
      ...(option.reactionLine ? [{ role: "caller", text: option.reactionLine }] : [])
    ])
  };
}
import { answerDialogueLines } from "./dialogueContent.js";
