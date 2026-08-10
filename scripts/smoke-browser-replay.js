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
  { name: "document-r08-r11", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r08", "r11"], opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "document-trust-rows", sceneMode: "core", materialMode: "hit", dayScenes: ["day-bank-flow", "day-accounting"], documentRows: ["r01b", "r13", "r14", "r15"], opener: "流水圈注", openerText: "这二十万，他以前跟你提过吗", callerQuestion: "dont-answer-for-her" },
  { name: "restaurant-document", sceneMode: "outer", materialMode: "hit", dayScenes: ["day-restaurant", "day-bank-flow"], dayChoices: { "day-restaurant": "chase-member" }, dayChoiceText: { "day-restaurant": "不能替客人作证" }, documentRows: ["r08", "r11"], opener: "餐厅拒绝核对", openerText: "座是我订的", callerQuestion: "dont-answer-for-her" },
  { name: "material-miss-accounting-restaurant", sceneMode: "core", materialMode: "miss", dayScenes: ["day-accounting", "day-restaurant"], dayChoices: { "day-restaurant": "chase-member" }, opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "keyboard-accounting-restaurant", sceneMode: "core", materialMode: "hit", inputMode: "keyboard", dayScenes: ["day-accounting", "day-restaurant"], dayChoices: { "day-restaurant": "chase-member" }, opener: "周会计的时间线", openerText: "翻到七月 8 号，空的", callerQuestion: "ask-fifty-thousand" },
  { name: "gamepad-restaurant-document", sceneMode: "core", materialMode: "hit", inputMode: "gamepad", dayScenes: ["day-restaurant", "day-bank-flow"], dayChoices: { "day-restaurant": "chase-member" }, documentRows: ["r08", "r11"], opener: "餐厅拒绝核对", openerText: "座是我订的", callerQuestion: "dont-answer-for-her" }
];
const smokeTarget = process.env.SMOKE_TARGET ?? "all";

const browser = await launchBrowser();
try {
  if (smokeTarget === "case34") {
    await runCase3DayRoutes();
    await runCase4DayRoutes();
  } else if (smokeTarget === "case1") {
    await runRoute(routes[0]);
  } else if (smokeTarget === "gamepad") {
    await runRoute(routes.find((route) => route.inputMode === "gamepad"));
  } else if (smokeTarget === "case2-transition") {
    await runCase2DayMap();
    await runCaseTransition();
  } else if (smokeTarget === "portrait-viewports") {
    await runPortraitViewports();
  } else if (smokeTarget === "state-replacement") {
    await runStateReplacementRoutes();
  } else if (smokeTarget === "quick-detective") {
    await runQuickDetective();
  } else {
    for (const route of routes) {
      await runRoute(route);
    }
    await runCase2DayMap();
    await runCase3DayRoutes();
    await runCase4DayRoutes();
    await runCaseTransition();
    await runPortraitViewports();
    await runStateReplacementRoutes();
    await runQuickDetective();
  }
} finally {
  await browser.close();
}

console.log(smokeTarget === "case34"
  ? "Browser replay smoke passed: case3-day-map, case4-day-map"
  : smokeTarget === "case1"
    ? "Browser replay smoke passed: case1 staged disclosure"
  : smokeTarget === "gamepad"
    ? "Browser replay smoke passed: gamepad-restaurant-document"
    : smokeTarget === "case2-transition"
      ? "Browser replay smoke passed: case2-day-map, case-transition"
      : smokeTarget === "portrait-viewports"
        ? "Browser replay smoke passed: portrait layouts at 390x844, 1366x768, 1280x800, 1920x1080"
        : smokeTarget === "state-replacement"
          ? "Browser replay smoke passed: new-game-reset, patience-retry"
          : smokeTarget === "quick-detective"
            ? "Browser replay smoke passed: quick detective at 390x844 and 1280x800"
    : `Browser replay smoke passed: ${[...routes.map((route) => route.name), "case2-day-map", "case3-day-map", "case4-day-map", "case-transition", "new-game-reset", "patience-retry", "quick-detective"].join(", ")}`);

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

