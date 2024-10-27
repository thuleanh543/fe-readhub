import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, MessageCircle, Share2, BookmarkPlus, Star } from 'lucide-react';
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
} from '@mui/material';
import { colors } from '../../../constants';
import HeaderComponent from '../../../component/header/HeaderComponent';

export default function DescriptionBook() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [user, setUser] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId, bookTitle } = location.state || {};

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://gutendex.com/books/${bookId}/`);
        if (!response.ok) throw new Error('Failed to fetch book details');
        const data = await response.json();
        setBookDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        setLoading(false);
      }
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    fetchBookDetails();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [bookId]);

  const renderStarRating = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            (hover || rating) >= star
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(star)}
        />
      ))}
    </Box>
  );

  if (loading) return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'error.main'
    }}>
      {error}
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: colors.themeLight.color060d13,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <HeaderComponent
        windowSize={windowSize}
        centerContent={bookTitle}
        showSearch={false}
      />

      <Container sx={{ pt: 12, pb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Card sx={{
                bgcolor: 'background.paper',
                boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`
              }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{
                    position: 'relative',
                    '&:hover .overlay': { opacity: 1 }
                  }}>
                    <img
                      src={bookDetails.formats['image/jpeg']}
                      alt={bookDetails.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                    <Box className="overlay" sx={{
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
                      transition: 'opacity 0.3s'
                    }}>
                      <Button
                        variant="contained"
                        startIcon={<BookOpen />}
                        onClick={() => navigate('/read-book-screen', {state: {bookId, bookTitle
                         }})}
                        sx={{ bgcolor: 'white', color: 'text.primary', '&:hover': { bgcolor: 'grey.100' } }}
                      >
                        Read Now
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{
              bgcolor: 'background.paper',
              boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {bookDetails.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      by {bookDetails.authors.map(author => author.name).join(', ')}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<MessageCircle />}
                    onClick={() => {navigate('/create-forum', { state: { bookId, bookTitle,  defaultCoverImage: bookDetails.formats['image/jpeg'] ,
                      subjects: bookDetails.subjects
                    }})
                  }}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    Create Forum
                  </Button>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Genres</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Language</Typography>
                    <Typography color="text.secondary">
                      {bookDetails.languages.map(lang => lang.toUpperCase()).join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Publisher</Typography>
                    <Typography color="text.secondary">Project Gutenberg</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Downloads</Typography>
                    <Typography color="text.secondary">
                      {bookDetails.download_count.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Rate this book</Typography>
                  {renderStarRating()}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<BookOpen />}
                    onClick={() => navigate('/read-book-screen', {state: {bookId, bookTitle}})}
                    fullWidth
                  >
                    Read Book
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BookmarkPlus />}
                    fullWidth
                  >
                    Save for Later
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share2 />}
                    fullWidth
                  >
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}