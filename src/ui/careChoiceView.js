import { choiceButtonBodyHtml } from "./callFlowView.js";
import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export function careChoiceHtml({ choices = [], selectedChoice = null, hostName = DEFAULT_PLAYER_NAME } = {}) {
  return `
    <section class="care-choice-card">
      <div class="care-choice-heading">
        <span>今晚最后一句</span>
        <h2>案情说完了，最后跟她说一句。</h2>
      </div>
      ${selectedChoice ? careChoiceDialogueHtml(selectedChoice, hostName) : `
        <div class="care-choice-grid">
          ${choices.map((choice) => `
            <button class="decision-choice" data-care-choice="${escapeHtml(choice.id)}" type="button">
              ${choiceButtonBodyHtml(choice.label)}
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

function careChoiceDialogueHtml(choice = {}, hostName = DEFAULT_PLAYER_NAME) {
  const lines = [
    { role: "host", speaker: hostName, text: choice.hostLine },
    ...(choice.lines ?? [])
  ];
  return `
    <div class="care-choice-dialogue">
      ${lines.map((line) => line.role === "pause"
        ? `<div class="care-choice-pause" aria-label="停顿"><span></span></div>`
        : `<div class="care-choice-line care-${escapeHtml(line.role ?? "caller")}">
            <b>${escapeHtml(line.speaker ?? (line.role === "host" ? hostName : "咨询者"))}</b>
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
