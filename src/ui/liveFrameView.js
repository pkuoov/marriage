import { materialRecordHtml } from "./materialRecordView.js";
import { audioSettingsPanelHtml } from "./audioSettingsView.js";

export function liveControlDeckHtml({
  onAirLabel = "匿名热线",
  label = "连线中",
  segment = 1,
  total = 1,
  pressure = {},
  mode = "listen",
  material = "",
  materialCount = 1,
  progressLabel = "",
  progressNote = "",
  soloCommentary = false,
  simpleInquiry = false
} = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const safeSegment = Math.max(1, Math.min(safeTotal, Number(segment ?? 1)));
  const pressureRemaining = Number(pressure.remaining ?? 0);
  const pressureMax = Number(pressure.max ?? 0);
  const progressPercent = Math.round((safeSegment / safeTotal) * 100);
  const pressurePercent = pressureMax > 0
    ? Math.round((Math.max(0, Math.min(pressureMax, pressureRemaining)) / pressureMax) * 100)
    : 0;
  const defaultProgressState = soloCommentary
    ? { label: `第 ${safeSegment} 段点评`, note: "本段公开文本正在口播。" }
    : deckProgressState(safeSegment, safeTotal);
  const progressState = {
    label: progressLabel || defaultProgressState.label,
    note: progressNote || defaultProgressState.note
  };
  const patienceState = soloCommentary
    ? { label: "点评中", note: "读完这一段，再选择从哪里说起。" }
    : deckPatienceState(pressure);
  const materialKind = materialKindForLabel(material);
  const hasMaterial = Boolean(material && Number(materialCount) > 0);
  const hostState = hostMonitorStateForPressure(pressure);
  return `
    <aside class="control-deck deck-mode-${escapeHtml(mode)}" aria-label="直播控场台">
      <section class="deck-card deck-card-live">
        <span><i></i>ON AIR</span>
        <b>${escapeHtml(onAirLabel)}</b>
        <small>${escapeHtml(label || "连线中")}</small>
        <div class="deck-host-monitor host-${escapeHtml(hostState.kind)}" aria-hidden="true">
          <i></i>
          <span>
            <b>主播监听</b>
            <small>${escapeHtml(hostState.label)}</small>
          </span>
          <em><i></i><i></i><i></i><i></i></em>
        </div>
        <div class="deck-live-metrics" aria-hidden="true">
          <i>LIVE</i>
          <i>${viewerCountForPressure(pressure)}</i>
        </div>
        <div class="deck-monitor-strip" aria-hidden="true">
          <i class="${mode === "listen" ? "is-active" : ""}">MIC</i>
          <i class="${mode === "replay" ? "is-active" : ""}">REC</i>
          <i class="${mode === "interrupt" ? "is-active" : ""}">LINE</i>
        </div>
      </section>
      ${simpleInquiry ? "" : `<section class="deck-card">
        <span>${soloCommentary ? "点评进度" : "通话进度"}</span>
        <b>${escapeHtml(progressState.label)}</b>
        <i class="deck-value-rail" aria-hidden="true"><em style="width:${progressPercent}%"></em></i>
        <small>${escapeHtml(progressState.note)}</small>
      </section>
      <section class="deck-card deck-card-pressure">
        <span>听众耐心</span>
        <b>${escapeHtml(patienceState.label)}</b>
        <i class="deck-value-rail deck-pressure-rail" aria-hidden="true"><em style="width:${pressurePercent}%"></em></i>
        <small>${escapeHtml(patienceState.note)}</small>
      </section>
      `}
      ${hasMaterial ? `
        <button class="deck-card deck-card-material is-ready" data-material-open aria-controls="avg-material-modal" aria-expanded="false" aria-haspopup="dialog" aria-label="查看后台材料：${escapeHtml(material)}" type="button">
          <span>后台材料</span>
          <span class="deck-material-preview material-${escapeHtml(materialKind)}" aria-hidden="true">
            <i>${escapeHtml(materialGlyph(materialKind))}</i>
            <em></em>
          </span>
          <b>${escapeHtml(material)}</b>
          <small>已收到 ${Number(materialCount)} 份 · 点击查看</small>
        </button>
      ` : simpleInquiry ? "" : `
        <section class="deck-card deck-card-material">
          <span>后台材料</span>
          <div class="deck-material-preview material-empty" aria-hidden="true">
            <i>—</i>
            <em></em>
          </div>
          <b>${soloCommentary ? "公开文本" : "尚未收到"}</b>
          <small>${soloCommentary ? "本段文本随主播口播呈现。" : "来电人发来后会出现在这里。"}</small>
        </section>
      `}
    </aside>
  `;
}

