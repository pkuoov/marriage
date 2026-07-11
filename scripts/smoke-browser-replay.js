import { chromium } from "@playwright/test";
import { access } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const routes = [
  { name: "accounting-restaurant", sceneMode: "core", materialMode: "hit", dayScenes: ["day-accounting", "day-restaurant"], opener: "周会计的时间线", callerQuestion: "ask-fifty-thousand" },
  { name: "document-r08-r11", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r08", "r11"], opener: "周会计的时间线", callerQuestion: "ask-fifty-thousand" },
  { name: "restaurant-document", sceneMode: "outer", materialMode: "hit", dayScenes: ["day-restaurant", "day-bank-flow"], documentRows: ["r08", "r11"], opener: "靠窗位预订记录", callerQuestion: "dont-answer-for-her" },
  { name: "zero-fallback", sceneMode: "core", materialMode: "miss", dayScenes: [], callerQuestion: "ask-fifty-thousand" },
  { name: "keyboard-accounting-restaurant", sceneMode: "core", materialMode: "hit", inputMode: "keyboard", dayScenes: ["day-accounting", "day-restaurant"], opener: "周会计的时间线", callerQuestion: "ask-fifty-thousand" },
  { name: "gamepad-restaurant-document", sceneMode: "core", materialMode: "hit", inputMode: "gamepad", dayScenes: ["day-restaurant", "day-bank-flow"], documentRows: ["r08", "r11"], opener: "靠窗位预订记录", callerQuestion: "dont-answer-for-her" }
];
const smokeTarget = process.env.SMOKE_TARGET ?? "all";

const browser = await launchBrowser();
try {
  if (smokeTarget === "case34") {
    await runCase3DayRoutes();
    await runCase4AdvisorConflict();
  } else {
    for (const route of routes) {
      await runRoute(route);
    }
    await runCase2LinVisit();
    await runCaseTransition();
  }
} finally {
  await browser.close();
}

console.log(smokeTarget === "case34"
  ? "Browser replay smoke passed: case3-zhou, case3-lin, case4-three-advisors"
  : `Browser replay smoke passed: ${[...routes.map((route) => route.name), "case2-lin-visit", "case-transition"].join(", ")}`);

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
    reducedMotion: route.name === "accounting-restaurant" ? "no-preference" : "reduce"
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
      await assertVisibleText(page, "今晚不替任何人下结论，只把没说全的话问清楚。", "night shell prologue should establish the host and show premise");
      await assertNoPageText(page, "试玩已收麦", "night shell prologue must not display the story-pack completion HUD");
      if (await page.locator(".night-shell-line.shell-notice, .night-shell-line.shell-message, .night-shell-line.shell-countdown, .night-shell-line.shell-host").count() !== 4) {
        throw new Error("night shell prologue should distinguish notice, message, countdown, and host opening");
      }
      await activate(page, route, "[data-enter-first-case]");
    }
    if (route.name === "accounting-restaurant") await assertDialoguePresentation(page);
    await activate(page, route, '[data-scene="sceneReview"]');
    const visualStates = new Set();
    const portraitStates = new Set();

    for (let beat = 0; beat < 48; beat += 1) {
      await collectLiveVisualState(page, visualStates, portraitStates);
      if (await page.locator("[data-evidence-check]").count()) break;
      if (await page.locator("[data-enter-day-map]").count()) {
        await assertVisibleText(page, "离台调查", "the second act opening should frame the daytime investigation before the map");
        await activate(page, route, "[data-enter-day-map]");
        await completeOvernightDay(page, route);
        continue;
      }
      if (await page.locator("[data-enter-day-act]").count()) {
        await assertVisibleText(page, "账单、到期日、她要垫多少", "Zhao's post-live call should turn the host's concern into concrete risk disclosure");
        await activate(page, route, "[data-enter-day-act]");
        continue;
      }
      if (await page.locator("[data-enter-post-live]").count()) {
        await assertVisibleText(page, "电话轻轻挂了。没有摔，就是轻轻的。", "overnight route should show the hangup line before the show ends");
        await assertNoPageText(page, "账单、到期日、她要垫多少", "Zhao's private call must not happen while the show is still live");
        await activate(page, route, "[data-enter-post-live]");
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
        if (route.opener === "周会计的时间线") {
          await assertVisibleText(page, "她没猜王**是谁", "accounting route should use timeline opener");
        }
        if (route.opener === "靠窗位预订记录") {
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
      if (await page.locator("[data-open-question-menu]").count()) {
        await activate(page, route, "[data-open-question-menu]");
        await page.locator(".question-menu-card").waitFor({ state: "visible" });
        continue;
      }
      if (await page.locator("[data-return-question-menu]").count()) {
        await activate(page, route, "[data-return-question-menu]");
        await page.locator(".question-menu-card").waitFor({ state: "visible" });
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
          await page.locator("[data-return-question-menu]").waitFor({ state: "visible" });
          await activate(page, route, "[data-return-question-menu]");
          await page.locator(".scene-question-group").waitFor({ state: "visible" });
        }
      }
      const questionIndex = route.sceneMode === "outer" && await page.locator("[data-scene-question]").count() > 1 ? 1 : 0;
      await activate(page, route, "[data-scene-question]", questionIndex);
      await advanceSceneBeat(page, route);
    }

    await page.locator("[data-evidence-check]").first().waitFor({ state: "visible" });
    if (visualStates.size < 2 || portraitStates.size < 2) {
      throw new Error(`${route.name} route should change scene and portrait states while questioning`);
    }
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
    if (route.name === "accounting-restaurant") {
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
    if (route.name === "accounting-restaurant") {
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

async function runCase3DayRoutes() {
  for (const route of [
    {
      name: "case3-zhou",
      choiceId: "chase-flow",
      backdrop: ".day-document",
      sceneText: "旧厂房档案室",
      openerId: "opener-zhou",
      openerText: "二十八万六只在开证明那天",
      inventoryText: "当日余额与单月收入对照"
    },
    {
      name: "case3-lin",
      choiceId: "chase-introducer",
      backdrop: ".day-matchmaking",
      sceneText: "打烊后的婚介门店",
      openerId: "opener-lin",
      openerText: "介绍人给你家报",
      inventoryText: "介绍人给两家的两套话"
    }
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    try {
      await openCaseAtChapter(page, 3, route.name);
      await advanceNightCaseToInterlude(page);
      await click(page, "[data-enter-interlude]");
      await assertVisibleText(page, "第二天下午·只能去一处", "case 3 must present a real one-location trade-off");
      await click(page, '[data-interlude-action="profile-day-route"]');
      await assertNoPageText(page, "ON AIR", "case 3 daytime visit must hide the live HUD");
      if (await page.locator("[data-advisor-conflict]").count() !== 2) throw new Error(`${route.name} should show exactly two daytime destinations`);
      await click(page, `[data-advisor-conflict="${route.choiceId}"]`);
      await page.locator(route.backdrop).waitFor({ state: "visible" });
      await assertVisibleText(page, route.sceneText, `${route.name} should switch to its own location scene`);
      await click(page, "[data-return-interlude]");
      await assertVisibleText(page, "剩余 0/1", "case 3 choice must spend the only daytime action");
      await assertVisibleText(page, route.inventoryText, "case 3 carried material must use a readable label");
      if (await page.locator('[data-interlude-action="profile-closed-zhang"]:not(:disabled)').count()) throw new Error("case 3 must lock the other daytime actions after choosing one place");
      await click(page, "[data-callback-ready]");
      await click(page, `[data-callback-opener="${route.openerId}"]`);
      await assertVisibleText(page, route.openerText, `${route.name} must change the callback opening`);
    } catch (error) {
      console.error(`${route.name} targeted route failed.`);
      console.error((await page.locator("body").innerText().catch(() => "")).slice(0, 1600));
      throw error;
    } finally {
      await context.close();
    }
  }
}

async function runCase4AdvisorConflict() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await openCaseAtChapter(page, 4, "case4-three-advisors");
    await advanceNightCaseToInterlude(page);
    await click(page, "[data-enter-interlude]");
    if (await page.locator("[data-interrupt-choice]").count()) {
      await click(page, "[data-interrupt-choice]");
      await click(page, "[data-return-interlude]");
    }
    await click(page, '[data-interlude-action="zhao-zhou-work"]');
    await assertNoPageText(page, "ON AIR", "case 4 advisor conflict must happen off air");
    await assertVisibleText(page, "赵律师站在控制室门口", "case 4 must stage all three advisors in one scene");
    if (await page.locator("[data-advisor-conflict]").count() !== 3) throw new Error("case 4 must show exactly three advisor frames");
    await assertVisibleText(page, "先采赵律师的边界", "case 4 must show Zhao's frame");
    await assertVisibleText(page, "先采周会计的钱路", "case 4 must show Zhou's frame");
    await assertVisibleText(page, "先采小林老师的身份词", "case 4 must show Lin's frame");
    await click(page, '[data-advisor-conflict="work-frame-lin"]');
    await click(page, "[data-return-interlude]");
    await click(page, '[data-interlude-action="listen-pad"]');
    await assertNoPageText(page, "ON AIR", "case 4 private-chat playback must stay off air");
    await click(page, "[data-complete-interlude-action]");
    await assertVisibleText(page, "小林老师的主责拆词", "case 4 carried material must use a readable label");
    await click(page, "[data-callback-ready]");
    await click(page, '[data-callback-opener="opener-lin-frame"]');
    await assertVisibleText(page, "主责先给你", "case 4 Lin choice must change the callback opening");
  } catch (error) {
    console.error("case4-three-advisors targeted route failed.");
    console.error((await page.locator("body").innerText().catch(() => "")).slice(0, 1600));
    throw error;
  } finally {
    await context.close();
  }
}

async function openCaseAtChapter(page, chapter, name) {
  await page.goto(`${playableUrl}?playtest=browser-smoke-${name}-${Date.now()}&storyKey=steam-demo-01`);
  await click(page, "[data-start-story]");
  await page.evaluate((targetChapter) => {
    const key = "livestream-detective-save-v1";
    const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    save.chapter = targetChapter;
    save.caseBrief = save.caseBriefs?.[targetChapter - 1] ?? null;
    save.screen = "chapter";
    save.scene = "caseOpen";
    save.lastReaction = null;
    save.recapStep = 0;
    window.localStorage.setItem(key, JSON.stringify(save));
  }, chapter);
  await page.reload();
  await click(page, '[data-scene="sceneReview"]');
}

async function advanceNightCaseToInterlude(page) {
  for (let beat = 0; beat < 48; beat += 1) {
    if (await page.locator("[data-enter-interlude]").count()) return;
    if (await page.locator("[data-evidence-check]").count()) {
      await click(page, "[data-evidence-check]");
      continue;
    }
    if (await page.locator("[data-after-scene-evidence]").count()) {
      await click(page, "[data-after-scene-evidence]");
      continue;
    }
    if (await page.locator("[data-stance-snapshot]").count()) {
      await click(page, "[data-stance-snapshot]");
      await click(page, "[data-after-stance-snapshot]");
      continue;
    }
    if (await page.locator("[data-open-question-menu]").count()) {
      await click(page, "[data-open-question-menu]");
      continue;
    }
    if (await page.locator("[data-return-question-menu]").count()) {
      await click(page, "[data-return-question-menu]");
      continue;
    }
    if (await page.locator("[data-next-scene-stage]").count()) {
      await click(page, "[data-next-scene-stage]");
      continue;
    }
    if (!await page.locator("[data-scene-question]").count() && await page.locator("button[data-scene]").count()) {
      await click(page, "button[data-scene]");
      continue;
    }
    await page.locator("[data-scene-question]").first().waitFor({ state: "visible" });
    await click(page, "[data-scene-question]");
    await click(page, "[data-next-scene-stage], button[data-scene]");
  }
  throw new Error("targeted case did not reach interlude");
}

async function runCase2LinVisit() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-case2-lin-${Date.now()}&storyKey=steam-demo-01`);
    await click(page, "[data-start-story]");
    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 2;
      save.caseBrief = save.caseBriefs?.[1] ?? null;
      save.screen = "chapter";
      save.scene = "caseOpen";
      save.lastReaction = null;
      save.recapStep = 0;
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, '[data-scene="sceneReview"]');

    for (let beat = 0; beat < 32; beat += 1) {
      if (await page.locator("[data-enter-interlude]").count()) break;
      if (await page.locator("[data-evidence-check]").count()) {
        await click(page, "[data-evidence-check]");
        continue;
      }
      if (await page.locator("[data-after-scene-evidence]").count()) {
        await click(page, "[data-after-scene-evidence]");
        continue;
      }
      if (await page.locator("[data-stance-snapshot]").count()) {
        await click(page, "[data-stance-snapshot]");
        await click(page, "[data-after-stance-snapshot]");
        continue;
      }
      if (await page.locator("[data-open-question-menu]").count()) {
        await click(page, "[data-open-question-menu]");
        await page.locator(".question-menu-card").waitFor({ state: "visible" });
        continue;
      }
      if (await page.locator("[data-return-question-menu]").count()) {
        await click(page, "[data-return-question-menu]");
        await page.locator(".question-menu-card").waitFor({ state: "visible" });
        continue;
      }
      if (await page.locator("[data-next-scene-stage]").count()) {
        await click(page, "[data-next-scene-stage]");
        continue;
      }
      if (!await page.locator("[data-scene-question]").count() && await page.locator("button[data-scene]").count()) {
        await click(page, "button[data-scene]");
        continue;
      }
      await page.locator("[data-scene-question]").first().waitFor({ state: "visible" });
      await click(page, "[data-scene-question]");
      await click(page, "[data-next-scene-stage], button[data-scene]");
    }

    await page.locator("[data-enter-interlude]").waitFor({ state: "visible" });
    await assertVisibleText(page, "明晚这个点，我回来。", "case 2 should explicitly break overnight");
    await click(page, "[data-enter-interlude]");
    await assertVisibleText(page, "第二天下午·离台调查", "case 2 interlude should move to the next afternoon");
    await click(page, '[data-interlude-action="visit-lin"]');
    await page.locator(".day-matchmaking").waitFor({ state: "visible" });
    await assertNoPageText(page, "ON AIR", "Lin's matchmaking shop must hide the live HUD");
    await assertVisibleText(page, "半亮的招牌还没关", "Lin's matchmaking shop should render its own scene text");
    await click(page, '[data-advisor-conflict="carry-private-column"]');
    await assertVisibleText(page, "不能拿它证明喜欢都是假的", "Lin must preserve the unknown emotional reading");
    await click(page, "[data-return-interlude]");
    await click(page, '[data-interlude-action="listen-dryer"]');
    await click(page, "[data-complete-interlude-action]");
    await click(page, "[data-callback-ready]");
    await click(page, '[data-callback-opener="opener-lin-column"]');
    await assertVisibleText(page, "我去了小林的门店", "the chosen Lin question must change the callback opener");
    await assertVisibleText(page, "他没回答是谁加的", "the caller must answer the carried question without closing motive");
    await click(page, "[data-enter-segment2]");
    await assertVisibleText(page, "他最后回我的原话是", "case 2 second night should continue from the daytime investigation");
  } catch (error) {
    const body = await page.locator("body").innerText().catch(() => "");
    console.error("case2-lin-visit route failed.");
    console.error(body.slice(0, 1600));
    throw error;
  } finally {
    await context.close();
  }
}

async function completeOvernightDay(page, route) {
  await assertVisibleText(page, "下午走访", "day map should start with locations after the second-act opening");
  await assertNoPageText(page, "节目不在线，弹幕不在，城市在。", "day map must not repeat the second-act opening copy");
  await assertNoPageText(page, "ON AIR", "day map must hide ON AIR");
  await assertNoPageText(page, "听众耐心", "day map must hide patience HUD");
  for (const sceneId of route.dayScenes) {
    await activate(page, route, `[data-day-scene="${sceneId}"]`);
    await assertNoPageText(page, "ON AIR", `${sceneId} must hide ON AIR`);
    await assertNoPageText(page, "听众耐心", `${sceneId} must hide patience HUD`);
    if (sceneId === "day-accounting") {
      await assertVisibleText(page, "旧厂房改的档案室", "accounting day scene should render");
      for (let index = 0; index < 4; index += 1) {
        await activate(page, route, "[data-day-timeline-card]", index);
      }
      await activate(page, route, "[data-submit-day-timeline]");
      await assertVisibleText(page, "人是谁我不猜，路径先留着。", "timeline sort should preserve the unknown account owner");
    }
    if (sceneId === "day-restaurant") {
      await assertVisibleText(page, "今天第三拨了", "restaurant scene should render exact service line");
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

async function runCaseTransition() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-case-transition-${Date.now()}&storyKey=steam-demo-01`);
    await click(page, "[data-start-story]");
    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 1;
      save.caseBrief = save.caseBriefs?.[0] ?? null;
      save.screen = "chapter";
      save.scene = "caseClosure";
      save.recapStep = 0;
      save.lastReaction = null;
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await assertVisibleText(page, "案件结案", "first case should enter a dedicated closure page before the next case");
    await assertVisibleText(page, "账单里的八万", "first case closure should carry a case-specific title");
    await assertVisibleText(page, "今晚能确认", "closure should distinguish confirmed facts from a raw evidence pile");
    await assertVisibleText(page, "今晚不替人定", "closure should preserve unresolved facts");
    await click(page, "[data-enter-story-interlude]");
    await assertVisibleText(page, "广告间隙", "closure should move into a short program interlude");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "试玩连线 · 第 02 案", "second case must open on a numbered title card");
    await assertVisibleText(page, "理发店排班表", "second case title card should name the case");
    await assertVisibleText(page, "自己人", "second case title card should frame the central question");
    const titleAnimations = await page.evaluate(() => document.getAnimations()
      .filter((animation) => animation.playState === "running")
      .map((animation) => animation.animationName)
      .filter((name) => Boolean(name) && name !== "focusCurrent"));
    if (titleAnimations.length) {
      throw new Error(`second case title should stay still, found animations: ${titleAnimations.join(", ")}`);
    }
    await click(page, "[data-enter-case-live]");
    await page.locator('[data-scene="sceneReview"]').waitFor({ state: "visible" });
  } finally {
    await context.close();
  }
}

