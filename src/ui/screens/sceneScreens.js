import {
  normalizeStatementPatience,
  resetStatementPatience,
  sceneUsesLineReplay,
  spendStatementPatience,
  statementNightKey,
  statementNightPatienceMax,
  statementPressureFor
} from "../../runtime/statementReviewModel.js";
import {
  statementPatienceLostHtml,
  statementReplayHtml,
  statementReplayLineForScene,
  statementReplayOptionIndex
} from "../statementReviewView.js";
import { nextQuestionPressureSignal } from "../../runtime/livePressure.js";
import {
  advanceTestimonyAct,
  decisivePresentAvailability,
  decisivePresentForScene,
  decisivePresentOutcome,
  decisivePresentPressure,
  normalizeDecisivePresentProgress,
  normalizeTestimonyWallProgress,
  pressTestimonyStatement,
  resetDecisivePresentProgress,
  selectTestimonyEvidence,
  softPresentOnStatement,
  testimonyActComparisonRows,
  testimonyActForScene,
  testimonyActIsFinal,
  testimonyStatementsForScene,
  testimonyWallKey
} from "../../runtime/decisivePresentModel.js";
import {
  decisivePresentHitHtml,
  decisivePresentTargetHtml,
  testimonyMaterialSelectHtml,
  testimonyWallHtml
} from "../decisivePresentView.js";

