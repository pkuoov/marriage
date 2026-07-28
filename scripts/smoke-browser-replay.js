import { chromium } from "@playwright/test";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const storyManifest = JSON.parse(await readFile(resolve(root, "content", "packs", "steam-demo-01", "manifest.json"), "utf8"));
const transitionQuoteByCaseId = Object.fromEntries(
  (storyManifest.nightShell?.interludes ?? [])
    .filter((interlude) => interlude.transitionQuote)
    .map((interlude) => [interlude.afterCaseId, interlude.transitionQuote])
);
const routes = [
  { name: "accounting-restaurant", sceneMode: "core", materialMode: "hit", dayScenes: ["day-accounting", "day-restaurant"], dayChoices: { "day-restaurant": "chase-rotation" }, dayChoiceText: { "day-restaurant": "位置难订是真的" }, opener: "常客的轮订规律", openerText: "他只说提前订了", callerQuestion: "not-your-debt", callerQuestionHost: "soothe" },
  { name: "document-r08-r11", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r08", "r11"], opener: "周会计的时间线", openerText: "六月 8 号那笔没来", callerQuestion: "ask-fifty-thousand" },
  { name: "document-trust-rows", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r13", "r14", "r15"], opener: "流水圈注", openerText: "这二十万，他以前跟你提过吗", callerQuestion: "dont-answer-for-her" },
  { name: "restaurant-document", sceneMode: "outer", materialMode: "hit", dayScenes: ["day-restaurant", "day-bank-flow"], dayChoices: { "day-restaurant": "chase-member" }, dayChoiceText: { "day-restaurant": "不能替客人作证" }, documentRows: ["r08", "r11"], opener: "餐厅拒绝核对", openerText: "那晚的座是你订的", callerQuestion: "dont-answer-for-her" },
  { name: "material-miss-accounting-restaurant", sceneMode: "core", materialMode: "miss", dayScenes: ["day-accounting", "day-restaurant"], dayChoices: { "day-restaurant": "chase-member" }, opener: "周会计的时间线", openerText: "六月 8 号那笔没来", callerQuestion: "ask-fifty-thousand" },
  { name: "keyboard-accounting-restaurant", sceneMode: "core", materialMode: "hit", inputMode: "keyboard", dayScenes: ["day-accounting", "day-restaurant"], dayChoices: { "day-restaurant": "chase-member" }, opener: "周会计的时间线", openerText: "六月 8 号那笔没来", callerQuestion: "ask-fifty-thousand" },
  { name: "gamepad-restaurant-document", sceneMode: "core", materialMode: "hit", inputMode: "gamepad", dayScenes: ["day-restaurant", "day-bank-flow"], dayChoices: { "day-restaurant": "chase-member" }, documentRows: ["r08", "r11"], opener: "餐厅拒绝核对", openerText: "那晚的座是你订的", callerQuestion: "dont-answer-for-her" }
];
const smokeTarget = process.env.SMOKE_TARGET ?? "all";

const browser = await launchBrowser();
try {
  if (smokeTarget === "case34") {
    await runCase3DayRoutes();
    await runCase4AdvisorConflict();
  } else if (smokeTarget === "gamepad") {
    await runRoute(routes.find((route) => route.inputMode === "gamepad"));
  } else if (smokeTarget === "case2-transition") {
    await runCase2DayMap();
    await runCaseTransition();
  } else if (smokeTarget === "portrait-viewports") {
    await runPortraitViewports();
  } else if (smokeTarget === "state-replacement") {
    await runStateReplacementRoutes();
  } else {
    for (const route of routes) {
      await runRoute(route);
    }
    await runCase2DayMap();
    await runCase3DayRoutes();
    await runCase4AdvisorConflict();
    await runCaseTransition();
    await runPortraitViewports();
    await runStateReplacementRoutes();
  }
} finally {
  await browser.close();
}

console.log(smokeTarget === "case34"
  ? "Browser replay smoke passed: case3-day-map, case4-day-map"
  : smokeTarget === "gamepad"
    ? "Browser replay smoke passed: gamepad-restaurant-document"
    : smokeTarget === "case2-transition"
      ? "Browser replay smoke passed: case2-day-map, case-transition"
      : smokeTarget === "portrait-viewports"
        ? "Browser replay smoke passed: portrait layouts at 390x844, 1366x768, 1280x800"
        : smokeTarget === "state-replacement"
          ? "Browser replay smoke passed: new-game-reset, patience-retry"
    : `Browser replay smoke passed: ${[...routes.map((route) => route.name), "case2-day-map", "case3-day-map", "case4-day-map", "case-transition", "new-game-reset", "patience-retry"].join(", ")}`);

async function assertAudioSettings(page) {
  await page.locator("[data-audio-settings] > summary").click();
  if (await page.locator("[data-audio-volume]").count() !== 5) {
    throw new Error("audio settings should expose master, BGM, ambience, SFX, and voice buses");
  }
  await page.locator('[data-audio-volume="master"]').evaluate((input) => {
    input.value = "0.4";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForFunction(() => {
    const stored = JSON.parse(localStorage.getItem("livestream-detective-audio-settings-v1") || "{}");
    return stored.master === 0.4 && stored.voice === 1;
  });
  await page.locator("[data-audio-mute]").click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("livestream-detective-audio-settings-v1") || "{}").enabled === false);
  await page.locator("[data-audio-settings] > summary").click();
  await page.locator("[data-audio-mute]").click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("livestream-detective-audio-settings-v1") || "{}").enabled === true);
}

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

