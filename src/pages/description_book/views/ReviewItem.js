import React, {useState} from 'react'
import {Typography, Box, IconButton, Tooltip} from '@mui/material'
import {Star, ThumbsUp, Flag} from 'lucide-react'
import axios from 'axios'

const ReviewItem = ({review, index, isLast, currentUser}) => {
  const [isLiked, setIsLiked] = useState(review.liked)
  const [isReported, setIsReported] = useState(review.reported)
  const [likeCount, setLikeCount] = useState(review.likeCount)

  const isOwnReview = currentUser && currentUser.userId === review.userId

  const handleLike = async () => {
    if (isOwnReview) return
    try {
      await axios.post(
        `http://localhost:8080/api/v1/review/${review.reviewId}/like/user/${currentUser.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      if (isLiked) {
        setLikeCount(prev => prev - 1)
      } else {
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  const handleReport = async () => {
    if (isOwnReview) return
    try {
      await axios.post(
        `http://localhost:8080/api/v1/review/${review.reviewId}/report/user/${currentUser.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setIsReported(true)
    } catch (error) {
      console.error('Error reporting review:', error)
    }
  }
  return (
    <Box
      sx={{
        mb: 1,
        pb: !isLast ? 1 : 0,
        borderBottom: !isLast ? '1px solid' : 'none',
        borderColor: 'divider',
      }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
        <Typography variant='subtitle1' fontWeight='bold'>
          {review.fullname}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {new Date(review.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={
              star <= review.rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </Box>

      <Typography variant='body1' sx={{mb: 2}}>
        {review.review}
      </Typography>

      {currentUser && !isReported && (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Tooltip
              title={
                isOwnReview
                  ? 'You cannot like your own review'
                  : isLiked
                  ? 'Unlike'
                  : 'Like'
              }>
              <span>
                <IconButton
                  size='small'
                  onClick={handleLike}
                  color={isLiked ? 'primary' : 'default'}
                  disabled={isOwnReview}>
                  <ThumbsUp
                    size={18}
                    className={isLiked ? 'fill-current' : ''}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Typography
              variant='body2'
              color={isLiked ? 'primary' : 'text.secondary'}>
              {likeCount}
            </Typography>
          </Box>

          {!isOwnReview && (
            <Tooltip title={isReported ? 'Reported' : 'Report'}>
              <IconButton
                size='small'
                onClick={handleReport}
                color={isReported ? 'error' : 'default'}
                disabled={isReported}>
                <Flag size={18} className={isReported ? 'fill-current' : ''} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ReviewItem
