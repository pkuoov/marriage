import { audioCueAvailable, audioCueById } from "./audioCatalog.js";
import { audioBusGain, normalizeAudioSettings, updateAudioBusVolume } from "./runtime/audioModel.js";
import { platformRuntime } from "./platformRuntime.js";

const LEGACY_SOUND_KEY = "marriage-detective-agency-sound";
const LEGACY_SOUND_KEY_V2 = "livestream-detective-sound";
const AUDIO_SETTINGS_KEY = "livestream-detective-audio-settings-v1";
const LOOP_BUSES = Object.freeze(["bgm", "ambience"]);

let audioContext;
let settings = loadAudioSettings();
let activeVoice = null;
let lastSceneKey = "";
const playedCueKeys = new Set();
const activeLoops = new Map();
const desiredLoopCueIds = new Map();
const activeOneShots = new Set();
const audioListeners = new Set();

export function getAudioSettings() {
  return { ...settings };
}

export function setAudioBusVolume(busId = "master", value = 1) {
  settings = updateAudioBusVolume(settings, busId, value);
  persistAudioSettings();
  refreshActiveVolumes();
  emitAudioState();
  return getAudioSettings();
}

export function playSfx(kind = "click") {
  return playAudioCue({
    click: "ui.click",
    confirm: "ui.confirm",
    warning: "ui.warning",
    page: "ui.page"
  }[kind] ?? "ui.click");
}

export function playAudioCue(cueId = "", callbacks = {}) {
  const cue = audioCueById(cueId);
  if (!cue || !settings.enabled) return { ok: false, reason: cue ? "muted" : "unknown-cue" };
  if (cue.synth) {
    playSynth(cue.synth);
    return { ok: true, cueId, synthetic: true };
  }
  if (!audioCueAvailable(cueId) || typeof Audio === "undefined") {
    return { ok: false, reason: "asset-unavailable", cueId };
  }
  if (cue.loop && LOOP_BUSES.includes(cue.bus)) return setLoopCue(cue.bus, cueId);
  if (cue.bus === "voice") return startVoiceCue(cueId, cue, callbacks);
  return startOneShot(cueId, cue, callbacks);
}

export function toggleVoiceCue(cueId = "") {
  if (activeVoice?.cueId === cueId) {
    if (activeVoice.audio.paused) {
      activeVoice.audio.play().catch(() => finishVoice("error", cueId));
    } else {
      activeVoice.audio.pause();
      emitAudioState("paused");
    }
    return { ok: true, cueId };
  }
  return playAudioCue(cueId);
}

export function seekVoiceCue(cueId = "", seconds = 0) {
  if (activeVoice?.cueId !== cueId) return false;
  const duration = Number(activeVoice.audio.duration);
  activeVoice.audio.currentTime = Number.isFinite(duration)
    ? Math.max(0, Math.min(duration, Number(seconds) || 0))
    : Math.max(0, Number(seconds) || 0);
  emitAudioState(activeVoice.audio.paused ? "paused" : "playing");
  return true;
}

export function stopVoiceCue() {
  if (!activeVoice) return;
  activeVoice.audio.pause();
  activeVoice.audio.currentTime = 0;
  finishVoice("stopped");
}

export function syncAudioScene(plan = {}, { sceneKey = "", keepVoiceCueId = "" } = {}) {
  setLoopCue("bgm", plan.bgmCueId ?? "");
  setLoopCue("ambience", plan.ambienceCueId ?? "");
  if (activeVoice && activeVoice.cueId !== keepVoiceCueId) stopVoiceCue();
  if (sceneKey && sceneKey !== lastSceneKey && plan.enterSfxCueId) playAudioCue(plan.enterSfxCueId);
  if (sceneKey) lastSceneKey = sceneKey;
}

