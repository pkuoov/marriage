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
