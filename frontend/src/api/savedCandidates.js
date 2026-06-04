import api from './axios'

export async function getSavedCandidates() {
  const { data } = await api.get('/api/saved-candidates')
  return data
}

export async function saveCandidate(studentProfileId) {
  const { data } = await api.post(`/api/saved-candidates/${studentProfileId}`)
  return data
}

export async function removeSavedCandidate(studentProfileId) {
  await api.delete(`/api/saved-candidates/${studentProfileId}`)
}
