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

export function cafeMaterialPromptHtml({ evidencePair = [] } = {}) {
  const materials = (evidencePair ?? []).map((item) => item.kicker ?? item.title).filter(Boolean);
  return `
    <aside class="cafe-material-prompt" aria-label="桌上材料：${escapeHtml(materials.join("、"))}">
      <span>桌面</span>
      <div>${materials.map((item, index) => `<b><i>${String(index + 1).padStart(2, "0")}</i>${escapeHtml(item)}</b>`).join("")}</div>
    </aside>
  `;
}

export function cafeStatementReplayHtml({ statements = [], selectedId = "", reactionId = "" } = {}) {
  const reaction = (statements ?? []).find((statement) => statement.id === reactionId)?.missLine ?? "";
  return `
    <section class="cafe-statement-board" aria-label="刚才听到的几句话">
      <header><span>刚才她说过</span></header>
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
      <header><span>压在这句上</span><strong>${escapeHtml(statementText)}</strong></header>
      <div class="cafe-evidence-grid">
        ${(cards ?? []).map((card) => `
          <button class="cafe-evidence-card${selectedId === card.id ? " selected" : ""}" data-cafe-evidence-select="${escapeHtml(card.id)}" aria-pressed="${selectedId === card.id}" type="button">
            <small>${escapeHtml(card.kicker ?? "材料")}</small>
            <b>${escapeHtml(card.title ?? "")}</b>
            <span>${escapeHtml(card.detail ?? "")}</span>
            <em>${selectedId === card.id ? "已拿起" : "拿起"}</em>
          </button>
        `).join("")}
      </div>
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
        <em>压到她改口的那句上</em>
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
        <em>${selected ? "已拿起" : "拿起这张流水"}</em>
      </button>
    </section>
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
