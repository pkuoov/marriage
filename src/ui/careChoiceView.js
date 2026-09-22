import { choiceButtonBodyHtml } from "./callFlowView.js";
import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";
import { escapeHtml } from "./html.js";

export function careChoiceHtml({ choices = [], selectedChoice = null, hostName = DEFAULT_PLAYER_NAME, privateConsultation = false } = {}) {
  const sequential = choices[0]?.sequential;
  const nextChoice = sequential ? choices[selectedChoice ? choices.findIndex((choice) => choice.id === selectedChoice.id) + 1 : 0] : null;
  return `
    <section class="care-choice-card">
      <div class="care-choice-heading">
        <span>今晚最后一句</span>
        <h2>${privateConsultation ? "结束通话前" : "收麦前"}</h2>
      </div>
      ${selectedChoice ? careChoiceDialogueHtml(selectedChoice, hostName) : !sequential ? `
        <div class="care-choice-grid">
          ${choices.map((choice) => `
            <button class="decision-choice" data-care-choice="${escapeHtml(choice.id)}" type="button">
              ${choiceButtonBodyHtml(choice.label)}
            </button>
          `).join("")}
        </div>
      ` : ""}
      ${nextChoice ? `<button class="decision-choice" data-care-choice="${escapeHtml(nextChoice.id)}" type="button">${choiceButtonBodyHtml(nextChoice.label)}</button>` : ""}
    </section>
  `;
}

export function careChoiceContinueHtml({ finalCase = false } = {}) {
  return `<button class="primary" data-care-choice-continue type="button">${finalCase ? "听完这夜" : "进入案后间隙"}</button><button data-view-case-closure type="button">查看完整案卷</button>`;
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
