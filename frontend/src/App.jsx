import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import EmployerCandidatesPage from './pages/EmployerCandidatesPage'
import EmployerContactRequests from './pages/EmployerContactRequests'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerProfileEditPage from './pages/EmployerProfileEditPage'
import EmployerProfilePreviewPage from './pages/EmployerProfilePreviewPage'
import SavedCandidatesPage from './pages/SavedCandidatesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfileEditPage from './pages/StudentProfileEditPage'
import StudentProfilePreviewPage from './pages/StudentProfilePreviewPage'
import StudentProjectsPage from './pages/StudentProjectsPage'
import StudentRequests from './pages/StudentRequests'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile/edit"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentProfileEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentProfilePreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/projects"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/requests"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/profile/edit"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerProfileEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/profile"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerProfilePreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/candidates"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerCandidatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/saved-candidates"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <SavedCandidatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/requests"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerContactRequests />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
