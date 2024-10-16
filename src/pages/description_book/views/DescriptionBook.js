import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {images, colors} from '../../../constants'
import axios from 'axios'
import {Avatar, Button, Menu, MenuItem, ListItemIcon} from '@mui/material'
import {AccountCircle, ExitToApp, Settings} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function DescriptionBook( ) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
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
          width: windowSize.width - 15,
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
              <Link to='/Register'>
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
              <Link to='/LoginAccount'>
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
    </div>
  )
}
