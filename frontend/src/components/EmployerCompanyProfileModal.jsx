import { useEffect, useState } from 'react'
import { isValidImageUrl } from '../utils/candidateHelpers'
import {
  formatRequestedDate,
  getCompanyInitials,
  getStatusColorClasses,
} from '../utils/contactRequestHelpers'

function CompanyAvatar({ request }) {
  const [imageFailed, setImageFailed] = useState(false)
  const logoUrl = request?.logoUrl?.trim()
  const showImage = isValidImageUrl(logoUrl) && !imageFailed
  const companyName = request?.companyName?.trim() || 'Company'
  const initials = getCompanyInitials(companyName)

  useEffect(() => {
    setImageFailed(false)
  }, [logoUrl])

  if (showImage) {
    return (
      <img
        src={logoUrl}
        alt=""
        aria-hidden="true"
        onError={() => setImageFailed(true)}
        className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover sm:h-16 sm:w-16"
      />
    )
  }

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 sm:h-16 sm:w-16 sm:text-xl"
      aria-label={companyName}
    >
      {initials}
    </div>
  )
}

function StatusBadge({ status }) {
  const label =
    status === 'ACCEPTED' ? 'Accepted' : status === 'REJECTED' ? 'Rejected' : 'Pending'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColorClasses(status)}`}
    >
      {label}
    </span>
  )
}

function formatWebsiteHref(url) {
  const trimmed = url?.trim()
  if (!trimmed) {
    return null
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

function getCompanyDescription(request) {
  return request?.description?.trim() || request?.companyDescription?.trim() || ''
}

function hasCompanyDetails(request, websiteHref) {
  return Boolean(
    request?.companySize?.trim() ||
      getCompanyDescription(request) ||
      websiteHref,
  )
}

export default function EmployerCompanyProfileModal({
  open,
  request,
  onClose,
  onAccept,
  onReject,
  updating = false,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && !updating) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, updating])

  if (!open || !request) {
    return null
  }

  const websiteHref = formatWebsiteHref(request.companyWebsite)
  const description = getCompanyDescription(request)
  const isPending = request.status === 'PENDING'
  const requestedLabel = formatRequestedDate(request.requestedAt)
  const showDetails = hasCompanyDetails(request, websiteHref)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-profile-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={updating ? undefined : onClose}
        aria-label="Close modal"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id="company-profile-title" className="text-base font-bold text-slate-900 sm:text-lg">
            Company profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex gap-3 sm:gap-4">
            <CompanyAvatar request={request} />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                {request.companyName?.trim() || 'Unknown company'}
              </h3>
              {request.companyIndustry?.trim() && (
                <p className="mt-0.5 text-sm font-medium text-indigo-600">
                  {request.companyIndustry}
                </p>
              )}
              {request.companyLocation?.trim() && (
                <p className="mt-0.5 text-sm text-slate-600">{request.companyLocation}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={request.status} />
                {websiteHref && (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </div>

          {requestedLabel && requestedLabel !== '—' && (
            <p className="mt-3 text-xs text-slate-500">Requested on {requestedLabel}</p>
          )}

          {showDetails && (
            <section className="mt-4 rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company details
              </h4>
              <dl className="mt-2 space-y-2 text-sm">
                {request.companySize?.trim() && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Company size</dt>
                    <dd className="mt-0.5 text-slate-700">{request.companySize}</dd>
                  </div>
                )}
                {description && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Description</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed text-slate-700">
                      {description}
                    </dd>
                  </div>
                )}
                {websiteHref && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Website</dt>
                    <dd className="mt-0.5">
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        {request.companyWebsite.trim()}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <section className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Message from employer
            </h4>
            <div className="mt-2 rounded-lg bg-slate-100 px-3 py-3 sm:px-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {request.message?.trim() || 'No message provided.'}
              </p>
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:gap-3 sm:px-5 sm:py-4">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={updating}
                className="order-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 sm:order-1 sm:w-auto"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onReject?.(request.id)}
                disabled={updating}
                className="order-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
              >
                {updating ? 'Updating...' : 'Reject request'}
              </button>
              <button
                type="button"
                onClick={() => onAccept?.(request.id)}
                disabled={updating}
                className="order-1 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 sm:order-3 sm:w-auto"
              >
                {updating ? 'Updating...' : 'Accept request'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
