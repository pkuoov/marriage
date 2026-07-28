import { quickDetectiveProgress, quickQuoteOption, quickTurnById } from "../runtime/quickDetectiveModel.js";

export function quickDetectiveHudHtml(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  const heardCount = state.scene === "intro"
    ? 0
    : state.scene === "transcript"
      ? Math.min((packet.turns?.length ?? 0), Number(state.turnIndex ?? 0) + 1)
      : packet.turns?.length ?? 0;
  return `
    <div class="quick-detective-hud" aria-label="快案进度">
      <span><small>回放</small><b>${heardCount}/${packet.turns?.length ?? 0}</b></span>
      <span><small>圈句机会</small><b>${progress.marksLeft}/${progress.markLimit}</b></span>
      <span><small>已经接上</small><b>${progress.foundIds.length}/${packet.requiredFlawCount ?? 0}</b></span>
    </div>
  `;
}

export function quickDetectiveIntroHtml(packet = {}) {
  return `
    <section class="quick-detective-panel quick-intro">
      <p class="quick-mode-kicker">${escapeHtml(packet.label)} · ${escapeHtml(packet.durationLabel)}</p>
      <h2>${escapeHtml(packet.title)}</h2>
      <p>${escapeHtml(packet.premise)}</p>
      <div class="quick-rule-card">
        <b>这次怎么玩</b>
        <p>${escapeHtml(packet.rule)}</p>
        <small>你只能圈 ${Number(packet.playerMarkLimit ?? 0)} 句；真正成立的破绽有 ${Number(packet.requiredFlawCount ?? 0)} 组。你找不全的，评论区会继续翻。</small>
      </div>
      <button class="primary quick-main-action" data-quick-begin type="button">接入这通电话</button>
    </section>
  `;
}

export function quickDetectiveTranscriptHtml(packet = {}, state = {}) {
  const index = Math.max(0, Number(state.turnIndex ?? 0));
  const turn = packet.turns?.[index] ?? {};
  const last = index >= Math.max(0, (packet.turns?.length ?? 1) - 1);
  return `
    <section class="quick-detective-panel quick-transcript">
      <header>
        <span>原始连线</span>
        <b>第 ${index + 1} 组 / ${packet.turns?.length ?? 0}</b>
      </header>
      <div class="quick-exchange">
        <div class="quick-line quick-line-host"><b>林旭阳</b><p>${escapeHtml(turn.host)}</p></div>
        <div class="quick-line quick-line-caller"><b>来电人</b><p>${escapeHtml(turn.caller)}</p></div>
      </div>
      <div class="quick-ambient-comments" aria-label="实时评论">
        ${(turn.ambientComments ?? []).map((comment) => `<span>${escapeHtml(comment)}</span>`).join("")}
      </div>
      <button class="primary quick-main-action" data-quick-next-turn type="button">${last ? "听完了，开始圈句" : "继续听"}</button>
    </section>
  `;
}

export function quickDetectiveInvestigationHtml(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  return `
    <section class="quick-detective-panel quick-investigation">
      <header>
        <div><span>回放记录</span><h2>哪句话跟她后面说的对不上？</h2></div>
        <b>还能圈 ${progress.marksLeft} 句</b>
      </header>
      <p class="quick-instruction">圈一句以后，评论区会试着给它找对照。数字显眼、听着离谱，都不自动算破绽。</p>
      <div class="quick-quote-grid">
        ${(packet.quoteOptions ?? []).map((option) => quickQuoteButtonHtml(option, state)).join("")}
      </div>
      ${progress.readyForCrowd ? `
        <div class="quick-crowd-handoff">
          <p>你的三次机会用完了。现在让评论区继续翻同一段回放。</p>
          <button class="primary" data-quick-continue-investigation type="button">看看评论区接上了什么</button>
        </div>
      ` : ""}
    </section>
  `;
}

