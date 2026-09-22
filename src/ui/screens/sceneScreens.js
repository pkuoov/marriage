import { createSceneBeatFlow } from "./sceneBeatFlow.js";
import { createSceneQuestionFlow } from "./sceneQuestionFlow.js";
import { createSceneReviewFlow } from "./sceneReviewFlow.js";
import { createStatementReplayFlow } from "./statementReplayFlow.js";
import { createTestimonyWallScreens } from "./testimonyWallScreens.js";

export function createSceneScreens(ctx) {
  const scope = {
    getState: () => ctx.getState()
  };
  Object.assign(scope, createTestimonyWallScreens({
    ...ctx,
    continueAfterFocusedEvidence: (...args) => scope.continueAfterSceneReview(...args)
  }));
  Object.assign(
    scope,
    createStatementReplayFlow(ctx, scope),
    createSceneQuestionFlow(ctx, scope),
    createSceneBeatFlow(ctx, scope),
    createSceneReviewFlow(ctx, scope)
  );
  return {
    renderSceneReview: scope.renderSceneReview,
    renderSceneQuestionMenu: scope.renderSceneQuestionMenu,
    renderSceneQuestionAnswer: scope.renderSceneQuestionAnswer,
    renderTestimonyPrelude: scope.renderTestimonyPrelude,
    renderTestimonyWall: scope.renderTestimonyWall,
    renderTestimonyMaterials: scope.renderTestimonyMaterials,
    renderDecisivePresentTarget: scope.renderDecisivePresentTarget,
    renderDecisivePresentHit: scope.renderDecisivePresentHit,
    renderSceneLineReplay: scope.renderSceneLineReplay,
    renderStatementPatienceLost: scope.renderStatementPatienceLost,
    renderStanceSnapshot: scope.renderStanceSnapshot,
    renderHangupBeat: scope.renderHangupBeat,
    renderCallerQuestion: scope.renderCallerQuestion,
    renderDeepFollowup: scope.renderDeepFollowup,
    renderPatienceLost: scope.renderPatienceLost,
    renderAccusation: scope.renderAccusation,
    bindSceneButtons: scope.bindSceneButtons
  };
}
