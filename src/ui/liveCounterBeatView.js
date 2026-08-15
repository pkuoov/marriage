import { callDialogueHtml } from "./callFlowView.js";

export function liveCounterBeatHtml(beat = {}, pick = null) {
  const choices = beat.choices ?? [];
  const selectedChoice = choices.find((choice) => choice.id === pick?.choiceId) ?? null;
  const presentationClass = beat.presentation === "gift" ? " gift-counter-beat-card" : "";
  return `
    <section class="interlude-action-card interrupt-toast-card live-counter-beat-card${presentationClass}">
      <span class="source-badge">${escapeHtml(beat.from ?? "现场新消息")}</span>
      ${beat.text ? `<p><b>${escapeHtml(beat.text)}</b></p>` : ""}
      ${callDialogueHtml(beat.lines ?? [], "live-counter-dialogue")}
      ${choices.length ? `
        <div class="reply-choice-grid">
          ${choices.map((choice) => counterChoiceHtml(choice, pick)).join("")}
        </div>
      ` : ""}
      ${selectedChoice ? callDialogueHtml([
        ...(selectedChoice.silent ? [] : [{ role: "host", text: selectedChoice.label ?? "" }]),
        ...(selectedChoice.lines ?? [])
      ], "live-counter-response") : ""}
    </section>
  `;
}

function counterChoiceHtml(choice = {}, pick = null) {
  const directionLabel = choice.directionLabel ?? choice.label ?? "";
  if (pick) {
    return `
      <article class="reply-choice-option ${pick.choiceId === choice.id ? "selected" : "dimmed"}">
        <b>${escapeHtml(directionLabel)}</b>
      </article>
    `;
  }
  return `
    <button class="reply-choice-option" data-live-counter-choice="${escapeHtml(choice.id ?? "")}" type="button">
      <b>${escapeHtml(directionLabel)}</b>
    </button>
  `;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
