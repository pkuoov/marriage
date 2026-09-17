import { createHash, randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir, rename, readdir, realpath, rm } from "node:fs/promises";
import { resolve, dirname, relative, sep, isAbsolute } from "node:path";
import { collectCharacterDialogue } from "../build-character-dialogue-report.js";
import { dialogueStyleCandidates } from "./dialogue-style-review.js";

export const digest = (text) => createHash("sha256").update(text).digest("hex");
const pointer = (parts) => parts.map((part) => `/${String(part).replaceAll("~", "~0").replaceAll("/", "~1")}`).join("");
const partsFor = (path) => path.replace(/^\$(case|quick|manifest)\.?/, "").replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
const at = (value, parts) => parts.reduce((node, part) => node?.[part], value);

// Index actual JSON string spans, so one sentence edit preserves all other bytes.
export function stringSpans(source) {
  JSON.parse(source);
  const spans = new Map();
  let index = 0;
  const whitespace = () => { while (/\s/.test(source[index] ?? "") && index < source.length) index++; };
  const string = () => {
    const start = index++;
    while (index < source.length) {
      if (source[index] === "\\") index += 2;
      else if (source[index++] === '"') break;
    }
    return { start, end: index, value: JSON.parse(source.slice(start, index)) };
  };
  function value(parts) {
    whitespace();
    if (source[index] === '"') { spans.set(pointer(parts), string()); return; }
    if (source[index] === "{") {
      index++; whitespace();
      while (source[index] !== "}") {
        const key = string().value;
        whitespace(); index++; value([...parts, key]); whitespace();
        if (source[index] !== ",") break;
        index++; whitespace();
      }
      index++; return;
    }
    if (source[index] === "[") {
      index++; whitespace(); let item = 0;
      while (source[index] !== "]") {
        value([...parts, item++]); whitespace();
        if (source[index] !== ",") break;
        index++; whitespace();
      }
      index++; return;
    }
    while (index < source.length && !/[\s,}\]]/.test(source[index])) index++;
  }
  value([]);
  return spans;
}

export function replaceString(source, path, before, after) {
  const span = stringSpans(source).get(path);
  if (!span || span.value !== before) throw new Error("原句或字段位置已变化，请重新载入后再修改。");
  return source.slice(0, span.start) + JSON.stringify(after) + source.slice(span.end);
}

async function inside(root, path) {
  const resolvedRoot = await realpath(root);
  const resolvedPath = await realpath(resolve(root, path));
  const distance = relative(resolvedRoot, resolvedPath);
  if (distance.startsWith(`..${sep}`) || distance === ".." || isAbsolute(distance)) throw new Error("文件不在当前工程内。");
  return resolvedPath;
}

async function atomicWrite(path, text) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, text, { flag: "wx" }); await rename(temporary, path); }
  finally { await rm(temporary, { force: true }); }
}

function sourceParts(line, packet) {
  let parts = partsFor(line.path);
  const entry = at(packet, parts);
  if (entry && typeof entry === "object") {
    parts = [...parts, typeof entry.text === "string" ? "text" : "line"];
  }
  // The report also presents legacy host/caller fields as synthetic dialogue lines.
  if (typeof at(packet, parts) !== "string") {
    const match = line.path.match(/^\$quick\.confrontations\[(\d+)\]\.lines\[(\d+)\]$/);
    if (match) {
      const confrontation = packet.confrontations[Number(match[1])];
      const fields = ["host", "caller"].filter((key) => confrontation[key]);
      parts = ["confrontations", match[1], fields[Number(match[2])]];
    }
  }
  return parts;
}

function contextParts(parts) {
  const branchNames = new Set(["sceneVersions", "dayScenes", "interludes", "acts", "questionOptions", "dialogueOptions", "casualQuestions", "options", "statements", "confrontations", "turns", "summaryPages"]);
  for (let i = parts.length - 2; i >= 0; i--) {
    if (branchNames.has(parts[i]) && /^\d+$/.test(parts[i + 1])) return parts.slice(0, i + 2);
  }
  // Dialogue array siblings are sequential; option-array siblings are alternatives.
  for (let i = parts.length - 2; i >= 0; i--) if (/^\d+$/.test(parts[i])) return parts.slice(0, i);
  return parts.slice(0, -1);
}

