import React, {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {BookOpen, MessageCircle, Share2, BookmarkPlus} from 'lucide-react'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Chip,
  Divider,
  Box,
  Container,
  Grid,
  CircularProgress,
} from '@mui/material'
import {colors} from '../../constants'
import axios from 'axios'
import HeaderComponent from '../../component/header/HeaderComponent'
import BookReviews from './BookReviews'
import LoginDialog from '../../component/dialogs/LoginDialog'
import ReviewDialog from './ReviewDialog'
import {Download} from '@mui/icons-material'
import SimilarAuthorBooks from '../../component/recommendations/SimilarAuthorBooks'
import Footer from '../../component/footer/Footer'
import {languages} from '../../constants/searchData'

export default function DescriptionBook() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [user, setUser] = useState(null)
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const {bookId, bookTitle} = location.state || {}
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [shouldRefreshReviews, setShouldRefreshReviews] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const handleLogin = () => {
    setShowLoginDialog(false)
    navigate('/login-account')
  }
  const checkBookSaved = async () => {
    if (!user) return
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/saved-books/user/${user.userId}/${bookId}/is-saved`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.data.success) {
        setIsSaved(response.data.data)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }
  const handleSaveBook = async () => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    try {
      if (isSaved) {
        // Unsave book
        const response = await axios.delete(
          `http://localhost:8080/api/v1/saved-books/user/${user.userId}/book/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        if (response.data.success) {
          setIsSaved(false)
          // Có thể thêm toast hoặc notification ở đây
        }
      } else {
        // Save book
        const response = await axios.post(
          `http://localhost:8080/api/v1/saved-books/user/${user.userId}/book/${bookId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        if (response.data.success) {
          setIsSaved(true)
          // Có thể thêm toast hoặc notification ở đây
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving book:', error)
      // Có thể thêm error toast ở đây
    }
  }

  const isBanned =
    user?.forumCreationBanned &&
    (user?.forumCreationBanExpiresAt === null ||
      new Date(user?.forumCreationBanExpiresAt) > new Date())

  useEffect(() => {
    const getUser = async () => {
      if (!localStorage.getItem('token')) return
      try {
        const response = await axios.get(
          'http://localhost:8080/api/v1/user/profile',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        setUser(response.data)
        // Kiểm tra trạng thái saved ngay sau khi có user data
        try {
          const savedResponse = await axios.get(
            `http://localhost:8080/api/v1/saved-books/user/${response.data.userId}/${bookId}/is-saved`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          )
          if (savedResponse.data.success) {
            setIsSaved(savedResponse.data.data)
          }
        } catch (error) {
          console.error('Error checking saved status:', error)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://gutendex.com/books/${bookId}/`)
        if (!response.ok) throw new Error('Failed to fetch book details')
        const data = await response.json()
        setBookDetails(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch book details')
        setLoading(false)
      }
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    fetchBookDetails()
    getUser() // Không cần .then nữa vì đã xử lý trong hàm getUser
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [bookId]) // Thêm bookId vào dependencies

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [bookDetails])

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}>
        <CircularProgress size={24} />
      </Box>
    )

  if (error)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: 'error.main',
        }}>
        {error}
      </Box>
    )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HeaderComponent centerContent={bookTitle} showSearch={false} />

      <Container sx={{pt: 12, pb: 6}}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{position: 'sticky', top: 24}}>
              <Card
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: theme =>
                    `0 8px 24px ${theme.palette.common.black}20`,
                }}>
                <CardContent sx={{p: 0, '&:last-child': {pb: 0}}}>
                  <Box
                    sx={{
                      position: 'relative',
                      '&:hover .overlay': {opacity: 1},
                    }}>
                    <img
                      src={bookDetails?.formats?.['image/jpeg']}
                      alt={bookDetails.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                    <Box
                      className='overlay'
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      }}>
                      <Button
                        variant='contained'
                        startIcon={<BookOpen />}
                        onClick={() =>
                          navigate('/read-book-screen', {
                            state: {bookId, bookTitle},
                          })
                        }
                        sx={{
                          bgcolor: 'white',
                          color: 'text.primary',
                          '&:hover': {bgcolor: 'grey.100'},
                        }}>
                        Read Now
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                boxShadow: theme =>
                  `0 8px 24px ${theme.palette.common.black}20`,
              }}>
              <CardContent sx={{paddingLeft: 4, paddingRight: 4}}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}>
                  <Box>
                    <Typography variant='h4' component='h1' gutterBottom>
                      {bookDetails.title}
                    </Typography>
                    <Typography variant='h6' color='text.secondary'>
                      by{' '}
                      {bookDetails.authors
                        .map(author => author.name)
                        .join(', ')}
                    </Typography>
                  </Box>
                  <Button
                    variant='contained'
                    startIcon={<MessageCircle />}
                    onClick={() => {
                      if (!user) {
                        setShowLoginDialog(true)
                      } else if (isBanned) {
                        // You could add a toast notification here to inform the user why they can't create a forum
                        return
                      } else {
                        navigate('/create-forum', {
                          state: {
                            bookId,
                            bookTitle,
                            authors: bookDetails.authors
                              .map(author => author.name)
                              .join(', '),
                            defaultCoverImage:
                              bookDetails?.formats?.['image/jpeg'],
                            subjects: bookDetails.subjects,
                          },
                        })
                      }
                    }}
                    disabled={isBanned}
                    sx={{
                      bgcolor: isBanned ? 'grey.500' : 'primary.main',
                      '&:hover': {
                        bgcolor: isBanned ? 'grey.600' : 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'grey.500',
                        color: 'white',
                      },
                    }}>
                    {isBanned ? 'Forum Creation Restricted' : 'Create Forum'}
                  </Button>
                </Box>

                <Grid container spacing={3} sx={{mb: 3}}>
                  <Grid item xs={12} md={8}>
                    <Typography variant='h6' gutterBottom>
                      Subjects
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                      {bookDetails.subjects.map((subject, index) => (
                        <Chip
                          key={index}
                          label={subject}
                          sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            border: `1px solid`,
                            borderColor: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant='h6' gutterBottom>
                      Language
                    </Typography>
                    <Typography color='text.secondary'>
                      {bookDetails.languages
                        .map(
                          langValue =>
                            languages.find(lang => lang.value === langValue)
                              ?.label || langValue,
                        )
                        .join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant='h6' gutterBottom>
                      Publisher
                    </Typography>
                    <Typography color='text.secondary'>
                      Project Gutenberg
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant='h6' gutterBottom>
                      Downloads
                    </Typography>
                    <Typography color='text.secondary'>
                      {bookDetails.download_count.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{my: 3}} />
                <Box sx={{display: 'flex', gap: 2, mt: 3}}>
                  <Button
                    variant='contained'
                    startIcon={<BookOpen />}
                    onClick={() =>
                      navigate('/read-book-screen', {
                        state: {bookId, bookTitle},
                      })
                    }
                    fullWidth>
                    Read Book
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<BookmarkPlus />}
                    onClick={handleSaveBook}
                    fullWidth>
                    {isSaved ? 'Unsave Book' : 'Save for Later'}
                  </Button>
                  {/* <Button
                    variant='outlined'
                    startIcon={<Download />}
                    fullWidth
                    onClick={() => {
                      window.open(
                        bookDetails.formats['application/x-mobipocket-ebook'],
                        `_blank`,
                      )
                    }}>
                    Downloads
                  </Button> */}
                  <Button variant='outlined' startIcon={<Share2 />} fullWidth>
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <SimilarAuthorBooks bookId={bookId} />

        <BookReviews
          bookId={bookId}
          onWriteReview={() => {
            if (!user) {
              setShowLoginDialog(true)
            } else {
              setShowReviewDialog(true)
            }
          }}
          refreshTrigger={shouldRefreshReviews}
          currentUser={user}
        />
      </Container>
      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
      />

      <ReviewDialog
        open={showReviewDialog}
        onClose={() => {
          setShowReviewDialog(false)
        }}
        onReviewSubmit={() => {
          setShowReviewDialog(false)
          setShouldRefreshReviews(prevState => prevState + 1) // Tăng giá trị để trigger refresh
        }}
        bookId={bookId}
        currentUser={user}
      />
      <Footer />
    </Box>
  )
}
