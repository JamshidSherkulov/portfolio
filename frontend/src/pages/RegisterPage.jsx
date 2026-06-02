import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

const ROLE_OPTIONS = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Build your proof-of-work portfolio.',
  },
  {
    value: 'EMPLOYER',
    label: 'Employer',
    description: 'Discover junior developers through real projects.',
  },
]

const COPY = {
  STUDENT: {
    title: 'Create your student account',
    subtitle: 'Show your projects and prove your skills.',
  },
  EMPLOYER: {
    title: 'Create your employer account',
    subtitle: 'Find developers through real work, not just CVs.',
  },
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

function RoleCard({ option, selected, onSelect }) {
  const isSelected = selected === option.value

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={isSelected}
      className={`relative w-full rounded-xl border p-4 text-left transition ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      {isSelected && (
        <span
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white"
          aria-hidden="true"
        >
          <CheckIcon />
        </span>
      )}
      <p className="font-semibold text-slate-900">{option.label}</p>
      <p className="mt-1 text-sm text-slate-600">{option.description}</p>
    </button>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  helperText,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={id === 'password' ? 'new-password' : 'new-password'}
          value={value}
          onChange={onChange}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {helperText && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
}

function validatePassword(value) {
  if (!value) {
    return 'Password is required.'
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!/[a-zA-Z]/.test(value)) {
    return 'Password must include at least one letter.'
  }
  if (!/\d/.test(value)) {
    return 'Password must include at least one number.'
  }
  return null
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, role } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('STUDENT')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { title, subtitle } = COPY[selectedRole]

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return
    }
    if (role === 'STUDENT') {
      navigate('/student/profile', { replace: true })
    } else if (role === 'EMPLOYER') {
      navigate('/employer/profile', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  function validateForm() {
    if (!email.trim()) {
      return 'Email is required.'
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return passwordError
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }

    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const data = await register(email.trim(), password, selectedRole)
      if (data.role === 'STUDENT') {
        navigate('/student/profile')
      } else if (data.role === 'EMPLOYER') {
        navigate('/employer/profile')
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

      <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <fieldset>
          <legend className="mb-3 block text-sm font-medium text-slate-700">I am a</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => (
              <RoleCard
                key={option.value}
                option={option}
                selected={selectedRole}
                onSelect={setSelectedRole}
              />
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          helperText="Use at least 8 characters with a letter and a number."
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
