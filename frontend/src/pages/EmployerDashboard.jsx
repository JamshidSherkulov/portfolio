import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function EmployerDashboard() {
  const { email } = useAuth()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Employer dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back{email ? `, ${email}` : ''}. Discover junior developer talent.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          to="/employer/profile"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">Company profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Set up your company details so candidates know who you are.
          </p>
        </Link>

        <Link
          to="/employer/candidates"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">Candidates</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse students and review their proof-of-work portfolios.
          </p>
        </Link>
      </div>
    </div>
  )
}
