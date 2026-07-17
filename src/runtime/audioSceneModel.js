const LIVE_SCENES = new Set([
  "caseOpen",
  "sceneReview",
  "sceneQuestionMenu",
  "sceneQuestionAnswer",
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
  "deepFollowup"
]);

const OFF_AIR_SCENES = new Set([
  "hangupBeat",
  "overnightHangup",
  "overnightPostLive",
  "interludeDesk"
]);

const DAY_SCENES = new Set(["dayActOpening", "dayMap", "dayScene"]);
const RECAP_SCENES = new Set(["caseSolved", "caseClosure", "storyInterlude", "caseTitle"]);

export function audioScenePlan({ scene = "title", backdropClass = "", pressureLevel = "" } = {}) {
  if (scene === "title" || scene === "nightShellPrologue") {
    return {
      bgmCueId: "bgm.title-nightshift",
      ambienceCueId: "ambience.studio-room",
      enterSfxCueId: scene === "nightShellPrologue" ? "sfx.broadcast.on-air" : ""
    };
  }
  if (scene === "nightShellEpilogue" || scene === "runComplete") {
    return { bgmCueId: "bgm.epilogue-dawn", ambienceCueId: "ambience.studio-room" };
  }
  if (scene === "accusation") {
    return { bgmCueId: "bgm.accusation", ambienceCueId: "ambience.studio-line" };
  }
  if (RECAP_SCENES.has(scene)) {
    return { bgmCueId: "bgm.recap-afterhours", ambienceCueId: "ambience.studio-room" };
  }
  if (DAY_SCENES.has(scene)) {
    return { bgmCueId: "bgm.day-investigation", ambienceCueId: ambienceCueForBackdrop(backdropClass) };
  }
  if (OFF_AIR_SCENES.has(scene) || scene.startsWith("interlude")) {
    return {
      bgmCueId: "bgm.offair-desk",
      ambienceCueId: "ambience.studio-room",
      enterSfxCueId: scene === "hangupBeat" || scene === "overnightHangup" ? "sfx.phone.disconnect" : ""
    };
  }
  if (LIVE_SCENES.has(scene)) {
    return {
      bgmCueId: pressureLevel === "low"
        ? "bgm.pressure-stem"
        : scene === "overnightCallback" || scene === "callbackOpener" || scene === "callbackOpenerBeat"
          ? "bgm.callback-return"
          : "bgm.live-call",
      ambienceCueId: "ambience.studio-line",
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
