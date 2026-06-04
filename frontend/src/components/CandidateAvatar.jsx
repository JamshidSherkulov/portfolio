import { useEffect, useState } from 'react'
import { formatCandidateName, getCandidateInitials, isValidImageUrl } from '../utils/candidateHelpers'

const SIZE_CLASSES = {
  sm: { container: 'h-12 w-12', text: 'text-sm' },
  lg: { container: 'h-24 w-24', text: 'text-2xl' },
}

export default function CandidateAvatar({ candidate, size = 'sm' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = candidate?.profileImageUrl?.trim()
  const showImage = isValidImageUrl(imageUrl) && !imageFailed
  const { container, text } = SIZE_CLASSES[size] ?? SIZE_CLASSES.sm
  const initials = getCandidateInitials(candidate)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        onError={() => setImageFailed(true)}
        className={`${container} shrink-0 rounded-full border border-slate-200 object-cover`}
      />
    )
  }

  return (
    <div
      className={`flex ${container} shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ${text}`}
      aria-label={formatCandidateName(candidate)}
    >
      {initials}
    </div>
  )
}
