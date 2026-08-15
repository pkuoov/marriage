export const AUDIO_BUS_IDS = Object.freeze(["master", "bgm", "ambience", "sfx", "voice"]);

export const DEFAULT_AUDIO_SETTINGS = Object.freeze({
  enabled: true,
  master: 0.85,
  bgm: 0.55,
  ambience: 0.5,
  sfx: 0.72,
  voice: 1
});

export function clampAudioVolume(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return Math.max(0, Math.min(1, Number(fallback) || 0));
  return Math.max(0, Math.min(1, number));
}

export function normalizeAudioSettings(value = {}) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return AUDIO_BUS_IDS.reduce((settings, busId) => {
    if (busId === "master") {
      settings.enabled = input.enabled !== false;
    }
    settings[busId] = clampAudioVolume(input[busId], DEFAULT_AUDIO_SETTINGS[busId]);
    return settings;
  }, {});
}

export function updateAudioBusVolume(settings = {}, busId = "master", value = 1) {
  if (!AUDIO_BUS_IDS.includes(busId)) return normalizeAudioSettings(settings);
  return normalizeAudioSettings({ ...settings, [busId]: clampAudioVolume(value) });
}

export function audioBusGain(settings = {}, busId = "sfx", { ducked = false } = {}) {
  const normalized = normalizeAudioSettings(settings);
  if (!normalized.enabled) return 0;
  const busGain = busId === "master" ? 1 : normalized[busId] ?? 1;
  const duckGain = ducked && ["bgm", "ambience"].includes(busId) ? 0.34 : 1;
  return normalized.master * busGain * duckGain;
}

export function audioVolumePercent(settings = {}, busId = "master") {
  return Math.round(clampAudioVolume(normalizeAudioSettings(settings)[busId], 1) * 100);
}
