import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RUNTIME_CASE_CONTENT_FIELDS, RUNTIME_CASE_CONTENT_STATUS, RUNTIME_CASE_REQUIRED_FIELDS, runtimeCaseContentSummary } from "../src/runtime/contentCase.js";
import { statementLinesFromText, statementStagesForBrief } from "../src/runtime/statementReviewModel.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packsDir = resolve(root, "content", "packs");
const advisorsPath = resolve(root, "content", "characters", "advisors.json");
const helperNpcsPath = resolve(root, "content", "characters", "helper-npcs.json");
const castPath = resolve(root, "content", "characters", "cast.json");
const outputPath = resolve(root, "src", "generated", "contentPackIndex.js");
const checkOnly = process.argv.includes("--check");

const { contentPacks, contentCases, contentQuickCases } = await loadContentPacks();
const contentAdvisors = await loadAdvisors();
const contentHelperNpcs = await loadHelperNpcs();
const contentCast = await loadCast();
for (const pack of Object.values(contentPacks)) {
  for (const item of pack.sequence ?? []) {
    assert(Array.isArray(item.castProfileIds) && item.castProfileIds.length >= 2, `${item.caseId} castProfileIds must list the case cast`);
    for (const profileId of item.castProfileIds) {
      assert(contentCast[profileId], `${item.caseId} references unknown cast profile ${profileId}`);
    }
  }
}
for (const quickCases of Object.values(contentQuickCases)) {
  for (const quickCase of Object.values(quickCases)) {
    validateQuickCase(quickCase, contentCast);
  }
}
const source = stripManualCacheTokens(
  renderContentIndex(contentPacks, contentCases, contentQuickCases, contentAdvisors, contentHelperNpcs, contentCast)
);

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== source) {
    throw new Error("content pack runtime index is stale; run npm run content:index");
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, source);
  console.log(`Content pack runtime index ready: ${outputPath}`);
}

async function loadContentPacks() {
  const entries = await readdir(packsDir, { withFileTypes: true });
  const packIds = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const packs = {};
  const cases = {};
  const quickCases = {};
  for (const packId of packIds) {
    const manifest = await readJson(resolve(packsDir, packId, "manifest.json"));
    const comments = await readJson(resolve(packsDir, packId, "comments.json"));
    assert(manifest.id === packId, `${packId} manifest id must match folder name`);
    assert(comments.themeId === manifest.theme?.id, `${packId} comments themeId must match manifest theme`);
    packs[manifest.id] = {
      id: manifest.id,
      title: manifest.title,
      size: manifest.size,
      theme: manifest.theme,
      nightShell: manifest.nightShell,
      quickDetective: manifest.quickDetective ?? {},
      comments,
      caseLabels: manifest.caseLabels,
      quickCases: manifest.quickCases ?? [],
      sequence: manifest.sequence
    };
    cases[manifest.id] = {};
    quickCases[manifest.id] = {};
    for (const item of manifest.sequence ?? []) {
      const packet = await readJson(resolve(packsDir, packId, "cases", `${item.caseId}.json`));
      validateStatementReplayCase(packet);
      cases[manifest.id][item.caseId] = runtimeIndexCase(packet, item);
    }
    for (const quickCaseId of manifest.quickCases ?? []) {
      const packet = await readJson(resolve(packsDir, packId, "quick-cases", `${quickCaseId}.json`));
      assert(packet.id === quickCaseId, `${packId} quick case ${quickCaseId} id must match filename`);
      quickCases[manifest.id][quickCaseId] = packet;
    }
  }
  return { contentPacks: packs, contentCases: cases, contentQuickCases: quickCases };
}