export function quickDetectiveFeedbackHtml(packet = {}, state = {}, { crowd = false } = {}) {
  const option = quickQuoteOption(packet, state.selectedQuoteId);
  if (!option) return "";
  const anchorTurns = (option.pairedTurnIds ?? [option.turnId]).map((turnId) => quickTurnById(packet, turnId)).filter(Boolean);
  return `
    <section class="quick-detective-panel quick-feedback ${option.kind === "flaw" ? "is-hit" : "is-miss"}">
      <p class="quick-mode-kicker">${crowd ? "评论区补线" : option.kind === "flaw" ? "这句接上了" : "先别急着判"}</p>
      <h2>${escapeHtml(option.feedbackTitle)}</h2>
      <blockquote>${escapeHtml(option.excerpt)}</blockquote>
      ${anchorTurns.length > 1 ? `
        <div class="quick-anchor-pair">
          ${anchorTurns.map((turn) => `<p><small>她还说过</small>${escapeHtml(turn.caller)}</p>`).join("")}
        </div>
      ` : ""}
      <div class="quick-comment-wall">
        ${(option.comments ?? []).map((comment, index) => `<p><b>观众${index + 1}</b><span>${escapeHtml(comment)}</span></p>`).join("")}
      </div>
      <div class="quick-followup">
        <p><b>林旭阳</b>${escapeHtml(option.hostLine)}</p>
        ${option.callerLine ? `<p><b>来电人</b>${escapeHtml(option.callerLine)}</p>` : ""}
      </div>
      ${option.finding ? `<p class="quick-finding"><b>暂时能确定</b>${escapeHtml(option.finding)}</p>` : ""}
      <button class="primary quick-main-action" ${crowd ? "data-quick-next-crowd" : "data-quick-continue-investigation"} type="button">
        ${crowd ? "继续看评论区" : "回到回放"}
      </button>
    </section>
  `;
}

export function quickDetectiveCrowdAssistHtml(packet = {}, state = {}) {
  const remaining = quickDetectiveProgress(packet, state).remainingFlawIds.length;
  return `
    <section class="quick-detective-panel quick-crowd-assist">
      <p class="quick-mode-kicker">主播没来得及想到，评论还在往上刷</p>
      <h2>还有 ${remaining} 组原话没有接上</h2>
      <div class="quick-comment-wall quick-comment-scanning">
        <p><b>观众</b><span>先别找新料，就翻她刚才自己说过的话。</span></p>
        <p><b>观众</b><span>看看她前面说的原则，到了后面有没有变成一项具体要求。</span></p>
      </div>
      <button class="primary quick-main-action" data-quick-reveal-crowd type="button">让评论区贴出下一组</button>
    </section>
  `;
}

export function quickDetectiveVerdictHtml(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  const ending = packet.ending ?? {};
  return `
    <section class="quick-detective-panel quick-verdict">
      <p class="quick-mode-kicker">${escapeHtml(ending.verdictKicker ?? "快案结论 · 只判原话能证明的部分")}</p>
      <h2>${escapeHtml(packet.title)}</h2>
      <div class="quick-followup quick-ending-dialogue">
        <p><b>林旭阳</b>${escapeHtml(ending.hostLead)}</p>
        <p><b>林旭阳</b>${escapeHtml(ending.hostVerdict)}</p>
        <p><b>来电人</b>${escapeHtml(ending.callerReply)}</p>
        <p><b>林旭阳</b>${escapeHtml(ending.hostClose)}</p>
      </div>
      <div class="quick-result-split">
        <section><span>你接上的</span><b>${progress.playerFound.length}</b><small>组破绽</small></section>
        <section><span>评论区补上的</span><b>${progress.crowdFound.length}</b><small>组破绽</small></section>
      </div>
      ${ending.riskReading?.text ? `
        <section class="quick-risk-reading">
          <h3>${escapeHtml(ending.riskReading.title ?? "最需要防的解释")}</h3>
          <p>${escapeHtml(ending.riskReading.text)}</p>
        </section>
      ` : ""}
      <div class="quick-boundary-grid">
        <section>
          <h3>${escapeHtml(ending.confirmedTitle ?? "已经能确定")}</h3>
          <ul>${(ending.confirmed ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section>
          <h3>${escapeHtml(ending.unknownTitle ?? "这通电话还不能确定")}</h3>
          <ul>${(ending.unknown ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
      </div>
      <div class="quick-ending-actions">
        <button class="primary" data-quick-restart type="button">再玩一次</button>
        <button data-quick-title type="button">回标题页</button>
      </div>
    </section>
  `;
}

function quickQuoteButtonHtml(option = {}, state = {}) {
  const attempted = state.attemptedQuoteIds?.includes(option.id);
  const found = option.flawId && state.playerFoundFlawIds?.includes(option.flawId);
  return `
    <button class="quick-quote-option ${attempted ? "is-attempted" : ""} ${found ? "is-found" : ""}" data-quick-quote="${escapeHtml(option.id)}" type="button" ${attempted ? "disabled" : ""}>
      <small>${attempted ? found ? "已接上" : "证据不足" : "圈这句话"}</small>
      <b>${escapeHtml(option.excerpt)}</b>
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