export function playAudioCueOnce(cueId = "", cueKey = "") {
  if (!cueId || !cueKey || playedCueKeys.has(cueKey)) return { ok: false, reason: "duplicate" };
  playedCueKeys.add(cueKey);
  if (playedCueKeys.size > 200) playedCueKeys.delete(playedCueKeys.values().next().value);
  return playAudioCue(cueId);
}

export function resetAudioCueHistory() {
  playedCueKeys.clear();
  lastSceneKey = "";
}

export function subscribeAudioState(listener) {
  if (typeof listener !== "function") return () => {};
  audioListeners.add(listener);
  listener(audioStateSnapshot());
  return () => audioListeners.delete(listener);
}

export function toggleSound() {
  settings = normalizeAudioSettings({ ...settings, enabled: !settings.enabled });
  persistAudioSettings();
  refreshActiveVolumes();
  if (settings.enabled) playSynth("confirm");
  emitAudioState();
  return settings.enabled;
}

export function isSoundEnabled() {
  return settings.enabled;
}

function loadAudioSettings() {
  const stored = platformRuntime.storage.get(AUDIO_SETTINGS_KEY);
  if (stored) {
    try {
      return normalizeAudioSettings(JSON.parse(stored));
    } catch {
      // Fall through to the legacy on/off preference.
    }
  }
  const legacy = platformRuntime.storage.get(LEGACY_SOUND_KEY_V2) ?? platformRuntime.storage.get(LEGACY_SOUND_KEY);
  return normalizeAudioSettings({ enabled: legacy !== "off" });
}

function persistAudioSettings() {
  platformRuntime.storage.set(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
  platformRuntime.storage.set(LEGACY_SOUND_KEY_V2, settings.enabled ? "on" : "off");
}

function getContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}

function playSynth(kind = "click") {
  if (!settings.enabled) return;
  if (kind === "confirm") {
    tone({ frequency: 340, duration: 0.075, type: "sine", gain: 0.019, slideTo: 430 });
    return;
  }
  if (kind === "warning") {
    tone({ frequency: 210, duration: 0.16, type: "sawtooth", gain: 0.028, slideTo: 130 });
    return;
  }
  if (kind === "page") {
    tone({ frequency: 300, duration: 0.05, type: "sine", gain: 0.012, slideTo: 360 });
    return;
  }
  tone({ frequency: 440, duration: 0.055, type: "sine", gain: 0.026, slideTo: 520 });
}

