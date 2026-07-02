import { platformRuntime } from "../platformRuntime.js?v=0.20.66";

export const DEFAULT_SAVE_SLOT = "slot1";

export function activeSaveSlot() {
  return DEFAULT_SAVE_SLOT;
}

export function createSaveStore({ storage = platformRuntime.storage, saveFiles = platformRuntime.saveFiles, slotId = DEFAULT_SAVE_SLOT } = {}) {
  const fileBackend = createFileSaveBackend(saveFiles);
  return {
    read(key, legacyKeys = []) {
      const keys = [key, ...legacyKeys].filter(Boolean);
      for (const candidate of keys) {
        const value = fileBackend ? fileBackend.read(candidate) : storage.get(candidate);
        if (value !== null && value !== undefined) return value;
      }
      return null;
    },
    write(key, value) {
      if (fileBackend) fileBackend.write(key, value);
      else storage.set(key, value);
    },
    remove(key) {
      if (fileBackend) fileBackend.remove(key);
      else storage.remove(key);
    },
    removeMany(keys = []) {
      keys.filter(Boolean).forEach((key) => {
        if (fileBackend) fileBackend.remove(key);
        else storage.remove(key);
      });
    },
    list() {
      return fileBackend?.list() ?? [{ slotId }];
    },
    exportForCloud(keys = []) {
      if (fileBackend) return fileBackend.exportForCloud(keys);
      return Object.fromEntries(keys.filter(Boolean).map((key) => [key, storage.get(key)]));
    }
  };
}

function createFileSaveBackend(saveFiles) {
  if (!saveFiles || typeof saveFiles.read !== "function" || typeof saveFiles.write !== "function") return null;
  return {
    read(key) {
      return normalizeMissing(saveFiles.read(key));
    },
    write(key, value) {
      saveFiles.write(key, value);
    },
    remove(key) {
      if (typeof saveFiles.remove === "function") saveFiles.remove(key);
    },
    list() {
      if (typeof saveFiles.list !== "function") return [{ slotId: DEFAULT_SAVE_SLOT }];
      const rows = saveFiles.list();
      return Array.isArray(rows) && rows.length ? rows : [{ slotId: DEFAULT_SAVE_SLOT }];
    },
    exportForCloud(keys = []) {
      if (typeof saveFiles.exportForCloud === "function") return saveFiles.exportForCloud(keys);
      return Object.fromEntries(keys.filter(Boolean).map((key) => [key, normalizeMissing(saveFiles.read(key))]));
    }
  };
}

function normalizeMissing(value) {
  return value === undefined ? null : value;
}

export const saveStore = createSaveStore();
