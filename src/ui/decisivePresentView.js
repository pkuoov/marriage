export function testimonyWallHtml({ scene = {}, wallAct = null, statements = [], comparisonRows = [], wallProgress = {}, presentProgress = {}, presentAvailability = {} } = {}) {
  const wall = wallAct ?? scene.testimonyWall ?? {};
  const presentationSkin = wall.presentationSkin ?? scene.testimonyWall?.presentationSkin ?? "";
  const wallClass = presentationSkin === "voice-matrix" ? " testimony-wall--voice-matrix" : "";
  const present = wall.decisivePresent ?? scene.decisivePresent ?? {};
  const materialCards = present.materialCards ?? [];
  const selectedMaterial = materialCards.find((card) => card.id === wallProgress.softEvidenceId) ?? null;
  const splitAfter = Math.max(1, Math.min(statements.length - 1, Number(wall.splitAfter) || 3));
  const firstGroup = statements.slice(0, splitAfter);
  const secondGroup = statements.slice(splitAfter);
  return `
    <section class="testimony-wall${wallClass}" aria-label="证词墙">
      <header>
        <span>${presentationSkin === "voice-matrix" ? "语音方阵" : "证词墙"} · 第 ${Number(wall.act ?? 1)} 幕 · ${statements.length} 句</span>
        <b>${escapeHtml(wall.title ?? "把她刚才的话逐句摊开")}</b>
        <p>${escapeHtml(wall.intro ?? "先追问任何一句，也可以选一份材料试着放上去。普通试问不会扣耐心。")}</p>
      </header>
      ${Number(wall.act ?? 1) > 1 ? '<div class="testimony-act-status" role="status"><span>她改口了</span><b>第二段说法</b></div>' : ""}
      ${testimonyOpenerHtml(wall.openerLines, scene.speaker)}
      ${testimonyComparisonHtml(comparisonRows)}
      ${climaxReliefHtml(wall.reliefBeat)}
      <div class="testimony-wall-group">
        ${firstGroup.map((statement) => testimonyStatementHtml(statement, wallProgress, selectedMaterial)).join("")}
      </div>
      ${secondGroup.length ? `
        <div class="testimony-host-summary"><span>主播小结</span><p>${escapeHtml(wall.midSummary ?? "前半段先留着。后面的说法要和材料放在一起听。")}</p></div>
        <div class="testimony-wall-group is-second">
          ${secondGroup.map((statement) => testimonyStatementHtml(statement, wallProgress, selectedMaterial)).join("")}
        </div>
      ` : ""}
      ${wall.winkLine ? `
        <aside class="testimony-wink" aria-label="主播对弹幕">
          <span>主播 · 对弹幕</span>
          <p>${escapeHtml(wall.winkLine)}</p>
        </aside>
      ` : ""}
      <footer>
        <button data-testimony-materials type="button">${selectedMaterial ? `更换普通材料 · ${escapeHtml(selectedMaterial.label)}` : "选择材料，普通出示"}</button>
        <button class="decisive-present-launch${presentAvailability.canStart === false ? " is-locked" : ""}" data-decisive-present-start type="button"${presentAvailability.canStart === false ? " disabled aria-disabled=\"true\"" : ""}>
          <span>正式指认</span>
          <b>${escapeHtml(presentAvailability.hint ?? "先选材料，再选原句")}</b>
          <small>仅此处有风险 · 剩余 ${Number(presentProgress.remaining ?? 2)} 次</small>
        </button>
      </footer>
    </section>
  `;
}

export function testimonyMaterialSelectHtml({ scene = {}, wallAct = null, mode = "soft", selectedEvidenceId = "", remaining = 2 } = {}) {
  const hard = mode === "decisive";
  const cards = wallAct?.decisivePresent?.materialCards ?? scene.decisivePresent?.materialCards ?? [];
  return `
    <section class="present-material-select ${hard ? "is-decisive" : "is-soft"}" aria-label="材料卡选择器">
      <header>
        <span>${hard ? "决定性 PRESENT" : "普通出示"}</span>
        <b>${hard ? "先挑一张要压上麦的材料" : "先挑一张材料试问"}</b>
        <p>${hard ? `选完还要指定证词句。材料或句子任一选错都会扣一大格耐心；还剩 ${Number(remaining)} 次。` : "普通出示用于试探证词，不扣耐心，也不会直接完成决定性指认。"}</p>
      </header>
      <div class="present-material-grid">
        ${cards.map((card) => `
          <button class="present-material-card${selectedEvidenceId === card.id ? " selected" : ""}" data-${hard ? "decisive" : "testimony"}-material="${escapeHtml(card.id)}" type="button">
            <span>${escapeHtml(card.kind ?? "材料")}</span>
            <b>${escapeHtml(card.label ?? "未命名材料")}</b>
            <p>${escapeHtml(card.excerpt ?? "")}</p>
            <small>${escapeHtml(card.sourceLabel ?? "后台已收材料")}</small>
          </button>
        `).join("")}
      </div>
      <button class="present-cancel" data-testimony-wall-return type="button">回证词墙</button>
    </section>
  `;
}

