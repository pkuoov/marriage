export function createInterludeScreens(ctx) {
  const {
    playAudioCueOnce,
    consumePixelTransition,
    audioCueView,
    materialOperationOutcome,
    latestChoiceReviewRowsForState,
    selectedDelegationPickForState,
    selectedEvidencePickForState,
    selectedInvestigationPickForState,
    unlockedInvestigationEntriesForState,
    investigationPickReaction,
    materialPressureReaction,
    materialPressureSignal,
    afterSceneEvidenceFor,
    answerKey,
    caseKey,
    delegationFor,
    delegationOutcomeFor,
    delegationRouteAxisForAdvisor,
    evidenceAnswerKey,
    evidenceCheckModel,
    evidenceChecksFor,
    interludeEarnedItemsForOvernight,
    investigationAnswerKey,
    investigationBackflowModel,
    investigationRouteIndexBase,
    keyQuestionLimit,
    nextPlayableSceneIndex,
    nightActionById,
    nightStructureFor,
    overnightStructureFor,
    shouldEnterHangupAfterScene,
    shouldEnterOvernightHangupAfterScene,
    CHOICE_COST_META,
    choiceButtonBodyHtml,
    choiceReviewHtml,
    flowGroupHtml,
    delegationScreenHtml,
    evidenceCheckScreenHtml,
    investigationBackflowScreenHtml,
    interludeDeskHtml,
    interludeDialogueActionHtml,
    interludePlaybackActionHtml,
    interruptToastHtml,
    replyChoicesHtml,
    CONTENT_ADVISORS,
    saveState,
    render,
    liveChapterTitle,
    renderSceneReview,
    renderAccusation,
    hostDisclosureForAnchor,
    frame,
    dayFrame,
    bind,
    bindSceneButtons,
    enterLiveCounterBeatAfterScene,
    moveScene,
    setIndex,
    setIndexValue,
    currentIndex,
    issueCompletion,
    markAction,
    recordPatienceLost,
    actionDone,
    ensureBudget,
    ensureNight,
    ensureOvernight,
    updateNight,
    updateOvernight,
    interludeActionState,
    completeInterludeAction,
    nextPendingInterruptAction,
    countCompletedInterludeActions,
    recordInterludeActionChoice,
    recordInterludeReplyChoice,
    closeInterludeAction,
    recordContradiction,
    recordRouteChoice,
    sceneAfterEvidenceFor,
    hasDeepFollowup,
    materialPityLineFor,
    escapeHtml
  } = ctx;

  function renderInterludeDesk(brief) {
    const state = ctx.getState();
    const structure = nightStructureFor(brief);
    if (!structure) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const night = ensureNight(brief);
    const activeAction = nightActionById(brief, night.activeActionId);
    if (activeAction) return renderInterludeAction(brief, activeAction);
    const interrupt = nextPendingInterruptAction(brief, night);
    if (interrupt) return renderInterludeInterruptToast(brief, interrupt);
    const interlude = structure.interlude ?? {};
    const actionStates = (interlude.actions ?? [])
      .filter((action) => action.kind !== "interruptToast")
      .map((action) => interludeActionState(structure, night, action));
    const doneCount = countCompletedInterludeActions(brief, night);
    const canReturn = doneCount >= Number(interlude.minActions ?? 0);
    dayFrame({
      brief,
      backdropClass: "day-city",
      label: "收麦后",
      chapter: "回拨前",
      text: interludeDeskHtml({ interlude, night, actionStates, canReturn }),
      choices: flowGroupHtml(`
        ${canReturn ? `<button class="primary" data-callback-ready type="button">${escapeHtml(interlude.continueLabel ?? "回拨她")}</button>` : ""}
      `)
    });
    bind("[data-interlude-action]", (event) => {
      const actionId = event.currentTarget?.getAttribute("data-interlude-action") ?? "";
      updateNight(brief, { activeActionId: actionId });
      saveState();
      render();
    });
    bind("[data-callback-ready]", () => {
      if (overnightStructureFor(brief)) {
        const overnight = ensureOvernight(brief);
        const syncedItems = interludeEarnedItemsForOvernight(brief, ensureNight(brief).inventory);
        updateOvernight(brief, {
          earnedItems: [...new Set([...(overnight.earnedItems ?? []), ...syncedItems])]
        });
      }
      state.scene = overnightStructureFor(brief) ? "dayActOpening" : "callbackOpener";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderInterludeAction(brief, action) {
    if (action.kind === "delegation") return renderInterludeDelegation(brief, action);
    if (action.kind === "evidencePass") return renderInterludeEvidence(brief, action);
    if (action.kind === "backflowEarly") return renderInterludeBackflow(brief, action);
    if (action.kind === "advisorCall") return renderInterludeAdvisorCall(brief, action);
    if (action.kind === "interruptToast") return renderInterludeInterruptToast(brief, action);
    if (action.kind === "playback") return renderInterludePlayback(brief, action);
    completeInterludeAction(brief, action);
  }

  function renderInterludeDelegation(brief, action) {
    const state = ctx.getState();
    const delegation = delegationFor(brief);
    const pick = selectedDelegationPickForState(state, brief);
    if (!delegation) return completeInterludeAction(brief, action);
    dayFrame({
      brief,
      backdropClass: "day-document",
      label: pick ? "顾问回单" : "送鉴定",
      chapter: "回拨前",
      text: delegationScreenHtml({
        delegation,
        advisors: CONTENT_ADVISORS,
        pick,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: flowGroupHtml(`
        ${pick ? `<button class="primary" data-return-interlude type="button">回调查台</button>` : `<button data-return-interlude type="button">先放下</button>`}
      `)
    });
    bindDelegationButtons(brief, delegation, { interludeAction: action });
    bind("[data-return-interlude]", () => closeInterludeAction(brief));
    bindSceneButtons();
  }

  function renderInterludeEvidence(brief, action) {
    const state = ctx.getState();
    const checkIndex = evidenceChecksFor(brief).findIndex((check) => action.focusCheckIds?.includes(check.id));
    const safeIndex = checkIndex >= 0 ? checkIndex : 0;
    const check = evidenceChecksFor(brief)[safeIndex] ?? null;
    const pick = selectedEvidencePickForState(state, brief, safeIndex);
    if (!check) return completeInterludeAction(brief, action);
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "重看材料",
      chapter: "回拨前",
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index: safeIndex,
        hostName: state.playerName,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-return-interlude type="button">回调查台</button>`)
        : ""
    });
    bindEvidenceCheckButtons(brief, check, { interludeAction: action });
    bind("[data-return-interlude]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludeBackflow(brief, action) {
    const state = ctx.getState();
    const hookIndex = (brief.investigationHooks ?? []).findIndex((hook) => hook.id === action.hookId);
    const hook = brief.investigationHooks?.[hookIndex] ?? null;
    const pick = selectedInvestigationPickForState(state, brief, hookIndex);
    const replyChoices = action.replyChoices ?? hook?.replyChoices ?? [];
    const replyChoiceId = ensureNight(brief).interludeReplyChoices?.[action.id] ?? "";
    const needsReply = pick && replyChoices.length && !replyChoiceId;
    if (!hook) return completeInterludeAction(brief, action);
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "后台私信",
      chapter: "回拨前",
      text: `${investigationBackflowScreenHtml({
        hook,
        pick,
        index: hookIndex,
        hostName: state.playerName,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      })}${pick ? replyChoicesHtml(replyChoices, replyChoiceId) : ""}`,
      choices: pick
        ? flowGroupHtml(`${needsReply ? "" : `<button class="primary" data-return-interlude type="button">回调查台</button>`}`)
        : ""
    });
    bindInvestigationButtons(brief, hook, hookIndex, { interludeAction: action });
    bind("[data-reply-choice]", (event) => recordInterludeReplyChoice(brief, action, replyChoices, event.currentTarget?.getAttribute("data-reply-choice") ?? ""));
    bind("[data-return-interlude]", () => closeInterludeAction(brief));
    bindSceneButtons();
  }

  function renderInterludeAdvisorCall(brief, action) {
    const night = ensureNight(brief);
    const followupAsked = Boolean(night.interludeFollowups?.[action.id]);
    const cueId = action.script?.audioCueId ?? action.audioCueId ?? "";
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-city",
      label: action.label ?? "幕间通话",
      chapter: "回拨前",
      text: interludeDialogueActionHtml(action, followupAsked, audioCueView(cueId)),
      choices: flowGroupHtml(`
        ${action.script?.followupQuestion && !followupAsked ? `<button data-interlude-followup="${escapeHtml(action.id)}" type="button">追一问</button>` : ""}
        <button class="primary" data-complete-interlude-action type="button">记下回调查台</button>
      `),
      keepVoiceCueId: cueId
    });
    bind("[data-interlude-followup]", (event) => {
      const actionId = event.currentTarget?.getAttribute("data-interlude-followup") ?? "";
      updateNight(brief, {
        interludeFollowups: {
          ...(ensureNight(brief).interludeFollowups ?? {}),
          [actionId]: true
        }
      });
      saveState();
      render();
    });
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludePlayback(brief, action) {
    const cueId = action.script?.audioCueId ?? action.audioCueId ?? "";
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "听回放",
      chapter: "回拨前",
      text: interludePlaybackActionHtml(action, audioCueView(cueId)),
      choices: flowGroupHtml(`<button class="primary" data-complete-interlude-action type="button">记下回调查台</button>`),
      keepVoiceCueId: cueId
    });
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludeInterruptToast(brief, action) {
    const night = ensureNight(brief);
    const selectedChoiceId = night.interludeActionChoices?.[action.id] ?? "";
    const hasChoices = (action.choices ?? []).length > 0;
    const transitionKey = `${caseKey(brief)}:interrupt:${action.id}:reveal`;
    const pixelTransition = action.revealTransition?.id && consumePixelTransition?.(transitionKey)
      ? { ...action.revealTransition, kind: "reveal", evidenceArtSrc: brief.evidenceBoard ?? action.revealTransition.evidenceArtSrc ?? "" }
      : null;
    playAudioCueOnce("sfx.message.notification", `${caseKey(brief)}:interrupt:${action.id}`);
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-city",
      label: "后台打断",
      chapter: "回拨前",
      text: interruptToastHtml(action, selectedChoiceId),
      pixelTransition,
      choices: flowGroupHtml(`
        ${!hasChoices && !selectedChoiceId ? `<button class="primary" data-complete-interlude-action type="button">稍后处理</button>` : ""}
        ${selectedChoiceId ? `<button class="primary" data-return-interlude type="button">回调查台</button>` : ""}
      `)
    });
    bind("[data-interrupt-choice]", (event) => recordInterludeActionChoice(brief, action, event.currentTarget?.getAttribute("data-interrupt-choice") ?? ""));
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bind("[data-return-interlude]", () => closeInterludeAction(brief));
    bindSceneButtons();
  }

  function renderAfterSceneEvidence(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const afterScene = afterSceneEvidenceFor(brief, sceneIndex, (key) => actionDone(brief, key));
    if (!afterScene?.check) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const { check, checkIndex } = afterScene;
    const pick = selectedEvidencePickForState(state, brief, checkIndex);
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      label: afterScene.label ?? "看材料",
      chapter: liveChapterTitle(brief),
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index: checkIndex,
        hostName: state.playerName,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-scene-evidence type="button">${escapeHtml(afterScene.continueLabel ?? "继续听")}</button>`)
        : ""
    });
    bindEvidenceCheckButtons(brief, check, { afterSceneIndex: sceneIndex });
    bind("[data-after-scene-evidence]", () => continueAfterSceneEvidence(brief, sceneIndex));
    bindSceneButtons();
  }

  function renderEvidenceCheck(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
    const model = evidenceCheckModel({
      brief,
      index,
      pick: selectedEvidencePickForState(state, brief, index),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const { check, pick, lastCheck, nextStage, nextLabel } = model;
    const effectiveNextStage = lastCheck ? sceneAfterEvidenceFor(brief) : nextStage;
    const effectiveNextLabel = effectiveNextStage === "callerQuestion"
      ? "听她问完"
      : effectiveNextStage === "deepFollowup"
        ? "再深入一句"
        : nextLabel;
    if (model.missing) {
      state.scene = sceneAfterEvidenceFor(brief);
      saveState();
      return render();
    }
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      label: "看材料",
      chapter: liveChapterTitle(brief),
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index,
        hostName: state.playerName,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(lastCheck
          ? `<button class="primary" data-scene="${effectiveNextStage}" type="button">${effectiveNextLabel}</button>`
          : `<button class="primary" data-next-evidence-check type="button">继续看材料</button>`)
        : ""
    });
    bindEvidenceCheckButtons(brief, check);
    bind("[data-next-evidence-check]", () => setIndex(brief, "evidenceCheck", index + 1));
    bindSceneButtons();
  }

  function renderInvestigationBackflow(brief) {
    const state = ctx.getState();
    const model = investigationBackflowModel({
      entries: unlockedInvestigationEntriesForState(state, brief),
      selectedPick: (index) => selectedInvestigationPickForState(state, brief, index)
    });
    const { hook, pick, index, nextLabel } = model;
    if (model.missing) {
      state.scene = "caseSolved";
      saveState();
      return render();
    }
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      label: "后台私信",
      chapter: liveChapterTitle(brief),
      text: `
        ${investigationBackflowScreenHtml({
          hook,
          pick,
          index,
          hostName: state.playerName,
          reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
        })}
        ${pick ? hostDisclosureForAnchor(brief, "afterBackflow") : ""}
      `,
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-investigation type="button">${nextLabel}</button>`)
        : ""
    });
    bindInvestigationButtons(brief, hook, index);
    bind("[data-after-investigation]", () => moveScene("caseSolved"));
    bindSceneButtons();
  }

  function renderDelegation(brief) {
    const state = ctx.getState();
    const delegation = delegationFor(brief);
    const pick = selectedDelegationPickForState(state, brief);
    if (!delegation || !delegation.material || actionDone(brief, "delegation") && !pick) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    if (pick?.skipped) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    frame({
      brief,
      mood: pick ? "focused" : "thinking",
      label: pick ? "顾问回单" : "后台委托",
      chapter: liveChapterTitle(brief),
      text: delegationScreenHtml({
        delegation,
        advisors: CONTENT_ADVISORS,
        pick,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-delegation type="button">选一句往下追</button>`)
        : flowGroupHtml(`<button class="decision-choice" data-skip-delegation type="button">${choiceButtonBodyHtml("先不送", CHOICE_COST_META.skipAdvisor)}</button>`)
    });
    bindDelegationButtons(brief, delegation);
    bind("[data-skip-delegation]", () => skipDelegation(brief));
    bind("[data-after-delegation]", () => {
      state.scene = "accusation";
      saveState();
      renderAccusation(brief);
    });
    bindSceneButtons();
  }

  function bindEvidenceCheckButtons(brief, check = {}, context = {}) {
    const state = ctx.getState();
    document.querySelectorAll("[data-evidence-check]").forEach((button) => {
      button.addEventListener("click", () => {
        const [checkIndex, optionIndex] = button.dataset.evidenceCheck.split(":").map(Number);
        const outcome = materialOperationOutcome(check, checkIndex, optionIndex);
        playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:evidence:${checkIndex}:${optionIndex}`);
        markAction(brief, `evidenceCheck:${checkIndex}:${optionIndex}`, { spend: outcome.spend });
        markAction(brief, `evidenceCheck:${checkIndex}`);
        if (outcome.contradiction) {
          recordContradiction(brief, outcome.contradiction);
        }
        state.evidenceCheckPicks = {
          ...(state.evidenceCheckPicks ?? {}),
          [evidenceAnswerKey(brief, checkIndex)]: evidencePickWithRevision(brief, outcome.pick)
        };
        recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, outcome.routeChoice, { version: check.material ?? "" });
        state.lastReaction = materialPressureReaction(outcome, check);
        state.lastPressureSignal = materialPressureSignal(outcome);
        state.lastPityLine = materialPityLineFor(brief, check, checkIndex, outcome);
        if (outcome.correct) state.lastScreenEffect = "material-hit";
        state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
        if (context.interludeAction) {
          completeInterludeAction(brief, context.interludeAction, { renderNow: false });
          saveState();
          return render();
        }
        if (outcome.spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
          area: Number.isInteger(context.afterSceneIndex) ? "afterSceneEvidence" : "evidenceCheck",
          index: checkIndex,
          actionKeys: [
            `evidenceCheck:${checkIndex}:${optionIndex}`,
            `evidenceCheck:${checkIndex}`,
          ],
          answerKey: evidenceAnswerKey(brief, checkIndex),
          routeIndex: keyQuestionLimit(brief) + checkIndex,
          spent: true,
          removeEvidencePick: true
        });
        saveState();
        render();
      });
    });
  }

  function continueAfterSceneEvidence(brief, sceneIndex = 0) {
    const state = ctx.getState();
    markAction(brief, `afterScene:${sceneIndex}`);
    if (enterLiveCounterBeatAfterScene(brief, sceneIndex)) return;
    if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
      state.scene = "overnightHangup";
      saveState();
      return render();
    }
    if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
      state.scene = "hangupBeat";
      saveState();
      return render();
    }
    const nextSceneIndex = nextPlayableSceneIndex(brief, sceneIndex);
    if (nextSceneIndex >= 0) {
      setIndexValue(brief, "sceneReview", nextSceneIndex);
      state.scene = "sceneReview";
    } else {
      state.scene = sceneAfterEvidenceFor(brief);
    }
    saveState();
    render();
  }

  function evidencePickWithRevision(brief, pick = {}) {
    if (!pick.correct || pick.revisesScene === undefined) return pick;
    const scene = brief?.sceneVersions?.[Number(pick.revisesScene)] ?? null;
    if (!scene?.revisedVersion) return pick;
    return {
      ...pick,
      revisedVersion: scene.revisedVersion
    };
  }

  function bindInvestigationButtons(brief, hook = {}, hookIndex = 0, context = {}) {
    const state = ctx.getState();
    document.querySelectorAll("[data-evidence-check]").forEach((button) => {
      button.addEventListener("click", () => {
        const optionIndex = Number(button.dataset.evidenceCheck.split(":")[1] ?? 0);
        const outcome = materialOperationOutcome(hook, hookIndex, optionIndex);
        playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:investigation:${hookIndex}:${optionIndex}`);
        const spend = hook.spendOnMiss === true && outcome.spend;
        markAction(brief, `investigation:${hookIndex}:${optionIndex}`, { spend });
        markAction(brief, `investigation:${hookIndex}`);
        if (outcome.contradiction) {
          recordContradiction(brief, outcome.contradiction);
        }
        state.investigationPicks = {
          ...(state.investigationPicks ?? {}),
          [investigationAnswerKey(brief, hookIndex)]: outcome.pick
        };
        recordRouteChoice(
          brief,
          investigationRouteIndexBase(brief) + hookIndex,
          {
            ...outcome.routeChoice,
            routeAxis: hook.routeAxis ?? outcome.routeChoice.routeAxis,
            routeTone: outcome.correct ? "backflow-hit" : "backflow-miss"
          },
          { version: hook.material ?? "" }
        );
        state.lastReaction = investigationPickReaction(outcome, hook);
        state.lastPressureSignal = materialPressureSignal(outcome);
        if (outcome.correct) state.lastScreenEffect = "material-hit";
        state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
        if (context.interludeAction) {
          const replyChoices = context.interludeAction.replyChoices ?? hook.replyChoices ?? [];
          if (!replyChoices.length) {
            completeInterludeAction(brief, context.interludeAction, { renderNow: false });
          }
          saveState();
          return render();
        }
        if (spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
          area: "investigationBackflow",
          index: hookIndex,
          actionKeys: [`investigation:${hookIndex}:${optionIndex}`, `investigation:${hookIndex}`],
          answerKey: investigationAnswerKey(brief, hookIndex),
          routeIndex: investigationRouteIndexBase(brief) + hookIndex,
          spent: true,
          removeInvestigationPick: true
        });
        saveState();
        render();
      });
    });
  }

  function bindDelegationButtons(brief, delegation = {}, context = {}) {
    document.querySelectorAll("[data-delegation-advisor]").forEach((button) => {
      button.addEventListener("click", () => recordDelegationPick(brief, delegation, button.dataset.delegationAdvisor ?? "", context));
    });
  }

  function recordDelegationPick(brief, delegation = {}, advisorId = "", context = {}) {
    const state = ctx.getState();
    const outcome = delegationOutcomeFor(delegation, advisorId);
    const advisor = CONTENT_ADVISORS[advisorId] ?? {};
    if (!outcome || !advisor.id) return;
    const key = caseKey(brief);
    const material = delegation.material ?? {};
    const advisorBadge = [advisor.name, advisor.domain].filter(Boolean).join(" · ");
    state.delegationPicks = {
      ...(state.delegationPicks ?? {}),
      [key]: {
        advisorId,
        advisorBadge,
        material,
        tone: outcome.tone ?? "",
        text: outcome.text ?? "",
        skipped: false,
        at: Date.now()
      }
    };
    markAction(brief, "delegation");
    recordRouteChoice(brief, delegationRouteIndexFor(brief), {
      question: `委托${advisor.name ?? "顾问"}看${material.label ?? "后台材料"}`,
      answer: outcome.text ?? "",
      routeAxis: delegationRouteAxisForAdvisor(advisorId),
      routeTone: `delegation-${outcome.tone ?? "partial"}`
    }, { version: material.label ?? "" });
    if (context.interludeAction) {
      completeInterludeAction(brief, context.interludeAction, { renderNow: false });
    }
    state.lastReaction = "回单到了，先看这句。";
    saveState();
    render();
  }

  function skipDelegation(brief) {
    const state = ctx.getState();
    const key = caseKey(brief);
    state.delegationPicks = {
      ...(state.delegationPicks ?? {}),
      [key]: {
        skipped: true,
        at: Date.now()
      }
    };
    markAction(brief, "delegation");
    state.scene = "accusation";
    saveState();
    renderAccusation(brief);
  }

  function delegationRouteIndexFor(brief = {}) {
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length - 0.5;
  }

  return {
    renderInterludeDesk,
    renderInterludeAction,
    renderInterludeDelegation,
    renderInterludeEvidence,
    renderInterludeBackflow,
    renderInterludeAdvisorCall,
    renderInterludePlayback,
    renderInterludeInterruptToast,
    renderAfterSceneEvidence,
    renderEvidenceCheck,
    renderInvestigationBackflow,
    renderDelegation
  };
}
