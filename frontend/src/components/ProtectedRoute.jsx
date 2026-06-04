import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function getDashboardPath(userRole) {
  if (userRole === 'STUDENT') {
    return '/student/dashboard'
  }
  if (userRole === 'EMPLOYER') {
    return '/employer/dashboard'
  }
  return '/login'
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />
  }

  return children
}
