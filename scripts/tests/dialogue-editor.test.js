import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, cp, mkdir, readFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadDialogueIndex, lineContext, replaceString, stringSpans, DialogueEditor } from "../lib/dialogue-editor.js";
import { startDialogueEditor } from "../dialogue-editor-server.js";
import { collectCharacterDialogue } from "../build-character-dialogue-report.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), "love-dialogue-editor-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(resolve(root, "content/packs"), { recursive: true });
  await cp(resolve(projectRoot, "content/packs/steam-demo-01"), resolve(root, "content/packs/steam-demo-01"), { recursive: true });
  await cp(resolve(projectRoot, "content/characters"), resolve(root, "content/characters"), { recursive: true });
  return root;
}
const inputFor = (line, after) => ({ id: line.id, revision: line.revision, before: line.text, after,
  reason: "测试候选，不进入真实工程", scope: "本段", issue: "口语润色", exception: "人物有意打官腔时不推广" });

test("字符串回写只改变选定字段，保留重复文本、缩进和特殊字符", () => {
  const raw = '{\r\n "a/b": [ {"~x": "重复\\n文本", "other": "重复\\n文本"} ], "n": -1.2e3, "ok": true }\r\n';
  const after = '他说："嗯"。\n\\下一行😀';
  const changed = replaceString(raw, "/a~1b/0/~0x", "重复\n文本", after);
  assert.equal(changed, raw.replace('"重复\\n文本"', JSON.stringify(after)));
  assert.equal(JSON.parse(changed)["a/b"][0]["~x"], after);
  assert.equal(stringSpans(raw).size, 2);
  assert.throws(() => replaceString(raw, "/n", "-1200", "0"));
});

test("现有报告文本全部定位回真源；问答上下文不混入兄弟选项或其他场景", async () => {
  const index = await loadDialogueIndex(projectRoot);
  assert.ok(index.lines.length > 1000);
  assert.deepEqual(index.unmapped, []);
  assert.deepEqual(index.issues, []);
  assert.equal(new Set(index.lines.map((line) => line.id)).size, index.lines.length);
  const option = index.lines.find((line) => /\/questionOptions\/0\//.test(line.pointer));
  assert.ok(option);
  const context = lineContext(index, option);
  assert.ok(context.lines.every((line) => line.group === option.group));
  assert.ok(!context.lines.some((line) => /\/questionOptions\/1\//.test(line.pointer)));
  const scene = index.lines.find((line) => /\/sceneVersions\/0\/version$/.test(line.pointer));
  assert.ok(scene);
  assert.ok(lineContext(index, scene).lines.every((line) => line.pointer.startsWith("/sceneVersions/0/")));
});

test("保存原句、理由、例外与上下文，并能够逐字节撤回源文件", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const original = await readFile(resolve(root, line.file), "utf8");
  const record = await editor.save(inputFor(line, "你好，我想问件事。"));
  assert.equal(record.status, "applied");
  const content = await readFile(resolve(root, line.file), "utf8");
  assert.equal(content, replaceString(original, line.pointer, line.text, record.after));
  const history = await new DialogueEditor(root).history();
  assert.equal(history[0].exception, "人物有意打官腔时不推广");
  assert.ok(history[0].context.length > 1);
  assert.equal(history[0].review, "pending-semantic-review");
  const undo = await editor.revert(record.id);
  assert.equal(undo.reverts, record.id);
  assert.equal(await readFile(resolve(root, line.file), "utf8"), original);
});

test("只记问题保留候选与原句，不改变源文件", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const original = await readFile(resolve(root, line.file), "utf8");
  const record = await editor.save({ ...inputFor(line, "尚未接受的改法"), action: "note" });
  assert.equal(record.status, "noted");
  assert.equal(await readFile(resolve(root, line.file), "utf8"), original);
});

test("记录无法写入时不修改源台词", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const original = await readFile(resolve(root, line.file), "utf8");
  editor.writeRecord = async () => { throw new Error("模拟记录写入失败"); };
  await assert.rejects(editor.save(inputFor(line, "不应写入的文本")), /模拟记录写入失败/);
  assert.equal(await readFile(resolve(root, line.file), "utf8"), original);
});

