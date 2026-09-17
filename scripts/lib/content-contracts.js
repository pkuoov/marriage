// Structural contracts for revising playable content. No prose quotas or exact
// sentence locks: these checks protect identity, reachability and player actions.
export function validateContentRevision(packet) {
  const fail = (message) => { throw new Error(`${packet.caseId}: ${message}`); };
  const unique = (items, path, field = "id") => {
    const seen = new Set();
    for (const item of items ?? []) {
      if (typeof item[field] !== "string" || !item[field].trim()) fail(`${path} requires stable ${field}`);
      if (seen.has(item[field])) fail(`${path} duplicate ${field} ${item[field]}`);
      seen.add(item[field]);
    }
  };
  unique(packet.sceneVersions, "sceneVersions");
  for (const scene of packet.sceneVersions ?? []) {
    unique([...(scene.questionOptions ?? []), ...(scene.casualQuestions ?? []), ...(scene.dialogueOptions ?? []), ...(scene.reviewProbes ?? [])], scene.id);
    if (scene.questionSequence) {
      const ids = scene.questionOptions?.map((option) => option.id) ?? [];
      if (new Set(scene.questionSequence).size !== ids.length || scene.questionSequence.length !== ids.length || scene.questionSequence.some((id) => !ids.includes(id))) fail(`${scene.id} questionSequence must contain every authored question exactly once`);
      for (const option of scene.questionOptions) {
        if (!option.correct || !option.contradiction || option.guardedAnswer || option.missReaction) fail(`${option.id} ordered dialogue cannot retain an obsolete miss/guarded branch`);
        if (option.lines?.length && option.answer !== option.lines.filter((line) => line.role === "caller").map((line) => line.text).join("")) fail(`${option.id} fallback answer differs from ordered caller dialogue`);
      }
    }
    unique(scene.testimonyWall?.acts, `${scene.id} acts`);
    for (const act of scene.testimonyWall?.acts ?? []) {
      unique(act.statements, `${scene.id}/${act.id} statements`);
      const statements = new Set((act.statements ?? []).map((item) => item.id));
      for (const statement of act.statements ?? []) {
        for (const target of statement.reveals ?? []) if (!statements.has(target)) fail(`${statement.id} reveals missing statement ${target}`);
      }
      const present = act.decisivePresent;
      if (present) {
        if (!statements.has(present.statementId)) fail(`${scene.id}/${act.id} targets missing statement`);
        unique(present.materialCards, `${scene.id}/${act.id} materialCards`);
        if (!(present.materialCards ?? []).some((card) => card.id === present.evidenceId)) fail(`${scene.id}/${act.id} targets missing evidence`);
      }
    }
  }
  unique(packet.evidenceChecks, "evidenceChecks");
  for (const check of packet.evidenceChecks ?? []) unique(check.options, check.id);
  unique(packet.documents, "documents");
  unique(packet.overnightStructure?.dayScenes, "dayScenes");
  unique(packet.overnightStructure?.liveCounterBeats, "liveCounterBeats");
  const callerQuestion = packet.overnightStructure?.callerQuestion;
  if (callerQuestion) unique(callerQuestion.options, "callerQuestion options");
  if (callerQuestion?.choiceMode === "sequence") {
    if (!callerQuestion.prompt || !callerQuestion.options?.length) fail("sequential callerQuestion requires prompt and exchanges");
    for (const option of callerQuestion.options) {
      if (!option.label || !(option.lines?.length || option.callerLine)) fail(`${option.id} requires a complete callerQuestion exchange`);
      if (option.hostChoices?.length || option.requiresEarnedItem) fail(`${option.id} sequential callerQuestion cannot contain exclusive or locked subchoices`);
      if (option.lines?.length && option.callerLine && option.callerLine !== option.lines.filter(line => line.role === "caller").map(line => line.text).join("")) fail(`${option.id} callerQuestion fallback differs from dialogue`);
    }
  }
  for (const beat of packet.overnightStructure?.liveCounterBeats ?? []) unique(beat.choices, `${beat.id} choices`);
  for (const scene of packet.overnightStructure?.dayScenes ?? []) {
    if (!scene.body?.sourceNote?.trim()) fail(`${scene.id} requires player-facing sourceNote (access is an author contract)`);
    unique(scene.body.beats, `${scene.id} spoken beats`);
  }
  for (const document of packet.documents ?? []) {
    unique(document.rows, `${document.id} rows`, "rowId");
    unique([...Object.values(document.rowQuestions ?? {}).flat(), ...(document.crossQuestions ?? [])], document.id);
    const rows = new Set((document.rows ?? []).map((row) => row.rowId));
    for (const row of Object.keys(document.rowQuestions ?? {})) if (!rows.has(row)) fail(`${document.id} unknown row ${row}`);
    for (const question of document.crossQuestions ?? []) {
      for (const row of question.rows ?? []) if (!rows.has(row)) fail(`${question.id} unknown row ${row}`);
      if (!question.rows?.length) fail(`${question.id} requires source rows`);
      if (new Set(question.rows).size > (document.markLimit ?? 3)) fail(`${question.id} cannot be reached within markLimit`);
    }
    if (document.availableAt) {
      const scene = packet.sceneVersions?.find((item) => item.id === document.availableAt.sceneId);
      if (!scene) fail(`${document.id} receipt references missing scene`);
      const act = document.availableAt.act;
      if (act !== undefined && (!Number.isInteger(act) || act < 1 || !scene.testimonyWall?.acts?.[act - 1])) fail(`${document.id} receipt references missing act`);
    }
  }
}
