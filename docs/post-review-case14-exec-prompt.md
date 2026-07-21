# 案一减载 + 案四 documents · 执行 Prompt

> 执行评估（2026-07-21）：任务 1 的未知身份减载可取并已执行。任务 2 不再新建 `case4-process-chain`：第 24 批已经接入七行 `case4-payment-ledger`，而本单给出的 08-10、08-12、08-13、08-21 并非现有剧情确立的绝对日期，照抄会新增事实并重复玩法。保留现有相对时间文档，吸收“去公文腔”和“审批页 × 供应商报价单交叉追问”两项建议。

Date: 2026-07-21  
给实施 agent 整段复制下方 **§ 执行 Prompt** 即可。

---

## § 执行 Prompt

```text
你是《直播间大侦探》内容工程师。按下列两项顺序改，做完跑验收。不要改计划文档（~/.cursor/plans）。不要全案重写。

════════════════════════════════════
【总约束】
════════════════════════════════════
- 包：content/packs/steam-demo-01/
- 不指认 8 号付款人；Tony 不上麦；sitIn 仅案1
- 不倒推宸直认购已损失 / 可追回金额
- 不删 manifest.crossCasePromises 与案二 worldEcho
- 事实金额、日期、documents 行 party 不变（除非案四新建）
- 改台词后同步：shadow 字段、adjacency 锚点、qa-report、生成脚本所需索引
- 验收：npm run content:index && npm run check

════════════════════════════════════
【任务 1 · 案一未解线减载（方案 C）】
文件：cases/01-credit.json
      qa-report.md（宸直账本 / 未解表述）
      project-skills/case-scriptwriting/SKILL.md（只补优先级，见下）
可选：project-skills/detective-plot-coupling-review/SKILL.md 加一句指针

立法（写入 case-scriptwriting「Unresolved-identity budget」段末）：
- 已在 crossCasePromises 上的具名机构不占 identity budget；其未知只能是产品/兑付/可追回，禁止写成第三张「谁收了钱」的脸
- 半姓若只装饰同一日期规律（如 8 号上的王**），并入该供血线，不另计一条 who
- opener/tier-1 匿名 who 线仍 ≤2；案一标定：①8号供血线 ②尾号3301

内容改动：
1. truthBoundary.unresolved / caseClosing.unresolved / truth / followupTwist / dailyShareBody / nextStep / storyClueObject
   → 读感应是「两刃 + 一条机构回声」，不是三个猜人题：
     ① 8号供血线（含行上王**半姓，不追「哪一个王」）
     ② 尾号 3301 归属
     ③ 宸直产品/兑付/可追回（标明机构结果线）
2. 周会计、夜B opener/firstConflict 里所有「王**是谁」类追问
   → 改钉物件：「七月 8 号为什么空了 / 规律哪天断的」；保留「不替人起名字」
3. 禁止把 3301 与宸直写成同构并列句（「钱去了某处说不清」×2）
   → 3301=私人尾号；宸直=公司全称+认购备注+跨案新闻
4. 保留 r13/r14/r15、赵律师兑付纠纷补证、信用卡三桶与 deepFollowup、hangup 双轨对齐、firstConflict 键集合

不要：删宸直种子；重做 sitIn/餐厅/幕间结构。

════════════════════════════════════
【任务 2 · 案四补行级 documents】
文件：cases/04-workplace.json
同步：runtimeLengthPlan（若计 documents 数则 +1）、qa-report 相关句、adjacency（若追问文案变）

新增 documents[0]：
{
  id: "case4-process-chain",
  title: "预算群、私聊与审批页对照",
  intro: "把公开流程、私下绕开和审批截图排在同一屏。圈行，别听人把三步说成一步。",
  markLimit: 3,
  rows: 按日期升序（MM-DD），kind 全用「提醒」：
    w05 08-10 供应商报价单｜服务协调费；按老规矩返给对接人
    w01 08-12 部门助理·大群｜14:05 流程表：金额/垫付报备/对公
    w02 08-12 同事·私聊｜14:22 先别在大群问预算，来不及
    w04 08-13 报销审批页｜状态=通过；付款状态/收款账户=未显示
    w03 08-21 财务群｜供应商付款本月统一延后
  rowQuestions ≥3：
    w02 → 说来不及时财务延后发了吗？→ 没有，九天后才发
    w04 → 这页能证明钱到哪了吗？→ 不能；缺付款与收款账户
    w05 → 返款写给谁？→ 对接人=该同事；最终账户未显示
  crossQuestions ≥2：
    w01+w02 → 公开流程 vs 私聊差十七分钟能证明什么（不能证明领导知情）
    w04+w05 → 审批通过 + 返给对接人 ≠「钱在路上」
}

其它：
- 改掉玩家可见「对齐/闭环/核验」公文腔（尤其含「审批、付款、返款都没对齐」的 feedback）
  → 「审批过了，付款页没有，返款还写着对接人」
- 不新增真相：不指认老板分钱、不闭合最终账户、不改 truthBoundary 已知/未知边界
- 不重写整案夜A；不改 crossCasePromises
- 形状参考：01-credit case1-bank-flow、03-profile case3-credential-balance
- 若新正确追问升格为承重选项，补 logicContract（premiseAnchor 须来自不变台词或已展示行）

════════════════════════════════════
【验收 checklist】
════════════════════════════════════
- [ ] skill 已写 identity vs 跨案机构优先级
- [ ] 案一结案 = 两刃 + 机构回声；全仓无「王**是谁」追问（行上半姓可留）
- [ ] 宸直 r13–r15 与 worldEcho 仍在
- [ ] 案四 documents.length ≥ 1，verify-pack 真正校验且 PASS
- [ ] 案四无「没对齐」类反馈
- [ ] npm run content:index && npm run check 全绿
- [ ] 交付：改动文件列表 + 每项 1 句 before/after
```

---

## 不做（本单范围外）

- 四案开场模板错开、纪念日情绪句回 `version`（可另开小单）
- 冻结/拆分 skill 大段人味法条
- 砍宸直跨案线（方案 A）