test("有意保留记录不改原文、不屏蔽后续提示，也不绕过版本冲突", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const first = (await loadDialogueIndex(root)).lines[0];
  await editor.save(inputFor(first, "本质上，这是发挥团队优势。"));
  const line = (await loadDialogueIndex(root)).lines.find((item) => item.id === first.id);
  const original = await readFile(resolve(root, line.file), "utf8");
  await assert.rejects(editor.save({ ...inputFor(line, line.text), action: "keep", reason: "" }), /保留判断需要说明原因/);
  await assert.rejects(editor.save({ ...inputFor(line, "另一个版本"), action: "keep" }), /保持原句不变/);
  const kept = await editor.save({ ...inputFor(line, line.text), action: "keep", reason: "这里故意装懂，下一句才暴露自己没有干活。" });
  assert.equal(kept.status, "kept");
  assert.equal(kept.review, "preserve-in-context");
  assert.equal(kept.beforeRevision, kept.afterRevision);
  assert.equal(await readFile(resolve(root, line.file), "utf8"), original);
  assert.ok((await loadDialogueIndex(root)).lines.find((item) => item.id === line.id).styleCandidates.length > 0);
  await assert.rejects(editor.revert(kept.id), /没有可撤回/);
  await writeFile(resolve(root, line.file), original + "\n");
  await assert.rejects(editor.save({ ...inputFor(line, line.text), action: "keep" }), /源文件已更新/);
});

test("句式命中只供审读，人物归属错误仍然阻断生成", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  await editor.save(inputFor(line, "一方面我要省钱，另一方面不想花钱。本质上，更重要的是，我现在想知道的是谁买单。"));
  const report = await collectCharacterDialogue({ root, strict: true });
  assert.ok(report.styleWarnings.length >= 4);
  assert.ok(report.styleWarnings.every((warning) => warning.severity === "review"));
  const path = resolve(root, line.file), packet = JSON.parse(await readFile(path, "utf8"));
  packet.openingDialogue[0].speakerProfileId = "missing-profile";
  await writeFile(path, JSON.stringify(packet));
  await assert.rejects(collectCharacterDialogue({ root, strict: true }), /character dialogue attribution failed/);
});

test("旧页面保存及撤回都拒绝覆盖外部改动", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const record = await editor.save(inputFor(line, "你好，我想问件事。"));
  const file = resolve(root, line.file);
  const outside = `${await readFile(file, "utf8")}\n`;
  await writeFile(file, outside);
  await assert.rejects(editor.save(inputFor(line, "过期页面的修改")), /源文件已更新/);
  await assert.rejects(editor.revert(record.id), /源文件已更新/);
  assert.equal(await readFile(file, "utf8"), outside);
});

test("并行旧版本请求只有一个可以写入", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const results = await Promise.allSettled([editor.save(inputFor(line, "第一个版本。")), editor.save(inputFor(line, "第二个版本。"))]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal((await editor.history()).length, 1);
});

test("中断记录能区分写入完成与未写入，不自动重放修改", async (t) => {
  const root = await fixture(t), editor = new DialogueEditor(root);
  const line = (await loadDialogueIndex(root)).lines[0];
  const record = await editor.save(inputFor(line, "你好，我想问件事。"));
  const path = resolve(root, `content/editor/revisions/${record.id}.json`);
  record.status = "prepared";
  await writeFile(path, JSON.stringify(record));
  assert.equal((await editor.history())[0].status, "applied");
  const current = await readFile(resolve(root, line.file), "utf8");
  await writeFile(resolve(root, line.file), replaceString(current, line.pointer, record.after, record.before));
  assert.equal((await editor.history())[0].status, "not-applied");
});

test("源文件符号链接不能指向工程以外", async (t) => {
  const root = await fixture(t);
  const source = "content/packs/steam-demo-01/cases/01-credit.json";
  await rm(resolve(root, source));
  await symlink(resolve(projectRoot, source), resolve(root, source));
  await assert.rejects(loadDialogueIndex(root), /工程内/);
});

