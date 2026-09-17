const $ = (id) => document.getElementById(id);
const token = document.querySelector('meta[name="editor-token"]').content;
const phaseLabels = { nightA: "第一夜", day: "白天", nightB: "第二夜", ending: "收束", interlude: "幕间", backstage: "后台材料", other: "其他" };
let lines = [], filtered = [], calibration = [], selected = null, base = null, busy = false, checkRunning = false, selectionRequest = 0, visibleLimit = 160;

async function api(path, body) {
  const response = await fetch(`/api/${path}`, { method: body === undefined ? "GET" : "POST",
    headers: { "X-Editor-Token": token, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "操作失败，请重试。");
  return data;
}
function notice(message, error = false) {
  $("notice").textContent = message; $("notice").classList.toggle("error", error);
  if ($("history").open) {
    $("history-notice").textContent = message;
    $("history-notice").classList.toggle("error", error);
  }
}
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function readDraft(id) { try { return JSON.parse(localStorage.getItem(`dialogue-draft:${id}`)); } catch { return null; } }
function clearDraft(id) { try { localStorage.removeItem(`dialogue-draft:${id}`); } catch { /* Browser may disable local storage. */ } }
function stashDraft() {
  if (!selected || !base) return;
  const draft = { before: base.text, revision: base.revision, after: $("after").value,
    reason: $("reason").value, exception: $("exception").value, issue: $("issue").value, scope: $("scope").value };
  if (draft.after === base.text && !draft.reason && !draft.exception) { clearDraft(selected.id); return; }
  try { localStorage.setItem(`dialogue-draft:${selected.id}`, JSON.stringify(draft)); }
  catch { notice("浏览器无法保存草稿，请在离开前保存修改或复制文本。", true); }
}
function renderOptions(id, items, allLabel) {
  const previous = $(id).value;
  $(id).replaceChildren(new Option(allLabel, ""), ...items.map(([value, label]) => new Option(label, value)));
  if (items.some(([value]) => value === previous)) $(id).value = previous;
}
async function refresh(keepDraft = true) {
  if (keepDraft) stashDraft();
  const [data, examples] = await Promise.all([api("index"), api("calibration")]);
  calibration = examples.examples;
  lines = data.lines;
  renderOptions("case", data.cases, "全部案件");
  renderOptions("character", [...new Map(lines.map((line) => [line.profileId, line.speaker]))], "全部角色");
  renderList(); renderCheck(data.check);
  if (data.issues.length || data.unmapped.length) notice(`已加载 ${lines.length} 条；${data.issues.length} 项归属问题、${data.unmapped.length} 条未映射，异常位置未开放编辑。`, true);
  else notice(`已加载 ${lines.length} 条台词与人物材料。输入自动留作本机草稿；保存后才修改工程。`);
  if (selected) await selectLine(selected.id, false);
}
function renderList() {
  const query = $("search").value.trim().toLowerCase();
  filtered = lines.filter((line) => (!$("case").value || line.caseId === $("case").value) &&
    (!$("character").value || line.profileId === $("character").value) && (!$("phase").value || line.phase === $("phase").value) &&
    (!query || `${line.text} ${line.path} ${line.speaker}`.toLowerCase().includes(query)));
  $("count").textContent = `${filtered.length} 条符合筛选${filtered.length > visibleLimit ? ` · 已显示 ${visibleLimit} 条` : ""}`;
  $("lines").replaceChildren(...filtered.slice(0, visibleLimit).map((line) => {
    const button = el("button", undefined, `line-button${selected?.id === line.id ? " active" : ""}`);
    button.append(el("small", `${line.speaker} · ${phaseLabels[line.phase] ?? line.phase}`), el("span", line.text));
    button.addEventListener("click", () => guard(() => selectLine(line.id)));
    return button;
  }));
  if (filtered.length > visibleLimit) {
    const more = el("button", "显示更多台词");
    more.addEventListener("click", () => { visibleLimit += 160; renderList(); });
    $("lines").append(more);
  }
  const currentIndex = filtered.findIndex((line) => line.id === selected?.id);
  $("previous").disabled = currentIndex <= 0;
  $("next").disabled = currentIndex < 0 || currentIndex >= filtered.length - 1;
}
async function selectLine(id, stash = true) {
  if (busy && stash) return;
  if (stash) stashDraft();
  const request = ++selectionRequest;
  const data = await api(`line?id=${encodeURIComponent(id)}`);
  if (request !== selectionRequest) return;
  selected = data.line;
  const draft = readDraft(id);
  base = draft ? { text: draft.before, revision: draft.revision } : { text: selected.text, revision: selected.revision };
  $("empty").hidden = true; $("editor").hidden = false;
  $("location").textContent = selected.caseId;
  $("speaker").textContent = selected.speaker;
  $("phase-label").textContent = phaseLabels[selected.phase] ?? selected.phase;
  $("after").value = draft?.after ?? selected.text;
  $("reason").value = draft?.reason ?? ""; $("exception").value = draft?.exception ?? "";
  $("issue").value = draft?.issue ?? "口语润色"; $("scope").value = draft?.scope ?? "本段";
  $("source").textContent = `${selected.file}\n${selected.pointer}`;
  $("context-note").textContent = `${data.context.label}${data.context.total > data.context.lines.length ? ` 显示当前句附近 ${data.context.lines.length} 条，可从左侧选择其他位置。` : ""}`;
  $("context").replaceChildren(...data.context.lines.map((line) => {
    const node = el("div", undefined, `context-line${line.id === id ? " selected" : ""}`);
    const field = line.parts.includes("defensiveLines") || line.parts.some((part) => /defensive/i.test(part)) ? "防备时的替代回答" : line.parts.at(-1) === "question" ? "追问" : "";
    node.append(el("small", [line.surface || line.speaker, field].filter(Boolean).join(" · ")), el("p", line.text));
    node.title = line.pointer;
    return node;
  }));
  renderReference(); renderDiff(); renderList(); renderCalibration();
  $("style-candidates").replaceChildren(...(selected.styleCandidates ?? []).map((item) => el("p", `审读候选：${item.label}。${item.consider}`)));
  $("related-panel").hidden = !data.related.length;
  $("related").replaceChildren(...data.related.map((other) => {
    const button = el("button", `${other.speaker} · ${other.caseId}`);
    button.title = other.pointer;
    button.addEventListener("click", () => guard(() => selectLine(other.id)));
    return button;
  }));
  $("rebase").hidden = base.revision === selected.revision;
  if (base.revision !== selected.revision) notice("已找回草稿，但源文件有更新。请对照当前上下文；确认后可选择“以当前原句继续修改”。", true);
  updateButtons();
}
function renderReference() {
  const character = selected.character;
  const fields = [["此阶段的说话变化", character.voiceArc?.[selected.phase]], ["受压反应", character.personality?.stressResponse],
    ["人物想保住什么", character.defense], ["人物知识边界（非玩家已知）", character.knowledgeBoundary]];
  const list = el("dl");
  for (const [label, text] of fields) if (text) list.append(el("dt", label), el("dd", text));
  $("character-card").replaceChildren(list);
  $("contracts").replaceChildren(...selected.contracts.map((contract) => {
    const section = el("section"); section.append(el("h3", "本段已有审查约束"));
    const labels = { premiseAnchor: "问话依据", sourceKind: "来源类型", sourceProves: "材料能证明", sourceDoesNotProve: "材料不能证明", answerAnchor: "回答落点", answerAdds: "本次补充", nextLegalQuestion: "下一步可追问", entryAnchor: "入场依据", closerAnchor: "收束依据", adds: "补充事实", openEdge: "仍未确定", routeIndependent: "是否要求各路线均成立" };
    const values = el("dl");
    for (const [key, value] of Object.entries(contract.value)) values.append(el("dt", labels[key] ?? key), el("dd", typeof value === "object" ? JSON.stringify(value) : String(value)));
    section.append(values); return section;
  }));
}
function renderCalibration() {
  const examples = calibration.filter((item) => item.issues.includes($("issue").value));
  $("calibration-examples").replaceChildren(...examples.map((item) => {
    const section = el("section", undefined, "history-record");
    section.append(el("h3", item.title), el("p", item.context), el("small", "会把戏改平的版本"), el("pre", item.avoid),
      el("small", "可保留的表达示范"), el("pre", item.prefer), el("p", item.why), el("p", `保留什么：${item.preserve}`), el("p", `不能推广到：${item.notApplicable}`));
    return section;
  }));
  if (!examples.length) $("calibration-examples").append(el("p", "此类型暂未收录对照。请依据当前上下文判断，先记录具体原因。"));
}
function renderDiff() {
  if (!base) return;
  const before = base.text, after = $("after").value;
  let start = 0, end = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  while (end < before.length - start && end < after.length - start && before[before.length - end - 1] === after[after.length - end - 1]) end++;
  $("diff").replaceChildren(...[["编辑前", before, "del"], ["修改后", after, "ins"]].map(([label, text, tag]) => {
    const card = el("div"); card.append(el("small", label, "muted"));
    const p = el("p"); p.append(document.createTextNode(text.slice(0, start)), el(tag, text.slice(start, text.length - end)), document.createTextNode(end ? text.slice(-end) : ""));
    card.append(p); return card;
  }));
  updateButtons();
}
function updateButtons() {
  $("editor").inert = busy;
  $("lines").inert = busy;
  $("related").inert = busy;
  $("refresh").disabled = busy;
  $("history-toggle").disabled = busy;
  $("save").disabled = busy || checkRunning || !base || base.text === $("after").value || !$("after").value.trim();
  $("note").disabled = busy || checkRunning || !selected;
  $("keep").disabled = busy || checkRunning || !base || base.text !== $("after").value || !$("reason").value.trim();
  $("check").disabled = busy || checkRunning;
}
async function save(action) {
  if (!selected || busy || checkRunning) return;
  stashDraft(); selectionRequest++; busy = true; updateButtons();
  const id = selected.id;
  try {
    const result = await api("save", { id, revision: base.revision, before: base.text, after: $("after").value,
      reason: $("reason").value, issue: $("issue").value, scope: $("scope").value, exception: $("exception").value, action });
    clearDraft(id);
    await refresh(false);
    renderCheck(result.check);
    notice(action === "keep" ? "已记录保留理由，源台词未修改。这是针对当前版本与上下文的判断，不是通用免检规则。" : action === "note" ? "问题已记录，源台词未修改；记录保留了本次候选改法。" : "台词和修改记录已保存，正在同步报告与检查。事实和接话审查仍待复核。");
  } finally { busy = false; updateButtons(); }
}
function renderCheck(job) {
  checkRunning = ["queued", "running"].includes(job.status);
  const labels = { idle: "尚未运行", queued: "等待同步检查…", running: "正在同步报告与检查…", passed: "工程检查通过；不代表语义审查通过", failed: "检查未通过，请展开明细。已保存的台词仍在。", stale: "检查期间源文件有更新，请重跑检查。" };
  $("check-status").textContent = labels[job.status] ?? job.status;
  $("check-details").replaceChildren(...(job.steps ?? []).map((step) => {
    const details = el("details"); details.append(el("summary", `${step.status === "passed" ? "通过" : step.status === "failed" ? "失败" : "运行中"} · ${step.script}`), el("pre", step.output)); return details;
  }));
  if (job.error) $("check-details").append(el("pre", job.error));
  updateButtons();
}
async function showHistory() {
  const { records } = await api("history");
  $("history-notice").textContent = "";
  $("history-list").replaceChildren(...records.map((record) => {
    const section = el("section", undefined, "history-record");
    const states = { applied: "已写入 · 语义待复核", noted: "仅记录问题", kept: "保留原句 · 当前上下文", "not-applied": "保存中断 · 未写入", "needs-recovery": "保存中断 · 需核对" };
    section.append(el("small", `${new Date(record.createdAt).toLocaleString()} · ${record.caseId} · ${states[record.status] ?? record.status}`),
      el("p", `原句：${record.before}`), el("p", `改句：${record.after}`),
      el("p", `${record.issue} / ${record.scope}：${record.reason || "尚未填写理由，先不推广为通用经验。"}`));
    if (record.exception) section.append(el("p", `例外：${record.exception}`));
    if (record.status === "applied") {
      const button = el("button", "撤回这次修改");
      button.disabled = checkRunning;
      button.addEventListener("click", () => guard(async () => {
        stashDraft(); button.disabled = true;
        try { const result = await api("revert", { id: record.id }); await refresh(false); renderCheck(result.check); await showHistory(); notice("已撤回，另存了一条撤回记录；正在重新检查。"); }
        finally { button.disabled = checkRunning; }
      }));
      section.append(button);
    }
    return section;
  }));
  if (!records.length) $("history-list").append(el("p", "还没有修改记录。"));
  if (!$("history").open) $("history").showModal();
}
async function guard(work) { try { await work(); } catch (error) { notice(error.message, true); } }
for (const id of ["search", "case", "character", "phase"]) $(id).addEventListener("input", () => { visibleLimit = 160; renderList(); });
for (const [id, delta] of [["previous", -1], ["next", 1]]) $(id).addEventListener("click", () => guard(async () => {
  const target = filtered[filtered.findIndex((line) => line.id === selected?.id) + delta];
  if (target) await selectLine(target.id);
}));
for (const id of ["after", "reason", "exception", "issue", "scope"]) $(id).addEventListener("input", () => { stashDraft(); renderDiff(); if (id === "issue") renderCalibration(); });
$("refresh").addEventListener("click", () => guard(() => refresh()));
$("save").addEventListener("click", () => guard(() => save("apply")));
$("note").addEventListener("click", () => guard(() => save("note")));
$("keep").addEventListener("click", () => guard(() => save("keep")));
$("reset").addEventListener("click", () => guard(async () => { if (!selected) return; clearDraft(selected.id); await selectLine(selected.id, false); notice("已恢复当前源台词；尚未保存的编辑已清除。"); }));
$("rebase").addEventListener("click", () => { base = { text: selected.text, revision: selected.revision }; $("rebase").hidden = true; stashDraft(); renderDiff(); notice("已用当前源句作为修改起点，请核对差异后保存。"); });
$("check").addEventListener("click", () => guard(async () => renderCheck(await api("checks", {}))));
$("history-toggle").addEventListener("click", () => guard(showHistory));
$("history-close").addEventListener("click", () => $("history").close());
window.addEventListener("pagehide", stashDraft);
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !$("save").disabled) { event.preventDefault(); void guard(() => save("apply")); } });
setInterval(() => { if (checkRunning) void guard(async () => renderCheck(await api("checks"))); }, 1500);
await guard(() => refresh());