async function runStateReplacementRoutes() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-state-replacement-${Date.now()}&storyKey=steam-demo-01`);
    await click(page, "[data-start-story]");
    if (await page.locator("[data-enter-first-case]").count()) {
      await drainDialogue(page, {});
      await click(page, "[data-enter-first-case]");
      await click(page, "[data-enter-case-live]");
    }
    await drainDialogue(page, {});
    await click(page, '[data-scene="sceneReview"]');
    await click(page, "[data-open-question-menu]");
    await click(page, "[data-scene-helper]");
    const oldHelpCount = await page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}");
      return Object.keys(save.helperHintPicks ?? {}).length;
    });
    if (oldHelpCount !== 1) throw new Error("new-game reset setup must leave one old helper record");
    await click(page, "[data-close-question-menu]");
    await click(page, '[data-action="title"]');
    await click(page, "[data-request-new-game]");
    await click(page, "[data-confirm-new-game]");
    const freshState = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}"));
    if (freshState.chapter !== 1 || freshState.scene !== "nightShellPrologue") {
      throw new Error(`new game must replace the old run state: ${JSON.stringify({ chapter: freshState.chapter, scene: freshState.scene })}`);
    }
    if (Object.keys(freshState.helperHintPicks ?? {}).length) {
      throw new Error("new game must not retain helper records from the old state");
    }
    await drainDialogue(page, {});
    await click(page, "[data-enter-first-case]");
    await assertVisibleText(page, "第一幕", "memoized screens must render the first case from the new state");
    await click(page, "[data-enter-case-live]");

    await page.evaluate(() => {
      const storageKey = "livestream-detective-save-v1";
      const save = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      const brief = save.caseBriefs?.[0] ?? {};
      const caseId = brief.id;
      const answerKey = `${caseId}:scene:0`;
      const staleAnniversary = brief.sceneVersions?.find((scene) => scene.id === "credit-anniversary-agency");
      if (staleAnniversary) staleAnniversary.version = "他把酒单推到我面前。酒是他点的，我当时也没拦。";
      save.screen = "chapter";
      save.chapter = 1;
      save.caseBrief = brief;
      save.scene = "patienceLost";
      save.patienceLostContext = {
        caseId,
        area: "sceneReview",
        index: 0,
        answerKey,
        actionKeys: [],
        spent: true,
        removeQuestionPick: true
      };
      save.sceneQuestionPicks = { ...(save.sceneQuestionPicks ?? {}), [answerKey]: { marker: "old-state" } };
      save.sceneAnswers = { ...(save.sceneAnswers ?? {}), [answerKey]: "old-state" };
      save.caseBudgets = { ...(save.caseBudgets ?? {}), [caseId]: { max: 7, remaining: 0, used: 7 } };
      localStorage.setItem(storageKey, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await assertVisibleText(page, "这通断了", "seeded patience loss must render before retry");
    await click(page, "[data-retry-lost-step]");
    await drainDialogue(page, {});
    await page.locator("[data-open-question-menu]").waitFor({ state: "visible" });
    const retriedState = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}"));
    const retriedCaseId = retriedState.caseBriefs?.[0]?.id;
    const retriedAnswerKey = `${retriedCaseId}:scene:0`;
    const refreshedAnniversary = retriedState.caseBriefs?.[0]?.sceneVersions?.find((scene) => scene.id === "credit-anniversary-agency");
    if (!refreshedAnniversary?.version?.includes("他看中一瓶，我说太贵了") || refreshedAnniversary.version.includes("他把酒单推到我面前")) {
      throw new Error("continuing a save must refresh stale authored dialogue from the current content pack");
    }
    if (retriedState.scene !== "sceneReview" || retriedState.patienceLostContext !== null) {
      throw new Error("patience retry must render from the replacement state and clear its retry context");
    }
    if (retriedState.sceneQuestionPicks?.[retriedAnswerKey] || retriedState.sceneAnswers?.[retriedAnswerKey]) {
      throw new Error("patience retry must remove the failed question from the replacement state");
    }
    if (retriedState.caseBudgets?.[retriedCaseId]?.remaining !== 1) {
      throw new Error("patience retry must refund one point on the replacement state");
    }
  } finally {
    await context.close();
  }
}

async function runRoute(route) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: route.name === "accounting-restaurant" ? "no-preference" : "reduce"
  });
  await context.addInitScript(() => {
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
    if (route.name === "accounting-restaurant") {
      await assertVisibleText(page, "今晚由你接麦", "title page should establish that the player is Lin Xuyang before starting");
    }
    if (route.name === "accounting-restaurant") await assertAudioSettings(page);
    if (route.inputMode === "gamepad") await connectGamepad(page);
    await activate(page, route, "[data-start-story]");
    if (route.name === "accounting-restaurant") {
      if (await page.locator(".pixel-transition").count() !== 1) throw new Error("night shell should mount one pixel transition overlay");
      const pointerEvents = await page.locator(".pixel-transition").evaluate((element) => getComputedStyle(element).pointerEvents);
      if (pointerEvents !== "none") throw new Error("pixel transition must never block player input");
      const transitionDuration = await page.locator(".pixel-transition-soft-fade").evaluate((element) => getComputedStyle(element).animationDuration);
      if (transitionDuration !== "2.4s") throw new Error(`pre-show transition should hold for 2.4s, got ${transitionDuration}`);
    }
    if (await page.locator("[data-enter-first-case]").count()) {
      await drainDialogue(page, route);
      await assertVisibleText(page, "开播了哈，今天继续连麦。", "night shell prologue should sound like a returning personal streamer");
      await assertNoPageText(page, "试玩已收麦", "night shell prologue must not display the story-pack completion HUD");
      if (await page.locator(".night-shell-line.shell-notice, .night-shell-line.shell-message, .night-shell-line.shell-stage, .night-shell-line.shell-host").count() !== 4) {
        throw new Error("night shell prologue should distinguish work notice, personal message, solo go-live action, and host opening");
      }
      await activate(page, route, "[data-enter-first-case]");
      await assertVisibleText(page, "第一幕", "first case must enter through the same act title treatment as later cases");
      await assertVisibleText(page, "账单里的八万", "first act title must state its case hook before the call connects");
      await activate(page, route, "[data-enter-case-live]");
    }
    if (route.name === "accounting-restaurant") {
      await activate(page, route, '[data-action="title"]');
      await assertVisibleText(page, "继续上次直播", "returning to title should preserve a continue entry");
      await assertVisibleText(page, "新游戏", "title menu should keep a separate new-game entry");
      await page.reload({ waitUntil: "domcontentloaded" });
      await assertVisibleText(page, "继续上次直播", "reloading with a save should stay on the title menu instead of auto-resuming");
      await activate(page, route, "[data-continue-story]");
      await assertDialoguePresentation(page);
      await assertPixelPortrait(page, 1);
    }
    await activate(page, route, '[data-scene="sceneReview"]');
    const visualStates = new Set();
    const portraitStates = new Set();
    let helperChecked = false;
    let directionChoiceChecked = false;
    let selectedCounterChoiceLabel = "";

    for (let beat = 0; beat < 48; beat += 1) {
      await collectLiveVisualState(page, visualStates, portraitStates);
      if (await page.locator("[data-evidence-check]").count()) break;
      if (await page.locator("[data-enter-day-map]").count()) {
        await assertVisibleText(page, "把昨晚没问完的补上", "the second act opening should frame why the host is following up before the map");
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
        await assertVisibleText(page, "电话断了。后台那张信用卡账单还亮着，至少三万五没有说明", "overnight route should show the authored three-bucket hangup line before the show ends");
        await assertNoPageText(page, "账单、到期日、她要垫多少", "Zhao's private call must not happen while the show is still live");
        await activate(page, route, "[data-enter-post-live]");
        continue;
      }
      if (await page.locator("[data-interrupt-choice]").count()) {
        await activate(page, route, "[data-interrupt-choice]");
        await activate(page, route, "[data-return-interlude]");
        continue;
      }
      if (await page.getByText("后台打断", { exact: true }).first().isVisible().catch(() => false)
        && await page.locator("[data-complete-interlude-action]").count()) {
        await activate(page, route, "[data-complete-interlude-action]");
        continue;
      }
      if (await page.locator("[data-interlude-action]").count()) {
        await completeCase1Interlude(page, route);
        continue;
      }
      if (await page.locator("[data-overnight-opener]").count()) {
        await assertVisibleText(page, "回拨开场 · 选后锁定", "overnight opener must disclose that the choice locks before activation");
        await activate(page, route, `[data-overnight-opener="${route.opener}"]`);
        continue;
      }
      if (await page.locator("[data-enter-overnight-night2]").count()) {
        if (route.dayScenes.length === 0) {
          await assertVisibleText(page, "我想了一晚上，还是得把话说完——你接着问吧。", "zero-location route should use fallback opener");
        }
        const openerTranscript = await drainDialogue(page, route);
        if (route.openerText && !openerTranscript.includes(route.openerText)) {
          throw new Error(`${route.name} should render the selected opener and its first conflict`);
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
      if (await page.locator("[data-live-counter-choice]").count()) {
        selectedCounterChoiceLabel = (await page.locator("[data-live-counter-choice]").first().textContent())?.trim() ?? "";
        await activate(page, route, "[data-live-counter-choice]", 0);
        continue;
      }
      if (await page.locator("[data-continue-live-counter]").count()) {
        const liveCounterTranscript = await drainDialogue(page, route);
        if (route.name === "accounting-restaurant") {
          if (!liveCounterTranscript.includes("他在听。")) {
            throw new Error("night-B counter-pressure should interrupt between two live scenes");
          }
          // verify-pack rejects respondent roles in live-counter lines; this replay verifies
          // that the player's selected on-air host response actually reached the transcript.
          if (!selectedCounterChoiceLabel || !liveCounterTranscript.includes(selectedCounterChoiceLabel)) {
            throw new Error("the host must answer the relayed counter-pressure through the selected on-air choice");
          }
        }
        await activate(page, route, "[data-continue-live-counter]");
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
      if (route.name === "accounting-restaurant") {
        await assertVisibleText(page, "收束 · 未命中 −1 耐心", "key question buttons must expose the patience cost before activation");
      }
      if (!helperChecked && route.name === "accounting-restaurant" && await page.locator("[data-scene-helper]").count()) {
        const beforeHelp = await savedHelpInvariant(page);
        await activate(page, route, "[data-scene-helper]");
        await page.locator(".helper-prompt-open").waitFor({ state: "visible" });
        await assertVisibleText(page, "V哥", "V哥 should only speak after the player asks for help");
        const afterHelp = await savedHelpInvariant(page);
        if (afterHelp.helperCount !== beforeHelp.helperCount + 1) throw new Error("V哥 help should persist exactly one scene hint record");
        if (afterHelp.budgets !== beforeHelp.budgets || afterHelp.routes !== beforeHelp.routes) throw new Error("V哥 help must not change patience budgets or route scoring");
        helperChecked = true;
      }
      if (route.sceneMode === "outer") {
        const dialogueButtons = page.locator("[data-scene-dialogue]");
        if (await dialogueButtons.count() > 0) {
          await activate(page, route, "[data-scene-dialogue]", 0);
          await drainDialogue(page, route);
          await page.locator("[data-return-question-menu]").waitFor({ state: "visible" });
          await activate(page, route, "[data-return-question-menu]");
          await page.locator(".scene-question-group").waitFor({ state: "visible" });
        }
      }
      const questionIndex = route.sceneMode === "outer" && await page.locator("[data-scene-question]").count() > 1 ? 1 : 0;
      const selectedQuestion = page.locator("[data-scene-question]").nth(questionIndex);
      const directionLabel = await selectedQuestion.locator(".choice-direction-kicker").count()
        ? await selectedQuestion.locator(".choice-text").innerText()
        : "";
      await activate(page, route, "[data-scene-question]", questionIndex);
      if (directionLabel && !directionChoiceChecked) {
        const spokenQuestion = page.locator("[data-dialogue-advance]:visible .avg-page-line.speaker-host .avg-line").first();
        await spokenQuestion.waitFor({ state: "visible" });
        await page.locator("[data-dialogue-advance]:visible").first().evaluate((element) => element.click());
        const spokenText = (await spokenQuestion.textContent())?.trim() ?? "";
        if (!spokenText || spokenText === directionLabel || !/[？?]$/.test(spokenText)) {
          throw new Error("direction choice should turn into Lin Xuyang's authored spoken question");
        }
        await assertNoPageText(page, `林旭阳\n${directionLabel}`, "direction label must not replace the protagonist's spoken line");
        directionChoiceChecked = true;
      }
      await drainDialogue(page, route);
      continue;
    }

    await page.locator("[data-evidence-check]").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "圈点 · 圈偏 −1 耐心", "evidence targets must expose the miss cost before activation");
    if (visualStates.size < 2 || portraitStates.size < 2) {
      throw new Error(`${route.name} route should change scene and portrait states while questioning`);
    }
    if (route.name === "accounting-restaurant" && (!helperChecked || !directionChoiceChecked)) {
      throw new Error("primary browser route must exercise both V哥 help and a direction-only question");
    }
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
    if (route.name === "accounting-restaurant") {
      await assertVisibleText(page, "这张账我重说", "perfect route should show testimony revision after the material hit");
    }
    if (route.name === "material-miss-accounting-restaurant") {
      await assertVisibleText(page, "这卡上像戒了的样子吗？", "material-miss route should show pity line after the first miss");
    }

    await advanceToAccusation(page, route);
    await assertVisibleText(page, "终局追问 · 选后收麦", "final question must disclose that it closes the call");
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

async function savedHelpInvariant(page) {
  return page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem("livestream-detective-save-v1") || "{}");
    return {
      helperCount: Object.keys(save.helperHintPicks || {}).length,
      budgets: JSON.stringify(save.caseBudgets || {}),
      routes: JSON.stringify(save.routeChoiceLog || {})
    };
  });
}

async function completeCase1Interlude(page, route) {
  await assertVisibleText(page, "幕间调查台", `${route.name} must pass through the short interlude before the day map`);
  await activate(page, route, '[data-interlude-action="zhao-zhou-frame"]');
  await activate(page, route, '[data-advisor-conflict="frame-zhou"]');
  await activate(page, route, "[data-return-interlude]");
  await activate(page, route, "[data-callback-ready]");
}

async function runCase3DayRoutes() {
  await runOfflineDayMap({
    chapter: 3,
    name: "case3-day-map",
    interludeAction: "profile-closed-zhang",
    dayScenes: [
      { id: "day-profile-teahouse", text: "你先看聊天" },
      { id: "day-profile-cousin-doorstep", text: "门只开到防盗链" }
    ],
    opener: "两边的完整聊天",
    openerText: "我把介绍人两边的聊天都看完了",
    conflictText: "知道你家现在能拿多少吗"
  });
  await runOfflineDayMap({
    chapter: 3,
    name: "case3-reaction-beat",
    interludeAction: "profile-closed-zhang",
    dayScenes: [
      { id: "day-profile-credential-docs", text: "学历、彩礼与两家资金边界", rows: ["p04"] },
      { id: "day-profile-teahouse", text: "你先看聊天" }
    ],
    opener: "双份材料圈注",
    openerText: "我重新看那两份材料",
    reactionText: "她拍我家的群。给一个直播间。",
    reactionChoice: "push-back",
    reactionResponse: "你先让我把这段说完。"
  });
}

async function runCase4AdvisorConflict() {
  await runOfflineDayMap({
    chapter: 4,
    name: "case4-day-map",
    interludeAction: "zhao-zhou-work",
    interludeChoice: "work-frame-lin",
    interludeText: "后台连续进来三条回复",
    expectedDaySceneCount: 4,
    dayScenes: [
      {
        id: "day-work-payment-ledger",
        text: "她整理的七条报销记录",
        rows: ["q01", "q02", "q04"],
        questionText: "公开流程和这条私聊只隔十七分钟"
      },
      { id: "day-work-finance-window", text: "真付了，就让他们报回单号" }
    ],
    opener: "她整理的报销时间线",
    openerText: "财务说延后，是九天以后",
    conflictText: "财务那时还没说延后",
    reactionText: "弹幕里有人说我蠢。我看见了。",
    reactionChoice: "silence",
    reactionResponse: "行，继续。",
    nextCounterText: "月底财务集中报销时一起办"
  });
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
  await click(page, "[data-continue-story]");
  await click(page, '[data-scene="sceneReview"]');
}

async function advanceNightCaseToOvernightHangup(page, portraitAssets = null) {
  for (let beat = 0; beat < 48; beat += 1) {
    await collectPortraitAsset(page, portraitAssets);
    if (await page.locator("[data-enter-post-live], [data-enter-interlude]").count()) return;
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
    await collectPortraitAsset(page, portraitAssets);
    await click(page, "[data-next-scene-stage], button[data-scene]");
  }
  throw new Error("targeted case did not reach overnight hangup");
}

async function runCase2DayMap() {
  await runOfflineDayMap({
    chapter: 2,
    name: "case2-day-map",
    interludeAction: "listen-dryer",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "会员维护表与私表截图", rows: ["m02", "m04"] }
    ],
    opener: "吹风机回放",
    openerText: "是我把它剪掉",
    reactionText: "收了好处装什么受害者",
    reactionChoice: "soothe",
    reactionResponse: "……嗯。你问吧。"
  });
  await runOfflineDayMap({
    chapter: 2,
    name: "case2-dm-other",
    interludeAction: "other-caller-dm",
    interludeReplyChoice: "side-other",
    expectedNightInventory: "side-other-caller",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "会员维护表与私表截图", rows: ["m02", "m04"] }
    ],
    opener: "女客拉群立场",
    openerText: "你支持她留表"
  });
  await runOfflineDayMap({
    chapter: 2,
    name: "case2-dm-caller",
    interludeAction: "other-caller-dm",
    interludeReplyChoice: "side-caller",
    expectedNightInventory: "side-caller-stop",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "会员维护表与私表截图", rows: ["m02", "m04"] }
    ],
    opener: "咨询者止损立场",
    openerText: "你说止损"
  });
}

async function runOfflineDayMap({ chapter, name, interludeAction, interludeChoice = "", interludeReplyChoice = "", expectedNightInventory = "", interludeText = "", expectedDaySceneCount = 3, dayScenes, opener, openerText, conflictText = "", reactionText = "", reactionChoice = "", reactionResponse = "", nextCounterText = "" }) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await openCaseAtChapter(page, chapter, name);
    const portraitAssets = new Set();
    await assertPixelPortrait(page, chapter);
    await advanceNightCaseToOvernightHangup(page, portraitAssets);
    const portraitStem = ({ 2: "caller_salon", 3: "caller_profile", 4: "caller_work" })[chapter];
    ["neutral", "guarded", "pause"].forEach((kind) => {
      if (![...portraitAssets].some((src) => src.includes(`${portraitStem}_${kind}_pixel.png`))) {
        throw new Error(`${name} must render the case-${chapter} ${kind} pixel portrait during the live call`);
      }
    });
    await assertNoPageText(page, "第二天，下午", `${name} must show the hangup before daytime`);
    await click(page, "[data-enter-post-live], [data-enter-interlude]");
    if (await page.locator("[data-interrupt-choice]").count()) {
      await click(page, "[data-interrupt-choice]");
      await click(page, "[data-return-interlude]");
    } else if (await page.getByText("后台打断", { exact: true }).first().isVisible().catch(() => false)
      && await page.locator("[data-complete-interlude-action]").count()) {
      await click(page, "[data-complete-interlude-action]");
    }
    await assertVisibleText(page, "幕间调查台", `${name} must pass through the short interlude before the day map`);
    await click(page, `[data-interlude-action="${interludeAction}"]`);
    await assertNoPageText(page, "ON AIR", `${name} interlude action must stay off air`);
    if (interludeText) await assertVisibleText(page, interludeText, `${name} must render the selected interlude NPC action`);
    if (interludeReplyChoice) {
      await click(page, "[data-evidence-check]");
      if (await page.locator("[data-return-interlude]").count()) {
        throw new Error(`${name} must require a reply before returning to the interlude desk`);
      }
      await assertNightState(page, (night) => !(night.interludeActionsDone ?? []).includes(interludeAction), `${name} must not complete the private-message action before reply`);
      await assertNightState(page, (night) => !(night.inventory ?? []).includes("other-caller-dm-seen"), `${name} must not grant the orphan read receipt`);
      await click(page, `[data-reply-choice="${interludeReplyChoice}"]`);
      await assertNightState(page, (night) => (night.interludeActionsDone ?? []).includes(interludeAction), `${name} must complete the private-message action after reply`);
      await assertNightState(page, (night) => (night.inventory ?? []).includes(expectedNightInventory), `${name} must grant the selected reply stance`);
      await assertNightState(page, (night) => !(night.inventory ?? []).includes("other-caller-dm-seen"), `${name} must keep the orphan read receipt absent after reply`);
    } else if (interludeChoice) {
      await click(page, `[data-advisor-conflict="${interludeChoice}"]`);
      await click(page, "[data-return-interlude]");
    } else {
      await click(page, "[data-complete-interlude-action]");
    }
    await click(page, "[data-callback-ready]");
    await assertVisibleText(page, "把昨晚没问完的补上", `${name} must enter the daytime follow-up after the short interlude`);
    await click(page, "[data-enter-day-map]");
    if (await page.locator("[data-day-scene]").count() !== expectedDaySceneCount) throw new Error(`${name} should expose exactly ${expectedDaySceneCount} daytime locations`);
    if (await page.locator("[data-enter-overnight-callback]").count()) throw new Error(`${name} must require two daytime locations`);
    for (const [index, scene] of dayScenes.entries()) {
      await click(page, `[data-day-scene="${scene.id}"]`);
      if (await page.locator(".day-access-hint").count() !== 1) {
        throw new Error(`${scene.id} must explain why the host can meet this source or read this material`);
      }
      const dayEntryTranscript = await drainDialogue(page, {});
      await assertNoPageText(page, "ON AIR", `${scene.id} must stay off air`);
      if (!dayEntryTranscript.includes(scene.text)) {
        await assertVisibleText(page, scene.text, `${scene.id} must render its own location material`);
      }
      for (const rowId of scene.rows ?? []) await click(page, `[data-document-row="${rowId}"]`);
      if (scene.questionText) await assertVisibleText(page, scene.questionText, `${scene.id} must unlock its cross-row question after marking the required rows`);
      if (await page.locator("[data-day-choice]").count()) await click(page, scene.choice ? `[data-day-choice="${scene.choice}"]` : "[data-day-choice]");
      const daySceneTranscript = await drainDialogue(page, {});
      if (scene.choiceText && !daySceneTranscript.includes(scene.choiceText)) {
        throw new Error(`${scene.id} must reveal the selected branch result`);
      }
      if (scene.excludedChoiceText && daySceneTranscript.includes(scene.excludedChoiceText)) {
        throw new Error(`${scene.id} must not reveal an unselected branch result`);
      }
      await click(page, "[data-complete-day-scene]");
      if (index === 0 && await page.locator("[data-enter-overnight-callback]").count()) throw new Error(`${name} unlocked callback after only one location`);
    }
    await click(page, "[data-enter-overnight-callback]");
    await click(page, `[data-overnight-opener="${opener}"]`);
    let callbackTranscript = await drainDialogue(page, {});
    for (const selector of ["[data-enter-overnight-night2]", "[data-enter-overnight-night2-direct]"]) {
      if (!await page.locator(selector).count()) continue;
      await click(page, selector);
      callbackTranscript += `\n${await drainDialogue(page, {})}`;
      break;
    }
    if (!callbackTranscript.includes(openerText)) throw new Error(`${name} must use the selected daytime item in the second-night opener`);
    if (conflictText && !callbackTranscript.includes(conflictText)) throw new Error(`${name} must render the selected item's first night-B confrontation`);
    if (reactionText) {
      await advanceToReactionBeat(page, reactionText, name);
      await click(page, `[data-live-counter-choice="${reactionChoice}"]`);
      const reactionTranscript = await drainDialogue(page, {});
      if (!reactionTranscript.includes(reactionResponse)) throw new Error(`${name} must render the selected humanization response`);
      if (nextCounterText) {
        await click(page, "[data-continue-live-counter]");
        const nextCounterTranscript = await drainDialogue(page, {});
        if (!nextCounterTranscript.includes(nextCounterText)) throw new Error(`${name} must queue the next scene-tail counter beat instead of skipping it`);
      }
    }
    await assertNoPageText(page, "undefined", `${name} rendered undefined text`);
    await assertNoPageText(page, "NaN", `${name} rendered NaN text`);
  } catch (error) {
    const body = await page.locator("body").innerText().catch(() => "");
    console.error(`${name} route failed.`);
    console.error(body.slice(0, 1600));
    throw error;
  } finally {
    await context.close();
  }
}

