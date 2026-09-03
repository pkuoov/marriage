export function cafePrologueHeaderHtml({ timeline = "开播前 · 傍晚", title = "序章", subtitle = "" } = {}) {
  return `
    <header class="cafe-prologue-header">
      <span>${escapeHtml(timeline)}</span>
      <h2>${escapeHtml(title)}</h2>
      ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
    </header>
  `;
}

export function cafePrologueDialogueHtml(lines = []) {
  return `
    <section class="cafe-prologue-dialogue">
      ${(lines ?? []).filter(Boolean).map((line) => {
        const entry = typeof line === "string" ? { speaker: "旁白", type: "narration", text: line } : line;
        const role = cafeDialogueRole(entry);
        return `
          <div class="cafe-prologue-line line-${escapeHtml(entry.type ?? "plain")}" data-dialogue-role="${escapeHtml(role)}" data-speaker-profile-id="${escapeHtml(entry.speakerProfileId ?? "")}">
            ${entry.speaker ? `<b>${escapeHtml(entry.speaker)}</b>` : ""}
            <p>${escapeHtml(entry.text ?? "")}</p>
          </div>
        `;
      }).join("")}
    </section>
  `;
}

export function cafeProloguePortraitStageHtml({ activeRole = "" } = {}) {
  const portraits = [
    {
      role: "host",
      side: "host",
      name: "林旭阳",
      label: "主播",
      artSrc: "./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.28.0"
    },
    {
      role: "advisor",
      side: "host",
      name: "赵律师",
      label: "妻子 · 律师",
      artSrc: "./assets/generated/advisors/zhao-lawyer/zhao-lawyer-serious-pixel.png?v=0.28.0"
    },
    {
      role: "husband",
      side: "party",
      name: "男方",
      label: "提出离婚",
      artSrc: "./assets/generated/quick-detective/caller-zhou-pixel.png?v=0.28.0"
    },
    {
      role: "wife",
      side: "party",
      name: "妻子",
      label: "当事人",
      artSrc: "./assets/generated/quick-detective/caller-zhou-female-pixel.png?v=0.28.0"
    },
    {
      role: "cousin",
      side: "party",
      name: "表哥",
      label: "陪同到场",
      artSrc: "./assets/generated/respondents/pixel-case03/respondent_profile_neutral_pixel.png?v=0.28.0"
    }
  ];
  return `
    <div class="cafe-negotiation-portraits" aria-label="咖啡厅到场人物">
      ${portraits.map((portrait) => `
        <figure class="cafe-negotiation-portrait cafe-side-${portrait.side}${activeRole === portrait.role ? " active" : ""}" data-dialogue-portrait="${portrait.role}">
          <img src="${portrait.artSrc}" alt="" onerror="this.hidden=true;this.closest('figure')?.classList.add('art-missing');" />
          <span class="anonymous-portrait-placeholder" aria-hidden="true"></span>
          <figcaption><small>${portrait.label}</small><b>${portrait.name}</b></figcaption>
        </figure>
      `).join("")}
    </div>
  `;
}

export function cafeMaterialPromptHtml({ evidencePair = [], label = "桌面", usedIds = [] } = {}) {
  const used = new Set(usedIds ?? []);
  const materials = (evidencePair ?? []).filter((item) => item && !used.has(item.id));
  return `
    <aside class="cafe-material-prompt" aria-label="桌上材料：${escapeHtml(materials.map((item) => item.kicker ?? item.title).join("、"))}">
      <span>${escapeHtml(label)}</span>
      <div>${materials.map((item, index) => `
        <button class="cafe-material-preview" data-cafe-material-open="${escapeHtml(item.id)}" type="button">
          <i>${String(index + 1).padStart(2, "0")}</i>
          <small>${escapeHtml(item.kicker ?? "材料")}</small>
          <b>${escapeHtml(item.title ?? "")}</b>
          <em>${escapeHtml(item.detail ?? "")}</em>
          <strong>打开原件</strong>
        </button>
      `).join("")}</div>
    </aside>
  `;
}

