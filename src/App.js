import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './App.css'
import {images, colors} from './constants'
import {ListBook} from './pages'
import {listOptions} from './component/set_data/SetData'
import axios from 'axios'
import {Avatar, Button, Menu, MenuItem, ListItemIcon} from '@mui/material'
import {AccountCircle, ExitToApp, Settings} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
  const open = Boolean(anchorEl)

  const handleSearch = event => {
    const value = event.target.value
    setSearchTerm(value)
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
        <form
          style={{
            flex: 1,
            height: windowSize.height * 0.09,
          }}
          action='/search'>
          <div
            style={{
              height: windowSize.height * 0.09 - 6,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <input
              type='text'
              placeholder='Nhập tên sách, tác giả hoặc từ khóa'
              value={searchTerm}
              onChange={handleSearch}
              style={{
                height: windowSize.height * 0.09 - 25,
                width: windowSize.width * 0.32,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
        </form>

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
      <div
        style={{
          backgroundColor: colors.themeLight.primary,
          height: windowSize.height * 0.37,
          paddingLeft: windowSize.width * 0.05,
          fontWeight: 'bold',
          paddingRight: 25,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: windowSize.height * 0.11,
        }}>
        <span
          style={{
            float: 'left',
            color: '#8e8cbb',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
          }}>
          Thể loại phổ biến
        </span>
        <div
          style={{
            height: windowSize.height * 0.22,
            width: windowSize.width * 0.91,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {listOptions.map((item, index) => (
            <div
              key={item.id}
              style={{
                height: windowSize.height * 0.13,
                width:
                   windowSize.width * 0.07,
                borderRadius: 3,
                backgroundImage: `url(${item.url})`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              <div
                style={{
                  height: windowSize.height * 0.05,
                  width:
                     windowSize.width * 0.07,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,
                  backgroundColor: `${item.backgroundColor || '#9b9b9b'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <span
                  style={{
                    marginTop: 1,
                    marginBottom: 2,
                    fontSize: 15,
                    fontWeight: 'Bold',
                    color: '#fff',
                    fontFamily: 'roboto',
                    lineHeight: 1,
                  }}>
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#fff',
                    fontFamily: 'cursive',
                  }}>
                  {item.quantity} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <ListBook searchTerm={searchTerm} windowSize={windowSize} />
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

export default App
