import { chromium } from "@playwright/test";
import { access, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { splitDialogueSentences } from "../src/runtime/dialoguePresentation.js";
import { testimonyReadingRoute } from "./lib/testimony-reading.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = process.env.SMOKE_URL || pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const storyManifest = JSON.parse(await readFile(resolve(root, "content", "packs", "steam-demo-01", "manifest.json"), "utf8"));
const authoredCasePackets = await Promise.all((storyManifest.sequence ?? []).map((item) => (
  readFile(resolve(root, "content", "packs", "steam-demo-01", "cases", `${item.caseId}.json`), "utf8").then(JSON.parse)
)));
const testimonySmokeActs = authoredCasePackets.flatMap((packet) => (packet.sceneVersions ?? []).flatMap((scene) => (
  (scene.testimonyWall?.acts ?? []).map((act, actIndex) => ({
    reading: testimonyReadingRoute(scene)[actIndex],
    caseId: packet.id ?? packet.caseId ?? "unknown-case",
    sceneId: scene.id ?? "unknown-scene",
    actId: act.id ?? `act-${act.act ?? "unknown"}`,
    evidenceId: act.decisivePresent?.evidenceId ?? "",
    statementId: act.decisivePresent?.statementId ?? "",
    statementIds: (act.statements ?? []).map((statement) => statement.id).filter(Boolean)
  }))
))).filter((act) => act.evidenceId && act.statementId && act.statementIds.length);
const continuousReading = (await readFile(resolve(root, "docs/generated/steam-demo-01-continuous-story-script.md"), "utf8")).split("# 附录｜")[0];
const verifiedTestimonyActs = new Set();
const loadBearingQuestionSignatures = authoredCasePackets.flatMap((packet) => (packet.sceneVersions ?? []).flatMap((scene) => (
  (scene.questionOptions ?? [])
    .filter((option) => option.correct === true)
    .flatMap((option) => [option.sourceAnchor, option.revisedSourceAnchor]
      .filter(Boolean)
      .map((anchor) => ({ anchor, label: option.suspicionLabel ?? option.question ?? "" })))
)));
const caseOneMaterialMissDrift = String(authoredCasePackets.find((packet) => packet.caseId === "01-credit")?.driftComments?.[0] ?? "")
  .split(":")
  .slice(1)
  .join(":");
const routes = [
  { name: "accounting-support", sceneMode: "core", materialMode: "hit", dayScenes: ["day-accounting", "day-support-payments"], dayChoices: { "day-support-payments": "ask-rent-home" }, dayChoiceText: { "day-support-payments": "住房租赁支出旁" }, opener: "两个月一次的房租", openerText: "是我住的", callerQuestion: "not-your-debt", callerQuestionHost: "soothe" },
  { name: "document-r08-r11", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r08", "r11"], opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "document-trust-rows", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r13", "r14", "r15"], opener: "流水圈注", openerText: "这二十万，他以前跟你提过吗", callerQuestion: "dont-answer-for-her" },
  { name: "support-document", sceneMode: "outer", materialMode: "hit", dayScenes: ["day-support-payments", "day-bank-flow"], dayChoices: { "day-support-payments": "compare-rent-transfer" }, dayChoiceText: { "day-support-payments": "并排标了出来" }, documentRows: ["r08", "r11"], opener: "房租是不是另外付的", openerText: "房租算在每月一万七千五里面吗", callerQuestion: "dont-answer-for-her" },
  { name: "material-miss-accounting-support", sceneMode: "core", materialMode: "miss", dayScenes: ["day-accounting", "day-support-payments"], dayChoices: { "day-support-payments": "ask-rent-home" }, opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "keyboard-accounting-support", sceneMode: "core", materialMode: "hit", inputMode: "keyboard", dayScenes: ["day-accounting", "day-support-payments"], dayChoices: { "day-support-payments": "ask-rent-home" }, opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "gamepad-support-document", sceneMode: "core", materialMode: "hit", inputMode: "gamepad", dayScenes: ["day-support-payments", "day-bank-flow"], dayChoices: { "day-support-payments": "compare-rent-transfer" }, documentRows: ["r08", "r11"], opener: "房租是不是另外付的", openerText: "房租算在每月一万七千五里面吗", callerQuestion: "dont-answer-for-her" }
];
const supportedSmokeTargets = new Set([
  "all",
  "local-quick",
  "case34",
  "case1",
  "gamepad",
  "case2-transition",
  "case-transition",
  "host-verdict",
  "portrait-viewports",
  "state-replacement",
  "reading-controls",
  "testimony-reading",
  "focused-credit",
  "six-review",
  "script-reading",
  "credit-replay",
  "credit-replay-path",
  "quick-detective",
  "dialogue-layout",
  "cafe-prologue"
]);
const smokeStepTimeoutMs = Math.max(1000, Number(process.env.SMOKE_STEP_TIMEOUT_MS) || 180000);
const browserActionTimeoutMs = Math.max(1000, Number(process.env.SMOKE_ACTION_TIMEOUT_MS) || 8000);
const gamepadDialogueSamples = new WeakMap();
const gamepadDialogueSampleLimit = 4;
const smokeStartedAt = Date.now();
const smokeTarget = smokeTargetFrom(process.argv.slice(2), process.env.SMOKE_TARGET);

smokeProgress(`TARGET ${smokeTarget}`);
const browser = await runSmokeStep("browser launch", launchBrowser);
try {
  if (smokeTarget === "case34") {
    await runCase3DayRoutes();
    await runCase4DayRoutes();
  } else if (smokeTarget === "case1" || smokeTarget === "local-quick") {
    await runSmokeStep("focused credit route", runFocusedCredit);
  } else if (smokeTarget === "gamepad") {
    await runSmokeStep("route 1/1 gamepad-support-document", () => runRoute(routes.find((route) => route.inputMode === "gamepad")));
  } else if (smokeTarget === "case-transition") {
    await runSmokeStep("case transition", runCaseTransition);
  } else if (smokeTarget === "case2-transition") {
    await runCase2DayMap();
    await runSmokeStep("case transition", runCaseTransition);
  } else if (smokeTarget === "host-verdict") {
    await runSmokeStep("host verdict viewport matrix", runHostVerdictPresentation);
  } else if (smokeTarget === "portrait-viewports") {
    await runSmokeStep("portrait viewport matrix", runPortraitViewports);
  } else if (smokeTarget === "state-replacement") {
    await runSmokeStep("state replacement", runStateReplacementRoutes);
  } else if (smokeTarget === "reading-controls") {
    await runSmokeStep("reading controls", runReadingControls);
  } else if (smokeTarget === "six-review") {
    await runSmokeStep("six reviewed cases", runSixReviewedCases, { timeoutMs: 600000 });
  } else if (smokeTarget === "focused-credit") {
    await runSmokeStep("focused credit route", runFocusedCredit);
  } else if (smokeTarget === "testimony-reading") {
    await runSmokeStep("testimony reading parity", runTestimonyReadingMatrix, { timeoutMs: Math.max(smokeStepTimeoutMs, 600000) });
  } else if (smokeTarget === "credit-replay-path") {
    await runSmokeStep("focused credit route", runFocusedCredit);
  } else if (smokeTarget === "credit-replay") {
    await runSmokeStep("focused credit recovery", runFocusedCredit);
  } else if (smokeTarget === "script-reading") {
    await runSmokeStep("script and rendered dialogue parity", runScriptReadingMatrix);
  } else if (smokeTarget === "quick-detective") {
    await runSmokeStep("quick detective viewport matrix", runQuickDetective);
  } else if (smokeTarget === "cafe-prologue") {
    await runSmokeStep("cafe prologue viewport matrix", runCafePrologue, { timeoutMs: Math.max(smokeStepTimeoutMs, 180000) });
  } else if (smokeTarget === "dialogue-layout") {
    await runSmokeStep("dialogue nameplate and type layout", runDialogueLayout);
  } else {
    await runSmokeStep("focused credit route", runFocusedCredit);
    // Current two-night routes replace the retired day-map/row-marking fixtures.
    await runSmokeStep("six reviewed cases", runSixReviewedCases, { timeoutMs: 600000 });
    await runSmokeStep("case transition", runCaseTransition);
    await runSmokeStep("portrait viewport matrix", runPortraitViewports);
    await runSmokeStep("state replacement", runStateReplacementRoutes);
    await runSmokeStep("reading controls", runReadingControls);
    await runSmokeStep("testimony reading parity", runTestimonyReadingMatrix, { timeoutMs: Math.max(smokeStepTimeoutMs, 600000) });
    await runSmokeStep("script and rendered dialogue parity", runScriptReadingMatrix);
    await runSmokeStep("quick detective viewport matrix", runQuickDetective);
    await runSmokeStep("cafe prologue viewport matrix", runCafePrologue, { timeoutMs: Math.max(smokeStepTimeoutMs, 180000) });
  }
} finally {
  await browser.close();
}

smokeProgress(`PASS ${smokeSummary(smokeTarget)}`);
if (verifiedTestimonyActs.size) smokeProgress(`Verified testimony/readable act pairs: ${verifiedTestimonyActs.size}/${testimonySmokeActs.length}`);

function smokeTargetFrom(args, environmentTarget = "") {
  const inlineTarget = args.find((argument) => argument.startsWith("--target="))?.slice("--target=".length);
  const targetFlagIndex = args.indexOf("--target");
  const flagTarget = targetFlagIndex >= 0 ? args[targetFlagIndex + 1] : "";
  const target = String(inlineTarget || flagTarget || environmentTarget || "all").trim();
  if (!supportedSmokeTargets.has(target)) {
    throw new Error(`Unknown smoke target: ${target}. Expected one of: ${[...supportedSmokeTargets].join(", ")}`);
  }
  return target;
}

async function runReadingControls() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    window.__readingAudio = [];
    window.Audio = new Proxy(window.Audio, {
      construct(AudioClass, args) {
        const audio = new AudioClass(...args);
        window.__readingAudio.push(audio);
        return audio;
      }
    });
    window.__smokeGamepad = { connected: true, index: 0, axes: [0, 0], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) };
    Object.defineProperty(navigator, "getGamepads", { configurable: true, value: () => [window.__smokeGamepad] });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(browserActionTimeoutMs);
  try {
    await page.goto(`${playableUrl}?playtest=reading-controls-${Date.now()}`);
    await page.locator("[data-start-story]").click();
    const text = () => page.locator(".avg-page-lines").innerText();
    const first = await text();
    for (const input of ["keyboard", "gamepad"]) {
      await page.locator("[data-record-open]").click();
      await page.locator(".court-record:not([hidden])").waitFor();
      for (let index = 0; index < 8; index += 1) {
        await page.keyboard.press("Tab");
        if (!await page.evaluate(() => Boolean(document.activeElement?.closest(".court-record")))) throw new Error("court record Tab escaped overlay");
      }
      await page.locator("[data-record-close]").focus();
      if (input === "keyboard") await page.keyboard.press("Enter");
      else await gamepadPress(page, 0);
      await page.locator(".court-record").waitFor({ state: "hidden" });
      if (await text() !== first) throw new Error(`${input} confirm advanced narration behind court record`);
      if (!await page.locator("[data-record-open]").evaluate(element => element === document.activeElement)) throw new Error("court record must restore opener focus");
    }
    await page.locator('[data-avg-setting="auto"]').click();
    await page.locator("[data-record-open]").click();
    const pausedText = await text();
    // Observe a negative guarantee for longer than two autoplay intervals.
    const changedWhilePaused = await page.evaluate(() => new Promise(resolve => {
      const observer = new MutationObserver(() => { clearTimeout(timer); observer.disconnect(); resolve(true); });
      const timer = setTimeout(() => { observer.disconnect(); resolve(false); }, 2200);
      observer.observe(document.querySelector(".avg-page-lines"), { childList: true, subtree: true, characterData: true });
    }));
    if (changedWhilePaused || await text() !== pausedText) throw new Error("autoplay advanced behind court record");
    await page.keyboard.press("Escape");
    await page.waitForFunction(previous => document.querySelector(".avg-page-lines")?.innerText !== previous, pausedText);
    await page.locator('[data-avg-setting="auto"]').click();
    const resumeText = await text();
    const backlogLength = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")).dialogueBacklog.length);
    for (const setting of ["speed", "effects"]) {
      await page.locator(`[data-avg-setting="${setting}"]`).click();
      if (await text() !== resumeText) throw new Error(`${setting} reset the dialogue page`);
    }
    await page.waitForFunction(() => window.__readingAudio.some(audio => audio.loop && !audio.paused && audio.currentTime > 0 && audio.volume > 0));
    await page.locator("[data-audio-settings] > summary").click();
    await page.locator("[data-audio-mute]").click();
    if (await text() !== resumeText) throw new Error("sound toggle reset the dialogue page");
    const audibleWhileMuted = await page.evaluate(() => new Promise(resolve => {
      const audios = window.__readingAudio.filter(audio => !audio.paused);
      let audible = audios.some(audio => audio.volume !== 0);
      const inspect = event => { if (event.target.volume !== 0) audible = true; };
      audios.forEach(audio => audio.addEventListener("volumechange", inspect));
      setTimeout(() => {
        audios.forEach(audio => audio.removeEventListener("volumechange", inspect));
        resolve(audible);
      }, 500);
    }));
    if (audibleWhileMuted) throw new Error("native browser audio became audible while muted");
    await page.locator("[data-audio-settings] > summary").click();
    await page.locator("[data-audio-mute]").click();
    await page.waitForFunction(() => window.__readingAudio.some(audio => audio.loop && !audio.paused && audio.volume > 0));
    await page.locator('[data-action="title"]').click();
    await page.locator("[data-continue-story]").click();
    if (await text() !== resumeText) throw new Error("continue reset the dialogue page");
    await page.reload();
    await page.locator("[data-continue-story]").click();
    if (await text() !== resumeText) throw new Error("reload reset the dialogue page");
    const restoredBacklogLength = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")).dialogueBacklog.length);
    if (restoredBacklogLength !== backlogLength) throw new Error("restoring an already-read page duplicated the backlog");
  } finally {
    await context.close();
  }
}

function smokeSummary(target) {
  if (target === "case34") return "case3-day-map, case4-day-map";
  if (["case1", "local-quick", "credit-replay", "credit-replay-path"].includes(target)) return "case 1 focused inquiry, retry and compact closing";
  if (target === "gamepad") return "gamepad-support-document";
  if (target === "case-transition") return "case interludes, reading recovery, optional quick call and final news";
  if (target === "case2-transition") return "case2-day-map, case-transition";
  if (target === "host-verdict") return "host verdict staged at mobile and desktop widths";
  if (target === "portrait-viewports") return "portrait layouts at 390x844, 1280x720, 1366x768, 1280x800, 1920x1080";
  if (target === "state-replacement") return "new-game-reset, legacy save migration into no-penalty inquiry";
  if (target === "reading-controls") return "overlay keyboard/gamepad, autoplay pause, settings and save reading position";
  if (target === "six-review") return "reviewed main cases and quick cases: focused inquiry, sources, reload and compact endings";
  if (target === "focused-credit") return "case 1 focused inquiry, local retry, reload and compact closing";
  if (target === "testimony-reading") return "four cases / seven inquiry acts match the continuous reading";
  if (target === "script-reading") return "four cases: staged statements and answer speakers/order match director/continuous scripts";
  if (target === "credit-replay-path") return "case 1 normal path: first-night old post through second-night device evidence";
  if (target === "credit-replay") return "case 1 restaurant/device replay recovery and social evidence at four PC sizes";
  if (target === "quick-detective") return "quick detective at 1920x1080, 1366x768, 1280x720, and 1280x800";
  if (target === "dialogue-layout") return "opening dialogue: six speakers at 390x844, 592x920, 1280x720, and 1280x800";
  if (target === "cafe-prologue") return "cafe prologue, same-night continuation, and private callback at 1280x720, 1366x768, 1280x800, and 1920x1080";
  return ["four main cases", "three quick cases", "case-transition", "portrait-viewports", "new-game-reset", "legacy-save-migration", "reading-controls", "testimony-reading", "script-reading", "quick-detective", "cafe-prologue"].join(", ");
}

function smokeProgress(message) {
  const elapsedSeconds = ((Date.now() - smokeStartedAt) / 1000).toFixed(1).padStart(6, " ");
  console.log(`[browser-smoke +${elapsedSeconds}s] ${message}`);
}

