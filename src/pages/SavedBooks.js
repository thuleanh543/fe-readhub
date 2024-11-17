import React, {useState, useEffect} from 'react'
import HeaderComponent from '../component/header/HeaderComponent'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import {
  BookOpen,
  BookmarkMinus,
  History,
  BookmarkPlus,
  ThumbsUp,
} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {colors} from '../constants'

// Book Card Component
const BookCard = ({book, onUnsave, showUnsave = true, onClick}) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        transform: 'scale(1.05)',
        bgcolor: 'rgba(255, 255, 255, 0.1)',
      },
    }}>
    <Box sx={{position: 'relative', pt: '150%'}}>
      <CardMedia
        component='img'
        image={book.formats['image/jpeg']}
        alt={book.title}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {showUnsave && (
        <Box sx={{position: 'absolute', top: 0, right: 0, p: 1}}>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              onUnsave(book.id)
            }}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.7)'},
            }}>
            <BookmarkMinus size={20} color='white' />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          p: 1,
          display: 'flex',
          justifyContent: 'center',
        }}>
        <IconButton onClick={onClick} sx={{color: 'white'}}>
          <BookOpen size={20} />
        </IconButton>
      </Box>
    </Box>
    <CardContent sx={{flexGrow: 1, p: 1.5}}>
      <Typography
        variant='subtitle2'
        component='h2'
        color='black'
        sx={{
          fontSize: '0.875rem',
          fontWeight: 'bold',
          mb: 0.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.2,
        }}>
        {book.title}
      </Typography>
      <Typography
        variant='caption'
        color='grey.400'
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
        {book.authors.map(author => author.name).join(', ')}
      </Typography>
    </CardContent>
  </Card>
)

// Recently Read Books Component
const RecentlyReadBooks = ({userId, maxBooks = 20}) => {
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const historyResponse = await axios.get(
          `http://localhost:8080/api/v1/reading-history/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (historyResponse.data.success) {
          const bookIds = historyResponse.data.data.slice(0, maxBooks)
          const bookPromises = bookIds.map(bookId =>
            fetch(`https://gutendex.com/books/${bookId}/`).then(res =>
              res.json(),
            ),
          )
          const books = await Promise.all(bookPromises)
          setRecentBooks(books)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching recent books:', error)
        setLoading(false)
      }
    }

    if (userId) {
      fetchRecentBooks()
    }
  }, [userId, maxBooks])

  if (loading) {
    return <CircularProgress />
  }

  if (recentBooks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          gap: 2,
        }}>
        <Typography variant='h6' color='white'>
          No reading history yet
        </Typography>
        <Button variant='contained' onClick={() => navigate('/')}>
          Start Reading
        </Button>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {recentBooks
        .filter(book => book !== null) // Filter out null values
        .map(book => (
          <Grid item xs={12} sm={6} md={3} key={book.id}>
            <BookCard
              book={book}
              showUnsave={false}
              onClick={() =>
                navigate('/description-book', {
                  state: {bookId: book.id, bookTitle: book.title},
                })
              }
            />
          </Grid>
        ))}
    </Grid>
  )
}

// Recommended Books Component
const RecommendedBooks = ({userId, maxBooks = 20}) => {
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecommendedBooks = async userId => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/recommendations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (response.data.success) {
          const bookPromises = response.data.data
            .slice(0, maxBooks)
            .map(bookId =>
              fetch(`https://gutendex.com/books/${bookId}/`).then(res =>
                res.json(),
              ),
            )
          const books = await Promise.all(bookPromises)
          setRecommendedBooks(books)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setLoading(false)
      }
    }

    if (userId) {
      fetchRecommendedBooks(userId)
    }
  }, [userId, maxBooks])

  if (loading) {
    return <CircularProgress />
  }

  if (recommendedBooks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          gap: 2,
        }}>
        <Typography variant='h6' color='white'>
          No recommendations yet
        </Typography>
        <Button variant='contained' onClick={() => navigate('/')}>
          Explore Books
        </Button>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {recommendedBooks.map(book => (
        <Grid item xs={12} sm={6} md={3} key={book.id}>
          <BookCard
            book={book}
            showUnsave={false}
            onClick={() =>
              navigate('/description-book', {
                state: {bookId: book.id, bookTitle: book.title},
              })
            }
          />
        </Grid>
      ))}
    </Grid>
  )
}

// Main SavedBooks Component
function SavedBooks() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [savedBooks, setSavedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [recentBooks, setRecentBooks] = useState([])
  const navigate = useNavigate()

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login-account')
        return
      }
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
        fetchSavedBooks(response.data.userId)
      } catch (error) {
        console.error(error)
        setError('Failed to get user profile')
        setLoading(false)
      }
    }
    getUser()
  }, [navigate])

  const fetchSavedBooks = async userId => {
    try {
      const savedResponse = await axios.get(
        `http://localhost:8080/api/v1/saved-books/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      if (savedResponse.data.success) {
        const bookPromises = savedResponse.data.data
          .slice(0, 20)
          .map(bookId =>
            fetch(`https://gutendex.com/books/${bookId}/`).then(res =>
              res.json(),
            ),
          )
        const books = await Promise.all(bookPromises)
        setSavedBooks(books)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError('Failed to fetch saved books')
      setLoading(false)
    }
  }

  const handleUnsaveBook = async bookId => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/saved-books/user/${user.userId}/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      if (response.data.success) {
        setSavedBooks(prev => prev.filter(book => book.id !== bookId))
      }
    } catch (error) {
      console.error('Error unsaving book:', error)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.themeLight.color060d13,
        }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: colors.themeLight.color060d13,
        flex: 1,
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
      <HeaderComponent
        windowSize={windowSize}
        centerContent={'MY LIBRARY'}
        showSearch={false}
      />

      <Container
        sx={{
          pt: 12,
          pb: 6,
          flex: 1,
          overflowY: 'auto',
          width: windowSize.width,
        }}>
        {error && (
          <Alert severity='error' sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              color: 'gray',
              '&.Mui-selected': {
                color: '#2196f3',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2196f3',
            },
            borderBottom: 1,
            borderColor: 'divider',
          }}>
          <Tab
            icon={<BookmarkPlus size={20} />}
            iconPosition='start'
            label='Saved Books'
          />
          <Tab
            icon={<History size={20} />}
            iconPosition='start'
            label='Recently Read'
          />
          <Tab
            icon={<ThumbsUp size={20} />}
            iconPosition='start'
            label='Recommended'
          />
        </Tabs>

        {currentTab === 0 &&
          (savedBooks.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                gap: 2,
              }}>
              <Typography variant='h6' color='white'>
                No saved books yet
              </Typography>
              <Button variant='contained' onClick={() => navigate('/')}>
                Explore Books
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {savedBooks.map(book => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <BookCard
                    book={book}
                    onUnsave={handleUnsaveBook}
                    onClick={() =>
                      navigate('/description-book', {
                        state: {bookId: book.id, bookTitle: book.title},
                      })
                    }
                  />
                </Grid>
              ))}
            </Grid>
          ))}

        {currentTab === 1 && (
          <RecentlyReadBooks userId={user?.userId} maxBooks={20} />
        )}

        {currentTab === 2 && (
          <RecommendedBooks userId={user?.userId} maxBooks={20} />
        )}
      </Container>
    </Box>
  )
}

export default SavedBooks
