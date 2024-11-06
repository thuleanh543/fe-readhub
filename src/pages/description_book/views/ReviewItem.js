import React, {useState} from 'react'
import {Typography, Box, IconButton, Tooltip} from '@mui/material'
import {Star, ThumbsUp, Flag} from 'lucide-react'

const ReviewItem = ({review, index, isLast}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isReported, setIsReported] = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes || 0)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleReport = () => {
    setIsReported(!isReported)
  }

  return (
    <Box
      sx={{
        mb: 3,
        pb: 3,
        borderBottom: !isLast ? '1px solid' : 'none',
        borderColor: 'divider',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
        }}>
        <Typography variant='subtitle1' fontWeight='bold'>
          {review.name}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {new Date(review.date).toLocaleDateString()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 1,
        }}>
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
        {review.comment}
      </Typography>

      {/* Action buttons */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
        {!isReported ? (
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
              <IconButton
                size='small'
                onClick={handleLike}
                color={isLiked ? 'primary' : 'default'}>
                <ThumbsUp size={18} className={isLiked ? 'fill-current' : ''} />
              </IconButton>
            </Tooltip>
            <Typography
              variant='body2'
              color={isLiked ? 'primary' : 'text.secondary'}>
              {likeCount}
            </Typography>
          </Box>
        ) : null}

        <Tooltip title={isReported ? 'Reported' : 'Report'}>
          <IconButton
            size='small'
            onClick={handleReport}
            color={isReported ? 'error' : 'default'}>
            <Flag size={18} className={isReported ? 'fill-current' : ''} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default ReviewItem
