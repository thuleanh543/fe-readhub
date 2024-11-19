import React, {createContext, useContext, useState, useCallback} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {useRef} from 'react'
import {useEffect} from 'react'
import {useMemo} from 'react'

const UserContext = createContext()

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [, forceUpdate] = useState()

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      setLoading(true)
      const response = await axios.get(
        'http://localhost:8080/api/v1/user/profile',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      return response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loginUser = useCallback(
    async token => {
      try {
        setLoading(true)
        localStorage.setItem('token', token)

        const userData = await fetchUser()
        if (userData) {
          setUser(userData)
          return true
        }
        return false
      } catch (error) {
        console.error('Login failed:', error)
        toast.error('Login failed. Please try again.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [fetchUser],
  )

  const logoutUser = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role') // Clear role also
    setUser(null)
    setLoading(false)
    forceUpdate({}) // Force re-render
  }, [])

  const channel = useRef(new BroadcastChannel('auth'))

  useEffect(() => {
    channel.current.onmessage = event => {
      if (event.data.type === 'LOGOUT') {
        logoutUser()
      }
    }

    return () => channel.current.close()
  }, [logoutUser])

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        await refreshUser()
      } else {
        setUser(null) // Make sure user is null if no token
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    const handleStorageChange = async event => {
      if (event.key === 'token') {
        if (!event.newValue) {
          logoutUser() // Use logoutUser instead of just setUser(null)
          channel.current.postMessage({type: 'LOGOUT'})
        } else {
          await refreshUser()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [logoutUser])

  const refreshUser = useCallback(async () => {
    const userData = await fetchUser()
    if (userData) {
      setUser(userData)
      return true
    }
    return false
  }, [fetchUser])

  // Check initial auth state
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        await refreshUser()
      }
    }
    initializeAuth()
  }, [refreshUser])

  // Listen for storage changes
  React.useEffect(() => {
    const handleStorageChange = async event => {
      if (event.key === 'token') {
        if (!event.newValue) {
          setUser(null)
        } else {
          await refreshUser()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      loading,
      loginUser,
      logoutUser,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, loginUser, logoutUser, refreshUser],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook with error checking
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
