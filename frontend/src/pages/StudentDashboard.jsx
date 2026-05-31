import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function StudentDashboard() {
  const { email } = useAuth()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Student dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back{email ? `, ${email}` : ''}. Build your proof-of-work profile.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          to="/student/profile"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">Your profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add your bio, skills, and links so employers can learn about you.
          </p>
        </Link>

        <Link
          to="/student/projects"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">Your projects</h2>
          <p className="mt-2 text-sm text-slate-600">
            Showcase real work that proves what you can build.
          </p>
        </Link>
      </div>
    </div>
  )
}
