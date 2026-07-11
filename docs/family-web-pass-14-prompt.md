# 第 14 批·顾问关系网执行单（family web pass 14）

你是本仓库的实施工程师。本单把主播与顾问团织成固定关系网：**赵律师=主播的对象；张法医=哥们二十年；周会计=张法医的另一半；小林老师=网外的行业旧识（不对称是设计）**。目的：固定形象＋家常语感——帮忙和提醒因为是家人所以不突兀。

执行顺序：第 13 批（`docs/theatrical-pass-13-prompt.md`）先行；本单任务 1 的周会计行**覆盖**其任务 5 的产物。台词逐字使用。主播性别始终不指定——一律用"对象/另一半"措辞。

## 任务 1：圣经关系线重写（`content/characters/advisors.md`，逐行替换）

- 赵律师：

> 与主播的账：冤案那期，她代理的就是被钉死的当事人。骂了主播整整一年；第七次上门道歉时，她说"第八次改请吃饭吧"。现在是主播的对象——老观众都叫她"赵姐"，没人敢当面问。深夜秒回从来不是职业习惯。

- 张法医：

> 与主播的账：哥们二十年。规矩没变过：哥们归哥们，发票归发票——送检从没免过一次单。他说："他的账我认，就是这么认下的。"

- 周会计：

> 与主播的账：张法医的另一半。冤案之后主播想找人复核那张账单，张说"找我对象看看"——把真相递到主播面前、砸碎他世界的，是这家人一起。她评价主播只有一句："那孩子算不清账，但认账。"三人那张饭桌，是主播唯一不谈节目的地方。

- 小林老师：关系线不动，卡尾追加一句：

> 网外之人：她不在主播的家人圈里——不对称是设计，不是疏漏。

- `host.md` 追加一行：

> 关系网：对象是赵律师（冤案的另一端），哥们是张法医，张的另一半周会计管着他唯一不谈节目的饭桌。他的家人都是那晚之后攒下的。

## 任务 2：家常腔选择性改写（专业核心一字不动，只动出场白与收尾）

- 案 1 赵律师 `advisorNotes[0].text` 整段替换：

> 以对象身份说的，不算法律意见，算意见：这笔要是真转了，往后想按垫付要回来，就得留痕——转账备注写清楚用途，让对方补张欠条。口说的不算，落纸的算数。睡前把手机放远点。

（`appearsNowBecause` 替换为：「后台转来一条，备注只写了个"赵"。」）

- 案 4 周会计 `advisorNotes[0].appearsNowBecause` 替换为：

> 张法医转来的，只加了一句：我对象让我原话带到。

（text 一字不动。）

- 案 3 张法医委托 strong 回单开头插入一句：

> 哥们的忙照帮，检测费照记。

（其余委托回单一律不动。）

- `comments.json` `commentSeeds` 追加一条（主播史池，半知半觉梗）：

> "赵姐今晚也在听吧。"

## 任务 3：skill 规则（`case-scriptwriting`「The host is a person」节末尾追加，逐字）

> - The family web is canon: 赵律师 is the host's partner (the far end of the wrongful-verdict episode — she was that man's lawyer), 张法医 is his oldest friend (哥们归哥们，发票归发票), 周会计 is 张's partner and the keeper of the one dinner table where the show is never discussed; 小林老师 stays outside the web by design. Host gender stays unspecified — write 对象/另一半, never gendered terms for the host.
> - Domestic register enters only openers and closing half-lines; the professional core of any advice stays word-for-word professional. At most one family/couple beat per case. Relationships never bend facts or verdicts — 赵's disclaimers got stricter, not softer, when she became family.
> - The room half-knows: regulars dare to type "赵姐" and never dare to ask; on-air copy never explains why she always answers. The apology-turned-dinner origin is bible-only.

## 任务 4：qa-report 两条守则（逐字追加）

- **关系披露阶梯**：骂了一年、第七次道歉、第八次改饭——只存在于圣经；正片与终局至多露到"赵姐"级别的半知半觉；任何表面不得解释赵律师为什么总在。
- **家常配额**：每案家人/情侣梗至多一次；家常腔永不进入委托回单与顾问信的专业核心段。

## 验收

1. 每任务后 `npm run content:index && npm run check`；最后 `verify:pack -- steam-demo-01`＋`smoke:browser`（案 1 顾问信文本变更同步断言）。
2. `rg "赵姐" content/` 只命中 commentSeeds 与 advisors.md；`rg "对象身份" content/` 只命中案 1 顾问信。
3. `rg "先生|女士|男朋友|女朋友" content/characters/host.md project-skills/` 中不得出现指向主播性别的措辞（对来电人的既有称谓不在此列）。
4. 提交：`feat: the family web — partner, brothers, and the dinner table`。

## 不要做的事

- 不动 16 条委托回单的专业核心；不动小林老师的任何台词。
- 不给张法医与周会计写情侣互动小剧场——他们的关系只通过转发备注和圣经存在。
- 不解释"赵姐"，不确认"赵姐"，永远半知半觉。
- 冤案事实层零新增：关系网改变的是温度，不是信息。
