import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { isAuthenticated, role, email, logout } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Portfolia
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && role === 'STUDENT' && (
            <>
              <NavLink to="/student/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/student/profile" className={linkClass}>
                Profile
              </NavLink>
              <NavLink to="/student/projects" className={linkClass}>
                Projects
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
              {email && (
                <span className="hidden text-sm text-slate-500 sm:inline">
                  {email}
                </span>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