async function advanceToAccusation(page, route) {
  for (let step = 0; step < 16; step += 1) {
    if (await page.locator("[data-accuse]").count()) return;
    if (await page.locator("[data-delegation-advisor]").count()) {
      if (route.name === "accounting-restaurant") {
        await activate(page, route, '[data-delegation-advisor="zhou-accountant"]');
        await assertVisibleText(page, "钱只认路径，不替人起名字。", "accounting route should show the bounded delegation return before final quote");
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
      if (!await third.isEnabled()) throw new Error("Zhao's proactive call should keep the non-directive answer available on every route");
      await activate(page, route, `[data-caller-question="${route.callerQuestion}"]`);
      if (route.callerQuestion === "dont-answer-for-her") {
        await assertVisibleText(page, "说完，我自己选。", "process-control answer should return the choice to the caller");
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
  await drainDialogue(page, route);
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

async function drainDialogue(page, route) {
  for (let line = 0; line < 80; line += 1) {
    const box = page.locator("[data-dialogue-advance]:not([data-dialogue-done]):visible").first();
    if (!await box.count()) return;
    if (route.inputMode === "keyboard") await page.keyboard.press("Enter");
    else if (route.inputMode === "gamepad") await gamepadPress(page, 0);
    else await box.click();
    await page.waitForTimeout(20);
  }
  throw new Error("per-line dialogue did not finish within 80 advances");
}

async function assertDialoguePresentation(page) {
  const box = page.locator("[data-dialogue-advance]");
  await box.waitFor({ state: "visible" });
  const before = await box.locator(".avg-line").textContent();
  await box.click();
  const completed = await box.locator(".avg-line").textContent();
  if ((completed?.length ?? 0) < (before?.length ?? 0)) throw new Error("typing click must complete the current sentence");
  if (!await box.locator(".avg-continue").isVisible()) throw new Error("completed sentence must show continue indicator");
  await page.locator("[data-record-open]").click();
  await page.locator(".court-record:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-record-close]").click();
}

async function click(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await target.evaluate((element) => element.click());
}

async function collectLiveVisualState(page, visualStates, portraitStates) {
  const state = await page.evaluate(() => ({
    scene: document.querySelector(".visual-scene")?.className ?? "",
    portrait: document.querySelector(".case-portrait")?.className ?? ""
  }));
  if (state.scene) visualStates.add(state.scene);
  if (state.portrait) portraitStates.add(state.portrait);
}

async function keyboardActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await page.waitForTimeout(120);
  await target.focus();
  await page.keyboard.press("Enter");
}

async function gamepadActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await page.waitForTimeout(120);
  await target.focus();
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
