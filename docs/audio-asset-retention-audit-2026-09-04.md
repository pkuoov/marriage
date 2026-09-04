# 音频资产保留与删除决策表（2026-09-04）

本表记录盘点、运行时兜底和 2026-09-04 已执行的保留决策。真人配音本轮不制作。

执行结果：删除 6 个重复试听 OGG；删除 9 个明确淘汰 WAV；7 个正式成品母版经 SHA-256 逐一核对后归档到 `~/Documents/love-audio-archive/2026-09-04/selected-masters/`，本地工作副本保留但不再由 Git 跟踪；5 个备用母版继续留在 Git。未重写 Git 历史。

## 1. 游戏当前会不会因为缺音频而静音

不会。现有 8 个正式 BGM、2 个正式环境底噪、关键 UI/SFX 均可播放。缺位项现在有明确降级：

| 缺位项 | 当前状态 | 运行时回退 | 是否值得继续做 |
| --- | --- | --- | --- |
| `bgm.live-call-allegro` | planned | `bgm.live-call` | 有用；证词墙加速版，正式配乐交付后自动启用 |
| `bgm.pursuit` | planned | `bgm.accusation` | 有用；第二幕改口陈述的独立循环 |
| `bgm.epilogue-dawn` | planned | `bgm.recap-afterhours` | 有用但优先级低；只服务全包尾声 |
| `ambience.restaurant/cafe/teahouse` | planned | `ambience.city-afternoon` | 有用；先做咖啡厅与茶馆即可，其余可后补 |
| `ambience.studio-line/apartment-hall/office/archive-studio/document-desk` | planned | `ambience.studio-room` | 有用但不是阻塞；办公室、热线优先，其余差异较小 |
| `sfx.phone.soft-hangup` | planned | `sfx.phone.disconnect` | 可做；情绪差别明显，但不影响流程 |
| `sfx.phone.busy` | planned | `sfx.phone.disconnect` | 可做；案 3/4 挂断质感会更准 |

建议制作顺序：`pursuit` → `live-call-allegro` → `ambience.cafe` → `ambience.office` → `ambience.studio-line` → 两个电话尾音 → 其余环境音 → `epilogue-dawn`。

## 2. 配音资产（本轮不动）

| Cue | 状态 | 处理意见 |
| --- | --- | --- |
| `voice.case1.loyalty-message` | planned | 等正式配音 |
| `voice.case3.dinner-pause` | planned | 等正式配音 |
| `voice.case4.pad-message` | planned | 等正式配音 |
| `voice.case4.supplier-message` | planned | 等正式配音 |
| `voice.case2.dryer-message` | ready，但为系统合成临时母版 | 目前可播；正式配音到位后替换，不建议现在删除 |

## 3. `assets/audio/unchanged/` 的原始 WAV 决策

这些文件不进入发行包。正式成品 OGG 已在 `assets/audio/bgm/`；原始 WAV 只用于重做剪辑和母带。执行后，仅 B 组 5 个备用母版仍由 Git 跟踪。

### A. 正式成品的可复现母版（7 个，有用，先外部归档）

- `music_2_2.wav` → `bgm.live-call`
- `music_2_1.wav` → `bgm.pressure-stem`
- `music_4_3.wav` → `bgm.offair-desk`
- `music_5_2.wav` → `bgm.day-investigation`
- `music_6_2.wav` → `bgm.callback-return`
- `b8ab6093-e42b-4b0e-93b8-07c89763d584.wav` → `bgm.accusation`
- `c077d327-3120-404e-9fe0-4bd48f7841be.wav` → `bgm.recap-afterhours`

执行：已复制到 `~/Documents/love-audio-archive/2026-09-04/selected-masters/` 并逐文件核对 SHA-256；仓库内工作副本仍在，但已加入精确忽略规则并停止 Git 跟踪。

### B. 明确登记的备用母版（5 个，可选保留）

- `music_4_1.wav`：收麦调查曲回退候选
- `music_4_4.wav`：收麦调查曲备用版本
- `333133c7-66fc-4e5d-a666-72662ea6b83d.wav`：最终追问可用备选
- `bf9c2027-6025-493c-9aab-98e8f5a6d8f1.wav`：单案回看第一兜底
- `e6c431e7-db5a-43a0-8745-60b14754d136.wav`：单案回看第二兜底

执行：按产品决定保留，5 个文件继续由 Git 跟踪。

### C. 生成日志已明确淘汰（9 个，对当前游戏无用）

- `music_4_2.wav`：动态跨度过大、编排混乱
- `music_5_1.wav`：脉冲过慢，不适合白天调查
- `music_6_1.wav`：灵异感过强、结构不稳
- `971ea0f2-1825-44b9-a475-ed45435f8f0c.wav`：最终追问 v1，噪、乱
- `63715782-9244-4b36-b0ca-c53fb611d675.wav`：最终追问 v1，过响、过满
- `98386987-dbbd-4468-ae03-ff7ecebf9edb.wav`：回看 v1，节奏主体互相抢拍
- `10bff78d-d89c-4b3e-ae5a-ccb809b2666a.wav`：回看 v1，规则瞬态过密
- `5c95284e-4137-4ab4-ab9a-6fd35c66979e.wav`：回看 v3，太燥
- `85d90004-e44e-4d2b-b34d-8beacbc3d7c2.wav`：回看 v4，人工确认不可用

执行：9 个文件已删除，并从 Git 索引移除。精确忽略规则可防止同名淘汰稿再次误入版本库。删除不影响构建和运行时。

## 4. 其他大目录

| 目录 | 约体积 | 是否进入发行包 | 建议 |
| --- | ---: | --- | --- |
| `assets/audio/source/` | 270MB | 否；已忽略 | 标题曲的制作源。有用但应外部归档，不建议直接删 |
| `assets/audio/review/` | 仅余 JSON/非音频记录 | 否；已忽略 | 6 个重复试听 OGG 已删，评审数据保留 |
| `assets/audio/unchanged/` | 5 个受跟踪备用母版 + 7 个忽略的正式母版本地副本 | 否 | 正式母版另有校验归档；淘汰稿已删 |

## 5. 已执行的删除选项

1. **安全副本**：已删除 `assets/audio/review/` 下 6 个 OGG，review JSON 保留。
2. **淘汰母版**：C 组 9 个 WAV 已删除并登记为 Git 删除。
3. **正式母版**：A 组 7 个 WAV 已外部归档并停止 Git 跟踪；B 组 5 个备用母版按决定继续跟踪。
4. **Git 历史**：明确保留现状，未重写，旧 clone 体积不会因本次普通提交自动缩小。

## 6. 非音频 planned 资产

四案各有 `shaken` / `broken` 两张主来电人立绘仍标为 planned。运行时已经用现有 `pause` / `guarded` 图配合降饱和、变暗和轻微位移兜底，因此不会缺图。本轮试做先出现一张丢失透明通道的失败稿，随后得到一张透明样张；生成下一名角色时服务连续两次网络失败。为了避免仓库里只落半套且四案画风不一致，试样均未入库，8 张差分继续作为正式美术交付项。
