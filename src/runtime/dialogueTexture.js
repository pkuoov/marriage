const TEXTURE_THRESHOLDS = Object.freeze({
  shortAnswerCount: 3,
  longRambleCount: 2,
  interruptionCount: 2,
  nonLoadBearingCount: 3,
  callerTicCount: 2,
  otherTicCount: 0
});

const COMMON_VOICE_TICS = Object.freeze(["呃", "哎", "唉", "就是说", "你知道吧"]);

export function dialogueTextureMetrics(packet = {}) {
  if (packet.texturePass !== true) {
    return {
      enabled: false,
      skipped: true,
      valid: true,
      caseId: packet.caseId ?? "",
      thresholds: TEXTURE_THRESHOLDS,
      errors: []
    };
  }

  const speech = collectDialogueTextureSpeech(packet);
  const shortAnswers = speech.caller.filter((entry) => visibleCharacterCount(entry.text) <= 6);
  const longRambles = speech.caller.filter((entry) => entry.longRamble === true || compactCharacterCount(entry.text) >= 120);
  const interruptions = [...speech.caller, ...speech.other].filter((entry) => isInterruption(entry.text));
  const voiceTicsDeclared = packet.voiceTics && typeof packet.voiceTics === "object";
  const voiceTics = Object.values(packet.voiceTics ?? {}).flat().filter((tic) => typeof tic === "string" && tic.length > 0);
  const oneTimeTic = normalizeOneTimeTic(packet.oneTimeTic);
  const callerTicCounts = countTics(speech.caller, voiceTics);
  const otherTicCounts = countTics(speech.other, voiceTics);
  const callerTicCount = Object.values(callerTicCounts).reduce((sum, count) => sum + count, 0);
  const otherTicCount = Object.values(otherTicCounts).reduce((sum, count) => sum + count, 0);
  const negativeFingerprintTics = voiceTics.length === 0
    ? COMMON_VOICE_TICS.filter((tic) => tic !== oneTimeTic)
    : [];
  const negativeFingerprintCounts = countStandaloneTics(speech.caller, negativeFingerprintTics);
  const negativeFingerprintCount = Object.values(negativeFingerprintCounts).reduce((sum, count) => sum + count, 0);
  const oneTimeCallerCount = oneTimeTic ? occurrencesInEntries(speech.caller, oneTimeTic) : 0;
  const oneTimeOtherCount = oneTimeTic ? occurrencesInEntries(speech.other, oneTimeTic) : 0;
  const oneTimePaths = oneTimeTic
    ? speech.caller.filter((entry) => occurrences(entry.text, oneTimeTic) > 0).map((entry) => entry.path)
    : [];
  const cleanLineResults = cleanLineChecks(speech.caller, packet.voiceTicCleanLines, voiceTics);
  const voiceTicArcResults = voiceTicArcChecks(packet, speech.caller, voiceTics, cleanLineResults);
  const metrics = {
    shortAnswerCount: shortAnswers.length,
    longRambleCount: longRambles.length,
    interruptionCount: interruptions.length,
    nonLoadBearingCount: speech.nonLoadBearing.length,
    callerTicCount,
    otherTicCount,
    negativeFingerprintCount,
    oneTimeCallerCount,
    oneTimeOtherCount,
    cleanLineCount: cleanLineResults.filter((item) => item.valid).length
  };
  const errors = textureErrors(metrics, {
    voiceTics,
    voiceTicsDeclared,
    oneTimeTic,
    oneTimePaths,
    oneTimeTicPath: packet.oneTimeTicPath,
    cleanLineResults,
    voiceTicArcDeclared: packet.voiceTicArc && typeof packet.voiceTicArc === "object" && Object.values(packet.voiceTicArc).some((value) => typeof value === "string" && value.trim()),
    voiceTicArcResults
  });
  return {
    enabled: true,
    skipped: false,
    valid: errors.length === 0,
    caseId: packet.caseId ?? "",
    thresholds: TEXTURE_THRESHOLDS,
    metrics,
    callerTicCounts,
    otherTicCounts,
    negativeFingerprintCounts,
    oneTimeTic,
    oneTimePaths,
    cleanLineResults,
    voiceTicArcResults,
    samples: {
      shortAnswers: shortAnswers.map((entry) => entry.text),
      longRambles: longRambles.map((entry) => entry.path),
      interruptions: interruptions.map((entry) => entry.text),
      nonLoadBearing: speech.nonLoadBearing.map((entry) => entry.text)
    },
    errors
  };
}

