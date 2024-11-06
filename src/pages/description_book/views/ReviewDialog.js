import React, {useState, useEffect} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {Star} from 'lucide-react'

const ReviewDialog = ({
  open,
  onClose,
  onSubmit,
  existingReview = null, // Add this prop to check if user has reviewed
}) => {
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  // Load existing review data when dialog opens
  useEffect(() => {
    if (existingReview && open) {
      setReviewRating(existingReview.rating)
      setDisplayName(
        existingReview.isAnonymous ? '' : existingReview.displayName,
      )
      setReviewText(existingReview.review)
      setIsAnonymous(existingReview.isAnonymous)
    }
  }, [existingReview, open])

  const handleSubmit = () => {
    onSubmit({
      rating: reviewRating,
      displayName: isAnonymous ? 'Anonymous' : displayName,
      review: reviewText,
      isAnonymous,
      isUpdate: !!existingReview,
    })
    // Reset form
    setReviewRating(0)
    setReviewHover(0)
    setDisplayName('')
    setReviewText('')
    setIsAnonymous(false)
  }

  const isViewOnly = existingReview && !existingReview.canEdit

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {existingReview
          ? isViewOnly
            ? 'Your Review'
            : 'Update Your Review'
          : 'Write a Review'}
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
              onMouseEnter={() => !isViewOnly && setReviewHover(star)}
              onMouseLeave={() => !isViewOnly && setReviewHover(0)}
              onClick={() => !isViewOnly && setReviewRating(star)}
              style={{cursor: isViewOnly ? 'default' : 'pointer'}}
            />
          ))}
        </Box>

        {/* Review Form */}
        {!isAnonymous && (
          <TextField
            fullWidth
            placeholder='Display name'
            variant='outlined'
            sx={{mb: 2}}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            disabled={isViewOnly}
          />
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder='Share your thoughts about this book'
          variant='outlined'
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          disabled={isViewOnly}
        />

        {!isViewOnly && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
              />
            }
            label='Post as anonymous'
            sx={{mt: 2}}
          />
        )}
      </DialogContent>

      <DialogActions sx={{p: 2, gap: 1}}>
        <Button onClick={onClose} variant='outlined'>
          {isViewOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isViewOnly && (
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={
              !reviewRating || (!displayName && !isAnonymous) || !reviewText
            }>
            {existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ReviewDialog