function tone({ frequency, duration, type = "sine", gain = 0.035, slideTo = null }) {
  const ctx = getContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  const now = ctx.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  const targetGain = Math.max(0.0001, gain * audioBusGain(settings, "sfx"));
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(targetGain, now + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function setLoopCue(busId, cueId = "") {
  if (!LOOP_BUSES.includes(busId)) return { ok: false, reason: "not-loop-bus" };
  const active = activeLoops.get(busId);
  if (desiredLoopCueIds.get(busId) === cueId && (!cueId || active?.cueId === cueId)) {
    return { ok: true, unchanged: true, cueId };
  }
  desiredLoopCueIds.set(busId, cueId);
  const previous = activeLoops.get(busId);
  if (previous) fadeOutAndStop(previous.audio, 260);
  activeLoops.delete(busId);
  if (!cueId) return { ok: true, cueId: "" };
  if (!settings.enabled) return { ok: false, reason: "muted", cueId };
  const cue = audioCueById(cueId);
  if (!cue || !cue.loop || cue.bus !== busId || !audioCueAvailable(cueId) || typeof Audio === "undefined") {
    return { ok: false, reason: "asset-unavailable", cueId };
  }
  const audio = createAudioElement(cue);
  audio.loop = true;
  audio.volume = 0;
  activeLoops.set(busId, { cueId, cue, audio });
  audio.play()
    .then(() => {
      if (activeLoops.get(busId)?.audio === audio) fadeTo(audio, effectiveCueVolume(cue), 320);
      else audio.pause();
    })
    .catch(() => {
      if (activeLoops.get(busId)?.audio === audio) activeLoops.delete(busId);
    });
  return { ok: true, cueId };
}

function startVoiceCue(cueId, cue, callbacks = {}) {
  stopVoiceCue();
  const audio = createAudioElement(cue);
  activeVoice = { cueId, cue, audio, callbacks };
  bindTimedAudioEvents(audio, cueId, callbacks, () => finishVoice("ended", cueId), () => finishVoice("error", cueId));
  refreshActiveVolumes();
  audio.play()
    .then(() => emitAudioState("playing"))
    .catch(() => finishVoice("error", cueId));
  return { ok: true, cueId, audio };
}

function startOneShot(cueId, cue, callbacks = {}) {
  const audio = createAudioElement(cue);
  const item = { cueId, cue, audio };
  activeOneShots.add(item);
  bindTimedAudioEvents(
    audio,
    cueId,
    callbacks,
    () => {
      callbacks.onEnded?.();
      activeOneShots.delete(item);
    },
    () => activeOneShots.delete(item)
  );
  audio.play().catch(() => activeOneShots.delete(item));
  return { ok: true, cueId, audio };
}

function bindTimedAudioEvents(audio, cueId, callbacks, onEnded, onError) {
  audio.addEventListener("timeupdate", () => {
    callbacks.onTimeUpdate?.(audio.currentTime, audio.duration);
    if (activeVoice?.cueId === cueId) emitAudioState(audio.paused ? "paused" : "playing");
  });
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("error", () => {
    callbacks.onError?.();
    onError?.();
  });
}

function finishVoice(status = "ended", cueId = "") {
  if (!activeVoice || (cueId && activeVoice.cueId !== cueId)) return;
  if (status === "ended") activeVoice.callbacks?.onEnded?.();
  activeVoice = null;
  refreshActiveVolumes();
  emitAudioState(status);
}

function createAudioElement(cue) {
  const audio = new Audio(cue.src);
  audio.preload = "auto";
  audio.volume = effectiveCueVolume(cue);
  return audio;
}

function effectiveCueVolume(cue) {
  const ducked = Boolean(activeVoice) && ["bgm", "ambience"].includes(cue.bus);
  return Math.max(0, Math.min(1, audioBusGain(settings, cue.bus, { ducked }) * Number(cue.gain ?? 1)));
}

function refreshActiveVolumes() {
  activeLoops.forEach(({ cue, audio }) => { audio.volume = effectiveCueVolume(cue); });
  activeOneShots.forEach(({ cue, audio }) => { audio.volume = effectiveCueVolume(cue); });
  if (activeVoice) activeVoice.audio.volume = effectiveCueVolume(activeVoice.cue);
}

function fadeTo(audio, target, durationMs) {
  const from = Number(audio.volume ?? 0);
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const ratio = Math.min(1, (Date.now() - startedAt) / Math.max(1, durationMs));
    audio.volume = Math.max(0, Math.min(1, from + (target - from) * ratio));
    if (ratio >= 1) clearInterval(timer);
  }, 30);
}

function fadeOutAndStop(audio, durationMs) {
  const from = Number(audio.volume ?? 0);
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const ratio = Math.min(1, (Date.now() - startedAt) / Math.max(1, durationMs));
    audio.volume = Math.max(0, from * (1 - ratio));
    if (ratio >= 1) {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    }
  }, 30);
}

function audioStateSnapshot(status = "") {
  return {
    settings: getAudioSettings(),
    voice: activeVoice ? {
      cueId: activeVoice.cueId,
      status: status || (activeVoice.audio.paused ? "paused" : "playing"),
      currentTime: Number(activeVoice.audio.currentTime ?? 0),
      duration: Number.isFinite(Number(activeVoice.audio.duration)) ? Number(activeVoice.audio.duration) : 0
    } : { cueId: "", status: status || "idle", currentTime: 0, duration: 0 }
  };
}

function emitAudioState(status = "") {
  const snapshot = audioStateSnapshot(status);
  audioListeners.forEach((listener) => listener(snapshot));
}
