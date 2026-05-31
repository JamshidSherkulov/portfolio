export default function ProjectCard({ project }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">
        {project?.title ?? 'Project title'}
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        {project?.description ?? 'Project description will appear here.'}
      </p>
      {project?.techStack && (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-600">
          {project.techStack}
        </p>
      )}
    </article>
  )
}
