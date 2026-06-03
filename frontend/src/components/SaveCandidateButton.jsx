export default function SaveCandidateButton({
  isSaved,
  onToggle,
  loading = false,
  className = '',
  variant = 'default',
}) {
  const baseClass =
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

  const savedClass =
    variant === 'outline'
      ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'

  const unsavedClass =
    variant === 'outline'
      ? 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
      : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={`${baseClass} ${isSaved ? savedClass : unsavedClass} ${className}`}
      aria-pressed={isSaved}
    >
      {isSaved ? (
        <>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          {loading ? 'Removing...' : 'Unsave'}
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            />
          </svg>
          {loading ? 'Saving...' : 'Save candidate'}
        </>
      )}
    </button>
  )
}
