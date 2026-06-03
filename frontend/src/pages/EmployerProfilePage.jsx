import { useEffect, useState } from 'react'
import {
  createMyEmployerProfile,
  getMyEmployerProfile,
  updateMyEmployerProfile,
} from '../api/employers'
import { getApiErrorMessage } from '../utils/apiError'
import { inputClass, labelClass, textareaClass } from '../utils/formHelpers'

const emptyForm = {
  companyName: '',
  website: '',
  industry: '',
  location: '',
  companySize: '',
  description: '',
  logoUrl: '',
}

function profileToForm(profile) {
  return {
    companyName: profile.companyName ?? '',
    website: profile.website ?? '',
    industry: profile.industry ?? '',
    location: profile.location ?? '',
    companySize: profile.companySize ?? '',
    description: profile.description ?? '',
    logoUrl: profile.logoUrl ?? '',
  }
}

function formToPayload(form) {
  return {
    companyName: form.companyName.trim(),
    website: form.website.trim(),
    industry: form.industry.trim(),
    location: form.location.trim(),
    companySize: form.companySize.trim(),
    description: form.description.trim(),
    logoUrl: form.logoUrl.trim(),
  }
}

export default function EmployerProfilePage() {
  const [form, setForm] = useState(emptyForm)
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMyEmployerProfile()
        setForm(profileToForm(profile))
        setProfileExists(true)
      } catch (err) {
        if (err.response?.status === 404) {
          setForm(emptyForm)
          setProfileExists(false)
          setError('')
          return
        }

        setError(getApiErrorMessage(err, 'Failed to load company profile.'))
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

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.companyName.trim()) {
      setError('Company name is required.')
      return
    }

    setSubmitting(true)

    try {
      const payload = formToPayload(form)
      const profile = profileExists
        ? await updateMyEmployerProfile(payload)
        : await createMyEmployerProfile(payload)

      setForm(profileToForm(profile))
      setProfileExists(true)
      setSuccess(
        profileExists
          ? 'Company profile updated successfully.'
          : 'Company profile created successfully.',
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save company profile.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-slate-600">Loading company profile...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Company profile</h1>
      <p className="mt-2 text-slate-600">
        {profileExists
          ? 'Update your company details so candidates know who you are.'
          : 'Set up your company profile to start discovering junior developer talent.'}
      </p>

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

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <label htmlFor="companyName" className={labelClass}>
              Company name *
            </label>
            <input
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="website" className={labelClass}>
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="industry" className={labelClass}>
                Industry
              </label>
              <input
                id="industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
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
          </div>

          <div>
            <label htmlFor="companySize" className={labelClass}>
              Company size
            </label>
            <input
              id="companySize"
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
              placeholder="1-10, 11-50"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="logoUrl" className={labelClass}>
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              value={form.logoUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting
            ? 'Saving...'
            : profileExists
              ? 'Save company profile'
              : 'Create company profile'}
        </button>
      </form>
    </div>
  )
}
