import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import { SEARCH_MODE } from '../../../constants/enums'

const ListBook = ({searchTerm, windowSize, mode, onBookSelect}) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const abortControllerRef = useRef(null)
  const navigate = useNavigate()
  const searchTimeoutRef = useRef(null)
  const observerRef = useRef(null)
  const prevSearchTermRef = useRef(searchTerm)

  const lastBookElementRef = useCallback(
    node => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !initialLoad) {
          setPage(prevPage => prevPage + 1)
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, initialLoad],
  )

  const fetchBooks = useCallback(
    async (pageNum = 1, isNewSearch = false) => {
      // Không fetch nếu searchTerm trống
      if (!searchTerm?.trim()) {
        setBooks([])
        setHasMore(false)
        setInitialLoad(false)
        return
      }

      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController()

      try {
        setLoading(true)
        setError(null)

        const formattedSearchTerm = searchTerm.replace(/ /g, '&')
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

        setBooks(prev => (isNewSearch ? validBooks : [...prev, ...validBooks]))
        setHasMore(data.next !== null && validBooks.length > 0)
        setInitialLoad(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError('Failed to load books. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [searchTerm],
  )

  useEffect(() => {
    // Clear timeout cũ nếu có
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Reset states
    setPage(1)
    setBooks([])
    setHasMore(true)
    setInitialLoad(true)

    // Debounce search khi searchTerm thay đổi
    searchTimeoutRef.current = setTimeout(() => {
      fetchBooks(1, true)
    }, 300)

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [searchTerm, fetchBooks])

  useEffect(() => {
    if (page > 1 && searchTerm?.trim()) {
      fetchBooks(page, false)
    }
  }, [page, fetchBooks])

  const handleBookClick = useCallback(
    (book) => {
      if (mode === SEARCH_MODE.SELECT_BOOK) {
        onBookSelect?.({
          id: book.id,
          title: book.title,
          authors: book.authors[0]?.name || 'Unknown Author',
          subjects: book.bookshelves || []
        })
      } else {
        navigate('/description-book', {
          state: {
            bookId: book.id,
            bookTitle: book.title
          }
        })
      }
    },
    [navigate, mode, onBookSelect],
  )
  if (error) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4'>
          <p className='text-red-500'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 py-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
          {/* Results */}
          {books.map((book, index) => (
            <div
              ref={index === books.length - 1 ? lastBookElementRef : null}
              key={`${book.id}-${index}`}
              onClick={() => handleBookClick(book)}
              className={`group relative transition-all duration-300 hover:scale-105 ${
                mode === SEARCH_MODE.SELECT_BOOK ? 'cursor-pointer' : ''
              }`}
              style={{
                width: '100%',
              }}>
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
                  {mode === SEARCH_MODE.SELECT_BOOK ? 'Select Book' : 'View Details'}
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

          {/* Loading skeletons - Only show on initial load */}
          {loading &&
            books.length === 0 &&
            [...Array(10)].map((_, i) => (
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

        {/* No Results */}
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

        {/* Loading more indicator */}
        {loading && books.length > 0 && (
          <div className='flex items-center justify-center mt-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent' />
            <span className='ml-3 text-gray-600'>Loading more books...</span>
          </div>
        )}

        {/* End of results message */}
        {!loading && !hasMore && books.length > 0 && (
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
