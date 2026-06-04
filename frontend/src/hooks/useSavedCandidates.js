import { useCallback, useEffect, useState } from 'react'
import {
  getSavedCandidates,
  removeSavedCandidate,
  saveCandidate as saveCandidateApi,
} from '../api/savedCandidates'
import { getApiErrorMessage } from '../utils/apiError'
import { getSavedCandidateIds } from '../utils/savedCandidateHelpers'

export function useSavedCandidates({ autoLoad = true } = {}) {
  const [savedCandidates, setSavedCandidates] = useState([])
  const [savedIds, setSavedIds] = useState(() => new Set())
  const [loading, setLoading] = useState(autoLoad)
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState('')

  const loadSaved = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getSavedCandidates()
      const list = Array.isArray(data) ? data : []
      setSavedCandidates(list)
      setSavedIds(getSavedCandidateIds(list))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load saved candidates.'))
      setSavedCandidates([])
      setSavedIds(new Set())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoLoad) {
      loadSaved()
    }
  }, [autoLoad, loadSaved])

  const isSaved = useCallback(
    (studentProfileId) => savedIds.has(studentProfileId),
    [savedIds],
  )

  const saveCandidate = useCallback(async (studentProfileId) => {
    setPendingId(studentProfileId)
    setError('')

    try {
      const saved = await saveCandidateApi(studentProfileId)
      setSavedIds((prev) => new Set([...prev, studentProfileId]))
      setSavedCandidates((prev) => {
        const without = prev.filter((item) => item.studentProfileId !== studentProfileId)
        return [saved, ...without]
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save candidate.'))
      throw err
    } finally {
      setPendingId(null)
    }
  }, [])

  const unsaveCandidate = useCallback(async (studentProfileId) => {
    setPendingId(studentProfileId)
    setError('')

    try {
      await removeSavedCandidate(studentProfileId)
      setSavedIds((prev) => {
        const next = new Set(prev)
        next.delete(studentProfileId)
        return next
      })
      setSavedCandidates((prev) =>
        prev.filter((item) => item.studentProfileId !== studentProfileId),
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to remove saved candidate.'))
      throw err
    } finally {
      setPendingId(null)
    }
  }, [])

  const toggleSave = useCallback(
    async (studentProfileId) => {
      if (savedIds.has(studentProfileId)) {
        await unsaveCandidate(studentProfileId)
      } else {
        await saveCandidate(studentProfileId)
      }
    },
    [savedIds, saveCandidate, unsaveCandidate],
  )

  return {
    savedCandidates,
    savedIds,
    savedCount: savedCandidates.length,
    loading,
    pendingId,
    error,
    setError,
    isSaved,
    saveCandidate,
    unsaveCandidate,
    toggleSave,
    reloadSaved: loadSaved,
  }
}
