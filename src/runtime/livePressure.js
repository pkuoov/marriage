export function livePressureProfile({
  budget = {},
  foundCount = 0,
  intentHook = "",
  pressureSignal = "",
  routeAxis = "",
  routeAxisComments = {},
  scene = "",
  sceneHint = {},
  mood = "listening"
} = {}) {
  const max = Math.max(1, Number(budget.max ?? 1));
  const remaining = Math.max(0, Math.min(max, Number(budget.remaining ?? max)));
  const ratio = remaining / max;
  const level = scene === "patienceLost" || ratio <= 0.28 ? "low" : ratio <= 0.55 ? "mid" : "high";
  const crowd = crowdState({ pressureSignal, foundCount, level, scene });
  const callerGuard = callerGuardState({ pressureSignal, crowd, mood, sceneHint });
  return {
    max,
    remaining,
    ratio,
    level,
    crowd,
    callerGuard,
    patienceLabel: patienceLabelFor(level),
    comments: liveCommentsFor({ crowd, foundCount, intentHook, level, routeAxis, routeAxisComments, scene }),
    expression: expressionFor({ callerGuard, crowd, level, mood, scene, sceneHint })
  };
}

export function questionPressureSignal(option = {}, routeTone = "") {
  const tone = routeTone || option.routeTone || "";
  if (tone === "softening" || tone === "detour") return "drift";
  if (tone === "caller-skeptical") return "guarded";
  if (tone === "pressure-point" || tone === "trust-but-verify") return "held";
  return option.contradiction ? "held" : "drift";
}

export function questionPressureReaction(option = {}, routeTone = "") {
  const tone = routeTone || option.routeTone || "";
  if (/太细|不太好听|尴尬/.test(option.answer ?? "")) return "弹幕先吵起尺度：问得细不细，和这张资料为什么出现，是两件事。";
  if (/本科|项目|学制|校名/.test(option.answer ?? "")) return "直播间开始扒标签：图能说明一截，但没说明完整那截。";
  if (/花销|余额|每个月|团购|停车费/.test(option.answer ?? "")) return "弹幕顺着钱吵起来：一笔小钱不定性，但长期别扭会把问题推回流水。";
  if (/工资|流水|小家|不舒服/.test(option.answer ?? "")) return "麦里安静了一下：拒绝流水未必心虚，但这句已经碰到婚后钱怎么管。";
  if (/审批|财务|付款|收款|返款|垫款/.test(option.answer ?? "")) return "弹幕开始对截图：可能是流程慢，也可能是最要紧那页没发。";
  if (tone === "softening") return "弹幕有人替 TA 补了一句，麦温往下掉了一格。";
  if (tone === "caller-skeptical") return "这句绕回了来电人自己，弹幕短暂安静了一下。";
  if (tone === "pressure-point" || tone === "trust-but-verify") return "这句咬住了，直播间的人声压低了一点。";
  return "直播间接住了这个角度，但人声开始有点散。";
}

export function materialPressureSignal(outcome = {}) {
  return outcome.correct ? "held" : "drift";
}

export function materialPressureReaction(outcome = {}, check = {}) {
  if (outcome.correct) {
    if (/审批|付款|收款|返款|垫款|供应商/.test(`${check.title ?? ""}${check.material ?? ""}`)) return "这块圈住了，钱路终于有了落点。";
    if (/表|排班|名单|备注/.test(`${check.title ?? ""}${check.material ?? ""}`)) return "表里这一格被圈出来，弹幕突然不刷了。";
    return "这块圈住了，前面那句开始变味。";
  }
  if (/截图|图|表|账|审批|流水/.test(outcome.pick?.label ?? "")) return "弹幕被这块带跑，麦温往下掉了一格。";
  return "这一下没咬住，评论区开始翻另一边。";
}

export function pressureRecapProfile({ budget = {}, choices = [], foundCount = 0 } = {}) {
  const max = Math.max(1, Number(budget.max ?? 1));
  const remaining = Math.max(0, Math.min(max, Number(budget.remaining ?? max)));
  const used = Math.max(0, Number(budget.used ?? max - remaining));
  const missCount = choices.filter((item) => /miss|detour|softening/.test(item.tone ?? "") && !item.core).length;
  const heldCount = choices.filter((item) => /hit|pressure-point|trust-but-verify|backflow-hit/.test(item.tone ?? "") || item.core).length;
  const guardCount = choices.filter((item) => item.tone === "caller-skeptical").length;
  const label = pressureRecapLabel({ remaining, max, missCount, heldCount, foundCount });
  return {
    label,
    line: pressureRecapLine({ label, used, missCount, heldCount, guardCount, foundCount }),
    remaining,
    max,
    used,
    missCount,
    heldCount,
    guardCount
  };
}

export function pressurePackProfile(rows = []) {
  const items = rows.map((row) => row.profile).filter(Boolean);
  const total = items.length;
  const lowCount = items.filter((item) => item.label === "差点断麦").length;
  const driftCount = items.filter((item) => item.label === "跑偏过").length;
  const heldCount = items.filter((item) => item.label === "压住了").length;
  const label = lowCount > 0 ? "有麦差点断" : driftCount > heldCount ? "弹幕跑过" : heldCount > 0 ? "现场压住" : "还在听";
  return {
    total,
    label,
    line: pressurePackLine({ label, lowCount, driftCount, heldCount }),
    comment: pressurePackComment({ label, lowCount, driftCount, heldCount })
  };
}

