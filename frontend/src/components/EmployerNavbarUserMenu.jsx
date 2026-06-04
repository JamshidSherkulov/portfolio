import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { isValidImageUrl } from '../utils/candidateHelpers'
import { getCompanyInitials } from '../utils/contactRequestHelpers'
import { getEmployerCompanyName } from '../utils/employerHelpers'

function EmployerNavbarAvatar({ profile, companyName }) {
  const [imageFailed, setImageFailed] = useState(false)
  const logoUrl = profile?.logoUrl?.trim()
  const showImage = isValidImageUrl(logoUrl) && !imageFailed
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
        className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover"
      />
    )
  }

  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

const menuItemClass =
  'block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100'

export default function EmployerNavbarUserMenu({ profile, profileLoaded }) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const companyName = profileLoaded ? getEmployerCompanyName(profile) : 'My Company'

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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${companyName}`}
      >
        <EmployerNavbarAvatar profile={profile} companyName={companyName} />
        <span className="hidden max-w-[12rem] truncate sm:inline">{companyName}</span>
        <span className="text-xs text-slate-500" aria-hidden="true">
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[12rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <Link
            to="/employer/profile"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            View Company Profile
          </Link>
          <Link
            to="/employer/profile/edit"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Edit Company Profile
          </Link>
          <Link
            to="/employer/candidates"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Candidates
          </Link>
          <Link
            to="/employer/saved-candidates"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Saved Candidates
          </Link>
          <Link
            to="/employer/requests"
            role="menuitem"
            className={menuItemClass}
            onClick={closeMenu}
          >
            Requests
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
