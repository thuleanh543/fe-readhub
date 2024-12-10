import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import {useUser} from '../../contexts/UserProvider'

const BookRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemsToShow, setItemsToShow] = useState(5)
  const {user, loading: userLoading} = useUser()

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const recommendationsRef = useRef(null)
  const navigate = useNavigate()

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) setItemsToShow(2)
      else if (width < 1024) setItemsToShow(4)
      else setItemsToShow(5)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNext = useCallback(() => {
    setStartIndex(prev => {
      if (prev + itemsToShow >= recommendations.length) return 0
      return prev + itemsToShow
    })
  }, [recommendations.length, itemsToShow])

  const handlePrevious = useCallback(() => {
    setStartIndex(prev => Math.max(0, prev - itemsToShow))
  }, [itemsToShow])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    stopAutoScroll()
    autoScrollRef.current = setInterval(() => {
      if (!isDragging) {
        handleNext()
      }
    }, 5000)
  }, [stopAutoScroll, isDragging, handleNext])

  const handleMouseDown = useCallback(
    e => {
      setIsDragging(true)
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
      stopAutoScroll()
    },
    [stopAutoScroll],
  )

  const handleMouseMove = useCallback(
    e => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - scrollRef.current.offsetLeft
      const dist = x - startX
      scrollRef.current.scrollLeft = scrollLeft - dist
    },
    [isDragging, startX, scrollLeft],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    startAutoScroll()
  }, [startAutoScroll])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    startAutoScroll()
  }, [startAutoScroll])

  const navigateToBookDetail = useCallback(
    (bookId, title) => {
      if (!isDragging) {
        navigate('/description-book', {state: {bookId, bookTitle: title}})
      }
    },
    [isDragging, navigate],
  )

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.userId || recommendationsRef.current) return

      try {
        setError(null)
        setLoading(true)
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/recommendations/user/${user?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (response.data.data.length > 0) {
          const bookIds = response.data.data.map(Number)
          const booksResponse = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/book/batch`,
            bookIds
          )

          recommendationsRef.current = booksResponse.data.results
          setRecommendations(booksResponse.data.results)
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setError('Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [user?.userId])

  useEffect(() => {
    if (recommendations.length > 0) {
      startAutoScroll()
    }
    return () => stopAutoScroll()
  }, [recommendations.length, startAutoScroll, stopAutoScroll])

  useEffect(() => {
    return () => {
      recommendationsRef.current = null
      stopAutoScroll()
    }
  }, [stopAutoScroll])

  if (!user) return null

  if (userLoading || loading) {
    return (
      <div className='bg-gradient-to-br from-violet-50 to-blue-50 py-10'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center space-x-3 mb-8'>
            <div className='h-8 w-1 bg-indigo-500 rounded-full' />
            <span className='text-indigo-600 font-semibold uppercase tracking-wide'>
              Recommendations For You
            </span>
          </div>

          <div className='relative flex space-x-4 md:space-x-6'>
            {[...Array(itemsToShow)].map((_, index) => (
              <div key={index} className='flex-1 animate-pulse'>
                <div className='aspect-[2/3] rounded-xl md:rounded-2xl bg-gray-200' />
                <div className='mt-4 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto' />
                  <div className='h-3 bg-gray-200 rounded w-1/2 mx-auto' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-gradient-to-br from-violet-50 to-blue-50 py-10'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center space-x-3 mb-8'>
            <div className='h-8 w-1 bg-indigo-500 rounded-full' />
            <span className='text-indigo-600 font-semibold uppercase tracking-wide'>
              Recommendations For You
            </span>
          </div>
          <div className='text-center text-red-600 py-8 bg-red-50 rounded-lg border border-red-100'>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) return null

  return (
    <div className='bg-gradient-to-br from-violet-50 to-blue-50 py-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center space-x-3 mb-8'>
          <div className='h-8 w-1 bg-indigo-500 rounded-full' />
          <span className='text-indigo-600 font-semibold uppercase tracking-wide'>
            Recommendations For You
          </span>
        </div>

        <div className='relative px-2 md:px-12'>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className='relative flex gap-3 md:gap-6 px-8 md:px-0'
            style={{cursor: isDragging ? 'grabbing' : 'grab'}}>
            {recommendations
              .slice(startIndex, startIndex + itemsToShow)
              .map(book => (
                <div
                  key={book.id}
                  className='flex-1'
                  onClick={() => navigateToBookDetail(book.id, book.title)}>
                  <div className='group relative transition-all duration-300 hover:scale-105'>
                    <div className='relative aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300'>
                      <div
                        className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                        style={{
                          backgroundImage: `url('${book?.formats?.['image/jpeg']}')`,
                        }}
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

                      <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                        <button className='w-full px-4 py-2 rounded-lg bg-white font-medium text-gray-900 hover:bg-opacity-90 transition-colors duration-300 shadow-lg'>
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className='mt-3 md:mt-4 px-2'>
                      <h3 className='text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300'>
                        {book.title}
                      </h3>
                      <p className='mt-1 md:mt-2 text-center text-xs font-medium text-gray-600 group-hover:text-indigo-500 transition-colors duration-300'>
                        {book.authors?.[0]?.name || 'Unknown Author'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Navigation Buttons */}
          {recommendations.length > itemsToShow && (
            <>
              {startIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className='absolute left-0 top-1/2 -translate-y-1/2
                           w-8 h-8 md:w-10 md:h-10
                           flex items-center justify-center
                           rounded-full
                           bg-white/90
                           hover:bg-white
                           shadow-lg hover:shadow-xl
                           transition-all duration-300 group z-10'>
                  <ChevronLeft className='w-5 h-5 md:w-6 md:h-6 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300' />
                </button>
              )}

              {startIndex + itemsToShow < recommendations.length && (
                <button
                  onClick={handleNext}
                  className='absolute right-0 top-1/2 -translate-y-1/2
                           w-8 h-8 md:w-10 md:h-10
                           flex items-center justify-center
                           rounded-full
                           bg-white/90
                           hover:bg-white
                           shadow-lg hover:shadow-xl
                           transition-all duration-300 group z-10'>
                  <ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300' />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookRecommendations
