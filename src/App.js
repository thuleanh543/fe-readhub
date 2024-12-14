import React, {useState, useEffect, Suspense} from 'react'
import './App.css'
import {ListBook} from './pages'
import BookshelfSection from './component/bookshelf/BookshelfSection'
import 'react-toastify/dist/ReactToastify.css'
import HeaderComponent from './component/header/HeaderComponent'
import BookRecommendations from './component/recommendations/BookRecommendations'
import Banner from './component/banner/Banner'
import {useUser} from './contexts/UserProvider'
import {useBooks} from './contexts/BooksProvider'
import LoadingSkeleton from './component/bookshelf/LoadingSkeleton'
import ErrorMessage from './component/common/ErrorMessage'
import Footer from './component/footer/Footer'
import {useCallback} from 'react'
import axios from 'axios'

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [searchTerm, setSearchTerm] = useState({
    title: '',
    author: null,
    subjects: null,
    bookshelves: null,
    languages: null,
  })
  const {user} = useUser()
  const {booksData, loading, error, bookshelves} = useBooks()
  const [topRated, setTopRated] = useState(null)

  useEffect(() => {
    // Function để fetch top rated books
    const fetchTopRated = async () => {
      try {
        const responseTopRated = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/book/top-rated`)
          setTopRated(responseTopRated.data.results)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTopRated()
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSearchChange = useCallback(value => {
    setSearchTerm(prevSearchTerm => ({
      ...prevSearchTerm,
      title: value.title 
    }))
  }, [])

  return (
    <div className='App min-h-screen bg-[#060d13] flex flex-col'>
      <HeaderComponent
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        showSearch={true}
      />
      <div className='flex-1 overflow-y-auto mt-16'>
        <div style={{display: searchTerm.title ? 'none' : 'block'}}>
          <Banner />
          {user && <BookRecommendations user={user} />}
          <div className='bg-white'>
            {error ? (
              <ErrorMessage error={error} />
            ) : loading ? (
              <LoadingSkeleton />
            ) : (
            <>
              <BookshelfSection
                title='Top rated books ⭐'
                books={topRated || []}
                isLoading={false}
              />
              {bookshelves.map(shelf => (
                <BookshelfSection
                  key={shelf.topic}
                  {...shelf}
                  books={booksData[shelf.topic] || []}
                  isLoading={false}
                />
              ))}
            </>
            )}
          </div>
        </div>

        <div style={{display: searchTerm ? 'block' : 'none'}}>
          <ListBook searchTerm={searchTerm} windowSize={windowSize} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
