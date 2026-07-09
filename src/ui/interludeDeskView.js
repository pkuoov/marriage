export function hangupBeatHtml(hangup = {}) {
  return `
    <section class="hangup-beat-card">
      <span>${escapeHtml(hangup.stageDirection ?? "忙音。")}</span>
      ${callLineHtml({ role: "caller", speaker: hangup.speaker, text: hangup.line })}
      ${callLineHtml({ role: "host", text: hangup.hostLine })}
    </section>
  `;
}

export function interludeDeskHtml({
  interlude = {},
  night = {},
  actionStates = [],
  canReturn = false
} = {}) {
  const budget = night.interludeBudget ?? {};
  const doneCount = (night.interludeActionsDone ?? []).length;
  return `
    <section class="interlude-desk-card">
      <span class="source-badge">广告中 / 等待回拨</span>
      <p><b>${escapeHtml(interlude.title ?? "幕间·调查台")}</b></p>
      <p>${escapeHtml(interlude.kicker ?? "她不在线。时间只够做两三件事。")}</p>
      <div class="interlude-budget" aria-label="幕间预算">
        <b>剩余 ${Number(budget.remaining ?? 0)}/${Number(budget.max ?? 0)}</b>
        <span>已做 ${doneCount} 件，至少 ${Number(interlude.minActions ?? 0)} 件，最多 ${Number(interlude.maxActions ?? 0)} 件。</span>
      </div>
      <div class="interlude-action-grid">
        ${actionStates.map((item) => interludeActionButtonHtml(item)).join("")}
      </div>
      ${canReturn ? `<p class="hint">带回拨的东西：${escapeHtml(inventoryLabel(night.inventory))}</p>` : ""}
    </section>
  `;
}

export function interludeDialogueActionHtml(action = {}, followupAsked = false) {
  const script = action.script ?? {};
  const speaker = advisorName(action.advisorId);
  return `
    <section class="interlude-action-card">
      <span class="source-badge">${escapeHtml(action.label ?? "幕间行动")}</span>
      <p><b>${escapeHtml(action.summary ?? "")}</b></p>
      <div class="call-dialogue">
        ${script.open ? callLineHtml({ role: "host", text: script.open }) : ""}
        ${script.reply ? callLineHtml({ role: "caller", speaker, text: script.reply }) : ""}
        ${followupAsked && script.followupQuestion ? callLineHtml({ role: "host", text: script.followupQuestion }) : ""}
        ${followupAsked && script.followupReply ? callLineHtml({ role: "caller", speaker, text: script.followupReply }) : ""}
      </div>
    </section>
  `;
}

export function interludeConflictActionHtml(action = {}, selectedChoiceId = "") {
  const options = action.options ?? [];
  const selected = options.find((option) => option.id === selectedChoiceId) ?? null;
  return `
    <section class="interlude-action-card advisor-conflict-card">
      <span class="source-badge">${escapeHtml(action.label ?? "顾问分歧")}</span>
      <p><b>${escapeHtml(action.summary ?? "")}</b></p>
      <div class="advisor-conflict-options">
        ${options.map((option) => advisorConflictOptionHtml(option, selected)).join("")}
      </div>
    </section>
  `;
}

