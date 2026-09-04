const HAPTIC_PATTERNS = Object.freeze({
  hit: Object.freeze({ duration: 260, strongMagnitude: 0.72, weakMagnitude: 0.38 }),
  miss: Object.freeze({ duration: 180, strongMagnitude: 0.5, weakMagnitude: 0.18 }),
  pressure: Object.freeze({ duration: 90, strongMagnitude: 0.16, weakMagnitude: 0.3 })
});

export function gamepadHapticPlan(kind = "hit", effects = "full") {
  if (effects === "off") return null;
  const base = HAPTIC_PATTERNS[kind] ?? HAPTIC_PATTERNS.hit;
  if (effects !== "reduced") return { ...base };
  return {
    duration: Math.max(60, Math.round(base.duration * 0.55)),
    strongMagnitude: roundMagnitude(base.strongMagnitude * 0.42),
    weakMagnitude: roundMagnitude(base.weakMagnitude * 0.5)
  };
}

export function triggerGamepadHaptic({ kind = "hit", effects = "full", gamepads } = {}) {
  const plan = gamepadHapticPlan(kind, effects);
  if (!plan) return { ok: false, reason: "disabled" };
  const pads = gamepads ?? readGamepads();
  const gamepad = Array.from(pads ?? []).find((item) => item?.connected);
  if (!gamepad) return { ok: false, reason: "no-gamepad" };
  const actuator = gamepad.vibrationActuator ?? gamepad.hapticActuators?.[0];
  if (!actuator || typeof actuator.playEffect !== "function") return { ok: false, reason: "unsupported" };
  try {
    const result = actuator.playEffect("dual-rumble", plan);
    result?.catch?.(() => {});
    return { ok: true, kind, plan };
  } catch {
    return { ok: false, reason: "actuator-error" };
  }
}

function readGamepads() {
  try {
    return globalThis.navigator?.getGamepads?.() ?? [];
  } catch {
    return [];
  }
}

function roundMagnitude(value) {
  return Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;
}
