import {
  quickConfrontationLines,
  quickDisclosureRoundForState,
  quickIssueOptionsForRound,
  quickRoundPatienceForState,
  quickStatementLinesForRound,
  quickVerdictPages
} from "../runtime/quickDetectiveModel.js";
import { statementOptionForLine, statementTextFromTurns } from "../runtime/statementReviewModel.js";
import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export function quickDetectiveCaseSelectHtml(packets = [], completedIds = []) {
  const completed = new Set(completedIds);
  return `
    <section class="quick-case-library" aria-labelledby="quick-case-library-title">
      <header>
        <p class="quick-mode-kicker">DETECTIVE MODE</p>
        <h1 id="quick-case-library-title">今晚先接哪一通？</h1>
      </header>
      <div class="quick-case-grid">
        ${packets.map((packet, index) => quickCaseCardHtml(packet, index, completed.has(packet.id))).join("")}
      </div>
      <footer>
        <button data-quick-select-title type="button">返回标题页</button>
      </footer>
    </section>
  `;
}

export function quickDetectiveStageHtml(packet = {}, state = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME } = {}) {
  const presentation = packet.presentation ?? {};
  const host = presentation.host ?? {};
  const caller = presentation.caller ?? {};
  const focus = quickStageFocus(packet, state);
  const status = quickStageStatus(packet, state);
  const hostArtSrc = quickHostArtSrc(host, state, focus);
  const callerArtSrc = quickCallerArtSrc(caller, state, focus);
  return `
    <div class="quick-duel-stage focus-${escapeHtml(focus)}" data-quick-stage-focus="${escapeHtml(focus)}">
      ${presentation.backgroundSrc ? `<img class="quick-stage-backdrop" src="${escapeHtml(presentation.backgroundSrc)}" alt="" onerror="this.hidden=true" />` : ""}
      <div class="quick-stage-vignette"></div>
      <figure class="quick-stage-speaker quick-stage-host${["host", "both"].includes(focus) ? " is-active" : ""}" data-dialogue-portrait="host">
        ${hostArtSrc ? `<img src="${escapeHtml(hostArtSrc)}" alt="" onerror="this.hidden=true" />` : ""}
        <figcaption><small>${escapeHtml(host.roleLabel ?? "主播")}</small><b>${escapeHtml(hostName)}</b></figcaption>
      </figure>
      <div class="quick-call-link" aria-hidden="true">
        <small>${escapeHtml(status)}</small>
        <span><i></i><i></i><i></i><i></i><i></i></span>
      </div>
      <figure class="quick-stage-speaker quick-stage-caller${["caller", "both"].includes(focus) ? " is-active" : ""}" data-dialogue-portrait="caller">
        ${callerArtSrc ? `<img src="${escapeHtml(callerArtSrc)}" alt="" onerror="this.hidden=true" />` : ""}
        <figcaption><small>${escapeHtml(caller.roleLabel ?? "语音连线")}</small><b>${escapeHtml(caller.name ?? "匿名来电人")}</b></figcaption>
      </figure>
    </div>
  `;
}

export function quickDetectiveIntroHtml(packet = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME } = {}) {
  return `
    <section class="quick-detective-panel quick-intro">
      <p class="quick-mode-kicker">${escapeHtml(packet.label)}</p>
      <h2>${escapeHtml(packet.title)}</h2>
      <p class="quick-intro-host"><span>本场主播</span><b>${escapeHtml(hostName)}</b></p>
      <p>${escapeHtml(packet.premise)}</p>
      <button class="primary quick-main-action" data-quick-begin type="button">接入这通电话</button>
    </section>
  `;
}

export function quickDetectiveTranscriptHtml(packet = {}, state = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME } = {}) {
  const round = quickDisclosureRoundForState(packet, state);
  const line = { role: "caller", speaker: "来电人", text: statementTextFromTurns(packet, round) };
  return `
    <section class="quick-detective-panel quick-transcript quick-statement-listen">
      ${quickSpeechBubbleHtml(line, "quick-statement-bubble", hostName)}
      <button class="primary quick-main-action" data-quick-next-turn type="button">把刚才那段拉回来</button>
    </section>
  `;
}

export function quickDetectiveConfrontationHtml(packet = {}, state = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME } = {}) {
  const confrontations = packet.confrontations ?? [];
  const index = Math.max(0, confrontations.findIndex((item) => item.id === state.activeConfrontationId));
  const confrontation = confrontations[index] ?? {};
  const lines = quickConfrontationLines(confrontation);
  const lineIndex = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.confrontationLineIndex ?? 0)));
  const last = (state.resolvedConfrontationIds?.length ?? 0) + 1 >= confrontations.length;
  const line = lines[lineIndex] ?? {};
  const nextLine = lines[lineIndex + 1];
  const advanceLabel = nextLine
    ? "继续"
    : last ? "听最后一句" : "继续听";
  return `
    <section class="quick-detective-panel quick-confrontation">
      <header>
        <span>当面对质</span>
      </header>
      ${quickSpeechBubbleHtml({ ...line, speaker: line.role === "caller" ? "来电人" : hostName }, "", hostName)}
      <button class="primary quick-main-action" data-quick-next-confrontation type="button">${advanceLabel}</button>
    </section>
  `;
}

