const MAX_VISIBLE_TECH = 4

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

function CandidateProjectListItem({ project, onViewDetails }) {
  const techStack = Array.isArray(project.techStack) ? project.techStack : []
  const visibleTech = techStack.slice(0, MAX_VISIBLE_TECH)
  const hiddenTechCount = techStack.length - visibleTech.length

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h5 className="min-w-0 flex-1 font-semibold leading-snug text-slate-900">
          {project.title}
        </h5>
        <StatusBadge status={project.status} />
      </div>

      {project.projectType?.trim() && (
        <p className="mt-1 text-xs font-medium text-slate-500">{project.projectType}</p>
      )}

      {visibleTech.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visibleTech.map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            >
              {tech}
            </span>
          ))}
          {hiddenTechCount > 0 && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
              +{hiddenTechCount} more
            </span>
          )}
        </div>
      )}

      {project.description?.trim() && (
        <p className="mt-2 line-clamp-1 text-sm text-slate-600">{project.description}</p>
      )}

      <button
        type="button"
        onClick={() => onViewDetails(project)}
        className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      >
        View details
      </button>
    </article>
  )
}

export default function CandidateProjectList({ projects, onViewDetails }) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return <p className="text-sm text-slate-500">No projects added yet.</p>
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <CandidateProjectListItem
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
