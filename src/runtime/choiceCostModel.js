export const CHOICE_COST_META = Object.freeze({
  dialogueQuestion: "补问 · 不收束",
  keyQuestion: "收束 · 未命中 −1 耐心",
  evidenceMark: "圈点 · 圈偏 −1 耐心",
  dayPlace: "耗时 1 · 占用一处走访",
  dayChoice: "现场判断 · 选后锁定",
  dayFollowup: "补问 · 不占额外走访",
  timelineCard: "排序 · 可清空重排",
  callbackOpener: "回拨开场 · 选后锁定",
  advisorRoute: "优先一条路线 · 选后锁定",
  skipAdvisor: "跳过委托 · 直接收束",
  nonScoredReply: "回应方式 · 不计分",
  finalQuestion: "终局追问 · 选后收麦",
  careChoice: "关怀选择 · 不计分",
  truthBoundary: "事实归位 · 选后锁定"
});

export function choiceCostMeta(kind = "") {
  return CHOICE_COST_META[kind] ?? "";
}
