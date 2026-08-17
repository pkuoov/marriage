import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export const DEFAULT_HOST_ART_VARIANTS = {
  listening: "./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.27.0",
  questioning: "./assets/generated/host/lin_xuyang_questioning_pixel.png?v=0.27.0",
  pressing: "./assets/generated/host/lin_xuyang_pressing_pixel.png?v=0.27.0",
  verdict: "./assets/generated/host/lin_xuyang_verdict_pixel.png?v=0.27.0"
};

export function caseProgressStripHtml({ total = 1, answered = 0, label = "连线中" } = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const segment = Math.max(1, Math.min(safeTotal, Number(answered ?? 0) + 1));
  const phase = segment >= safeTotal ? "这一段问完" : segment <= 1 ? "刚接进来" : "连线进行中";
  return `
    <div class="case-progress-strip">
      <span>${escapeHtml(label)}</span>
      <span>${escapeHtml(phase)}</span>
    </div>
  `;
}

export function audiencePatienceHudHtml(pressure = {}) {
  const percent = Math.round(Number(pressure.ratio ?? 0) * 100);
  const level = pressure.level ?? "high";
  const label = pressure.patienceLabel ?? (level === "low" ? "快压不住" : level === "mid" ? "开始起噪" : "还在听");
  return `
    <div class="audience-patience patience-${escapeHtml(level)}" aria-label="听众耐心：${escapeHtml(label)}">
      <span>听众耐心</span>
      <b>${escapeHtml(label)}</b>
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
  const flashback = pressure.flashback ?? null;
  return `<div class="live-comment-strip">${flashback ? `<blockquote class="flashback-quote"><span>闪回引用 · ${escapeHtml(flashback.sourceCaseLabel ?? "前案")}</span><p>“${escapeHtml(flashback.quote ?? flashback.text ?? "")}”</p></blockquote>` : ""}${comments.map((item) => `<span class="live-comment">${escapeHtml(item)}</span>`).join("")}</div>`;
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

export function hostSpeakingStateForView({ scene = "", mood = "listening" } = {}) {
  if (/recap|ending|epilogue|storyInterlude|caseConclusion/i.test(String(scene))) return "verdict";
  if (["sceneQuestionAnswer", "liveCounterBeat", "callerQuestion", "deepFollowup"].includes(scene) || ["tense", "anxious"].includes(mood)) return "pressing";
  if (["sceneReview", "callSegment1", "callSegment2", "overnightNight1", "overnightNight2"].includes(scene)) return "listening";
  return "questioning";
}

export function callerArtForExpression({ neutralSrc = "", variants = {}, variantPlan = {}, expression = {} } = {}) {
  const neutral = variants.neutral ?? neutralSrc ?? "";
  const expressionKind = expression.kind ?? "neutral";
  const variantKind = expressionKind === "pause"
    ? "pause"
    : ["shaken", "broken"].includes(expressionKind)
      ? expressionKind
    : ["shift", "guarded"].includes(expressionKind)
      ? "guarded"
      : "neutral";
  const plannedFallback = variantPlan?.[variantKind]?.fallback;
  return {
    variantKind,
    planned: variantPlan?.[variantKind]?.status === "planned",
    src: variants[variantKind] ?? variants[plannedFallback] ?? neutral,
    fallbackSrc: neutral
  };
}

export function portraitLayerHtml({
  artSrc = "",
  fallbackSrc = "",
  artStyle = "",
  hostArtSrc = DEFAULT_HOST_ART_VARIANTS.listening,
  hostArtVariants = DEFAULT_HOST_ART_VARIANTS,
  hostSpeakingState = "questioning",
  hostName = DEFAULT_PLAYER_NAME,
  respondentArtSrc = "",
  respondentFallbackSrc = "",
  respondentArtVariants = {},
  respondentName = "男方",
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
  const hostListeningSrc = hostArtVariants.listening ?? hostArtSrc;
  const hostQuestioningSrc = hostArtVariants.questioning ?? hostListeningSrc;
  const hostPressingSrc = hostArtVariants.pressing ?? hostQuestioningSrc;
  const hostVerdictSrc = hostArtVariants.verdict ?? hostQuestioningSrc;
  const respondentNeutralSrc = respondentArtVariants.neutral ?? respondentArtSrc;
  const respondentGuardedSrc = respondentArtVariants.guarded ?? respondentNeutralSrc;
  const respondentFallbackAttr = respondentFallbackSrc && respondentFallbackSrc !== respondentNeutralSrc
    ? ` data-fallback-src="${escapeHtml(respondentFallbackSrc)}" onerror="this.onerror=null;this.src=this.dataset.fallbackSrc;"`
    : ` onerror="this.hidden=true;this.closest('figure')?.classList.add('art-missing');"`;
  return `
    <div class="case-duel-portraits${respondentNeutralSrc ? " has-respondent" : ""}">
      <figure class="case-portrait case-portrait-host art-pixel${callerVisible ? "" : " active"}" data-dialogue-portrait="host">
        ${hostListeningSrc ? `<img src="${escapeHtml(hostListeningSrc)}" alt="" data-host-portrait data-host-speaking-state="${escapeHtml(hostSpeakingState)}" data-host-art-listening="${escapeHtml(hostListeningSrc)}" data-host-art-questioning="${escapeHtml(hostQuestioningSrc)}" data-host-art-pressing="${escapeHtml(hostPressingSrc)}" data-host-art-verdict="${escapeHtml(hostVerdictSrc)}" onerror="this.hidden=true;this.closest('figure')?.classList.add('art-missing');" /><span class="anonymous-portrait-placeholder" aria-hidden="true"></span>` : `<span class="anonymous-portrait-placeholder" aria-hidden="true"></span>`}
        <figcaption><span>主播</span><b>${escapeHtml(hostName)}</b></figcaption>
      </figure>
      ${callerVisible ? `<figure class="case-portrait case-portrait-caller${artStyleClass} mood-${escapeHtml(mood)} pose-${escapeHtml(safeExpression.kind)} beat-${Math.max(0, Number(sceneIndex ?? 0)) % 4} active" data-dialogue-portrait="caller">
        ${artSrc ? `<img src="${escapeHtml(artSrc)}" alt=""${fallbackAttr} /><span class="anonymous-portrait-placeholder" aria-hidden="true"></span>` : `<span class="anonymous-portrait-placeholder" aria-hidden="true"></span>`}
        <div class="call-expression expression-${escapeHtml(safeExpression.kind)}"><span>${escapeHtml(safeExpression.text)}</span></div>
        <figcaption><span>语音连线｜${escapeHtml(moodLabels[mood] ?? "听线")}</span><b>匿名来电人</b></figcaption>
      </figure>` : ""}
      ${respondentNeutralSrc ? `<figure class="case-portrait case-portrait-respondent art-pixel" data-dialogue-portrait="respondent" data-respondent-art-neutral="${escapeHtml(respondentNeutralSrc)}" data-respondent-art-guarded="${escapeHtml(respondentGuardedSrc)}">
        <img src="${escapeHtml(respondentNeutralSrc)}" alt="" data-respondent-portrait${respondentFallbackAttr} /><span class="anonymous-portrait-placeholder" aria-hidden="true"></span>
        <figcaption><span>临时连麦</span><b>${escapeHtml(respondentName)}</b></figcaption>
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