export async function loadDialogueIndex(root, packId = "steam-demo-01") {
  if (!/^[a-z0-9-]+$/.test(packId)) throw new Error("无效内容包。");
  const data = await collectCharacterDialogue({ root, packId, strict: false });
  const base = `content/packs/${packId}`;
  const sources = new Map();
  const definitions = [[`${base}/manifest.json`, data.manifest],
    ...data.casePackets.map((packet) => [`${base}/cases/${packet.caseId}.json`, packet]),
    ...data.quickCasePackets.map((packet) => [`${base}/quick-cases/${packet.id}.json`, packet])];
  for (const [file, packet] of definitions) {
    const raw = await readFile(await inside(root, file), "utf8");
    // Do not join extraction from one revision with the source from another.
    if (JSON.stringify(JSON.parse(raw)) !== JSON.stringify(packet)) throw new Error("读取期间内容有更新，请刷新。");
    sources.set(file, { packet, raw, revision: digest(raw) });
  }
  const entries = new Map();
  const unmapped = [];
  for (const line of data.lines) {
    const file = line.path.startsWith("$manifest") ? `${base}/manifest.json`
      : line.path.startsWith("$quick") ? `${base}/quick-cases/${line.caseId.slice(6)}.json`
        : `${base}/cases/${line.caseId}.json`;
    const source = sources.get(file);
    if (!source) { unmapped.push(line); continue; }
    const parts = sourceParts(line, source.packet);
    const original = at(source.packet, parts);
    if (typeof original !== "string" || original.trim() !== line.text) { unmapped.push(line); continue; }
    const path = pointer(parts);
    const id = digest(`${file}\0${path}`).slice(0, 24);
    if (entries.has(id)) continue;
    const profile = data.profiles.find((item) => item.id === line.profileId);
    const group = contextParts(parts);
    const contracts = [];
    for (let depth = 1; depth < parts.length; depth++) {
      const node = at(source.packet, parts.slice(0, depth));
      for (const key of ["logicContract", "closureContract"]) {
        if (node?.[key]) contracts.push({ path: pointer([...parts.slice(0, depth), key]), value: node[key] });
      }
    }
    entries.set(id, { ...line, id, file, pointer: path, parts, text: original, revision: source.revision,
      speaker: profile?.name ?? line.surface, character: profile ?? {}, group: pointer(group), contracts,
      styleCandidates: dialogueStyleCandidates(original) });
  }
  // Preserve JSON source order within a group, rather than the collector's passes.
  const offsets = new Map([...sources].map(([file, source]) => [file, stringSpans(source.raw)]));
  const lines = [...entries.values()].sort((a, b) => a.file.localeCompare(b.file) ||
    offsets.get(a.file).get(a.pointer).start - offsets.get(b.file).get(b.pointer).start);
  const cases = [...data.casePackets.map((packet) => [packet.caseId, packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId]),
    ["_shell", "序章／幕间／尾声"], ...data.quickCasePackets.map((packet) => [`quick-${packet.id}`, `快案 · ${packet.title}`])];
  return { lines, sources, cases, issues: data.issues, unmapped: unmapped.map(({ caseId, path }) => ({ caseId, path })) };
}

export function lineContext(index, line) {
  const context = index.lines.filter((other) => other.file === line.file && other.group === line.group);
  const selectedIndex = context.findIndex((other) => other.id === line.id);
  return { lines: context.slice(Math.max(0, selectedIndex - 4), selectedIndex + 5), total: context.length,
    label: "按源文件顺序展示同段／同选项文本，可能含替代回答；并非玩家路线回放。" };
}

