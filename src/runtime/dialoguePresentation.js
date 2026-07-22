const QUOTE_PAIRS = new Map([["「", "」"], ["『", "』"], ["“", "”"], ["‘", "’"], ["\"", "\""]]);
const SENTENCE_END = new Set(["。", "！", "？", "!", "?"]);

export function splitDialogueSentences(value = "") {
  const text = String(value ?? "").replace(/\r\n?/g, "\n");
  if (!text.trim()) return [];
  const rows = [];
  let buffer = "";
  const quotes = [];
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    buffer += char;
    if (QUOTE_PAIRS.has(char)) quotes.push(QUOTE_PAIRS.get(char));
    else if (quotes.at(-1) === char) {
      quotes.pop();
      if (!quotes.length && /[。！？!?]$/.test(buffer.slice(0, -1))) {
        if (buffer.trim()) rows.push(buffer.trim());
        buffer = "";
        continue;
      }
    }
    const ellipsis = char === "…" && text[index + 1] === "…";
    if (ellipsis) {
      buffer += text[index + 1];
      index += 1;
    }
    const interruption = char === "—" && text[index - 1] === "—";
    if (!quotes.length && (SENTENCE_END.has(char) || ellipsis || interruption || char === "\n")) {
      const trailing = text[index + 1];
      if (["」", "』", "”", "’", "\""].includes(trailing)) continue;
      if (buffer.trim()) rows.push(buffer.trim());
      buffer = "";
    }
  }
  if (buffer.trim()) rows.push(buffer.trim());
  return rows;
}

export function dialogueTurnsFrom(root, { maxTurnChars = 92, maxPageChars = 156 } = {}) {
  return Array.from(root?.querySelectorAll?.(".call-line, .night-shell-line, .call-stage-direction") ?? []).flatMap((line) => {
    const isStage = line.classList.contains("call-stage-direction");
    const speaker = isStage ? "现场" : line.querySelector("b")?.textContent?.trim() || "咨询者";
    const role = isStage ? "stage" : line.classList.contains("host") || line.classList.contains("shell-host") ? "host" : "caller";
    const text = isStage ? line.querySelector("span")?.textContent ?? "" : line.querySelector("p")?.textContent ?? "";
    const audioCueId = line.getAttribute?.("data-audio-cue-id") ?? "";
    const turnLimit = /[？?]$/.test(text.trim()) ? Math.max(maxTurnChars, maxPageChars) : maxTurnChars;
    return chunkDialogueTurn({ speaker, role, text, audioCueId }, turnLimit);
  });
}

export function dialoguePagesFrom(root, options = {}) {
  return groupDialogueTurns(dialogueTurnsFrom(root, options), options);
}

