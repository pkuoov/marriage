import test from "node:test";
import assert from "node:assert/strict";
import { activeSaveSlot } from "../../src/platform/saveStore.js";
import { caseContentIdentity } from "../../src/runtime/savedContentIdentity.js";
import { stateSnapshotForPersistence } from "../../src/state.js";

const PERSISTED_CASE_BRIEF_KEYS = Object.freeze([
  "id",
  "storyKey",
  "weeklyKey",
  "dailyKey",
  "plotId",
  "complainantId",
  "respondentId",
  "caseId",
  "runtimeContentCaseId",
  "caseMode"
]);

function legacyCaseBriefStub(brief = {}) {
  const stub = Object.fromEntries(PERSISTED_CASE_BRIEF_KEYS
    .filter((key) => brief[key] !== undefined && brief[key] !== null && brief[key] !== "")
    .map((key) => [key, brief[key]]));
  if (brief.sceneVersions) stub.contentIdentity = caseContentIdentity(brief);
  else if (brief.contentIdentity) stub.contentIdentity = brief.contentIdentity;
  return stub;
}

function legacyStateSnapshot(state = {}) {
  const snapshot = structuredClone({ ...state, saveSlot: activeSaveSlot() });
  delete snapshot.saveLoadError;
  delete snapshot.saveWriteError;
  snapshot.caseBriefs = (snapshot.caseBriefs ?? []).map(legacyCaseBriefStub);
  delete snapshot.caseBrief;
  return snapshot;
}

test("存档快照跳过案件深拷贝后与旧实现逐字段一致，且不改传入的 state", () => {
  const brief = {
    id: "episode-1",
    storyKey: "steam-demo-01",
    plotId: "lost-job-hidden-credit",
    complainantId: "shen",
    respondentId: "xu",
    caseId: "01-credit",
    runtimeContentCaseId: "01-credit",
    caseMode: "episode",
    openingDialogue: [{ text: "这段台词不应进入存档" }],
    sceneVersions: [{ id: "credit-opening", version: "x".repeat(4000), questionOptions: [{ id: "q1" }] }]
  };
  const state = {
    screen: "chapter",
    caseBriefs: [brief],
    caseBrief: brief,
    sceneAnswers: { kept: { nested: "玩家选择" } },
    saveLoadError: "transient",
    saveSlot: "not-the-active-slot",
    saveWriteError: "transient"
  };
  const before = structuredClone(state);
  const next = stateSnapshotForPersistence(state);
  const previous = legacyStateSnapshot(before);
  assert.equal(JSON.stringify(next), JSON.stringify(previous));
  assert.deepEqual(state, before);
  assert.equal(next.saveSlot, activeSaveSlot());
  assert.equal(Object.hasOwn(next, "caseBrief"), false);
  assert.equal(next.caseBriefs[0].openingDialogue, undefined);
  assert.equal(state.caseBriefs[0].openingDialogue[0].text, "这段台词不应进入存档");
});

test("没有案件正文的存档仍写出空 caseBriefs，字段顺序与旧实现一致", () => {
  const state = { screen: "title", chapter: 1 };
  const before = structuredClone(state);
  assert.equal(JSON.stringify(stateSnapshotForPersistence(state)), JSON.stringify(legacyStateSnapshot(before)));
  assert.deepEqual(state, before);
});
