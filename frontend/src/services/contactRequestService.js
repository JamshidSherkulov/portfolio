import api from '../api/axios'

export async function sendContactRequest(studentProfileId, message) {
  const { data } = await api.post('/api/contact-requests', {
    studentProfileId,
    message,
  })
  return data
}

export async function getEmployerContactRequests() {
  const { data } = await api.get('/api/contact-requests/employer')
  return data
}

export async function getStudentContactRequests() {
  const { data } = await api.get('/api/contact-requests/student')
  return data
}

export async function updateContactRequestStatus(id, status) {
  const { data } = await api.put(`/api/contact-requests/${id}/status`, { status })
  return data
}
