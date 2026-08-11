import { CHOICE_COST_META } from "../runtime/choiceCostModel.js";
import { choiceButtonBodyHtml } from "./callFlowView.js";

export function evidenceOperationHtml(check = {}, pick = null, checkIndex = 0) {
  const options = (check.options ?? []).slice(0, 4);
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
        <span>${check.selectionMode === "priority" ? "先问哪一处" : "圈哪一处"}</span>
        <div class="evidence-target-grid">
          ${options.map((option, optionIndex) => evidenceTargetHtml(option, optionIndex, checkIndex, pick)).join("")}
        </div>
      </div>
    </section>
  `;
}

export function evidenceMaterialKind(check = {}) {
  const text = `${check.title ?? ""} ${check.material ?? ""}`;
  if (check.socialPost || /朋友圈|探店/.test(text)) return "social";
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
    social: "POST",
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
    social: "◎",
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

export function evidenceMaterialRows(check = {}) {
  const rows = Array.isArray(check.materialRows) && check.materialRows.length
    ? check.materialRows
    : evidenceMaterialLines(check.material ?? "");
  return rows.map((row) => String(row ?? "").trim()).filter(Boolean);
}

export function evidencePickFeedbackHtml(pick = {}) {
  const priority = pick.selectionMode === "priority";
  return `
    <section class="evidence-result-card ${pick.correct ? "hit" : "miss"}">
      <span>${priority ? pick.correct ? "先问这一处" : "这处还不够" : pick.correct ? "圈中了" : "没圈准"}</span>
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
    ${evidenceMaterialNoteHtml(check)}
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
    <span class="source-badge">${escapeHtml(investigationSourceBadge(hook.source))}</span>
    <p>${escapeHtml(hook.appearsNowBecause ?? "收麦后，有人补了一张图。")}</p>
    ${evidenceOperationHtml(hook, pick, index)}
    ${evidenceMaterialNoteHtml(hook)}
    <p>${escapeHtml(hook.prompt ?? "这条回流里，哪一句最该圈出来？")}</p>
    ${pick ? evidencePickFeedbackHtml(pick) : ""}
    ${reviewHtml}
  `;
}

export function delegationScreenHtml({
  delegation = {},
  advisors = {},
  pick = null,
  reviewHtml = ""
} = {}) {
  const material = delegation.material ?? {};
  if (pick && !pick.skipped) {
    return `
      <section class="delegation-card returned">
        <p><b>顾问回单</b></p>
        <span class="source-badge">${escapeHtml(pick.advisorBadge ?? "顾问回单")}</span>
        <div class="delegation-material">
          <span>送检材料</span>
          <b>${escapeHtml(material.label ?? "后台材料")}</b>
        </div>
        <p>${escapeHtml(pick.text ?? "")}</p>
      </section>
      ${reviewHtml}
    `;
  }
  return `
    <section class="delegation-card">
      <p><b>后台委托</b></p>
      <p>这份材料可以送给一位熟人看一眼。选谁看，就是先信哪条路。</p>
      <div class="delegation-material">
        <span>待送材料</span>
        <b>${escapeHtml(material.label ?? "后台材料")}</b>
      </div>
      <div class="delegation-advisor-grid">
        ${Object.values(advisors ?? {}).map((advisor) => delegationAdvisorButtonHtml(advisor)).join("")}
      </div>
    </section>
    ${reviewHtml}
  `;
}

function delegationAdvisorButtonHtml(advisor = {}) {
  return `
    <button class="delegation-advisor decision-choice" data-delegation-advisor="${escapeHtml(advisor.id ?? "")}" type="button">
      ${choiceButtonBodyHtml(advisor.name ?? "顾问", CHOICE_COST_META.advisorRoute, advisor.domain ?? "")}
      <span class="choice-button-quote">${escapeHtml(advisor.catchphrase ?? "")}</span>
    </button>
  `;
}

const INVESTIGATION_SOURCE_BADGES = {
  dm: "后台私信",
  "respondent-note": "对方留言",
  "store-manager-note": "店长留言",
  "leader-note": "领导批注",
  "department-assistant": "部门助理记录",
  "introducer-note": "介绍人留言",
  "cousin-note": "表姐说明"
};

function investigationSourceBadge(source = "") {
  return INVESTIGATION_SOURCE_BADGES[source] ?? "后台来源";
}

function evidenceMaterialBodyHtml(check = {}, kind = "file") {
  const lines = evidenceMaterialRows(check);
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
  if (kind === "social") return socialPostHtml(check.socialPost ?? {});
  if (kind === "flow") {
    return `<div class="evidence-flow-track">${lines.map((line, index) => `
      <span><i>${index + 1}</i><b>${escapeHtml(line)}</b></span>
    `).join("")}</div>`;
  }
  return `<div class="evidence-document-lines">${evidenceMaterialRowsHtml(check)}</div>`;
}

function socialPostHtml(post = {}) {
  return `
    <article class="social-post-shot" aria-label="朋友圈截图">
      <header>
        <i aria-hidden="true">友</i>
        <span><b>${escapeHtml(post.author ?? "朋友圈用户")}</b><small>${escapeHtml(post.postedAt ?? "")}</small></span>
        <em>···</em>
      </header>
      <figure>
        ${post.imageSrc ? `<img src="${escapeHtml(post.imageSrc)}" alt="${escapeHtml(post.imageAlt ?? "朋友圈配图")}" />` : ""}
      </figure>
      <p class="social-post-caption">${escapeHtml(post.caption ?? "")}</p>
      ${post.location ? `<span class="social-post-location">⌖ ${escapeHtml(post.location)}</span>` : ""}
      <section class="social-post-comments">
        <p><b>${escapeHtml(post.commentAuthor ?? "朋友")}</b>：${escapeHtml(post.comment ?? "")}</p>
        ${post.commentNote ? `<small>${escapeHtml(post.commentNote)}</small>` : ""}
      </section>
      ${post.followup ? `<aside>${escapeHtml(post.followup)}</aside>` : ""}
    </article>
  `;
}

function evidenceMaterialRowsHtml(check = {}) {
  return evidenceMaterialRows(check).map((line) => `<span>${escapeHtml(line)}</span>`).join("");
}

function evidenceMaterialNoteHtml(check = {}) {
  if (!Array.isArray(check.materialRows) || !check.materialRows.length || !check.material) return "";
  return `<p class="evidence-material-note">${escapeHtml(check.material)}</p>`;
}

function evidenceTargetHtml(option = {}, optionIndex = 0, checkIndex = 0, pick = null) {
  const selected = pick && Number(pick.optionIndex) === optionIndex;
  const className = `evidence-target ${pick ? "" : "decision-choice"} ${selected ? pick.correct ? "selected hit" : "selected miss" : pick ? "dimmed" : ""}`;
  const content = `<i>${optionIndex + 1}</i>${pick
    ? `<b>${escapeHtml(option.label ?? "这块")}</b>`
    : choiceButtonBodyHtml(option.label ?? "这块", CHOICE_COST_META.evidenceMark)}`;
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
