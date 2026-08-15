export function keyboardNavigationIntent(key = "") {
  if (key === "Enter" || key === " ") return "confirm";
  if (["ArrowDown", "ArrowRight", "s", "S", "d", "D"].includes(key)) return "next";
  if (["ArrowUp", "ArrowLeft", "w", "W", "a", "A"].includes(key)) return "previous";
  if (key === "Tab") return "review";
  if (key === "Escape") return "back";
  return "";
}

export function nextFocusIndex({ currentIndex = -1, total = 0, direction = 1 } = {}) {
  const count = Math.max(0, Math.floor(Number(total) || 0));
  if (!count) return -1;
  const step = Number(direction) >= 0 ? 1 : -1;
  const index = Math.floor(Number(currentIndex));
  if (index >= 0 && index < count) return (index + step + count) % count;
  return step > 0 ? 0 : count - 1;
}

export function gamepadAxisDirection({
  axes = [],
  lastMoveAt = 0,
  now = Date.now(),
  threshold = 0.55,
  cooldownMs = 220
} = {}) {
  const horizontal = Number(axes?.[0] ?? 0);
  const vertical = Number(axes?.[1] ?? 0);
  const strongest = Math.abs(horizontal) > Math.abs(vertical) ? horizontal : vertical;
  if (Math.abs(strongest) < threshold) return 0;
  if (Number(now) - Number(lastMoveAt) < cooldownMs) return 0;
  return strongest > 0 ? 1 : -1;
}
