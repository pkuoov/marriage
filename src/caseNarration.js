import { NPCS } from "./story.js?v=0.14.0";
import { structuralExpectedAccusationForCase } from "./caseRuntime.js?v=0.14.0";

export function caseStructureText(brief) {
  if (structuralExpectedAccusationForCase(brief)) return "平台结构案：除了判断双方关系责任，还要查第三方如何把痛苦、材料和焦虑做成可复制的产品。";
  if (brief.caseMode === "premarital") return "婚前关系核验：先查择偶定位、承诺、彩礼房产、婚史孩子和债务有没有被包装。";
  if (brief.caseMode === "married") return "婚后共同生活案：先查共同财务、家务育儿、出轨边界、亲子和双方家庭责任。";
  if (brief.caseMode === "confession") return "告解模式：随机当事人自述经历，玩家站在 TA 的视角查被坑、自欺和可能伤人的部分。";
  return brief.premeditated ? "预谋案：确定存在非纯洁婚恋目的。" : "普通案：可能只是性格问题，也可能有人半真半假。";
}

export function caseAccusationHint(brief) {
  if (structuralExpectedAccusationForCase(brief)) return "第二套案件不只问谁在关系里说谎，还要问平台是否利用了这些真实痛苦。抓到足够跨案证据后，可以指向平台操盘。";
  if (brief.caseMode === "premarital") return "婚前案不急着判输赢，先判断这段关系是否已经带着不该进入婚姻的风险。";
  if (brief.caseMode === "married") return "婚后案不只看谁更委屈，要把共同生活、财务责任和家庭边界拆开。";
  if (brief.caseMode === "confession") return "告解模式不是自责模式，也不是控诉模式；重点是识别关系问题如何被双方共同放大。";
  return brief.premeditated ? "本案存在预谋，需要追钱、资源、时间线和收益。" : "本案可能只是性格、沟通、家庭压力，也可能半真半假。";
}

export function accusationLabel(brief, value) {
  if (value === "platform") return "平台 / 第三方操盘";
  if (value === "thirdParty") return "第三方操盘者";
  if (value === "both") return brief.caseMode === "confession" ? "自我选择和对方行为都要查" : "双方都有隐瞒";
  if (value === "noPremeditated") return brief.caseMode === "confession" ? "不是骗局，核心是选择机制失衡" : "暂判无预谋，只是关系失衡";
  return NPCS.find((npc) => npc.id === value)?.name ?? "未指认";
}

export function explanationForExpected(brief, expected) {
  if (expected === "platform") return "第二套的关键不是再从两名当事人里挑唯一坏人，而是识别平台如何把真实痛苦拆成测评、报告、合同、榜单和陪伴服务，再反过来影响当事人的选择。";
  if (expected === "thirdParty") return "本案的核心伤害来自第三方操盘：TA 不一定直接进入亲密关系，却通过材料、话术和节点设计改变了双方决策。";
  if (brief.caseMode === "confession") {
    if (expected === brief.complainantId) return "这类告解最危险的地方，是当事人用自责或委屈包装自己的主动选择。";
    if (expected === brief.respondentId) return "告解者在这段关系里是真正的受害方：对方的模式性行为才是核心问题，不是告解者的自欺。";
    if (expected === "both") return "告解模式的关键不是找唯一坏人，而是同时看见外部伤害和自己的选择机制。";
    return "这段经历更像关系失衡，不足以稳定指向预谋骗局。";
  }
  if (expected === brief.complainantId) return "先诉苦者的版本最需要被拆开：TA 先占据受害者位置，但关键时间线和收益路径不完整。";
  if (expected === brief.respondentId) return "另一方更接近核心风险来源：先诉苦者的痛感成立，但仍要用证据而不是情绪来确认。";
  if (expected === "both") return "双方都在修剪叙事，本案的学习点是责任比例，而不是把一个人简化成纯坏人。";
  return "核心更像沟通、性格和家庭压力叠加，直接按预谋处理会过度推断。";
}

export function structuralResponsibilityText(brief) {
  if (brief.structuralActorId === "platform") {
    return "平台把关系里的痛苦、焦虑和材料改写成可售卖模板。本案仍有当事人的选择责任，但主线伤害来自系统性提取。";
  }
  if (brief.structuralActorId === "thirdParty") return "第三方通过合同、材料、话术或信息差推动关系失衡。";
  return "本案存在超出双方关系的结构性推动力量。";
}

export function evidenceInsightFor(brief, type) {
  if (type === "timeline") return timelineGapText(brief);
  if (type === "money") {
    const moneyCard = (brief.evidenceCards ?? []).find((card) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源|消费|订单|截图/.test(`${card.title}${card.front}${card.detail}`));
    const moneyItem = [...(brief.hiddenFacts ?? []), ...(brief.evidence ?? [])].find((item) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源/.test(item));
    return `${moneyCard ? `${moneyCard.type}《${moneyCard.title}》` : moneyItem ?? brief.evidence?.[0] ?? "账目材料"} 是利益路径的入口，先看谁从关系推进里获得了确定收益。`;
  }
  if (type === "motive") {
    return `动机不是看谁哭得更真，而是看谁能从 ${brief.hiddenFacts?.[0] ?? "关键事实"} 和 ${brief.exaggerations?.[0] ?? "条件包装"} 里获得好处。`;
  }
  return "这份证据只能证明局部事实，不能替任何一方自动背书。";
}

export function timelineGapText(brief) {
  const gap = [...(brief.hiddenFacts ?? []), ...(brief.exaggerations ?? [])].find((item) => /时间|婚史|孩子|产检|同居|前任|离婚|失业|借钱|承诺/.test(item));
  return `${gap ?? brief.hiddenFacts?.[0] ?? "关键事实"} 的出现时间，比当事人讲述里的情绪高潮更值得先排。`;
}

export function runCompleteLineFor({ correct, total, caseMode, playthroughNumber }) {
  if (caseMode === "arc") {
    if (correct >= Math.ceil(total * 0.7)) return "两套正式主线基本站住了：你没有把每案当成孤立争吵，而是看见第一套的真实痛苦如何在第二套里被模板化。";
    return "故事主线还有断点：有些案子被你当成单案处理了，下一轮要更注意教学章、悬念物、跨套线索和案间过场。";
  }
  if (caseMode === "story") {
    if (correct >= Math.ceil(total * 0.7)) return "主播主线基本站住了：你能从客户说法里拆出骗婚、化债、边界勒索、多线养鱼和成熟度不足这些不同问题。";
    return "主播主线还有误判：有些案子表面像要价太高或普通吵架，实际可能藏着收益路径、多线发展或责任转嫁。";
  }
  if (playthroughNumber === 1) {
    if (correct >= Math.max(2, Math.ceil(total * 0.6))) return "第一次开播，你已经证明自己不会被第一版哭诉轻易带走。侦探局开始真正有了口碑。";
    return "第一周目没有完美通关，但它把最重要的事教给你：没有证据支撑的同情，也可能误伤另一个人。";
  }
  if (playthroughNumber === 2) {
    if (correct >= total - 1) return "第二周目最难的是不被上一轮经验绑架。你把相似和相同分开了，这是侦探局真正的成长。";
    return "第二周目提醒你：经验会提高速度，也会制造偏见。下一轮需要更谨慎地拆开责任比例。";
  }
  return correct >= total - 1 ? "本周目判断稳定，侦探局的流程开始形成可靠手感。" : "本周目仍有误判，后续要提高证据命中率。";
}
