const ARCHIVED_CARD_TYPES = ["主线物证", "跨套线索", "排期表", "音频恢复", "资料夹"];

export function visibleReferencedStoryEvidence(brief, archive) {
  return (brief.referencesEvidenceIds ?? [])
    .map((id) => archive.find((item) => item.id === id) ?? null)
    .filter((item) => item?.discovered !== false)
    .filter(Boolean);
}

export function buildStoryEvidenceArchiveCards({ brief, caseKey, foundContradictions = [], result, now = Date.now() }) {
  if (!brief?.fixedStory) return [];
  const found = new Set(foundContradictions);
  return (brief.evidenceCards ?? [])
    .filter((card) => ARCHIVED_CARD_TYPES.includes(card.type))
    .map((card) => ({
      id: card.id,
      caseId: brief.id,
      caseKey,
      caseTitle: brief.storyArcTitle ?? brief.label,
      setName: brief.storySetName ?? "故事模式",
      type: card.type,
      title: card.title,
      contradiction: card.contradiction,
      discovered: result?.correct || found.has(card.contradiction),
      at: now
    }));
}