async function runQuickDetective() {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 }
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? "no-preference" : "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    try {
      await page.goto(`${playableUrl}?playtest=quick-detective-${viewport.width}-${Date.now()}&storyKey=steam-demo-01`);
      await page.locator("[data-player-name]").fill("周明");
      await click(page, "[data-start-quick-detective]");
      await assertVisibleText(page, "今晚先接哪一通", "快案入口必须先进入案件选择页");
      const quickCaseNumber = (await page.locator('[data-quick-case-id="01-no-conditions"] .quick-case-number b').innerText()).trim();
      if (quickCaseNumber !== "01") throw new Error("快案选择卡必须显示稳定案件编号");
      const quickCaseNumber2 = (await page.locator('[data-quick-case-id="02-one-missed-message"] .quick-case-number b').innerText()).trim();
      if (quickCaseNumber2 !== "02") throw new Error("第二宗快案选择卡必须显示稳定案件编号 02");
      if (await page.locator(".quick-case-card").count() !== 2) throw new Error("当前试玩快案选择页必须从 manifest 加载两宗案件");
      await assertVisibleText(page, "那晚没回消息", "快案选择页必须显示第二宗案件标题");
      await assertVisibleText(page, "未完成", "尚未通关的快案必须显示未完成状态");
      await assertNoPageText(page, "完成的案件会留下一枚对勾", "案件卡已经表达完成状态，选择页不得重复解释");
      await assertNoPageText(page, "约 15 分钟", "快案选择页不再显示估算时长");
      await assertNoPageText(page, "约 20 分钟", "快案选择页不再显示估算时长");
      if (await page.locator(".quick-case-card.is-complete").count()) throw new Error("fresh quick-case catalog must not show a completion checkmark");
      await click(page, '[data-quick-case-id="01-no-conditions"]');
      await assertVisibleText(page, "周明", "快案必须显示玩家在标题页输入的主播姓名");
      await assertNoPageText(page, "林旭阳", "自定义姓名生效后不得残留默认主播姓名");
      await assertNoPageText(page, "这次怎么玩", "快案开场只交代来电背景，不显示玩法说明卡");
      await assertNoPageText(page, "每轮只判断", "快案开场不向玩家解释内部轮次机制");
      await assertNoPageText(page, "对质会逼出新的说法", "快案开场不预告后续披露机制");
      await assertNoPageText(page, "约 15 分钟", "快案开场不再显示估算时长");
      await assertNoPageText(page, "圈这句话", "快案不得保留圈句入口");
      await assertNoPageText(page, "评论区翻记录", "快案不得保留评论区补答案入口");
      await click(page, "[data-quick-begin]");

      for (let index = 0; index < 10; index += 1) {
        await assertQuickLayout(page, viewport, `transcript ${index + 1} host`, "host");
        await click(page, "[data-quick-next-turn]");
        await assertQuickLayout(page, viewport, `transcript ${index + 1} caller`, "caller");
        await click(page, "[data-quick-next-turn]");
      }

      await assertVisibleText(page, "先追问哪个矛盾点", "快案听完后必须先进入玩家判断层");
      await assertNoPageText(page, "只选怀疑的方向", "快案判断层不得重复解释按钮行为");
      await assertNoPageText(page, "追问方向", "可选按钮不得重复标注其控件类型");
      await assertNoPageText(page, "先说买房那一百万", "矛盾选择页不得提前展示主播答案句");
      await click(page, '[data-quick-issue="mother-departure"]');
      await assertVisibleText(page, "还没有和她后面的话直接冲突", "选择干扰方向后必须留在判断层并允许重试");
      await assertNoPageText(page, "不会说好听话是不是分手的根本原因", "第一轮不能提前开放尚未出现的背书与分手根因");
      const rewindButton = page.locator('[data-action="rewind"]');
      if (!await rewindButton.isVisible()) throw new Error("完成一次追问后，顶部必须出现全局返回键");
      await click(page, '[data-action="rewind"]');
      await assertVisibleText(page, "先追问哪个矛盾点", "返回键必须回到刚才追问前的判断状态");
      await assertNoPageText(page, "还没有和她后面的话直接冲突", "返回后必须撤销刚才的错误方向反馈");
      if (await rewindButton.isVisible()) throw new Error("退回唯一检查点后，返回键必须隐藏，不能继续跨到案件入口");

      const issueIds = ["benefactor-source", "report-disclosure", "actual-standard", "soft-talk"];
      const confrontationRoles = [
        ["host", "caller", "host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"]
      ];
      for (let index = 0; index < issueIds.length; index += 1) {
        if (index === 2) {
          for (let turnIndex = 10; turnIndex < 17; turnIndex += 1) {
            await assertQuickLayout(page, viewport, `transcript ${turnIndex + 1} host`, "host");
            if (turnIndex === 15) await assertVisibleText(page, "你那套房买下来一共多少钱", "房贷诉求后必须紧接房屋总价追问");
            await click(page, "[data-quick-next-turn]");
            await assertQuickLayout(page, viewport, `transcript ${turnIndex + 1} caller`, "caller");
            if (turnIndex === 15) await assertVisibleText(page, "总价两百万", "来电人必须回答房屋总价");
            if (turnIndex === 16) {
              await assertVisibleText(page, "周明哥", "来电人对主播的熟称也必须随玩家姓名变化");
              await assertNoPageText(page, "旭阳哥", "自定义姓名生效后不得残留默认熟称");
            }
            await click(page, "[data-quick-next-turn]");
          }
          await assertVisibleText(page, "不会说好听话是不是分手的根本原因", "第二轮才允许追问分手根因");
        }
        await click(page, `[data-quick-issue="${issueIds[index]}"]`);
        const revealTransitionCount = await page.locator('[data-transition-kind="reveal"]').count();
        if (index === 0 && revealTransitionCount !== 1) throw new Error("一百万与两个‘爸爸’的方向必须触发快案唯一核心反转过场");
        if (index > 0 && revealTransitionCount !== 0) throw new Error("快案普通对质不能重复触发核心反转过场");
        if (index === 0 && viewport.width === 390) {
          const reveal = page.locator('[data-transition-kind="reveal"]');
          const animationDuration = await reveal.evaluate((element) => getComputedStyle(element).animationDuration);
          const pointerEvents = await reveal.evaluate((element) => getComputedStyle(element).pointerEvents);
          if (animationDuration !== "1.68s") throw new Error(`核心反转过场必须留出稳定阅读时间，实际为 ${animationDuration}`);
          if (pointerEvents !== "none") throw new Error("核心反转过场不能阻挡玩家操作");
        }
        await assertVisibleText(page, "当面对质", `quick confrontation ${index + 1} must keep a clear stage label`);
        await assertNoPageText(page, "圈句", "对质页不得恢复圈句玩法");
        await assertNoPageText(page, "评论接力", "对质页不得恢复评论接力");
        for (const [lineIndex, role] of confrontationRoles[index].entries()) {
          await assertQuickLayout(page, viewport, `confrontation ${index + 1} line ${lineIndex + 1}`, role);
          if (index === 0 && lineIndex === 1) await assertVisibleText(page, "为什么非要分得这么清", "钱源对质必须先让来电人坚持父女称呼并反问");
          if (index === 0 && lineIndex === 3) await assertVisibleText(page, "不是亲爸", "主播收窄问题以后来电人才可以最小承认");
          if (index === 0 && lineIndex === 5) await assertVisibleText(page, "这是我的私事", "钱源对质必须以隐私和自愿赠与转移真实关系");
          if (index === 1 && lineIndex === 2) await assertVisibleText(page, "那到底有没有嘛", "婚育对质必须让主播在否认后短追问");
          if (index === 1 && lineIndex === 3) await assertVisibleText(page, "我以前确实查过", "检查结果只能在短追问以后承认");
          if (index === 2 && lineIndex === 2) await assertVisibleText(page, "总价两百万", "实际标准对质必须带回房价和分担房贷诉求");
          if (index === 3 && lineIndex === 2) await assertVisibleText(page, "根本原因真是你不会说好听话吗", "表达能力对质必须继续追到分手根因");
          if (index === 3 && lineIndex === 3) await assertVisibleText(page, "我脾气也不好", "来电人必须承认更深一层的争吵问题");
          await click(page, "[data-quick-next-confrontation]");
        }
        if (index === 0 || index === 2) await assertVisibleText(page, "先追问哪个矛盾点", "同一轮尚有问题时必须把选择权交还玩家");
        if (index === 1) await assertVisibleText(page, "那收入和年龄呢", "第一轮问清以后必须回到连线，继续听她真正的择偶要求");
      }

      const verdictLines = [];
      let verdictFinished = false;
      for (let step = 0; step < 64; step += 1) {
        verdictLines.push(await page.locator(".quick-line p").innerText());
        const role = await page.locator(".quick-single-bubble").getAttribute("data-quick-speaking");
        await assertQuickLayout(page, viewport, `verdict ${step + 1}`, role);
        if (await page.locator("[data-quick-select]").count()) {
          verdictFinished = true;
          break;
        }
        await click(page, "[data-quick-next-verdict]");
      }
      if (!verdictFinished) throw new Error("快案结论必须在有限逐句推进后显示返回案件选择入口");
      const verdictText = verdictLines.join(" ");
      if (!verdictText.includes("这个忙我不能帮")) throw new Error("快案结尾必须由主播亲口拒绝背书");
      if (!verdictText.includes("那就不介绍。今天到这儿。")) throw new Error("快案必须用主播当面结束通话");
      if (!verdictText.includes("我们来把这次这个连线复个盘。")) throw new Error("快案挂断后必须用固定口头标记进入主播复盘");
      if (!verdictText.includes("电话挂了")) throw new Error("快案挂断后必须继续进入主播结案复盘");
      if (!verdictText.includes("概率最高")) throw new Error("快案结尾必须说出目前概率最高的经历版本");
      if (!verdictText.includes("长期处在一段经济交换关系里")) throw new Error("快案必须由主播明确作出经济交换关系判断");
      if (!verdictText.includes("长期叫对方“爸爸”") || !verdictText.includes("对方年纪肯定不小了")) throw new Error("快案必须说清长期称呼带出的年龄判断");
      if (!verdictText.includes("一个做销售的，怎么可能不会给别人提供情绪价值嘛") || !verdictText.includes("我也有兼职红娘的业务")) throw new Error("快案必须用销售职业和主播兼职业务说清背书链条");
      if (!verdictText.includes("她那位“爸爸”还在不在，我也不知道")) throw new Error("快案必须保留原经济交换关系是否持续的现实顾虑");
      if (!verdictText.includes("她下意识也好，有意也好") || !verdictText.includes("明显是她自己有这方面的问题")) throw new Error("快案婚育总结必须由异常举例落到来电人本人问题");
      if (verdictText.includes("原因我不能猜") || verdictText.includes("关系走深了再讲")) throw new Error("快案婚育结论不得用价值边界话术撤回判断");
      if (verdictText.includes("不肯说两个人到底是什么关系") || verdictText.includes("我只能说很像")) throw new Error("快案结论不得捏造未问问题或用免责话术撤回判断");
      if (!verdictText.includes("想在我们直播间骗人，不可能")) throw new Error("快案高概率判断必须落回主播对欺骗行为的直接拒绝");
      if (!verdictText.includes("无论男女，都请远离正常婚恋市场")) throw new Error("快案一结尾必须补上面向现实婚恋市场的明确总结");
      await page.waitForFunction(() => {
        const saved = JSON.parse(localStorage.getItem("livestream-detective-save-v1") || "{}");
        return saved.quickDetectiveCompletedIds?.includes("01-no-conditions");
      });
      await click(page, "[data-quick-select]");
      const completedCard = page.locator('[data-quick-case-id="01-no-conditions"].is-complete');
      if (await completedCard.count() !== 1) throw new Error("completed quick case must keep its checkmarked card selectable for replay");
      if ((await completedCard.locator(".quick-case-status b").innerText()).trim() !== "已完成") throw new Error("通关后返回快案选择页必须显示完成状态");
      if ((await completedCard.locator(".quick-case-status i").innerText()).trim() !== "✓") throw new Error("通关后返回快案选择页必须显示完成对勾");

      await click(page, '[data-quick-case-id="02-one-missed-message"]');
      await assertVisibleText(page, "那晚没回消息", "第二宗快案必须从案件选择页独立进入");
      const quick2PlayerName = await page.evaluate(() => JSON.parse(localStorage.getItem("livestream-detective-save-v1") || "{}").playerName);
      if (quick2PlayerName !== "周明") throw new Error(`切换快案后必须保留玩家姓名，实际存档为：${quick2PlayerName ?? "<空>"}`);
      const quick2HostCaption = (await page.locator(".quick-stage-host figcaption b").innerText()).trim();
      if (quick2HostCaption !== "周明") throw new Error(`第二宗快案也必须沿用玩家输入的主播姓名，实际舞台姓名为：${quick2HostCaption || "<空>"}`);
      await assertNoPageText(page, "林旭阳", "第二宗快案不得恢复默认主播姓名");
      const quick2CallerArt = await page.locator(".quick-stage-caller img").getAttribute("src");
      if (!quick2CallerArt?.includes("caller-zhou-female-pixel")) throw new Error("第二宗快案必须使用独立女性来电人立绘");
      await click(page, "[data-quick-begin]");

      for (let index = 0; index < 17; index += 1) {
        await assertQuickLayout(page, viewport, `case 02 transcript ${index + 1} host`, "host");
        if (index === 4) await assertVisibleText(page, "大概是什么资产水平", "第二宗快案必须在介绍男方后自然追问双方家底");
        if (index === 11) await assertVisibleText(page, "连前面几条一起截给我看看", "展示需求对质前必须先取得朋友圈截图");
        if (index === 12) await assertVisibleText(page, "旁边那个新包也是这个新男友送的吧", "收到朋友圈截图以后必须追问照片里的包");
        if (index === 15) await assertVisibleText(page, "你按时间念", "第二宗快案必须让聊天时间在首轮公平出现");
        await click(page, "[data-quick-next-turn]");
        await assertQuickLayout(page, viewport, `case 02 transcript ${index + 1} caller`, "caller");
        if (index === 4) await assertVisibleText(page, "他至少中A8", "第二宗快案必须由来电人亲口给出双方家底差距");
        if (index === 11) {
          await assertVisibleText(page, "现在朋友圈三天可见", "第一批截图必须先解释主播为何看不到旧朋友圈");
          await assertVisibleText(page, "你这边看不到以前的。我自己还能翻", "三天可见以后必须由来电人自己翻出旧动态");
          await assertVisibleText(page, "吃饭、演唱会这些", "第一批朋友圈必须实际显示她平时展示的内容");
        }
        if (index === 12) await assertVisibleText(page, "我在柜台前多看了几眼", "包必须由来电人确认是男方主动买下");
        if (index === 15) await assertVisibleText(page, "十一点五十二", "第二宗快案六分钟消息差必须实际显示");
        await click(page, "[data-quick-next-turn]");
      }

      await assertVisibleText(page, "先追问哪个矛盾点", "第二宗快案听完后必须交还玩家选择方向");
      await assertNoPageText(page, "他是在重新判断", "第二宗快案选择页不能提前显示主播结论");
      await click(page, '[data-quick-issue="age-gap"]');
      await assertVisibleText(page, "不能把这个周末后的退出归因于年龄", "第二宗快案合理干扰项必须给出证据不足说明并允许重试");

      const quick2IssueIds = ["emotion-or-display", "missed-message-state", "third-person", "how-he-knew", "nightlife-pattern", "apology-post"];
      const quick2ConfrontationRoles = [
        ["host", "caller", "host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller"],
        ["host", "caller", "host", "caller", "host", "caller"]
      ];
      for (let index = 0; index < quick2IssueIds.length; index += 1) {
        if (index === 2) {
          await assertVisibleText(page, "她改了第一次说法", "前两处问完后必须进入第二轮信息，不能继续展示后续答案按钮");
          for (let turnIndex = 17; turnIndex < 20; turnIndex += 1) {
            await assertQuickLayout(page, viewport, `case 02 transcript ${turnIndex + 1} host`, "host");
            if (turnIndex === 19) await assertVisibleText(page, "两个人为什么点这么多", "第二轮必须先露出酒不是两个人点完的缺口");
            await click(page, "[data-quick-next-turn]");
            await assertQuickLayout(page, viewport, `case 02 transcript ${turnIndex + 1} caller`, "caller");
            if (turnIndex === 19) {
              await assertVisibleText(page, "也不全是我们点的", "第三个人必须先以含糊的点酒主语出现");
              await assertNoPageText(page, "其实是三个人", "来电人不能在玩家质问前主动交出第三个人");
            }
            await click(page, "[data-quick-next-turn]");
          }
          await assertVisibleText(page, "那晚没有先说出的第三个人", "第二轮只能开放酒桌人数方向");
          await assertNoPageText(page, "去酒吧本身是不是错误", "第二轮不得再用价值判断充当无效选项");
          await assertNoPageText(page, "偶尔一次还是经常玩到很晚", "朋友圈出现前不能开放夜生活频率结论");
        }
        if (index === 3) {
          await assertVisibleText(page, "再看她发来的朋友圈截图", "第三个人问出来以后必须进入朋友圈截图深究阶段");
          for (let turnIndex = 20; turnIndex < 29; turnIndex += 1) {
            await assertQuickLayout(page, viewport, `case 02 transcript ${turnIndex + 1} host`, "host");
            if (turnIndex === 21) await assertVisibleText(page, "既然你自己还能翻", "第二批截图请求必须承接来电人能够查看自己旧动态的前提");
            if (turnIndex === 22) {
              await assertVisibleText(page, "你发来的截图里", "主播必须说明近两个月的材料来自来电人截图");
              await assertVisibleText(page, "凌晨五点十七分", "第三轮必须实际看到朋友圈截图里的深夜时间");
            }
            if (turnIndex === 26) await assertVisibleText(page, "八号你也出去喝酒了", "朋友圈追问必须带回前一晚 KTV");
            await click(page, "[data-quick-next-turn]");
            await assertQuickLayout(page, viewport, `case 02 transcript ${turnIndex + 1} caller`, "caller");
            if (turnIndex === 23) await assertVisibleText(page, "一大片纹身", "纹身只作为人物背景在后续问话中自然出现");
            if (turnIndex === 25) await assertVisibleText(page, "那是八号的照片", "公开动态的拍摄日期必须在结案前由来电人说出");
            await click(page, "[data-quick-next-turn]");
          }
          await assertVisibleText(page, "偶尔一次还是经常玩到很晚", "第三轮才允许玩家判断夜生活频率");
          await assertVisibleText(page, "男方怎么发现当晚还有别人", "第三轮必须开放男方发现第三个人的来源追问");
          await assertNoPageText(page, "去酒吧本身是不是错误", "第三轮不得保留无效价值判断选项");
        }
        await click(page, `[data-quick-issue="${quick2IssueIds[index]}"]`);
        let revealTransitionCount = await page.locator('[data-transition-kind="reveal"]').count();
        if (revealTransitionCount !== 0) throw new Error("第二宗快案重击不能在来电人承认第三人以前提前给答案");
        await assertVisibleText(page, "当面对质", `case 02 confrontation ${index + 1} must keep a clear stage label`);
        for (const [lineIndex, role] of quick2ConfrontationRoles[index].entries()) {
          await assertQuickLayout(page, viewport, `case 02 confrontation ${index + 1} line ${lineIndex + 1}`, role);
          if (index === 0 && lineIndex === 2) await assertVisibleText(page, "朋友圈截图我看了", "展示需求对质必须明确引用刚收到的截图");
          if (index === 3 && lineIndex === 1) await assertVisibleText(page, "这个‘他’是谁", "男方必须从来电人说漏的代词发现第三个人");
          if (index === 3 && lineIndex === 3) await assertVisibleText(page, "我不想说得好像我专门去见他一样", "发现来源对质必须以最小承认和自利辩解收尾");
          if (index === 0 && lineIndex === 4) await assertVisibleText(page, "也希望别人羡慕他给你的生活", "展示需求对质必须把截图事实问回她的实际诉求");
          if (index === 1 && lineIndex === 2) await assertVisibleText(page, "不叫‘我只漏看一条消息’", "消息对质必须落到被缩小的醉酒状态");
          if (index === 0 && lineIndex === 4) await assertVisibleText(page, "我们不脱离感情只谈钱", "展示需求对质必须保留主播关于感情与金钱的固定判断");
          if (index === 2 && lineIndex === 3) await assertVisibleText(page, "男的", "第三名男性必须经过身份收窄以后才由来电人承认");
          if (index === 2 && lineIndex === 4) {
            revealTransitionCount = await page.locator('[data-transition-kind="reveal"]').count();
            if (revealTransitionCount !== 1) throw new Error("第二宗快案必须在来电人承认男性在场后才播放唯一重击");
            await assertVisibleText(page, "不能证明你们发生过什么", "第三人对质不得把异性在场写成越界证据");
          }
          if (index === 4 && lineIndex === 1) {
            await assertVisibleText(page, "男的女的都有", "朋友圈深究必须逼出来电人承认同行者并非固定一拨人");
            await assertVisibleText(page, "读研以后聚会一直不少", "朋友圈深究必须由来电人自己把近期记录延伸到长期习惯");
          }
          if (index === 4 && lineIndex === 2) {
            await assertVisibleText(page, "婚介跟他说你生活简单", "夜生活对质必须带回开场的生活简单口径");
            await assertVisibleText(page, "男方看到了当然不可能信啊", "夜生活对质必须直接落到男方为何不再相信");
          }
          if (index === 5 && lineIndex === 2) await assertVisibleText(page, "对方又不傻", "道歉动态对质必须按男方当时看不到照片拍摄日期的现实口语追问");
          if (index === 5 && lineIndex === 4) await assertVisibleText(page, "他也能据此决定", "道歉动态的对质必须改变追回建议");
          await click(page, "[data-quick-next-confrontation]");
        }
        if (index === 0 || index === 3) await assertVisibleText(page, "先追问哪个矛盾点", "同一轮尚有问题时必须交还玩家选择权");
      }

      const quick2VerdictLines = [];
      let quick2VerdictFinished = false;
      for (let step = 0; step < 64; step += 1) {
        quick2VerdictLines.push(await page.locator(".quick-line p").innerText());
        const role = await page.locator(".quick-single-bubble").getAttribute("data-quick-speaking");
        await assertQuickLayout(page, viewport, `case 02 verdict ${step + 1}`, role);
        if (await page.locator("[data-quick-select]").count()) {
          quick2VerdictFinished = true;
          break;
        }
        await click(page, "[data-quick-next-verdict]");
      }
      if (!quick2VerdictFinished) throw new Error("第二宗快案结论必须在有限逐句推进后返回案件选择");
      const quick2VerdictText = quick2VerdictLines.join(" ");
      if (!quick2VerdictText.includes("动作倒推发心，逻辑要闭环")) throw new Error("第二宗快案结案复盘必须出现主播固定口头禅");
      if (!quick2VerdictText.includes("把八号、九号、桌上那个人")) throw new Error("第二宗快案必须让建议随着完整周末揭开而变化");
      if (!quick2VerdictText.includes("三番五次出去喝酒疯玩到深夜")) throw new Error("第二宗快案高概率判断必须对已播行为直接落判断");
      if (!quick2VerdictText.includes("舍不得对方的经济条件") || !quick2VerdictText.includes("想让我帮她想话术、想办法复合")) throw new Error("第二宗快案必须说清来电人的复合动机和求助目的");
      if (!quick2VerdictText.includes("酒桌上有没有发生别的事，不用猜")) throw new Error("第二宗快案结案必须保留聚会内容未知且不撤回判断");
      if (!quick2VerdictText.includes("先找了个条件好的供养者") || !quick2VerdictText.includes("‘深度沟通’和‘情绪价值’，都是借口罢了")) throw new Error("第二宗快案必须把供养诉求、继续玩乐和沟通借口直接说清");
      if (!quick2VerdictText.includes("骑驴找马") || !quick2VerdictText.includes("认真找结婚对象的人怎么可能接受")) throw new Error("第二宗快案必须把供养诉求、继续玩乐和婚恋后果直接说清");
      await page.waitForFunction(() => {
        const saved = JSON.parse(localStorage.getItem("livestream-detective-save-v1") || "{}");
        return saved.quickDetectiveCompletedIds?.includes("02-one-missed-message");
      });
      await click(page, "[data-quick-select]");
      if (await page.locator(".quick-case-card.is-complete").count() !== 2) throw new Error("两宗快案通关后都必须保留完成对勾和重玩入口");
    } finally {
      await context.close();
    }
  }
}

