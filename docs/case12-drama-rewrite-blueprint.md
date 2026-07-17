# 案1 / 案2：戏剧性重写蓝图

日期：2026-07-15  
性质：评估结论 + 可执行规格（由已批准 plan 展开，可实施）。  
关联：

- [multi-scene-rashomon-design.md](multi-scene-rashomon-design.md)
- [offline-rashomon-pass-19-fix-prompt.md](offline-rashomon-pass-19-fix-prompt.md)
- [two-call-night-design.md](two-call-night-design.md)
- project-skills/detective-plot-coupling-review/SKILL.md
- project-skills/case-scriptwriting/SKILL.md


# 案1/案2：评估 + 戏剧性重写（只留主线）

## 评估结论（本轮先立住）

两案 **谜底与 `truthBoundary` 够硬**；弱在 **戏剧载体**：夜A 像高质量单口，NPC 多为事后解说，白天常是「拿一句 opener 的明信片」。非线性被抹平：选择多是「说什么」而非「做什么」；夜B 常同一 confrontation 链，不因 `earnedItems` 变第一冲突。

```mermaid
flowchart LR
  nightA[夜A审人]
  interlude[幕间做什么]
  dayCity[白天地点choice]
  nightB[夜B按cut对账]
  nightA --> interlude --> dayCity --> nightB
```

**必须保留的骨架**

| 案 | 骨架（不可砍） |
| --- | --- |
| 案1 | 垫八万 / 断缴早于借钱 / 可见消费&lt;3万缺口 / 订座会员号与设备受益灰区 / sitIn 旁听半句 / **不指认8号付款人** / ON AIR 单连线 / 包级唯一 sitIn |
| 案2 | 发错表+「下一次推进」私加列 / 培训模板无该列 / 「自己人」+插号免单六折灰区 / **observe only（无 sitIn、Tony 不上麦）** / 确认型多线误判 / `unknown`（真心、群、几张表） |

**现状硬伤（证据级）**

- 案1：无真正幕间「做什么」；餐厅无 choice；sitIn 两岔同 `旁听笔记` 信息同态；周会计偏教具；赵律师只在收麦说教。
- 案2：嫂子/年卡/吹风机多在回忆；双轨 hangup（`nightStructure` vs `overnightStructure`）；幕间与白天带回池并行；朋友工作室/document 缺 consequential choice。

合规源：[`detective-plot-coupling-review/SKILL.md`](project-skills/detective-plot-coupling-review/SKILL.md) Non-linearity、[`multi-scene-rashomon-design.md`](docs/multi-scene-rashomon-design.md)、[`two-call-night-design.md`](docs/two-call-night-design.md)、[`case-scriptwriting`](project-skills/case-scriptwriting/SKILL.md) Multi-Scene / Theatrical License。

---

## 重写原则（拍板）

1. **主链 ledger 先锁再写台词**：10 槽 + 误导层感性 / 承重层（案1=时间；案2=材料边界）不变。
2. **回忆→当场**：每案至少 2 拍从 `sceneVersions` 口述抽成 live 或 day 场（NPC want + refuse/conflict）。
3. **非线性三层**：幕间选做什么 → 白天地点+choice 改 `earnedItem`/`routeTone` → 夜B **按 earnedItem 换第一冲突拍**（不只换 opener 文案）。
4. **唯一 opener 源**：`overnightStructure.callbackOpeners` ∩ `earnedItems`；案2 统一 hangup 文案；幕间 inventory 同 id 映射或删。
5. **声口分化**：案1=体面/怕丢脸；案2=自己人/怕被当客户——开场与 hangup 指纹可辨。
6. **合理戏剧**：社会伤害与拒答、撞框架；不 Melodrama 罪案片；禁 `stockAiForbiddenCopyRegex`。

---

## 交付物 0：评估+蓝图文档

新建 [`docs/case12-drama-rewrite-blueprint.md`](docs/case12-drama-rewrite-blueprint.md)：写入上表评估、完整 beat map、分支压力点、NPC 舞台表、合规清单（本稿 Plan 的 D/E 节展开为可执行规格）。回链 pass-19 / multi-scene。

---

## 案1 重写规格（实施）

文件：[`01-credit.json`](content/packs/steam-demo-01/cases/01-credit.json)（+ 必要时 [`src/app.js`](src/app.js) 仅当夜B 需按 opener 换 scene 入口——优先用现有 opener + 夜B 首拍台词分支，避免大改引擎）。

### 结构节奏

```text
夜A（4拍，缩短口述）→ 幕间 budget1（三选一：赵周框架 / 回闺蜜私信 / 送鉴定）
→ 白天 budget2/≥3（周refuse+timeline · 餐厅对质choice · sitIn · 流水document）
→ 夜B 首冲突随 earnedItem 变
```

### 当场化

