export function livePressureProfile({
  budget = {},
  foundCount = 0,
  intentHook = "",
  pressureSignal = "",
  routeAxis = "",
  routeAxisComments = {},
  driftComments = [],
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
    comments: liveCommentsFor({ crowd, foundCount, intentHook, level, routeAxis, routeAxisComments, driftComments, scene }),
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

export function nextQuestionPressureSignal(state = {}) {
  return state.pendingQuestionPressureSignal ?? state.lastPressureSignal ?? "";
}

export function pressuredAnswerVariant(option = {}, { pressureSignal = "" } = {}) {
  const guarded = (pressureSignal === "drift" || pressureSignal === "guarded") && option.guardedAnswer;
  return {
    answer: guarded ? option.guardedAnswer : option.answer ?? "",
    guarded: Boolean(guarded)
  };
}

export function questionPressureReaction(option = {}, routeTone = "") {
  const tone = routeTone || option.routeTone || "";
  if (option.pressureReaction) return option.pressureReaction;
  if (tone === "softening") return "你把语气放缓，她没有立刻顶回来。";
  if (tone === "detour") return "话题岔开了一点，弹幕跟着聊起别的。";
  if (tone === "caller-skeptical") return "你把话问回咨询者这边，她停了一下。";
  if (tone === "pressure-point" || tone === "trust-but-verify") return "";
  return option.contradiction ? "这句问到了口子上。" : "";
}

export function materialPressureSignal(outcome = {}) {
  return outcome.correct ? "held" : "drift";
}

export function materialPressureReaction(outcome = {}, check = {}) {
  void check;
  if (outcome.correct) {
    return "弹幕开始往回翻前面的原话。";
  }
  return "弹幕一下分成了两拨。";
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
  const heldCount = items.filter((item) => item.label === "稳住了").length;
  const label = lowCount > 0 ? "有麦差点断" : driftCount > heldCount ? "弹幕跑过" : heldCount > 0 ? "现场稳住" : "还在听";
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
  if (heldCount >= 2 || foundCount >= 2) return "稳住了";
  return "还在听";
}

function pressureRecapLine({ label, used, missCount, heldCount, guardCount, foundCount }) {
  if (label === "差点断麦") return "有两次差点把人问挂了，后面靠材料圆了回来。";
  if (label === "跑偏过") return "中间被闲话带走过几次，后来拉了回来。";
  if (label === "稳住了") {
    if (guardCount > 0) return "对面的事你问到了，来电人自己没说满的地方，你也没放过。";
    return foundCount >= 2 ? "该问的几句问到了，材料也用上了，弹幕没跑题。" : "没吵起来，几处要紧的都问到了。";
  }
  return "这通问得少，听得多。";
}

function pressurePackLine({ label, lowCount, driftCount, heldCount }) {
  if (label === "有麦差点断") return `${lowCount} 通麦差点问挂，后面靠材料和原话拉了回来。`;
  if (label === "弹幕跑过") return `${driftCount} 通麦被外围话带偏过，后面靠材料和原话拉回来了。`;
  if (label === "现场稳住") return `${heldCount} 通麦问到了要紧处，今晚不是靠站队，是靠把话留在证据能撑住的位置。`;
  return "整晚多数时候还在听，问到要紧处的回合还不够多。";
}

function pressurePackComment({ label }) {
  if (label === "有麦差点断") return "「有几通差点炸麦，主播还是把话从弹幕里捞回来了。」";
  if (label === "弹幕跑过") return "「今晚不是没问到，是中间跑题过，后面又拉回来了。」";
  if (label === "现场稳住") return "「这集最好看的地方是控场，没靠骂，靠一句句问到。」";
  return "「这晚还像刚接热线，听到了热闹，问到要紧处的不算多。」";
}

function patienceLabelFor(level) {
  if (level === "low") return "快压不住";
  if (level === "mid") return "开始起噪";
  return "还在听";
}

function crowdState({ pressureSignal = "", foundCount = 0, level = "high", scene = "" }) {
  if (scene === "patienceLost" || level === "low") return "散了";
  if (pressureSignal === "drift") return "跑偏";
  if (pressureSignal === "held") return "稳住";
  if (foundCount >= 2) return "追上";
  if (foundCount === 1) return "起疑";
  return "观望";
}

function callerGuardState({ pressureSignal = "", crowd = "", mood = "", sceneHint = {} }) {
  if (pressureSignal === "guarded" || sceneHint.callerGuard === "guarded") return "防备";
  if (crowd === "跑偏") return "防备";
  if (crowd === "稳住") return "松动";
  if (mood === "tense") return "绷住";
  if (sceneHint.callerGuard === "tense") return "绷住";
  return "听着";
}

function liveCommentsFor({ crowd = "", foundCount = 0, intentHook = "", level = "high", routeAxis = "", routeAxisComments = {}, driftComments = [], scene = "" }) {
  const hook = intentHook || "话太顺了";
  const axisComment = routeAxisCommentFor(routeAxis, routeAxisComments);
  if (scene === "patienceLost" || level === "low") return withAxisComment(["弹幕散了", "麦要断了", hook], axisComment);
  if (crowd === "跑偏") return withAxisComment([driftCommentFor(driftComments) || "弹幕跑题", hook, "话题偏了"], axisComment);
  if (crowd === "稳住") return withAxisComment(["弹幕缓下来", hook, "那句对上了"], axisComment);
  if (foundCount >= 2) return withAxisComment(["弹幕刷得快", hook, "话还没完"], axisComment);
  if (foundCount === 1) return withAxisComment(["开始对上了", hook, "话没说满"], axisComment);
  return withAxisComment(["刚接进来", "弹幕在等", hook], axisComment);
}

function driftCommentFor(comments = []) {
  if (!Array.isArray(comments) || comments.length === 0) return "";
  return String(comments[0] ?? "");
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
