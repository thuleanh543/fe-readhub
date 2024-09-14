import { Link } from 'react-router-dom'
import './App.css'
import { images } from './constants'
import { useRef, useState } from 'react'

function App () {
  const placeholderStyle = {
    color: '#d0d0e2',
  }

  const width = useRef( window.innerWidth ).current
  const height = useRef( window.innerHeight ).current

  const [ listOptions, setListOptions ] = useState( [
    {
      id: 1,
      url: 'https://i.imgur.com/JJ3tmg6.jpg',
      backgroundColor: '#9a84e9',
      title: 'Abstract',
      quantity: '1.200',
    },

    {
      id: 2,
      url: 'https://i.imgur.com/6Ebubdn.jpg',
      backgroundColor: '#02fb62',
      title: 'Nature',
      quantity: '300',
    },
    {
      id: 3,
      url: 'https://i.imgur.com/W1tDyVO.jpg',
      backgroundColor: '#02eefb',
      title: 'Music',
      quantity: '881',
    },
    {
      id: 4,
      url: 'https://i.imgur.com/aqfzW8f.jpg',
      backgroundColor: '#ec9cbf',
      title: 'Love',
      quantity: '3.300',
    },
    {
      id: 5,
      url: 'https://i.imgur.com/7tbj9o1.jpg',
      backgroundColor: '#4b27a5',
      title: 'Gaming',
      quantity: '558',
    },
    {
      id: 6,
      url: 'https://i.imgur.com/sdyyEH3.jpg',
      backgroundColor: '#791aae',
      title: 'Fashion',
      quantity: '200',
    },
    {
      id: 7,
      url: 'https://i.imgur.com/VmNBNyt.png',
      backgroundColor: '#ffebd3',
      title: 'Technology',
      quantity: '1.132',
    },
    {
      id: 8,
      url: 'https://i.imgur.com/DnjIfbk.jpg',
      backgroundColor: '#db98bb',
      title: 'Art',
      quantity: '159',
    },
    {
      id: 9,
      url: 'https://i.imgur.com/KFwJx7P.jpg',
      backgroundColor: '#121818',
      title: 'Travel',
      quantity: '599',
    },
    {
      id: 10,
      url: 'https://i.imgur.com/9O6LHZ5.jpg',
      backgroundColor: '#9f82bd',
      title: 'Food',
      quantity: '300',
    },
  ] )

  return (
    <div className="App">
      <div
        style={ {
          display: 'flex',
          height: height * 0.09,
          width: width - 15,
          backgroundColor: '#171544',
          flexDirection: 'row',
          paddingTop: 5,
          position: 'fixed',
          top: 0,
          zIndex: 1,
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
        } }
      >
        <img
          src={ 'https://i.imgur.com/hPbfzZ2.png' }
          alt="Logo image T&C"
          style={ {
            height: height * 0.09 - 32,
            marginTop: 13,
            marginBottom: 13,
            marginLeft: 10,
            marginRight: 13,
          } }
        />


        <div
          style={ {
            flex: 1,
            height: height * 0.09,
          } }
        >
          <form action="/search">
            <div
              style={ {
                height: height * 0.09 - 6,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              } }
            >
              <input
                type="text"
                placeholder="Images, #tags, @users oh my!"
                style={ {
                  height: height * 0.09 - 33,
                  width: width * 0.32,
                  backgroundColor: '#454469',
                  padding: '0px  0px 0px 10px',
                  border: '1px solid transparent',
                  borderRadius: '3px',
                  outline: '0',
                  opacity: '0.8',
                  fontSize: '15px',
                  fontWeight: '400',
                  letterSpacing: '0.4px',
                  color: '#fff',
                  textShadow: 'inherit',
                  boxShadow: '0px 2px 6px rgba(32,32,32, 0.3)',
                } }
              />
              <style>{ `input::placeholder {
            color: ${ placeholderStyle.color };
            padding: ${ placeholderStyle.padding }; }` }</style>

              <img
                src={ images.search }
                style={ {
                  height: height * 0.09 - 45,
                  filter: 'invert(100%)',
                  padding: 10,
                } }
              />
            </div>
          </form>
        </div>
        <Link to="/LoginAccount" style={ { textDecoration: 'none' } }>
          <div
            style={ {
              width: width * 0.163,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',

              marginBottom: 3,
            } }
          >
            <img
              src={ images.login }
              style={ {
                height: height * 0.09 - 41,
                paddingLeft: 10,
                paddingRight: 10,
                filter: 'invert(100%)',
              } }
            />

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
                  boxShadow: '0px 2px 6px rgba(1,1,1, 0.4)',
                } }
              />
            </div>
          </div>
        </Link>
      </div>
      <div
        style={ {
          height: height * 0.1,
          backgroundColor: '#171544',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        } }
      >
        <p
          style={ {
            color: '#acd7ea',
            fontWeight: 'bold',
            fontSize: 20,
          } }
        >
          The only sensible way to live in this world is without rules.
        </p>
      </div>
      <div
        style={ {
          backgroundColor: '#171544',
          height: height * 0.26,
          paddingLeft: width * 0.05,
          fontWeight: 'bold',
          paddingRight: 25,
          display: 'flex',
          flexDirection: 'column',
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
          EXPLORE TAGS
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
                  height: height * 0.08,
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
                  } }
                >
                  ${ item.title }
                </span>
                <span
                  style={ {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#fff',
                    fontFamily: 'cursive',
                  } }
                >
                  ${ item.quantity } ports
                </span>
              </div>
            </div>
          ) ) }
        </div>
      </div>
      <div
        style={ {
          backgroundColor: '#060d13',
          display: 'flex',
          height: height * 0.85,
          width: width,
          flexDirection: 'row',
          paddingLeft: width * 0.01,
          paddingRight: width * 0.01,
          justifyContent: 'center',
          alignItems: 'center',
        } }
      >
        <div
          style={ {
            height: height * 0.7,
            width: width * 0.2,
            backgroundImage: `url('https://i.imgur.com/fU2d8Pl.jpg')`,
            borderRadius: 8,
            backgroundSize: 'cover',
            marginRight: 10,
            marginLeft: 10,
            borderWidth: 3,
            borderColor: '#474a51',
            borderStyle: 'solid',
            boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
            display: 'flex',
          } }
        >
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ff7b94',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.love } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ff7b94',
                marginLeft: 3,
              } }
            >
              53
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #4370ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.chat } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#4370ff',
                marginLeft: 3,
              } }
            >
              33
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ffe0d1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.eyes } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffe0d1',
                marginLeft: 3,
              } }
            >
              115
            </span>
          </div>
        </div>
        <div
          style={ {
            height: height * 0.66,
            width: width * 0.2,
            backgroundImage: `url('https://i.imgur.com/3yRmJrO.jpg')`,
            borderRadius: 8,
            backgroundSize: 'cover',
            marginRight: 10,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: '#9e4f48',
            borderStyle: 'solid',
            boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
            display: 'flex',
          } }
        >
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ff7b94',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.love } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ff7b94',
                marginLeft: 3,
              } }
            >
              53
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #4370ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.chat } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#4370ff',
                marginLeft: 3,
              } }
            >
              33
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ffe0d1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.eyes } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffe0d1',
                marginLeft: 3,
              } }
            >
              115
            </span>
          </div>
        </div>
        <div
          style={ {
            height: height * 0.6,
            width: width * 0.2,
            backgroundImage: `url('https://i.imgur.com/v3MFM7B.jpg')`,
            backgroundSize: 'cover',
            marginRight: 10,
            marginLeft: 10,
            borderRadius: 8,
            boxShadow: '5px 5px 10px rgba(255, 255, 255,0.3)',
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
            display: 'flex',
          } }
        >
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ff7b94',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.love } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ff7b94',
                marginLeft: 3,
              } }
            >
              53
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #4370ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.chat } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#4370ff',
                marginLeft: 3,
              } }
            >
              33
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ffe0d1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.eyes } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffe0d1',
                marginLeft: 3,
              } }
            >
              115
            </span>
          </div>
        </div>
        <div
          style={ {
            height: height * 0.55,
            width: width * 0.2,
            backgroundImage: `url('https://i.imgur.com/WXa6UyW.jpg')`,
            borderRadius: 8,
            backgroundSize: 'cover',
            marginRight: 10,
            marginLeft: 10,
            boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
            display: 'flex',
          } }
        >
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ff7b94',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.love } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ff7b94',
                marginLeft: 3,
              } }
            >
              53
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #4370ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.chat } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#4370ff',
                marginLeft: 3,
              } }
            >
              33
            </span>
          </div>
          <div
            style={ {
              marginBottom: -height * 0.028,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: '#09060f',
              borderRadius: height * 0.04,
              boxShadow: '0 0 10px #ffe0d1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            } }
          >
            <img src={ images.eyes } style={ { height: height * 0.02 } } />
            <span
              style={ {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffe0d1',
                marginLeft: 3,
              } }
            >
              115
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
