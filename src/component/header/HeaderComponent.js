import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Plus, Search, MessageSquare, X, Bell} from 'lucide-react'
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
import NotificationDropdown from '../admin/ui/NotificationDropdown'
import {useUser} from '../../contexts/UserProvider'

const HeaderComponent = ({
  onSearchChange,
  searchTerm,
  centerContent,
  showSearch = false,
}) => {
  const {user, loading, logoutUser} = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  if (loading) {
    return <div>Loading...</div>
  }

  const handleLogin = () => {
    setShowLoginDialog(false)
    navigate('/login-account')
  }

  const handleSearch = event => {
    const value = event.target.value
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const clearSearch = () => {
    if (onSearchChange) {
      onSearchChange('')
    }
  }
  const handleLogout = () => {
    handleClose()
    logoutUser()
    toast.success('Logged out successfully')
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  if (loading) {
    return <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />
  }

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
                    setShowLoginDialog(true)
                  } else {
                    navigate('/book-forum')
                  }
                }}
                className='inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                <MessageSquare className='w-4 h-4 mr-2' />
                <span>Forums</span>
              </button>
            </div>
            {showSearch && (
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => {
                    navigate('/search-result')
                  }}
                  className='inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                  <Search className='w-4 h-4 mr-2' />
                  <span>Advanced Search</span>
                </button>
              </div>
            )}
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
                  className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none'>
                    <X className='h-5 w-5' />
                  </button>
                )}
              </div>
            </div>
          )}
          {centerContent && (
            <div className='flex-1 flex justify-center'>{centerContent}</div>
          )}

        {user ? (  <div className='flex items-center space-x-4 ml-4'>
              <NotificationDropdown />
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
                    {user.fullName
                      ? user.fullName.toUpperCase().charAt(0)
                      : 'U'}
                  </Avatar>
                )}
                <span
                  style={{
                    textTransform: 'none',
                  }}>
                  {user.fullName}
                </span>
              </Button>
        </div>   ) : (
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

export default HeaderComponent
