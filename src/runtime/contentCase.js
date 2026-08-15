export const RUNTIME_CASE_CONTENT_STATUS = {
  metadataOnly: "metadata-only",
  runtimeLoaded: "runtime-loaded"
};

export const RUNTIME_CASE_CONTENT_FIELDS = [
  "label",
  "storyArcTitle",
  "publicHook",
  "storyArcSummary",
  "storySuspense",
  "storyClueObject",
  "callMedium",
  "taskProfile",
  "routeAxisComments",
  "driftComments",
  "texturePass",
  "voiceTics",
  "truthBoundary",
  "accusationChoices",
  "openingComplaint",
  "openingDialogue",
  "scene",
  "sceneVersions",
  "explicitClueGroups",
  "evidenceCards",
  "evidenceChecks",
  "investigationHooks",
  "delegation",
  "documents",
  "statementPatience",
  "nightStructure",
  "overnightStructure",
  "stanceSnapshot",
  "lurkerNote",
  "advisorNotes",
  "respondentNote",
  "crossCaseEchoes",
  "hostDisclosure",
  "deepFollowup",
  "stageJudgement",
  "careChoices",
  "caseClosing",
  "caseTitle",
  "storyInterludeRecap",
  "conclusionWhenCleared",
  "conclusionBranches",
  "followupTwist",
  "dailyShareTitle",
  "dailyShareBody",
  "dailyShareQuestion",
  "truth"
];

export const RUNTIME_CASE_REQUIRED_FIELDS = [
  "openingComplaint",
  "openingDialogue",
  "taskProfile",
  "routeAxisComments",
  "truthBoundary",
  "accusationChoices",
  "sceneVersions",
  "evidenceChecks",
  "investigationHooks",
  "statementPatience",
  "deepFollowup",
  "stageJudgement",
  "storyInterludeRecap",
  "followupTwist",
  "dailyShareTitle",
  "dailyShareBody",
  "dailyShareQuestion",
  "truth"
];

export function isRuntimeLoadedCaseContent(packet = {}) {
  if (!packet) return false;
  return packet.runtimeContentStatus === RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded;
}

export function runtimeCaseContentSummary(packet = {}) {
  return {
    caseId: packet.caseId,
    plotId: packet.plotId,
    runtimeContentStatus: packet.runtimeContentStatus ?? RUNTIME_CASE_CONTENT_STATUS.metadataOnly
  };
}

export function missingRuntimeCaseRequiredFields(packet = {}) {
  if (!isRuntimeLoadedCaseContent(packet)) return [];
  return RUNTIME_CASE_REQUIRED_FIELDS.filter((field) => packet[field] === undefined);
}

export function applyRuntimeCaseContent(brief, packet = {}) {
  if (!packet) return brief;
  if (!isRuntimeLoadedCaseContent(packet)) return brief;
  const missingFields = missingRuntimeCaseRequiredFields(packet);
  if (missingFields.length && typeof globalThis.console?.warn === "function") {
    globalThis.console.warn(`[contentCase] runtime-loaded case ${packet.caseId ?? "unknown"} is missing required fields: ${missingFields.join(", ")}`);
  }
  const content = RUNTIME_CASE_CONTENT_FIELDS.reduce((next, field) => {
    if (packet[field] !== undefined) next[field] = packet[field];
    return next;
  }, {});
  return {
    ...brief,
    ...content,
    runtimeContentSource: "content-pack-json",
    runtimeContentCaseId: packet.caseId ?? brief.caseId ?? null
  };
}
