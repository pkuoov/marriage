const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let mainWindow = null;
const releaseSmokeReportPath = process.argv.find((argument) => argument.startsWith("--release-smoke-report="))?.slice("--release-smoke-report=".length) ?? "";

if (releaseSmokeReportPath) {
  app.commandLine.appendSwitch("host-resolver-rules", "MAP * 0.0.0.0");
}

const CHANNELS = {
  read: "livestream-detective:save-read",
  write: "livestream-detective:save-write",
  remove: "livestream-detective:save-remove",
  list: "livestream-detective:save-list",
  exportForCloud: "livestream-detective:save-export",
  reportError: "livestream-detective:report-error"
};

const DEFAULT_WINDOW_STATE = {
  width: 1280,
  height: 800,
  x: null,
  y: null,
  fullscreen: false,
  zoomFactor: 1
};
const MAX_SAVE_BYTES = 5 * 1024 * 1024;

function userDataPath(...parts) {
  return path.join(app.getPath("userData"), ...parts);
}

function saveDir() {
  return userDataPath("saves");
}

function safeKey(key) {
  const normalized = String(key ?? "").trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized || "save";
}

function savePath(key) {
  return path.join(saveDir(), `${safeKey(key)}.json`);
}

function ensureSaveDir() {
  fs.mkdirSync(saveDir(), { recursive: true });
}

function readSave(key) {
  try {
    return fs.readFileSync(savePath(key), "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
}

function writeSave(key, value) {
  ensureSaveDir();
  const serialized = String(value ?? "");
  if (Buffer.byteLength(serialized, "utf8") > MAX_SAVE_BYTES) throw new Error("Save payload exceeds 5 MB");
  JSON.parse(serialized);
  atomicWriteFile(savePath(key), serialized);
  return true;
}

function atomicWriteFile(targetPath, value) {
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempPath, value, "utf8");
    fs.renameSync(tempPath, targetPath);
  } catch (error) {
    try {
      fs.rmSync(tempPath, { force: true });
    } catch {
      // Preserve the original error; cleanup is best-effort only.
    }
    throw error;
  }
}

function removeSave(key) {
  try {
    fs.rmSync(savePath(key), { force: true });
  } catch {
    // Deleting a missing save should never block startup or reset.
  }
  return true;
}

function listSaves() {
  ensureSaveDir();
  return [{
    slotId: "slot1",
    backend: "file",
    path: saveDir()
  }];
}

function exportSaves(keys = []) {
  return Object.fromEntries((Array.isArray(keys) ? keys : []).filter(Boolean).map((key) => [key, readSave(key)]));
}

function settingsPath() {
  return userDataPath("desktop-settings.json");
}

function readWindowState() {
  try {
    const parsed = JSON.parse(fs.readFileSync(settingsPath(), "utf8"));
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_WINDOW_STATE };
    return {
      ...DEFAULT_WINDOW_STATE,
      ...parsed,
      zoomFactor: clampZoom(parsed.zoomFactor)
    };
  } catch {
    return { ...DEFAULT_WINDOW_STATE };
  }
}

function writeWindowState(window) {
  if (!window || window.isDestroyed()) return;
  const bounds = window.getBounds();
  const state = {
    ...bounds,
    fullscreen: window.isFullScreen(),
    zoomFactor: clampZoom(window.webContents.getZoomFactor())
  };
  fs.mkdirSync(app.getPath("userData"), { recursive: true });
  atomicWriteFile(settingsPath(), `${JSON.stringify(state, null, 2)}\n`);
}

function clampZoom(value) {
  const zoom = Number(value);
  if (!Number.isFinite(zoom)) return DEFAULT_WINDOW_STATE.zoomFactor;
  return Math.min(1.4, Math.max(0.85, zoom));
}

function crashLogDir() {
  return userDataPath("crash-logs");
}

