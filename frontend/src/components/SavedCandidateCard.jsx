import { formatCandidateName, getCandidateInitials } from '../utils/candidateHelpers'
import { formatSavedAt } from '../utils/savedCandidateHelpers'

const MAX_VISIBLE_SKILLS = 5

function CandidateAvatar({ saved }) {
  const initials = getCandidateInitials(saved)

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {initials}
    </div>
  )
}

export default function SavedCandidateCard({
  saved,
  onViewProfile,
  onRemove,
  removing = false,
}) {
  const skills = Array.isArray(saved.skills) ? saved.skills : []
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS)
  const hiddenCount = skills.length - visibleSkills.length
  const projectCount = saved.projectCount ?? 0
  const savedAtLabel = formatSavedAt(saved.savedAt)

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <CandidateAvatar saved={saved} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-slate-900">
              {formatCandidateName(saved)}
            </h3>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </span>
          </div>
          {saved.headline?.trim() && (
            <p className="mt-1 line-clamp-2 text-sm font-medium text-indigo-600">
              {saved.headline}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        {saved.location?.trim() && <p>{saved.location}</p>}
        {saved.preferredRole?.trim() && (
          <p>
            <span className="text-slate-500">Role:</span> {saved.preferredRole}
          </p>
        )}
        {saved.experienceLevel?.trim() && (
          <p>
            <span className="text-slate-500">Level:</span> {saved.experienceLevel}
          </p>
        )}
        {savedAtLabel && (
          <p>
            <span className="text-slate-500">Saved:</span> {savedAtLabel}
          </p>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {visibleSkills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
              +{hiddenCount} more
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(saved.studentProfileId)}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View profile
        </button>
        <button
          type="button"
          onClick={() => onRemove(saved.studentProfileId)}
          disabled={removing}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {removing ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </article>
  )
}
