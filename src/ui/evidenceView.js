export function evidenceOperationHtml(check = {}, pick = null, checkIndex = 0) {
  const options = check.options ?? [];
  const kind = evidenceMaterialKind(check);
  return `
    <section class="evidence-workbench material-${kind} ${pick ? pick.correct ? "marked hit" : "marked miss" : ""}">
      <div class="evidence-document material-${kind}">
        <header>
          ${evidenceMaterialThumbHtml(check, kind)}
          <span>${escapeHtml(evidenceMaterialType(check))}</span>
          <b>${escapeHtml(check.title ?? "台面材料")}</b>
        </header>
        <div class="evidence-document-body">${evidenceMaterialBodyHtml(check, kind)}</div>
        ${pick ? evidenceAnnotationHtml(pick) : ""}
      </div>
      <div class="evidence-target-board" aria-label="圈点区域">
        <span>圈哪一处</span>
        ${options.map((option, optionIndex) => evidenceTargetHtml(option, optionIndex, checkIndex, pick)).join("")}
      </div>
    </section>
  `;
}

export function evidenceMaterialKind(check = {}) {
  const text = `${check.title ?? ""} ${check.material ?? ""}`;
  if (/审批|付款|报销|收款|流程|通过/.test(text)) return "flow";
  if (/表|排班|预约|列/.test(text)) return "table";
  if (/账单|信用卡|消费|分期|还款/.test(text)) return "bill";
  if (/截图|学校|学历|项目|MBA|图片|图里/.test(text)) return "shot";
  return "file";
}

export function evidenceMaterialType(check = {}) {
  const kind = evidenceMaterialKind(check);
  return {
    bill: "BILL",
    flow: "FLOW",
    table: "TABLE",
    shot: "SHOT",
    file: "FILE"
  }[kind] ?? "FILE";
}

export function evidenceMaterialThumbHtml(check = {}, kind = evidenceMaterialKind(check)) {
  const title = check.title ?? "材料";
  const glyph = {
    bill: "¥",
    flow: "→",
    table: "▦",
    shot: "▣",
    file: "≡"
  }[kind] ?? "≡";
  return `<i class="evidence-thumb evidence-thumb-${escapeHtml(kind)}" aria-hidden="true"><b>${escapeHtml(glyph)}</b><em>${escapeHtml(shortMaterialLabel(title))}</em></i>`;
}

export function evidenceMaterialLines(material = "") {
  const lines = String(material ?? "")
    .replace(/([。；])/g, "$1|")
    .replace(/([，、])/g, "$1|")
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines : [String(material ?? "")].filter(Boolean);
}

export function evidencePickFeedbackHtml(pick = {}) {
  return `
    <section class="evidence-result-card ${pick.correct ? "hit" : "miss"}">
      <span>${pick.correct ? "圈中了" : "没圈准"}</span>
      <b>${escapeHtml(pick.label ?? "")}</b>
      <p>${escapeHtml(pick.feedback ?? "")}</p>
    </section>
    ${pick.reactionLine ? evidenceReactionLineHtml(pick.reactionLine) : ""}
    ${pick.revisedVersion ? evidenceReactionLineHtml(pick.revisedVersion) : ""}
  `;
}

export function evidenceCheckScreenHtml({
  check = {},
  pick = null,
  index = 0,
  reviewHtml = ""
} = {}) {
  return `
    <p><b>${escapeHtml(check.title ?? "材料检视")}</b></p>
    ${evidenceOperationHtml(check, pick, index)}
    <p>${escapeHtml(check.prompt ?? "这份材料里，哪一块最该先指出？")}</p>
    ${pick ? evidencePickFeedbackHtml(pick) : ""}
    ${reviewHtml}
  `;
}

export function investigationBackflowScreenHtml({
  hook = {},
  pick = null,
  index = 0,
  reviewHtml = ""
} = {}) {
  return `
    <p><b>${escapeHtml(hook.surface ?? "后台进来一条私信")}</b></p>
    <p>${escapeHtml(hook.appearsNowBecause ?? "收麦后，有人补了一张图。")}</p>
    ${evidenceOperationHtml(hook, pick, index)}
    <p>${escapeHtml(hook.prompt ?? "这条回流里，哪一句最该圈出来？")}</p>
    ${pick ? evidencePickFeedbackHtml(pick) : ""}
    ${reviewHtml}
  `;
}

function evidenceMaterialBodyHtml(check = {}, kind = "file") {
  const lines = evidenceMaterialLines(check.material ?? "");
  if (kind === "bill") {
    return `<div class="evidence-ledger">${lines.map((line, index) => `
      <span class="evidence-ledger-row"><i>${String(index + 1).padStart(2, "0")}</i><b>${escapeHtml(line)}</b></span>
    `).join("")}</div>`;
  }
  if (kind === "table") {
    return `<div class="evidence-table-grid">${lines.map((line, index) => `
      <span class="${index === 0 ? "head" : ""}"><i>${index === 0 ? "表头" : `行 ${index}`}</i><b>${escapeHtml(line)}</b></span>
    `).join("")}</div>`;
  }
  if (kind === "shot") {
    return `<div class="evidence-shot-frame">${lines.map((line, index) => `
      <span class="${index % 2 ? "alt" : ""}"><b>${escapeHtml(line)}</b></span>
    `).join("")}</div>`;
  }
  if (kind === "flow") {
    return `<div class="evidence-flow-track">${lines.map((line, index) => `
      <span><i>${index + 1}</i><b>${escapeHtml(line)}</b></span>
    `).join("")}</div>`;
  }
  return `<div class="evidence-document-lines">${evidenceMaterialLinesHtml(check.material ?? "")}</div>`;
}

function evidenceMaterialLinesHtml(material = "") {
  return evidenceMaterialLines(material).map((line) => `<span>${escapeHtml(line)}</span>`).join("");
}

function evidenceTargetHtml(option = {}, optionIndex = 0, checkIndex = 0, pick = null) {
  const selected = pick && Number(pick.optionIndex) === optionIndex;
  const className = `evidence-target ${selected ? pick.correct ? "selected hit" : "selected miss" : pick ? "dimmed" : ""}`;
  const content = `<i></i><b>${escapeHtml(option.label ?? "这块")}</b>`;
  if (pick) {
    return `<span class="${className}">${content}</span>`;
  }
  return `<button class="${className}" data-evidence-check="${checkIndex}:${optionIndex}" type="button">${content}</button>`;
}

function evidenceAnnotationHtml(pick = {}) {
  return `
    <div class="evidence-annotation ${pick.correct ? "hit" : "miss"}">
      <span>${pick.correct ? "圈住" : "圈偏"}</span>
      <b>${escapeHtml(pick.label ?? "")}</b>
    </div>
  `;
}

function evidenceReactionLineHtml(text = "") {
  return `
    <div class="call-line caller evidence-reaction-line">
      <b>咨询者</b>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function shortMaterialLabel(title = "") {
  const cleaned = String(title ?? "").replace(/\s+/g, "");
  return cleaned.slice(0, 4) || "材料";
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