async function runSmokeStep(label, action, { timeoutMs = smokeStepTimeoutMs } = {}) {
  const startedAt = Date.now();
  let timeoutId = 0;
  smokeProgress(`START ${label}`);
  try {
    const result = await Promise.race([
      action(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Smoke step timed out after ${timeoutMs}ms: ${label}`)), timeoutMs);
      })
    ]);
    smokeProgress(`PASS  ${label} (${((Date.now() - startedAt) / 1000).toFixed(1)}s)`);
    return result;
  } catch (error) {
    smokeProgress(`FAIL  ${label} (${((Date.now() - startedAt) / 1000).toFixed(1)}s)`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

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

async function currentLoadBearingStatementLine(page) {
  const visited = [];
  for (let step = 0; step < 48; step += 1) {
    await drainDialogue(page, {});
    const bill = page.locator('.statement-bill-question');
    if(await bill.count()) {
      if(!await bill.getAttribute('open')) await bill.locator('summary').click();
      return bill.locator('[data-scene-question]');
    }
    const authoredKey = page.locator('[data-statement-key-correct="true"]:visible:not(:disabled)');
    if (await authoredKey.count()) return authoredKey.first();
    const lines = page.locator("[data-scene-question]:visible:not(:disabled)");
    const texts = await lines.allTextContents();
    const index = texts.findIndex((text) => loadBearingQuestionSignatures.some(({ label }) => label && text.includes(label)));
    if (index >= 0) return lines.nth(index);
    const followups = page.locator('[data-scene-dialogue]:visible:not(:disabled)');
    if (await followups.count()) return followups.first();
    visited.push((await page.locator(".statement-replay-page .avg-line:visible").first().textContent().catch(() => ""))?.trim() ?? "");
    if (await page.locator("[data-scene-replay-restart]").count()) {
      await click(page, "[data-scene-replay-restart]");
      continue;
    }
    if (!await page.locator("[data-scene-replay-next]:visible:not(:disabled)").count()) break;
    await click(page, "[data-scene-replay-next]");
  }
  throw new Error(`current statement stage has no unresolved source-anchored line after sequential replay: ${visited.filter(Boolean).join(" | ")}`);
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

async function runQuickDetective() {
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
    { width: 1280, height: 800 }
  ]) {
    const viewportStartedAt = Date.now();
    smokeProgress(`START quick detective ${viewport.width}x${viewport.height}`);
    const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? "no-preference" : "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(browserActionTimeoutMs);
    try {
      await page.goto(`${playableUrl}?playtest=quick-statement-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      await page.locator("[data-player-name]").fill("周明");
      await click(page, "[data-start-quick-detective]");
      await assertVisibleText(page, "今晚先看哪一案", "快案入口必须先进入案件选择页");
      if (await page.locator(".quick-case-card").count() !== 3) throw new Error("快案选择页必须从 manifest 加载三宗案件");

      await playStatementQuickCase(page, viewport, {
        caseId: "01-no-conditions",
        rounds: [
          [],
          ["爸爸给了我一百万"],
          [],
          ["前任分手就因为我脾气", "先跟他说一句，我这人还可以"]
        ],
        decoyAnchor: "亲爸偶尔替人看店",
        decoyRoundIndex: 1,
        expectedListen: ["我二十四，在商场卖衣服", "好听的也不会讲"],
      });
      await click(page, "[data-quick-select]");
      if (await page.locator('.quick-case-card.is-complete[data-quick-case-id="01-no-conditions"]').count() !== 1) {
        throw new Error("首宗快案通关后必须显示完成对勾");
      }
      if (viewport.width === 390) {
        await playEarlyQuickCase(page, "01-no-conditions", "好听的也不会讲");
        await click(page, "[data-quick-select]");
      }

      await playStatementQuickCase(page, viewport, {
        caseId: "02-one-missed-message",
        rounds: [
          ["十一点五十二"],
          ["后面又有人点了一轮"],
          ["后来也解释过了"],
          ["我说很久没出去没说错"]
        ],
        decoyAnchor: "他三十五",
        decoyKind: "anchored",
        expectedListen: ["本科和硕士都在一所985高校", "十一点五十二"],
      });
      await click(page, "[data-quick-select]");
      await playStatementQuickCase(page, viewport, {
        caseId: "03-labeled-fiction",
        soloCommentary: true,
        rounds: [
          ["先看长文怎样给自己留门"],
          ["先评价女方这份回应"],
          ["先看她为什么可能想平息争议"],
          ["先评价『我手里还有』这套玩法"]
        ],
        expectedListen: ["男方是科技创业者", "女方是曾经站在流量顶端的演员", "文末却留了一句『纯属虚构』"],
      });
      await click(page, "[data-quick-select]");
      if (await page.locator(".quick-case-card.is-complete").count() !== 3) throw new Error("三宗快案通关后都必须保留完成对勾");
    } finally {
      await context.close();
    }
    smokeProgress(`PASS  quick detective ${viewport.width}x${viewport.height} (${((Date.now() - viewportStartedAt) / 1000).toFixed(1)}s)`);
  }
}

async function runDialogueLayout() {
  const directory = resolve(root, "output/playwright/dialogue-layout");
  await mkdir(directory, { recursive: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 592, height: 920 }, { width: 1280, height: 720 }, { width: 1280, height: 800 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await page.goto(playableUrl);
      await click(page, "[data-start-story]");
      await page.getByRole("button", { name: "即时文字 关", exact: true }).click();
      await page.locator(".avg-page-line b").waitFor();
      const speakers = new Set();
      let finished = false;
      for (let step = 0; step < 60; step += 1) {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const metrics = await page.locator(".avg-textbox").evaluate((box) => {
          const plate = box.querySelector(".avg-page-line b");
          const line = box.querySelector(".avg-line");
          const plateRect = plate.getBoundingClientRect();
          const lineRect = line.getBoundingClientRect();
          const boxRect = box.getBoundingClientRect();
          const buttons = [...document.querySelectorAll(".avg-system-bar button")].map((button) => button.getBoundingClientRect());
          return {
            speaker: plate.textContent, font: parseFloat(getComputedStyle(line).fontSize),
            aligned: Math.abs(plateRect.left - lineRect.left) < 2,
            textClear: plateRect.bottom <= lineRect.top && lineRect.bottom <= boxRect.bottom,
            contained: boxRect.left >= 0 && boxRect.right <= innerWidth && boxRect.bottom <= innerHeight,
            toolbarClear: buttons.every((rect) => rect.top >= boxRect.bottom && rect.bottom <= innerHeight && rect.right <= innerWidth),
            oneRow: buttons.every((rect) => Math.abs(rect.top - buttons[0].top) < 2)
          };
        });
        if (metrics.font < 18 || !metrics.aligned || !metrics.textClear || !metrics.contained || !metrics.toolbarClear || !metrics.oneRow) {
          throw new Error(`dialogue layout at ${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`);
        }
        if (!speakers.has(metrics.speaker)) {
          speakers.add(metrics.speaker);
          await page.screenshot({ path: resolve(directory, `${viewport.width}x${viewport.height}-${speakers.size}.png`) });
        }
        if (await page.locator("[data-cafe-opening-seen]:visible").count()) { finished = true; break; }
        await page.locator(".avg-textbox").click();
      }
      if (!finished || speakers.size < 6) throw new Error("the layout review must traverse the complete opening exchange");
      console.log(`dialogue layout ${viewport.width}x${viewport.height}: ${[...speakers].join(", ")}`);
    } finally {
      await context.close();
    }
  }
}

function assertAuthoredTranscript(text, lines, label) {
  // drainDialogue observes typewriter prefixes as well as completed pages.
  const samples = text.split("\n");
  const rendered = samples.filter((sample, index) => !samples[index + 1]?.startsWith(sample)).join("").replace(/\s+/g, "");
  let cursor = 0;
  for (const line of lines ?? []) {
    if (!line.text) continue;
    const expected = line.text.replace(/\s+/g, "");
    const position = rendered.indexOf(expected, cursor);
    if (position < 0) throw new Error(`${label}: missing authored turn: ${line.text}\nRendered: ${rendered}`);
    cursor = position + expected.length;
  }
}

async function runCafePrologue() {
  const prologue = storyManifest.nightShell.cafePrologue;
  for (const viewport of [
    { width: 1280, height: 720, pressureChoice: "camera-off", firstEvidence: "chat" },
    { width: 1366, height: 768, pressureChoice: "camera-off", firstEvidence: "chat" },
    { width: 1280, height: 800, pressureChoice: "camera-off", firstEvidence: "chat" },
    { width: 1920, height: 1080, pressureChoice: "camera-off", firstEvidence: "chat" }
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? "no-preference" : "reduce" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.setDefaultTimeout(browserActionTimeoutMs);
    try {
      await page.goto(`${playableUrl}?playtest=cafe-prologue-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      const gameUserSelect = await page.locator("#app").evaluate((element) => getComputedStyle(element).userSelect);
      if (gameUserSelect !== "none") throw new Error(`the game stage must prevent accidental text selection, got ${gameUserSelect}`);
      await click(page, "[data-start-story]");
      await assertVisibleText(page, "现在 · 傍晚", "the cafe negotiation must open in the present before the flashback");
      const sourceLayer = await page.locator(".cafe-prologue-dialogue").first().evaluate((element) => ({
        hidden: element.hidden,
        display: getComputedStyle(element).display
      }));
      if (!sourceLayer.hidden || sourceLayer.display !== "none") throw new Error("the cafe source transcript must stay hidden behind the one-speaker visual-novel textbox");
      const openingText = await drainDialogue(page, {});
      if (!openingText.includes("我准备离婚")) throw new Error("the husband must state the divorce request before the first tutorial action");
      if (!openingText.includes("孩子以后怎么安排")) throw new Error("the child arrangement conflict must be part of the opening negotiation");
      if (openingText.includes("哪三页") || openingText.includes("只看这三页")) throw new Error("participants must not recite the tutorial material count");
      if (await page.locator("[data-cafe-opening-seen]").count()) await click(page, "[data-cafe-opening-seen]");
      if (viewport.width === 390) {
        const phaseTransition = page.locator('.pixel-transition-phase[data-transition-variant="listen"]');
        if (await phaseTransition.count() !== 1) throw new Error("the first account must enter through the shared statement transition");
        if (await phaseTransition.locator(".statement-phase-signal i").count() !== 5) throw new Error("the statement transition must render its animated signal bars");
      }
      const firstAccountText = openingText + await drainDialogue(page, {});
      if (!firstAccountText.includes("那晚我没去澜桥酒店")) throw new Error("the first statement phase must include the wife's explicit hotel denial");
      const cafePortraitRoles = await page.locator(".cafe-negotiation-portrait[data-dialogue-portrait]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-dialogue-portrait")));
      if (cafePortraitRoles.join("|") !== "host|advisor|husband|wife|cousin") throw new Error(`cafe negotiation must keep five cross-talking portraits, got ${cafePortraitRoles.join("|")}`);
      await assertVisibleText(page, "21:18", "the material timestamp must remain readable");
      if (await page.locator("[data-cafe-statement-id], [data-cafe-evidence-select], [data-cafe-evidence-present]").count()) throw Error("cafe still requires sentence/material matching");
      await assertVisibleText(page, "入住人：妻子本人", "the right-hand hotel material must expose a readable raw booking field");
      if (await page.locator("[data-cafe-material-open]").count() < 2) throw new Error("both opening materials must open into readable originals before the first presentation");
      await click(page, '[data-cafe-material-open="hotel"]');
      await assertVisibleText(page, "预订记录", "opening the hotel material must show a readable document view");
      const cafeMaterialMetrics = await page.locator(".cafe-material-sheet").evaluate((element) => {
        const panel = element.getBoundingClientRect();
        const close = element.querySelector("header [data-cafe-material-close]")?.getBoundingClientRect();
        return {
          width: panel.width,
          height: panel.height,
          closeWidth: close?.width ?? 0,
          closeHeight: close?.height ?? 0,
          viewportWidth: innerWidth,
          viewportHeight: innerHeight
        };
      });
      if (cafeMaterialMetrics.width < Math.min(360, cafeMaterialMetrics.viewportWidth - 20)
        || cafeMaterialMetrics.height < cafeMaterialMetrics.viewportHeight * .72) {
        throw new Error(`cafe material original is too small at ${viewport.width}px: ${cafeMaterialMetrics.width.toFixed(1)}x${cafeMaterialMetrics.height.toFixed(1)}`);
      }
      if (cafeMaterialMetrics.closeWidth < 112 || cafeMaterialMetrics.closeHeight < 44) {
        throw new Error(`cafe material close control is too small: ${cafeMaterialMetrics.closeWidth.toFixed(1)}x${cafeMaterialMetrics.closeHeight.toFixed(1)}`);
      }
      await page.keyboard.press("Escape");
      if (await page.locator(".cafe-material-modal:not([hidden])").count()) throw new Error("Escape must close the cafe material original");
      await assertNoPageText(page, "遮名银行流水", "the transfer evidence must stay off the table until the hotel exchange ends");
      for (const banned of ["教学 ·", "两边都会查", "依次点击两张材料确认", "先核她刚才那句"]) {
        await assertNoPageText(page, banned, `the cafe loop must not expose instruction copy: ${banned}`);
      }
      if (await page.locator(".cafe-prologue-screen .avg-choice-overlay.modal-choice-flow").count()) {
        throw new Error("the opening material dock must not dim the cafe with a modal-choice mask");
      }
      const openingLayers = await page.evaluate(() => {
        const textbox = document.querySelector(".cafe-prologue-screen .avg-textbox")?.getBoundingClientRect();
        const action = document.querySelector(".cafe-opening-action")?.getBoundingClientRect();
        return { textboxBottom: textbox?.bottom ?? 0, actionTop: action?.top ?? 0 };
      });
      const openingGap = openingLayers.actionTop - openingLayers.textboxBottom;
      if (openingLayers.actionTop && openingGap < 8) {
        throw new Error(`the material dock overlaps or crowds the dialogue box at ${viewport.width}px: ${openingGap.toFixed(1)}px gap`);
      }
      await assertCafeViewport(page, viewport, "cafe opening");
      const cafeBackdrop = await page.locator(".visual-scene").evaluate((element) => getComputedStyle(element).backgroundImage);
      if (!cafeBackdrop.includes("cafe_date")) throw new Error(`${viewport.width} cafe prologue must use the authored cafe background`);

      for (const [roundIndex, round] of prologue.cafe.inquiries.entries()) {
        const wrong = round.options.find(option => !option.correct);
        const correct = round.options.find(option => option.correct);
        await click(page, `[data-cafe-inquiry="${wrong.id}"]`);
        assertAuthoredTranscript(await drainDialogue(page, {}), [{role:"host",text:wrong.question}, ...wrong.lines], "cafe wrong inquiry");
        await click(page, '[data-cafe-inquiry-retry]');
        await page.reload(); await click(page, '[data-continue-story]');
        if (await page.locator('[data-dialogue-advance]').count()) throw Error('cafe retry replayed the opening');
        await assertCafeViewport(page, viewport, `cafe round ${roundIndex + 1} retry`);
        await click(page, `[data-cafe-inquiry="${correct.id}"]`);
        if (!roundIndex) {
          const firstAnswerText = await drainDialogue(page, {});
          assertAuthoredTranscript(firstAnswerText, [{role:"host",text:correct.question}, ...correct.lines], 'cafe first answer');
          if (await page.locator('[data-cafe-revision-seen]').count()) await click(page, '[data-cafe-revision-seen]');
          assertAuthoredTranscript(firstAnswerText + await drainDialogue(page, {}), prologue.cafe.revisedAccountLines, 'cafe revised account');
          await assertVisibleText(page, "4 月 12 日｜转出｜顾*", "second inquiry needs the transfer original");
        }
      }
      const legalText = await drainDialogue(page, {});
      assertAuthoredTranscript(legalText, prologue.cafe.legalClaimLines, "cafe negotiation");
      if (!legalText.includes("把家里的账查清")) throw Error("the husband must state the financial demand before parentage");
      await assertCafeViewport(page, viewport, "legal request board");
      if (await page.locator("[data-cafe-legal-brief]").count()) await click(page, "[data-cafe-legal-brief]");
      // The old third-discussion step remains a valid recording exit.
      await page.reload();
      await click(page, '[data-continue-story]');
      const closingText = legalText + await drainDialogue(page, {});
      if (/鉴定|个人委托|敢不敢/.test(closingText)) throw new Error('the table must close without a third parentage inquiry');
      assertAuthoredTranscript(closingText, prologue.cafe.cameraBreakLines, "recording dispute");
      if (closingText.includes("礼物") || closingText.includes("直播间") || closingText.includes("停播")) throw new Error("the cafe is a pre-recorded negotiation and must not expose live-gifting language");
      await assertCafeViewport(page, viewport, "recording pressure choices");
      await click(page, `[data-cafe-pressure="${viewport.pressureChoice}"]`);
      const aftermathText = await drainDialogue(page, {});
      assertAuthoredTranscript(aftermathText, prologue.aftermath.openingLines, "cafe aftermath");

      await assertCafeViewport(page, viewport, "investigation order choices");
      await click(page, "[data-cafe-aftermath-next]");
      for (const [index, route] of prologue.aftermath.routes.entries()) {
        if (await page.locator("[data-cafe-investigation]").count()) throw new Error("cafe investigation still branches");
        const routeText = await drainDialogue(page, {});
        assertAuthoredTranscript(routeText, [...route.lines, ...route.handoffLines], `cafe route ${route.id}`);
        await assertCafeViewport(page, viewport, `sequential investigation ${index + 1}`);
        await page.reload();
        await click(page, "[data-continue-story]");
        await click(page, "[data-cafe-aftermath-next]");
      }
      const nightScene = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}").scene ?? "");
      if (nightScene !== "nightShellPrologue") throw new Error(`${viewport.width} cafe opening must hand off to the night prologue, got ${nightScene}`);
      await assertVisibleText(page, "两年前", "the first case must explicitly enter a flashback");
      await click(page, "[data-enter-first-flashback]");
      const nightPrelude = await drainDialogue(page, {});
      if (!nightPrelude.includes("你推开直播间的门")) throw new Error(`${viewport.width} the night cold open must follow the cafe tutorial`);
      await page.evaluate(() => {
        const storageKey = "livestream-detective-save-v1";
        const save = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
        const lastIndex = Math.max(0, (save.caseBriefs ?? []).length - 1);
        save.screen = "chapter";
        save.chapter = lastIndex + 1;
        save.caseBrief = save.caseBriefs?.[lastIndex] ?? null;
        save.solvedCaseIds = (save.caseBriefs ?? []).map((brief) => brief.id);
        save.scene = "nightShellEpilogue";
        save.epilogueUnreadStep = 6;
        localStorage.setItem(storageKey, JSON.stringify(save));
      });
      await page.reload();
      await click(page, "[data-continue-story]");
      await click(page, "[data-finish-night-shell]");
      const forensicText = await drainDialogue(page, {});
      assertAuthoredTranscript(forensicText, [...prologue.forensic.openingLines, ...prologue.forensic.accountClueLines], "both private callbacks");
      await assertVisibleText(page, "结果只到这里", "the cafe prologue must end on a fact boundary rather than a victory card");
      await assertCafeViewport(page, viewport, "private callback ending");
      const savedProgress = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}");
        return {
          pressureChoice: save.cafeProloguePressureChoice,
          order: save.cafePrologueOrder,
          legalBriefSeen: save.cafePrologueLegalBriefSeen,
          statementId: save.cafePrologueStatementId,
          evidenceId: save.cafePrologueEvidenceId,
          marks: save.cafePrologueMarks
        };
      });
      if (!savedProgress.legalBriefSeen
        || savedProgress.pressureChoice !== viewport.pressureChoice
        || !savedProgress.marks?.includes(viewport.firstEvidence)
        || !savedProgress.marks?.includes("parallel-transfer-ledger")
        || JSON.stringify(savedProgress.order) !== JSON.stringify(prologue.aftermath.routes.map(route => route.id))) {
        throw new Error(`${viewport.width} cafe choices must survive state writes: ${JSON.stringify(savedProgress)}`);
      }
      await click(page, "[data-cafe-finish]");
      for (const caption of ["故事未完待续", "维护基本的道德底线是每个人都应该做的", "主播将在正式版归来继续主持公道！"]) await page.getByText(caption, { exact: true }).waitFor({ state: "visible", timeout: 20000 });
      smokeProgress(`PASS cafe ${viewport.width}x${viewport.height}: both investigations, saved progress, both callbacks and three credits`);
    } finally {
      await context.close();
    }
  }
}

async function assertCafeViewport(page, viewport, label) {
  const layout = await page.evaluate(() => {
    const screen = document.querySelector(".cafe-prologue-screen");
    const textbox = screen?.querySelector(".avg-textbox");
    const overlay = screen?.querySelector(".avg-choice-overlay.inline-choice-flow:not([hidden])");
    const board = overlay?.querySelector(".cafe-opening-action, .cafe-statement-board, .cafe-evidence-board, .cafe-present-board, .cafe-legal-board");
    const rawTextboxRect = textbox?.getBoundingClientRect();
    const textboxRect = rawTextboxRect && rawTextboxRect.width > 0 && rawTextboxRect.height > 0 ? rawTextboxRect : null;
    const overlayRect = overlay?.getBoundingClientRect();
    const boardRect = board?.getBoundingClientRect();
    const screenRect = screen?.getBoundingClientRect();
    const dialogueCard = screen?.querySelector(".dialogue-card.avg-dialogue-active");
    const actionSelector = [
      "[data-cafe-inquiry]",
      "[data-cafe-inquiry-retry]",
      "[data-cafe-statement-id]",
      "[data-cafe-opening-seen]",
      "[data-cafe-revision-seen]",
      "[data-cafe-evidence-select]",
      "[data-cafe-evidence-present]:not(:disabled)",
      "[data-cafe-material-open]",
      "[data-cafe-revised-present]:not(:disabled)",
      "[data-cafe-legal-brief]",
      "[data-cafe-pressure]",
      "[data-cafe-aftermath-next]",
      "[data-cafe-investigation]",
      "[data-cafe-enter-night]:not(:disabled)",
      "[data-cafe-finish]"
    ].join(",");
    const actionRects = Array.from(screen?.querySelectorAll(actionSelector) ?? [])
      .map((button) => button.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    const pressureRects = Array.from(screen?.querySelectorAll("[data-cafe-pressure]") ?? [])
      .map((button) => button.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cards: screen?.querySelectorAll(".dialogue-card").length ?? 0,
      visibleChoices: actionRects.length,
      dialogueGap: textboxRect && overlayRect ? overlayRect.top - textboxRect.bottom : null,
      dialogueWidthRatio: textboxRect && screenRect ? textboxRect.width / Math.max(1, screenRect.width) : null,
      dialoguePaddingBottom: dialogueCard ? getComputedStyle(dialogueCard).paddingBottom : null,
      openingAction: Boolean(overlay?.querySelector(".cafe-opening-action")),
      boardWidthRatio: boardRect && overlayRect ? boardRect.width / Math.max(1, overlayRect.width) : null,
      actionBottomOverflow: actionRects.length ? Math.max(...actionRects.map((rect) => rect.bottom - window.innerHeight)) : null,
      actionHorizontalOverflow: actionRects.length
        ? Math.max(...actionRects.map((rect) => Math.max(0, -rect.left, rect.right - window.innerWidth)))
        : null,
      pressureWidthSpread: pressureRects.length > 1
        ? Math.max(...pressureRects.map((rect) => rect.width)) - Math.min(...pressureRects.map((rect) => rect.width))
        : null,
      pressureHeightSpread: pressureRects.length > 1
        ? Math.max(...pressureRects.map((rect) => rect.height)) - Math.min(...pressureRects.map((rect) => rect.height))
        : null
    };
  });
  if (layout.overflow > 2) throw new Error(`${viewport.width} ${label} overflows horizontally by ${layout.overflow}px`);
  if (layout.cards !== 1) throw new Error(`${viewport.width} ${label} must keep one readable dialogue card`);
  if (layout.visibleChoices < 1) throw new Error(`${viewport.width} ${label} must keep the next player action visible`);
  if (layout.dialogueGap !== null && layout.dialogueGap < 8) throw new Error(`${viewport.width} ${label} crowds the dialogue box with a ${layout.dialogueGap.toFixed(1)}px gap (padding ${layout.dialoguePaddingBottom})`);
  if (layout.dialogueWidthRatio !== null && layout.dialogueWidthRatio < 0.75) throw new Error(`${viewport.width} ${label} squeezes the dialogue box to ${(layout.dialogueWidthRatio * 100).toFixed(0)}% of the stage`);
  const minimumBoardWidth = layout.openingAction ? 0.68 : 0.8;
  if (layout.boardWidthRatio !== null && layout.boardWidthRatio < minimumBoardWidth) throw new Error(`${viewport.width} ${label} squeezes its material board to ${(layout.boardWidthRatio * 100).toFixed(0)}% of the choice layer`);
  if (layout.actionBottomOverflow !== null && layout.actionBottomOverflow > 2) throw new Error(`${viewport.width} ${label} pushes an action ${layout.actionBottomOverflow.toFixed(1)}px below the viewport`);
  if (layout.actionHorizontalOverflow !== null && layout.actionHorizontalOverflow > 2) throw new Error(`${viewport.width} ${label} pushes an action ${layout.actionHorizontalOverflow.toFixed(1)}px outside the viewport`);
  if (layout.pressureWidthSpread !== null && layout.pressureWidthSpread > 2) throw new Error(`${viewport.width} ${label} gives the recording choices unequal widths (${layout.pressureWidthSpread.toFixed(1)}px apart)`);
  if (layout.pressureHeightSpread !== null && layout.pressureHeightSpread > 2) throw new Error(`${viewport.width} ${label} gives the recording choices unequal heights (${layout.pressureHeightSpread.toFixed(1)}px apart)`);
}

async function playEarlyQuickCase(page, caseId, anchor) {
  await click(page, `[data-quick-case-id="${caseId}"]`);
  await click(page, "[data-quick-begin]");
  await advanceQuickLine(page, "[data-quick-next-turn]");
  await clickQuickSourceLine(page, anchor);
  await finishQuickConfrontation(page);
  if (await page.locator(".quick-scene-transcript").count()) {
    await advanceQuickLine(page, "[data-quick-next-turn]");
  }
  await page.locator("[data-quick-end-early]").waitFor({ state: "visible" });
  await assertVisibleText(page, "先收麦", "快案抓到一个关键矛盾后必须允许提前收麦");
  await click(page, "[data-quick-end-early]");
  while (!await page.locator(".quick-ending-actions").count()) {
    await advanceQuickLine(page, "[data-quick-next-verdict]");
  }
  await assertVisibleText(page, "暂不替她介绍", "提前收案必须落到已知信息不足的结论");
}

async function playStatementQuickCase(page, viewport, { caseId, rounds, decoyAnchor, decoyRoundIndex = 0, decoyKind = "no-clue", expectedListen, alreadySelected = false, soloCommentary = false }) {
  const authored = JSON.parse(await readFile(resolve(root, "content", "packs", "steam-demo-01", "quick-cases", `${caseId}.json`), "utf8"));
  if (authored.focusedInquiry) return playFocusedQuickCase(page, viewport, authored, alreadySelected);
  const expectedVerdict = authored.ending.summaryPages.flatMap((page) => page.lines.map((line) => line.text));
  if (!alreadySelected) await click(page, `[data-quick-case-id="${caseId}"]`);
  await assertVisibleText(page, "周明", "快案必须显示玩家保存的主播姓名");
  await assertNoPageText(page, "这次怎么玩", "快案入口不得解释内部机制");
  await click(page, "[data-quick-begin]");

  let verdictText = "";
  for (const [roundIndex, anchors] of rounds.entries()) {
    const listenText = [await drainDialogue(page, {}), ...await page.locator("[data-quick-dialogue-box] .avg-line").allTextContents()].join("\n");
    await assertQuickLayout(page, viewport, `${caseId} round ${roundIndex + 1} listen`, soloCommentary ? "host" : "caller", soloCommentary ? 1 : 2);
    if (roundIndex === 0) {
      for (const text of expectedListen) if (!listenText.includes(text)) throw new Error(`${caseId} 首次阅读漏播：${text}`);
    }
    await assertVisibleText(page, soloCommentary ? "READ 长文" : "监听", soloCommentary ? "口播材料必须点亮长文状态" : "首次整段陈述必须点亮监听状态");
    if (roundIndex === 0 && viewport.width === 592) {
      await page.locator("[data-quick-next-turn]:visible").waitFor({ state: "visible" });
      await page.keyboard.press("Enter");
      await page.locator(".quick-scene-issueSelection").waitFor({ state: "visible" });
    } else {
      await advanceQuickLine(page, "[data-quick-next-turn]");
    }
    if (soloCommentary && await page.locator(".quick-scene-confrontation").count()) {
      if (authored.disclosureRounds[roundIndex].issueOptionIds.length !== 1) throw new Error("口播有多个角度时不得跳过选择");
      await finishQuickConfrontation(page);
      continue;
    }
    if ((authored.disclosureRounds[roundIndex].autoConfrontationIds ?? []).length) {
      await assertVisibleText(page, "连线继续", "普通交流直接接在陈述后，不要求寻找矛盾");
      await assertNoPageText(page, "LINE 打断", "普通接话不应显示打断状态");
      const directory = resolve(root, "output/playwright/focused-inquiry");
      await mkdir(directory, { recursive: true });
      await page.locator("[data-quick-dialogue-box]").click();
      await page.screenshot({ path: resolve(directory, `${caseId}-conversation-${roundIndex}-${viewport.width}x${viewport.height}.png`), animations: "disabled" });
      await finishQuickConfrontation(page);
      if (!anchors.length) continue;
    }
    await page.locator("[data-quick-review-line]").first().waitFor({ state: "visible" });
    await assertVisibleText(page, soloCommentary ? "PAUSE 评议" : "REC 回放", soloCommentary ? "口播暂停点必须进入主播评议状态" : "找问题时必须切换为逐句回放状态");
    await assertNoPageText(page, "先问哪件事", "回放不得退回抽象问题方向菜单");
    await assertNoPageText(page, "只选怀疑的方向", "回放不得添加操作教程");
    if (roundIndex === decoyRoundIndex && decoyAnchor) {
      await clickQuickSourceLine(page, decoyAnchor);
      await page.locator(".quick-scene-missReaction").waitFor({ state: "visible" });
      await assertVisibleText(page, "询问这句", "误问也必须先播放实际问题");
      if (await page.locator(".quick-miss-bubble").getAttribute("data-quick-speaking") !== "host") throw new Error("误问首句必须是主播问话");
      await assertQuickLayout(page, viewport, `${caseId} miss question`, "host");
      await advanceQuickLine(page, "[data-quick-after-miss]");
      if (await page.locator(".quick-miss-bubble").getAttribute("data-quick-speaking") !== "caller") throw new Error("问句之后必须是来电人回应");
      await assertQuickLayout(page, viewport, `${caseId} miss response`, "caller");
      const captureDirectory = resolve(root, "output/playwright/script-review-repairs");
      await mkdir(captureDirectory, { recursive: true });
      await page.locator(".quick-miss-bubble").click();
      await page.screenshot({ path: resolve(captureDirectory, `${caseId}-miss-${viewport.width}x${viewport.height}.png`), animations: "disabled" });
      const missText = (await page.locator(".quick-miss-bubble").getAttribute("data-quick-line-text"))?.trim() ?? "";
      if (!missText) throw new Error("快案错误原句必须显示来电人或主播的具体反应");
      await advanceQuickLine(page, "[data-quick-after-miss]");
      await page.locator(".quick-scene-issueSelection").waitFor({ state: "visible" });
      await assertVisibleText(
        page,
        decoyKind === "anchored" ? "这个问法被挡回来了 · 耐心 −1" : "这句没有可追问的线索 · 耐心 −1",
        decoyKind === "anchored" ? "有锚点的社会性错选必须标成问法被挡回，不能再伪装成无线索" : "错误原句只做局部反馈，不讲解答案"
      );
    }
    if (soloCommentary) {
      for (const callerState of ["来电人还在", "来电人发来", "刚接进来", "你会让主播先说什么"]) {
        await assertNoPageText(page, callerState, "独白模式不得沿用虚构来电状态或第三人称操作提示");
      }
    }
    for (const anchor of anchors) {
      await clickQuickSourceLine(page, anchor);
      await assertVisibleText(page, soloCommentary ? "主播点评" : "LINE 打断", soloCommentary ? "选择切口后必须进入主播点评" : "按中原句以后必须切到短问打断状态");
      await finishQuickConfrontation(page);
      if (await page.locator(".quick-scene-issueSelection").count()) {
        await page.locator("[data-quick-review-line]").first().waitFor({ state: "visible" });
      }
    }
  }

  await page.locator(".quick-scene-verdict").waitFor({ state: "visible" });
  while (!await page.locator(".quick-ending-actions").count()) {
    const box = page.locator("[data-quick-dialogue-box]");
    verdictText += ` ${(await box.getAttribute("data-quick-line-text")) ?? ""}`;
    if (!await page.locator("[data-quick-next-verdict]:visible").count()) await box.click();
    if (await page.locator("[data-quick-next-verdict]:visible").count()) {
      await click(page, "[data-quick-next-verdict]");
    } else {
      await page.locator(".quick-ending-actions").waitFor({ state: "visible" });
    }
  }
  verdictText += ` ${(await page.locator("[data-quick-dialogue-box]").getAttribute("data-quick-line-text")) ?? ""}`;
  let verdictCursor = 0;
  for (const text of expectedVerdict) {
    const at = verdictText.indexOf(text, verdictCursor);
    if (at < 0) throw new Error(`${caseId} verdict omitted or reordered authored line: ${text}`);
    verdictCursor = at + text.length;
  }
}

async function clickQuickSourceLine(page, anchor) {
  if(await page.locator('[data-quick-replay-next]').count()) {
    for(let n=0;n<40;n++) {
      if((await page.locator('.quick-replay-quote').innerText()).includes(anchor)) {
        await page.locator('[data-quick-review-line]').click();return;
      }
      await page.locator('[data-quick-replay-next]').click();
    }
    throw Error(`quick replay source unavailable: ${anchor}`);
  }
  const line = page.locator("[data-quick-review-line]:visible").filter({ hasText: anchor }).first();
  await line.waitFor({ state: "visible" });
  await line.click();
}

async function finishQuickConfrontation(page) {
  while (await page.locator(".quick-scene-confrontation").count()) {
    await advanceQuickLine(page, "[data-quick-next-confrontation]");
  }
}

async function assertQuickLayout(page, viewport, label, expectedRole, expectedPortraitCount = 2) {
  const layout = await page.evaluate(() => {
    const shellRect = document.querySelector("[data-live-shell]")?.getBoundingClientRect();
    const stageRect = document.querySelector("[data-live-stage]")?.getBoundingClientRect();
    const actionRects = Array.from(document.querySelectorAll(".quick-detective-screen button:not([hidden]):not(:disabled)"))
      .map((button) => button.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      portraitCount: document.querySelectorAll(".quick-stage-speaker img").length,
      activePortraitCount: document.querySelectorAll(".quick-stage-speaker.is-active").length,
      stageFocus: document.querySelector(".quick-duel-stage")?.dataset.quickStageFocus ?? "",
      speakingRole: document.querySelector(".quick-single-bubble")?.dataset.quickSpeaking ?? "",
      lineCount: document.querySelectorAll(".quick-exchange .avg-page-line").length,
      legacyControlCount: document.querySelectorAll("[data-quick-quote], [data-quick-reveal-crowd], [data-quick-next-crowd]").length,
      shellWidth: shellRect?.width ?? 0,
      stageWidth: stageRect?.width ?? 0,
      stageLeftGap: shellRect && stageRect ? stageRect.left - shellRect.left : null,
      actionBottomOverflow: actionRects.length ? Math.max(...actionRects.map((rect) => rect.bottom - window.innerHeight)) : null
    };
  });
  if (layout.overflow > 2) throw new Error(`${viewport.width}x${viewport.height} quick ${label} overflows horizontally by ${layout.overflow}px`);
  if (layout.portraitCount !== expectedPortraitCount) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must keep exactly ${expectedPortraitCount} portrait(s)`);
  if (layout.activePortraitCount !== 1) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must highlight exactly one portrait`);
  if (layout.lineCount !== 1) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must show exactly one current speech bubble`);
  if (expectedRole && (layout.stageFocus !== expectedRole || layout.speakingRole !== expectedRole)) {
    throw new Error(`${viewport.width}x${viewport.height} quick ${label} focus ${layout.stageFocus}/${layout.speakingRole} does not match ${expectedRole}`);
  }
  if (viewport.width <= 860 && (layout.stageWidth < layout.shellWidth - 2 || Math.abs(layout.stageLeftGap ?? 0) > 2)) {
    throw new Error(`${viewport.width}x${viewport.height} quick ${label} keeps a desktop side column (${Math.round(layout.stageWidth)}/${Math.round(layout.shellWidth)}px)`);
  }
  if (layout.actionBottomOverflow !== null && layout.actionBottomOverflow > 2) {
    throw new Error(`${viewport.width}x${viewport.height} quick ${label} pushes the current action ${layout.actionBottomOverflow.toFixed(1)}px below the viewport`);
  }
  if (layout.legacyControlCount) throw new Error(`${viewport.width}x${viewport.height} quick ${label} still renders retired crowd or quote controls`);
}

async function advanceQuickLine(page, selector, expectedNextRole = "") {
  const box = page.locator("[data-quick-dialogue-box]");
  const currentRole = await box.getAttribute("data-quick-speaking");
  if (expectedNextRole && currentRole === expectedNextRole) return;
  const autoPair = await box.getAttribute("data-quick-auto-pair");
  if (autoPair === "true" && expectedNextRole) {
    await page.locator(`[data-quick-dialogue-box][data-quick-speaking="${expectedNextRole}"]`).waitFor({ state: "visible" });
    return;
  }
  if (!await page.locator(`${selector}:visible`).count()) {
    await box.click();
    if (autoPair === "true") {
      if (expectedNextRole) {
        await page.locator(`[data-quick-dialogue-box][data-quick-speaking="${expectedNextRole}"]`).waitFor({ state: "visible" });
      } else {
        await page.waitForFunction((role) => document.querySelector("[data-quick-dialogue-box]")?.dataset.quickSpeaking !== role, currentRole);
      }
      return;
    }
  }
  await click(page, selector);
}

async function runStateReplacementRoutes() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(browserActionTimeoutMs);
  try {
    await openCaseAtChapter(page, 1, "state-replacement");
    await drainDialogue(page, {});
    if (await page.locator("[data-scene-helper]").count()) throw new Error("V哥隐藏期间不得出现求助按钮");
    await assertNoPageText(page, "V哥", "V哥隐藏期间不得出现在问题底栏");
    await click(page, '[data-action="title"]');
    await click(page, "[data-request-new-game]");
    await click(page, "[data-confirm-new-game]");
    const freshState = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}"));
    if (freshState.chapter !== 1 || freshState.scene !== "cafePrologue") {
      throw new Error(`new game must replace the old run state: ${JSON.stringify({ chapter: freshState.chapter, scene: freshState.scene })}`);
    }
    if (Object.keys(freshState.helperHintPicks ?? {}).length) {
      throw new Error("new game must not retain helper records from the old state");
    }
    await enterNightFromCafePrologue(page, {});
    await revealGolden90(page, {});
    await drainDialogue(page, {});
    await click(page, "[data-enter-first-case]");
    await assertVisibleText(page, "CASE 01", "memoized screens must render the first case from the new state");
    await click(page, "[data-enter-case-live]");

    await page.evaluate((legacySceneVersions) => {
      const storageKey = "livestream-detective-save-v1";
      const save = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      const brief = { ...(save.caseBriefs?.[0] ?? {}), sceneVersions: legacySceneVersions };
      const staleOpeningScene = brief.sceneVersions?.find((scene) => scene.id === "credit-living-arrangement");
      if (staleOpeningScene) staleOpeningScene.version = "我们一直住在一起，这是一条已经淘汰的旧台词。";
      save.caseBriefs = [brief, ...(save.caseBriefs ?? []).slice(1)];
      const caseId = brief.id;
      const answerKey = `${caseId}:scene:0`;
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
    }, structuredClone(authoredCasePackets[0].sceneVersions ?? []));
    await page.reload();
    await click(page, "[data-continue-story]");
    if (await page.locator("[data-retry-lost-step]").count()) throw new Error("old patience loss must migrate directly into the current inquiry");
    const retryTranscript = await drainDialogue(page, {});
    const retriedState = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}"));
    const retriedCaseId = retriedState.caseBriefs?.[0]?.id;
    const retriedAnswerKey = `${retriedCaseId}:scene:0`;
    if (!["不住在一起，他住他的，我住我的。"].every((line) => retryTranscript.includes(line)) || retryTranscript.includes("这是一条已经淘汰的旧台词")) {
      throw new Error("continuing a save must refresh stale authored dialogue from the current content pack");
    }
    if (retriedState.caseBriefs?.[0]?.sceneVersions) {
      throw new Error("refreshed saves must return to progress-only case stubs instead of persisting authored dialogue");
    }
    if (!["sceneReview", "sceneQuestionAnswer", "stanceSnapshot"].includes(retriedState.scene) || retriedState.patienceLostContext !== null) {
      throw new Error(`legacy save must resume the current inquiry and clear its retry context: ${retriedState.scene}`);
    }
    if (retriedState.sceneQuestionPicks?.[retriedAnswerKey]?.marker === "old-state" || retriedState.sceneAnswers?.[retriedAnswerKey] === "old-state") {
      throw new Error("save migration must remove the stale failed answer before current dialogue resumes");
    }
    if (retriedState.caseBudgets?.[retriedCaseId]?.remaining !== 0) {
      throw new Error("no-penalty migration must not mutate the old budget");
    }
  } finally {
    await context.close();
  }
}

async function runRoute(route) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: route.name === "accounting-support" ? "no-preference" : "reduce"
  });
  await context.addInitScript(() => {
    const hapticCalls = [];
    window.__smokeGamepad = {
      connected: false,
      index: 0,
      axes: [0, 0],
      buttons: Array.from({ length: 16 }, () => ({ pressed: false })),
      hapticCalls,
      vibrationActuator: {
        playEffect: (kind, plan) => {
          hapticCalls.push({ kind, plan });
          return Promise.resolve("complete");
        }
      }
    };
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => window.__smokeGamepad?.connected ? [window.__smokeGamepad] : []
    });
  });
  const page = await context.newPage();
  const browserMessages = [];
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.stack ?? error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.setDefaultTimeout(browserActionTimeoutMs);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-${route.name}-${Date.now()}&storyKey=steam-demo-01`);
    if (route.name === "accounting-support") {
      const defaultPlayerName = await page.locator("[data-player-name]").inputValue();
      if (defaultPlayerName !== "林旭阳") throw new Error(`title page should default the player name to 林旭阳, got ${defaultPlayerName}`);
      if (await page.getByText("林旭阳坐在主播台前", { exact: false }).count()) throw new Error("title page must not explain the player identity twice");
      await page.locator("[data-player-name]").fill("周明");
    }
    if (route.name === "accounting-support") await assertAudioSettings(page);
    if (route.inputMode === "gamepad") await connectGamepad(page);
    await activate(page, route, "[data-start-story]");
    await enterNightFromCafePrologue(page, route);
    if (route.name === "accounting-support") {
      const mainHostCaption = (await page.locator(".case-portrait-host figcaption b").innerText()).trim();
      if (mainHostCaption !== "周明") throw new Error(`主案舞台必须显式沿用玩家姓名，实际为：${mainHostCaption || "<空>"}`);
      await assertNoPageText(page, "林旭阳", "主案改名后不得在立绘、气泡或HUD残留默认主播名");
      if (await page.locator(".pixel-transition").count() !== 1) throw new Error("night shell should mount one pixel transition overlay");
      const pointerEvents = await page.locator(".pixel-transition").evaluate((element) => getComputedStyle(element).pointerEvents);
      if (pointerEvents !== "none") throw new Error("pixel transition must never block player input");
      const transitionDuration = await page.locator(".pixel-transition-soft-fade").evaluate((element) => getComputedStyle(element).animationDuration);
      if (transitionDuration !== "1.2s") throw new Error(`pre-show transition should hold for 1.2s, got ${transitionDuration}`);
    }
    const golden90 = await revealGolden90(page, route, { assertContract: route.name === "accounting-support" });
    if (await page.locator("[data-enter-first-case]").count()) {
      const prologueTranscript = [
        golden90?.preludeTranscript,
        golden90?.debtTranscript,
        golden90?.interestTranscript
      ].filter(Boolean).join("").replace(/\s+/g, "");
      const expectedPrologue = "第一位来电人还没接进来，她先把男朋友刚发来的一段语音转到了后台。";
      if (!prologueTranscript.includes(expectedPrologue)) {
        throw new Error("night shell prologue must identify the first caller and the forwarded male voice before playing it");
      }
      await assertNoPageText(page, "试玩已收麦", "night shell prologue must not display the story-pack completion HUD");
      if (golden90?.preludeKinds?.notice !== 0 || golden90?.preludeKinds?.message !== 1 || !golden90?.preludeTranscript?.includes('老方正站在桌边')) {
        throw new Error("night shell prelude must distinguish the producer on site from the spouse's WeChat message");
      }
      if (golden90?.debtKinds?.stage !== 1 || golden90?.debtKinds?.host < 1) {
        throw new Error("night shell cold open should confirm the go-live action and identify the forwarded voice before it plays");
      }
      await activate(page, route, "[data-enter-first-case]");
      await assertVisibleText(page, "CASE 01", "first case must enter through the same case title treatment as later cases");
      await assertVisibleText(page, "账单里的八万", "first act title must state its case hook before the call connects");
      await activate(page, route, "[data-enter-case-live]");
    }
    if (route.name === "accounting-support") {
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
    let helperHiddenChecked = false;
    let directionChoiceChecked = false;
    let materialEntryChecked = false;
    let selectedCounterChoiceLabel = "";
    let sceneQuestionCount = 0;
    const inlineEvidenceCheckIndexes = new Set();
    let inlineBillVerified = false;
    let lastRoutePhase = "";

    for (let beat = 0; beat < 48; beat += 1) {
      if (await page.locator('[data-night2-transition-done]').count()) {
        await page.locator('[data-night2-transition-done]').click();continue;
      }
      if (await page.locator("[data-caller-question]").count()) break;
      // Previously inspected boards can reopen with a saved pick and no visible
      // choice buttons. Hand this phase to the material driver before replay.
      const savedPhase = await page.evaluate(() => JSON.parse(window.localStorage?.getItem("livestream-detective-save-v1") ?? "{}").scene);
      if(savedPhase !== lastRoutePhase) { smokeProgress(`ROUTE ${route.name}: ${savedPhase}`); lastRoutePhase = savedPhase; }
      if (savedPhase === "evidenceCheck") break;
      await collectLiveVisualState(page, visualStates, portraitStates);
      if (["interludeDesk", "dayActOpening", "dayMap", "dayScene"].includes(savedPhase)) {
        await completeLinearInvestigation(page, route);
        continue;
      }
      if (await testimonyFlowIsVisible(page)) {
        await completeTestimonyWall(page, route);
        continue;
      }
      if (route.name === "accounting-support" && !materialEntryChecked && await page.locator(".deck-card-material[data-material-open]").count()) {
        const materialEntry = page.locator("[data-material-open]:visible").first();
        if (!await materialEntry.isEnabled()) throw new Error("received material must have an accessible control");
        await materialEntry.click();
        await page.locator(".avg-material-modal:not([hidden])").waitFor({ state: "visible" });
        await assertVisibleText(page, "社保断缴时间", "the first received material must open before the active choice");
        const materialPanelMetrics = await page.locator(".avg-material-panel").evaluate((element) => {
          const panel = element.getBoundingClientRect();
          const close = element.querySelector("header [data-material-close]")?.getBoundingClientRect();
          return { width: panel.width, height: panel.height, closeWidth: close?.width ?? 0, closeHeight: close?.height ?? 0, viewportWidth: innerWidth, viewportHeight: innerHeight };
        });
        if (materialPanelMetrics.width < Math.min(600, materialPanelMetrics.viewportWidth - 24)
          || materialPanelMetrics.height < materialPanelMetrics.viewportHeight * .72) {
          throw new Error(`received material panel is too small: ${materialPanelMetrics.width.toFixed(1)}x${materialPanelMetrics.height.toFixed(1)}`);
        }
        if (materialPanelMetrics.closeWidth < 112 || materialPanelMetrics.closeHeight < 44) throw new Error("received material close control must be easy to reach");
        await page.locator(".avg-material-panel [data-material-close]").click();
        materialEntryChecked = true;
      }
      if (await page.locator("[data-next-scene-stage]").count()) {
        await activate(page, route, "[data-next-scene-stage]");
        continue;
      }
      if (await page.locator("[data-evidence-check]:visible").count()) {
        const savedScene = await page.evaluate(() => {
          const raw = window.localStorage?.getItem("livestream-detective-save-v1");
          return raw ? JSON.parse(raw).scene ?? "" : "";
        });
        if (savedScene === "afterSceneEvidence") {
          const checkIndex = Number((await page.locator("[data-evidence-check]").first().getAttribute("data-evidence-check"))?.split(":")[0]);
          inlineEvidenceCheckIndexes.add(checkIndex);
          await assertVisibleText(page, "圈点 · 圈偏 −1 耐心", "inline material must disclose the miss cost");
          const check = authoredCasePackets[0].evidenceChecks[checkIndex];
          const optionIndex = check.options.findIndex(option => option.correct === !(checkIndex === 0 && route.materialMode === "miss"));
          await activate(page, route, "[data-evidence-check]", optionIndex);
          const inlineTranscript = await drainDialogue(page, route);
          if (checkIndex === 0) {
            if (route.materialMode === "miss") {
              await assertVisibleText(page, caseOneMaterialMissDrift, "inline bill miss must retain the authored drift comment");
            } else if (!check.options[optionIndex].label.includes("三万五") || !inlineTranscript.includes(check.options[optionIndex].feedback)) {
              throw new Error("bill inspection must select the unexplained 35,000 and play its authored follow-up");
            }
            inlineBillVerified = true;
          }
          if (!await page.locator("[data-after-scene-evidence]").count()) {
            const afterState = await page.evaluate(() => JSON.parse(window.localStorage?.getItem("livestream-detective-save-v1") ?? "{}"));
            const visibleButtons = await page.locator("button:visible").evaluateAll((buttons) => buttons.map((button) => button.outerHTML));
            throw new Error(`inline evidence check ${checkIndex} returned to ${afterState.scene}: ${JSON.stringify(visibleButtons)}`);
          }
          await activate(page, route, "[data-after-scene-evidence]");
          if (route.stopAfterCheckId === check.id) {
            if (!route.oldPostSeen) throw new Error("second-night evidence lacked first-night acquisition");
            smokeProgress("PASS first-night old post, ordered day investigation, restaurant reveal, device questions and exit");
            return;
          }
          continue;
        }
        break;
      }
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
      if (await page.locator("[data-enter-post-live], [data-enter-interlude]").count()) {
        await assertVisibleText(page, "电话断了。后台多出一份遮名交易摘录，信用卡账单还亮着，账单总额和已分项对不上", "overnight route should identify the caller-authorized transaction excerpt before the show ends");
        await assertVisibleText(page, "别转", "case 1 hangup should retain the audience warning not to transfer");
        await assertVisibleText(page, "这八万就该转", "case 1 hangup should also show the opposing audience view after both sides are exposed");
        await assertNoPageText(page, "账单、到期日、她要垫多少", "Zhao's private call must not happen while the show is still live");
        await activate(page, route, "[data-enter-post-live], [data-enter-interlude]");
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
        if (!authoredCasePackets[0].overnightStructure.linearCallback.lines.every(line => openerTranscript.includes(line.text))) {
          throw new Error(`${route.name} should render the selected opener and its first conflict`);
        }
        await activate(page, route, "[data-enter-overnight-night2]");
        continue;
      }
      if (await page.locator("[data-document-question]").count()) {
        const buttons = page.locator("[data-document-question]");
        const labels = await buttons.allTextContents();
        const rentQuestionIndex = labels.findIndex((label) => label.includes("这是他自己住的地方"));
        await activate(page, route, "[data-document-question]", rentQuestionIndex >= 0 ? rentQuestionIndex : 0);
        if (rentQuestionIndex >= 0) {
          const rentTranscript = await drainDialogue(page, route);
          if (!rentTranscript.includes("不是，是我住的") || !rentTranscript.includes("他自己住的地方也得另外花钱")) {
            throw new Error("rent row question must reveal the caller as beneficiary and keep the respondent's own housing cost separate");
          }
        }
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
        const selectedHostResponse = await page.locator(".live-counter-response .call-line.host p").count()
          ? (await page.locator(".live-counter-response .call-line.host p").first().textContent())?.trim() ?? ""
          : "";
        const liveCounterTranscript = await drainDialogue(page, route);
        if (route.name === "accounting-support") {
          const activeBeatId = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')).activeLiveCounterBeatId);
          const counter = authoredCasePackets[0].overnightStructure.liveCounterBeats.find(beat => beat.id === activeBeatId);
          const expectedLines = counter?.choices?.at(-1)?.lines ?? counter?.lines ?? [];
          for(const line of expectedLines.filter(line=>line.text && line.role !== 'pause')) {
            for(const sentence of line.text.split(/(?<=[。！？])/u).filter(Boolean)) {
              if(!liveCounterTranscript.replace(/\s/g, '').includes(sentence.replace(/\s/g, ''))) throw Error(`counter beat omitted current authored sentence: ${sentence}`);
            }
          }
        }
        await activate(page, route, "[data-continue-live-counter]");
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
      await drainDialogue(page, route);
      if (await testimonyFlowIsVisible(page)) {
        await completeTestimonyWall(page, route);
        continue;
      }
      if (!await page.locator(".statement-replay-page").count() && !await page.locator("[data-scene-question]:visible").count()) {
        await page.locator("[data-scene-open-replay]").waitFor({ state: "visible" });
        await activate(page, route, "[data-scene-open-replay]");
      }
      if (await page.locator(".statement-replay-page").count()) {
        await assertVisibleText(page, "REC", "main-case statement review must switch the control deck to replay");
      }
      await assertNoPageText(page, "收束 · 未命中 −1 耐心", "原句回放不得把底层耐心成本写成按钮说明");
      if (!helperHiddenChecked && route.name === "accounting-support") {
        if (await page.locator("[data-scene-helper]").count()) throw new Error("V哥隐藏期间不得出现求助按钮");
        await assertNoPageText(page, "V哥", "V哥隐藏期间不得出现在玩家可见流程");
        await assertNoPageText(page, "按下以后", "主案问题面板不得解释按钮点击后的行为");
        await assertNoPageText(page, "疑点方向", "主案问题按钮不得重复标注控件类型");
        helperHiddenChecked = true;
      }
      const sourceLine = await currentLoadBearingStatementLine(page);
      const sourceText = await page.locator(".statement-replay-page .avg-line:visible").count()
        ? (await page.locator(".statement-replay-page .avg-line:visible").first().textContent())?.trim() ?? ""
        : "";
      const selectedKey = await sourceLine.getAttribute("data-scene-question");
      await sourceLine.click();
      sceneQuestionCount += 1;
      if (sourceText && !directionChoiceChecked) {
        const dialogueBox = page.locator("[data-dialogue-advance]:visible").first();
        const spokenQuestion = dialogueBox.locator(".avg-page-line.speaker-host .avg-line").first();
        await spokenQuestion.waitFor({ state: "visible" });
        if (!await dialogueBox.locator(".avg-continue").isVisible()) {
          await dialogueBox.evaluate((element) => element.click());
        }
        const spokenText = (await spokenQuestion.textContent())?.trim() ?? "";
        if (!spokenText || spokenText === sourceText || !/[？?]$/.test(spokenText)) {
          throw new Error("held source line should turn into the host's authored spoken question");
        }
        await assertNoPageText(page, `${route.name === "accounting-support" ? "周明" : "林旭阳"}\n${sourceText}`, "source line must not replace the protagonist's spoken question");
        directionChoiceChecked = true;
      }
      const answerTranscript = await drainDialogue(page, route);
      if (route.name === "accounting-support" && selectedKey === "0:1" && !answerTranscript.includes("以前每个月都按时到")) {
        throw new Error("the normal key-question route must play the authored sceneCloser before advancing");
      }
      if (route.name === "accounting-support" && selectedKey === "1:1" && !answerTranscript.includes("以前也有人这么跟我借钱")) {
        throw new Error("the normal key-question route must play the anchored host disclosure instead of skipping it");
      }
      continue;
    }

    if (!inlineBillVerified) throw new Error("the first-night bill check was skipped");
    if (visualStates.size < 2 || portraitStates.size < 2) {
      throw new Error(`${route.name} route should change scene and portrait states while questioning: ${[...visualStates]} / ${[...portraitStates]}`);
    }
    if (route.name === "accounting-support" && (!helperHiddenChecked || !directionChoiceChecked || !materialEntryChecked)) {
      throw new Error("primary browser route must verify hidden V哥 UI, a direction-only question, and the received-material entry");
    }
    if (route.name === "accounting-support" && ![0, 1, 2, 3].every((index) => inlineEvidenceCheckIndexes.has(index))) {
      throw new Error(`primary browser route must interleave the four case-1 material boards, got ${[...inlineEvidenceCheckIndexes].join(",")}`);
    }
    await advanceToAccusation(page, route);
    await assertVisibleText(page, "终局追问 · 选后收麦", "final question must disclose that it closes the call");
    await activate(page, route, "[data-accuse]");
    await completePostAccusation(page, route);
    await page.locator(".recap-score-head").waitFor({ state: "visible" });
    await assertVisibleText(page, "收麦回看", `${route.name} route should reach recap`);
    if (route.name === "accounting-support") {
      await exerciseTruthBoundary(page, route);
    }
    if (route.inputMode === "gamepad") {
      const hapticCalls = await page.evaluate(() => window.__smokeGamepad?.hapticCalls ?? []);
      if (!hapticCalls.some((call) => call.kind === "dual-rumble" && Number(call.plan?.duration) > 0)) {
        throw new Error("gamepad route must receive decisive dual-rumble feedback");
      }
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

async function completeCase1Interlude(page, route) {
  await assertVisibleText(page, "回拨前", `${route.name} must pass through the short interlude before the day map`);
  await activate(page, route, '[data-interlude-action="recheck-history-pages"]');
  await activate(page, route, "[data-evidence-check]");
  await activate(page, route, "[data-callback-ready]");
}

async function runCase3DayRoutes() {
  await runSmokeStep("case3 day map / chat evidence", () => runOfflineDayMap({
    chapter: 3,
    name: "case3-day-map",
    interludeAction: "profile-listen-dinner-pause",
    dayScenes: [
      { id: "day-profile-teahouse", text: "你先看聊天" },
      { id: "day-profile-cousin-doorstep", text: "门只开到防盗链" }
    ],
    opener: "两边的完整聊天",
    openerText: "我把介绍人两边的聊天都看完了",
    conflictText: "知道你家现在能拿多少吗"
  }));
  await runSmokeStep("case3 day map / reaction beat", () => runOfflineDayMap({
    chapter: 3,
    name: "case3-reaction-beat",
    interludeAction: "profile-listen-dinner-pause",
    dayScenes: [
      { id: "day-profile-credential-docs", text: "学历、彩礼与两家资金边界", rows: ["p04"] },
      { id: "day-profile-teahouse", text: "你先看聊天" }
    ],
    opener: "双份材料圈注",
    openerText: "那两份材料我又看了几遍",
    reactionText: "她把我家的群发给一个直播间？",
    reactionChoice: "push-back",
    reactionResponse: "你先让我把这段说完。",
    tailText: "以后不还是得谈这几条？"
  }));
}

async function runCase4DayRoutes() {
  await runSmokeStep("case4 day map / reimbursement timeline", () => runOfflineDayMap({
    chapter: 2,
    name: "case4-day-map",
    interludeAction: "recheck-approval-page",
    interludeText: "这张“审批通过”最先要核对哪三项",
    expectedDaySceneCount: 4,
    dayScenes: [
      {
        id: "day-work-payment-ledger",
        text: "垫款、结算与待付记录",
        rows: ["q01", "q02", "q04"],
        questionText: "通知写主办先垫，主管又私聊让你先出钱"
      },
      { id: "day-work-finance-window", text: "别再重复填一单" }
    ],
    opener: "她整理的报销时间线",
    openerText: "前五条对过了",
    conflictText: "发票照片交给他以后",
    reactionText: "有人说多报四千的时候怎么不打电话。",
    reactionChoice: "silence",
    reactionResponse: "行，继续。",
    nextCounterText: "工作群刚弹出一条"
  }));
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
    if (await testimonyFlowIsVisible(page)) {
      await completeTestimonyWall(page);
      continue;
    }
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
    if (await page.locator("[data-next-scene-stage]").count()) {
      await click(page, "[data-next-scene-stage]");
      continue;
    }
    if (!await page.locator("[data-scene-question]").count() && await page.locator("button[data-scene]").count()) {
      await click(page, "button[data-scene]");
      continue;
    }
    await drainDialogue(page, {});
    if (await testimonyFlowIsVisible(page)) {
      await completeTestimonyWall(page);
      continue;
    }
    if (await page.locator("[data-scene-open-replay]").count()) {
      await click(page, "[data-scene-open-replay]");
    }
    if (await page.locator(".statement-replay-page").count()) {
      const sourceLine = await currentLoadBearingStatementLine(page);
      await sourceLine.click();
    } else {
      await page.locator("[data-scene-question]").first().waitFor({ state: "visible" });
      await click(page, "[data-scene-question]");
    }
    await collectPortraitAsset(page, portraitAssets);
    await drainDialogue(page, {});
    // A statement stage can require several separate replay actions. Return to
    // the loop and let the current screen decide whether there is another line
    // to press or the stage has actually exposed its continuation gate.
    continue;
  }
  throw new Error("targeted case did not reach overnight hangup");
}

async function runCase2DayMap() {
  await runSmokeStep("case2 day map / dryer playback", () => runOfflineDayMap({
    chapter: 4,
    name: "case2-day-map",
    interludeAction: "listen-dryer",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "名单与十二万转账", rows: ["m02", "m05"] }
    ],
    opener: "吹风机回放",
    openerText: "也就你肯听我说这些",
    reactionText: "收了好处装什么受害者",
    reactionChoice: "soothe",
    reactionResponse: "你问吧。"
  }));
  await runSmokeStep("case2 day map / side with other caller", () => runOfflineDayMap({
    chapter: 4,
    name: "case2-dm-other",
    interludeAction: "other-caller-dm",
    interludeReplyChoice: "side-other",
    expectedNightInventory: "side-other-caller",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "名单与十二万转账", rows: ["m02", "m05"] }
    ],
    opener: "周发来的材料",
    openerText: "你支持她留表"
  }));
  await runSmokeStep("case2 day map / side with caller", () => runOfflineDayMap({
    chapter: 4,
    name: "case2-dm-caller",
    interludeAction: "other-caller-dm",
    interludeReplyChoice: "side-caller",
    expectedNightInventory: "side-caller-stop",
    expectedDaySceneCount: 4,
    dayScenes: [
      { id: "day-tony-shop-observe", text: "离门三四步", choice: "note-shared-address", choiceText: "自己人还排什么队啊", excludedChoiceText: "蓝色《会员预约》册" },
      { id: "day-tony-member-docs", text: "名单与十二万转账", rows: ["m02", "m05"] }
    ],
    opener: "先要回单",
    openerText: "我劝她先要回单"
  }));
}

async function runOfflineDayMap({ chapter, name, interludeAction, interludeChoice = "", interludeReplyChoice = "", expectedNightInventory = "", interludeText = "", expectedDaySceneCount = 3, dayScenes, opener, openerText, conflictText = "", reactionText = "", reactionChoice = "", reactionResponse = "", nextCounterText = "", tailText = "" }) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(browserActionTimeoutMs);
  try {
    await openCaseAtChapter(page, chapter, name);
    const portraitAssets = new Set();
    await assertPixelPortrait(page, chapter);
    await advanceNightCaseToOvernightHangup(page, portraitAssets);
    const portraitStem = ({ 2: "caller_work", 3: "caller_profile", 4: "caller_salon" })[chapter];
    ["neutral", "guarded", "pause"].forEach((kind) => {
      if (![...portraitAssets].some((src) => src.includes(`${portraitStem}_${kind}_pixel.png`))) {
        throw new Error(`${name} must render the case-${chapter} ${kind} pixel portrait during the live call`);
      }
    });
    await assertNoPageText(page, "第二天，下午", `${name} must show the hangup before daytime`);
    await click(page, "[data-enter-post-live], [data-enter-interlude]");
    await completeLinearInvestigation(page, { name, dayScenes });
    let callbackTranscript = await drainDialogue(page, {});
    for (const selector of ["[data-enter-overnight-night2]", "[data-enter-overnight-night2-direct]"]) {
      if (!await page.locator(selector).count()) continue;
      await click(page, selector);
      callbackTranscript += `\n${await drainDialogue(page, {})}`;
      break;
    }
    const bridge = authoredCasePackets[chapter - 1].overnightStructure.linearCallback.lines;
    if (!bridge.every((line) => callbackTranscript.includes(line.text))) throw new Error(`${name} must use the unified callback bridge`);
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
    if (tailText) await advanceToReactionBeat(page, tailText, name);
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
    if (await testimonyFlowIsVisible(page)) {
      await completeTestimonyWall(page);
      continue;
    }
    for (const selector of [
      "[data-enter-overnight-night2]",
      "[data-enter-overnight-night2-direct]",
      "[data-document-question]",
      "[data-close-document-question]",
      "[data-after-scene-evidence]",
      "[data-next-scene-stage]",
      "[data-evidence-check]",
      "[data-live-counter-choice]",
      "[data-continue-live-counter]",
      "button[data-scene]",
      "[data-next-evidence-check]"
    ]) {
      if (await page.locator(selector).count()) {
        await click(page, selector);
        break;
      }
    }
    if (await page.locator("[data-scene-open-replay]").count()) {
      await click(page, "[data-scene-open-replay]");
      const sourceLine = await currentLoadBearingStatementLine(page);
      await sourceLine.click();
    } else if (await page.locator("[data-scene-question]").count()) {
      await click(page, "[data-scene-question]");
    }
  }
  throw new Error(`${name} did not reach reaction beat: ${expectedText}\nRecent transcript: ${transcript.slice(-2500)}`);
}

async function testimonyFlowIsVisible(page) {
  return Boolean(await page.locator([
    "[data-evidence-inquiry]:visible",
    "[data-inquiry-continue]:visible",
    ".dialogue-card > .testimony-prelude-card:visible",
    ".dialogue-card > .testimony-wall:visible",
    ".dialogue-card > .present-material-select:visible",
    ".dialogue-card > .decisive-present-target:visible",
    ".dialogue-card > .decisive-present-hit:visible"
  ].join(", ")).count());
}

async function completeTestimonyWall(page, route = {}) {
  if (await page.locator('[data-evidence-inquiry], [data-inquiry-continue]').count()) return completeFocusedEvidenceInquiry(page);
  let completedActs = 0;
  let enteredPrelude = false;
  for (let step = 0; step < 6; step += 1) {
    if (await page.locator("[data-enter-testimony-wall]").count()) {
      await page.locator(".testimony-prelude-card").waitFor({ state: "visible" });
      const preludeText = await page.locator(".testimony-prelude-card").innerText();
      if (preludeText.includes("企鹅") && !preludeText.includes("抱抱来得挺是时候")) {
        throw new Error("case 1 must play its authored prelude before exposing the testimony wall");
      }
      await activate(page, route, "[data-enter-testimony-wall]");
      enteredPrelude = true;
      continue;
    }
    if (await page.locator("[data-after-decisive-present]").count()) {
      await waitForEnabled(page, "[data-after-decisive-present]");
      await activate(page, route, "[data-after-decisive-present]");
      completedActs += 1;
      continue;
    }
    if (!await page.locator("[data-inline-present-material]").count()) break;
    const act = await currentTestimonySmokeAct(page);
    await assertTestimonyReading(page, act);
    for (const press of act.reading.presses) {
      await activate(page, route, `[data-testimony-press="${press.statement.id}"]`);
      await assertVisibleText(page, press.response, "required question response matches authored reading");
    }
    const selectedEvidenceId = process.env.SMOKE_ALTERNATE_EVIDENCE === "1"
      ? act.reading.present.acceptedEvidenceIds?.[0] ?? act.evidenceId : act.evidenceId;
    await page.locator("[data-inline-present-material]").selectOption(selectedEvidenceId);
    if (smokeTarget === "testimony-reading") {
      const directory = resolve(root, "output/playwright/focused-inquiry");
      await mkdir(directory, { recursive: true });
      const selector = page.locator("[data-inline-present-material]");
      await selector.scrollIntoViewIfNeeded();
      const rect = await selector.boundingBox();
      if (!rect || rect.x < 0 || rect.x + rect.width > page.viewportSize().width + 1) throw new Error("inline material selector overflowed the viewport");
      await page.screenshot({ path: resolve(directory, `${act.caseId}-${act.actId}-${page.viewportSize().width}x${page.viewportSize().height}-selection.png`), animations: "disabled" });
    }
    await activate(page, route, `[data-decisive-present-target="${act.statementId}"]`);
    await page.locator("[data-after-decisive-present]").waitFor({ state: "visible" });
    const hitLines = await page.locator(".present-hit-dialogue > p > span").allTextContents();
    if (JSON.stringify(hitLines) !== JSON.stringify([act.reading.present.callerLine, act.reading.present.hostLine])) throw new Error("testimony hit order differs from continuous reading");
    const selectedCard = act.reading.present.materialCards.find((card) => card.id === selectedEvidenceId);
    await assertVisibleText(page, selectedCard.label, "命中画面必须保留玩家实际选中的材料");
    if (smokeTarget === "testimony-reading") {
      const directory = resolve(root, "output/playwright/focused-inquiry");
      await mkdir(directory, { recursive: true });
      if (await page.locator("[data-skip-hit-presentation]").isVisible()) await click(page, "[data-skip-hit-presentation]");
      const geometry = await page.evaluate(() => {
        const panel = document.querySelector(".decisive-present-hit");
        const card = panel.closest(".dialogue-card");
        const rects = [...panel.querySelectorAll(".present-hit-pair article, .present-hit-dialogue p"), document.querySelector("[data-after-decisive-present]")].map((node) => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        });
        return { width: innerWidth, height: innerHeight, rects, clipped: card.scrollHeight > card.clientHeight + 2 };
      });
      if (geometry.clipped || geometry.rects.some((r) => r.top < 0 || r.bottom > geometry.height || r.left < 0 || r.right > geometry.width)) throw new Error(`testimony hit must fit the viewport: ${JSON.stringify(geometry)}`);
      await page.screenshot({ path: resolve(directory, `${act.caseId}-${act.actId}-${page.viewportSize().width}x${page.viewportSize().height}-${process.env.SMOKE_ALTERNATE_EVIDENCE === "1" ? "alternative" : "primary"}.png`), animations: "disabled" });
    }
    verifiedTestimonyActs.add(`${act.caseId}/${act.actId}`);
  }
  if (!completedActs && !enteredPrelude) throw new Error("testimony wall smoke helper did not complete an act");
}

async function runCreditReplayRecovery() {
  const packet = authoredCasePackets[0];
  const dir = resolve(root, "output/playwright/credit-replay-recovery");
  await mkdir(dir, { recursive: true });
  for (const viewport of [{width:1920,height:1080},{width:1366,height:768},{width:1280,height:800},{width:1280,height:720}]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await openCaseAtChapter(page, 1, `credit-replay-${viewport.width}-${viewport.height}`);
      for (const sceneIndex of [3, 6]) {
        const scene = packet.sceneVersions[sceneIndex];
        await page.evaluate(({sceneIndex}) => {
          const key = "livestream-detective-save-v1", save = JSON.parse(localStorage.getItem(key));
          const id = save.caseBriefs[0].id;
          Object.assign(save, {scene:"sceneLineReplay",activeStatementLineId:null,sceneQuestionFocus:null,sceneQuestionPicks:{},sceneDialoguePicks:{},caseActionLog:{[id]:{}},caseOvernights:{[id]:{segment:"night2",hangupDone:true,night2TransitionSeen:true}},dialogueProgress:{[`${id}:sceneReview`]:sceneIndex},dialogueReading:null});
          save.settings.screenEffects = "off";
          localStorage.setItem(key, JSON.stringify(save));
        }, {sceneIndex});
        await page.reload(); await click(page, "[data-continue-story]");
        const initial = await page.locator('.statement-replay-page').innerText();
        await click(page, '[data-scene-replay-next]'); await click(page, '[data-scene-replay-previous]');
        if (await page.locator('.statement-replay-page').innerText() !== initial) throw new Error('previous sentence did not restore source');
        for(let n=0;n<30 && await page.locator('[data-scene-replay-next]').count();n++) await click(page,'[data-scene-replay-next]');
        await drainDialogue(page,{});
        await page.locator('[data-scene-replay-restart]').waitFor();
        await click(page,'[data-action="title"]'); await page.reload(); await click(page,'[data-continue-story]');
        await drainDialogue(page,{});
        await page.locator('[data-scene-replay-restart]').waitFor();
        await drainDialogue(page,{});
        await page.screenshot({path:resolve(dir,`${scene.id}-end-${viewport.width}x${viewport.height}.png`),animations:'disabled'});
        await click(page,'[data-scene-replay-restart]');
        let completed = 0;
        let repeatedQuestionChecked = false;
        for(let n=0;n<50 && !await page.locator('[data-next-scene-stage]').count();n++) {
          const sourceLine = await currentLoadBearingStatementLine(page);
          const keyChoice = await sourceLine.getAttribute('data-scene-question');
          const sourceText = await page.locator('.statement-replay-page').innerText();
          await sourceLine.click(); await drainDialogue(page,{});
          if(keyChoice) completed++;
          if(await page.locator('[data-scene-open-replay]').count()) {
            await click(page,'[data-scene-open-replay]'); await drainDialogue(page,{});
            if(await page.locator('.statement-replay-page').innerText() !== sourceText) throw new Error('answer skipped the original sentence');
            if(completed===1) {
              await page.reload();await click(page,'[data-continue-story]'); await drainDialogue(page,{});
              if(await page.locator('.statement-replay-page').innerText() !== sourceText) throw new Error('reload lost replay position');
              if (sceneIndex===6 && !repeatedQuestionChecked) {
                await click(page,'[data-scene-review-line]');
                await page.reload(); await click(page,'[data-continue-story]');
                await assertVisibleText(page,scene.questionOptions[0].question,'repeated completed question changed after reload');
                const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
                if(restored.sceneQuestionFocus?.resolvedOptionId!==scene.questionOptions[0].id) throw new Error('repeated question lost identity');
                if(JSON.stringify(restored.sceneQuestionFocus.pick.lines)!==JSON.stringify(scene.questionOptions[0].lines)) throw new Error('repeated question lost answer exchange');
                await drainDialogue(page,{}); await click(page,'[data-scene-open-replay]');
                await drainDialogue(page,{});
                if(await page.locator('.statement-replay-page').innerText() !== sourceText) throw new Error('repeated answer lost source position: '+await page.locator('.statement-replay-page').innerText());
                repeatedQuestionChecked = true;
              }
            }
          }
        }
        if(completed!==scene.questionSequence.length) throw new Error(`${scene.id}: incomplete question sequence ${completed}`);
        await click(page,'[data-next-scene-stage]');
        for(let n=0;n<12 && !await page.locator('[data-evidence-check]').count();n++) {
          await drainDialogue(page,{});
          if(await page.locator('[data-live-counter-choice]').count()) await click(page,'[data-live-counter-choice]');
          else if(await page.locator('[data-continue-live-counter]').count()) await click(page,'[data-continue-live-counter]');
          else throw new Error('unexpected scene after replay: '+await page.locator('body').innerText());
        }
        await page.locator('[data-evidence-check]').first().waitFor();
        if(sceneIndex===3) {
          await assertVisibleText(page,'第三次来啦','old social post must be readable');
          await assertVisibleText(page,'两年前','post must show the old date');
          const invalid = await page.locator('.social-post-caption, .social-post-comments, [data-evidence-check]').evaluateAll(nodes => nodes.map(node => ({text:node.textContent,rect:node.getBoundingClientRect().toJSON()})).filter(({rect})=>rect.x<0 || rect.y<0 || rect.right>innerWidth || rect.bottom>innerHeight));
          if(invalid.length) throw new Error('material outside PC viewport: '+JSON.stringify(invalid));
          const captionColor=await page.locator('.social-post-caption').evaluate(node=>getComputedStyle(node).color);
          if(captionColor !== 'rgb(40, 52, 47)') throw new Error('social post text lost paper contrast: '+captionColor);
          await page.screenshot({path:resolve(dir,`restaurant-material-${viewport.width}x${viewport.height}.png`),animations:'disabled'});
          await page.locator('[data-evidence-check]').first().click(); await drainDialogue(page,{});
        }
      }
      if(errors.length) throw new Error(errors.join('\n'));
      smokeProgress(`PASS credit replay ${viewport.width}x${viewport.height}: skips/end/title/reload/questions/material`);
    } finally { await context.close(); }
  }
}

async function runScriptReadingMatrix() {
  const director = await readFile(resolve(root, "docs/generated/steam-demo-01-director-script.md"), "utf8");
  for (const [caseIndex, packet] of authoredCasePackets.entries()) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(browserActionTimeoutMs);
    try {
      await openCaseAtChapter(page, caseIndex + 1, `script-reading-${packet.caseId}`);
      const firstSceneIndex = packet.nightStructure.segment1SceneIndexes[0];
      const stage = packet.statementStages.find((item) => item.sceneIndexes.includes(firstSceneIndex));
      const prompt = (await page.locator(".statement-stage-listen .call-line p").allTextContents()).join("");
      let previous = -1;
      for (const index of stage.sceneIndexes) {
        const text = packet.sceneVersions[index].version;
        const position = prompt.indexOf(text);
        if (position <= previous) throw new Error(`${packet.caseId}: actual stage does not finish the ordered statements before replay`);
        previous = position;
      }
      const activeIndexes = [...packet.nightStructure.segment1SceneIndexes, ...packet.nightStructure.segment2SceneIndexes];
      for (const sceneIndex of activeIndexes.filter(index => packet.sceneVersions[index].questionSequence?.length)) {
      const scene = packet.sceneVersions[sceneIndex];
      const ordered = scene.questionSequence.map(id => scene.questionOptions.find(option => option.id === id));
      // Isolate each saved answer for exact speaker/text parity. The complete
      // routes above separately exercise progression through these questions.
      for (const [step, spokenOption] of ordered.entries()) {
      const option = spokenOption;
      const optionIndex = scene.questionOptions.indexOf(option);
      const completedOptionIds = ordered.slice(0, step + 1).map(option => option.id);
      await page.evaluate(({ caseIndex, sceneIndex, option, optionIndex, completedOptionIds, secondNight }) => {
        const key = "livestream-detective-save-v1";
        const save = JSON.parse(localStorage.getItem(key));
        const briefId = save.caseBriefs[caseIndex].id;
        save.scene = "sceneQuestionAnswer";
        save.caseOvernights ??= {};
        save.caseOvernights[briefId] = { ...save.caseOvernights[briefId], segment: secondNight ? "night2" : "night1", hangupDone: secondNight };
        save.dialogueProgress = { ...save.dialogueProgress, [`${briefId}:sceneReview`]: sceneIndex };
        save.sceneQuestionFocus = { caseId: briefId, sceneIndex, kind: "key", optionIndex };
        save.sceneQuestionPicks = { [`${briefId}:scene:${sceneIndex}`]: { ...option, optionId: option.id, optionIndex, completedOptionIds } };
        save.caseActionLog = { [briefId]: { [`version:${sceneIndex}`]: true } };
        save.settings.screenEffects = "off";
        save.dialogueReading = null;
        localStorage.setItem(key, JSON.stringify(save));
      }, { caseIndex, sceneIndex, option, optionIndex, completedOptionIds, secondNight: packet.nightStructure.segment2SceneIndexes.includes(sceneIndex) });
      await page.reload();
      await click(page, "[data-continue-story]");
      await page.locator(".question-answer-card").waitFor({ state: "attached" });
      const actual = await page.locator(".question-answer-card .call-line").evaluateAll((rows) => rows.map((row) => ({
        speaker: row.querySelector("b").textContent, text: row.querySelector("p").textContent
      })));
      const expected = [
        { role: "host", text: spokenOption.question }, ...(spokenOption.resistanceBeat?.lines ?? []),
        ...(spokenOption.lines?.length ? spokenOption.lines : [{ role: "caller", text: spokenOption.answer }]),
        ...(spokenOption.reactionLine ? [{ role: "caller", text: spokenOption.reactionLine }] : []), ...(step === ordered.length - 1 ? scene.sceneCloser?.lines ?? [] : [])
      ].filter((line) => !["pause", "stage"].includes(line.role)).map((line) => ({
        speaker: line.role === "host" || ["你", "林旭阳"].includes(line.speaker) ? "林旭阳" : line.speaker ?? "咨询者",
        text: line.text ?? line.line ?? ""
      }));
      if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${packet.caseId}: rendered answer speakers/order differ from authored lines`);
      for (const line of actual) {
        const marker = `**${line.speaker}：** ${line.text}`;
        if (!director.includes(marker) || !continuousReading.includes(marker)) throw new Error(`${packet.caseId}: script omitted rendered dialogue ${marker}`);
      }
      smokeProgress(`PASS ${packet.caseId}/${scene.id}/${step + 1}: ${actual.length} answer turns match scripts`);
      }
      }
      await verifyOrderedCounterAndCare(page, packet, caseIndex);
    } finally { await context.close(); }
  }
}

