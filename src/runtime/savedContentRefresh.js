import { earnedDocumentQuestionsFor } from "./documentMarkModel.js";
import { sceneDialogueOptions } from "../ui/sceneQuestions.js";
import { answerKey, caseKey, evidenceAnswerKey, evidenceChecksFor } from "./sceneAdvance.js";
import { statementLinesFromText, statementMissReactionForOption, statementStageForScene } from "./statementReviewModel.js";
import { normalizeTestimonyWallProgress, testimonyWallKey } from "./decisivePresentModel.js";
import { remapReviewLines } from "./savedContentIdentity.js";
import { completedChoicePrefix, nextSequentialChoice, sceneQuestionSequence } from "./sequentialChoices.js";
import { callerQuestionProgress } from "./callerQuestionSequence.js";
import { timelineSortComplete } from "./nightOvernightModel.js";

export function refreshSavedCaseContent(state = {}, { generateCases, npcs = [] } = {}) {
  if (!Array.isArray(state.caseBriefs) || !state.caseBriefs.length || typeof generateCases !== "function") return state;
  const firstBrief = state.caseBriefs[0] ?? {};
  const mode = state.caseMode === "daily" ? "daily" : "episode";
  const options = mode === "daily"
    ? {
        dailyKey: firstBrief.dailyKey,
        plotId: firstBrief.plotId,
        runtimeCaseId: firstBrief.runtimeContentCaseId ?? firstBrief.caseId,
        complainantId: firstBrief.complainantId,
        respondentId: firstBrief.respondentId
      }
    : {
        storyKey: firstBrief.storyKey ?? firstBrief.weeklyKey
      };
  try {
    const refreshed = generateCases(npcs, state.attrs ?? {}, options);
    if (!Array.isArray(refreshed) || !refreshed.length) return contentRefreshFailure(state);
    const chapterIndex = Math.max(0, Math.min(refreshed.length - 1, Number(state.chapter ?? 1) - 1));
    return reconcileSavedOvernightProgress(refreshSavedExchangeCopy({
      ...state,
      saveLoadError: null,
      caseBriefs: refreshed,
      caseBrief: refreshed[chapterIndex]
    }, refreshed, state.caseBriefs), refreshed, chapterIndex, state.caseBriefs);
  } catch {
    return contentRefreshFailure(state);
  }
}

