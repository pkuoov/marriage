import { resolveCommit } from "../../runtime/stateCommit.js";

export function createCafePrologueScreens(ctx) {
  const {
    bind,
    bindSceneButtons,
    cafeAccountBoardHtml,
    cafeEvidencePairHtml,
    cafeFinalBoundaryHtml,
    cafeLegalRequestsHtml,
    cafeMaterialDetailModalHtml,
    cafeMaterialPromptHtml,
    cafePrologueCanOpenForensic,
    cafePrologueCanPresentEvidence,
    cafePrologueCanPresentRevisionEvidence,
    cafePrologueDialogueHtml,
    cafePrologueHeaderHtml,
    cafeProloguePortraitStageHtml,
    cafePrologueRevisionEvidenceHit,
    cafePrologueSceneForStep,
    cafeRevisionStatusHtml,
    cafeStatementReplayHtml,
    consumePixelTransition,
    escapeHtml,
    flowGroupHtml,
    frame,
    moveScene,
    nightShellForBrief,
    normalizedCafePrologueProgress,
    render,
    saveState
  } = ctx;
  const commit = resolveCommit(ctx);

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
  const availableEvidence = allEvidence.filter((evidence) => !progress.marks.includes(evidence.id));
  let text = step === 0 && !progress.openingSeen
    ? cafePrologueHeaderHtml({ timeline: prologue.timeline, title: prologue.title, subtitle: prologue.subtitle })
    : "";
  let choices = "";
  let pixelTransition;

  if (step === 0) {
    if (!progress.openingSeen) {
      text += cafePrologueDialogueHtml(cafe.openingLines ?? []);
      choices = flowGroupHtml(`<button class="primary" data-cafe-opening-seen type="button">继续</button>`);
      pixelTransition = { kind: "soft-fade" };
    } else {
      text += cafePrologueDialogueHtml(progress.statementReaction
        ? [{
            speaker: "妻子",
            speakerProfileId: "prologue-cafe-wife",
            type: "participant",
            text: (cafe.claimStatements ?? []).find((statement) => statement.id === progress.statementReaction)?.missLine ?? "你要问哪句，就把那句说清楚。"
          }]
        : cafe.initialAccountLines ?? []);
      choices = `
        <section class="cafe-opening-action" aria-label="咖啡厅对质">
          ${cafeStatementReplayHtml({
            statements: cafe.claimStatements,
            selectedId: progress.statementId,
            reactionId: "",
            label: "回放她刚才的话"
          })}
          ${cafeMaterialPromptHtml({ evidencePair: cafe.evidencePair })}
        </section>
        ${cafeMaterialDetailModalHtml(cafe.evidencePair)}
      `;
      if (consumePixelTransition?.("cafe-prologue:initial-account")) {
        pixelTransition = { kind: "phase", visualVariant: "listen", eyebrow: "先让她说完", label: "第一段陈述" };
      }
    }
  } else if (step === 1) {
    choices = flowGroupHtml(`
      ${cafeEvidencePairHtml(cafe.evidencePair ?? [], progress.evidenceId, correctStatement?.text ?? cafe.firstClaim)}
      <button class="secondary" data-cafe-back-to-statement type="button">返回原话，重新选择</button>
      <button class="primary" data-cafe-evidence-present type="button"${cafePrologueCanPresentEvidence(progress, correctStatement?.id) ? "" : " disabled"}> ${progress.evidenceId ? `出示：${escapeHtml(allEvidence.find((item) => item.id === progress.evidenceId)?.title ?? "所选材料")}` : "先选择一份材料"}</button>
      ${cafeMaterialDetailModalHtml(cafe.evidencePair)}
    `);
  } else if (step === 2) {
    if (!progress.revisionSeen) {
      text += cafePrologueDialogueHtml(firstEvidence?.hitLines ?? []);
      choices = flowGroupHtml(`<button class="primary" data-cafe-revision-seen type="button">听她重新说</button>`);
    } else {
      text += cafeRevisionStatusHtml({ title: "她换了说法", note: "第二段陈述" });
      const revisedReaction = (cafe.revisedClaimStatements ?? []).find((statement) => statement.id === progress.statementReaction)?.missLine;
      text += cafePrologueDialogueHtml(revisedReaction
        ? [{ speaker: "妻子", speakerProfileId: "prologue-cafe-wife", type: "participant", text: revisedReaction }]
        : cafe.revisedAccountLines ?? []);
      choices = `
        <section class="cafe-opening-action cafe-revised-action" aria-label="第二段说法">
          ${cafeStatementReplayHtml({
            statements: cafe.revisedClaimStatements,
            selectedId: progress.statementId,
            reactionId: "",
            label: "回放她改口后的话"
          })}
          ${cafeMaterialPromptHtml({ evidencePair: availableEvidence, label: "桌上材料" })}
        </section>
        ${cafeMaterialDetailModalHtml(availableEvidence)}
      `;
      if (consumePixelTransition?.("cafe-prologue:revised-account")) {
        pixelTransition = { kind: "phase", visualVariant: "listen", eyebrow: "她换了一套说法", label: "改口陈述" };
      }
    }
  } else if (step === 3) {
    text += cafeRevisionStatusHtml({ title: "第二段说法", note: revisedCorrectStatement?.text ?? cafe.moneyClaim });
    const revisedPresentLines = progress.evidenceReaction
      ? (cafe.revisedEvidenceMissLines?.[progress.evidenceReaction] ?? [])
      : (progress.evidenceId ? [] : (cafe.revisedPresentLeadLines ?? []));
    if (revisedPresentLines.length) {
      text += cafePrologueDialogueHtml(revisedPresentLines);
    }
    choices = flowGroupHtml(`
      ${cafeEvidencePairHtml(availableEvidence, progress.evidenceId, revisedCorrectStatement?.text ?? cafe.moneyClaim)}
      <button class="secondary" data-cafe-back-to-statement type="button">返回原话，重新选择</button>
      <button class="primary" data-cafe-revised-present type="button"${cafePrologueCanPresentRevisionEvidence(progress, revisedCorrectStatement?.id) ? "" : " disabled"}> ${progress.evidenceId ? `出示：${escapeHtml(allEvidence.find((item) => item.id === progress.evidenceId)?.title ?? "所选材料")}` : "先选择一份材料"}</button>
      ${cafeMaterialDetailModalHtml(availableEvidence)}
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
      <button class="primary" data-cafe-legal-brief type="button">把现有证据和线索记下来</button>
    `);
  } else {
    // Keep step 5 as the exit so old table-side saves can still continue.
    text += cafePrologueDialogueHtml(cafe.cameraBreakLines ?? []);
    choices = flowGroupHtml((cafe.pressureChoices ?? []).map((choice) => `
      <button class="secondary" data-cafe-pressure="${escapeHtml(choice.id)}" type="button">
        <b>${escapeHtml(choice.label)}</b><span>${escapeHtml(choice.note)}</span>
      </button>
    `).join(""), {
      label: "表哥手里也录了一份",
      note: "桌边录像已经关了。"
    });
  }

  const cafeRoundIndex = step <= 1 ? 0 : 1;
  const cafeRound = cafe.inquiries?.[cafeRoundIndex];
  const directCafe = cafeRound && ((step <= 1 && progress.openingSeen) || (step === 2 && progress.revisionSeen) || step === 3);
  const directPick = cafeRound?.options.find(option => option.id === state.cafeInquiryPicks?.[cafeRound.id]);
  const cafeHostQuestion = question => ({ speaker: "林旭阳", speakerProfileId: "host-lin-xuyang", type: "host", text: question });
  if (directCafe) {
    const cards = cafeRoundIndex === 0 ? cafe.evidencePair : [cafe.transferEvidence];
    const opening = cafeRoundIndex === 0 ? cafe.initialAccountLines : cafe.revisedAccountLines;
    text = directPick
      ? cafePrologueDialogueHtml([cafeHostQuestion(directPick.question), ...directPick.lines])
      : `${state.cafeInquiryHeard?.[cafeRound.id] ? '<aside class="inquiry-context" data-inquiry-context>桌上材料</aside>' : cafePrologueDialogueHtml(opening)}
        <section class="inquiry-materials" data-after-dialogue>${cards.map(card => `<article><b>${escapeHtml(card.kicker ?? "材料")} · ${escapeHtml(card.title)}</b><p>${escapeHtml(card.detail)}</p>${(card.rows ?? []).map(row => `<p>${escapeHtml(row)}</p>`).join("")}<button data-cafe-material-open="${escapeHtml(card.id)}" type="button">查看原件</button></article>`).join("")}</section>`;
    choices = directPick ? flowGroupHtml('<button data-cafe-inquiry-retry type="button">换个问法</button>')
      : flowGroupHtml(cafeRound.options.map(option => `<button data-cafe-inquiry="${escapeHtml(option.id)}" type="button">${escapeHtml(option.question)}</button>`).join(""));
    choices += cafeMaterialDetailModalHtml(cards);
    pixelTransition = null;
  } else if (cafe.inquiries && step === 2 && !progress.revisionSeen) {
    const round = cafe.inquiries[0];
    const picked = round.options.find(option => option.id === state.cafeInquiryPicks?.[round.id]);
    // Old successful saves retain their original material response.
    if (picked?.correct) text = cafePrologueDialogueHtml([cafeHostQuestion(picked.question), ...picked.lines]);
    choices = flowGroupHtml('<button class="primary" data-cafe-revision-seen type="button">继续</button>');
  } else if (cafe.inquiries && step === 4) {
    const round = cafe.inquiries[1];
    const picked = round.options.find(option => option.id === state.cafeInquiryPicks?.[round.id]);
    if (picked?.correct) text = cafePrologueDialogueHtml([cafeHostQuestion(picked.question), ...picked.lines, ...(cafe.legalClaimLines ?? [])]);
  }

  frame({
    brief,
    mood: "focused",
    label: step < 5 ? "现在 · 咖啡厅" : "咖啡厅 · 录像中断",
    chapter: "试玩序章",
    showCaseHud: false,
    visualHud: cafeProloguePortraitStageHtml({ activeRole: [0, 2].includes(step) ? "wife" : "" }),
    backdropClass: prologue.backdropClass ?? "day-cafe",
    screenClass: `cafe-prologue-screen cafe-prologue-step-${step}${directCafe && !directPick ? " focused-evidence-inquiry" : ""}`,
    text,
    choices,
    pixelTransition
  });

  bind("[data-cafe-inquiry]", event => {
    const option = cafeRound.options.find(option => option.id === event.currentTarget.dataset.cafeInquiry);
    if (!option) return;
    state.cafeInquiryPicks = { ...state.cafeInquiryPicks, [cafeRound.id]: option.id };
    state.cafeInquiryHeard = { ...state.cafeInquiryHeard, [cafeRound.id]: true };
    if (option.correct) {
      state.cafePrologueMarks = [...new Set([...(state.cafePrologueMarks ?? []), option.evidenceId])];
      if (cafeRoundIndex === 0) { state.cafePrologueAct = 2; state.cafePrologueRevisionSeen = false; }
      else state.cafePrologueTransferSelected = true;
      setCafePrologueStep(state, cafeRoundIndex === 0 ? 2 : 4); return;
    }
    saveState(); render();
  });
  bind("[data-cafe-inquiry-retry]", () => {
    const picks = { ...state.cafeInquiryPicks };
    delete picks[cafeRound.id];
    commit((state) => {
      state.cafeInquiryPicks = picks;
    });
  });
  bind("[data-cafe-opening-seen]", () => {
    commit((state) => {
      state.cafePrologueOpeningSeen = true;
    });
  });
  bind("[data-cafe-revision-seen]", () => {
    commit((state) => {
      state.cafePrologueRevisionSeen = true;
    });
  });

  bind("[data-cafe-back-to-statement]", () => {
    if (step !== 1 && step !== 3) return;
    state.cafePrologueStatementId = "";
    state.cafePrologueStatementReaction = "";
    state.cafePrologueEvidenceId = "";
    state.cafePrologueEvidenceReaction = "";
    setCafePrologueStep(state, step === 3 ? 2 : 0);
  });
  let materialTrigger = null;
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
      commit((state) => {
        state.cafePrologueStatementId = "";
        state.cafePrologueStatementReaction = id;
        state.cafePrologueEvidenceId = "";
        state.cafePrologueEvidenceReaction = "";
      });
    });
  });
  // Originals must remain outside the choice panel: dialogue playback hides
  // that panel, even when a material's own open button is already visible.
  const cafeMaterialModal = document.querySelector("[data-cafe-material-modal]");
  if (cafeMaterialModal) document.querySelector("#app")?.append(cafeMaterialModal);
  document.querySelectorAll("[data-cafe-material-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-cafe-material-open") ?? "";
      const modal = document.querySelector("[data-cafe-material-modal]");
      if (!modal || !Array.from(modal.querySelectorAll("[data-cafe-material-document]")).some((item) => item.getAttribute("data-cafe-material-document") === id)) return;
      state.cafePrologueInspectedIds = [...new Set([...(state.cafePrologueInspectedIds ?? []), id])];
      saveState();
      materialTrigger = button;
      modal.querySelectorAll("[data-cafe-material-document]").forEach((documentView) => {
        documentView.hidden = documentView.getAttribute("data-cafe-material-document") !== id;
      });
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      modal.querySelector(".cafe-material-sheet [data-cafe-material-close]")?.focus?.({ preventScroll: true });
    });
  });
  document.querySelectorAll("[data-cafe-material-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest("[data-cafe-material-modal]");
      if (!modal) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      materialTrigger?.focus?.({ preventScroll: true });
    });
  });
  document.querySelectorAll("[data-cafe-evidence-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-cafe-evidence-select") ?? "";
      const selectableEvidence = step === 3 ? availableEvidence : (cafe.evidencePair ?? []);
      if (!selectableEvidence.some((item) => item.id === id)) return;
      commit((state) => {
        state.cafePrologueEvidenceId = id;
        state.cafePrologueEvidenceReaction = "";
      });
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
    state.cafePrologueRevisionSeen = false;
    setCafePrologueStep(state, 2);
  });
  bind("[data-cafe-revised-present]", () => {
    const current = normalizedCafePrologueProgress(state);
    if (!cafePrologueCanPresentRevisionEvidence(current, revisedCorrectStatement?.id)) return;
    if (!cafePrologueRevisionEvidenceHit(current, cafe.transferEvidence?.id)) {
      commit((state) => {
        state.cafePrologueEvidenceReaction = current.evidenceId;
        state.cafePrologueEvidenceId = "";
      });
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
  const allCasesSolved = (state.caseBriefs ?? []).length > 0
    && state.caseBriefs.every((caseBrief) => (state.solvedCaseIds ?? []).includes(caseBrief.id));
  const pressureChoice = (prologue.cafe?.pressureChoices ?? []).find((choice) => choice.id === progress.pressureChoice);
  let text = cafePrologueHeaderHtml({ timeline: "同一晚", title: "序章后续", subtitle: "咖啡厅散场以后" });
  let choices = "";

  if (step === 6) {
    text += cafePrologueDialogueHtml([
      ...(pressureChoice?.echo ? [{ speaker: "旁白", type: "stage", text: pressureChoice.echo }] : []),
      ...(aftermath.openingLines ?? [])
    ]);
    choices = flowGroupHtml('<button class="primary" data-cafe-aftermath-next type="button">继续</button>');
  } else {
    const route = routes.find((item) => !progress.order.includes(item.id)) ?? routes.at(-1);
    text += cafeInvestigationResultHtml(route, "同一晚");
    text += cafePrologueDialogueHtml(route?.handoffLines ?? []);
    choices = flowGroupHtml(`<button class="primary" data-cafe-aftermath-next type="button">${routes.filter((item) => !progress.order.includes(item.id)).length <= 1 ? allCasesSolved ? "继续查看回告" : "回看这几个月的来电" : "继续核对家庭支出卡"}</button>`);
  }

  frame({
    brief,
    mood: "focused",
    label: "同一晚 · 咖啡厅散场后",
    chapter: "试玩序章后续",
    showCaseHud: false,
    visualHud: "",
    backdropClass: step === 6 ? "day-home cafe-aftermath-home" : "day-document cafe-aftermath-document",
    screenClass: `cafe-prologue-screen cafe-aftermath-screen cafe-aftermath-step-${step}`,
    text,
    choices
  });

  bind("[data-cafe-aftermath-next]", () => {
    if (step === 6) {
      state.cafePrologueOrder = [];
      return setCafePrologueStep(state, 7);
    }
    const route = routes.find((item) => !progress.order.includes(item.id));
    state.cafePrologueOrder = [...new Set([...progress.order, ...(route ? [route.id] : [])])];
    if (!cafePrologueCanOpenForensic(normalizedCafePrologueProgress(state))) {
      saveState();
      return render();
    }
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
  // The final return always includes the report; prior optional inquiries do not gate it.
  const hasAccount = progress.order.includes("account");
  let text = cafePrologueHeaderHtml({
    timeline: forensic.timeline ?? "数周后",
    title: "私下回告",
    subtitle: "双方委托鉴定"
  });
  text += cafePrologueDialogueHtml([
    ...(hasAccount ? forensic.openingLines ?? [] : (forensic.openingLines ?? []).slice(0, -1)),
    ...(hasAccount ? forensic.accountClueLines ?? [] : [])
  ]);
  text += cafeFinalBoundaryHtml({
    result: forensic.finalCards?.result,
    openAccount: hasAccount ? forensic.finalCards?.openAccount : "",
    unknown: []
  });
  const choices = flowGroupHtml(`<button class="primary" data-cafe-finish type="button">进入片尾</button>`, {
    label: "暂别",
    note: ""
  });
  frame({
    brief,
    mood: "focused",
    label: `${forensic.timeline ?? "数周后"} · 鉴定回告`,
    chapter: "尾声 · 咖啡厅来客",
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
  commit((state) => {
    state.cafePrologueStep = Math.max(0, Math.floor(Number(step) || 0));
    state.scene = cafePrologueSceneForStep(state.cafePrologueStep);
  });
}

  return {
    renderCafePrologue,
    renderCafePrologueAftermath,
    renderCafePrologueForensic,
    setCafePrologueStep
  };
}
