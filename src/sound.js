let audioContext;
const SOUND_KEY = "marriage-detective-agency-sound";
const PITFALL_SOUND_KEY = "marriage-pitfall-guide-sound";
const LEGACY_SOUND_KEY = "chinese-marriage-ten-year-dream-sound";
const savedSound = localStorage.getItem(SOUND_KEY) ?? localStorage.getItem(PITFALL_SOUND_KEY) ?? localStorage.getItem(LEGACY_SOUND_KEY);
let enabled = savedSound !== "off";

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function tone({ frequency, duration, type = "sine", gain = 0.035, slideTo = null }) {
  if (!enabled) return;
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  const now = ctx.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function playSfx(kind = "click") {
  if (kind === "confirm") {
    tone({ frequency: 520, duration: 0.09, type: "triangle", gain: 0.045, slideTo: 780 });
    setTimeout(() => tone({ frequency: 880, duration: 0.08, type: "triangle", gain: 0.035 }), 70);
    return;
  }
  if (kind === "warning") {
    tone({ frequency: 210, duration: 0.16, type: "sawtooth", gain: 0.028, slideTo: 130 });
    return;
  }
  if (kind === "page") {
    tone({ frequency: 330, duration: 0.05, type: "square", gain: 0.018, slideTo: 420 });
    return;
  }
  tone({ frequency: 440, duration: 0.055, type: "sine", gain: 0.026, slideTo: 520 });
}

export function toggleSound() {
  enabled = !enabled;
  localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  if (enabled) playSfx("confirm");
  return enabled;
}

export function isSoundEnabled() {
  return enabled;
}