function pressureRecapLabel({ remaining, max, missCount, heldCount, foundCount }) {
  if (remaining <= Math.ceil(max * 0.2)) return "差点断麦";
  if (missCount > heldCount && missCount > 0) return "跑偏过";
  if (heldCount >= 2 || foundCount >= 2) return "压住了";
  return "还在听";
}

function pressureRecapLine({ label, used, missCount, heldCount, guardCount, foundCount }) {
  if (label === "差点断麦") return "这通麦几次快散掉，最后能收回来靠的是后面几块咬住的材料。";
  if (label === "跑偏过") return "中间有几次被外围话带走，弹幕吵起来以后才又拉回主线。";
  if (label === "压住了") {
    if (guardCount > 0) return "你不只追对方，也把来电人自己没说满的地方压回了麦上。";
    return foundCount >= 2 ? "关键几句和材料都压上来了，弹幕没能把话题带散。" : "这通麦没有靠吼，靠把能咬住的地方压住。";
  }
  return used > 0 || missCount > 0 ? "现场有点起噪，但还没散到断麦。" : "这通麦还在听，真正的压力没有完全顶上来。";
}

function pressurePackLine({ label, lowCount, driftCount, heldCount }) {
  if (label === "有麦差点断") return `${lowCount} 通麦差点散掉，整晚的压力不是只来自案情，也来自控场。`;
  if (label === "弹幕跑过") return `${driftCount} 通麦被外围话带偏过，后面能不能收住，靠材料和原话往回拉。`;
  if (label === "现场压住") return `${heldCount} 通麦被压住了，今晚不是靠站队，是靠把话留在证据能撑住的位置。`;
  return "整晚多数时候还在听，真正顶住现场的回合还不够多。";
}

function pressurePackComment({ label }) {
  if (label === "有麦差点断") return "「有几通差点炸麦，主播还是把话从弹幕里捞回来了。」";
  if (label === "弹幕跑过") return "「今晚不是没问到，是中间被带跑过，重开能换个压法。」";
  if (label === "现场压住") return "「这集最好看的地方是控场，没靠骂，靠一块块压住。」";
  return "「这晚还像刚接热线，听到了热闹，没完全压住现场。」";
}

function patienceLabelFor(level) {
  if (level === "low") return "快压不住";
  if (level === "mid") return "开始起噪";
  return "还在听";
}

function crowdState({ pressureSignal = "", foundCount = 0, level = "high", scene = "" }) {
  if (scene === "patienceLost" || level === "low") return "散了";
  if (pressureSignal === "drift") return "跑偏";
  if (pressureSignal === "held") return "压住";
  if (foundCount >= 2) return "追上";
  if (foundCount === 1) return "起疑";
  return "观望";
}

function callerGuardState({ pressureSignal = "", crowd = "", mood = "", sceneHint = {} }) {
  if (pressureSignal === "guarded" || sceneHint.callerGuard === "guarded") return "防备";
  if (crowd === "跑偏") return "防备";
  if (crowd === "压住") return "松动";
  if (mood === "tense") return "绷住";
  if (sceneHint.callerGuard === "tense") return "绷住";
  return "听着";
}

function liveCommentsFor({ crowd = "", foundCount = 0, intentHook = "", level = "high", routeAxis = "", routeAxisComments = {}, scene = "" }) {
  const hook = intentHook || "话太顺了";
  const axisComment = routeAxisCommentFor(routeAxis, routeAxisComments);
  if (scene === "patienceLost" || level === "low") return withAxisComment(["弹幕散了", "麦要断了", hook], axisComment);
  if (crowd === "跑偏") return withAxisComment(["弹幕跑散", hook, "人声压不住"], axisComment);
  if (crowd === "压住") return withAxisComment(["弹幕安静", hook, "那句对上了"], axisComment);
  if (foundCount >= 2) return withAxisComment(["弹幕刷得快", hook, "话还没完"], axisComment);
  if (foundCount === 1) return withAxisComment(["开始对上了", hook, "话没说满"], axisComment);
  return withAxisComment(["刚接进来", "弹幕在等", hook], axisComment);
}

function routeAxisCommentFor(routeAxis = "", routeAxisComments = {}) {
  const comments = routeAxisComments?.[routeAxis];
  if (!Array.isArray(comments) || comments.length === 0) return "";
  return comments[0] ?? "";
}

function withAxisComment(comments = [], axisComment = "") {
  if (!axisComment) return comments;
  return [comments[0], axisComment, comments[2] ?? comments[1]].filter(Boolean).slice(0, 3);
}

function expressionFor({ callerGuard = "", crowd = "", level = "high", mood = "", scene = "", sceneHint = {} }) {
  if (level === "low") return { kind: "pause", text: "停了很久才开口" };
  if (sceneHint.expression?.kind && sceneHint.expression?.text) return sceneHint.expression;
  if (callerGuard === "防备") return { kind: "shift", text: "把话咽回去半秒" };
  if (callerGuard === "松动") return { kind: "pause", text: "低头翻图，停了三秒" };
  if (crowd === "跑偏") return { kind: "blink", text: "连眨了两下" };
  if (scene === "deepFollowup") return { kind: "pause", text: "指尖停在屏幕上" };
  return null;
}
