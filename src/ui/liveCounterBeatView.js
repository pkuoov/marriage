import { callDialogueHtml } from "./callFlowView.js?v=0.20.69";

export function liveCounterBeatHtml(beat = {}, pick = null) {
  const choices = beat.choices ?? [];
  const selectedChoice = choices.find((choice) => choice.id === pick?.choiceId) ?? null;
  return `
    <section class="interlude-action-card interrupt-toast-card live-counter-beat-card">
      <span class="source-badge">${escapeHtml(beat.from ?? "现场新消息")}</span>
      ${beat.text ? `<p><b>${escapeHtml(beat.text)}</b></p>` : ""}
      ${callDialogueHtml(beat.lines ?? [], "live-counter-dialogue")}
      ${choices.length ? `
        <div class="reply-choice-grid">
          ${choices.map((choice) => counterChoiceHtml(choice, pick)).join("")}
        </div>
      ` : ""}
      ${selectedChoice?.lines?.length ? callDialogueHtml(selectedChoice.lines, "live-counter-response") : ""}
    </section>
  `;
}

function counterChoiceHtml(choice = {}, pick = null) {
  if (pick) {
    return `
      <article class="reply-choice-option ${pick.choiceId === choice.id ? "selected" : "dimmed"}">
        <b>${escapeHtml(choice.label ?? "")}</b>
      </article>
    `;
  }
  return `
    <button class="reply-choice-option" data-live-counter-choice="${escapeHtml(choice.id ?? "")}" type="button">
      <b>${escapeHtml(choice.label ?? "")}</b>
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
