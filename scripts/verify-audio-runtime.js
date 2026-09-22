import assert from "node:assert/strict";

// Exercise the production mixer with deterministic clocks and an Audio boundary.
const original = {
  Audio: globalThis.Audio,
  now: Date.now,
  requestAnimationFrame: globalThis.requestAnimationFrame,
  cancelAnimationFrame: globalThis.cancelAnimationFrame
};
let now = 0;
let frameId = 0;
const frames = new Map();
const elements = [];
globalThis.requestAnimationFrame = (callback) => {
  const id = ++frameId;
  frames.set(id, callback);
  return id;
};
globalThis.cancelAnimationFrame = (id) => frames.delete(id);
Date.now = () => now;
globalThis.Audio = class {
  constructor(src) { Object.assign(this, { src, volume: 1, paused: true, currentTime: 0, duration: 8, listeners: {} }); elements.push(this); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  removeAttribute(name) { if (name === "src") this.src = ""; }
  load() { this.loadCount = (this.loadCount ?? 0) + 1; }
};
function tick(ms) {
  const until = now + ms;
  while (now < until) {
    const batch = [...frames.entries()];
    frames.clear();
    now = Math.min(until, now + 16);
    for (const [, callback] of batch) callback(now);
  }
}
function near(actual, expected, message) { assert(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} != ${expected}`); }

try {
  const sound = await import("../src/sound.js");
  sound.syncAudioScene({ bgmCueId: "bgm.live-call" });
  await Promise.resolve();
  const live = elements.at(-1);
  tick(65);
  assert(live.volume > 0, "fade-in must have begun");
  sound.toggleSound();
  near(live.volume, 0, "mute immediately");
  tick(90);
  near(live.volume, 0, "mute must survive subsequent fade ticks");
  tick(250);
  near(live.volume, 0, "mute must survive fade completion");
  sound.toggleSound();
  const full = live.volume;
  sound.toggleVoiceCue("voice.case2.dryer-message");
  await Promise.resolve();
  near(live.volume, full * 0.34, "playing voice ducks BGM");
  sound.toggleVoiceCue("voice.case2.dryer-message");
  near(live.volume, full, "paused voice releases BGM");
  sound.toggleVoiceCue("voice.case2.dryer-message");
  await Promise.resolve();
  near(live.volume, full * 0.34, "resumed voice ducks BGM");
  sound.stopVoiceCue();
  near(live.volume, full, "stopped voice releases BGM");

  sound.syncAudioScene({ bgmCueId: "bgm.accusation" });
  await Promise.resolve();
  const accusation = elements.at(-1);
  tick(65);
  sound.setAudioBusVolume("bgm", 0.2);
  tick(300);
  near(accusation.volume, 0.85 * 0.2 * 0.7, "slider wins over old fade target");
  assert(live.paused, "outgoing loop stops after crossfade");
  assert.equal(live.src, "", "outgoing loop releases its media source");
  assert.equal(live.loadCount, 1, "outgoing loop reloads after releasing its source");
  sound.syncAudioScene({ bgmCueId: "bgm.live-call-allegro" });
  await Promise.resolve();
  const allegro = elements.at(-1);
  near(allegro.volume, 0.85 * 0.2 * 0.6, "Allegro enters at configured gain without a default attack ramp");
  sound.syncAudioScene({ bgmCueId: "" });
  tick(500);
  assert(allegro.paused, "stinger silence stops the outgoing Allegro within half a second");
  sound.syncAudioScene({ bgmCueId: "bgm.pursuit" });
  await Promise.resolve();
  const pursuit = elements.at(-1);
  near(pursuit.volume, 0.85 * 0.2 * 0.6, "pursuit enters immediately after the stinger window");
  sound.syncAudioScene({ bgmCueId: "bgm.pursuit" });
  assert.equal(elements.at(-1), pursuit, "same pursuit cue survives scene changes without restarting");
  sound.syncAudioScene({ bgmCueId: "bgm.epilogue-dawn" });
  await Promise.resolve();
  const dawn = elements.at(-1);
  tick(330);
  assert(dawn.volume > 0 && dawn.volume < 0.85 * 0.2 * 0.54, "dawn uses its longer gentle attack");
  tick(570);
  near(dawn.volume, 0.85 * 0.2 * 0.54, "dawn reaches full gain at 900 milliseconds");
  sound.playAudioCue("sfx.phone.connect");
  const shot = elements.at(-1);
  shot.listeners.ended();
  assert.equal(shot.paused, true, "finished one-shot pauses");
  assert.equal(shot.src, "", "finished one-shot releases its media source");
  assert.equal(shot.loadCount, 1, "finished one-shot reloads after releasing its source");
  sound.syncAudioScene({ bgmCueId: "bgm.pursuit" });
  await Promise.resolve();
  const hiddenIncoming = elements.at(-1);
  sound.finishPendingFades();
  assert(dawn.paused, "hidden window settles the outgoing crossfade");
  assert.equal(dawn.src, "", "settled outgoing loop releases its media source");
  assert(hiddenIncoming.volume > 0, "hidden window settles the incoming attack at full gain");
  assert.equal(frames.size, 0, "settled fades leave no animation frames");
  sound.syncAudioScene({ bgmCueId: "bgm.live-call" });
  await Promise.resolve();
  sound.toggleSound();
  tick(60);
  for (const audio of elements.filter(audio => !audio.paused)) near(audio.volume, 0, "mute also covers outgoing tracks");
  tick(400);
  assert.equal(frames.size, 0, "finished transitions leave no animation frames");
  console.log("Audio runtime tests passed: fade mute, slider, outgoing loops, voice pause/resume, stinger silence, instant BGM attack, epilogue fade, timer cleanup");
} finally {
  Date.now = original.now;
  globalThis.requestAnimationFrame = original.requestAnimationFrame;
  globalThis.cancelAnimationFrame = original.cancelAnimationFrame;
  if (original.Audio === undefined) delete globalThis.Audio;
  else globalThis.Audio = original.Audio;
}
