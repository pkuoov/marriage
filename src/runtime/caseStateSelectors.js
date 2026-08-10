import {
  answerKey,
  caseKey,
  evidenceAnsweredCount,
  evidenceAnswerKey,
  evidenceChecksFor,
  investigationAnswerKey,
  playableSceneIndexes,
  unlockedInvestigationEntries
} from "./sceneAdvance.js";
import {
  routeAxisForChoice,
  routeAxisProfileFromChoices,
  routeChoicesFromPicks,
  routeToneForChoice
} from "./routeLog.js";

export function actionDoneForState(state = {}, brief = {}, actionKey = "") {
  return Boolean(state.caseActionLog?.[caseKey(brief)]?.[actionKey]);
}

export function contradictionsForState(state = {}, brief = {}) {
  return state.contradictionLog?.[caseKey(brief)] ?? [];
}

export function answeredSceneCountForState(state = {}, brief = {}) {
  return playableSceneIndexes(brief).filter((index) => actionDoneForState(state, brief, `version:${index}`)).length;
}

export function selectedScenePickForState(state = {}, brief = {}, index = 0) {
  const pick = state.sceneQuestionPicks?.[answerKey(brief, index)] ?? null;
  if (!pick) return null;
  return {
    ...pick,
    routeAxis: pick.routeAxis ?? routeAxisForChoice(pick),
    routeTone: pick.routeTone ?? routeToneForChoice(pick)
  };
}

export function selectedScenePicksForState(state = {}, brief = {}) {
  return (brief.sceneVersions ?? [])
    .map((_, index) => selectedScenePickForState(state, brief, index))
    .filter(Boolean);
}

export function askedDialoguePicksForState(state = {}, brief = {}, index = 0) {
  return state.sceneDialoguePicks?.[answerKey(brief, index)] ?? [];
}

export function sceneAnswerForState(state = {}, brief = {}, index = 0) {
  return state.sceneAnswers?.[answerKey(brief, index)] ?? "";
}

export function completedSceneExchangeForState(state = {}, brief = {}, scene = {}, index = 0, pick = null) {
  return {
    scene,
    dialoguePicks: askedDialoguePicksForState(state, brief, index),
    pick,
    fallbackAnswer: sceneAnswerForState(state, brief, index)
  };
}

export function latestChoiceReviewRowsForState(state = {}, brief = {}, { excludeIndex = null } = {}) {
  const scenes = brief.sceneVersions ?? [];
  const lastAnsweredIndex = scenes.reduce((last, _, index) => actionDoneForState(state, brief, `version:${index}`) ? index : last, -1);
  const lastDialogueIndex = scenes.reduce((last, _, index) => askedDialoguePicksForState(state, brief, index).length ? index : last, -1);
  if (lastAnsweredIndex === excludeIndex || lastDialogueIndex === excludeIndex) return [];
  if (lastAnsweredIndex < 0 && lastDialogueIndex < 0) return [];
  if (lastAnsweredIndex >= 0) {
    const selectedPick = selectedScenePickForState(state, brief, lastAnsweredIndex);
    return [
      { role: "caller", text: scenes[lastAnsweredIndex]?.version ?? "" },
      { role: "host", text: selectedPick?.question ?? "" },
      { role: "caller", text: selectedPick?.answer ?? sceneAnswerForState(state, brief, lastAnsweredIndex) },
      ...latestEvidenceRevisionRowsForState(state, brief)
    ].filter((line) => line.text);
  }
  return [
    { role: "caller", text: scenes[lastDialogueIndex]?.version ?? "" },
    ...askedDialoguePicksForState(state, brief, lastDialogueIndex).flatMap((pick) => [
      { role: "host", text: pick.question },
      ...(Array.isArray(pick.lines) && pick.lines.length ? pick.lines : [{ role: "caller", text: pick.answer }])
    ])
  ].filter((line) => line.text);
}

function latestEvidenceRevisionRowsForState(state = {}, brief = {}) {
  const picks = evidenceChecksFor(brief)
    .map((_, index) => selectedEvidencePickForState(state, brief, index))
    .filter((pick) => pick?.revisedVersion);
  const latest = picks[picks.length - 1] ?? null;
  return latest ? [{ role: "caller", text: latest.revisedVersion }] : [];
}

export function selectedEvidencePickForState(state = {}, brief = {}, index = 0) {
  return state.evidenceCheckPicks?.[evidenceAnswerKey(brief, index)] ?? null;
}

export function selectedEvidencePicksForState(state = {}, brief = {}) {
  return evidenceChecksFor(brief)
    .map((_, index) => selectedEvidencePickForState(state, brief, index))
    .filter(Boolean);
}

export function selectedInvestigationPickForState(state = {}, brief = {}, index = 0) {
  return state.investigationPicks?.[investigationAnswerKey(brief, index)] ?? null;
}

export function selectedInvestigationPicksForState(state = {}, brief = {}) {
  return (brief.investigationHooks ?? [])
    .map((_, index) => selectedInvestigationPickForState(state, brief, index))
    .filter(Boolean);
}

export function selectedDelegationPickForState(state = {}, brief = {}) {
  return state.delegationPicks?.[caseKey(brief)] ?? null;
}

export function truthBoundaryPicksForState(state = {}, brief = {}) {
  return state.truthBoundaryPicks?.[caseKey(brief)] ?? {};
}

export function truthBoundaryMissesForState(state = {}, brief = {}) {
  return state.truthBoundaryMisses?.[caseKey(brief)] ?? {};
}

export function unlockedInvestigationEntriesForState(state = {}, brief = {}) {
  return unlockedInvestigationEntries(brief, {
    foundContradictions: contradictionsForState(state, brief),
    actionDone: (actionKey) => actionDoneForState(state, brief, actionKey)
  });
}

export function answeredEvidenceCountForState(state = {}, brief = {}) {
  return evidenceAnsweredCount(brief, (actionKey) => actionDoneForState(state, brief, actionKey));
}

export function routeChoicesForState(state = {}, brief = {}) {
  const key = caseKey(brief);
  const logged = state.routeChoiceLog?.[key];
  if (Array.isArray(logged) && logged.length) return logged;
  return routeChoicesFromPicks(selectedScenePicksForState(state, brief));
}

export function routeAxisProfileForState(state = {}, brief = {}) {
  return routeAxisProfileFromChoices(routeChoicesForState(state, brief));
}