export function decisivePresentTargetHtml({ scene = {}, wallAct = null, statements = [], progress = {} } = {}) {
  const cards = wallAct?.decisivePresent?.materialCards ?? scene.decisivePresent?.materialCards ?? [];
  const card = cards.find((item) => item.id === progress.selectedEvidenceId) ?? null;
  return `
    <section class="decisive-present-target" aria-label="选择证词句">
      <header>
        <span>决定性 PRESENT · 第二步</span>
        <b>把「${escapeHtml(card?.label ?? "这份材料")}」出示在哪一句上？</b>
        <p>这一步会正式压上麦。材料和原句必须同时对上。</p>
      </header>
      <div class="decisive-target-material">
        <span>${escapeHtml(card?.kind ?? "材料")}</span>
        <b>${escapeHtml(card?.label ?? "")}</b>
        <p>${escapeHtml(card?.excerpt ?? "")}</p>
      </div>
      <div class="decisive-target-list">
        ${statements.map((statement, index) => `
          <button data-decisive-present-target="${escapeHtml(statement.id)}" type="button">
            <i>${String(index + 1).padStart(2, "0")}</i>
            <span>${escapeHtml(statement.text ?? "")}</span>
          </button>
        `).join("")}
      </div>
      <button class="present-cancel" data-decisive-present-back type="button">重选材料</button>
    </section>
  `;
}

export function decisivePresentHitHtml({ scene = {}, wallAct = null } = {}) {
  const present = wallAct?.decisivePresent ?? scene.decisivePresent ?? {};
  const card = (present.materialCards ?? []).find((item) => item.id === present.evidenceId) ?? {};
  const statement = (wallAct?.statements ?? scene.testimonyWall?.statements ?? []).find((item) => item.id === present.statementId) ?? {};
  return `
    <section class="decisive-present-hit" aria-label="指认命中">
      <div class="present-hit-pair">
        <article><span>材料</span><b>${escapeHtml(card.label ?? "")}</b></article>
        <i aria-hidden="true">×</i>
        <article><span>原句</span><b>“${escapeHtml(statement.text ?? "")}”</b></article>
      </div>
      <div class="present-hit-dialogue">
        <p class="present-hit-caller" data-text-speed-tier="stalled"><b>${escapeHtml(scene.speaker ?? "咨询者")}</b><span>${escapeHtml(present.callerLine ?? "……")}</span></p>
        <p class="present-hit-host" data-text-speed-tier="strained"><b>主播</b><span>${escapeHtml(present.hostLine ?? "这两处得放在一起说。")}</span></p>
      </div>
      <small>${escapeHtml(present.boundaryLine ?? "材料只能推翻这句说法，不能替未知事实补结论。")}</small>
    </section>
  `;
}

function testimonyOpenerHtml(lines = [], callerLabel = "咨询者") {
  if (!Array.isArray(lines) || !lines.length) return "";
  return `
    <div class="testimony-act-opener" aria-label="改口开场">
      ${lines.map((line) => {
        if (line?.role === "pause" || line?.role === "stage") return `<p class="is-stage">${escapeHtml(line.text ?? "……")}</p>`;
        const speaker = line?.role === "host" ? "主播" : callerLabel;
        return `<p class="is-${escapeHtml(line?.role ?? "caller")}"><b>${escapeHtml(speaker)}</b><span>${escapeHtml(line?.text ?? "")}</span></p>`;
      }).join("")}
    </div>
  `;
}

function testimonyComparisonHtml(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return "";
  return `
    <details class="testimony-act-comparison">
      <summary>对照第一段说法</summary>
      <div>
        ${rows.map((row) => `
          <article>
            <span>${escapeHtml(row.status ?? "她收回了")}</span>
            <p>${escapeHtml(row.text ?? "")}</p>
          </article>
        `).join("")}
      </div>
    </details>
  `;
}

function testimonyStatementHtml(statement = {}, progress = {}, selectedMaterial = null) {
  const response = progress.activeResponse?.statementId === statement.id ? progress.activeResponse : null;
  const pressed = (progress.pressedIds ?? []).includes(statement.id);
  return `
    <article class="testimony-statement${pressed ? " is-pressed" : ""}${statement.hidden ? " was-hidden" : ""}">
      <div>
        <i>${escapeHtml(statement.label ?? "证词")}</i>
        <p>${escapeHtml(statement.text ?? "")}</p>
      </div>
      <nav aria-label="证词操作">
        <button data-testimony-press="${escapeHtml(statement.id)}" type="button">PRESS · 追问</button>
        ${selectedMaterial ? `<button data-testimony-present="${escapeHtml(statement.id)}" type="button">PRESENT · 出示在这句</button>` : ""}
      </nav>
      ${response ? `<blockquote class="testimony-response ${response.kind === "present" ? "is-present" : "is-press"}"><span>${response.kind === "present" ? "材料试问" : "追问回应"}</span><p>${escapeHtml(response.text)}</p></blockquote>` : ""}
    </article>
  `;
}

function climaxReliefHtml(beat = null) {
  if (!beat?.comment && !beat?.hostLine) return "";
  return `
    <aside class="climax-relief-beat" aria-label="弹幕泄压">
      ${beat.listenerId ? `<span>${escapeHtml(beat.listenerId)}</span>` : ""}
      ${beat.comment ? `<p>「${escapeHtml(beat.comment)}」</p>` : ""}
      ${beat.hostLine ? `<small>主播：${escapeHtml(beat.hostLine)}</small>` : ""}
    </aside>
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
