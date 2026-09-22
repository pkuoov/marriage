import { createInterludeDeskFlow } from "./interludeDeskFlow.js";
import { createInterludeEvidenceFlow } from "./interludeEvidenceFlow.js";
import { createInterludeInvestigationFlow } from "./interludeInvestigationFlow.js";

export function createInterludeScreens(ctx) {
  const scope = {
    getState: () => ctx.getState()
  };
  Object.assign(
    scope,
    createInterludeDeskFlow(ctx, scope),
    createInterludeEvidenceFlow(ctx, scope),
    createInterludeInvestigationFlow(ctx, scope)
  );
  return {
    renderInterludeDesk: scope.renderInterludeDesk,
    renderInterludeAction: scope.renderInterludeAction,
    renderInterludeDelegation: scope.renderInterludeDelegation,
    renderInterludeEvidence: scope.renderInterludeEvidence,
    renderInterludeBackflow: scope.renderInterludeBackflow,
    renderInterludeAdvisorCall: scope.renderInterludeAdvisorCall,
    renderInterludePlayback: scope.renderInterludePlayback,
    renderInterludeInterruptToast: scope.renderInterludeInterruptToast,
    renderAfterSceneEvidence: scope.renderAfterSceneEvidence,
    renderEvidenceCheck: scope.renderEvidenceCheck,
    renderInvestigationBackflow: scope.renderInvestigationBackflow,
    renderDelegation: scope.renderDelegation
  };
}
