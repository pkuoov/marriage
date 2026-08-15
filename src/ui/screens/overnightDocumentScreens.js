export function createOvernightDocumentScreens(ctx, callbacks = {}) {
  const {
    playAudioCueOnce,
    caseKey,
    documentById,
    documentRowById,
    earnedDocumentQuestionsFor,
    evidenceChecksFor,
    keyQuestionLimit,
    CHOICE_COST_META,
    callDialogueHtml,
    choiceButtonBodyHtml,
    flowGroupHtml,
    saveState,
    render,
    frame,
    dayFrame,
    bind,
    bindSceneButtons,
    markAction,
    ensureOvernight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    escapeHtml
  } = ctx;
  const {
    renderDayMap,
    completeDayScene,
    overnightRouteIndexFor,
    enterOvernightNight2
  } = callbacks;

  function renderDocumentDayScene(brief, dayScene = {}) {
    const state = ctx.getState();
    const document = documentById(brief, dayScene.body?.documentId);
    if (!document) {
      state.scene = "dayMap";
      saveState();
      return renderDayMap(brief);
    }
    const overnight = ensureOvernight(brief);
    const markedRows = overnight.documentMarks?.[document.id] ?? [];
    const canLeave = markedRows.length > 0;
    dayFrame({
      brief,
      label: dayScene.label ?? document.title ?? "回后台审流水",
      chapter: quietDayChapter(dayScene.kind),
      backdropClass: dayScene.backdropClass ?? "day-document",
      text: `
        ${dayScene.body?.access ? `<p class="hint day-access-hint"><b>这份材料为什么能看：</b>${escapeHtml(dayScene.body.access)}</p>` : ""}
        ${documentViewerHtml({ document, markedRows })}
      `,
      choices: flowGroupHtml(`
        <button data-scene="dayMap" type="button">先回安排页</button>
        ${canLeave
          ? `<button class="primary" data-complete-day-scene type="button">圈好，带回直播间</button>`
          : `<button type="button" disabled>先圈一行</button>`}
      `)
    });
    bind("[data-document-row]", (event) => markDocumentRow(brief, dayScene, document, event.currentTarget?.getAttribute("data-document-row") ?? ""));
    bind("[data-complete-day-scene]", () => completeDayScene(brief, dayScene));
    bindSceneButtons();
  }

  function renderDocumentReconcile(brief) {
    const overnight = ensureOvernight(brief);
    const pending = pendingDocumentQuestions(brief);
    const active = (overnight.documentEarnedQuestions ?? []).find((question) => question.id === overnight.activeDocumentQuestionId) ?? null;
    if (!pending.length && !active) {
      enterOvernightNight2(brief);
      return;
    }
    frame({
      brief,
      mood: "focused",
      label: "对账节拍",
      chapter: "第二夜",
      text: documentReconcileHtml({ active, pending }),
      choices: flowGroupHtml(`
        ${active ? `<button class="primary" data-close-document-question type="button">继续对账</button>` : ""}
        ${!active && !pending.length ? `<button class="primary" data-enter-overnight-night2-direct type="button">继续追问</button>` : ""}
      `)
    });
    bind("[data-document-question]", (event) => askDocumentQuestion(brief, event.currentTarget?.getAttribute("data-document-question") ?? ""));
    bind("[data-close-document-question]", () => {
      updateOvernight(brief, { activeDocumentQuestionId: null });
      saveState();
      render();
    });
    bind("[data-enter-overnight-night2-direct]", () => enterOvernightNight2(brief));
    bindSceneButtons();
  }

  function dayTimelineHtml(dayScene = {}, timeline = {}, timelineState = {}) {
    const order = timelineState.order ?? [];
    const submitted = Boolean(timelineState.submitted);
    const selected = new Set(order);
    const cards = timeline.cards ?? [];
    const payoff = timelineState.correct ? timeline.payoffLine : timeline.missLine;
    return `
      <section class="day-timeline-sort">
        <header class="timeline-sort-head">
          <span class="source-badge">时间线</span>
          <b>把确认过的时间点，从早到晚放进来。</b>
          <small>已放 ${order.length}/${cards.length} 张。</small>
        </header>
        <section class="timeline-order" aria-label="当前时间线">
          <span>当前顺序</span>
          <ol class="timeline-picked">
            ${cards.map((_, index) => {
              const card = order[index];
              return `<li class="${card ? "filled" : "empty"}"><i>${index + 1}</i><span>${escapeHtml(card ?? "等待放入")}</span></li>`;
            }).join("")}
          </ol>
        </section>
        ${submitted ? `<p class="reaction">${escapeHtml(payoff ?? "")}</p>` : `
          <section class="timeline-available">
            <span>待放时间点</span>
            <div class="timeline-card-grid">
              ${cards.map((card) => `
                <button class="decision-choice" data-day-timeline-card="${escapeHtml(card)}" ${selected.has(card) ? "disabled" : ""} type="button">
                  ${choiceButtonBodyHtml(card, selected.has(card) ? "已放入" : CHOICE_COST_META.timelineCard)}
                </button>
              `).join("")}
            </div>
          </section>
          <div class="inline-actions">
            <button data-reset-day-timeline ${order.length ? "" : "disabled"} type="button">清空重排</button>
            <button class="primary" data-submit-day-timeline ${order.length === cards.length ? "" : "disabled"} type="button">确认时间线</button>
          </div>
        `}
      </section>
    `;
  }

  function dayFollowupHtml(body = {}, followupAsked = false) {
    const followup = body.followup;
    if (!followup?.question) return "";
    return `
      <section class="day-followup">
        ${followupAsked ? callDialogueHtml([
          { role: "host", text: followup.question },
          { role: "caller", speaker: followup.speaker ?? "她", text: followup.answer ?? "" }
        ]) : `<button class="decision-choice" data-day-followup type="button">${choiceButtonBodyHtml(followup.question, CHOICE_COST_META.dayFollowup)}</button>`}
      </section>
    `;
  }

  function quietDayChapter(dayKind = "") {
    return {
      lab: "白天·鉴定所",
      visit: "白天·街上",
      home: "白天·家",
      studio: "白天·工作室",
      document: "白天·后台流水",
      observe: "白天·同场观察",
      doorstep: "白天·门口"
    }[dayKind] ?? "白天";
  }

  function documentViewerHtml({ document = {}, markedRows = [] } = {}) {
    const marked = new Set(markedRows ?? []);
    const limit = Number(document.markLimit ?? 3);
    const columns = documentTableColumns(document);
    const gridStyle = `grid-template-columns: 56px repeat(${columns.length}, minmax(110px, 1fr));`;
    return `
      <section class="document-viewer-card">
        <span class="source-badge">文档呈堂</span>
        <p><b>${escapeHtml(document.title ?? "")}</b></p>
        <p>${escapeHtml(document.intro ?? "")}</p>
        <div class="document-mark-limit"><b>已圈 ${marked.size}/${limit}</b><span>圈行后，夜里可逐条对账。</span></div>
        <div class="bank-flow-table" role="table" aria-label="${escapeHtml(document.title ?? "流水单")}">
          <div class="bank-flow-head" role="row" style="${gridStyle}">
            <span>序号</span>${columns.map((column) => `<span>${escapeHtml(column.label)}</span>`).join("")}
          </div>
          ${(document.rows ?? []).map((row, index) => {
            const selected = marked.has(row.rowId);
            const disabled = !selected && marked.size >= limit;
            return `
              <button class="bank-flow-row ${selected ? "marked" : ""}" data-document-row="${escapeHtml(row.rowId ?? "")}" ${disabled || selected ? "disabled" : ""} type="button" role="row" style="${gridStyle}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                ${columns.map((column) => `<span>${escapeHtml(row[column.key] ?? "")}</span>`).join("")}
              </button>
            `;
          }).join("")}
        </div>
        ${documentEarnedPreviewHtml(document, markedRows)}
      </section>
    `;
  }

  function documentTableColumns(document = {}) {
    if (Array.isArray(document.columns) && document.columns.length) return document.columns;
    return [
      { key: "date", label: "日期" },
      { key: "kind", label: "类别" },
      { key: "amount", label: "金额" },
      { key: "party", label: "对手方" },
      { key: "memo", label: "备注" }
    ];
  }

  function documentEarnedPreviewHtml(document = {}, markedRows = []) {
    const earned = earnedDocumentQuestionsFor(document, markedRows);
    if (!earned.length) return "";
    return `
      <section class="document-earned-preview">
        <span class="source-badge">夜里可问</span>
        ${earned.map((question) => `<p>${escapeHtml(question.question ?? "")}</p>`).join("")}
      </section>
    `;
  }

  function documentReconcileHtml({ active = null, pending = [] } = {}) {
    if (active) {
      return `
        <section class="document-reconcile-card">
          <span class="source-badge">对账</span>
          ${callDialogueHtml([
            { role: "host", text: active.question ?? "" },
            { role: "caller", text: active.answer ?? "" }
          ])}
        </section>
      `;
    }
    return `
      <section class="document-reconcile-card">
        <span class="source-badge">对账节拍</span>
        <p><b>白天圈出的行，夜里逐条问。</b></p>
        <div class="document-question-grid">
          ${pending.map((question) => `
            <button data-document-question="${escapeHtml(question.id ?? "")}" type="button">
              <b>${escapeHtml(questionLabel(question))}</b>
              <span>${escapeHtml(question.question ?? "")}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  function questionLabel(question = {}) {
    return question.kind === "cross" ? "跨行对照" : "单行追问";
  }

  function selectTimelineCard(brief, dayScene = {}, card = "") {
    if (!card) return;
    const overnight = ensureOvernight(brief);
    const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    if (previous.submitted || (previous.order ?? []).includes(card)) return;
    updateOvernight(brief, {
      timelineSorts: {
        ...(overnight.timelineSorts ?? {}),
        [dayScene.id]: {
          ...previous,
          order: [...(previous.order ?? []), card]
        }
      }
    });
    saveState();
    render();
  }

  function submitTimelineSort(brief, dayScene = {}) {
    const overnight = ensureOvernight(brief);
    const timeline = dayScene.body?.timelineSort ?? {};
    const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    const order = previous.order ?? [];
    if (previous.submitted || order.length !== (timeline.cards ?? []).length) return;
    const correct = JSON.stringify(order) === JSON.stringify(timeline.correctOrder ?? []);
    updateOvernight(brief, {
      timelineSorts: {
        ...(overnight.timelineSorts ?? {}),
        [dayScene.id]: {
          order,
          submitted: true,
          correct
        }
      }
    });
    recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene), {
      question: dayScene.label ?? "白天排序",
      answer: order.join(" / "),
      routeAxis: dayScene.body?.routeAxis ?? "document-edge",
      routeTone: correct ? "timeline-hit" : "timeline-miss"
    }, { version: dayScene.body?.text ?? "" });
    completeDayScene(brief, dayScene, { renderNow: false, stayActive: true });
    saveState();
    render();
  }

  function markDocumentRow(brief, dayScene = {}, document = {}, rowId = "") {
    const row = documentRowById(document, rowId);
    if (!row) return;
    const overnight = ensureOvernight(brief);
    const previous = overnight.documentMarks?.[document.id] ?? [];
    if (previous.includes(rowId)) return;
    const limit = Math.max(0, Number(document.markLimit ?? 3));
    if (previous.length >= limit) return;
    const markedRows = [...previous, rowId];
    const earned = mergeDocumentQuestions(overnight.documentEarnedQuestions ?? [], earnedDocumentQuestionsFor(document, markedRows));
    updateOvernight(brief, {
      documentMarks: {
        ...(overnight.documentMarks ?? {}),
        [document.id]: markedRows
      },
      documentEarnedQuestions: earned
    });
    markAction(brief, `document:${document.id}:${rowId}`);
    playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:document:${document.id}:${rowId}`);
    recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene) + markedRows.length / 1000, {
      question: `圈出：${row.date ?? row.kind ?? "这一行"}`,
      answer: documentRowSummary(row, document),
      routeAxis: "document-edge",
      routeTone: "document-row"
    }, { version: document.title ?? "" });
    saveState();
    render();
  }

  function mergeDocumentQuestions(current = [], next = []) {
    const byId = new Map((current ?? []).map((question) => [question.id, question]));
    (next ?? []).forEach((question) => byId.set(question.id, question));
    return [...byId.values()];
  }

  function documentRowSummary(row = {}, document = {}) {
    return documentTableColumns(document).map((column) => row[column.key]).filter(Boolean).join("；");
  }

  function pendingDocumentQuestions(brief) {
    const overnight = ensureOvernight(brief);
    const answered = overnight.documentAnsweredQuestions ?? {};
    return (overnight.documentEarnedQuestions ?? []).filter((question) => !answered[question.id]);
  }

  function askDocumentQuestion(brief, questionId = "") {
    const overnight = ensureOvernight(brief);
    const question = (overnight.documentEarnedQuestions ?? []).find((item) => item.id === questionId);
    if (!question) return;
    updateOvernight(brief, {
      activeDocumentQuestionId: question.id,
      documentAnsweredQuestions: {
        ...(overnight.documentAnsweredQuestions ?? {}),
        [question.id]: true
      }
    });
    markAction(brief, `documentQuestion:${question.id}`);
    if (question.contradiction) recordContradiction(brief, question.contradiction);
    recordRouteChoice(brief, documentQuestionRouteIndexFor(brief, question), {
      question: question.question ?? "",
      answer: question.answer ?? "",
      routeAxis: question.routeAxis ?? "document-edge",
      routeTone: question.kind === "cross" ? "document-cross" : "document-row-question"
    }, { version: question.rows?.join(" / ") ?? "" });
    saveState();
    render();
  }

  function documentQuestionRouteIndexFor(brief = {}, question = {}) {
    const questions = ensureOvernight(brief).documentEarnedQuestions ?? [];
    const index = Math.max(0, questions.findIndex((item) => item.id === question.id));
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.5 + index / 100;
  }

  return {
    renderDocumentDayScene,
    renderDocumentReconcile,
    dayTimelineHtml,
    dayFollowupHtml,
    quietDayChapter,
    selectTimelineCard,
    submitTimelineSort,
    pendingDocumentQuestions
  };
}
