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
      return true;
    } catch {
      // Storage can be blocked in some embedded browsers; keep gameplay running.
      return false;
    }
  },
  remove(key) {
    try {
      globalThis.localStorage?.removeItem(key);
      return true;
    } catch {
      // Ignore unavailable storage.
      return false;
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
  reportError(data) {
    if (typeof nativeBridge?.reportError === "function") {
      nativeBridge.reportError(data);
      return;
    }
    globalThis.console?.error?.("Runtime error", data);
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
