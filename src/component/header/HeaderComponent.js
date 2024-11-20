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
    {
      label: 'Settings',
      icon: <SettingsIcon className='w-4 h-4' />,
      path: '/settings',
    },
  ]

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
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
            <input
              type='text'
              placeholder='Search books, authors, or keywords...'
              value={searchTerm}
              onChange={e => onSearchChange?.(e.target.value)}
              className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange?.('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                <X className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className='flex items-center space-x-4'>
        {user ? (
          <>
            <NotificationDropdown />
            <div className='relative' ref={desktopProfileRef}>
              <button
                onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
                className='flex items-center gap-2 p-2 rounded-full hover:bg-gray-100'>
                <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center'>
                  {user.urlAvatar ? (
                    <img
                      src={user.urlAvatar}
                      alt={user.fullName}
                      className='w-full h-full object-cover rounded-full'
                    />
                  ) : (
                    <span className='text-sm font-medium text-white'>
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {user.fullName}
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
                <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center'>
                  {user.urlAvatar ? (
                    <img
                      src={user.urlAvatar}
                      alt={user.fullName}
                      className='w-full h-full object-cover rounded-full'
                    />
                  ) : (
                    <span className='text-sm font-medium text-white'>
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </button>

              {isMobileProfileOpen && (
                <div
                  className='fixed inset-x-0 top-16 h-screen bg-black bg-opacity-50'
                  onClick={e => handleOverlayClick(e, setIsMobileProfileOpen)}>
                  <div className='relative bg-white border-t border-gray-200'>
                    <div className='max-w-7xl mx-auto px-4 py-2'>
                      <div className='py-3 border-b border-gray-100'>
                        <p className='font-semibold text-gray-900'>
                          {user.fullName}
                        </p>
                        <p className='text-sm text-gray-500'>{user.email}</p>
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

  if (loading) {
    return (
      <div className='h-16 bg-white shadow-sm animate-pulse'>
        <div className='h-full max-w-7xl mx-auto px-4 flex items-center justify-between'>
          <div className='w-32 h-8 bg-gray-200 rounded' />
          <div className='w-48 h-8 bg-gray-200 rounded' />
        </div>
      </div>
    )
  }

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
