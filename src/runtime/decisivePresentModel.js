export const DECISIVE_PRESENT_MAX_ATTEMPTS = 2;

export function testimonyWallKey(brief = {}, scene = {}, sceneIndex = 0, act = 1) {
  const baseKey = `${brief.id ?? brief.caseId ?? "daily"}:testimony:${scene.id ?? sceneIndex}`;
  const actNumber = Math.max(1, Number(act) || 1);
  return actNumber === 1 ? baseKey : `${baseKey}:act${actNumber}`;
}

export function testimonyActsForScene(scene = {}) {
  const wall = scene?.testimonyWall ?? {};
  const explicitActs = Array.isArray(wall.acts) ? wall.acts.filter((act) => act && typeof act === "object" && !Array.isArray(act)) : [];
  if (explicitActs.length) return explicitActs;
  return [{
    id: "act1",
    title: wall.title,
    intro: wall.intro,
    splitAfter: wall.splitAfter,
    midSummary: wall.midSummary,
    softAnchorResponse: wall.softAnchorResponse,
    reliefBeat: wall.reliefBeat,
    statements: wall.statements ?? [],
    decisivePresent: scene?.decisivePresent ?? null
  }];
}

export function testimonyActForScene(scene = {}, wallProgress = {}) {
  const progress = normalizeTestimonyWallProgress(wallProgress);
  const acts = testimonyActsForScene(scene);
  const index = Math.max(0, Math.min(acts.length - 1, progress.act - 1));
  const source = acts[index] ?? {};
  const legacyWall = scene?.testimonyWall ?? {};
  const isFirstAct = index === 0;
  return {
    ...source,
    act: index + 1,
    id: source.id ?? `act${index + 1}`,
    title: source.title ?? (isFirstAct ? legacyWall.title : "她改口后的说法"),
    intro: source.intro ?? (isFirstAct ? legacyWall.intro : "把第二段说法和刚才的原句对着听。"),
    splitAfter: source.splitAfter ?? (isFirstAct ? legacyWall.splitAfter : 2),
    midSummary: source.midSummary ?? (isFirstAct ? legacyWall.midSummary : "她承认了第一处事实，又换了一种说法解释它。"),
    softAnchorResponse: source.softAnchorResponse ?? (isFirstAct ? legacyWall.softAnchorResponse : "这两处开始咬上了。正式压上麦前，再确认材料和原句。"),
    reliefBeat: source.reliefBeat ?? (isFirstAct ? legacyWall.reliefBeat : null),
    statements: Array.isArray(source.statements) ? source.statements : isFirstAct ? legacyWall.statements ?? [] : [],
    decisivePresent: source.decisivePresent ?? (isFirstAct ? scene?.decisivePresent : null)
  };
}

export function testimonyActCount(scene = {}) {
  return testimonyActsForScene(scene).length;
}

export function testimonyActIsFinal(scene = {}, wallProgress = {}) {
  return normalizeTestimonyWallProgress(wallProgress).act >= testimonyActCount(scene);
}

export function decisivePresentForScene(scene = {}, wallProgress = {}) {
  const present = testimonyActForScene(scene, wallProgress)?.decisivePresent;
  if (!present || typeof present !== "object" || !present.evidenceId || !present.statementId) return null;
  return present;
}

export function normalizeTestimonyWallProgress(value = {}) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const act = Math.max(1, Math.floor(Number(input.act) || 1));
  const storedByAct = input.actProgress && typeof input.actProgress === "object" && !Array.isArray(input.actProgress)
    ? input.actProgress
    : {};
  const actProgress = {};
  for (const [key, stored] of Object.entries(storedByAct)) {
    const actNumber = Math.max(1, Math.floor(Number(key) || 1));
    actProgress[String(actNumber)] = normalizeActProgress(stored);
  }
  const legacyProgress = normalizeActProgress(input);
  const active = actProgress[String(act)] ?? legacyProgress;
  actProgress[String(act)] = active;
  return {
    act,
    completedActs: uniqueNumbers(input.completedActs),
    actProgress,
    ...active
  };
}

export function advanceTestimonyAct(scene = {}, wallProgress = {}) {
  const current = normalizeTestimonyWallProgress(wallProgress);
  const nextAct = Math.min(testimonyActCount(scene), current.act + 1);
  if (nextAct === current.act) return current;
  const currentSnapshot = normalizeActProgress(current);
  const nextSnapshot = normalizeActProgress(current.actProgress?.[String(nextAct)]);
  return {
    act: nextAct,
    completedActs: uniqueNumbers([...current.completedActs, current.act]),
    actProgress: {
      ...current.actProgress,
      [String(current.act)]: currentSnapshot,
      [String(nextAct)]: nextSnapshot
    },
    ...nextSnapshot
  };
}

