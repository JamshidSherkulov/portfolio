import api from './axios'

export async function getMyProjects() {
  const { data } = await api.get('/api/projects/me')
  return data
}

export async function createMyProject(payload) {
  const { data } = await api.post('/api/projects/me', payload)
  return data
}

export async function updateMyProject(projectId, payload) {
  const { data } = await api.put(`/api/projects/${projectId}`, payload)
  return data
}

export async function deleteMyProject(projectId) {
  await api.delete(`/api/projects/${projectId}`)
}
