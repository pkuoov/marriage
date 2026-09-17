import { statementStageForScene } from "../../src/runtime/statementReviewModel.js";
import { earnedDocumentQuestionsFor } from "../../src/runtime/documentMarkModel.js";

export function sceneReadingGroups(packet, indexes = []) {
  const visited = new Set();
  return indexes.flatMap((index) => {
    if (visited.has(index)) return [];
    const stage = statementStageForScene(packet, index);
    const group = stage?.sceneIndexes ?? [index];
    if (group.some((item) => !indexes.includes(item))) throw new Error(`${packet.caseId}: reading stage crosses night segments`);
    group.forEach((item) => visited.add(item));
    return [{ stage, indexes: group }];
  });
}

export function documentReadingQuestions(packet, marks = {}) {
  const documents = (packet.overnightStructure?.dayScenes ?? [])
    .filter((scene) => scene.kind === "document").map((scene) => packet.documents?.find((document) => document.id === scene.body?.documentId));
  const questions = [];
  for (const document of documents) {
    if (!document) throw new Error(`${packet.caseId}: reading route references missing day document`);
    const rows = marks[document.id];
    if (!rows?.length || rows.length > (document.markLimit ?? 3) || new Set(rows).size !== rows.length || rows.some((row) => !document.rows?.some((item) => item.rowId === row))) {
      throw new Error(`${packet.caseId}/${document.id}: reading route needs valid, reachable document marks`);
    }
    questions.push(...earnedDocumentQuestionsFor(document, rows));
  }
  for (const id of Object.keys(marks)) if (!documents.some((document) => document.id === id)) throw new Error(`${packet.caseId}/${id}: reading route marks a document not received during the day`);
  return questions;
}
