export function epilogueUnreadHtml({ messages = [], currentIndex = -1 } = {}) {
  if (!messages.length) return "";
  return `
    <section class="epilogue-unread-card" aria-label="收播后后台未读">
      <header>
        <span>收播后 · 后台未读</span>
        <b>${messages.length} 条已读</b>
      </header>
      <div class="epilogue-unread-list">
        ${messages.map((message, index) => `
          <article class="epilogue-unread-message${index === currentIndex ? " is-latest" : ""}">
            <div class="epilogue-unread-meta">
              <b>${escapeHtml(message.sender ?? "陌生号码")}</b>
              ${message.caseId ? `<span>${escapeHtml(message.caseLabel ?? "回访")}</span>` : `<span>陌生号码</span>`}
            </div>
            ${message.attachment ? attachmentPlaceholderHtml(message.attachment) : ""}
            <p>${escapeHtml(message.text ?? "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function epilogueUnreadContinueHtml({ visibleCount = 0, total = 0 } = {}) {
  if (visibleCount <= 0) return `<button class="primary" data-epilogue-unread-next type="button">打开后台未读</button>`;
  if (visibleCount < total) return `<button class="primary" data-epilogue-unread-next type="button">下一条未读</button>`;
  return `<button class="primary" data-epilogue-unread-next type="button">看后台曲线</button>`;
}

function attachmentPlaceholderHtml(attachment = {}) {
  return `
    <div class="epilogue-attachment-placeholder" role="img" aria-label="${escapeHtml(attachment.alt ?? attachment.label ?? "图片附件")}">
      <span aria-hidden="true">▧</span>
      <b>${escapeHtml(attachment.label ?? "图片附件")}</b>
      <small>图片附件</small>
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