// The save contains selected-answer snapshots as well as case stubs. Refresh
// the snapshots used by current/replayed dialogue; keep budgets and history.
export function refreshSavedExchangeCopy(state = {}, briefs = [], previousBriefs = []) {
  const next = {
    ...state,
    sceneQuestionPicks: { ...state.sceneQuestionPicks },
    sceneDialoguePicks: { ...state.sceneDialoguePicks },
    sceneAnswers: { ...state.sceneAnswers },
    evidenceCheckPicks: { ...state.evidenceCheckPicks },
    caseActionLog: { ...state.caseActionLog },
    dialogueProgress: { ...state.dialogueProgress },
    statementReviewAttempts: { ...state.statementReviewAttempts },
    liveCounterPicks: { ...state.liveCounterPicks },
    testimonyWallProgress: { ...state.testimonyWallProgress },
    decisivePresentProgress: { ...state.decisivePresentProgress },
    evidenceInquiryPicks: { ...state.evidenceInquiryPicks },
    evidenceInquiryHeard: { ...state.evidenceInquiryHeard },
    evidenceInquiryAsked: { ...state.evidenceInquiryAsked }
  };
  for (const brief of briefs) {
    const stored = previousBriefs.find((item) => caseKey(item) === caseKey(brief));
    const previous = stored?.sceneVersions ? stored : stored?.contentIdentity ? { ...stored, ...stored.contentIdentity } : null;
    // Read from the original records, so reordering never reads our own writes.
    if (previous) {
      const progressKey = `${caseKey(brief)}:sceneReview`;
      const oldPosition = state.dialogueProgress?.[progressKey];
      if (oldPosition !== undefined) {
        const sceneId = previous.sceneVersions?.[Number(oldPosition)]?.id;
        const position = brief.sceneVersions?.findIndex((scene) => scene.id === sceneId) ?? -1;
        next.dialogueProgress[progressKey] = Math.max(0, position);
        if (position < 0) next.activeStatementLineId = null;
      }
      const mappedActions = {};
      for (const [action, value] of Object.entries(state.caseActionLog?.[caseKey(brief)] ?? {})) {
        const evidence = /^evidenceCheck:(\d+)(?::(\d+))?$/.exec(action);
        if (evidence) {
          const oldCheck = evidenceChecksFor(previous)[Number(evidence[1])];
          const checks = evidenceChecksFor(brief);
          const index = checks.findIndex((check) => check.id === oldCheck?.id);
          if (index < 0) continue;
          if (evidence[2] === undefined) { mappedActions[`evidenceCheck:${index}`] = value; continue; }
          const oldOption = oldCheck.options?.[Number(evidence[2])];
          const id = oldOption?.id ?? `${oldCheck.id}:option:${evidence[2]}`;
          const optionIndex = checks[index].options?.findIndex((option) => option.id === id) ?? -1;
          if (optionIndex >= 0) mappedActions[`evidenceCheck:${index}:${optionIndex}`] = value;
          continue;
        }
        const m = /^(version|sceneQuestion):(\d+)(?::(\d+))?$/.exec(action);
        if (!m) { mappedActions[action] = value; continue; }
        const oldScene = previous.sceneVersions?.[Number(m[2])];
        const index = brief.sceneVersions?.findIndex((scene) => scene.id === oldScene?.id) ?? -1;
        if (index < 0) continue;
        if (m[1] === "version") { mappedActions[`version:${index}`] = value; continue; }
        const oldOption = oldScene?.questionOptions?.[Number(m[3])];
        const id = oldOption?.id ?? `${oldScene?.id}:questionOptions:${m[3]}`;
        const oi = brief.sceneVersions[index].questionOptions?.findIndex((option) => option.id === id) ?? -1;
        if (oi >= 0) mappedActions[`sceneQuestion:${index}:${oi}`] = value;
      }
      next.caseActionLog[caseKey(brief)] = mappedActions;
    }
    const oldScenes = previous?.sceneVersions ?? brief.sceneVersions ?? [];
    for (let oldIndex = 0; oldIndex < oldScenes.length; oldIndex += 1) {
      const oldKey = answerKey(brief, oldIndex);
      delete next.sceneQuestionPicks[oldKey];
      delete next.sceneDialoguePicks[oldKey];
      delete next.sceneAnswers[oldKey];
      delete next.statementReviewAttempts[oldKey];
    }
    oldScenes.forEach((oldScene, oldIndex) => {
      const oldKey = answerKey(brief, oldIndex);
      const index = (brief.sceneVersions ?? []).findIndex((item) => item.id === oldScene.id);
      const scene = brief.sceneVersions?.[index];
      const key = answerKey(brief, index);
      const focus = state.sceneQuestionFocus;
      const active = state.scene === "sceneQuestionAnswer" && focus?.caseId === caseKey(brief) && Number(focus.sceneIndex) === oldIndex;
      if (active) { next.sceneQuestionFocus = null; next.scene = "sceneLineReplay"; }
      if (!scene) return;
      // A rewritten confrontation must not inherit a hit on a different claim.
      // Only reopen the current unfinished wall; previous chapters keep history.
      const revision = scene.testimonyWall?.revision;
      const oldRevision = oldScene.testimonyWall?.revision ?? oldScene.testimonyRevision;
      const currentBrief = state.caseBrief ?? briefs[Math.max(0, Number(state.chapter ?? 1) - 1)];
      const wallScreens = ["testimonyWall", "testimonyResponse", "testimonyMaterials", "decisivePresentTarget", "decisivePresentHit", "decisivePresentMiss"];
      if (previous && revision && revision !== oldRevision && caseKey(currentBrief) === caseKey(brief) && wallScreens.includes(state.scene)) {
        const wallKey = testimonyWallKey(brief, scene, index);
        const previousActOrder = scene.testimonyWall?.previousActOrders?.[oldRevision];
        if (previousActOrder) {
          remapRetainedTestimonyActs(next, state, wallKey, previousActOrder, scene.testimonyWall.acts);
        } else {
          delete next.testimonyWallProgress[wallKey];
          for (const presentKey of Object.keys(next.decisivePresentProgress)) {
            if (presentKey === wallKey || presentKey.startsWith(`${wallKey}:act`)) { delete next.decisivePresentProgress[presentKey]; delete next.evidenceInquiryPicks[presentKey]; delete next.evidenceInquiryHeard[presentKey]; delete next.evidenceInquiryAsked[presentKey]; }
          }
        }
        delete next.caseActionLog[caseKey(brief)]?.[`version:${index}`];
        next.dialogueProgress[`${caseKey(brief)}:sceneReview`] = index;
        next.scene = "testimonyWall";
        next.dialogueReading = null;
      }

      const review = remapReviewLines(previous ? oldScene : {}, scene, state.statementReviewAttempts?.[oldKey], state.activeStatementLineId);
      next.statementReviewAttempts[key] = review.attempts;
      const currentCase = state.caseBrief ?? briefs[Math.max(0, Number(state.chapter ?? 1) - 1)];
      if (caseKey(currentCase) === caseKey(brief) && Number(state.dialogueProgress?.[`${caseKey(brief)}:sceneReview`] ?? 0) === oldIndex) {
        const endId = `${statementStageForScene(brief, index)?.id}:end`;
        next.activeStatementLineId = state.activeStatementLineId === endId ? endId : review.activeLineId;
      }
      if (active) next.dialogueProgress[`${caseKey(brief)}:sceneReview`] = index;
      const candidates = [
        ...(scene.questionOptions ?? []).map((option, optionIndex) => ({ option, optionIndex, kind: "key" })),
        ...sceneDialogueOptions(scene).map(({ option, optionIndex }) => ({ option, optionIndex, kind: "dialogue" }))
      ];
      const migrate = (pick, kind) => {
        if (!pick) return;
        const oldOptions = kind === "key" ? oldScene.questionOptions ?? [] : sceneDialogueOptions(oldScene).map((row) => row.option);
        const oldOption = previous ? oldOptions[pick.optionIndex ?? (active && focus.kind === kind ? focus.optionIndex : -1)] : null;
        const oldField = kind === "key" ? "questionOptions" : oldScene.casualQuestions?.length ? "casualQuestions" : "dialogueOptions";
        const identity = pick.optionId ?? oldOption?.id ?? (oldOption ? `${oldScene.id}:${oldField}:${oldOptions.indexOf(oldOption)}` : null);
        const match = uniqueMatch(candidates, (item) => identity ? item.option.id === identity : item.option.question === pick.question || item.option.revisedQuestion === pick.question);
        if (!match) return;
        const updated = { ...refreshAnswer(pick, match.option, match.optionIndex), sceneId: scene.id };
        if (match.kind === "key" && scene.questionSequence?.length) {
          updated.completedOptionIds = completedChoicePrefix(sceneQuestionSequence(scene), pick.completedOptionIds);
          // A selected old branch does not prove the whole sequence was heard.
          if (active && nextSequentialChoice(sceneQuestionSequence(scene), updated.completedOptionIds)) {
            const actions = { ...next.caseActionLog[caseKey(brief)] };
            delete actions[`version:${index}`];
            next.caseActionLog[caseKey(brief)] = actions;
          }
        }
        if (match.kind === "key") { next.sceneQuestionPicks[key] = updated; next.sceneAnswers[key] = updated.answer; }
        else next.sceneDialoguePicks[key] = [...(next.sceneDialoguePicks[key] ?? []), updated];
        if (active && focus.kind === kind && (kind === "key" || Number(focus.optionIndex) === Number(pick.optionIndex))) {
          next.sceneQuestionFocus = { ...focus, sceneId: scene.id, sceneIndex: index, optionId: match.option.id, optionIndex: match.optionIndex, kind: match.kind,
            pendingPenalty: match.kind === "dialogue" || updated.correct ? null : focus.pendingPenalty };
          next.scene = state.scene;
        }
      };
      migrate(state.sceneQuestionPicks?.[oldKey], "key");
      (state.sceneDialoguePicks?.[oldKey] ?? []).forEach((pick) => migrate(pick, "dialogue"));
      if (active && focus.kind === "probe") {
        // Replaying a completed question is read-only, but is not a review probe.
        // Old saves stored only its copied question (and sometimes a different
        // probe on the same sentence). Recover that identity before probing.
        const resolved = uniqueMatch(scene.questionOptions ?? [], (option) => focus.resolvedOptionId
          ? option.id === focus.resolvedOptionId
          : option.question === focus.pick?.question);
        const completed = next.sceneQuestionPicks[key]?.completedOptionIds ?? [];
        const resolvedLine = resolved && (completed.includes(resolved.id) || next.caseActionLog[caseKey(brief)]?.[`version:${index}`])
          && statementLinesFromText(scene.version, { prefix: scene.id }).find((line) => line.text.includes(resolved.sourceAnchor));
        if (resolvedLine) {
          next.activeStatementLineId = resolvedLine.id;
          next.sceneQuestionFocus = { ...focus, sceneId: scene.id, sceneIndex: index,
            lineId: resolvedLine.id, probeId: null, resolvedOptionId: resolved.id, pendingPenalty: null,
            pick: { question: resolved.question, answer: resolved.answer, lines: resolved.lines } };
          next.scene = state.scene;
          return;
        }
        if (focus.resolvedOptionId) return;
        const oldLine = statementLinesFromText(oldScene.version, { prefix: oldScene.id }).find((line) => line.id === focus.lineId);
        const oldProbe = previous && oldScene.reviewProbes?.find((probe) => oldLine?.text.includes(probe.sourceAnchor));
        const identity = focus.probeId ?? oldProbe?.id ?? (oldProbe ? `${oldScene.id}:reviewProbes:${oldScene.reviewProbes.indexOf(oldProbe)}` : null);
        const probe = uniqueMatch(scene.reviewProbes ?? [], (item) => identity ? item.id === identity : item.question === focus.pick?.question);
        const line = probe && statementLinesFromText(scene.version, { prefix: scene.id }).find((item) => item.text.includes(probe.sourceAnchor));
        const ordinary = identity && candidates.find((item) => item.kind === "dialogue" && item.option.id === identity);
        if (!line && ordinary) {
          const pick = { ...refreshAnswer(focus.pick ?? {}, ordinary.option, ordinary.optionIndex), sceneId: scene.id };
          next.sceneDialoguePicks[key] = [...(next.sceneDialoguePicks[key] ?? []), pick];
          next.sceneQuestionFocus = { ...focus, kind: "dialogue", sceneId: scene.id, sceneIndex: index, optionId: ordinary.option.id, optionIndex: ordinary.optionIndex, pendingPenalty: null };
          next.scene = state.scene;
        }
        if (line) {
          next.activeStatementLineId = line.id;
          next.sceneQuestionFocus = { ...focus, sceneId: scene.id, sceneIndex: index, probeId: probe.id, lineId: line.id,
            pick: { question: probe.question, answer: probe.answer, lines: probe.lines }, pendingPenalty: probe.keyChoice ? null : focus.pendingPenalty };
          next.scene = state.scene;
        }
      }
    });
    for (const beat of brief.overnightStructure?.liveCounterBeats ?? []) {
      const pickKey = `${caseKey(brief)}:${beat.id}`;
      const saved = state.liveCounterPicks?.[pickKey];
      if (saved && beat.supersedesChoiceIds?.includes(saved.choiceId)) {
        delete next.liveCounterPicks[pickKey];
        continue;
      }
      const choice = saved && beat.choices?.find((item) => item.id === saved.choiceId);
      if (choice) next.liveCounterPicks[pickKey] = { ...saved, label: choice.label ?? "", recapAftertaste: choice.recapAftertaste ?? "" };
    }
    const oldChecks = evidenceChecksFor(previous ?? brief);
    oldChecks.forEach((_, index) => { delete next.evidenceCheckPicks[evidenceAnswerKey(brief, index)]; });
    oldChecks.forEach((oldCheck, oldIndex) => {
      const saved = state.evidenceCheckPicks?.[evidenceAnswerKey(brief, oldIndex)];
      if (!saved) return;
      const checks = evidenceChecksFor(brief);
      const index = checks.findIndex((check) => check.id === (saved.checkId ?? oldCheck.id));
      const check = checks[index];
      if (!check) return;
      const oldOption = previous ? oldCheck.options?.[saved.optionIndex] : null;
      const identity = saved.optionId ?? oldOption?.id ?? (oldOption ? `${oldCheck.id}:option:${saved.optionIndex}` : null);
      const option = uniqueMatch(check.options ?? [], (item) => identity ? item.id === identity : Boolean(saved.label) && item.label === saved.label);
      if (!option) return;
      next.evidenceCheckPicks[evidenceAnswerKey(brief, index)] = {
        ...saved, checkId: check.id, optionId: option.id, optionIndex: check.options.indexOf(option), label: option.label, feedback: option.feedback ?? "",
        reactionLine: option.reactionLine ?? "",
        revisedVersion: option.correct && option.revisesScene !== undefined ? brief.sceneVersions?.[Number(option.revisesScene)]?.revisedVersion : option.revisedVersion,
        correct: Boolean(option.correct), contradiction: option.contradiction ?? check.contradiction ?? "",
        revisesScene: option.revisesScene, selectionMode: check.selectionMode ?? "single",
        historicalResult: saved.historicalResult ?? (saved.correct !== undefined && saved.correct !== Boolean(option.correct) ? { correct: saved.correct, label: saved.label } : null)
      };
    });
  }
  const current = briefs[Math.max(0, Number(state.chapter ?? 1) - 1)];
  if (current?.dialoguePresentation?.focusedInquiry) {
    if (["testimonyMaterials", "decisivePresentMaterial", "decisivePresentTarget"].includes(next.scene)) {
      next.scene = "testimonyWall"; next.dialogueReading = null;
    }
    if (next.scene === "patienceLost") {
      const context = next.patienceLostContext ?? {};
      next.scene = context.retryScene === "testimonyWall" ? "testimonyWall" : context.area ?? "sceneReview";
      if (Number.isInteger(context.index)) next.dialogueProgress[`${caseKey(current)}:${context.area ?? "sceneReview"}`] = context.index;
      next.patienceLostContext = null; next.dialogueReading = null;
    }
  }
  // Removed optional end stages and material boards must not strand an old save.
  if (current?.dialoguePresentation?.compactClosing && ["deepFollowup", "caseClosure", "investigationBackflow", "evidenceCheck", "accusation"].includes(next.scene)
      && !(next.scene === "caseClosure" && current.dialoguePresentation.singleClosingCard)) {
    const key = caseKey(current);
    const active = [...(current.nightStructure?.segment1SceneIndexes ?? []), ...(current.nightStructure?.segment2SceneIndexes ?? [])];
    const pending = active.find(index => !next.caseActionLog?.[key]?.[`version:${index}`]);
    if (pending !== undefined) {
      next.scene = "sceneReview";
      next.dialogueProgress[`${key}:sceneReview`] = pending;
    } else {
      const missing = evidenceChecksFor(current).findIndex((_, index) => !next.caseActionLog?.[key]?.[`evidenceCheck:${index}`]);
      next.scene = missing >= 0 ? "evidenceCheck" : "solved";
      if (missing >= 0) next.dialogueProgress[`${key}:evidenceCheck`] = missing;
    }
    if (next.scene !== state.scene) next.dialogueReading = null;
  }
  if (previousBriefs.length) next.contentHistoryNotice = "旧版本已发生的选择仍保留；当前对白与操作已更新。";
  next.lastReaction = null;
  next.lastPityLine = null;
  return next;
}

