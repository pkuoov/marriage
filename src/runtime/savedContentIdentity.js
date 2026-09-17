import { dialogueReadingKey } from "./dialoguePresentation.js";
import { statementLinesFromText } from "./statementReviewModel.js";

// Save identities, not dialogue. Reordering a scene or moving a question between
// menus must not reinterpret the player's earlier action by its array position.
export function caseContentIdentity(brief = {}) {
  const identities = (items = []) => items.map(({ id }) => ({ id }));
  return {
    sceneVersions: (brief.sceneVersions ?? []).map((scene) => ({
      id: scene.id,
      testimonyRevision: scene.testimonyWall?.revision ?? null,
      reviewLines: sceneReviewLineIdentities(scene),
      questionOptions: identities(scene.questionOptions),
      casualQuestions: identities(scene.casualQuestions),
      dialogueOptions: identities(scene.dialogueOptions),
      reviewProbes: identities(scene.reviewProbes)
    })),
    evidenceChecks: (brief.evidenceChecks ?? []).map((check) => ({ id: check.id, options: identities(check.options) }))
  };
}

export function sceneReviewLineIdentities(scene = {}) {
  if (Array.isArray(scene.reviewLines)) return scene.reviewLines;
  return [...new Set([scene.version, scene.revisedVersion].filter(Boolean))].flatMap((version) =>
    statementLinesFromText(version, { prefix: scene.id }).map((line) => ({
      id: line.id,
      signature: dialogueReadingKey([line.text], scene.id),
      probeIds: (scene.reviewProbes ?? []).filter((probe) => probe.sourceAnchor && line.text.includes(probe.sourceAnchor)).map((probe) => probe.id)
    })));
}

// Sentence positions are disposable. Preserve an attempted question only when
// its authored identity still exists; a new question on the same line is new.
export function remapReviewLines(oldScene, scene, attempted = [], activeLineId = null) {
  const before = sceneReviewLineIdentities(oldScene);
  const after = sceneReviewLineIdentities(scene);
  const attempts = [...new Set(attempted.flatMap((id) => {
    const oldLines = before.filter((line) => line.id === id);
    // Original/revised versions may reuse a position for different sentences.
    // Without a unique correspondence, reopen the optional question instead
    // of marking an unrelated new question as already asked.
    if (new Set(oldLines.map((line) => line.signature)).size !== 1) return [];
    const probes = new Set(oldLines.flatMap((line) => line.probeIds));
    const ids = [...new Set(after.filter((line) => line.probeIds.some((probe) => probes.has(probe))).map((line) => line.id))];
    return ids.length === 1 ? ids : [];
  }))];
  const oldLines = before.filter((line) => line.id === activeLineId);
  const exact = after.filter((line) => oldLines.some((old) => old.signature === line.signature));
  const matched = exact.length ? exact : after.filter((line) => oldLines.some((old) => old.probeIds.some((id) => line.probeIds.includes(id))));
  const ids = [...new Set(matched.map((line) => line.id))];
  return { attempts, activeLineId: ids.length === 1 ? ids[0] : null };
}
