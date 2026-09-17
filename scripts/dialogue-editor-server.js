import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DialogueEditor, loadDialogueIndex, lineContext, digest } from "./lib/dialogue-editor.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const uiRoot = resolve(projectRoot, "tools/dialogue-editor");
const publicFiles = new Map([["/", ["index.html", "text/html"]], ["/app.js", ["app.js", "text/javascript"]], ["/style.css", ["style.css", "text/css"]]]);

export async function startDialogueEditor({ root = projectRoot, port = 5186 } = {}) {
  const editor = new DialogueEditor(root);
  const token = randomBytes(32).toString("hex");
  let origin;
  let check = { status: "idle", steps: [] };
  function send(response, status, value) {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    response.end(JSON.stringify(value));
  }
  function startChecks() {
    if (["queued", "running"].includes(check.status)) return check;
    check = { status: "queued", startedAt: new Date().toISOString(), steps: [] };
    const job = check;
    void editor.exclusive(async () => {
      job.status = "running";
      const before = await loadDialogueIndex(root);
      job.revision = digest([...before.sources].map(([file, source]) => `${file}:${source.revision}`).join("\n"));
      const scripts = ["build-content-index.js", "build-readable-script.js", "build-character-dialogue-report.js",
        "build-dialogue-adjacency-report.js", "build-rage-debt-report.js", "check-all.js"];
      for (const script of scripts) {
        const step = { script, status: "running", output: "" };
        job.steps.push(step);
        await new Promise((done) => {
          const child = spawn(process.execPath, [resolve(root, "scripts", script)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
          const capture = (chunk) => { step.output = (step.output + chunk.toString()).slice(-18000); };
          child.stdout.on("data", capture); child.stderr.on("data", capture);
          const timer = setTimeout(() => { step.output += "\n检查超时。"; child.kill(); }, 120000);
          child.on("error", (error) => { step.output += error.message; });
          child.on("close", (code) => { clearTimeout(timer); step.status = code === 0 ? "passed" : "failed"; done(); });
        });
      }
      const after = await loadDialogueIndex(root);
      const revision = digest([...after.sources].map(([file, source]) => `${file}:${source.revision}`).join("\n"));
      job.status = revision !== job.revision ? "stale" : job.steps.every((step) => step.status === "passed") ? "passed" : "failed";
      job.finishedAt = new Date().toISOString();
    }).catch((error) => { job.status = "failed"; job.error = error.message; });
    return job;
  }
  const server = createServer((request, response) => {
    void (async () => {
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
      if (request.headers.host !== new URL(origin).host) return send(response, 403, { error: "仅接受本地审阅页请求。" });
      if (request.headers.origin && request.headers.origin !== origin) return send(response, 403, { error: "请求来源不匹配。" });
      const url = new URL(request.url, origin);
      if (publicFiles.has(url.pathname) && request.method === "GET") {
        const [file, type] = publicFiles.get(url.pathname);
        const content = (await readFile(resolve(uiRoot, file), "utf8")).replace("__EDITOR_TOKEN__", token);
        response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
        response.end(content); return;
      }
      if (request.headers["x-editor-token"] !== token) return send(response, 403, { error: "会话已变化，请刷新审阅页。" });
      if (request.method === "GET" && url.pathname === "/api/index") {
        const index = await loadDialogueIndex(root);
        return send(response, 200, { lines: index.lines.map(({ character, contracts, parts, ...line }) => line),
          cases: index.cases, issues: index.issues, unmapped: index.unmapped, check });
      }
      if (request.method === "GET" && url.pathname === "/api/line") {
        const index = await loadDialogueIndex(root);
        const line = index.lines.find((item) => item.id === url.searchParams.get("id"));
        if (!line) return send(response, 404, { error: "台词位置已变化，请刷新列表。" });
        return send(response, 200, { line, context: lineContext(index, line),
          related: index.lines.filter((other) => other.id !== line.id && other.text === line.text)
            .map(({ id, caseId, speaker, pointer }) => ({ id, caseId, speaker, pointer })) });
      }
      if (request.method === "GET" && url.pathname === "/api/history") return send(response, 200, { records: await editor.history() });
      if (request.method === "GET" && url.pathname === "/api/calibration") {
        const examples = JSON.parse(await readFile(resolve(projectRoot, "content/editor/dialogue-calibration.json"), "utf8"));
        return send(response, 200, examples);
      }
      if (request.method === "GET" && url.pathname === "/api/checks") return send(response, 200, check);
      if (request.method !== "POST") return send(response, 404, { error: "未找到该操作。" });
      if (!request.headers["content-type"]?.startsWith("application/json")) return send(response, 415, { error: "需要 JSON 请求。" });
      let length = 0; const chunks = [];
      for await (const chunk of request) {
        length += chunk.length;
        if (length > 128 * 1024) return send(response, 413, { error: "本次内容过长。" });
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
      if (url.pathname === "/api/save" || url.pathname === "/api/revert") {
        if (["queued", "running"].includes(check.status)) return send(response, 409, { error: "正在同步检查，请稍后保存；当前编辑内容仍保留。" });
        const record = url.pathname === "/api/save" ? await editor.save(body) : await editor.revert(body.id);
        return send(response, 200, { record, check: record.status === "applied" ? startChecks() : check });
      }
      if (url.pathname === "/api/checks") return send(response, 200, startChecks());
      return send(response, 404, { error: "未找到该操作。" });
    })().catch((error) => send(response, 400, { error: error.message }));
  });
  await new Promise((done, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", done); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { server, origin, editor };
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const flag = process.argv.find((arg) => arg.startsWith("--port="));
  const port = Number(flag?.slice(7) ?? 5186);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("端口必须是 1–65535 的整数。");
  const { server, origin } = await startDialogueEditor({ port });
  console.log(`台词审阅页：${origin}\n仅在本机开放。按 Ctrl+C 停止。`);
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
}
