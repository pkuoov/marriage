const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const CHANNELS = {
  read: "livestream-detective:save-read",
  write: "livestream-detective:save-write",
  remove: "livestream-detective:save-remove",
  list: "livestream-detective:save-list",
  exportForCloud: "livestream-detective:save-export"
};

function saveDir() {
  return path.join(app.getPath("userData"), "saves");
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

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
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
  });
  window.once("ready-to-show", () => {
    window.show();
  });
  window.loadFile(path.join(__dirname, "playable", "index.html"));
  return window;
}

app.whenReady().then(() => {
  registerSaveIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
