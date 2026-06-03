import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidateById, getCandidates } from '../api/candidates'
import { getMyEmployerProfile } from '../api/employers'
import CandidateCard from '../components/CandidateCard'
import CandidateDetailModal from '../components/CandidateDetailModal'
import { useSavedCandidates } from '../hooks/useSavedCandidates'
import { getApiErrorMessage } from '../utils/apiError'
import { calculateSummaryProfileStrength } from '../utils/candidateHelpers'
import { calculateEmployerProfileCompletion } from '../utils/employerHelpers'

function StatCard({ label, value, icon }) {
  return (
    <article className="flex h-full min-h-[140px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold leading-tight text-slate-900">{value}</p>
    </article>
  )
}

function QuickActionCard({ title, description, to, icon, comingSoon = false }) {
  const cardClass =
    'group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md'

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
          {icon}
        </div>
        {comingSoon && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Coming Soon
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-600">{description}</p>
    </>
  )

  if (comingSoon) {
    return (
      <article className={`${cardClass} cursor-not-allowed opacity-75`} aria-disabled="true">
        {content}
      </article>
    )
  }

  return (
    <Link to={to} className={cardClass}>
      {content}
    </Link>
  )
}

function computeDashboardStats(candidates) {
  const list = Array.isArray(candidates) ? candidates : []

  const studentProfiles = list.filter(
    (candidate) => calculateSummaryProfileStrength(candidate) === 100,
  ).length

  const projectsSubmitted = list.reduce(
    (total, candidate) => total + (candidate.projectCount ?? 0),
    0,
  )

  const uniqueSkills = new Set()
  list.forEach((candidate) => {
    const skills = Array.isArray(candidate.skills) ? candidate.skills : []
    skills.forEach((skill) => {
      if (skill?.trim()) {
        uniqueSkills.add(skill.trim().toLowerCase())
      }
    })
  })

  return {
    candidatesAvailable: list.length,
    studentProfiles,
    projectsSubmitted,
    skillsIndexed: uniqueSkills.size,
  }
}

export default function EmployerDashboard() {
  const [candidates, setCandidates] = useState([])
  const [employerProfile, setEmployerProfile] = useState(null)
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [candidateDetail, setCandidateDetail] = useState(null)

  const {
    savedCount,
    isSaved,
    toggleSave,
    pendingId,
  } = useSavedCandidates()

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [candidatesResult, profileResult] = await Promise.allSettled([
          getCandidates({}),
          getMyEmployerProfile(),
        ])

        if (cancelled) {
          return
        }

        if (candidatesResult.status === 'fulfilled') {
          setCandidates(Array.isArray(candidatesResult.value) ? candidatesResult.value : [])
        } else {
          setCandidates([])
          setError(
            getApiErrorMessage(candidatesResult.reason, 'Failed to load candidates.'),
          )
        }

        if (profileResult.status === 'fulfilled') {
          setEmployerProfile(profileResult.value)
          setProfileExists(true)
        } else if (profileResult.reason?.response?.status === 404) {
          setEmployerProfile(null)
          setProfileExists(false)
        } else {
          setEmployerProfile(null)
          setProfileExists(false)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
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

  const stats = useMemo(() => computeDashboardStats(candidates), [candidates])
  const recentCandidates = useMemo(() => candidates.slice(0, 3), [candidates])
  const profileCompletion = useMemo(
    () => calculateEmployerProfileCompletion(profileExists ? employerProfile : null),
    [employerProfile, profileExists],
  )

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
      // Saved candidate errors are handled by the hook on other pages.
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Section 1: Hero */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Employer Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
          Discover junior developers through proof-of-work portfolios.
        </p>
        <Link
          to="/employer/candidates"
          className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Browse Candidates
        </Link>
      </section>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Section 2: Stats */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Candidates Available"
            value={stats.candidatesAvailable}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.002 6.002 0 0110 17c-1.667 0-3.182-.645-4.296-1.81z" />
              </svg>
            }
          />
          <StatCard
            label="Student Profiles"
            value={stats.studentProfiles}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <StatCard
            label="Projects Submitted"
            value={stats.projectsSubmitted}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 4.5A.75.75 0 012.75 8.5h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 4.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
              </svg>
            }
          />
          <StatCard
            label="Skills Indexed"
            value={stats.skillsIndexed}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <StatCard
            label="Saved Candidates"
            value={savedCount}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            }
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Student Profiles counts candidates with 100% profile strength based on available summary
          data.
        </p>
      </section>

      {/* Section 3: Quick Actions */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Browse Candidates"
            description="Search and filter junior developers by skills, location, and experience."
            to="/employer/candidates"
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            }
          />
          <QuickActionCard
            title="Review Student Portfolios"
            description="Open candidate profiles and explore proof-of-work projects."
            to="/employer/candidates"
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <QuickActionCard
            title="Update Company Profile"
            description="Manage company details so candidates know who you are."
            to="/employer/profile"
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <QuickActionCard
            title="Future Challenges"
            description="Post technical challenges for candidates to showcase their skills."
            comingSoon
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814 3.668a1 1 0 00-1.414-1.414L3.836 9.855l-1.403-2.836a1 1 0 00-1.75.117l-.96 1.44a1 1 0 00.117 1.323l3.84 3.84a1 1 0 001.414 0l6.16-6.16zm-1.44 2.672L14.16 8.16l-2.672 2.672-2.672-2.672 2.672-2.672 2.672 2.672zM16.672 6.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM7.429 9.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <QuickActionCard
            title="Saved Candidates"
            description="Keep track of promising talent for future roles."
            to="/employer/saved-candidates"
            icon={
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Section 4: Recent Candidates */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Candidates</h2>
            <p className="mt-1 text-sm text-slate-600">
              Preview the latest student profiles available to browse.
            </p>
          </div>
          <Link
            to="/employer/candidates"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All Candidates &rarr;
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-600">No candidates available yet.</p>
            <Link
              to="/employer/candidates"
              className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Browse Candidates
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentCandidates.map((candidate) => (
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
        )}
      </section>

      {/* Section 5: Company Profile Status */}
      <section className="mt-10">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Company Profile Status</h2>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {profileCompletion.isComplete
                  ? `Company Profile ${profileCompletion.percentage}% Complete`
                  : 'Company Profile Incomplete'}
              </p>
              {!profileCompletion.isComplete && profileCompletion.missingLabels.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-600">Missing:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                    {profileCompletion.missingLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="w-full min-w-[160px] sm:w-48">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Completion</span>
                  <span className="font-semibold text-indigo-600">
                    {profileCompletion.percentage}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>
              </div>
              {!profileCompletion.isComplete && (
                <Link
                  to="/employer/profile"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Complete Profile
                </Link>
              )}
            </div>
          </div>
        </article>
      </section>

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
