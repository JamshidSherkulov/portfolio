import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createMyProject,
  deleteMyProject,
  getMyProjects,
  updateMyProject,
} from '../api/projects'
import ProjectCard from '../components/ProjectCard'
import { getApiErrorMessage } from '../utils/apiError'
import {
  inputClass,
  joinCommaSeparated,
  labelClass,
  parseCommaSeparated,
  textareaClass,
} from '../utils/formHelpers'

const emptyForm = {
  title: '',
  description: '',
  proofSummary: '',
  techStackText: '',
  githubUrl: '',
  liveDemoUrl: '',
  imageUrl: '',
  projectType: '',
  status: '',
}

function projectToForm(project) {
  return {
    title: project.title ?? '',
    description: project.description ?? '',
    proofSummary: project.proofSummary ?? '',
    techStackText: joinCommaSeparated(project.techStack),
    githubUrl: project.githubUrl ?? '',
    liveDemoUrl: project.liveDemoUrl ?? '',
    imageUrl: project.imageUrl ?? '',
    projectType: project.projectType ?? '',
    status: project.status ?? '',
  }
}

function formToPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    proofSummary: form.proofSummary.trim(),
    techStack: parseCommaSeparated(form.techStackText),
    githubUrl: form.githubUrl.trim(),
    liveDemoUrl: form.liveDemoUrl.trim(),
    imageUrl: form.imageUrl.trim(),
    projectType: form.projectType.trim(),
    status: form.status.trim(),
  }
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [needsProfile, setNeedsProfile] = useState(false)

  async function loadProjects() {
    setError('')
    try {
      const data = await getMyProjects()
      setProjects(data)
      setNeedsProfile(false)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to load projects.')
      if (message.toLowerCase().includes('profile')) {
        setNeedsProfile(true)
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function openCreateForm() {
    setEditingProjectId(null)
    setForm(emptyForm)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function openEditForm(project) {
    setEditingProjectId(project.id)
    setForm(projectToForm(project))
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function cancelForm() {
    setShowForm(false)
    setEditingProjectId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim()) {
      setError('Project title is required.')
      return
    }

    setSubmitting(true)

    try {
      const payload = formToPayload(form)

      if (editingProjectId) {
        const updated = await updateMyProject(editingProjectId, payload)
        setProjects((prev) =>
          prev.map((project) => (project.id === editingProjectId ? updated : project)),
        )
        setSuccess('Project updated successfully.')
      } else {
        const created = await createMyProject(payload)
        setProjects((prev) => [created, ...prev])
        setSuccess('Project created successfully.')
      }

      cancelForm()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to save project.')
      if (message.toLowerCase().includes('profile')) {
        setNeedsProfile(true)
      }
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(`Delete "${project.title}"?`)
    if (!confirmed) {
      return
    }

    setDeletingId(project.id)
    setError('')
    setSuccess('')

    try {
      await deleteMyProject(project.id)
      setProjects((prev) => prev.filter((item) => item.id !== project.id))
      if (editingProjectId === project.id) {
        cancelForm()
      }
      setSuccess('Project deleted successfully.')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete project.'))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-slate-600">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your projects</h1>
          <p className="mt-2 text-slate-600">
            Manage portfolio projects that demonstrate your skills.
          </p>
        </div>
        {!needsProfile && (
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Add project
          </button>
        )}
      </div>

      {needsProfile && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Create your student profile before adding projects.{' '}
          <Link to="/student/profile" className="font-medium text-indigo-600 hover:text-indigo-700">
            Go to profile
          </Link>
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            {editingProjectId ? 'Edit project' : 'New project'}
          </h2>

          <div>
            <label htmlFor="title" className={labelClass}>
              Title *
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
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
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="proofSummary" className={labelClass}>
              Proof summary
            </label>
            <textarea
              id="proofSummary"
              name="proofSummary"
              rows={3}
              value={form.proofSummary}
              onChange={handleChange}
              placeholder="What this project proves about your skills"
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="techStackText" className={labelClass}>
              Tech stack
            </label>
            <input
              id="techStackText"
              name="techStackText"
              value={form.techStackText}
              onChange={handleChange}
              placeholder="React, Spring Boot, PostgreSQL"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">Separate technologies with commas.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <label htmlFor="liveDemoUrl" className={labelClass}>
                Live demo URL
              </label>
              <input
                id="liveDemoUrl"
                name="liveDemoUrl"
                type="url"
                value={form.liveDemoUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="projectType" className={labelClass}>
                Project type
              </label>
              <input
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                placeholder="Web app, API, Mobile"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <input
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Completed, In progress"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting
                ? 'Saving...'
                : editingProjectId
                  ? 'Update project'
                  : 'Create project'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!needsProfile && projects.length === 0 && !showForm && (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">You have not added any projects yet.</p>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Add your first project
          </button>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditForm}
              onDelete={handleDelete}
              deleting={deletingId === project.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
