// contexts/BooksProvider.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import axios from 'axios'
import {BOOKSHELVES} from '../constants/books'

const BooksContext = createContext()

export const BooksProvider = ({children}) => {
  const [booksData, setBooksData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sử dụng useRef để track API calls
  const fetchingRef = useRef(false)
  const initialFetchDoneRef = useRef(false)

  useEffect(() => {
    // Function để fetch books
    const fetchBooks = async () => {
      // Check nếu đang fetch hoặc đã fetch xong
      if (fetchingRef.current || initialFetchDoneRef.current) {
        return
      }

      try {
        fetchingRef.current = true // Đánh dấu đang fetch
        setLoading(true)
        setError(null)

        const responses = await Promise.all(
          BOOKSHELVES.map(shelf =>
            axios.get(`https://gutendex.com/books?topic=${shelf.topic}&page=1`),
          ),
        )

        const booksMap = {}
        BOOKSHELVES.forEach((shelf, index) => {
          booksMap[shelf.topic] = responses[index].data.results.slice(0, 10)
        })

        setBooksData(booksMap)
        initialFetchDoneRef.current = true // Đánh dấu đã fetch xong
      } catch (error) {
        console.error('Error fetching books:', error)
        setError('Failed to load books')
      } finally {
        setLoading(false)
        fetchingRef.current = false // Reset fetch flag
      }
    }

    fetchBooks()

    // Cleanup function
    return () => {
      // Reset refs khi component unmount
      fetchingRef.current = false
      initialFetchDoneRef.current = false
    }
  }, []) // Empty deps array để chỉ chạy một lần

  // Function để force refresh data nếu cần
  const refreshBooks = async () => {
    initialFetchDoneRef.current = false // Reset fetch done flag
    fetchingRef.current = false // Reset fetching flag

    try {
      setLoading(true)
      setError(null)

      const responses = await Promise.all(
        BOOKSHELVES.map(shelf =>
          axios.get(`https://gutendex.com/books?topic=${shelf.topic}&page=1`),
        ),
      )

      const booksMap = {}
      BOOKSHELVES.forEach((shelf, index) => {
        booksMap[shelf.topic] = responses[index].data.results.slice(0, 10)
      })

      setBooksData(booksMap)
    } catch (error) {
      console.error('Error refreshing books:', error)
      setError('Failed to refresh books')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BooksContext.Provider
      value={{
        booksData,
        loading,
        error,
        refreshBooks,
        bookshelves: BOOKSHELVES,
      }}>
      {children}
    </BooksContext.Provider>
  )
}

export const useBooks = () => {
  const context = useContext(BooksContext)
  if (!context) {
    throw new Error('useBooks must be used within BooksProvider')
  }
  return context
}