function deckProgressState(segment = 1, total = 1) {
  const ratio = segment / Math.max(1, total);
  if (total <= 1 || ratio >= 1) return { label: "这一段问完", note: "来电人的这段话已经说完。" };
  if (segment <= 1) return { label: "刚接进来", note: "来电人还在讲自己的版本。" };
  if (ratio <= 0.55) return { label: "还在往下问", note: "问题已经问开，麦还在继续。" };
  return { label: "接近收束", note: "还剩几句，麦没挂。" };
}

function deckPatienceState(pressure = {}) {
  const level = pressure.level ?? "high";
  if (pressure.focusedInquiry) return { label: Number(pressure.remaining ?? 0) <= 0 ? "这件事还没问清" : pressure.patienceLabel ?? "还在听", note: "接着问当前的问题。" };
  if (pressure.quietUntilEmpty) {
    if (Number(pressure.remaining ?? 0) <= 0) {
      return { label: pressure.patienceLabel ?? "直播间失去耐心", note: "直播间开始催你别再乱带节奏。" };
    }
    if (level === "low") return { label: pressure.patienceLabel ?? "快见底", note: "刚才有一句没有问到点上。" };
    if (level === "mid") return { label: pressure.patienceLabel ?? "还能继续", note: "这段里还有机会把问题找回来。" };
    return { label: pressure.patienceLabel ?? "耐心充足", note: "先听原话，再决定打断哪一句。" };
  }
  if (level === "low") return { label: pressure.patienceLabel ?? "快压不住", note: "麦里的停顿变长了。" };
  if (level === "mid") return { label: pressure.patienceLabel ?? "开始起噪", note: "她答得慢了，弹幕也在分岔。" };
  return { label: pressure.patienceLabel ?? "还在听", note: "来电人还愿意往下说。" };
}

function hostMonitorStateForPressure(pressure = {}) {
  const level = pressure.level ?? "high";
  const crowd = pressure.crowd ?? "";
  if (pressure.quietUntilEmpty && Number(pressure.remaining ?? 0) > 0) {
    return { kind: "idle", label: "监听中" };
  }
  if (level === "low" || crowd === "散了") return { kind: "pressed", label: "压麦" };
  if (crowd === "跑偏") return { kind: "thinking", label: "拉回" };
  if (crowd === "稳住" || crowd === "追上") return { kind: "held", label: "收住" };
  return { kind: "idle", label: "监听中" };
}

function viewerCountForPressure(pressure = {}) {
  if (pressure.quietUntilEmpty && Number(pressure.remaining ?? 0) > 0) return "9.0K Viewers";
  const ratio = Number.isFinite(Number(pressure.ratio)) ? Number(pressure.ratio) : 0.75;
  const base = 6.2 + Math.max(0, Math.min(1, ratio)) * 2.8;
  return `${base.toFixed(1)}K Viewers`;
}

function materialKindForLabel(label = "") {
  const text = String(label ?? "");
  if (/审批|报销|付款|流程|收款|返款/.test(text)) return "flow";
  if (/表|排班|预约|名单|列/.test(text)) return "table";
  if (/账单|信用卡|还款|流水|消费|分期/.test(text)) return "bill";
  if (/图|截图|资料|证明|照片|图片/.test(text)) return "shot";
  return "file";
}

function materialGlyph(kind = "file") {
  return {
    bill: "¥",
    flow: "→",
    table: "▦",
    shot: "▣",
    file: "≡"
  }[kind] ?? "≡";
}

