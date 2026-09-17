import {
  advanceTestimonyAct, decisivePresentAvailability, pressTestimonyStatement,
  testimonyActForScene, testimonyActsForScene, testimonyStatementsForScene
} from "../../src/runtime/decisivePresentModel.js";

// One legal route: press only as needed to reveal the decisive statement.
// The runtime owns visibility, unlocks and act transitions.
export function testimonyReadingRoute(scene) {
  let progress = {};
  return testimonyActsForScene(scene).map(() => {
    const act = testimonyActForScene(scene, progress);
    const initialStatements = testimonyStatementsForScene(scene, progress);
    const presses = [];
    while (!decisivePresentAvailability(scene, progress).canStart) {
      const visible = testimonyStatementsForScene(scene, progress);
      const next = visible.find((statement) => !progress.pressedIds?.includes(statement.id));
      if (!next) throw new Error(`${scene.id}/${act.id}: decisive statement cannot be reached by visible PRESS actions`);
      progress = pressTestimonyStatement(scene, progress, next.id);
      const oldIds = new Set(visible.map((statement) => statement.id));
      presses.push({ statement: next, response: progress.activeResponse.text,
        revealed: testimonyStatementsForScene(scene, progress).filter((statement) => !oldIds.has(statement.id)) });
    }
    const present = act.decisivePresent;
    const target = testimonyStatementsForScene(scene, progress).find((statement) => statement.id === present.statementId);
    const material = present.materialCards?.find((card) => card.id === present.evidenceId);
    if (!target || !material) throw new Error(`${scene.id}/${act.id}: missing visible target or authored material`);
    const result = { act, initialStatements, presses, present, target, material };
    progress = advanceTestimonyAct(scene, progress);
    return result;
  });
}