async function verifyOrderedCounterAndCare(page, packet, caseIndex) {
  const seed = async (scene, beatId = "") => {
    await page.evaluate(({ scene, beatId, caseIndex }) => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(localStorage.getItem(key));
      save.scene = scene;
      save.activeLiveCounterBeatId = beatId;
      const briefId = save.caseBriefs[caseIndex].id;
      save.caseOvernights ??= {};
      if (scene === "careChoice") save.caseOvernights[briefId] = { ...save.caseOvernights[briefId], segment: "night2", hangupDone: true };
      save.liveCounterPicks = {};
      save.careChoices = {};
      save.dialogueReading = null;
      save.sceneQuestionFocus = null;
      save.settings.screenEffects = "off";
      localStorage.setItem(key, JSON.stringify(save));
    }, { scene, beatId, caseIndex });
    await page.reload();
    await click(page, "[data-continue-story]");
  };
  for (const beat of packet.overnightStructure.liveCounterBeats.filter(beat => beat.choiceMode === "sequence")) {
    await seed("liveCounterBeat", beat.id);
    for (const choice of beat.choices) {
      if (await page.locator("[data-live-counter-choice]").count() !== 1) throw new Error(`${beat.id}: expected exactly one next exchange`);
      if (await page.locator("[data-continue-live-counter]").count()) throw new Error(`${beat.id}: premature exit`);
      await click(page, `[data-live-counter-choice="${choice.id}"]`);
      const actual = await page.locator(".live-counter-response").textContent();
      for (const line of choice.lines ?? []) if (line.text && !actual.includes(line.text)) throw new Error(`${beat.id}/${choice.id}: missing authored reply`);
      await page.reload();
      await click(page, "[data-continue-story]");
    }
    if (await page.locator("[data-continue-live-counter]").count() !== 1) throw new Error(`${beat.id}: final exchange did not unlock exit`);
    if (beat.choices.some(choice => choice.endingImpact === "platform-data-loss")) {
      const paid = await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem("livestream-detective-save-v1")).liveCounterPicks).some(pick => pick.endingImpact === "platform-data-loss"));
      if (!paid) throw new Error(`${beat.id}: later dialogue erased the recommendation loss`);
    }
    smokeProgress(`PASS ${beat.id}: all ${beat.choices.length} ordered exchanges survive reload`);
  }
  const question = packet.overnightStructure.callerQuestion;
  if (question?.choiceMode === "sequence") {
    await seed("callerQuestion");
    // Restore an old exclusive result at the active scene. It cannot skip steps.
    await page.evaluate(({ caseIndex, lastId }) => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(localStorage.getItem(key));
      const id = save.caseBriefs[caseIndex].id;
      save.caseOvernights[id] = { ...save.caseOvernights[id], segment: "night2", callerQuestionChoiceId: lastId };
      delete save.caseOvernights[id].callerQuestionCompletedIds;
      save.caseActionLog[id] = { ...save.caseActionLog[id], "overnight:callerQuestion": true };
      save.dialogueReading = null;
      localStorage.setItem(key, JSON.stringify(save));
    }, { caseIndex, lastId: question.options.at(-1).id });
    await page.reload();
    await click(page, "[data-continue-story]");
    for (const [index, option] of question.options.entries()) {
      if (await page.locator("[data-caller-question]").count() !== 1) throw new Error("counterquestion must expose exactly one ordered response");
      await click(page, `[data-caller-question="${option.id}"]`);
      const actual = await page.locator(".caller-question-dialogue").textContent();
      for (const line of option.lines ?? [{ text: option.callerLine }]) if (!actual.includes(line.text)) throw new Error("counterquestion omitted caller reply");
      if (index === 1) {
        const directory = resolve(root, "output/playwright/caller-question-sequence");
        await mkdir(directory, { recursive: true });
        for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
          await page.setViewportSize(viewport);
          await drainDialogue(page, {});
          await page.screenshot({ path: resolve(directory, `${viewport.width}.png`), fullPage: true });
        }
        await page.setViewportSize({ width: 1280, height: 720 });
      }
      await page.reload();
      await click(page, "[data-continue-story]");
      const state = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")));
      const id = state.caseBriefs[caseIndex].id;
      if (state.caseActionLog[id]["overnight:callerQuestion"]) throw new Error("counterquestion marked complete before final exchange was read");
      if (state.caseOvernights[id].callerQuestionCompletedIds.length !== index + 1) throw new Error("counterquestion save lost its ordered prefix");
      await click(page, "[data-caller-sequence-continue]");
    }
    if (await page.locator("[data-caller-question]").count()) throw new Error("counterquestion did not exit after all exchanges");
    smokeProgress(`PASS ${packet.caseId}: counterquestion legacy save and ${question.options.length} ordered responses`);
  }
  await seed("careChoice");
  for (const choice of packet.careChoices) {
    if (await page.locator("[data-care-choice]").count() !== 1) throw new Error(`${packet.caseId}: care options still branch`);
    if (await page.locator("[data-care-choice-continue]").count()) throw new Error(`${packet.caseId}: premature care exit`);
    await click(page, `[data-care-choice="${choice.id}"]`);
    await page.reload();
    await click(page, "[data-continue-story]");
    const actual = await page.locator(".care-choice-dialogue").textContent();
    if (!actual.includes(choice.hostLine)) throw new Error(`${packet.caseId}: wrong care response after reload`);
  }
  if (await page.locator("[data-care-choice-continue]").count() !== 1) throw new Error(`${packet.caseId}: care sequence did not finish`);
  if (caseIndex === 0) {
    const directory = resolve(root, "output/host-style-2026-09-12");
    await mkdir(directory, { recursive: true });
    await page.screenshot({ path: resolve(directory, "care-desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: resolve(directory, "care-mobile.png"), fullPage: true });
  }
  smokeProgress(`PASS ${packet.caseId}: all ${packet.careChoices.length} care exchanges survive reload`);
}

async function runTestimonyReadingMatrix() {
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 1280, height: 800 }, { width: 1280, height: 720 }]) {
  for (const [caseIndex, packet] of authoredCasePackets.entries()) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(browserActionTimeoutMs);
    const sceneIndex = packet.sceneVersions.findIndex(scene => scene.interactionMode === "testimonyWall");
    for (const act of packet.sceneVersions[sceneIndex].testimonyWall.acts) {
      verifiedTestimonyActs.delete(`${packet.id ?? packet.caseId}/${act.id}`);
    }
    try {
      await openCaseAtChapter(page, caseIndex + 1, `testimony-reading-${packet.caseId}`);
      await page.evaluate(({ caseIndex, sceneIndex, sceneCount, checkCount }) => {
        const key = "livestream-detective-save-v1";
        const save = JSON.parse(localStorage.getItem(key));
        const briefId = save.caseBriefs[caseIndex].id;
        save.scene = "testimonyWall";
        const brief = save.caseBriefs[caseIndex];
        save.caseOvernights = {...save.caseOvernights, [briefId]: {...save.caseOvernights?.[briefId], segment:"night2", hangupDone:true}};
        save.caseNights = {...save.caseNights, [briefId]: {...save.caseNights?.[briefId], segment:"segment2", hangupDone:true}};
        save.caseActionLog = {...save.caseActionLog, [briefId]: Object.fromEntries([
          ...Array.from({length: sceneCount}).flatMap((_, index) => index < sceneIndex ? [[`version:${index}`, true]] : []),
          ...Array.from({length: checkCount}).map((_, index) => [`evidenceCheck:${index}`, true])
        ])};
        save.dialogueProgress = { ...save.dialogueProgress, [`${briefId}:sceneReview`]: sceneIndex };
        save.settings.screenEffects = "off";
        save.dialogueReading = null;
        localStorage.setItem(key, JSON.stringify(save));
      }, { caseIndex, sceneIndex, sceneCount: packet.sceneVersions.length, checkCount: packet.evidenceChecks?.length ?? 0 });
      await page.reload();
      await click(page, "[data-continue-story]");
      for (let step = 0; step < 12; step += 1) {
        await drainDialogue(page, {});
        if (await testimonyFlowIsVisible(page)) await completeTestimonyWall(page);
        else if (await page.locator("[data-evidence-check]").count()) await click(page, "[data-evidence-check]");
        else if (await page.locator("[data-after-scene-evidence]").count()) await click(page, "[data-after-scene-evidence]");
        else break;
      }
      for (const act of packet.sceneVersions[sceneIndex].testimonyWall.acts) {
        if (!verifiedTestimonyActs.has(`${packet.id ?? packet.caseId}/${act.id}`)) throw new Error(`${packet.caseId}/${act.id} did not finish the parity fixture: ${(await page.locator("body").innerText()).slice(0, 1800)}`);
      }
      const sources = await page.locator(".dialogue-card .call-dialogue").allTextContents();
      const oldVersion = packet.sceneVersions[sceneIndex].version;
      if (sources.join("\n").includes(oldVersion)) throw new Error(`${packet.caseId} replayed its legacy statement after testimony`);
      smokeProgress(`PASS ${packet.caseId} testimony at ${viewport.width}x${viewport.height}`);
    } finally {
      await context.close();
    }
  }
}
}