export function liveFrameHtml({
  productName = "深夜热线：直播间侦探",
  modeLabel = "试玩连线",
  soundEnabled = true,
  audioSettings = null,
  backdropClass = "backdrop-live",
  label = "",
  chapter = "",
  text = "",
  reactionHtml = "",
  choices = "",
  visualHud = "",
  controlDeckHtml = "",
  material = "",
  materialCount = 1,
  materialArtSrc = "",
  materialItems = [],
  screenEffect = "",
  screenClass = "",
  pixelTransition = null,
  rewindAvailable = false,
  showRecordButton = true,
  showResetButton = true
} = {}) {
  const materialKind = materialKindForLabel(material);
  const choiceMarkup = String(choices ?? "");
  const hasChoices = Boolean(choiceMarkup.trim());
  const choicesAreFlow = hasChoices && (choiceMarkup.includes("flow-group") || choiceMarkup.includes("cafe-opening-action"));
  const choiceLayer = hasChoices
    ? `<div class="choices avg-choice-overlay ${choicesAreFlow ? "inline-choice-flow" : "modal-choice-flow"}">${choiceMarkup}</div>`
    : "";
  return `
    <main class="${escapeHtml(String(screenClass ?? "").split(/\s+/).find((name) => /^effects-(full|reduced|off)$/.test(name)) ?? "effects-full")}">
      ${pixelTransitionHtml(pixelTransition)}
      <header class="topbar">
        <button class="history-back-button" data-action="rewind" type="button" aria-label="返回上次追问" ${rewindAvailable ? "" : "disabled"}>返回追问</button>
        <button data-action="title" type="button" aria-label="回到标题页">主菜单</button>
        <nav aria-label="章节"><span class="active"><i></i>${escapeHtml(modeLabel)}</span></nav>
        ${audioSettingsPanelHtml(audioSettings ?? { enabled: soundEnabled }, { placement: "topbar" })}
        ${material ? `<button class="material-toolbar-button" data-material-card data-material-open aria-controls="avg-material-modal" aria-expanded="false" aria-haspopup="dialog" type="button">查看材料 <b>${Math.max(1, Number(materialCount) || 1)}</b></button>` : ""}
        ${showResetButton ? `<button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>` : ""}
        ${showRecordButton ? `<button class="record-button" data-record-open type="button">案卷</button>` : ""}
      </header>
      <section class="story-grid case-vn-grid live-console-shell ${controlDeckHtml ? "has-control-deck" : ""} ${escapeHtml(screenClass)}" data-live-shell>
        ${screenEffect ? `<div class="screen-effect screen-effect-${escapeHtml(screenEffect)}" aria-hidden="true"></div>` : ""}
        ${controlDeckHtml}
        <article class="vn-stage" data-live-stage>
          <div class="vn-stage-frame" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
            <span><em></em><em></em><em></em><em></em><em></em><em></em><em></em></span>
          </div>
          <div class="visual-scene backdrop-office ${escapeHtml(backdropClass)}" aria-hidden="true">
            ${label ? `<div class="scene-label">${escapeHtml(label)}</div>` : ""}
            ${sceneEvidencePropsHtml(backdropClass, materialKind)}
            ${visualHud}
          </div>
          <div class="dialogue-card" aria-live="polite">
            <div class="dialogue-toolbar">
              ${chapter ? `<p class="eyebrow">${escapeHtml(chapter)}</p>` : ""}
            </div>
            ${text}
            ${reactionHtml}
          </div>
          ${choicesAreFlow ? choiceLayer : ""}
        </article>
        ${choicesAreFlow ? "" : choiceLayer}
      </section>
      ${material ? materialModalHtml(material, materialKind, materialArtSrc, materialItems) : ""}
    </main>
  `;
}

export function pixelTransitionHtml(transition = null) {
  if (!transition) return "";
  const kind = ["scene", "soft-fade", "signal-connect", "signal-disconnect", "reveal", "phase"].includes(transition.kind) ? transition.kind : "scene";
  const signalClass = kind.startsWith("signal-") ? " pixel-transition-signal" : "";
  const phaseVariant = kind === "phase" && ["listen", "review"].includes(transition.visualVariant)
    ? ` pixel-transition-phase-${transition.visualVariant}`
    : "";
  const eyebrow = String(transition.eyebrow ?? "").trim();
  const label = String(transition.label ?? "").trim();
  const caption = eyebrow || label
    ? `<p>${eyebrow ? `<small>${escapeHtml(eyebrow)}</small>` : ""}${label ? `<b>${escapeHtml(label)}</b>` : ""}</p>`
    : "";
  const phaseStage = kind === "phase"
    ? `<div class="statement-phase-stage" aria-hidden="true">
        <span class="statement-phase-rail statement-phase-rail-left"><i></i><i></i><i></i></span>
        <span class="statement-phase-signal"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="statement-phase-rail statement-phase-rail-right"><i></i><i></i><i></i></span>
      </div>`
    : "";
  return `
    <div class="pixel-transition pixel-transition-${kind}${signalClass}${phaseVariant}" data-transition-kind="${kind}"${phaseVariant ? ` data-transition-variant="${escapeHtml(transition.visualVariant)}"` : ""} aria-hidden="true">
      <div class="pixel-transition-grid"></div>
      ${phaseStage}
      ${revealPerformanceHtml(transition)}
      ${caption}
    </div>
  `;
}

