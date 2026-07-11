# 第 11 批收尾执行单（pass 11 closeout）

你是本仓库的实施工程师。第 11 批扩容内容已在工作区（四案 7 场 3 板、立场快照、六个新麦外声音），验收已过，本单做收尾：三处修正、两条守则、圣经补卡、提交切片。台词与文本逐字使用。

## 任务 1：案 3 source 分类修正

`respondent-note` 专属于**对方**的单向留言（每案至多一条、必带可抓剪辑、不可追问）。介绍人与表姐是第三方，改用独立 source：

- `03-profile.json` 「介绍人的两边话」hook：`source` 改为 `introducer-note`。
- `03-profile.json` 「表姐的资料说明」hook：`source` 改为 `cousin-note`。
- 引擎/渲染的 source 名牌映射同步（与 `store-manager-note` / `leader-note` / `department-assistant` 同一套机制）；`verify:pack` 若校验 source 枚举则加入这两个值，并补一条校验：`respondent-note` 每案至多一条且其发件人只能是本案对方。

## 任务 2：麦外声音圣经卡（`content/characters/offmic-voices.md`，逐字新建）

开头一句：麦外声音开口前先立卡；三行卡＝立场／遮掩／利益，附一条知识边界。与台词冲突处以台词为准并回改卡。

- **男方前同事（案 1）**：立场：欠他人情，话到为止。遮掩：钱的去向与每月 8 号，知而不言。利益：人情两讫，不卷入。知识边界：只知他失业前的阔绰与旧账，不知他与咨询者的现在。
- **店长（案 2）**：立场：话术培训是正当经营，业绩压力不装。遮掩：把私加列的失察说成"盯不过来"。利益：店的口碑与指标。知识边界：知店内制度与他的业绩，不知他的私人聊天。
- **介绍人（案 3）**：立场：两头做人是行规。遮掩：各报高价的具体幅度。利益：谢媒人情与撮合率。知识边界：知两家开出的条件与自己说过的话，不知两人私下相处。
- **男方表姐（案 3）**：立场：护短，家里催婚是真的。遮掩：资料包装谁主导，只说"一起整理"。利益：家族体面，别把她扯进去。知识边界：知资料怎么整理的，不知收入构成与 MBA 学费来源（这是她的拒答，也是本案红线）。
- **部门助理（案 4）**：立场：按模板办事。遮掩：不判断私聊，等于不站队的自保。利益：不担责。知识边界：只知公开群流程与样本，不知私聊与钱的去向。
- **领导（案 4）**：立场：只要结果和数据。遮掩：对"老规矩"选择性眼盲。利益：季度复盘数据与部门成绩。知识边界：知复盘与署名，垫款金额、付款账户、返点归属均不在其批注视野内（设计如此，永不坐实）。

## 任务 3：qa-report 两条守则（逐字追加）

- **8 号收口守则**：前同事那句「每月 8 号那笔是谁，我不说，也别问我」是本线的收窄极限。今后任何声音、材料、弹幕、终局文案不得再进一步收窄付款人的形状；三读法（拆东墙／多线／化债）必须继续全部活着。
- **"老规矩"设计性歧义备案**：领导批注中的"流程按老规矩补齐"与供应商的"返点老规矩"构成一词两义，属设计性歧义。任何表面（弹幕、顾问、回拨、终局、分享卡）不得替玩家解决该词归属；有形未知「"老规矩"从哪年开始、还有谁拿过」与之绑定。

## 任务 4：自查两处（不改则报告）

- 案 1 前同事 hook 中「每月 8 号那笔是谁」诱饵选项的 feedback：确认其只挡回、不逗弄不暗示（若有"接近了"之类措辞，替换为「他把话停在这儿，是留给他自己的体面。」）。
- 立场快照四案的 kicker/note 文案：现行"中段立场快照／不判分"走规则清楚路线，合规保留；若要更像节目可将 kicker 换「先站个位」，二选一后四案统一。

## 验收与提交

1. 每任务后 `npm run content:index && npm run check`；最后 `npm run verify:pack -- steam-demo-01`、`npm run smoke:browser`（快照交互与新 hook 的回放断言补齐）。
2. `rg "respondent-note" content/` 只命中案 2、案 4 的对方留言；`rg "introducer-note|cousin-note" content/` 命中案 3 两处。
3. 提交切片（扩容内容与收尾一并按案切）：
   - `feat: act structure, stance snapshot, and mid-call boards engine`（引擎部分）
   - `feat: case4 expansion — five voices and the misjudgment beat`
   - `feat: case2 expansion — store floor and the manager's line`
   - `feat: case3 expansion — the introduction chain closes in grey`
   - `feat: case1 expansion — dinner night, unboxing night, the old colleague`
   - `chore: offmic voice cards, source taxonomy, and narrative guards`（本单任务 1-4）
4. 提交完成后，人工按 `docs/playtest-report-template.md` 完整打一遍**案 4**（误判拍新机制：弹幕中段倒向指责咨询者的段落需要真人手感），报告归档后再决定案 1-3 的 playtest 顺序。

## 不要做的事

- 不改六个声音的正文台词（它们已过验收；卡与台词冲突时改卡）。
- 不给 8 号线加任何新信息；不解决"老规矩"歧义。
- 不动快照的判定逻辑（记录不判分是设计底线）。
