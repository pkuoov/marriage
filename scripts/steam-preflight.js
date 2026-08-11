import { readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checks = [];

function record(name, ok, detail = "") {
  checks.push({ name, ok, detail });
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function nodeSupportsElectronPackaging(version = process.versions.node) {
  const [major, minor] = version.split(".").map((item) => Number(item));
  return major > 22 || (major === 22 && minor >= 12);
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const builderConfig = JSON.parse(await readFile(resolve(root, "desktop", "electron-builder.json"), "utf8"));
const mainSource = await readFile(resolve(root, "desktop", "electron", "main.cjs"), "utf8");
const preloadSource = await readFile(resolve(root, "desktop", "electron", "preload.cjs"), "utf8");
const windowsWorkflow = await readFile(resolve(root, ".github", "workflows", "windows-package.yml"), "utf8");

record("package:win script", Boolean(packageJson.scripts?.["package:win"]), "Windows portable package entry exists");
record("native packaging guard", packageJson.scripts?.["package:win"]?.includes("assert-windows-package-env.js"), "Official .exe packaging rejects Mac/Linux cross-builds");
record("Windows native workflow", windowsWorkflow.includes("runs-on: windows-latest") && windowsWorkflow.includes("verify:win-package"), "CI packages and verifies the portable executable on Windows");
record("electron-builder config", builderConfig.directories?.app === "dist/desktop-electron" && builderConfig.directories?.output === "dist/steam", "Builder uses desktop staging and Steam output dirs");
const configuredIcon = builderConfig.win?.icon;
record(
  "application icon",
  typeof configuredIcon === "string" && await exists(resolve(root, configuredIcon)),
  typeof configuredIcon === "string" ? `Configured icon: ${configuredIcon}` : "Set win.icon to the approved project asset",
);
record("portable x64 target", builderConfig.win?.target?.some((target) => target.target === "portable" && target.arch?.includes("x64")), "Windows target is portable x64");
record("desktop staging", await exists(resolve(root, "dist", "desktop-electron", "playable", "index.html")), "Run npm run build:steam before final packaging");
record("file save bridge", mainSource.includes("userData") && preloadSource.includes("saveFiles"), "Desktop saves go through userData file bridge");
record("crash logs", mainSource.includes("crash-logs") && mainSource.includes("render-process-gone"), "Renderer crash logging is wired");
record("packaged runtime smoke", mainSource.includes("--release-smoke-report=") && windowsWorkflow.includes("verify:win-runtime-smoke"), "Windows CI launches the packaged app and exercises offline file saves");
record("node packaging runtime", nodeSupportsElectronPackaging(), `Current Node ${process.versions.node}; Electron 43 packaging needs >=22.12`);
record("official packaging host", process.platform === "win32", `Current host ${process.platform}; Mac/Linux are preflight and staging hosts only`);

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "WARN"} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
}

const advisoryChecks = new Set(["node packaging runtime", "official packaging host"]);
const failed = checks.filter((check) => !check.ok && !advisoryChecks.has(check.name));
if (failed.length) {
  process.exitCode = 1;
}
