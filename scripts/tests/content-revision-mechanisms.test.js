import test from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, writeFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createContentReload } from "../lib/dev-reload.js";
import { ensureContentIndex } from "../lib/content-build.js";
import { validateContentRevision } from "../lib/content-contracts.js";
import { baseState, stateSnapshotForPersistence, normalizeRuntimeState } from "../../src/state.js";
import { refreshSavedCaseContent } from "../../src/runtime/savedContentRefresh.js";
import { testimonyWallHtml } from "../../src/ui/decisivePresentView.js";
import { statementReplayPageChoicesHtml } from "../../src/ui/statementReviewView.js";
import { statementLinesFromText } from "../../src/runtime/statementReviewModel.js";
import { toggleDocumentMarks } from "../../src/runtime/documentMarkModel.js";
import { currentLiveCounterPick } from "../../src/runtime/liveCounterModel.js";
import { liveCounterBeatHtml } from "../../src/ui/liveCounterBeatView.js";

const contentPath = "content/packs/steam-demo-01/cases/01-credit.json";
const packet = JSON.parse(await readFile(new URL(`../../${contentPath}`, import.meta.url), "utf8"));

test("生成期间再次改稿：最后一次生成成功后才刷新一次", async () => {
  let release, calls = 0, reloads = 0;
  const queue = createContentReload({ build: async () => { calls++; if (calls === 1) await new Promise((r) => { release = r; }); }, reload: () => reloads++ });
  queue.changed(contentPath);
  const work = queue.flush();
  queue.changed("src/generated/contentPackIndex.js");
  queue.changed(contentPath);
  assert.equal(reloads, 0);
  release();
  await work;
  assert.equal(calls, 2);
  assert.equal(reloads, 1);
});

test("生成失败不刷新也不伪装成功；后续修稿能恢复", async () => {
  let broken = true, reloads = 0;
  const queue = createContentReload({ build: async () => { if (broken) throw Error("invalid content"); }, reload: () => reloads++ });
  queue.changed(contentPath);
  await assert.rejects(queue.flush(), /invalid content/);
  await assert.rejects(queue.flush(), /invalid content/);
  assert.equal(reloads, 0);
  broken = false;
  queue.changed(contentPath);
  await queue.flush();
  assert.equal(reloads, 1);
});

test("编辑器修改记录不触发重载或重新生成", async () => {
  const queue = createContentReload({ build: () => assert.fail("unexpected build"), reload: () => assert.fail("unexpected reload") });
  queue.changed("content/editor/revisions/record.json");
  await queue.flush();
});

test("真实源文件生成：更新可见、无改动不重写、坏稿不破坏上一份索引", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "love-content-revision-"));
  try {
    for (const directory of ["src", "scripts", "content"]) await cp(new URL(`../../${directory}`, import.meta.url), resolve(temporary, directory), { recursive: true });
    await writeFile(resolve(temporary, "package.json"), '{"type":"module"}');
    await ensureContentIndex(temporary);
    const output = resolve(temporary, "src/generated/contentPackIndex.js");
    const before = await stat(output);
    await ensureContentIndex(temporary);
    assert.equal((await stat(output)).mtimeMs, before.mtimeMs);
    const modified = structuredClone(packet);
    modified.sceneVersions[0].questionOptions[0].answer += " 内容更新测试。";
    modified.sceneVersions[0].questionOptions[0].lines.push({ role: "caller", text: " 内容更新测试。" });
    await writeFile(resolve(temporary, contentPath), JSON.stringify(modified));
    await ensureContentIndex(temporary);
    const valid = await readFile(output, "utf8");
    assert.match(valid, /内容更新测试/);
    await writeFile(resolve(temporary, contentPath), "{");
    await assert.rejects(ensureContentIndex(temporary));
    assert.equal(await readFile(output, "utf8"), valid);
  } finally { await rm(temporary, { recursive: true, force: true }); }
});