async function assertQuickLayout(page, viewport, label, expectedRole) {
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    portraitCount: document.querySelectorAll(".quick-stage-speaker img").length,
    activePortraitCount: document.querySelectorAll(".quick-stage-speaker.is-active").length,
    stageFocus: document.querySelector(".quick-duel-stage")?.dataset.quickStageFocus ?? "",
    speakingRole: document.querySelector(".quick-single-bubble")?.dataset.quickSpeaking ?? "",
    lineCount: document.querySelectorAll(".quick-exchange .quick-line").length,
    legacyControlCount: document.querySelectorAll("[data-quick-quote], [data-quick-reveal-crowd], [data-quick-next-crowd]").length
  }));
  if (layout.overflow > 2) throw new Error(`${viewport.width}x${viewport.height} quick ${label} overflows horizontally by ${layout.overflow}px`);
  if (layout.portraitCount !== 2) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must keep exactly two portraits`);
  if (layout.activePortraitCount !== 1) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must highlight exactly one portrait`);
  if (layout.lineCount !== 1) throw new Error(`${viewport.width}x${viewport.height} quick ${label} must show exactly one current speech bubble`);
  if (expectedRole && (layout.stageFocus !== expectedRole || layout.speakingRole !== expectedRole)) {
    throw new Error(`${viewport.width}x${viewport.height} quick ${label} focus ${layout.stageFocus}/${layout.speakingRole} does not match ${expectedRole}`);
  }
  if (layout.legacyControlCount) throw new Error(`${viewport.width}x${viewport.height} quick ${label} still renders retired crowd or quote controls`);
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
    if (await page.locator("[data-scene-helper]").count()) throw new Error("V哥隐藏期间不得出现求助按钮");
    await assertNoPageText(page, "V哥", "V哥隐藏期间不得出现在提问菜单");
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
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.stack ?? error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`${playableUrl}?playtest=browser-smoke-${route.name}-${Date.now()}&storyKey=steam-demo-01`);
    if (route.name === "accounting-restaurant") {
      const defaultPlayerName = await page.locator("[data-player-name]").inputValue();
      if (defaultPlayerName !== "林旭阳") throw new Error(`title page should default the player name to 林旭阳, got ${defaultPlayerName}`);
      if (await page.getByText("林旭阳坐在主播台前", { exact: false }).count()) throw new Error("title page must not explain the player identity twice");
      await page.locator("[data-player-name]").fill("周明");
    }
    if (route.name === "accounting-restaurant") await assertAudioSettings(page);
    if (route.inputMode === "gamepad") await connectGamepad(page);
    await activate(page, route, "[data-start-story]");
    if (route.name === "accounting-restaurant") {
      const mainHostCaption = (await page.locator(".case-portrait-host figcaption b").innerText()).trim();
      if (mainHostCaption !== "周明") throw new Error(`主案舞台必须显式沿用玩家姓名，实际为：${mainHostCaption || "<空>"}`);
      await assertNoPageText(page, "林旭阳", "主案改名后不得在立绘、气泡或HUD残留默认主播名");
      if (await page.locator(".pixel-transition").count() !== 1) throw new Error("night shell should mount one pixel transition overlay");
      const pointerEvents = await page.locator(".pixel-transition").evaluate((element) => getComputedStyle(element).pointerEvents);
      if (pointerEvents !== "none") throw new Error("pixel transition must never block player input");
      const transitionDuration = await page.locator(".pixel-transition-soft-fade").evaluate((element) => getComputedStyle(element).animationDuration);
      if (transitionDuration !== "2.4s") throw new Error(`pre-show transition should hold for 2.4s, got ${transitionDuration}`);
    }
    if (await page.locator("[data-enter-first-case]").count()) {
      await drainDialogue(page, route);
      await assertVisibleText(page, "改版又催上了，先让他催着。开播了哈，今天继续连麦。", "night shell prologue should sound like a returning personal streamer");
      await assertNoPageText(page, "试玩已收麦", "night shell prologue must not display the story-pack completion HUD");
      if (await page.locator(".night-shell-line.shell-notice, .night-shell-line.shell-message, .night-shell-line.shell-stage, .night-shell-line.shell-host").count() !== 4) {
        throw new Error("night shell prologue should distinguish work notice, personal message, solo go-live action, and host opening");
      }
      await activate(page, route, "[data-enter-first-case]");
      await assertVisibleText(page, "CASE 01", "first case must enter through the same case title treatment as later cases");
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
    let helperHiddenChecked = false;
    let directionChoiceChecked = false;
    let materialEntryChecked = false;
    let selectedCounterChoiceLabel = "";
    let sceneQuestionCount = 0;

    for (let beat = 0; beat < 48; beat += 1) {
      await collectLiveVisualState(page, visualStates, portraitStates);
      if (route.name === "accounting-restaurant" && !materialEntryChecked && await page.locator(".deck-card-material[data-material-open]").count()) {
        if (await page.locator("[data-material-open]").count() < 3) throw new Error("received material must be reachable from the control deck, dialogue bar, and active choice layer");
        if (!await page.locator(".choice-material-shortcut[data-material-open]").isVisible()) throw new Error("active choices must expose a visible received-material shortcut");
        await page.locator(".choice-material-shortcut[data-material-open]").click();
        await page.locator(".avg-material-modal:not([hidden])").waitFor({ state: "visible" });
        await assertVisibleText(page, "社保断缴时间", "the first received material must open before the active choice");
        await page.locator(".avg-material-panel [data-material-close]").click();
        materialEntryChecked = true;
      }
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
      if (await page.locator("[data-enter-post-live], [data-enter-interlude]").count()) {
        await assertVisibleText(page, "电话断了。后台那张信用卡账单还亮着，至少三万五没有说明", "overnight route should show the authored three-bucket hangup line before the show ends");
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
        const liveCounterTranscript = await drainDialogue(page, route);
        if (route.name === "accounting-restaurant") {
          if (!liveCounterTranscript.includes("他在听。")) {
            throw new Error("night-B counter-pressure should interrupt between two live scenes");
          }
          // verify-pack rejects respondent roles in live-counter lines; this replay verifies
          // that the player's selected on-air host response actually reached the transcript.
          const selectedCounterSentences = selectedCounterChoiceLabel.match(/[^。！？!?]+[。！？!?]?/gu)?.map((item) => item.trim()).filter(Boolean) ?? [];
          if (!selectedCounterChoiceLabel || !selectedCounterSentences.every((sentence) => liveCounterTranscript.includes(sentence))) {
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
      if (!helperHiddenChecked && route.name === "accounting-restaurant") {
        if (await page.locator("[data-scene-helper]").count()) throw new Error("V哥隐藏期间不得出现求助按钮");
        await assertNoPageText(page, "V哥", "V哥隐藏期间不得出现在玩家可见流程");
        await assertNoPageText(page, "按下以后", "主案问题面板不得解释按钮点击后的行为");
        await assertNoPageText(page, "疑点方向", "主案问题按钮不得重复标注控件类型");
        helperHiddenChecked = true;
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
      const questionIndex = route.sceneMode === "outer" && await page.locator("[data-scene-question]").count() > 1
        ? (sceneQuestionCount === 0 ? 0 : 1)
        : 0;
      const selectedQuestion = page.locator("[data-scene-question]").nth(questionIndex);
      const directionLabel = await selectedQuestion.evaluate((element) => element.classList.contains("choice-question-direction"))
        ? await selectedQuestion.locator(".choice-text").innerText()
        : "";
      await activate(page, route, "[data-scene-question]", questionIndex);
      sceneQuestionCount += 1;
      if (directionLabel && !directionChoiceChecked) {
        const dialogueBox = page.locator("[data-dialogue-advance]:visible").first();
        const spokenQuestion = dialogueBox.locator(".avg-page-line.speaker-host .avg-line").first();
        await spokenQuestion.waitFor({ state: "visible" });
        if (!await dialogueBox.locator(".avg-continue").isVisible()) {
          await dialogueBox.evaluate((element) => element.click());
        }
        const spokenText = (await spokenQuestion.textContent())?.trim() ?? "";
        if (!spokenText || spokenText === directionLabel || !/[？?]$/.test(spokenText)) {
          throw new Error("direction choice should turn into Lin Xuyang's authored spoken question");
        }
        await assertNoPageText(page, `${route.name === "accounting-restaurant" ? "周明" : "林旭阳"}\n${directionLabel}`, "direction label must not replace the protagonist's spoken line");
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
    if (route.name === "accounting-restaurant" && (!helperHiddenChecked || !directionChoiceChecked || !materialEntryChecked)) {
      throw new Error("primary browser route must verify hidden V哥 UI, a direction-only question, and the received-material entry");
    }
    const materialIndex = route.materialMode === "miss" ? 1 : 0;
    const materialButtons = page.locator("[data-evidence-check]");
    await activate(page, route, "[data-evidence-check]", Math.min(materialIndex, await materialButtons.count() - 1));
    if (route.name === "accounting-restaurant") {
      await assertVisibleText(page, "我刚才光说他买衣服", "perfect route should show testimony revision after the material hit");
    }
    if (route.name === "material-miss-accounting-restaurant") {
      await assertVisibleText(page, "一件大衣两千多，单看不算离谱", "material-miss route should show pity line after the first miss");
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

async function completeCase1Interlude(page, route) {
  await assertVisibleText(page, "回拨前", `${route.name} must pass through the short interlude before the day map`);
  await activate(page, route, '[data-interlude-action="recheck-history-pages"]');
  await activate(page, route, "[data-evidence-check]");
  await activate(page, route, "[data-callback-ready]");
}

async function runCase3DayRoutes() {
  await runOfflineDayMap({
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
  });
  await runOfflineDayMap({
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
  });
}

async function runCase4DayRoutes() {
  await runOfflineDayMap({
    chapter: 4,
    name: "case4-day-map",
    interludeAction: "recheck-approval-page",
    interludeText: "这张审批图最该让对方补哪一页",
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
      { id: "day-tony-member-docs", text: "会员维护、消费与私表记录", rows: ["m02", "m04"] }
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
      { id: "day-tony-member-docs", text: "会员维护、消费与私表记录", rows: ["m02", "m04"] }
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
      { id: "day-tony-member-docs", text: "会员维护、消费与私表记录", rows: ["m02", "m04"] }
    ],
    opener: "咨询者止损立场",
    openerText: "我劝她先把卡停掉"
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
      if ((route.documentRows ?? []).includes("r01b")) {
        await assertVisibleText(page, "这是他自己住的地方？", "marking the bimonthly rent row must unlock a beneficiary question without answering it in advance");
        await assertNoPageText(page, "不是，是我住的", "the daytime document must not reveal the rent beneficiary before the player asks");
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
    await assertVisibleText(page, "已经确认", "closure should distinguish confirmed facts from a raw evidence pile");
    await assertVisibleText(page, "还没弄清", "closure should preserve unresolved facts");
    await click(page, "[data-enter-story-interlude]");
    await page.getByText("广告间隙").first().waitFor({ state: "visible" }).catch(async () => {
      throw new Error(`first case tail did not render after closure:\n${await page.locator("body").innerText()}`);
    });
    await assertVisibleText(page, "广告间隙", "closure should move into the first case's lived epilogue without an authorial case-tail label");
    await assertVisibleText(page, "我们俩大概一开始就看不上对方", "first case epilogue should establish Lin and Zhao as a couple through dialogue");
    if (await page.locator(".pixel-transition-signal-disconnect").count() !== 1) throw new Error("program interlude should use one short disconnect signal transition");
    await click(page, "[data-enter-case-bridge]");
    const firstTransitionQuote = transitionQuoteByCaseId["01-credit"];
    await assertVisibleText(page, firstTransitionQuote.text, "case one and case two must be joined by the authored classic quote");
    await assertVisibleText(page, firstTransitionQuote.source, "inter-case quote must display its source");
    if (await page.locator(".case-bridge-handoff").count()) throw new Error("inter-case quote page must not add a next-case synopsis or author-written bridge");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "CASE 02", "second case must open on a numbered case title card");
    await assertVisibleText(page, "理发店排班表", "second case title card should name the case");
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
    await click(page, "[data-enter-case-bridge]");
    await assertVisibleText(page, transitionQuoteByCaseId["02-tony"].text, "case two and case three must use the authored quote transition");
    await click(page, "[data-enter-next-case]");
    await assertVisibleText(page, "CASE 03", "case two tail must return to the normal case transition");

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
    await page.getByText("收播以后").first().waitFor({ state: "visible" });
    await assertVisibleText(page, "收播以后", "final case must have its own lived epilogue");
    await assertVisibleText(page, "屏幕右上角的“直播中”灭了", "final case tail must close through an on-screen action instead of an authorial end label");
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
    { width: 1280, height: 800, label: "deck-css" },
    { width: 1920, height: 1080, label: "wide-desktop" }
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
        const portrait = document.querySelector(".case-portrait-caller.art-pixel img:not([hidden])");
        const rect = portrait?.getBoundingClientRect();
        return {
          shellOverflow: shell ? shell.scrollWidth - shell.clientWidth : 999,
          pointerEvents: portraitLayer ? getComputedStyle(portraitLayer).pointerEvents : "missing",
          imageRendering: portrait ? getComputedStyle(portrait).imageRendering : "missing",
          portraitCount: document.querySelectorAll("[data-dialogue-portrait]").length,
          activePortraitCount: document.querySelectorAll("[data-dialogue-portrait].active").length,
          shellWidth: shell?.getBoundingClientRect().width ?? 0,
          rect: rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width } : null
        };
      });
      if (!layout.rect) throw new Error(`${viewport.label} portrait layout is missing`);
      if (layout.shellOverflow > 2) throw new Error(`${viewport.label} portrait shell overflows horizontally by ${layout.shellOverflow}px`);
      if (layout.pointerEvents !== "none") throw new Error(`${viewport.label} portrait layer must not block dialogue or choices`);
      if (layout.imageRendering !== "pixelated") throw new Error(`${viewport.label} portrait must keep nearest-neighbor rendering`);
      if (layout.portraitCount !== 2) throw new Error(`${viewport.label} live dialogue stage must keep host and caller portraits`);
      if (layout.activePortraitCount !== 1) throw new Error(`${viewport.label} live dialogue stage must highlight exactly one speaker portrait`);
      if (viewport.width >= 1440 && layout.shellWidth < viewport.width * 0.9) {
        throw new Error(`${viewport.label} live stage uses only ${Math.round(layout.shellWidth)}px of a ${viewport.width}px fullscreen viewport`);
      }
      if (layout.rect.left < -1 || layout.rect.right > viewport.width + 1) throw new Error(`${viewport.label} portrait escapes the viewport horizontally`);
      if (layout.rect.width > Math.min(viewport.width * 0.5, 420)) throw new Error(`${viewport.label} portrait is too wide for the full-stage dialogue composition`);
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
  for (let line = 0; line < 80; line += 1) {
    const box = page.locator("[data-dialogue-advance]:not([data-dialogue-done]):visible").first();
    if (!await box.count()) {
      await assertInlineContinuePlacement(page);
      return [...shownText].join("\n");
    }
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

async function assertInlineContinuePlacement(page) {
  const overlay = page.locator(".dialogue-focus-stage .avg-choice-overlay.inline-choice-flow:visible").first();
  if (!await overlay.count()) return;
  const placement = await overlay.evaluate((element) => {
    const stage = element.closest(".vn-stage");
    const button = element.querySelector("button");
    const stageRect = stage?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    return {
      insideRecord: Boolean(element.closest(".court-record")),
      stageRatio: stageRect && buttonRect ? (buttonRect.top - stageRect.top) / Math.max(1, stageRect.height) : -1,
      bottomOverflow: stageRect && buttonRect ? buttonRect.bottom - stageRect.bottom : 999
    };
  });
  if (placement.insideRecord || placement.stageRatio < 0.55 || placement.bottomOverflow > 2) {
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
  await page.waitForTimeout(50);
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
    const role = line?.classList.contains("speaker-host")
      ? "host"
      : line?.classList.contains("speaker-caller")
        ? "caller"
        : "stage";
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
  const src = await page.locator(".case-portrait-caller img:visible").first().getAttribute("src").catch(() => "");
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
