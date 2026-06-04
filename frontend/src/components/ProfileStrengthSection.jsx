import {
  getProfileStrengthColors,
} from '../utils/profileStrength'

const MAX_MISSING_ITEMS = 3

export default function ProfileStrengthSection({
  score,
  missingItems = [],
  barHeightClass = 'h-1.5',
  label = 'Profile strength',
  showMissing = true,
}) {
  const colors = getProfileStrengthColors(score)
  const visibleMissing = missingItems.slice(0, MAX_MISSING_ITEMS)

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className={`font-semibold ${colors.text}`}>{score}%</span>
      </div>
      <div className={`mt-1.5 ${barHeightClass} overflow-hidden rounded-full bg-slate-100`}>
        <div
          className={`h-full rounded-full transition-all ${colors.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showMissing && visibleMissing.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-slate-500">Missing:</p>
          <ul className="mt-1 space-y-0.5">
            {visibleMissing.map((item) => (
              <li key={item} className="text-xs text-slate-500">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
