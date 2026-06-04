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

export const REJECTED_CONTACT_COOLDOWN_DAYS = 7

export function canResendRejectedContactRequest(request) {
  if (request?.status !== 'REJECTED') {
    return false
  }

  const updatedAt = request.updatedAt
  if (!updatedAt) {
    return true
  }

  const resendAvailableAt = new Date(updatedAt)
  resendAvailableAt.setDate(resendAvailableAt.getDate() + REJECTED_CONTACT_COOLDOWN_DAYS)

  return resendAvailableAt.getTime() <= Date.now()
}

export function getRejectedCooldownDaysRemaining(request) {
  if (request?.status !== 'REJECTED' || !request?.updatedAt) {
    return 0
  }

  const resendAvailableAt = new Date(request.updatedAt)
  resendAvailableAt.setDate(resendAvailableAt.getDate() + REJECTED_CONTACT_COOLDOWN_DAYS)

  const millisecondsRemaining = resendAvailableAt.getTime() - Date.now()
  if (millisecondsRemaining <= 0) {
    return 0
  }

  const daysRemaining = Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24))
  return Math.max(daysRemaining, 1)
}

export function getEmployerContactState(existingRequest) {
  if (!existingRequest) {
    return {
      canContact: true,
      disableContact: false,
      helperText: null,
      showStatusBadge: false,
    }
  }

  if (existingRequest.status === 'PENDING') {
    return {
      canContact: false,
      disableContact: true,
      helperText: null,
      showStatusBadge: true,
    }
  }

  if (existingRequest.status === 'ACCEPTED') {
    return {
      canContact: false,
      disableContact: true,
      helperText: null,
      showStatusBadge: true,
    }
  }

  if (existingRequest.status === 'REJECTED') {
    const canResend = canResendRejectedContactRequest(existingRequest)

    if (canResend) {
      return {
        canContact: true,
        disableContact: false,
        helperText: null,
        showStatusBadge: true,
      }
    }

    const daysRemaining = getRejectedCooldownDaysRemaining(existingRequest)
    const helperText =
      daysRemaining > 0
        ? `You can send another request in ${daysRemaining} day(s).`
        : `You can send another request after ${REJECTED_CONTACT_COOLDOWN_DAYS} days.`

    return {
      canContact: false,
      disableContact: true,
      helperText,
      showStatusBadge: true,
    }
  }

  return {
    canContact: true,
    disableContact: false,
    helperText: null,
    showStatusBadge: false,
  }
}

export function getStatusBadgeLabel(status) {
  switch (status) {
    case 'PENDING':
      return 'Pending contact request'
    case 'ACCEPTED':
      return 'Contact accepted'
    case 'REJECTED':
      return 'Request declined'
    default:
      return null
  }
}

export function getCompanyInitials(companyName) {
  if (!companyName?.trim()) {
    return '?'
  }

  const words = companyName.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  return companyName.trim().slice(0, 2).toUpperCase()
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
