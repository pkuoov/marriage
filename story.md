---
title: Midnight Hotline: Livestream Detective｜深夜热线：直播间侦探
schema-version: 2
genre: 现实悬疑互动剧
sub-genre: 直播热线推理／社会议题群像
setting-era: 当代中国城市
status: revising
themes:
  - 身份与代价
  - 事实边界
  - 体面与责任
  - 关系中的成本转嫁
pov: third-person-limited／玩家代理主播
tense: present
---

# Midnight Hotline: Livestream Detective｜深夜热线：直播间侦探

## Synopsis

失业法务林旭阳经营着一档不温不火的匿名情感热线。四通看似独立的来电，把账单、排班表、相亲资料和审批截图逐一推到麦前；玩家必须在直播压力下分开事实与猜测，并看清每个好听身份最终把成本和责任推给了谁。

## Designing Principle

每一幕从一个听起来正当的词开始，再追问这个词后面接了什么实际要求：

| 幕 | 题眼 | 戏剧物件 | 要求落点 | 结构功能 |
|---|---|---|---|---|
| 第一幕 | 体面 | 信用卡账单与流水 | 让伴侣先替债务和消费缺口买单 | 建立“接住情绪，不替人接账”的判断方法 |
| 第二幕 | 自己人 | 排班表、录音与投店回单 | 把亲密感换成办卡、带客和投资 | 把关系话术推进到资源转化 |
| 第三幕 | 条件 | 学历、存款与收入资料图 | 双方都修剪材料、筛选对方 | 反转玩家舒服的单方审判位置 |
| 第四幕 | 主责 | 审批截图、垫款与返款路径 | 把机会、付款入口和责任拆给不同的人 | 把判断方法从婚恋迁移到公共生活 |

四幕采用 **起—承—转—合**，不是四个随机案件。整集问题是：为什么完全不同的场景里，都有人先把身份、关系或流程说得好听，再让别人承担钱、资源或责任？

## Protagonist Arc

林旭阳不是答案机。他从“谁更委屈”逐步学会一种更可靠的听话方法：

1. 从接情绪，到问账单。
2. 从听亲密，到看表格。
3. 从查对方，到反问来电人。
4. 从看截图，到追付款与责任入口。

他的旧伤是两年前曾被一张剪过的账单带着误判。平台要求节目更像判决秀，他必须在流量压力下继续守住“先听完、再核材料、不替未知项下结论”。

## Narrative Contract

- 一页原则上只承载一组有上下承接的一问一答；单个回答过长时才拆成两屏。
- 每一问必须由上一句已知事实自然引出，禁止为了接证据而突然换题。
- 主播使用日常口语，不说“先核”“记录为”“不等于某号属于她”一类报告语言。
- 人物只能说知识边界内的内容；旁白只写可感知动作、声音和物件，不替人物总结潜台词。
- 玩家选择怀疑方向，主播负责把方向组织成人类会说的具体问句。
- 每幕保留 `true / edited / unknown`：已证实、被修剪、仍未知，三者不能互相越界。
- 咨询者必须有自利省略，对方也必须有可理解但不能免责的利益与防御。
- 这是林旭阳独立运营的个人直播，不出现导播、电台或电视演播室式口令。
- 案间采用“案后余味 → 名人名言 → 承上启下句 → 下一幕标题”，名言不能代替人物完成主题总结。

## Canon And Source Ownership

本工程采用“结构真源”和“运行时真源”分层，避免同一句台词在多个 Markdown 中手工维护：

1. **本文件与 `plot/`、`continuity/`**：负责整集结构、人物弧线、伏笔和跨幕因果，是后续改剧情时的第一入口。
2. **[`content/packs/steam-demo-01/manifest.json`](content/packs/steam-demo-01/manifest.json)**：负责四幕顺序、跨案暗线、幕间和结尾。
3. **`content/packs/steam-demo-01/cases/*.json`**：负责玩家实际看见的台词、材料、选项、真相边界和夜 A／白天／夜 B 接线。
4. **[`content/characters/cast.json`](content/characters/cast.json)**：负责角色性格、声纹、压力反应和知识边界；`characters/` 是便于故事工程检索的结构投影。
5. **`docs/generated/`**：全部是生成物，只用于阅读和审查，禁止直接改稿。

当结构发生变化时，先改 `story.md / plot / continuity`，再改 manifest 和案件 JSON，最后运行生成与校验。只改台词措辞时，直接改案件 JSON，再同步生成阅读版；不得把生成稿反向当真源。

## Revision Workflow

### 改整幕、人物动机或跨案伏笔

1. 在 `plot/` 或 `continuity/` 更新结构意图、前置条件与回收位置。
2. 在 `chapters/` 和 `scenes/` 更新该幕承担的功能、输入、输出和禁止项。
3. 修改 manifest、案件 JSON 与角色声纹真源。
4. 重新生成阅读版，检查玩家实际看到的相邻问答。

### 只改台词与选项

1. 先定位对应 `scenes/chapter-XX-scene-XX.md`，确认这句要完成什么功能。
2. 在案件 JSON 改玩家可见文本；若性格、知识边界或跨幕声纹变化，连同 `cast.json` 一起改。
3. 运行：

```bash
npm run content:index
npm run content:script
npm run check
```

### 故事工程维护

安装 Story CLI 后，从仓库根目录运行：

```bash
story validate .
story links .
story continuity .
story report . --actionable
```

每次新增、删除或重命名角色、地点、剧情弧、章节与伏笔后，还要运行 `story reindex .`。重建索引前注意保留注册表中人工撰写的结构说明。

## Project Map

- [角色注册表](characters/_index.md)
- [四幕与主题弧](plot/_index.md)
- [故事时间线](plot/timeline.md)
- [章节注册表](chapters/_index.md)
- [场景注册表](scenes/_index.md)
- [当前连续性状态](continuity/state.md)
- [伏笔与回收](continuity/promises/_index.md)
- [仍需正式版回答的问题](continuity/questions/_index.md)
- [世界、地点与关键物件](worldbuilding/_index.md)
- [术语表](glossary/_index.md)
- [连续阅读版剧本](docs/generated/steam-demo-01-continuous-story-script.md)
- [完整阅读版剧本](docs/generated/steam-demo-01-full-readable-script.md)

## Notes

当前试玩四幕已经可完整通关，但项目状态仍为 `revising`。后续新增案件包时，应新建独立故事工程或在 `plot/arcs/` 中建立新包主弧，不能把正式版所有案件继续塞进这四幕。