async function assertTestimonyReading(page, act) {
  const reading = act.reading;
  const actualIds = await page.locator("[data-testimony-press]").evaluateAll(buttons => buttons.map(button => button.dataset.testimonyPress));
  if (JSON.stringify(actualIds) !== JSON.stringify(reading.initialStatements.map(statement => statement.id))) throw new Error(`${act.caseId}/${act.actId}: initial testimony visibility differs from the reading route`);
  const marker = `### 证词墙 · 第 ${reading.act.act} 幕｜${reading.act.title}`;
  const start = continuousReading.indexOf(marker);
  if (start < 0) throw new Error(`continuous reading omitted ${marker}`);
  const next = continuousReading.indexOf("\n### ", start + marker.length);
  const script = continuousReading.slice(start, next < 0 ? undefined : next);
  let position = marker.length;
  const sequence = [
    ...reading.initialStatements.map(statement => statement.text),
    ...reading.presses.flatMap(press => [press.response, ...press.revealed.map(statement => `【追问后补充的原话】${statement.text}`)]),
    `【你出示：${reading.material.label}】`,
    `【正式指认原句：${reading.target.text}】`,
    reading.present.callerLine, reading.present.hostLine
  ];
  for (const text of sequence) {
    const found = script.indexOf(text, position);
    if (found < 0) throw new Error(`${act.caseId}/${act.actId}: continuous reading omitted or reordered ${text}`);
    position = found + text.length;
  }
}