export function collectDialogueTextureSpeech(packet = {}) {
  const caller = [];
  const other = [];
  const nonLoadBearing = [];
  const seen = new Set();
  const add = (bucket, text, path, extra = {}) => {
    if (typeof text !== "string" || !text.trim()) return;
    const key = `${bucket}:${path}`;
    if (seen.has(key)) return;
    seen.add(key);
    const entry = { text, path, ...extra };
    (bucket === "caller" ? caller : other).push(entry);
    if (extra.nonLoadBearing === true) nonLoadBearing.push(entry);
  };

  visitExplicitLines(packet, "packet", (line, path) => {
    add(isCallerLine(line) ? "caller" : "other", line.text ?? line.line, path, { nonLoadBearing: line.nonLoadBearing === true });
  });

  (packet.sceneVersions ?? []).forEach((scene, sceneIndex) => {
    add("caller", scene.version, `sceneVersions[${sceneIndex}].version`);
    add("caller", scene.revisedVersion, `sceneVersions[${sceneIndex}].revisedVersion`);
    for (const field of ["questionOptions", "casualQuestions", "dialogueOptions"]) {
      (scene[field] ?? []).forEach((option, optionIndex) => {
        const base = `sceneVersions[${sceneIndex}].${field}[${optionIndex}]`;
        const hasStagedLines = Array.isArray(option.lines) && option.lines.length > 0;
        add("other", option.question, `${base}.question`);
        if (!hasStagedLines) {
          add("caller", option.answer, `${base}.answer`, { longRamble: option.textureRole === "ramble" });
        } else if (option.textureRole === "ramble") {
          const stagedCallerLine = caller.find((entry) => entry.path.startsWith(`packet.${base}.lines[`));
          if (stagedCallerLine) stagedCallerLine.longRamble = true;
        }
        add("caller", option.guardedAnswer, `${base}.guardedAnswer`);
      });
    }
  });

  const overnight = packet.overnightStructure ?? {};
  Object.entries(overnight.callbackOpeners ?? {}).forEach(([id, opener]) => {
    add("caller", opener.line, `overnightStructure.callbackOpeners.${id}.line`);
    const conflict = opener.firstConflict ?? {};
    if (!(Array.isArray(conflict.lines) && conflict.lines.length)) add("other", conflict.hostLine, `overnightStructure.callbackOpeners.${id}.firstConflict.hostLine`);
    add("caller", conflict.callerLine, `overnightStructure.callbackOpeners.${id}.firstConflict.callerLine`);
    add("caller", conflict.callerFollowupLine, `overnightStructure.callbackOpeners.${id}.firstConflict.callerFollowupLine`);
  });
  add("caller", overnight.callbackFallback?.line, "overnightStructure.callbackFallback.line");
  Object.entries(overnight.postures ?? {}).forEach(([id, text]) => add("caller", text, `overnightStructure.postures.${id}`));
  Object.entries(overnight.snapshotEcho ?? {}).forEach(([id, text]) => add("caller", text, `overnightStructure.snapshotEcho.${id}`));
  const callerQuestion = overnight.callerQuestion ?? {};
  add("caller", callerQuestion.prompt, "overnightStructure.callerQuestion.prompt");
  (callerQuestion.options ?? []).forEach((option, optionIndex) => {
    const base = `overnightStructure.callerQuestion.options[${optionIndex}]`;
    add("other", option.label, `${base}.label`);
    if (!(Array.isArray(option.lines) && option.lines.length)) add("caller", option.callerLine, `${base}.callerLine`);
    (option.hostChoices ?? []).forEach((choice, choiceIndex) => {
      if (!choice.silent) add("other", choice.label, `${base}.hostChoices[${choiceIndex}].label`);
    });
  });

  add("other", packet.deepFollowup?.question, "deepFollowup.question");
  add("caller", packet.deepFollowup?.answer, "deepFollowup.answer");
  (packet.hostDisclosure?.lines ?? []).forEach((line, lineIndex) => {
    add("other", line?.text, `hostDisclosure.lines[${lineIndex}].text`);
  });

  Object.entries(packet.delegation?.outcomes ?? {}).forEach(([advisorId, outcome]) => {
    add("other", outcome?.text, `delegation.outcomes.${advisorId}.text`);
  });
  (packet.nightStructure?.interlude?.actions ?? []).forEach((action, actionIndex) => {
    add("other", action?.script?.open, `nightStructure.interlude.actions[${actionIndex}].script.open`);
    add("other", action?.script?.reply, `nightStructure.interlude.actions[${actionIndex}].script.reply`);
  });
  (packet.advisorNotes ?? []).forEach((note, noteIndex) => {
    add("other", note?.text, `advisorNotes[${noteIndex}].text`);
  });

  return { caller, other, nonLoadBearing };
}