export function quickDetectiveActiveLine(packet = {}, state = {}, hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME) {
  if (state.scene === "transcript") {
    const round = quickDisclosureRoundForState(packet, state);
    return { role: "caller", speaker: "来电人", text: statementTextFromTurns(packet, round) };
  }
  if (state.scene === "confrontation") {
    const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId) ?? {};
    const lines = quickConfrontationLines(confrontation);
    const index = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.confrontationLineIndex ?? 0)));
    const line = lines[index] ?? {};
    return { ...line, speaker: line.role === "caller" ? "来电人" : hostName };
  }
  if (state.scene === "verdict") {
    const pages = quickVerdictPages(packet, state);
    const pageIndex = Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)));
    const lines = pages[pageIndex]?.lines ?? [];
    const lineIndex = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.verdictLineIndex ?? 0)));
    const line = lines[lineIndex] ?? {};
    return { ...line, speaker: line.role === "caller" ? "来电人" : hostName };
  }
  return null;
}

export function quickDetectiveShouldAutoContinue(packet = {}, state = {}) {
  if (state.scene === "transcript") return false;
  if (state.scene !== "confrontation") return false;
  const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId) ?? {};
  const lines = quickConfrontationLines(confrontation);
  const index = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.confrontationLineIndex ?? 0)));
  const line = lines[index] ?? {};
  const next = lines[index + 1];
  if (!next || line.role === next.role || [line.role, next.role].includes("stage")) return false;
  return line.autoAdvanceNext === true || (line.role === "host" && /[？?]\s*$/.test(String(line.text ?? "")));
}

export function quickDetectiveIssueSelectionHtml(packet = {}, state = {}) {
  const resolved = new Set(state.resolvedConfrontationIds ?? []);
  const round = quickDisclosureRoundForState(packet, state);
  const options = quickIssueOptionsForRound(packet, state);
  const attempted = new Set(state.attemptedLineIds ?? []);
  const lines = quickStatementLinesForRound(packet, state);
  return `
    <section class="quick-detective-panel quick-issue-selection quick-statement-replay" aria-label="通话回放">
      <div class="quick-review-strip" aria-hidden="true"><i>REC</i><span></span></div>
      <div class="quick-statement-lines">
        ${lines.map((line) => quickStatementLineButton(line, options, attempted, resolved)).join("")}
      </div>
      ${(state.resolvedConfrontationIds?.length ?? 0) > 0 ? `
        <div class="quick-early-verdict">
          <p>已经有足够理由先做谨慎判断，也可以继续追完整条线。</p>
          <button data-quick-end-early type="button">按现有信息收住</button>
        </div>
      ` : ""}
    </section>
  `;
}

export function quickDetectivePatienceLostHtml(packet = {}, state = {}, { comment = null } = {}) {
  return `
    <section class="quick-detective-panel quick-patience-lost">
      <p>连续几次都没问到点上，直播间开始催你别再乱带节奏。电话还在，先把这段原话重新听一遍。</p>
      ${comment?.text ? `<aside class="call-fixed-comment"><b>${escapeHtml(comment.listenerId ?? "@听众")}</b><p>${escapeHtml(comment.text)}</p></aside>` : ""}
      <button class="primary quick-main-action" data-quick-retry-statement type="button">重新听这段</button>
      ${(state.resolvedConfrontationIds?.length ?? 0) > 0 ? `<button data-quick-end-early type="button">按现有信息收住</button>` : ""}
    </section>
  `;
}

export function quickDetectiveVerdictHtml(packet = {}, state = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME, returnLabel = "返回案件选择" } = {}) {
  const ending = packet.ending ?? {};
  const pages = quickVerdictPages(packet, state);
  const index = Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)));
  const page = pages[index] ?? {};
  const lines = page.lines ?? [];
  const lineIndex = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.verdictLineIndex ?? 0)));
  const line = lines[lineIndex] ?? {};
  const last = index >= Math.max(0, pages.length - 1) && lineIndex >= Math.max(0, lines.length - 1);
  const kicker = page.kicker ?? ending.verdictKicker ?? `${hostName}最后总结`;
  const title = page.title ?? packet.title;
  return `
    <section class="quick-detective-panel quick-verdict">
      <header class="quick-summary-header">
        <div><p class="quick-mode-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2></div>
      </header>
      ${quickSpeechBubbleHtml({ ...line, speaker: line.role === "caller" ? "来电人" : hostName }, "quick-summary-dialogue", hostName)}
      ${last ? `
        <div class="quick-ending-actions">
          <button class="primary" data-quick-restart type="button">再玩一次</button>
          <button data-quick-select type="button">${escapeHtml(returnLabel)}</button>
        </div>
      ` : `<button class="primary quick-main-action" data-quick-next-verdict type="button">继续听</button>`}
    </section>
  `;
}

