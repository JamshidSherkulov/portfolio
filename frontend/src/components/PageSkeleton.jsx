function SkeletonBar({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
}

export function TablePageSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBar key={index} className="h-4 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-4">
            {Array.from({ length: 5 }).map((__, colIndex) => (
              <SkeletonBar key={colIndex} className="h-4 w-full max-w-[120px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardListSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <SkeletonBar className="h-5 w-40" />
            <SkeletonBar className="h-6 w-20 rounded-full" />
          </div>
          <SkeletonBar className="mt-3 h-4 w-32" />
          <SkeletonBar className="mt-2 h-4 w-48" />
          <SkeletonBar className="mt-4 h-16 w-full" />
          <div className="mt-4 flex gap-2">
            <SkeletonBar className="h-9 w-24 rounded-lg" />
            <SkeletonBar className="h-9 w-24 rounded-lg" />
          </div>
        </article>
      ))}
    </div>
  )
}

export function DashboardStatsSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="min-h-[140px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <SkeletonBar className="h-9 w-9 rounded-lg" />
          <SkeletonBar className="mt-3 h-4 w-24" />
          <SkeletonBar className="mt-2 h-8 w-16" />
        </article>
      ))}
    </div>
  )
}
