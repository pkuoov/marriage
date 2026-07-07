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
  "stanceSnapshot",
  "advisorNotes",
  "respondentNote",
  "crossCaseEchoes",
  "hostDisclosure",
  "deepFollowup",
  "stageJudgement",
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

export function applyRuntimeCaseContent(brief, packet = {}) {
  if (!packet) return brief;
  if (!isRuntimeLoadedCaseContent(packet)) return brief;
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
