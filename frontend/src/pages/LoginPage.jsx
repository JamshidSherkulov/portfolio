import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, role } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      <p className="mt-2 text-sm text-slate-600">Welcome back to Portfolia.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

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
