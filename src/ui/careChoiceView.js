import { CHOICE_COST_META } from "../runtime/choiceCostModel.js";
import { choiceButtonBodyHtml } from "./callFlowView.js";

export function careChoiceHtml({ choices = [], selectedChoice = null } = {}) {
  return `
    <section class="care-choice-card">
      <div class="care-choice-heading">
        <span>今晚最后一句</span>
        <h2>案情说完了，你还想怎么送她下麦？</h2>
        <p>这句不判分。她会记得你怎么说。</p>
      </div>
      ${selectedChoice ? careChoiceDialogueHtml(selectedChoice) : `
        <div class="care-choice-grid">
          ${choices.map((choice) => `
            <button class="decision-choice" data-care-choice="${escapeHtml(choice.id)}" type="button">
              ${choiceButtonBodyHtml(choice.label, CHOICE_COST_META.careChoice, choice.hostLine)}
            </button>
          `).join("")}
        </div>
      `}
    </section>
  `;
}

export function careChoiceContinueHtml({ finalCase = false } = {}) {
  return `<button class="primary" data-care-choice-continue type="button">${finalCase ? "听完这夜" : "正式结案"}</button>`;
}

function careChoiceDialogueHtml(choice = {}) {
  const lines = [
    { role: "host", speaker: "林旭阳", text: choice.hostLine },
    ...(choice.lines ?? [])
  ];
  return `
    <div class="care-choice-dialogue">
      ${lines.map((line) => line.role === "pause"
        ? `<div class="care-choice-pause" aria-label="停顿"><span></span></div>`
        : `<div class="care-choice-line care-${escapeHtml(line.role ?? "caller")}">
            <b>${escapeHtml(line.speaker ?? (line.role === "host" ? "林旭阳" : "咨询者"))}</b>
            <p>${escapeHtml(line.text ?? "")}</p>
          </div>`).join("")}
    </div>
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