function writeCrashLog(source, error) {
  try {
    fs.mkdirSync(crashLogDir(), { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const message = error?.stack ?? error?.message ?? JSON.stringify(error);
    fs.writeFileSync(path.join(crashLogDir(), `${stamp}-${safeKey(source)}.log`), `${source}\n${message}\n`, "utf8");
  } catch {
    // Crash logging must never create a second crash.
  }
}

function registerSaveIpc() {
  registerSyncIpc(CHANNELS.read, readSave, null);
  registerSyncIpc(CHANNELS.write, writeSave, false);
  registerSyncIpc(CHANNELS.remove, removeSave, false);
  registerSyncIpc(CHANNELS.list, listSaves, []);
  registerSyncIpc(CHANNELS.exportForCloud, exportSaves, {});
  ipcMain.on(CHANNELS.reportError, (_event, payload) => {
    const source = safeKey(payload?.kind ?? "renderer-error");
    const message = [payload?.message, payload?.stack].filter(Boolean).join("\n").slice(0, 32_000);
    writeCrashLog(source, new Error(message || "Renderer reported an unknown error"));
  });
}

function registerSyncIpc(channel, handler, fallbackValue) {
  ipcMain.on(channel, (event, ...args) => {
    try {
      event.returnValue = handler(...args);
    } catch (error) {
      writeCrashLog(channel, error);
      event.returnValue = fallbackValue;
    }
  });
}

function registerCrashLogging(window) {
  process.on("uncaughtException", (error) => {
    writeCrashLog("main-uncaught-exception", error);
  });
  process.on("unhandledRejection", (error) => {
    writeCrashLog("main-unhandled-rejection", error);
  });
  window.webContents.on("render-process-gone", (_event, details) => {
    writeCrashLog("renderer-process-gone", details);
  });
  window.webContents.on("unresponsive", () => {
    writeCrashLog("renderer-unresponsive", new Error("Renderer became unresponsive"));
  });
}

function registerWindowControls(window) {
  window.webContents.on("before-input-event", (event, input) => {
    const key = String(input.key ?? "");
    const ctrlOrCommand = input.control || input.meta;
    if (key === "F11" || (input.alt && key === "Enter")) {
      window.setFullScreen(!window.isFullScreen());
      event.preventDefault();
      return;
    }
    if (key === "Escape" && window.isFullScreen()) {
      window.setFullScreen(false);
      event.preventDefault();
      return;
    }
    if (ctrlOrCommand && key === "0") {
      window.webContents.setZoomFactor(1);
      event.preventDefault();
      return;
    }
    if (ctrlOrCommand && (key === "=" || key === "+")) {
      window.webContents.setZoomFactor(clampZoom(window.webContents.getZoomFactor() + 0.05));
      event.preventDefault();
      return;
    }
    if (ctrlOrCommand && key === "-") {
      window.webContents.setZoomFactor(clampZoom(window.webContents.getZoomFactor() - 0.05));
      event.preventDefault();
    }
  });
  window.on("close", () => {
    writeWindowState(window);
  });
}

function createWindow() {
  const savedWindow = readWindowState();
  const options = {
    width: savedWindow.width,
    height: savedWindow.height,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#120f12",
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  };
  if (Number.isFinite(savedWindow.x) && Number.isFinite(savedWindow.y)) {
    options.x = savedWindow.x;
    options.y = savedWindow.y;
  }
  const window = new BrowserWindow(options);
  const playableUrl = pathToFileURL(path.join(__dirname, "playable", "index.html"));
  window.setFullScreen(Boolean(savedWindow.fullscreen));
  window.webContents.setZoomFactor(clampZoom(savedWindow.zoomFactor));
  registerWindowControls(window);
  registerCrashLogging(window);
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, nextUrl) => {
    const next = new URL(nextUrl);
    if (next.protocol === playableUrl.protocol && next.pathname === playableUrl.pathname) return;
    event.preventDefault();
  });
  window.once("ready-to-show", () => {
    if (!releaseSmokeReportPath) window.show();
  });
  if (releaseSmokeReportPath) {
    window.webContents.once("did-finish-load", () => {
      runReleaseSmoke(window, releaseSmokeReportPath);
    });
  }
  window.loadFile(path.join(__dirname, "playable", "index.html"));
  return window;
}

async function runReleaseSmoke(window, reportPath) {
  const report = {
    platform: process.platform,
    arch: process.arch,
    electron: process.versions.electron,
    offlineResolverBlocked: true,
    renderer: null,
    saveBridge: null,
    error: null
  };
  try {
    report.renderer = await window.webContents.executeJavaScript(`({
      title: document.title,
      protocol: location.protocol,
      startButton: Boolean(document.querySelector("[data-start-story], [data-continue-story], [data-request-new-game]")),
      desktopBridge: typeof window.livestreamDetectiveDesktop?.saveFiles?.write === "function"
    })`);
    report.saveBridge = await window.webContents.executeJavaScript(`(() => {
      const key = "__windows_release_smoke__";
      const value = JSON.stringify({ marker: "portable-save-roundtrip", at: Date.now() });
      const bridge = window.livestreamDetectiveDesktop?.saveFiles;
      bridge.write(key, value);
      const readBack = bridge.read(key);
      const listed = bridge.list();
      const exported = bridge.exportForCloud([key]);
      bridge.remove(key);
      return {
        roundTrip: readBack === value,
        listed: Array.isArray(listed) && listed.length > 0,
        exported: exported?.[key] === value,
        removed: bridge.read(key) === null
      };
    })()`);
  } catch (error) {
    report.error = error?.stack ?? error?.message ?? String(error);
  }

  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  } catch (error) {
    writeCrashLog("release-smoke-report", error);
    app.exit(1);
    return;
  }

  const ok = !report.error
    && report.platform === "win32"
    && report.renderer?.protocol === "file:"
    && report.renderer?.startButton
    && report.renderer?.desktopBridge
    && Object.values(report.saveBridge ?? {}).every(Boolean);
  app.exit(ok ? 0 : 1);
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    app.setName("Midnight Hotline Detective Demo");
    if (process.platform === "win32") app.setAppUserModelId("com.livestreamdetective.demo");
    registerSaveIpc();
    mainWindow = createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
