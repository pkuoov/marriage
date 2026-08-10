import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export function caseProgressStripHtml({ total = 1, answered = 0, label = "连线中" } = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const segment = Math.max(1, Math.min(safeTotal, Number(answered ?? 0) + 1));
  return `
    <div class="case-progress-strip">
      <span>第 ${segment}/${safeTotal} 句</span>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

export function audiencePatienceHudHtml(pressure = {}) {
  const percent = Math.round(Number(pressure.ratio ?? 0) * 100);
  const level = pressure.level ?? "high";
  const remaining = Number(pressure.remaining ?? 0);
  const max = Number(pressure.max ?? 0);
  return `
    <div class="audience-patience patience-${escapeHtml(level)}" aria-label="听众忍耐度 ${remaining}/${max}">
      <span>听众忍耐</span>
      <b>${remaining}/${max}</b>
      <i><em style="width:${percent}%"></em></i>
    </div>
  `;
}

export function storyPackSummaryHudHtml({ total = 1, solved = 0 } = {}) {
  return `
    <div class="weekly-summary-visual">
      <span>试玩已收麦</span>
      <b>${Number(solved ?? 0)}/${Number(total ?? 1)}</b>
      <small>麦都收进来了，评论区开始吵后半场。</small>
    </div>
  `;
}

export function liveCommentStripHtml(pressure = {}) {
  const comments = Array.isArray(pressure.comments) ? pressure.comments : [];
  return `<div class="live-comment-strip">${comments.map((item) => `<span class="live-comment">${escapeHtml(item)}</span>`).join("")}</div>`;
}

export function callerExpressionForView({ pressure = {}, budget = {}, scene = "", sceneIndex = 0, mood = "listening" } = {}) {
  if (pressure.expression) return pressure.expression;
  const remaining = Number(budget.remaining ?? budget.max ?? 1);
  const max = Math.max(1, Number(budget.max ?? 1));

  if (scene === "patienceLost") return { kind: "pause", text: "眼神空了一下" };
  if (remaining / max <= 0.28) return { kind: "pause", text: "停了很久才开口" };
  if (scene === "deepFollowup") return { kind: "pause", text: "指尖停在屏幕上" };
  if (mood === "tense") return { kind: "shift", text: "握着手机没松手" };
  if (mood === "focused") return { kind: "pause", text: "低头翻图，停了三秒" };
  if (mood === "thinking") {
    const beats = [
      { kind: "blink", text: "连眨两下" },
      { kind: "shift", text: "眼神往旁边躲" },
      { kind: "pause", text: "吸了口气才接" },
      { kind: "shift", text: "把手机攥紧了" }
    ];
    return beats[Math.max(0, Number(sceneIndex ?? 0)) % beats.length];
  }
  if (mood === "anxious") return { kind: "blink", text: "睫毛抖了一下" };
  return { kind: "blink", text: "麦里轻轻吸气" };
}

export function callerArtForExpression({ neutralSrc = "", variants = {}, expression = {} } = {}) {
  const neutral = variants.neutral ?? neutralSrc ?? "";
  const expressionKind = expression.kind ?? "neutral";
  const variantKind = expressionKind === "pause"
    ? "pause"
    : ["shift", "guarded"].includes(expressionKind)
      ? "guarded"
      : "neutral";
  return {
    variantKind,
    src: variants[variantKind] ?? neutral,
    fallbackSrc: neutral
  };
}

export function portraitLayerHtml({
  artSrc = "",
  fallbackSrc = "",
  artStyle = "",
  hostArtSrc = "./assets/generated/quick-detective/lin-xuyang-host-pixel.png",
  hostName = DEFAULT_PLAYER_NAME,
  callerVisible = true,
  mood = "listening",
  expression = null,
  sceneIndex = 0
} = {}) {
  const safeExpression = expression ?? { kind: "blink", text: "麦里轻轻吸气" };
  const artStyleClass = artStyle === "pixel" ? " art-pixel" : "";
  const fallbackAttr = fallbackSrc && fallbackSrc !== artSrc
    ? ` data-fallback-src="${escapeHtml(fallbackSrc)}" onerror="this.onerror=null;this.src=this.dataset.fallbackSrc;"`
    : ` onerror="this.hidden=true;this.closest('figure')?.classList.add('art-missing');"`;
  const moodLabels = {
    anxious: "紧张",
    focused: "盯资料",
    listening: "听线",
    tense: "绷住",
    thinking: "接话"
  };
  return `
    <div class="case-duel-portraits">
      <figure class="case-portrait case-portrait-host art-pixel${callerVisible ? "" : " active"}" data-dialogue-portrait="host">
        ${hostArtSrc ? `<img src="${escapeHtml(hostArtSrc)}" alt="" onerror="this.hidden=true;this.closest('figure')?.classList.add('art-missing');" /><span class="anonymous-portrait-placeholder" aria-hidden="true"></span>` : `<span class="anonymous-portrait-placeholder" aria-hidden="true"></span>`}
        <figcaption><span>主播</span><b>${escapeHtml(hostName)}</b></figcaption>
      </figure>
      ${callerVisible ? `<figure class="case-portrait case-portrait-caller${artStyleClass} mood-${escapeHtml(mood)} pose-${escapeHtml(safeExpression.kind)} beat-${Math.max(0, Number(sceneIndex ?? 0)) % 4} active" data-dialogue-portrait="caller">
        ${artSrc ? `<img src="${escapeHtml(artSrc)}" alt=""${fallbackAttr} /><span class="anonymous-portrait-placeholder" aria-hidden="true"></span>` : `<span class="anonymous-portrait-placeholder" aria-hidden="true"></span>`}
        <div class="call-expression expression-${escapeHtml(safeExpression.kind)}"><span>${escapeHtml(safeExpression.text)}</span></div>
        <figcaption><span>语音连线｜${escapeHtml(moodLabels[mood] ?? "听线")}</span><b>匿名来电人</b></figcaption>
      </figure>` : ""}
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
