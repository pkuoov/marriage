export function caseIdsForSmokeTarget(target, sequence = [], reviewPart = "") {
  const chapterId = (chapter) => {
    const caseId = sequence[chapter - 1]?.caseId;
    if (!caseId) throw new Error(`smoke target ${target} needs chapter ${chapter}`);
    return caseId;
  };
  const all = sequence.map((item) => item.caseId).filter(Boolean);
  if (target === "all" || target === "testimony-reading" || target === "script-reading") return all;
  if (target === "six-review") {
    if (reviewPart === "quick") return [];
    if (reviewPart === "tony") return [chapterId(4)];
    if (reviewPart === "workplace") return [chapterId(2)];
    if (reviewPart === "consultation") return [chapterId(2), chapterId(3)];
    if (reviewPart === "profile") return [chapterId(3)];
    return [chapterId(2), chapterId(3), chapterId(4)];
  }
  if (target === "case34") return [chapterId(3), chapterId(2)];
  if (target === "case2-transition") return [chapterId(4)];
  if ([
    "case1",
    "local-quick",
    "focused-credit",
    "credit-replay",
    "credit-replay-path",
    "gamepad",
    "state-replacement"
  ].includes(target)) return [chapterId(1)];
  return [];
}