// An explicitly declared removal/reorder keeps the surviving inquiry's own
// answer and reading state; a hit on a deleted act cannot answer its replacement.
function remapRetainedTestimonyActs(next, state, wallKey, previousOrder, acts) {
  const old = normalizeTestimonyWallProgress(state.testimonyWallProgress?.[wallKey]);
  const oldIndexFor = (act) => previousOrder.indexOf(act.id) + 1;
  const keyFor = (number) => number === 1 ? wallKey : `${wallKey}:act${number}`;
  const maps = ['decisivePresentProgress', 'evidenceInquiryPicks', 'evidenceInquiryHeard', 'evidenceInquiryAsked'];
  for (const field of maps) {
    for (const key of Object.keys(next[field])) {
      if (key === wallKey || key.startsWith(`${wallKey}:act`)) delete next[field][key];
    }
    acts.forEach((act, index) => {
      const number = oldIndexFor(act);
      const value = number > 0 ? state[field]?.[keyFor(number)] : undefined;
      if (value !== undefined) next[field][keyFor(index + 1)] = value;
    });
  }
  const currentId = previousOrder[old.act - 1];
  const retainedIndex = acts.findIndex(act => act.id === currentId);
  const pendingIndex = acts.findIndex(act => !old.completedActs.includes(oldIndexFor(act)));
  const act = (retainedIndex >= 0 ? retainedIndex : Math.max(0, pendingIndex)) + 1;
  const actProgress = Object.fromEntries(acts.map((item, index) => [String(index + 1), old.actProgress[String(oldIndexFor(item))] ?? {}]));
  next.testimonyWallProgress[wallKey] = normalizeTestimonyWallProgress({
    act, preludeSeen: old.preludeSeen, actProgress,
    completedActs: acts.flatMap((item, index) => old.completedActs.includes(oldIndexFor(item)) ? [index + 1] : [])
  });
}

