# 第 15 批 v2·隔夜回拨与白天场景执行单（取代 two-call-night-pass-15-prompt.md）

你是本仓库的实施工程师。本单取代 v1（若 v1 已部分实施，夜结构状态机可复用，幕间行动位升级为白天地点）。判决链：playtest「太线性」→ v1（两连线之夜）→ 复审「场景仍局限直播间，需要场景切换创造反差」→ 本单。设计核心：

- **案 1 从"一通电话"变成"两个夜晚和中间的一个白天"。**
- **白天没有弹幕**——节目不在线，千耳沉默，主播独自进城。夜的喧哗与白天的安静是本作最大的反差资源，从自己的感知带宽语法里长出来。
- 直播间是节目；白天的城市才让它成为世界。

台词与 JSON 逐字使用。本单只改引擎与案 1；案 2-4 等竖切真人手感。

## 任务 1：隔夜结构引擎

内容契约（替代 v1 的 nightStructure）：

```json
"overnightStructure": {
  "hangupAnchor": "<场景锚点>", "hangupLine": "", "hostHoldLine": "",
  "dayIntro": "", "dayBudget": 2,
  "dayScenes": [ { "id": "", "label": "", "backdropClass": "", "kind": "lab|visit|home|studio", "body": {} } ],
  "callbackOpeners": { "<earnedItemId>": { "line": "" } },
  "callbackFallback": { "line": "" },
  "postures": { "againstCaller": "", "withCaller": "" }
}
```

- 状态机：夜 1（开场→挂断锚点）→ **白天**（地点选择图：N 地点选 dayBudget 个，进入即整屏场景切换：新 backdrop、无弹幕条、无耐心条、无 ON AIR 灯——控台 HUD 整体隐藏，替换为安静的场景眉题）→ 夜 2（回拨：姿态行→开场变体→其余场景→板/深问/原话/边界/收麦照旧）。
- 白天场景内的交互复用既有机制（委托、多点圈选、时间线拼装——本单新建该交互，见 2b）；产出 earnedItem 与路线轴记录同 v1。
- 弹幕/耐心/livePressure 在白天全部停摆（感知带宽：节目不在线）；夜 2 恢复。
- 校验：`verify:pack` 校验 overnightStructure（锚点存在、openers 覆盖全部 earnedItem、dayScenes≥3、budget<场景数）；`smoke:browser` 补隔夜路线；无该字段的案件走旧流程零回归。
- **时间线拼装交互**（新，playbook 方法 8 首落地）：`body.timelineSort: { "cards": [], "correctOrder": [], "payoffLine": "", "missLine": "" }`——拖动或点选排序，一次提交，错序不当场纠正（错误记入终局，同边界分拣族）。

## 任务 2：案 1 竖切内容（全部逐字）

### 2a 挂断改隔夜

- `hangupAnchor`：审计拍（version 含「五万多」）。
- 审计拍 version 末尾追加：

> ……主播，这个数我得想一晚上。明晚这个点，我再打进来——你等我。

- `hangupLine`：「电话轻轻挂了。没有摔，就是轻轻的。」
- `hostHoldLine`：「热线每晚都开。我们等你。」
- `dayIntro`：「第二天，下午。节目不在线，弹幕不在，城市在。你有一个下午，够去两个地方。」

### 2b 白天地点 ×3（dayBudget: 2）

**地点一：张法医的鉴定所**（kind: lab, backdropClass: day-lab）

> 白瓷灯，一切都有编号。张法医把打印出来的账单页推回来：「图我看了，像素没问题。你要我看的不是图吧——坐下，把这几页按日子排给我看。」

`timelineSort`：cards =「社保断缴」「分期开通」「8 号还入停止」「他开口借八万」；correctOrder 同序；

- `payoffLine`：「排对了。你看，先停的是钱，后开的是口。剩下的，你自己去问。」
- `missLine`：「顺序不对。没关系，晚上她自己会替你排一遍——用更疼的方式。」

earnedItemId: `timeline-clarity`。

**地点二：那家餐厅**（kind: visit, backdropClass: day-restaurant）