test("本地 HTTP 接口拒绝无令牌、跨来源及任意路径写入", async (t) => {
  const root = await fixture(t);
  const { server, origin } = await startDialogueEditor({ root, port: 0 });
  t.after(() => new Promise((done) => { server.closeAllConnections(); server.close(done); }));
  const html = await (await fetch(origin)).text();
  const token = html.match(/name="editor-token" content="([a-f0-9]+)"/)[1];
  assert.equal((await fetch(`${origin}/api/index`)).status, 403);
  assert.equal((await fetch(`${origin}/api/index`, { headers: { "X-Editor-Token": token, Origin: "https://example.com" } })).status, 403);
  const headers = { "X-Editor-Token": token, "Content-Type": "application/json", Origin: origin };
  const data = await (await fetch(`${origin}/api/index`, { headers })).json();
  assert.ok(data.lines.length > 1000);
  const response = await fetch(`${origin}/api/save`, { method: "POST", headers,
    body: JSON.stringify({ id: "../../package.json", after: "坏路径", before: "", revision: "" }) });
  assert.equal(response.status, 400);
  const line = data.lines[0];
  const saved = await fetch(`${origin}/api/save`, { method: "POST", headers,
    body: JSON.stringify({ ...inputFor(line, "待比较的改法"), action: "note" }) });
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).record.status, "noted");
  const calibration = await (await fetch(`${origin}/api/calibration`, { headers })).json();
  assert.equal(calibration.status, "illustrative-not-user-approved");
  assert.ok(calibration.examples.every((example) => example.avoid && example.prefer && example.preserve && example.notApplicable));
  const kept = await fetch(`${origin}/api/save`, { method: "POST", headers,
    body: JSON.stringify({ ...inputFor(line, line.text), action: "keep" }) });
  assert.equal(kept.status, 200);
  const keptResult = await kept.json();
  assert.equal(keptResult.record.status, "kept");
  assert.equal(keptResult.check.status, "idle");
});

test("HTTP 保存自动检查，失败不丢改稿；撤回后可重新通过", { timeout: 20000 }, async (t) => {
  const root = await fixture(t);
  await mkdir(resolve(root, "scripts"));
  const scripts = ["build-content-index.js", "build-readable-script.js", "build-character-dialogue-report.js",
    "build-dialogue-adjacency-report.js", "build-rage-debt-report.js", "check-all.js"];
  for (const script of scripts) await writeFile(resolve(root, "scripts", script), 'setTimeout(() => console.log("fixture check"), 100);');
  await writeFile(resolve(root, "scripts/check-all.js"), 'console.error("fixture semantic anchor failure"); process.exitCode = 1;');
  const { server, origin } = await startDialogueEditor({ root, port: 0 });
  t.after(() => new Promise((done) => { server.closeAllConnections(); server.close(done); }));
  const token = (await (await fetch(origin)).text()).match(/name="editor-token" content="([a-f0-9]+)"/)[1];
  const headers = { "X-Editor-Token": token, "Content-Type": "application/json" };
  const post = (path, body) => fetch(`${origin}/api/${path}`, { method: "POST", headers, body: JSON.stringify(body) });
  const waitForCheck = async () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const check = await (await fetch(`${origin}/api/checks`, { headers })).json();
      if (!["queued", "running"].includes(check.status)) return check;
      await new Promise((done) => setTimeout(done, 25));
    }
    throw new Error("检查未按期完成");
  };
  const line = (await loadDialogueIndex(root)).lines[0];
  const original = await readFile(resolve(root, line.file), "utf8");
  const response = await post("save", inputFor(line, "你好，我想问件事。"));
  assert.equal(response.status, 200);
  const { record } = await response.json();
  assert.equal((await post("save", inputFor(line, "检查期间的修改"))).status, 409);
  const failed = await waitForCheck();
  assert.equal(failed.status, "failed");
  assert.equal(failed.steps.length, 6);
  assert.match(failed.steps.at(-1).output, /fixture semantic anchor failure/);
  assert.equal(await readFile(resolve(root, line.file), "utf8"), replaceString(original, line.pointer, line.text, record.after));
  await writeFile(resolve(root, "scripts/check-all.js"), 'console.log("fixture fixed");');
  const reverted = await post("revert", { id: record.id });
  assert.equal(reverted.status, 200);
  assert.equal((await reverted.json()).record.reverts, record.id);
  assert.equal((await waitForCheck()).status, "passed");
  assert.equal(await readFile(resolve(root, line.file), "utf8"), original);
});
