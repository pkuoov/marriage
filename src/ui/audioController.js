import { seekVoiceCue, setAudioBusVolume, subscribeAudioState, syncAudioScene, toggleSound, toggleVoiceCue } from "../sound.js?v=0.22.0";
import { audioScenePlan } from "../runtime/audioSceneModel.js?v=0.22.0";

export function bindAudioControls({ root = defaultRoot(), onToggleSound = () => {} } = {}) {
  if (!root) return;
  root.querySelectorAll("[data-audio-mute]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSound();
      onToggleSound();
    });
  });
  root.querySelectorAll("[data-audio-volume]").forEach((input) => {
    input.addEventListener("input", () => {
      const busId = input.getAttribute("data-audio-volume") ?? "master";
      setAudioBusVolume(busId, input.value);
      const output = root.querySelector(`[data-audio-output="${busId}"]`);
      if (output) output.textContent = `${Math.round(Number(input.value) * 100)}%`;
    });
  });
  root.querySelectorAll("[data-audio-play]").forEach((button) => {
    button.addEventListener("click", () => toggleVoiceCue(button.getAttribute("data-audio-play") ?? ""));
  });
  root.querySelectorAll("[data-audio-seek]").forEach((input) => {
    input.addEventListener("input", () => seekVoiceCue(input.getAttribute("data-audio-seek") ?? "", input.value));
  });
}

export function syncSceneAudio({ briefId = "root", scene = "title", backdropClass = "", pressureLevel = "", audioEnterCueId = "", keepVoiceCueId = "" } = {}) {
  const plan = audioScenePlan({ scene, backdropClass, pressureLevel });
  syncAudioScene({ ...plan, enterSfxCueId: audioEnterCueId || plan.enterSfxCueId }, {
    sceneKey: `${briefId}:${scene}`,
    keepVoiceCueId
  });
  return plan;
}

export function watchAudioPlaybackControls({ getRoot = defaultRoot } = {}) {
  return subscribeAudioState((snapshot) => updateAudioPlaybackControls(snapshot, { root: getRoot() }));
}

export function updateAudioPlaybackControls(snapshot = {}, { root = defaultRoot() } = {}) {
  if (!root) return;
  const voice = snapshot.voice ?? {};
  root.querySelectorAll("[data-audio-play]").forEach((button) => {
    const cueId = button.getAttribute("data-audio-play") ?? "";
    button.textContent = voice.cueId === cueId && voice.status === "playing" ? "暂停录音" : "播放录音";
  });
  root.querySelectorAll("[data-audio-seek]").forEach((input) => {
    const cueId = input.getAttribute("data-audio-seek") ?? "";
    const active = voice.cueId === cueId;
    input.max = String(active ? voice.duration || 0 : 0);
    input.value = String(active ? Math.min(voice.currentTime || 0, voice.duration || 0) : 0);
  });
  root.querySelectorAll("[data-audio-time]").forEach((output) => {
    const cueId = output.getAttribute("data-audio-time") ?? "";
    const active = voice.cueId === cueId;
    output.textContent = `${formatAudioTime(active ? voice.currentTime : 0)} / ${formatAudioTime(active ? voice.duration : 0)}`;
  });
}

export function formatAudioTime(seconds = 0) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function defaultRoot() {
  return typeof document === "undefined" ? null : document;
}
