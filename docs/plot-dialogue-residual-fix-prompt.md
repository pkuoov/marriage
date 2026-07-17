# 剧情 / 台本 / 过场 · 残留修改建议 List Prompt

Date: 2026-07-17

**依据：** 大改后现网复审（2026-07-17）——结构已换代，AI 味从模板退到局部；本单只做 **list 驱动的残留抛光**，不是二次全案重写。

**相关文档 / 产物：**

| 链接 | 用途 |
|------|------|
| [`docs/dialogue-deai-pass-prompt.md`](dialogue-deai-pass-prompt.md) | 去 AI 味主包（D1/D2/D3） |
| [`docs/dialogue-voice-audit-pass-1.md`](dialogue-voice-audit-pass-1.md) | 声口弧 · PACK-010 |
| [`docs/dialogue-voice-audit-pass-2.md`](dialogue-voice-audit-pass-2.md) | speakerProfile / cast 接线 |
| [`docs/dialogue-voice-audit-pass-3.md`](dialogue-voice-audit-pass-3.md) | PACK-011 回归 |
| [`docs/case12-drama-fix-prompt.md`](case12-drama-fix-prompt.md) | 案1/2 戏剧接线（已落地，勿重做） |
| [`docs/case34-drama-fix-prompt.md`](case34-drama-fix-prompt.md) | 案3/4 戏剧接线（已落地，勿重做） |
| Canvas：`plot-dialogue-rereview-2026-07-17` | 八维复审 + Top 杀伤清单 |

**目标文件（仅台词 / 口播字段）：**

```
content/packs/steam-demo-01/cases/01-credit.json
content/packs/steam-demo-01/cases/02-tony.json
content/packs/steam-demo-01/cases/03-profile.json
content/packs/steam-demo-01/cases/04-workplace.json
```

---

## 1. 用法

| Prompt | 范围 | 何时用 |
|--------|------|--------|
| **L**（主） | 按 §3 清单 1→8 逐项改 | **默认执行** |
| **L1** | 只案1硬挂断 | 只想先修过场最弱点 |
| **L2** | 只清「只能说明」+ 测验题 hostLine + hostNote | 跨案小刀、不动挂断/夜A大段 |

**原则：**

1. **一份主 Prompt L**，按 **玩家听感杀伤排序**（§3）推进；可选只跑 L1 / L2。
2. **不要重做结构**：`firstConflict` 键、`interludeEarnedItemMap`、幕间 orphan、`continueLabel→白天`、挂断双轨对齐形状——这些已在 case12/34 落地。
3. **不要编辑** `~/.cursor/plans` 或任何计划文档；只改上表四案 JSON 的台词相关字段。
4. 事实、金额、日期、角色行为、`earnedItem` id、`truthBoundary`、SSO、声口指纹弧 **保持不变**。

## 2. 基线勿动

以下已验收，本单 **禁止** 为了「更好听」而回滚或扩结构：

- **Overnight spine：** `nightA → interlude1 → day2 → nightB`
- **带回律：** 每条可达 `callbackOpeners` 已有独立 `firstConflict`；幕间授予已进 `interludeEarnedItemMap`
- **边界：** `truthBoundary` / SSO；`sitIn` 仅案1；Tony **不上麦**
- **声口弧：** PACK-010 / PACK-011（`dialogue-voice-audit-pass-1/2/3`）——不删阶段、不拆 fingerprint 字段
- **挂断双轨字节对齐形状保留：**
  `nightStructure.hangup.stageDirection === overnightStructure.hangupLine`
  `nightStructure.hangup.hostLine === overnightStructure.hostHoldLine`
  （案1 要改硬时，**两处同步改文案**，形状不变）

---

## 3. 修改建议 List（给人看的清单，编号）

按复审 **玩家听感杀伤** 从高到低：

1. **案1 soft-hangup + hostHoldLine「我们等你」→ 加硬**
   现网：`overnightStructure.hostHoldLine` / `nightStructure.hangup.hostLine` =「热线每晚都开。我们等你。」；`hangupLine`/`stageDirection` 偏「轻轻断了」。
   **目标：** 钉物件（五万空着 / 去核白天），仍可保留 soft 音效 `audioCueId`；来电人 `hangup.line` 可微调，但须仍指向明晚回拨 + 白天去核。

