export function formatCandidateName(candidate) {
  if (!candidate) {
    return 'Unnamed candidate'
  }
  const parts = [candidate.firstName, candidate.lastName].filter((part) => part?.trim())
  return parts.length > 0 ? parts.join(' ') : 'Unnamed candidate'
}

export function getCandidateInitials(candidate) {
  if (!candidate) {
    return '?'
  }
  const first = candidate.firstName?.trim()?.[0] ?? ''
  const last = candidate.lastName?.trim()?.[0] ?? ''
  const initials = `${first}${last}`.toUpperCase()
  return initials || '?'
}

export function calculateSummaryProfileStrength(candidate) {
  if (!candidate) {
    return 0
  }

  const skills = Array.isArray(candidate.skills) ? candidate.skills : []
  const checks = [
    Boolean(candidate.firstName?.trim() && candidate.lastName?.trim()),
    Boolean(candidate.headline?.trim()),
    Boolean(candidate.location?.trim()),
    Boolean(candidate.preferredRole?.trim()),
    Boolean(candidate.experienceLevel?.trim()),
    skills.length >= 3,
    (candidate.projectCount ?? 0) >= 1,
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function calculateDetailProfileStrength(candidate) {
  if (!candidate) {
    return 0
  }

  const skills = Array.isArray(candidate.skills) ? candidate.skills : []
  const projects = Array.isArray(candidate.projects) ? candidate.projects : []
  const checks = [
    Boolean(candidate.firstName?.trim() && candidate.lastName?.trim()),
    Boolean(candidate.headline?.trim()),
    Boolean(candidate.location?.trim()),
    Boolean(candidate.preferredRole?.trim()),
    Boolean(candidate.experienceLevel?.trim()),
    skills.length >= 3,
    projects.length >= 1,
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
