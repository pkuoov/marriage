import { DEFAULT_PLAYER_NAME } from "../playerIdentity.js";

export function hostDisclosureLinesForAnchor(brief = {}, anchor = "", hostName = DEFAULT_PLAYER_NAME) {
  const disclosure = brief.hostDisclosure;
  if (!disclosure || disclosure.anchor !== anchor || !disclosure.text) return [];
  return [
    { role: "host", speaker: hostName, text: disclosure.text },
    ...(disclosure.lines ?? [])
  ];
}