2. **夜A 高密度口述段 · 打散句法（非改事实）**
   - `01-credit` · `sceneVersions` id `credit-eight-wan-bill`
   - `02-tony` · `sceneVersions` id `tony-emotion-to-sales`
   - `03-profile` · `openingDialogue[2]`（材料汇报包）+ `sceneVersions` id `profile-income-and-card`
   - `04-workplace` · `sceneVersions` id `work-public-process`

3. **清来电人 / 问答「只能说明」→ 感知句**
   已知现网命中（改同类，勿只改一处）：
   - `01` `delegation.outcomes.zhao-lawyer.text`
   - `02` `investigationHooks[…].options[…].feedback`（「被哄过只能说明…」）
   - `03` `profile-income-and-card.version`
   - `04` `work-public-process` 相关 `questionOptions[].answer`

4. **清 host `firstConflict` 测验题 → 施压物件问**
   - `03` `overnightStructure.callbackOpeners.表姐门口口供.firstConflict.hostLine`：「‘一起挑的’这句，碰掉了你原先哪个说法？」
   - `04` `overnightStructure.callbackOpeners.垫款回放.firstConflict.hostLine`：「你回‘我来扛’时，心里接的是活，还是六万八？」
   （同案其他含「六万八」的 hostLine 若仍像二选一考题，一并改成物件施压，勿改成抽象价值判断。）

5. **清 playback `hostNote` 导演注释感**
   - `02` `nightStructure.interlude.actions[…].script.hostNote`（dryer / 吹风机回放说明）
   - `03` `nightStructure.interlude.actions[…].script.hostNote`（dinner pause / 冷场）
   → 改成 **一句场上可说的话**，或删空（若运行时允许缺省；以现网 schema 为准，勿新增字段）。

6. **案1 `snapshotEcho` / contradiction「一边…一边」工整对仗**
   尤其 `overnightStructure.snapshotEcho.both-performed`：「一边刷卡，一边订座」——打散对仗，保留事实负载。

7. **02 emotion 清单挤牙膏**
   `tony-emotion-to-sales.version` 内「转活动、带朋友、要不要办年卡」——拆成卡壳 / 补刀 / 后悔漏嘴，勿一次枚举三件。

8. **（可选）案3 opener 池仍偏薄**
   仅当听感仍不够再加 opener；**本轮不强制扩结构**（不加 earned、不改 map 键名）。

---

## 4. 完整 Prompt L（工程师按 list 逐项改）

复制以下整块到执行 agent：

