import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../App.css'
import {images, colors} from '../constants'
import axios from 'axios'
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Tab,
  TextField,
  IconButton,
  Typography,
} from '@mui/material'
import {
  AccountCircle,
  ExitToApp,
  PhotoCamera,
  Settings,
} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {TabContext, TabList, TabPanel} from '@mui/lab'

function Profile() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
  const open = Boolean(anchorEl)
  const [value, setValue] = React.useState('1')
  const [username, setUsername] = useState('')

  const handleAvatarChange = async event => {
    console.error('handleAvatarChange')
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
    if (!localStorage.getItem('token')) {
      navigate('/LoginAccount')
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
          justifyContent: 'space-between',
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
            <span className='text-sm font-medium '>Back to ReadHub</span>
          </Link>
        </div>

        {user && (
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
              <Avatar>
                {user.username ? user.username.toUpperCase().charAt(0) : 'U'}
              </Avatar>
            )}
            <span>{user.username}</span>
          </Button>
        )}
      </div>
      <div
        style={{
          backgroundColor: colors.themeLight.primary,
          height: windowSize.height - windowSize.height * 0.002,
          paddingLeft: windowSize.width * 0.2,
          fontWeight: 'bold',
          paddingRight: windowSize.width * 0.2,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: windowSize.height * 0.11,
        }}>
        <div>
          <h1>MY PROFILE</h1>
          <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <TabList
                onChange={(e, newValue) => setValue(newValue)}
                aria-label='lab API tabs example'>
                <Tab label='Infomation' value='1' />
                <Tab label='Accounts and security' value='2' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              {user && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '300px',
                    margin: 'auto',
                  }}>
                  <Typography variant='h5' gutterBottom>
                    User Profile
                  </Typography>
                  <input
                    accept='image/*'
                    style={{display: 'none'}}
                    id='avatar-upload'
                    type='file'
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor='avatar-upload'>
                    <IconButton
                      sx={{
                        width: 100,
                        height: 100,
                        position: 'relative',
                      }}
                      component='span'>
                      {user.urlAvatar ? (
                        <Avatar
                          src={user.urlAvatar}
                          sx={{
                            width: 100,
                            height: 100,
                          }}
                        />
                      ) : (
                        <Avatar>
                          {user.username
                            ? user.username.toUpperCase().charAt(0)
                            : 'U'}
                        </Avatar>
                      )}
                      <PhotoCamera
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          color: 'white',
                          backgroundColor: 'blue',
                          borderRadius: '50%',
                          padding: 0.5,
                        }}
                      />
                    </IconButton>
                  </label>
                  <TextField
                    label='Username'
                    variant='outlined'
                    fullWidth
                    value={user.username}
                    onChange={e => setUsername(e.target.value)}
                    sx={{marginTop: 2}}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{marginTop: 2, width: '100%'}}>
                    Update Profile
                  </Button>
                </Box>
              )}
            </TabPanel>
            <TabPanel value='2'>
              {user && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '400px',
                    margin: 'auto',
                  }}>
                  <Typography variant='h5' gutterBottom>
                    User Profile
                  </Typography>
                  <TextField
                    label='Email'
                    variant='outlined'
                    fullWidth
                    value={user.email}
                    sx={{marginTop: 2}}
                  />
                  <TextField
                    label='Password'
                    type='password'
                    variant='outlined'
                    fullWidth
                    value={'123456789'}
                    sx={{marginTop: 2}}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{marginTop: 2, width: '100%'}}>
                    Update Profile
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    sx={{marginTop: 2, width: '100%'}}>
                    Delete Account
                  </Button>
                </Box>
              )}
            </TabPanel>
          </TabContext>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to='/Profile'
          style={{width: 160}}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to='/Settings'>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Profile