export function testimonyActComparisonRows(scene = {}, wallProgress = {}) {
  const progress = normalizeTestimonyWallProgress(wallProgress);
  if (progress.act <= 1) return [];
  const acts = testimonyActsForScene(scene);
  const firstAct = acts[0] ?? {};
  const currentAct = acts[Math.min(acts.length - 1, progress.act - 1)] ?? {};
  const statusById = new Map((currentAct.comparison ?? []).map((entry) => [entry.statementId, entry.status]));
  const brokenId = firstAct.decisivePresent?.statementId ?? scene?.decisivePresent?.statementId ?? "";
  return (firstAct.statements ?? scene?.testimonyWall?.statements ?? []).map((statement) => ({
    id: statement.id,
    label: statement.label,
    text: statement.text,
    status: normalizeComparisonStatus(statusById.get(statement.id) ?? (statement.id === brokenId ? "被打破" : "她收回了"))
  }));
}

export function normalizeDecisivePresentProgress(value = {}, maxAttempts = DECISIVE_PRESENT_MAX_ATTEMPTS) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const safeMax = Math.max(1, Number(maxAttempts) || DECISIVE_PRESENT_MAX_ATTEMPTS);
  const attempts = Math.max(0, Math.min(safeMax, Number(input.attempts) || 0));
  return {
    attempts,
    remaining: Math.max(0, safeMax - attempts),
    max: safeMax,
    selectedEvidenceId: typeof input.selectedEvidenceId === "string" ? input.selectedEvidenceId : "",
    guarded: Boolean(input.guarded),
    resolved: Boolean(input.resolved),
    lastMissKind: ["evidence", "statement"].includes(input.lastMissKind) ? input.lastMissKind : ""
  };
}

export function testimonyStatementsForScene(scene = {}, wallProgress = {}) {
  const progress = normalizeTestimonyWallProgress(wallProgress);
  const revealed = new Set(progress.revealedIds);
  return (testimonyActForScene(scene, progress).statements ?? []).filter((statement) => !statement.hidden || revealed.has(statement.id));
}

export function decisivePresentAvailability(scene = {}, wallProgress = {}) {
  const progress = normalizeTestimonyWallProgress(wallProgress);
  const act = testimonyActForScene(scene, progress);
  const decisive = decisivePresentForScene(scene, progress);
  if (!decisive) return { canStart: false, reason: "missing-present", hint: "这段证词还没有可用的正式指认。" };
  const statement = (act.statements ?? []).find((item) => item.id === decisive.statementId);
  const waitsForReveal = Boolean(statement?.hidden && !progress.revealedIds.includes(statement.id));
  return waitsForReveal
    ? { canStart: false, reason: "hidden-statement", statementId: statement.id, hint: "她还有话没被问出来，先追问。" }
    : { canStart: true, reason: "", statementId: decisive.statementId, hint: "先选材料，再选原句" };
}

export function pressTestimonyStatement(scene = {}, wallProgress = {}, statementId = "") {
  const current = normalizeTestimonyWallProgress(wallProgress);
  const statement = (testimonyActForScene(scene, current).statements ?? []).find((item) => item.id === statementId);
  if (!statement) return current;
  return updateActiveActProgress(current, {
    pressedIds: uniqueStrings([...current.pressedIds, statement.id]),
    revealedIds: uniqueStrings([...current.revealedIds, ...(statement.reveals ?? [])]),
    activeResponse: {
      kind: "press",
      statementId: statement.id,
      text: statement.pressResponse ?? "这句先记着，暂时还不能替任何一边补结论。"
    }
  });
}

export function softPresentOnStatement(scene = {}, wallProgress = {}, statementId = "") {
  const current = normalizeTestimonyWallProgress(wallProgress);
  const statement = testimonyStatementsForScene(scene, current).find((item) => item.id === statementId);
  if (!statement || !current.softEvidenceId) return current;
  const decisive = decisivePresentForScene(scene, current);
  const nearHit = decisive?.evidenceId === current.softEvidenceId && decisive?.statementId === statement.id;
  return updateActiveActProgress(current, {
    softPresentedIds: uniqueStrings([...current.softPresentedIds, `${current.softEvidenceId}:${statement.id}`]),
    activeResponse: {
      kind: "present",
      statementId: statement.id,
      text: nearHit
        ? testimonyActForScene(scene, current).softAnchorResponse ?? "这两处能咬上。要把它正式压上麦，得单独发起指认。"
        : statement.presentResponse ?? "材料放在这句旁边，能多问一步，但还不足以钉住这段说法。"
    }
  });
}

