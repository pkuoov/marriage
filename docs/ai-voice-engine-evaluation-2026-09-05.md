# AI 配音选型与首轮试音单

核查日期：2026-09-05。依据为官方模型文档、价格页、模型卡和服务条款。本轮没有调用付费生成，也没有完成引擎听感实测；以下排序是试音顺序。

建议先比较 MiniMax Speech 2.8 HD 与 Fish S2.1-Pro。五条证据语音每句各做三遍，共 30 条，再决定正式引擎。Eleven v3 用作难句表演备选；需要本地生产时优先考察 Qwen3-TTS。

## 为什么适合这样选

本作的重点是普通话生活对白：男店员随手诉苦、饭桌上迟疑发问、同事催垫款。声音过于饱满、字字清楚、句句带情绪，反而容易把人物演成主播或预谋反派。供应商那句“老规矩”尤其不能用重音替玩家揭底。

目前真正需要替换或补齐的是 `assets/audio/voice/recording-manifest.json` 的五条线索语音。全剧情配音可以后排。建议离线生成、试听、剪辑后随游戏打包，继续使用现有逐字稿和 BGM 压低逻辑；不用把网络 TTS 请求接到玩家每次点对白的路径上。

## 候选比较

| 候选 | 已核实的能力及项目用途 | 成本口径 | 本轮判断 |
| --- | --- | --- | --- |
| MiniMax Speech 2.8 HD / Turbo | 支持中文、固定音色、音色设计与克隆；可调语速音高、发音词典，2.8 支持非语言声音标签。适合先试五条短对白。 | 国际站按量 HD $100/百万字符，Turbo $60/百万字符；音色设计 $3/个，克隆 $1.5/个。 | HD 进入首轮。API 可控项贴近当前生产需求，但不能据此断言中文表演胜过其他引擎。 |
| Fish S2.1-Pro | 当前官方推荐模型，支持自然语言方括号标签、多说话人；适合试句中语气变化。 | 付费 API $15/百万 UTF-8 字节，无 API 月费下限。 | 与 MiniMax 对照。中文字符不能按英文字符估价。 |
| ElevenLabs Eleven v3 | 支持对白和声音标签，2026-02-02 已正式可用。适合试犹豫、掩饰、情绪转折。 | 创作端 Starter $6/月，30,000 credits；Creator $22/月，121,000 credits，首月优惠另计。API 套餐另核。 | 小批试音备选。重点检查中文声线和本作口语是否合适。 |
| 豆包语音合成 / 声音复刻 2.0 | 官方复刻文档支持 `context_texts` 传递语气或上下文；同一句的情感仍可能随生成变化。 | 合成、复刻、音色和并发分别计费；本轮不把促销页价格当长期单价。 | 如果团队已有火山账号，可以加入首轮；否则先减少平台和音色管理成本。 |
| Qwen3-TTS 1.7B | 中文、自然语言音色设计与风格控制；VoiceDesign、CustomVoice、Base 的用途不同。 | 自部署不按字向模型厂商付费，仍有设备、运算与维护成本。 | 本地方案优先候选。不能在未测本机环境前保证速度或显存用量。 |

