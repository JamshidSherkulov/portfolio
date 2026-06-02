import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const AuthContext = createContext(null)

function readStoredAuth() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
    userId: localStorage.getItem('userId'),
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const stored = readStoredAuth()

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(stored.token)
  const [role, setRole] = useState(stored.role)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(token)

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('userId')
    setUser(null)
    setToken(null)
    setRole(null)
  }, [])

  const saveAuthData = useCallback((data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('email', data.email)
    localStorage.setItem('userId', data.id)
    setToken(data.token)
    setRole(data.role)
    setUser({ id: data.id, email: data.email, role: data.role })
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    navigate('/login', { replace: true })
  }, [clearAuth, navigate])

  useEffect(() => {
    async function loadUser() {
      if (!stored.token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/api/auth/me')
        setUser(data)
        if (data.role) {
          setRole(data.role)
        }
        if (data.email) {
          localStorage.setItem('email', data.email)
        }
        if (data.id) {
          localStorage.setItem('userId', data.id)
        }
      } catch {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [clearAuth])

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    saveAuthData(data)
    return data
  }

  async function register(email, password, selectedRole) {
    const { data } = await api.post('/api/auth/register', {
      email,
      password,
      role: selectedRole,
    })
    saveAuthData(data)
    return data
  }

  const value = {
    user,
    token,
    role,
    email: user?.email ?? stored.email,
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
