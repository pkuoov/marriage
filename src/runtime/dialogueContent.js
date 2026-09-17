// The short answer is a fallback. Authored multi-speaker lines replace it;
// they are not an appendix to be played after the short answer.
export function answerDialogueLines(answer = {}) {
  if (Array.isArray(answer.lines) && answer.lines.length) return answer.lines;
  return answer.answer ? [{ role: "caller", text: answer.answer }] : [];
}
