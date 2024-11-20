import React, {useState, useEffect} from 'react'
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

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const {user} = useUser()
  const {booksData, loading, error, bookshelves} = useBooks()

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

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className='App min-h-screen bg-[#060d13] flex flex-col'>
      <HeaderComponent
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        showSearch={true}
      />
      <div className='flex-1 overflow-y-auto mt-16'>
        <div className={searchTerm ? 'hidden' : 'block'}>
          <Banner />
          {user && <BookRecommendations user={user} />}
          <div className='bg-white'>
            {bookshelves.map(shelf => (
              <BookshelfSection
                key={shelf.topic}
                {...shelf}
                books={booksData[shelf.topic]}
              />
            ))}
          </div>
        </div>

        {searchTerm && (
          <div className={searchTerm ? 'block' : 'hidden'}>
            <ListBook searchTerm={searchTerm} windowSize={windowSize} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default App
