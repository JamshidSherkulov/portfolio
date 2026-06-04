export function getSavedCandidateIds(savedCandidates) {
  const list = Array.isArray(savedCandidates) ? savedCandidates : []
  return new Set(list.map((item) => item.studentProfileId).filter(Boolean))
}

export function formatSavedAt(savedAt) {
  if (!savedAt) {
    return ''
  }

  const date = new Date(savedAt)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
