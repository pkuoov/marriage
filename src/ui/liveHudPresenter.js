import { CHARACTER_ART } from "../state.js";
import { NPCS } from "../story.js";
import { normalizePlayerName } from "../playerIdentity.js";
import { contradictionsForState, selectedEvidencePickForState } from "../runtime/caseStateSelectors.js";
import { livePressureProfile } from "../runtime/livePressure.js";
import { caseKey, evidenceChecksFor, playableSceneCount } from "../runtime/sceneAdvance.js";
import {
  DEFAULT_HOST_ART_VARIANTS,
  audiencePatienceHudHtml,
  callerArtForExpression,
  callerExpressionForView,
  caseProgressStripHtml,
  hostSpeakingStateForView,
  liveCommentStripHtml,
  portraitLayerHtml,
  storyPackSummaryHudHtml
} from "./liveCallView.js";

export function createLiveHudPresenter(ctx) {
  const {
    getState,
    isStoryPackMode,
    ensureBudget,
    ensureNight,
    currentIndex,
    isSceneReviewScene
  } = ctx;

  function currentLivePressure(brief, mood = "listening") {
    const state = getState();
    const sceneHint = currentScenePressureHint(brief);
    const pressure = livePressureProfile({
      budget: ensureBudget(brief),
      foundCount: contradictionsForState(state, brief).length,
      intentHook: liveIntentHookFor(brief),
      pressureSignal: state.lastPressureSignal ?? "",
      routeAxis: state.lastPressureAxis ?? "",
      routeAxisComments: brief.routeAxisComments ?? {},
      driftComments: brief.driftComments ?? [],
      scene: state.scene,
      sceneHint,
      mood
    });
    return withMaterialPityLine(withCrossCaseEchoes(pressure, brief), brief);
  }

  function withCrossCaseEchoes(pressure = {}, brief = {}) {
    const echo = eligibleCrossCaseEcho(brief);
    const comments = Array.isArray(pressure.comments) ? [...pressure.comments] : [];
    if (!echo || comments.length === 0) return pressure;
    comments[stableEchoIndex(`${brief.id}:${echo.requiresCaseId}:${echo.text}`, comments.length)] = echo.text;
    return { ...pressure, comments, flashback: echo };
  }

  function eligibleCrossCaseEcho(brief = {}) {
    const state = getState();
    if (!isStoryPackMode()) return null;
    const echoes = Array.isArray(brief.crossCaseEchoes) ? brief.crossCaseEchoes : [];
    if (!echoes.length) return null;
    const solvedContentCaseIds = new Set((state.caseBriefs ?? [])
      .filter((item) => (state.solvedCaseIds ?? []).includes(item.id))
      .map((item) => item.runtimeContentCaseId ?? item.caseId)
      .filter(Boolean));
    const inventory = new Set(Object.values(state.caseNights ?? {}).flatMap((night) => night?.inventory ?? []));
    return echoes.find((echo) =>
      solvedContentCaseIds.has(echo.requiresCaseId) &&
      (!echo.requiresInventoryId || inventory.has(echo.requiresInventoryId))
    ) ?? null;
  }

  function withMaterialPityLine(pressure = {}, brief = {}) {
    const pity = activeMaterialPityLine(pressure, brief);
    const comments = Array.isArray(pressure.comments) ? [...pressure.comments] : [];
    if (!pity || comments.length === 0) return pressure;
    comments[Math.min(1, comments.length - 1)] = pity.text;
    return { ...pressure, comments, pityKey: pity.key };
  }

  function activeMaterialPityLine(pressure = {}, brief = {}) {
    const state = getState();
    const pending = state.lastPityLine;
    if (pending?.key && pending?.text && !state.materialPityLog?.[pending.key]) return pending;
    if (state.scene !== "evidenceCheck" || pressure.level !== "low") return null;
    const checkIndex = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
    if (selectedEvidencePickForState(state, brief, checkIndex)) return null;
    const check = evidenceChecksFor(brief)[checkIndex] ?? {};
    return materialPityLineFor(brief, check, checkIndex);
  }

  function materialPityLineFor(brief = {}, check = {}, checkIndex = 0, outcome = null) {
    const state = getState();
    if (outcome?.correct) return null;
    const driftComments = Array.isArray(brief.driftComments) ? brief.driftComments.filter(Boolean) : [];
    const text = outcome
      ? driftComments[checkIndex % Math.max(1, driftComments.length)] ?? check.pityLine
      : check.pityLine;
    if (!text) return null;
    const key = `${caseKey(brief)}:evidence:${checkIndex}`;
    if (state.materialPityLog?.[key]) return null;
    return { key, text };
  }

  function caseProgressStrip(brief) {
    if (!brief) return "";
    const state = getState();
    return caseProgressStripHtml({
      total: playableSceneCount(brief),
      answered: ctx.answeredSceneCountForState(state, brief),
      label: isStoryPackMode() ? "匿名来电" : brief.label ?? "连线中"
    });
  }

  function audiencePatienceHud(pressure = {}) {
    return audiencePatienceHudHtml(pressure);
  }

  function storyPackSummaryHud() {
    const state = getState();
    const total = state.caseBriefs?.length || 1;
    const solved = state.caseBriefs?.filter((brief) => state.solvedCaseIds?.includes(brief.id)).length ?? total;
    return storyPackSummaryHudHtml({ total, solved });
  }

  function liveCommentStrip(pressure = {}) {
    return liveCommentStripHtml(pressure);
  }

  function liveIntentHookFor(brief) {
    return currentScenePressureHint(brief).intentHook ?? "话太顺了";
  }

  function hostPortraitLayer() {
    return portraitLayerHtml({
      callerVisible: false,
      mood: "focused",
      hostName: normalizePlayerName(getState().playerName)
    });
  }

  function portraitLayer(brief, mood = "listening", pressure = null, controlMode = "") {
    const state = getState();
    const npc = NPCS.find((item) => item.id === brief.complainantId) ?? NPCS[0];
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const expression = callerExpressionFor(brief, mood, pressure);
    const art = casePortraitArt(brief, npc, expression);
    const respondentJoined = (ensureNight(brief).interludeActionsDone ?? []).includes("profile-gift-mic-request");
    return portraitLayerHtml({
      artSrc: art.src,
      fallbackSrc: art.fallbackSrc,
      artStyle: brief.callerArtStyle,
      hostName: normalizePlayerName(state.playerName),
      hostArtVariants: DEFAULT_HOST_ART_VARIANTS,
      hostSpeakingState: hostSpeakingStateForCurrentScene(mood, controlMode),
      respondentArtSrc: respondentJoined ? brief.respondentArtVariants?.neutral ?? brief.respondentArt ?? "" : "",
      respondentFallbackSrc: brief.respondentArt ?? "",
      respondentArtVariants: respondentJoined ? brief.respondentArtVariants ?? {} : {},
      mood,
      expression,
      sceneIndex
    });
  }

  function hostSpeakingStateForCurrentScene(mood = "listening", controlMode = "") {
    return hostSpeakingStateForView({ scene: getState().scene, mood, controlMode });
  }

  function casePortraitArt(brief, npc, expression = {}) {
    const neutralArt = brief.callerArtVariants?.neutral ?? brief.callerArt ?? CHARACTER_ART[npc.id] ?? "";
    return callerArtForExpression({
      neutralSrc: neutralArt,
      variants: brief.callerArtVariants,
      variantPlan: brief.callerArtVariantPlan,
      expression
    });
  }

  function callerExpressionFor(brief, mood = "listening", pressureOverride = null) {
    const state = getState();
    const pressure = pressureOverride ?? currentLivePressure(brief, mood);
    const budget = Number.isFinite(Number(pressure?.remaining)) ? pressure : ensureBudget(brief);
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    return callerExpressionForView({ pressure, budget, scene: state.scene, sceneIndex, mood });
  }

  function currentScenePressureHint(brief) {
    const state = getState();
    const keepsScenePressure = isSceneReviewScene(state.scene)
      || ["sceneLineReplay", "stanceSnapshot", "afterSceneEvidence"].includes(state.scene);
    if (!keepsScenePressure) return {};
    const scenes = brief?.sceneVersions ?? [];
    const index = currentIndex(brief, "sceneReview", scenes.length || 1);
    return scenes[index]?.pressureHint ?? {};
  }

  function liveSceneClass(brief, mood = "listening", pressureOverride = null) {
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const pressure = pressureOverride ?? currentLivePressure(brief, mood);
    const expression = pressure.expression?.kind ?? "blink";
    return `scene-beat-${sceneIndex % 4} scene-expression-${expression} scene-guard-${pressure.callerGuard ?? "listening"}`;
  }

  function reactionLine() {
    const text = getState().lastReaction;
    if (!text) return "";
    return `<p class="reaction">${escapeLiveHudHtml(text)}</p>`;
  }

  return {
    audiencePatienceHud,
    caseProgressStrip,
    currentLivePressure,
    escapeHtml: escapeLiveHudHtml,
    hostPortraitLayer,
    liveCommentStrip,
    liveSceneClass,
    materialPityLineFor,
    portraitLayer,
    reactionLine,
    storyPackSummaryHud
  };
}

function stableEchoIndex(seed = "", length = 1) {
  const safeLength = Math.max(1, Number(length ?? 1));
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % safeLength;
}

function escapeLiveHudHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
