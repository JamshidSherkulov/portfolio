import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyEmployerProfile } from '../api/employers'
import { getApiErrorMessage } from '../utils/apiError'
import { isValidImageUrl } from '../utils/candidateHelpers'
import { getCompanyInitials } from '../utils/contactRequestHelpers'
import { getEmployerCompanyName } from '../utils/employerHelpers'

function PreviewSection({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function EmptyText({ children }) {
  return <p className="text-sm text-slate-500">{children}</p>
}

function DetailRow({ label, value }) {
  if (!value?.trim()) {
    return null
  }

  return (
    <p className="text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}:</span> {value}
    </p>
  )
}

function formatWebsiteHref(url) {
  const trimmed = url?.trim()
  if (!trimmed) {
    return null
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

function formatWebsiteLabel(url) {
  const trimmed = url?.trim()
  if (!trimmed) {
    return ''
  }
  return trimmed.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

function CompanyLogo({ profile }) {
  const [imageFailed, setImageFailed] = useState(false)
  const logoUrl = profile?.logoUrl?.trim()
  const showImage = isValidImageUrl(logoUrl) && !imageFailed
  const companyName = getEmployerCompanyName(profile)
  const initials = getCompanyInitials(companyName)

  useEffect(() => {
    setImageFailed(false)
  }, [logoUrl])

  if (showImage) {
    return (
      <img
        src={logoUrl}
        alt=""
        aria-hidden="true"
        onError={() => setImageFailed(true)}
        className="h-24 w-24 shrink-0 rounded-full border border-slate-200 object-cover"
      />
    )
  }

  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600"
      aria-label={companyName}
    >
      {initials}
    </div>
  )
}

export default function EmployerProfilePreviewPage() {
  const [profile, setProfile] = useState(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setError('')

      try {
        const profileResult = await getMyEmployerProfile()
        setProfile(profileResult)
        setHasProfile(true)
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null)
          setHasProfile(false)
          return
        }

        setError(getApiErrorMessage(err, 'Failed to load company profile.'))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Loading company profile...</p>
        </div>
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Company profile</h1>
        <p className="mt-2 text-slate-600">
          Preview how candidates will see your company on Portfolia.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">You have not created a company profile yet.</p>
          <Link
            to="/employer/profile/edit"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create company profile
          </Link>
        </div>
      </div>
    )
  }

  const companyName = getEmployerCompanyName(profile)
  const websiteHref = formatWebsiteHref(profile.website)
  const websiteLabel = formatWebsiteLabel(profile.website)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company profile</h1>
          <p className="mt-2 text-slate-600">
            This is how candidates see your company when reviewing contact requests.
          </p>
        </div>
        <Link
          to="/employer/profile/edit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Edit Company Profile
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <CompanyLogo profile={profile} />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{companyName}</h2>
              {profile.industry?.trim() ? (
                <p className="mt-1 text-sm font-medium text-indigo-600">{profile.industry}</p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No industry added.</p>
              )}
              <div className="mt-3 space-y-1">
                <DetailRow label="Location" value={profile.location} />
                <DetailRow label="Company size" value={profile.companySize} />
              </div>
              {websiteHref ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Visit website
                </a>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No website added.</p>
              )}
              {websiteLabel && websiteHref && (
                <p className="mt-2 text-xs text-slate-500">{websiteLabel}</p>
              )}
            </div>
          </div>
        </section>

        <PreviewSection title="About">
          {profile.description?.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {profile.description}
            </p>
          ) : (
            <EmptyText>No company description added yet.</EmptyText>
          )}
        </PreviewSection>
      </div>
    </div>
  )
}
