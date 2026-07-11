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
    if (!quotes.length && (SENTENCE_END.has(char) || ellipsis || char === "\n")) {
      const trailing = text[index + 1];
      if (["」", "』", "”", "’", "\""].includes(trailing)) continue;
      if (buffer.trim()) rows.push(buffer.trim());
      buffer = "";
    }
  }
  if (buffer.trim()) rows.push(buffer.trim());
  return rows;
}

export function dialoguePagesFrom(root) {
  return Array.from(root?.querySelectorAll?.(".call-line") ?? []).flatMap((line) => {
    const speaker = line.querySelector("b")?.textContent?.trim() || "咨询者";
    const role = line.classList.contains("host") ? "host" : "caller";
    return splitDialogueSentences(line.querySelector("p")?.textContent ?? "").map((text) => ({ speaker, role, text }));
  });
}

export function mountDialoguePresentation(root, options = {}) {
  const card = root?.querySelector?.(".dialogue-card");
  const source = card?.querySelector?.(".call-dialogue");
  const pages = dialoguePagesFrom(card);
  if (!card || !source || !pages.length) return null;
  source.hidden = true;
  card.classList.add("avg-dialogue-active");
  const choices = card.querySelector(".choices");
  if (choices) choices.hidden = true;
  const box = document.createElement("section");
  box.className = "avg-textbox";
  box.tabIndex = 0;
  box.dataset.dialogueAdvance = "true";
  box.innerHTML = `<b class="avg-nameplate"></b><p class="avg-line"></p><i class="avg-continue" aria-label="继续">▼</i>`;
  source.after(box);
  const controller = createDialogueController({ box, pages, choices, ...options });
  box.addEventListener("click", () => controller.advance());
  controller.start();
  return controller;
}

export function createDialogueController({ box, pages, choices, speed = "normal", onShown = () => {} } = {}) {
  let pageIndex = 0;
  let visibleCount = 0;
  let frameId = 0;
  let lastAt = 0;
  let complete = false;
  const reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const line = box.querySelector(".avg-line");
  const nameplate = box.querySelector(".avg-nameplate");
  const indicator = box.querySelector(".avg-continue");
  const delays = { slow: 54, normal: 34, fast: 18, instant: 0 };
  const baseDelay = delays[speed] ?? delays.normal;

  function showPage() {
    cancelAnimationFrame(frameId);
    const page = pages[pageIndex];
    visibleCount = 0;
    complete = false;
    box.classList.toggle("speaker-host", page.role === "host");
    box.classList.toggle("reduced-fade", reduceMotion);
    nameplate.textContent = page.role === "host" ? "你" : page.speaker;
    line.textContent = "";
    indicator.hidden = true;
    if (reduceMotion || baseDelay === 0) return finishPage();
    lastAt = performance.now();
    frameId = requestAnimationFrame(typeFrame);
  }

  function typeFrame(now) {
    const page = pages[pageIndex];
    const previous = page.text[Math.max(0, visibleCount - 1)] ?? "";
    const punctuationDelay = /[、，,]/.test(previous) ? 90 : /[—]/.test(previous) ? 120 : 0;
    if (now - lastAt >= baseDelay + punctuationDelay) {
      visibleCount += 1;
      line.textContent = page.text.slice(0, visibleCount);
      lastAt = now;
    }
    if (visibleCount >= page.text.length) finishPage();
    else frameId = requestAnimationFrame(typeFrame);
  }

  function finishPage() {
    cancelAnimationFrame(frameId);
    const page = pages[pageIndex];
    line.textContent = page.text;
    visibleCount = page.text.length;
    complete = true;
    indicator.hidden = false;
    onShown(page, pageIndex);
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
    box.dataset.dialogueDone = "true";
    choices?.querySelector("button:not(:disabled)")?.focus?.({ preventScroll: true });
  }

  return { start: showPage, advance, finish: finishPage, get complete() { return complete; }, get pageIndex() { return pageIndex; } };
}
