import {
  storyCallCountText,
  storyCommentWall,
  storyMaterialProfile,
  storyObjectProfile,
  storyPackAftertaste,
  storyPackAxes,
  storyPackBestAxis,
  storyPackClosingLine,
  storyHiddenThreadProfile,
  storyPlayerType,
  storyQuoteProfile,
  storyShareTitle,
  storyThemeProfile,
  truthBoundaryPackProfile,
  truthBoundaryReview
} from "./recapModel.js?v=0.20.69";
import { pressurePackProfile, pressureRecapProfile } from "./livePressure.js?v=0.21.1";

export function storyPackSummaryModel({
  briefs = [],
  results = [],
  routeProfiles = [],
  boundaryRows = [],
  pressureRows = [],
  materialRows = []
} = {}) {
  const avgPercent = averageIssuePercent(results, briefs.length);
  const displayBest = storyPackBestAxis(avgPercent, storyPackAxes(routeProfiles));
  const theme = storyThemeProfile(briefs);
  const boundaryProfile = truthBoundaryPackProfile(boundaryRows);
  const pressureProfile = pressurePackProfile(pressureRows);
  const materialProfile = storyMaterialProfile(materialRows);
  const quoteProfile = storyQuoteProfile(results);
  const objectProfile = storyObjectProfile(briefs);
  const hiddenThreadProfile = storyHiddenThreadProfile({ theme, avgPercent, objectProfile });
  const playerType = storyPlayerType(avgPercent, displayBest);
  const shareTitle = storyShareTitle(avgPercent, displayBest);
  const aftertaste = storyPackAftertaste(avgPercent, briefs.length);
  const closingLine = storyPackClosingLine(avgPercent, displayBest, briefs.length);
  const callCountText = storyCallCountText(briefs.length);
  const comments = storyCommentWall({
    briefs,
    results,
    routes: routeProfiles,
    best: displayBest,
    avgPercent,
    theme,
    boundaryProfile,
    pressureProfile,
    materialProfile,
    quoteProfile,
    objectProfile,
    hiddenThreadProfile
  });
  return {
    avgPercent,
    displayBest,
    theme,
    boundaryProfile,
    pressureProfile,
    materialProfile,
    quoteProfile,
    objectProfile,
    hiddenThreadProfile,
    playerType,
    shareTitle,
    aftertaste,
    closingLine,
    callCountText,
    comments
  };
}

export function storyBoundaryRows(briefs = [], { picksFor = () => ({}), missesFor = () => ({}) } = {}) {
  return (Array.isArray(briefs) ? briefs : []).map((brief) => ({
    label: brief?.label ?? "",
    review: truthBoundaryReview(brief),
    picks: picksFor(brief),
    misses: missesFor(brief)
  }));
}

export function storyPressureRows(briefs = [], { budgetFor = () => ({}), choicesFor = () => [], foundCountFor = () => 0 } = {}) {
  return (Array.isArray(briefs) ? briefs : []).map((brief) => ({
    label: brief?.label ?? "",
    profile: pressureRecapProfile({
      budget: budgetFor(brief),
      choices: choicesFor(brief),
      foundCount: foundCountFor(brief)
    })
  }));
}

export function storyMaterialRows(briefs = [], { evidencePicksFor = () => [], investigationPicksFor = () => [] } = {}) {
  return (Array.isArray(briefs) ? briefs : []).map((brief) => ({
    label: brief?.label ?? "",
    picks: [
      ...evidencePicksFor(brief),
      ...investigationPicksFor(brief)
    ]
  }));
}

function averageIssuePercent(results = [], caseCount = 0) {
  const total = Math.max(1, Number(caseCount || results.length || 0));
  return Math.round((Array.isArray(results) ? results : []).reduce((sum, result) => sum + Number(result?.issuePercent ?? 0), 0) / total);
}
