export function formatStudentNameFromRequest(request) {
  const parts = [request?.studentFirstName, request?.studentLastName].filter((part) =>
    part?.trim(),
  )
  return parts.length > 0 ? parts.join(' ') : 'Unknown candidate'
}

export function formatRequestedDate(dateValue) {
  if (!dateValue) {
    return '—'
  }

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function countByStatus(requests) {
  const counts = { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }

  if (!Array.isArray(requests)) {
    return counts
  }

  requests.forEach((request) => {
    if (Object.prototype.hasOwnProperty.call(counts, request.status)) {
      counts[request.status] += 1
    }
  })

  return counts
}

export function getContactRequestForStudent(requests, studentProfileId) {
  if (!studentProfileId || !Array.isArray(requests)) {
    return null
  }

  return (
    requests.find((request) => request.studentProfileId === studentProfileId) ?? null
  )
}

export function sortRequestsNewestFirst(requests) {
  if (!Array.isArray(requests)) {
    return []
  }

  return [...requests].sort((a, b) => {
    const aTime = new Date(a.requestedAt ?? 0).getTime()
    const bTime = new Date(b.requestedAt ?? 0).getTime()
    return bTime - aTime
  })
}

export function getStatusDisplayLabel(status) {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ACCEPTED':
      return 'Accepted'
    case 'REJECTED':
      return 'Declined'
    default:
      return status ?? 'Unknown'
  }
}

export function getStatusBadgeLabel(status) {
  switch (status) {
    case 'PENDING':
      return 'Pending Contact Request'
    case 'ACCEPTED':
      return 'Contact Accepted'
    case 'REJECTED':
      return 'Request Declined'
    default:
      return null
  }
}

export function getStatusColorClasses(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'ACCEPTED':
      return 'bg-green-50 text-green-700 ring-green-200'
    case 'REJECTED':
      return 'bg-red-50 text-red-700 ring-red-200'
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200'
  }
}
