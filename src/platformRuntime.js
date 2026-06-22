const browserStorage = {
  get(key) {
    return globalThis.localStorage?.getItem(key) ?? null;
  },
  set(key, value) {
    globalThis.localStorage?.setItem(key, value);
  },
  remove(key) {
    globalThis.localStorage?.removeItem(key);
  }
};

const steamBridge = globalThis.marriageDetectiveSteam ?? null;

export const platformRuntime = {
  id: steamBridge ? "steam" : "web",
  storage: steamBridge?.storage ?? browserStorage,
  achievements: steamBridge?.achievements ?? {
    unlock() {},
    setStat() {}
  },
  cloud: steamBridge?.cloud ?? {
    enabled: Boolean(steamBridge),
    syncNow() {}
  }
};

export function isSteamRuntime() {
  return platformRuntime.id === "steam";
}
