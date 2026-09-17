// Routing is narrower than the set of scenes that retain the current testimony.
// Keep dedicated replay, snapshot and evidence renderers out of the generic route.
const SCENE_REVIEW_SCENES = new Set([
  "sceneReview", "sceneQuestionMenu", "sceneQuestionAnswer", "callSegment1", "callSegment2",
  "overnightNight1", "overnightNight2", "testimonyPrelude", "testimonyWall", "testimonyMaterials",
  "decisivePresentMaterial", "decisivePresentTarget", "decisivePresentHit"
]);
const SCENE_PRESSURE_SCENES = new Set([...SCENE_REVIEW_SCENES, "sceneLineReplay", "stanceSnapshot", "afterSceneEvidence"]);
export const LIVE_SCENES = new Set([
  ...SCENE_PRESSURE_SCENES, "caseOpen", "statementPatienceLost", "callbackOpener", "callbackOpenerBeat",
  "overnightCallback", "liveCounterBeat", "documentReconcile", "callerQuestion", "deepFollowup"
]);
export const isSceneReviewScene = (scene = "") => SCENE_REVIEW_SCENES.has(scene);
export const keepsScenePressure = (scene = "") => SCENE_PRESSURE_SCENES.has(scene);
