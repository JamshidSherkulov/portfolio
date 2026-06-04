import api from './axios'

function buildSearchParams(filters) {
  const params = {}

  if (filters.skill?.trim()) {
    params.skill = filters.skill.trim()
  }
  if (filters.location?.trim()) {
    params.location = filters.location.trim()
  }
  if (filters.preferredRole?.trim()) {
    params.preferredRole = filters.preferredRole.trim()
  }
  if (filters.experienceLevel?.trim()) {
    params.experienceLevel = filters.experienceLevel.trim()
  }

  return params
}

export async function getCandidates(filters = {}) {
  const { data } = await api.get('/api/candidates', {
    params: buildSearchParams(filters),
  })
  return data
}

export async function getCandidateById(studentProfileId) {
  const { data } = await api.get(`/api/candidates/${studentProfileId}`)
  return data
}
