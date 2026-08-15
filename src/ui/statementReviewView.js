import { statementLinesFromText, statementOptionForLine } from "../runtime/statementReviewModel.js";

export function statementReplayHtml({ scene = {}, sceneIndex = 0, attemptedLineIds = [] } = {}) {
  const lines = statementLinesFromText(scene.version ?? "", { prefix: scene.id ?? `scene-${sceneIndex}` });
  const attempted = new Set(attemptedLineIds ?? []);
  return `
    <section class="statement-replay-card" aria-label="通话回放">
      <div class="statement-replay-head" aria-hidden="true"><i>REC</i><span></span></div>
      <div class="statement-replay-lines">
        ${lines.map((line) => statementReplayLineHtml(line, scene.questionOptions ?? [], sceneIndex, attempted)).join("")}
      </div>
    </section>
  `;
}

export function statementReplayLineForScene(scene = {}, lineId = "") {
  return statementLinesFromText(scene.version ?? "", { prefix: scene.id ?? "scene" })
    .find((line) => line.id === lineId) ?? null;
}

export function statementReplayOptionIndex(scene = {}, line = {}) {
  const option = statementOptionForLine(scene.questionOptions ?? [], line);
  return option ? (scene.questionOptions ?? []).indexOf(option) : -1;
}

export function statementPatienceLostHtml() {
  return `
    <section class="statement-patience-lost">
      <p>连续几次都没问到点上，直播间开始催你别再乱带节奏。电话还在，先把这段原话重新听一遍。</p>
    </section>
  `;
}

function statementReplayLineHtml(line = {}, options = [], sceneIndex = 0, attempted = new Set()) {
  const option = statementOptionForLine(options, line);
  const missed = attempted.has(line.id) && !option;
  return `
    <button class="statement-replay-line${missed ? " is-missed" : ""}" data-scene-review-line="${escapeHtml(line.id)}" data-scene-review-index="${sceneIndex}" type="button">
      <i aria-hidden="true"></i>
      <span>${escapeHtml(line.text)}</span>
      ${missed ? "<small>这句没有可追问的线索 · 耐心 −1</small>" : ""}
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
