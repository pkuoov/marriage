import { chromium } from "@playwright/test";
import { access } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const routes = [
  { name: "perfect", sceneMode: "core", materialMode: "hit" },
  { name: "outer", sceneMode: "outer-then-core", materialMode: "hit" },
  { name: "material-miss", sceneMode: "core", materialMode: "miss" }
];

const browser = await launchBrowser();
try {
  for (const route of routes) {
    await runRoute(route);
  }
} finally {
  await browser.close();
}

console.log(`Browser replay smoke passed: ${routes.map((route) => route.name).join(", ")}`);

async function launchBrowser() {
  const chromePath = process.env.PLAYWRIGHT_CHROME_EXECUTABLE ?? "";
  if (chromePath && await fileExists(chromePath)) {
    return chromium.launch({ executablePath: chromePath });
  }
  try {
    return await chromium.launch();
  } catch (bundledError) {
    try {
      return await chromium.launch({ channel: process.env.PLAYWRIGHT_CHROME_CHANNEL ?? "chrome" });
    } catch (channelError) {
      channelError.message = `${channelError.message}\nBundled Chromium launch failed first: ${bundledError.message}`;
      throw channelError;
    }
  }
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runRoute(route) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  await context.addInitScript(() => {
    window.localStorage?.clear();
    window.sessionStorage?.clear();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-${route.name}-${Date.now()}&storyKey=steam-demo-01`);
    await click(page, "[data-start-story]");
    await click(page, '[data-scene="sceneReview"]');

    for (let beat = 0; beat < 5; beat += 1) {
      await page.locator(".scene-question-group").waitFor({ state: "visible" });
      if (route.sceneMode === "outer-then-core" && await page.locator("[data-scene-dialogue]").count()) {
        await click(page, "[data-scene-dialogue]");
      }
      await click(page, "[data-scene-question]");
      await advanceSceneBeat(page);
    }

    await page.locator("[data-evidence-check]").first().waitFor({ state: "visible" });
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await materialButtons.nth(Math.min(materialIndex, await materialButtons.count() - 1)).click();

    await advanceToAccusation(page);
    await click(page, "[data-accuse]");
    await completePostAccusation(page);
    await page.locator(".recap-score-head").waitFor({ state: "visible" });
    await assertVisibleText(page, "收麦回看", `${route.name} route should reach recap`);
    await assertNoPageText(page, "undefined", `${route.name} route rendered undefined text`);
    await assertNoPageText(page, "NaN", `${route.name} route rendered NaN text`);
  } catch (error) {
    const text = await page.locator("body").innerText().catch(() => "");
    console.error(`${route.name} route failed.`);
    console.error(text.slice(0, 1200));
    throw error;
  } finally {
    await context.close();
  }
}

async function advanceToAccusation(page) {
  for (let step = 0; step < 4; step += 1) {
    if (await page.locator("[data-accuse]").count()) return;
    const next = page.locator("button[data-scene]").first();
    if (!await next.count()) break;
    await click(page, "button[data-scene]");
  }
  await page.locator("[data-accuse]").first().waitFor({ state: "visible" });
}

async function completePostAccusation(page) {
  for (let step = 0; step < 6; step += 1) {
    if (await page.locator(".recap-score-head").count()) return;
    if (await page.locator("[data-evidence-check]").count()) {
      await click(page, "[data-evidence-check]");
      continue;
    }
    if (await page.locator("[data-after-investigation]").count()) {
      await click(page, "[data-after-investigation]");
      continue;
    }
    await page.waitForTimeout(80);
  }
}

async function advanceSceneBeat(page) {
  await click(page, "[data-next-scene-stage], button[data-scene]");
}

async function click(page, selector) {
  const target = page.locator(selector).first();
  await target.waitFor({ state: "visible" });
  await target.evaluate((element) => element.click());
}

async function assertVisibleText(page, text, message) {
  if (!await page.getByText(text).first().isVisible().catch(() => false)) {
    throw new Error(message);
  }
}

async function assertNoPageText(page, text, message) {
  if ((await page.locator("body").innerText()).includes(text)) {
    throw new Error(message);
  }
}
