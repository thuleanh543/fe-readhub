import { Link, useNavigate } from 'react-router-dom'
import './App.css'
import { images, colors } from './constants'
import { useEffect, useRef, useState } from 'react'

function App () {

  const width = useRef( window.innerWidth ).current
  const height = useRef( window.innerHeight ).current

  const [ listOptions, setListOptions ] = useState( [
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
  ] )

  const [ books, setBooks ] = useState( [] );

  useEffect( () => {
    fetch( 'https://gutendex.com/books/?page=1' )
      .then( ( response ) => response.json() )
      .then( ( data ) => setBooks( data.results ) )
      .catch( ( error ) => console.error( 'Error fetching data:', error ) );
    console.log( localStorage.getItem( 'token' ) );
  }, [] );

  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/ReadBookScreen`, { state: { bookId } });
  };

  return (
    <div className="App">
      <div
        style={ {
          display: 'flex',
          height: height * 0.09,
          width: width - 15,
          flexDirection: 'row',
          paddingTop: 5,
          position: 'fixed',
          top: 0,
          zIndex: 1,
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
        } }
      >
        <img
          src={ images.imgOpenBook }
          alt="Logo Open Book"
          style={ {
            height: height * 0.09 - 32,
            marginTop: 13,
            marginBottom: 13,
            marginLeft: 15,
            marginRight: 15,
          } }
        />
        <form style={ {
          flex: 1,
          height: height * 0.09,
        } }
          action="/search">
          <div
            style={ {
              height: height * 0.09 - 6,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
            } }
          >

            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách"
              style={ {
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
              } }
            /><img
              src={ images.search }
              style={ {
                height: height * 0.09 - 41,
                paddingLeft: 10,
                paddingRight: 10,
                filter: 'invert(100%)',
              } }
            />
            <style>{ `input::placeholder {
            color: ${ colors.black232323FF };
            padding: ${ 15 }; }` }</style>

          </div>
        </form>

        <Link to="/LoginAccount" style={ { textDecoration: 'none' } }>
          <div
            style={ {
              width: width * 0.1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 3,
            } }
          >
            <img
              src={ images.bell }
              style={ {
                height: height * 0.09 - 41,
                paddingLeft: 10,
                paddingRight: 10,
                filter: 'invert(100%)',
              } }
            />
            <div
              style={ {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              } }
            >
              <p
                style={ {
                  alignSelf: 'center',
                  fontSize: 15,
                  color: '#f7f6f6',
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginRight: 10,
                  fontFamily: 'roboto',
                } }
              >
                the joker
              </p>
              <img
                src={ images.user }
                style={ {
                  height: height * 0.09 - 31,
                  alignSelf: 'center',
                  marginRight: 15,
                } }
              />
            </div>
          </div>
        </Link>
      </div>

      <div
        style={ {
          backgroundColor: colors.themeDark.primary,
          height: height * 0.37,
          paddingLeft: width * 0.05,
          fontWeight: 'bold',
          paddingRight: 25,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: height * 0.11,
        } }
      >
        <span
          style={ {
            float: 'left',
            color: '#8e8cbb',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
          } }
        >
          Thể loại phổ biến
        </span>
        <div
          style={ {
            height: height * 0.22,
            width: width * 0.91,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          } }
        >
          { listOptions.map( ( item, index ) => (
            <div
              style={ {
                height: height * 0.2,
                width: item.id == 1 ? width * 0.16 : width * 0.075,
                borderRadius: 3,
                backgroundImage: `url(${ item.url })`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              } }
            >
              <div
                style={ {
                  height: height * 0.083,
                  width: item.id == 1 ? width * 0.16 : width * 0.075,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,
                  backgroundColor: `${ item.backgroundColor || '#9b9b9b' }`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                } }
              >
                <span
                  style={ {
                    marginTop: 1,
                    marginBottom: 2,
                    fontSize: 15,
                    fontWeight: 'Bold',
                    color: '#fff',
                    fontFamily: 'roboto',
                    lineHeight: 1,
                  } }
                >
                  { item.title }
                </span>
                <span
                  style={ {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#fff',
                    fontFamily: 'cursive',
                  } }
                >
                  { item.quantity } views
                </span>
              </div>
            </div>
          ) ) }
        </div>
      </div>
      <div
        style={ {
          backgroundColor: colors.themeDark.color060d13,
          display: 'flex',
          width: width,
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          justifyContent: 'start',
          alignItems: 'start',
          flexWrap: 'wrap',
        } }
      >
        {books.map((book) => (
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={()=>{
        handleBookClick(book.id)
      }}
      >
      <div
            key={book.id}
            style={{
              height: height * 0.3,
              width: width * 0.12,
              backgroundImage: `url('${book.formats['image/jpeg']}')`,
              borderRadius: 8,
              backgroundSize: 'cover',
              marginTop: 10,
              marginRight: 10,
              marginLeft: 10,
              borderWidth: 3,
              borderColor: '#474a51',
              borderStyle: 'solid',
              boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
              alignItems: 'flex-end',
              justifyContent: 'space-evenly',

            }}
          ></div>
              <span
              key={book.id}
              style={{
                marginTop: 15,
                marginTop: 10,
              width: width * 0.12,
              height: height * 0.1,
              fontWeight: 'bold',
              fontSize: '14px',
              color: colors.themeDark.textColor,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              height: '100%',
              textAlign: 'center',
              }}>
                {book.title}
              </span>
            </div>
        ))}
      </div>
    </div>
  )
}

export default App
