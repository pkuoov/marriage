import { answeredSceneCountForState, selectedScenePicksForState, unlockedInvestigationEntriesForState } from "../runtime/caseStateSelectors.js";
import { dailyConclusionModel } from "../runtime/recapModel.js";
import { canRewindQuestion } from "../runtime/questionRewind.js";
import { afterEvidenceScene, answerKey, callbackOpenerById, caseKey, delegationFor, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, liveCounterBeatById, liveCounterBeatsFor, nightStructureFor, overnightCallerQuestionFor, overnightStructureFor, pendingEvidenceChecksFor, playableSceneCount } from "../runtime/sceneAdvance.js";
import { isPrivateConsultation } from "../runtime/consultationModel.js";
import { storyInterludeCaseId } from "../runtime/storyInterludeModel.js";
import { normalizePlayerName, personalizeHostHtml } from "../playerIdentity.js";
import { mountDialoguePresentation } from "../runtime/dialoguePresentation.js";
import { storyKeyFromUrl } from "../runtime/urlMode.js";
import { storyPackForKey } from "../storyPacks.js";
import { currentLiveCounterPick } from "../runtime/liveCounterModel.js";
import { unlockedMaterialProfile } from "../runtime/materialVisibility.js";
import { getAudioSettings, playAudioCueOnce, playDialogueBlip } from "../sound.js";
import { bindAudioControls, syncSceneAudio } from "./audioController.js";
import { avgSystemBarHtml, mountCourtRecord } from "./courtRecordView.js";
import { liveControlDeckHtml, liveFrameHtml } from "./liveFrameView.js";

