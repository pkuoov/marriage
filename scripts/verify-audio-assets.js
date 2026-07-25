import { access, readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { AUDIO_CUES, AUDIO_CUE_BUSES, AUDIO_CUE_STATUSES } from "../src/audioCatalog.js";
import { audioScenePlan } from "../src/runtime/audioSceneModel.js";

const ROOT_URL = new URL("../", import.meta.url);
const CONTENT_URL = new URL("../content/packs/steam-demo-01/", import.meta.url);
const errors = [];
const references = [];
const voiceProduction = JSON.parse(await readFile(new URL("../assets/audio/voice/recording-manifest.json", import.meta.url), "utf8"));
const bgmProduction = JSON.parse(await readFile(new URL("../assets/audio/bgm-production.json", import.meta.url), "utf8"));

for (const fileUrl of await jsonFiles(CONTENT_URL)) {
  const document = JSON.parse(await readFile(fileUrl, "utf8"));
  collectCueReferences(document, fileUrl, []);
}

for (const [cueId, cue] of Object.entries(AUDIO_CUES)) {
  if (!AUDIO_CUE_BUSES.includes(cue.bus)) fail(`${cueId}: unknown bus ${cue.bus}`);
  if (!AUDIO_CUE_STATUSES.includes(cue.status)) fail(`${cueId}: unknown status ${cue.status}`);
  if (!cue.label) fail(`${cueId}: label is required`);
  if (cue.loop && !["bgm", "ambience"].includes(cue.bus)) fail(`${cueId}: only BGM/ambience cues may loop`);
  if (cue.bus === "voice" && !cue.transcript?.trim()) fail(`${cueId}: voice cue requires a visible transcript`);
  if (cue.src && !cue.src.startsWith("./assets/audio/")) fail(`${cueId}: asset path must live under ./assets/audio/`);
  if (cue.status === "ready" && cue.src) {
    const assetUrl = new URL(cue.src.replace(/^\.\//, ""), ROOT_URL);
    try {
      await access(assetUrl);
      const info = await stat(assetUrl);
      const bytes = await readFile(assetUrl);
      if (info.size < 1024) fail(`${cueId}: ready asset is suspiciously small (${info.size} bytes)`);
      if (cue.src.endsWith(".ogg") && bytes.subarray(0, 4).toString("ascii") !== "OggS") fail(`${cueId}: ready OGG has an invalid container header`);
    } catch {
      fail(`${cueId}: ready asset is missing (${cue.src})`);
    }
  }
  if (cue.status === "planned" && !cue.src) fail(`${cueId}: planned cue requires its target asset path`);
}

for (const reference of references) {
  if (!AUDIO_CUES[reference.cueId]) {
    fail(`${relativeName(reference.fileUrl)}:${reference.path}: unknown cue ${reference.cueId}`);
  }
}

const requiredContentCues = [
  "sfx.case1.lamp-drag",
  "voice.case2.dryer-message",
  "voice.case3.dinner-pause",
  "voice.case4.pad-message",
  "voice.case4.supplier-message"
];
const requiredReadySfx = [
  "sfx.phone.connect",
  "sfx.phone.disconnect",
  "sfx.broadcast.on-air",
  "sfx.message.notification",
  "sfx.document.mark"
];
const requiredReadyP1 = [
  "bgm.title-nightshift",
  "bgm.live-call",
  "bgm.pressure-stem",
  "bgm.offair-desk",
  "bgm.day-investigation",
  "bgm.callback-return",
  "bgm.accusation",
  "bgm.recap-afterhours",
  "ambience.studio-room",
  "ambience.city-afternoon",
  "voice.case2.dryer-message",
  "sfx.case1.lamp-drag"
];
for (const cueId of requiredReadySfx) {
  if (AUDIO_CUES[cueId]?.status !== "ready") fail(`${cueId}: demo-critical SFX must be ready`);
}
for (const cueId of requiredReadyP1) {
  if (AUDIO_CUES[cueId]?.status !== "ready") fail(`${cueId}: P1 demo audio must be ready`);
}
const approvedBgmRecipes = Object.values(bgmProduction.recipes ?? {}).filter((recipe) => recipe.status === "approved");
const approvedBgmCueIds = new Set(approvedBgmRecipes.map((recipe) => recipe.cueId));
for (const recipe of approvedBgmRecipes) {
  const cue = AUDIO_CUES[recipe.cueId];
  if (cue?.status !== "ready") fail(`${recipe.cueId}: approved BGM recipe must map to a ready cue`);
  if (cue?.src !== `./${recipe.output}`) fail(`${recipe.cueId}: approved recipe output must match audio catalog source`);
}
for (const cueId of ["bgm.live-call", "bgm.pressure-stem", "bgm.offair-desk", "bgm.day-investigation", "bgm.callback-return", "bgm.accusation", "bgm.recap-afterhours"]) {
  if (!approvedBgmCueIds.has(cueId)) fail(`${cueId}: ready Udio loop requires an approved reproducible recipe`);
}
for (const cueId of ["bgm.epilogue-dawn"]) {
  if (AUDIO_CUES[cueId]?.status !== "planned") fail(`${cueId}: missing source music must stay planned instead of using a false placeholder`);
}
const referencedCueIds = new Set(references.map(({ cueId }) => cueId));
for (const cueId of requiredContentCues) {
  if (!referencedCueIds.has(cueId)) fail(`${cueId}: required semantic moment is not wired into content`);
}

const voiceEntries = new Map((voiceProduction.entries ?? []).map((entry) => [entry.cueId, entry]));
for (const [cueId, cue] of Object.entries(AUDIO_CUES).filter(([, item]) => item.bus === "voice")) {
  const entry = voiceEntries.get(cueId);
  if (!entry) {
    fail(`${cueId}: voice production manifest entry is required`);
    continue;
  }
  if (entry.targetPath !== cue.src) fail(`${cueId}: recording target path must match the audio catalog`);
  if (entry.transcript !== cue.transcript) fail(`${cueId}: recording transcript must match the player-visible catalog transcript`);
  if (!entry.speaker?.trim() || !entry.direction?.trim() || !entry.editNotes?.trim()) fail(`${cueId}: speaker, direction, and editNotes are required`);
  if (!voiceProduction.statuses?.includes(entry.status)) fail(`${cueId}: unknown production status ${entry.status}`);
  if (entry.status === "actor-required" && cue.status !== "planned") fail(`${cueId}: actor-required voice must stay planned`);
  if (["temporary-system-master", "approved-actor-master"].includes(entry.status) && cue.status !== "ready") fail(`${cueId}: delivered voice master must be ready`);
}
for (const cueId of voiceEntries.keys()) {
  if (AUDIO_CUES[cueId]?.bus !== "voice") fail(`${cueId}: recording manifest references a missing/non-voice cue`);
}

for (const sample of [
  { scene: "title" },
  { scene: "nightShellPrologue" },
  { scene: "caseOpen" },
  { scene: "sceneReview", backdropClass: "backdrop-live", pressureLevel: "hot" },
  { scene: "overnightPostLive", backdropClass: "day-document" },
  { scene: "dayScene", backdropClass: "day-restaurant" },
  { scene: "overnightCallback" },
  { scene: "overnightNight2" },
  { scene: "liveCounterBeat" },
  { scene: "accusation" },
  { scene: "solvedRecap" },
  { scene: "runComplete" }
]) {
  const plan = audioScenePlan(sample);
  for (const cueId of [plan.bgmCueId, plan.ambienceCueId, plan.enterSfxCueId].filter(Boolean)) {
    if (!AUDIO_CUES[cueId]) fail(`audioScenePlan(${sample.scene}): unknown cue ${cueId}`);
  }
}

const appSource = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
for (const cueId of ["sfx.message.notification", "sfx.document.mark"]) {
  if (!appSource.includes(cueId)) fail(`${cueId}: ready interaction SFX is not wired into app events`);
}

const contentText = await readFile(new URL("../content/packs/steam-demo-01/cases/02-tony.json", import.meta.url), "utf8");
const case2 = JSON.parse(contentText);
const dryerAction = findById(case2, "listen-dryer");
if (dryerAction?.script?.audioCueId !== "voice.case2.dryer-message") {
  fail("listen-dryer must map explicitly to voice.case2.dryer-message");
}
if (!dryerAction?.grantsInventory?.includes("吹风机回放")) {
  fail("listen-dryer must grant the player-visible 吹风机回放 item");
}
if (!dryerAction?.script?.clipLine) fail("listen-dryer must retain a visible transcript fallback");

if (errors.length) {
  console.error(`Audio validation failed (${errors.length})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const ready = Object.values(AUDIO_CUES).filter(({ status }) => status === "ready").length;
  const planned = Object.values(AUDIO_CUES).filter(({ status }) => status === "planned").length;
  console.log(`Audio validation passed: ${references.length} content references, ${ready} ready cues, ${planned} planned assets.`);
}

async function jsonFiles(directoryUrl) {
  const output = [];
  for (const entry of await readdir(directoryUrl, { withFileTypes: true })) {
    const childUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
    if (entry.isDirectory()) output.push(...await jsonFiles(childUrl));
    else if (entry.isFile() && entry.name.endsWith(".json")) output.push(childUrl);
  }
  return output;
}

function collectCueReferences(value, fileUrl, path) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...path, key];
    if ((key === "audioCueId" || key === "hangupAudioCueId") && typeof child === "string") {
      references.push({ cueId: child, fileUrl, path: nextPath.join(".") });
    }
    collectCueReferences(child, fileUrl, nextPath);
  }
}

function findById(value, id) {
  if (!value || typeof value !== "object") return null;
  if (value.id === id) return value;
  for (const child of Object.values(value)) {
    const found = findById(child, id);
    if (found) return found;
  }
  return null;
}

function relativeName(fileUrl) {
  return fileURLToPath(fileUrl).replace(fileURLToPath(ROOT_URL), "");
}

function fail(message) {
  errors.push(message);
}
