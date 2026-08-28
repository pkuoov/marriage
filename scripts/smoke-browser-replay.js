import { chromium } from "@playwright/test";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const playableUrl = pathToFileURL(resolve(root, "dist", "playable", "index.html")).toString();
const storyManifest = JSON.parse(await readFile(resolve(root, "content", "packs", "steam-demo-01", "manifest.json"), "utf8"));
const authoredCasePackets = await Promise.all((storyManifest.sequence ?? []).map((item) => (
  readFile(resolve(root, "content", "packs", "steam-demo-01", "cases", `${item.caseId}.json`), "utf8").then(JSON.parse)
)));
const testimonySmokeActs = authoredCasePackets.flatMap((packet) => (packet.sceneVersions ?? []).flatMap((scene) => (
  (scene.testimonyWall?.acts ?? []).map((act) => ({
    caseId: packet.id ?? packet.caseId ?? "unknown-case",
    sceneId: scene.id ?? "unknown-scene",
    actId: act.id ?? `act-${act.act ?? "unknown"}`,
    evidenceId: act.decisivePresent?.evidenceId ?? "",
    statementId: act.decisivePresent?.statementId ?? "",
    statementIds: (act.statements ?? []).map((statement) => statement.id).filter(Boolean)
  }))
))).filter((act) => act.evidenceId && act.statementId && act.statementIds.length);
const loadBearingQuestionSignatures = authoredCasePackets.flatMap((packet) => (packet.sceneVersions ?? []).flatMap((scene) => (
  (scene.questionOptions ?? [])
    .filter((option) => option.correct === true)
    .flatMap((option) => [option.sourceAnchor, option.revisedSourceAnchor]
      .filter(Boolean)
      .map((anchor) => ({ anchor, label: option.suspicionLabel ?? option.question ?? "" })))
)));
const transitionQuoteByCaseId = Object.fromEntries(
  (storyManifest.nightShell?.interludes ?? [])
    .filter((interlude) => interlude.transitionQuote)
    .map((interlude) => [interlude.afterCaseId, interlude.transitionQuote])
);
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
  "host-verdict",
  "portrait-viewports",
  "state-replacement",
  "quick-detective",
  "cafe-prologue"
]);
const smokeStepTimeoutMs = Math.max(1000, Number(process.env.SMOKE_STEP_TIMEOUT_MS) || 90000);
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
    await runSmokeStep("route 1/1 accounting-support", () => runRoute(routes[0]));
  } else if (smokeTarget === "gamepad") {
    await runSmokeStep("route 1/1 gamepad-support-document", () => runRoute(routes.find((route) => route.inputMode === "gamepad")));
  } else if (smokeTarget === "case2-transition") {
    await runCase2DayMap();
    await runSmokeStep("case transition", runCaseTransition);
  } else if (smokeTarget === "host-verdict") {
    await runSmokeStep("host verdict viewport matrix", runHostVerdictPresentation);
  } else if (smokeTarget === "portrait-viewports") {
    await runSmokeStep("portrait viewport matrix", runPortraitViewports);
  } else if (smokeTarget === "state-replacement") {
    await runSmokeStep("state replacement", runStateReplacementRoutes);
  } else if (smokeTarget === "quick-detective") {
    await runSmokeStep("quick detective viewport matrix", runQuickDetective);
  } else if (smokeTarget === "cafe-prologue") {
    await runSmokeStep("cafe prologue viewport matrix", runCafePrologue);
  } else {
    for (const [index, route] of routes.entries()) {
      await runSmokeStep(`route ${index + 1}/${routes.length} ${route.name}`, () => runRoute(route));
    }
    await runCase2DayMap();
    await runCase3DayRoutes();
    await runCase4DayRoutes();
    await runSmokeStep("case transition", runCaseTransition);
    await runSmokeStep("portrait viewport matrix", runPortraitViewports);
    await runSmokeStep("state replacement", runStateReplacementRoutes);
    await runSmokeStep("quick detective viewport matrix", runQuickDetective);
    await runSmokeStep("cafe prologue viewport matrix", runCafePrologue);
  }
} finally {
  await browser.close();
}

smokeProgress(`PASS ${smokeSummary(smokeTarget)}`);

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

function smokeSummary(target) {
  if (target === "case34") return "case3-day-map, case4-day-map";
  if (target === "case1" || target === "local-quick") return "case1 staged disclosure (single viewport)";
  if (target === "gamepad") return "gamepad-support-document";
  if (target === "case2-transition") return "case2-day-map, case-transition";
  if (target === "host-verdict") return "host verdict staged at mobile and desktop widths";
  if (target === "portrait-viewports") return "portrait layouts at 390x844, 1280x720, 1366x768, 1280x800, 1920x1080";
  if (target === "state-replacement") return "new-game-reset, patience-retry";
  if (target === "quick-detective") return "quick detective at 390x844, 592x920, 1280x720, and 1280x800";
  if (target === "cafe-prologue") return "cafe prologue, same-night continuation, and private callback at 390x844, 592x920, 1280x720, and 1280x800";
  return [...routes.map((route) => route.name), "case2-day-map", "case3-day-map", "case4-day-map", "case-transition", "new-game-reset", "patience-retry", "quick-detective", "cafe-prologue"].join(", ");
}

function smokeProgress(message) {
  const elapsedSeconds = ((Date.now() - smokeStartedAt) / 1000).toFixed(1).padStart(6, " ");
  console.log(`[browser-smoke +${elapsedSeconds}s] ${message}`);
}

