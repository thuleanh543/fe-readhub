import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import {useUser} from '../../contexts/UserProvider'

const ITEMS_TO_SHOW = 5

const BookRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const {user, loading: userLoading} = useUser()

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const recommendationsRef = useRef(null)
  const navigate = useNavigate()

  // Define callbacks first
  const handleNext = useCallback(() => {
    setStartIndex(prev => {
      if (prev + ITEMS_TO_SHOW >= recommendations.length) return 0
      return prev + ITEMS_TO_SHOW
    })
  }, [recommendations.length])

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

  const handlePrevious = useCallback(() => {
    setStartIndex(prev => Math.max(0, prev - ITEMS_TO_SHOW))
  }, [])

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
      navigate('/description-book', {state: {bookId, bookTitle: title}})
    },
    [navigate],
  )

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.userId || recommendationsRef.current) return

      try {
        setError(null)
        setLoading(true)
        const response = await axios.get(
          `http://localhost:8080/api/v1/recommendations/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (response.data.data.length > 0) {
          const bookIds = response.data.data.join(',')
          const booksResponse = await axios.get(
            `https://gutendex.com/books?ids=${bookIds}`,
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

  // Auto scroll effect
  useEffect(() => {
    if (recommendations.length > 0) {
      startAutoScroll()
    }
    return () => stopAutoScroll()
  }, [recommendations.length, isDragging, startAutoScroll, stopAutoScroll])

  // Cleanup effect
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

          <div className='relative px-11 flex space-x-8'>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className='group relative animate-pulse'
                style={{
                  width: '200px',
                  margin: '0 18px',
                }}>
                <div
                  className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200 shadow-lg'
                  style={{height: '290px'}}
                />
                <div className='mt-4 p-3'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2' />
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

        <div className='relative px-11'>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className='relative flex justify-between'
            style={{cursor: isDragging ? 'grabbing' : 'grab'}}>
            {recommendations
              .slice(startIndex, startIndex + ITEMS_TO_SHOW)
              .map(book => (
                <div
                  key={book.id}
                  className='group relative transition-all duration-300 hover:scale-105'
                  style={{
                    width: '200px',
                    margin: '0 18px',
                  }}
                  onClick={() =>
                    !isDragging && navigateToBookDetail(book.id, book.title)
                  }>
                  <div
                    className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300'
                    style={{height: '290px'}}>
                    <div
                      className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                      style={{
                        backgroundImage: `url('${book.formats['image/jpeg']}')`,
                      }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
                    <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                      <button className='w-full px-4 py-2 rounded-lg bg-white font-medium text-gray-900 hover:bg-blue-50 transition-colors duration-300 shadow-lg'>
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className='mt-4 p-3'>
                    <h3 className='text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300'>
                      {book.title}
                    </h3>
                    <p className='mt-2 text-center text-xs font-medium text-gray-600 group-hover:text-indigo-500 transition-colors duration-300'>
                      {book.authors?.[0]?.name || 'Unknown Author'}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {startIndex > 0 && (
            <button
              onClick={handlePrevious}
              className='absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group'
              style={{left: '-40px'}}>
              <ChevronLeft className='w-5 h-5 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300' />
            </button>
          )}

          {startIndex + ITEMS_TO_SHOW < recommendations.length && (
            <button
              onClick={handleNext}
              className='absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group'
              style={{right: '-40px'}}>
              <ChevronRight className='w-5 h-5 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookRecommendations
