import { useEffect, useState } from 'react'
import { sendContactRequest } from '../services/contactRequestService'
import { useToast } from '../context/ToastContext'
import { getApiErrorMessage } from '../utils/apiError'
import { labelClass, textareaClass } from '../utils/formHelpers'

const MIN_MESSAGE_LENGTH = 20
const MAX_MESSAGE_LENGTH = 1000

export default function ContactCandidateModal({
  open,
  candidate,
  onClose,
  onSuccess,
}) {
  const { showToast } = useToast()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    setMessage('')
    setError('')

    function handleEscape(event) {
      if (event.key === 'Escape' && !submitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, submitting])

  if (!open || !candidate) {
    return null
  }

  const trimmedLength = message.trim().length
  const isValid =
    trimmedLength >= MIN_MESSAGE_LENGTH && trimmedLength <= MAX_MESSAGE_LENGTH

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!isValid) {
      setError(`Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters.`)
      return
    }

    setSubmitting(true)

    try {
      const created = await sendContactRequest(candidate.id, message.trim())
      showToast('Contact request sent successfully.')
      onSuccess?.(created)
      onClose()
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Failed to send request.')
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-candidate-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={submitting ? undefined : onClose}
        aria-label="Close modal"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="contact-candidate-title" className="text-lg font-bold text-slate-900">
          Contact Candidate
        </h2>

        <div className="mt-4">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Introduce yourself and explain why you would like to connect."
            className={textareaClass}
            disabled={submitting}
          />
          <p className="mt-1 text-xs text-slate-500">
            {trimmedLength} / {MAX_MESSAGE_LENGTH} characters (minimum {MIN_MESSAGE_LENGTH})
          </p>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !isValid}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
