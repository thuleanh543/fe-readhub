import React, {useState, useEffect} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import {Star} from 'lucide-react'
import axios from 'axios'
import { useUser } from '../../contexts/UserProvider'


const ReviewDialog = ({
  open,
  onClose,
  bookId,
  currentUser,
  existingReview = null,
  onReviewSubmit,
  bookDetails,
}) => {
  const {user} = useUser()
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewHover, setReviewHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialReview, setInitialReview] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch user's review when dialog opens
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!currentUser || !open) return

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/review/user/${user.userId}/book/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (response.data.data && response.data.data.length > 0) {
          const userReview = response.data.data[0]
          setInitialReview(userReview)
          setReviewRating(userReview.rating)
          setReviewText(userReview.review)
        } else {
          // No existing review
          setInitialReview(null)
          setReviewRating(0)
          setReviewText('')
        }
      } catch (error) {
        console.error('Error fetching user review:', error)
      }
    }

    fetchUserReview()
  }, [open, currentUser, bookId])

  // Check for changes
  useEffect(() => {
    if (!initialReview) {
      // If no initial review, enable submit if form has content
      setHasChanges(reviewRating > 0 && reviewText.trim() !== '')
      return
    }

    // Check if rating or text has changed from initial values
    const ratingChanged = reviewRating !== initialReview.rating
    const textChanged = reviewText !== initialReview.review
    setHasChanges(ratingChanged || textChanged)
  }, [reviewRating, reviewText, initialReview])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const reviewData = {
        userId: currentUser.userId,
        bookId: bookId,
        rating: reviewRating,
        review: reviewText,
      }

      if (initialReview) {
        // Update existing review
        reviewData.reviewId = initialReview.reviewId
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/review`, reviewData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      } else {
        // Create new review
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/review`, reviewData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      }

      // Reset state
      setHasChanges(false)
      onReviewSubmit() // Gọi hàm callback sau khi submit thành công
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
<Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth='sm' 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header with gradient background */}
        <Box 
          sx={{ 
            p: 3,
            pb: 4,
            background: 'linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 0%, rgba(255,255,255,0) 100%)',
          }}
        >
          {/* Book Info Section */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Book Cover */}
            <Box 
              sx={{ 
                width: 120,
                flexShrink: 0,
                '& img': {
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }
              }}
            >
              <img
                src={bookDetails?.formats?.['image/jpeg']}
                alt={bookDetails?.title}
              />
            </Box>

            {/* Book Details */}
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.primary',
                  lineHeight: 1.3
                }}
              >
                {bookDetails?.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 2
                }}
              >
                by {bookDetails?.authors?.map(author => author.name).join(', ')}
              </Typography>
            </Box>
          </Box>

          {/* Rating Section */}
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 500,
                color: 'text.primary' 
              }}
            >
              {initialReview ? 'Update your rating' : 'Rate this book'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
              }}
            >
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={36}
                  className={`cursor-pointer transition-all duration-200 ${
                    (reviewHover || reviewRating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                  onMouseEnter={() => setReviewHover(star)}
                  onMouseLeave={() => setReviewHover(0)}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Review Text Section */}
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your thoughts about this book..."
            variant="outlined"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }
            }}
          />
        </Box>
      </DialogContent>

      {/* Actions Section */}
      <DialogActions 
        sx={{ 
          p: 3, 
          pt: 0,
          gap: 1.5 
        }}
      >
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            px: 3,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!hasChanges || loading}
          sx={{ 
            borderRadius: '8px',
            px: 3,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : initialReview ? (
            'Update Review'
          ) : (
            'Submit Review'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReviewDialog
