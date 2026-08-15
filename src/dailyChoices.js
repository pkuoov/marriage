export function dailyAccusationChoices(brief) {
  const fromContent = normalizeAccusationChoices(brief.accusationChoices, brief);
  if (fromContent.length) return fromContent;
  return fallbackAccusationChoices(brief);
}

function normalizeAccusationChoices(choices = [], brief = {}) {
  if (!Array.isArray(choices)) return [];
  const respondent = brief.respondentId;
  const complainant = brief.complainantId;
  return choices
    .filter((choice) => choice?.label && choice?.response)
    .map((choice) => ({
      label: choice.label,
      accuse: resolveAccuseRole(choice.accuse ?? choice.accuseRole, { respondent, complainant }),
      response: choice.response,
      requiresRevisedSceneId: choice.requiresRevisedSceneId ?? null
    }))
    .filter((choice) => choice.accuse);
}

function resolveAccuseRole(value, { respondent, complainant }) {
  if (value === "respondent") return respondent;
  if (value === "complainant") return complainant;
  return value;
}

function fallbackAccusationChoices(brief = {}) {
  const respondent = brief.respondentId;
  const complainant = brief.complainantId;
  return [
    { label: "“对方这句话没说全。”", accuse: respondent, response: "先接这句，对方少说的半句最影响判断。" },
    { label: "“我这句话也没说全。”", accuse: complainant, response: "这句要留住，来电人的版本也可能只讲了对自己顺的那半截。" },
    { label: "“两边都有停顿。”", accuse: "both", response: "那今晚就别按一边倒收麦，两边没说完的地方都得摊开。" }
  ];
}
