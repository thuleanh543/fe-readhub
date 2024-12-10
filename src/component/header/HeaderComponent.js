import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {
  Search,
  MessageSquare,
  User,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Bell,
  X,
} from 'lucide-react'
import {toast} from 'react-toastify'
import {images} from '../../constants'
import LoginDialog from '../dialogs/LoginDialog'
import NotificationDropdown from '../admin/ui/NotificationDropdown'
import {useUser} from '../../contexts/UserProvider'
import {Avatar} from '@mui/material'
import SearchComponent from './SearchComponent'

const HeaderComponent = ({onSearchChange, searchTerm, showSearch = false}) => {
  const {user, loading, logoutUser} = useUser()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const [showMobileNotifications, setShowMobileNotifications] = useState(false)

  const desktopProfileRef = useRef(null)
  const mobileProfileRef = useRef(null)
  const mobileNotificationRef = useRef(null)
  const navigate = useNavigate()

  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 33,
        height: 33,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        setIsDesktopProfileOpen(false)
      } else {
        setIsMobileProfileOpen(false)
        setShowMobileNotifications(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop click outside handler
  useEffect(() => {
    const handleDesktopClickOutside = event => {
      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(event.target)
      ) {
        setIsDesktopProfileOpen(false)
      }
    }

    if (window.innerWidth >= 768) {
      document.addEventListener('mousedown', handleDesktopClickOutside)
      return () =>
        document.removeEventListener('mousedown', handleDesktopClickOutside)
    }
  }, [])

  const handleLogin = () => {
    setShowLoginDialog(false)
    navigate('/login-account')
  }

  const handleLogout = () => {
    setIsDesktopProfileOpen(false)
    setIsMobileProfileOpen(false)
    logoutUser()
    toast.success('Logged out successfully')
  }

  const handleOverlayClick = (e, setStateFunction) => {
    if (e.target === e.currentTarget) {
      setStateFunction(false)
    }
  }

  const profileMenuItems = [
    {
      label: 'Profile',
      icon: <User className='w-4 h-4' />,
      path: '/profile',
    },
    {
      label: 'My Library',
      icon: <BookOpen className='w-4 h-4' />,
      path: '/saved-books',
    },
    user?.role === 'ADMIN' && {
      label: 'Admin',
      icon: <SettingsIcon className='w-4 h-4' />,
      path: '/admin/dashboard',
      shouldShowForAdmin: true,
    },
  ]

  const LoadingRightSection = () => (
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex items-center space-x-3">
        {/* Notification bell skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
          <Bell className="w-5 h-5 text-gray-400" />
        </div>

        {/* Profile skeleton */}
        <div className="flex items-center space-x-2 py-2 px-3 rounded-full bg-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Mobile loading state */}
      <div className="flex md:hidden items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gray-400" />
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );

  // Desktop Header
  const DesktopHeader = () => (
    <div className='hidden md:flex h-16 items-center justify-between'>
      {/* Left Section */}
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
            onClick={() =>
              user ? navigate('/book-forum') : setShowLoginDialog(true)
            }
            className='inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
            <MessageSquare className='w-4 h-4 mr-2' />
            <span>Forums</span>
          </button>

          {showSearch && (
            <button
              onClick={() => navigate('/search-result')}
              className='inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
              <Search className='w-4 h-4 mr-2' />
              <span>Advanced Search</span>
            </button>
          )}
        </div>
      </div>

      {/* Center - Search */}
      {showSearch && (
        <div className='flex-1 max-w-xl mx-8'>
          <SearchComponent
            onSearchChange={onSearchChange}
            initialSearchTerm={searchTerm}
          />
        </div>
      )}

      {/* Right Section */}
      <div className='flex items-center space-x-4'>
        {
        loading ? (
          <LoadingRightSection />
        ) :
        user ? (
          <>
            <NotificationDropdown />
            <div className='relative' ref={desktopProfileRef}>
              <button
                onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
                className='flex items-center gap-2 p-2 rounded-full hover:bg-gray-100'>
                <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center'>
                  {user?.urlAvatar ? (
                    <Avatar
                      sx={{width: 25, height: 25}}
                      src={user?.urlAvatar}
                      alt={user?.fullName}
                    />
                  ) : (
                    <Avatar {...stringAvatar(user?.fullName)} />
                  )}
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {user?.fullName}
                </span>
                <ChevronDown className='w-4 h-4 text-gray-500' />
              </button>

              {/* Desktop Profile Dropdown */}
              {isDesktopProfileOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200'>
                  {profileMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsDesktopProfileOpen(false)}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
                    <LogOut className='w-4 h-4' />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex items-center space-x-2'>
            <Link
              to='/register'
              className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full text-sm'>
              Register
            </Link>
            <Link
              to='/login-account'
              className='px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm'>
              Login to ReadHub
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  // Mobile Header
  const MobileHeader = () => (
    <div className='md:hidden flex h-16 items-center justify-between px-4'>
      <Link to='/' className='font-bold text-xl text-gray-900'>
        READHUB
      </Link>

      <div className='flex items-center space-x-3'>
        <button
          onClick={() =>
            user ? navigate('/book-forum') : setShowLoginDialog(true)
          }
          className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg'>
          <MessageSquare className='w-5 h-5' />
        </button>

        {showSearch && (
          <button
            onClick={() => navigate('/search-result')}
            className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg'>
            <Search className='w-5 h-5' />
          </button>
        )}

        {user && (
          <>
            {/* Notifications */}
            <div className='relative' ref={mobileNotificationRef}>
              <button
                onClick={() => {
                  setShowMobileNotifications(!showMobileNotifications)
                  setIsMobileProfileOpen(false)
                }}
                className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg'>
                <Bell className='w-5 h-5' />
              </button>
              {showMobileNotifications && (
                <div
                  className='fixed inset-x-0 top-16 h-screen bg-black bg-opacity-50'
                  onClick={e =>
                    handleOverlayClick(e, setShowMobileNotifications)
                  }>
                  <div className='relative bg-white border-t border-gray-200'>
                    <div className='max-w-7xl mx-auto px-4 py-2'>
                      <div className='py-2 border-b border-gray-100'>
                        <h3 className='font-semibold text-gray-900'>
                          Notifications
                        </h3>
                      </div>
                      <div className='py-4'>
                        <p className='text-gray-500 text-center'>
                          No new notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className='relative' ref={mobileProfileRef}>
              <button
                onClick={() => {
                  setIsMobileProfileOpen(!isMobileProfileOpen)
                  setShowMobileNotifications(false)
                }}
                className='p-1 hover:bg-gray-100 rounded-lg'>
                {loading ? (
                  <div className='animate-pulse w-8 h-8 bg-gray-200 rounded-full' />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center'>
                    {user?.urlAvatar ? (
                      <Avatar
                        sx={{width: 30, height: 30}}
                        src={user?.urlAvatar}
                        alt={user?.fullName}
                      />
                    ) : (
                      <Avatar {...stringAvatar(user?.fullName)} />
                    )}
                  </div>
                )}
              </button>

              {isMobileProfileOpen && (
                <div
                  className='fixed inset-x-0 top-16 h-screen bg-black bg-opacity-50'
                  onClick={e => handleOverlayClick(e, setIsMobileProfileOpen)}>
                  <div className='relative bg-white border-t border-gray-200'>
                    <div className='max-w-7xl mx-auto px-4 py-2'>
                      <div className='py-3 border-b border-gray-100'>
                        <p className='font-semibold text-gray-900'>
                          {user?.fullName}
                        </p>
                        <p className='text-sm text-gray-500'>{user?.email}</p>
                      </div>
                      <nav className='py-2'>
                        {profileMenuItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.path}
                            className='flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100'
                            onClick={() => setIsMobileProfileOpen(false)}>
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className='w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50'>
                          <LogOut className='w-4 h-4' />
                          <span>Logout</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <header className='fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto'>
        <DesktopHeader />
        <MobileHeader />
      </div>

      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
      />
    </header>
  )
}

export default HeaderComponent
