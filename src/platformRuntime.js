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

const desktopBridge = globalThis.livestreamDetectiveDesktop ?? null;
const steamBridge = globalThis.livestreamDetectiveSteam ?? globalThis.marriageDetectiveSteam ?? null;
const nativeBridge = steamBridge ?? desktopBridge;
const wechatMiniProgram = globalThis.wx?.miniProgram ?? null;
const isWechatBrowser = /MicroMessenger/i.test(globalThis.navigator?.userAgent ?? "");
const isWechatMiniProgramWebView = Boolean(wechatMiniProgram) || globalThis.__wxjs_environment === "miniprogram";

export const platformRuntime = {
  id: steamBridge ? "steam" : desktopBridge ? "desktop" : isWechatBrowser ? "wechat-webview" : "web",
  storage: nativeBridge?.storage ?? browserStorage,
  saveFiles: nativeBridge?.saveFiles ?? null,
  postMessage(data) {
    if (typeof nativeBridge?.postMessage === "function") {
      nativeBridge.postMessage(data);
      return;
    }
    if (isWechatMiniProgramWebView) {
      wechatMiniProgram?.postMessage?.({ data });
    }
  },
  achievements: nativeBridge?.achievements ?? {
    unlock() {},
    setStat() {}
  },
  cloud: nativeBridge?.cloud ?? {
    enabled: Boolean(nativeBridge),
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
