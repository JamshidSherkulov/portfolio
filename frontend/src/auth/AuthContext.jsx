import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const email = localStorage.getItem('email')
  const isAuthenticated = Boolean(token)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/api/auth/me')
        setUser(data)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  function saveAuthData(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('email', data.email)
    setUser({ email: data.email, role: data.role })
  }

  async function login(credentials) {
    const { data } = await api.post('/api/auth/login', credentials)
    saveAuthData(data)
    return data
  }

  async function register(payload) {
    const { data } = await api.post('/api/auth/register', payload)
    saveAuthData(data)
    return data
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    setUser(null)
  }

  const value = {
    user,
    role: user?.role ?? role,
    email: user?.email ?? email,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