async function currentTestimonySmokeAct(page) {
  const visibleStatementIds = new Set(await page.locator("[data-testimony-press]").evaluateAll((buttons) => (
    buttons.map((button) => button.dataset.testimonyPress).filter(Boolean)
  )));
  const matches = testimonySmokeActs.filter((act) => act.statementIds.some((statementId) => visibleStatementIds.has(statementId)));
  if (matches.length !== 1) {
    throw new Error(`expected one authored testimony act for visible statements, found ${matches.length}`);
  }
  return matches[0];
}

async function waitForEnabled(page, selector) {
  await page.waitForFunction((targetSelector) => {
    const button = document.querySelector(targetSelector);
    return button instanceof HTMLButtonElement && !button.disabled;
  }, selector);
}

async function completeOvernightDay(page, route) {
  await completeLinearInvestigation(page, route);
}

async function completeLinearInvestigation(page, route = {}) {
  const enteredDays = [];
  let checkedResume = false;
  for (let step = 0; step < 48; step += 1) {
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}"));
    const packet = authoredCasePackets[Number(saved.chapter ?? 1) - 1];
    const key = saved.caseBriefs[Number(saved.chapter ?? 1) - 1].id;
    if (saved.scene === "overnightCallback") {
      const done = saved.caseOvernights[key].dayScenesDone;
      const expected = packet.overnightStructure.dayScenes.map((scene) => scene.id);
      if (JSON.stringify(done) !== JSON.stringify(expected)) throw new Error(`${route.name}: incomplete or out-of-order day scenes: ${done}`);
      if (await page.locator("[data-overnight-opener]").count()) throw new Error("linear callback must not offer material selection");
      const inventory = saved.caseNights[key].inventory ?? [];
      for (const action of packet.nightStructure.interlude.actions) {
        if (!(saved.caseNights[key].interludeActionsDone ?? []).includes(action.id)) throw new Error(`missing interlude ${action.id}`);
        for (const item of action.grantsInventory ?? []) if (!inventory.includes(item)) throw new Error(`missing carried material ${item}`);
      }
      if (saved.caseOvernights[key].dayBudget.used !== 0 || saved.caseNights[key].interludeBudget.used !== 0) throw new Error("linear investigation must not spend action points");
      return;
    }
    await assertNoPageText(page, "剩余 0 格", "linear investigation must not display action points");
    if (await page.locator("[data-day-scene], [data-interlude-action]").count()) throw new Error("linear investigation must not display a location menu");
    if (saved.scene === "dayActOpening") {
      await activate(page, route, "[data-enter-day-map]");
      continue;
    }
    if (saved.scene === "interludeDesk") {
      const action = packet.nightStructure.interlude.actions.find((a) => a.id === saved.caseNights[key].activeActionId);
      if (!action) throw new Error("linear interlude has no active scene");
      await drainDialogue(page, route);
      await assertNoPageText(page, "ON AIR", "interlude must remain off air");
      if (packet.caseId === "01-credit" && action.id === "friend-dm-early") {
        await assertVisibleText(page,"第三次来啦","first night must show the actual old post");
        await assertVisibleText(page,"两年前","old post date must be visible before second night");
        route.oldPostSeen = true;
      }
      if (packet.caseId === "02-tony" && action.id === "reopen-training") {
        await assertVisibleText(page, "门店培训卡", "store statement must open the actual store material");
        await assertNoPageText(page, "走Tony户", "full roster must not leak into first-night store statement");
      }
      if (await page.locator("[data-evidence-check]").count()) {
        const material = action.kind === "backflowEarly"
          ? packet.investigationHooks.find((h) => h.id === action.hookId)
          : packet.evidenceChecks.find((c) => action.focusCheckIds?.includes(c.id));
        const optionIndex = Math.max(0, material.options.findIndex((o) => o.correct));
        await activate(page, route, "[data-evidence-check]", optionIndex);
        await drainDialogue(page, route);
        const resultSave = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")));
        if (resultSave.caseNights[key].activeActionId !== action.id) throw new Error("material result skipped before acknowledgement");
        await activate(page, route, "[data-return-interlude]");
      } else if (await page.locator("[data-interrupt-choice]").count()) {
        await activate(page, route, "[data-interrupt-choice]");
        await activate(page, route, "[data-return-interlude]");
      } else {
        await activate(page, route, "[data-return-interlude], [data-complete-interlude-action]");
      }
      continue;
    }
    if (saved.scene === "dayScene") {
      const scene = packet.overnightStructure.dayScenes.find((entry) => entry.id === saved.caseOvernights[key].activeDaySceneId);
      if (!scene) throw new Error("linear day has no active scene");
      enteredDays.push(scene.id);
      let transcript = await drainDialogue(page, route);
      await assertNoPageText(page, "ON AIR", "day scene must remain off air");
      if (await page.locator("[data-day-choice]").count()) throw new Error("redundant material choice survived linearization");
      if (scene.body.timelineSort) {
        for (const card of scene.body.timelineSort.correctOrder) await activate(page, route, `[data-day-timeline-card="${card}"]`);
        await activate(page, route, "[data-submit-day-timeline]");
      }
      if (scene.kind === "document") {
        const document = packet.documents.find((doc) => doc.id === scene.body.documentId);
        const sceneRoute = (route.dayScenes ?? []).find((item) => typeof item === "object" && item.id === scene.id);
        const rows = sceneRoute?.rows ?? route.documentRows ?? document.focusRowIds?.slice(0, 2) ?? document.rows.slice(0, 2).map((row) => row.rowId);
        for (const id of rows) {
          const beforeMark = await page.evaluate(() => ({ page: scrollY, table: document.querySelector(".bank-flow-table").scrollTop }));
          await activate(page, route, `[data-document-row="${id}"]`);
          await waitForAnimationFrames(page, 2);
          const afterMark = await page.evaluate(() => ({ page: scrollY, table: document.querySelector(".bank-flow-table").scrollTop,
            focusedRow: document.activeElement?.getAttribute("data-document-row") }));
          if (afterMark.focusedRow !== id || Math.abs(afterMark.page - beforeMark.page) > 2 || Math.abs(afterMark.table - beforeMark.table) > 2) {
            throw new Error(`document marking must preserve the row and scroll position: ${JSON.stringify({ beforeMark, afterMark })}`);
          }
        }
        await assertVisibleText(page, "圈好了，继续", "document inspection must have an explicit completion exit");
      }
      if (route.name === "accounting-support" && !checkedResume) {
        checkedResume = true;
        await page.reload({ waitUntil: "domcontentloaded" });
        await activate(page, route, "[data-continue-story]");
        await drainDialogue(page, route);
        await assertOvernightState(page, (night) => night.activeDaySceneId === scene.id, "reload must resume the active investigation scene");
      }
      await activate(page, route, "[data-complete-day-scene]");
      continue;
    }
    throw new Error(`Unexpected linear investigation phase ${saved.scene}`);
  }
  throw new Error(`Linear investigation did not finish: ${enteredDays}`);
}

