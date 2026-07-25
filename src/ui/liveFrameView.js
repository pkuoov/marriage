import { audioSettingsPanelHtml } from "./audioSettingsView.js";

export function liveControlDeckHtml({
  onAirLabel = "匿名热线",
  label = "连线中",
  segment = 1,
  total = 1,
  pressure = {},
  material = "",
  materialCount = 1
} = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const safeSegment = Math.max(1, Math.min(safeTotal, Number(segment ?? 1)));
  const pressureRemaining = Number(pressure.remaining ?? 0);
  const pressureMax = Number(pressure.max ?? 0);
  const showPatienceHint = safeSegment === 1 && pressureMax > 0 && pressureRemaining === pressureMax;
  const materialKind = materialKindForLabel(material);
  const hasMaterial = Boolean(material && Number(materialCount) > 0);
  const hostState = hostMonitorStateForPressure(pressure);
  return `
    <aside class="control-deck" aria-label="直播控场台">
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
          <i>MIC</i>
          <i>REC</i>
          <i>LINE</i>
        </div>
      </section>
      <section class="deck-card">
        <span>通话进度</span>
        <b>${safeSegment}/${safeTotal}</b>
        <small>当前第 ${safeSegment} 段，共 ${safeTotal} 段。</small>
      </section>
      <section class="deck-card deck-card-pressure">
        <span>听众耐心</span>
        <b>${pressureRemaining}/${pressureMax}</b>
        <small>${escapeHtml(pressure.patienceLabel ?? "")}</small>
        ${showPatienceHint ? `<small class="deck-patience-hint">绕问、误指会掉耐心；归零要重听本段。</small>` : ""}
      </section>
      <section class="deck-card deck-card-material">
        <span>后台材料</span>
        ${hasMaterial ? `
          <div class="deck-material-preview material-${escapeHtml(materialKind)}" aria-hidden="true">
            <i>${escapeHtml(materialGlyph(materialKind))}</i>
            <em></em>
          </div>
          <b>${escapeHtml(material)}</b>
          <small>已收到 ${Number(materialCount)} 份。</small>
        ` : `
          <div class="deck-material-preview material-empty" aria-hidden="true">
            <i>—</i>
            <em></em>
          </div>
          <b>尚未收到</b>
          <small>来电人发来后会出现在这里。</small>
        `}
      </section>
    </aside>
  `;
}

function hostMonitorStateForPressure(pressure = {}) {
  const level = pressure.level ?? "high";
  const crowd = pressure.crowd ?? "";
  if (level === "low" || crowd === "散了") return { kind: "pressed", label: "压麦" };
  if (crowd === "跑偏") return { kind: "thinking", label: "拉回" };
  if (crowd === "稳住" || crowd === "追上") return { kind: "held", label: "收住" };
  return { kind: "idle", label: "监听中" };
}

function viewerCountForPressure(pressure = {}) {
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
  screenEffect = "",
  screenClass = "",
  pixelTransition = null
} = {}) {
  const materialKind = materialKindForLabel(material);
  const choiceMarkup = String(choices ?? "");
  const hasChoices = Boolean(choiceMarkup.trim());
  const choicesAreFlow = hasChoices && choiceMarkup.includes("flow-group");
  const choiceLayer = hasChoices
    ? `<div class="choices avg-choice-overlay ${choicesAreFlow ? "inline-choice-flow" : "modal-choice-flow"}">${choiceMarkup}</div>`
    : "";
  return `
    <main>
      ${pixelTransitionHtml(pixelTransition)}
      <header class="topbar">
        <button data-action="title" type="button" aria-label="回到标题页">${escapeHtml(productName)}</button>
        <nav aria-label="章节"><span class="active"><i></i>${escapeHtml(modeLabel)}</span></nav>
        ${audioSettingsPanelHtml(audioSettings ?? { enabled: soundEnabled }, { placement: "topbar" })}
        <button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>
        <button class="record-button" data-record-open type="button">案卷</button>
      </header>
      <section class="story-grid case-vn-grid live-console-shell ${controlDeckHtml ? "has-control-deck" : ""} ${escapeHtml(screenClass)}" data-live-shell>
        ${screenEffect ? `<div class="screen-effect screen-effect-${escapeHtml(screenEffect)}" aria-hidden="true"></div>` : ""}
        ${controlDeckHtml}
        <article class="vn-stage">
          <div class="visual-scene backdrop-office ${escapeHtml(backdropClass)}" aria-hidden="true">
            <div class="scene-label">${escapeHtml(label)}</div>
            ${sceneEvidencePropsHtml(backdropClass, materialKind)}
            ${visualHud}
          </div>
          <div class="dialogue-card" aria-live="polite">
            <div class="dialogue-toolbar">
              <p class="eyebrow">${escapeHtml(chapter)}</p>
              ${material ? `<button class="avg-material-card" data-material-card data-material-open aria-controls="avg-material-modal" aria-expanded="false" aria-haspopup="dialog" aria-label="打开材料板：${escapeHtml(material)}" type="button"><small>材料</small><b>${Math.max(1, Number(materialCount) || 1)}</b></button>` : ""}
            </div>
            ${text}
            ${reactionHtml}
          </div>
          ${choicesAreFlow ? choiceLayer : ""}
        </article>
        ${choicesAreFlow ? "" : choiceLayer}
        ${material ? materialModalHtml(material, materialKind) : ""}
      </section>
    </main>
  `;
}

export function pixelTransitionHtml(transition = null) {
  if (!transition?.label) return "";
  const kind = ["scene", "soft-fade", "signal-connect", "signal-disconnect"].includes(transition.kind) ? transition.kind : "scene";
  const signalClass = kind.startsWith("signal-") ? " pixel-transition-signal" : "";
  return `
    <div class="pixel-transition pixel-transition-${kind}${signalClass}" data-transition-kind="${kind}" aria-hidden="true">
      <div class="pixel-transition-grid"></div>
      <p><small>${escapeHtml(transition.eyebrow ?? "SCENE SHIFT")}</small><b>${escapeHtml(transition.label)}</b></p>
    </div>
  `;
}

function materialModalHtml(material = "", materialKind = "file") {
  return `
    <aside class="avg-material-modal" id="avg-material-modal" data-material-modal hidden>
      <button class="avg-material-backdrop" data-material-close aria-label="关闭材料板" type="button"></button>
      <section class="avg-material-panel" role="dialog" aria-modal="true" aria-labelledby="avg-material-title">
        <header>
          <span>后台材料</span>
          <button data-material-close type="button">关闭</button>
        </header>
        <div class="avg-material-sheet material-${escapeHtml(materialKind)}">
          <small id="avg-material-title">当前材料</small>
          <i aria-hidden="true">${escapeHtml(materialGlyph(materialKind))}</i>
          <b>${escapeHtml(material)}</b>
          <em>材料文字由案卷记录，图面只标纸张与圈点位置。</em>
        </div>
      </section>
    </aside>
  `;
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
