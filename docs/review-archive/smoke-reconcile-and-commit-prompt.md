# 执行单·收口巨型改写:smoke pin 追内容 + quick2 断言对齐 + 分片提交

> 归档状态（2026-08-10）：其中记录的 smoke 首错已在归档前解决；保留“测试追内容”和分片提交原则，不再把旧 pin 漂移当作当前失败原因。

你是本仓库的实施工程师。判决来源:巨型台词改写复审(2026-08-10)。四案深化+主播双寄存器+慌乱失稳+同情梯度的改写**质量极高、方向正确**,但当前 **119 文件全部未提交、`npm run test:full` 红**。本单只做收口:让 smoke 追上新内容、把改动分片提交。**不改任何新台词的写法**(内容是对的,是测试落后了)。

## 已核实(照此,别推翻)

- 红因是**内容-测试漂移**:大改写重写/重排了台词与流水行,smoke 里 pin 的字符串/位置没跟上。已核实**功能没丢**——案1仍有材料命中改述(afterVersion)、怜悯句(pityLine)、5 个 evidenceChecks,只是措辞变了(例:怜悯句现为「一件大衣两千多,单看不算离谱……」);quick2 仍含「也希望别人羡慕他给你的生活」(2 处),只是对质拍被**重排**,positional 断言(index/lineIndex)错位。
- 干净单跑首个报错:`展示需求对质必须把截图事实问回她的实际诉求`(quick2 case02 对质,`smoke-browser-replay.js:359` 一带)。smoke 撞首个失败即中止,后面主线路线还没跑到,**下面还有更多漂移**。
- 抽查 5 个主线 pin,3 个已失配:`六月 8 号那笔没来`、`这张账我重说`、`这卡上像戒了的样子吗`(后者现已改述)。

## 铁律

1. **pin 追内容,不是内容迁就 pin。** 不许为了让 smoke 绿去改动新台词/新流水行。
2. **不许靠删断言蒙混。** 每个失败断言,先判:①措辞/顺序变了→更新断言的期望字符串/位置去匹配当前内容;②该拍/功能**真的没了**→先确认是**有意精简**(才可删该断言)还是**误删**(必须报告,不自行取舍)。默认是①。
3. 事实层不许动:`verify:pack` 的行-证言一致性必须绿(流水加了 r01a/房租等行,确认数字与证言不矛盾)。
4. 收尾 `npm run test:full` 全绿(check + smoke:browser + smoke:desktop)+ CI/test:pr 绿。

## Part A|主线 smoke pin 追内容

方法(迭代,因 smoke 撞首错即停):`npm run smoke:browser` → 读失败断言 → 按铁律2判定 → 更新 `scripts/smoke-browser-replay.js` 里该 pin 的期望字符串为**当前台本里的对应句**(去 `docs/generated/steam-demo-01-*script.md` 或 JSON 找现文)→ 重跑,直到主线全绿。

已知起手漂移(至少这些,按现内容更新;不止这些):
- 案1 流水空行备注 `六月 8 号那笔没来` → 现 r09 备注是「本月未见对尾号 6624 的固定转出;07-09 也未见双月房租」,相关 pin/openerText 按现文更新。
- 案1 材料命中改述 `这张账我重说`(perfect route testimony revision)→ 用当前 afterVersion 首句替换。
- 案1 材料未命中怜悯句 `这卡上像戒了的样子吗` → 用当前 pityLine(如「一件大衣两千多,单看不算离谱……」)替换。
- 逐条核对 openerText / dayChoiceText / callerQuestion / assertVisibleText 里所有主线 pin 是否仍在当前内容;失配就追。

## Part B|quick2 对质断言对齐

`smoke-browser-replay.js` 约 350–365 行,quick2(case02-one-missed-message)的对质用 `index/lineIndex` 定位具体行(如 `index===0 && lineIndex===4` 断言「也希望别人羡慕他给你的生活」)。这些行**内容还在,但顺序变了**。做:

1. 先确认 quick2 内容是否已定稿(它是较新功能)。**若仍在改**,停下报告,先定稿再对断言——别对着半成品调断言。
2. 若已定稿:按当前对质拍的实际顺序,更新每条断言的 `index/lineIndex` 与期望字符串,使之匹配现内容;`quick2ConfrontationRoles` 等角色序列同步核对。
3. 保持断言**意图**不变(展示需求对质仍要把截图问回她的实际诉求、发现来源对质仍以最小承认+自利辩解收尾等)——只对齐位置与引文,不放松意图。

## Part C|全绿

`npm run content:index && npm run content:script && npm run check && npm run verify:pack -- steam-demo-01 && npm run smoke:browser && npm run smoke:desktop` 全绿。

## Part D|分片提交(别再攒成一坨)

当前 119 文件未提交。**先看清里面有没有夹带非预期的 src/scripts 改动**(`git diff --stat src/ scripts/`),确认都是本轮该有的。然后按可回看的逻辑切片分别提交,建议:
1. 四案主线台词改写(可按案分 4 提交,或"主线改写"1 提交)。
2. quick2 内容(若定稿)/ quick 模式相关。
3. smoke pin + 断言对齐(A+B 合一提交,信息写清"pin 追内容")。
4. spine-audit 四文档 + `audit-case-spine` 技能(改稿依据,入库;若触 DOCS-004 顶层清洁规则,移 `docs/review-archive/` 或 skill references,别丢)。
5. 故事圣经 markdown(chapters/characters/scenes/plot/continuity)+ 其它文档/生成物。
6. 任何 src/scripts 逻辑改动单独一提交,说明清楚。

每片提交前至少 `npm run check` 绿;全部提交后 `test:full` + CI 绿。

## 验收

1. `npm run test:full` 全绿;`git status` 干净(全部入库)。
2. `git diff` 复核:新台词/新流水行**未被为迁就 pin 而改动**;被更新的只有 `smoke-browser-replay.js` 的期望字符串/位置。
3. 提交历史是可回看的多片,不是单个 119 文件巨块。
4. 任何"功能疑似被误删"的断言,**停下报告**,不自行删断言。
5. 不确定处停下报告,不自行扩大范围。
