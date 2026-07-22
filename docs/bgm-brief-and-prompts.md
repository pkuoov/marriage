# BGM Brief 模板与迭代规范(生成式音乐资产)

日期:2026-07-19
规则:任何一首曲子在生成前必须先填完整 brief,再从 brief 压缩出平台 prompt;每次迭代只动一个变量轴,并记录版本诊断。泛风格标签(lo-fi/melancholic 单飞)禁止直接投喂。

完整 brief 是给人和工程流程看的，不等于要把全部内容交给生成模型。曲 2 的首轮失败已经证明：过长 Describe 会把每项约束变成一个新的音乐事件。正式投喂 Udio 时，Describe 只保留用途、核心音色、情绪和节奏行为，约 30–50 个英文词；Style Reduction 只保留 6–8 个直接失败模式。循环、低通、响度、峰值、淡入淡出与转码由 `scripts/process-bgm.js` 处理，不写进音乐描述。

当前 Udio 执行单：[udio-bgm-production-prompts-v2.md](udio-bgm-production-prompts-v2.md)。它已经按实际 `audioCatalog` 九个 BGM 槽位重排；本文件后面的旧示例只用于说明 brief 方法，其中的长平台 Prompt 属于历史示例，不可直接复制生成。

## Brief 模板(六栏,缺一不填不许生成)

```text
【定位】游戏内角色 + 市场对标(同类作品的 OST 参照,给平台听得懂的描述而非人名)
【风格】流派 + 年代 + 制作质感(录音介质/瑕疵美学)
【表现形式】配器清单 | 段落编排计划(几秒进什么) | motif 要求 | 混音视角(近/远/干/湿)
【技术规格】BPM | 调性倾向 | 工作母版目标时长 | 运行时循环的小节数与时长 | 纯器乐 | 交付后处理(LUFS/低通)
【Udio 执行参数】Clip Timing | Song Length | Prompt Strength | Lyrics Strength | Clarity | Generation Quality
【场景挂载与禁忌】在哪响、和什么声音共存、必须不像什么
【迭代轴】v1 先验证什么;若 X 失败,v2 只改什么
```

## 市场对标基准(全项目共用)

- 首选参照系:《疑案追声(Unheard)》的声场叙事感 ×《VA-11 Hall-A》的午夜合成温度 ×《Coffee Talk》的 lo-fi 亲密感;
- 差异化:比以上三者都更"电台"——无线电介质感(静电/调频/压缩话筒)是本作专属身份,任何一首曲子拿掉电台质感后如果毫无损失,说明没写够;
- 受众:20-35 城市夜猫玩家,对"网易云深夜评论区"式情绪熟悉;要"心酸的温柔",拒绝纯放松学习歌单质感。

## 已定资产状态

- 《1AM Neon》(Mureka,3:18):候选,待 A/B;
- 《Neon Rain Nights》(Udio,2:15):结构已分析(稀疏 45s→断口→和声主段→淡出),待响度归一/循环剪辑/15kHz 低通;角色待定(主题曲 或 拆两用)。

## 升级版 Brief 示例

### 曲 1 v2·主题曲「深夜热线」(若现有两首均无合格 motif 时生成)

```text
【定位】标题画面主题曲,游戏的听觉名片;对标"疑案追声的现场感+VA-11 Hall-A的午夜暖意",但介质是 AM 电台
【风格】lo-fi noir jazz-hop,90年代末深夜广播质感,磁带饱和+黑胶炒豆,轻微调频漂移
【表现形式】0-8s 调频扫频静电+电流声定场 → 8s 起 Rhodes 铺底+boom bap 进 → 16s 弱音小号主题旋律(4-8音,可哼唱,全曲重复3次) → 中段留一个2s呼吸断口 → 尾段旋律残句+静电收;混音视角:近距离电台监听,中频给人声留空
【技术规格】72 BPM | 小调 | 2:30±15s | 纯器乐 | 循环点设计在断口处 | 交付后归一 -16 LUFS/峰值 -1dBTP
【场景挂载与禁忌】标题页+尾声回家段变奏源;与 UI 音效共存;禁止:自习室歌单感、纯 chill、无旋律氛围铺底
【迭代轴】v1 验证 motif 是否成立(能否哼出);失败则 v2 只改主奏乐器(小号→口琴→中音萨克斯),节奏织体不动
```