export function selectTestimonyEvidence(wallProgress = {}, evidenceId = "") {
  const current = normalizeTestimonyWallProgress(wallProgress);
  return updateActiveActProgress(current, { softEvidenceId: evidenceId, activeResponse: null });
}

export function decisivePresentOutcome(scene = {}, progress = {}, evidenceId = "", statementId = "", wallProgress = {}) {
  const decisive = decisivePresentForScene(scene, wallProgress);
  if (!decisive) return { kind: "missing", progress: normalizeDecisivePresentProgress(progress) };
  const current = normalizeDecisivePresentProgress(progress, decisive.maxAttempts);
  if (current.resolved) return { kind: "resolved", progress: current };
  const hit = evidenceId === decisive.evidenceId && statementId === decisive.statementId;
  if (hit) {
    return {
      kind: "hit",
      progress: { ...current, selectedEvidenceId: evidenceId, guarded: false, resolved: true, lastMissKind: "" }
    };
  }
  const attempts = Math.min(current.max, current.attempts + 1);
  return {
    kind: attempts >= current.max ? "exhausted" : "miss",
    missKind: evidenceId === decisive.evidenceId ? "statement" : "evidence",
    progress: {
      ...current,
      attempts,
      remaining: Math.max(0, current.max - attempts),
      selectedEvidenceId: "",
      guarded: true,
      lastMissKind: evidenceId === decisive.evidenceId ? "statement" : "evidence"
    }
  };
}

export function decisivePresentPressure(value = {}, maxAttempts = DECISIVE_PRESENT_MAX_ATTEMPTS) {
  const progress = normalizeDecisivePresentProgress(value, maxAttempts);
  const ratio = progress.remaining / Math.max(1, progress.max);
  const level = progress.remaining <= 0 ? "low" : progress.remaining === 1 ? "mid" : "high";
  return {
    ...progress,
    ratio,
    level,
    quietUntilEmpty: true,
    patienceLabel: progress.remaining <= 0 ? "指认机会耗尽" : `还剩 ${progress.remaining} 次`,
    crowd: progress.remaining <= 0 ? "散了" : "",
    callerGuard: progress.guarded ? "防备" : "听着",
    comments: progress.guarded
      ? ["刚才那下没对上", "来电人把话收短了", `正式指认还剩 ${progress.remaining} 次`]
      : ["材料已经摊开", "先选材料，再选原句", "正式指认只有两次"],
    expression: progress.guarded
      ? { kind: "guarded", text: "回答收短，麦里的气息也紧了" }
      : { kind: "pause", text: "等你把材料放到原句旁边" }
  };
}

export function resetDecisivePresentProgress(value = {}, maxAttempts = DECISIVE_PRESENT_MAX_ATTEMPTS) {
  const current = normalizeDecisivePresentProgress(value, maxAttempts);
  return { ...current, attempts: 0, remaining: current.max, selectedEvidenceId: "", guarded: false, resolved: false, lastMissKind: "" };
}

function updateActiveActProgress(wallProgress, patch = {}) {
  const current = normalizeTestimonyWallProgress(wallProgress);
  const active = normalizeActProgress({ ...current, ...patch });
  return {
    act: current.act,
    completedActs: current.completedActs,
    actProgress: { ...current.actProgress, [String(current.act)]: active },
    ...active
  };
}

function normalizeActProgress(value = {}) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    pressedIds: uniqueStrings(input.pressedIds),
    revealedIds: uniqueStrings(input.revealedIds),
    softPresentedIds: uniqueStrings(input.softPresentedIds),
    softEvidenceId: typeof input.softEvidenceId === "string" ? input.softEvidenceId : "",
    activeResponse: normalizeResponse(input.activeResponse)
  };
}

function normalizeResponse(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (!value.statementId || !value.text) return null;
  return {
    kind: value.kind === "present" ? "present" : "press",
    statementId: String(value.statementId),
    text: String(value.text)
  };
}

function normalizeComparisonStatus(value) {
  return ["被打破", "她收回了", "变了说法"].includes(value) ? value : "她收回了";
}

function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === "string" && value))];
}

function uniqueNumbers(values = []) {
  return [...new Set((Array.isArray(values) ? values : []).map(Number).filter((value) => Number.isInteger(value) && value > 0))];
}
