# 第 29 批·修复 smoke 反制拍断言 + 补齐行为闸门

> 归档状态：已于 2026-07-28 完成评审与执行；反制拍改用所选主播文案的 transcript 校验，并新增 `test:pr` 行为闸门。最终 `npm run test:full` 全绿。

你是本仓库的实施工程师。判决来源:复审(2026-07-28)。`npm run test:full` 当前**红**——`smoke-browser-replay.js:343` 在 `accounting-restaurant` 路线抛「the host must answer the relayed counter-pressure without putting the other party on mic」。已确认此失败存在于**已提交的 HEAD**(非 WIP)。

## 诊断(已核实,照此修,勿改内容)

1. 案1「他在听」反制拍(`credit-live-listener-screenshot`)已被重做为 **`kind: emotionalChoice`**:`lines` 全是 caller/pause 角色(来电人转读对方截图),主播的回应由**选项标签**承担(玩家替主播选那句话),选中后播 choice 的 caller 回应 + `recapAftertaste` 摘要。**此结构里根本没有 host 角色的 `.avg-line`。**
2. 断言 `smoke-browser-replay.js:341-344` 是照**旧的"主播直接答一句"结构**写的:它在 `data-continue-live-counter` 步用 `[data-dialogue-advance]:visible …speaker-host .avg-line` 找主播行——但 `drainDialogue` 已经把该步所有对话抽干、DOM 里已无可见对话行,必然扑空。
3. 断言想守的"对方永不上麦"**早已被静态保证**:`verify-pack.js:82` 把反制拍 `lines[]` 与 `choices[].lines[]` 的角色**白名单限死在 `caller/host/stage/pause`**,`respondent`/对方 角色写不进去。所以 mic-ban 不需要 smoke 再动态验。
4. 结论:**内容是对的**(emotionalChoice 让"要不要在他监视下继续"成为来电人/玩家的选择,主题更强,对方仍从不上麦);**断言过时**。这是一次"内容重构跑赢了自己的 smoke 断言、且提交前没跑 smoke:browser"导致的 flow-vs-test 漂移。

## 铁律

1. **不改任何内容**(`content/`、台词、反制拍结构一律不动)。
2. 只修 smoke 断言使其匹配 emotionalChoice 流程 + 补行为闸门。
3. 收尾必须 `npm run test:full` **全绿**(check + smoke:browser + smoke:desktop)。

---

## A. 修复 accounting-restaurant 反制拍断言

`scripts/smoke-browser-replay.js` 的反制拍处理(约 331–349 行):

现状:
- `[data-live-counter-choice]` 分支(约 331):activate 选项 0 → continue。
- `[data-continue-live-counter]` 分支(约 336):`drainDialogue` → 断言「他在听。」存在 + 找可见 host `.avg-line`(**这行报错**)→ continue。

改为:保留"反制拍确实触发"的验证,**删掉过时的 host-`.avg-line` DOM 重查**,换成验证"主播的回应路径以 emotionalChoice 形式出现过"(即该路线在进入 continue 前确实经过了 `data-live-counter-choice`)。具体:

1. 在 `runRoute` 的循环作用域内加一个标志 `let counterChoiceOffered = false;`(每路线一份)。
2. 在 `[data-live-counter-choice]` 分支里,activate 之前置 `counterChoiceOffered = true;`。
3. 把 `[data-continue-live-counter]` 分支的断言改为:
   ```js
   const liveCounterTranscript = await drainDialogue(page, route);
   if (route.name === "accounting-restaurant") {
     if (!liveCounterTranscript.includes("他在听。")) {
       throw new Error("night-B counter-pressure should interrupt between two live scenes");
     }
     if (!counterChoiceOffered) {
       throw new Error("the host must answer the relayed counter-pressure via an on-air choice, never by putting the other party on mic");
     }
   }
   ```
   即:**删除**原来那段 `const hostReply = page.locator(...)` + `isVisible` 检查,替换为 `counterChoiceOffered` 标志断言。
4. 断言语义说明补一行注释:对方永不上麦由 `verify-pack` 的角色白名单静态保证;此处只验反制拍触发 + 主播经选项回应。

> 注意:emotionalChoice 反制拍在 case2/3/4 也存在,但那些路线不带 accounting-restaurant 专属断言,`data-live-counter-choice` 分支照常 activate→continue,不受影响。若循环里 `counterChoiceOffered` 的作用域放错(比如放到 route 循环外),会串味,务必每路线初始化一次。

## B. 把 smoke:browser 纳入行为闸门(堵住复发)

根因是"提交前只跑 `check`(不含 smoke:browser),flow 回归漏进主干"。`check` 是快速静态闸门、含 verify-pack(已守住内容不变式);但**流程/渲染回归只有 smoke:browser 抓得到**,它必须进例行闸门。做**其一**(择工程量最小、与现有 CI 匹配者):

- 若仓库有 CI:在 PR/push 工作流里把 `npm run test:full`(或至少 `npm run smoke:browser`)设为必过 job。
- 若无 CI 或以本地为主:在 `package.json` 增设 `"test:pr": "npm run check && npm run smoke:browser"`,并在 `docs/README.md` 或贡献说明里写明:**改动 `content/`、`src/ui/`、`src/app.js`、反制拍/场景流程后,提交前必须跑 `npm run test:pr`**(不能只跑 `check`)。
- 不要把 smoke:browser 塞进 `check` 本身(它需要浏览器构建 + Playwright,会拖慢每次静态校验);让它作为独立必过步骤。

## 验收

1. `npm run test:full` 全绿(check + smoke:browser + smoke:desktop)。
2. `npm run smoke:browser` 单跑绿,且 `accounting-restaurant` 路线确实经过反制拍(可临时 log `counterChoiceOffered` 确认为 true 后移除)。
3. 内容零改动:`git diff -- content/` 为空。
4. 提交切分:A(smoke 断言)一个提交、B(闸门/CI/脚本)一个提交。
5. 不确定处停下报告,不自行扩大范围。

## 备注(不在本单)

分支上还有未提交的"评论区快案(quick detective mode)"新功能(model+view+content+11 单测,已接标题页)。本单只把主干修绿;quick mode 待其自身 smoke 路线补齐后按 feature 独立提交,不要和本次修复混提交。
