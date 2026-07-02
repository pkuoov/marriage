export function livePressureProfile({
  budget = {},
  foundCount = 0,
  intentHook = "",
  reaction = "",
  scene = "",
  sceneText = "",
  mood = "listening"
} = {}) {
  const max = Math.max(1, Number(budget.max ?? 1));
  const remaining = Math.max(0, Math.min(max, Number(budget.remaining ?? max)));
  const ratio = remaining / max;
  const level = scene === "patienceLost" || ratio <= 0.28 ? "low" : ratio <= 0.55 ? "mid" : "high";
  const crowd = crowdState({ reaction, foundCount, level, scene });
  const callerGuard = callerGuardState({ reaction, crowd, mood, sceneText });
  return {
    max,
    remaining,
    ratio,
    level,
    crowd,
    callerGuard,
    patienceLabel: patienceLabelFor(level),
    comments: liveCommentsFor({ crowd, foundCount, intentHook, level, scene }),
    expression: expressionFor({ reaction, callerGuard, crowd, level, mood, scene, sceneText })
  };
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

export function materialPressureReaction(outcome = {}, check = {}) {
  if (outcome.correct) {
    if (/审批|付款|收款|返款|垫款|供应商/.test(`${check.title ?? ""}${check.material ?? ""}`)) return "这块圈住了，钱路终于有了落点。";
    if (/表|排班|名单|备注/.test(`${check.title ?? ""}${check.material ?? ""}`)) return "表里这一格被圈出来，弹幕突然不刷了。";
    return "这块圈住了，前面那句开始变味。";
  }
  if (/截图|图|表|账|审批|流水/.test(outcome.pick?.label ?? "")) return "弹幕被这块带跑，麦温往下掉了一格。";
  return "这一下没咬住，评论区开始翻另一边。";
}

function patienceLabelFor(level) {
  if (level === "low") return "快压不住";
  if (level === "mid") return "开始起噪";
  return "还在听";
}

function crowdState({ reaction = "", foundCount = 0, level = "high", scene = "" }) {
  if (scene === "patienceLost" || level === "low") return "散了";
  if (/带跑|没咬住|跑偏|吵得更散|麦温往下/.test(reaction)) return "跑偏";
  if (/咬住|圈住|短暂安静|重新翻出来|拉回来/.test(reaction)) return "压住";
  if (foundCount >= 2) return "追上";
  if (foundCount === 1) return "起疑";
  return "观望";
}

function callerGuardState({ reaction = "", crowd = "", mood = "", sceneText = "" }) {
  if (/来电人自己|自己身上|工资|流水|为什么/.test(reaction)) return "防备";
  if (crowd === "跑偏") return "防备";
  if (crowd === "压住") return "松动";
  if (mood === "tense") return "绷住";
  if (/流程|审批|供应商|工资卡|流水|协议/.test(sceneText)) return "绷住";
  return "听着";
}

function liveCommentsFor({ crowd = "", foundCount = 0, intentHook = "", level = "high", scene = "" }) {
  const hook = intentHook || "话太顺了";
  if (scene === "patienceLost" || level === "low") return ["弹幕散了", "麦要断了", hook];
  if (crowd === "跑偏") return ["弹幕跑散", hook, "人声压不住"];
  if (crowd === "压住") return ["弹幕安静", hook, "那句对上了"];
  if (foundCount >= 2) return ["弹幕刷得快", hook, "话还没完"];
  if (foundCount === 1) return ["开始对上了", hook, "话没说满"];
  return ["刚接进来", "弹幕在等", hook];
}

function expressionFor({ reaction = "", callerGuard = "", crowd = "", level = "high", mood = "", scene = "", sceneText = "" }) {
  if (level === "low") return { kind: "pause", text: "停了很久才开口" };
  if (callerGuard === "防备") return { kind: "shift", text: "把话咽回去半秒" };
  if (callerGuard === "松动") return { kind: "pause", text: "低头翻图，停了三秒" };
  if (crowd === "跑偏") return { kind: "blink", text: "连眨了两下" };
  if (/麦温|人声|弹幕有人替/.test(reaction)) return { kind: "blink", text: "连眨了两下" };
  if (/老板娘|年卡|投店|带客|只有我能接住|你和别人不一样/.test(sceneText)) return { kind: "shift", text: "像把稿背到一半" };
  if (/主责|审批|预算|复盘|付款|供应商|流程|报销/.test(sceneText)) return { kind: "pause", text: "流程词说得很顺" };
  if (/介绍人|名校|MBA|条件不错|工资卡|流水/.test(sceneText)) return { kind: "blink", text: "笑了一下又停住" };
  if (/不写才像一家人|不信我|协议|房本|还贷/.test(sceneText)) return { kind: "shift", text: "听到亲近话就低头" };
  if (/结婚|低我一头|最低还款|周转|今晚就要/.test(sceneText)) return { kind: "pause", text: "那句说得太熟了" };
  if (scene === "deepFollowup") return { kind: "pause", text: "指尖停在屏幕上" };
  return null;
}
