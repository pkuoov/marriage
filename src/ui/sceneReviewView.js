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

export function activeSceneExchangeHtml({ scene = {}, dialoguePicks = [] } = {}) {
  return [
    callLineHtml({ ...scene, text: scene.version, role: "caller" }),
    ...dialoguePicks.flatMap((pick) => [
      callLineHtml({ role: "host", text: pick.question }),
      callLineHtml({ role: "caller", text: pick.answer })
    ])
  ].join("");
}

export function completedSceneExchangeHtml({ scene = {}, dialoguePicks = [], pick = {}, fallbackAnswer = "" } = {}) {
  return [
    callLineHtml({ ...scene, text: scene.version, role: "caller" }),
    ...dialoguePicks.flatMap((item) => [
      callLineHtml({ role: "host", text: item.question }),
      callLineHtml({ role: "caller", text: item.answer })
    ]),
    keyChoiceExchangeHtml({ scene, pick, fallbackAnswer })
  ].join("");
}

export function keyChoiceExchangeHtml({ scene = {}, pick = {}, fallbackAnswer = "" } = {}) {
  const safePick = pick ?? {};
  const question = safePick.question ?? scene.questionOptions?.find((option) => option.contradiction)?.question ?? "这句我想再问清楚一点。";
  const answer = safePick.answer ?? fallbackAnswer ?? "";
  return [
    callLineHtml({ role: "host", text: question }),
    answer ? callLineHtml({ role: "caller", text: answer }) : ""
  ].join("");
}

function flowGroup(content) {
  return `<div class="choice-flow">${content}</div>`;
}

function callLineHtml(line = {}) {
  const role = line.role === "host" || line.speaker === "你" ? "host" : "caller";
  const speaker = role === "host" ? "你" : "咨询者";
  const text = line.text ?? line.version ?? line.line ?? "";
  return `
    <div class="call-line ${role}">
      <b>${speaker}</b>
      <p>${escapeHtml(text)}</p>
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
