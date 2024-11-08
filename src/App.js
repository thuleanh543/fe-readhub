import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './App.css'
import {images, colors} from './constants'
import {ListBook} from './pages'
import {listOptions} from './component/set_data/SetData'
import axios from 'axios'
import {Avatar, Button, Menu, MenuItem, ListItemIcon} from '@mui/material'
import {AccountCircle, ExitToApp, Settings, Forum} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HeaderComponent from './component/header/HeaderComponent'
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
        height: '100vh',
      }}>
      <HeaderComponent/>
      <div style={{flex: 1, overflowY: 'auto'}}>
        <div
          style={{
            backgroundColor: colors.themeLight.primary,
            height: windowSize.height * 0.37,
            paddingLeft: windowSize.width * 0.05,
            fontWeight: 'bold',
            paddingRight: 25,
            flex: 1,
            flexDirection: 'column',
            paddingTop: windowSize.height * 0.11,
            overflowY: 'auto',
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
                    item.id === 1
                      ? windowSize.width * 0.16
                      : windowSize.width * 0.075,
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
                      item.id === 1
                        ? windowSize.width * 0.16
                        : windowSize.width * 0.075,
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

        <ListBook searchTerm={searchTerm} windowSize={windowSize} />
      </div>
    </div>
  )
}

export default App
