import { useEffect, useState } from 'react'
import { getCandidateById, getCandidates } from '../api/candidates'
import CandidateCard from '../components/CandidateCard'
import CandidateDetailModal from '../components/CandidateDetailModal'
import { useSavedCandidates } from '../hooks/useSavedCandidates'
import { getApiErrorMessage } from '../utils/apiError'
import { inputClass, labelClass } from '../utils/formHelpers'

const emptyFilters = {
  skill: '',
  location: '',
  preferredRole: '',
  experienceLevel: '',
}

export default function EmployerCandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [candidateDetail, setCandidateDetail] = useState(null)

  const {
    loading: savedLoading,
    error: savedError,
    isSaved,
    toggleSave,
    pendingId,
  } = useSavedCandidates()

  async function fetchCandidates(activeFilters = filters, isInitial = false) {
    if (isInitial) {
      setLoading(true)
    } else {
      setSearching(true)
    }
    setError('')

    try {
      const data = await getCandidates(activeFilters)
      setCandidates(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load candidates.'))
      setCandidates([])
    } finally {
      if (isInitial) {
        setLoading(false)
      } else {
        setSearching(false)
      }
    }
  }

  useEffect(() => {
    fetchCandidates(emptyFilters, true)
  }, [])

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

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    fetchCandidates(filters)
  }

  function handleClearFilters() {
    setFilters(emptyFilters)
    fetchCandidates(emptyFilters)
  }

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
      // Error is surfaced via savedError from the hook.
    }
  }

  if (loading || savedLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
      <p className="mt-2 text-slate-600">
        Search junior developers by skills, location, and experience.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Search filters</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="skill" className={labelClass}>
              Skill
            </label>
            <input
              id="skill"
              name="skill"
              value={filters.skill}
              onChange={handleFilterChange}
              placeholder="Java, React"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="London, UK"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="preferredRole" className={labelClass}>
              Preferred role
            </label>
            <input
              id="preferredRole"
              name="preferredRole"
              value={filters.preferredRole}
              onChange={handleFilterChange}
              placeholder="Backend Developer"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="experienceLevel" className={labelClass}>
              Experience level
            </label>
            <input
              id="experienceLevel"
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
              placeholder="Junior"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4 max-w-md">
          <label htmlFor="availability" className={labelClass}>
            Availability
          </label>
          <input
            id="availability"
            name="availability"
            disabled
            placeholder="Coming soon"
            title="Availability filtering is not supported by the backend yet"
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400"
          />
          <p className="mt-1 text-xs text-slate-500">
            Availability filter coming soon — not sent to the backend yet.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={searching}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={searching}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Clear filters
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {savedError && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {savedError}
        </p>
      )}

      {!error && candidates.length === 0 && (
        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No candidates found</h2>
          <p className="mt-3 text-sm text-slate-600">
            Try removing some filters or searching by a different skill.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={searching}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Clear filters
          </button>
        </div>
      )}

      {candidates.length > 0 && (
        <>
          <p className="mt-6 text-sm text-slate-500">
            {candidates.length === 1 ? '1 candidate' : `${candidates.length} candidates`}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onViewProfile={handleViewProfile}
                isSaved={isSaved(candidate.id)}
                onToggleSave={handleToggleSave}
                saveLoading={pendingId === candidate.id}
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