> 下午三点，那排靠窗位空着，桌上立着「已预订」的牌子。服务员擦着杯子：「靠窗那排？最少提前两周。……您也是听了直播来的？今天第三拨了。」你没接话。她又补了一句：「这排位子，吃的人换来换去，点的菜都差不多。」

earnedItemId: `window-seat-proof`。（服务员立场卡随本单入 `offmic-voices.md`：立场——见得多，不多嘴；遮掩——对熟客的事装忘；利益——小费和清净。）

**地点三：家**（kind: home, backdropClass: day-home）

> 她在改合同，茶凉了半杯。没抬头：「你睡了四个小时。……案子我听了。垫付赠与那套我说过了。今晚我只说一句不是律师说的话：她要是问你"该不该垫"，你不许替她答。」
> 可追一问：「为什么？」→「因为两年前，有人替观众答过一次。」

earnedItemId: `dont-answer-for-her`（解锁 2d 的第三选项，不是证据）。

### 2c 夜 2 回拨开场变体

- `timeline-clarity`：

> 「你把日子排了一遍？……我昨晚也排了。排到第三张的时候睡着了，梦里全是 8 号。」

- `window-seat-proof`：

> 「你去了？……所以"提前两周"是真的。那我现在想知道的是：他到底是提前两周为我订的，还是那排位子，他常年有。」

- `callbackFallback`：

> 「我想了一晚上，还是得把话说完——你接着问吧。」

（姿态行沿用 v1 文本：againstCaller／withCaller 两条不变。）

### 2d 新增节拍：她的那一问

夜 2 深问之前插入固定节拍——她问：

> 「主播，你说……我该不该垫？」

主播选项：

1. 「不该。这不是你的债。」→ 她：「……你和我闺蜜说得一样。可你们都不用陪他过日子。」（路线轴 caller-credibility）
2. 「该不该，先看他肯不肯把那五万多说清楚。」→ 她：「又绕回那儿了。好，那我自己去问他。」（路线轴 money-flow）
3. 【需 `dont-answer-for-her`】「这题我不替你答。今晚听到的都在这儿，答案你自己拿。」→ 她沉默很久：「……谢谢。第一次有人不替我答。」（路线轴 process-control；收麦余味加一行：「有一题，主播还给了她自己。」）

### 2e 合规自查

- 白天永不遇见对方本人；餐厅场景不出现任何可识别第三者。
- `window-seat-proof` 开场是她的自问，不指认；时间线拼装 payoff 只说顺序不说动机；8 号阶梯无损（本单无委托线触碰）。
- 新事实入账：靠窗位「已预订」牌与服务员证言入 `truthBoundary.true`（「那排靠窗位确需提前两周预订」）；「今天第三拨了」入戏剧特许台账（弹幕文化渗入现实，案 1 特许仍归 lurker——此句算餐厅场景的氛围事实，若审出超额，删这半句保 lurker）。
- 委托系统本单不迁移（保持收麦前可用），案 2-4 改制时统一并入白天。

## 验收

1. 引擎先行全套跑绿（旧流程零回归）；竖切后手动过案 1 三遍：鉴定所+餐厅／家+餐厅／零地点 fallback——确认夜 2 信息态互异、白天全程无弹幕无耐心条、2d 第三选项仅家线解锁。
2. `rg "第三拨了|排对了|不许替她答" content/` 各只命中对应场景；`rg "该不该垫" content/` 命中 2d 节拍。
3. 美术占位：三个白天 backdrop 先用现有夜景 + 日光滤镜类名占位，V2 场景包补日景 prompt 另行出单。
4. 提交：`feat: overnight structure — the day the crowd goes silent`、`feat: case1 day scenes — lab, window seats, and home`。

## 不要做的事

- 白天不加弹幕、不加任何直播 HUD 元素——安静就是设计。
- 张法医不给结论（"先停的是钱，后开的是口"是排序复述的边界，不许再进）。
- 2d 她的那一问，选项 1/2 不判对错——只有余味不同；第三选项不得写成"正确答案"腔。
- 案 2-4 零改动；v1 文档标注「已被 v2 取代」头注，不删。
