import https from "node:https";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import zlib from "node:zlib";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function cookieHeaders() {
  if (process.env.BILI_COOKIE) return { Cookie: process.env.BILI_COOKIE };
  if (process.env.BILI_SESSDATA) return { Cookie: `SESSDATA=${process.env.BILI_SESSDATA}` };
  return {};
}

export function hasLoginCookie() {
  return Boolean(process.env.BILI_COOKIE || process.env.BILI_SESSDATA);
}

function commonHeaders(extra = {}) {
  return {
    "User-Agent": UA,
    Referer: extra.Referer || "https://www.bilibili.com",
    Origin: "https://www.bilibili.com",
    Accept: extra.Accept || "*/*",
    ...cookieHeaders(),
    ...extra
  };
}

function classifyFailure(httpStatus, text = "", code) {
  const blob = String(text);
  if (blob.includes("风控") || blob.includes("风险") || code === -352 || code === -412) return "risk-controlled";
  if (httpStatus === 412 || httpStatus === 403) return "risk-controlled";
  if (httpStatus && httpStatus >= 400) return "request-failed";
  if (code && code !== 0) return "request-failed";
  return "request-failed";
}

function decodeBody(buffer, encoding = "") {
  const enc = String(encoding).toLowerCase();
  const attempts = [];
  if (enc.includes("gzip")) attempts.push((buf) => zlib.gunzipSync(buf));
  if (enc.includes("br")) attempts.push((buf) => zlib.brotliDecompressSync(buf));
  if (enc.includes("deflate") || !enc) {
    attempts.push((buf) => zlib.inflateRawSync(buf));
    attempts.push((buf) => zlib.inflateSync(buf));
  }
  attempts.push((buf) => buf);
  for (const decode of attempts) {
    try {
      const out = decode(buffer);
      if (out && out.length) return Buffer.isBuffer(out) ? out : Buffer.from(out);
    } catch {
      // try next decoder
    }
  }
  return buffer;
}

export function getRaw(url, params = {}, { headers = {} } = {}) {
  const target = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    target.searchParams.set(key, String(value));
  }
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        method: "GET",
        headers: commonHeaders(headers)
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const raw = Buffer.concat(chunks);
          const decoded = decodeBody(raw, response.headers["content-encoding"]);
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            httpStatus: response.statusCode,
            headers: response.headers,
            text: decoded.toString("utf8"),
            url: target.toString()
          });
        });
      }
    );
    req.on("error", (error) => {
      resolve({
        ok: false,
        httpStatus: 0,
        headers: {},
        text: "",
        url: target.toString(),
        error: error.message
      });
    });
    req.end();
  });
}

export async function getTextResult(url, params = {}, options = {}) {
  await sleep(options.delayMs ?? 700 + Math.floor(Math.random() * 700));
  const raw = await getRaw(url, params, options);
  const reason = raw.ok
    ? null
    : classifyFailure(raw.httpStatus, raw.text) === "risk-controlled" && (raw.text.includes("风控") || raw.httpStatus === 412)
      ? "risk-controlled"
      : raw.error
        ? "request-failed"
        : classifyFailure(raw.httpStatus, raw.text);
  return {
    ok: raw.ok,
    status: raw.ok ? "ok" : reason,
    reason: raw.ok ? null : reason,
    httpStatus: raw.httpStatus,
    text: raw.text,
    url: raw.url,
    attempts: 1
  };
}

export async function getPlainJson(url, params = {}, options = {}) {
  const result = await getTextResult(url, params, options);
  if (!result.ok) return { ...result, data: null };
  try {
    return { ...result, ok: true, status: "ok", data: JSON.parse(result.text) };
  } catch {
    return { ...result, ok: false, status: "request-failed", reason: "request-failed", data: null };
  }
}

export async function getJsonResult(url, params = {}, { retries = 5, headers = {} } = {}) {
  let last = { ok: false, status: "request-failed", reason: "request-failed", attempts: 0, url };
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    await sleep(700 + Math.floor(Math.random() * 700));
    const raw = await getRaw(url, params, {
      headers: {
        Referer: "https://www.bilibili.com",
        Accept: "application/json, text/plain, */*",
        ...headers
      }
    });
    const text = raw.text || "";
    const head = text.slice(0, 200);
    if (!raw.ok || text.startsWith("<") || /风控|风险控制/.test(head)) {
      last = {
        ok: false,
        status: /风控|风险控制/.test(head) || raw.httpStatus === 412 ? "risk-controlled" : "request-failed",
        reason: /风控|风险控制/.test(head) || raw.httpStatus === 412 ? "risk-controlled" : "request-failed",
        httpStatus: raw.httpStatus,
        error: raw.error,
        attempts: attempt,
        url: raw.url
      };
      await sleep(1200 * attempt);
      continue;
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      last = {
        ok: false,
        status: "request-failed",
        reason: "request-failed",
        httpStatus: raw.httpStatus,
        attempts: attempt,
        url: raw.url
      };
      await sleep(1200 * attempt);
      continue;
    }

    if (payload.code === 0) {
      return {
        ok: true,
        status: "ok",
        data: payload.data ?? payload,
        httpStatus: raw.httpStatus,
        attempts: attempt,
        url: raw.url
      };
    }

    const reason = classifyFailure(raw.httpStatus, text, payload.code);
    last = {
      ok: false,
      status: reason,
      reason,
      code: payload.code,
      message: payload.message,
      httpStatus: raw.httpStatus,
      attempts: attempt,
      url: raw.url
    };
    await sleep(1500 * attempt);
  }
  return last;
}

/** 兼容旧调用。失败时返回 null，调用方必须把失败记成 request-failed，不能当成空列表。 */
export async function getJson(url, params = {}, options = {}) {
  const result = await getJsonResult(url, params, options);
  return result.ok ? result.data : null;
}

export async function getText(url, params = {}, options = {}) {
  const result = await getTextResult(url, params, options);
  return result.ok ? result.text : "";
}

export async function appendRequestLog(logPath, entry) {
  if (!logPath) return;
  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`);
}
