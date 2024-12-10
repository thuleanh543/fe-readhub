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
import BookshelfSection from '../component/bookshelf/BookshelfSection'

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
      if (fetchingRef.current || initialFetchDoneRef.current) return

      try {
        fetchingRef.current = true
        setLoading(true)
        setError(null)

        console.log('Fetching with shelves:', BOOKSHELVES)

        const responses = await Promise.all(
          BOOKSHELVES.map(async shelf => {
            try {
              const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/book/search/advanced`,
                {
                  subjects: [shelf.topic],
                  bookshelves: null,
                  languages: null,
                  author: null,
                  title: null,
                },
                {
                  headers: {'Content-Type': 'application/json'},
                  params: {page: 0, size: 15},
                },
              )
              console.log(`Response for ${shelf.topic}:`, response.data)
              return response
            } catch (err) {
              console.error(`Error fetching ${shelf.topic}:`, err)
              throw err
            }
          }),
        )

        const booksMap = {}
        responses.forEach((response, index) => {
          const shelf = BOOKSHELVES[index]
          booksMap[shelf.topic] = response.data.results || []
          console.log(`Books for ${shelf.topic}:`, booksMap[shelf.topic])
        })

        setBooksData(booksMap)
        initialFetchDoneRef.current = true
      } catch (error) {
        console.error('Fetch error:', error)
        setError(error.message || 'Failed to load books')
      } finally {
        setLoading(false)
        fetchingRef.current = false
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
        BOOKSHELVES.map(async shelf => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/book/search/advanced`,
              {
                subjects: [shelf.topic],
                bookshelves: null,
                languages: null,
                author: null,
                title: null,
              },
              {
                headers: {'Content-Type': 'application/json'},
                params: {page: 0, size: 15},
              },
            )
            console.log(`Response for ${shelf.topic}:`, response.data)
            return response
          } catch (err) {
            console.error(`Error fetching ${shelf.topic}:`, err)
            throw err
          }
        }),
      )

      const booksMap = {}
      responses.forEach((response, index) => {
        const shelf = BOOKSHELVES[index]
        booksMap[shelf.topic] = response.data.results || []
        console.log(`Books for ${shelf.topic}:`, booksMap[shelf.topic])
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
