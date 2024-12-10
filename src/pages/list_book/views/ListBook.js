import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {SEARCH_MODE} from '../../../constants/enums'
import axios from 'axios'

const ListBook = ({
  searchTerm: searchCriteria,
  mode,
  onBookSelect,
  selectedBooks,
}) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalBooks, setTotalBooks] = useState(0)
  const observerRef = useRef(null)
  const navigate = useNavigate()

  const lastBookElementRef = useCallback(
    node => {
      if (loading || loadingMore || !hasMore) return

      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, loadingMore, hasMore],
  )
  const fetchBooks = useCallback(async (criteria, pageNum, isNewSearch) => {
    try {
      // Set loading state correctly
      if (isNewSearch) {
        setLoading(true)
        setBooks([])
      } else {
        setLoadingMore(true)
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/book/search/advanced`,
        {
          subjects: null,
          bookshelves: null,
          languages: null,
          author: null,
          title: criteria,
        },
        {
          headers: {'Content-Type': 'application/json'},
          params: {page: pageNum, size: 15},
        },
      )

      const data = response.data
    const newBooks = data.results || []
    setTotalBooks(data.totalElements || 0)

    if (isNewSearch) {
      setBooks(newBooks)
    } else {
      setBooks(prev => [...prev, ...newBooks])
    }

    setHasMore(newBooks.length === 15) 
    setError(null)

  } catch (err) {
    setError('Failed to load books. Please try again.')
    setBooks([])
    setHasMore(false)
  } finally {
    setLoading(false)
    setLoadingMore(false)
  }
}, [])
  useEffect(() => {
    if (searchCriteria) {
      setPage(0)
      fetchBooks(searchCriteria, 0, true)
    }
  }, [searchCriteria, fetchBooks])

  useEffect(() => {
    if (page > 0 && searchCriteria) {
      fetchBooks(searchCriteria, page, false)
    }
  }, [page, searchCriteria, fetchBooks])

  const handleBookClick = useCallback(
    book => {
      if (onBookSelect) {
        onBookSelect(book)
      } else {
        navigate('/description-book', {
          state: {bookId: book.id, bookTitle: book.title},
        })
      }
    },
    [navigate, onBookSelect],
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
        {!loading && totalBooks > 0 && (
          <div className='mb-6 text-gray-600 text-l font-bold text-right'>
            Found {totalBooks} book{totalBooks !== 1 ? 's' : ''}
          </div>
        )}

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
          {loading &&
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

          {!loading &&
            books.map((book, index) => (
              <div
                ref={index === books.length - 1 ? lastBookElementRef : null}
                key={`${book.id}-${index}`}
                onClick={() => handleBookClick(book)}
                className={`group relative transition-all duration-300 hover:scale-105 ${
                  mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE
                    ? selectedBooks?.some(b => b.id === book.id)
                      ? 'ring-2 ring-blue-500'
                      : ''
                    : mode === SEARCH_MODE.SELECT_BOOK
                    ? 'cursor-pointer'
                    : ''
                }`}>
                <div className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-black/5 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                  <div
                    className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                    style={{
                      backgroundImage: `url('${book?.formats?.['image/jpeg']}')`,
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
                  <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                    <button
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-lg ${
                        mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE &&
                        selectedBooks?.some(b => b.id === book.id)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white text-gray-900 hover:bg-blue-50'
                      }`}>
                      {mode === SEARCH_MODE.SELECT_BOOK
                        ? 'Select Book'
                        : mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE
                        ? selectedBooks?.some(b => b.id === book.id)
                          ? 'Selected'
                          : 'Select Book'
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
        </div>

        {!loading && books.length === 0 && (
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
            <p className='text-gray-500'>End of results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(ListBook)