function uniqueMatch(items, predicate) {
  const matches = items.filter(predicate);
  return matches.length === 1 ? matches[0] : null;
}

function refreshAnswer(saved, option, optionIndex) {
  const miss = option.correct === false ? statementMissReactionForOption(option) : null;
  const guarded = Boolean(saved.guarded && option.guardedAnswer);
  return {
    ...saved, optionIndex, optionId: option.id,
    historicalResult: saved.historicalResult ?? (saved.correct !== undefined && saved.correct !== Boolean(option.correct || option.contradiction) ? { correct: saved.correct, question: saved.question } : null),
    question: saved.sceneVersionKind === "revised" ? option.revisedQuestion ?? option.question : option.question,
    suspicionLabel: option.suspicionLabel,
    answer: miss?.text || (guarded ? option.guardedAnswer : option.answer) || "",
    lines: miss?.text || guarded ? null : option.lines ?? null,
    reactionLine: miss?.text ? "" : option.reactionLine ?? "",
    resistanceBeat: option.resistanceBeat ?? null,
    guarded: Boolean(miss?.text) || guarded,
    correct: Boolean(option.correct || option.contradiction), contradiction: option.contradiction ?? "",
    routeTone: option.routeTone ?? saved.routeTone, routeAxis: option.routeAxis ?? saved.routeAxis,
    revealTransition: option.revealTransition ?? null
  };
}