test("真实保存裁剪后仍能更新活动回答，并沿身份迁移场景、选项和完成记录", () => {
  const old = { id: "save", sceneVersions: [{ id: "a", questionOptions: [{ id: "q", question: "旧问", answer: "旧答", correct: true }] }] };
  const state = { ...structuredClone(baseState), caseMode: "daily", screen: "chapter", caseBriefs: [old], scene: "sceneQuestionAnswer",
    sceneQuestionFocus: { caseId: "save", sceneIndex: 0, kind: "key", optionIndex: 0 },
    sceneQuestionPicks: { "save:scene:0": { optionId: "q", optionIndex: 0, question: "旧问", answer: "旧答" } },
    caseActionLog: { save: { "version:0": true, "sceneQuestion:0:0": true } } };
  const snapshot = JSON.parse(JSON.stringify(stateSnapshotForPersistence(state)));
  assert.equal(snapshot.caseBriefs[0].sceneVersions, undefined);
  assert.doesNotMatch(JSON.stringify(snapshot.caseBriefs), /旧问|旧答/);
  const current = { id: "save", sceneVersions: [{ id: "b" }, { id: "a", questionOptions: [{ id: "new" }, { id: "q", question: "新问", answer: "新答", correct: true }] }] };
  const result = refreshSavedCaseContent(normalizeRuntimeState(snapshot), { generateCases: () => [current] });
  assert.equal(result.sceneQuestionPicks["save:scene:1"].answer, "新答");
  assert.equal(result.sceneQuestionFocus.sceneIndex, 1);
  assert.equal(result.sceneQuestionFocus.optionIndex, 1);
  assert.equal(result.caseActionLog.save["sceneQuestion:1:1"], true);
  assert.equal(result.caseActionLog.save["version:1"], true);
  assert.equal(result.caseActionLog.save["version:0"], undefined);
  // A second save must preserve the identity map, not collapse it back to a stub.
  const again = refreshSavedCaseContent(stateSnapshotForPersistence(result), { generateCases: () => [current] });
  assert.equal(again.sceneQuestionPicks["save:scene:1"].answer, "新答");
});

test("没有身份表的早期摘要存档也必须刷新可匹配的选项快照", () => {
  const b = { id: "save", sceneVersions: [{ id: "s", questionOptions: [{ id: "q", question: "更新问", answer: "更新答", correct: true }] }] };
  const result = refreshSavedCaseContent({ caseBriefs: [{ id: "save" }], sceneQuestionPicks: { "save:scene:0": { optionId: "q", answer: "旧内容" } } }, { generateCases: () => [b] });
  assert.equal(result.sceneQuestionPicks["save:scene:0"].answer, "更新答");
});

test("离开回答页后遗留的焦点不能把当前回放拖回上一段", () => {
  const b = { id: "save", sceneVersions: [{ id: "first", questionOptions: [{ id: "q", question: "问", answer: "答", correct: true }] }, { id: "second", version: "第二段原话。" }] };
  const input = { caseBriefs: [b], scene: "sceneLineReplay", dialogueProgress: { "save:sceneReview": 1 }, activeStatementLineId: "second:0",
    sceneQuestionFocus: { caseId: "save", sceneIndex: 0, kind: "key", optionIndex: 0 },
    sceneQuestionPicks: { "save:scene:0": { optionId: "q", optionIndex: 0 } } };
  const result = refreshSavedCaseContent(stateSnapshotForPersistence(input), { generateCases: () => [b] });
  assert.equal(result.scene, "sceneLineReplay");
  assert.equal(result.dialogueProgress["save:sceneReview"], 1);
  assert.equal(result.activeStatementLineId, "second:0");
});

test("证词墙显示当前回应，删除回应也不读取旧存档里的正文", () => {
  const statement = { id: "s", text: "陈述", pressResponse: "更新追问回应" };
  const input = { wallAct: { statements: [statement] }, statements: [statement], wallProgress: { activeResponse: { kind: "press", statementId: "s", text: "陈旧缓存" } } };
  assert.match(testimonyWallHtml(input), /更新追问回应/);
  assert.doesNotMatch(testimonyWallHtml(input), /陈旧缓存/);
  delete statement.pressResponse;
  assert.doesNotMatch(testimonyWallHtml(input), /陈旧缓存|testimony-response/);
});

