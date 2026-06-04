import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getCandidateInitials, isValidImageUrl } from '../utils/candidateHelpers'

function getStudentDisplayName(profile, email) {
  const firstName = profile?.firstName?.trim()
  const lastName = profile?.lastName?.trim()

  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  if (firstName) {
    return firstName
  }
  return email ?? ''
}

function getStudentFirstName(profile, email) {
  const firstName = profile?.firstName?.trim()
  if (firstName) {
    return firstName
  }
  const display = getStudentDisplayName(profile, email)
  return display.split(/\s+/)[0] ?? display
}

function StudentNavbarAvatar({ profile }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = profile?.profileImageUrl?.trim()
  const showImage = isValidImageUrl(imageUrl) && !imageFailed
  const initials = getCandidateInitials(profile)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        onError={() => setImageFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

const menuItemClass =
  'block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100'

export default function StudentNavbarUserMenu({
  profile,
  profileLoaded,
  email,
  pendingRequestCount = 0,
}) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const fullName = profileLoaded ? getStudentDisplayName(profile, email) : email
  const firstName = profileLoaded ? getStudentFirstName(profile, email) : email?.split('@')[0]

  useEffect(() => {
    if (!open) {
      return undefined
    }

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function closeMenu() {
    setOpen(false)
  }

  function handleLogout() {
    closeMenu()
    logout()
  }

  const requestsLabel =
    pendingRequestCount > 0 ? `Requests (${pendingRequestCount})` : 'Requests'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${fullName}`}
      >
        <StudentNavbarAvatar profile={profile} />
        <span className="max-w-[8rem] truncate sm:hidden">{firstName}</span>
        <span className="hidden max-w-[12rem] truncate sm:inline">{fullName}</span>
        <span className="text-xs text-slate-500" aria-hidden="true">
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[11rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <Link
            to="/student/profile"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            View Profile
          </Link>
          <Link
            to="/student/profile/edit"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Edit Profile
          </Link>
          <Link
            to="/student/projects"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Projects
          </Link>
          <Link
            to="/student/requests"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            {requestsLabel}
          </Link>
          <div className="my-1 border-t border-slate-100" />
          <button type="button" role="menuitem" className={menuItemClass} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
