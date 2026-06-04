export default function EmptyState({ title, description, icon }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
    </div>
  )
}
