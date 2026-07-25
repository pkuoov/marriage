const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

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
  exportForCloud: "livestream-detective:save-export"
};

const DEFAULT_WINDOW_STATE = {
  width: 1280,
  height: 800,
  x: null,
  y: null,
  fullscreen: false,
  zoomFactor: 1
};

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
  fs.writeFileSync(savePath(key), String(value ?? ""), "utf8");
  return true;
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
  fs.writeFileSync(settingsPath(), `${JSON.stringify(state, null, 2)}\n`, "utf8");
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
  ipcMain.on(CHANNELS.read, (event, key) => {
    event.returnValue = readSave(key);
  });
  ipcMain.on(CHANNELS.write, (event, key, value) => {
    event.returnValue = writeSave(key, value);
  });
  ipcMain.on(CHANNELS.remove, (event, key) => {
    event.returnValue = removeSave(key);
  });
  ipcMain.on(CHANNELS.list, (event) => {
    event.returnValue = listSaves();
  });
  ipcMain.on(CHANNELS.exportForCloud, (event, keys) => {
    event.returnValue = exportSaves(keys);
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
      sandbox: false
    }
  };
  if (Number.isFinite(savedWindow.x) && Number.isFinite(savedWindow.y)) {
    options.x = savedWindow.x;
    options.y = savedWindow.y;
  }
  const window = new BrowserWindow(options);
  window.setFullScreen(Boolean(savedWindow.fullscreen));
  window.webContents.setZoomFactor(clampZoom(savedWindow.zoomFactor));
  registerWindowControls(window);
  registerCrashLogging(window);
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
      startButton: Boolean(document.querySelector("[data-start-story]")),
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
