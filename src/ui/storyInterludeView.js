const HOST_ART = {
  listening: "./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.28.0",
  questioning: "./assets/generated/host/lin_xuyang_questioning_pixel.png?v=0.28.0"
};

const ZHAO_ART = {
  daily: "./assets/generated/advisors/zhao-lawyer/zhao-lawyer-daily-pixel.png?v=0.28.0",
  teasing: "./assets/generated/advisors/zhao-lawyer/zhao-lawyer-teasing-pixel.png?v=0.28.0",
  serious: "./assets/generated/advisors/zhao-lawyer/zhao-lawyer-serious-pixel.png?v=0.28.0"
};

const INTERLUDE_STAGE = {
  "01-credit": { hostPose: "listening", zhaoPose: "teasing", prop: "warm-water", zhaoMode: "present" },
  "02-tony": { hostPose: "questioning", prop: "voice-message", remoteLabel: "老方 · 语音" },
  "03-profile": { hostPose: "listening", zhaoPose: "serious", prop: "thermos", zhaoMode: "remote" },
  "04-workplace": { hostPose: "listening", zhaoPose: "daily", prop: "cups", zhaoMode: "present" }
};

export function storyInterludeHtml({
  kicker = "广告间隙",
  shellLine = "",
  shellLines = [],
  shellAfterLines = [],
  worldEcho = null,
  worldEchoHypothesis = null,
  afterCaseId = ""
} = {}) {
  return `
    <section class="story-interlude-card shell" data-after-case="${escapeHtml(afterCaseId)}">
      <span>${escapeHtml(kicker)}</span>
      ${(shellLines ?? []).map((line) => `<div class="story-interlude-line"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
      <p>${escapeHtml(shellLine || "控台安静了一会儿，下一通的材料先到了后台。")}</p>
      ${(shellAfterLines ?? []).map((line) => `<div class="story-interlude-line stage"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
    </section>
    ${worldEcho ? `<section class="story-interlude-card world-echo">
      <span>${escapeHtml(worldEcho.kicker ?? "城市回声")}</span>
      <b>${escapeHtml(worldEcho.headline ?? "")}</b>
      <p>${escapeHtml(worldEcho.body ?? "")}</p>
    </section>` : ""}
    ${worldEchoHypothesis ? `<section class="story-interlude-card world-echo-hypothesis">
      <span>你先压下的判断</span>
      <b>${escapeHtml(worldEchoHypothesis.label ?? "")}</b>
      <p>${escapeHtml(worldEchoHypothesis.response ?? "")}</p>
    </section>` : ""}
  `;
}

export function storyInterludeStageHtml({ afterCaseId = "", hostName = "林旭阳" } = {}) {
  const stage = INTERLUDE_STAGE[afterCaseId] ?? INTERLUDE_STAGE["01-credit"];
  const hostSrc = HOST_ART[stage.hostPose] ?? HOST_ART.listening;
  const zhaoSrc = stage.zhaoPose ? ZHAO_ART[stage.zhaoPose] : "";
  return `
    <div class="story-interlude-stage prop-${escapeHtml(stage.prop ?? "desk")}" data-after-case="${escapeHtml(afterCaseId)}">
      <div class="interlude-live-light"><i></i><span>OFF AIR</span></div>
      <figure class="interlude-person interlude-host">
        <img src="${escapeHtml(hostSrc)}" alt="" onerror="this.hidden=true" />
        <figcaption><span>主播</span><b>${escapeHtml(hostName)}</b></figcaption>
      </figure>
      ${zhaoSrc ? `<figure class="interlude-person interlude-zhao is-${escapeHtml(stage.zhaoMode ?? "present")}">
        <img src="${escapeHtml(zhaoSrc)}" alt="" onerror="this.hidden=true" />
        <figcaption><span>${stage.zhaoMode === "remote" ? "语音通话" : "工作室里"}</span><b>赵律师</b></figcaption>
      </figure>` : `<div class="interlude-remote-chip"><i></i><span>${escapeHtml(stage.remoteLabel ?? "语音消息")}</span></div>`}
      <div class="interlude-desk-prop" aria-hidden="true"><i></i><span></span></div>
    </div>
  `;
}

export function storyWorldEchoStageHtml(worldEcho = null) {
  if (!worldEcho?.artSrc) return "";
  return `
    <figure class="story-world-echo-stage">
      <img src="${escapeHtml(worldEcho.artSrc)}" alt="${escapeHtml(worldEcho.artAlt ?? worldEcho.headline ?? "新闻推送")}" onerror="this.closest('figure')?.classList.add('art-missing');this.hidden=true" />
      <figcaption>
        <span>${escapeHtml(worldEcho.kicker ?? "城市回声")}</span>
        <b>${escapeHtml(worldEcho.headline ?? "")}</b>
      </figcaption>
    </figure>
  `;
}

export function storyInterludeChoicesHtml({ finalCase = false, worldEcho = null, worldEchoRevealed = false, worldEchoHypothesisId = "", optionalQuickCall = null } = {}) {
  if (worldEcho && !worldEchoRevealed) {
    if (worldEcho.hypotheses?.length && !worldEchoHypothesisId) {
      return `<div class="world-echo-hypothesis-choices"><p>推送点开前，你先把哪条风险假设压在桌面上？</p>${worldEcho.hypotheses.map((item) => `<button data-world-echo-hypothesis="${escapeHtml(item.id)}" type="button">${escapeHtml(item.label)}</button>`).join("")}</div><button data-retry-case type="button">回看这通</button>`;
    }
    return `<button class="primary" data-reveal-world-echo type="button">${escapeHtml(worldEcho.actionLabel ?? "继续听")}</button><button data-retry-case type="button">回看这通</button>`;
  }
  const primary = finalCase
    ? `<button class="primary" data-enter-night-epilogue type="button">收播</button>`
    : `<button class="primary" data-enter-case-bridge type="button">接下一通</button>`;
  const optional = !finalCase && optionalQuickCall?.quickCaseId
    ? `<button data-enter-optional-quick="${escapeHtml(optionalQuickCall.quickCaseId)}" type="button">${escapeHtml(optionalQuickCall.actionLabel ?? "接一通插播")}</button>`
    : "";
  return `${primary}${optional}<button data-retry-case type="button">回看这通</button>`;
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