async function runSmokeStep(label, action) {
  const startedAt = Date.now();
  let timeoutId = 0;
  smokeProgress(`START ${label}`);
  try {
    const result = await Promise.race([
      action(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Smoke step timed out after ${smokeStepTimeoutMs}ms: ${label}`)), smokeStepTimeoutMs);
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
  const lines = page.locator("[data-scene-question]:visible");
  const texts = await lines.allTextContents();
  const index = texts.findIndex((text) => loadBearingQuestionSignatures.some(({ anchor, label }) => text.includes(anchor) && text.includes(label)));
  if (index < 0) throw new Error(`current statement has no source-anchored line: ${texts.join(" | ")}`);
  return lines.nth(index);
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
    { width: 390, height: 844 },
    { width: 592, height: 920 },
    { width: 1280, height: 720 },
    { width: 1280, height: 800 }
  ]) {
    const viewportStartedAt = Date.now();
    smokeProgress(`START quick detective ${viewport.width}x${viewport.height}`);
    const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? "no-preference" : "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    try {
      await page.goto(`${playableUrl}?playtest=quick-statement-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      await page.locator("[data-player-name]").fill("周明");
      await click(page, "[data-start-quick-detective]");
      await assertVisibleText(page, "今晚先接哪一通", "快案入口必须先进入案件选择页");
      if (await page.locator(".quick-case-card").count() !== 3) throw new Error("快案选择页必须从 manifest 加载三宗案件");

      await playStatementQuickCase(page, viewport, {
        caseId: "01-no-conditions",
        rounds: [
          ["我爸爸给了我一百万", "或者是我不能生孩子"],
          ["先别急吧", "您就帮我留意一下吧"]
        ],
        decoyAnchor: "我妈看这日子过不下去",
        expectedListen: ["我二十四，在商场卖衣服", "我爸爸给了我一百万"],
        expectedVerdict: ["我不会做这种背书的", "她不说，我也不会替她编"]
      });
      await click(page, "[data-quick-select]");
      if (await page.locator('.quick-case-card.is-complete[data-quick-case-id="01-no-conditions"]').count() !== 1) {
        throw new Error("首宗快案通关后必须显示完成对勾");
      }
      if (viewport.width === 390) {
        await playEarlyQuickCase(page, "01-no-conditions", "我爸爸给了我一百万");
        await click(page, "[data-quick-select]");
      }

      await playStatementQuickCase(page, viewport, {
        caseId: "02-one-missed-message",
        rounds: [
          ["还有人说羡慕", "十一点五十二"],
          ["后面又有人点了一轮"],
          ["六次酒吧或者 KTV", "顺嘴说了句‘他也不知道", "他可能以为是喝断片那晚拍的"]
        ],
        decoyAnchor: "他三十五",
        decoyKind: "anchored",
        expectedListen: ["本科和硕士都在一所985高校", "十一点五十二"],
        expectedVerdict: ["那首歌，他隔了很久只回‘听了’", "换成我，我也会劝他退出", "我不猜酒桌上还有没有别的事"]
      });
      await click(page, "[data-quick-select]");
      await playStatementQuickCase(page, viewport, {
        caseId: "03-labeled-fiction",
        rounds: [
          ["文末我标了『纯属虚构』", "让我准备五张卡一起打", "我说让我想想"],
          ["一句转账数目都没对上", "直播间先说清楚，起诉我另走"],
          ["跟我起诉状上写的数对得上"]
        ],
        decoyAnchor: "我写过一篇长文",
        expectedListen: ["文末我标了『纯属虚构』", "打了三千万到她家里账上", "见面她往后躲"],
        expectedVerdict: ["我不会对着直播间替你宣", "彩礼不彩礼", "法院没判", "厌的是这个人", "借节目砸人"]
      });
      await click(page, "[data-quick-select]");
      if (await page.locator(".quick-case-card.is-complete").count() !== 3) throw new Error("三宗快案通关后都必须保留完成对勾");
    } finally {
      await context.close();
    }
    smokeProgress(`PASS  quick detective ${viewport.width}x${viewport.height} (${((Date.now() - viewportStartedAt) / 1000).toFixed(1)}s)`);
  }
}

async function runCafePrologue() {
  for (const viewport of [
    { width: 390, height: 844, pressureChoice: "camera-off", firstRoute: "toy", firstEvidence: "chat" },
    { width: 592, height: 920, pressureChoice: "camera-off", firstRoute: "account", firstEvidence: "hotel" },
    { width: 1280, height: 720, pressureChoice: "stop-stream", firstRoute: "toy", firstEvidence: "hotel" },
    { width: 1280, height: 800, pressureChoice: "stop-stream", firstRoute: "account", firstEvidence: "chat" }
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? "no-preference" : "reduce" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.setDefaultTimeout(8000);
    try {
      await page.goto(`${playableUrl}?playtest=cafe-prologue-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      await click(page, "[data-start-story]");
      await assertVisibleText(page, "开播前 · 傍晚", "the cafe negotiation must be the playable opening");
      const sourceLayer = await page.locator(".cafe-prologue-dialogue").first().evaluate((element) => ({
        hidden: element.hidden,
        display: getComputedStyle(element).display
      }));
      if (!sourceLayer.hidden || sourceLayer.display !== "none") throw new Error("the cafe source transcript must stay hidden behind the one-speaker visual-novel textbox");
      const openingText = await drainDialogue(page, {});
      if (!openingText.includes("我准备离婚")) throw new Error("the husband must state the divorce request before the first tutorial action");
      if (!openingText.includes("孩子以后怎么安排")) throw new Error("the child arrangement conflict must be part of the opening negotiation");
      if (!openingText.includes("我没去澜桥酒店")) throw new Error("the first evidence action must answer the wife's explicit hotel denial");
      if (openingText.includes("哪三页") || openingText.includes("只看这三页")) throw new Error("participants must not recite the tutorial material count");
      const cafePortraitRoles = await page.locator(".cafe-negotiation-portrait[data-dialogue-portrait]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-dialogue-portrait")));
      if (cafePortraitRoles.join("|") !== "host|advisor|husband|wife|cousin") throw new Error(`cafe negotiation must keep five cross-talking portraits, got ${cafePortraitRoles.join("|")}`);
      await assertVisibleText(page, "桌面", "the material names must stay in a compact scene-prop dock after the negotiation");
      await assertVisibleText(page, "我没去澜桥酒店。", "the first action must expose the caller's exact denial as a selectable line");
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

      await click(page, '[data-cafe-statement-id="screenshot-dismissal"]');
      const wrongStatementText = await drainDialogue(page, {});
      if (!wrongStatementText.includes("你要问这句就问")) throw new Error("a wrong source line must trigger the wife's in-character response");
      if (await page.locator("[data-cafe-statement-id]").count() < 3) throw new Error("a wrong source line must return to the spoken lines instead of only disabling a button");
      await click(page, '[data-cafe-statement-id="hotel-denial"]');
      await assertVisibleText(page, "21:18", "the chat card must show its raw timestamp");
      await assertVisibleText(page, "入住人：妻子本人", "the hotel card must show its raw booking field");
      await assertCafeViewport(page, viewport, "evidence pair board");
      await click(page, `[data-cafe-evidence-select="${viewport.firstEvidence}"]`);
      await assertVisibleText(page, "已拿起", "selecting one material must have an immediate visible response");
      await click(page, "[data-cafe-evidence-present]");
      const pairText = await drainDialogue(page, {});
      if (!pairText.includes("房是我开的") || !pairText.includes("我一个人住")) throw new Error("either first material must puncture the hotel denial and force the full revised account");
      if (pairText.includes("没转过钱")) throw new Error("the money claim must wait until the second hotel material reaches its proof boundary");
      await assertVisibleText(page, viewport.firstEvidence === "chat" ? "酒店订单" : "联系人：顾*", "the unused hotel material must remain for the revised claim");
      await click(page, "[data-cafe-present-remaining]");
      const remainingText = await drainDialogue(page, {});
      if (!remainingText.includes("上面只有我，没有顾*") || !remainingText.includes("没有他上楼的东西") || !remainingText.includes("没转过钱")) throw new Error("the second material must stop at the companion unknown before the money denial begins");
      if (remainingText.includes("调监控") || remainingText.includes("敢不敢嘛")) throw new Error("the host must not auto-escalate beyond the material the player presented");
      await assertVisibleText(page, "4 月 12 日｜转出｜顾*", "the transfer card must show raw rows instead of a cross-document inference");
      await assertNoPageText(page, "交易对手户名与聊天联系人同名", "the transfer card must not solve the cross-document match for the player");
      await assertCafeViewport(page, viewport, "transfer presentation board");
      await click(page, "[data-cafe-transfer-select]");
      await click(page, "[data-cafe-present-transfer]");
      const legalText = await drainDialogue(page, {});
      if (!legalText.includes("他请我来") || !legalText.includes("按现有材料准备") || !legalText.includes("不是他的诉讼代理人")) throw new Error("Zhao must make the on-site consultation clear without presenting herself as litigation counsel");
      await assertVisibleText(page, "共同财产", "the cafe must turn the husband's legal demands into a visible request list");
      await assertCafeViewport(page, viewport, "legal request board");
      await click(page, "[data-cafe-legal-brief]");
      const parentageText = await drainDialogue(page, {});
      if (!parentageText.includes("就跟我去做鉴定") || !parentageText.includes("敢不敢") || !parentageText.includes("我不做") || !parentageText.includes("你俩先别吵") || !parentageText.includes("掰扯不明白")) throw new Error("the parentage dispute must break into an argument before Zhao stops the public quarrel");
      if (parentageText.includes("个人委托") || parentageText.includes("最可行的一步")) throw new Error("the private testing path must not be explained in front of the wife and camera");
      if (!parentageText.includes("大主播也不过如此") || !parentageText.includes("这份原片")) throw new Error("the competing recording and edit threat must arrive after the material hit");
      if (parentageText.includes("礼物") || parentageText.includes("直播间") || parentageText.includes("停播")) throw new Error("the cafe is a pre-recorded negotiation and must not expose live-gifting language");
      await assertCafeViewport(page, viewport, "recording pressure choices");
      await click(page, `[data-cafe-pressure="${viewport.pressureChoice}"]`);
      const aftermathText = await drainDialogue(page, {});
      if (!aftermathText.includes("孩子的东西谁也别动")) throw new Error("the wife must continue resisting after she leaves the cafe");
      if (!aftermathText.includes("不能只拿一句‘我怀疑’") || !aftermathText.includes("最可行的") || !aftermathText.includes("正规机构") || !aftermathText.includes("东西可能就没了")) throw new Error("Zhao must explain the practical path and timing risk privately after the argument");
      await assertCafeViewport(page, viewport, "investigation order choices");
      await click(page, `[data-cafe-investigation="${viewport.firstRoute}"]`);
      const firstRouteText = await drainDialogue(page, {});
      if (!firstRouteText.includes(viewport.firstRoute === "toy" ? "沙发靠背缝里" : "十八号那笔")) throw new Error("the player's first continuation route must control information order");
      if (firstRouteText.includes(viewport.firstRoute === "toy" ? "十八号那笔" : "沙发靠背缝里")) throw new Error("the unchosen continuation route must not be forced before the live show");
      await assertVisibleText(page, "回直播间开播", "the opening investigation must hand off to the live-show loop before the result returns");
      await assertCafeViewport(page, viewport, "night handoff");
      await click(page, "[data-cafe-enter-night]");
      const nightScene = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}").scene ?? "");
      if (nightScene !== "nightShellPrologue") throw new Error(`${viewport.width} cafe opening must hand off to the night prologue, got ${nightScene}`);
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
      if (viewport.firstRoute === "toy") {
        if (!forensicText.includes("个人委托的初步检测") || !forensicText.includes("排除生物学父子关系") || !forensicText.includes("申请由法院委托鉴定")) throw new Error("the toy route must return only the preliminary parentage result and court request");
        if (forensicText.includes("收款人不是顾*")) throw new Error("the toy route must not also pay off the unchosen account route");
        await assertVisibleText(page, "女方何时知道", "the parentage ending must keep the wife's prior knowledge unproven");
      } else {
        if (!forensicText.includes("收款人不是顾*")) throw new Error("the account route must return its separate account-holder clue");
        if (forensicText.includes("排除生物学父子关系")) throw new Error("the account route must not also pay off the unchosen parentage route");
        await assertVisibleText(page, "收款人的身份没有向节目公开", "the account ending must keep the receiver unknown");
      }
      await assertVisibleText(page, "结果只到这里", "the cafe prologue must end on a fact boundary rather than a victory card");
      await assertCafeViewport(page, viewport, "private callback ending");
      const savedProgress = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem("livestream-detective-save-v1") ?? "{}");
        return {
          pressureChoice: save.cafeProloguePressureChoice,
          order: save.cafePrologueOrder,
          legalBriefSeen: save.cafePrologueLegalBriefSeen,
          statementId: save.cafePrologueStatementId,
          evidenceId: save.cafePrologueEvidenceId
        };
      });
      if (!savedProgress.legalBriefSeen || savedProgress.pressureChoice !== viewport.pressureChoice || savedProgress.statementId !== "hotel-denial" || savedProgress.evidenceId !== viewport.firstEvidence || savedProgress.order?.[0] !== viewport.firstRoute || savedProgress.order?.length !== 1) {
        throw new Error(`${viewport.width} cafe choices must survive state writes: ${JSON.stringify(savedProgress)}`);
      }
      await click(page, "[data-cafe-finish]");
      await assertVisibleText(page, "今晚收麦", "the cafe prologue must return to the existing non-verdict story summary");
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
    const board = overlay?.querySelector(".cafe-statement-board, .cafe-evidence-board, .cafe-present-board, .cafe-legal-board");
    const textboxRect = textbox?.getBoundingClientRect();
    const overlayRect = overlay?.getBoundingClientRect();
    const boardRect = board?.getBoundingClientRect();
    const screenRect = screen?.getBoundingClientRect();
    const dialogueCard = screen?.querySelector(".dialogue-card.avg-dialogue-active");
    const actionSelector = [
      "[data-cafe-statement-id]",
      "[data-cafe-evidence-select]",
      "[data-cafe-evidence-present]:not(:disabled)",
      "[data-cafe-present-remaining]",
      "[data-cafe-transfer-select]",
      "[data-cafe-present-transfer]:not(:disabled)",
      "[data-cafe-legal-brief]",
      "[data-cafe-pressure]",
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
  await page.locator("[data-quick-end-early]").waitFor({ state: "visible" });
  await click(page, "[data-quick-end-early]");
  await assertVisibleText(page, "按现有信息收住", "快案抓到一个关键矛盾后必须允许谨慎提前收案");
  while (!await page.locator(".quick-ending-actions").count()) {
    await advanceQuickLine(page, "[data-quick-next-verdict]");
  }
  await assertVisibleText(page, "拒绝背书，不替她编故事", "提前收案必须落到独立的事实边界结论");
}

async function playStatementQuickCase(page, viewport, { caseId, rounds, decoyAnchor, decoyKind = "no-clue", expectedListen, expectedVerdict, alreadySelected = false }) {
  if (!alreadySelected) await click(page, `[data-quick-case-id="${caseId}"]`);
  await assertVisibleText(page, "周明", "快案必须显示玩家保存的主播姓名");
  await assertNoPageText(page, "这次怎么玩", "快案入口不得解释内部机制");
  await click(page, "[data-quick-begin]");

  let verdictText = "";
  for (const [roundIndex, anchors] of rounds.entries()) {
    await assertQuickLayout(page, viewport, `${caseId} round ${roundIndex + 1} listen`, "caller");
    if (roundIndex === 0) {
      for (const text of expectedListen) await assertVisibleText(page, text, `${caseId} 首次听麦必须保留整段陈述内容`);
    }
    await assertVisibleText(page, "监听", "首次整段陈述必须点亮监听状态");
    if (roundIndex === 0 && viewport.width === 592) {
      await page.locator("[data-quick-next-turn]:visible").waitFor({ state: "visible" });
      await page.keyboard.press("Enter");
      await page.locator(".quick-scene-issueSelection").waitFor({ state: "visible" });
    } else {
      await advanceQuickLine(page, "[data-quick-next-turn]");
    }
    await page.locator("[data-quick-review-line]").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "REC 回放", "找问题时必须切换为逐句回放状态");
    await assertNoPageText(page, "先问哪件事", "回放不得退回抽象问题方向菜单");
    await assertNoPageText(page, "只选怀疑的方向", "回放不得添加操作教程");
    if (roundIndex === 0 && decoyAnchor) {
      await clickQuickSourceLine(page, decoyAnchor);
      await page.locator(".quick-scene-missReaction").waitFor({ state: "visible" });
      await assertVisibleText(page, "这句问早了", "快案错误原句必须先进入人物反应拍，不能只扣耐心回选句");
      const missText = (await page.locator(".quick-miss-bubble").getAttribute("data-quick-line-text"))?.trim() ?? "";
      if (!missText) throw new Error("快案错误原句必须显示来电人或主播的具体反应");
      await click(page, "[data-quick-after-miss]");
      await assertVisibleText(
        page,
        decoyKind === "anchored" ? "这个问法被挡回来了 · 耐心 −1" : "这句没有可追问的线索 · 耐心 −1",
        decoyKind === "anchored" ? "有锚点的社会性错选必须标成问法被挡回，不能再伪装成无线索" : "错误原句只做局部反馈，不讲解答案"
      );
    }
    for (const anchor of anchors) {
      await clickQuickSourceLine(page, anchor);
      await assertVisibleText(page, "LINE 打断", "按中原句以后必须切到短问打断状态");
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
  for (const text of expectedVerdict) {
    if (!verdictText.includes(text)) throw new Error(`${caseId} verdict should include ${text}`);
  }
}

async function clickQuickSourceLine(page, anchor) {
  const line = page.locator("[data-quick-review-line]:visible").filter({ hasText: anchor }).first();
  await line.waitFor({ state: "visible" });
  await line.click();
}

async function finishQuickConfrontation(page) {
  while (await page.locator(".quick-scene-confrontation").count()) {
    await advanceQuickLine(page, "[data-quick-next-confrontation]");
  }
}

async function assertQuickLayout(page, viewport, label, expectedRole) {
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
  if (layout.portraitCount !== 2) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must keep exactly two portraits`);
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
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-state-replacement-${Date.now()}&storyKey=steam-demo-01`);
    await click(page, "[data-start-story]");
    await enterNightFromCafePrologue(page, {});
    await revealGolden90(page, {});
    if (await page.locator("[data-enter-first-case]").count()) {
      await drainDialogue(page, {});
      await click(page, "[data-enter-first-case]");
      await click(page, "[data-enter-case-live]");
    }
    await drainDialogue(page, {});
    await click(page, '[data-scene="sceneReview"]');
    await drainDialogue(page, {});
    await page.locator("[data-scene-open-replay]").waitFor({ state: "visible" });
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
    await page.locator("[data-scene-open-replay]").waitFor({ state: "visible" });
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
    reducedMotion: route.name === "accounting-support" ? "no-preference" : "reduce"
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
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.stack ?? error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.setDefaultTimeout(8000);
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
      if (golden90?.preludeKinds?.notice !== 1 || golden90?.preludeKinds?.message !== 1) {
        throw new Error("night shell prelude should distinguish the work notice from the personal message before the player starts broadcasting");
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

    for (let beat = 0; beat < 48; beat += 1) {
      await collectLiveVisualState(page, visualStates, portraitStates);
      if (await testimonyFlowIsVisible(page)) {
        await completeTestimonyWall(page, route);
        continue;
      }
      if (route.name === "accounting-support" && !materialEntryChecked && await page.locator(".deck-card-material[data-material-open]").count()) {
        if (await page.locator("[data-material-open]").count() < 3) throw new Error("received material must be reachable from the control deck, dialogue bar, and active choice layer");
        if (!await page.locator(".choice-material-shortcut[data-material-open]").isVisible()) throw new Error("active choices must expose a visible received-material shortcut");
        await page.locator(".choice-material-shortcut[data-material-open]").click();
        await page.locator(".avg-material-modal:not([hidden])").waitFor({ state: "visible" });
        await assertVisibleText(page, "社保断缴时间", "the first received material must open before the active choice");
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
          await activate(page, route, "[data-evidence-check]", 0);
          await drainDialogue(page, route);
          if (!await page.locator("[data-after-scene-evidence]").count()) {
            const afterState = await page.evaluate(() => JSON.parse(window.localStorage?.getItem("livestream-detective-save-v1") ?? "{}"));
            const visibleButtons = await page.locator("button:visible").evaluateAll((buttons) => buttons.map((button) => button.outerHTML));
            throw new Error(`inline evidence check ${checkIndex} returned to ${afterState.scene}: ${JSON.stringify(visibleButtons)}`);
          }
          await activate(page, route, "[data-after-scene-evidence]");
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
        await assertVisibleText(page, "电话断了。后台多出一份遮名交易摘录，信用卡账单还亮着，至少三万五没有说明", "overnight route should identify the caller-authorized transaction excerpt before the show ends");
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
        if (route.openerText && !openerTranscript.includes(route.openerText)) {
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
          const firstInterest = liveCounterTranscript.includes("房租还是另付的") || liveCounterTranscript.includes("房租另付。我刚才确实没讲");
          if (firstInterest) {
            if (!liveCounterTranscript.includes("每月一万七千五还不含房租") || !liveCounterTranscript.includes("我刚才确实没讲")) {
              throw new Error("night-B first interest must show the room noticing the rent and the caller's small admission");
            }
          } else if (!liveCounterTranscript.includes("他在听。")) {
            throw new Error("night-B counter-pressure should interrupt between two live scenes");
          }
          // The button only names a direction; the complete host sentence appears after selection.
          if (!firstInterest && (!selectedCounterChoiceLabel || !selectedHostResponse || selectedHostResponse === selectedCounterChoiceLabel)) {
            throw new Error("the selected counter-pressure direction must resolve into a distinct on-air host response");
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
      await page.locator("[data-scene-open-replay]").waitFor({ state: "visible" });
      await activate(page, route, "[data-scene-open-replay]");
      await page.locator("[data-scene-question]").first().waitFor({ state: "visible" });
      await assertVisibleText(page, "REC", "main-case statement review must switch the control deck to replay");
      await assertNoPageText(page, "收束 · 未命中 −1 耐心", "原句回放不得把底层耐心成本写成按钮说明");
      if (!helperHiddenChecked && route.name === "accounting-support") {
        if (await page.locator("[data-scene-helper]").count()) throw new Error("V哥隐藏期间不得出现求助按钮");
        await assertNoPageText(page, "V哥", "V哥隐藏期间不得出现在玩家可见流程");
        await assertNoPageText(page, "按下以后", "主案问题面板不得解释按钮点击后的行为");
        await assertNoPageText(page, "疑点方向", "主案问题按钮不得重复标注控件类型");
        helperHiddenChecked = true;
      }
      const sourceLine = await currentLoadBearingStatementLine(page);
      const sourceText = (await sourceLine.locator("span").textContent())?.trim() ?? "";
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
      if (route.name === "accounting-support" && sceneQuestionCount === 1 && !answerTranscript.includes("以前每个月都按时到")) {
        throw new Error("the normal key-question route must play the authored sceneCloser before advancing");
      }
      if (route.name === "accounting-support" && sceneQuestionCount === 2 && !answerTranscript.includes("以前也有人这么跟我借钱")) {
        throw new Error("the normal key-question route must play the anchored host disclosure instead of skipping it");
      }
      continue;
    }

    await page.locator("[data-evidence-check]").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "圈点 · 圈偏 −1 耐心", "evidence targets must expose the miss cost before activation");
    if (visualStates.size < 2 || portraitStates.size < 2) {
      throw new Error(`${route.name} route should change scene and portrait states while questioning`);
    }
    if (route.name === "accounting-support" && (!helperHiddenChecked || !directionChoiceChecked || !materialEntryChecked)) {
      throw new Error("primary browser route must verify hidden V哥 UI, a direction-only question, and the received-material entry");
    }
    if (route.name === "accounting-support" && ![1, 2, 3].every((index) => inlineEvidenceCheckIndexes.has(index))) {
      throw new Error(`primary browser route must interleave all three case-1 material boards, got ${[...inlineEvidenceCheckIndexes].join(",")}`);
    }
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
    const materialResultTranscript = await drainDialogue(page, route);
    if (route.name === "accounting-support") {
      if (!materialResultTranscript.includes("餐厅、酒店、礼物，还有设备")) {
        throw new Error("perfect route should show testimony revision after the material hit");
      }
    }
    if (route.name === "material-miss-accounting-support") {
      await assertVisibleText(page, caseOneMaterialMissDrift, "material-miss route should release the current case-authored drift comment after the miss");
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
    reactionResponse: "你先让我把这段说完。"
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
        text: "她整理的七条报销记录",
        rows: ["q01", "q02", "q04"],
        questionText: "公开流程刚写完对公要比价，他为什么十七分钟后就让你改刷个人卡"
      },
      { id: "day-work-finance-window", text: "拿着立项页等不到账" }
    ],
    opener: "她整理的报销时间线",
    openerText: "财务说延后，是九天以后",
    conflictText: "十四点二十二分那条私聊",
    reactionText: "弹幕里有人说我蠢。",
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
      const sourceLine = await currentLoadBearingStatementLine(page);
      await sourceLine.click();
    } else {
      await page.locator("[data-scene-question]").first().waitFor({ state: "visible" });
      await click(page, "[data-scene-question]");
    }
    await collectPortraitAsset(page, portraitAssets);
    await drainDialogue(page, {});
    await click(page, "[data-next-scene-stage], button[data-scene]");
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
    const portraitStem = ({ 2: "caller_work", 3: "caller_profile", 4: "caller_salon" })[chapter];
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
    await assertVisibleText(page, "回拨前", `${name} must pass through the short interlude before the day map`);
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
    } else if (await page.locator("[data-return-interlude]").count()) {
      await click(page, "[data-return-interlude]");
    } else if (await page.locator("[data-evidence-check]").count()) {
      await click(page, "[data-evidence-check]");
      if (await page.locator("[data-return-interlude]").count()) await click(page, "[data-return-interlude]");
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
      "[data-continue-live-counter]"
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
  throw new Error(`${name} did not reach reaction beat: ${expectedText}`);
}

async function testimonyFlowIsVisible(page) {
  return Boolean(await page.locator([
    ".dialogue-card > .testimony-prelude-card:visible",
    ".dialogue-card > .testimony-wall:visible",
    ".dialogue-card > .present-material-select:visible",
    ".dialogue-card > .decisive-present-target:visible",
    ".dialogue-card > .decisive-present-hit:visible"
  ].join(", ")).count());
}

async function completeTestimonyWall(page, route = {}) {
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
    if (!await page.locator("[data-decisive-present-start]").count()) break;

    const act = await currentTestimonySmokeAct(page);
    const launch = page.locator("[data-decisive-present-start]");
    if (await launch.isDisabled()) {
      const visibleStatementIds = await page.locator("[data-testimony-press]").evaluateAll((buttons) => (
        buttons.map((button) => button.dataset.testimonyPress).filter(Boolean)
      ));
      for (const statementId of visibleStatementIds) {
        await activate(page, route, `[data-testimony-press="${statementId}"]`);
        if (!await page.locator("[data-decisive-present-start]").isDisabled()) break;
      }
      if (await page.locator("[data-decisive-present-start]").isDisabled()) {
        throw new Error(`${act.caseId}/${act.sceneId}/${act.actId} did not unlock decisive present after PRESS`);
      }
    }

    await activate(page, route, "[data-decisive-present-start]");
    await activate(page, route, `[data-decisive-material="${act.evidenceId}"]`);
    await activate(page, route, `[data-decisive-present-target="${act.statementId}"]`);
    await page.locator("[data-after-decisive-present]").waitFor({ state: "visible" });
  }
  if (!completedActs && !enteredPrelude) throw new Error("testimony wall smoke helper did not complete an act");
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
    if (sceneId === "day-support-payments") {
      await assertVisibleText(page, "三月九日和五月九日", "support payment scene should show the two bimonthly rent rows");
      await assertNoPageText(page, "今天第三拨", "removed restaurant witness must not survive in the replacement scene");
    }
    if (sceneId === "day-bank-flow") {
      await assertVisibleText(page, "他的银行流水（近五个月关键交易摘录）", "document day scene should render bank flow");
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
    await page.locator("[data-player-name]").fill("周明");
    await click(page, "[data-start-story]");
    await enterNightFromCafePrologue(page, {});
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
    await assertVisibleText(page, authoredCasePackets[0].caseClosing?.title, "first case closure should carry its authored case-specific title");
    await assertVisibleText(page, "已经确认", "closure should distinguish confirmed facts from a raw evidence pile");
    await assertVisibleText(page, "还没弄清", "closure should preserve unresolved facts");
    await click(page, "[data-enter-story-interlude]");
    await page.getByText("广告间隙").first().waitFor({ state: "visible" }).catch(async () => {
      throw new Error(`first case tail did not render after closure:\n${await page.locator("body").innerText()}`);
    });
    await assertVisibleText(page, "广告间隙", "closure should move into the first case's lived epilogue without an authorial case-tail label");
    await assertVisibleText(page, "我们俩大概一开始就看不上对方", "first case epilogue should establish Lin and Zhao as a couple through dialogue");
    if (await page.locator('.story-interlude-stage[data-after-case="01-credit"]').count() !== 1) throw new Error("first case interlude must return to the off-air studio stage");
    if (await page.locator('.interlude-zhao img[src*="zhao-lawyer-teasing-pixel"]').count() !== 1) throw new Error("first case interlude must use Zhao's teasing portrait state");
    if (await page.locator(".pixel-transition-signal-disconnect").count() !== 1) throw new Error("program interlude should use one short disconnect signal transition");
    await click(page, "[data-enter-case-bridge]");
    const firstTransitionQuote = transitionQuoteByCaseId["01-credit"];
    await assertVisibleText(page, firstTransitionQuote.text, "case one and case two must be joined by the authored classic quote");
    await assertVisibleText(page, firstTransitionQuote.source, "inter-case quote must display its source");
    if (await page.locator(".case-bridge-handoff").count()) throw new Error("inter-case quote page must not add a next-case synopsis or author-written bridge");
    if (await page.locator(".case-bridge-objects .case-bridge-object img").count() !== 2) throw new Error("inter-case quote must share the stage with outgoing and incoming case objects");
    await click(page, "[data-enter-next-case]");
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
      save.scene = "caseClosure";
      save.storyWorldEchoes = {};
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await click(page, "[data-enter-story-interlude]");
    await assertVisibleText(page, "广告间隙", "second case must close without an authorial case-tail label");
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("world echo must stay hidden until the final case");
    await assertVisibleText(page, "接一通插播", "second act interlude must expose the optional quick-call pressure valve");
    await click(page, "[data-enter-optional-quick]");
    await playStatementQuickCase(page, { width: 390, height: 844 }, {
      caseId: "01-no-conditions",
      alreadySelected: true,
      rounds: [
        ["我爸爸给了我一百万", "或者是我不能生孩子"],
        ["先别急吧", "您就帮我留意一下吧"]
      ],
      decoyAnchor: "我妈看这日子过不下去",
      expectedListen: ["我二十四，在商场卖衣服", "我爸爸给了我一百万"],
      expectedVerdict: ["我不会做这种背书的", "她不说，我也不会替她编"]
    });
    await assertVisibleText(page, "回到主线", "optional quick call must offer a main-story return instead of the standalone case picker");
    await click(page, "[data-quick-select]");
    await assertVisibleText(page, transitionQuoteByCaseId["04-workplace"].text, "case two and case three must use the authored quote transition");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "CASE 03", "case two tail must return to the normal case transition");

    await page.evaluate(() => {
      const key = "livestream-detective-save-v1";
      const save = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      save.chapter = 4;
      save.caseBrief = save.caseBriefs?.[3] ?? null;
      save.scene = "caseClosure";
      save.storyWorldEchoHypotheses = {};
      window.localStorage.setItem(key, JSON.stringify(save));
    });
    await page.reload();
    await click(page, "[data-continue-story]");
    await assertVisibleText(page, "案件结案", "final case must still enter its dedicated closure page");
    await click(page, "[data-enter-story-interlude]");
    await page.getByText("收播以后").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "收播以后", "final case must have its own lived epilogue");
    await assertVisibleText(page, "屏幕右上角的“直播中”灭了", "final case tail must close through an on-screen action instead of an authorial end label");
    if (await page.getByText("下一通 · 材料先到").count()) throw new Error("final case tail must not show a nonexistent next case");
    if (await page.getByText("宸直信托全部产品暂停兑付，实控人失联").count()) throw new Error("final world echo must not appear before player action");
    await assertVisibleText(page, "把四案里的宸直线索并在一起", "final world echo must first ask the player to connect the cross-case risk");
    await click(page, '[data-world-echo-hypothesis="cross-case-ledger"]');
    await assertVisibleText(page, "借款认购、栖行返费、家庭持有页和代投回单", "the selected cross-case hypothesis must be acknowledged before the reveal");
    await assertVisibleText(page, "把新闻推送点开", "final world echo must be offered after the player records a hypothesis");
    await click(page, "[data-reveal-world-echo]");
    await assertVisibleText(page, "宸直信托全部产品暂停兑付，实控人失联", "final world echo must pay off the case-one and case-two trust seeds");
    await assertVisibleText(page, "公告没有公布清偿顺序", "final world echo must preserve the unresolved recovery boundary");
    if (await page.locator('.story-world-echo-stage img[src*="chenzhi-news-push-pixel"]').count() !== 1) throw new Error("final world echo must switch to the trust-news ending CG");
    await click(page, "[data-enter-night-epilogue]");
    await assertVisibleText(page, "直播中", "whole-night epilogue should begin only after the fourth case tail");
    for (let index = 0; index < 8 && await page.locator("[data-epilogue-unread-next]").count(); index += 1) {
      await click(page, "[data-epilogue-unread-next]");
    }
    if (await page.locator('.night-ending-cg-stage img[src*="envelope-2019-pixel"]').count() !== 1) throw new Error("whole-night epilogue must end on the 2019 envelope CG");
    await click(page, "[data-finish-night-shell]");
    const forensicText = await drainDialogue(page, {});
    if (!forensicText.includes("个人委托的初步检测") || !forensicText.includes("排除生物学父子关系") || !forensicText.includes("申请由法院委托鉴定")) {
      throw new Error("the later callback must keep the preliminary result before the court appraisal request");
    }
    if (forensicText.includes("收款人不是顾*")) throw new Error("the toy route must not also pay off the account route");
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
    page.setDefaultTimeout(8000);
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
    page.setDefaultTimeout(8000);
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
      if (layout.rect.left < -1 || layout.rect.right > viewport.width + 1) throw new Error(`${viewport.label} portrait escapes the viewport horizontally`);
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
      const third = page.locator('[data-caller-question="dont-answer-for-her"]');
      if (!await third.isEnabled()) throw new Error("Zhao's proactive call should keep the non-directive answer available on every route");
      await activate(page, route, `[data-caller-question="${route.callerQuestion}"]`);
      if (route.callerQuestion === "dont-answer-for-her") {
        const callerQuestionTranscript = await drainDialogue(page, route);
        if (!callerQuestionTranscript.includes("贷款让他解释") || !callerQuestionTranscript.includes("我拿过的钱和剩下的钱，我自己说")) {
          throw new Error("process-control answer should leave the loan with the respondent and return the caller's own spending explanation to her");
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
  const shownText = new Set();
  for (let line = 0; line < 160; line += 1) {
    const box = page.locator("[data-dialogue-advance]:not([data-dialogue-done]):visible").first();
    if (!await box.count()) {
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
    const button = element.querySelector("button.primary:not(:disabled), button");
    const stageRect = stage?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    return {
      insideRecord: Boolean(element.closest(".court-record")),
      multiQuestionBar: Boolean(element.querySelector(".scene-question-group")),
      documentBoard: Boolean(element.querySelector(".cafe-evidence-board, .cafe-present-board, .cafe-legal-board")),
      stageRatio: stageRect && buttonRect ? (buttonRect.top - stageRect.top) / Math.max(1, stageRect.height) : -1,
      bottomOverflow: stageRect && buttonRect ? buttonRect.bottom - stageRect.bottom : 999
    };
  });
  const minimumStageRatio = placement.multiQuestionBar || placement.documentBoard ? 0.44 : 0.55;
  if (placement.insideRecord || placement.stageRatio < minimumStageRatio || placement.bottomOverflow > 2) {
    throw new Error(`main continue action must stay in the lower dialogue stage, got ${JSON.stringify(placement)}`);
  }
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
  await activate(page, route, '[data-cafe-statement-id="hotel-denial"]');
  await activate(page, route, '[data-cafe-evidence-select="chat"]');
  await activate(page, route, "[data-cafe-evidence-present]");
  await activate(page, route, "[data-cafe-present-remaining]");
  await activate(page, route, "[data-cafe-transfer-select]");
  await activate(page, route, "[data-cafe-present-transfer]");
  await activate(page, route, "[data-cafe-legal-brief]");
  await activate(page, route, '[data-cafe-pressure="camera-off"]');
  await activate(page, route, '[data-cafe-investigation="toy"]');
  await drainDialogue(page, route);
  await assertVisibleText(page, "回直播间开播", "the same-night investigation must hand the player into the live-show loop");
  await activate(page, route, "[data-cafe-enter-night]");
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
  const debtComments = (await page.locator(".live-comment-strip").innerText().catch(() => "")).replace(/\s+/g, "");
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
  const interestComments = (await page.locator(".live-comment-strip").innerText().catch(() => "")).replace(/\s+/g, "");
  if (assertContract) {
    if (!interestTranscript.includes("反正不是乱来的钱")) throw new Error("golden 90 payoff must escalate into the caller's next excuse");
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