function contentRefreshFailure(state = {}) {
  return {
    ...state,
    screen: "title",
    saveLoadError: "content-refresh-failed"
  };
}

export function reconcileSavedOvernightProgress(state = {}, briefs = [], chapterIndex = 0, previousBriefs = []) {
  if (!state.caseOvernights || Array.isArray(state.caseOvernights)) return state;
  const briefById = new Map((briefs ?? []).map((brief) => [brief?.id, brief]));
  let currentProgressNeedsDayMap = false;
  const caseActionLog = structuredClone(state.caseActionLog ?? {});
  const currentBriefId = briefs?.[chapterIndex]?.id;
  const caseOvernights = Object.fromEntries(Object.entries(state.caseOvernights).map(([caseId, saved]) => {
    const brief = briefById.get(caseId);
    const structure = brief?.overnightStructure;
    if (!saved || typeof saved !== "object" || Array.isArray(saved) || !structure) return [caseId, saved];

    const validDaySceneIds = new Set((structure.dayScenes ?? []).map((scene) => scene.id).filter(Boolean));
    const validOpenerIds = new Set(Object.keys(structure.callbackOpeners ?? {}));
    const originalDone = Array.isArray(saved.dayScenesDone) ? saved.dayScenesDone : [];
    const dayScenesDone = [...new Set(originalDone.filter((sceneId) => validDaySceneIds.has(sceneId)
      && timelineSortComplete(structure.dayScenes.find((scene) => scene.id === sceneId), saved)))];
    const removedCompletedScene = dayScenesDone.length !== originalDone.length;
    const max = Math.max(0, Number(structure.dayBudget ?? saved.dayBudget?.max ?? 0));
    const used = Math.min(max, dayScenesDone.length);
    const activeDaySceneId = validDaySceneIds.has(saved.activeDaySceneId) ? saved.activeDaySceneId : null;
    const callbackOpenerId = structure.flowMode !== "linear" && validOpenerIds.has(saved.callbackOpenerId) ? saved.callbackOpenerId : null;
    const completedItems = structure.flowMode === "linear"
      ? (structure.dayScenes ?? []).filter((scene) => dayScenesDone.includes(scene.id))
        .flatMap((scene) => [scene.body?.earnedItemId, ...(scene.body?.earnedItemIds ?? [])]).filter(Boolean)
      : [];
    const invalidTimelineItems = new Set((structure.dayScenes ?? [])
      .filter((scene) => scene.body?.timelineSort && !timelineSortComplete(scene, saved))
      .flatMap((scene) => [scene.body.earnedItemId, ...(scene.body.earnedItemIds ?? [])]));
    const earnedItems = [...new Set([...(saved.earnedItems ?? []).filter((itemId) => validOpenerIds.has(itemId) && !invalidTimelineItems.has(itemId)), ...completedItems])];
    const question = structure.callerQuestion;
    const questionProgress = question?.choiceMode === "sequence" ? callerQuestionProgress(question, saved) : null;
    if (questionProgress && !questionProgress.complete && caseActionLog[caseId]) delete caseActionLog[caseId]["overnight:callerQuestion"];

    if (caseId === currentBriefId && (removedCompletedScene || saved.activeDaySceneId && !activeDaySceneId)) {
      currentProgressNeedsDayMap = true;
    }

    return [caseId, {
      ...saved,
      ...(questionProgress ? { callerQuestionCompletedIds: questionProgress.completedIds, callerQuestionChoiceId: questionProgress.picked?.id ?? null } : {}),
      ...refreshDocumentQuestions(saved, brief, previousBriefs.find((item) => caseKey(item) === caseId)),
      dayBudget: { max, used, remaining: Math.max(0, max - used) },
      dayScenesDone,
      earnedItems,
      activeDaySceneId,
      callbackOpenerId,
      dayChoices: filterRecordKeys(saved.dayChoices, validDaySceneIds),
      dayFollowups: filterRecordKeys(saved.dayFollowups, validDaySceneIds),
      timelineSorts: filterRecordKeys(saved.timelineSorts, validDaySceneIds)
    }];
  }));

  const scene = currentProgressNeedsDayMap && ["dayScene", "dayMap", "overnightCallback"].includes(state.scene)
    ? "dayMap"
    : state.scene;
  return { ...state, scene, caseOvernights, caseActionLog };
}