```text
你是本仓库的剧情/台本残留抛光执行员。只做 Prompt L（list 驱动）。不要改 ~/.cursor/plans、blueprint、或无关系统代码。

## 硬约束
1. 只改台词相关字段：sceneVersions.version / questionOptions / openingDialogue.text、
   overnightStructure.{hangupLine,hostHoldLine,snapshotEcho,callbackOpeners.*.line|firstConflict.*}、
   nightStructure.hangup.{line,hostLine,stageDirection}、interlude actions 的 hostNote/advisorLine、
   delegation / investigationHooks 里玩家可见的 text/answer/feedback。
2. 禁止改：earnedItem id、firstConflict 的 key 名、interludeEarnedItemMap 结构、continueLabel 语义形状、
   truthBoundary、SSO、sitIn 范围（仅案1）、Tony 上麦、PACK-010/011 声口弧字段、过渡字段扩容
   （不要新增 transition / stage 字段；不要扩 overnight spine）。
3. 挂断双轨必须保持对齐：
   nightStructure.hangup.stageDirection === overnightStructure.hangupLine
   nightStructure.hangup.hostLine === overnightStructure.hostHoldLine
4. 事实与 ids 不变：金额（八万/一万二/五万/六万八）、日期时间点（如 14:05）、谁做了什么、证件/材料名。
5. De-AI 规则（必须遵守）：
   - 句长参差：短句打断中句；禁止三句同长排比卸完信息
   - 感知不结论：写看见/听见/停顿/没回，不替证据下定义
   - 禁「只能说明」及近亲说明书连接（要看/回拨先问 连用）
   - hostLine 禁止测验题（「哪个说法」「还是」二选一考正确读法）→ 改成施压物件问
   - 禁止 opener 模板复燃：「你……了？……所以……」「那我现在想知道的是」
   - 禁止工整「一边A，一边B」总结对仗（snapshotEcho / contradiction 玩家可见句尤甚）
6. 按杀伤排序改完 §清单 1→7；第 8 项案3 opener 池本轮跳过（除非用户明示加）。

## 目标文件
content/packs/steam-demo-01/cases/01-credit.json
content/packs/steam-demo-01/cases/02-tony.json
content/packs/steam-demo-01/cases/03-profile.json
content/packs/steam-demo-01/cases/04-workplace.json

## List（逐项；每项改完再下一项）

### L-1 案1硬挂断（过场最弱）
文件：01-credit.json
字段：
- overnightStructure.hangupLine
- overnightStructure.hostHoldLine
- nightStructure.hangup.stageDirection / hostLine / line（三处与 overnight 对齐规则）
现网坏例 hostHoldLine：「热线每晚都开。我们等你。」
目标：加硬——钉「五万空着」或「白天去核」类物件压力；可保留 soft 音效 audioCueId。
来电人 hangup.line 仍须指向明晚回拨，不要改成永久失踪。

### L-2 夜A 口述打散句法（非改事实）
- 01 sceneVersions id=credit-eight-wan-bill（账单清点仍偏汇报包）
- 02 sceneVersions id=tony-emotion-to-sales（见 L-7 清单；此处先打散句长）
- 03 openingDialogue[2].text（「四次…三张图…存款证明」材料包）
  + sceneVersions id=profile-income-and-card（与 L-3 的「只能说明」一并处理）
- 04 sceneVersions id=work-public-process（14:05 流程口述）
做法：同一事实拆成看见→停顿→补一句；允许吞字/改口；禁止新增剧情事实。

### L-3 清「只能说明」→ 感知句
至少处理现网命中：
- 01 delegation.outcomes.zhao-lawyer.text
- 02 investigationHooks 内含「只能说明」的 feedback
- 03 profile-income-and-card.version
- 04 work-public-process 相关 questionOptions[].answer
全库再扫一遍四案 JSON，清掉剩余「只能说明」。

### L-4 清 firstConflict 测验题
- 03 overnightStructure.callbackOpeners.表姐门口口供.firstConflict.hostLine
  坏例：「‘一起挑的’这句，碰掉了你原先哪个说法？」
- 04 overnightStructure.callbackOpeners.垫款回放.firstConflict.hostLine
  坏例：「你回‘我来扛’时，心里接的是活，还是六万八？」
改成施压物件问（门口原话 / 垫款回放里那句「我来扛」+ 金额钉），保留 firstConflict.callerLine 事实负载；可微调 callerLine 口吻但不改认份事实。
若同案其他 opener.hostLine 仍呈「A还是B」考题形，一并改。

### L-5 清 playback hostNote 导演注释
- 02 nightStructure.interlude 里 dryer/吹风机 相关 action.script.hostNote
  现网偏：「第一夜只知道…回拨时只问她…」（导演手册）
- 03 nightStructure.interlude 里 dinner pause/冷场 相关 action.script.hostNote
  现网偏：「冷场能证明…不能替…作答。」
→ 改成一句主持人或场上可说出口的话；或按 schema 删除该键（不要改成更长说明书）。

### L-6 案1 snapshotEcho / 对仗
- overnightStructure.snapshotEcho.both-performed
  坏例含：「一边刷卡，一边订座」
打散对仗；保留「刷卡 vs 订座」事实差。顺手扫 01 玩家可见 contradiction/feedback 里同类工整对仗。

### L-7 02 emotion 清单挤牙膏
tony-emotion-to-sales.version 内「转活动、带朋友、要不要办年卡」：
不要一次枚举三件；改成先漏一件、再被迫补一件，第三件可留问答里再钉。

### L-8（本轮跳过）
案3 opener 池扩容——不强制。

## 验收（必须）
1. 清单每项给 before → after 各 1 行（可贴原句节选）。
2. 声明：无新增剧情事实；ids / firstConflict keys / map / truthBoundary 未改坏；挂断双轨仍对齐。
3. 命令：
   npm run content:index
   npm run check
   npm run verify:pack
   若存在 dialogue-report check：npm run content:dialogue-report:check
4. 不要扩张 transition / 过场新字段；不要重做 firstConflict 覆盖工程。

按 L-1 → L-7 开始。
```

