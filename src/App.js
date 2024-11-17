import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './App.css'
import {images, colors} from './constants'
import {ListBook} from './pages'
import BookshelfSection from './component/bookshelf/BookshelfSection'
import {listOptions} from './component/set_data/SetData'
import axios from 'axios'
import {Avatar, Button, Menu, MenuItem, ListItemIcon} from '@mui/material'
import {AccountCircle, ExitToApp, Settings, Forum} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HeaderComponent from './component/header/HeaderComponent'
import BookRecommendations from './component/recommendations/BookRecommendations'
import Banner from './component/banner/Banner'

const BOOKSHELVES = [
  {
    title: 'Mystery & Detective',
    topic: 'detective',
    backgroundColor: '#EF4444',
  },
  {
    title: 'Science Fiction & Fantasy',
    topic: 'science-fiction',
    backgroundColor: '#8B5CF6',
  },
  {
    title: "Children's Literature",
    topic: 'children',
    backgroundColor: '#10B981',
  },
]

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

  const handleSearchChange = newSearchTerm => {
    setSearchTerm(newSearchTerm)
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
    <div className='App min-h-screen bg-[#060d13] flex flex-col'>
      <HeaderComponent
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        showSearch ={true}
      />
      <div className='flex-1 overflow-y-auto mt-16'>
        {/* Sử dụng hidden thay vì conditional rendering */}
        <div className={searchTerm ? 'hidden' : 'block'}>
          <Banner />
          {user && <BookRecommendations windowSize={windowSize} user={user} />}
          <div className='bg-white'>
            {BOOKSHELVES.map(shelf => (
              <BookshelfSection
                key={shelf.topic}
                windowSize={windowSize}
                title={shelf.title}
                topic={shelf.topic}
                backgroundColor={shelf.backgroundColor}
              />
            ))}
          </div>
        </div>

        {/* ListBook chỉ render khi có searchTerm */}
        {searchTerm && (
          <div className={searchTerm ? 'block' : 'hidden'}>
            <ListBook searchTerm={searchTerm} windowSize={windowSize} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
