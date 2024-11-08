import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import {IconButton} from '@mui/material'
import {ChevronLeft, ChevronRight} from '@mui/icons-material'
import {useNavigate} from 'react-router-dom'
import {colors} from '../../constants'

const BookRecommendations = ({windowSize, user}) => {
  const [recommendations, setRecommendations] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const ITEMS_TO_SHOW = 5
  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [recommendations])

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/recommendations/user/' + user.userId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      const bookDetails = await Promise.all(
        response.data.data.map(async bookId => {
          const bookResponse = await axios.get(
            `https://gutendex.com/books/${bookId}`,
          )
          return bookResponse.data
        }),
      )

      setRecommendations(bookDetails)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setLoading(false)
    }
  }

  const startAutoScroll = () => {
    stopAutoScroll()
    autoScrollRef.current = setInterval(() => {
      if (!isDragging) {
        handleNext()
      }
    }, 5000)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
  }

  const handleNext = () => {
    setStartIndex(prev => {
      if (prev + ITEMS_TO_SHOW >= recommendations.length) return 0
      return prev + ITEMS_TO_SHOW
    })
  }

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - ITEMS_TO_SHOW))
  }

  const handleMouseDown = e => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    stopAutoScroll()
  }

  const handleMouseMove = e => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const dist = x - startX
    scrollRef.current.scrollLeft = scrollLeft - dist
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    startAutoScroll()
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    startAutoScroll()
  }

  const navigateToBookDetail = (bookId, title) => {
    navigate('/description-book', {state: {bookId, bookTitle: title}})
  }

  if (!user || loading || recommendations.length === 0) return null

  return (
    <div className='bg-gradient-to-br from-blue-100 via-white to-purple-100 py-8'>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <h2 className='text-lg font-bold text-gray-900 mb-6'>
          Recommendations For You
        </h2>

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
                    className='relative aspect-[2/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-slate-200/50 shadow-xl'
                    style={{height: '290px'}}>
                    {' '}
                    {/* Fixed height tương ứng */}
                    <div
                      className='absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110'
                      style={{
                        backgroundImage: `url('${book.formats['image/jpeg']}')`,
                      }}
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <button className='px-4 py-2 rounded-full bg-white/90 text-sm font-medium text-gray-900 hover:bg-white transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl'>
                        View Details
                      </button>
                    </div>
                    <div className='absolute -inset-px bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300' />
                  </div>

                  <div className='mt-4 p-3 rounded-lg bg-white/60 backdrop-blur-sm'>
                    <h3 className='text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300'>
                      {book.title}
                    </h3>
                    <p className='mt-2 text-center text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors duration-300'>
                      {book.authors?.[0]?.name || 'Unknown Author'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {startIndex > 0 && (
            <button
              onClick={handlePrevious}
              className='absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-300'
              style={{left: '-40px'}}>
              {' '}
              {/* Đặt lại vị trí nút */}
              <ChevronLeft className='w-6 h-6 text-gray-800' />
            </button>
          )}
          {startIndex + ITEMS_TO_SHOW < recommendations.length && (
            <button
              onClick={handleNext}
              className='absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-300'
              style={{right: '-40px'}}>
              {' '}
              {/* Đặt lại vị trí nút */}
              <ChevronRight className='w-6 h-6 text-gray-800' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookRecommendations
