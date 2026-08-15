import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export const CARE_CHOICE_IDS = ["pragmatic", "affirm", "accompany"];

export function careChoicesFor(brief = {}) {
  const choices = Array.isArray(brief.careChoices) ? brief.careChoices : [];
  return choices.filter((choice) => CARE_CHOICE_IDS.includes(choice?.id));
}

export function careChoiceById(brief = {}, choiceId = "") {
  return careChoicesFor(brief).find((choice) => choice.id === choiceId) ?? null;
}

export function careChoiceLines(choice = {}, hostName = DEFAULT_PLAYER_NAME) {
  if (!choice?.id) return [];
  return [
    { role: "host", speaker: hostName, text: choice.hostLine ?? "" },
    ...(choice.lines ?? [])
  ].filter((line) => line.role === "pause" || line.text);
}

export function careChoiceIsComplete(brief = {}) {
  const ids = careChoicesFor(brief).map((choice) => choice.id);
  return CARE_CHOICE_IDS.every((id) => ids.includes(id)) && ids.length === CARE_CHOICE_IDS.length;
}
