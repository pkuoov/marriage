import { quickConfrontationLines, quickDisclosureRoundForState, quickIssueOptionsForRound, quickTurnIndexesForRound } from "../runtime/quickDetectiveModel.js";
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
  return `
    <div class="quick-duel-stage focus-${escapeHtml(focus)}" data-quick-stage-focus="${escapeHtml(focus)}">
      ${presentation.backgroundSrc ? `<img class="quick-stage-backdrop" src="${escapeHtml(presentation.backgroundSrc)}" alt="" onerror="this.hidden=true" />` : ""}
      <div class="quick-stage-vignette"></div>
      <figure class="quick-stage-speaker quick-stage-host${["host", "both"].includes(focus) ? " is-active" : ""}">
        ${host.artSrc ? `<img src="${escapeHtml(host.artSrc)}" alt="" onerror="this.hidden=true" />` : ""}
        <figcaption><small>${escapeHtml(host.roleLabel ?? "主播")}</small><b>${escapeHtml(hostName)}</b></figcaption>
      </figure>
      <div class="quick-call-link" aria-hidden="true">
        <small>${escapeHtml(status)}</small>
        <span><i></i><i></i><i></i><i></i><i></i></span>
      </div>
      <figure class="quick-stage-speaker quick-stage-caller${["caller", "both"].includes(focus) ? " is-active" : ""}">
        ${caller.artSrc ? `<img src="${escapeHtml(caller.artSrc)}" alt="" onerror="this.hidden=true" />` : ""}
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
  const index = Math.max(0, Number(state.turnIndex ?? 0));
  const lineIndex = Number(state.turnLineIndex ?? 0) === 1 ? 1 : 0;
  const turn = packet.turns?.[index] ?? {};
  const round = quickDisclosureRoundForState(packet, state);
  const roundIndexes = quickTurnIndexesForRound(packet, round);
  const last = index === roundIndexes[roundIndexes.length - 1];
  const line = lineIndex === 0
    ? { role: "host", speaker: hostName, text: turn.host }
    : { role: "caller", speaker: "来电人", text: turn.caller };
  return `
    <section class="quick-detective-panel quick-transcript">
      <header>
        <span>${escapeHtml(round.label ?? "原始连线")}</span>
      </header>
      ${quickSpeechBubbleHtml(line, "", hostName)}
      <button class="primary quick-main-action" data-quick-next-turn type="button">${lineIndex === 0 ? "听来电人回答" : last ? "轮到你判断" : "继续听"}</button>
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
    ? nextLine.role === "caller" ? "听来电人回应" : "继续问"
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

export function quickDetectiveIssueSelectionHtml(packet = {}, state = {}) {
  const resolved = new Set(state.resolvedConfrontationIds ?? []);
  const round = quickDisclosureRoundForState(packet, state);
  return `
    <section class="quick-detective-panel quick-issue-selection">
      <header>
        <div><span>${escapeHtml(round.label ?? "轮到你判断")}</span><h2>先问哪件事？</h2></div>
      </header>
      <div class="quick-issue-grid">
        ${quickIssueOptionsForRound(packet, state).map((option) => quickIssueButtonHtml(option, state, resolved)).join("")}
      </div>
    </section>
  `;
}

export function quickDetectiveVerdictHtml(packet = {}, state = {}, { hostName = packet.presentation?.host?.name ?? DEFAULT_PLAYER_NAME } = {}) {
  const ending = packet.ending ?? {};
  const pages = ending.summaryPages ?? [];
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
          <button data-quick-select type="button">返回案件选择</button>
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
  if (state.scene === "transcript") return Number(state.turnLineIndex ?? 0) === 1 ? "caller" : "host";
  if (state.scene === "issueSelection") return "both";
  if (state.scene === "confrontation") {
    const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId) ?? {};
    const lines = quickConfrontationLines(confrontation);
    const lineIndex = Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.confrontationLineIndex ?? 0)));
    return lines[lineIndex]?.role === "caller" ? "caller" : "host";
  }
  if (state.scene === "verdict") {
    const pages = packet.ending?.summaryPages ?? [];
    const page = pages[Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)))] ?? {};
    const lines = page.lines ?? [];
    const line = lines[Math.max(0, Math.min(Math.max(0, lines.length - 1), Number(state.verdictLineIndex ?? 0)))] ?? {};
    return line.role === "caller" ? "caller" : "host";
  }
  return "host";
}

function quickSpeechBubbleHtml(line = {}, className = "", hostName = DEFAULT_PLAYER_NAME) {
  const role = line.role === "caller" ? "caller" : "host";
  return `
    <div class="quick-exchange quick-single-bubble ${escapeHtml(className)}" data-quick-speaking="${role}">
      <div class="quick-line quick-line-${role}">
        <b>${escapeHtml(line.speaker ?? (role === "caller" ? "来电人" : hostName))}</b>
        <p>${escapeHtml(line.text)}</p>
      </div>
    </div>
  `;
}

function quickStageStatus(packet = {}, state = {}) {
  if (state.scene === "verdict") {
    const pages = packet.ending?.summaryPages ?? [];
    const index = Math.max(0, Math.min(Math.max(0, pages.length - 1), Number(state.verdictIndex ?? 0)));
    return pages[index]?.stageLabel ?? "最后总结";
  }
  return {
    intro: "等待接通",
    transcript: "语音连线中",
    issueSelection: "准备追问",
    confrontation: "当面对质"
  }[state.scene] ?? "语音连线中";
}

function quickIssueButtonHtml(option = {}, state = {}, resolved = new Set()) {
  const solved = option.confrontationId && resolved.has(option.confrontationId);
  const attempted = state.attemptedIssueIds?.includes(option.id);
  const disabled = solved || (attempted && !option.confrontationId);
  return `
    <button class="quick-issue-option${solved ? " is-resolved" : ""}${disabled && !solved ? " is-dismissed" : ""}" data-quick-issue="${escapeHtml(option.id)}" type="button" ${disabled ? "disabled" : ""}>
      ${solved || disabled ? `<small>${solved ? "已经问过" : "目前接不上"}</small>` : ""}
      <b>${escapeHtml(option.label)}</b>
    </button>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
