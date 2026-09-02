import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

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

export function dialogueTurnsFrom(root, { maxTurnChars = 92, maxTurnSentences = 2, maxPageChars = 156, hostName = DEFAULT_PLAYER_NAME } = {}) {
  return Array.from(root?.querySelectorAll?.(".call-line, .night-shell-line, .call-stage-direction, .cafe-prologue-line") ?? []).flatMap((line) => {
    const isCallStage = line.classList.contains("call-stage-direction");
    const isNarration = line.classList.contains("shell-narration") || line.classList.contains("shell-stage");
    const isStage = isCallStage || isNarration;
    const speaker = isCallStage
      ? "现场"
      : line.querySelector("b")?.textContent?.trim() || (isNarration ? "旁白" : "咨询者");
    const authoredRole = line.getAttribute?.("data-dialogue-role") ?? "";
    const role = authoredRole || (isStage
      ? "stage"
      : line.classList.contains("host") || line.classList.contains("shell-host") || speaker === DEFAULT_PLAYER_NAME || speaker === hostName
        ? "host"
        : speaker === "男方"
          ? "respondent"
          : "caller");
    const text = isCallStage ? line.querySelector("span")?.textContent ?? "" : line.querySelector("p")?.textContent ?? "";
    const audioCueId = line.getAttribute?.("data-audio-cue-id") ?? "";
    const autoAdvanceNext = line.getAttribute?.("data-auto-advance-next") === "true";
    const statementBlock = line.getAttribute?.("data-dialogue-block") === "statement";
    const speedTier = line.getAttribute?.("data-text-speed-tier") ?? "";
    return chunkDialogueTurn(
      { speaker, role, text, audioCueId, autoAdvanceNext, statementBlock, speedTier },
      statementBlock ? Number.MAX_SAFE_INTEGER : maxTurnChars,
      statementBlock ? Number.MAX_SAFE_INTEGER : maxTurnSentences
    );
  });
}

export function dialoguePagesFrom(root, options = {}) {
  return groupDialogueTurns(dialogueTurnsFrom(root, options), options);
}