test("内容门禁拦截丢失身份、跨菜单重复身份、失效材料行及无法标全的组合", () => {
  const invalid = (mutate, message) => { const p = structuredClone(packet); mutate(p); assert.throws(() => validateContentRevision(p), message); };
  validateContentRevision(packet);
  invalid((p) => delete p.sceneVersions[0].questionOptions[0].id, /stable id/);
  invalid((p) => p.sceneVersions[0].casualQuestions = [p.sceneVersions[0].questionOptions[0]], /duplicate id/);
  invalid((p) => p.documents[0].rowQuestions = { deleted: [{ id: "new-q" }] }, /unknown row/);
  invalid((p) => { p.documents[0].crossQuestions = [{ id: "fixture-q", rows: [p.documents[0].rows[0].rowId], question: "哪天到账？", answer: "当天。" }]; p.documents[0].markLimit = 0; }, /markLimit/);
  invalid((p) => p.documents[0].availableAt = { sceneId: "deleted-scene" }, /missing scene/);
  invalid((p) => delete p.overnightStructure.dayScenes[0].body.sourceNote, /sourceNote/);
  invalid((p) => p.documents[0].rows.push(p.documents[0].rows[0]), /duplicate rowId/);
  invalid((p) => delete p.documents[0].rows[0].rowId, /stable rowId/);
  invalid((p) => p.overnightStructure.dayScenes.push(p.overnightStructure.dayScenes[0]), /duplicate id/);
  const act = (p) => p.sceneVersions.find((scene) => scene.testimonyWall).testimonyWall.acts[0];
  invalid((p) => act(p).statements.push(act(p).statements[0]), /duplicate id/);
  invalid((p) => act(p).statements[0].reveals = ["deleted-statement"], /missing statement/);
  invalid((p) => act(p).decisivePresent.evidenceId = "deleted-evidence", /missing evidence/);
  invalid((p) => p.documents[0].availableAt = { sceneId: p.sceneVersions.find((scene) => scene.testimonyWall).id, act: 0 }, /missing act/);
});

test("真实读档：插句及重排后已问记录跟随问题，新句仍可询问", () => {
  const oldScene = { id: "s", version: "钱是他转的。后来我问过他。", reviewProbes: [
    { id: "p", sourceAnchor: "后来我问过他", question: "问了什么？", answer: "问了日期。" }
  ] };
  const old = { id: "save", sceneVersions: [oldScene] };
  const state = { ...structuredClone(baseState), caseBriefs: [old], scene: "sceneLineReplay",
    dialogueProgress: { "save:sceneReview": 0 }, activeStatementLineId: "s:1",
    statementReviewAttempts: { "save:scene:0": ["s:1"] }, statementPatience: { saved: { remaining: 2, used: 1, max: 3 } } };
  const current = structuredClone(old);
  const scene = current.sceneVersions[0];
  scene.version = "钱是他转的。今天又来催了。后来我问过他。";
  scene.reviewProbes.push({ id: "new-p", sourceAnchor: "今天又来催了", question: "今天怎么说？", answer: "让我还钱。" });
  const snapshot = JSON.parse(JSON.stringify(stateSnapshotForPersistence(state)));
  assert.doesNotMatch(JSON.stringify(snapshot.caseBriefs), /钱是他转的|后来我问过他/);
  const result = refreshSavedCaseContent(normalizeRuntimeState(snapshot), { generateCases: () => [current] });
  assert.deepEqual(result.statementReviewAttempts["save:scene:0"], ["s:2"]);
  assert.equal(result.activeStatementLineId, "s:2");
  assert.deepEqual(result.statementPatience, state.statementPatience);
  const lines = statementLinesFromText(scene.version, { prefix: "s" });
  const choices = (line) => statementReplayPageChoicesHtml({ scene, line, attempted: result.statementReviewAttempts["save:scene:0"].includes(line.id) });
  assert.match(choices(lines[1]), /data-scene-review-line="s:1"/);
  assert.match(choices(lines[1]), /询问这句/);
  assert.doesNotMatch(choices(lines[2]), /问了什么/);
  const again = refreshSavedCaseContent(stateSnapshotForPersistence(result), { generateCases: () => [current] });
  assert.deepEqual(again.statementReviewAttempts, result.statementReviewAttempts);
});

test("删除旧问题后同位置的新问题不会继承已问；早期存档不猜句子身份", () => {
  const old = { id: "save", sceneVersions: [{ id: "s", version: "他说今晚给。", reviewProbes: [{ id: "removed", sourceAnchor: "今晚给" }] }] };
  const current = { id: "save", sceneVersions: [{ id: "s", version: "他说今晚给。", reviewProbes: [{ id: "new", sourceAnchor: "今晚给" }] }] };
  for (const brief of [old, { id: "save", contentIdentity: { sceneVersions: [{ id: "s", reviewProbes: [{ id: "removed" }] }] } }]) {
    const state = { caseBriefs: [brief], statementReviewAttempts: { "save:scene:0": ["s:0"] }, activeStatementLineId: "s:0" };
    const result = refreshSavedCaseContent(stateSnapshotForPersistence(state), { generateCases: () => [current] });
    assert.deepEqual(result.statementReviewAttempts["save:scene:0"], []);
  }
});