async function runCaseTransition() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(browserActionTimeoutMs);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-case-transition-${Date.now()}&storyKey=steam-demo-01`);
    await page.locator("[data-player-name]").fill("周明");
    await click(page, "[data-start-story]");
    await enterNightFromCafePrologue(page, {});
    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 1;
      save.caseBrief = save.caseBriefs?.[0] ?? null;
      save.screen = "chapter";
      save.scene = "storyInterlude";
      save.dialogueReading = null;
      save.recapStep = 0;
      save.lastReaction = null;
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await page.getByText("第 2 晚 · 收播以后").first().waitFor({ state: "visible" }).catch(async () => {
      throw new Error(`first case tail did not render after closure:\n${await page.locator("body").innerText()}`);
    });
    await assertVisibleText(page, "第 2 晚 · 收播以后", "closure should move into the first case's lived epilogue without an authorial case-tail label");
    if (await page.locator('[data-enter-case-bridge]:visible').count()) throw Error('interlude must finish reading before the next case');
    const firstLine = await page.locator('.avg-textbox').innerText();
    await page.reload(); await click(page, '[data-continue-story]');
    if (await page.locator('.avg-textbox').innerText() !== firstLine) throw Error('interlude reload lost the current reading page');
    const interludeText = await drainDialogue(page, {});
    if (!interludeText.includes('我们俩大概一开始就看不上对方')) throw Error('interlude omitted the relationship exchange');
    if (await page.locator('.story-interlude-stage[data-after-case="01-credit"]').count() !== 1) throw new Error("first case interlude must return to the off-air studio stage");
    if (await page.locator('.interlude-zhao img[src*="zhao-lawyer-teasing-pixel"]').count() !== 1) throw new Error("first case interlude must use Zhao's teasing portrait state");
    if (await page.locator(".pixel-transition-signal-disconnect").count() !== 1) throw new Error("program interlude should use one short disconnect signal transition");
    await click(page, "[data-enter-case-bridge]");
    await assertNoPageText(page, "祸莫大于不知足", "first interlude must not append the removed classic quote");
    await assertVisibleText(page, "CASE 02", "second case must open on a numbered case title card");
    await assertVisibleText(page, "职场报销截图", "second case title card should name the workplace case");
    await assertNoPageText(page, "02 / 04", "case title must not expose the whole-night directory");
    await assertNoPageText(page, "自己人", "case title must not frame the case with an author-written theme word");
    await assertNoPageText(page, "新案接入", "case title must not duplicate its own meaning in a scene label");
    if (await page.locator(".pixel-transition-signal-connect").count()) throw new Error("case title must not add a second transition before the static title card");
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
      save.scene = "storyInterlude";
      save.dialogueReading = null;
      save.storyWorldEchoes = {};
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await assertVisibleText(page, "第 4 晚 · 私下咨询之后", "second case must close its private consultation");
    await drainDialogue(page, {});
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("world echo must stay hidden until the final case");
    await assertVisibleText(page, "接一通插播", "second act interlude must expose the optional quick-call pressure valve");
    await click(page, "[data-enter-optional-quick]");
    await playStatementQuickCase(page, { width: 390, height: 844 }, {
      caseId: "01-no-conditions",
      alreadySelected: true,
      rounds: [
        ["好听的也不会讲"],
          ["爸爸给了我一百万"],
          ["或者是我不能生孩子"],
        ["先别急吧", "先跟他说一句，我这人还可以"]
      ],
      decoyAnchor: "我二十四，在商场卖衣服",
      expectedListen: ["我二十四，在商场卖衣服", "好听的也不会讲"],
    });
    await assertVisibleText(page, "回到主线", "optional quick call must offer a main-story return instead of the standalone case picker");
    await click(page, "[data-quick-select]");
    await assertNoPageText(page, "名不正，则言不顺", "second interlude must not append the removed classic quote");
    await assertVisibleText(page, "CASE 03", "case two tail must return to the normal case transition");

    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 4;
      save.caseBrief = save.caseBriefs?.[3] ?? null;
      save.scene = "storyInterlude";
      save.dialogueReading = null;
      save.storyWorldEchoHypotheses = {};
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await page.getByText("收播以后").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "收播以后", "final case must have its own lived epilogue");
    const finalInterludeText = await drainDialogue(page, {});
    if (!finalInterludeText.includes("屏幕右上角的“直播中”灭了")) throw new Error("final case tail must close through an on-screen action");
    if (await page.getByText("下一通 · 材料先到").count()) throw new Error("final case tail must not show a nonexistent next case");
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("final world echo must not appear before player action");
    await assertVisibleText(page, "把四案里的宸直线索并在一起", "final world echo must first ask the player to connect the cross-case risk");
    await click(page, '[data-world-echo-hypothesis="cross-case-ledger"]');
    const hypothesisText = await drainDialogue(page, {});
    if (!hypothesisText.includes("栖行融资稿的押金归集附注")) throw new Error("the selected cross-case hypothesis must be acknowledged before the reveal");
    await assertVisibleText(page, "把新闻推送点开", "final world echo must be offered after the player records a hypothesis");
    if (await page.getByText("作为关联项目配资资金", { exact: false }).count()) throw new Error("deposit leverage must remain undisclosed before opening the notice");
    await click(page, "[data-reveal-world-echo]");
    const newsText = await drainDialogue(page, {});
    if (!newsText.includes("作为关联项目配资资金")) throw new Error("the disposal notice must pay off the deposited-funds trail");
    await assertVisibleText(page, "宸直信托全部产品暂停兑付，实控人失联", "final world echo must pay off the case-one and case-two trust seeds");
    if (!newsText.includes("各笔清偿金额尚未公布")) throw new Error("final world echo must preserve the unresolved recovery boundary");
    if (await page.locator('.story-world-echo-stage img[src*="chenzhi-news-push-pixel"]').count() !== 1) throw new Error("final world echo must switch to the trust-news ending CG");
    await click(page, "[data-enter-night-epilogue]");
    await assertVisibleText(page, "直播中", "whole-night epilogue should begin only after the fourth case tail");
    for (let index = 0; index < 8 && await page.locator("[data-epilogue-unread-next]").count(); index += 1) {
      await click(page, "[data-epilogue-unread-next]");
    }
    if (await page.locator('.night-ending-cg-stage img[src*="envelope-2019-pixel"]').count() !== 1) throw new Error("whole-night epilogue must end on the 2019 envelope CG");
    await assertVisibleText(page, "账单原件 · 2019-11-08", "the envelope date must be identified as the original bill date");
    await assertVisibleText(page, "2022 年 7 月", "the old broadcast must have its own date beside the bill");
    await click(page, "[data-finish-night-shell]");
    const forensicText = await drainDialogue(page, {});
    if (!forensicText.includes("双方带孩子到机构") || !forensicText.includes("没有用那只咬胶") || !forensicText.includes("排除生物学父子关系") || !forensicText.includes("得由法院决定")) {
      throw new Error("the later callback must keep the verified sampling before the result, with court review still required");
    }
    if (!forensicText.includes("收款人不是顾*")) throw new Error("the sequential prologue must pay off both the paternity and account investigations");
    await assertVisibleText(page, "结果只到这里", "the demo prologue must end on a fact boundary rather than a guilty or victory card");
    await click(page, "[data-cafe-finish]");
  } finally {
    await context.close();
  }
}

async function runHostVerdictPresentation() {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 }
  ]) {
    const viewportStartedAt = Date.now();
    smokeProgress(`START host verdict ${viewport.width}x${viewport.height}`);
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(browserActionTimeoutMs);
    try {
      await page.goto(`${playableUrl}?playtest=browser-smoke-host-verdict-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      await click(page, "[data-start-story]");
      await page.evaluate(() => {
        const storageKey = "livestream-detective-save-v1";
        const save = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
        const brief = save.caseBriefs?.find((item) => item.runtimeContentCaseId === "02-tony") ?? {};
        const contradictions = [...new Set((brief.sceneVersions ?? []).map((scene) => scene.contradiction).filter(Boolean))];
        save.chapter = Math.max(1, (save.caseBriefs ?? []).findIndex((item) => item.runtimeContentCaseId === "02-tony") + 1);
        save.caseBrief = brief;
        save.screen = "chapter";
        save.scene = "caseSolved";
        save.recapStep = 1;
        save.lastReaction = null;
        save.contradictionLog = { ...(save.contradictionLog ?? {}), [brief.id]: contradictions };
        save.accusationHistory = [
          ...(save.accusationHistory ?? []).filter((item) => item.caseId !== brief.id),
          { caseId: brief.id, accused: "both", correct: true, dailyBadge: true, quoteHit: true }
        ];
        localStorage.setItem(storageKey, JSON.stringify(save));
      });
      await page.reload();
      await click(page, "[data-continue-story]");
      if (await page.locator(".host-verdict-screen").count() !== 1) throw new Error("host verdict must use its own live-stage screen");
      if (await page.locator('[data-live-shell][data-active-speaker="host"]').count() !== 1) throw new Error("host verdict must highlight the host portrait");
      const hostPortraitClass = await page.locator(".case-portrait-host").getAttribute("class") ?? "";
      if (await page.locator(".case-portrait.active").count() !== 1 || !hostPortraitClass.includes("active")) {
        throw new Error("host verdict must dim the caller and keep only the host active");
      }
      const expectedBeats = [
        "后面的预约先取消",
        "这件事性质不一样",
        "民警联系你的记录",
        "一开始就觉得他长得好看",
        "服务也都做完了",
        "自己的贪心全甩成",
        "已经做过的项目能退多少",
        "原始记录交给民警"
      ];
      for (const expected of expectedBeats) {
        await assertVisibleText(page, expected, `host verdict must stage the beat: ${expected}`);
        if (await page.locator(".avg-page-line").count() !== 1) throw new Error("host verdict must show one current speech bubble");
        if (await page.locator("[data-recap-next]:visible").count()) throw new Error("archive button must stay hidden until the host finishes speaking");
        await page.locator("[data-dialogue-advance]").click();
      }
      await assertVisibleText(page, "整理案卷", "host verdict must hand off to the archive only after its last beat");
      await assertNoPageText(page, "1/4", "host verdict must not display mechanical page counts");
      const viewportFit = await page.locator(".avg-textbox").evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.left >= 0 && box.right <= window.innerWidth && box.bottom <= window.innerHeight;
      });
      if (!viewportFit) throw new Error(`${viewport.width}x${viewport.height} host verdict must fit inside the viewport`);
    } finally {
      await context.close();
    }
    smokeProgress(`PASS  host verdict ${viewport.width}x${viewport.height} (${((Date.now() - viewportStartedAt) / 1000).toFixed(1)}s)`);
  }
}

async function runPortraitViewports() {
  for (const viewport of [
    { width: 390, height: 844, label: "mobile" },
    { width: 1280, height: 720, label: "short-desktop" },
    { width: 1366, height: 768, label: "desktop" },
    { width: 1280, height: 800, label: "deck-css" },
    { width: 1920, height: 1080, label: "wide-desktop" }
  ]) {
    const viewportStartedAt = Date.now();
    smokeProgress(`START portrait viewport ${viewport.label} ${viewport.width}x${viewport.height}`);
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(browserActionTimeoutMs);
    try {
      await page.goto(`${playableUrl}?playtest=portrait-${viewport.label}-${Date.now()}&storyKey=steam-demo-01`);
      await click(page, "[data-start-story]");
      await enterNightFromCafePrologue(page, {});
      await revealGolden90(page, {});
      if (await page.locator("[data-enter-first-case]").count()) {
        await click(page, "[data-enter-first-case]");
        await click(page, "[data-enter-case-live]");
      }
      await drainDialogue(page, {});
      await assertPixelPortrait(page, 1);
      const layout = await page.evaluate(() => {
        const shell = document.querySelector(".case-vn-grid");
        const portraitLayer = document.querySelector(".case-duel-portraits");
        const portrait = document.querySelector(".case-portrait-caller.art-pixel img:not([hidden])");
        const stage = document.querySelector("[data-live-stage]");
        const rect = portrait?.getBoundingClientRect();
        const stageRect = stage?.getBoundingClientRect();
        const shellRect = shell?.getBoundingClientRect();
        const currentLine = document.querySelector(".avg-page-line");
        const currentRole = currentLine?.dataset.dialogueRole
          ?? (currentLine?.classList.contains("speaker-host") ? "host" : currentLine?.classList.contains("speaker-caller") ? "caller" : "stage");
        const activeRole = document.querySelector("[data-dialogue-portrait].active")?.dataset.dialoguePortrait ?? "";
        const actionRects = Array.from(document.querySelectorAll(".avg-choice-overlay:not([hidden]) button:not(:disabled)"))
          .map((button) => button.getBoundingClientRect())
          .filter((buttonRect) => buttonRect.width > 0 && buttonRect.height > 0);
        return {
          shellOverflow: shell ? shell.scrollWidth - shell.clientWidth : 999,
          pointerEvents: portraitLayer ? getComputedStyle(portraitLayer).pointerEvents : "missing",
          imageRendering: portrait ? getComputedStyle(portrait).imageRendering : "missing",
          portraitCount: document.querySelectorAll("[data-dialogue-portrait]").length,
          activePortraitCount: document.querySelectorAll("[data-dialogue-portrait].active").length,
          shellWidth: shell?.getBoundingClientRect().width ?? 0,
          stageWidth: stageRect?.width ?? 0,
          stageLeftGap: stageRect && shellRect ? stageRect.left - shellRect.left : null,
          currentRole,
          activeRole,
          actionBottomOverflow: actionRects.length ? Math.max(...actionRects.map((buttonRect) => buttonRect.bottom - window.innerHeight)) : null,
          rect: rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width } : null
        };
      });
      if (!layout.rect) throw new Error(`${viewport.label} portrait layout is missing`);
      if (layout.shellOverflow > 2) throw new Error(`${viewport.label} portrait shell overflows horizontally by ${layout.shellOverflow}px`);
      if (layout.pointerEvents !== "none") throw new Error(`${viewport.label} portrait layer must not block dialogue or choices`);
      if (layout.imageRendering !== "pixelated") throw new Error(`${viewport.label} portrait must keep nearest-neighbor rendering`);
      if (layout.portraitCount !== 2) throw new Error(`${viewport.label} live dialogue stage must keep host and caller portraits`);
      if (layout.activePortraitCount !== 1) throw new Error(`${viewport.label} live dialogue stage must highlight exactly one speaker portrait`);
      if (layout.currentRole && layout.activeRole !== layout.currentRole) {
        throw new Error(`${viewport.label} live dialogue leaves ${layout.activeRole} active after ${layout.currentRole} finishes speaking`);
      }
      if (viewport.width <= 860 && (layout.stageWidth < layout.shellWidth - 2 || Math.abs(layout.stageLeftGap ?? 0) > 2)) {
        throw new Error(`${viewport.label} live dialogue stage keeps a desktop side column (${Math.round(layout.stageWidth)}/${Math.round(layout.shellWidth)}px)`);
      }
      if (viewport.width >= 1440 && layout.shellWidth < viewport.width * 0.9) {
        throw new Error(`${viewport.label} live stage uses only ${Math.round(layout.shellWidth)}px of a ${viewport.width}px fullscreen viewport`);
      }
      if (layout.rect.left < -1 || layout.rect.right > viewport.width + 1) {
        throw new Error(`${viewport.label} portrait escapes the viewport horizontally: ${JSON.stringify(layout.rect)}`);
      }
      if (layout.rect.width > Math.min(viewport.width * 0.5, 420)) throw new Error(`${viewport.label} portrait is too wide for the full-stage dialogue composition`);
      if (layout.actionBottomOverflow !== null && layout.actionBottomOverflow > 2) {
        throw new Error(`${viewport.label} live dialogue pushes the next action ${layout.actionBottomOverflow.toFixed(1)}px below the viewport`);
      }
    } finally {
      await context.close();
    }
    smokeProgress(`PASS  portrait viewport ${viewport.label} ${viewport.width}x${viewport.height} (${((Date.now() - viewportStartedAt) / 1000).toFixed(1)}s)`);
  }
}

