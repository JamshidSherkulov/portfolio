import api from './axios'

export async function getMyStudentProfile() {
  const { data } = await api.get('/api/students/me')
  return data
}

export async function createMyStudentProfile(payload) {
  const { data } = await api.post('/api/students/me', payload)
  return data
}

export async function updateMyStudentProfile(payload) {
  const { data } = await api.put('/api/students/me', payload)
  return data
}