export function chunkDialogueTurn(turn = {}, maxChars = 92) {
  const sentences = splitDialogueSentences(turn.text ?? "");
  const chunks = [];
  let current = "";
  for (const sentence of sentences.flatMap((item) => splitLongSentence(item, maxChars))) {
    if (current && current.length + sentence.length > maxChars) {
      chunks.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks.map((text, index) => ({
    ...turn,
    speaker: turn.speaker ?? "咨询者",
    role: turn.role ?? "caller",
    text,
    continuation: chunks.length > 1 && index > 0,
    continues: chunks.length > 1 && index < chunks.length - 1
  }));
}

export function groupDialogueTurns(turns = [], { maxPageChars = 156 } = {}) {
  const pages = [];
  let index = 0;
  let carriedQuestion = null;
  while (index < turns.length) {
    const current = turns[index];
    const next = turns[index + 1];
    if (current.role === "host" && next?.role === "caller") {
      pages.push(...questionAnswerPages(current, next, { maxPageChars }));
      carriedQuestion = next.continues ? current : null;
      index += 2;
      continue;
    }
    if (current.role === "caller" && next?.role === "host" && (/[？?]$/.test(current.text) || !/[？?]$/.test(next.text))) {
      pages.push(...questionAnswerPages(current, next, { maxPageChars }));
      carriedQuestion = next.continues ? current : null;
      index += 2;
      continue;
    }
    if (carriedQuestion && current.continuation && current.role !== "stage") {
      pages.push(...questionAnswerPages(carriedQuestion, current, { maxPageChars, repeatQuestion: true }));
      carriedQuestion = current.continues ? carriedQuestion : null;
      index += 1;
      continue;
    }
    pages.push({ lines: [current] });
    carriedQuestion = null;
    index += 1;
  }
  return pages;
}

function questionAnswerPages(question = {}, answer = {}, { maxPageChars = 156, repeatQuestion = false } = {}) {
  const availableAnswerChars = Math.max(36, maxPageChars - String(question.text ?? "").length);
  const answerChunks = chunkDialogueTurn(answer, availableAnswerChars);
  return answerChunks.map((answerChunk, index) => ({
    lines: [
      {
        ...question,
        repeatedContext: repeatQuestion || index > 0,
        continuation: false,
        continues: false
      },
      {
        ...answerChunk,
        continuation: Boolean(answer.continuation || index > 0),
        continues: Boolean(answer.continues || index < answerChunks.length - 1)
      }
    ]
  }));
}

function splitLongSentence(value = "", maxChars = 92) {
  const chunks = [];
  let remaining = String(value ?? "").trim();
  while (remaining.length > maxChars) {
    const window = remaining.slice(0, maxChars + 1);
    const breakAt = Math.max(window.lastIndexOf("，"), window.lastIndexOf("；"), window.lastIndexOf("："), window.lastIndexOf("、"));
    const index = breakAt >= Math.floor(maxChars * 0.45) ? breakAt + 1 : maxChars;
    chunks.push(remaining.slice(0, index).trim());
    remaining = remaining.slice(index).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export function mountDialoguePresentation(root, options = {}) {
  const card = root?.querySelector?.(".dialogue-card");
  const sources = Array.from(card?.querySelectorAll?.(".call-dialogue, .night-shell-card") ?? [])
    .filter((candidate) => !candidate.closest("details:not([open])"));
  const pages = groupDialogueTurns(sources.flatMap((source) => dialogueTurnsFrom(source, options)), options);
  if (!card || !sources.length || !pages.length) return null;
  const box = document.createElement("section");
  box.className = "avg-textbox";
  box.tabIndex = 0;
  box.dataset.dialogueAdvance = "true";
  box.innerHTML = `<div class="avg-page-lines"></div><i class="avg-continue" aria-label="继续">▼</i>`;
  sources.at(-1).after(box);
  const choices = root?.querySelector?.(".choices");
  if (choices) choices.hidden = true;
  const inlineChoiceRegions = Array.from(card.querySelectorAll(".day-followup, .reply-choice-grid"))
    .filter((region) => region.querySelector("button"));
  inlineChoiceRegions.forEach((region) => { region.hidden = true; });
  sources.forEach((source) => { source.hidden = true; });
  card.classList.add("avg-dialogue-active");
  const controller = createDialogueController({
    box,
    pages,
    choices,
    ...options,
    onChoicesShown: (shownChoices) => {
      inlineChoiceRegions.forEach((region) => { region.hidden = false; });
      options.onChoicesShown?.(shownChoices);
    }
  });
  box.addEventListener("click", () => controller.advance());
  controller.start();
  return controller;
}

export function createDialogueController({ box, pages, choices, speed = "normal", onPageStart = () => {}, onShown = () => {}, onChoicesShown = () => {} } = {}) {
  let pageIndex = 0;
  let visibleCount = 0;
  let frameId = 0;
  let lastAt = 0;
  let complete = false;
  const reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const pageLines = box.querySelector(".avg-page-lines");
  const indicator = box.querySelector(".avg-continue");
  const delays = { slow: 54, normal: 34, fast: 18, instant: 0 };
  const baseDelay = delays[speed] ?? delays.normal;

  function showPage() {
    cancelAnimationFrame(frameId);
    const page = pages[pageIndex];
    const lines = normalizedPageLines(page);
    visibleCount = 0;
    complete = false;
    box.classList.toggle("speaker-host", lines[0]?.role === "host");
    box.classList.toggle("reduced-fade", reduceMotion);
    pageLines.innerHTML = lines.map((entry) => `
      <div class="avg-page-line speaker-${entry.role === "host" ? "host" : entry.role === "stage" ? "stage" : "caller"}${entry.repeatedContext ? " context-repeat" : ""}">
        <b>${entry.repeatedContext ? "上一问 · " : ""}${escapeHtml(entry.role === "host" ? "林旭阳" : entry.speaker)}</b>
        <p class="avg-line"></p>
      </div>
    `).join("");
    onPageStart(page, pageIndex);
    applyVisibleText(page, 0);
    indicator.hidden = true;
    if (reduceMotion || baseDelay === 0) return finishPage();
    lastAt = performance.now();
    frameId = requestAnimationFrame(typeFrame);
  }

  function typeFrame(now) {
    const page = pages[pageIndex];
    const fullText = typeablePageLines(page).map((entry) => entry.text).join("");
    const previous = fullText[Math.max(0, visibleCount - 1)] ?? "";
    const punctuationDelay = /[、，,]/.test(previous) ? 90 : /[—]/.test(previous) ? 120 : 0;
    if (now - lastAt >= baseDelay + punctuationDelay) {
      visibleCount += 1;
      applyVisibleText(page, visibleCount);
      lastAt = now;
    }
    if (visibleCount >= fullText.length) finishPage();
    else frameId = requestAnimationFrame(typeFrame);
  }

  function finishPage() {
    cancelAnimationFrame(frameId);
    const page = pages[pageIndex];
    visibleCount = typeablePageLines(page).reduce((sum, entry) => sum + entry.text.length, 0);
    applyVisibleText(page, visibleCount);
    complete = true;
    indicator.hidden = false;
    onShown(page, pageIndex);
  }

  function applyVisibleText(page, count) {
    let remaining = count;
    const lines = normalizedPageLines(page);
    Array.from(pageLines.querySelectorAll(".avg-line")).forEach((element, index) => {
      const text = lines[index]?.text ?? "";
      if (lines[index]?.repeatedContext) {
        element.textContent = text;
        return;
      }
      const visible = Math.max(0, Math.min(text.length, remaining));
      element.textContent = text.slice(0, visible);
      remaining -= visible;
    });
  }

  function advance() {
    if (!complete) return finishPage();
    if (pageIndex < pages.length - 1) {
      pageIndex += 1;
      showPage();
      return;
    }
    indicator.hidden = true;
    if (choices) choices.hidden = false;
    onChoicesShown(choices);
    box.dataset.dialogueDone = "true";
    choices?.querySelector("button:not(:disabled)")?.focus?.({ preventScroll: true });
  }

  return { start: showPage, advance, finish: finishPage, get complete() { return complete; }, get pageIndex() { return pageIndex; } };
}

function normalizedPageLines(page = {}) {
  if (Array.isArray(page.lines)) return page.lines;
  return page.text ? [page] : [];
}

function typeablePageLines(page = {}) {
  return normalizedPageLines(page).filter((line) => !line.repeatedContext);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