function validateStatementReplayCase(packet) {
  const replayScenes = (packet.sceneVersions ?? []).filter((scene) => scene.interactionMode === "lineReplay");
  if (!replayScenes.length) return;
  assert(Number.isInteger(packet.statementPatience?.["night-a"]) && packet.statementPatience["night-a"] > 0, `${packet.caseId} line replay needs a night-a patience budget`);
  assert(Number.isInteger(packet.statementPatience?.["night-b"]) && packet.statementPatience["night-b"] > 0, `${packet.caseId} line replay needs a night-b patience budget`);
  const stages = statementStagesForBrief(packet);
  const playableIndexes = [...new Set([
    ...(packet.nightStructure?.segment1SceneIndexes ?? []),
    ...(packet.nightStructure?.segment2SceneIndexes ?? [])
  ].map(Number))];
  const playableReplayIndexes = playableIndexes
    .filter((sceneIndex) => packet.sceneVersions?.[sceneIndex]?.interactionMode === "lineReplay")
    .sort((left, right) => left - right);
  const stagedIndexes = stages.flatMap((stage) => stage.sceneIndexes).sort((left, right) => left - right);
  assert(JSON.stringify(stagedIndexes) === JSON.stringify(playableReplayIndexes), `${packet.caseId} statement stages must cover every playable line replay exactly once`);
  for (const stage of stages) {
    assert(stage.minimumReviewCount >= 2, `${packet.caseId} statement stage ${stage.id} must require at least two replay actions`);
    const possibleReviewCount = stage.sceneIndexes.reduce((total, sceneIndex) => {
      const scene = packet.sceneVersions?.[sceneIndex] ?? {};
      return total + 1 + (scene.casualQuestions ?? []).length;
    }, 0);
    assert(stage.minimumReviewCount <= possibleReviewCount, `${packet.caseId} statement stage ${stage.id} requires more replay actions than it exposes`);
    const stageNightKeys = new Set(stage.sceneIndexes.map((sceneIndex) => (
      (packet.nightStructure?.segment1SceneIndexes ?? []).includes(sceneIndex) ? "night-a" : "night-b"
    )));
    assert(stageNightKeys.size === 1, `${packet.caseId} statement stage ${stage.id} must not cross the night break`);
  }
  for (const scene of replayScenes) {
    const loadBearingOptions = (scene.questionOptions ?? []).filter((option) => option.correct === true || option.contradiction);
    assert(loadBearingOptions.length, `${packet.caseId} scene ${scene.id} line replay needs at least one load-bearing question`);
    for (const option of loadBearingOptions) {
      assert(option.sourceAnchor, `${packet.caseId} scene ${scene.id} load-bearing question needs sourceAnchor`);
      assertUniqueStatementAnchor(scene.version, option.sourceAnchor, `${packet.caseId} scene ${scene.id} sourceAnchor`);
      if (scene.revisedVersion) {
        const revisedSourceAnchor = option.revisedSourceAnchor ?? option.sourceAnchor;
        assertUniqueStatementAnchor(scene.revisedVersion, revisedSourceAnchor, `${packet.caseId} scene ${scene.id} revised sourceAnchor`);
      }
    }
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadAdvisors() {
  const registry = await readJson(advisorsPath).catch(() => ({ advisors: [] }));
  const advisors = {};
  for (const advisor of registry.advisors ?? []) {
    assert(advisor.id, "advisor id is required");
    advisors[advisor.id] = advisor;
  }
  return advisors;
}

async function loadHelperNpcs() {
  const registry = await readJson(helperNpcsPath).catch(() => ({ helpers: [] }));
  const helpers = {};
  for (const helper of registry.helpers ?? []) {
    assert(helper.id, "helper NPC id is required");
    assert(helper.name, `${helper.id} helper NPC name is required`);
    helpers[helper.id] = helper;
  }
  return helpers;
}

async function loadCast() {
  const registry = await readJson(castPath).catch(() => ({ cast: [] }));
  const cast = {};
  for (const profile of registry.cast ?? []) {
    assert(profile.id, "cast profile id is required");
    assert(profile.name, `${profile.id} cast profile name is required`);
    assert(!cast[profile.id], `duplicate cast profile id: ${profile.id}`);
    cast[profile.id] = profile;
  }
  return cast;
}

function runtimeIndexCase(packet, manifestItem) {
  assert(packet.caseId === manifestItem.caseId, `${manifestItem.caseId} caseId must match manifest sequence`);
  assert(packet.plotId === manifestItem.plotId, `${manifestItem.caseId} plotId must match manifest sequence`);
  if (packet.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded) {
    for (const field of RUNTIME_CASE_REQUIRED_FIELDS) {
      assert(packet[field] !== undefined, `${packet.caseId} runtime-loaded content is missing ${field}`);
    }
    return RUNTIME_CASE_CONTENT_FIELDS.reduce((next, field) => {
      if (packet[field] !== undefined) next[field] = packet[field];
      return next;
    }, runtimeCaseContentSummary(packet));
  }
  assert(packet.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.metadataOnly, `${packet.caseId} must use a known runtimeContentStatus`);
  for (const field of RUNTIME_CASE_REQUIRED_FIELDS) {
    assert(packet[field] === undefined, `${packet.caseId} is metadata-only but includes runtime field ${field}`);
  }
  return runtimeCaseContentSummary(packet);
}

function validateQuickCase(packet, cast) {
  const turns = packet.turns ?? [];
  const issueOptions = packet.issueOptions ?? [];
  const confrontations = packet.confrontations ?? [];
  const disclosureRounds = packet.disclosureRounds ?? [];
  const turnIds = new Set(turns.map((turn) => turn.id));
  const issueIds = new Set(issueOptions.map((item) => item.id));
  const confrontationIds = new Set(confrontations.map((item) => item.id));
  const soloCommentary = packet.format === "solo-commentary";
  assert(packet.id, "quick case id is required");
  assert(packet.title, `${packet.id} quick case title is required`);
  assert(["explanation", "interest"].includes(packet.helpRequest?.kind), `${packet.id} quick case needs an explanation or interest help request`);
  assert(packet.helpRequest?.request, `${packet.id} quick case help request text is required`);
  assert(packet.whyTonight && packet.selfServingOmission, `${packet.id} quick case must register urgency and its major omission`);
  if (!soloCommentary) {
    assert(packet.callerStake, `${packet.id} caller-driven quick case must register caller stake`);
    assert(packet.coverStrategy?.publicImage, `${packet.id} quick case must define the caller's believable public image`);
    assert((packet.coverStrategy?.honestDetails ?? []).length >= 3, `${packet.id} quick case needs at least three ordinary or honest cover details`);
    assert((packet.coverStrategy?.layeredLeaks ?? []).length >= confrontations.length, `${packet.id} quick case must hide each confrontation behind a layered leak`);
  }
  assert(packet.presentation?.backgroundSrc, `${packet.id} quick case must define a live-room background`);
  assert(packet.presentation?.host?.artSrc, `${packet.id} quick case must define host portrait art`);
  if (soloCommentary) {
    assert(packet.presentation?.source?.name, `${packet.id} solo commentary must name its on-screen source`);
  } else {
    assert(packet.presentation?.caller?.artSrc, `${packet.id} quick case must define caller portrait art`);
  }
  assert(packet.presentation?.artStyle === "pixel", `${packet.id} quick case portraits must use the approved pixel-art direction`);
  assert(cast[packet.castProfileId], `${packet.id} references unknown cast profile ${packet.castProfileId}`);
  assert(turns.length >= 6, `${packet.id} needs at least six question-answer turns`);
  assert(turns.every((turn) => !(turn.ambientComments ?? []).length), `${packet.id} raw transcript turns must not coach the player with ambient comments`);
  assert(turnIds.size === turns.length, `${packet.id} turn ids must be unique`);
  assert(confrontations.length >= 3, `${packet.id} needs at least three direct confrontations`);
  assert(confrontationIds.size === confrontations.length, `${packet.id} confrontation ids must be unique`);
  assert(disclosureRounds.length >= 2, `${packet.id} needs at least two statement rounds`);
  for (const round of disclosureRounds) {
    const roundTurns = turns.filter((turn) => (round.turnIds ?? []).includes(turn.id));
    const callerStatement = roundTurns
      .map((turn) => turn.source ?? turn.caller)
      .filter(Boolean)
      .join("\n");
    assert((round.turnIds ?? []).length && roundTurns.length === round.turnIds.length, `${packet.id} round ${round.id} references unknown turns`);
    assert(Number.isInteger(round.patience) && round.patience > 0, `${packet.id} round ${round.id} needs a positive patience budget`);
    assert([undefined, "all", "any"].includes(round.completionMode), `${packet.id} round ${round.id} has an invalid completion mode`);
    if (soloCommentary) assert(round.completionMode === "any", `${packet.id} solo commentary round ${round.id} must let one valid angle advance`);
    assert(callerStatement, `${packet.id} round ${round.id} needs a caller statement`);
    for (const issueId of round.issueOptionIds ?? []) {
      const issue = issueOptions.find((item) => item.id === issueId);
      assert(issue, `${packet.id} round ${round.id} references unknown issue ${issueId}`);
      assert(issue.sourceAnchor, `${packet.id} issue ${issueId} needs sourceAnchor`);
      assertUniqueStatementAnchor(callerStatement, issue.sourceAnchor, `${packet.id} issue ${issueId} sourceAnchor`);
    }
  }
  assert(
    soloCommentary ? issueOptions.length >= confrontations.length : issueOptions.length > confrontations.length,
    `${packet.id} needs enough issue choices for its confrontation structure`
  );
  assert(issueIds.size === issueOptions.length, `${packet.id} issue option ids must be unique`);
  assert(issueOptions.every((item) => item.id && item.label && item.sourceAnchor), `${packet.id} issue options need ids, labels, and source-line anchors`);
  assert(confrontations.every((confrontation) => issueOptions.some((item) => item.confrontationId === confrontation.id)), `${packet.id} must expose at least one issue direction for every confrontation`);
  assert(issueOptions.filter((item) => !item.confrontationId).every((item) => item.missLine === undefined), `${packet.id} non-contradiction issue choices must not carry answer-explaining retry copy`);
  for (const issue of issueOptions) {
    if (issue.confrontationId) assert(confrontationIds.has(issue.confrontationId), `${packet.id} issue ${issue.id} references unknown confrontation ${issue.confrontationId}`);
  }
  assert(packet.quoteOptions === undefined && packet.playerMarkLimit === undefined && packet.requiredFlawCount === undefined, `${packet.id} must not restore retired crowd-assist scoring fields`);
  assert(packet.ending?.confirmed?.length && packet.ending?.unknown?.length, `${packet.id} ending must separate confirmed and unknown`);
  assert(packet.ending?.verdictKicker && packet.ending?.confirmedTitle && packet.ending?.unknownTitle, `${packet.id} ending must separate risk action from unresolved background`);
  assert(packet.ending?.riskReading?.title && packet.ending?.riskReading?.text, `${packet.id} ending must label its strongest risk reading`);
  assert((packet.ending?.summaryPages ?? []).length >= 1, `${packet.id} ending must be spoken by the host`);
  for (const [index, page] of (packet.ending?.summaryPages ?? []).entries()) {
    assert((page.lines ?? []).length, `${packet.id} ending summary page ${index + 1} needs spoken lines`);
    assert((page.lines ?? []).every((line) => ["host", "caller"].includes(line.role) && line.text), `${packet.id} ending summary page ${index + 1} has an invalid spoken line`);
    assert((page.lines ?? []).some((line) => line.role === "host"), `${packet.id} ending summary page ${index + 1} must let the host speak`);
  }
  const recapPage = (packet.ending?.summaryPages ?? []).find((page) => page.stageLabel === "结案复盘");
  assert(recapPage, `${packet.id} quick case must include a separate recap page after the call ends`);
  assert(
    recapPage.lines?.[0]?.role === "host" && (soloCommentary ? /(看完了|读完了|长文)/.test(recapPage.lines[0].text) : /(电话挂了|收麦了)/.test(recapPage.lines[0].text)),
    `${packet.id} recap page must open with a spoken handoff`
  );
  assert(!recapPage.lines[0].text.includes("我们来把这次这个连线复个盘"), `${packet.id} recap page must not restore the shared recap template`);
  assert(packet.sourceBoundary, `${packet.id} must record its adaptation boundary`);
  for (const confrontation of confrontations) {
    const lines = quickConfrontationLines(confrontation);
    assert(confrontation.id && lines.length >= 2, `${packet.id} confrontation needs an id and at least two spoken lines`);
    assert(lines.every((line) => ["host", "caller"].includes(line.role) && line.text), `${packet.id} confrontation ${confrontation.id} has an invalid spoken line`);
    if (soloCommentary) {
      assert(lines.every((line) => line.role === "host"), `${packet.id} solo commentary ${confrontation.id} must remain host-only`);
    } else {
      assert(lines[0]?.role === "host" && lines.some((line) => line.role === "caller"), `${packet.id} confrontation ${confrontation.id} must begin with the host and include the caller`);
      assert(lines.every((line, index) => index === 0 || line.role !== lines[index - 1].role), `${packet.id} confrontation ${confrontation.id} must alternate speakers`);
    }
    assert((confrontation.basisTurnIds ?? []).length >= 2, `${packet.id} confrontation ${confrontation.id} needs at least two line anchors`);
    for (const turnId of confrontation.basisTurnIds ?? []) {
      assert(turnIds.has(turnId), `${packet.id} confrontation ${confrontation.id} references unknown turn ${turnId}`);
    }
  }
}

function assertUniqueStatementAnchor(statement = "", anchor = "", label = "sourceAnchor") {
  const matches = statementLinesFromText(statement).filter((line) => line.text.includes(String(anchor ?? "")));
  assert(matches.length === 1, `${label} must match exactly one replay sentence (matched ${matches.length})`);
  return matches[0];
}

function quickConfrontationLines(confrontation = {}) {
  if (Array.isArray(confrontation.lines) && confrontation.lines.length) return confrontation.lines;
  return [
    confrontation.host ? { role: "host", text: confrontation.host } : null,
    confrontation.caller ? { role: "caller", text: confrontation.caller } : null
  ].filter(Boolean);
}

function renderContentIndex(packs, cases, quickCases, advisors, helperNpcs, cast) {
  const defaultKey = packs["steam-demo-01"] ? "steam-demo-01" : Object.keys(packs)[0];
  assert(defaultKey, "at least one content pack manifest is required");
  return `// Generated by scripts/build-content-index.js. Do not edit by hand.
export const DEFAULT_CONTENT_PACK_KEY = ${JSON.stringify(defaultKey)};

export const CONTENT_ADVISORS = ${JSON.stringify(advisors, null, 2)};

export const CONTENT_HELPER_NPCS = ${JSON.stringify(helperNpcs, null, 2)};

export const CONTENT_CAST = ${JSON.stringify(cast, null, 2)};

export const CONTENT_PACKS = ${JSON.stringify(packs, null, 2)};

export const CONTENT_CASES = ${JSON.stringify(cases, null, 2)};

export const CONTENT_QUICK_CASES = ${JSON.stringify(quickCases, null, 2)};
`;
}

function stripManualCacheTokens(source) {
  return source.replace(/\?v=\d+(?:\.\d+)+/g, "");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
