import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Plus, Search, MessageSquare} from 'lucide-react'
import {images} from '../../constants'
import {
  AccountCircle,
  ExitToApp,
  PhotoCamera,
  LibraryBooks,
  Settings,
} from '@mui/icons-material'
import {Avatar, Button, ListItemIcon, Menu, MenuItem} from '@mui/material'
import LoginDialog from '../../component/dialogs/LoginDialog'

const Header = ({centerContent, showSearch = true, onSearch}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLogin = () => {
    setShowLoginDialog(false)
    navigate('/login-account')
  }

  const handleSearch = event => {
    const value = event.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
    toast.success('Logout successfully')
  }

  const getUser = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/user/profile',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <img
                src={images.imgOpenBook}
                alt='ReadHub Logo'
                className='h-8 w-8'
              />
              <span className='font-bold text-xl text-gray-900'>READHUB</span>
            </Link>

            <div className='flex items-center space-x-2'>
  <button
    onClick={() => {
      if (!user) {
        setShowLoginDialog(true);
      } else {
        navigate('/book-forum');
      }
    }}
    className='inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
    <MessageSquare className='w-4 h-4 mr-2' />
    <span>Forums</span>
  </button>
</div>
          </div>

          {showSearch && (
            <div className='flex-1 max-w-xl mx-8'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <input
                  type='text'
                  placeholder='Search books, authors, or keywords...'
                  value={searchTerm}
                  onChange={handleSearch}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
              </div>
            </div>
          )}

          {centerContent && (
            <div className='flex-1 flex justify-center'>{centerContent}</div>
          )}

          <div className='flex items-center space-x-4'>
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
                  <Avatar>
                    {user.username
                      ? user.username.toUpperCase().charAt(0)
                      : 'U'}
                  </Avatar>
                )}
                <span>{user.username}</span>
              </Button>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to='/register'
                  className='px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                  Register
                </Link>
                <Link
                  to='/login-account'
                  className='px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors'>
                  Login to ReadHub
                </Link>
              </div>
            )}
          </div>
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
          to='/profile'
          style={{width: 160}}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to='/saved-books'>
          <ListItemIcon>
            <LibraryBooks />
          </ListItemIcon>
          My Library
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to='/settings'>
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
      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default Header
