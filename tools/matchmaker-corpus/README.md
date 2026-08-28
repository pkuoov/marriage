# 说媒语料采集（B 站优先）

独立目录。只收公开元数据，不下载视频文件。

两层池：

- 流量池：播放量 Top20，看标题、冲突和热评怎么传播。
- 话轮池：每种声纹 6–10 个可连续听懂的片段。只来自字幕，不用标题冒充台词。

```bash
cd tools/matchmaker-corpus
node src/collect-bilibili.js --enrich-only --resume
node src/collect-bilibili.js --enrich-only --host=jie-ge --resume
node src/analyze.js
```

全量重搜（默认不需要）：

```bash
node src/collect-bilibili.js --top=20 --pages=6
```

可选环境变量：`BILI_COOKIE` 或 `BILI_SESSDATA`。没有登录时字幕记为 `login-required`，不下载音视频，不做 ASR。

弹幕状态只能是 `available` / `empty` / `risk-controlled` / `request-failed` / `no-cid`。接口失败不得写成没有弹幕。

写作报告在 `out/patterns.md` 与 `out/coverage-report.md`，已匿名。原始来源只留在 `data/raw/latest.json`。
