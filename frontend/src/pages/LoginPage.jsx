import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.42-.58M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1.02 2.28-2.78 4.18-5 5.32M6.11 6.11C4.18 7.25 2.67 9.15 1 12c1.73 3.89 6 7 11 7 1.01 0 1.98-.13 2.88-.37"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, role } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return
    }
    if (role === 'STUDENT') {
      navigate('/student/dashboard', { replace: true })
    } else if (role === 'EMPLOYER') {
      navigate('/employer/dashboard', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const data = await login(email, password)
      if (data.role === 'STUDENT') {
        navigate('/student/dashboard')
      } else if (data.role === 'EMPLOYER') {
        navigate('/employer/dashboard')
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in to continue building your proof-of-work portfolio.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account yet?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
          Register
        </Link>
      </p>
    </div>
  )
}
