import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { CardListSkeleton } from '../components/PageSkeleton'
import { useToast } from '../context/ToastContext'
import {
  getStudentContactRequests,
  updateContactRequestStatus,
} from '../services/contactRequestService'
import { getApiErrorMessage } from '../utils/apiError'
import {
  formatRequestedDate,
  getStatusColorClasses,
  getStatusDisplayLabel,
  sortRequestsNewestFirst,
} from '../utils/contactRequestHelpers'

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColorClasses(status)}`}
    >
      {getStatusDisplayLabel(status)}
    </span>
  )
}

export default function StudentRequests() {
  const { showToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadRequests() {
      setLoading(true)
      setError('')

      try {
        const data = await getStudentContactRequests()
        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          const message = getApiErrorMessage(err, 'Something went wrong.')
          setError(message)
          showToast(message, 'error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadRequests()

    return () => {
      cancelled = true
    }
  }, [showToast])

  const sortedRequests = useMemo(() => sortRequestsNewestFirst(requests), [requests])

  async function handleStatusUpdate(requestId, status) {
    setPendingId(requestId)

    try {
      const updated = await updateContactRequestStatus(requestId, status)
      setRequests((current) =>
        current.map((request) => (request.id === requestId ? updated : request)),
      )
      showToast(status === 'ACCEPTED' ? 'Request accepted.' : 'Request rejected.')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Something went wrong.')
      showToast(message, 'error')
    } finally {
      setPendingId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="h-9 w-48 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-8">
          <CardListSkeleton count={3} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Requests</h1>
      <p className="mt-2 text-slate-600">
        Review employer messages and decide whether to connect.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!error && sortedRequests.length === 0 && (
        <div className="mt-10">
          <EmptyState
            title="No employers have contacted you yet."
            description="When an employer sends a contact request, it will appear here for you to review."
            icon={
              <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            }
          />
        </div>
      )}

      {!error && sortedRequests.length > 0 && (
        <div className="mt-8 grid gap-4">
          {sortedRequests.map((request) => {
            const isUpdating = pendingId === request.id

            return (
              <article
                key={request.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {request.companyName?.trim() || 'Unknown company'}
                    </h2>
                    {request.companyIndustry?.trim() && (
                      <p className="mt-1 text-sm text-slate-600">{request.companyIndustry}</p>
                    )}
                    {request.companyLocation?.trim() && (
                      <p className="mt-1 text-sm text-slate-600">{request.companyLocation}</p>
                    )}
                  </div>
                  <StatusPill status={request.status} />
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {request.message}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  {formatRequestedDate(request.requestedAt)}
                </p>

                {request.status === 'PENDING' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                      disabled={isUpdating}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {isUpdating ? 'Updating...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                      disabled={isUpdating}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
