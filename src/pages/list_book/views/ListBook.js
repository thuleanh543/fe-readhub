// ListBook.jsx
import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {SEARCH_MODE} from '../../../constants/enums'

const ListBook = ({searchTerm, windowSize, mode, onBookSelect}) => {
  // Core state management with default values
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const searchUpdateTimeoutRef = useRef(null)

  // Refs for cleanup and control
  const abortControllerRef = useRef(null)
  const observerRef = useRef(null)
  const lastSearchTermRef = useRef('')

  const navigate = useNavigate()

  // Optimized intersection observer
  const lastBookElementRef = useCallback(
    node => {
      if (loadingMore || !hasMore || loading) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !initialLoad) {
          setPage(prev => prev + 1)
        }
      })

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [loadingMore, hasMore, loading, initialLoad],
  )

  // Optimized fetch function
  const fetchBooks = useCallback(async (term, pageNum, isNewSearch) => {
    if (!term?.trim()) {
      setBooks([])
      setHasMore(false)
      setInitialLoad(false)
      return
    }

    // Prevent duplicate searches and rapid re-fetches
    if (isNewSearch && term === lastSearchTermRef.current) {
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      // Use separate loading states for new searches vs pagination
      if (isNewSearch) {
        // Don't clear previous results immediately
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const formattedSearchTerm = term.replace(/ /g, '&')
      const response = await fetch(
        `https://gutendex.com/books/?search=${formattedSearchTerm}&page=${pageNum}`,
        {signal: abortControllerRef.current.signal},
      )

      if (!response.ok) throw new Error('Failed to fetch books')

      const data = await response.json()
      const validBooks = data.results.filter(
        book =>
          book.formats['image/jpeg'] &&
          book.title &&
          !book.title.includes('[') &&
          book.authors?.length,
      )

      // Use transitions for smoother UI updates
      if (isNewSearch) {
        // Keep old results visible until new ones are ready
        requestAnimationFrame(() => {
          setBooks(validBooks)
        })
      } else {
        setBooks(prev => [...prev, ...validBooks])
      }

      setHasMore(data.next !== null && validBooks.length > 0)
      lastSearchTermRef.current = term
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to load books. Please try again.')
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setInitialLoad(false)
    }
  }, [])

  // Update search handling to be smoother
  useEffect(() => {
    if (searchUpdateTimeoutRef.current) {
      clearTimeout(searchUpdateTimeoutRef.current)
    }

    if (searchTerm !== lastSearchTermRef.current) {
      searchUpdateTimeoutRef.current = setTimeout(() => {
        setPage(1)
        fetchBooks(searchTerm, 1, true)
      }, 1700)
    }

    return () => {
      if (searchUpdateTimeoutRef.current) {
        clearTimeout(searchUpdateTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [searchTerm, fetchBooks])

  // Handle pagination
  useEffect(() => {
    if (page > 1 && !loading && !loadingMore) {
      fetchBooks(searchTerm, page, false)
    }
  }, [page, searchTerm, fetchBooks, loading, loadingMore])

  // Optimized book click handler
  const handleBookClick = useCallback(
    book => {
      if (mode === SEARCH_MODE.SELECT_BOOK) {
        onBookSelect?.({
          id: book.id,
          title: book.title,
          authors: book.authors[0]?.name || 'Unknown Author',
          subjects: book.bookshelves || [],
        })
      } else {
        navigate('/description-book', {
          state: {
            bookId: book.id,
            bookTitle: book.title,
          },
        })
      }
    },
    [navigate, mode, onBookSelect],
  )

  // Error display
  if (error) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4'>
          <p className='text-red-500'>{error}</p>
        </div>
      </div>
    )
  }

  // Render main content
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 py-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
          {/* Book Grid */}
          {books.map((book, index) => (
            <div
              ref={index === books.length - 1 ? lastBookElementRef : null}
              key={`${book.id}-${index}`}
              onClick={() => handleBookClick(book)}
              className={`group relative transition-all duration-300 hover:scale-105 ${
                mode === SEARCH_MODE.SELECT_BOOK ? 'cursor-pointer' : ''
              }`}
              style={{width: '100%'}}>
              <div className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-black/5 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                <div
                  className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                  style={{
                    backgroundImage: `url('${book.formats['image/jpeg']}')`,
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
                <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                  <button className='w-full px-4 py-2 rounded-lg bg-white font-medium text-gray-900 hover:bg-blue-50 transition-colors duration-300 shadow-lg'>
                    {mode === SEARCH_MODE.SELECT_BOOK
                      ? 'Select Book'
                      : 'View Details'}
                  </button>
                </div>
              </div>

              <div className='mt-4 p-3'>
                <h3 className='text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300'>
                  {book.title}
                </h3>
                <p className='mt-2 text-center text-xs font-medium text-gray-600 group-hover:text-indigo-500 transition-colors duration-300'>
                  {book.authors[0]?.name || 'Unknown Author'}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Skeletons */}
          {loading &&
            books.length === 0 &&
            Array.from({length: 10}).map((_, i) => (
              <div key={`skeleton-${i}`} className='animate-pulse'>
                <div className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200'>
                  <div className='absolute inset-0' />
                </div>
                <div className='mt-4 p-3'>
                  <div className='h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-2' />
                  <div className='h-3 bg-gray-200 rounded-full w-1/2 mx-auto' />
                </div>
              </div>
            ))}
        </div>

        {/* States Display */}
        {!loading && searchTerm && books.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600 text-lg'>
              No books found for this search!
            </p>
            <p className='text-gray-500 mt-2'>
              Try adjusting your search terms
            </p>
          </div>
        )}

        {loadingMore && (
          <div className='flex items-center justify-center mt-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent' />
            <span className='ml-3 text-gray-600'>Loading more books...</span>
          </div>
        )}

        {!loading && !loadingMore && !hasMore && books.length > 0 && (
          <div className='text-center py-8 mt-4 border-t border-gray-200'>
            <p className='text-gray-500'>
              No more books found for "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(ListBook)