test("删行后读档释放隐藏标注名额，并移除旧回答缓存", () => {
  const doc = { id: "doc", rows: [{ rowId: "kept" }, { rowId: "new" }], markLimit: 2,
    rowQuestions: { kept: [{ id: "q", question: "当前问题", answer: "当前回答" }] } };
  const brief = { id: "save", sceneVersions: [], documents: [doc], overnightStructure: { flowMode: "linear", dayScenes: [] } };
  const state = { caseBriefs: [brief], caseOvernights: { save: {
    documentMarks: { doc: ["deleted", "kept", "kept"], "deleted-document": ["orphan"] },
    documentEarnedQuestions: [{ id: "removed", documentId: "doc", kind: "row", rows: ["deleted"], question: "陈旧问题" },
      { id: "q", documentId: "doc", kind: "row", rows: ["kept"], question: "旧问" }],
    documentAnsweredQuestions: { removed: true, q: true }, activeDocumentQuestionId: "removed"
  } } };
  const result = refreshSavedCaseContent(stateSnapshotForPersistence(state), { generateCases: () => [brief] });
  const day = result.caseOvernights.save;
  assert.deepEqual(day.documentMarks, { doc: ["kept"] });
  assert.deepEqual(toggleDocumentMarks(doc, day.documentMarks.doc, "new"), ["kept", "new"]);
  assert.deepEqual(day.documentAnsweredQuestions, { q: true });
  assert.equal(day.activeDocumentQuestionId, null);
  assert.equal(day.documentEarnedQuestions[0].answer, "当前回答");
});

test("组合材料行重排不使同一个已答问题重新出现", () => {
  const doc = { id: "d", rows: [{ rowId: "a" }, { rowId: "b" }], crossQuestions: [{ id: "q", rows: ["b", "a"], question: "新问", answer: "新答" }] };
  const brief = { id: "save", documents: [doc], overnightStructure: { flowMode: "linear", dayScenes: [] } };
  const state = { caseBriefs: [brief], caseOvernights: { save: {
    documentMarks: { d: ["a", "b"] }, documentEarnedQuestions: [{ id: "q", documentId: "d", kind: "cross", rows: ["a", "b"], question: "旧问" }],
    documentAnsweredQuestions: { q: true }, activeDocumentQuestionId: "q"
  } } };
  const result = refreshSavedCaseContent(stateSnapshotForPersistence(state), { generateCases: () => [brief] });
  assert.equal(result.caseOvernights.save.documentAnsweredQuestions.q, true);
  assert.equal(result.caseOvernights.save.activeDocumentQuestionId, "q");
});

test("删掉现场选择后恢复可点击按钮，历史后果仍留在存档", () => {
  const beat = { id: "beat", choices: [{ id: "current", label: "现在的回应" }] };
  const oldPick = { choiceId: "removed", label: "旧回应", endingImpact: "platform-data-loss" };
  assert.equal(currentLiveCounterPick(beat, oldPick), null);
  assert.match(liveCounterBeatHtml(beat, oldPick), /data-live-counter-choice="current"/);
  assert.doesNotMatch(liveCounterBeatHtml(beat, oldPick), /旧回应/);
  assert.equal(currentLiveCounterPick(beat, { choiceId: "current" }).choiceId, "current");
  assert.doesNotMatch(liveCounterBeatHtml(beat, { choiceId: "current" }), /data-live-counter-choice/);
  const b = { id: "save", overnightStructure: { liveCounterBeats: [beat] } };
  const saved = { caseBriefs: [b], liveCounterPicks: { "save:beat": oldPick } };
  const result = refreshSavedCaseContent(stateSnapshotForPersistence(saved), { generateCases: () => [b] });
  assert.equal(result.liveCounterPicks["save:beat"].endingImpact, "platform-data-loss");
});

test("朋友访谈先回答反应，再由主播问后续联系；作者授权备注不混入玩家提示", async () => {
  const b = JSON.parse(await readFile(new URL("../../content/packs/steam-demo-01/cases/02-tony.json", import.meta.url), "utf8"));
  const body = b.overnightStructure.dayScenes.find((scene) => scene.id === "day-tony-friend-studio").body;
  const reply = body.beats.find((beat) => beat.id === "day-tony-friend-studio:beat:2");
  const followup = body.beats.find((beat) => beat.id === "day-tony-friend-studio:beat:3");
  assert.equal(reply.speaker, "小姐妹");
  assert.match(reply.text, /钱够不够/);
  assert.equal(followup.speaker, "你");
  assert.doesNotMatch(followup.text, /怎么又让她别转/);
  assert.ok(body.beats.indexOf(reply) < body.beats.indexOf(followup));
  assert.notEqual(body.sourceNote, body.access);
  for (const file of ["overnightScreens.js", "overnightDocumentScreens.js"]) {
    const source = await readFile(new URL(`../../src/ui/screens/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /escapeHtml\((?:dayScene\.)?body\.access\)/);
  }
});