压缩为平台 prompt:

```text
lo-fi noir jazz-hop theme, AM radio static and dial tuning intro, warm Rhodes chords, laid-back boom bap, distinctive melancholic muted trumpet melody as recurring main hook, hummable 8-note motif repeated three times, tape saturation, vinyl crackle, slight FM drift, late 90s midnight radio broadcast feel, close intimate mix with open midrange, one 2-second breakdown gap mid-track, minor key, 72 BPM, instrumental
```

### 曲 2·夜 A 倾听底垫(如不用《Neon Rain Nights》前 45 秒拆段,则生成)

```text
【定位】对话底垫,全游戏播放时长最长的一首;必须"隐形"——玩家注意力在台词上,它只负责让房间不冷
【风格】minimal ambient jazz,深夜播音室房间声,近乎静止
【表现形式】仅三层:Rhodes 长和弦(间隔4-8s)+ 极轻磁带底噪 + 若有若无 sub 脉冲;无旋律、无鼓、无段落发展;和声在两个和弦间极慢摆动
【技术规格】60 BPM 感(无明确节拍)| 与曲1同调 | 2:00 无缝循环 | 纯器乐 | 交付后 -20 LUFS(垫在语音下)
【场景挂载与禁忌】夜A/夜B对话全程,与追问压力层(曲3)同调同速,便于交叉淡化;禁止:任何抓耳事件、任何鼓点、任何旋律片段
【迭代轴】v1 验证"隐形度"(读台词时是否忘记它存在);太抓耳则 v2 只删元素不加元素
```

```text
minimal ambient jazz bed, sparse warm Rhodes chords with long silences between, faint tape hiss room tone, barely audible sub bass pulse, no melody, no drums, no development, two chords slowly alternating, invisible background for spoken dialogue, midnight radio booth atmosphere, extremely quiet and patient, seamless loop, instrumental
```

### 曲 9·sting 组(炸毛/挂断/他在听,各独立生成后裁剪)

```text
【定位】3-4 个 10-20 秒戏剧标点,对标疑案追声的"发现瞬间"音效化配乐
【风格】与主题曲同族的 noir 音色,但事件化
【表现形式】a炸毛:低音钢琴簇+弦刮擦,骤起骤停;b挂断:单音 Rhodes 衰减+忙音暗示+静电尾;c他在听:sub 低频渐近+磁带停转声,结在不谐和悬置上不解决
【技术规格】无节拍 | 与曲1同调 | 每条<20s | 纯器乐 | 尾部留 1s 静音便于裁剪
【场景挂载与禁忌】叠在对话音之上瞬时播放;禁止:恐怖片式惊吓(jump scare),要"心里沉一下"不要"吓一跳"
【迭代轴】v1 验证长度与收尾形状;过长则 v2 指定 "very short cue, under 15 seconds, abrupt ending"
```

## 迭代协议

1. 每版生成后按曲目的【迭代轴】验收,诊断写一行(如"v1:质感对,motif 太弱");
2. 下一版 prompt 只改诊断指向的那一个变量,其余字词原样保留(平台对 prompt 变动敏感,多变量一起动等于重开盲盒);
3. 三版仍不合格→换平台(Mureka↔Udio)或改用已合格曲目 remix 派生;
4. Udio Remix 输出按 32 秒短曲处理，当前只用于最终追问；压力层直接剪辑曲 2 同轮生成的紧张版本，其他长曲直接新生成 2:10，再按整小节裁运行时循环;
5. 合格曲目立即登记到本文件「已定资产状态」,并交 ffmpeg 后处理(响度归一/循环剪辑/低通)进 `assets/audio/`,命名对齐 `audioCatalog`(bgm.title / bgm.night-a.listen / sting.interrupt 等)。