export function chunkDialogueTurn(turn = {}, maxChars = 92, maxSentences = 2) {
  const sentences = splitDialogueSentences(turn.text ?? "");
  const chunks = [];
  let current = "";
  let sentenceCount = 0;
  const sentenceLimit = Math.max(1, Number(maxSentences) || 2);
  for (const sentence of sentences.flatMap((item) => splitLongSentence(item, maxChars))) {
    if (current && (current.length + sentence.length > maxChars || sentenceCount >= sentenceLimit)) {
      chunks.push(current);
      current = sentence;
      sentenceCount = 1;
    } else {
      current += sentence;
      sentenceCount += 1;
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

export function groupDialogueTurns(turns = []) {
  return turns.filter((turn) => String(turn?.text ?? "").trim()).map((turn) => ({ lines: [turn] }));
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
  const sources = Array.from(card?.querySelectorAll?.(".call-dialogue, .night-shell-card, .cafe-prologue-dialogue") ?? [])
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
  const shell = root?.querySelector?.("[data-live-shell]");
  shell?.classList.add("dialogue-focus-stage");
  const controller = createDialogueController({
    box,
    pages,
    choices,
    ...options,
    pairedAutoAdvance: options.pairedAutoAdvance === true,
    onPageStart: (page, pageIndex) => {
      syncDialoguePortraitFocus(root, page);
      options.onPageStart?.(page, pageIndex);
    },
    onChoicesShown: (shownChoices) => {
      inlineChoiceRegions.forEach((region) => { region.hidden = false; });
      options.onChoicesShown?.(shownChoices);
    }
  });
  box.addEventListener("click", () => controller.advance());
  controller.start();
  return controller;
}

export function createDialogueController({
  box,
  pages,
  choices,
  speed = "normal",
  hostName = DEFAULT_PLAYER_NAME,
  autoMode = false,
  autoDelay = 2,
  pairedAutoDelay = 450,
  pairedAutoAdvance = false,
  presentationProfile = {},
  onBlip = () => {},
  onPageStart = () => {},
  onShown = () => {},
  onChoicesShown = () => {}
} = {}) {
  let pageIndex = 0;
  let visibleCount = 0;
  let frameId = 0;
  let autoTimerId = 0;
  let lastAt = 0;
  let complete = false;
  const reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const pageLines = box.querySelector(".avg-page-lines");
  const indicator = box.querySelector(".avg-continue");
  const delays = { slow: 54, normal: 34, fast: 18, instant: 0 };
  const baseDelay = delays[speed] ?? delays.normal;
  let activeDelay = baseDelay;

  function showPage() {
    clearAutoAdvance();
    cancelAnimationFrame(frameId);
    const page = pages[pageIndex];
    const lines = normalizedPageLines(page);
    const speedTier = lines.find((line) => line.speedTier)?.speedTier ?? "";
    const tierProfile = presentationProfile.speedTiers?.[speedTier] ?? {};
    activeDelay = Number.isFinite(Number(tierProfile.delay)) ? Number(tierProfile.delay) : baseDelay;
    visibleCount = 0;
    complete = false;
    const activeRole = dialoguePageRole(page);
    box.classList.toggle("speaker-host", activeRole === "host");
    box.classList.toggle("speaker-caller", activeRole === "caller");
    box.classList.toggle("speaker-respondent", activeRole === "respondent");
    box.classList.toggle("speaker-stage", activeRole === "stage");
    box.dataset.activeSpeaker = activeRole;
    box.classList.toggle("reduced-fade", reduceMotion);
    pageLines.innerHTML = lines.map((entry) => `
      <div class="avg-page-line speaker-${safeRoleClass(entry.role)}${entry.repeatedContext ? " context-repeat" : ""}" data-dialogue-role="${safeRoleClass(entry.role)}">
        <b>${entry.repeatedContext ? "上一问 · " : ""}${escapeHtml(entry.role === "host" ? hostName : entry.speaker)}</b>
        <p class="avg-line"></p>
      </div>
    `).join("");
    onPageStart(page, pageIndex);
    applyVisibleText(page, 0);
    indicator.hidden = true;
    if (reduceMotion || activeDelay === 0) return finishPage();
    lastAt = performance.now() + Math.max(0, Number(tierProfile.holdMs) || 0);
    frameId = requestAnimationFrame(typeFrame);
  }

  function typeFrame(now) {
    const page = pages[pageIndex];
    const fullText = typeablePageLines(page).map((entry) => entry.text).join("");
    const previous = fullText[Math.max(0, visibleCount - 1)] ?? "";
    const punctuationDelay = /[、，,]/.test(previous) ? 90 : /[—]/.test(previous) ? 120 : 0;
    if (now - lastAt >= activeDelay + punctuationDelay) {
      visibleCount += 1;
      applyVisibleText(page, visibleCount);
      if (visibleCount % 2 === 1) onBlip(presentationProfile.blipPitchHz?.[dialoguePageRole(page)] ?? 280);
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
    scheduleAutoAdvance();
  }

  function scheduleAutoAdvance() {
    clearAutoAdvance();
    const nextPage = pages[pageIndex + 1];
    const pairDelay = pairedAutoAdvance && !reduceMotion && activeDelay > 0 && shouldAutoAdvanceDialoguePair(pages[pageIndex], nextPage)
      ? Math.max(250, Number(pairedAutoDelay) || 450)
      : null;
    const delay = autoMode
      ? Math.max(1, Number(autoDelay) || 2) * 500
      : pairDelay;
    if (delay === null) return;
    autoTimerId = globalThis.setTimeout(() => {
      autoTimerId = 0;
      if (box.isConnected === false) return;
      advance();
    }, delay);
  }

  function clearAutoAdvance() {
    if (!autoTimerId) return;
    globalThis.clearTimeout(autoTimerId);
    autoTimerId = 0;
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
    clearAutoAdvance();
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

  return { start: showPage, advance, finish: finishPage, destroy: clearAutoAdvance, get complete() { return complete; }, get pageIndex() { return pageIndex; } };
}

function safeRoleClass(value = "caller") {
  const role = String(value ?? "caller").toLowerCase();
  return /^[a-z][a-z0-9-]*$/.test(role) ? role : "caller";
}

export function shouldAutoAdvanceDialoguePair(page = {}, nextPage = null) {
  if (!nextPage) return false;
  const lines = normalizedPageLines(page);
  if (lines.length !== 1 || lines[0]?.autoAdvanceNext !== true) return false;
  const role = dialoguePageRole(page);
  const nextRole = dialoguePageRole(nextPage);
  return role !== "stage" && nextRole !== "stage" && role !== nextRole;
}

export function dialoguePageRole(page = {}) {
  const roles = [...new Set(normalizedPageLines(page).map((line) => line?.role).filter((role) => role && role !== "stage"))];
  return roles.length === 1 ? roles[0] : "stage";
}

export function syncDialoguePortraitFocus(root, page = {}) {
  const role = dialoguePageRole(page);
  const shell = root?.querySelector?.("[data-live-shell]");
  if (shell) shell.dataset.activeSpeaker = role;
  Array.from(root?.querySelectorAll?.("[data-dialogue-portrait]") ?? []).forEach((portrait) => {
    portrait.classList.toggle("active", portrait.dataset.dialoguePortrait === role);
  });
  const hostPortrait = root?.querySelector?.("[data-host-portrait]");
  if (hostPortrait) {
    const state = role === "host" ? hostPortrait.dataset.hostSpeakingState ?? "questioning" : "listening";
    const src = hostPortrait.dataset[`hostArt${capitalize(state)}`] ?? hostPortrait.dataset.hostArtQuestioning;
    if (src && hostPortrait.getAttribute("src") !== src) hostPortrait.setAttribute("src", src);
  }
  const respondentPortrait = root?.querySelector?.("[data-respondent-portrait]");
  if (respondentPortrait) {
    const holder = respondentPortrait.closest("[data-dialogue-portrait='respondent']");
    const src = role === "respondent" ? holder?.dataset.respondentArtGuarded : holder?.dataset.respondentArtNeutral;
    if (src && respondentPortrait.getAttribute("src") !== src) respondentPortrait.setAttribute("src", src);
  }
  return role;
}

function capitalize(value = "") {
  const text = String(value ?? "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "";
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
