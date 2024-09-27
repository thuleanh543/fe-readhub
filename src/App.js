import {Link, useNavigate} from 'react-router-dom'
import './App.css'
import {images, colors} from './constants'
import {useEffect, useRef, useState, useCallback} from 'react'
import {CircularProgress} from '@mui/material'

function App() {
  const width = useRef(window.innerWidth).current
  const height = useRef(window.innerHeight).current
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [listOptions, setListOptions] = useState([
    {
      id: 1,
      url: 'https://i.imgur.com/JJ3tmg6.jpg',
      backgroundColor: '#9a84e9',
      title: 'Viễn tưởng',
      quantity: '1.200',
    },

    {
      id: 2,
      url: 'https://i.imgur.com/6Ebubdn.jpg',
      backgroundColor: '#02fb62',
      title: 'Khoa học viễn tưởng',
      quantity: '300',
    },
    {
      id: 3,
      url: 'https://i.imgur.com/W1tDyVO.jpg',
      backgroundColor: '#02eefb',
      title: 'Tưởng tượng',
      quantity: '881',
    },
    {
      id: 4,
      url: 'https://i.imgur.com/aqfzW8f.jpg',
      backgroundColor: '#ec9cbf',
      title: 'Lịch sử',
      quantity: '3.300',
    },
    {
      id: 5,
      url: 'https://i.imgur.com/7tbj9o1.jpg',
      backgroundColor: '#4b27a5',
      title: 'Khoa học',
      quantity: '558',
    },
    {
      id: 6,
      url: 'https://i.imgur.com/sdyyEH3.jpg',
      backgroundColor: '#791aae',
      title: 'Cuộc phiêu lưu',
      quantity: '200',
    },
    {
      id: 7,
      url: 'https://i.imgur.com/VmNBNyt.png',
      backgroundColor: '#010059',
      title: 'Tiểu sử',
      quantity: '1.132',
    },
    {
      id: 8,
      url: 'https://i.imgur.com/DnjIfbk.jpg',
      backgroundColor: '#db98bb',
      title: 'Triết học',
      quantity: '159',
    },
    {
      id: 9,
      url: 'https://i.imgur.com/KFwJx7P.jpg',
      backgroundColor: '#121818',
      title: 'Thơ',
      quantity: '599',
    },
    {
      id: 10,
      url: 'https://i.imgur.com/9O6LHZ5.jpg',
      backgroundColor: '#9f82bd',
      title: 'Kịch',
      quantity: '300',
    },
  ])
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [shouldFetch, setShouldFetch] = useState(true)
  const prevSearchTerm = useRef('')

  const fetchBooks = useCallback(
    async (search = '', pageNum = 1) => {
      setHasMore(true)
      if (loading || !shouldFetch) return
      setLoading(true)
      try {
        let apiUrl
        if (search === '') {
          // Nếu searchTerm rỗng, sử dụng API cơ bản
          apiUrl = 'https://gutendex.com/books'
        } else {
          const formattedSearchTerm = search.replace(/ /g, '&')
          apiUrl = `https://gutendex.com/books/?search=${formattedSearchTerm}&page=${pageNum}`
        }
        const response = await fetch(apiUrl)
        const data = await response.json()
        if (Array.isArray(data.results)) {
          if (pageNum === 1) {
            setBooks(data.results)
          } else {
            setBooks(prevBooks => [...prevBooks, ...data.results])
          }
          setPage(pageNum + 1)
          setHasMore(data.next !== null)
        } else {
          setLoading(false)
          setHasMore(false)
        }
      } catch (error) {
        setLoading(false)
        setHasMore(false)
      } finally {
        setLoading(false)
        setShouldFetch(false)
      }
    },
    [loading, shouldFetch],
  )

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        setShouldFetch(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    let searchTimeoutId

    if (searchTerm !== prevSearchTerm.current) {
      prevSearchTerm.current = searchTerm
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId)
      }
      searchTimeoutId = setTimeout(() => {
        setPage(1)
        setBooks([])
        setShouldFetch(true)
      }, 200)
    }

    if (shouldFetch) {
      fetchBooks(searchTerm, page)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId)
      }
    }
  }, [searchTerm, fetchBooks, page, shouldFetch])

  const handleSearch = event => {
    const value = event.target.value
    setSearchTerm(value)
  }
  const handleBookClick = bookId => {
    navigate('/ReadBookScreen', {state: {bookId}})
  }

  const getGridColumns = () => {
    const width = windowSize.width
    if (width > 1400) return 7
    if (width > 1200) return 6
    if (width > 992) return 5
    if (width > 768) return 4
    if (width > 576) return 3
    return 2
  }

  const gridColumns = getGridColumns()
  const bookWidth = (windowSize.width * 0.9) / gridColumns - 20

  return (
    <div
      className='App'
      style={{
        backgroundColor: colors.themeDark.color060d13,
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
        }}>
        <img
          src={images.imgOpenBook}
          alt='Logo Open Book'
          style={{
            height: height * 0.09 - 32,
            marginTop: 13,
            marginBottom: 13,
            marginLeft: 15,
            marginRight: 15,
          }}
        />
        <form
          style={{
            flex: 1,
            height: height * 0.09,
          }}
          action='/search'>
          <div
            style={{
              height: height * 0.09 - 6,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <input
              type='text'
              placeholder='Tìm kiếm theo tên sách'
              value={searchTerm}
              onChange={handleSearch}
              style={{
                height: height * 0.09 - 25,
                width: width * 0.32,
                backgroundColor: colors.white,
                padding: '0px  0px 0px 10px',
                border: '1px solid transparent',
                borderRadius: '3px',
                outline: '0',
                opacity: '0.8',
                fontSize: '15px',
                fontWeight: '400',
                letterSpacing: '0.4px',
                color: colors.black,
                textShadow: 'inherit',
                boxShadow: '0px 2px 6px rgba(32,32,32, 0.3)',
              }}
            />
            <img
              src={images.search}
              style={{
                height: height * 0.09 - 41,
                paddingLeft: 10,
                paddingRight: 10,
                filter: 'invert(100%)',
              }}
            />
            <style>{`input::placeholder {
            color: ${colors.black232323FF};
            padding: ${15}; }`}</style>
          </div>
        </form>

        <Link to='/LoginAccount' style={{textDecoration: 'none'}}>
          <div
            style={{
              width: width * 0.1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 3,
            }}>
            <img
              src={images.bell}
              style={{
                height: height * 0.09 - 41,
                paddingLeft: 10,
                paddingRight: 10,
                filter: 'invert(100%)',
              }}
            />
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <p
                style={{
                  alignSelf: 'center',
                  fontSize: 15,
                  color: '#f7f6f6',
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginRight: 10,
                  fontFamily: 'roboto',
                }}>
                the joker
              </p>
              <img
                src={images.user}
                style={{
                  height: height * 0.09 - 31,
                  alignSelf: 'center',
                  marginRight: 15,
                }}
              />
            </div>
          </div>
        </Link>
      </div>

      <div
        style={{
          backgroundColor: colors.themeDark.primary,
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
            height: height * 0.22,
            width: width * 0.91,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {listOptions.map((item, index) => (
            <div
              key={item.id}
              style={{
                height: height * 0.2,
                width: item.id == 1 ? width * 0.16 : width * 0.075,
                borderRadius: 3,
                backgroundImage: `url(${item.url})`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              <div
                style={{
                  height: height * 0.083,
                  width: item.id == 1 ? width * 0.16 : width * 0.075,
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: colors.themeDark.color060d13,
          padding: '20px 5%',
          marginTop: windowSize.height * 0.09,
        }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '20px',
            justifyContent: 'center',
            width: '100%',
          }}>
          {books.map(book => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}>
              <div
                style={{
                  height: bookWidth * 1.38,
                  width: bookWidth,
                  backgroundImage: `url('${book.formats['image/jpeg']}')`,
                  borderRadius: 8,
                  backgroundSize: 'cover',
                  borderWidth: 3,
                  borderColor: '#474a51',
                  borderStyle: 'solid',
                  boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
                }}
              />
              <span
                style={{
                  marginTop: 15,
                  width: bookWidth,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: colors.themeDark.textColor,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 2,
                  textAlign: 'center',
                }}>
                {book.title}
              </span>
            </div>
          ))}
        </div>
        {loading && (
          <p
            style={{
              color: '#fff',
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <CircularProgress size={24} color='inherit' /> Loading more books...
          </p>
        )}
        {!hasMore && (
          <p
            style={{
              color: '#fff',
              textAlign: 'center',
              marginTop: 10,
            }}>
            No more books to load
          </p>
        )}
      </div>
    </div>
  )
}

export default App
