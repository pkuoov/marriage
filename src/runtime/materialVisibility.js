import { actionDoneForState } from "./caseStateSelectors.js";
import { caseKey } from "./sceneAdvance.js";

export function unlockedMaterialProfile({ state = {}, brief = {}, visible = true } = {}) {
  if (!visible) return emptyMaterialProfile();

  const evidenceCards = new Map((brief.evidenceCards ?? []).map((card) => [card.id, card]));
  const items = (brief.sceneVersions ?? []).flatMap((scene, index) => {
    if (!scene?.showsCard || !actionDoneForState(state, brief, `version:${index}`)) return [];
    const card = evidenceCards.get(scene.showsCard);
    if (!card) return [];
    return [{
      id: card.id,
      label: card.title ?? card.type ?? "随麦材料"
    }];
  });

  const key = caseKey(brief);
  const receivedAfterHangup = Boolean(
    state.caseNights?.[key]?.hangupDone
    || state.caseOvernights?.[key]?.hangupDone
  );
  if (receivedAfterHangup && brief.storyClueObject) {
    items.push({
      id: `${key}:story-clue-object`,
      label: brief.storyClueObject
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
