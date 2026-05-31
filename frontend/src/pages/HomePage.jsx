import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Proof-of-work recruitment
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Show what you can build, not just what you claim
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        Portfolia helps junior developers prove their skills with real projects
        and helps employers discover motivated talent.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
        >
          Get started as a student
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Sign in
        </Link>
      </div>
    </section>
  )
}
