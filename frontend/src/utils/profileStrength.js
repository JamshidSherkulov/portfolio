const PLACEHOLDER_VALUES = new Set([
  'your university',
  'coming soon',
  'n/a',
  'test',
  'placeholder',
])

export function isMeaningfulValue(value) {
  if (value == null) {
    return false
  }

  const trimmed = String(value).trim()
  if (!trimmed) {
    return false
  }

  return !PLACEHOLDER_VALUES.has(trimmed.toLowerCase())
}

function getMeaningfulSkillCount(candidate) {
  const skills = Array.isArray(candidate?.skills) ? candidate.skills : []
  return skills.filter((skill) => isMeaningfulValue(skill)).length
}

function getProjectCount(candidate) {
  if (Array.isArray(candidate?.projects)) {
    return candidate.projects.length
  }

  const count = candidate?.projectCount
  if (typeof count === 'number' && count >= 0) {
    return count
  }

  return 0
}

function scoreSkills(skillCount) {
  if (skillCount >= 6) {
    return 15
  }
  if (skillCount >= 3) {
    return 10
  }
  if (skillCount >= 1) {
    return 5
  }
  return 0
}

function scoreProjects(projectCount) {
  if (projectCount >= 3) {
    return 25
  }
  if (projectCount === 2) {
    return 20
  }
  if (projectCount === 1) {
    return 10
  }
  return 0
}

function evaluateField(candidate, key, points, missingLabel, state) {
  if (isMeaningfulValue(candidate?.[key])) {
    state.score += points
  } else {
    state.missingItems.push(missingLabel)
  }
}

export function calculateProfileStrength(candidate) {
  if (!candidate) {
    return { score: 0, missingItems: [] }
  }

  const state = { score: 0, missingItems: [] }

  evaluateField(candidate, 'firstName', 5, 'First name', state)
  evaluateField(candidate, 'lastName', 5, 'Last name', state)
  evaluateField(candidate, 'headline', 5, 'Headline', state)
  evaluateField(candidate, 'location', 5, 'Location', state)
  evaluateField(candidate, 'bio', 10, 'Bio', state)
  evaluateField(candidate, 'university', 5, 'University', state)
  evaluateField(candidate, 'degree', 5, 'Degree', state)
  evaluateField(candidate, 'graduationYear', 5, 'Graduation year', state)
  evaluateField(candidate, 'githubUrl', 5, 'GitHub profile', state)
  evaluateField(candidate, 'linkedinUrl', 5, 'LinkedIn profile', state)
  evaluateField(candidate, 'portfolioUrl', 5, 'Portfolio website', state)

  const skillCount = getMeaningfulSkillCount(candidate)
  state.score += scoreSkills(skillCount)
  if (skillCount === 0) {
    state.missingItems.push('Skills')
  }

  const projectCount = getProjectCount(candidate)
  state.score += scoreProjects(projectCount)
  if (projectCount === 0) {
    state.missingItems.push('Projects')
  }

  return {
    score: Math.min(100, Math.max(0, state.score)),
    missingItems: state.missingItems,
  }
}

export function getProfileStrengthColors(score) {
  if (score <= 49) {
    return { bar: 'bg-red-500', text: 'text-red-600' }
  }
  if (score <= 79) {
    return { bar: 'bg-amber-500', text: 'text-amber-600' }
  }
  return { bar: 'bg-green-600', text: 'text-green-600' }
}
