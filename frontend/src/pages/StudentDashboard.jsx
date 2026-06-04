import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProjects } from '../api/projects'
import { getMyStudentProfile } from '../api/students'
import { getStudentContactRequests } from '../services/contactRequestService'
import { getApiErrorMessage } from '../utils/apiError'
import { countByStatus } from '../utils/contactRequestHelpers'
import { isNotFoundError } from '../utils/formHelpers'

const COMPLETION_FIELDS = [
  'firstName',
  'lastName',
  'headline',
  'location',
  'bio',
  'university',
  'degree',
  'preferredRole',
  'githubUrl',
  'skills',
]

function isFieldFilled(value) {
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return Boolean(value?.trim?.())
}

function calculateProfileCompletion(profile) {
  if (!profile) {
    return 0
  }

  const filledCount = COMPLETION_FIELDS.filter((field) =>
    isFieldFilled(profile[field]),
  ).length

  return Math.round((filledCount / COMPLETION_FIELDS.length) * 100)
}

function formatFirstName(name) {
  if (!name?.trim()) {
    return null
  }
  const trimmed = name.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function formatFullName(profile) {
  if (!profile) {
    return 'Your name'
  }
  const parts = [profile.firstName, profile.lastName].filter((part) => part?.trim())
  return parts.length > 0 ? parts.join(' ') : 'Your name'
}

function isLiveDemoAvailable(url) {
  if (!url?.trim()) {
    return false
  }
  return url.trim().toLowerCase() !== 'coming soon'
}

function hasAnyLiveDemo(projects) {
  return projects.some((project) => isLiveDemoAvailable(project.liveDemoUrl))
}

function hasAnyGithubLink(profile, projects) {
  if (profile?.githubUrl?.trim()) {
    return true
  }
  return projects.some((project) => project.githubUrl?.trim())
}

function StatusBadge({ status }) {
  if (!status?.trim()) {
    return null
  }

  const normalized = status.trim().toLowerCase()
  const isInProgress = normalized.includes('progress')
  const badgeClass = isInProgress
    ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : 'bg-indigo-50 text-indigo-700 ring-indigo-200'

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
    >
      {status.trim()}
    </span>
  )
}

function EmployerRequestsCard({ pending, accepted }) {
  return (
    <Link
      to="/student/requests"
      className="flex h-full min-h-[140px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">Employer Requests</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{pending} Pending</p>
      <p className="mt-1 text-sm text-slate-600">{accepted} Accepted</p>
    </Link>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <article className="flex h-full min-h-[140px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold leading-tight text-slate-900 line-clamp-2">{value}</p>
    </article>
  )
}

function ProfileCompletionCard({ completion, hasProfile }) {
  const displayCompletion = hasProfile ? completion : 0

  return (
    <article className="flex h-full min-h-[140px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">Profile completion</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{displayCompletion}%</p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${displayCompletion}%` }}
        />
      </div>

      {hasProfile && displayCompletion < 100 && (
        <p className="mt-2 text-xs text-indigo-600">
          Complete your profile to improve discoverability.
        </p>
      )}
    </article>
  )
}

function ChecklistItem({ done, label }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 text-sm font-semibold ${done ? 'text-green-600' : 'text-slate-400'}`}
        aria-hidden="true"
      >
        {done ? '✓' : '□'}
      </span>
      <span className={`text-sm ${done ? 'text-slate-500' : 'text-slate-700'}`}>{label}</span>
    </li>
  )
}

