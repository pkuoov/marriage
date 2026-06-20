export function describeAttr(value) {
  if (value <= 2) return "明显短板";
  if (value <= 4) return "偏弱";
  if (value === 5) return "普通";
  if (value <= 7) return "优势";
  if (value <= 9) return "强优势";
  return "顶配标签";
}

export function publicProfileText(state, attributes) {
  const { wealth, family, looks, education, eq } = state.attrs;
  const high = attributes.filter((attr) => state.attrs[attr.id] >= 7).map((attr) => attr.short);
  const low = attributes.filter((attr) => state.attrs[attr.id] <= 3).map((attr) => attr.short);
  return [
    "本场身份：婚恋侦探 / 律师顾问",
    `财务 ${wealth} / 家庭 ${family} / 形象 ${looks} / 核验 ${education} / 洞察 ${eq}`,
    high.length ? `本场强项：${high.join("、")}` : "本场强项：均衡型",
    low.length ? `本场盲区：${low.join("、")}` : "本场盲区：无明显短板"
  ];
}

export function compactProfileText(state, attributes) {
  const high = attributes.filter((attr) => state.attrs[attr.id] >= 7).map((attr) => attr.short);
  const low = attributes.filter((attr) => state.attrs[attr.id] <= 3).map((attr) => attr.short);
  return [
    "侦探局",
    high.length ? `优势：${high.slice(0, 2).join("、")}` : "均衡型",
    low.length ? `盲区：${low.slice(0, 2).join("、")}` : "盲区不明显"
  ];
}

export function relationshipStatusLines(state) {
  const f = state.flags;
  const lines = [];

  if ((f.suspicion ?? 0) >= 7) lines.push("有些话开始对不上。");
  else if ((f.suspicion ?? 0) >= 4) lines.push("你心里留了一个问号。");

  if ((f.boundary ?? 0) >= 8) lines.push("你越来越敢说“不”。");
  else if ((f.boundary ?? 0) >= 4) lines.push("你开始把感受放回桌面。");
  else lines.push("关系还在顺着别人的节奏走。");

  if ((f.communicationFriction ?? 0) >= 3) lines.push("聊天变得需要用力。");
  if ((f.timeConflict ?? 0) >= 2) lines.push("TA 的时间表压过了你的生活。");
  if ((f.exBoundary ?? 0) >= 2) lines.push("旧关系的影子还没完全离开。");
  if ((f.intimacyBoundary ?? 0) >= 1) lines.push("亲密走得比确定感更快。");
  if ((f.publicPressure ?? 0) >= 1) lines.push("这段关系被更多人看见了。");
  if ((f.emotionalLabor ?? 0) >= 3) lines.push("你像在照顾两个人的情绪。");

  if ((f.parentConflict ?? 0) + (f.parentDependency ?? 0) >= 8) lines.push("两边父母已经坐进了关系里。");
  else if ((f.parentConflict ?? 0) >= 4) lines.push("家里的声音越来越近。");

  if ((f.partnerParentApproval ?? 0) >= 4) lines.push("对方家里看起来松了口。");
  else if ((f.partnerParentApproval ?? 0) < 0) lines.push("对方家里并不满意。");

  if ((f.siblingPressure ?? 0) >= 1) lines.push("TA 的原生家庭有额外牵引。");
  if ((f.phoenixAmbition ?? 0) >= 1) lines.push("TA 很想借这段关系往上走。");
  if ((f.giftPressure ?? 0) >= 2) lines.push("体面开始变贵。");
  if ((f.weddingPressure ?? 0) >= 5) lines.push("婚礼正在变成一场消耗战。");
  if ((f.householdPressure ?? 0) >= 6) lines.push("家里的疲惫越来越厚。");
  if ((f.debtPressure ?? 0) >= 6) lines.push("债务让未来变窄。");
  if ((f.childPressure ?? 0) >= 6) lines.push("孩子议题压过了你们两个人。");
  if ((f.macroEconomyPressure ?? 0) >= 3) lines.push("外面的风向正在吹进家里。");
  if ((f.investmentExposure ?? 0) >= 3) lines.push("投资冲动开始碰到家庭安全垫。");
  if ((f.scamExposure ?? 0) >= 2) lines.push("有些高收益承诺需要先停下来核实。");
  if ((f.exReentryRisk ?? 0) >= 2) lines.push("旧关系重新靠近了你们。");
  if ((f.careDeficit ?? 0) + (f.emotionalValueDemand ?? 0) >= 4) lines.push("陪伴和索取开始不对等。");
  if ((f.infidelityRisk ?? 0) >= 3) lines.push("情绪正在往关系外面漏。");
  if ((f.evidenceClarity ?? 0) >= 2) lines.push("证据链开始变清楚。");
  if ((f.audiencePressure ?? 0) >= 2) lines.push("旁听席正在替事实站队。");
  if ((f.falseAccusationRisk ?? 0) >= 2) lines.push("恶人先告状的可能性上升。");

  if ((f.debtPressure ?? 0) + (f.weddingPressure ?? 0) + (f.educationPressure ?? 0) >= 10) {
    lines.push("现实已经开始替感情出题。");
  } else if ((f.assetProtection ?? 0) >= 6) {
    lines.push("你给自己留了退路。");
  }

  if (state.routeSwitches > 0) lines.push("你已经换过一次方向。");
  return lines.length ? lines.slice(0, 4) : ["今晚暂时风平浪静。", "你还在观察。"];
}
