import { overnightStructureFor } from "./nightOvernightModel.js";

export function liveCounterBeatsFor(brief = {}) {
  const beats = overnightStructureFor(brief)?.liveCounterBeats;
  return Array.isArray(beats) ? beats : [];
}

export function pressureSignalForLiveCounterChoice(choice = {}, fallback = "") {
  if (choice.stanceNudge === "defensive") return "guarded";
  if (choice.stanceNudge === "open") return "held";
  if (choice.stanceNudge === "neutral") return "";
  return fallback;
}

export function liveCounterBeatById(brief = {}, beatId = "") {
  return liveCounterBeatsFor(brief).find((beat) => beat.id === beatId) ?? null;
}

export function liveCounterBeatAfterScene(brief = {}, sceneIndex = 0, actionDone = () => false, overnight = {}) {
  return liveCounterBeatsFor(brief).find((beat) => (
    Number(beat.afterSceneIndex) === Number(sceneIndex)
      && liveCounterBeatTriggerMet(beat, overnight)
      && !actionDone(`liveCounterBeat:${beat.id}`)
  )) ?? null;
}

export function liveCounterBeatBeforeScene(brief = {}, sceneIndex = 0, actionDone = () => false, overnight = {}) {
  return liveCounterBeatsFor(brief).find((beat) => (
    Number(beat.beforeSceneIndex) === Number(sceneIndex)
      && liveCounterBeatTriggerMet(beat, overnight)
      && !actionDone(`liveCounterBeat:${beat.id}`)
  )) ?? null;
}

export function liveCounterBeatTriggerMet(beat = {}, overnight = {}) {
  const trigger = beat.triggerAny;
  if (!trigger || typeof trigger !== "object") return true;
  const openerHit = (trigger.callbackOpeners ?? []).includes(overnight.callbackOpenerId);
  const documentHit = (trigger.documentRows ?? []).some((entry) => {
    const splitAt = String(entry).lastIndexOf(":");
    if (splitAt < 0) return false;
    const documentId = String(entry).slice(0, splitAt);
    const rowId = String(entry).slice(splitAt + 1);
    return (overnight.documentMarks?.[documentId] ?? []).includes(rowId);
  });
  return openerHit || documentHit;
}
