import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getMyEmployerProfile } from '../api/employers'
import { getMyStudentProfile } from '../api/students'
import { useAuth } from '../auth/AuthContext'
import { getEmployerCompanyName } from '../utils/employerHelpers'
import { isNotFoundError } from '../utils/formHelpers'
import { getStudentContactRequests } from '../services/contactRequestService'
import { countByStatus } from '../utils/contactRequestHelpers'
import StudentNavbarUserMenu from './StudentNavbarUserMenu'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { isAuthenticated, role, email, logout } = useAuth()
  const [studentProfile, setStudentProfile] = useState(null)
  const [employerProfile, setEmployerProfile] = useState(null)
  const [studentProfileLoaded, setStudentProfileLoaded] = useState(false)
  const [employerProfileLoaded, setEmployerProfileLoaded] = useState(false)
  const [pendingRequestCount, setPendingRequestCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated || role !== 'STUDENT') {
      setStudentProfile(null)
      setStudentProfileLoaded(false)
      return undefined
    }

    let cancelled = false

    async function loadStudentProfile() {
      try {
        const profile = await getMyStudentProfile()
        if (!cancelled) {
          setStudentProfile(profile)
        }
      } catch (err) {
        if (!isNotFoundError(err) && !cancelled) {
          setStudentProfile(null)
        }
      } finally {
        if (!cancelled) {
          setStudentProfileLoaded(true)
        }
      }
    }

    loadStudentProfile()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, role])

  useEffect(() => {
    if (!isAuthenticated || role !== 'EMPLOYER') {
      setEmployerProfile(null)
      setEmployerProfileLoaded(false)
      return undefined
    }

    let cancelled = false

    async function loadEmployerProfile() {
      try {
        const profile = await getMyEmployerProfile()
        if (!cancelled) {
          setEmployerProfile(profile)
        }
      } catch (err) {
        if (err.response?.status !== 404 && !cancelled) {
          setEmployerProfile(null)
        }
      } finally {
        if (!cancelled) {
          setEmployerProfileLoaded(true)
        }
      }
    }

    loadEmployerProfile()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, role])

  useEffect(() => {
    if (!isAuthenticated || role !== 'STUDENT') {
      setPendingRequestCount(0)
      return undefined
    }

    let cancelled = false

    async function loadPendingCount() {
      try {
        const data = await getStudentContactRequests()
        if (!cancelled) {
          const counts = countByStatus(Array.isArray(data) ? data : [])
          setPendingRequestCount(counts.PENDING)
        }
      } catch {
        if (!cancelled) {
          setPendingRequestCount(0)
        }
      }
    }

    loadPendingCount()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, role])

  let userLabel = null

  if (isAuthenticated && role === 'EMPLOYER') {
    userLabel = employerProfileLoaded
      ? getEmployerCompanyName(employerProfile)
      : 'My Company'
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Portfolia
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
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
              <NavLink to="/student/requests" className={linkClass}>
                {pendingRequestCount > 0
                  ? `Requests (${pendingRequestCount})`
                  : 'Requests'}
              </NavLink>
            </>
          )}

          {isAuthenticated && role === 'EMPLOYER' && (
            <>
              <NavLink to="/employer/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/employer/profile" className={linkClass}>
                Company Profile
              </NavLink>
              <NavLink to="/employer/candidates" className={linkClass}>
                Candidates
              </NavLink>
              <NavLink to="/employer/saved-candidates" className={linkClass}>
                Saved
              </NavLink>
              <NavLink to="/employer/requests" className={linkClass}>
                Requests
              </NavLink>
            </>
          )}

          {isAuthenticated && role === 'STUDENT' && (
            <div className="ml-2 border-l border-slate-200 pl-4">
              <StudentNavbarUserMenu
                profile={studentProfile}
                profileLoaded={studentProfileLoaded}
                email={email}
                pendingRequestCount={pendingRequestCount}
              />
            </div>
          )}

          {isAuthenticated && role === 'EMPLOYER' && (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
              {userLabel && (
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  {`\uD83C\uDFE2 ${userLabel}`}
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
