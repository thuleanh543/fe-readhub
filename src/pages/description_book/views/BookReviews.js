import React from 'react'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material'
import {Star} from 'lucide-react'
import ReviewItem from './ReviewItem'
import axios from 'axios'
import {useEffect} from 'react'
import {useState} from 'react'

const BookReviews = ({onWriteReview, bookId, refreshTrigger, currentUser}) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [distribution, setDistribution] = useState({})

  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentUser && !bookId) return
      setLoading(true)
      try {
        const url = currentUser?.userId
          ? `http://localhost:8080/api/v1/review/book/${bookId}?currentUserId=${currentUser.userId}`
          : `http://localhost:8080/api/v1/review/book/${bookId}`

        const config = currentUser
          ? {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          : {}

        const response = await axios.get(url, config)

        const data = response.data.data
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setTotalReviews(data.total)
        setDistribution(data.distribution)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
        setAverageRating(0)
        setTotalReviews(0)
        setDistribution({})
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchReviews()
    }
  }, [refreshTrigger])

  if (loading) return <CircularProgress />

  const distributionPercentage = Object.entries(distribution)
    .map(([stars, count]) => ({
      stars: parseInt(stars),
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }))
    .sort((a, b) => b.stars - a.stars)

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`,
        mt: 3,
      }}>
      <CardContent sx={{p: 4}}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}>
          <Box>
            <Typography variant='h5' gutterBottom>
              Book Reviews
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
              <Typography variant='h3' component='span'>
                {averageRating.toFixed(1)}
              </Typography>
              <Box>
                <Box sx={{display: 'flex', gap: 0.5}}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={
                        star <= averageRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  ({totalReviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant='outlined'
            color='primary'
            onClick={onWriteReview}
            startIcon={<Star />}>
            Write Review
          </Button>
        </Box>

        <Box sx={{mt: 4}}>
          {distributionPercentage.map(({stars, percentage}) => (
            <Box
              key={stars}
              sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 1}}>
              <Box
                sx={{
                  minWidth: 100,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Typography sx={{mr: 1}}>{stars}</Typography>
                <Star className='text-yellow-400 fill-yellow-400' size={16} />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  height: 8,
                  overflow: 'hidden',
                }}>
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    bgcolor: 'warning.main',
                    transition: 'width 0.5s ease',
                  }}
                />
              </Box>
              <Typography sx={{minWidth: 50}}>
                {percentage.toFixed(0)}%
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{my: 4}} />

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}>
            <Typography variant='h6'>Reviews</Typography>
            <Box sx={{display: 'flex', gap: 2}}>
              <Button variant='text'>Most Recent</Button>
              <Button variant='text'>Most Helpful</Button>
            </Box>
          </Box>

          {reviews.map((review, index) => (
            <ReviewItem
              key={review.reviewId}
              review={review}
              index={index}
              isLast={index === reviews.length - 1}
              currentUser={currentUser}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default BookReviews
