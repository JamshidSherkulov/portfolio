function formatProjectDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

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

export default function ProjectDetailsModal({ project, onClose, onEdit }) {
  if (!project) {
    return null
  }

  const techStack = Array.isArray(project.techStack) ? project.techStack : []
  const createdLabel = formatProjectDate(project.createdAt)
  const updatedLabel = formatProjectDate(project.updatedAt)
  const showDemo = isDemoAvailable(project.liveDemoUrl)
  const showGithub = Boolean(project.githubUrl?.trim())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="project-details-title" className="text-xl font-bold text-slate-900">
                {project.title}
              </h2>
              <StatusBadge status={project.status} />
            </div>
            {project.projectType && (
              <p className="mt-1 text-sm text-slate-500">{project.projectType}</p>
            )}
          </div>
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

        <div className="space-y-6 px-6 py-6">
          {project.imageUrl?.trim() && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full rounded-lg border border-slate-200 object-cover"
            />
          )}

          {project.description && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Description</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
            </section>
          )}

          {project.proofSummary && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                What this project proves
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {project.proofSummary}
              </p>
            </section>
          )}

          {techStack.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Tech stack</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={`${tech}-${index}`}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(showGithub || showDemo) && (
            <section className="flex flex-wrap gap-3">
              {showGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  GitHub
                </a>
              )}
              {showDemo && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Live demo
                </a>
              )}
            </section>
          )}

          {(createdLabel || updatedLabel) && (
            <section className="text-sm text-slate-500">
              {createdLabel && <p>Created {createdLabel}</p>}
              {updatedLabel && <p className="mt-1">Updated {updatedLabel}</p>}
            </section>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
