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
    careChoiceById,
    careChoicesFor,
    epilogueUnreadStage,
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
    compactDialogueLines,
    bind,
    bindSceneButtons,
    stanceSnapshotPickForState,
    liveCounterPickForState,
    moveScene,
    currentIndex,
    normalizedDailyResult,
    issueCompletion,
    routeProfileForBrief,
    postDailySharePayload,
    isFinalStoryPackCase,
    advanceToNextStoryPackCase,
    resetCaseAttempt,
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
    const lines = [...(prologue.lines ?? []), prologue.hostLine].filter(Boolean);
    frame({
      brief,
      mood: "focused",
      label: "开播前",
      chapter: "晚间热线",
      showCaseHud: false,
      visualHud: hostPortraitLayer(),
      screenClass: "night-shell-prologue-screen",
      text: nightShellHtml(lines),
      choices: flowGroupHtml(
        `<button class="primary" data-enter-first-case type="button">接入第一通来电</button>`,
        { label: "直播已经开始", note: "第一位咨询者正在等待接通。" }
      )
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
    bind("[data-finish-night-shell]", () => moveScene("runComplete"));
    bindSceneButtons();
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
    const worldEchoRevealed = !interlude?.worldEcho || Boolean(state.storyWorldEchoes?.[interludeCaseId]);
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
        afterCaseId: interludeCaseId
      }),
      choices: flowGroupHtml(storyInterludeChoicesHtml({ finalCase, worldEcho: interlude?.worldEcho ?? null, worldEchoRevealed }))
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
