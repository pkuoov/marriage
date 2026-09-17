export function materialOperationOutcome(check = {}, checkIndex = 0, optionIndex = 0) {
  const option = check.options?.[optionIndex] ?? check.options?.[0] ?? {};
  const correct = Boolean(option.correct);
  const fullContradiction = option.contradiction ?? check.contradiction ?? "";
  const routeAxis = option.routeAxis ?? "document-edge";
  const label = option.label ?? "";
  return {
    checkIndex,
    optionIndex,
    correct,
    spend: !correct,
    contradiction: correct ? fullContradiction : "",
    pick: {
      optionIndex,
      label,
      feedback: option.feedback ?? "",
      reactionLine: option.reactionLine ?? "",
      revisesScene: option.revisesScene,
      contradiction: fullContradiction,
      routeAxis,
      selectionMode: check.selectionMode ?? "single",
      correct
    },
    routeChoice: {
      question: check.prompt ?? "",
      answer: label,
      contradiction: correct ? fullContradiction : "",
      routeAxis,
      routeTone: correct ? "evidence-hit" : "evidence-miss"
    },
    pressure: correct ? "material-hit" : "material-miss"
  };
}

export function materialOperationMark(check = {}, checkIndex = 0) {
  const label = check.materialType ?? check.type ?? "料";
  return {
    mark: "料",
    label,
    question: check.prompt ?? "",
    material: check.material ?? ""
  };
}

export function materialInquiryLines(check = {}, pick = {}) {
  const option = check.options?.find(option => option.id === pick.optionId) ?? check.options?.[pick.optionIndex];
  if (!check.spokenInquiry || !option) return null;
  return [{ role: "host", text: option.question ?? option.label },
    ...(option.lines ?? (option.reactionLine ? [{ role: "caller", text: option.reactionLine }] : [])),
    ...(pick.correct && pick.revisedVersion ? [{ role: "caller", text: pick.revisedVersion }] : [])];
}