---

## 5. 可选窄 Prompt

### L1 · 只案1挂断

```text
你是残留抛光执行员。只做 Prompt L1：案1硬挂断。不要改计划文档。

文件：content/packs/steam-demo-01/cases/01-credit.json

只改：
- overnightStructure.hangupLine
- overnightStructure.hostHoldLine
- nightStructure.hangup.stageDirection / hostLine / line

规则：
- stageDirection === hangupLine；hostLine === hostHoldLine（改完后必须仍相等）
- 去掉「我们等你」温收；钉物件：五万空着 / 白天去核
- 可保留 soft audioCueId
- 不改 sceneVersions、openers、firstConflict、map

验收：before/after 各 1 行 ×3 字段；npm run content:index && npm run check && npm run verify:pack
```

### L2 · 只清「只能说明」+ 测验题 + hostNote（跨案小刀）

```text
你是残留抛光执行员。只做 Prompt L2：跨案小刀。不要改计划文档、挂断、夜A大段结构。

文件：
content/packs/steam-demo-01/cases/01-credit.json
content/packs/steam-demo-01/cases/02-tony.json
content/packs/steam-demo-01/cases/03-profile.json
content/packs/steam-demo-01/cases/04-workplace.json

任务：
1) 全四案删除玩家可见「只能说明」（delegation / version / answer / feedback 等）→ 感知句。
2) 改测验题 hostLine：
   - 03 callbackOpeners.表姐门口口供.firstConflict.hostLine（碰掉哪个说法）
   - 04 callbackOpeners.垫款回放.firstConflict.hostLine（活还是六万八）
   → 施压物件问；保留 keys 与事实。
3) 清 hostNote 导演注释：
   - 02 interlude dryer/吹风机 hostNote
   - 03 interlude dinner pause/冷场 hostNote
   → 一句场上可说的话或删键。

禁止：改 hangup/hostHoldLine；扩 opener；改 earnedItem / map；改 PACK 声口字段。

验收：每任务 before/after 1 行；npm run content:index && npm run check && npm run verify:pack
；若有则 npm run content:dialogue-report:check
```

---

## 6. 验收 checklist

- [ ] §3 清单 1–7 均有 before/after 各 1 行（或声明本轮用 L1/L2 子集）
- [ ] 案1 挂断不再「我们等你」温收；双轨 `hangupLine`/`hostHoldLine` 仍对齐
- [ ] 四案无玩家可见「只能说明」
- [ ] `表姐门口口供` / `垫款回放` 的 `firstConflict.hostLine` 不再像测验题
- [ ] 02/03 playback `hostNote` 无导演手册口吻
- [ ] 01 `snapshotEcho.both-performed` 无工整「一边…一边」
- [ ] `tony-emotion-to-sales` 无「转活动、带朋友、办年卡」三连挤牙膏
- [ ] 未改 ids / firstConflict keys / interludeEarnedItemMap / truthBoundary / Tony 上麦 / sitIn 范围
- [ ] 未编辑 `~/.cursor/plans`
- [ ] `npm run content:index` 成功
- [ ] `npm run check` 全绿
- [ ] `npm run verify:pack` 通过
- [ ] （若适用）`npm run content:dialogue-report:check` 通过

---

相关规则见：[`project-skills/case-scriptwriting/SKILL.md`](../project-skills/case-scriptwriting/SKILL.md) → Language Rules (De-AI)；戏剧接线基线见 case12/34 fix prompts。
