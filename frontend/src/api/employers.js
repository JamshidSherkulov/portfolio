import api from './axios'

export async function getMyEmployerProfile() {
  const { data } = await api.get('/api/employers/me')
  return data
}

export async function createMyEmployerProfile(payload) {
  const { data } = await api.post('/api/employers/me', payload)
  return data
}

export async function updateMyEmployerProfile(payload) {
  const { data } = await api.put('/api/employers/me', payload)
  return data
}