function quickCaseCardHtml(packet = {}, index = 0, completed = false) {
  const number = String(packet.caseNumber ?? packet.id?.match(/^\d+/)?.[0] ?? index + 1).padStart(2, "0");
  return `
    <button class="quick-case-card${completed ? " is-complete" : ""}" data-quick-case-id="${escapeHtml(packet.id)}" type="button">
      <span class="quick-case-number"><small>CASE</small><b>${escapeHtml(number)}</b></span>
      <span class="quick-case-copy">
        <small>${escapeHtml(packet.label ?? `直播快案 ${number}`)}</small>
        <strong>${escapeHtml(packet.title)}</strong>
      </span>
      <span class="quick-case-status" aria-label="${completed ? "已完成" : "尚未完成"}">
        ${completed ? "<i>✓</i><b>已完成</b>" : "<i></i><b>未完成</b>"}
      </span>
    </button>
  `;
}

function quickStageFocus(packet = {}, state = {}) {
  if (state.scene === "transcript") return "caller";
  if (state.scene === "issueSelection" || state.scene === "patienceLost") return "host";
  if (state.scene === "confrontation") {
    const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId) ?? {};
    const lines = quickConfrontationLines(confrontation);
    const lineIndex = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.confrontationLineIndex ?? 0)));
    return lines[lineIndex]?.role === "caller" ? "caller" : "host";
  }
  if (state.scene === "verdict") {
    const pages = quickVerdictPages(packet, state);
    const page = pages[Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)))] ?? {};
    const lines = page.lines ?? [];
    const line = lines[Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.verdictLineIndex ?? 0)))] ?? {};
    return line.role === "caller" ? "caller" : "host";
  }
  return "host";
}

function quickHostArtSrc(host = {}, state = {}, focus = "host") {
  const variants = host.artVariants ?? {};
  const variant = state.scene === "intro"
    ? "listening"
    : state.scene === "verdict"
    ? "verdict"
    : state.scene === "confrontation" && focus === "host"
      ? "pressing"
      : focus === "host" || focus === "both"
        ? "questioning"
        : "listening";
  return variants[variant] ?? variants.listening ?? host.artSrc ?? "";
}

function quickCallerArtSrc(caller = {}, state = {}, focus = "caller") {
  const variants = caller.artVariants ?? {};
  const confrontationLineIndex = Number(state.confrontationLineIndex ?? 0);
  const variant = state.scene === "verdict"
    ? "pause"
    : state.scene === "confrontation" && focus === "caller"
      ? confrontationLineIndex >= 3 ? "pause" : "guarded"
      : "neutral";
  return variants[variant] ?? variants.neutral ?? caller.artSrc ?? "";
}

function quickSpeechBubbleHtml(line = {}, className = "", hostName = DEFAULT_PLAYER_NAME) {
  const role = line.role === "caller" ? "caller" : "host";
  return `
    <section class="quick-exchange quick-single-bubble avg-textbox ${escapeHtml(className)}" data-quick-dialogue-box data-quick-speaking="${role}" data-quick-speaker="${escapeHtml(line.speaker ?? (role === "caller" ? "来电人" : hostName))}" data-quick-line-text="${escapeHtml(line.text)}" tabindex="0">
      <div class="avg-page-lines"></div>
      <i class="avg-continue" aria-label="继续">▼</i>
    </section>
  `;
}

function quickStageStatus(packet = {}, state = {}) {
  if (state.scene === "verdict") {
    const pages = quickVerdictPages(packet, state);
    const index = Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)));
    return pages[index]?.stageLabel ?? "最后总结";
  }
  return {
    intro: "等待接通",
    transcript: "监听",
    issueSelection: "REC 回放",
    confrontation: "LINE 打断",
    patienceLost: "线路发散"
  }[state.scene] ?? "语音连线中";
}

function quickStatementLineButton(line = {}, options = [], attempted = new Set(), resolved = new Set()) {
  const option = statementOptionForLine(options, line);
  const solved = Boolean(option?.confrontationId && resolved.has(option.confrontationId));
  const missed = attempted.has(line.id) && !solved;
  return `
    <button class="quick-statement-line${solved ? " is-resolved" : ""}${missed ? " is-missed" : ""}" data-quick-review-line="${escapeHtml(line.id)}" type="button" ${solved ? "disabled" : ""}>
      <i aria-hidden="true"></i>
      <span>${escapeHtml(line.text)}</span>
      ${missed ? "<small>这句没有可追问的线索 · 耐心 −1</small>" : ""}
    </button>
  `;
}

export function quickDetectivePatience(packet = {}, state = {}) {
  return quickRoundPatienceForState(packet, state);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