export function cafeStatementReplayHtml({ statements = [], selectedId = "", reactionId = "", label = "回放刚才那段" } = {}) {
  const reaction = (statements ?? []).find((statement) => statement.id === reactionId)?.missLine ?? "";
  return `
    <section class="cafe-statement-board" aria-label="刚才听到的几句话">
      <header><span>${escapeHtml(label)}</span></header>
      <div class="cafe-statement-list">
        ${(statements ?? []).map((statement) => `
          <button class="cafe-statement${selectedId === statement.id ? " selected" : ""}" data-cafe-statement-id="${escapeHtml(statement.id)}" type="button" aria-pressed="${selectedId === statement.id}">
            ${escapeHtml(statement.text ?? "")}
          </button>
        `).join("")}
      </div>
      ${reaction ? `<p class="cafe-statement-reaction"><b>妻子</b>${escapeHtml(reaction)}</p>` : ""}
    </section>
  `;
}

export function cafeEvidencePairHtml(cards = [], selectedId = "", statementText = "") {
  return `
    <section class="cafe-evidence-board" aria-label="咖啡厅材料板">
      <header><span>出示给这句话</span><strong>${escapeHtml(statementText)}</strong></header>
      <div class="cafe-evidence-grid">
        ${(cards ?? []).map((card) => `
          <article class="cafe-evidence-choice${selectedId === card.id ? " selected" : ""}">
            <button class="cafe-evidence-card${selectedId === card.id ? " selected" : ""}" data-cafe-evidence-select="${escapeHtml(card.id)}" aria-pressed="${selectedId === card.id}" type="button">
              <small>${escapeHtml(card.kicker ?? "材料")}</small>
              <b>${escapeHtml(card.title ?? "")}</b>
              <span>${escapeHtml(card.detail ?? "")}</span>
              ${(card.rows ?? []).length ? `<div class="cafe-transfer-rows">${card.rows.map((row) => `<span>${escapeHtml(row)}</span>`).join("")}</div>` : ""}
              <em>${selectedId === card.id ? "已选择" : "选择"}</em>
            </button>
            <button class="cafe-evidence-inspect" data-cafe-material-open="${escapeHtml(card.id)}" type="button">查看原件</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function cafeRevisionStatusHtml({ title = "她改口了", note = "第二段说法" } = {}) {
  return `
    <section class="cafe-revision-status" aria-label="${escapeHtml(title)}：${escapeHtml(note)}">
      <i aria-hidden="true"></i><b>${escapeHtml(title)}</b><span>${escapeHtml(note)}</span>
    </section>
  `;
}

export function cafeSingleEvidenceHtml({ evidence = {}, action = "remaining" } = {}) {
  return `
    <section class="cafe-evidence-board cafe-single-evidence" aria-label="桌上剩下的材料">
      <header><span>桌上还剩一张</span></header>
      <button class="cafe-evidence-card selected" data-cafe-present-${escapeHtml(action)} type="button">
        <small>${escapeHtml(evidence.kicker ?? "材料")}</small>
        <b>${escapeHtml(evidence.title ?? "")}</b>
        <span>${escapeHtml(evidence.detail ?? "")}</span>
        <em>出示这份材料</em>
      </button>
    </section>
  `;
}

export function cafeTransferPresentHtml({ evidence = {}, selected = false } = {}) {
  return `
    <section class="cafe-present-board" aria-label="转账流水材料">
      <button class="cafe-present-evidence${selected ? " selected" : ""}" data-cafe-transfer-select type="button" aria-pressed="${selected}">
        <small>${escapeHtml(evidence.kicker ?? "材料")}</small>
        <b>${escapeHtml(evidence.title ?? "转账流水")}</b>
        <p>${escapeHtml(evidence.detail ?? "")}</p>
        ${(evidence.rows ?? []).length ? `<div class="cafe-transfer-rows">${evidence.rows.map((row) => `<span>${escapeHtml(row)}</span>`).join("")}</div>` : ""}
        <em>${selected ? "已选择" : "选择这份流水"}</em>
      </button>
    </section>
  `;
}

export function cafeMaterialDetailModalHtml(cards = []) {
  return `
    <aside class="cafe-material-modal" data-cafe-material-modal hidden aria-hidden="true">
      <button class="cafe-material-modal-backdrop" data-cafe-material-close type="button" aria-label="关闭材料"></button>
      <section class="cafe-material-sheet" role="dialog" aria-modal="true" aria-label="材料原件">
        <header><span>材料原件</span><button data-cafe-material-close type="button">关闭</button></header>
        ${(cards ?? []).filter(Boolean).map((card) => cafeMaterialDocumentHtml(card)).join("")}
      </section>
    </aside>
  `;
}

function cafeMaterialDocumentHtml(card = {}) {
  const kind = card.documentKind ?? (card.id === "chat" ? "chat" : card.id === "hotel" ? "hotel" : "ledger");
  const rows = card.rows ?? [];
  if (kind === "chat") {
    return `
      <article class="cafe-material-document material-chat" data-cafe-material-document="${escapeHtml(card.id)}" hidden>
        <div class="material-chat-top"><b>${escapeHtml(card.title ?? "联系人")}</b><span>聊天记录</span></div>
        <time>21:18</time>
        <p>我到澜桥酒店了</p>
        <small>${escapeHtml(card.detail ?? "")}</small>
      </article>
    `;
  }
  if (kind === "hotel") {
    return `
      <article class="cafe-material-document material-hotel" data-cafe-material-document="${escapeHtml(card.id)}" hidden>
        <header><small>预订记录</small><b>${escapeHtml(card.title ?? "酒店订单")}</b></header>
        <dl><div><dt>入住时间</dt><dd>21:24</dd></div><div><dt>入住人</dt><dd>妻子本人</dd></div><div><dt>房型</dt><dd>大床房 1 间</dd></div></dl>
        <small>${escapeHtml(card.detail ?? "")}</small>
      </article>
    `;
  }
  return `
    <article class="cafe-material-document material-ledger" data-cafe-material-document="${escapeHtml(card.id)}" hidden>
      <header><small>${escapeHtml(card.kicker ?? "银行流水")}</small><b>${escapeHtml(card.title ?? "转账记录")}</b></header>
      <p>${escapeHtml(card.detail ?? "")}</p>
      <div>${rows.map((row) => `<span>${escapeHtml(row)}</span>`).join("")}</div>
    </article>
  `;
}

export function cafeLegalRequestsHtml(legalRequests = {}) {
  const items = legalRequests.items ?? [];
  return `
    <section class="cafe-legal-board" aria-label="赵律师的当场记录">
      <header><span>赵律师的记事本</span></header>
      <div>
        ${items.map((item) => `
          <article class="cafe-legal-request">
            <small>${escapeHtml(item.title ?? "诉求")}</small>
            <b>${escapeHtml(item.uiNote ?? item.nextAction ?? item.request ?? "")}</b>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function cafeDialogueRole(entry = {}) {
  const profileId = entry.speakerProfileId ?? "";
  if (["narrator"].includes(profileId) || ["narration", "stage"].includes(entry.type)) return "stage";
  if (profileId === "host-lin-xuyang" || entry.speaker === "林旭阳") return "host";
  if (profileId === "zhao-lawyer" || ["zhou-accountant", "zhang-forensic"].includes(profileId)) return "advisor";
  if (profileId === "prologue-cafe-husband") return "husband";
  if (profileId === "prologue-cafe-wife") return "wife";
  if (profileId === "prologue-cafe-cousin") return "cousin";
  return "stage";
}

export function cafeInvestigationChoicesHtml(routes = []) {
  return `
    <section class="cafe-investigation-choices">
      <h3>接下来先查什么</h3>
      <div>
        ${(routes ?? []).map((route) => `
          <button class="secondary" data-cafe-investigation="${escapeHtml(route.id)}" type="button">
            <b>${escapeHtml(route.label ?? "继续")}</b>
            <span>${escapeHtml(route.note ?? "")}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

export function cafeAccountBoardHtml(rows = []) {
  return `
    <section class="cafe-account-board">
      <header><span>近一年家庭账户</span><strong>只看路径</strong></header>
      ${(rows ?? []).map((row) => `
        <div class="cafe-account-row${row.focus ? " focus" : ""}">
          <span>${escapeHtml(row.when ?? "")}</span>
          <b>${escapeHtml(row.label ?? "")}</b>
          <em>${escapeHtml(row.status ?? "")}</em>
        </div>
      `).join("")}
    </section>
  `;
}

export function cafeFinalBoundaryHtml({ result = "", openAccount = "", unknown = [] } = {}) {
  return `
    <section class="cafe-final-boundary">
      ${result ? `<div><small>鉴定回告</small><strong>${escapeHtml(result)}</strong></div>` : ""}
      ${openAccount ? `<div><small>家庭流水</small><strong>${escapeHtml(openAccount)}</strong></div>` : ""}
      <p>${(unknown ?? []).map((item) => escapeHtml(item)).join("；")}</p>
    </section>
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
