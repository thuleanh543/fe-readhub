import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {images, colors} from '../../../constants'
import axios from 'axios'
import {
  Avatar,
  Button as MuiButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
  CardContent,
  Button
} from '@mui/material'
import {AccountCircle, ExitToApp, Settings} from '@mui/icons-material'
import {toast} from 'react-toastify'
import { Star, BookOpen } from 'lucide-react';

export default function DescriptionBook( ) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
  const [bookDetails, setBookDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const location = useLocation()
  const { bookId, bookTitle } = location.state || {}

  const handleSearch = event => {
    const value = event.target.value
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
    toast.success('Logout successfully')
  }

  const getUser = async () => {
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
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        console.log("BoooKID" ,bookId);
        const response = await fetch(`https://gutendex.com/books/${bookId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
        console.log("Response Data", data);
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

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const renderStarRating = () => (
    <div className="flex items-center gap-1">
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
          onClick={() => handleRatingClick(star)}
        />
      ))}
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    getUser()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className='App'
      style={{
        backgroundColor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      <div
        style={{
          display: 'flex',
          height: windowSize.height * 0.09,
          width: windowSize.width,
          flexDirection: 'row',
          paddingTop: 5,
          position: 'fixed',
          top: 0,
          zIndex: 1,
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
          alignItems: 'center',
        }}>
        <div className='flex gap-2 items-center p-5'>
          <img
            src={images.imgOpenBook}
            alt='Logo Open Book'
            style={{
              height: windowSize.height * 0.09 - 32,
              marginLeft: 15,
              marginRight: 15,
            }}
          />
          <Link to='/'>
            <span className='text-sm font-medium '>READHUB</span>
          </Link>
        </div>
       <span style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
       }}>
          {bookTitle}
       </span>

        {user ? (
          <Button
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              marginRight: 20,
            }}
            onClick={handleClick}>
            {user.urlAvatar ? (
              <Avatar src={user.urlAvatar} />
            ) : (
              <Avatar>{user.username ? user.username.charAt(0) : 'U'}</Avatar>
            )}
            <span>{user.username}</span>
          </Button>
        ) : (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
              style={{
                color: '#fff',
                padding: '5px 13px',
                borderRadius: 19,
                height: 40,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: 'lightgray',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <Link to='/register'>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}>
                  Register
                </div>
              </Link>
            </Button>
            <Button
              style={{
                color: '#fff',
                backgroundColor: '#51bd8e',
                borderRadius: 19,
                height: 40,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <Link to='/login-account'>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}>
                  Login to ReadHub
                </div>
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        flex: 1,
        marginTop: windowSize.height * 0.09,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ padding: 2 }}>
        <img
          src={bookDetails.formats['image/jpeg']}
          alt={bookDetails.title}
          style={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </CardContent>
    </Card>
  </div>

  <div className="md:w-2/3">
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ padding: 3 }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>{bookDetails.title}</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Author: </span>
            {bookDetails.authors.map(author => author.name).join(', ')}
          </p>

          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Genres: </span>
            {bookDetails.subjects.slice(0, 3).join(', ')}
          </p>

          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Publisher: </span>
            Project Gutenberg
          </p>

          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Language: </span>
            {bookDetails.languages.map(lang => lang.toUpperCase()).join(', ')}
          </p>

          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Downloads: </span>
            {bookDetails.download_count.toLocaleString()}
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>Rate this book:</span>
            {renderStarRating()}
          </div>

          <Button
            variant="contained"
            startIcon={<BookOpen />}
            onClick={() =>{
              navigate('/read-book-screen', {state: {bookId, bookTitle}})
            }}
            sx={{
              bgcolor: '#2563EB',
              '&:hover': {
                bgcolor: '#1D4ED8',
              },
              textTransform: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 2rem'
            }}
          >
            Read Book
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
    </div>
        </div>
      </div>
      );

}
