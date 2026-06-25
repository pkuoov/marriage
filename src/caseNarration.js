import { NPCS } from "./story.js?v=0.19.36";
import { structuralExpectedAccusationForCase } from "./caseRuntime.js?v=0.19.36";

export function caseAccusationHint(brief) {
  if (structuralExpectedAccusationForCase(brief)) return "这通电话不只听谁在关系里说谎，也要听有没有人把这些真实痛苦做成套路。聊到足够多的共同点后，可以把背后推手说出来。";
  return "别急着替任何一方下定论。先听哪句话最别扭，再看谁没把话说全。";
}

export function accusationLabel(brief, value) {
  if (value === "platform") return "平台 / 第三方操盘";
  if (value === "thirdParty") return "第三方操盘者";
  if (value === "both") return "双方都有隐瞒";
  if (value === "noPremeditated") return "先当成没说开的别扭";
  return NPCS.find((npc) => npc.id === value)?.name ?? "还没说清";
}

export function explanationForExpected(brief, expected) {
  if (expected === "platform") return "第二套的关键不是再从两名当事人里挑唯一坏人，而是识别平台如何把真实痛苦拆成测评、报告、合同、榜单和陪伴服务，再反过来影响当事人的选择。";
  if (expected === "thirdParty") return "这通电话最别扭的地方来自第三方操盘：TA 不一定直接进入亲密关系，却通过话术、节点和信息差改变了双方选择。";
  if (expected === brief.complainantId) return "先诉苦者的版本还没讲完整：TA 先占据受害者位置，但关键几句没有落到具体事情上。";
  if (expected === brief.respondentId) return "另一方更像这通电话里的核心风险来源：先诉苦者的痛感成立，但还要靠原话和细节继续对一对。";
  if (expected === "both") return "今晚最有意思的是，两边的话都不是全假的，可关键处都停了一下。";
  return "核心更像沟通、性格和家庭压力叠加，直接按预谋处理会过度推断。";
}

export function structuralResponsibilityText(brief) {
  if (brief.structuralActorId === "platform") {
    return "平台把关系里的痛苦和焦虑改写成可售卖模板。当事人有自己的选择，背后也有人在抽走热度和钱。";
  }
  if (brief.structuralActorId === "thirdParty") return "第三方通过话术、合同或信息差把关系往歪处推。";
  return "这通电话背后，还有超出两个人关系的推手。";
}

export function evidenceInsightFor(brief, type) {
  if (type === "timeline") return timelineGapText(brief);
  if (type === "money") {
    const moneyCard = (brief.evidenceCards ?? []).find((card) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源|消费|订单|截图/.test(`${card.title}${card.front}${card.detail}`));
    const moneyItem = [...(brief.hiddenFacts ?? []), ...(brief.evidence ?? [])].find((item) => /钱|债|房|彩礼|转账|收入|贷款|股权|账户|信用|资源/.test(item));
    return `${moneyCard ? `${moneyCard.type}《${moneyCard.title}》` : moneyItem ?? brief.evidence?.[0] ?? "账目说法"} 是利益路径的入口，先看谁从关系推进里获得了确定好处。`;
  }
  if (type === "motive") {
    return `动机不是看谁哭得更真，而是看谁能从 ${brief.hiddenFacts?.[0] ?? "关键事实"} 和 ${brief.exaggerations?.[0] ?? "条件包装"} 里获得好处。`;
  }
  return "这句话只能说明局部情况，不能替任何一方自动背书。";
}

export function timelineGapText(brief) {
  const gap = [...(brief.hiddenFacts ?? []), ...(brief.exaggerations ?? [])].find((item) => /时间|婚史|孩子|产检|同居|前任|离婚|失业|借钱|承诺/.test(item));
  return `${gap ?? brief.hiddenFacts?.[0] ?? "关键事实"} 的出现时间，比当事人讲述里的情绪高潮更值得先排。`;
}

export function runCompleteLineFor({ correct, total, caseMode, playthroughNumber }) {
  if (correct >= 1) return "这通电话最热闹的地方，不是谁条件差，而是每个人都只露了自己想露的那半边。";
  return "这通电话差点被第一版说法带跑。越像受委屈的人，越可能把自己的那半句藏起来。";
}