export function spokenPunctuationLeaks(packet = {}) {
  const speech = collectDialogueTextureSpeech(packet);
  return [...speech.caller, ...speech.other]
    .map((entry) => ({
      ...entry,
      punctuation: String(entry.text)
        .replace(/\d{1,3}(?:,\d{3})+/g, "")
        .match(/[,:;]/g) ?? []
    }))
    .filter((entry) => entry.punctuation.length > 0);
}

export function assertDialogueTexture(packet = {}) {
  const result = dialogueTextureMetrics(packet);
  if (!result.valid) throw new Error(`${result.caseId || "texture case"}: ${result.errors.join("；")}`);
  return result;
}

function visitExplicitLines(value, path, addLine) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitExplicitLines(entry, `${path}[${index}]`, addLine));
    return;
  }
  if (!value || typeof value !== "object") return;
  if ((value.role || value.speaker) && (typeof value.text === "string" || typeof value.line === "string")) addLine(value, path);
  Object.entries(value).forEach(([key, entry]) => visitExplicitLines(entry, `${path}.${key}`, addLine));
}

function isCallerLine(line = {}) {
  if (line.role === "caller") return true;
  const speaker = String(line.speaker ?? "");
  return speaker.includes("咨询者") || speaker.includes("来电人") || speaker === "沈";
}

function visibleCharacterCount(text = "") {
  return Array.from(String(text).replace(/[\p{P}\p{S}\s]/gu, "")).length;
}

function compactCharacterCount(text = "") {
  return Array.from(String(text).replace(/\s/gu, "")).length;
}

function isInterruption(text = "") {
  const normalized = String(text ?? "").trim();
  return normalized.includes("——") || /^(等一下|等下|等会儿)/u.test(normalized);
}

function countTics(entries = [], tics = []) {
  const joined = entries.map((entry) => entry.text).join("\n");
  return Object.fromEntries(tics.map((tic) => [tic, occurrences(joined, tic)]));
}

function countStandaloneTics(entries = [], tics = []) {
  return Object.fromEntries(tics.map((tic) => [
    tic,
    entries.reduce((sum, entry) => sum + standaloneOccurrences(entry.text, tic), 0)
  ]));
}

function occurrencesInEntries(entries = [], tic = "") {
  return entries.reduce((sum, entry) => sum + occurrences(entry.text, tic), 0);
}

function standaloneOccurrences(text = "", tic = "") {
  if (!tic) return 0;
  const escaped = tic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const boundary = "[\\s，。！？；：、…—,.!?;:『』「」‘’“”]";
  const expression = new RegExp(`(?:^|${boundary})${escaped}(?=$|${boundary})`, "gu");
  return [...String(text).matchAll(expression)].length;
}

function normalizeOneTimeTic(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.tic === "string") return value.tic.trim();
  return "";
}

function cleanLineChecks(callerEntries = [], cleanLines = [], voiceTics = []) {
  return (Array.isArray(cleanLines) ? cleanLines : []).map((line) => {
    const matches = callerEntries.filter((entry) => entry.text === line);
    const leakedTics = voiceTics.filter((tic) => occurrences(line, tic) > 0);
    return {
      line,
      paths: matches.map((entry) => entry.path),
      leakedTics,
      valid: matches.length === 1 && leakedTics.length === 0
    };
  });
}

function voiceTicArcChecks(packet = {}, callerEntries = [], voiceTics = [], cleanLineResults = []) {
  const descriptions = Object.values(packet.voiceTicArc ?? {}).filter((value) => typeof value === "string");
  const description = descriptions.join("\n");
  const results = [];

  if (description.includes("夜 B 消失")) {
    const nightBIndexes = new Set(packet.nightStructure?.segment2SceneIndexes ?? []);
    const leakedPaths = callerEntries
      .filter((entry) => voiceTics.some((tic) => occurrences(entry.text, tic) > 0))
      .filter((entry) => isNightBTexturePath(entry.path, nightBIndexes))
      .map((entry) => entry.path);
    results.push({ rule: "night-b-silent", valid: leakedPaths.length === 0, leakedPaths });
  }

  if (description.includes("最后一句干净")) {
    results.push({
      rule: "clean-ending-line",
      valid: cleanLineResults.length > 0 && cleanLineResults.every((item) => item.valid),
      leakedPaths: cleanLineResults.filter((item) => !item.valid).flatMap((item) => item.paths)
    });
  }

  return results;
}

