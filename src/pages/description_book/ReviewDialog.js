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
} from '@mui/material'
import {Star} from 'lucide-react'
import axios from 'axios'

const ReviewDialog = ({
  open,
  onClose,
  bookId,
  currentUser,
  existingReview = null,
  onReviewSubmit,
}) => {
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
          `http://localhost:8080/api/v1/review/user/${currentUser.userId}/book/${bookId}`,
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
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {initialReview ? 'Update Your Review' : 'Write a Review'}
      </DialogTitle>

      <DialogContent>
        {/* Rating Stars */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            gap: 1,
          }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={32}
              className={`cursor-pointer transition-colors ${
                (reviewHover || reviewRating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setReviewHover(star)}
              onMouseLeave={() => setReviewHover(0)}
              onClick={() => setReviewRating(star)}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder='Share your thoughts about this book'
          variant='outlined'
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{p: 2, gap: 1}}>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!hasChanges || loading}>
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
