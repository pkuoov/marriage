import { routeAxisForChoice, routeToneForChoice } from "../runtime/routeLog.js";

export function dailyBaseBrief(brief, names, fields) {
  const problemActorId = brief.respondentId ?? brief.complainantId;
  return {
    ...brief,
    label: fields.label ?? brief.label,
    storyArcTitle: fields.storyArcTitle ?? brief.storyArcTitle,
    premeditated: fields.premeditated ?? true,
    premeditatedActorId: fields.premeditatedActorId ?? problemActorId,
    stance: fields.stance ?? "trueVictim",
    openingComplaint: fields.openingComplaint,
    openingDialogue: fields.openingDialogue,
    scene: {
      ...(brief.scene ?? {}),
      name: fields.sceneName ?? "直播连线"
    },
    sceneVersions: withChoiceRoutes(fields.sceneVersions ?? []),
    explicitClueGroups: fields.explicitClueGroups,
    evidenceCards: fields.evidenceCards,
    evidenceChecks: fields.evidenceChecks ?? [],
    investigationHooks: fields.investigationHooks ?? [],
    deepFollowup: fields.deepFollowup,
    stageJudgement: fields.stageJudgement,
    followupTwist: fields.followupTwist,
    dailyShareTitle: fields.dailyShareTitle,
    dailyShareBody: fields.dailyShareBody,
    dailyShareQuestion: fields.dailyShareQuestion,
    publicHook: fields.publicHook ?? brief.publicHook,
    storyArcSummary: fields.storyArcSummary ?? brief.storyArcSummary,
    storySuspense: fields.storySuspense ?? brief.storySuspense,
    storyClueObject: fields.storyClueObject ?? brief.storyClueObject,
    truth: fields.truth ?? brief.truth
  };
}

export function withChoiceRoutes(sceneVersions) {
  return sceneVersions.map((scene, sceneIndex) => ({
    ...scene,
    questionOptions: (scene.questionOptions ?? []).map((option) => ({
      ...option,
      correct: option.correct ?? (option.contradiction ? true : false),
      routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
      routeTone: option.routeTone ?? routeToneForChoice(option, scene, sceneIndex)
    }))
  }));
}
