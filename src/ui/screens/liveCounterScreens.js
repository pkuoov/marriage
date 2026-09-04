import { liveSceneForCurrentSegment } from "../../runtime/nightOvernightModel.js";

export function createLiveCounterScreens(ctx) {
  const {
    consumePixelTransition,
    caseKey,
    liveCounterBeatAfterScene,
    liveCounterBeatBeforeScene,
    liveCounterBeatById,
    pressureSignalForLiveCounterChoice,
    nextPlayableSceneIndex,
    overnightStructureFor,
    liveCounterBeatHtml,
    saveState,
    render,
    renderSceneReview,
    frame,
    bind,
    bindSceneButtons,
    liveCounterPickKey,
    liveCounterPickForState,
    currentIndex,
    markAction,
    actionDone,
    ensureNight,
    ensureOvernight,
    recordRouteChoice,
    setIndexValue,
    sceneAfterEvidenceFor
  } = ctx;

  function renderLiveCounterBeat(brief) {
    const state = ctx.getState();
    const beat = liveCounterBeatById(brief, state.activeLiveCounterBeatId)
      ?? liveCounterBeatBeforeScene(
        brief,
        currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
        (key) => actionDone(brief, key),
        ensureOvernight(brief)
      )
      ?? liveCounterBeatAfterScene(
        brief,
        currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
        (key) => actionDone(brief, key),
        ensureOvernight(brief)
      );
    if (!beat) {
      state.activeLiveCounterBeatId = null;
      state.scene = liveSceneForCurrentSegment(brief, {
        night: ensureNight(brief),
        overnight: ensureOvernight(brief)
      });
      saveState();
      return renderSceneReview(brief);
    }
    const pick = liveCounterPickForState(brief, beat.id);
    const requiresChoice = (beat.choices ?? []).length > 0;
    const transitionKey = `${caseKey(brief)}:live-counter:${beat.id}:reveal`;
    const pixelTransition = beat.revealTransition?.id && consumePixelTransition?.(transitionKey)
      ? { ...beat.revealTransition, kind: "reveal", evidenceArtSrc: brief.evidenceBoard ?? beat.revealTransition.evidenceArtSrc ?? "" }
      : null;
    frame({
      brief,
      mood: "tense",
      label: "现场反压",
      chapter: "第二夜",
      text: liveCounterBeatHtml(beat, pick),
      pixelTransition,
      choices: (!requiresChoice || pick)
        ? flowGroupHtml(`<button class="primary" data-continue-live-counter type="button">继续追问</button>`)
        : ""
    });
    bind("[data-live-counter-choice]", (event) => {
      recordLiveCounterChoice(brief, beat, event.currentTarget?.getAttribute("data-live-counter-choice") ?? "");
    });
    bind("[data-continue-live-counter]", () => continueAfterLiveCounterBeat(brief, beat));
    bindSceneButtons();
  }

  function enterLiveCounterBeatBeforeScene(brief = {}, sceneIndex = 0) {
    const state = ctx.getState();
    const beat = liveCounterBeatBeforeScene(
      brief,
      sceneIndex,
      (key) => actionDone(brief, key),
      ensureOvernight(brief)
    );
    if (!beat) return false;
    state.activeLiveCounterBeatId = beat.id;
    state.scene = "liveCounterBeat";
    saveState();
    renderLiveCounterBeat(brief);
    return true;
  }

  function enterLiveCounterBeatAfterScene(brief = {}, sceneIndex = 0) {
    const state = ctx.getState();
    const beat = liveCounterBeatAfterScene(brief, sceneIndex, (key) => actionDone(brief, key), ensureOvernight(brief));
    if (!beat) return false;
    state.activeLiveCounterBeatId = beat.id;
    state.scene = "liveCounterBeat";
    saveState();
    render();
    return true;
  }

  function recordLiveCounterChoice(brief = {}, beat = {}, choiceId = "") {
    const state = ctx.getState();
    const choice = (beat.choices ?? []).find((item) => item.id === choiceId) ?? null;
    if (!choice) return;
    const pressureSignal = pressureSignalForLiveCounterChoice(choice, state.lastPressureSignal ?? "");
    state.liveCounterPicks = {
      ...(state.liveCounterPicks ?? {}),
      [liveCounterPickKey(brief, beat.id)]: {
        choiceId: choice.id,
        label: choice.label ?? "",
        recapAftertaste: choice.recapAftertaste ?? "",
        stanceNudge: choice.stanceNudge ?? null,
        pressureSignal,
        routeTone: choice.routeTone ?? "live-counter",
        endingImpact: choice.endingImpact ?? null,
        at: Date.now()
      }
    };
    state.lastPressureSignal = pressureSignal || null;
    state.pendingQuestionPressureSignal = pressureSignal || null;
    state.pendingQuestionPressureSource = pressureSignal ? `${caseKey(brief)}:liveCounter:${beat.id}` : null;
    state.lastPressureAxis = choice.routeAxis ?? "caller-credibility";
    const anchorIndex = Number(beat.beforeSceneIndex ?? beat.afterSceneIndex ?? 0);
    recordRouteChoice(brief, anchorIndex + (beat.beforeSceneIndex === undefined ? 0.5 : -0.5), {
      question: beat.text ?? beat.from ?? "现场反压",
      answer: choice.label ?? "",
      routeAxis: choice.routeAxis ?? "caller-credibility",
      routeTone: choice.routeTone ?? "live-counter",
      stanceNudge: choice.stanceNudge ?? null
    }, { version: beat.from ?? "现场反压" });
    state.lastReaction = choice.recapAftertaste ?? "";
    saveState();
    render();
  }

  function continueAfterLiveCounterBeat(brief = {}, beat = {}) {
    const state = ctx.getState();
    if ((beat.choices ?? []).length && !liveCounterPickForState(brief, beat.id)) return;
    markAction(brief, `liveCounterBeat:${beat.id}`);
    state.activeLiveCounterBeatId = null;
    if (beat.beforeSceneIndex !== undefined) {
      state.scene = overnightStructureFor(brief)
        ? ensureOvernight(brief).segment === "night2" ? "overnightNight2" : "overnightNight1"
        : "sceneReview";
      saveState();
      render();
      return;
    }
    const nextBeat = liveCounterBeatAfterScene(brief, beat.afterSceneIndex, (key) => actionDone(brief, key), ensureOvernight(brief));
    if (nextBeat) {
      state.activeLiveCounterBeatId = nextBeat.id;
      state.scene = "liveCounterBeat";
      saveState();
      render();
      return;
    }
    const nextSceneIndex = nextPlayableSceneIndex(brief, Number(beat.afterSceneIndex ?? 0));
    if (nextSceneIndex >= 0) {
      setIndexValue(brief, "sceneReview", nextSceneIndex);
      state.scene = liveSceneForCurrentSegment(brief, {
        night: ensureNight(brief),
        overnight: ensureOvernight(brief)
      });
    } else {
      state.scene = sceneAfterEvidenceFor(brief);
    }
    saveState();
    render();
  }

  return {
    renderLiveCounterBeat,
    enterLiveCounterBeatBeforeScene,
    enterLiveCounterBeatAfterScene
  };
}
