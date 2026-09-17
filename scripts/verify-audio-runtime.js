import assert from "node:assert/strict";

// Exercise the production mixer with deterministic clocks and an Audio boundary.
const original = { Audio: globalThis.Audio, now: Date.now, setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval };
let now = 0;
let timerId = 0;
const timers = new Map();
const elements = [];
globalThis.setInterval = (callback, period) => {
  const id = ++timerId;
  timers.set(id, { callback, period, next: now + period });
  return id;
};
globalThis.clearInterval = id => timers.delete(id);
Date.now = () => now;
globalThis.Audio = class {
  constructor(src) { Object.assign(this, { src, volume: 1, paused: true, currentTime: 0, duration: 8 }); elements.push(this); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  addEventListener() {}
};
function tick(ms) {
  const until = now + ms;
  while (true) {
    const next = Math.min(...[...timers.values()].map(timer => timer.next));
    if (next > until) break;
    now = next;
    for (const [id, timer] of [...timers]) {
      if (timer.next !== now || !timers.has(id)) continue;
      timer.next += timer.period;
      timer.callback();
    }
  }
  now = until;
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
  sound.syncAudioScene({ bgmCueId: "bgm.live-call" });
  await Promise.resolve();
  sound.toggleSound();
  tick(60);
  for (const audio of elements.filter(audio => !audio.paused)) near(audio.volume, 0, "mute also covers outgoing tracks");
  tick(400);
  assert.equal(timers.size, 0, "finished transitions leave no timers");
  console.log("Audio runtime tests passed: fade mute, slider, outgoing loops, voice pause/resume, stinger silence, instant BGM attack, epilogue fade, timer cleanup");
} finally {
  Date.now = original.now;
  globalThis.setInterval = original.setInterval;
  globalThis.clearInterval = original.clearInterval;
  if (original.Audio === undefined) delete globalThis.Audio;
  else globalThis.Audio = original.Audio;
}
