import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {SEARCH_MODE} from '../../../constants/enums'

const ListBook = ({searchTerm, mode, onBookSelect, selectedBooks}) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalBooks, setTotalBooks] = useState(0)
  const searchUpdateTimeoutRef = useRef(null)
  const observerRef = useRef(null)
  const lastSearchTermRef = useRef('')

  const navigate = useNavigate()

  const lastBookElementRef = useCallback(
    node => {
      if (loading || loadingMore || !hasMore || books.length === 0) return

      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, loadingMore, hasMore, books.length],
  )

  const fetchBooks = useCallback(async (query, pageNum, isNewSearch) => {
    if (!query) return

    try {
      // Set loading state immediately for new searches
      if (isNewSearch) {
        setLoading(true)
        setBooks([]) // Clear previous results immediately
      } else {
        setLoadingMore(true)
      }

      const url = `http://localhost:8080/api/v1/book/search?${query}&page=${pageNum}`
      const response = await fetch(url)
      const data = await response.json()

      const newBooks = data.books || []
      setTotalBooks(data.totalElements || 0)

      if (isNewSearch) {
        setBooks(newBooks)
      } else if (newBooks.length > 0) {
        setBooks(prev => [...prev, ...newBooks])
      }

      setHasMore(newBooks.length > 0 && data.hasNext)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to load books. Please try again.')
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

useEffect(() => {

  if (searchUpdateTimeoutRef.current) {
      clearTimeout(searchUpdateTimeoutRef.current)
  }

  if (searchTerm) {
      setPage(1)
      setLoading(true)
      setBooks([])

      searchUpdateTimeoutRef.current = setTimeout(() => {
          console.log('Calling fetchBooks with:', searchTerm)
          fetchBooks(searchTerm, 1, true)
      }, 900)
  }

  return () => {
      if (searchUpdateTimeoutRef.current) {
          clearTimeout(searchUpdateTimeoutRef.current)
      }
  }
}, [searchTerm, fetchBooks])

  useEffect(() => {
    if (page > 1 && !loading && !loadingMore) {
      fetchBooks(searchTerm, page, false)
    }
  }, [page, searchTerm, fetchBooks, loading, loadingMore])

  const handleBookClick = useCallback(
    (book) => {
      switch (mode) {
        case SEARCH_MODE.SELECT_BOOK:
          onBookSelect?.({
            id: book.id,
            title: book.title,
            authors: book.authors[0]?.name || 'Unknown Author',
            subjects: book.bookshelves || []
          });
          break;
        case SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE:
          onBookSelect?.(book);
          break;
        default:
          navigate('/description-book', {
            state: {
              bookId: book.id,
              bookTitle: book.title
            }
          });
      }
    },
    [navigate, mode, onBookSelect],
  );
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
        {/* Results count display */}
        {!loading && totalBooks > 0 && (
          <div
            className='mb-6 text-gray-600 text-l font-bold
          text-right'>
            Found {totalBooks} book{totalBooks !== 1 ? 's' : ''}
          </div>
        )}

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
          {/* Results */}
          {books.map((book, index) => (
            <div
            ref={index === books.length - 1 ? lastBookElementRef : null}
            key={`${book.id}-${index}`}
            onClick={() => handleBookClick(book)}
            className={`group relative transition-all duration-300 hover:scale-105 ${
              mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE ?
              (selectedBooks?.some(b => b.id === book.id) ? 'ring-2 ring-blue-500' : '') :
              mode === SEARCH_MODE.SELECT_BOOK ? 'cursor-pointer' : ''
            }`}
              style={{
                width: '100%',
              }}>
              <div className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-black/5 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                <div
                  className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                  style={{
                    backgroundImage: `url('${book?.formats?.['image/jpeg']}')`,
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
                <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-lg ${
 mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE && selectedBooks?.some(b => b.id === book.id)
 ? 'bg-blue-600 text-white hover:bg-blue-700'
 : 'bg-white text-gray-900 hover:bg-blue-50'
}`}>
 {mode === SEARCH_MODE.SELECT_BOOK ? 'Select Book' :
  mode === SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE ?
  (selectedBooks?.some(b => b.id === book.id) ? 'Selected' : 'Select Book') :
  'View Details'}
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

          {/* Book grid */}
          {!loading &&
            books.map((book, index) => (
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
                      backgroundImage: `url('${book.coverUrl}')`,
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
        </div>

        {/* No results message */}
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

        {/* Load more indicator */}
        {loadingMore && (
          <div className='flex items-center justify-center mt-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent' />
            <span className='ml-3 text-gray-600'>Loading more books...</span>
          </div>
        )}

        {/* End of results message */}
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
