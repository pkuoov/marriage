import { statementLinesFromText, statementOptionForLine, statementOptionsForLine } from "../runtime/statementReviewModel.js";

export function statementReplayHtml({ scene = {}, sceneIndex = 0, attemptedLineIds = [] } = {}) {
  return statementStageReplayHtml({
    entries: [{ scene, sceneIndex, attemptedLineIds }]
  });
}

export function statementStageReplayHtml({ entries = [] } = {}) {
  return `
    <section class="statement-replay-card" aria-label="通话回放">
      <div class="statement-replay-head" aria-hidden="true"><i>REC</i><span></span></div>
      <div class="statement-replay-lines">
        ${(entries ?? []).map((entry, entryIndex) => statementReplayBlockHtml(entry, entryIndex)).join("")}
      </div>
    </section>
  `;
}

export function statementReplayPageHtml({ line = {}, speaker = "咨询者" } = {}) {
  return `
    <section class="statement-replay-page" aria-label="逐句回放">
      <div class="statement-replay-head" aria-hidden="true"><i>REC</i><span></span></div>
      <div class="call-dialogue">
        <div class="call-line caller" data-dialogue-block="statement">
          <b>${escapeHtml(speaker)}</b>
          <p>${escapeHtml(line.text ?? "")}</p>
        </div>
      </div>
    </section>
  `;
}

export function statementReplayPageChoicesHtml({
  scene = {},
  sceneIndex = 0,
  line = {},
  attempted = false,
  keyResolved = false,
  resolvedDialogueOptionIndexes = [],
  stageKeysRemaining = 0,
  nextLabel = "继续回放"
} = {}) {
  const keyOptions = scene.questionOptions ?? [];
  const dialogueOptions = scene.casualQuestions ?? [];
  const resolvedDialogue = new Set((resolvedDialogueOptionIndexes ?? []).map(Number));
  const matches = [
    ...statementOptionsForLine(keyOptions, line).map((option) => ({
      kind: "key",
      option,
      optionIndex: keyOptions.indexOf(option),
      resolved: keyResolved
    })),
    ...statementOptionsForLine(dialogueOptions, line).map((option) => {
      const optionIndex = dialogueOptions.indexOf(option);
      return {
        kind: "dialogue",
        option,
        optionIndex,
        resolved: resolvedDialogue.has(optionIndex)
      };
    })
  ];
  const available = matches.filter((item) => !item.resolved);
  const keyAvailable = available.filter((item) => item.kind === "key");
  const visibleAvailable = keyAvailable.length ? keyAvailable : available.filter((item) => item.kind === "dialogue").slice(0, 1);
  const questionButtons = visibleAvailable.map(({ kind, option, optionIndex }) => `
    <button class="choice-question statement-replay-question" ${kind === "key"
      ? `data-scene-question="${sceneIndex}:${optionIndex}"${option.correct === true ? ' data-statement-key-correct="true"' : ""}`
      : `data-scene-dialogue="${sceneIndex}:${optionIndex}" data-scene-replay-dialogue="true" data-stage-keys-remaining="${Math.max(0, Number(stageKeysRemaining) || 0)}"`} type="button">
      ${escapeHtml(option.question ?? option.suspicionLabel ?? "接着问")}
    </button>
  `).join("");
  const noClueButton = !matches.length && !attempted
    ? `<button class="secondary statement-replay-press" data-scene-review-line="${escapeHtml(line.id)}" data-scene-review-index="${sceneIndex}" type="button">就这句追问</button>`
    : "";
  return `
    <div class="flow-group statement-replay-actions">
      <div class="choice-stack">
        ${questionButtons}
        ${noClueButton}
        <button class="secondary statement-replay-next" data-scene-replay-next type="button">${escapeHtml(nextLabel)}</button>
      </div>
    </div>
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

function statementReplayBlockHtml(entry = {}, entryIndex = 0) {
  const scene = entry.scene ?? {};
  const sceneIndex = Number(entry.sceneIndex ?? 0);
  const lines = statementLinesFromText(scene.version ?? "", { prefix: scene.id ?? `scene-${sceneIndex}` });
  const attempted = new Set(entry.attemptedLineIds ?? []);
  const resolvedDialogueOptionIndexes = new Set((entry.resolvedDialogueOptionIndexes ?? []).map(Number));
  return `
    <div class="statement-replay-block${entryIndex > 0 ? " is-following" : ""}">
      ${lines.map((line) => statementReplayLineHtml(
        line,
        scene,
        sceneIndex,
        attempted,
        Boolean(entry.keyResolved),
        resolvedDialogueOptionIndexes
      )).join("")}
    </div>
  `;
}

function statementReplayLineHtml(
  line = {},
  scene = {},
  sceneIndex = 0,
  attempted = new Set(),
  keyResolved = false,
  resolvedDialogueOptionIndexes = new Set()
) {
  const keyOptions = scene.questionOptions ?? [];
  const dialogueOptions = scene.casualQuestions ?? [];
  const matches = [
    ...statementOptionsForLine(keyOptions, line).map((option) => ({
      kind: "key",
      option,
      optionIndex: keyOptions.indexOf(option),
      resolved: keyResolved
    })),
    ...statementOptionsForLine(dialogueOptions, line).map((option) => {
      const optionIndex = dialogueOptions.indexOf(option);
      return {
        kind: "dialogue",
        option,
        optionIndex,
        resolved: resolvedDialogueOptionIndexes.has(optionIndex)
      };
    })
  ];
  if (matches.length) {
    return matches.map(({ kind, option, optionIndex, resolved }) => `
      <button class="statement-replay-line has-question${resolved ? " is-resolved" : ""}" ${kind === "key" ? `data-scene-question="${sceneIndex}:${optionIndex}"` : `data-scene-dialogue="${sceneIndex}:${optionIndex}" data-scene-replay-dialogue="true"`} type="button" ${resolved ? "disabled" : ""}>
        <i aria-hidden="true"></i>
        <span>${escapeHtml(line.text)}</span>
        <small>${resolved ? "已经问过" : escapeHtml(option.suspicionLabel ?? option.question ?? "接着问")}</small>
      </button>
    `).join("");
  }
  const missed = attempted.has(line.id);
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
