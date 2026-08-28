const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export async function getJson(url, params = {}, { retries = 5 } = {}) {
  const target = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    target.searchParams.set(key, String(value));
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    await sleep(700 + Math.floor(Math.random() * 700));
    const response = await fetch(target, {
      headers: {
        "User-Agent": UA,
        Referer: "https://search.bilibili.com",
        Origin: "https://www.bilibili.com",
        Accept: "application/json, text/plain, */*"
      }
    });
    const text = await response.text();
    if (text.startsWith("<") || text.includes("风控") || text.includes("风险")) {
      await sleep(1200 * attempt);
      continue;
    }
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      await sleep(1200 * attempt);
      continue;
    }
    if (payload.code === 0) return payload.data ?? payload;
    await sleep(1500 * attempt);
  }
  return null;
}
