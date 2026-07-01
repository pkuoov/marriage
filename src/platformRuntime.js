const browserStorage = {
  get(key) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Storage can be blocked in some embedded browsers; keep gameplay running.
    }
  },
  remove(key) {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Ignore unavailable storage.
    }
  }
};

const steamBridge = globalThis.livestreamDetectiveSteam ?? globalThis.marriageDetectiveSteam ?? null;
const wechatMiniProgram = globalThis.wx?.miniProgram ?? null;
const isWechatBrowser = /MicroMessenger/i.test(globalThis.navigator?.userAgent ?? "");
const isWechatMiniProgramWebView = Boolean(wechatMiniProgram) || globalThis.__wxjs_environment === "miniprogram";

export const platformRuntime = {
  id: steamBridge ? "steam" : isWechatBrowser ? "wechat-webview" : "web",
  storage: steamBridge?.storage ?? browserStorage,
  postMessage(data) {
    if (typeof steamBridge?.postMessage === "function") {
      steamBridge.postMessage(data);
      return;
    }
    if (isWechatMiniProgramWebView) {
      wechatMiniProgram?.postMessage?.({ data });
    }
  },
  achievements: steamBridge?.achievements ?? {
    unlock() {},
    setStat() {}
  },
  cloud: steamBridge?.cloud ?? {
    enabled: Boolean(steamBridge),
    syncNow() {}
  },
  wechat: {
    enabled: isWechatBrowser,
    inMiniProgram: isWechatMiniProgramWebView,
    postMessage(data) {
      wechatMiniProgram?.postMessage?.({ data });
    },
    navigateTo(url) {
      wechatMiniProgram?.navigateTo?.({ url });
    }
  }
};