能力与价格来源：[MiniMax API](https://platform.minimax.io/docs/api-reference/speech-t2a-http)、[MiniMax 按量计费](https://platform.minimax.io/docs/guides/pricing-paygo)、[Fish 模型](https://docs.fish.audio/developer-guide/models-pricing/models-overview)、[Fish 计费](https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits)、[Eleven v3](https://elevenlabs.io/blog/eleven-v3)、[Eleven v3 正式发布](https://elevenlabs.io/blog/eleven-v3-is-now-generally-available)、[ElevenLabs 创作端价格](https://elevenlabs.io/pricing)、[豆包复刻 2.0](https://www.volcengine.com/docs/6561/2298705?lang=en)、[Qwen 官方仓库](https://github.com/QwenLM/Qwen3-TTS)。

## 发行授权不能混用

- Fish：服务条款允许付费服务商业使用；下载的 S2-Pro 权重另用 Research License，商业使用需要单独授权。`s2.1-pro-free` 文档提到开发和小型业务，但与通用免费服务条款的关系未在本轮确认，不能把零价等同于已取得发行许可。正式候选先按付费 API 准备。[服务条款](https://fish.audio/terms/)、[S2-Pro 模型许可](https://huggingface.co/fishaudio/s2-pro)。
- ElevenLabs：付费期间、非 Beta 服务生成的内容可按条款商用，取消订阅后仍可使用；先在免费档生成、再付费，不会自动追溯授权。具体音色、产品附加条款仍适用。[官方商用说明](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)。
- Qwen3-TTS：本轮同时核对了代码许可和官方 VoiceDesign 权重卡的 Apache-2.0 标注。选用其他权重或社区转换版时也要保留对应许可；模型许可不代替参考说话人的声音授权。[代码许可](https://github.com/QwenLM/Qwen3-TTS/blob/main/LICENSE)、[官方权重](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign)。
- MiniMax：API、Audio 网页和 Agent 有不同产品条款。已确认官方统一条款要求适用具体产品条款，但本轮未取得足够明确的 API 输出游戏发行授权文字，因此列为“试音可选、发行条款待确认”，不能拿 Agent 会员的商用说明替 API 作保证。[产品条款边界](https://www.minimax.io/terms-of-service-v2.html)、[API 条款入口](https://hub.minimax.io/protocol/terms-of-service)、[付费协议](https://platform.minimax.io/protocol/paid-agreement)。
- 豆包：本轮核实了能力，未完成具体音色的游戏发行授权核验，仍属备选。工程已有 Amphion Vevo/MaskGCT 试制链继续限于内部试音，不能因更换文件名就转成正式资产。

首轮优先用平台明确提供的可用音色或文字设计的原创音色。若采用克隆，使用已取得同意的录音，并保存说话人授权；不选来源不明的社区名人声线。

## 按相同文字量估算

以下是十万常用汉字、单次生成的计算示例，不代表工程实际字数。未含税费、音色创建、最低充值和废片成本。

| 方案 | 一遍 | 三遍候选 |
| --- | ---: | ---: |
| MiniMax HD | $10 | $30 |
| MiniMax Turbo | $6 | $18 |
| Fish 付费 S2.1-Pro | 约 $4.50 | 约 $13.50 |

Fish 的估算为 100,000 × 3 UTF-8 字节 × $15 / 1,000,000；标点、英文、标签和其他字符按实际请求字节数计算。ElevenLabs 使用 credits 和套餐口径，不将其英文分钟估算直接换算成中文十万字。

## 五句固定试音

台词以 manifest 为准，下面只附导演说明。说明不要作为普通台词直接交给引擎朗读；分别映射到该引擎支持的控制字段或标签。

| 顺序 / Cue | 原句 | 试音方向 |
| --- | --- | --- |
| 1 · `voice.case2.dryer-message` | 今晚店长又说我了。也就你肯听我说这些。 | 二十多岁男店员，忙完回熟客语音。稍累，后半句亲近得很熟练；不要刻意压低成气泡音。 |
| 2 · `voice.case3.dinner-pause` | 你发的材料是那所学校，本科也是在那儿读的吗？ | 咨询者林，饭吃到一半才问。认真、稍有迟疑，保持日常说话音量；不要像审讯或采访。 |
| 3 · `voice.case4.pad-message` | 你先把场地和礼品费垫了。活动总结里，我写你是负责人。 | 采购同事在赶活动进度，催垫款后顺势许诺署名。句间短停，不补笑声或威胁口气。 |
| 4 · `voice.case4.supplier-message` | 服务协调费按老规矩返给对接人。 | 项目员补一句流程，平常地说完。“老规矩”不加重音。 |
| 5 · `voice.case1.loyalty-message` | 我只是怕你知道我失业后就离开我。 | 先解释，后面露出不安。“失业后”略快带过但仍须听清；“离开我”前允许短换气。 |

每个引擎先给每个角色固定一个声线，再做三条：自然读法、轻度导演控制、重复相同设置检验稳定性。不要让三条分别换三个人。案 4 同事与供应商必须听得出是不同人，也不能误认成主播林旭阳。

验收时先盲听，再揭示引擎名称。逐字正确是硬条件；随后按 1–5 分记录口语自然度、角色合适度、潜台词、重复生成的一致性。漏字、加词、把导演标签读出声、把“老规矩”演成揭密，直接退回。拿候选干声与游戏 BGM 合播一次，确认原句听清，不能只听官网示例。

## 接入顺序

1. 先做 30 条试音，保存 provider、model、voice ID、原句、参数、生成日期、费用与授权依据；维持现有五条资产状态。
2. 选定声线后，保存原生最高可用质量的干声。引擎若只输出 24/32/44.1 kHz，记录原始规格，工程再统一转 48 kHz；升采样不算新增录音细节。
3. 吹风机、电话线路滤波等在后期另加。语音真峰值不高于 -3 dBTP，按现有交付单逐条对照。
4. 采用 AI 正式配音时，为 manifest 和校验器增加明确的合成配音审批状态及来源记录，不能冒用 `approved-actor-master`。此项在本轮仅列任务，未改状态或覆盖母版。
5. 晋升后跑 `npm run verify:audio`，在浏览器检查字幕、回放、暂停恢复和 BGM 压低，再扩展到其他对白。
