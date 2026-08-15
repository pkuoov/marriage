const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = {
  read: "livestream-detective:save-read",
  write: "livestream-detective:save-write",
  remove: "livestream-detective:save-remove",
  list: "livestream-detective:save-list",
  exportForCloud: "livestream-detective:save-export"
};

function sendSync(channel, ...args) {
  return ipcRenderer.sendSync(channel, ...args);
}

contextBridge.exposeInMainWorld("livestreamDetectiveDesktop", {
  saveFiles: {
    read(key) {
      return sendSync(CHANNELS.read, key);
    },
    write(key, value) {
      return sendSync(CHANNELS.write, key, value);
    },
    remove(key) {
      return sendSync(CHANNELS.remove, key);
    },
    list() {
      return sendSync(CHANNELS.list);
    },
    exportForCloud(keys) {
      return sendSync(CHANNELS.exportForCloud, keys);
    }
  },
  postMessage(data) {
    ipcRenderer.send("livestream-detective:message", data);
  }
});
