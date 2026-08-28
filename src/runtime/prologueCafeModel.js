export const CAFE_PROLOGUE_SCENES = Object.freeze({
  confrontation: "cafePrologue",
  aftermath: "cafePrologueAftermath",
  forensic: "cafePrologueForensic"
});

export const CAFE_PROLOGUE_INVESTIGATIONS = Object.freeze(["toy", "account"]);

export function normalizedCafePrologueProgress(state = {}) {
  const marks = uniqueKnownValues(state.cafePrologueMarks, ["chat", "hotel"]);
  const order = uniqueKnownValues(state.cafePrologueOrder, CAFE_PROLOGUE_INVESTIGATIONS);
  return {
    step: Math.max(0, Math.floor(Number(state.cafePrologueStep) || 0)),
    marks,
    order,
    statementId: typeof state.cafePrologueStatementId === "string"
      ? state.cafePrologueStatementId
      : "",
    statementReaction: typeof state.cafePrologueStatementReaction === "string"
      ? state.cafePrologueStatementReaction
      : "",
    evidenceId: ["chat", "hotel"].includes(state.cafePrologueEvidenceId)
      ? state.cafePrologueEvidenceId
      : "",
    transferSelected: state.cafePrologueTransferSelected === true,
    legalBriefSeen: state.cafePrologueLegalBriefSeen === true,
    pressureChoice: typeof state.cafeProloguePressureChoice === "string"
      ? state.cafeProloguePressureChoice
      : ""
  };
}

export function cafePrologueStatementReady(progress = {}, correctStatementId = "hotel-denial") {
  return progress.statementId === correctStatementId;
}

export function cafePrologueCanPresentEvidence(progress = {}, correctStatementId = "hotel-denial") {
  return cafePrologueStatementReady(progress, correctStatementId)
    && ["chat", "hotel"].includes(progress.evidenceId);
}

export function cafePrologueRemainingEvidenceId(progress = {}) {
  const first = progress.marks?.[0] ?? progress.evidenceId;
  if (first === "chat") return "hotel";
  if (first === "hotel") return "chat";
  return "";
}

export function cafePrologueCanOpenForensic(progress = {}) {
  return CAFE_PROLOGUE_INVESTIGATIONS.includes(progress.order?.[0]);
}

export function cafePrologueSceneForStep(step = 0) {
  const value = Math.max(0, Math.floor(Number(step) || 0));
  if (value >= 8) return CAFE_PROLOGUE_SCENES.forensic;
  if (value >= 6) return CAFE_PROLOGUE_SCENES.aftermath;
  return CAFE_PROLOGUE_SCENES.confrontation;
}

function uniqueKnownValues(value, allowed) {
  const source = Array.isArray(value) ? value : [];
  const allowedSet = new Set(allowed);
  return [...new Set(source.filter((entry) => allowedSet.has(entry)))];
}
