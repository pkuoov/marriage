# 律师语料采集（B 站优先）

独立目录，不和说媒混收。只收公开元数据，不下载视频文件。不限婚恋。

两层池：流量池 Top30；话轮池每种声纹 6–10 个可连续听懂片段。只来自字幕。

```bash
cd tools/lawyer-corpus
node src/collect-bilibili.js --enrich-only --resume
node src/collect-bilibili.js --enrich-only --host=guo-yanjiao --resume
node src/analyze.js
```

可选：`BILI_COOKIE` / `BILI_SESSDATA`。未授权不下载音视频。会见话术、取证、藏匿、伤害过程只进负例库。

写作报告已匿名。原始来源只留在 `data/raw/latest.json`。
