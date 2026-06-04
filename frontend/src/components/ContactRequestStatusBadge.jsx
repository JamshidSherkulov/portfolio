import { getStatusBadgeLabel, getStatusColorClasses } from '../utils/contactRequestHelpers'

export default function ContactRequestStatusBadge({ status }) {
  const label = getStatusBadgeLabel(status)

  if (!label) {
    return null
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColorClasses(status)}`}
    >
      {label}
    </span>
  )
}
