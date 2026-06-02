export default function ProjectCard({ project, onEdit, onDelete, deleting }) {
  const techStackDisplay = Array.isArray(project?.techStack)
    ? project.techStack.join(' · ')
    : project?.techStack

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>

      {project.description && (
        <p className="mt-2 flex-1 text-sm text-slate-600">{project.description}</p>
      )}

      {project.proofSummary && (
        <p className="mt-2 text-sm text-slate-500">{project.proofSummary}</p>
      )}

      {techStackDisplay && (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-600">
          {techStackDisplay}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            GitHub
          </a>
        )}
        {project.liveDemoUrl && (
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Live demo
          </a>
        )}
      </div>

      {(project.projectType || project.status) && (
        <p className="mt-3 text-xs text-slate-500">
          {[project.projectType, project.status].filter(Boolean).join(' · ')}
        </p>
      )}

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
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
    </article>
  )
}