function isNightBTexturePath(path = "", nightBIndexes = new Set()) {
  if (String(path).includes("overnightStructure") || String(path).includes("deepFollowup")) return true;
  const sceneMatch = String(path).match(/sceneVersions\[(\d+)\]/);
  return sceneMatch ? nightBIndexes.has(Number(sceneMatch[1])) : false;
}

function occurrences(text = "", needle = "") {
  if (!needle) return 0;
  let count = 0;
  let cursor = 0;
  while ((cursor = text.indexOf(needle, cursor)) >= 0) {
    count += 1;
    cursor += needle.length;
  }
  return count;
}

function textureErrors(metrics = {}, options = {}) {
  const {
    voiceTics = [],
    voiceTicsDeclared = false,
    oneTimeTic = "",
    oneTimePaths = [],
    oneTimeTicPath = "",
    cleanLineResults = [],
    voiceTicArcDeclared = false,
    voiceTicArcResults = []
  } = options;
  const errors = [];
  if (metrics.shortAnswerCount < TEXTURE_THRESHOLDS.shortAnswerCount) errors.push(`短答句 ${metrics.shortAnswerCount}/${TEXTURE_THRESHOLDS.shortAnswerCount}`);
  if (metrics.longRambleCount < TEXTURE_THRESHOLDS.longRambleCount) errors.push(`长絮叨段 ${metrics.longRambleCount}/${TEXTURE_THRESHOLDS.longRambleCount}`);
  if (metrics.interruptionCount < TEXTURE_THRESHOLDS.interruptionCount) errors.push(`掐断标记 ${metrics.interruptionCount}/${TEXTURE_THRESHOLDS.interruptionCount}`);
  if (metrics.nonLoadBearingCount < TEXTURE_THRESHOLDS.nonLoadBearingCount) errors.push(`生活噪声句 ${metrics.nonLoadBearingCount}/${TEXTURE_THRESHOLDS.nonLoadBearingCount}`);
  if (!voiceTicsDeclared) errors.push("voiceTics 未声明");
  if (!voiceTicArcDeclared) errors.push("voiceTicArc 未声明");
  if (voiceTics.length > 0 && metrics.callerTicCount < TEXTURE_THRESHOLDS.callerTicCount) errors.push(`来电人口癖 ${metrics.callerTicCount}/${TEXTURE_THRESHOLDS.callerTicCount}`);
  if (metrics.otherTicCount > TEXTURE_THRESHOLDS.otherTicCount) errors.push(`其他说话人口癖串用 ${metrics.otherTicCount}/${TEXTURE_THRESHOLDS.otherTicCount}`);
  if (voiceTicsDeclared && voiceTics.length === 0 && metrics.negativeFingerprintCount > 0) errors.push(`零语气词指纹泄漏 ${metrics.negativeFingerprintCount}`);
  if (oneTimeTic && metrics.oneTimeCallerCount !== 1) errors.push(`oneTimeTic「${oneTimeTic}」来电人出现 ${metrics.oneTimeCallerCount}/1`);
  if (oneTimeTic && metrics.oneTimeOtherCount > 0) errors.push(`oneTimeTic「${oneTimeTic}」被其他说话人使用 ${metrics.oneTimeOtherCount}`);
  if (oneTimeTic && oneTimeTicPath && (oneTimePaths.length !== 1 || oneTimePaths[0] !== oneTimeTicPath)) errors.push(`oneTimeTic「${oneTimeTic}」落点应为 ${oneTimeTicPath}`);
  cleanLineResults.filter((item) => !item.valid).forEach((item) => {
    errors.push(`指定干净句未通过: ${item.line}`);
  });
  voiceTicArcResults.filter((item) => !item.valid).forEach((item) => {
    if (item.rule === "night-b-silent") errors.push(`夜 B 口癖未消失: ${item.leakedPaths.join("、")}`);
    if (item.rule === "clean-ending-line") errors.push("噪声弧线缺少有效的最后干净句");
  });
  return errors;
}
