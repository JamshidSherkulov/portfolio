import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidateById } from '../api/candidates'
import CandidateDetailModal from '../components/CandidateDetailModal'
import SavedCandidateCard from '../components/SavedCandidateCard'
import { useSavedCandidates } from '../hooks/useSavedCandidates'
import { getApiErrorMessage } from '../utils/apiError'

export default function SavedCandidatesPage() {
  const {
    savedCandidates,
    loading,
    error,
    pendingId,
    isSaved,
    toggleSave,
    unsaveCandidate,
  } = useSavedCandidates()

  const [modalOpen, setModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [candidateDetail, setCandidateDetail] = useState(null)

  useEffect(() => {
    if (!modalOpen) {
      return undefined
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modalOpen])

  async function handleViewProfile(studentProfileId) {
    setModalOpen(true)
    setDetailLoading(true)
    setDetailError('')
    setCandidateDetail(null)

    try {
      const detail = await getCandidateById(studentProfileId)
      setCandidateDetail(detail)
    } catch (err) {
      setDetailError(getApiErrorMessage(err, 'Failed to load candidate profile.'))
    } finally {
      setDetailLoading(false)
    }
  }

  function closeModal() {
    setModalOpen(false)
    setDetailLoading(false)
    setDetailError('')
    setCandidateDetail(null)
  }

  async function handleToggleSave(studentProfileId) {
    try {
      await toggleSave(studentProfileId)
    } catch {
      // Error is surfaced via error from the hook.
    }
  }

  async function handleRemove(studentProfileId) {
    try {
      await unsaveCandidate(studentProfileId)
    } catch {
      // Error is surfaced via error from the hook.
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading saved candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Saved Candidates</h1>
      <p className="mt-2 text-slate-600">
        Your shortlist of promising junior developers.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!error && savedCandidates.length === 0 && (
        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No saved candidates yet</h2>
          <p className="mt-3 text-sm text-slate-600">
            Save candidates from the search page to build your shortlist.
          </p>
          <Link
            to="/employer/candidates"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse Candidates
          </Link>
        </div>
      )}

      {savedCandidates.length > 0 && (
        <>
          <p className="mt-6 text-sm text-slate-500">
            {savedCandidates.length === 1
              ? '1 saved candidate'
              : `${savedCandidates.length} saved candidates`}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedCandidates.map((saved) => (
              <SavedCandidateCard
                key={saved.savedCandidateId ?? saved.studentProfileId}
                saved={saved}
                onViewProfile={handleViewProfile}
                onRemove={handleRemove}
                removing={pendingId === saved.studentProfileId}
              />
            ))}
          </div>
        </>
      )}

      <CandidateDetailModal
        open={modalOpen}
        loading={detailLoading}
        error={detailError}
        candidate={candidateDetail}
        onClose={closeModal}
        isSaved={candidateDetail ? isSaved(candidateDetail.id) : false}
        onToggleSave={candidateDetail ? handleToggleSave : undefined}
        saveLoading={candidateDetail ? pendingId === candidateDetail.id : false}
      />
    </div>
  )
}
