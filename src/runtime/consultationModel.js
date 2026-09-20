// Night two can continue privately while retaining its existing scene/save IDs.
export function isPrivateConsultation(brief = {}, state = {}) {
  if (brief?.overnightStructure?.sessionMode !== "private-consultation") return false;
  const key = brief.id ?? brief.caseId;
  return state.caseOvernights?.[key]?.segment === "night2"
    || state.caseNights?.[key]?.segment === "segment2";
}
