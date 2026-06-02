import { getApiErrorMessage } from './apiError'

export const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export const textareaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export const labelClass = 'block text-sm font-medium text-slate-700'

export function parseCommaSeparated(value) {
  if (!value?.trim()) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function joinCommaSeparated(items) {
  return Array.isArray(items) ? items.join(', ') : ''
}

export function isNotFoundError(error) {
  const status = error?.response?.status
  const message = getApiErrorMessage(error, '').toLowerCase()
  return status === 404 || message.includes('not found')
}