function materialModalHtml(material = "", materialKind = "file", materialArtSrc = "", materialItems = []) {
  return `
    <aside class="avg-material-modal" id="avg-material-modal" data-material-modal hidden>
      <button class="avg-material-backdrop" data-material-close aria-label="关闭材料板" type="button"></button>
      <section class="avg-material-panel" role="dialog" aria-modal="true" aria-labelledby="avg-material-title">
        <header>
          <span>后台材料</span>
          <button data-material-close type="button" aria-label="关闭后台材料">关闭材料 <b aria-hidden="true">×</b></button>
        </header>
        <div class="avg-material-sheet material-${escapeHtml(materialKind)}">
          ${materialRecordHtml(materialItems)}
          ${materialArtSrc ? `<details class="material-image-preview"><summary>展开材料示意图</summary><img class="avg-material-art" src="${escapeHtml(materialArtSrc)}" alt="${escapeHtml(material)}的材料合成图" onerror="this.hidden=true" /></details>` : ""}
          <small id="avg-material-title">当前材料</small>
          <i aria-hidden="true">${escapeHtml(materialGlyph(materialKind))}</i>
          <b>${escapeHtml(material)}</b>
          <em>已收到的原文可随时回看。示意图不增加证据内容。</em>
        </div>
      </section>
    </aside>
  `;
}

function revealPerformanceHtml(transition = {}) {
  const variant = String(transition.visualVariant ?? "");
  if (!variant) return "";
  const art = transition.evidenceArtSrc
    ? `<img class="reveal-performance-art" src="${escapeHtml(transition.evidenceArtSrc)}" alt="" />`
    : "";
  const inner = {
    "amount-gap": `${art}<div class="reveal-amounts"><b>80,000</b><span>− 40,000</span><span>− 5,000</span><strong>35,000 ?</strong></div>`,
    "proxy-ledger": `<div class="reveal-amounts"><b>1,000,000</b><span>起投</span><span>120,000</span><strong>走我户</strong></div>`,
    "police-knock": `<div class="reveal-window-light"></div><div class="reveal-door"><i></i><i></i></div>`,
    "second-mic": `<div class="reveal-gift">✦</div><div class="reveal-mics"><i></i><i></i></div>`,
    "approval-split": `${art}<div class="reveal-approval-split"><span>活动负责人</span><i></i><span>付款经办人</span></div>`,
    "two-fathers": `<div class="reveal-father-card"><small>亲生父亲</small><b>零工</b></div><div class="reveal-father-link">≠</div><div class="reveal-father-card"><small>另一位“爸爸”</small><b>1,000,000</b></div>`,
    "third-chair": `<div class="reveal-chairs"><i></i><i></i><i class="appears"></i></div>`,
    "labeled-fiction": `<div class="reveal-father-card"><small>文末</small><b>虚构</b></div><div class="reveal-father-link">≠</div><div class="reveal-father-card"><small>正文</small><b>点名</b></div>`,
    "settlement-terms": `<div class="reveal-father-card"><small>文末</small><b>虚构</b></div><div class="reveal-father-link">≠</div><div class="reveal-father-card"><small>和解</small><b>认全文</b></div>`
  }[variant] ?? "";
  return inner ? `<div class="reveal-performance reveal-${escapeHtml(variant)}">${inner}</div>` : "";
}

function sceneEvidencePropsHtml(backdropClass = "", materialKind = "file") {
  const sceneKind = sceneKindForBackdrop(backdropClass);
  return `
    <div class="scene-evidence-props scene-props-${escapeHtml(sceneKind)} props-${escapeHtml(materialKind)}" aria-hidden="true">
      <i></i><i></i><i></i><span></span>
    </div>
  `;
}

function sceneKindForBackdrop(backdropClass = "") {
  const text = String(backdropClass ?? "");
  if (text.includes("credit")) return "credit";
  if (text.includes("tony")) return "salon";
  if (text.includes("profile")) return "profile";
  if (text.includes("work")) return "work";
  return "live";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
