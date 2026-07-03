export function liveControlDeckHtml({
  onAirLabel = "匿名热线",
  label = "连线中",
  segment = 1,
  total = 1,
  pressure = {},
  material = "通话摘录"
} = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const safeSegment = Math.max(1, Math.min(safeTotal, Number(segment ?? 1)));
  const materialKind = materialKindForLabel(material);
  const hostState = hostMonitorStateForPressure(pressure);
  return `
    <aside class="control-deck" aria-label="直播控场台">
      <section class="deck-card deck-card-live">
        <span><i></i>ON AIR</span>
        <b>${escapeHtml(onAirLabel)}</b>
        <small>${escapeHtml(label || "连线中")}</small>
        <div class="deck-host-monitor host-${escapeHtml(hostState.kind)}" aria-hidden="true">
          <i></i>
          <b>${escapeHtml(hostState.label)}</b>
          <em><i></i><i></i><i></i><i></i></em>
        </div>
        <div class="deck-live-metrics" aria-hidden="true">
          <i>LIVE 01:24:55</i>
          <i>${viewerCountForPressure(pressure)}</i>
        </div>
        <div class="deck-monitor-strip" aria-hidden="true">
          <i>MIC</i>
          <i>REC</i>
          <i>LINE</i>
        </div>
      </section>
      <section class="deck-card">
        <span>连线句子</span>
        <b>${safeSegment}/${safeTotal}</b>
        <small>麦没断，话还在往下走。</small>
      </section>
      <section class="deck-card deck-card-pressure">
        <span>听众耐心</span>
        <b>${Number(pressure.remaining ?? 0)}/${Number(pressure.max ?? 0)}</b>
        <small>${escapeHtml(pressure.patienceLabel ?? "")}</small>
      </section>
      <section class="deck-card deck-card-material">
        <span>后台材料</span>
        <div class="deck-material-preview material-${escapeHtml(materialKind)}" aria-hidden="true">
          <i>${escapeHtml(materialGlyph(materialKind))}</i>
          <em></em>
        </div>
        <b>${escapeHtml(material)}</b>
        <small>先放在台面边上。</small>
      </section>
    </aside>
  `;
}

function hostMonitorStateForPressure(pressure = {}) {
  const level = pressure.level ?? "high";
  const crowd = pressure.crowd ?? "";
  if (level === "low" || crowd === "散了") return { kind: "pressed", label: "压麦" };
  if (crowd === "跑偏") return { kind: "thinking", label: "拉回" };
  if (crowd === "压住" || crowd === "追上") return { kind: "held", label: "收住" };
  return { kind: "idle", label: "听线" };
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
  productName = "直播间大侦探",
  modeLabel = "试玩连线",
  soundEnabled = true,
  backdropClass = "backdrop-live",
  label = "",
  chapter = "",
  text = "",
  reactionHtml = "",
  choices = "",
  visualHud = "",
  controlDeckHtml = "",
  material = ""
} = {}) {
  const materialKind = materialKindForLabel(material);
  return `
    <main>
      <header class="topbar">
        <button data-action="title" type="button" aria-label="回到标题页">${escapeHtml(productName)}</button>
        <nav aria-label="章节"><span class="active"><i></i>${escapeHtml(modeLabel)}</span></nav>
        <button data-action="sound" type="button">音效 ${soundEnabled ? "开" : "关"}</button>
        <button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>
      </header>
      <section class="story-grid case-vn-grid live-console-shell">
        ${controlDeckHtml}
        <article class="vn-stage">
          <div class="visual-scene backdrop-office ${escapeHtml(backdropClass)}" aria-hidden="true">
            <div class="scene-label">${escapeHtml(label)}</div>
            ${sceneEvidencePropsHtml(backdropClass, materialKind)}
            ${visualHud}
          </div>
          <div class="dialogue-card" aria-live="polite">
            <p class="eyebrow">${escapeHtml(chapter)}</p>
            ${text}
            ${reactionHtml}
            <div class="choices">${choices}</div>
          </div>
        </article>
      </section>
    </main>
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
