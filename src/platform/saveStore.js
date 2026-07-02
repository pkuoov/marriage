import { platformRuntime } from "../platformRuntime.js?v=0.20.59";

export const DEFAULT_SAVE_SLOT = "slot1";

export function activeSaveSlot() {
  return DEFAULT_SAVE_SLOT;
}

export function createSaveStore({ storage = platformRuntime.storage } = {}) {
  return {
    read(key, legacyKeys = []) {
      const keys = [key, ...legacyKeys].filter(Boolean);
      for (const candidate of keys) {
        const value = storage.get(candidate);
        if (value !== null && value !== undefined) return value;
      }
      return null;
    },
    write(key, value) {
      storage.set(key, value);
    },
    remove(key) {
      storage.remove(key);
    },
    removeMany(keys = []) {
      keys.filter(Boolean).forEach((key) => storage.remove(key));
    },
    list() {
      return [{ slotId: DEFAULT_SAVE_SLOT }];
    },
    exportForCloud(keys = []) {
      return Object.fromEntries(keys.filter(Boolean).map((key) => [key, storage.get(key)]));
    }
  };
}

export const saveStore = createSaveStore();
