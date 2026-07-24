import { compactRouteQuestion, routeAxisLabel } from "./routeLog.js?v=0.20.69";

export function routeTrailModel({
  choices = [],
  keyQuestionCount = 0,
  investigationIndexBase = Number.POSITIVE_INFINITY
} = {}) {
  return (choices ?? []).map((choice) => {
    const sceneIndex = Number(choice.sceneIndex ?? 0);
    return {
      mark: routeTrailMark(sceneIndex, keyQuestionCount, investigationIndexBase),
      axis: choice.axis ?? "live-instinct",
      label: routeAxisLabel(choice.axis),
      question: compactRouteQuestion(choice.question)
    };
  });
}

export function routeTrailMark(sceneIndex = 0, keyQuestionCount = 0, investigationIndexBase = Number.POSITIVE_INFINITY) {
  const index = Number(sceneIndex ?? 0);
  if (index >= Number(investigationIndexBase)) return "回";
  if (index >= Number(keyQuestionCount)) return "料";
  return index + 1;
}
