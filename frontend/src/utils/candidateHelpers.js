export function isValidImageUrl(url) {
  if (!url?.trim()) {
    return false
  }

  const trimmed = url.trim()
  const placeholderValues = new Set([
    'your university',
    'coming soon',
    'n/a',
    'test',
    'placeholder',
  ])

  if (placeholderValues.has(trimmed.toLowerCase())) {
    return false
  }

  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }

    const pathname = parsed.pathname.toLowerCase()
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(pathname)) {
      return true
    }

    const trustedImageHosts = [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'media.licdn.com',
      'platform-lookaside.fbsbx.com',
    ]

    const hostname = parsed.hostname.toLowerCase()
    return trustedImageHosts.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    )
  } catch {
    return false
  }
}

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
