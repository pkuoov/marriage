export function createRecapScreens(ctx) {
  const {
    contradictionsForState,
    routeAxisProfileForState,
    routeChoicesForState,
    selectedEvidencePicksForState,
    selectedInvestigationPicksForState,
    truthBoundaryMissesForState,
    truthBoundaryPicksForState,
    finalQuoteComparison,
    issueLine,
    issueResultLine,
    recapRankLabel,
    truthBoundaryAftertaste,
    truthBoundaryReview,
    caseKey,
    investigationRouteIndexBase,
    keyQuestionLimit,
    liveCounterBeatsFor,
    nightStructureFor,
    overnightCallerQuestionFor,
    storyInterludeCaseId,
    storyOptionalQuickCall,
    careChoiceById,
    careChoicesFor,
    epilogueUnreadStage,
    normalizedCafePrologueProgress,
    cafePrologueStatementReady,
    cafePrologueCanPresentEvidence,
    cafePrologueRevisedStatementReady,
    cafePrologueCanPresentRevisionEvidence,
    cafePrologueRevisionEvidenceHit,
    cafePrologueRemainingEvidenceId,
    cafePrologueCanOpenForensic,
    cafePrologueSceneForStep,
    hostDisclosureLinesForAnchor,
    storyBoundaryRows,
    storyMaterialRows,
    storyPackSummaryModel,
    storyPressureRows,
    callDialogueHtml,
    flowGroupHtml,
    dailyCompleteChoicesHtml,
    dailyCompleteHtml,
    dailyCompleteShareText,
    finalQuoteComparisonHtml,
    solvedRecapFlowView,
    solvedRecapPagesHtml,
    routeTrailHtml,
    storyInterludeChoicesHtml,
    storyInterludeHtml,
    storyInterludeStageHtml,
    storyWorldEchoStageHtml,
    caseBridgeChoicesHtml,
    caseBridgeHtml,
    caseClosingChoicesHtml,
    caseClosingHtml,
    caseTitleChoicesHtml,
    caseTitleHtml,
    careChoiceContinueHtml,
    careChoiceHtml,
    epilogueUnreadContinueHtml,
    epilogueUnreadHtml,
    cafePrologueHeaderHtml,
    cafePrologueDialogueHtml,
    cafeProloguePortraitStageHtml,
    cafeRevisionStatusHtml,
    cafeMaterialPromptHtml,
    cafeStatementReplayHtml,
    cafeEvidencePairHtml,
    cafeSingleEvidenceHtml,
    cafeTransferPresentHtml,
    cafeLegalRequestsHtml,
    cafeInvestigationChoicesHtml,
    cafeAccountBoardHtml,
    cafeFinalBoundaryHtml,
    storyPackCompleteHtml,
    storyPackShareText,
    CONTENT_ADVISORS,
    storyPackForKey,
    saveState,
    isStoryPackMode,
    storyKeyFromUrl,
    returnToTitle,
    render,
    liveChapterTitle,
    nightShellForBrief,
    nightShellInterludeForBrief,
    nightShellGoodEnding,
    nightShellEndingKey,
    frame,
    hostPortraitLayer,
    liveCommentStrip,
    compactDialogueLines,
    bind,
    bindSceneButtons,
    stanceSnapshotPickForState,
    liveCounterPickForState,
    moveScene,
    currentIndex,
    normalizedDailyResult,
    issueCompletion,
    markAction,
    actionDone,
    routeProfileForBrief,
    postDailySharePayload,
    isFinalStoryPackCase,
    advanceToNextStoryPackCase,
    resetCaseAttempt,
    startQuickDetective,
    ensureBudget,
    dailyConclusion,
    escapeHtml
  } = ctx;

  function renderCaseOpen(brief) {
    const lines = compactDialogueLines(brief.openingDialogue ?? []);
    frame({
      brief,
      mood: "listening",
      label: "直播连线",
      chapter: liveChapterTitle(brief),
      text: callDialogueHtml(lines, "", { autoPairQuestions: true }),
      choices: flowGroupHtml(`<button class="primary" data-scene="sceneReview" type="button">听她接着说</button>`)
    });
    bindSceneButtons();
  }

  function renderNightShellPrologue(brief) {
    const state = ctx.getState();
    const prologue = nightShellForBrief(brief)?.prologue ?? {};
    const coldOpen = prologue.coldOpen ?? null;
    const entryActionKey = prologue.entryActionKey ?? null;
    const coldOpenDone = coldOpen
      ? actionDone(brief, coldOpen.actionKey ?? "golden-90-first-interest")
      : true;
    const entryDone = !entryActionKey
      || coldOpenDone
      || actionDone(brief, entryActionKey);
    const regularLines = [...(prologue.lines ?? []), prologue.hostLine].filter(Boolean);
    let lines = regularLines;
    let label = "开播前";
    let choices = flowGroupHtml(
      `<button class="primary" data-start-night-broadcast type="button">${escapeHtml(prologue.entryActionLabel ?? "开始直播")}</button>`
    );
    if (entryDone && coldOpen && !coldOpenDone) {
      lines = [...(coldOpen.setupLines ?? []), coldOpen.line, ...(coldOpen.baitComments ?? [])].filter(Boolean);
      label = "第一通来电";
      choices = flowGroupHtml(
        `<button class="primary" data-reveal-cold-open type="button">${escapeHtml(coldOpen.actionLabel ?? "听完这条语音")}</button>`
      );
    } else if (entryDone) {
      lines = coldOpen ? [...(coldOpen.interestLines ?? [])] : regularLines;
      label = coldOpen ? "第一通来电" : "开播前";
      choices = flowGroupHtml(
        `<button class="primary" data-enter-first-case type="button">接入第一通来电</button>`,
        { label: "直播已经开始", note: "第一位咨询者正在等待接通。" }
      );
    }
    const commentLines = lines.filter((line) => typeof line === "object" && line?.type === "comment");
    const dialogueLines = lines.filter((line) => typeof line !== "object" || line?.type !== "comment");
    frame({
      brief,
      mood: "focused",
      label,
      chapter: "晚间热线",
      showCaseHud: false,
      visualHud: `${hostPortraitLayer()}${liveCommentStrip({ comments: commentLines.map((line) => line.text).filter(Boolean) })}`,
      screenClass: "night-shell-prologue-screen",
      text: nightShellHtml(dialogueLines),
      choices
    });
    bind("[data-start-night-broadcast]", () => {
      if (entryActionKey) markAction(brief, entryActionKey, { spend: false });
      saveState();
      render();
    });
    bind("[data-reveal-cold-open]", () => {
      markAction(brief, coldOpen.actionKey ?? "golden-90-first-interest", { spend: false });
      saveState();
      render();
    });
    bind("[data-enter-first-case]", () => {
      state.scene = "caseTitle";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderNightShellEpilogue(brief) {
    const state = ctx.getState();
    const epilogue = nightShellForBrief(brief)?.epilogue ?? {};
    const resultLine = epilogue[nightShellEndingKey?.() ?? (nightShellGoodEnding() ? "good" : "bad")]
      ?? (nightShellGoodEnding() ? epilogue.good : epilogue.bad);
    const stage = epilogueUnreadStage(epilogue, state.careChoices, state.epilogueUnreadStep);
    const currentIndex = stage.visibleMessages.length - 1;
    const lines = stage.complete
      ? [resultLine, epilogue.home, epilogue.close].filter(Boolean)
      : [];
    const openingHtml = nightShellHtml([epilogue.opening].filter(Boolean));
    const unreadHtml = epilogueUnreadHtml({ messages: stage.visibleMessages, currentIndex });
    frame({
      brief,
      mood: "focused",
      label: stage.complete ? "天亮前" : "收播后 · 后台未读",
      chapter: "深夜档",
      showCaseHud: false,
      visualHud: stage.complete ? endingCgStageHtml(epilogue.closingCg) : "",
      screenClass: `night-epilogue-screen${stage.complete && epilogue.closingCg?.src ? " has-ending-cg" : ""}`,
      text: stage.complete ? `${openingHtml}${nightShellHtml(lines)}` : `${openingHtml}${unreadHtml}`,
      choices: flowGroupHtml(stage.complete
        ? `<button class="primary" data-finish-night-shell type="button">收麦</button>`
        : epilogueUnreadContinueHtml({ visibleCount: stage.visibleMessages.length, total: stage.messages.length }))
    });
    bind("[data-epilogue-unread-next]", () => {
      state.epilogueUnreadStep = Math.min(stage.messages.length + 1, stage.index + 1);
      saveState();
      render();
    });
    bind("[data-finish-night-shell]", () => {
      const cafePrologue = nightShellForBrief(brief)?.cafePrologue;
      const progress = normalizedCafePrologueProgress(state);
      if (cafePrologue && progress.step === 7 && cafePrologueCanOpenForensic(progress)) {
        setCafePrologueStep(state, 8);
        return;
      }
      if (cafePrologue && progress.step < 7) {
        moveScene(cafePrologueSceneForStep(progress.step));
        return;
      }
      moveScene("runComplete");
    });
    bindSceneButtons();
  }

  function renderCafePrologue(brief) {
    const state = ctx.getState();
    const prologue = nightShellForBrief(brief)?.cafePrologue ?? {};
    const cafe = prologue.cafe ?? {};
    const progress = normalizedCafePrologueProgress(state);
    const step = Math.min(5, progress.step);
    const correctStatement = (cafe.claimStatements ?? []).find((statement) => statement.correct)
      ?? (cafe.claimStatements ?? []).find((statement) => statement.id === "hotel-denial");
    const revisedCorrectStatement = (cafe.revisedClaimStatements ?? []).find((statement) => statement.correct)
      ?? (cafe.revisedClaimStatements ?? []).find((statement) => statement.id === "money-denial");
    const firstEvidence = (cafe.evidencePair ?? []).find((evidence) => evidence.id === (progress.marks[0] ?? progress.evidenceId));
    const allEvidence = [...(cafe.evidencePair ?? []), cafe.transferEvidence].filter(Boolean);
    let text = cafePrologueHeaderHtml({ timeline: prologue.timeline, title: prologue.title, subtitle: prologue.subtitle });
    let choices = "";

    if (step === 0) {
      text += cafePrologueDialogueHtml(progress.statementReaction
        ? [{
            speaker: "妻子",
            speakerProfileId: "prologue-cafe-wife",
            type: "participant",
            text: (cafe.claimStatements ?? []).find((statement) => statement.id === progress.statementReaction)?.missLine ?? "你要问哪句，就把那句说清楚。"
          }]
        : cafe.openingLines ?? []);
      choices = `
        <section class="cafe-opening-action" aria-label="咖啡厅对质">
          ${cafeStatementReplayHtml({
            statements: cafe.claimStatements,
            selectedId: progress.statementId,
            reactionId: "",
            label: "第一段说法"
          })}
          ${cafeMaterialPromptHtml({ evidencePair: cafe.evidencePair })}
        </section>
      `;
    } else if (step === 1) {
      choices = flowGroupHtml(`
        ${cafeEvidencePairHtml(cafe.evidencePair ?? [], progress.evidenceId, correctStatement?.text ?? cafe.firstClaim)}
        <button class="primary" data-cafe-evidence-present type="button"${cafePrologueCanPresentEvidence(progress, correctStatement?.id) ? "" : " disabled"}>出示此份材料</button>
      `);
    } else if (step === 2) {
      text += cafeRevisionStatusHtml({ title: "她改口了", note: "第二段说法" });
      const revisedReaction = (cafe.revisedClaimStatements ?? []).find((statement) => statement.id === progress.statementReaction)?.missLine;
      text += cafePrologueDialogueHtml(revisedReaction
        ? [{ speaker: "妻子", speakerProfileId: "prologue-cafe-wife", type: "participant", text: revisedReaction }]
        : [...(firstEvidence?.hitLines ?? []), ...(cafe.revisedAccountLines ?? [])]);
      choices = `
        <section class="cafe-opening-action cafe-revised-action" aria-label="第二段说法">
          ${cafeStatementReplayHtml({
            statements: cafe.revisedClaimStatements,
            selectedId: progress.statementId,
            reactionId: "",
            label: "她刚改口的几句"
          })}
          ${cafeMaterialPromptHtml({ evidencePair: allEvidence, usedIds: progress.marks, label: "桌上材料" })}
        </section>
      `;
    } else if (step === 3) {
      text += cafeRevisionStatusHtml({ title: "第二段说法", note: revisedCorrectStatement?.text ?? cafe.moneyClaim });
      const revisedPresentLines = progress.evidenceReaction
        ? (cafe.revisedEvidenceMissLines?.[progress.evidenceReaction] ?? [])
        : (progress.evidenceId ? [] : (cafe.revisedPresentLeadLines ?? []));
      if (revisedPresentLines.length) {
        text += cafePrologueDialogueHtml(revisedPresentLines);
      }
      choices = flowGroupHtml(`
        ${cafeEvidencePairHtml(allEvidence, progress.evidenceId, revisedCorrectStatement?.text ?? cafe.moneyClaim)}
        <button class="primary" data-cafe-revised-present type="button"${cafePrologueCanPresentRevisionEvidence(progress, revisedCorrectStatement?.id) ? "" : " disabled"}>出示此份材料</button>
      `);
    } else if (step === 4) {
      text += cafePrologueDialogueHtml([
        ...(cafe.transferHitLines ?? []),
        ...(cafe.legalClaimLines ?? [])
      ]);
      choices = flowGroupHtml(`
        ${cafeLegalRequestsHtml({
          ...(cafe.legalRequests ?? {}),
          items: (cafe.legalRequests?.items ?? []).filter((item) => ["divorce-evidence", "marital-property"].includes(item.id))
        })}
        <button class="primary" data-cafe-legal-brief type="button">赵，把离婚和家账记下来</button>
      `);
    } else {
      text += cafePrologueDialogueHtml([
        ...(cafe.parentageBlockLines ?? []),
        ...(cafe.cameraBreakLines ?? [])
      ]);
      choices = flowGroupHtml((cafe.pressureChoices ?? []).map((choice) => `
        <button class="secondary" data-cafe-pressure="${escapeHtml(choice.id)}" type="button">
          <b>${escapeHtml(choice.label)}</b><span>${escapeHtml(choice.note)}</span>
        </button>
      `).join(""), {
        label: "表哥手里也录了一份",
        note: "关掉桌边录像继续谈，还是结束这次谈判？"
      });
    }

    frame({
      brief,
      mood: "focused",
      label: step < 5 ? "开播前 · 咖啡厅" : "咖啡厅 · 录像中断",
      chapter: "试玩序章",
      showCaseHud: false,
      visualHud: cafeProloguePortraitStageHtml({ activeRole: [0, 2].includes(step) ? "wife" : "" }),
      backdropClass: prologue.backdropClass ?? "day-cafe",
      screenClass: `cafe-prologue-screen cafe-prologue-step-${step}`,
      text,
      choices,
      pixelTransition: step === 0 ? { kind: "soft-fade" } : undefined
    });

    document.querySelectorAll("[data-cafe-statement-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-cafe-statement-id") ?? "";
        const revisedAct = step === 2;
        const statements = revisedAct ? (cafe.revisedClaimStatements ?? []) : (cafe.claimStatements ?? []);
        const statement = statements.find((item) => item.id === id);
        if (!statement) return;
        if (statement.correct) {
          state.cafePrologueStatementId = id;
          state.cafePrologueStatementReaction = "";
          state.cafePrologueEvidenceId = "";
          state.cafePrologueEvidenceReaction = "";
          state.cafePrologueAct = revisedAct ? 2 : 1;
          setCafePrologueStep(state, revisedAct ? 3 : 1);
          return;
        }
        state.cafePrologueStatementId = "";
        state.cafePrologueStatementReaction = id;
        state.cafePrologueEvidenceId = "";
        state.cafePrologueEvidenceReaction = "";
        saveState();
        render();
      });
    });
    document.querySelectorAll("[data-cafe-material-preview]").forEach((button) => {
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        document.querySelectorAll("[data-cafe-material-preview]").forEach((item) => {
          item.classList.remove("inspected");
          item.setAttribute("aria-expanded", "false");
          const action = item.querySelector("strong");
          if (action && !item.classList.contains("used")) action.textContent = "查看";
        });
        if (expanded) return;
        button.classList.add("inspected");
        button.setAttribute("aria-expanded", "true");
        const action = button.querySelector("strong");
        if (action && !button.classList.contains("used")) action.textContent = "已查看";
      });
    });
    document.querySelectorAll("[data-cafe-evidence-select]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-cafe-evidence-select") ?? "";
        const availableEvidence = step === 3 ? allEvidence : (cafe.evidencePair ?? []);
        if (!availableEvidence.some((item) => item.id === id)) return;
        state.cafePrologueEvidenceId = id;
        state.cafePrologueEvidenceReaction = "";
        saveState();
        render();
      });
    });
    bind("[data-cafe-evidence-present]", () => {
      const current = normalizedCafePrologueProgress(state);
      if (!cafePrologueCanPresentEvidence(current, correctStatement?.id)) return;
      state.cafePrologueMarks = [current.evidenceId];
      state.cafePrologueAct = 2;
      state.cafePrologueStatementId = "";
      state.cafePrologueStatementReaction = "";
      state.cafePrologueEvidenceId = "";
      state.cafePrologueEvidenceReaction = "";
      setCafePrologueStep(state, 2);
    });
    bind("[data-cafe-revised-present]", () => {
      const current = normalizedCafePrologueProgress(state);
      if (!cafePrologueCanPresentRevisionEvidence(current, revisedCorrectStatement?.id)) return;
      if (!cafePrologueRevisionEvidenceHit(current, cafe.transferEvidence?.id)) {
        state.cafePrologueEvidenceReaction = current.evidenceId;
        state.cafePrologueEvidenceId = "";
        saveState();
        render();
        return;
      }
      state.cafePrologueTransferSelected = true;
      state.cafePrologueEvidenceReaction = "";
      state.cafePrologueMarks = [...new Set([...(state.cafePrologueMarks ?? []), current.evidenceId])];
      setCafePrologueStep(state, 4);
    });
    bind("[data-cafe-legal-brief]", () => {
      state.cafePrologueLegalBriefSeen = true;
      setCafePrologueStep(state, 5);
    });
    document.querySelectorAll("[data-cafe-pressure]").forEach((button) => {
      button.addEventListener("click", () => {
        const choiceId = button.getAttribute("data-cafe-pressure") ?? "";
        if (!(cafe.pressureChoices ?? []).some((choice) => choice.id === choiceId)) return;
        state.cafeProloguePressureChoice = choiceId;
        setCafePrologueStep(state, 6);
      });
    });
    bindSceneButtons();
  }

  function renderCafePrologueAftermath(brief) {
    const state = ctx.getState();
    const prologue = nightShellForBrief(brief)?.cafePrologue ?? {};
    const aftermath = prologue.aftermath ?? {};
    const progress = normalizedCafePrologueProgress(state);
    const step = Math.max(6, Math.min(7, progress.step));
    const routes = aftermath.routes ?? [];
    const pressureChoice = (prologue.cafe?.pressureChoices ?? []).find((choice) => choice.id === progress.pressureChoice);
    let text = cafePrologueHeaderHtml({ timeline: "同一晚", title: "序章后续", subtitle: "咖啡厅散场以后" });
    let choices = "";

    if (step === 6) {
      text += cafePrologueDialogueHtml([
        ...(pressureChoice?.echo ? [{ speaker: "旁白", type: "stage", text: pressureChoice.echo }] : []),
        ...(aftermath.openingLines ?? [])
      ]);
      choices = flowGroupHtml(cafeInvestigationChoicesHtml(routes));
    } else {
      const route = routes.find((item) => item.id === progress.order[0]) ?? routes[0];
      text += cafeInvestigationResultHtml(route, "今晚先查");
      text += cafePrologueDialogueHtml(route?.handoffLines ?? []);
      choices = flowGroupHtml(`<button class="primary" data-cafe-enter-night type="button"${cafePrologueCanOpenForensic(progress) ? "" : " disabled"}>回直播间开播</button>`);
    }

    frame({
      brief,
      mood: "focused",
      label: step === 6 ? "同一晚 · 语音否认" : "同一晚 · 麦外核对",
      chapter: "试玩序章后续",
      showCaseHud: false,
      visualHud: "",
      backdropClass: step === 6 ? "day-home cafe-aftermath-home" : "day-document cafe-aftermath-document",
      screenClass: `cafe-prologue-screen cafe-aftermath-screen cafe-aftermath-step-${step}`,
      text,
      choices
    });

    document.querySelectorAll("[data-cafe-investigation]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-cafe-investigation") ?? "";
        if (!routes.some((route) => route.id === id)) return;
        state.cafePrologueOrder = [id];
        setCafePrologueStep(state, 7);
      });
    });
    bind("[data-cafe-enter-night]", () => {
      if (!cafePrologueCanOpenForensic(normalizedCafePrologueProgress(state))) return;
      const allCasesSolved = (state.caseBriefs ?? []).length > 0
        && (state.caseBriefs ?? []).every((caseBrief) => (state.solvedCaseIds ?? []).includes(caseBrief.id));
      if (allCasesSolved) {
        setCafePrologueStep(state, 8);
        return;
      }
      moveScene("nightShellPrologue");
    });
    bindSceneButtons();
  }

  function renderCafePrologueForensic(brief) {
    const state = ctx.getState();
    const prologue = nightShellForBrief(brief)?.cafePrologue ?? {};
    const forensic = prologue.forensic ?? {};
    const progress = normalizedCafePrologueProgress(state);
    const routeId = progress.order[0] ?? "toy";
    const isToyRoute = routeId === "toy";
    let text = cafePrologueHeaderHtml({
      timeline: forensic.timeline ?? "数日后",
      title: "私下回告",
      subtitle: isToyRoute ? "个人委托初检" : "家庭卡电子回单"
    });
    text += cafePrologueDialogueHtml(isToyRoute ? forensic.openingLines ?? [] : forensic.accountClueLines ?? []);
    text += cafeFinalBoundaryHtml({
      result: isToyRoute ? forensic.finalCards?.result : "",
      openAccount: isToyRoute ? "" : forensic.finalCards?.openAccount,
      unknown: forensic.unknownByRoute?.[routeId] ?? []
    });
    const choices = flowGroupHtml(`<button class="primary" data-cafe-finish type="button">结束试玩</button>`, {
      label: "结果只到这里",
      note: isToyRoute ? "生父是谁，这份初检没有回答。" : "收款人是谁，节目里没有公开。"
    });
    frame({
      brief,
      mood: "focused",
      label: isToyRoute ? "数日后 · 鉴定回告" : "数日后 · 回单回告",
      chapter: "试玩序章尾声",
      showCaseHud: false,
      visualHud: "",
      backdropClass: "day-document cafe-forensic-document",
      screenClass: "cafe-prologue-screen cafe-forensic-screen",
      text,
      choices,
      pixelTransition: { kind: "soft-fade" }
    });
    bind("[data-cafe-finish]", () => moveScene("runComplete"));
    bindSceneButtons();
  }

  function cafeInvestigationResultHtml(route, kicker = "先查的是") {
    if (!route) return "";
    return `
      <section class="cafe-route-result"><span>${escapeHtml(kicker)}</span><h3>${escapeHtml(route.title ?? route.label ?? "")}</h3></section>
      ${route.id === "account" ? cafeAccountBoardHtml(route.rows ?? []) : ""}
      ${cafePrologueDialogueHtml(route.lines ?? [])}
    `;
  }

  function setCafePrologueStep(state, step) {
    state.cafePrologueStep = Math.max(0, Math.floor(Number(step) || 0));
    state.scene = cafePrologueSceneForStep(state.cafePrologueStep);
    saveState();
    render();
  }

  function nightShellHtml(lines = []) {
    return `
      <section class="night-shell-card">
        ${lines.map((line) => {
          const entry = typeof line === "string"
            ? { type: "narration", speaker: "旁白", text: line }
            : line ?? {};
          const audioCueAttribute = entry.audioCueId ? ` data-audio-cue-id="${escapeHtml(entry.audioCueId)}"` : "";
          return `
            <div class="night-shell-line shell-${escapeHtml(entry.type ?? "plain")}"${audioCueAttribute}>
              ${entry.speaker ? `<b>${escapeHtml(entry.speaker)}</b>` : ""}
              <p>${escapeHtml(entry.text ?? "")}</p>
            </div>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderSolved(brief) {
    const state = ctx.getState();
    const result = normalizedDailyResult(brief);
    const step = Number(state.recapStep ?? 0);
    const issue = issueCompletion(brief);
    const rank = recapRankLabel(issue);
    const conclusion = dailyConclusion(brief, result, issue);
    const route = routeAxisProfileForState(state, brief, result);
    const pressure = storyPressureRows([brief], {
      budgetFor: ensureBudget,
      choicesFor: (item) => routeChoicesForState(state, item),
      foundCountFor: (item) => contradictionsForState(state, item).length
    })[0]?.profile ?? {};
    const quoteComparison = finalQuoteComparison(brief, result);
    const boundary = truthBoundaryReview(brief);
    const boundaryPicks = truthBoundaryPicksForState(state, brief);
    const boundaryMisses = truthBoundaryMissesForState(state, brief);
    const boundaryLine = truthBoundaryAftertaste(boundary, boundaryPicks, boundaryMisses);
    const finalScene = isFinalStoryPackCase();
    const pages = withStageJudgementDisclosure(solvedRecapPagesHtml({
      rank,
      issue,
      result,
      route,
      routeTrail: routeTrailHtml({
        choices: routeChoicesForState(state, brief),
        keyQuestionCount: keyQuestionLimit(brief),
        investigationIndexBase: investigationRouteIndexBase(brief)
      }),
      pressure,
      quoteComparison,
      conclusion,
      stanceSnapshot: stanceSnapshotRecapForBrief(brief),
      offMicLetters: offMicLettersForBrief(brief, CONTENT_ADVISORS),
      boundary,
      boundaryPicks,
      boundaryLine,
      issueLineText: issueLine(issue, result)
    }), brief);
    const recap = solvedRecapFlowView({
      pages,
      step,
      boundary,
      boundaryPicks,
      afterLabel: isStoryPackMode() ? finalScene ? "查看整晚收麦" : "完成结案" : "查看今日结果"
    });
    frame({
      brief,
      mood: recap.kind === "verdict" ? "focused" : "listening",
      label: recap.kind === "verdict" ? "连线收束" : "连线回看",
      chapter: liveChapterTitle(brief),
      screenClass: recap.kind === "verdict" ? "host-verdict-screen" : "recap-screen",
      text: recap.text,
      choices: recap.choices
    });
    document.querySelectorAll("[data-truth-boundary-pick]").forEach((button) => {
      button.addEventListener("click", () => {
        const promptId = button.getAttribute("data-truth-boundary-prompt");
        const answer = button.getAttribute("data-truth-boundary-pick");
        if (!promptId || !answer) return;
        const key = caseKey(brief);
        if (state.truthBoundaryPicks?.[key]?.[promptId]) return;
        const prompt = (boundary.prompts ?? []).find((item) => item.id === promptId);
        const miss = prompt && answer !== prompt.expected;
        state.truthBoundaryPicks = {
          ...(state.truthBoundaryPicks ?? {}),
          [key]: {
            ...(state.truthBoundaryPicks?.[key] ?? {}),
            [promptId]: answer
          }
        };
        if (miss) {
          state.truthBoundaryMisses = {
            ...(state.truthBoundaryMisses ?? {}),
            [key]: {
              ...(state.truthBoundaryMisses?.[key] ?? {}),
              [promptId]: Number(state.truthBoundaryMisses?.[key]?.[promptId] ?? 0) + 1
            }
          };
        }
        saveState();
        render();
      });
    });
    bind("[data-recap-next]", () => {
      state.recapStep = recap.index + 1;
      saveState();
      render();
    });
    bind("[data-retry-case]", () => resetCaseAttempt(brief));
    bind("[data-after-recap]", () => {
      if (isStoryPackMode() && careChoicesFor(brief).length) {
        state.scene = "careChoice";
        saveState();
        return render();
      }
      moveScene("runComplete");
    });
    bindSceneButtons();
  }

  function renderCareChoice(brief) {
    const state = ctx.getState();
    const key = caseKey(brief);
    const selectedId = state.careChoices?.[key] ?? "";
    const selectedChoice = careChoiceById(brief, selectedId);
    const finalCase = isFinalStoryPackCase();
    frame({
      brief,
      mood: "listening",
      label: "今晚最后一句",
      chapter: liveChapterTitle(brief),
      showCaseHud: false,
      visualHud: "",
      screenClass: "care-choice-screen",
      text: careChoiceHtml({ choices: careChoicesFor(brief), selectedChoice, hostName: state.playerName }),
      choices: selectedChoice ? flowGroupHtml(careChoiceContinueHtml({ finalCase })) : ""
    });
    document.querySelectorAll("[data-care-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choiceId = button.getAttribute("data-care-choice") ?? "";
        if (!careChoiceById(brief, choiceId)) return;
        state.careChoices = { ...(state.careChoices ?? {}), [key]: choiceId };
        saveState();
        render();
      });
    });
    bind("[data-care-choice-continue]", () => {
      state.scene = "storyInterlude";
      saveState();
      render();
    });
    bind("[data-view-case-closure]", () => {
      state.scene = "caseClosure";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderCaseClosure(brief) {
    const state = ctx.getState();
    const boundary = truthBoundaryReview(brief);
    frame({
      brief,
      mood: "focused",
      label: "案件结案",
      chapter: `第 ${String(Number(state.chapter ?? 1)).padStart(2, "0")} 案 · 收束`,
      showCaseHud: false,
      visualHud: "",
      text: caseClosingHtml({
        caseNumber: Number(state.chapter ?? 1),
        closing: brief.caseClosing,
        boundary
      }),
      choices: flowGroupHtml(caseClosingChoicesHtml())
    });
    bind("[data-enter-story-interlude]", () => {
      state.scene = "storyInterlude";
      saveState();
      render();
    });
    bind("[data-return-recap]", () => {
      state.scene = "caseSolved";
      state.recapStep = 0;
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderCaseTitle(brief) {
    const state = ctx.getState();
    frame({
      brief,
      mood: "focused",
      label: "",
      chapter: "",
      showCaseHud: false,
      visualHud: "",
      screenClass: "case-title-screen",
      text: caseTitleHtml({ caseNumber: Number(state.chapter ?? 1), totalCases: state.caseBriefs?.length ?? 4, brief }),
      choices: flowGroupHtml(caseTitleChoicesHtml(Number(state.chapter ?? 1)))
    });
    bind("[data-enter-case-live]", () => {
      state.scene = "caseOpen";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function offMicLettersForBrief(brief = {}, advisors = {}) {
    const advisorRows = (brief.advisorNotes ?? []).map((note) => {
      const advisor = advisors[note.advisorId] ?? {};
      const title = [advisor.name, advisor.domain].filter(Boolean).join(" · ");
      return {
        kind: "advisor",
        badge: title || "顾问留言",
        appearsNowBecause: note.appearsNowBecause ?? "",
        text: note.text ?? ""
      };
    });
    const respondentNotes = Array.isArray(brief.respondentNote)
      ? brief.respondentNote
      : brief.respondentNote
        ? [brief.respondentNote]
        : [];
    const respondent = respondentNotes.map((note) => ({
      kind: "respondent",
      badge: note.badge ?? "对方留言",
      appearsNowBecause: note.appearsNowBecause ?? "",
      text: note.text ?? ""
    }));
    const lurker = brief.lurkerNote?.presenceLine && brief.lurkerNote?.deletedFragment
      ? [{
        kind: "lurker",
        badge: "后台提示",
        appearsNowBecause: brief.lurkerNote.presenceLine,
        text: `已删除弹幕残影：「${brief.lurkerNote.deletedFragment}」`
      }]
      : [];
    return [...advisorRows, ...respondent, ...lurker].filter((letter) => letter.text);
  }

  function stanceSnapshotRecapForBrief(brief = {}) {
    const pick = stanceSnapshotPickForState(brief);
    if (!pick) return null;
    const configured = (brief.stanceSnapshot?.options ?? []).find((option) => option.id === pick.id) ?? null;
    return {
      kicker: brief.stanceSnapshot?.recapKicker ?? "中段立场",
      label: pick.label,
      recap: configured?.recap ?? pick.recap ?? brief.stanceSnapshot?.recap ?? "这次判断不判分，只用来回看你的路线。"
    };
  }

  function hostDisclosureForAnchor(brief = {}, anchor = "") {
    return callDialogueHtml(hostDisclosureLinesForAnchor(brief, anchor, ctx.getState()?.playerName), "host-disclosure");
  }

  function respondentTeaseHtml(brief = {}, sceneIndex = 0) {
    if (!brief.respondentNote?.teaseDuringSegment2) return "";
    const indexes = nightStructureFor(brief)?.segment2SceneIndexes ?? [];
    if (indexes[0] !== sceneIndex) return "";
    return `<p class="reaction">后台有一条未读，来自对方——收麦后可看。</p>`;
  }

  function withStageJudgementDisclosure(pages = [], brief = {}) {
    const disclosureHtml = hostDisclosureForAnchor(brief, "atStageJudgement");
    const overnightAftertasteHtml = overnightCallerQuestionAftertasteHtml(brief);
    const liveCounterAftertaste = liveCounterAftertasteHtml(brief);
    if (!disclosureHtml && !overnightAftertasteHtml && !liveCounterAftertaste) return pages;
    return pages.map((page, index) => index === 2 ? `${disclosureHtml}${overnightAftertasteHtml}${liveCounterAftertaste}${page}` : page);
  }

  function liveCounterAftertasteHtml(brief = {}) {
    const aftertastes = liveCounterBeatsFor(brief).map((beat) => {
      const pick = liveCounterPickForState(brief, beat.id);
      const choice = (beat.choices ?? []).find((item) => item.id === pick?.choiceId);
      return choice?.recapAftertaste ?? "";
    }).filter(Boolean);
    return aftertastes.map((text) => callDialogueHtml([{ role: "host", text }], "host-disclosure")).join("");
  }

  function overnightCallerQuestionAftertasteHtml(brief = {}) {
    const state = ctx.getState();
    const overnight = state.caseOvernights?.[caseKey(brief)] ?? null;
    const question = overnightCallerQuestionFor(brief);
    const choice = (question?.options ?? []).find((option) => option.id === overnight?.callerQuestionChoiceId);
    if (!choice?.recapAftertaste) return "";
    return callDialogueHtml([{ role: "host", text: choice.recapAftertaste }], "host-disclosure");
  }

  function renderStoryInterlude(brief) {
    const state = ctx.getState();
    const interlude = nightShellInterludeForBrief(brief);
    const finalCase = isFinalStoryPackCase();
    const interludeCaseId = storyInterludeCaseId(storyPackForKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl()), brief);
    const optionalQuickCall = storyOptionalQuickCall(storyPackForKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl()), brief);
    const worldEchoRevealed = !interlude?.worldEcho || Boolean(state.storyWorldEchoes?.[interludeCaseId]);
    const worldEchoHypothesisId = state.storyWorldEchoHypotheses?.[interludeCaseId] ?? "";
    const worldEchoHypothesis = (interlude?.worldEcho?.hypotheses ?? []).find((item) => item.id === worldEchoHypothesisId) ?? null;
    frame({
      brief,
      mood: "focused",
      label: "",
      chapter: interlude?.kicker ?? "广告间隙",
      showCaseHud: false,
      visualHud: worldEchoRevealed && interlude?.worldEcho?.artSrc
        ? storyWorldEchoStageHtml(interlude.worldEcho)
        : storyInterludeStageHtml({ afterCaseId: interludeCaseId, hostName: state.playerName ?? "林旭阳" }),
      screenClass: `story-interlude-screen story-interlude-${interludeCaseId}${worldEchoRevealed && interlude?.worldEcho ? " has-world-echo" : ""}`,
      text: storyInterludeHtml({
        kicker: interlude?.kicker ?? "案后小尾声",
        shellLine: interlude?.line ?? "",
        shellLines: interlude?.lines ?? [],
        shellAfterLines: interlude?.afterLines ?? [],
        worldEcho: worldEchoRevealed ? interlude?.worldEcho ?? null : null,
        worldEchoHypothesis,
        afterCaseId: interludeCaseId
      }),
      choices: flowGroupHtml(storyInterludeChoicesHtml({ finalCase, worldEcho: interlude?.worldEcho ?? null, worldEchoRevealed, worldEchoHypothesisId, optionalQuickCall }))
    });
    bind("[data-world-echo-hypothesis]", (event) => {
      const hypothesisId = event.currentTarget.getAttribute("data-world-echo-hypothesis") ?? "";
      if (!(interlude?.worldEcho?.hypotheses ?? []).some((item) => item.id === hypothesisId)) return;
      state.storyWorldEchoHypotheses = { ...(state.storyWorldEchoHypotheses ?? {}), [interludeCaseId]: hypothesisId };
      saveState();
      render();
    });
    bind("[data-reveal-world-echo]", () => {
      state.storyWorldEchoes = { ...(state.storyWorldEchoes ?? {}), [interludeCaseId]: interlude.worldEcho.id };
      saveState();
      render();
    });
    bind("[data-enter-case-bridge]", () => {
      state.scene = "caseBridge";
      saveState();
      render();
    });
    bind("[data-enter-optional-quick]", (event) => {
      const quickCaseId = event.currentTarget.getAttribute("data-enter-optional-quick") ?? "";
      if (!optionalQuickCall || quickCaseId !== optionalQuickCall.quickCaseId) return;
      startQuickDetective(quickCaseId, { scene: "caseBridge", afterCaseId: interludeCaseId });
    });
    bind("[data-enter-night-epilogue]", () => {
      state.scene = nightShellForBrief(brief)?.epilogue ? "nightShellEpilogue" : "runComplete";
      saveState();
      render();
    });
    bind("[data-retry-case]", () => resetCaseAttempt(brief));
    bindSceneButtons();
  }

  function renderCaseBridge(brief) {
    const state = ctx.getState();
    const fromCaseNumber = Number(state.chapter ?? 1);
    const toCaseNumber = fromCaseNumber + 1;
    const nextBrief = state.caseBriefs?.[fromCaseNumber] ?? null;
    const interlude = nightShellInterludeForBrief(brief);
    if (!nextBrief || !interlude?.transitionQuote) return advanceToNextStoryPackCase();
    frame({
      brief,
      mood: "focused",
      label: "",
      chapter: "",
      showCaseHud: false,
      visualHud: "",
      screenClass: "case-bridge-screen",
      text: caseBridgeHtml({
        fromCaseNumber,
        toCaseNumber,
        fromAct: brief.storyAct,
        nextAct: nextBrief.storyAct,
        quote: interlude.transitionQuote,
        nextBrief,
        fromMaterialSrc: brief.evidenceBoard ?? "",
        toMaterialSrc: nextBrief.evidenceBoard ?? ""
      }),
      choices: flowGroupHtml(caseBridgeChoicesHtml(toCaseNumber))
    });
    bind("[data-enter-next-case]", () => advanceToNextStoryPackCase());
    bindSceneButtons();
  }

  function endingCgStageHtml(cg = null) {
    if (!cg?.src) return "";
    return `
      <figure class="night-ending-cg-stage">
        <img src="${escapeHtml(cg.src)}" alt="${escapeHtml(cg.alt ?? "收播后的桌面")}" onerror="this.closest('figure')?.classList.add('art-missing');this.hidden=true" />
        <figcaption>
          ${cg.kicker ? `<span>${escapeHtml(cg.kicker)}</span>` : ""}
          ${cg.caption ? `<b>${escapeHtml(cg.caption)}</b>` : ""}
        </figcaption>
      </figure>
    `;
  }

  function renderRunComplete(brief) {
    const state = ctx.getState();
    if (isStoryPackMode()) return renderStoryPackComplete();
    const result = normalizedDailyResult(brief);
    const route = routeProfileForBrief(brief, result);
    const issue = issueCompletion(brief);
    const rank = recapRankLabel(issue);
    const pickedQuote = result.dailyAccuseLabel ?? "还没选最后那句";
    const quoteComparison = finalQuoteComparison(brief, result);
    const caught = issue.revealed[0] ?? route.shareBody;
    const quoteComparisonHtml = quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : "";
    frame({
      brief,
      mood: "focused",
      label: "今日收麦",
      chapter: "今日收麦",
      text: dailyCompleteHtml({
        issueLineText: issueResultLine(issue, result),
        route,
        issue,
        rank,
        result,
        pickedQuote,
        quoteComparisonHtml,
        caught
      }),
      choices: dailyCompleteChoicesHtml()
    });
    bind("[data-copy-result]", async () => {
      const text = dailyCompleteShareText({ route, pickedQuote });
      try {
        await navigator.clipboard?.writeText(text);
        state.lastReaction = "吃瓜文案已复制。";
      } catch {
        state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
      }
      render();
    });
    bind('[data-action="title"]', returnToTitle);
    postDailySharePayload(brief, route, result);
  }

  function renderStoryPackComplete() {
    const state = ctx.getState();
    const briefs = state.caseBriefs ?? [];
    const results = briefs.map((brief) => normalizedDailyResult(brief));
    const solved = results.filter((result) => result.accused).length;
    const routeProfiles = briefs.map((brief, index) => routeAxisProfileForState(state, brief, results[index] ?? {}));
    const summary = storyPackSummaryModel({
      briefs,
      results,
      routeProfiles,
      boundaryRows: storyBoundaryRows(briefs, {
        picksFor: (brief) => truthBoundaryPicksForState(state, brief),
        missesFor: (brief) => truthBoundaryMissesForState(state, brief)
      }),
      pressureRows: storyPressureRows(briefs, {
        budgetFor: ensureBudget,
        choicesFor: (brief) => routeChoicesForState(state, brief),
        foundCountFor: (item) => contradictionsForState(state, item).length
      }),
      materialRows: storyMaterialRows(briefs, {
        evidencePicksFor: (brief) => selectedEvidencePicksForState(state, brief),
        investigationPicksFor: (brief) => selectedInvestigationPicksForState(state, brief)
      })
    });
    frame({
      brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
      mood: "focused",
      label: "试玩收麦",
      chapter: "试玩收麦",
      showCaseHud: false,
      text: storyPackCompleteHtml({
        briefs,
        results,
        routeProfiles,
        ...summary
      }),
      choices: flowGroupHtml(`
        <button class="primary" data-copy-weekly-result type="button">复制收麦文案</button>
        <button data-action="title" type="button">回标题</button>
      `)
    });
    bind("[data-copy-weekly-result]", async () => {
      const text = storyPackShareText({
        theme: summary.theme,
        displayBest: summary.displayBest,
        pressureProfile: summary.pressureProfile,
        materialProfile: summary.materialProfile,
        quoteProfile: summary.quoteProfile,
        hiddenThreadProfile: summary.hiddenThreadProfile,
        playerType: summary.playerType
      });
      try {
        await navigator.clipboard?.writeText(text);
        state.lastReaction = "收麦文案已复制。";
      } catch {
        state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
      }
      render();
    });
    bind('[data-action="title"]', returnToTitle);
  }

  return {
    renderCaseOpen,
    renderNightShellPrologue,
    renderNightShellEpilogue,
    renderCafePrologue,
    renderCafePrologueAftermath,
    renderCafePrologueForensic,
    renderSolved,
    renderCareChoice,
    renderCaseClosure,
    renderCaseTitle,
    renderStoryInterlude,
    renderCaseBridge,
    renderRunComplete,
    renderStoryPackComplete,
    hostDisclosureForAnchor,
    respondentTeaseHtml
  };
}
