import { completedChoicePrefix, nextSequentialChoice } from "./sequentialChoices.js";

// An old exclusive pick is not evidence that the new exchange was heard.
export function callerQuestionProgress(question = {}, saved = {}) {
  const options = question.options ?? [];
  const completedIds = completedChoicePrefix(options, saved.callerQuestionCompletedIds ?? []);
  const picked = options.find(option => option.id === saved.callerQuestionChoiceId
    && option.id === completedIds.at(-1)) ?? null;
  return { completedIds, picked, next: nextSequentialChoice(options, completedIds), complete: completedIds.length === options.length };
}

export function advanceCallerQuestion(question = {}, saved = {}, choiceId = "") {
  const progress = callerQuestionProgress(question, saved);
  if (progress.picked || progress.next?.id !== choiceId) return saved;
  if (progress.next.requiresEarnedItem && !(saved.earnedItems ?? []).includes(progress.next.requiresEarnedItem)) return saved;
  return { ...saved, callerQuestionCompletedIds: [...progress.completedIds, choiceId], callerQuestionChoiceId: choiceId, callerQuestionHostChoiceId: null };
}
