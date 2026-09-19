# 三处逻辑收口 Prompt

日期：2026-09-19。三处逻辑仍有效，但**待改清单已并入 [未改项完整 Prompt](remaining-edits-prompt.md)**。开改用那份，不要和本文、声线分单各做一遍。原则见 [谎盖谎](caller-shameless-demand.md)。已完成项见 [谎盖谎改稿 Prompt](shameless-demand-revision-prompt.md)。

先读本案 JSON 和实际播单。不要恢复旧系统。不要重置存档。片尾三句、案四不再垫款、案三说忙、案二修刘海、快案三口播都保留。主播该问的问。改完跑 `npm run content:index`、`npm run content:script`、`npm run check`。生成稿不能手改。

---

## 1. 案四夜二：别再审已经认过的四千

**目的。** 夜二打的是「优先办我的」和「旧的等新收款」，不是再发现一次四千。

**逻辑。** 夜一 `work-private-process` 已经认下四千、一万二、上回多结。夜二 `work-leader-note` 一开口就是各部门待付、主管说优先办他的。必经问却先问「财务问到那一万二你怎么回」，`work-split-ownership` 证词墙还先走 `act2`「包干的钱怎样分」。待付已经上台，又回头把旧账当新秘密，违反「已经承认的事实不能重新成为秘密」。

**要改。**

- `work-leader-note` 必经问对准待付或「优先办我的」，不要再问一万二怎么回。version 里可以带过财务问过协调费，但本场核心不是草单。
- `work-split-ownership` 先打待付 / 优先办 / 下周预收款才付旧账（现有 `act1`），再让他自己选还催不催、下周还垫不垫。`act2` 四千/草单若还要留，只能当已经认过的事实带过，不能当本场第一刀。
- 不再垫款、群里问付款日仍留在乱局揭开之后。
- 别补新反派、押金课、开场暴雷。

文件：`content/packs/steam-demo-01/cases/04-workplace.json`

---

## 2. 序章：桌边不要第三环

**目的。** 咖啡厅只两刀：人在不在酒店，钱有没有过手。孩子鉴定不当面再开一轮。

**逻辑。** 转账打中后，`recapScreens.js` 在法律交接之后仍播 `parentageBlockLines`（男方要鉴定、妻子吵）。清单是两环够了。鉴定可以留到散场后的机构线，不当桌边对质。

**要改。**

- 桌边转账 + 法律交接之后，直接关录像/散场，不要再播亲子对质。
- 律师仍不当场替法院定性。交接保持短。
- 散场后的鉴定入口若已有，保留；只是不要在咖啡厅再审一轮。
- 检查旧存档步进：删掉桌边第三环后，不能卡在已不存在的 step。

文件：`content/packs/steam-demo-01/manifest.json`（`cafePrologue.cafe.parentageBlockLines`）、`src/ui/screens/recapScreens.js`（step 在 transfer/legal 之后的分支）、相关 `prologueCafeModel.js` 测试。

---

## 3. Tony：警察收成过场

**目的。** 夜二尽快落到十二万怎么走他户、谁先要买、何时听说拿不回。门口来人只带过。

**逻辑。** 必经问已经是赎回/代投。但 `tony-who-messaged` 的 version 仍整段讲警察和自己那笔借款，`casualQuestions` 也全是警察、搬家、催债。过场占了主位，不是自相矛盾。

**要改。**

- version 收成几句：昨晚有人敲门，是来核实另一笔借款的，没问 Tony；她借钱也是想多凑点跟着买，多少今晚不说。立刻接到十二万。
- 必经问不要再审警察。闲问若还留警察，最多一条，不要三条占满。
- 回拨不要先追「门口是谁」。
- 修刘海仍在最后一场场尾。恋爱是真的、小姐妹渠道、借他户买，不要改回去。

文件：`content/packs/steam-demo-01/cases/02-tony.json`（`tony-who-messaged`，以及回拨开场若还问门口）

---

## 不要做

- 不要重写案一、案三、快案。
- 不要新开快案四。
- 不要只改 `whyTonight` / `truth`。
- 不要为压短而删掉「后面补前面」那句主管原话。
- 不要把亲子鉴定从游戏里删干净，只是离开咖啡厅桌边。
