export function hostDisclosureLinesForAnchor(brief = {}, anchor = "") {
  const disclosure = brief.hostDisclosure;
  if (!disclosure || disclosure.anchor !== anchor || !disclosure.text) return [];
  return [
    { role: "host", speaker: "林旭阳", text: disclosure.text },
    ...(disclosure.lines ?? [])
  ];
}