export function createLiveChrome(bound) {
  const {
    app,
    PRODUCT_NAME,
    saveState,
    render,
    returnToTitle,
    resetToTitle,
    activeCaseBrief,
    isStoryPackMode,
    commit,
    bind,
    queueDefaultFocus,
    isVisibleElement,
    focusButton,
    ensureNight,
    ensureOvernight,
    actionDone,
    accusationReadinessForBrief,
    issueCompletion,
    normalizedDailyResult,
    resetViewportScroll,
    currentLivePressure,
    liveCommentStrip,
    liveSceneClass,
    portraitLayer,
    reactionLine,
    storyPackSummaryHud
  } = bound;

  function liveChapterTitle(brief = {}) {
    if (!isStoryPackMode()) return brief.storyArcTitle ?? "今日来电";
    const dates = brief.nightStructure?.sessionDates;
    if (!Array.isArray(dates) || dates.length !== 2) return "热线连线";
    const key = caseKey(brief);
    const returning = bound.getState().caseOvernights?.[key]?.segment === "night2"
      || bound.getState().caseNights?.[key]?.segment === "segment2";
    const [, month, day] = dates[returning ? 1 : 0].split("-");
    return `${Number(month)} 月 ${Number(day)} 日 · ${returning ? (isPrivateConsultation(brief, bound.getState()) ? "单独咨询" : "回拨") : "初次连线"}`;
  }

  function nightShellForStoryKey(storyKey = "") {
    return storyPackForKey(storyKey)?.nightShell ?? null;
  }

  function nightShellForBrief(brief = {}) {
    if (!isStoryPackMode()) return null;
    return nightShellForStoryKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl());
  }

  function nightShellInterludeForBrief(brief = {}) {
    const pack = storyPackForKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl());
    const caseId = storyInterludeCaseId(pack, brief);
    return (pack?.nightShell?.interludes ?? []).find((item) => item.afterCaseId === caseId) ?? null;
  }

  function nightShellGoodEnding() {
    const briefs = bound.getState().caseBriefs ?? [];
    const results = briefs.map((brief) => normalizedDailyResult(brief));
    const finished = results.filter((result) => result.accused);
    if (!finished.length) return false;
    const average = finished.reduce((sum, result) => sum + Number(result.issuePercent ?? 0), 0) / finished.length;
    return average >= 60;
  }

  function nightShellEndingKey() {
    const paidPlatformCost = Object.values(bound.getState().liveCounterPicks ?? {})
      .some((pick) => pick?.endingImpact === "platform-data-loss");
    if (paidPlatformCost) return "platformCost";
    return nightShellGoodEnding() ? "good" : "bad";
  }

  function sceneWithShownCard(brief = {}, scene = {}) {
    if (!scene?.showsCard) return scene;
    const shownCard = (brief.evidenceCards ?? []).find((card) => card.id === scene.showsCard);
    return shownCard ? { ...scene, shownCard } : scene;
  }

  function sceneWithCallbackRevision(brief = {}, scene = {}, sceneIndex = 0) {
    let revisionUnlocked = false;
    if (nightStructureFor(brief)) {
      const opener = callbackOpenerById(brief, ensureNight(brief).callbackOpenerId);
      revisionUnlocked = Boolean(opener?.appliesRevisedOnScenes?.includes(sceneIndex));
    }
    if (scene.revisedVersionTriggers) {
      revisionUnlocked = revisionUnlocked || sceneRevisionUnlocked(brief, scene.revisedVersionTriggers);
    }
    let next = revisionUnlocked && scene?.revisedVersion
      ? {
          ...scene,
          version: scene.revisedVersion,
          questionOptions: (scene.questionOptions ?? []).map((option) => ({
            ...option,
            sourceAnchor: option.revisedSourceAnchor ?? option.sourceAnchor,
            question: option.revisedQuestion ?? option.question
          }))
        }
      : scene;
    if (!revisionUnlocked && scene.revisedVersionTriggers) {
      next = {
        ...next,
        questionOptions: (next.questionOptions ?? []).map((option) => (
          option.answerRequiresRevisedVersion && option.guardedAnswer
            ? { ...option, answer: option.guardedAnswer, forcedGuardedAnswer: true }
            : option
        ))
      };
    }
    return sceneWithLiveCounterQuestionOverride(brief, next);
  }

  function sceneRevisionUnlocked(brief = {}, triggers = {}) {
    const overnight = ensureOvernight(brief);
    const documentHit = (triggers.documentRows ?? []).some((entry) => {
      const splitAt = String(entry).lastIndexOf(":");
      if (splitAt < 0) return false;
      const documentId = String(entry).slice(0, splitAt);
      const rowId = String(entry).slice(splitAt + 1);
      return (overnight.documentMarks?.[documentId] ?? []).includes(rowId);
    });
    const openerHit = (triggers.callbackOpeners ?? []).includes(overnight.callbackOpenerId);
    return documentHit || openerHit;
  }

  function sceneWithLiveCounterQuestionOverride(brief = {}, scene = {}) {
    const override = liveCounterBeatsFor(brief).flatMap((beat) => {
      const pick = liveCounterPickForState(brief, beat.id);
      const choice = (beat.choices ?? []).find((item) => item.id === pick?.choiceId);
      return choice?.questionOverride ? [choice.questionOverride] : [];
    }).find((item) => item.sceneId === scene.id);
    if (!override) return scene;
    return {
      ...scene,
      questionOptions: (scene.questionOptions ?? []).map((option, optionIndex) => (
        optionIndex === Number(override.optionIndex ?? 0)
          ? { ...option, question: override.question }
          : option
      ))
    };
  }

  function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true, visualHud: visualHudOverride, screenClass = "", backdropClass: backdropClassOverride = "", audioEnterCueId = "", keepVoiceCueId = "", pixelTransition: pixelTransitionOverride = undefined, pressureOverride = null, controlMode = "listen", musicPhase = "" }) {
    const privateConsultation = isPrivateConsultation(brief, bound.getState());
    const chapterLabel = String(chapter || label || (showCaseHud ? "连线中" : "故事过场")).replace(/^第\s*\d+\s*案\s*·?\s*/, "");
    const storyLabel = bound.getState().scene === "cafePrologueForensic" ? "尾声 · 私下回告"
      : bound.getState().scene === "cafePrologue" ? "序章 · 咖啡厅"
      : bound.getState().scene === "cafePrologueAftermath" ? "序章 · 咖啡厅散场后"
      : bound.getState().scene === "nightShellEpilogue" ? "尾声 · 旧案来信"
      : bound.getState().scene === "runComplete" ? "试玩片尾"
      : bound.getState().scene === "storyInterlude" ? chapterLabel
      : `第 ${Math.max(1, Number(bound.getState().chapter) || 1)} 案 · ${chapterLabel}`;
    const modeLabel = isStoryPackMode() ? storyLabel : "今日来电";
    const backdropClass = backdropClassOverride || caseBackdropClass(brief);
    const pressure = showCaseHud ? (pressureOverride ?? currentLivePressure(brief, mood)) : {};
    const visualHud = visualHudOverride ?? (showCaseHud
      ? `${privateConsultation ? "" : liveCommentStrip(pressure)}${portraitLayer(brief, mood, pressure, controlMode)}`
      : storyPackSummaryHud());
    const total = Math.max(1, playableSceneCount(brief));
    const materialProfile = unlockedMaterialProfile({ state: bound.getState(), brief, visible: showCaseHud });
    const currentMaterial = materialProfile.label;
    const pixelTransition = pixelTransitionOverride === undefined ? pixelTransitionForCurrentScene(brief) : pixelTransitionOverride;
    app.innerHTML = personalizeHostHtml(liveFrameHtml({
      productName: PRODUCT_NAME,
      modeLabel,
      audioSettings: getAudioSettings(),
      backdropClass,
      backdropArt: stageBackdropArt(brief, backdropClass),
      label,
      chapter,
      text,
      reactionHtml: reactionLine(),
      choices,
      visualHud,
      material: currentMaterial,
      materialCount: materialProfile.count,
      materialArtSrc: brief?.evidenceBoard ?? "",
      materialItems: materialProfile.items,
      screenEffect: bound.getState().lastScreenEffect ?? "",
      pixelTransition,
      rewindAvailable: canRewindQuestion(bound.questionRewindHistory),
      screenClass: `${screenClass} effects-${bound.getState().settings?.screenEffects ?? "full"} ${pixelTransition?.kind === "reveal" ? "key-reveal-answer" : ""} ${showCaseHud ? liveSceneClass(brief, mood, pressure) : ""}`.trim(),
      controlDeckHtml: showCaseHud
        ? liveControlDeckHtml({
            simpleInquiry: Boolean(brief.dialoguePresentation?.focusedInquiry),
            privateConsultation,
            onAirLabel: privateConsultation ? "单独咨询" : isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中",
            label,
            segment: Math.min(total, answeredSceneCountForState(bound.getState(), brief) + 1),
            total,
            pressure,
            mode: controlMode,
            material: currentMaterial,
            materialCount: materialProfile.count
          })
        : ""
    }), bound.getState().playerName);
    const hadPressureCue = Boolean(bound.getState().lastReaction || bound.getState().lastPressureSignal || bound.getState().lastScreenEffect || bound.getState().lastPityLine);
    if (pressure.pityKey) {
      bound.getState().materialPityLog = {
        ...(bound.getState().materialPityLog ?? {}),
        [pressure.pityKey]: true
      };
    }
    if (hadPressureCue) {
      bound.getState().lastReaction = null;
      bound.getState().lastPressureSignal = null;
      bound.getState().lastPressureAxis = null;
      bound.getState().lastPityLine = null;
      bound.getState().lastScreenEffect = null;
      saveState();
    } else if (pressure.pityKey) {
      saveState();
    }
    bind('[data-action="title"]', returnToTitle);
    bind('[data-action="reset"]', resetToTitle);
    bindAudioControls({ root: app, onToggleSound: render });
    syncSceneAudio({ briefId: brief?.id ?? "root", scene: bound.getState().scene || "title", backdropClass, pressureLevel: "", musicPhase,
      liveNight: bound.getState().caseOvernights?.[caseKey(brief)]?.segment === "night2" || bound.getState().caseNights?.[caseKey(brief)]?.segment === "segment2" ? "night2" : "night1",
      audioEnterCueId, keepVoiceCueId });
    if (pressure.flashback?.id) playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:flashback:${pressure.flashback.id}`);
    resetViewportScroll();
    mountCurrentDialogue();
    queueDefaultFocus();
  }

  function dayFrame({ brief, label, chapter, text, choices, modeLabel = "白天调查", backdropClass = "day-city", audioEnterCueId = "", keepVoiceCueId = "", pixelTransition = undefined, screenClass = "" }) {
    const materialProfile = unlockedMaterialProfile({ state: bound.getState(), brief });
    app.innerHTML = personalizeHostHtml(liveFrameHtml({
      productName: PRODUCT_NAME,
      modeLabel,
      screenClass,
      audioSettings: getAudioSettings(),
      backdropClass,
      backdropArt: stageBackdropArt(brief, backdropClass),
      label,
      chapter,
      text,
      reactionHtml: "",
      choices,
      visualHud: "",
      material: materialProfile.label,
      materialCount: materialProfile.count,
      materialArtSrc: brief?.evidenceBoard ?? "",
      materialItems: materialProfile.items,
      screenEffect: "",
      pixelTransition: pixelTransition === undefined ? pixelTransitionForCurrentScene(brief) : pixelTransition,
      rewindAvailable: canRewindQuestion(bound.questionRewindHistory),
      controlDeckHtml: ""
    }), bound.getState().playerName);
    bind('[data-action="title"]', returnToTitle);
    bind('[data-action="reset"]', resetToTitle);
    bindAudioControls({ root: app, onToggleSound: render });
    syncSceneAudio({ briefId: brief?.id ?? "root", scene: bound.getState().scene || "title", backdropClass, audioEnterCueId, keepVoiceCueId });
    resetViewportScroll();
    mountCurrentDialogue();
    queueDefaultFocus();
  }

  function pixelTransitionForCurrentScene(brief = {}) {
    const revealTransition = keyRevealTransitionForCurrentScene(brief);
    if (revealTransition) return revealTransition;
    const transition = {
      nightShellPrologue: { kind: "soft-fade" },
      overnightPostLive: { kind: "signal-disconnect" },
      dayActOpening: { kind: "scene" },
      overnightCallback: { kind: "signal-connect" },
      storyInterlude: { kind: "signal-disconnect" },
      nightShellEpilogue: { kind: "scene" }
    }[bound.getState().scene];
    if (!transition) return null;
    const key = `${caseKey(brief)}:${bound.getState().scene}`;
    if (bound.pixelTransitions.has(key)) return null;
    bound.pixelTransitions.add(key);
    return transition;
  }

  function keyRevealTransitionForCurrentScene(brief = {}) {
    if (bound.getState().scene !== "sceneQuestionAnswer") return null;
    const focus = bound.getState().sceneQuestionFocus;
    if (!focus || focus.kind !== "key" || focus.caseId !== caseKey(brief)) return null;
    const pick = bound.getState().sceneQuestionPicks?.[answerKey(brief, focus.sceneIndex)];
    const transition = pick?.revealTransition;
    if (!transition?.id) return null;
    const key = `${caseKey(brief)}:reveal:${transition.id}`;
    if (bound.pixelTransitions.has(key)) return null;
    bound.pixelTransitions.add(key);
    return { ...transition, kind: "reveal", evidenceArtSrc: brief.evidenceBoard ?? transition.evidenceArtSrc ?? "" };
  }

  function mountCurrentDialogue() {
    destroyActiveDialogueController();
    const reaction = app?.querySelector('[data-transient-reaction]');
    if (reaction) setTimeout(() => reaction.remove(), 2400);
    const card = app?.querySelector(".dialogue-card");
    if (card?.querySelector(".call-dialogue, .night-shell-card, .cafe-prologue-dialogue")) {
      card.insertAdjacentHTML("beforeend", avgSystemBarHtml(bound.getState().settings));
    }
    const materialPanel = mountMaterialPanel();
    let controller = null;
    const dialogueState = bound.getState();
    controller = mountDialoguePresentation(app, {
      hostName: normalizePlayerName(bound.getState().playerName),
      speed: bound.getState().settings?.textSpeed ?? "normal",
      fastForward: Boolean(bound.getState().settings?.fastForward),
      autoMode: Boolean(bound.getState().settings?.autoMode),
      autoDelay: bound.getState().settings?.autoDelay ?? 2,
      presentationProfile: activeCaseBrief()?.dialoguePresentation ?? {},
      readingScope: `${caseKey(activeCaseBrief())}:${bound.getState().scene}`,
      resume: bound.getState().dialogueReading,
      onProgress: (progress, reason) => {
        if (bound.getState() !== dialogueState) return;
        bound.getState().dialogueReading = progress;
        if (reason === "page" || reason === "choices") saveState();
      },
      onBlip: playDialogueBlip,
      onPageStart: (page, _index, { restored } = {}) => {
        if (_index > 0) reaction?.remove();
        if (restored) return;
        const pageLines = Array.isArray(page?.lines) ? page.lines : [page];
        pageLines.forEach((line) => {
          const cueId = line?.audioCueId ?? "";
          if (!cueId) return;
          playAudioCueOnce(cueId, `${caseKey(activeCaseBrief())}:${bound.getState().scene}:dialogue:${cueId}`);
        });
      },
      onShown: (page) => {
        const shownLines = Array.isArray(page?.lines) ? page.lines : [page];
        bound.getState().dialogueBacklog = [...(bound.getState().dialogueBacklog ?? []), ...shownLines].filter((line) => line?.text).slice(-500);
        saveState();
      },
      onChoicesShown: (shownChoices) => {
        materialPanel.syncChoices();
        // Reading the final line already supplies the next-page action.
        // Skip only mechanical transitions, never a choice or an unread page.
        const buttons = [...(shownChoices?.querySelectorAll('button:not(:disabled)') ?? [])];
        const transition = buttons.length === 1 && buttons[0].matches(
          '[data-scene-open-replay], [data-next-scene-stage], [data-inquiry-continue], [data-continue-live-counter], [data-cafe-opening-seen], [data-cafe-revision-seen], [data-cafe-legal-brief], [data-care-dialogue-done]'
        ) ? buttons[0] : null;
        if (transition) {
          shownChoices.hidden = true;
          queueMicrotask(() => {
            if (bound.getState() === dialogueState && transition.isConnected && !app.querySelector('.court-record:not([hidden]), .avg-material-modal:not([hidden])')) transition.click();
          });
          return;
        }
        keepInlineChoicesVisible(shownChoices);
      }
    });
    bound.dialogueController = controller;
    syncDialoguePause();
    materialPanel.syncChoices();
    mountCourtRecord(app, {
      state: bound.getState(),
      cafe: nightShellForBrief(activeCaseBrief())?.cafePrologue?.cafe,
      materialItems: unlockedMaterialProfile({ state: bound.getState(), brief: activeCaseBrief() ?? {} }).items,
      onSettingsChange: cycleAvgSetting,
      onBeforeOpen: () => materialPanel.close({ restoreFocus: false }),
      onVisibilityChange: syncDialoguePause
    });
  }

  function syncDialoguePause() {
    bound.dialogueController?.setPaused?.(Boolean(app?.querySelector(
      ".court-record:not([hidden]), .avg-material-modal:not([hidden]), .cafe-material-modal:not([hidden])"
    )));
  }

  function destroyActiveDialogueController() {
    bound.dialogueController?.destroy?.();
    bound.dialogueController = null;
  }

  function keepInlineChoicesVisible(choices) {
    if (!choices?.classList?.contains("inline-choice-flow")) return;
    // Material inquiries share a scroll pane with the source quote. Keep its
    // opening visible instead of jumping past it to the response buttons.
    if (choices.closest(".inquiry-reading-pane")) return;
    choices.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }

  function mountMaterialPanel() {
    const shell = app?.querySelector("[data-live-shell]");
    const modal = app?.querySelector("[data-material-modal]");
    const triggers = Array.from(app?.querySelectorAll?.("[data-material-open]") ?? []);
    const choices = app?.querySelector(".avg-choice-overlay");
    let lastFocused = null;

    const close = ({ restoreFocus = true } = {}) => {
      if (!modal || modal.hidden) return false;
      modal.hidden = true;
      syncDialoguePause();
      shell?.classList.remove("material-open");
      triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
      if (restoreFocus && lastFocused && isVisibleElement(lastFocused)) focusButton(lastFocused);
      return true;
    };

    const syncChoices = () => {
      const choicesOpen = Boolean(choices && !choices.hidden && choices.querySelector("button:not(:disabled)"));
      shell?.classList.toggle("choices-open", choicesOpen);
    };

    if (!modal || !triggers.length) return { close, syncChoices };

    triggers.forEach((trigger) => trigger.addEventListener("click", () => {
      const record = app?.querySelector(".court-record:not([hidden])");
      record?.querySelector("[data-record-close]")?.click();
      lastFocused = document.activeElement;
      modal.hidden = false;
      syncDialoguePause();
      shell?.classList.add("material-open");
      triggers.forEach((item) => item.setAttribute("aria-expanded", "true"));
      focusButton(modal.querySelector(".avg-material-panel [data-material-close]"));
    }));
    modal.querySelectorAll("[data-material-close]").forEach((button) => button.addEventListener("click", () => close()));
    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(modal.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])"))
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const currentIndex = focusable.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex < 0 || currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1);
      event.preventDefault();
      focusable[nextIndex].focus?.();
    });
    return { close, syncChoices };
  }

  function cycleAvgSetting(kind) {
    const speeds = ["slow", "normal", "fast", "instant"];
    const effects = ["full", "reduced", "off"];
    if (kind === "auto") bound.getState().settings.autoMode = !bound.getState().settings.autoMode;
    if (kind === "speed") bound.getState().settings.textSpeed = speeds[(speeds.indexOf(bound.getState().settings.textSpeed) + 1) % speeds.length];
    if (kind === "fast") {
      bound.getState().settings.fastForward = !bound.getState().settings.fastForward;
      bound.dialogueController?.setFastForward?.(bound.getState().settings.fastForward);
      document.querySelectorAll('[data-avg-setting="fast"]').forEach((button) => {
        button.textContent = `即时文字 ${bound.getState().settings.fastForward ? "开" : "关"}`;
        button.setAttribute("aria-pressed", String(bound.getState().settings.fastForward));
      });
      saveState();
      return;
    }
    if (kind === "effects") bound.getState().settings.screenEffects = effects[(effects.indexOf(bound.getState().settings.screenEffects) + 1) % effects.length];
    saveState();
    render();
  }

  function caseBackdropClass(brief = {}) {
    return brief.backdropClass ?? "backdrop-live";
  }

  function stageBackdropArt(brief = {}, backdropClass = "") {
    const tokens = String(backdropClass ?? "").split(/\s+/).filter(Boolean);
    const caseClass = String(brief?.backdropClass ?? "").split(/\s+/)[0];
    if (brief?.backdropArt && caseClass && tokens.includes(caseClass)) return brief.backdropArt;
    const shell = nightShellForStoryKey(brief?.storyKey ?? brief?.weeklyKey ?? storyKeyFromUrl());
    if (tokens.includes("day-cafe") && shell?.cafePrologue?.backdropArt) return shell.cafePrologue.backdropArt;
    const stageArt = shell?.stageArt ?? {};
    return tokens.map((token) => stageArt[token]).find(Boolean) ?? "";
  }

  function stanceSnapshotPickForState(brief = {}) {
    return bound.getState().stanceSnapshots?.[caseKey(brief)] ?? null;
  }

  function liveCounterPickKey(brief = {}, beatId = "") {
    return `${caseKey(brief)}:${beatId}`;
  }

  function liveCounterPickForState(brief = {}, beatId = "") {
    return currentLiveCounterPick(liveCounterBeatById(brief, beatId), bound.getState().liveCounterPicks?.[liveCounterPickKey(brief, beatId)]);
  }

  function moveScene(scene) {
    const brief = activeCaseBrief();
    if (scene === "sceneReview" && overnightStructureFor(brief)) {
      const overnight = ensureOvernight(brief);
      scene = overnight.segment === "night2" ? "overnightNight2" : "overnightNight1";
    } else if (scene === "sceneReview" && nightStructureFor(brief)) {
      const night = ensureNight(brief);
      scene = night.segment === "segment2" ? "callSegment2" : "callSegment1";
    }
    if (scene === "accusation") {
      const readiness = accusationReadinessForBrief(brief);
      if (!readiness.ready) {
        return commit((state) => {
          state.lastReaction = readiness.message;
          state.scene = "sceneReview";
          state.dialogueProgress = {
            ...(state.dialogueProgress ?? {}),
            [`${caseKey(brief)}:sceneReview`]: firstPendingSceneIndex(brief)
          };
        });
      }
      if (overnightStructureFor(brief) && overnightCallerQuestionFor(brief) && !actionDone(brief, "overnight:callerQuestion")) {
        return commit((state) => {
          state.scene = "callerQuestion";
        });
      }
      if (!nightStructureFor(brief) && delegationFor(brief) && !actionDone(brief, "delegation")) {
        return commit((state) => {
          state.scene = "delegation";
        });
      }
    }
    commit((state) => {
      state.scene = scene;
    });
  }

  function setIndex(brief, area, index) {
    setIndexValue(brief, area, index);
    saveState();
    render();
  }

  function setIndexValue(brief, area, index) {
    const total = area === "sceneReview" ? brief.sceneVersions?.length ?? 1 : area === "evidenceCheck" ? evidenceChecksFor(brief).length || 1 : unlockedInvestigationEntriesForState(bound.getState(), brief).length || 1;
    bound.getState().dialogueProgress = {
      ...(bound.getState().dialogueProgress ?? {}),
      [`${caseKey(brief)}:${area}`]: Math.max(0, Math.min(index, total - 1))
    };
  }

  function areaTotalForRetry(brief, area) {
    if (area === "sceneReview") return brief.sceneVersions?.length ?? 1;
    if (area === "evidenceCheck") return evidenceChecksFor(brief).length || 1;
    if (area === "investigationBackflow") return unlockedInvestigationEntriesForState(bound.getState(), brief).length || 1;
    return 1;
  }

  function currentIndex(brief, area, total) {
    const savedIndex = bound.getState().dialogueProgress?.[`${caseKey(brief)}:${area}`];
    const index = savedIndex ?? (area === "sceneReview" ? firstPendingSceneIndex(brief) : 0);
    return Math.max(0, Math.min(Number(index), Math.max(0, total - 1)));
  }

  function firstPendingSceneIndex(brief) {
    return firstOpenSceneIndex(brief, (actionKey) => actionDone(brief, actionKey));
  }

  function sceneAfterEvidenceFor(brief) {
    if (pendingEvidenceChecksFor(brief, (actionKey) => actionDone(brief, actionKey)).length) return "evidenceCheck";
    if (overnightStructureFor(brief) && overnightCallerQuestionFor(brief) && !actionDone(brief, "overnight:callerQuestion")) return "callerQuestion";
    if (nightStructureFor(brief)) return "accusation";
    return afterEvidenceScene({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
  }

  function hasDeepFollowup(brief) {
    return Boolean(deepFollowupFor(brief).question);
  }

  function deepFollowupFor(brief) {
    if (brief.deepFollowup?.question) return brief.deepFollowup;
    return {};
  }

  function dailyConclusion(brief, result, issue) {
    const picked = selectedScenePicksForState(bound.getState(), brief);
    const pickedQuestions = picked.map((item) => item.question).filter(Boolean);
    const deep = issue.badge ? deepFollowupFor(brief) : null;
    return dailyConclusionModel(brief, result, issue, { pickedQuestions, deepFollowup: deep });
  }

  return {
    liveChapterTitle,
    nightShellForStoryKey,
    nightShellForBrief,
    nightShellInterludeForBrief,
    nightShellGoodEnding,
    nightShellEndingKey,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    sceneWithLiveCounterQuestionOverride,
    frame,
    dayFrame,
    pixelTransitionForCurrentScene,
    keyRevealTransitionForCurrentScene,
    mountCurrentDialogue,
    syncDialoguePause,
    destroyActiveDialogueController,
    keepInlineChoicesVisible,
    mountMaterialPanel,
    cycleAvgSetting,
    caseBackdropClass,
    stageBackdropArt,
    stanceSnapshotPickForState,
    liveCounterPickKey,
    liveCounterPickForState,
    moveScene,
    setIndex,
    setIndexValue,
    areaTotalForRetry,
    currentIndex,
    firstPendingSceneIndex,
    sceneAfterEvidenceFor,
    hasDeepFollowup,
    deepFollowupFor,
    dailyConclusion
  };
}