function ProfilePreviewCard({ profile, hasProfile }) {
  const fullName = formatFullName(profile)
  const role = profile?.preferredRole?.trim() || profile?.headline?.trim() || 'Add your role'
  const location = profile?.location?.trim() || 'Add your location'
  const skillPreview = (profile?.skills ?? []).slice(0, 3)

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Profile preview
      </h2>

      {hasProfile ? (
        <div className="mt-4">
          <p className="text-lg font-bold text-slate-900">{fullName}</p>
          <p className="mt-1 text-sm font-medium text-indigo-600">{role}</p>
          <p className="mt-1 text-sm text-slate-600">{location}</p>
          {skillPreview.length > 0 && (
            <p className="mt-3 text-sm text-slate-600">{skillPreview.join(' • ')}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          Create your profile to preview how employers will see you.
        </p>
      )}

      <Link
        to={hasProfile ? '/student/profile' : '/student/profile/edit'}
        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        {hasProfile ? 'View profile' : 'Create profile'}
      </Link>
    </article>
  )
}

function NextStepsCard({ hasProfile, projects, hasLiveDemo, hasGithub }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Next steps</h2>
      <ul className="mt-4 space-y-3">
        <ChecklistItem done={hasProfile} label="Create profile" />
        <ChecklistItem done={projects.length > 0} label="Add first project" />
        <ChecklistItem done={hasLiveDemo} label="Add live demo link" />
        <ChecklistItem done={hasGithub} label="Add GitHub links" />
      </ul>
    </article>
  )
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [hasProfile, setHasProfile] = useState(false)
  const [requestCounts, setRequestCounts] = useState({ PENDING: 0, ACCEPTED: 0, REJECTED: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboardData() {
      setError('')

      try {
        const projectsPromise = getMyProjects().catch((err) => {
          const message = getApiErrorMessage(err, '')
          if (message.toLowerCase().includes('profile')) {
            return []
          }
          throw err
        })

        const [profileResult, projectsData, requestsData] = await Promise.all([
          getMyStudentProfile().catch((err) => {
            if (isNotFoundError(err)) {
              return null
            }
            throw err
          }),
          projectsPromise,
          getStudentContactRequests().catch(() => []),
        ])

        if (profileResult) {
          setProfile(profileResult)
          setHasProfile(true)
        }

        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setRequestCounts(countByStatus(Array.isArray(requestsData) ? requestsData : []))
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load dashboard data.'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const completion = calculateProfileCompletion(profile)
  const skillsCount = profile?.skills?.length ?? 0
  const preferredRole = profile?.preferredRole?.trim() || 'Not set'
  const recentProjects = projects.slice(0, 3)
  const welcomeName = formatFirstName(profile?.firstName)
  const hasLiveDemo = hasAnyLiveDemo(projects)
  const hasGithub = hasAnyGithubLink(profile, projects)

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
      <h1 className="text-3xl font-bold text-slate-900">Student dashboard</h1>
      <p className="mt-2 text-slate-600">
        {welcomeName
          ? `Welcome back, ${welcomeName}.`
          : 'Welcome back. Build your proof-of-work profile.'}
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!hasProfile && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4">
          <div>
            <p className="font-semibold text-indigo-900">Complete your profile</p>
            <p className="mt-1 text-sm text-indigo-700">
              Add your details so employers can discover your skills and experience.
            </p>
          </div>
          <Link
            to="/student/profile/edit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Complete your profile
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ProfileCompletionCard completion={completion} hasProfile={hasProfile} />
            <EmployerRequestsCard
              pending={requestCounts.PENDING}
              accepted={requestCounts.ACCEPTED}
            />
            <StatCard
              label="Total projects"
              value={projects.length}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zM4.5 4a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11z" />
                </svg>
              }
            />
            <StatCard
              label="Total skills"
              value={skillsCount}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 013 10V6a1 1 0 011-1h4a1 1 0 01.707.293l7 7zM6.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <StatCard
              label="Preferred role"
              value={preferredRole}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/profile/edit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Edit profile
            </Link>
            <Link
              to="/student/projects?add=true"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Add project
            </Link>
            <Link
              to="/student/projects"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View projects
            </Link>
            <Link
              to="/student/requests"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View requests
            </Link>
            <button
              type="button"
              disabled
              title="Public profile coming soon"
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
            >
              View public profile
            </button>
          </div>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent projects</h2>
              {projects.length > 0 && (
                <Link
                  to="/student/projects"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all
                </Link>
              )}
            </div>

            {recentProjects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm text-slate-600">No projects yet.</p>
                <Link
                  to="/student/projects?add=true"
                  className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Add your first project
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to="/student/projects"
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-indigo-700">
                        {project.title}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>

                    {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span
                            key={`${tech}-${index}`}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="mt-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      View project →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <ProfilePreviewCard profile={profile} hasProfile={hasProfile} />
          <NextStepsCard
            hasProfile={hasProfile}
            projects={projects}
            hasLiveDemo={hasLiveDemo}
            hasGithub={hasGithub}
          />
        </aside>
      </div>
    </div>
  )
}