export function createSceneScreens(ctx) {
  const {
    playAudioCueOnce,
    dailyAccusationChoices,
    askedDialoguePicksForState,
    completedSceneExchangeForState,
    latestChoiceReviewRowsForState,
    selectedScenePickForState,
    pressuredAnswerVariant,
    questionPressureReaction,
    questionPressureSignal,
    routeAxisForChoice,
    routeToneForChoice,
    nextSceneAfterEvidence,
    afterSceneEvidenceFor,
    answerKey,
    caseKey,
    evidenceChecksFor,
    keyQuestionLimit,
    nightStructureFor,
    overnightCallerQuestionFor,
    overnightStructureFor,
    sceneReviewModel,
    shouldEnterHangupAfterScene,
    shouldEnterOvernightHangupAfterScene,
    stanceSnapshotForScene,
    CHOICE_COST_META,
    callDialogueHtml,
    choiceButtonBodyHtml,
    choiceGroupHtml,
    choiceReviewHtml,
    flowGroupHtml,
    hangupBeatHtml,
    focusedQuestionOptions,
    sceneDialogueOptions,
    sceneQuestionChoicesHtml,
    completedSceneExchangeHtml,
    scenePromptExchangeHtml,
    sceneQuestionAnswerHtml,
    sceneReviewDoneChoicesHtml,
    sceneReviewHtml,
    stanceSnapshotHtml,
    saveState,
    activeCaseBrief,
    render,
    liveChapterTitle,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    hostDisclosureForAnchor,
    respondentTeaseHtml,
    frame,
    consumePixelTransition,
    bind,
    bindChoiceActivation,
    stanceSnapshotPickForState,
    enterLiveCounterBeatBeforeScene,
    enterLiveCounterBeatAfterScene,
    moveScene,
    setIndex,
    currentIndex,
    firstUnansweredSceneIndex,
    nextPlayableSceneIndex,
    playableSceneIndexes,
    resolveAccusationFromButton,
    issueCompletion,
    accusationReadinessForBrief,
    retryPatienceLostStep,
    markAction,
    audiencePatienceLost,
    actionDone,
    ensureOvernight,
    updateNight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    hasDeepFollowup,
    deepFollowupFor,
    escapeHtml
  } = ctx;

  function renderSceneReview(brief) {
    const state = ctx.getState();
    const currentSceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    if (enterLiveCounterBeatBeforeScene(brief, currentSceneIndex)) return;
    const review = sceneReviewModel({
      brief,
      index: currentSceneIndex,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const { index, scene, done, lastStage, nextStage, nextLabel } = review;
    const sceneForView = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, scene, index));
    const testimonyPresent = sceneForView.interactionMode === "testimonyWall"
      ? decisiveProgress(brief, sceneForView, index)
      : null;
    if (sceneForView.interactionMode === "testimonyWall") {
      const wallContext = testimonyContext(brief);
      const finalActResolved = wallContext.finalAct && wallContext.presentProgress.resolved;
      if (!finalActResolved && wallContext.presentProgress.resolved && !wallContext.finalAct) {
        writeWallProgress(wallContext.wallKey, advanceTestimonyAct(wallContext.scene, wallContext.wallProgress));
        state.scene = "testimonyWall";
        saveState();
        return renderTestimonyWall(brief);
      }
      if (!finalActResolved) {
        state.scene = "testimonyWall";
        saveState();
        return renderTestimonyWall(brief);
      }
    }
    const pick = selectedScenePickForState(state, brief, index);
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    const completedExchangeHtml = done
      ? `${completedSceneExchangeHtml(completedSceneExchangeForState(state, brief, sceneForView, index, pick))}${respondentTeaseHtml(brief, index)}${hostDisclosureForAnchor(brief, `afterScene:${index + 1}`)}`
      : "";
    frame({
      brief,
      mood: "thinking",
      label: "继续对话",
      chapter: liveChapterTitle(brief),
      screenClass: sceneUsesLineReplay(sceneForView) ? "dialogue-mode-listen" : "",
      controlMode: "listen",
      musicPhase: sceneForView.interactionMode === "testimonyWall" && done && testimonyPresent?.resolved ? "pursuit" : "",
      pressureOverride: sceneUsesLineReplay(sceneForView) ? statementPressure(brief, index, "listen") : null,
      pixelTransition: sceneUsesLineReplay(sceneForView) ? statementPhaseTransition(brief, sceneForView, index, "listen") : undefined,
      text: sceneReviewHtml({
        index,
        displayIndex: Math.max(0, playableSceneIndexes(brief).indexOf(index)),
        done,
        completedExchangeHtml,
        activeExchangeHtml: done ? "" : scenePromptExchangeHtml({ scene: sceneForView, askedCount: dialoguePicks.length }),
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief, { excludeIndex: index }))
      }),
      choices: done
        ? sceneReviewDoneChoicesHtml({ lastStage, nextStage, nextLabel })
        : sceneUsesLineReplay(sceneForView)
          ? flowGroupHtml('<button class="primary" data-scene-open-replay type="button">把刚才那段拉回来</button>')
          : flowGroupHtml(sceneQuestionChoicesHtml(index, sceneForView, dialoguePicks))
    });
    playAudioCueOnce(sceneForView.audioCueId, `${caseKey(brief)}:scene:${index}:${sceneForView.id ?? "beat"}`);
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-scene-open-replay]", () => openSceneLineReplay(brief, index));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
    bindSceneButtons();
  }

  function renderTestimonyWall(brief) {
    const context = testimonyContext(brief);
    if (!context.scene?.testimonyWall) return renderSceneReview(brief);
    const pressure = decisivePresentPressure(context.presentProgress, context.present?.maxAttempts);
    frame({
      brief,
      mood: pressure.guarded ? "tense" : "focused",
      label: "证词墙",
      chapter: liveChapterTitle(brief),
      text: testimonyWallHtml({
        scene: context.scene,
        wallAct: context.wallAct,
        statements: context.statements,
        comparisonRows: context.comparisonRows,
        wallProgress: context.wallProgress,
        presentProgress: context.presentProgress,
        presentAvailability: context.presentAvailability
      }),
      choices: "",
      screenClass: `dialogue-mode-testimony testimony-present-${pressure.guarded ? "guarded" : "open"}`,
      controlMode: "interrupt",
      pressureOverride: pressure,
      musicPhase: context.wallProgress.act > 1 ? "pursuit" : "allegro"
    });
    bind("[data-testimony-press]", (event) => updateTestimonyPress(brief, event.currentTarget?.dataset.testimonyPress ?? ""));
    bind("[data-testimony-present]", (event) => updateSoftPresent(brief, event.currentTarget?.dataset.testimonyPresent ?? ""));
    bind("[data-testimony-materials]", () => openTestimonyMaterials(brief, "soft"));
    bind("[data-decisive-present-start]", () => openTestimonyMaterials(brief, "decisive"));
    bindSceneButtons();
  }

  function renderTestimonyMaterials(brief, mode = "soft") {
    const context = testimonyContext(brief);
    const hard = mode === "decisive" || ctx.getState().scene === "decisivePresentMaterial";
    if (hard && !context.presentAvailability.canStart) return returnToTestimonyWall(brief);
    frame({
      brief,
      mood: "focused",
      label: hard ? "正式指认" : "材料试问",
      chapter: liveChapterTitle(brief),
      text: testimonyMaterialSelectHtml({
        scene: context.scene,
        wallAct: context.wallAct,
        mode: hard ? "decisive" : "soft",
        selectedEvidenceId: hard ? context.presentProgress.selectedEvidenceId : context.wallProgress.softEvidenceId,
        remaining: context.presentProgress.remaining
      }),
      choices: "",
      screenClass: hard ? "dialogue-mode-present decisive-material-step" : "dialogue-mode-testimony",
      controlMode: "interrupt",
      pressureOverride: decisivePresentPressure(context.presentProgress, context.present?.maxAttempts),
      musicPhase: context.wallProgress.act > 1 ? "pursuit" : "allegro"
    });
    bind("[data-testimony-material]", (event) => selectTestimonyMaterial(brief, event.currentTarget?.dataset.testimonyMaterial ?? ""));
    bind("[data-decisive-material]", (event) => selectDecisiveMaterial(brief, event.currentTarget?.dataset.decisiveMaterial ?? ""));
    bind("[data-testimony-wall-return]", () => returnToTestimonyWall(brief));
    bindSceneButtons();
  }

  function renderDecisivePresentTarget(brief) {
    const context = testimonyContext(brief);
    if (!context.presentAvailability.canStart) return returnToTestimonyWall(brief);
    if (!context.presentProgress.selectedEvidenceId) return openTestimonyMaterials(brief, "decisive");
    frame({
      brief,
      mood: "tense",
      label: "正式指认",
      chapter: liveChapterTitle(brief),
      text: decisivePresentTargetHtml({ scene: context.scene, wallAct: context.wallAct, statements: context.statements, progress: context.presentProgress }),
      choices: "",
      screenClass: "dialogue-mode-present decisive-target-step",
      controlMode: "interrupt",
      pressureOverride: decisivePresentPressure(context.presentProgress, context.present?.maxAttempts),
      musicPhase: context.wallProgress.act > 1 ? "pursuit" : "allegro"
    });
    bind("[data-decisive-present-target]", (event) => commitDecisivePresent(brief, event.currentTarget?.dataset.decisivePresentTarget ?? ""));
    bind("[data-decisive-present-back]", () => openTestimonyMaterials(brief, "decisive"));
    bindSceneButtons();
  }

  function renderDecisivePresentHit(brief) {
    const context = testimonyContext(brief);
    const effects = ctx.getState().settings?.screenEffects ?? "full";
    const settleMs = effects === "full" ? 3400 : effects === "reduced" ? 1200 : 0;
    const stingerMs = effects === "full" ? 700 : effects === "reduced" ? 250 : 0;
    const hitPressure = {
      ...decisivePresentPressure(context.presentProgress, context.present?.maxAttempts),
      callerGuard: "动摇",
      expression: { kind: "shaken", text: "长久没接话，呼吸停在麦里" }
    };
    frame({
      brief,
      mood: "tense",
      label: "指认命中",
      chapter: liveChapterTitle(brief),
      text: decisivePresentHitHtml({ scene: context.scene, wallAct: context.wallAct }),
      choices: flowGroupHtml('<button class="primary" data-after-decisive-present type="button" disabled>等她把这句说完</button>'),
      screenClass: `dialogue-mode-present decisive-present-sequence effects-${effects}`,
      controlMode: "interrupt",
      pressureOverride: hitPressure,
      musicPhase: "silent"
    });
    globalThis.setTimeout(() => {
      if (ctx.getState().scene !== "decisivePresentHit") return;
      playAudioCueOnce("sfx.present.hit", `${context.key}:hit-stinger`);
    }, stingerMs);
    const button = document.querySelector("[data-after-decisive-present]");
    globalThis.setTimeout(() => {
      if (ctx.getState().scene !== "decisivePresentHit" || !button?.isConnected) return;
      button.disabled = false;
      button.textContent = context.finalAct ? context.present?.continueLabel ?? "把后半段听完" : "听她重新说一遍";
    }, settleMs);
    bind("[data-after-decisive-present]", () => continueAfterDecisivePresent(brief));
    bindSceneButtons();
  }

  function updateTestimonyPress(brief, statementId) {
    const context = testimonyContext(brief);
    writeWallProgress(context.wallKey, pressTestimonyStatement(context.scene, context.wallProgress, statementId));
    saveState();
    render();
  }

  function updateSoftPresent(brief, statementId) {
    const context = testimonyContext(brief);
    writeWallProgress(context.wallKey, softPresentOnStatement(context.scene, context.wallProgress, statementId));
    saveState();
    render();
  }

  function openTestimonyMaterials(brief, mode = "soft") {
    const state = ctx.getState();
    if (mode === "decisive" && !testimonyContext(brief).presentAvailability.canStart) {
      state.scene = "testimonyWall";
      saveState();
      return render();
    }
    state.scene = mode === "decisive" ? "decisivePresentMaterial" : "testimonyMaterials";
    saveState();
    render();
  }

  function selectTestimonyMaterial(brief, evidenceId) {
    const context = testimonyContext(brief);
    writeWallProgress(context.wallKey, selectTestimonyEvidence(context.wallProgress, evidenceId));
    returnToTestimonyWall(brief);
  }

  function selectDecisiveMaterial(brief, evidenceId) {
    const context = testimonyContext(brief);
    writePresentProgress(context.key, { ...context.presentProgress, selectedEvidenceId: evidenceId });
    const state = ctx.getState();
    state.scene = "decisivePresentTarget";
    saveState();
    render();
  }

  function returnToTestimonyWall(brief) {
    ctx.getState().scene = "testimonyWall";
    saveState();
    render();
  }

  function commitDecisivePresent(brief, statementId) {
    const context = testimonyContext(brief);
    const outcome = decisivePresentOutcome(context.scene, context.presentProgress, context.presentProgress.selectedEvidenceId, statementId, context.wallProgress);
    writePresentProgress(context.key, outcome.progress);
    if (outcome.kind === "hit") {
      const state = ctx.getState();
      const present = context.present;
      if (context.finalAct) {
        markAction(brief, `version:${context.index}`);
        recordContradiction(brief, present.contradiction ?? context.scene.contradiction);
        state.sceneAnswers = { ...(state.sceneAnswers ?? {}), [answerKey(brief, context.index)]: present.callerLine ?? "……" };
        state.sceneQuestionPicks = {
          ...(state.sceneQuestionPicks ?? {}),
          [answerKey(brief, context.index)]: {
            question: present.hostLine ?? "这两处得放在一起说。",
            answer: present.callerLine ?? "……",
            contradiction: present.contradiction ?? context.scene.contradiction ?? "",
            routeAxis: present.routeAxis ?? "document-edge",
            routeTone: "decisive-present",
            correct: true,
            guarded: false,
            sceneVersionKind: "testimony-wall-act2"
          }
        };
        recordRouteChoice(brief, context.index, state.sceneQuestionPicks[answerKey(brief, context.index)], context.scene);
      }
      state.scene = "decisivePresentHit";
      saveState();
      return render();
    }
    const missIndex = outcome.progress.attempts;
    markAction(brief, `decisivePresentMiss:${context.index}:act${context.wallProgress.act}:${missIndex}`);
    playAudioCueOnce("sfx.present.miss", `${context.key}:miss:${missIndex}`);
    ctx.getState().lastReaction = outcome.missKind === "evidence"
      ? "这张材料压不到刚才那句上。她把回答收短了。"
      : "材料碰到边了，但不是这句。她开始只答半句。";
    ctx.getState().lastScreenEffect = "patience-drop";
    if (outcome.kind === "exhausted") {
      return ctx.recordPatienceLost(brief, {
        area: "sceneReview",
        retryScene: "testimonyWall",
        index: context.index,
        decisivePresentKey: context.key,
        actionKeys: [1, 2].map((attempt) => `decisivePresentMiss:${context.index}:act${context.wallProgress.act}:${attempt}`),
        spent: false
      });
    }
    ctx.getState().scene = "testimonyWall";
    saveState();
    render();
  }

  function continueAfterDecisivePresent(brief) {
    const context = testimonyContext(brief);
    if (!context.finalAct) {
      writeWallProgress(context.wallKey, advanceTestimonyAct(context.scene, context.wallProgress));
      ctx.getState().scene = "testimonyWall";
      saveState();
      return render();
    }
    ctx.getState().scene = "sceneReview";
    saveState();
    render();
  }

  function testimonyContext(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[index] ?? {}, index));
    const wallKey = testimonyWallKey(brief, scene, index);
    const wallProgress = normalizeTestimonyWallProgress(state.testimonyWallProgress?.[wallKey]);
    const wallAct = testimonyActForScene(scene, wallProgress);
    const present = decisivePresentForScene(scene, wallProgress);
    const key = testimonyWallKey(brief, scene, index, wallProgress.act);
    const presentProgress = normalizeDecisivePresentProgress(state.decisivePresentProgress?.[key], present?.maxAttempts);
    const presentAvailability = decisivePresentAvailability(scene, wallProgress);
    return {
      index,
      scene,
      key,
      wallKey,
      wallAct,
      present,
      wallProgress,
      presentProgress,
      presentAvailability,
      finalAct: testimonyActIsFinal(scene, wallProgress),
      comparisonRows: testimonyActComparisonRows(scene, wallProgress),
      statements: testimonyStatementsForScene(scene, wallProgress)
    };
  }

  function decisiveProgress(brief, scene, index) {
    const wallKey = testimonyWallKey(brief, scene, index);
    const wallProgress = normalizeTestimonyWallProgress(ctx.getState().testimonyWallProgress?.[wallKey]);
    const present = decisivePresentForScene(scene, wallProgress);
    const key = testimonyWallKey(brief, scene, index, wallProgress.act);
    return normalizeDecisivePresentProgress(ctx.getState().decisivePresentProgress?.[key], present?.maxAttempts);
  }

  function writeWallProgress(key, progress) {
    const state = ctx.getState();
    state.testimonyWallProgress = { ...(state.testimonyWallProgress ?? {}), [key]: progress };
  }

  function writePresentProgress(key, progress) {
    const state = ctx.getState();
    state.decisivePresentProgress = { ...(state.decisivePresentProgress ?? {}), [key]: progress };
  }

  function renderSceneQuestionMenu(brief) {
    // One-release compatibility for saves captured on the retired question-menu route.
    closeSceneQuestionMenu(brief);
  }

  function renderSceneQuestionAnswer(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const focus = sceneQuestionFocusFor(brief, index);
    if (!focus) return closeSceneQuestionMenu(brief);
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[index] ?? {}, index));
    if (focus.kind === "dialogue" && sceneUsesLineReplay(scene)) {
      state.sceneQuestionFocus = null;
      state.scene = "sceneLineReplay";
      saveState();
      return renderSceneLineReplay(brief);
    }
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    const pick = focus.kind === "dialogue"
      ? dialoguePicks.find((item) => Number(item.optionIndex) === Number(focus.optionIndex))
      : selectedScenePickForState(state, brief, index);
    if (!pick?.question || (!pick?.answer && !pick?.lines?.length)) return closeSceneQuestionMenu(brief);
    const review = sceneReviewModel({
      brief,
      index,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    frame({
      brief,
      mood: focus.kind === "key" ? "focused" : "thinking",
      label: "连线继续",
      chapter: liveChapterTitle(brief),
      screenClass: focus.kind === "key" && sceneUsesLineReplay(scene) ? "dialogue-mode-interrupt" : "",
      controlMode: focus.kind === "key" && sceneUsesLineReplay(scene) ? "interrupt" : "listen",
      pressureOverride: focus.kind === "key" && sceneUsesLineReplay(scene) ? statementPressure(brief, index, "interrupt") : null,
      musicPhase: focus.kind === "key" ? "allegro" : "",
      text: `${sceneQuestionAnswerHtml({
        question: pick.question,
        answer: pick.answer,
        lines: pick.lines,
        resistanceBeat: pick.resistanceBeat,
        reactionLine: pick.reactionLine,
        sceneCloser: focus.kind === "key" ? scene.sceneCloser : null
      })}${focus.kind === "key" ? `${respondentTeaseHtml(brief, index)}${hostDisclosureForAnchor(brief, `afterScene:${index + 1}`)}` : ""}`,
      choices: focus.kind === "key"
        ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
        : flowGroupHtml(sceneQuestionChoicesHtml(index, scene, dialoguePicks))
    });
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
    bindSceneButtons();
  }

  function openSceneLineReplay(brief, sceneIndex) {
    const state = ctx.getState();
    state.scene = "sceneLineReplay";
    state.activeStatementLineId = null;
    saveState();
    render();
  }

  function renderSceneLineReplay(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[sceneIndex] ?? {}, sceneIndex));
    if (!sceneUsesLineReplay(scene)) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const attempts = state.statementReviewAttempts?.[answerKey(brief, sceneIndex)] ?? [];
    frame({
      brief,
      mood: "focused",
      label: "回放",
      chapter: liveChapterTitle(brief),
      text: statementReplayHtml({ scene, sceneIndex, attemptedLineIds: attempts }),
      choices: "",
      screenClass: "dialogue-mode-replay",
      controlMode: "replay",
      musicPhase: "allegro",
      pressureOverride: statementPressure(brief, sceneIndex, "replay"),
      pixelTransition: statementPhaseTransition(brief, scene, sceneIndex, "review")
    });
    bind("[data-scene-review-line]", (event) => handleSceneReviewLine(event.currentTarget, brief, scene));
    bindSceneButtons();
  }

  function handleSceneReviewLine(button, brief, scene) {
    const state = ctx.getState();
    const sceneIndex = Number(button.dataset.sceneReviewIndex ?? currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1));
    const lineId = button.dataset.sceneReviewLine ?? "";
    const line = statementReplayLineForScene(scene, lineId);
    const optionIndex = statementReplayOptionIndex(scene, line);
    const key = answerKey(brief, sceneIndex);
    state.activeStatementLineId = lineId;
    if (optionIndex >= 0) {
      saveState();
      return handleSceneQuestionButton({ dataset: { sceneQuestion: `${sceneIndex}:${optionIndex}` } });
    }
    if ((state.statementReviewAttempts?.[key] ?? []).includes(lineId)) return;
    state.statementReviewAttempts = {
      ...(state.statementReviewAttempts ?? {}),
      [key]: [...new Set([...(state.statementReviewAttempts?.[key] ?? []), lineId])]
    };
    const patienceKey = statementPatienceKey(brief, sceneIndex);
    const max = statementPatienceMax(brief, sceneIndex);
    const nextPatience = spendStatementPatience(state.statementPatience?.[patienceKey], max);
    state.statementPatience = {
      ...(state.statementPatience ?? {}),
      [patienceKey]: nextPatience
    };
    state.lastScreenEffect = "patience-drop";
    state.scene = nextPatience.remaining <= 0 ? "statementPatienceLost" : "sceneLineReplay";
    saveState();
    render();
  }

  function renderStatementPatienceLost(brief) {
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    frame({
      brief,
      mood: "tense",
      label: "线路发散",
      chapter: liveChapterTitle(brief),
      text: statementPatienceLostHtml(),
      choices: flowGroupHtml('<button class="primary" data-retry-statement type="button">重新听这段</button>'),
      screenClass: "dialogue-mode-replay statement-patience-empty",
      controlMode: "replay",
      pressureOverride: statementPressure(brief, sceneIndex, "replay")
    });
    bind("[data-retry-statement]", () => retryStatementReview(brief, sceneIndex));
    bindSceneButtons();
  }

  function retryStatementReview(brief, sceneIndex) {
    const state = ctx.getState();
    const patienceKey = statementPatienceKey(brief, sceneIndex);
    state.statementPatience = {
      ...(state.statementPatience ?? {}),
      [patienceKey]: resetStatementPatience(statementPatienceMax(brief, sceneIndex))
    };
    state.statementReviewAttempts = {
      ...(state.statementReviewAttempts ?? {}),
      [answerKey(brief, sceneIndex)]: []
    };
    state.activeStatementLineId = null;
    state.lastScreenEffect = null;
    state.scene = "sceneReview";
    saveState();
    render();
  }

  function statementPatienceKey(brief, sceneIndex) {
    return `${caseKey(brief)}:${statementNightKey(brief, sceneIndex)}`;
  }

  function statementPatienceMax(brief, sceneIndex) {
    return statementNightPatienceMax(brief, statementNightKey(brief, sceneIndex));
  }

  function statementPatience(brief, sceneIndex) {
    const state = ctx.getState();
    const max = statementPatienceMax(brief, sceneIndex);
    return normalizeStatementPatience(state.statementPatience?.[statementPatienceKey(brief, sceneIndex)], max);
  }

  function statementPressure(brief, sceneIndex, mode) {
    return statementPressureFor(statementPatience(brief, sceneIndex), {
      mode,
      max: statementPatienceMax(brief, sceneIndex)
    });
  }

  function statementPhaseTransition(brief, scene, sceneIndex, mode) {
    const phase = mode === "review" ? "review" : "listen";
    const key = `${caseKey(brief)}:statement:${scene?.id ?? sceneIndex}:${phase}`;
    if (!consumePixelTransition(key)) return null;
    return phase === "review"
      ? { kind: "phase", visualVariant: "review", eyebrow: "回到刚才那段", label: "逐句追问" }
      : { kind: "phase", visualVariant: "listen", eyebrow: "先听她说完", label: "来电人陈述" };
  }

  function renderStanceSnapshot(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    let snapshot = stanceSnapshotForScene(brief, sceneIndex, (key) => actionDone(brief, key));
    const pick = stanceSnapshotPickForState(brief);
    if (!snapshot && pick && Number(pick.sceneIndex) === Number(sceneIndex)) {
      snapshot = {
        ...(brief.stanceSnapshot ?? {}),
        sceneIndex
      };
    }
    if (!snapshot) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    frame({
      brief,
      mood: "thinking",
      label: "立场快照",
      chapter: liveChapterTitle(brief),
      text: `
        ${choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))}
        ${stanceSnapshotHtml(snapshot, pick)}
      `,
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-stance-snapshot type="button">${escapeHtml(snapshot.continueLabel ?? "继续听")}</button>`)
        : ""
    });
    document.querySelectorAll("[data-stance-snapshot]").forEach((button) => {
      button.addEventListener("click", () => recordStanceSnapshot(brief, snapshot, Number(button.dataset.stanceSnapshot ?? 0)));
    });
    bind("[data-after-stance-snapshot]", () => {
      const pendingEvidence = afterSceneEvidenceFor(brief, snapshot.sceneIndex, (key) => actionDone(brief, key));
      state.scene = pendingEvidence
        ? "afterSceneEvidence"
        : shouldEnterOvernightHangupAfterScene(brief, snapshot.sceneIndex)
          ? "overnightHangup"
          : shouldEnterHangupAfterScene(brief, snapshot.sceneIndex)
            ? "hangupBeat"
            : "sceneReview";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderHangupBeat(brief) {
    const state = ctx.getState();
    const structure = nightStructureFor(brief);
    if (!structure?.hangup) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    frame({
      brief,
      mood: "tense",
      label: "连线挂断",
      chapter: "第一段连线",
      text: hangupBeatHtml(structure.hangup),
      choices: flowGroupHtml(`<button class="primary" data-enter-interlude type="button">切到调查台</button>`),
      audioEnterCueId: structure.hangup.audioCueId
    });
    bind("[data-enter-interlude]", () => {
      updateNight(brief, { segment: "interlude", hangupDone: true });
      state.scene = "interludeDesk";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderCallerQuestion(brief) {
    const state = ctx.getState();
    const question = overnightCallerQuestionFor(brief);
    const overnight = ensureOvernight(brief);
    if (!question || actionDone(brief, "overnight:callerQuestion") && !overnight.callerQuestionChoiceId) {
      state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      saveState();
      return render();
    }
    const picked = (question.options ?? []).find((option) => option.id === overnight.callerQuestionChoiceId) ?? null;
    const hostPick = (picked?.hostChoices ?? []).find((option) => option.id === overnight.callerQuestionHostChoiceId) ?? null;
    const earned = new Set(overnight.earnedItems ?? []);
    frame({
      brief,
      mood: "focused",
      label: "她的那一问",
      chapter: liveChapterTitle(brief),
      text: `
        ${callDialogueHtml([{ role: "caller", text: question.prompt ?? "" }])}
        ${picked ? callDialogueHtml([
          { role: "host", text: picked.label ?? "" },
          ...(picked.lines ?? (picked.callerLine ? [{ role: "caller", text: picked.callerLine }] : [])),
          ...(hostPick?.silent ? [] : hostPick ? [{ role: "host", text: hostPick.label ?? "" }] : []),
          ...(hostPick?.lines ?? [])
        ]) : ""}
      `,
      choices: picked && (picked.hostChoices ?? []).length && !hostPick
        ? choiceGroupHtml("你怎么接", (picked.hostChoices ?? []).map((option) => `<button class="decision-choice" data-caller-question-host="${escapeHtml(option.id ?? "")}" type="button">${choiceButtonBodyHtml(option.label ?? "", CHOICE_COST_META.nonScoredReply)}</button>`).join(""), "single-choice-group", "不判对错，只记下你怎么接住这次迁怒")
        : picked
        ? flowGroupHtml(`<button class="primary" data-after-caller-question type="button">再深入一句</button>`)
        : choiceGroupHtml("你先回应", (question.options ?? []).map((option) => {
            const locked = option.requiresEarnedItem && !earned.has(option.requiresEarnedItem);
            return `<button class="decision-choice" data-caller-question="${escapeHtml(option.id ?? "")}" ${locked ? "disabled" : ""} type="button">${choiceButtonBodyHtml(option.label ?? "", locked ? `缺少：${option.requiresEarnedItem}` : CHOICE_COST_META.nonScoredReply)}</button>`;
          }).join(""), "single-choice-group", "不判对错，只留下余味")
    });
    bind("[data-caller-question]", (event) => recordCallerQuestionChoice(brief, event.currentTarget?.getAttribute("data-caller-question") ?? ""));
    bind("[data-caller-question-host]", (event) => recordCallerQuestionHostChoice(brief, event.currentTarget?.getAttribute("data-caller-question-host") ?? ""));
    bind("[data-after-caller-question]", () => {
      state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderDeepFollowup(brief) {
    const state = ctx.getState();
    const issue = issueCompletion(brief);
    if (!issue.badge || !hasDeepFollowup(brief)) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    const followup = deepFollowupFor(brief, issue);
    frame({
      brief,
      mood: "focused",
      label: "深入一问",
      chapter: liveChapterTitle(brief),
      text: `
        ${hostDisclosureForAnchor(brief, "beforeDeepFollowup")}
        ${callDialogueHtml([
          { role: "host", text: followup.question },
          ...(followup.resistanceBeat?.lines ?? []),
          { role: "caller", text: followup.answer }
        ], "", { autoPairQuestions: true })}
        <p class="hint">${escapeHtml(followup.note)}</p>
      `,
      choices: flowGroupHtml(`<button class="primary" data-scene="accusation" type="button">选一句往下追</button>`)
    });
    bindSceneButtons();
  }

  function renderPatienceLost(brief) {
    frame({
      brief,
      mood: "tense",
      label: "这通断了",
      chapter: liveChapterTitle(brief),
      text: `
        ${callDialogueHtml([
          { role: "host", text: "停一下，这里接乱了。" },
          { role: "caller", text: "嗯，我刚才也乱了。我们从前面那句重新说吧。" }
        ])}
        <p class="hint">这案还没收住。回到刚才那一步重新接。</p>
      `,
      choices: flowGroupHtml(`
        <button class="primary" data-retry-lost-step type="button">从这句重来</button>
        <button data-action="title" type="button">回标题</button>
      `)
    });
    bind("[data-retry-lost-step]", () => {
      const state = ctx.getState();
      const key = state.patienceLostContext?.decisivePresentKey;
      if (key) {
        state.decisivePresentProgress = {
          ...(state.decisivePresentProgress ?? {}),
          [key]: resetDecisivePresentProgress(state.decisivePresentProgress?.[key])
        };
      }
      retryPatienceLostStep(brief);
    });
    bindSceneButtons();
  }

  function renderAccusation(brief) {
    const state = ctx.getState();
    const readiness = accusationReadinessForBrief(brief);
    if (!readiness.ready) {
      state.lastReaction = readiness.message;
      state.scene = "sceneReview";
      state.dialogueProgress = {
        ...(state.dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
      };
      saveState();
      return render();
    }
    const choices = dailyAccusationChoices(brief).filter((choice) => {
      if (!choice.requiresRevisedSceneId) return true;
      const sourceScene = (brief.sceneVersions ?? []).find((scene) => scene.id === choice.requiresRevisedSceneId);
      return Boolean(sourceScene?.revisedVersion && sceneRevisionUnlocked(brief, sourceScene.revisedVersionTriggers ?? {}));
    });
    frame({
      brief,
      mood: "tense",
      label: "收住话头",
      chapter: liveChapterTitle(brief),
      text: `
        <p><b>选一句往下追</b></p>
        <p>下面哪句最该继续追？</p>
        ${choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))}
      `,
      choices: choiceGroupHtml("往下追", choices.map((choice) => `<button class="decision-choice" data-accuse="${escapeHtml(choice.accuse)}" data-accuse-label="${escapeHtml(choice.label)}" data-accuse-response="${escapeHtml(choice.response ?? "")}" type="button">${choiceButtonBodyHtml(choice.label, CHOICE_COST_META.finalQuestion)}</button>`).join(""), "single-choice-group", "从刚才听到的话里选一句")
    });
    document.querySelectorAll("[data-accuse]").forEach((button) => {
      button.addEventListener("click", () => resolveAccusationFromButton(brief, button));
    });
    bindSceneButtons();
  }

  function bindSceneButtons() {
    document.querySelectorAll("[data-scene]").forEach((button) => {
      button.addEventListener("click", () => moveScene(button.dataset.scene));
    });
  }

  function handleSceneQuestionButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    const option = options[optionIndex] ?? options[0];
    if (!brief || !option) return;
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: nextQuestionPressureSignal(state) });
    state.pendingQuestionPressureSignal = null;
    state.pendingQuestionPressureSource = null;
    const answer = answerVariant.answer;
    markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
    markAction(brief, `version:${sceneIndex}`);
    if (option.contradiction) {
      recordContradiction(brief, option.contradiction);
      recordContradiction(brief, scene.contradiction);
    }
    else {
      state.lastReaction = questionPressureReaction({ ...option, answer }, option.routeTone ?? routeToneForChoice(option));
      state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
    }
    state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
    state.sceneAnswers = {
      ...(state.sceneAnswers ?? {}),
      [answerKey(brief, sceneIndex)]: answer
    };
    state.sceneQuestionPicks = {
      ...(state.sceneQuestionPicks ?? {}),
      [answerKey(brief, sceneIndex)]: {
        question: option.question ?? "",
        suspicionLabel: option.suspicionLabel ?? "",
        revealTransition: option.revealTransition ?? null,
        answer,
        contradiction: option.contradiction ?? "",
        routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
        routeTone: option.routeTone ?? routeToneForChoice(option),
        correct: Boolean(option.contradiction),
        guarded: answerVariant.guarded || Boolean(option.forcedGuardedAnswer),
        resistanceBeat: option.resistanceBeat ?? null,
        lines: answerVariant.guarded ? null : option.lines ?? null,
        reactionLine: option.reactionLine ?? "",
        sceneVersionKind: scene.version === brief.sceneVersions?.[sceneIndex]?.revisedVersion ? "revised" : "base"
      }
    };
    recordRouteChoice(brief, sceneIndex, option, scene);
    if (audiencePatienceLost(brief, {
      area: "sceneReview",
      index: sceneIndex,
      actionKeys: [`sceneQuestion:${sceneIndex}:${optionIndex}`, `version:${sceneIndex}`],
      answerKey: answerKey(brief, sceneIndex),
      routeIndex: sceneIndex,
      spent: !option.contradiction,
      removeQuestionPick: true
    })) return;
    state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "key", optionIndex };
    state.scene = "sceneQuestionAnswer";
    saveState();
    render();
  }

  function handleSceneDialogueButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    if (sceneUsesLineReplay(scene)) return;
    const dialogueRows = sceneDialogueOptions(scene, options);
    const option = dialogueRows[optionIndex]?.option ?? null;
    if (!brief || !option) return;
    const key = answerKey(brief, sceneIndex);
    const current = state.sceneDialoguePicks?.[key] ?? [];
    if (current.some((pick) => Number(pick.optionIndex) === Number(optionIndex))) return;
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: nextQuestionPressureSignal(state) });
    state.pendingQuestionPressureSignal = null;
    state.pendingQuestionPressureSource = null;
    state.sceneDialoguePicks = {
      ...(state.sceneDialoguePicks ?? {}),
      [key]: [
        ...current,
        {
          optionIndex,
          question: option.question ?? "",
          answer: answerVariant.answer,
          lines: answerVariant.guarded ? null : option.lines ?? null,
          routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
          routeTone: option.routeTone ?? routeToneForChoice(option),
          guarded: answerVariant.guarded,
          sceneVersionKind: scene.version === brief.sceneVersions?.[sceneIndex]?.revisedVersion ? "revised" : "base"
        }
      ]
    };
    state.lastReaction = questionPressureReaction({ ...option, answer: answerVariant.answer }, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
    state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "dialogue", optionIndex };
    state.scene = "sceneQuestionAnswer";
    saveState();
    render();
  }

  function closeSceneQuestionMenu(brief) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    state.scene = "sceneReview";
    saveState();
    render();
  }

  function sceneQuestionFocusFor(brief, sceneIndex) {
    const state = ctx.getState();
    const focus = state.sceneQuestionFocus;
    if (!focus || focus.caseId !== caseKey(brief) || Number(focus.sceneIndex) !== Number(sceneIndex)) return null;
    return focus;
  }

  function sceneChoiceContext(sceneIndex) {
    const brief = activeCaseBrief();
    const scene = sceneWithCallbackRevision(brief, brief?.sceneVersions?.[sceneIndex] ?? {}, sceneIndex);
    return {
      brief,
      scene,
      options: focusedQuestionOptions(scene.questionOptions ?? [])
    };
  }

  function recordStanceSnapshot(brief, snapshot = {}, optionIndex = 0) {
    const state = ctx.getState();
    const option = snapshot.options?.[optionIndex] ?? snapshot.options?.[0] ?? null;
    if (!option) return;
    const key = caseKey(brief);
    state.stanceSnapshots = {
      ...(state.stanceSnapshots ?? {}),
      [key]: {
        sceneIndex: snapshot.sceneIndex,
        optionIndex,
        id: option.id ?? String(optionIndex),
        label: option.label ?? "",
        summary: option.summary ?? "",
        feedback: option.feedback ?? "",
        recap: option.recap ?? snapshot.recap ?? "",
        at: Date.now()
      }
    };
    markAction(brief, `stanceSnapshot:${snapshot.sceneIndex}`);
    state.lastReaction = null;
    saveState();
    render();
  }

  function continueAfterSceneReview(brief, sceneIndex = 0) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    if (enterLiveCounterBeatAfterScene(brief, sceneIndex)) return;
    if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
      state.scene = "overnightHangup";
      saveState();
      render();
      return;
    }
    if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
      state.scene = "hangupBeat";
      saveState();
      render();
      return;
    }
    const nextIndex = nextPlayableSceneIndex(brief, sceneIndex);
    if (nextIndex >= 0) setIndex(brief, "sceneReview", nextIndex);
    else moveScene("accusation");
  }

  function recordCallerQuestionChoice(brief, choiceId = "") {
    const question = overnightCallerQuestionFor(brief);
    const choice = (question?.options ?? []).find((option) => option.id === choiceId);
    const overnight = ensureOvernight(brief);
    if (!choice) return;
    if (choice.requiresEarnedItem && !(overnight.earnedItems ?? []).includes(choice.requiresEarnedItem)) return;
    updateOvernight(brief, { callerQuestionChoiceId: choice.id, callerQuestionHostChoiceId: null, callerQuestionStanceNudge: null });
    if ((choice.hostChoices ?? []).length) {
      saveState();
      return render();
    }
    completeCallerQuestionChoice(brief, question, choice);
  }

  function recordCallerQuestionHostChoice(brief, hostChoiceId = "") {
    const question = overnightCallerQuestionFor(brief);
    const overnight = ensureOvernight(brief);
    const choice = (question?.options ?? []).find((option) => option.id === overnight.callerQuestionChoiceId);
    const hostChoice = (choice?.hostChoices ?? []).find((option) => option.id === hostChoiceId);
    if (!choice || !hostChoice) return;
    updateOvernight(brief, {
      callerQuestionHostChoiceId: hostChoice.id,
      callerQuestionStanceNudge: hostChoice.stanceNudge ?? null
    });
    completeCallerQuestionChoice(brief, question, choice, hostChoice);
  }

  function completeCallerQuestionChoice(brief, question = {}, choice = {}, hostChoice = null) {
    const state = ctx.getState();
    markAction(brief, "overnight:callerQuestion");
    recordRouteChoice(brief, keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.8, {
      question: question.prompt ?? "她的那一问",
      answer: [choice.label, hostChoice?.label].filter(Boolean).join(" / "),
      routeAxis: choice.routeAxis ?? "process-control",
      routeTone: hostChoice?.routeTone ?? "caller-question",
      stanceNudge: hostChoice?.stanceNudge ?? null
    }, { version: question.prompt ?? "" });
    state.lastReaction = choice.aftertaste ?? "";
    saveState();
    render();
  }

  return {
    renderSceneReview,
    renderSceneQuestionMenu,
    renderSceneQuestionAnswer,
    renderTestimonyWall,
    renderTestimonyMaterials,
    renderDecisivePresentTarget,
    renderDecisivePresentHit,
    renderSceneLineReplay,
    renderStatementPatienceLost,
    renderStanceSnapshot,
    renderHangupBeat,
    renderCallerQuestion,
    renderDeepFollowup,
    renderPatienceLost,
    renderAccusation,
    bindSceneButtons
  };
}