- **餐厅**：对前台追会员号 vs 追「不专给一对」→ **两个不同 `earnedItemId`**（互斥锋利度）。
- **周会计**：refuse「无原件别猜王\*\*」；timeline 错序 → 夜B 她更 defensive（routeTone）。
- **赵律师**：从 `postHangupContact` 说教改为幕间 **与周框架冲突抉择**（性质 vs 路径）。
- **sitIn**：保留；choice 拉开 **subTone/夜B 她先护订座灯还是护五万拒答**（不可两岔完全同态）。
- **设备开箱**：夜B 用共享屏幕/当场找灯，替代纯回忆。
- 夜A **不把五万对质讲完**——缺口挂断；五万细节留给 sitIn/夜B。

### 非线性锁

| 压力点 | 代价 |
| --- | --- |
| 幕间赵框架 vs 周框架 | 夜B 第一问锁「性质」或「路径」；另一方今夜不问 |
| 餐厅两 earnedItem | 牺牲另一条 callback 锋利度 |
| sitIn subTone | 她先护哪句不同 |

不改：`truthBoundary.unknown`、不指认 8 号、单连线、quote-pick 源。

---

## 案2 重写规格（实施）

文件：[`02-tony.json`](content/packs/steam-demo-01/cases/02-tony.json)

### 结构节奏

```text
夜A：专属话术 → 情绪接销售 → 培训板fed误判「行业就这样」→ 当场念表见「稳情绪」→ 统一 hangup
→ 幕间×1（听吹风机 / 女客私信 / 送鉴定 互斥，唯一 map 进 earnedItems）
→ 白天×2：observe加长（称呼vs办卡动作）· 朋友工作室choice · document圈注
→ 夜B：opener → 用白天cut追老板娘/年卡 → 推进列+女客立场 → quote-pick
```

### 当场化 / NPC

- **observe**：隔窗同屏「自己人」称呼 + 办卡动作；choice 记称呼 vs 记办卡 → 不同夜B 第一打点。
- **店长**：白天 doorstep 拒答半句；删/降级与 day 重复的幕间 call-manager。
- **朋友工作室**：choice「先拆标准表」vs「先点六折」→ 不同 earnedItem。
- **女客**：replyChoices 拉群 vs 止损 **锁** 夜B posture / 是否 tease 进群（仍 `unknown`）。
- **吹风机**：幕间与女客私信互斥；禁止「存在但她说不想听」永久推迟发现权。

### 接线

- 统一 hangup 为一条玩家可见文案。
- `interludeEarnedItemMap` 保证幕间产出进 overnight opener；删双轨无效 opener。

不改：无 sitIn、Tony 不上麦、模板真+私加列真、灰区自认好处。

---

## 实施顺序与验收

1. 写 blueprint 文档（评估+规格）  
2. 改案1 JSON（幕间+餐厅/周/sitIn/夜B 分支）  
3. 改案2 JSON（统一 hangup+observe/朋友/女客/幕间互斥）  
4. 引擎仅最小补丁（若幕间→earnedItems 仍断）  
5. `npm run content:index && npm run check && npm run verify:pack -- steam-demo-01`  
6. 烟测：各案两条不同白天路径 → 夜B 第一冲突可辨  

**本轮不做**：案3/4 大改；V2 立绘；第二次 sitIn；写穿 8 号付款人。


## 合规清单（实施验收）

- 案1 完整 nightStructure；overnight 存在时无第二套 callbackOpeners
- hangup hostLine/stageDirection 与 overnight 对齐
- 幕间 actions>=3 且至少 1 npcVerb
- advisorLine 不触发 DELEGATION_FORBIDDEN；全文不触发 stockAiForbiddenCopyRegex
- dayScene 均有 earnedItemId 或每 choice 分支 grantsEarnedItemId；opener 齐全
- interludeEarnedItemMap 源合法、目标 opener 存在
- dayBudget < dayScenes.length；案1 hangupAnchor 五万多命中
- 案1 唯一 sitIn；案2 无 sitIn；delegation.moment = interlude:send-appraisal
- 验收：npm run content:index && npm run check && npm run verify:pack -- steam-demo-01

## 落地字段速查（本轮已实施目标）

### 案1 `nightStructure`

- `segment1SceneIndexes: [0,1,2,3,4]` / `segment2SceneIndexes: [5,6]`
- hangup `afterSceneIndex: 4`；`hostLine`/`stageDirection` 对齐 overnight
- 幕间三行动：`send-appraisal` / `zhao-zhou-frame`(conflict) / `friend-dm-early`
- map：delegation-return→顾问回单；frame-zhao→性质框架；frame-zhou→路径框架；friend-dm-seen→闺蜜删掉的那条评论
- 白天：周 refuse+timeline；餐厅两 earned；sitIn 两 earned；流水圈注
- 删除 `postHangupContact`；`delegation.moment=interlude:send-appraisal`

### 案2

- hangup 双轨文案对齐
- 幕间删 call-manager / manager-note；补 `shop-sync-interrupt`(interrupt, cost 0)
- 白天四地点 budget 2：observe / 工作室两 earned / 店长门口拒答 / 培训页圈注
- map：training-no-column→培训模板说明；不再映射 manager-note-seen
