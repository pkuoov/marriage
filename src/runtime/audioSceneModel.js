const LIVE_SCENES = new Set([
  "caseOpen",
  "sceneReview",
  "sceneQuestionMenu",
  "sceneQuestionAnswer",
  "sceneLineReplay",
  "statementPatienceLost",
  "stanceSnapshot",
  "afterSceneEvidence",
  "callSegment1",
  "callSegment2",
  "overnightNight1",
  "overnightNight2",
  "callbackOpener",
  "callbackOpenerBeat",
  "overnightCallback",
  "liveCounterBeat",
  "documentReconcile",
  "callerQuestion",
  "deepFollowup",
  "testimonyWall",
  "testimonyMaterials",
  "decisivePresentMaterial",
  "decisivePresentTarget",
  "decisivePresentHit"
]);

const OFF_AIR_SCENES = new Set([
  "hangupBeat",
  "overnightHangup",
  "overnightPostLive",
  "interludeDesk"
]);

const DAY_SCENES = new Set(["dayActOpening", "dayMap", "dayScene"]);
const RECAP_SCENES = new Set(["caseSolved", "careChoice", "caseClosure", "storyInterlude", "caseBridge", "caseTitle"]);
const NIGHT_B_SCENES = new Set([
  "overnightCallback",
  "callbackOpener",
  "callbackOpenerBeat",
  "overnightNight2",
  "documentReconcile",
  "liveCounterBeat",
  "callerQuestion"
]);

export function audioScenePlan({ scene = "title", backdropClass = "", pressureLevel = "", musicPhase = "" } = {}) {
  if (scene === "title" || scene === "nightShellPrologue") {
    return {
      bgmCueId: "bgm.title-nightshift",
      ambienceCueId: "ambience.studio-room"
    };
  }
  if (scene === "nightShellEpilogue" || scene === "runComplete") {
    return { bgmCueId: "bgm.epilogue-dawn", fallbackBgmCueId: "bgm.recap-afterhours", ambienceCueId: "ambience.studio-room" };
  }
  if (scene === "cafePrologue") {
    return { bgmCueId: "bgm.day-investigation", ambienceCueId: "ambience.cafe", fallbackAmbienceCueId: "ambience.city-afternoon" };
  }
  if (scene === "cafePrologueAftermath") {
    return { bgmCueId: "bgm.offair-desk", ambienceCueId: "ambience.apartment-hall", fallbackAmbienceCueId: "ambience.studio-room" };
  }
  if (scene === "cafePrologueForensic") {
    return {
      bgmCueId: "bgm.epilogue-dawn",
      fallbackBgmCueId: "bgm.recap-afterhours",
      ambienceCueId: "ambience.document-desk",
      fallbackAmbienceCueId: "ambience.studio-room"
    };
  }
  if (scene === "accusation") {
    return { bgmCueId: "bgm.accusation", ambienceCueId: "ambience.studio-line", fallbackAmbienceCueId: "ambience.studio-room" };
  }
  if (RECAP_SCENES.has(scene)) {
    return { bgmCueId: "bgm.recap-afterhours", ambienceCueId: "ambience.studio-room" };
  }
  if (DAY_SCENES.has(scene)) {
    const ambienceCueId = ambienceCueForBackdrop(backdropClass);
    return {
      bgmCueId: "bgm.day-investigation",
      ambienceCueId,
      ...(ambienceCueId === "ambience.city-afternoon" || ambienceCueId === "ambience.studio-room"
        ? {}
        : { fallbackAmbienceCueId: dayAmbienceFallback(ambienceCueId) })
    };
  }
  if (OFF_AIR_SCENES.has(scene) || scene.startsWith("interlude")) {
    return {
      bgmCueId: "bgm.offair-desk",
      ambienceCueId: "ambience.studio-room",
      enterSfxCueId: scene === "hangupBeat" || scene === "overnightHangup" ? "sfx.phone.disconnect" : ""
    };
  }
  if (LIVE_SCENES.has(scene)) {
    const bgmCueId = musicPhase === "silent"
      ? ""
      : musicPhase === "pursuit"
        ? "bgm.pursuit"
        : musicPhase === "allegro"
          ? "bgm.live-call-allegro"
          : pressureLevel === "low"
            ? "bgm.pressure-stem"
            : NIGHT_B_SCENES.has(scene)
              ? "bgm.callback-return"
              : "bgm.live-call";
    return {
      bgmCueId,
      ...(musicPhase === "allegro"
        ? { fallbackBgmCueId: "bgm.live-call" }
        : musicPhase === "pursuit"
          ? { fallbackBgmCueId: "bgm.accusation" }
          : {}),
      ambienceCueId: "ambience.studio-line",
      fallbackAmbienceCueId: "ambience.studio-room",
      enterSfxCueId: scene === "caseOpen" || scene === "callbackOpener" ? "sfx.phone.connect" : ""
    };
  }
  return { bgmCueId: "bgm.offair-desk", ambienceCueId: "ambience.studio-room" };
}

export function ambienceCueForBackdrop(backdropClass = "") {
  const value = String(backdropClass ?? "");
  if (value.includes("restaurant")) return "ambience.restaurant";
  if (value.includes("cafe")) return "ambience.cafe";
  if (value.includes("matchmaking")) return "ambience.teahouse";
  if (value.includes("home")) return "ambience.apartment-hall";
  if (value.includes("office")) return "ambience.office";
  if (value.includes("studio")) return "ambience.archive-studio";
  if (value.includes("document")) return "ambience.document-desk";
  if (value.includes("city")) return "ambience.city-afternoon";
  return "ambience.studio-room";
}

function dayAmbienceFallback(cueId = "") {
  return ["ambience.restaurant", "ambience.cafe", "ambience.teahouse"].includes(cueId)
    ? "ambience.city-afternoon"
    : "ambience.studio-room";
}
