# 第 31 批·落库 pass 30 + 真正接上行为闸门(根治 smoke 反复带红)

> 归档状态：已于 2026-07-29 选择执行。新增 push／pull_request 行为闸门，干净 CI 先安装 Chromium，再运行 `test:pr`；保留 release-tag Windows 打包工作流，不增加本地 pre-push 钩子。

你是本仓库的实施工程师。判决来源:复审(2026-07-29)。两件事一起做:①把工作区里已完成的 pass 30 内容修复落库并确认全绿;②**真正接上 smoke:browser 闸门**——它反复在已提交 HEAD 变红的根因已定位。

## 根因(已核实,照此修)

- 唯一的 CI 工作流 `.github/workflows/windows-package.yml` 只在 **release tag(`push: tags: v*`)** 和手动触发时跑,且只跑 `npm run check`(**不含 smoke:browser**)。
- `package.json` 有 `"test:pr": "npm run check && npm run smoke:browser"`,但**没有任何东西调用它**:没有 push/PR 级 CI,没有 git hook,没有 husky。
- 于是 `smoke:browser` 全靠人手动跑。内容/开场台词一被重写、smoke 里 pin 的 `openerText` 等没跟着更新,`check` 照绿、`smoke:browser` 变红,却因无人跑 smoke 而带红提交——已连续复发三次(accounting-restaurant → restaurant-document → …)。
- 结论:**问题不是内容,是闸门根本没接线**。修 CI,让 push/PR 自动跑 `test:pr`。

## 铁律

1. 不改游戏内容/台词(A 只是把工作区已改好的东西落库)。
2. 收尾本地 `npm run test:full` 全绿。
3. 新增 CI 必须能在干净环境跑通(含 Playwright 浏览器安装)。

---

## A. 落库 pass 30 并确认绿(先做)

工作区当前含 pass 30 的已完成修改(案2语音措辞、案3 p06 双计消歧、两条 restaurant smoke pin、重生成台本等)。

1. `npm run content:index && npm run content:script`(确保生成物同步)。
2. `npm run test:full` 全绿(check + smoke:browser + smoke:desktop)。**若仍有其它 smoke pin 因近期台词重写而失配,一并对齐**(只改 smoke 里的 pin/期望子串,不改内容)。
3. 按 pass 30 的切分提交(smoke pin / 案3文档 / 案2措辞),或合并为一个 `fix: land pass-30 story rigor and smoke pins`。主干必须回到 `test:full` 绿。

## B. 接上 push/PR 级 CI(根治复发,核心)

新增 `.github/workflows/ci.yml`,在**每次 push 和 pull_request** 上跑 `test:pr`(= check + smoke:browser)。要点:

- 触发:`on: [push, pull_request]`(如需限支,push 至少覆盖非 tag 的日常分支;不要只留 tag)。
- `runs-on: ubuntu-latest`;`timeout-minutes: 20`。
- 步骤:
  1. `actions/checkout@v6`
  2. `actions/setup-node@v6`(node 版本与 `windows-package.yml` 一致或用 `.nvmrc`;`cache: npm`)
  3. `npm ci`
  4. **`npx playwright install --with-deps chromium`**(smoke:browser 用 Playwright,干净 CI 必须先装浏览器,否则必挂)
  5. `npm run test:pr`
- 不动现有 `windows-package.yml`(它是 release-tag 打包,职责不同,保留)。
- 说明注释写清:此 job 是行为闸门,`check` 抓静态与内容不变式,`smoke:browser` 抓流程/渲染回归(pin 漂移这类)。

### 验证 CI 可跑通

- 本地模拟干净环境:`npm run test:pr` 在本机绿即基本可信;若能用 `act` 或在分支 push 触发一次实跑更好。
- 确认 Playwright 浏览器安装步骤存在且在 `test:pr` 之前——这是干净 CI 跑 smoke:browser 的唯一硬前提。

## C. 本地快速反馈钩子(可选,低优先)

CI 是权威闸门;如需提交前的本地快速拦截,可加一个 **pre-push**(不是 pre-commit,smoke 偏慢)钩子跑 `npm run test:pr`。用零依赖方式(`.git/hooks/pre-push` 脚本或 `simple-git-hooks`),**不要**为此引入 husky 这类重依赖。本地钩子可被绕过,只作补充,不替代 B。

---

## 验收

1. 本地 `npm run test:full` 全绿;`npm run test:pr` 全绿。
2. `.github/workflows/ci.yml` 存在,`on:` 含 push 与 pull_request,步骤含 `npx playwright install --with-deps chromium` 且在 `npm run test:pr` 之前;`windows-package.yml` 未被改动。
3. `git diff -- content/ src/` 不含本单引入的游戏逻辑/台词改动(A 只落库既有修复,B/C 只碰 CI/hook/脚本)。
4. 提交切分:A(落库 pass 30)、B(ci.yml)、C(可选 pre-push)各一个提交。
5. 不确定处停下报告,不自行扩大范围。

---

## 备注

本单只堵"内容重写→smoke pin 失配→带红提交"这条复发路径。接上 CI 后,同类漂移会在 PR/push 即时变红被拦,而不是躺进主干等下次 review 才发现。这也让往后的剧情/UI 改动敢放手做——闸门替你兜住行为回归。
