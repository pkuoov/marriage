export function decisiveHitTiming({ screenEffects = "full", fastForward = false, reducedMotion = false } = {}) {
  if (fastForward || reducedMotion || screenEffects === "off") return { settleMs: 0, stingerMs: 0, effects: "off" };
  if (screenEffects === "reduced") return { settleMs: 400, stingerMs: 60, effects: "reduced" };
  return { settleMs: 1400, stingerMs: 120, effects: "full" };
}

export function mountDecisiveHitPresentation({ root, button, skipButton, timing, continueLabel, onStinger = () => {}, schedule = globalThis.setTimeout, cancel = globalThis.clearTimeout } = {}) {
  const timers = [];
  let settled = false;
  let disposed = false;
  const active = () => !disposed && root?.isConnected !== false && button?.isConnected !== false;
  const clear = () => { timers.splice(0).forEach(cancel); };
  const settle = () => {
    if (!active() || settled) return;
    settled = true;
    clear();
    root?.classList.add("sequence-settled");
    if (button) { button.disabled = false; button.textContent = continueLabel; }
    if (skipButton) {
      const restoreFocus = skipButton === skipButton.ownerDocument?.activeElement;
      skipButton.hidden = true;
      if (restoreFocus) button?.focus?.({ preventScroll: true });
    }
  };
  const skip = () => settle();
  skipButton?.addEventListener("click", skip);
  if (!timing.settleMs) settle();
  else {
    timers.push(schedule(() => { if (active() && !settled) onStinger(); }, timing.stingerMs));
    timers.push(schedule(settle, timing.settleMs));
  }
  return () => { disposed = true; clear(); skipButton?.removeEventListener("click", skip); };
}
