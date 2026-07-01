export function normalizeRouteChoice(sceneIndex, option = {}, scene = {}) {
  return {
    sceneIndex,
    axis: option.routeAxis ?? routeAxisForChoice(option, scene),
    tone: option.routeTone ?? routeToneForChoice(option),
    core: Boolean(option.contradiction),
    question: option.question ?? "",
    answer: option.answer ?? ""
  };
}

export function routeChoicesFromPicks(picks = []) {
  return picks.map((pick, index) => normalizeRouteChoice(index, {
    ...pick,
    routeAxis: pick.routeAxis ?? routeAxisForChoice(pick),
    routeTone: pick.routeTone ?? routeToneForChoice(pick)
  }));
}

export function routeAxisProfileFromChoices(choices = []) {
  const counts = routeAxisCounts(choices);
  const [axis, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? ["live-instinct", 0];
  const coreHits = choices.filter((item) => item.core).length;
  const skeptical = choices.filter((item) => item.tone === "caller-skeptical").length;
  const softening = choices.filter((item) => item.tone === "softening").length;
  const label = routeAxisLabel(axis);
  let summary = "你一路按现场听感往前接，路线还没有明显偏向。";
  if (choices.length) {
    if (skeptical > softening && skeptical >= 2) summary = "你不急着相信来电人的版本，会先追她自己没说全的利益和压力。";
    else if (softening > skeptical && softening >= 2) summary = "你会先替双方留下余地，等材料和后续话头自己露出缺口。";
    else if (coreHits === choices.length) summary = "你每段都接得很紧，这通后面就没那么容易散掉。";
    else summary = `你主要沿着${label}推进，中间也绕去听了几句外围解释。`;
  }
  return { axis, label, count, summary, coreHits, total: choices.length };
}

export function routeAxisCounts(choices = []) {
  return choices.reduce((counts, item) => {
    const axis = item.axis ?? "live-instinct";
    counts[axis] = Number(counts[axis] ?? 0) + 1;
    return counts;
  }, {});
}

export function routeAxisForChoice(option = {}, scene = {}) {
  const text = `${option.question ?? ""} ${option.answer ?? ""} ${scene.version ?? ""}`;
  if (/你当时|你自己|你妈|家里|心疼|怕|委屈|表现|抢署名|要不要|主动|你是不是|你有没有|起疑|绕着|不踏实|怎么接|怎么回|怎么理解|自己人|拦过|改口|为什么先答应|更慌/.test(option.question ?? "")) return "caller-credibility";
  if (/学历|本科|MBA|名校|老板娘|身份|女朋友|唯一|主责|署名|版本|介绍人|标签|条件/.test(text)) return "identity-wording";
  if (/流水|工资|收入|花销|存款|钱|账|还款|还贷|垫款|返款|付款|收款|费用/.test(text)) return "money-flow";
  if (/截图|图|材料|资料|证明|合同|协议|表|账单|审批|付款状态|账户/.test(text)) return "document-edge";
  if (/流程|财务|供应商|对接人|入口|越级|项目组/.test(text)) return "process-control";
  if (/他|她|TA|对方/.test(option.question ?? "")) return "counterparty-credibility";
  return option.contradiction ? "core-thread" : "outer-thread";
}

export function routeToneForChoice(option = {}) {
  const text = `${option.question ?? ""} ${option.answer ?? ""}`;
  if (/你当时|你自己|你妈|是不是也|主动|心疼|想要|接受|表现|抢署名|先谈|起疑|绕着|不踏实|怎么接|怎么回|怎么理解|自己人|拦过|改口|为什么先答应|更慌/.test(text)) return "caller-skeptical";
  if (/有没有可能|会不会|是不是就一定|只是|正常|先只|能不能先/.test(text)) return "softening";
  if (option.contradiction) return "pressure-point";
  return "detour";
}

export function routeAxisLabel(axis) {
  const labels = {
    "money-flow": "钱流结构线",
    "document-edge": "材料缺口线",
    "identity-wording": "身份话术线",
    "process-control": "入口控制线",
    "caller-credibility": "来电人可信度线",
    "counterparty-credibility": "对方叙事线",
    "core-thread": "核心矛盾线",
    "outer-thread": "外围试探线",
    "live-instinct": "现场听感线"
  };
  return labels[axis] ?? "现场听感线";
}

export function compactRouteQuestion(question = "") {
  const normalized = String(question).replace(/\s+/g, "");
  if (!normalized) return "";
  return normalized.length > 18 ? `${normalized.slice(0, 18)}...` : normalized;
}
