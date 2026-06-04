import { useEffect, useState } from 'react'
import SaveCandidateButton from './SaveCandidateButton'
import CandidateAvatar from './CandidateAvatar'
import CandidateProjectList from './CandidateProjectList'
import ContactCandidateModal from './ContactCandidateModal'
import ContactRequestStatusBadge from './ContactRequestStatusBadge'
import ProfileStrengthSection from './ProfileStrengthSection'
import ProjectDetailsModal from './ProjectDetailsModal'
import {
  calculateProfileStrength,
} from '../utils/profileStrength'
import { formatCandidateName } from '../utils/candidateHelpers'
import { getEmployerContactRequests } from '../services/contactRequestService'
import {
  getContactRequestForStudent,
  getEmployerContactState,
} from '../utils/contactRequestHelpers'

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
      <div className="mt-3">{children}</div>
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

export default function CandidateDetailModal({
  open,
  loading,
  error,
  candidate,
  onClose,
  isSaved = false,
  onToggleSave,
  saveLoading = false,
}) {
  const [employerRequests, setEmployerRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (!open || !candidate?.id) {
      setEmployerRequests([])
      return undefined
    }

    let cancelled = false

    async function loadEmployerRequests() {
      setRequestsLoading(true)

      try {
        const data = await getEmployerContactRequests()
        if (!cancelled) {
          setEmployerRequests(Array.isArray(data) ? data : [])
        }
      } catch {
        if (!cancelled) {
          setEmployerRequests([])
        }
      } finally {
        if (!cancelled) {
          setRequestsLoading(false)
        }
      }
    }

    loadEmployerRequests()

    return () => {
      cancelled = true
    }
  }, [open, candidate?.id])

  function handleContactRequestSent(created) {
    setEmployerRequests((current) => {
      const without = current.filter(
        (request) => request.studentProfileId !== created.studentProfileId,
      )
      return [created, ...without]
    })
  }

  if (!open) {
    return null
  }

  const existingContactRequest = candidate
    ? getContactRequestForStudent(employerRequests, candidate.id)
    : null
  const contactState = getEmployerContactState(existingContactRequest)

  const skills = Array.isArray(candidate?.skills) ? candidate.skills : []
  const projects = Array.isArray(candidate?.projects) ? candidate.projects : []
  const { score, missingItems } = calculateProfileStrength(candidate)

  const hasLinks =
    candidate?.githubUrl?.trim() ||
    candidate?.linkedinUrl?.trim() ||
    candidate?.portfolioUrl?.trim()

  const hasEducation =
    candidate?.university?.trim() ||
    candidate?.degree?.trim() ||
    candidate?.graduationYear?.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative max-h-[92vh] w-full max-w-[900px] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <h2 id="candidate-detail-title" className="text-lg font-bold text-slate-900">
            Candidate profile
          </h2>
          <div className="flex items-center gap-2">
            {onToggleSave && candidate && (
              <SaveCandidateButton
                isSaved={isSaved}
                onToggle={() => onToggleSave(candidate.id)}
                loading={saveLoading}
                variant="outline"
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50 px-4 py-6 sm:px-6">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-600">Loading candidate profile...</p>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && candidate && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <CandidateAvatar candidate={candidate} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCandidateName(candidate)}
                    </h3>
                    {candidate.headline?.trim() ? (
                      <p className="mt-1 text-sm font-medium text-indigo-600">
                        {candidate.headline}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">No headline added.</p>
                    )}

                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <DetailRow label="Location" value={candidate.location} />
                      <DetailRow label="Preferred role" value={candidate.preferredRole} />
                      <DetailRow label="Experience level" value={candidate.experienceLevel} />
                      <DetailRow label="Availability" value={candidate.availability} />
                    </div>

                    <ProfileStrengthSection
                      score={score}
                      missingItems={missingItems}
                      barHeightClass="h-2"
                    />
                  </div>
                </div>
              </div>

              <Section title="About">
                {candidate.bio?.trim() ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {candidate.bio}
                  </p>
                ) : (
                  <EmptyText>No bio added yet.</EmptyText>
                )}
              </Section>

              <Section title="Education">
                {hasEducation ? (
                  <div className="space-y-1">
                    <DetailRow label="University" value={candidate.university} />
                    <DetailRow label="Degree" value={candidate.degree} />
                    <DetailRow label="Graduation year" value={candidate.graduationYear} />
                  </div>
                ) : (
                  <EmptyText>No education added yet.</EmptyText>
                )}
              </Section>

              <Section title="Skills">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <EmptyText>No skills added yet.</EmptyText>
                )}
              </Section>

              <Section title="Links">
                {hasLinks ? (
                  <div className="flex flex-wrap gap-3">
                    {candidate.githubUrl?.trim() && (
                      <a
                        href={candidate.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        GitHub
                      </a>
                    )}
                    {candidate.linkedinUrl?.trim() && (
                      <a
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        LinkedIn
                      </a>
                    )}
                    {candidate.portfolioUrl?.trim() && (
                      <a
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                ) : (
                  <EmptyText>No links added yet.</EmptyText>
                )}
              </Section>

              <Section title="Projects">
                <CandidateProjectList
                  projects={projects}
                  onViewDetails={setSelectedProject}
                />
              </Section>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <div className="mr-auto flex min-w-0 flex-col gap-1.5">
            {contactState.showStatusBadge && existingContactRequest && (
              <ContactRequestStatusBadge status={existingContactRequest.status} />
            )}
            {contactState.helperText && (
              <p className="max-w-md text-xs text-slate-500">{contactState.helperText}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            disabled={!candidate || requestsLoading || contactState.disableContact}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Contact Candidate
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>

      <ContactCandidateModal
        open={contactModalOpen}
        candidate={candidate}
        onClose={() => setContactModalOpen(false)}
        onSuccess={handleContactRequestSent}
      />

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        stacked
      />
    </div>
  )
}
