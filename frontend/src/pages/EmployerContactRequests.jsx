import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { TablePageSkeleton } from '../components/PageSkeleton'
import { useToast } from '../context/ToastContext'
import { getEmployerContactRequests } from '../services/contactRequestService'
import { getApiErrorMessage } from '../utils/apiError'
import {
  formatRequestedDate,
  formatStudentNameFromRequest,
  getStatusColorClasses,
  getStatusDisplayLabel,
  sortRequestsNewestFirst,
} from '../utils/contactRequestHelpers'
import { inputClass } from '../utils/formHelpers'

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColorClasses(status)}`}
    >
      {getStatusDisplayLabel(status)}
    </span>
  )
}

export default function EmployerContactRequests() {
  const { showToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadRequests() {
      setLoading(true)
      setError('')

      try {
        const data = await getEmployerContactRequests()
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

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return sortedRequests
    }

    return sortedRequests.filter((request) =>
      formatStudentNameFromRequest(request).toLowerCase().includes(query),
    )
  }, [search, sortedRequests])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SkeletonHeader />
        <div className="mt-8">
          <TablePageSkeleton rows={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact Requests</h1>
      <p className="mt-2 text-slate-600">
        Track outreach to candidates and follow up on responses.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!error && requests.length > 0 && (
        <div className="mt-8 max-w-md">
          <label htmlFor="candidate-search" className="block text-sm font-medium text-slate-700">
            Search candidate name
          </label>
          <input
            id="candidate-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            className={inputClass}
          />
        </div>
      )}

      {!error && requests.length === 0 && (
        <div className="mt-10">
          <EmptyState
            title="No contact requests yet."
            description="Browse candidates and send a contact request to start building your shortlist."
            icon={
              <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
        </div>
      )}

      {!error && requests.length > 0 && filteredRequests.length === 0 && (
        <p className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          No candidates match your search.
        </p>
      )}

      {!error && filteredRequests.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Requested Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">
                    {formatStudentNameFromRequest(request)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {request.studentPreferredRole?.trim() || '—'}
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill status={request.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatRequestedDate(request.requestedAt)}
                  </td>
                  <td className="max-w-xs px-4 py-4 text-sm text-slate-600">
                    <p className="line-clamp-3 whitespace-pre-wrap">{request.message}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SkeletonHeader() {
  return (
    <>
      <div className="h-9 w-64 animate-pulse rounded-md bg-slate-200" />
      <div className="mt-2 h-5 w-96 max-w-full animate-pulse rounded-md bg-slate-200" />
    </>
  )
}