async function advanceToAccusation(page, route) {
  for (let step = 0; step < 16; step += 1) {
    if (await page.locator("[data-accuse]").count()) return;
    if (await testimonyFlowIsVisible(page)) {
      await completeTestimonyWall(page, route);
      continue;
    }
    if (await page.locator("[data-after-scene-evidence]").count()) {
      await activate(page, route, "[data-after-scene-evidence]");
      continue;
    }
    if (await page.locator("[data-delegation-advisor]").count()) {
      if (route.name === "accounting-support") {
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
      const question = authoredCasePackets[0].overnightStructure.callerQuestion;
      if (question.choiceMode === "sequence") {
        if (await page.locator("[data-caller-question]").count() !== 1) throw new Error("caller question still offers exclusive alternatives");
        await activate(page, route, "[data-caller-question]");
      } else await activate(page, route, `[data-caller-question="${route.callerQuestion}"]`);
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
    if (await page.locator("[data-caller-sequence-continue]").count()) {
      await activate(page, route, "[data-caller-sequence-continue]");
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
      continue;
    }
    if (await page.locator("button[data-scene]").count()) {
      await activate(page, route, "button[data-scene]");
      continue;
    }
    if (await page.locator("[data-evidence-check]").count()) {
      await activate(page, route, "[data-evidence-check]");
      continue;
    }
    const remaining = Math.max(1, deadline - Date.now());
    await page.waitForFunction(() => [
      ".recap-score-head",
      "[data-after-investigation]",
      "button[data-scene]",
      "[data-evidence-check]"
    ].some((selector) => document.querySelector(selector)), undefined, { timeout: remaining }).catch(() => {});
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
  await drainDialogue(page, route);
  await page.locator("[data-recap-next]:visible").first().waitFor({ state: "visible" });
  await activate(page, route, "[data-recap-next]:visible");
  for (let step = 0; step < 2 && !(await page.locator("body").innerText()).includes("麦外来信"); step += 1) {
    await drainDialogue(page, route);
    if (!(await page.locator("[data-recap-next]:visible").count())) break;
    await activate(page, route, "[data-recap-next]:visible");
  }
  await assertVisibleText(page, "麦外来信", "Recap final page should keep off-mic letters after boundary placement");
  const finalBody = await page.locator("body").innerText();
  if (finalBody.includes("灯是我真心买的")) {
    assertTextOrder(finalBody, [
      "收麦后，对方给后台留了一段文字",
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
  if(await page.locator('[data-night2-transition-done]:visible').count()) await page.locator('[data-night2-transition-done]').click();
  const shownText = new Set();
  for (let line = 0; line < 160; line += 1) {
    const box = page.locator("[data-dialogue-advance]:not([data-dialogue-done]):visible").first();
    if (!await box.count()) {
      if (await page.locator("[data-finish-question]:visible").count()) {
        await page.locator("[data-finish-question]").click();
        continue;
      }
      await assertInlineContinuePlacement(page);
      return [...shownText].join("\n");
    }
    await assertDialoguePageDensity(box);
    const currentPageText = (await box.locator(".avg-line").allTextContents()).join("\n").trim();
    if (currentPageText) shownText.add(currentPageText);
    if (route.inputMode === "keyboard") await page.keyboard.press("Enter");
    else if (route.inputMode === "gamepad") {
      const sampledAdvances = gamepadDialogueSamples.get(route) ?? 0;
      // Sample real A-button dialogue handling, then batch the remaining prose.
      // Choice activation still uses the Gamepad API for the whole route.
      if (sampledAdvances < gamepadDialogueSampleLimit) {
        await gamepadPress(page, 0);
        gamepadDialogueSamples.set(route, sampledAdvances + 1);
      } else {
        await box.evaluate((element) => element.click());
      }
    } else await box.evaluate((element) => element.click());
    const pageText = (await box.locator(".avg-line").allTextContents()).join("\n").trim();
    if (pageText) shownText.add(pageText);
  }
  throw new Error("per-line dialogue did not finish within 160 advances");
}

async function assertInlineContinuePlacement(page) {
  const overlay = page.locator(".dialogue-focus-stage .avg-choice-overlay.inline-choice-flow:visible").first();
  if (!await overlay.count()) return;
  const placement = await overlay.evaluate((element) => {
    const stage = element.closest(".vn-stage");
    const button = [...element.querySelectorAll("button.primary:not(:disabled), button, summary")].find(el => el.getBoundingClientRect().height > 0);
    const stageRect = stage?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    return {
      insideRecord: Boolean(element.closest(".court-record")),
      multiQuestionBar: Boolean(element.querySelector(".scene-question-group")),
      replayQuestionBar: Boolean(element.querySelector(".statement-replay-actions")),
      documentBoard: Boolean(element.querySelector(".cafe-evidence-board, .cafe-present-board, .cafe-legal-board")),
      statementBoard: Boolean(element.querySelector(".cafe-opening-action")),
      stageRatio: stageRect && buttonRect ? (buttonRect.top - stageRect.top) / Math.max(1, stageRect.height) : -1,
      bottomOverflow: stageRect && buttonRect ? buttonRect.bottom - stageRect.bottom : 999
    };
  });
  const minimumStageRatio = placement.multiQuestionBar || placement.replayQuestionBar ? 0.44 : 0.55;
  const structuredBoard = placement.statementBoard || placement.documentBoard || await page.locator(".focused-evidence-inquiry").count();
  if (placement.insideRecord || (!structuredBoard && placement.stageRatio < minimumStageRatio) || placement.bottomOverflow > 2) {
    throw new Error(`main continue action must stay in the lower dialogue stage, got ${JSON.stringify(placement)}`);
  }
}

async function assertDialoguePresentation(page) {
  const box = page.locator("[data-dialogue-advance]");
  await box.waitFor({ state: "visible" });
  await assertDialoguePageDensity(box);
  const before = await box.locator(".avg-line").first().textContent();
  const restoredChoices = await box.getAttribute("data-dialogue-done") === "true";
  await box.click();
  const completed = await box.locator(".avg-line").first().textContent();
  if (restoredChoices) {
    if (completed !== before) throw new Error("clicking a restored completed dialogue must preserve its last page");
    if (await box.locator(".avg-continue").isVisible()) throw new Error("restored choice state must not invite another dialogue advance");
    if (!await page.locator('[data-scene="sceneReview"]:visible').count()) throw new Error("restored choice state must keep the next action available");
  } else {
    if ((completed?.length ?? 0) < (before?.length ?? 0)) throw new Error("typing click must complete the current sentence");
    if (!await box.locator(".avg-continue").isVisible()) throw new Error("completed sentence must show continue indicator");
  }
  await page.mouse.wheel(0, -120);
  await waitForAnimationFrames(page, 1);
  if (await page.locator(".court-record:not([hidden])").count()) {
    throw new Error("mouse wheel must scroll without opening the court record");
  }
  await page.locator("[data-record-open]").click();
  await page.locator(".court-record:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-record-close]").click();
}

async function assertDialoguePageDensity(box) {
  const lines = box.locator(".avg-page-line");
  // Scene-entry animation mounts the textbox before its first spoken page.
  await lines.first().waitFor({ state: "visible" });
  const count = await lines.count();
  if (count !== 1) {
    throw new Error(`dialogue page must contain exactly one current speaker turn, got ${count}`);
  }
  const focus = await box.evaluate((element) => {
    const line = element.querySelector(".avg-page-line");
    const role = line?.dataset.dialogueRole
      ?? (line?.classList.contains("speaker-host") ? "host" : line?.classList.contains("speaker-caller") ? "caller" : "stage");
    const shell = element.closest("[data-live-shell]");
    const matchingPortrait = shell?.querySelector(`[data-dialogue-portrait="${role}"]`);
    const activePortrait = shell?.querySelector("[data-dialogue-portrait].active");
    return {
      role,
      shellRole: shell?.dataset.activeSpeaker ?? "",
      hasMatchingPortrait: Boolean(matchingPortrait),
      activeRole: activePortrait?.dataset.dialoguePortrait ?? ""
    };
  });
  if (focus.shellRole !== focus.role) {
    throw new Error(`dialogue shell focus ${focus.shellRole} does not match current line ${focus.role}`);
  }
  if (focus.hasMatchingPortrait && focus.activeRole !== focus.role) {
    throw new Error(`active portrait ${focus.activeRole} does not match current line ${focus.role}`);
  }
}

async function click(page, selector, index = 0) {
  await drainDialogue(page, {});
  const target = page.locator(`${selector}:visible`).nth(index);
  await target.waitFor({ state: "visible" });
  await target.evaluate((element) => element.click());
}

async function enterNightFromCafePrologue(page, route = {}) {
  if (!await page.locator(".cafe-prologue-screen").count()) return;
  const openingText = await drainDialogue(page, route);
  if (!openingText.includes("我准备离婚") || !openingText.includes("孩子以后怎么安排")) {
    throw new Error("the playable opening must establish divorce and the child-arrangement conflict before evidence selection");
  }
  const prologue = storyManifest.nightShell.cafePrologue;
  for (const inquiry of prologue.cafe.inquiries) {
    const correct = inquiry.options.find(option => option.correct);
    await activate(page, route, `[data-cafe-inquiry="${correct.id}"]`);
    await drainDialogue(page, route);
  }
  await activate(page, route, '[data-cafe-pressure="camera-off"]');
  await activate(page, route, '[data-cafe-aftermath-next]');
  await activate(page, route, '[data-cafe-aftermath-next]');
  await drainDialogue(page, route);
  await assertVisibleText(page, "回想两年前的直播", "the present-day investigation must hand off to the flashback");
  await activate(page, route, "[data-cafe-aftermath-next]");
  await assertVisibleText(page, "两年前", "the timeline change must have its own readable transition");
  await activate(page, route, "[data-enter-first-flashback]");
}

async function revealGolden90(page, route = {}, { assertContract = false } = {}) {
  let preludeTranscript = "";
  let preludeKinds = null;
  if (await page.locator("[data-start-night-broadcast]").count()) {
    preludeTranscript = (await drainDialogue(page, route)).replace(/\s+/g, "");
    preludeKinds = await page.evaluate(() => ({
      notice: document.querySelectorAll(".night-shell-line.shell-notice").length,
      message: document.querySelectorAll(".night-shell-line.shell-message").length
    }));
    if (assertContract) {
      if (!preludeTranscript.includes("你推开直播间的门")) throw new Error("night shell must begin with the host entering the studio");
      if (preludeTranscript.includes("我只是怕你知道我失业后就离开我")) throw new Error("the forwarded male voice must not play before the player starts broadcasting");
    }
    await activate(page, route, "[data-start-night-broadcast]");
  }
  if (!await page.locator("[data-reveal-cold-open]").count()) return null;
  const debtTranscript = (await drainDialogue(page, route)).replace(/\s+/g, "");
  const debtComments = assertContract ? (await page.locator(".live-comment-strip").innerText()).replace(/\s+/g, "") : "";
  const debtKinds = await page.evaluate(() => ({
    stage: document.querySelectorAll(".night-shell-line.shell-stage").length,
    host: document.querySelectorAll(".night-shell-line.shell-host").length
  }));
  if (assertContract) {
    if (!debtTranscript.includes("我只是怕你知道我失业后就离开我")) throw new Error("golden 90 seconds must open on the authored lost-job voice line");
    if (!debtTranscript.includes("第一位来电人还没接进来") || !debtTranscript.includes("男朋友刚发来")) throw new Error("golden 90 debt screen must identify whose forwarded voice is playing");
    if (!debtComments.includes("听着怪难受")) throw new Error("golden 90 debt screen must keep one plausible first reaction in the comment layer");
    if (debtTranscript.includes("听着怪难受")) throw new Error("golden 90 comments must not be spoken inside the main dialogue bubble");
  }
  await activate(page, route, "[data-reveal-cold-open]");
  if (assertContract) {
    await page.locator(".avg-line:visible").filter({ hasText: "她把后半段也转来了" }).first().waitFor({ state: "visible" });
    await assertVisibleText(page, "她把后半段也转来了", "the first screen after player input must continue the same forwarded exchange");
  }
  const interestTranscript = (await drainDialogue(page, route)).replace(/\s+/g, "");
  const interestComments = assertContract ? (await page.locator(".live-comment-strip").innerText()).replace(/\s+/g, "") : "";
  if (assertContract) {
    if (!interestTranscript.includes("今晚转我行不行")) throw new Error("golden 90 payoff must escalate into the caller's next excuse");
    if (!interestComments.includes("还在催她转钱")) throw new Error("golden 90 payoff must let the room react in the comment layer to the newly heard context");
  }
  return { preludeTranscript, preludeKinds, debtTranscript, debtKinds, interestTranscript };
}

async function collectLiveVisualState(page, visualStates, portraitStates) {
  const state = await page.evaluate(() => ({
    scene: document.querySelector(".visual-scene")?.className ?? "",
    portrait: document.querySelector(".case-portrait-caller")?.className ?? ""
  }));
  if (state.scene) visualStates.add(state.scene);
  if (state.portrait) portraitStates.add(state.portrait);
}

async function assertPixelPortrait(page, chapter) {
  const portrait = page.locator(".case-portrait-caller.art-pixel img").first();
  await portrait.waitFor({ state: "visible" });
  const state = await portrait.evaluate((element) => ({
    src: element.getAttribute("src") ?? "",
    imageRendering: getComputedStyle(element).imageRendering
  }));
  const portraitStem = ({ 1: "caller_credit", 2: "caller_work", 3: "caller_profile", 4: "caller_salon" })[chapter];
  if (!["neutral", "guarded", "pause"].some((kind) => state.src.includes(`${portraitStem}_${kind}_pixel.png`))) {
    throw new Error(`case-${chapter} live call must start from one of the authored pixel portrait states`);
  }
  if (state.imageRendering !== "pixelated") {
    throw new Error(`case-${chapter} pixel portrait must use nearest-neighbor rendering, got ${state.imageRendering}`);
  }
}

async function collectPortraitAsset(page, assets) {
  if (!assets) return;
  const src = await page.locator(".case-portrait-caller img:visible").first().getAttribute("src").catch(() => "");
  if (src) assets.add(src);
}

async function keyboardActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await target.focus();
  const focused = await target.evaluate((element) => document.activeElement === element);
  if (!focused) throw new Error(`keyboard target did not keep focus: ${selector}`);
  await target.press("Enter");
}

async function gamepadActivate(page, selector, index = 0) {
  const target = page.locator(selector).nth(index);
  await target.waitFor({ state: "visible" });
  await target.focus();
  await gamepadPress(page, 0);
}

async function connectGamepad(page) {
  await page.evaluate(() => {
    window.__smokeGamepad.connected = true;
    window.dispatchEvent(new Event("gamepadconnected"));
  });
  await waitForAnimationFrames(page, 2);
}

async function gamepadPress(page, buttonIndex) {
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = true;
  }, buttonIndex);
  await waitForAnimationFrames(page, 1);
  await page.evaluate((index) => {
    window.__smokeGamepad.buttons[index].pressed = false;
  }, buttonIndex);
  await waitForAnimationFrames(page, 1);
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
  const quickLine = page.locator("[data-quick-dialogue-box]:visible").first();
  if (await quickLine.count() && String(await quickLine.getAttribute("data-quick-line-text") ?? "").includes(text)) return;
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

function assertFirstNightStatementsPlayed(packet, transcript) {
  const text = transcript.replace(/\s/g, "");
  let previous = -1;
  for (const index of packet.nightStructure.segment1SceneIndexes) {
    const scene = packet.sceneVersions[index];
    if (scene.testimonyWall) continue;
    const opening = splitDialogueSentences(scene.version)[0]?.replace(/\s/g, "");
    const at = text.indexOf(opening, previous + 1);
    if (!opening || at < 0) throw Error(`next scene statement skipped or out of order: ${packet.caseId}/${scene.id}`);
    previous = at;
  }
}

async function runFocusedCredit() {
  const [width, height] = (process.env.SMOKE_VIEWPORT || "1280x720").split("x").map(Number);
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.setDefaultTimeout(browserActionTimeoutMs);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const transcript = [];
  const visits = [];
  let wrongLoan = false, retriedLoan = false, reloaded = false;
  const directory = resolve(root, "output/playwright/focused-inquiry");
  await mkdir(directory, { recursive: true });
  try {
    await openCaseAtChapter(page, 1, "focused-credit");
    for (let step = 0; step < 110; step += 1) {
      transcript.push(await drainDialogue(page, {}));
      const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")));
      const body = await page.locator("body").innerText();
      transcript.push(body);
      const position = snapshot.dialogueProgress?.[`${snapshot.caseBriefs[0].id}:sceneReview`];
      smokeProgress(`focused ${step}: ${snapshot.scene} / ${position}`);
      if (snapshot.scene === "storyInterlude") {
        if (!wrongLoan || !retriedLoan || !reloaded) throw new Error("retry/reload regression was not exercised");
        const text = transcript.join("\n");
        assertFirstNightStatementsPlayed(authoredCasePackets[0], text);
        for (const phrase of ["酒水", "后台", "两年前", "二十万", "反正八万我不转"]) {
          if (!text.includes(phrase)) throw new Error(`route never rendered ${phrase}`);
        }
        if (visits.some(scene => ["deepFollowup", "investigationBackflow", "caseClosure"].includes(scene))) throw new Error("compact closing reopened a retired completion stage");
        if (errors.length) throw new Error(errors.join("\n"));
        const { writeFile } = await import("node:fs/promises");
        await writeFile(resolve(directory, `credit-route-${width}x${height}.txt`), text);
        await page.screenshot({ path: resolve(directory, `credit-complete-${width}x${height}.png`) });
        smokeProgress("PASS focused credit: first call → materials → local wrong-answer retry → direct closing; reload preserved question order");
        return;
      }
      if (await page.locator('.social-evidence-screen .evidence-target-options').count()) {
        const questions = page.locator('.social-evidence-screen [data-evidence-check]');
        const rects = await questions.evaluateAll(nodes => nodes.map(n => { const r=n.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }));
        if (rects.length !== 3 || rects.some((r,i) => r.h<48 || i && r.y < rects[i-1].y + rects[i-1].h + 8)) throw Error('social questions crowded');
        for (let qi=0; qi<rects.length; qi++) { await questions.nth(qi).scrollIntoViewIfNeeded(); await questions.nth(qi).click({trial:true}); }
        await questions.first().scrollIntoViewIfNeeded();
        await page.screenshot({path:resolve(directory,`credit-social-${snapshot.scene}-${width}x${height}.png`)});
        await page.reload(); await click(page,'[data-continue-story]');
        if (!await page.locator('.social-evidence-screen [data-evidence-check]').count()) throw Error('social entry lost on restore');
      }
      visits.push(snapshot.scene);
      if (await testimonyFlowIsVisible(page)) { transcript.push(await completeTestimonyWall(page) ?? ""); reloaded = true; continue; }
      if (!reloaded && snapshot.scene === "sceneQuestionAnswer") {
        await page.reload(); await click(page, '[data-continue-story]');
        transcript.push(await drainDialogue(page, {})); reloaded = true;
      }
      if (await page.locator("[data-evidence-check]").count()) {
        const value = await page.locator("[data-evidence-check]").first().getAttribute("data-evidence-check");
        const ci = Number(value.split(":")[0]);
        const check = authoredCasePackets[0].evidenceChecks[ci];
        const isLoan = check.id === "credit-anniversary-footprint";
        const oi = check.options.findIndex(option => isLoan && !wrongLoan ? !option.correct : option.correct);
        if (isLoan && !wrongLoan) wrongLoan = true;
        else if (isLoan) retriedLoan = true;
        await click(page, `[data-evidence-check="${ci}:${oi}"]`);
        continue;
      }
      if (await page.locator("[data-after-scene-evidence]").count()) {
        const before = snapshot.scene;
        const retry = body.includes("这处没问清，重新问");
        await click(page, "[data-after-scene-evidence]");
        if (retry) {
          const after = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1")));
          if (after.scene !== before || !await page.locator("[data-evidence-check]").count()) throw new Error("wrong material advanced instead of reopening this question");
        }
        continue;
      }
      if (await page.locator("[data-scene-question]").count()) {
        if (position === 2 && !reloaded && snapshot.sceneQuestionPicks?.[`${snapshot.caseBriefs[0].id}:scene:2`]?.completedOptionIds?.length) {
          const before = await page.locator("[data-scene-question]").allTextContents();
          await page.reload();
          await click(page, "[data-continue-story]");
          await drainDialogue(page, {});
          const after = await page.locator("[data-scene-question]").allTextContents();
          if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("reload repeated the completed wine question");
          reloaded = true;
        }
        const values = await page.locator("[data-scene-question]").evaluateAll(nodes => nodes.map(node => node.dataset.sceneQuestion));
        const correct = values.find(value => { const [si, oi] = value.split(":").map(Number); return authoredCasePackets[0].sceneVersions[si].questionOptions[oi].correct; });
        if (!correct) throw new Error("focused question has no available next question");
        await click(page, `[data-scene-question="${correct}"]`);
        continue;
      }
      const selectors = ["[data-scene-open-replay]", "[data-next-scene-stage]", "[data-enter-interlude]", "[data-interlude-action]", "[data-return-interlude]", "[data-complete-interlude-action]", "[data-callback-ready]", "[data-enter-post-live]", "[data-enter-day-act]", "[data-enter-day-map]", "[data-day-scene]:not(:disabled)", "[data-complete-day-scene]", "[data-enter-overnight-callback]", "[data-night2-transition-done]", "[data-enter-overnight-night2]", "[data-enter-segment2]", "[data-care-choice]", "[data-care-choice-continue]", "[data-close-scene-question]", "button[data-scene]"];
      let activated = false;
      for (const selector of selectors) {
        if (await page.locator(`${selector}:visible`).count()) { await click(page, selector); activated = true; break; }
      }
      if (!activated) throw new Error(`focused route stuck in ${snapshot.scene}: ${body}`);
    }
    throw new Error("focused route exceeded 110 steps");
  } catch (error) {
    await page.screenshot({ path: resolve(directory, `credit-failure-${width}x${height}.png`), fullPage: true });
    throw error;
  } finally { await context.close(); }
}

async function runSixReviewedCases() {
  const [width, height] = (process.env.SMOKE_VIEWPORT || "1280x720").split("x").map(Number);
  const viewport = { width, height };
  const directory = resolve(root, 'output/playwright/six-review');
  await mkdir(directory, { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  for (const chapter of (process.env.SMOKE_REVIEW_PART === 'quick' ? [] : process.env.SMOKE_REVIEW_PART === 'tony' ? [4] : process.env.SMOKE_REVIEW_PART === 'workplace' ? [2] : process.env.SMOKE_REVIEW_PART === 'consultation' ? [2, 3] : [2, 3, 4])) {
    const packet = authoredCasePackets[chapter - 1];
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage(); page.setDefaultTimeout(browserActionTimeoutMs);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const transcript = []; let reloaded = false, care = false, done = false, wrongMaterial = false, migrationChecked = false;
    try {
      await openCaseAtChapter(page, chapter, 'six-review');
      for (let step = 0; step < 160; step++) {
        transcript.push(await drainDialogue(page, {}));
        const save = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
        const body = await page.locator('body').innerText(); transcript.push(body);
        smokeProgress(`${packet.caseId} ${step}: ${save.scene}`);
        if (save.scene === 'dayScene') {
          const daySceneId = save.caseOvernights?.[save.caseBriefs[chapter - 1].id]?.activeDaySceneId;
          if (daySceneId) await page.screenshot({ path: resolve(directory, `${packet.caseId}-${daySceneId}.png`), animations: 'disabled' });
        }
        if (care && !['careChoice','caseClosure'].includes(save.scene)) {
          if (save.scene === 'storyInterlude' && await page.locator('[data-enter-broadcast-recap]:visible').count()) {
            await click(page, '[data-enter-broadcast-recap]');
            await page.waitForFunction(() => document.querySelector('.avg-textbox')?.innerText.includes('7 月 21 日'));
            await page.locator('[data-dialogue-advance]:visible').evaluate(el => el.click());
            await page.screenshot({path:resolve(directory,`public-recap-${width}x${height}.png`)});
            const readingBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')).dialogueReading);
            await page.reload(); await click(page, '[data-continue-story]');
            const readingAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')).dialogueReading);
            if (!readingBefore?.key || readingAfter?.key !== readingBefore.key || readingAfter?.pageIndex !== readingBefore.pageIndex) throw Error('public recap reload lost reading position');
            transcript.push(await drainDialogue(page, {}));
            if (!await page.locator('.interlude-live-light').innerText().then(t => t.includes('ON AIR'))) throw Error('public recap still marked off air');
          }
          done = true; break;
        }
        if (chapter === 2 && save.caseOvernights?.[save.caseBriefs[chapter - 1].id]?.segment === 'night2' && await page.locator('.control-deck').count()) {
          const deck = await page.locator('.control-deck').innerText();
          if (!deck.includes('PRIVATE CALL') || deck.includes('ON AIR') || await page.locator('.deck-live-metrics').count()) throw Error('private consultation leaked live broadcast HUD');
          if (save.scene === 'liveCounterBeat' && await page.locator('[data-live-counter-choice]').count()) throw Error('retired ad choice still displayed');
          if (save.scene === 'overnightCallback') await page.screenshot({path:resolve(directory,`private-call-${width}x${height}.png`)});
          if (save.scene === 'liveCounterBeat') await page.screenshot({path:resolve(directory,`private-message-${width}x${height}.png`)});
        }
        if (['deepFollowup','investigationBackflow','caseClosure'].includes(save.scene)) throw Error(`retired stage ${save.scene}`);
        if (await testimonyFlowIsVisible(page)) {
          if (chapter === 2 && !migrationChecked) {
            const activeBefore = await page.evaluate(() => {
              const key = 'livestream-detective-save-v1', save = JSON.parse(localStorage.getItem(key));
              const brief = save.caseBriefs[1];
              save.liveCounterPicks = {...save.liveCounterPicks, [`${brief.id}:work-group-repayment-message`]: {choiceId:'read-before-ad', completedChoiceIds:['read-before-ad'], endingImpact:'platform-data-loss'}};
              localStorage.setItem(key, JSON.stringify(save));
              return save.scene;
            });
            await page.reload(); await click(page, '[data-continue-story]');
            const refreshed = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
            if (refreshed.scene !== activeBefore || refreshed.liveCounterPicks?.[`${refreshed.caseBriefs[1].id}:work-group-repayment-message`]) throw Error('retired ad save refresh lost position or kept its penalty');
            await verifyWorkplaceActMigration(page, packet, chapter);
            migrationChecked = true;
          }
          transcript.push(await completeTestimonyWall(page) ?? ""); reloaded = true; continue;
        }
        if (await page.locator('[data-evidence-check]').count()) {
          const ci = Number((await page.locator('[data-evidence-check]').first().getAttribute('data-evidence-check')).split(':')[0]);
          const activeAction = packet.nightStructure.interlude.actions.find(action => action.id === save.caseNights?.[save.caseBriefs[chapter-1].id]?.activeActionId);
          const board = activeAction?.kind === 'backflowEarly' ? packet.investigationHooks[ci] : packet.evidenceChecks[ci];
          const miss = chapter === 2 && board.id === 'work-approval-missing' && !wrongMaterial;
          const oi = board.options.findIndex(o => miss ? !o.correct : o.correct);
          if (miss) wrongMaterial = true;
          await click(page, `[data-evidence-check="${ci}:${oi}"]`); continue;
        }
        if (await page.locator('[data-scene-question]').count()) {
          if (!reloaded) {
            const before = await page.locator('[data-scene-question]').allTextContents();
            await page.reload(); await click(page,'[data-continue-story]'); await drainDialogue(page,{});
            if (JSON.stringify(before) !== JSON.stringify(await page.locator('[data-scene-question]').allTextContents())) throw Error('saved current inquiry changed');
            reloaded = true;
            await page.screenshot({path:resolve(directory,`${packet.caseId}-inquiry.png`)});
          }
          const values = await page.locator('[data-scene-question]').evaluateAll(nodes=>nodes.map(n=>n.dataset.sceneQuestion));
          const choice = values.find(v=>{const [si,oi]=v.split(':').map(Number);return packet.sceneVersions[si].questionOptions[oi].correct;});
          if (!choice) throw Error('no next valid question');
          await click(page,`[data-scene-question="${choice}"]`); continue;
        }
        const selectors = ['[data-stance-snapshot]','[data-after-stance-snapshot]','[data-after-scene-evidence]','[data-live-counter-choice]','[data-continue-live-counter]','[data-scene-open-replay]','[data-next-scene-stage]','[data-enter-interlude]','[data-interlude-action]','[data-return-interlude]','[data-complete-interlude-action]','[data-next-evidence-check]','[data-callback-ready]','[data-enter-post-live]','[data-enter-day-act]','[data-enter-day-map]','[data-day-scene]:not(:disabled)','[data-day-choice]','[data-day-dialogue-choice]','[data-complete-day-scene]','[data-enter-overnight-callback]','[data-night2-transition-done]','[data-enter-overnight-night2]','[data-enter-segment2]','[data-care-choice]','[data-care-choice-continue]','[data-close-scene-question]','button[data-scene]'];
        let clicked=false;
        for (const selector of selectors) if (await page.locator(`${selector}:visible`).count()) {
          if (selector==='[data-care-choice-continue]') care=true;
          await click(page,selector);clicked=true;break;
        }
        if (!clicked) throw Error(`stuck ${save.scene}: ${body}`);
      }
      if (!done || !reloaded || (chapter === 2 && !wrongMaterial)) throw Error('main case did not complete reload, material retry and closing');
      const text=transcript.join('\n');
      assertFirstNightStatementsPlayed(packet, text);
      const normalizedText = text.replace(/\s/g, '');
      for (const dayScene of packet.overnightStructure?.dayScenes ?? []) {
        if (!dayScene.body?.beats?.length) continue;
        const source = dayScene.body.sourceNote?.replace(/\s/g, '');
        if (!source || !normalizedText.includes(source)) throw Error(`NPC source not visible: ${dayScene.id}`);
      }
      if (chapter === 2) {
        const anchors = ['再找财务的人对一下', '后来问到新的情况了吗', '我是真不信他了', '我念给你听吧', '谁能垫钱，活动就归谁', '截图截到了', '原件已补齐'];
        for (const anchor of anchors) if (!text.includes(anchor)) throw Error(`workplace missing recorded edit: ${anchor}`);
        let last = -1;
        for (const anchor of ['租借广告：', '租金收了三万', '他要的就是押金', '附注“用户押金与关联往来”', '宣传册链接']) {
          const at = text.indexOf(anchor, last + 1);
          if (at < 0) throw Error(`corporate reveal out of order: ${anchor}`);
          last = at;
        }
        if (/强制贴片|本场退出推荐|先把这条念完|我不替他解释/.test(text)) throw Error('retired workplace dialogue leaked');
        await page.screenshot({path:resolve(directory,`workplace-tail-${width}x${height}.png`)});
      }
      if (chapter === 3) {
        if (!text.includes('距离那次私下咨询已经过去三天') || !text.includes('后来跟我私下聊了')) throw Error('later public consultation recap missing');
        const firstNightQuestion = packet.sceneVersions[packet.nightStructure.segment1SceneIndexes[0]].entryQuestion;
        const secondNightQuestion = packet.sceneVersions[packet.nightStructure.segment2SceneIndexes[0]].entryQuestion;
        const first = text.indexOf(firstNightQuestion), second = text.indexOf(secondNightQuestion);
        if (first < 0 || second <= first) throw Error('profile must play its authored first night before its second night');
      }
      const phrases = chapter===2 ? ['费用草单与分配消息一并提交','他发出两条群消息'] : chapter===3 ? ['第二路麦克风接通','八万四','共同账户','我自己跟我妈说'] : ['合同','十二万','上礼拜他给我修刘海','这次不发半张了'];
      for (const phrase of phrases) if (!text.includes(phrase)) throw Error(`missing required dialogue ${phrase}`);
      if (errors.length) throw Error(errors.join('\n'));
      await writeFile(resolve(directory,`${packet.caseId}-route.txt`),text);
      smokeProgress(`PASS ${packet.caseId}: two nights, source materials, reload, compact ending`);
    } catch(e) { await page.screenshot({path:resolve(directory,`${packet.caseId}-failure.png`),fullPage:true}); throw e; }
    finally { await context.close(); }
  }
  let soloEndingChoice = 0;
  for (const id of (['workplace', 'consultation'].includes(process.env.SMOKE_REVIEW_PART) ? [] : [...storyManifest.quickCases, '03-labeled-fiction', '03-labeled-fiction'])) {
    const packet=JSON.parse(await readFile(resolve(root,`content/packs/steam-demo-01/quick-cases/${id}.json`),'utf8'));
    const context=await browser.newContext({viewport,reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(browserActionTimeoutMs);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));const transcript=[];let wrong=false,reloaded=false,done=false;
    try {
      await page.goto(playableUrl);await click(page,'[data-start-quick-detective]');await click(page,`[data-quick-case-id="${id}"]`);await click(page,'[data-quick-begin]');
      for(let step=0;step<110;step++) {
        transcript.push(await drainDialogue(page,{}));
        transcript.push(await page.locator('body').innerText());
        if(await page.locator('[data-quick-select]:visible').count()){done=true;break;}
        if(packet.focusedInquiry && !reloaded && await page.locator('[data-quick-next-confrontation]:visible').count()) {
          const position = () => page.evaluate(() => {
            const q = JSON.parse(localStorage.getItem('livestream-detective-save-v1')).quickDetective;
            return [q.scene, q.roundIndex, q.activeConfrontationId, q.confrontationLineIndex, q.resolvedConfrontationIds];
          });
          const before = await position();
          await page.reload();
          if(await page.locator('[data-continue-story]:visible').count()) await click(page,'[data-continue-story]');
          if(JSON.stringify(before) !== JSON.stringify(await position())) throw Error('quick resume changed current exchange');
          reloaded = true;
          await page.screenshot({path:resolve(directory,`${id}-inquiry.png`)});
          continue;
        }
        if(await page.locator('[data-quick-issue]:visible').count()) {
          if(!reloaded){const before=await page.locator('[data-quick-issue]').allTextContents();await page.reload();if(await page.locator('[data-continue-story]:visible').count())await click(page,'[data-continue-story]');await drainDialogue(page,{});if(JSON.stringify(before)!==JSON.stringify(await page.locator('[data-quick-issue]').allTextContents()))throw Error('quick resume lost question');reloaded=true;await page.screenshot({path:resolve(directory,`${id}-inquiry.png`)});}
          const values=await page.locator('[data-quick-issue]').evaluateAll(nodes=>nodes.map(n=>n.dataset.quickIssue));
          const decoy=values.find(value=>!packet.issueOptions.find(o=>o.id===value)?.confrontationId);
          const pick=decoy&&!wrong?decoy:values.find(value=>packet.issueOptions.find(o=>o.id===value)?.confrontationId);
          if(pick===decoy)wrong=true;
          await click(page,`[data-quick-issue="${pick}"]`);continue;
        }
        const selectors=['[data-quick-next-turn]','[data-quick-after-miss]','[data-quick-next-confrontation]','[data-quick-next-verdict]','.quick-commentary-option:not(:disabled)'];
        let clicked=false;for(const selector of selectors)if(await page.locator(`${selector}:visible`).count()){const soloFinal = selector === '.quick-commentary-option:not(:disabled)' && await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')).quickDetective?.roundIndex === 3);
        await click(page,selector,soloFinal ? soloEndingChoice : 0);clicked=true;break;}
        if(!clicked)throw Error(`quick stuck: ${await page.locator('body').innerText()}`);
      }
      if(!done)throw Error('quick did not finish');if(packet.focusedInquiry&&!reloaded)throw Error('quick not resumed');if(hasReachableQuickMiss(packet) && !wrong)throw Error('reachable quick retry not exercised');if(errors.length)throw Error(errors.join('\n'));
      if (packet.focusedInquiry) {
        const played = transcript.join('\n').replace(/\s/g, '');
        let last = -1;
        for (const round of packet.disclosureRounds) for (const turnId of round.turnIds) {
          const turn = packet.turns.find(t => t.id === turnId);
          for (const text of [turn.host, turn.caller].filter(Boolean)) {
            const at = played.indexOf(text.replace(/\s/g, ''), last + 1);
            if (at < 0) throw Error(`quick host/caller exchange skipped or reordered: ${id}/${turnId}`);
            last = at;
          }
        }
      }
      await writeFile(resolve(directory,`${id}-route.txt`),transcript.join('\n'));
      await click(page,'[data-quick-select]');if(!await page.locator(`.is-complete[data-quick-case-id="${id}"]`).count())throw Error('completion missing');
      smokeProgress(`PASS ${id}: complete and saved${packet.format === 'solo-commentary' ? ` (ending ${++soloEndingChoice})` : ''}`);
    }catch(e){await page.screenshot({path:resolve(directory,`${id}-failure.png`),fullPage:true});throw e;}finally{await context.close();}
  }
}

function hasReachableQuickMiss(packet) {
  return packet.disclosureRounds.some(round => (round.requiredConfrontationIds ?? []).some(id => !(round.autoConfrontationIds ?? []).includes(id)) && (round.issueOptionIds ?? []).some(id => !packet.issueOptions.find(option => option.id === id)?.confrontationId));
}

async function playFocusedQuickCase(page, viewport, packet, alreadySelected = false) {
  await mkdir(resolve(root, "output/playwright/six-review"), {recursive:true});
  if (!alreadySelected) await click(page, `[data-quick-case-id="${packet.id}"]`);
  await click(page,'[data-quick-begin]');
  let wrong = false; const transcript = [];
  for (let step=0;step<110;step++) {
    transcript.push(await drainDialogue(page,{}));
    transcript.push(await page.locator('body').innerText());
    if(await page.locator('[data-quick-select]:visible').count()) {
      if(hasReachableQuickMiss(packet)&&!wrong)throw Error('wrong-question path not exercised');
      for(const line of packet.ending.summaryPages.flatMap(p=>p.lines)) if(!transcript.join('\n').includes(line.text)) throw Error(`ending skipped: ${line.text}`);
      return;
    }
    if(await page.locator('[data-quick-issue]:visible').count()) {
      if (await page.locator('.quick-inquiry-material').count()) {
        await page.screenshot({path:resolve(root,`output/playwright/six-review/${packet.id}-materials-${viewport.width}x${viewport.height}.png`)});
        await page.locator('.quick-inquiry-history summary').focus();
        await page.keyboard.press('Enter');
        if (!await page.locator('.quick-inquiry-history').getAttribute('open').then(value=>value!==null)) throw Error('optional history cannot open by keyboard');
      }
      const options=await page.locator('[data-quick-issue]').evaluateAll(nodes=>nodes.map(n=>n.dataset.quickIssue));
      const miss=options.find(id=>!packet.issueOptions.find(o=>o.id===id).confrontationId);
      const chosen=miss&&!wrong?miss:options.find(id=>packet.issueOptions.find(o=>o.id===id).confrontationId);
      if(chosen===miss)wrong=true;
      const target=page.locator(`[data-quick-issue="${chosen}"]`);
      await target.scrollIntoViewIfNeeded();
      const bounds=await target.boundingBox();
      if(!bounds || bounds.x<0 || bounds.x+bounds.width>viewport.width || bounds.y<0 || bounds.y+bounds.height>viewport.height)throw Error(`inquiry button clipped at ${viewport.width}x${viewport.height}`);
      await target.click(); continue;
    }
    const selectors=['[data-quick-next-turn]','[data-quick-after-miss]','[data-quick-next-confrontation]','[data-quick-next-verdict]'];
    let clicked=false;for(const selector of selectors)if(await page.locator(`${selector}:visible`).count()){await click(page,selector);clicked=true;break;}
    if(!clicked)throw Error(`focused quick stuck: ${await page.locator('body').innerText()}`);
  }
  throw Error('focused quick exceeded step bound');
}

async function completeFocusedEvidenceInquiry(page) {
  const lines = [];
  const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
  const packet = authoredCasePackets[snapshot.chapter-1];
  const scene = packet.sceneVersions.find(s => s.testimonyWall);
  const caseId = snapshot.caseBriefs[snapshot.chapter-1].id;
  const wallKey = `${caseId}:${scene.id}`;
  // Resolve the authored act by currently visible question IDs, not DOM order.
  const ids = await page.locator('[data-evidence-inquiry]').evaluateAll(nodes => nodes.map(n=>n.dataset.evidenceInquiry));
  const act = scene.testimonyWall.acts.find(a => a.inquiry.options.some(o => ids.includes(o.id)));
  if (!act) { lines.push(await drainDialogue(page,{})); if (await page.locator('[data-inquiry-continue]:visible').count()) await click(page,'[data-inquiry-continue]'); return lines.join('\n'); }
  lines.push(await page.locator('body').innerText());
  if (await page.locator('[data-inline-present-material], [data-testimony-press], .deck-card-pressure').count()) throw Error('retired interaction remains visible');
  const overlap = await page.evaluate(() => {
    const cards=[...document.querySelectorAll('.inquiry-materials article')].map(n=>n.getBoundingClientRect());
    const buttons=[...document.querySelectorAll('[data-evidence-inquiry]')].map(n=>n.getBoundingClientRect());
    return cards.some(a=>buttons.some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
  });
  if(overlap) throw Error('question covers material');
  const quoteClipped = await page.evaluate(() => {
    const stage=document.querySelector('.focused-evidence-inquiry .vn-stage');
    const quote=stage?.querySelector('.avg-textbox');
    return quote && quote.getBoundingClientRect().top + stage.scrollTop < stage.getBoundingClientRect().top;
  });
  if(quoteClipped) throw Error('current quote lifted outside the reading area');
  lines.push(await drainDialogue(page,{}));
  const dir = resolve(root,'output/playwright/simple-mechanics'); await mkdir(dir,{recursive:true});
  await page.screenshot({path:resolve(dir,`${packet.caseId}-${act.id}-${page.viewportSize().width}.png`)});
  const miss = act.inquiry.options.find(o=>!o.correct);
  const budgetsBefore = JSON.stringify([snapshot.caseBudgets,snapshot.statementPatience,snapshot.decisivePresentProgress]);
  await click(page,`[data-evidence-inquiry="${miss.id}"]`);
  lines.push(await drainDialogue(page,{}));
  await page.reload(); await click(page,'[data-continue-story]'); lines.push(await drainDialogue(page,{}));
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
  if (JSON.stringify([restored.caseBudgets,restored.statementPatience,restored.decisivePresentProgress]) !== budgetsBefore) throw Error('wrong inquiry consumed budget or lost progress');
  if (await page.locator('[data-inquiry-continue]:visible').count()) await click(page,'[data-inquiry-continue]');
  if (!await page.locator('[data-inquiry-context]').count()) throw Error('local retry not restored');
  for (let restore = 0; restore < 2; restore++) {
    if (await page.locator('[data-dialogue-advance]').count() || !await page.locator('[data-inquiry-context]').count()) throw Error('retry replayed inquiry opening');
    if (!await page.locator('[data-evidence-inquiry]').count()) throw Error('retry lost current questions');
    if (!restore) { await page.reload(); await click(page,'[data-continue-story]'); }
  }
  const correct = act.inquiry.options.find(o=>o.correct);
  const button = page.locator(`[data-evidence-inquiry="${correct.id}"]`); await button.scrollIntoViewIfNeeded();
  const box = await button.boundingBox(), viewport = page.viewportSize();
  if (!box || box.x<0 || box.x+box.width>viewport.width || box.y<0 || box.y+box.height>viewport.height) throw Error('inquiry question clipped');
  await button.click(); lines.push(await drainDialogue(page,{}));
  for (const line of correct.lines) if (!lines.join('\n').replace(/\s+/g,'').includes(line.text.replace(/\s+/g,''))) { const {writeFile}=await import('node:fs/promises'); await writeFile(resolve(dir,'response-debug.json'),JSON.stringify({missing:line.text,lines,html:await page.content(),save:await page.evaluate(()=>JSON.parse(localStorage.getItem('livestream-detective-save-v1')))},null,2)); throw Error('correct response skipped: '+line.text); }
  if (await page.locator('[data-inquiry-continue]:visible').count()) await click(page,'[data-inquiry-continue]');
  verifiedTestimonyActs.add(`${packet.caseId}/${act.id}`);
  return lines.join('\n');
}

async function verifyWorkplaceActMigration(page, packet, chapter) {
  const baseline = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
  const sceneIndex = packet.sceneVersions.findIndex(scene => scene.id === 'work-split-ownership');
  const scene = packet.sceneVersions[sceneIndex];
  const revision = Object.keys(scene.testimonyWall.previousActOrders)[0];
  const caseId = baseline.caseBriefs[chapter - 1].id;
  const key = `${caseId}:testimony:${scene.id}`;
  for (const oldAct of [1, 2]) {
    const legacy = structuredClone(baseline);
    for (const brief of [legacy.caseBriefs[chapter - 1], legacy.caseBrief].filter(Boolean)) {
      if (brief.contentIdentity) brief.contentIdentity.sceneVersions[sceneIndex].testimonyRevision = revision;
      if (brief.sceneVersions) brief.sceneVersions[sceneIndex].testimonyWall.revision = revision;
    }
    legacy.scene = 'testimonyWall';
    legacy.dialogueReading = null;
    legacy.testimonyWallProgress = { ...legacy.testimonyWallProgress, [key]: { act: oldAct, preludeSeen: true, completedActs: oldAct === 2 ? [1] : [] } };
    legacy.decisivePresentProgress = { ...legacy.decisivePresentProgress, [key]: { resolved: true } };
    legacy.evidenceInquiryPicks = { ...legacy.evidenceInquiryPicks, [key]: 'act2-ask' };
    if (oldAct === 2) {
      legacy.decisivePresentProgress[`${key}:act2`] = { resolved: true };
      legacy.evidenceInquiryPicks[`${key}:act2`] = 'act1-ask';
    }
    await page.evaluate(save => localStorage.setItem('livestream-detective-save-v1', JSON.stringify(save)), legacy);
    await page.reload(); await click(page, '[data-continue-story]');
    const text = await drainDialogue(page, {});
    const migrated = await page.evaluate(() => JSON.parse(localStorage.getItem('livestream-detective-save-v1')));
    if (migrated.testimonyWallProgress[key]?.act !== 1) throw Error('workplace old act did not map to the remaining inquiry');
    if (migrated.evidenceInquiryPicks[key] !== (oldAct === 2 ? 'act1-ask' : undefined)) throw Error('workplace migration lost the retained answer or reused the deleted answer');
    if (oldAct === 2 && !text.includes('下一场预收款')) throw Error('retained resolved answer did not render after migration');
    if (oldAct === 1 && !await page.locator('[data-evidence-inquiry="act1-ask"]').count()) throw Error('deleted act save cannot continue to the remaining inquiry');
    if (JSON.stringify(migrated.caseBudgets) !== JSON.stringify(baseline.caseBudgets)) throw Error('migration changed unrelated budgets');
  }
  await page.evaluate(save => localStorage.setItem('livestream-detective-save-v1', JSON.stringify(save)), baseline);
  await page.reload(); await click(page, '[data-continue-story]'); await drainDialogue(page, {});
  smokeProgress('PASS workplace legacy deleted/retained act saves resume without losing unrelated progress');
}
