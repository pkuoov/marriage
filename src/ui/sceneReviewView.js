import { HOST_NAME } from "../hostProfile.js?v=0.20.95";

export function sceneReviewHtml({
  index = 0,
  done = false,
  activeExchangeHtml = "",
  completedExchangeHtml = "",
  reviewHtml = ""
} = {}) {
  return `
    <p><b>第 ${Number(index ?? 0) + 1} 句</b></p>
    <div class="call-dialogue">
      ${done ? completedExchangeHtml : activeExchangeHtml}
    </div>
    ${reviewHtml}
  `;
}

export function sceneReviewDoneChoicesHtml({
  lastStage = false,
  nextStage = "",
  nextLabel = "继续",
  continueLabel = "继续"
} = {}) {
  return flowGroup(`
    ${lastStage
      ? `<button class="primary" data-scene="${escapeHtml(nextStage)}" type="button">${escapeHtml(nextLabel)}</button>`
      : `<button class="primary" data-next-scene-stage type="button">${escapeHtml(continueLabel)}</button>`}
  `);
}

export function stanceSnapshotHtml(snapshot = {}, pick = null) {
  const options = Array.isArray(snapshot.options) ? snapshot.options : [];
  return `
    <section class="stance-snapshot-card">
      <span>${escapeHtml(snapshot.kicker ?? "立场快照")}</span>
      <b>${escapeHtml(snapshot.prompt ?? "现在这通麦，你先站哪边？")}</b>
      ${snapshot.note ? `<p>${escapeHtml(snapshot.note)}</p>` : ""}
      <div class="stance-snapshot-options">
        ${options.map((option, optionIndex) => stanceSnapshotOptionHtml(option, optionIndex, pick)).join("")}
      </div>
    </section>
  `;
}

export function activeSceneExchangeHtml({ scene = {}, dialoguePicks = [] } = {}) {
  return [
    sceneBeatLinesHtml(scene.beforeVersion),
    callLineHtml({ ...scene, text: scene.version, role: "caller" }),
    sceneBeatLinesHtml(scene.afterVersion),
    sceneEvidenceCardHtml(scene.shownCard),
    ...dialoguePicks.flatMap((pick) => [
      callLineHtml({ role: "host", text: pick.question }),
      dialogueAnswerHtml(pick)
    ])
  ].join("");
}

export function scenePromptExchangeHtml({ scene = {} } = {}) {
  return [
    sceneBeatLinesHtml(scene.beforeVersion),
    callLineHtml({ ...scene, text: scene.version, role: "caller" }),
    sceneBeatLinesHtml(scene.afterVersion),
    sceneEvidenceCardHtml(scene.shownCard)
  ].join("");
}

export function sceneQuestionAnswerHtml({ question = "", answer = "", lines = null, resistanceBeat = null } = {}) {
  return `
    <section class="question-answer-card">
      <div class="call-dialogue">
        ${callLineHtml({ role: "host", text: question })}
        ${resistanceBeatLinesHtml(resistanceBeat)}
        ${dialogueAnswerHtml({ answer, lines })}
      </div>
    </section>
  `;
}

export function completedSceneExchangeHtml({ scene = {}, dialoguePicks = [], pick = {}, fallbackAnswer = "" } = {}) {
  return [
    sceneBeatLinesHtml(scene.beforeVersion),
    callLineHtml({ ...scene, text: scene.version, role: "caller" }),
    sceneBeatLinesHtml(scene.afterVersion),
    sceneEvidenceCardHtml(scene.shownCard),
    ...dialoguePicks.flatMap((item) => [
      callLineHtml({ role: "host", text: item.question }),
      dialogueAnswerHtml(item)
    ]),
    keyChoiceExchangeHtml({ scene, pick, fallbackAnswer }),
    sceneBeatLinesHtml(scene.sceneCloser)
  ].join("");
}

export function keyChoiceExchangeHtml({ scene = {}, pick = {}, fallbackAnswer = "" } = {}) {
  const safePick = pick ?? {};
  const question = safePick.question ?? scene.questionOptions?.find((option) => option.contradiction)?.question ?? "这句我想再问清楚一点。";
  const answer = safePick.answer ?? fallbackAnswer ?? "";
  return [
    callLineHtml({ role: "host", text: question }),
    resistanceBeatLinesHtml(safePick.resistanceBeat),
    answer ? callLineHtml({ role: "caller", text: answer }) : ""
  ].join("");
}

function resistanceBeatLinesHtml(resistanceBeat = null) {
  return (resistanceBeat?.lines ?? []).map((line) => callLineHtml(line)).join("");
}

function sceneBeatLinesHtml(beat = null) {
  return (beat?.lines ?? []).map((line) => callLineHtml(line)).join("");
}

function dialogueAnswerHtml(pick = {}) {
  if (Array.isArray(pick.lines) && pick.lines.length) return pick.lines.map((line) => callLineHtml(line)).join("");
  return callLineHtml({ role: "caller", text: pick.answer ?? "" });
}

function flowGroup(content) {
  return `<div class="choice-flow">${content}</div>`;
}

function stanceSnapshotOptionHtml(option = {}, optionIndex = 0, pick = null) {
  const selected = pick && Number(pick.optionIndex) === optionIndex;
  if (pick) {
    return `
      <article class="stance-snapshot-option ${selected ? "selected" : "dimmed"}">
        <b>${escapeHtml(option.label ?? "")}</b>
        <p>${escapeHtml(selected ? option.feedback ?? option.summary ?? "" : option.summary ?? "")}</p>
      </article>
    `;
  }
  return `
    <button class="stance-snapshot-option" data-stance-snapshot="${optionIndex}" type="button">
      <b>${escapeHtml(option.label ?? "")}</b>
      <p>${escapeHtml(option.summary ?? "")}</p>
    </button>
  `;
}

function callLineHtml(line = {}) {
  if (line.role === "pause") return '<div class="call-pause" aria-hidden="true"></div>';
  if (line.role === "stage") {
    return `<div class="call-stage-direction"><span>${escapeHtml(line.text ?? "")}</span></div>`;
  }
  const role = line.role === "host" || line.speaker === "你" || line.speaker === HOST_NAME ? "host" : "caller";
  const speaker = role === "host" ? HOST_NAME : line.speaker ?? "咨询者";
  const text = line.text ?? line.version ?? line.line ?? "";
  return `
    <div class="call-line ${role}">
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function sceneEvidenceCardHtml(card = null) {
  if (!card) return "";
  return `
    <aside class="scene-evidence-card" aria-label="随麦材料">
      <span>${escapeHtml(card.type ?? "材料")}</span>
      <b>${escapeHtml(card.title ?? "")}</b>
      <p>${escapeHtml(card.front ?? "")}</p>
    </aside>
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
