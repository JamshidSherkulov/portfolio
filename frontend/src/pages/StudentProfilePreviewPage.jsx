import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CandidateAvatar from '../components/CandidateAvatar'
import CandidateProjectList from '../components/CandidateProjectList'
import ProjectDetailsModal from '../components/ProjectDetailsModal'
import { getMyProjects } from '../api/projects'
import { getMyStudentProfile } from '../api/students'
import { getApiErrorMessage } from '../utils/apiError'
import { formatCandidateName } from '../utils/candidateHelpers'
import { isNotFoundError } from '../utils/formHelpers'

const LATEST_PROJECTS_LIMIT = 3

function PreviewSection({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function EmptyText({ children }) {
  return <p className="text-sm text-slate-500">{children}</p>
}

function DetailRow({ label, value }) {
  if (!value?.trim()) {
    return null
  }

  return (
    <p className="text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}:</span> {value}
    </p>
  )
}

function sortProjectsByRecent(projects) {
  return [...projects].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bTime - aTime
  })
}

export default function StudentProfilePreviewPage() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    async function loadPreviewData() {
      setError('')

      try {
        const projectsPromise = getMyProjects().catch((err) => {
          const message = getApiErrorMessage(err, '')
          if (message.toLowerCase().includes('profile')) {
            return []
          }
          throw err
        })

        const [profileResult, projectsData] = await Promise.all([
          getMyStudentProfile().catch((err) => {
            if (isNotFoundError(err)) {
              return null
            }
            throw err
          }),
          projectsPromise,
        ])

        if (profileResult) {
          setProfile(profileResult)
          setHasProfile(true)
        }

        setProjects(Array.isArray(projectsData) ? projectsData : [])
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load profile.'))
      } finally {
        setLoading(false)
      }
    }

    loadPreviewData()
  }, [])

  const skills = Array.isArray(profile?.skills) ? profile.skills : []
  const latestProjects = sortProjectsByRecent(projects).slice(0, LATEST_PROJECTS_LIMIT)

  const hasLinks =
    profile?.githubUrl?.trim() ||
    profile?.linkedinUrl?.trim() ||
    profile?.portfolioUrl?.trim()

  const hasEducation =
    profile?.university?.trim() ||
    profile?.degree?.trim() ||
    profile?.graduationYear?.trim()

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Student profile</h1>
        <p className="mt-2 text-slate-600">
          Preview how employers will see your proof-of-work profile.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">You have not created a profile yet.</p>
          <Link
            to="/student/profile/edit"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student profile</h1>
          <p className="mt-2 text-slate-600">
            This is how employers see your profile on Portfolia.
          </p>
        </div>
        <Link
          to="/student/profile/edit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Edit profile
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <CandidateAvatar candidate={profile} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{formatCandidateName(profile)}</h2>
              {profile.headline?.trim() ? (
                <p className="mt-1 text-sm font-medium text-indigo-600">{profile.headline}</p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No headline added.</p>
              )}
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <DetailRow label="Location" value={profile.location} />
                <DetailRow label="Availability" value={profile.availability} />
              </div>
            </div>
          </div>
        </section>

        <PreviewSection title="About">
          {profile.bio?.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {profile.bio}
            </p>
          ) : (
            <EmptyText>No bio added yet.</EmptyText>
          )}
        </PreviewSection>

        <PreviewSection title="Education">
          {hasEducation ? (
            <div className="space-y-1">
              <DetailRow label="University" value={profile.university} />
              <DetailRow label="Degree" value={profile.degree} />
              <DetailRow label="Graduation year" value={profile.graduationYear} />
            </div>
          ) : (
            <EmptyText>No education added yet.</EmptyText>
          )}
        </PreviewSection>

        <PreviewSection title="Skills">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <EmptyText>No skills added yet.</EmptyText>
          )}
        </PreviewSection>

        <PreviewSection title="Links">
          {hasLinks ? (
            <div className="flex flex-wrap gap-3">
              {profile.githubUrl?.trim() && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  GitHub
                </a>
              )}
              {profile.linkedinUrl?.trim() && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolioUrl?.trim() && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Portfolio
                </a>
              )}
            </div>
          ) : (
            <EmptyText>No links added yet.</EmptyText>
          )}
        </PreviewSection>

        <PreviewSection title="Projects">
          {latestProjects.length === 0 ? (
            <EmptyText>No projects added yet.</EmptyText>
          ) : (
            <>
              <CandidateProjectList
                projects={latestProjects}
                onViewDetails={setSelectedProject}
              />
              {projects.length > LATEST_PROJECTS_LIMIT && (
                <Link
                  to="/student/projects"
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all projects
                </Link>
              )}
            </>
          )}
        </PreviewSection>
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        stacked
      />
    </div>
  )
}
