export function documentsFor(brief = {}) {
  return Array.isArray(brief?.documents) ? brief.documents : [];
}

export function documentById(brief = {}, documentId = "") {
  return documentsFor(brief).find((document) => document.id === documentId) ?? null;
}

export function documentRowById(document = {}, rowId = "") {
  return (document?.rows ?? []).find((row) => row.rowId === rowId) ?? null;
}

export function documentQuestionId(documentId = "", kind = "row", rowIds = [], question = "") {
  const rows = (rowIds ?? []).join("+");
  let hash = 2166136261;
  for (const char of `${documentId}:${kind}:${rows}:${question}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${documentId}:${kind}:${rows}:${(hash >>> 0).toString(36)}`;
}

export function earnedDocumentQuestionsFor(document = {}, markedRows = []) {
  const marked = new Set(markedRows ?? []);
  const questions = [];
  for (const rowId of marked) {
    const rowQuestions = document?.rowQuestions?.[rowId] ?? [];
    rowQuestions.forEach((question) => {
      questions.push({
        ...question,
        id: documentQuestionId(document.id, "row", [rowId], question.question),
        documentId: document.id,
        kind: "row",
        rows: [rowId]
      });
    });
  }
  (document?.crossQuestions ?? []).forEach((question) => {
    const rows = question.rows ?? [];
    if (!rows.length || !rows.every((rowId) => marked.has(rowId))) return;
    questions.push({
      ...question,
      id: documentQuestionId(document.id, "cross", rows, question.question),
      documentId: document.id,
      kind: "cross",
      routeAxis: question.routeAxis ?? "money-flow"
    });
  });
  const seen = new Set();
  return questions.filter((question) => {
    const key = `${question.question}\n${question.answer}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
