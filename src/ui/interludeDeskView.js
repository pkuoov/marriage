import { HOST_NAME } from "../hostProfile.js";
import { CHOICE_COST_META } from "../runtime/choiceCostModel.js";
import { choiceButtonBodyHtml } from "./callFlowView.js";

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
  return `
    <section class="interlude-desk-card">
      <span class="source-badge">收麦后</span>
      <p><b>${escapeHtml(interlude.title ?? "幕间·调查台")}</b></p>
      <p>${escapeHtml(interlude.kicker ?? "她不在线。时间只够做两三件事。")}</p>
      <div class="interlude-budget" aria-label="幕间剩余 ${Number(budget.remaining ?? 0)} 格，总计 ${Number(budget.max ?? 0)} 格">
        <b>剩余 ${Number(budget.remaining ?? 0)} 格</b>
        <span>${canReturn ? "已经带回可用内容" : "行动耗时标在卡片右下角"}</span>
      </div>
      <div class="interlude-action-grid">
        ${actionStates.map((item) => interludeActionButtonHtml(item)).join("")}
      </div>
      ${canReturn ? `<p class="hint">带回拨的东西：${escapeHtml(inventoryLabel(night.inventory))}</p>` : ""}
    </section>
  `;
}

export function interludeDialogueActionHtml(action = {}, followupAsked = false, audioCue = null) {
  const script = action.script ?? {};
  const speaker = advisorName(action.advisorId);
  return `
    <section class="interlude-action-card">
      <span class="source-badge">${escapeHtml(action.label ?? "幕间行动")}</span>
      <p><b>${escapeHtml(action.summary ?? "")}</b></p>
      ${audioPlaybackControlsHtml(audioCue)}
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
      ${selected?.sceneText || action.sceneText ? `<p>${escapeHtml(selected?.sceneText ?? action.sceneText)}</p>` : ""}
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

export function interludePlaybackActionHtml(action = {}, audioCue = null) {
  const script = action.script ?? {};
  return `
    <section class="interlude-action-card">
      <span class="source-badge">${escapeHtml(script.clipLabel ?? action.label ?? "回放")}</span>
      <p><b>${escapeHtml(action.summary ?? "")}</b></p>
      ${audioPlaybackControlsHtml(audioCue)}
      <div class="call-dialogue">
        ${script.clipLine ? callLineHtml({ role: "caller", text: script.clipLine }) : ""}
        ${script.hostNote ? callLineHtml({ role: "host", text: script.hostNote }) : ""}
      </div>
    </section>
  `;
}

export function audioPlaybackControlsHtml(audioCue = {}) {
  if (!audioCue?.available) return "";
  return `
    <section class="audio-playback" data-audio-playback="${escapeHtml(audioCue.id ?? "")}">
      <button data-audio-play="${escapeHtml(audioCue.id ?? "")}" type="button">播放录音</button>
      <input data-audio-seek="${escapeHtml(audioCue.id ?? "")}" type="range" min="0" max="0" step="0.1" value="0" aria-label="录音进度">
      <output data-audio-time="${escapeHtml(audioCue.id ?? "")}">00:00 / 00:00</output>
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
          <button class="callback-opener-option decision-choice" data-callback-opener="${escapeHtml(opener.id ?? "")}" type="button">
            ${choiceButtonBodyHtml(opener.label ?? "开场", CHOICE_COST_META.callbackOpener, opener.hostLine ?? "")}
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
  const advisor = advisorMetaForOption(option);
  if (selected) {
    return `
      <article class="advisor-conflict-option ${selected.id === option.id ? "selected" : "dimmed"}">
        ${advisorOptionHeadHtml(option, advisor)}
        <p>${escapeHtml(selected.id === option.id ? option.advisorLine ?? "" : advisorLinePreview(option.advisorLine))}</p>
      </article>
    `;
  }
  return `
    <button class="advisor-conflict-option decision-choice" data-advisor-conflict="${escapeHtml(option.id ?? "")}" type="button">
      ${advisorOptionHeadHtml(option, advisor)}
      <p>${escapeHtml(advisorLinePreview(option.advisorLine))}</p>
      <small class="choice-cost-meta">${CHOICE_COST_META.advisorRoute}</small>
    </button>
  `;
}

function advisorOptionHeadHtml(option = {}, advisor = {}) {
  return `
    <span class="advisor-option-head">
      <span class="advisor-avatar advisor-${escapeHtml(advisor.key ?? "default")}" aria-hidden="true">${escapeHtml(advisor.surname ?? "顾")}</span>
      <span class="advisor-option-title">
        <b>${escapeHtml(option.label ?? advisor.name ?? "顾问")}</b>
        <small>${escapeHtml(advisor.domain ?? "专业意见")}</small>
      </span>
    </span>
  `;
}

function advisorMetaForOption(option = {}) {
  const key = `${option.id ?? ""} ${option.label ?? ""}`;
  if (/zhao|赵/.test(key)) return { key: "zhao", surname: "赵", name: "赵律师", domain: "证据与性质边界" };
  if (/zhou|周/.test(key)) return { key: "zhou", surname: "周", name: "周会计", domain: "账目与资金路径" };
  if (/lin|小林|林老师/.test(key)) return { key: "lin", surname: "林", name: "小林老师", domain: "身份词与关系成本" };
  if (/zhang|张/.test(key)) return { key: "zhang", surname: "张", name: "张法医", domain: "材料与保全边界" };
  return { key: "default", surname: "顾", name: "顾问", domain: "专业意见" };
}

function advisorLinePreview(line = "") {
  const text = String(line ?? "").trim();
  const firstSentence = text.match(/^.*?[。！？]/)?.[0] ?? text;
  return firstSentence.length > 44 ? `${firstSentence.slice(0, 43)}…` : firstSentence;
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
    <button class="reply-choice-option decision-choice" data-${attr}="${escapeHtml(choice.id ?? "")}" type="button">
      ${choiceButtonBodyHtml(choice.label ?? "", CHOICE_COST_META.nonScoredReply)}
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
  const labels = {
    "profile-zhou-continuity": "当日余额与单月收入对照",
    "profile-lin-two-prices": "介绍人给两家的两套话",
    "family-chat-seen": "家里群整页截图",
    "cousin-note-seen": "表姐的资料说明",
    "assistant-sample-seen": "部门公开流程样本",
    "history-pages-reviewed": "往期账页",
    "approval-page-reviewed": "审批页缺口",
    "delegation-return": "审批页缺口",
    "leader-note-cold": "暂缓公开的领导批注",
    "leader-note-hot": "准备回拨追问的领导批注",
    "playback-pad": "私聊原话回放",
    "supplier-dm-seen": "供应商返款补话",
    "timeline-delay-gap": "来不及与延后通知时间线",
    "work-frame-lin": "审批页缺口",
    "work-frame-zhao": "审批页缺口",
    "work-frame-zhou": "审批页缺口",
  };
  const visibleLabels = [...new Set((inventory ?? []).map((item) => labels[item] ?? item))];
  return visibleLabels.length ? visibleLabels.join(" / ") : "还没有带回物";
}

function callLineHtml(line = {}) {
  const role = line.role === "host" || line.speaker === "你" || line.speaker === HOST_NAME ? "host" : "caller";
  const speaker = role === "host" ? HOST_NAME : line.speaker ?? "咨询者";
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
