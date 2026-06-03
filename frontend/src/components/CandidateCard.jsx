import SaveCandidateButton from './SaveCandidateButton'
import CandidateAvatar from './CandidateAvatar'
import ProfileStrengthSection from './ProfileStrengthSection'
import {
  calculateProfileStrength,
} from '../utils/profileStrength'
import { formatCandidateName } from '../utils/candidateHelpers'

const MAX_VISIBLE_SKILLS = 5

export default function CandidateCard({
  candidate,
  onViewProfile,
  isSaved = false,
  onToggleSave,
  saveLoading = false,
}) {
  const skills = Array.isArray(candidate.skills) ? candidate.skills : []
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS)
  const hiddenCount = skills.length - visibleSkills.length
  const { score } = calculateProfileStrength(candidate)
  const projectCount = candidate.projectCount ?? 0

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <CandidateAvatar candidate={candidate} size="sm" />
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

      <ProfileStrengthSection score={score} showMissing={false} />

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(candidate.id)}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View profile
        </button>
        {onToggleSave && (
          <SaveCandidateButton
            isSaved={isSaved}
            onToggle={() => onToggleSave(candidate.id)}
            loading={saveLoading}
            className="w-full"
          />
        )}
      </div>
    </article>
  )
}
