// ==============================================
// Purpose: Authentication context provider
// ==============================================
import { useState, useEffect } from 'react'
import { AuthContext } from './useAuth'
import { authAPI } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await authAPI.getProfile()
        if (response.data.success) {
          setUser(response.data.data.user || response.data.data)
        }
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    if (response.data.success) {
      const { token, user } = response.data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return true
    }
    return false
  }

  const register = async (full_name, email, password) => {
    const response = await authAPI.register({ full_name, email, password })
    if (response.data.success) {
      const { token, user } = response.data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
