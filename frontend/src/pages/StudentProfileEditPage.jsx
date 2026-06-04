import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createMyStudentProfile,
  getMyStudentProfile,
  updateMyStudentProfile,
} from '../api/students'
import { getApiErrorMessage } from '../utils/apiError'
import {
  inputClass,
  isNotFoundError,
  joinCommaSeparated,
  labelClass,
  parseCommaSeparated,
  textareaClass,
} from '../utils/formHelpers'

const emptyForm = {
  firstName: '',
  lastName: '',
  headline: '',
  location: '',
  bio: '',
  university: '',
  degree: '',
  graduationYear: '',
  preferredRole: '',
  experienceLevel: '',
  availability: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  profileImageUrl: '',
  skillsText: '',
}

function profileToForm(profile) {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    headline: profile.headline ?? '',
    location: profile.location ?? '',
    bio: profile.bio ?? '',
    university: profile.university ?? '',
    degree: profile.degree ?? '',
    graduationYear: profile.graduationYear ?? '',
    preferredRole: profile.preferredRole ?? '',
    experienceLevel: profile.experienceLevel ?? '',
    availability: profile.availability ?? '',
    githubUrl: profile.githubUrl ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    portfolioUrl: profile.portfolioUrl ?? '',
    profileImageUrl: profile.profileImageUrl ?? '',
    skillsText: joinCommaSeparated(profile.skills),
  }
}

function formToPayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    headline: form.headline.trim(),
    location: form.location.trim(),
    bio: form.bio.trim(),
    university: form.university.trim(),
    degree: form.degree.trim(),
    graduationYear: form.graduationYear.trim(),
    preferredRole: form.preferredRole.trim(),
    experienceLevel: form.experienceLevel.trim(),
    availability: form.availability.trim(),
    githubUrl: form.githubUrl.trim(),
    linkedinUrl: form.linkedinUrl.trim(),
    portfolioUrl: form.portfolioUrl.trim(),
    profileImageUrl: form.profileImageUrl.trim(),
    skills: parseCommaSeparated(form.skillsText),
  }
}

function FormSection({ title, children }) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

export default function StudentProfileEditPage() {
  const [form, setForm] = useState(emptyForm)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMyStudentProfile()
        setForm(profileToForm(profile))
        setHasProfile(true)
      } catch (err) {
        if (!isNotFoundError(err)) {
          setError(getApiErrorMessage(err, 'Failed to load profile.'))
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validateForm() {
    if (!form.firstName.trim()) {
      return 'First name is required.'
    }
    if (!form.lastName.trim()) {
      return 'Last name is required.'
    }
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const payload = formToPayload(form)
      const profile = hasProfile
        ? await updateMyStudentProfile(payload)
        : await createMyStudentProfile(payload)

      setForm(profileToForm(profile))
      setHasProfile(true)
      setSuccess('Profile saved successfully.')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save profile.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit profile</h1>
          <p className="mt-2 text-slate-600">
            {hasProfile
              ? 'Update your profile so employers can discover your skills and experience.'
              : 'Create your profile to start building your proof-of-work portfolio.'}
          </p>
        </div>
        {hasProfile && (
          <Link
            to="/student/profile"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View profile
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
            {success}
          </p>
        )}

        <FormSection title="Personal information">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First name *
              </label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last name *
              </label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="headline" className={labelClass}>
              Headline
            </label>
            <input
              id="headline"
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="Junior full-stack developer"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>
        </FormSection>

        <FormSection title="Education and availability">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="university" className={labelClass}>
                University
              </label>
              <input
                id="university"
                name="university"
                value={form.university}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="degree" className={labelClass}>
                Degree
              </label>
              <input
                id="degree"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="graduationYear" className={labelClass}>
              Graduation year
            </label>
            <input
              id="graduationYear"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="preferredRole" className={labelClass}>
                Preferred role
              </label>
              <input
                id="preferredRole"
                name="preferredRole"
                value={form.preferredRole}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="experienceLevel" className={labelClass}>
                Experience level
              </label>
              <input
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                placeholder="Junior, Intern, Graduate"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="availability" className={labelClass}>
              Availability
            </label>
            <input
              id="availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              placeholder="Available immediately"
              className={inputClass}
            />
          </div>
        </FormSection>

        <FormSection title="Links">
          <div>
            <label htmlFor="githubUrl" className={labelClass}>
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className={labelClass}>
              LinkedIn URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={form.linkedinUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="portfolioUrl" className={labelClass}>
              Portfolio URL
            </label>
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              value={form.portfolioUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profileImageUrl" className={labelClass}>
              Profile image URL
            </label>
            <input
              id="profileImageUrl"
              name="profileImageUrl"
              type="url"
              value={form.profileImageUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </FormSection>

        <FormSection title="Skills">
          <div>
            <label htmlFor="skillsText" className={labelClass}>
              Skills
            </label>
            <input
              id="skillsText"
              name="skillsText"
              value={form.skillsText}
              onChange={handleChange}
              placeholder="Java, Spring Boot, PostgreSQL"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">Separate skills with commas.</p>
          </div>
        </FormSection>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : hasProfile ? 'Save profile' : 'Create profile'}
        </button>
      </form>
    </div>
  )
}