function filterRecordKeys(record = {}, validKeys = new Set()) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return {};
  return Object.fromEntries(Object.entries(record).filter(([key]) => validKeys.has(key)));
}

function refreshDocumentQuestions(saved, brief, previous) {
  const marks = Object.fromEntries((brief.documents ?? []).map((document) => {
    const validRows = new Set((document.rows ?? []).map((row) => row.rowId));
    const selected = saved.documentMarks?.[document.id];
    return [document.id, [...new Set(Array.isArray(selected) ? selected : [])]
      .filter((id) => validRows.has(id)).slice(0, Math.max(0, Number(document.markLimit ?? 3)))];
  }));
  const questions = (brief.documents ?? []).flatMap((document) => earnedDocumentQuestionsFor(document, marks[document.id] ?? []));
  const answered = {};
  let active = null;
  for (const old of saved.documentEarnedQuestions ?? []) {
    const candidates = questions.filter((item) => item.documentId === old.documentId);
    const oldDocument = previous?.documents?.find((item) => item.id === old.documentId);
    const oldOptions = old.kind === "cross" ? oldDocument?.crossQuestions ?? [] : oldDocument?.rowQuestions?.[old.rows?.[0]] ?? [];
    const oldOption = oldOptions.find((item) => item.id === old.id || item.question === old.question);
    const legacyId = oldOption && (oldOption.id ?? (old.kind === "cross" ? `${old.documentId}:cross:${oldOptions.indexOf(oldOption)}` : `${old.documentId}:row:${old.rows?.[0]}:${oldOptions.indexOf(oldOption)}`));
    const current = candidates.find((item) => item.id === (legacyId ?? old.id))
      ?? candidates.find((item) => item.kind === old.kind && JSON.stringify([...item.rows].sort()) === JSON.stringify([...(old.rows ?? [])].sort()) && item.question === old.question);
    if (!current) continue;
    if (saved.documentAnsweredQuestions?.[old.id]) answered[current.id] = saved.documentAnsweredQuestions[old.id];
    if (saved.activeDocumentQuestionId === old.id) active = current.id;
  }
  return { documentMarks: marks, documentEarnedQuestions: questions, documentAnsweredQuestions: answered, activeDocumentQuestionId: active };
}
