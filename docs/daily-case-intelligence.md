# 案件素材情报管线

更新：2026-09-14。该管线收集候选题材，生成待审的结构建议，不自动改写当前四主案、三快案。创作与交互遵循[标准索引](standards-index.md)；旧 `daily` 命名不代表每天都要产出新案。

## 命令与产物

- `npm run intel:collect`：按配置采集素材卡。
- `npm run intel:drafts`：从素材卡生成候选 JSON，默认写入 `.local/daily-intelligence/story-pack-case-drafts.json`。
- `npm run intel:creator-template`：生成来源复核模板。

示例配置在 `daily-intelligence-sources.example.json` 和 `daily-intelligence-creators.example.json`；采集结果写入 `.local/daily-intelligence/`。生成器支持 `--input`、`--out`、`--limit`、`--cases`，具体解析以脚本为准。候选的 `status` 保持 `needs-human-review`，来源卡 ID、URL 与抽象内容分别保存；旧本地产物不会自动刷新，重新使用前应重新生成或人工复核。

## 从素材到剧情

素材可提供事件压力、话术、材料形态和误读风险。采用多少张取决于同一因果链，不强制三四张融合，不用改几个名字和金额就宣称完成原创改写。保留来源归属，避免照搬可识别人物、完整原案和原话。

生成器的 `beatLadder` 是候选功能清单，不是五段场景命令；`writersRoomPasses` 是可选审读角度，不是召集多个代理的指令；`qualityScorecard` 记录问题，不按分数或次数闸门入库。`singleCallerContract` 只描述旧 daily 候选形态；接入主案、来电快案或口播时读取各自消费者。

写作先确认人物诉求、已知事实与隐瞒的实际作用。陈述可以迟疑、淡化、讲半句和反驳；不强制双方互害、每场自白、固定层数或强制回暖。材料先交代来源，逐句问答按事实依赖展开，每页完整原句与询问／不询问，具体问题在对白里播放。

候选经当前任务范围内的人工审读后，接入案件 JSON，再生成阅读稿和索引、运行相应检查与 PC 回放。素材池数量不等于可玩案件数，当前素材池校验的规模要求只属于该池，不约束单案段数。

[历史方案](review-archive/standards-before-2026-09-14/daily-case-intelligence.md)不再用于生产；不能从中恢复每案五六段、至少二十分钟、选一次不能再问或强制结案报表。
