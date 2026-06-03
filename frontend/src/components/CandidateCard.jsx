import {
  calculateSummaryProfileStrength,
  formatCandidateName,
  getCandidateInitials,
} from '../utils/candidateHelpers'

const MAX_VISIBLE_SKILLS = 5

function ProfileStrengthBar({ strength }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">Profile strength</span>
        <span className="font-semibold text-indigo-600">{strength}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  )
}

function CandidateAvatar({ candidate }) {
  const initials = getCandidateInitials(candidate)

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {initials}
    </div>
  )
}

export default function CandidateCard({ candidate, onViewProfile }) {
  const skills = Array.isArray(candidate.skills) ? candidate.skills : []
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS)
  const hiddenCount = skills.length - visibleSkills.length
  const strength = calculateSummaryProfileStrength(candidate)
  const projectCount = candidate.projectCount ?? 0

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <CandidateAvatar candidate={candidate} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-slate-900">
              {formatCandidateName(candidate)}
            </h3>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </span>
          </div>
          {candidate.headline?.trim() && (
            <p className="mt-1 line-clamp-2 text-sm font-medium text-indigo-600">
              {candidate.headline}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        {candidate.location?.trim() && <p>{candidate.location}</p>}
        {candidate.preferredRole?.trim() && (
          <p>
            <span className="text-slate-500">Role:</span> {candidate.preferredRole}
          </p>
        )}
        {candidate.experienceLevel?.trim() && (
          <p>
            <span className="text-slate-500">Level:</span> {candidate.experienceLevel}
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

      <ProfileStrengthBar strength={strength} />

      <button
        type="button"
        onClick={() => onViewProfile(candidate.id)}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        View profile
      </button>
    </article>
  )
}
