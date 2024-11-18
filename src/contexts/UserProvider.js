// contexts/UserProvider.js
import React, {createContext, useContext, useState, useEffect} from 'react'
import axios from 'axios'

const UserContext = createContext()

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          'http://localhost:8080/api/v1/user/profile',
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        )
        setUser(response.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, []) // Run only once on mount

  // Clear user on token removal
  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem('token')) {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <UserContext.Provider value={{user, setUser, loading}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
