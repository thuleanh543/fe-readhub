import React from 'react'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Box,
} from '@mui/material'
import {Star} from 'lucide-react'
import ReviewItem from './ReviewItem'

const BookReviews = ({onWriteReview}) => {
  const reviews = [
    {
      name: 'John Smith',
      date: '2024-03-15',
      rating: 3,
      comment: "This book has good flashcards, but I'd prefer more exercises.",
      likes: 1,
    },
    {
      name: 'Jane Doe',
      date: '2024-03-10',
      rating: 5,
      comment:
        'A fantastic book with great examples and clear explanations. Highly recommended!',
      likes: 3,
    },
  ]
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`,
        mt: 3,
      }}>
      <CardContent sx={{p: 4}}>
        {/* Header with overall rating */}
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
                4.5
              </Typography>
              <Box>
                <Box sx={{display: 'flex', gap: 0.5}}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={
                        star <= 4.5
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  (9 reviews)
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

        {/* Rating bars */}
        <Box sx={{mt: 4}}>
          {[
            {stars: 5, percentage: 67},
            {stars: 4, percentage: 11},
            {stars: 3, percentage: 22},
            {stars: 2, percentage: 0},
            {stars: 1, percentage: 0},
          ].map(({stars, percentage}) => (
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
              <Typography sx={{minWidth: 50}}>{percentage}%</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{my: 4}} />

        {/* Reviews section */}
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

          {/* Review items */}
          {reviews.map((review, index) => (
            <ReviewItem
              key={index}
              review={review}
              index={index}
              isLast={index === reviews.length - 1}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default BookReviews
