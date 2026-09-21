import { actionDoneForState } from "./caseStateSelectors.js";
import { caseKey } from "./sceneAdvance.js";
import { normalizeTestimonyWallProgress, testimonyWallKey } from "./decisivePresentModel.js";

export function documentIsReceived(state = {}, brief = {}, document = {}) {
  const overnight = state.caseOvernights?.[caseKey(brief)] ?? {};
  const receipt = document.availableAt;
  if (receipt?.sceneId) {
    const index = (brief.sceneVersions ?? []).findIndex((scene) => scene.id === receipt.sceneId);
    if (index < 0) return false;
    if (actionDoneForState(state, brief, `version:${index}`)) return true;
    const wall = normalizeTestimonyWallProgress(state.testimonyWallProgress?.[testimonyWallKey(brief, brief.sceneVersions[index], index)]);
    return wall.act >= (receipt.act ?? 1) && wall.preludeSeen;
  }
  const dayDocument = (brief.overnightStructure?.dayScenes ?? []).some((scene) => scene.body?.documentId === document.id);
  return dayDocument && (overnight.segment === "day" || overnight.segment === "night2");
}

export function unlockedMaterialProfile({ state = {}, brief = {}, visible = true } = {}) {
  if (!visible) return emptyMaterialProfile();

  const evidenceCards = new Map((brief.evidenceCards ?? []).map((card) => [card.id, card]));
  const items = (brief.sceneVersions ?? []).flatMap((scene, index) => {
    if (!scene?.showsCard || !actionDoneForState(state, brief, `version:${index}`)) return [];
    const card = evidenceCards.get(scene.showsCard);
    if (!card) return [];
    return [{
      id: card.id,
      label: card.title ?? card.type ?? "随麦材料",
      kind: card.type ?? "材料",
      front: card.front ?? "",
      detail: card.detail ?? "",
      sourceTable: card.sourceTable
    }];
  });

  for (const document of brief.documents ?? []) {
    if (documentIsReceived(state, brief, document)) items.push({
      id: document.id,
      label: document.title ?? "银行流水摘录",
      kind: "已收到的材料",
      front: [document.description ?? document.subtitle, ...(document.rows ?? []).map((row) =>
        [row.date, row.kind, row.amount, row.party, row.memo].filter(Boolean).join(" · ")
      )].filter(Boolean).join("\n")
    });
  }

  const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());
  return {
    count: uniqueItems.length,
    label: uniqueItems.at(-1)?.label ?? "",
    items: uniqueItems
  };
}

function emptyMaterialProfile() {
  return {
    count: 0,
    label: "",
    items: []
  };
}
