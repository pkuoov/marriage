const sourceExtensions = new Set(["js", "mjs", "css", "json"]);
const assetExtensions = new Set([
  "ico", "jpeg", "jpg", "png", "svg", "webp", "gif", "avif",
  "ogg", "wav", "mp3", "m4a", "flac", "mp4", "webm", "woff", "woff2"
]);

// The project also holds live review notes and generated reports. Editing those
// must not reload a player's page or interrupt the dialogue they are reviewing.
export function shouldReloadForChange(filename) {
  if (typeof filename !== "string" || !filename) return false;
  const path = filename.replaceAll("\\", "/");
  const parts = path.split("/");
  if (parts.some((part) => part.startsWith(".") || part === "node_modules")) return false;
  if (path === "index.html") return true;
  const extension = parts.at(-1).split(".").at(-1).toLowerCase();
  if (parts[0] === "src") return sourceExtensions.has(extension);
  if (parts[0] === "assets") return assetExtensions.has(extension);
  return isRuntimeContentChange(path);
}

export function isRuntimeContentChange(filename) {
  return /^content\/(packs|characters)\/.+\.json$/.test(String(filename).replaceAll("\\", "/"));
}

// Coalesce edits and await the last successful build before announcing a reload.
// An edit during a build schedules another build; failures retain the old page
// and block fresh requests instead of silently serving the previous index.
export function createContentReload({ build, reload, reportError = () => {} }) {
  let pending = false, contentDirty = false, running = null, failure = null;
  return {
    changed(filename) {
      if (!shouldReloadForChange(filename)) return;
      if (filename === "src/generated/contentPackIndex.js" && running) return;
      pending = true;
      contentDirty ||= isRuntimeContentChange(filename);
    },
    async flush() {
      if (running) return running;
      if (!pending) { if (failure) throw failure; return; }
      running = (async () => {
        while (pending) {
          pending = false;
          const mustBuild = contentDirty || Boolean(failure);
          contentDirty = false;
          try {
            if (mustBuild) await build();
            failure = null;
          } catch (error) {
            failure = error;
            reportError(error);
            if (!pending) throw error;
          }
        }
        reload();
      })();
      try { await running; } finally { running = null; }
    }
  };
}
