// Browser adapters. Explicit inputs keep URL parsing and history failures testable.
export function dailyKeyFromUrl(search = globalThis.location?.search ?? "") {
  try {
    return new URLSearchParams(search).get("dailyKey") || undefined;
  } catch {
    return undefined;
  }
}

export function storyKeyFromUrl(search = globalThis.location?.search ?? "") {
  try {
    const params = new URLSearchParams(search);
    return params.get("storyKey") || params.get("packKey") || params.get("weeklyKey") || undefined;
  } catch {
    return undefined;
  }
}

export function modeFromUrl(search = globalThis.location?.search ?? "") {
  try {
    return new URLSearchParams(search).get("mode") === "daily" ? "daily" : "episode";
  } catch {
    return "episode";
  }
}

// Consumes fresh=1 when history is writable. URL cleanup must not cancel a reset.
export function hasFreshStartParam(href = globalThis.location?.href ?? "https://local.invalid/", history = globalThis.history) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (url.searchParams.get("fresh") !== "1") return false;
  url.searchParams.delete("fresh");
  try {
    history?.replaceState?.(null, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Restricted browser/file contexts may reject replaceState; still start fresh.
  }
  return true;
}
