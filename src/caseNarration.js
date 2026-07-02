import { NPCS } from "./story.js?v=0.20.62";
import { structuralExpectedAccusationForCase } from "./caseRuntime.js?v=0.20.62";

export function caseAccusationHint(brief) {
  if (structuralExpectedAccusationForCase(brief)) return "别只盯着两个人吵架。有人把他们的焦虑做成了模板，聊够了再把那只手指出来。";
  return "最别扭的，不一定是谁声音更大，而是谁把话收了半截。";
}

export function accusationLabel(brief, value) {
  if (value === "platform") return "平台 / 第三方操盘";
  if (value === "thirdParty") return "第三方操盘者";
  if (value === "both") return "双方都有隐瞒";
  if (value === "noPremeditated") return "先当成没说开的别扭";
  return NPCS.find((npc) => npc.id === value)?.name ?? "还没说清";
}

export function explanationForExpected(brief, expected) {
  if (expected === "platform") return "第二套别再只在两名当事人里挑坏人。平台把痛苦拆成测评、报告、合同、榜单和陪伴服务，又反过来推着人做选择。";
  if (expected === "thirdParty") return "最别扭的地方在第三个人手里。TA 不一定直接上桌，却能靠话术、节点和信息差把两边都带歪。";
  if (expected === brief.complainantId) return "先诉苦者的版本还没讲完整：TA 先占据受害者位置，但关键几句没有落到具体事情上。";
  if (expected === brief.respondentId) return "另一方的风险更大。来电人的委屈可以成立，但还得拿原话和细节继续对。";
  if (expected === "both") return "今晚最有意思的是，两边的话都不是全假的，可要紧处都停了一下。";
  return "核心更像沟通、性格和家庭压力叠加，直接按预谋处理会过度推断。";
}

export function structuralResponsibilityText(brief) {
  if (brief.structuralActorId === "platform") {
    return "平台把关系里的痛苦和焦虑改写成可售卖模板。当事人有自己的选择，背后也有人在抽走注意力和钱。";
  }
  if (brief.structuralActorId === "thirdParty") return "第三方通过话术、合同或信息差把关系往歪处推。";
  return "背后可能还有人递话、递规则、递压力。";
}

export function evidenceInsightFor(brief, type) {
  if (type === "timeline") return timelineGapText(brief);
  if (type === "money") {
    const moneyCard = (brief.evidenceCards ?? []).find((card) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源|消费|订单|截图/.test(`${card.title}${card.front}${card.detail}`));
    const moneyItem = [...(brief.hiddenFacts ?? []), ...(brief.evidence ?? [])].find((item) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源/.test(item));
    return `${moneyCard ? `${moneyCard.type}《${moneyCard.title}》` : moneyItem ?? brief.evidence?.[0] ?? "账目说法"} 先放桌上，看看钱最后流到谁那里。`;
  }
  if (type === "motive") {
    return `别只听谁更委屈，先问 ${brief.hiddenFacts?.[0] ?? "关键事实"} 和 ${brief.exaggerations?.[0] ?? "条件包装"} 让谁松了一口气。`;
  }
  return "这句话只能说明局部情况，不能替任何一方自动背书。";
}

export function timelineGapText(brief) {
  const gap = [...(brief.hiddenFacts ?? []), ...(brief.exaggerations ?? [])].find((item) => /时间|婚史|孩子|产检|同居|前任|离婚|失业|借钱|承诺/.test(item));
  return `${gap ?? brief.hiddenFacts?.[0] ?? "关键事实"} 是什么时候出现的，比谁哭得更凶更值得先排。`;
}

export function runCompleteLineFor({ correct, total, caseMode, playthroughNumber }) {
  if (correct >= 1) return "最热闹的地方，不是谁条件差，是每个人都只露了自己顺耳的那半边。";
  return "差点被开场带跑。越委屈的人，也越可能把自己那半句收起来。";
}
