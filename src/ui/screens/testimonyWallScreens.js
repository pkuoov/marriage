import {
  advanceTestimonyAct,
  decisivePresentAvailability,
  decisivePresentForScene,
  decisivePresentOutcome,
  decisivePresentPressure,
  normalizeDecisivePresentProgress,
  normalizeTestimonyWallProgress,
  pressTestimonyStatement,
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

export function createTestimonyWallScreens(ctx) {
  const {
    playAudioCueOnce,
    afterSceneEvidenceFor,
    answerKey,
    caseKey,
    callDialogueHtml,
    flowGroupHtml,
    saveState,
    render,
    renderSceneReview,
    liveChapterTitle,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    frame,
    consumePixelTransition,
    bind,
    bindSceneButtons,
    currentIndex,
    markAction,
    actionDone,
    recordContradiction,
    recordRouteChoice,
    recordPatienceLost
  } = ctx;

  function renderTestimonyPrelude(brief) {
    const context = testimonyContext(brief);
    const lines = context.scene?.beforeVersion?.lines ?? [];
    if (!lines.length || context.wallProgress.preludeSeen) return renderTestimonyWall(brief);
    frame({
      brief,
      mood: "focused",
      label: "新消息进来",
      chapter: liveChapterTitle(brief),
      text: `<section class="testimony-prelude-card">${callDialogueHtml(lines)}</section>`,
      choices: flowGroupHtml('<button class="primary" data-enter-testimony-wall type="button">把她刚才的话摊开</button>'),
      controlMode: "listen",
      musicPhase: "allegro"
    });
    bind("[data-enter-testimony-wall]", () => {
      writeWallProgress(context.wallKey, { ...context.wallProgress, preludeSeen: true });
      const pendingEvidence = afterSceneEvidenceFor(brief, context.index, (key) => actionDone(brief, key));
      ctx.getState().scene = pendingEvidence ? "afterSceneEvidence" : "testimonyWall";
      saveState();
      render();
    });
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
      musicPhase: context.wallProgress.act > 1 ? "pursuit" : "allegro",
      pixelTransition: context.wallProgress.act > 1 && consumePixelTransition(`${caseKey(brief)}:testimony:${context.scene.id}:act2`)
        ? { kind: "phase", visualVariant: "listen", eyebrow: "她换了一套说法", label: "改口陈述" }
        : undefined
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
    ctx.getState().lastReaction = decisiveMissReaction(context, outcome);
    ctx.getState().lastScreenEffect = "patience-drop";
    if (outcome.kind === "exhausted") {
      return recordPatienceLost(brief, {
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

  function decisiveMissReaction(context = {}, outcome = {}) {
    const defaults = {
      evidence: [
        "这张材料压不到刚才那句上。她把回答收短了。",
        "材料又没对上。她不再顺着这条回答。"
      ],
      statement: [
        "材料碰到边了，但不是这句。她开始只答半句。",
        "还是压错了原句。她把话收得更紧。"
      ]
    };
    const authored = context.wallAct?.missFeedback?.[outcome.missKind]
      ?? context.scene?.testimonyWall?.missFeedback?.[outcome.missKind]
      ?? defaults[outcome.missKind]
      ?? defaults.evidence;
    const lines = Array.isArray(authored) ? authored.filter(Boolean) : [authored].filter(Boolean);
    const index = Math.max(0, Number(outcome.progress?.attempts ?? 1) - 1);
    return lines[Math.min(index, Math.max(0, lines.length - 1))] ?? defaults.evidence[0];
  }

  function continueAfterDecisivePresent(brief) {
    const context = testimonyContext(brief);
    if (!context.finalAct) {
      advanceWallAct(context);
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

  function advanceWallAct(context = {}) {
    writeWallProgress(context.wallKey, advanceTestimonyAct(context.scene, context.wallProgress));
  }

  function writeWallProgress(key, progress) {
    const state = ctx.getState();
    state.testimonyWallProgress = { ...(state.testimonyWallProgress ?? {}), [key]: progress };
  }

  function writePresentProgress(key, progress) {
    const state = ctx.getState();
    state.decisivePresentProgress = { ...(state.decisivePresentProgress ?? {}), [key]: progress };
  }

  return {
    renderTestimonyPrelude,
    renderTestimonyWall,
    renderTestimonyMaterials,
    renderDecisivePresentTarget,
    renderDecisivePresentHit,
    testimonyContext,
    decisiveProgress,
    advanceWallAct
  };
}