async function advanceToReactionBeat(page, expectedText, name) {
  let transcript = "";
  for (let step = 0; step < 48; step += 1) {
    transcript += `\n${await drainDialogue(page, {})}`;
    if (transcript.includes(expectedText)) return;
    for (const selector of [
      "[data-enter-overnight-night2]",
      "[data-enter-overnight-night2-direct]",
      "[data-document-question]",
      "[data-close-document-question]",
      "[data-after-scene-evidence]",
      "[data-open-question-menu]",
      "[data-return-question-menu]",
      "[data-next-scene-stage]",
      "[data-continue-live-counter]"
    ]) {
      if (await page.locator(selector).count()) {
        await click(page, selector);
        break;
      }
    }
    if (await page.locator("[data-scene-question]").count()) await click(page, "[data-scene-question]");
    await page.waitForTimeout(20);
  }
  throw new Error(`${name} did not reach reaction beat: ${expectedText}`);
}

async function completeOvernightDay(page, route) {
  await assertVisibleText(page, "今天的约见与材料", "day map should start with authorized appointments and materials");
  await assertVisibleText(page, "耗时 1 · 占用一处走访", "day locations must expose their action cost before activation");
  await assertNoPageText(page, "节目不在线，弹幕不在，城市在。", "day map must not repeat the second-act opening copy");
  await assertNoPageText(page, "ON AIR", "day map must hide ON AIR");
  await assertNoPageText(page, "听众耐心", "day map must hide patience HUD");
  if (await page.locator("[data-enter-overnight-callback]").count()) {
    throw new Error("day map must not allow skipping the required two daytime actions");
  }
  for (const sceneId of route.dayScenes) {
    await activate(page, route, `[data-day-scene="${sceneId}"]`);
    if (await page.locator(".day-access-hint").count() !== 1) {
      throw new Error(`${sceneId} must keep its contact and consent source visible`);
    }
    await drainDialogue(page, route);
    await assertNoPageText(page, "ON AIR", `${sceneId} must hide ON AIR`);
    await assertNoPageText(page, "听众耐心", `${sceneId} must hide patience HUD`);
    if (sceneId === "day-accounting") {
      await assertVisibleText(page, "旧厂房改的档案室", "accounting day scene should render");
      await assertVisibleText(page, "排序 · 可清空重排", "timeline cards must explain that ordering is reversible");
      for (const card of ["社保断缴", "分期开通", "每月 8 日的固定入账中断", "他开口借八万"]) {
        await activate(page, route, `[data-day-timeline-card="${card}"]`);
      }
      await activate(page, route, "[data-submit-day-timeline]");
      await assertVisibleText(page, "人是谁，手里这些东西看不出来", "timeline sort should preserve the unknown account owner and reject the unsupported summary");
    }
    if (sceneId === "day-restaurant") {
      await assertVisibleText(page, "今天第三拨了", "restaurant scene should render exact service line");
    }
    if (sceneId === "day-bank-flow") {
      await assertVisibleText(page, "他的银行流水(她导出的近五个月)", "document day scene should render bank flow");
      for (const rowId of route.documentRows ?? ["r08", "r11"]) {
        await activate(page, route, `[data-document-row="${rowId}"]`);
      }
      const crossQuestion = (route.documentRows ?? []).includes("r13")
        ? "流水没写后面转出的就是那二十万"
        : "七月五日五万进，七月十九日四万九千八出——这算周转吗？";
      await assertVisibleText(page, crossQuestion, "document route should unlock the cross question for the selected rows");
    }
    if (await page.locator("[data-day-choice]").count()) {
      await assertVisibleText(page, "现场判断 · 选后锁定", "day choices must disclose their lock before activation");
      const choiceId = route.dayChoices?.[sceneId];
      const choiceSelector = choiceId ? `[data-day-choice="${choiceId}"]` : "[data-day-choice]";
      const choiceButton = page.locator(choiceSelector).first();
      const selectedLabel = await choiceButton.locator(".choice-text").count()
        ? (await choiceButton.locator(".choice-text").innerText()).trim()
        : (await choiceButton.innerText()).split("\n")[0].trim();
      await activate(page, route, choiceSelector);
      await drainDialogue(page, route);
      await assertVisibleText(page, selectedLabel, `${sceneId} must reveal the selected branch result`);
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
    await click(page, "[data-continue-story]");
    await assertVisibleText(page, "案件结案", "first case should enter a dedicated closure page before the next case");
    await assertVisibleText(page, "账单里的八万", "first case closure should carry a case-specific title");
    await assertVisibleText(page, "今晚能确认", "closure should distinguish confirmed facts from a raw evidence pile");
    await assertVisibleText(page, "今晚不替人定", "closure should preserve unresolved facts");
    await click(page, "[data-enter-story-interlude]");
    await page.getByText("第一案 · 小尾声").first().waitFor({ state: "visible" }).catch(async () => {
      throw new Error(`first case tail did not render after closure:\n${await page.locator("body").innerText()}`);
    });
    await assertVisibleText(page, "第一案 · 小尾声", "closure should move into the first case's lived epilogue");
    await assertVisibleText(page, "我们俩大概一开始就看不上对方", "first case epilogue should establish Lin and Zhao as a couple through dialogue");
    if (await page.locator(".pixel-transition-signal-disconnect").count() !== 1) throw new Error("program interlude should use one short disconnect signal transition");
    await click(page, "[data-enter-case-bridge]");
    const firstTransitionQuote = transitionQuoteByCaseId["01-credit"];
    await assertVisibleText(page, firstTransitionQuote.text, "case one and case two must be joined by the authored classic quote");
    await assertVisibleText(page, firstTransitionQuote.source, "inter-case quote must display its source");
    await assertVisibleText(page, firstTransitionQuote.bridge, "inter-case quote must bridge the finished case to the next one");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "第二幕", "second case must open on a numbered act title card");
    await assertVisibleText(page, "02 / 04", "second act title must show its position in the four-act night");
    await assertVisibleText(page, "理发店排班表", "second case title card should name the case");
    await assertVisibleText(page, "自己人", "second case title card should frame the central question");
    if (await page.locator(".pixel-transition-signal-connect").count() !== 1) throw new Error("case title should use one short connect signal transition");
    const titleAnimations = await page.evaluate(() => document.getAnimations()
      .filter((animation) => animation.playState === "running")
      .map((animation) => animation.animationName)
      .filter((name) => Boolean(name) && name !== "focusCurrent"));
    if (titleAnimations.length) {
      throw new Error(`second case title should stay still, found animations: ${titleAnimations.join(", ")}`);
    }
    await click(page, "[data-enter-case-live]");
    await drainDialogue(page, {});
    await page.locator('[data-scene="sceneReview"]').waitFor({ state: "visible" });

    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 2;
      save.caseBrief = save.caseBriefs?.[1] ?? null;
      save.scene = "caseClosure";
      save.storyWorldEchoes = {};
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await click(page, "[data-enter-story-interlude]");
    await assertVisibleText(page, "第二案 · 小尾声", "second case must close without prematurely paying off the trust thread");
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("world echo must stay hidden until the final case");
    await click(page, "[data-enter-case-bridge]");
    await assertVisibleText(page, transitionQuoteByCaseId["02-tony"].text, "case two and case three must use the authored quote transition");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "第三幕", "case two tail must return to the normal act transition");

    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 4;
      save.caseBrief = save.caseBriefs?.[3] ?? null;
      save.scene = "caseClosure";
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await assertVisibleText(page, "案件结案", "final case must still enter its dedicated closure page");
    await click(page, "[data-enter-story-interlude]");
    await page.getByText("第四案 · 小尾声").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "第四案 · 小尾声", "final case must have its own lived epilogue");
    await assertVisibleText(page, "第四案完", "final case tail must close before the whole-night epilogue");
    if (await page.getByText("下一通 · 材料先到").count()) throw new Error("final case tail must not show a nonexistent next case");
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("final world echo must not appear before player action");
    await assertVisibleText(page, "把新闻推送点开", "final world echo must be offered as a player action");
    await click(page, "[data-reveal-world-echo]");
    await assertVisibleText(page, "宸直信托全部产品暂停兑付，实控人失联", "final world echo must pay off the case-one and case-two trust seeds");
    await assertVisibleText(page, "公告没有公布清偿顺序", "final world echo must preserve the unresolved recovery boundary");
    await click(page, "[data-enter-night-epilogue]");
    await assertVisibleText(page, "直播中", "whole-night epilogue should begin only after the fourth case tail");
  } finally {
    await context.close();
  }
}

