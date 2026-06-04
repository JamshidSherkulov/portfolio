import { useEffect, useState } from 'react'

const MAX_VISIBLE_TECH = 6
const PREVIEW_HEIGHT_CLASS = 'h-[180px]'

function isDemoAvailable(url) {
  if (!url?.trim()) {
    return false
  }
  return url.trim().toLowerCase() !== 'coming soon'
}

function hasGithubUrl(url) {
  return Boolean(url?.trim())
}

function formatUpdatedAt(value) {
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
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
    >
      {status.trim()}
    </span>
  )
}

function ActionLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
    >
      {label}
    </a>
  )
}

function DisabledButton({ label }) {
  return (
    <span
      className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-400"
      aria-disabled="true"
    >
      {label}
    </span>
  )
}

function PreviewPlaceholder() {
  return (
    <div
      className={`flex ${PREVIEW_HEIGHT_CLASS} w-full flex-col items-center justify-center rounded-t-xl bg-slate-100 text-slate-500`}
    >
      <svg
        className="h-10 w-10 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M2.25 21h19.5M3.75 3.75h16.5v16.5H3.75V3.75z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.008v.008H9V9z" />
      </svg>
      <p className="mt-2 text-sm font-medium">No preview available</p>
    </div>
  )
}

function ProjectPreview({ project, onViewDetails }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = project?.imageUrl?.trim()
  const showImage = Boolean(imageUrl) && !imageFailed

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  function handleOpenDetails() {
    onViewDetails?.(project)
  }

  const previewButtonClass = `block w-full overflow-hidden rounded-t-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${onViewDetails ? 'cursor-pointer' : 'cursor-default'}`

  if (!showImage) {
    if (!onViewDetails) {
      return <PreviewPlaceholder />
    }

    return (
      <button type="button" onClick={handleOpenDetails} className={previewButtonClass}>
        <PreviewPlaceholder />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onViewDetails ? handleOpenDetails : undefined}
      disabled={!onViewDetails}
      className={previewButtonClass}
      aria-label={onViewDetails ? `View details for ${project.title}` : undefined}
    >
      <img
        src={imageUrl}
        alt=""
        onError={() => setImageFailed(true)}
        className={`${PREVIEW_HEIGHT_CLASS} w-full object-cover transition-transform duration-300 ${onViewDetails ? 'hover:scale-105' : ''}`}
      />
    </button>
  )
}

export default function ProjectCard({ project, onEdit, onDelete, onViewDetails, deleting }) {
  const techStack = Array.isArray(project?.techStack) ? project.techStack : []
  const visibleTech = techStack.slice(0, MAX_VISIBLE_TECH)
  const hiddenTechCount = techStack.length - visibleTech.length
  const showGithub = hasGithubUrl(project.githubUrl)
  const demoAvailable = isDemoAvailable(project.liveDemoUrl)
  const updatedLabel = formatUpdatedAt(project.updatedAt)

  const metadata = [
    project.projectType,
    project.status,
    updatedLabel ? `Updated ${updatedLabel}` : null,
  ].filter(Boolean)

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <ProjectPreview project={project} onViewDetails={onViewDetails} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          {project.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
              {project.description}
            </p>
          )}

          {project.proofSummary && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                What this proves
              </p>
              <p className="mt-1 line-clamp-4 text-sm leading-relaxed text-slate-600">
                {project.proofSummary}
              </p>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTech.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {tech}
                </span>
              ))}
              {hiddenTechCount > 0 && (
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  +{hiddenTechCount} more
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {showGithub && <ActionLink href={project.githubUrl} label="GitHub" />}
            {demoAvailable ? (
              <ActionLink href={project.liveDemoUrl} label="Live demo" />
            ) : (
              <DisabledButton label="Live demo" />
            )}
            <button
              type="button"
              onClick={() => onViewDetails?.(project)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              View details
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          {metadata.length > 0 && <p className="text-xs text-slate-500">{metadata.join(' · ')}</p>}

          {(onEdit || onDelete) && (
            <div className="mt-3 flex justify-end gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(project)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  disabled={deleting}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
