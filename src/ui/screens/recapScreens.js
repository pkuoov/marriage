import { resolveCommit } from "../../runtime/stateCommit.js";
import { isPrivateConsultation } from "../../runtime/consultationModel.js";
import { createCafePrologueScreens } from "./cafePrologueScreens.js";
import { createNightShellScreens } from "./nightShellScreens.js";

export function createRecapScreens(ctx) {
  const {
    contradictionsForState,
    routeAxisProfileForState,
    routeChoicesForState,
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
    hostDisclosureLinesForAnchor,
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
    storyPackCompleteHtml,
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
    frame,
    compactDialogueLines,
    bind,
    bindSceneButtons,
    stanceSnapshotPickForState,
    liveCounterPickForState,
    moveScene,
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
  const commit = resolveCommit(ctx);

  function renderCaseOpen(brief) {
    const lines = compactDialogueLines(brief.openingDialogue ?? []);
    frame({
      brief,
      mood: "listening",
      label: "直播连线",
      chapter: liveChapterTitle(brief),
      text: callDialogueHtml(lines, "", { autoPairQuestions: true }),
      choices: flowGroupHtml(`<button class="primary" data-scene="sceneReview" type="button">接着听</button>`)
    });
    bindSceneButtons();
  }


  function renderSolved(brief) {
    const state = ctx.getState();
    if (brief.dialoguePresentation?.compactClosing) {
      state.scene = "careChoice";
      saveState();
      return renderCareChoice(brief);
    }
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
      commit((state) => {
        state.recapStep = recap.index + 1;
      });
    });
    bind("[data-retry-case]", () => resetCaseAttempt(brief));
    bind("[data-after-recap]", () => {
      if (isStoryPackMode() && careChoicesFor(brief).length) {
        return commit((state) => {
          state.scene = "careChoice";
        });
      }
      moveScene("runComplete");
    });
    bindSceneButtons();
  }

  function renderCareChoice(brief) {
    const state = ctx.getState();
    const key = caseKey(brief);
    const availableChoices = careChoicesFor(brief);
    if (availableChoices.length === 1) {
      const choice = availableChoices[0];
      if (state.careChoices?.[key] !== choice.id) {
        state.careChoices = {...state.careChoices, [key]: choice.id};
        saveState();
      }
      frame({brief, mood: "listening", label: "通话结束前", chapter: liveChapterTitle(brief),
        showCaseHud: false, screenClass: "care-choice-screen",
        text: callDialogueHtml([{role: "host", text: choice.hostLine}, ...(choice.lines ?? [])]),
        choices: flowGroupHtml('<button class="primary" data-care-dialogue-done type="button">继续</button>')});
      bind('[data-care-dialogue-done]', () => {
       commit((state) => {
         state.scene = brief.dialoguePresentation?.singleClosingCard ? 'caseClosure' : 'storyInterlude';
       });
      });
      bindSceneButtons(); return;
    }
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
      text: careChoiceHtml({ choices: careChoicesFor(brief), selectedChoice, hostName: state.playerName, privateConsultation: isPrivateConsultation(brief, state) }),
      choices: selectedChoice && (!careChoicesFor(brief)[0]?.sequential || selectedId === careChoicesFor(brief).at(-1)?.id) ? flowGroupHtml(careChoiceContinueHtml({ finalCase })) : ""
    });
    document.querySelectorAll("[data-care-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choiceId = button.getAttribute("data-care-choice") ?? "";
        if (!careChoiceById(brief, choiceId)) return;
        const ordered = careChoicesFor(brief);
        if (ordered[0]?.sequential && ordered[selectedChoice ? ordered.findIndex((choice) => choice.id === selectedId) + 1 : 0]?.id !== choiceId) return;
        commit((state) => {
          state.careChoices = { ...(state.careChoices ?? {}), [key]: choiceId };
        });
      });
    });
    bind("[data-care-choice-continue]", () => {
      commit((state) => {
        state.scene = "storyInterlude";
      });
    });
    bind("[data-view-case-closure]", () => {
      commit((state) => {
        state.scene = "caseClosure";
      });
    });
    bindSceneButtons();
  }

  function renderCaseClosure(brief) {
    const state = ctx.getState();
    const boundary = truthBoundaryReview(brief);
    const focus = (brief.stanceSnapshot?.options ?? []).find(option => option.id === stanceSnapshotPickForState(brief)?.id);
    const postscript = actionDone(brief, "interlude:receivedDocumentsRead") ? brief.caseClosing?.postscript : null;
    frame({
      brief,
      mood: "focused",
      label: "案件结案",
      chapter: `第 ${String(Number(state.chapter ?? 1)).padStart(2, "0")} 案 · 收束`,
      showCaseHud: false,
      visualHud: "",
      text: caseClosingHtml({
        caseNumber: Number(state.chapter ?? 1),
        closing: {...brief.caseClosing, ...(focus?.closingTitle ? {title: focus.closingTitle} : {}), ...(postscript ? { title: postscript.title, verdict: postscript.confirmed.join(""), confirmed: postscript.confirmed, unresolved: postscript.unresolved, nextStep: "保存完整聊天和成交原件，核对代投与追款安排。" } : {})},
        boundary
      }),
      choices: flowGroupHtml(caseClosingChoicesHtml())
    });
    bind("[data-enter-story-interlude]", () => {
      commit((state) => {
        state.scene = "storyInterlude";
      });
    });
    bind("[data-return-recap]", () => {
      commit((state) => {
        state.scene = "caseSolved";
        state.recapStep = 0;
      });
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
      commit((state) => {
        state.scene = "caseOpen";
      });
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
      label: configured?.label ?? pick.label,
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
    const broadcastRecap = interlude?.broadcastRecap;
    const broadcastingRecap = Boolean(broadcastRecap && actionDone(brief, "interlude:broadcastRecap"));
    const packet = interlude?.receivedPacket;
    const packetArrived = Boolean(packet && actionDone(brief, "interlude:receivedDocuments"));
    const packetOpening = Boolean(packet && !packetArrived);
    const unreadPacket = packetArrived && !actionDone(brief, "interlude:receivedDocumentsRead");
    if (unreadPacket || (broadcastingRecap && broadcastRecap.materials?.length && !actionDone(brief, "interlude:publicMaterialsRead"))) {
      const documents = unreadPacket ? packet.materials : broadcastRecap.materials;
      frame({
        brief, mood: "focused", chapter: unreadPacket ? interlude.kicker : broadcastRecap.kicker, showCaseHud: false,
        screenClass: "public-materials-screen",
        text: `<section class="shell public-materials-board"><h2>${unreadPacket ? "Tony 刚补来的材料" : "开播前 · 翻看已收到的公开资料"}</h2>${documents.map(doc => `<article class="material-record"><h3>${escapeHtml(doc.title)}</h3><ul>${doc.rows.map(row => `<li>${escapeHtml(row)}</li>`).join("")}</ul></article>`).join("")}</section>`,
        choices: flowGroupHtml(`<button class="primary" data-public-materials-read type="button">${unreadPacket ? "看完，继续" : "看完，开始直播"}</button>`)
      });
      bind("[data-public-materials-read]", () => {
        markAction(brief, unreadPacket ? "interlude:receivedDocumentsRead" : "interlude:publicMaterialsRead");
        saveState();
        render();
      });
      return;
    }
    const shownInterlude = packetOpening ? { ...interlude, lines: packet.arrivalLines, line: "", afterLines: [] } : broadcastingRecap ? broadcastRecap : interlude;
    const worldEchoRevealed = !interlude?.worldEcho || Boolean(state.storyWorldEchoes?.[interludeCaseId]);
    const worldEchoHypothesisId = state.storyWorldEchoHypotheses?.[interludeCaseId] ?? "";
    const worldEchoHypothesis = null;
    frame({
      brief,
      mood: "focused",
      label: "",
      chapter: shownInterlude?.kicker ?? "广告间隙",
      showCaseHud: false,
      visualHud: worldEchoRevealed && interlude?.worldEcho?.artSrc
        ? storyWorldEchoStageHtml(interlude.worldEcho)
        : storyInterludeStageHtml({ afterCaseId: interludeCaseId, hostName: state.playerName ?? "林旭阳", remoteLabel: interlude?.remoteLabel, broadcasting: broadcastingRecap }),
      screenClass: `story-interlude-screen story-interlude-${interludeCaseId}${worldEchoRevealed && interlude?.worldEcho ? " has-world-echo" : ""}`,
      text: storyInterludeHtml({
        kicker: shownInterlude?.kicker ?? "案后小尾声",
        shellLine: shownInterlude?.line ?? "",
        shellLines: shownInterlude?.lines ?? [],
        shellAfterLines: shownInterlude?.afterLines ?? [],
        worldEcho: worldEchoRevealed ? interlude?.worldEcho ?? null : null,
        worldEchoHypothesis,
        afterCaseId: interludeCaseId
      }),
      choices: flowGroupHtml(packetOpening ? `<button class="primary" data-received-documents type="button">打开 Tony 补来的材料</button>` : broadcastRecap && !broadcastingRecap
        ? `<button class="primary" data-enter-broadcast-recap type="button">${escapeHtml(broadcastRecap.actionLabel ?? "下次开播")}</button>`
        : storyInterludeChoicesHtml({ finalCase, worldEcho: interlude?.worldEcho ?? null, worldEchoRevealed, worldEchoHypothesisId, optionalQuickCall }))
    });
    bind("[data-received-documents]", () => {
      markAction(brief, "interlude:receivedDocuments");
      saveState();
      render();
    });
    bind("[data-enter-broadcast-recap]", () => {
      markAction(brief, "interlude:broadcastRecap");
      saveState();
      render();
    });
    bind("[data-world-echo-hypothesis]", (event) => {
      const hypothesisId = event.currentTarget.getAttribute("data-world-echo-hypothesis") ?? "";
      if (!(interlude?.worldEcho?.hypotheses ?? []).some((item) => item.id === hypothesisId)) return;
      commit((state) => {
        state.storyWorldEchoHypotheses = { ...(state.storyWorldEchoHypotheses ?? {}), [interludeCaseId]: hypothesisId };
      });
    });
    bind("[data-reveal-world-echo]", () => {
      commit((state) => {
        state.storyWorldEchoes = { ...(state.storyWorldEchoes ?? {}), [interludeCaseId]: interlude.worldEcho.id };
      });
    });
    bind("[data-enter-case-bridge]", () => {
      commit((state) => {
        state.scene = "caseBridge";
      });
    });
    bind("[data-enter-optional-quick]", (event) => {
      const quickCaseId = event.currentTarget.getAttribute("data-enter-optional-quick") ?? "";
      if (!optionalQuickCall || quickCaseId !== optionalQuickCall.quickCaseId) return;
      startQuickDetective(quickCaseId, { scene: "caseBridge", afterCaseId: interludeCaseId });
    });
    bind("[data-enter-night-epilogue]", () => {
      commit((state) => {
        state.scene = nightShellForBrief(brief)?.epilogue ? "nightShellEpilogue" : "runComplete";
      });
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
    frame({
      brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
      label: "",
      chapter: "",
      showCaseHud: false,
      visualHud: "",
      screenClass: "demo-return-screen",
      pixelTransition: null,
      text: storyPackCompleteHtml(),
      choices: flowGroupHtml(`<button data-action="title" type="button">回到标题</button>`)
    });
    bind('[data-action="title"]', returnToTitle);
  }

  const cafeScreens = createCafePrologueScreens(ctx);
  const nightScreens = createNightShellScreens({ ...ctx, setCafePrologueStep: cafeScreens.setCafePrologueStep });
  const {
    renderCafePrologue,
    renderCafePrologueAftermath,
    renderCafePrologueForensic
  } = cafeScreens;
  const { renderNightShellPrologue, renderNightShellEpilogue } = nightScreens;

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
