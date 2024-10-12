import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import { images, colors } from './constants';
import {ListBook} from './pages';
import { listOptions } from './component/set_data/SetData';

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className='App'
      style={{
        backgroundColor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
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
        }}
      >
        <img
          src={images.imgOpenBook}
          alt='Logo Open Book'
          style={{
            height: windowSize.height * 0.09 - 32,
            marginTop: 13,
            marginBottom: 13,
            marginLeft: 15,
            marginRight: 15,
          }}
        />
        <form
          style={{
            flex: 1,
            height: windowSize.height * 0.09,
          }}
          action='/search'
        >
          <div
            style={{
              height: windowSize.height * 0.09 - 6,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
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

        <Link to='/LoginAccount' style={{textDecoration: 'none'}}>
          <div
            style={{
              width: windowSize.width * 0.1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 3,
            }}>
            <img
              src={images.bell}
              style={{
                height: windowSize.height * 0.09 - 41,
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
                  height: windowSize.height * 0.09 - 31,
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
                height: windowSize.height * 0.2,
                width: item.id == 1 ? windowSize.width * 0.16 : windowSize.width * 0.075,
                borderRadius: 3,
                backgroundImage: `url(${item.url})`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              <div
                style={{
                  height: windowSize.height * 0.083,
                  width: item.id == 1 ? windowSize.width * 0.16 : windowSize.width * 0.075,
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
          marginTop: windowSize.height * 0.09,
        }}
      >
        <ListBook searchTerm={searchTerm} windowSize={windowSize} />
      </div>
    </div>
  );
}

export default App;
