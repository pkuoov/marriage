import { createReadStream, watch } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { parseByteRange } from "./lib/http-byte-range.js";
import { shouldReloadForChange, createContentReload } from "./lib/dev-reload.js";
import { ensureContentIndex } from "./lib/content-build.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const options = readOptions(process.argv.slice(2));
const clients = new Set();
let reloadTimer = null;
const contentReload = createContentReload({
  build: () => ensureContentIndex(root),
  reload: () => clients.forEach((client) => client.write("event: reload\ndata: changed\n\n")),
  reportError: (error) => {
    console.error(`剧情生成失败，已暂停刷新：${error.message}`);
    clients.forEach((client) => client.write(`event: content-error\ndata: ${JSON.stringify("剧情生成失败，请查看开发服务终端。修复源文件后会自动刷新。当前页面仍是上一次成功版本。")}\n\n`));
  }
});
await ensureContentIndex(root);

const server = createServer((request, response) => {
  void handleRequest(request, response);
});

const port = await listenOnAvailablePort(server, options.port);
const baseUrl = `http://127.0.0.1:${port}`;
const playUrl = options.fresh ? `${baseUrl}/?fresh=1` : `${baseUrl}/`;

console.log(`\n试玩开发服务已启动：${baseUrl}`);
console.log(`普通试玩：${baseUrl}/`);
console.log(`从头试玩：${baseUrl}/?fresh=1`);
console.log("页面源码、JSON 内容、样式或媒体变更后自动刷新；审稿记录和文档不会打断试玩。按 Ctrl+C 停止服务。\n");

startWatcher();
if (options.open) openBrowser(playUrl);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    clients.forEach((client) => client.end());
    server.close(() => process.exit(0));
  });
}

async function handleRequest(request, response) {
  const method = request.method ?? "GET";
  const requestUrl = new URL(request.url ?? "/", "http://localhost");

  if (requestUrl.pathname === "/_dev/events") {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream"
    });
    response.write("retry: 1000\n\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  try { await contentReload.flush(); }
  catch {
    response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" })
      .end("剧情内容生成失败，已暂停提供试玩文件。请查看开发服务终端并修复源文件。");
    return;
  }

  const filePath = resolveRequestPath(requestUrl.pathname);
  if (!filePath) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const file = await stat(filePath);
    if (!file.isFile()) throw new Error("not a file");
    if (filePath === resolve(root, "index.html")) {
      const html = injectReloadClient(await readFile(filePath, "utf8"));
      response.writeHead(200, {
        "Cache-Control": "no-store, max-age=0",
        "Content-Length": Buffer.byteLength(html),
        "Content-Type": "text/html; charset=utf-8"
      });
      response.end(method === "HEAD" ? undefined : html);
      return;
    }
    const headers = {
      "Cache-Control": "no-store, max-age=0",
      "Content-Length": file.size,
      "Accept-Ranges": "bytes",
      "Content-Type": mimeTypeFor(filePath)
    };
    const range = method === "GET" ? parseByteRange(request.headers.range, file.size) : null;
    if (range?.unsatisfiable) {
      response.writeHead(416, { ...headers, "Content-Length": 0, "Content-Range": `bytes */${file.size}` }).end();
      return;
    }
    if (range) {
      response.writeHead(206, { ...headers, "Content-Length": range.end - range.start + 1, "Content-Range": `bytes ${range.start}-${range.end}/${file.size}` });
      createReadStream(filePath, range).pipe(response);
      return;
    }
    response.writeHead(200, headers);
    if (method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}

function injectReloadClient(html) {
  const client = `<script>(function(){const events=new EventSource("/_dev/events");events.addEventListener("reload",function(){location.reload();});events.addEventListener("content-error",function(e){let box=document.getElementById("dev-content-error");if(!box){box=document.createElement("div");box.id="dev-content-error";box.setAttribute("role","alert");box.style="position:fixed;inset:0 0 auto;z-index:99999;background:#721c24;color:white;padding:16px";document.body.append(box);}box.textContent=JSON.parse(e.data);});}());</script>`;
  return html.includes("</body>") ? html.replace("</body>", `${client}</body>`) : `${html}${client}`;
}

function resolveRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const requested = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = resolve(root, normalize(requested));
  return relative(root, filePath).startsWith("..") ? null : filePath;
}

function mimeTypeFor(filePath) {
  return {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".flac": "audio/flac",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff2": "font/woff2"
  }[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

async function listenOnAvailablePort(httpServer, preferredPort) {
  const lastPort = preferredPort + 20;
  for (let port = preferredPort; port <= lastPort; port += 1) {
    try {
      await new Promise((resolveListen, rejectListen) => {
        const onError = (error) => {
          httpServer.off("listening", onListening);
          rejectListen(error);
        };
        const onListening = () => {
          httpServer.off("error", onError);
          resolveListen();
        };
        httpServer.once("error", onError);
        httpServer.once("listening", onListening);
        httpServer.listen(port, "127.0.0.1");
      });
      if (port !== preferredPort) console.log(`端口 ${preferredPort} 正被占用，已自动改用 ${port}。`);
      return port;
    } catch (error) {
      if (error?.code !== "EADDRINUSE") throw error;
    }
  }
  throw new Error(`端口 ${preferredPort}-${lastPort} 均不可用。请用 --port 指定新的起始端口。`);
}

function startWatcher() {
  try {
    watch(root, { recursive: true }, (_event, filename) => {
      if (!shouldReloadForChange(filename)) return;
      contentReload.changed(filename);
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        void contentReload.flush().catch(() => {});
      }, 80);
    });
  } catch (error) {
    console.warn(`自动刷新未启用：${error.message}`);
  }
}

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, { detached: true, stdio: "ignore" });
  child.on("error", () => console.log(`无法自动打开浏览器，请手动访问：${url}`));
  child.unref();
}

function readOptions(args) {
  const portFlag = args.find((arg) => arg.startsWith("--port="));
  const portIndex = args.indexOf("--port");
  const rawPort = portFlag?.split("=")[1] ?? (portIndex >= 0 ? args[portIndex + 1] : "5174");
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`无效端口：${rawPort}`);
  }
  return { port, open: args.includes("--open"), fresh: args.includes("--fresh") };
}