export class DialogueEditor {
  constructor(root) { this.root = root; this.tail = Promise.resolve(); }
  exclusive(work) {
    const result = this.tail.then(work);
    this.tail = result.catch(() => {});
    return result;
  }
  async history() {
    const directory = resolve(this.root, "content/editor/revisions");
    let files;
    try { files = await readdir(directory); } catch (error) { if (error.code === "ENOENT") return []; throw error; }
    const records = [];
    for (const file of files.filter((name) => /^[a-f0-9-]+\.json$/.test(name))) {
      const record = JSON.parse(await readFile(await inside(this.root, `content/editor/revisions/${file}`), "utf8"));
      if (record.status === "prepared") {
        const current = digest(await readFile(await inside(this.root, record.file), "utf8"));
        record.status = current === record.afterRevision ? "applied" : current === record.beforeRevision ? "not-applied" : "needs-recovery";
      }
      records.push(record);
    }
    return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  save(input) { return this.exclusive(() => this.apply(input)); }
  async apply(input, reverts = null) {
    const { id, revision, before, after, reason = "", issue = "口语润色", scope = "本段", exception = "", action = "apply" } = input;
    if (!["apply", "note", "keep"].includes(action)) throw new Error("未知保存动作。");
    if (typeof after !== "string" || after.length > 12000 || (action === "apply" && !after.trim())) throw new Error("台词不能为空，且不能超过 12000 字。");
    for (const value of [reason, issue, scope, exception]) if (typeof value !== "string" || value.length > 3000) throw new Error("修改说明格式不正确。");
    if (action === "keep" && (!reason.trim() || before !== after)) throw new Error("保留判断需要说明原因，并保持原句不变；已有改稿可先用“只记问题”存下。");
    const index = await loadDialogueIndex(this.root);
    const line = index.lines.find((item) => item.id === id);
    if (!line) throw new Error("台词位置已改变，请刷新后重新选择。");
    if (line.revision !== revision || line.text !== before) throw new Error("源文件已更新，本次未覆盖任何台词。请刷新后比较新版本。");
    if (action === "apply" && before === after) throw new Error("台词没有变化，可使用“只记问题”。");
    const original = index.sources.get(line.file).raw;
    const changed = action === "apply" ? replaceString(original, line.pointer, before, after) : original;
    const record = { id: randomUUID(), createdAt: new Date().toISOString(), status: action === "apply" ? "prepared" : action === "keep" ? "kept" : "noted",
      lineId: id, file: line.file, pointer: line.pointer, caseId: line.caseId, profileId: line.profileId,
      phase: line.phase, character: line.character, contracts: line.contracts,
      beforeRevision: revision, afterRevision: digest(changed), before, after, reason, issue, scope, exception, reverts,
      context: lineContext(index, line).lines.map(({ speaker, text, pointer: path }) => ({ speaker, text, path })),
      review: action === "apply" ? "pending-semantic-review" : action === "keep" ? "preserve-in-context" : "feedback-only" };
    const recordPath = resolve(this.root, `content/editor/revisions/${record.id}.json`);
    await this.writeRecord(recordPath, record);
    if (action === "apply") {
      const sourcePath = await inside(this.root, line.file);
      // Recheck after writing the journal, before replacing source bytes.
      if (digest(await readFile(sourcePath, "utf8")) !== revision) throw new Error("保存过程中源文件被更新，修改未写入；记录可用于重新核对。");
      await atomicWrite(sourcePath, changed);
      record.status = "applied";
      try { await this.writeRecord(recordPath, record); }
      catch { throw new Error("原句已修改，但记录完成标记写入失败。请刷新内容并查看修改记录，不要重复提交。"); }
    }
    return record;
  }
  async writeRecord(path, record) {
    await mkdir(dirname(path), { recursive: true });
    await inside(this.root, relative(this.root, dirname(path)));
    await atomicWrite(path, `${JSON.stringify(record, null, 2)}\n`);
  }
  revert(id) {
    return this.exclusive(async () => {
      const records = await this.history();
      const record = records.find((item) => item.id === id);
      if (!record || record.status !== "applied") throw new Error("这条记录没有可撤回的已应用修改。");
      return this.apply({ id: record.lineId, revision: record.afterRevision, before: record.after, after: record.before,
        reason: `撤回修改：${record.reason || record.id}`, issue: "撤回", scope: record.scope }, record.id);
    });
  }
}
