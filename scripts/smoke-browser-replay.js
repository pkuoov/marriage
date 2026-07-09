import { chromium } from "@playwright/test";
import { access } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const routes = [
  { name: "lab-restaurant", sceneMode: "core", materialMode: "hit", dayScenes: ["day-lab", "day-restaurant"], opener: "timeline-clarity", callerQuestion: "ask-fifty-thousand" },
  { name: "document-r08-r11", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-lab"], documentRows: ["r08", "r11"], opener: "timeline-clarity", callerQuestion: "ask-fifty-thousand" },
  { name: "home-restaurant", sceneMode: "outer", materialMode: "hit", dayScenes: ["day-home", "day-restaurant"], opener: "window-seat-proof", callerQuestion: "dont-answer-for-her" },
  { name: "zero-fallback", sceneMode: "core", materialMode: "miss", dayScenes: [], callerQuestion: "ask-fifty-thousand" },
  { name: "keyboard-lab-restaurant", sceneMode: "core", materialMode: "hit", inputMode: "keyboard", dayScenes: ["day-lab", "day-restaurant"], opener: "timeline-clarity", callerQuestion: "ask-fifty-thousand" },
  { name: "gamepad-home-restaurant", sceneMode: "core", materialMode: "hit", inputMode: "gamepad", dayScenes: ["day-home", "day-restaurant"], opener: "dont-answer-for-her", callerQuestion: "dont-answer-for-her" }
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
    window.__smokeGamepad = {
      connected: false,
      index: 0,
      axes: [0, 0],
      buttons: Array.from({ length: 16 }, () => ({ pressed: false }))
    };
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => window.__smokeGamepad?.connected ? [window.__smokeGamepad] : []
    });
  });
  const page = await context.newPage();
  const browserMessages = [];
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-${route.name}-${Date.now()}&storyKey=steam-demo-01`);
    if (route.inputMode === "gamepad") await connectGamepad(page);
    await activate(page, route, "[data-start-story]");
    if (await page.locator("[data-enter-first-case]").count()) {
      await assertVisibleText(page, "深夜热线。说得出口的归麦,说不出口的归夜。开始接线。", "night shell prologue should render before first case");
      await activate(page, route, "[data-enter-first-case]");
    }
    await activate(page, route, '[data-scene="sceneReview"]');

    for (let beat = 0; beat < 24; beat += 1) {
      if (await page.locator("[data-evidence-check]").count()) break;
      if (await page.locator("[data-enter-day-map]").count()) {
        await assertVisibleText(page, "电话轻轻挂了。没有摔，就是轻轻的。", "overnight route should show the hangup line");
        await activate(page, route, "[data-enter-day-map]");
        await completeOvernightDay(page, route);
        continue;
      }
      if (await page.locator("[data-overnight-opener]").count()) {
        await activate(page, route, `[data-overnight-opener="${route.opener}"]`);
        continue;
      }
      if (await page.locator("[data-enter-overnight-night2]").count()) {
        if (route.dayScenes.length === 0) {
          await assertVisibleText(page, "我想了一晚上，还是得把话说完——你接着问吧。", "zero-location route should use fallback opener");
        }
        if (route.opener === "timeline-clarity") {
          await assertVisibleText(page, "梦里全是 8 号。", "lab route should use timeline opener");
        }
        if (route.opener === "window-seat-proof") {
          await assertVisibleText(page, "提前两周", "restaurant route should use window-seat opener");
        }
        await activate(page, route, "[data-enter-overnight-night2]");
        continue;
      }
      if (await page.locator("[data-document-question]").count()) {
        await activate(page, route, "[data-document-question]");
        continue;
      }
      if (await page.locator("[data-close-document-question]").count()) {
        await activate(page, route, "[data-close-document-question]");
        continue;
      }
      if (await page.locator("[data-stance-snapshot]").count()) {
        await activate(page, route, "[data-stance-snapshot]", 0);
        await activate(page, route, "[data-after-stance-snapshot]");
        continue;
      }
      if (await page.locator("[data-next-scene-stage]").count()) {
        await activate(page, route, "[data-next-scene-stage]");
        continue;
      }
      if (!await page.locator("[data-scene-question]").count() && await page.locator("button[data-scene]").count()) {
        await activate(page, route, "button[data-scene]");
        continue;
      }
      await page.locator(".scene-question-group").waitFor({ state: "visible" });
      if (route.sceneMode === "outer") {
        const dialogueButtons = page.locator("[data-scene-dialogue]");
        if (await dialogueButtons.count() > 0) {
          await activate(page, route, "[data-scene-dialogue]", 0);
          await page.locator(".scene-question-group").waitFor({ state: "visible" });
        }
      }
      const questionIndex = route.sceneMode === "outer" && await page.locator("[data-scene-question]").count() > 1 ? 1 : 0;
      await activate(page, route, "[data-scene-question]", questionIndex);
      await advanceSceneBeat(page, route);
    }

    await page.locator("[data-evidence-check]").first().waitFor({ state: "visible" });
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
    if (route.name === "lab-restaurant") {
      await assertVisibleText(page, "账单我再说一遍", "perfect route should show testimony revision after the material hit");
    }
    if (route.name === "zero-fallback") {
      await assertVisibleText(page, "这卡上像戒了的样子吗？", "material-miss route should show pity line after the first miss");
    }

    await advanceToAccusation(page, route);
    await activate(page, route, "[data-accuse]");
    await completePostAccusation(page, route);
    await page.locator(".recap-score-head").waitFor({ state: "visible" });
    await assertVisibleText(page, "收麦回看", `${route.name} route should reach recap`);
    if (route.name === "lab-restaurant") {
      await exerciseTruthBoundary(page, route);
    }
    await assertNoPageText(page, "undefined", `${route.name} route rendered undefined text`);
    await assertNoPageText(page, "NaN", `${route.name} route rendered NaN text`);
  } catch (error) {
    const text = await page.locator("body").innerText().catch(() => "");
    console.error(`${route.name} route failed.`);
    console.error(text.slice(0, 1200));
    if (browserMessages.length) console.error(browserMessages.join("\n"));
    throw error;
  } finally {
    await context.close();
  }
}

async function completeOvernightDay(page, route) {
  await assertVisibleText(page, "第二天，下午。节目不在线，弹幕不在，城市在。你有一个下午，够去两个地方。", "day map should show the quiet city intro");
  await assertNoPageText(page, "ON AIR", "day map must hide ON AIR");
  await assertNoPageText(page, "听众耐心", "day map must hide patience HUD");
  for (const sceneId of route.dayScenes) {
    await activate(page, route, `[data-day-scene="${sceneId}"]`);
    await assertNoPageText(page, "ON AIR", `${sceneId} must hide ON AIR`);
    await assertNoPageText(page, "听众耐心", `${sceneId} must hide patience HUD`);
    if (sceneId === "day-lab") {
      await assertVisibleText(page, "白瓷灯，一切都有编号。", "lab day scene should render");
      for (let index = 0; index < 4; index += 1) {
        await activate(page, route, "[data-day-timeline-card]", index);
      }
      await activate(page, route, "[data-submit-day-timeline]");
      await assertVisibleText(page, "排对了。你看，先停的是钱，后开的是口。剩下的，你自己去问。", "timeline sort should pay off");
    }
    if (sceneId === "day-restaurant") {
      await assertVisibleText(page, "今天第三拨了", "restaurant scene should render exact service line");
    }
    if (sceneId === "day-home") {
      await assertVisibleText(page, "你不许替她答", "home scene should render exact warning");
      await activate(page, route, "[data-day-followup]");
      await assertVisibleText(page, "因为两年前，有人替观众答过一次。", "home follow-up should render");
    }
    if (sceneId === "day-bank-flow") {
      await assertVisibleText(page, "他的银行流水(她导出的近五个月)", "document day scene should render bank flow");
      for (const rowId of route.documentRows ?? ["r08", "r11"]) {
        await activate(page, route, `[data-document-row="${rowId}"]`);
      }
      await assertVisibleText(page, "五万进,三天后四万九千八出——这算周转吗?", "document route should unlock the r08/r11 cross question");
    }
    await activate(page, route, "[data-complete-day-scene]");
  }
  await assertOvernightState(page, (overnight) => (overnight.dayScenesDone ?? []).length === route.dayScenes.length, "day route should record completed scenes");
  await activate(page, route, "[data-enter-overnight-callback]");
}

async function advanceToAccusation(page, route) {
  for (let step = 0; step < 16; step += 1) {
    if (await page.locator("[data-accuse]").count()) return;
    if (await page.locator("[data-delegation-advisor]").count()) {
      if (route.name === "lab-restaurant") {
        await activate(page, route, '[data-delegation-advisor="zhou-accountant"]');
        await assertVisibleText(page, "转账备注是空的。备注空着的定期转账,做账的都知道:不是不会写,是不能写。钱只认路径,不认说法。", "lab-restaurant route should show the strong delegation return before final quote");
        await activate(page, route, "[data-after-delegation]");
      } else {
        await activate(page, route, "[data-skip-delegation]");
      }
      continue;
    }
    if (await page.locator("[data-evidence-check]").count()) {
      const materialButtons = page.locator("[data-evidence-check]");
      const materialIndex = route.materialMode === "miss" ? 1 : 0;
      await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
      continue;
    }
    if (await page.locator("[data-next-evidence-check]").count()) {
      await activate(page, route, "[data-next-evidence-check]");
      continue;
    }
    if (await page.locator("[data-caller-question]").count()) {
      const third = page.locator('[data-caller-question="dont-answer-for-her"]');
      if (route.dayScenes.includes("day-home")) {
        if (!await third.isEnabled()) throw new Error("home route should unlock the third caller-question option");
      } else if (await third.isEnabled()) {
        throw new Error("third caller-question option should require the home route");
      }
      await activate(page, route, `[data-caller-question="${route.callerQuestion}"]`);
      if (route.callerQuestion === "dont-answer-for-her") {
        await assertVisibleText(page, "第一次有人不替我答。", "home route should show the unlocked process-control answer");
      }
      continue;
    }
    if (await page.locator("[data-after-caller-question]").count()) {
      await activate(page, route, "[data-after-caller-question]");
      continue;
    }
    const next = page.locator("button[data-scene]").first();
    if (!await next.count()) break;
    await activate(page, route, "button[data-scene]");
  }
  await page.locator("[data-accuse]").first().waitFor({ state: "visible" });
}

async function completePostAccusation(page, route) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (await page.locator(".recap-score-head").count()) return;
    if (await page.locator("[data-after-investigation]").count()) {
      await activate(page, route, "[data-after-investigation]");
      await page.waitForTimeout(80);
      continue;
    }
    if (await page.locator("button[data-scene]").count()) {
      await activate(page, route, "button[data-scene]");
      await page.waitForTimeout(80);
      continue;
    }
    if (await page.locator("[data-evidence-check]").count()) {
      await activate(page, route, "[data-evidence-check]");
      await page.waitForTimeout(80);
      continue;
    }
    await page.waitForTimeout(80);
  }
  const controls = await page.evaluate(() => ({
    recap: document.querySelectorAll(".recap-score-head").length,
    afterInvestigation: document.querySelectorAll("[data-after-investigation]").length,
    sceneButtons: document.querySelectorAll("button[data-scene]").length,
    evidenceButtons: document.querySelectorAll("[data-evidence-check]").length,
    buttons: Array.from(document.querySelectorAll("button")).map((button) => button.outerHTML.slice(0, 160))
  }));
  throw new Error(`Post-accusation flow did not reach recap: ${JSON.stringify(controls)}`);
}

async function exerciseTruthBoundary(page, route) {
  let sawOffMicLetter = false;
  for (let step = 0; step < 6; step += 1) {
    if (await page.locator(".truth-boundary-card").count()) break;
    const body = await page.locator("body").innerText().catch(() => "");
    if (body.includes("麦外来信")) {
      sawOffMicLetter = true;
      if (body.includes("灯是我真心买的")) {
        assertTextOrder(body, [
          "收麦后，对方给后台留了一段文字，说不上麦。",
          "失业是真的，账单也是真的。",
          "灯是我真心买的"
        ], "麦外来信 should show respondent note before lurker");
      }
    }
    await activate(page, route, "[data-recap-next]");
  }
  if (!sawOffMicLetter) {
    throw new Error("Recap flow should show 麦外来信 before truth boundary when off-mic letters exist");
  }
  await page.locator(".truth-boundary-card").waitFor({ state: "visible" });
  const promptCount = await page.locator(".truth-boundary-prompt").count();
  if (promptCount < 5) {
    throw new Error(`Truth boundary should use at least five prompts, got ${promptCount}`);
  }
  if (await page.locator("[data-recap-next]").count()) {
    throw new Error("Truth boundary allowed continuing before every prompt was placed");
  }
  for (let index = 0; index < promptCount; index += 1) {
    const prompt = page.locator(".truth-boundary-prompt").nth(index);
    await prompt.locator("[data-truth-boundary-pick]").first().evaluate((element) => element.click());
  }
  await assertNoPageText(page, "这句还不能这么放", "Truth boundary must not reveal correctness on the choice page");
  await page.locator("[data-recap-next]").first().waitFor({ state: "visible" });
  await activate(page, route, "[data-recap-next]");
  await page.locator(".truth-boundary-reveal").waitFor({ state: "visible" });
  await assertVisibleText(page, "归到了", "Truth boundary reveal should show where an early placement landed");
}

async function advanceSceneBeat(page, route) {
  await activate(page, route, "[data-next-scene-stage], button[data-scene]");
}

async function activate(page, route, selector, index = 0) {
  if (route.inputMode === "keyboard") {
    await keyboardActivate(page, selector, index);
    return;
  }
  if (route.inputMode === "gamepad") {
    await gamepadActivate(page, selector, index);
    return;
  }
  await click(page, selector, index);
}

async function click(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await target.evaluate((element) => element.click());
}

async function keyboardActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.matches?.("button"));
  await moveFocusTo(page, selector, index, () => page.keyboard.press("ArrowDown"), "Keyboard");
  await page.keyboard.press("Enter");
}

async function gamepadActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.matches?.("button"));
  await moveFocusTo(page, selector, index, () => gamepadPress(page, 13), "Gamepad");
  await gamepadPress(page, 0);
}

async function connectGamepad(page) {
  await page.evaluate(() => {
    window.__smokeGamepad.connected = true;
  });
  await page.waitForTimeout(180);
}

async function gamepadPress(page, buttonIndex) {
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = true;
  }, buttonIndex);
  await page.waitForTimeout(180);
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = false;
  }, buttonIndex);
  await page.waitForTimeout(180);
}

async function moveFocusTo(page, selector, index = 0, moveNext, label) {
  const targetHandle = await page.locator(selector).nth(index).elementHandle();
  if (!targetHandle) throw new Error(`${label} target missing: ${selector}`);
  const targetIndex = await page.evaluate((target) => {
    const buttons = Array.from(document.querySelectorAll("button:not(:disabled)"))
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    return buttons.indexOf(target);
  }, targetHandle);
  await targetHandle?.dispose();
  if (targetIndex < 0) throw new Error(`${label} target not focusable: ${selector}`);

  for (let step = 0; step < 20; step += 1) {
    const activeIndex = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button:not(:disabled)"))
        .filter((button) => {
          const rect = button.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      return buttons.indexOf(document.activeElement);
    });
    if (activeIndex === targetIndex) return;
    await moveNext();
  }
  throw new Error(`${label} focus did not reach: ${selector}`);
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

async function assertOvernightState(page, predicate, message) {
  const overnight = await page.evaluate(() => {
    const raw = window.localStorage?.getItem("livestream-detective-save-v1");
    const save = raw ? JSON.parse(raw) : {};
    const overnights = save.caseOvernights ?? {};
    return Object.values(overnights)[0] ?? {};
  });
  if (!predicate(overnight)) {
    throw new Error(`${message}: ${JSON.stringify(overnight)}`);
  }
}

function assertTextOrder(body, texts, message) {
  let cursor = -1;
  for (const text of texts) {
    const index = body.indexOf(text);
    if (index <= cursor) throw new Error(message);
    cursor = index;
  }
}
