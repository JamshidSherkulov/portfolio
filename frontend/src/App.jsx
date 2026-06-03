import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import EmployerCandidatesPage from './pages/EmployerCandidatesPage'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerProfilePage from './pages/EmployerProfilePage'
import SavedCandidatesPage from './pages/SavedCandidatesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfilePage from './pages/StudentProfilePage'
import StudentProjectsPage from './pages/StudentProjectsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentProfilePage />
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
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/profile"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerProfilePage />
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
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