async function runPortraitViewports() {
  for (const viewport of [
    { width: 390, height: 844, label: "mobile" },
    { width: 1366, height: 768, label: "desktop" },
    { width: 1280, height: 800, label: "deck-css" }
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    try {
      await page.goto(`${playableUrl}?playtest=portrait-${viewport.label}-${Date.now()}&storyKey=steam-demo-01`);
      await click(page, "[data-start-story]");
      if (await page.locator("[data-enter-first-case]").count()) {
        await click(page, "[data-enter-first-case]");
        await click(page, "[data-enter-case-live]");
      }
      await assertPixelPortrait(page, 1);
      const layout = await page.evaluate(() => {
        const shell = document.querySelector(".case-vn-grid");
        const portraitLayer = document.querySelector(".case-duel-portraits");
        const portrait = document.querySelector(".case-portrait.art-pixel img:not([hidden])");
        const rect = portrait?.getBoundingClientRect();
        return {
          shellOverflow: shell ? shell.scrollWidth - shell.clientWidth : 999,
          pointerEvents: portraitLayer ? getComputedStyle(portraitLayer).pointerEvents : "missing",
          imageRendering: portrait ? getComputedStyle(portrait).imageRendering : "missing",
          rect: rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width } : null
        };
      });
      if (!layout.rect) throw new Error(`${viewport.label} portrait layout is missing`);
      if (layout.shellOverflow > 2) throw new Error(`${viewport.label} portrait shell overflows horizontally by ${layout.shellOverflow}px`);
      if (layout.pointerEvents !== "none") throw new Error(`${viewport.label} portrait layer must not block dialogue or choices`);
      if (layout.imageRendering !== "pixelated") throw new Error(`${viewport.label} portrait must keep nearest-neighbor rendering`);
      if (layout.rect.left < -1 || layout.rect.right > viewport.width + 1) throw new Error(`${viewport.label} portrait escapes the viewport horizontally`);
      if (layout.rect.width > Math.min(viewport.width * 0.5, 320)) throw new Error(`${viewport.label} portrait is too wide for dialogue-safe staging`);
    } finally {
      await context.close();
    }
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
        const callerQuestionTranscript = await drainDialogue(page, route);
        if (!callerQuestionTranscript.includes("先问他三月为什么借了二十万") || !callerQuestionTranscript.includes("我先不转")) {
          throw new Error("process-control answer should stop the transfer and return the trust-loan question to the respondent");
        }
      }
      continue;
    }
    if (await page.locator("[data-caller-question-host]").count()) {
      const hostChoice = route.callerQuestionHost ?? "soothe";
      await activate(page, route, `[data-caller-question-host="${hostChoice}"]`);
      if (hostChoice === "soothe") {
        const hostChoiceTranscript = await drainDialogue(page, route);
        if (!hostChoiceTranscript.includes("水在手边放凉一晚上了")) {
          throw new Error("humanization branch must render the chosen emotional-labor response");
        }
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
  for (let step = 0; step < 6; step += 1) {
    if (await page.locator(".truth-boundary-card").count()) break;
    await activate(page, route, "[data-recap-next]");
  }
  await page.locator(".truth-boundary-card").waitFor({ state: "visible" });
  const promptCount = await page.locator(".truth-boundary-prompt").count();
  if (promptCount < 5) {
    throw new Error(`Truth boundary should use at least five prompts, got ${promptCount}`);
  }
  if (await page.locator("[data-recap-next]").count()) {
    throw new Error("Truth boundary allowed continuing before every prompt was placed");
  }
  await assertVisibleText(page, "事实归位 · 选后锁定", "truth-boundary buttons must disclose their lock before activation");
  for (let index = 0; index < promptCount; index += 1) {
    const prompt = page.locator(".truth-boundary-prompt").nth(index);
    await prompt.locator("[data-truth-boundary-pick]").first().evaluate((element) => element.click());
  }
  await assertNoPageText(page, "这句还不能这么放", "Truth boundary must not reveal correctness on the choice page");
  await page.locator("[data-recap-next]").first().waitFor({ state: "visible" });
  await activate(page, route, "[data-recap-next]");
  await assertVisibleText(page, "麦外来信", "Recap final page should keep off-mic letters after boundary placement");
  const finalBody = await page.locator("body").innerText();
  if (finalBody.includes("灯是我真心买的")) {
    assertTextOrder(finalBody, [
      "收麦后，对方给后台留了一段文字，说不上麦。",
      "三月那二十万是我从澄川借的",
      "灯是我真心买的"
    ], "麦外来信 should show respondent note before lurker");
  }
  await page.locator(".truth-boundary-reveal").waitFor({ state: "visible" });
  await assertVisibleText(page, "归到了", "Truth boundary reveal should show where an early placement landed");
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
  const shownText = new Set();
  for (let line = 0; line < 80; line += 1) {
    const box = page.locator("[data-dialogue-advance]:not([data-dialogue-done]):visible").first();
    if (!await box.count()) return [...shownText].join("\n");
    await assertDialoguePageDensity(box);
    const currentPageText = (await box.locator(".avg-line").allTextContents()).join("\n").trim();
    if (currentPageText) shownText.add(currentPageText);
    if (route.inputMode === "keyboard") await page.keyboard.press("Enter");
    else if (route.inputMode === "gamepad") await gamepadPress(page, 0);
    else await box.evaluate((element) => element.click());
    await page.waitForTimeout(20);
    const pageText = (await box.locator(".avg-line").allTextContents()).join("\n").trim();
    if (pageText) shownText.add(pageText);
  }
  throw new Error("per-line dialogue did not finish within 80 advances");
}

async function assertDialoguePresentation(page) {
  const box = page.locator("[data-dialogue-advance]");
  await box.waitFor({ state: "visible" });
  await assertDialoguePageDensity(box);
  const before = await box.locator(".avg-line").first().textContent();
  await box.click();
  const completed = await box.locator(".avg-line").first().textContent();
  if ((completed?.length ?? 0) < (before?.length ?? 0)) throw new Error("typing click must complete the current sentence");
  if (!await box.locator(".avg-continue").isVisible()) throw new Error("completed sentence must show continue indicator");
  await page.locator("[data-record-open]").click();
  await page.locator(".court-record:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-record-close]").click();
}

async function assertDialoguePageDensity(box) {
  const lines = box.locator(".avg-page-line");
  const count = await lines.count();
  if (count < 1 || count > 2) {
    throw new Error(`dialogue page must contain one turn or one question-answer pair, got ${count}`);
  }
  if (count === 2) {
    const roles = await lines.evaluateAll((items) => items.map((item) => (
      item.classList.contains("speaker-host") ? "host" : "caller"
    )));
    if (roles[0] === roles[1]) throw new Error("two-line dialogue page must contain two different speakers");
  }
  const repeatedContext = box.locator(".avg-page-line.context-repeat");
  const repeatedCount = await repeatedContext.count();
  if (repeatedCount > 1 || (repeatedCount === 1 && count !== 2)) {
    throw new Error("continued answer page must keep exactly one previous-question context and one answer");
  }
  if (repeatedCount === 1) {
    const contextLabel = await repeatedContext.locator("b").textContent();
    if (!contextLabel?.includes("上一问")) throw new Error("continued answer context must be visibly labeled as the previous question");
  }
}

async function click(page, selector, index = 0) {
  await drainDialogue(page, {});
  const target = page.locator(`${selector}:visible`).nth(index);
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

async function assertPixelPortrait(page, chapter) {
  const portrait = page.locator(".case-portrait.art-pixel img").first();
  await portrait.waitFor({ state: "visible" });
  const state = await portrait.evaluate((element) => ({
    src: element.getAttribute("src") ?? "",
    imageRendering: getComputedStyle(element).imageRendering
  }));
  const portraitStem = ({ 1: "caller_credit", 2: "caller_salon", 3: "caller_profile", 4: "caller_work" })[chapter];
  if (!["neutral", "guarded", "pause"].some((kind) => state.src.includes(`${portraitStem}_${kind}_pixel.png`))) {
    throw new Error(`case-${chapter} live call must start from one of the authored pixel portrait states`);
  }
  if (state.imageRendering !== "pixelated") {
    throw new Error(`case-${chapter} pixel portrait must use nearest-neighbor rendering, got ${state.imageRendering}`);
  }
}

async function collectPortraitAsset(page, assets) {
  if (!assets) return;
  const src = await page.locator(".case-portrait img:visible").first().getAttribute("src").catch(() => "");
  if (src) assets.add(src);
}

async function keyboardActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await page.waitForTimeout(120);
  await target.focus();
  const focused = await target.evaluate((element) => document.activeElement === element);
  if (!focused) throw new Error(`keyboard target did not keep focus: ${selector}`);
  await target.press("Enter");
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
    window.dispatchEvent(new Event("gamepadconnected"));
  });
  await page.waitForTimeout(500);
}

async function gamepadPress(page, buttonIndex) {
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = true;
  }, buttonIndex);
  await waitForAnimationFrames(page, 3);
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = false;
  }, buttonIndex);
  await waitForAnimationFrames(page, 2);
}

async function waitForAnimationFrames(page, count) {
  await page.evaluate((frameCount) => new Promise((resolveFrame) => {
    let elapsed = 0;
    const advance = () => {
      elapsed += 1;
      if (elapsed >= frameCount) resolveFrame();
      else requestAnimationFrame(advance);
    };
    requestAnimationFrame(advance);
  }), count);
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
  const matches = page.getByText(text);
  for (let index = 0; index < await matches.count(); index += 1) {
    if (await matches.nth(index).isVisible().catch(() => false)) return;
  }
  throw new Error(message);
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

async function assertNightState(page, predicate, message) {
  const night = await page.evaluate(() => {
    const raw = window.localStorage?.getItem("livestream-detective-save-v1");
    const save = raw ? JSON.parse(raw) : {};
    const nights = save.caseNights ?? {};
    return Object.values(nights)[0] ?? {};
  });
  if (!predicate(night)) {
    throw new Error(`${message}: ${JSON.stringify(night)}`);
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
