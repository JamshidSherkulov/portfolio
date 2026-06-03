import {
  calculateDetailProfileStrength,
  formatCandidateName,
  getCandidateInitials,
} from '../utils/candidateHelpers'

function isDemoAvailable(url) {
  if (!url?.trim()) {
    return false
  }
  return url.trim().toLowerCase() !== 'coming soon'
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

function ProfileStrengthBar({ strength }) {
  return (
    <div className="mt-3 max-w-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">Profile strength</span>
        <span className="font-semibold text-indigo-600">{strength}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  )
}

function Section({ title, children }) {
  if (!children) {
    return null
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CandidateAvatar({ candidate, size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-20 w-20 text-xl' : 'h-12 w-12 text-sm'

  if (candidate?.profileImageUrl?.trim()) {
    return (
      <img
        src={candidate.profileImageUrl}
        alt={formatCandidateName(candidate)}
        className={`${sizeClass} rounded-full border border-slate-200 object-cover`}
      />
    )
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700`}
    >
      {getCandidateInitials(candidate)}
    </div>
  )
}

function ProjectItem({ project }) {
  const techStack = Array.isArray(project.techStack) ? project.techStack : []
  const showGithub = Boolean(project.githubUrl?.trim())
  const showDemo = isDemoAvailable(project.liveDemoUrl)

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h5 className="font-semibold text-slate-900">{project.title}</h5>
        <StatusBadge status={project.status} />
      </div>

      {project.projectType?.trim() && (
        <p className="mt-1 text-xs font-medium text-slate-500">{project.projectType}</p>
      )}

      {project.description?.trim() && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
      )}

      {project.proofSummary?.trim() && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            What this project proves
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{project.proofSummary}</p>
        </div>
      )}

      {techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {(showGithub || showDemo) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {showGithub && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              GitHub
            </a>
          )}
          {showDemo && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Live demo
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function CandidateDetailModal({ open, loading, error, candidate, onClose }) {
  if (!open) {
    return null
  }

  const skills = Array.isArray(candidate?.skills) ? candidate.skills : []
  const projects = Array.isArray(candidate?.projects) ? candidate.projects : []
  const strength = calculateDetailProfileStrength(candidate)

  const educationParts = [candidate?.university, candidate?.degree, candidate?.graduationYear].filter(
    (part) => part?.trim(),
  )

  const hasLinks =
    candidate?.githubUrl?.trim() ||
    candidate?.linkedinUrl?.trim() ||
    candidate?.portfolioUrl?.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <h2 id="candidate-detail-title" className="text-xl font-bold text-slate-900">
            Candidate profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 bg-slate-50 px-6 py-6">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">Loading candidate profile...</p>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && candidate && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <CandidateAvatar candidate={candidate} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCandidateName(candidate)}
                    </h3>
                    {candidate.headline?.trim() && (
                      <p className="mt-1 text-sm font-medium text-indigo-600">
                        {candidate.headline}
                      </p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      {candidate.location?.trim() && <p>{candidate.location}</p>}
                      {candidate.availability?.trim() && (
                        <p>
                          <span className="text-slate-500">Availability:</span>{' '}
                          {candidate.availability}
                        </p>
                      )}
                    </div>
                    <ProfileStrengthBar strength={strength} />
                  </div>
                </div>
              </div>

              {candidate.bio?.trim() && (
                <Section title="About">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {candidate.bio}
                  </p>
                </Section>
              )}

              {educationParts.length > 0 && (
                <Section title="Education">
                  <p className="text-sm text-slate-600">{educationParts.join(' · ')}</p>
                </Section>
              )}

              {skills.length > 0 && (
                <Section title="Skills">
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
                </Section>
              )}

              {hasLinks && (
                <Section title="Links">
                  <div className="flex flex-wrap gap-3">
                    {candidate.githubUrl?.trim() && (
                      <a
                        href={candidate.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        GitHub
                      </a>
                    )}
                    {candidate.linkedinUrl?.trim() && (
                      <a
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        LinkedIn
                      </a>
                    )}
                    {candidate.portfolioUrl?.trim() && (
                      <a
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                </Section>
              )}

              <Section title="Projects">
                {projects.length === 0 ? (
                  <p className="text-sm text-slate-500">No projects listed.</p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <ProjectItem key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </Section>
            </>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