export function interruptToastHtml(action = {}, selectedChoiceId = "") {
  const choices = action.choices ?? [];
  const selected = choices.find((choice) => choice.id === selectedChoiceId) ?? null;
  return `
    <section class="interlude-action-card interrupt-toast-card">
      <span class="source-badge">${escapeHtml(action.from ?? "后台新消息")}</span>
      <p><b>${escapeHtml(action.text ?? "")}</b></p>
      ${choices.length ? `
        <div class="reply-choice-grid">
          ${choices.map((choice) => replyChoiceButtonHtml(choice, selected, "interrupt-choice")).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

export function interludePlaybackActionHtml(action = {}) {
  const script = action.script ?? {};
  return `
    <section class="interlude-action-card">
      <span class="source-badge">${escapeHtml(script.clipLabel ?? action.label ?? "回放")}</span>
      <p><b>${escapeHtml(action.summary ?? "")}</b></p>
      <div class="call-dialogue">
        ${script.clipLine ? callLineHtml({ role: "caller", text: script.clipLine }) : ""}
        ${script.hostNote ? callLineHtml({ role: "host", text: script.hostNote }) : ""}
      </div>
    </section>
  `;
}

export function replyChoicesHtml(choices = [], selectedChoiceId = "") {
  const selected = choices.find((choice) => choice.id === selectedChoiceId) ?? null;
  if (!choices.length) return "";
  return `
    <section class="interlude-action-card reply-choice-card">
      <span class="source-badge">回一句</span>
      <div class="reply-choice-grid">
        ${choices.map((choice) => replyChoiceButtonHtml(choice, selected, "reply-choice")).join("")}
      </div>
    </section>
  `;
}

export function callbackOpenerChoiceHtml({ openers = [], inventory = [] } = {}) {
  return `
    <section class="interlude-desk-card callback-opener-card">
      <span class="source-badge">回拨开场</span>
      <p><b>带一件东西回到麦上</b></p>
      <p class="hint">当前携带物：${escapeHtml(inventoryLabel(inventory))}</p>
      <div class="callback-opener-grid">
        ${openers.map((opener) => `
          <button class="callback-opener-option" data-callback-opener="${escapeHtml(opener.id ?? "")}" type="button">
            <b>${escapeHtml(opener.label ?? "开场")}</b>
            <span>${escapeHtml(opener.hostLine ?? "")}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

export function callbackOpenerBeatHtml({ stanceLine = "", opener = {} } = {}) {
  return `
    <section class="callback-opener-card">
      <span class="source-badge">回拨已接入</span>
      <div class="call-dialogue">
        ${stanceLine ? callLineHtml({ role: "caller", text: stanceLine }) : ""}
        ${callLineHtml({ role: "host", text: opener.hostLine })}
        ${callLineHtml({ role: "caller", text: opener.callerRevisedOpening })}
      </div>
    </section>
  `;
}

function interludeActionButtonHtml({ action = {}, done = false, disabled = false, disabledReason = "" } = {}) {
  if (done) {
    return `
      <article class="interlude-action done">
        <b>${escapeHtml(action.label ?? "")}</b>
        <p>${escapeHtml(action.summary ?? "")}</p>
        <span>已完成</span>
      </article>
    `;
  }
  return `
    <button class="interlude-action" data-interlude-action="${escapeHtml(action.id ?? "")}" ${disabled ? "disabled" : ""} type="button">
      <b>${escapeHtml(action.label ?? "")}</b>
      <p>${escapeHtml(action.summary ?? "")}</p>
      <span>${disabled ? escapeHtml(disabledReason || "不可用") : `耗时 ${Number(action.cost ?? (action.kind === "interruptToast" ? 0 : 1))}`}</span>
    </button>
  `;
}

function advisorConflictOptionHtml(option = {}, selected = null) {
  if (selected) {
    return `
      <article class="advisor-conflict-option ${selected.id === option.id ? "selected" : "dimmed"}">
        <b>${escapeHtml(option.label ?? "")}</b>
        <p>${escapeHtml(option.advisorLine ?? "")}</p>
      </article>
    `;
  }
  return `
    <button class="advisor-conflict-option" data-advisor-conflict="${escapeHtml(option.id ?? "")}" type="button">
      <b>${escapeHtml(option.label ?? "")}</b>
      <p>${escapeHtml(option.advisorLine ?? "")}</p>
    </button>
  `;
}

function replyChoiceButtonHtml(choice = {}, selected = null, attr = "reply-choice") {
  if (selected) {
    return `
      <article class="reply-choice-option ${selected.id === choice.id ? "selected" : "dimmed"}">
        <b>${escapeHtml(choice.label ?? "")}</b>
      </article>
    `;
  }
  return `
    <button class="reply-choice-option" data-${attr}="${escapeHtml(choice.id ?? "")}" type="button">
      <b>${escapeHtml(choice.label ?? "")}</b>
    </button>
  `;
}

function advisorName(advisorId = "") {
  return {
    "zhao-lawyer": "赵律师",
    "zhou-accountant": "周会计",
    "lin-matchmaker": "小林老师",
    "zhang-forensic": "张法医"
  }[advisorId] ?? "顾问";
}

function inventoryLabel(inventory = []) {
  return (inventory ?? []).length ? inventory.join(" / ") : "还没有硬物";
}

function callLineHtml(line = {}) {
  const role = line.role === "host" ? "host" : "caller";
  const speaker = line.speaker ?? (role === "host" ? "你" : "咨询者");
  return `
    <div class="call-line ${role}">
      <b>${escapeHtml(speaker)}</b>
      <p>${escapeHtml(line.text ?? "")}</p>
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
