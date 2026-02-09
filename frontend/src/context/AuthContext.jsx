import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLoginStatus()
    
    // Check token expiration every minute
    const interval = setInterval(checkLoginStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token')
    const expiration = localStorage.getItem('tokenExpiration')
    const name = localStorage.getItem('userName')
    const role = localStorage.getItem('userRole')
    const id = localStorage.getItem('userId')
    
    if (token && expiration) {
      const now = new Date().getTime()
      if (now > parseInt(expiration)) {
        // Token expired
        logout()
        alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      } else {
        // Token valid
        setUser({ name: name || 'User', token, expiration: parseInt(expiration), role, id })
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    } else {
      setUser(null)
      delete axios.defaults.headers.common['Authorization']
    }
    setLoading(false)
  }

  const login = (token, name, role, id) => {
    const expirationTime = new Date().getTime() + (30 * 60 * 1000) // 30 minutes
    localStorage.setItem('token', token)
    localStorage.setItem('userName', name)
    localStorage.setItem('userRole', role)
    localStorage.setItem('userId', id)
    localStorage.setItem('tokenExpiration', expirationTime)
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser({ name, token, expiration: expirationTime, role, id })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
