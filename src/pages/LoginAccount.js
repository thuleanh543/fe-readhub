import { useRef, useState } from 'react'
import { images } from '../constants'

function LoginAccount() {
  const width = useRef(window.innerWidth).current
  const height = useRef(window.innerHeight).current

  const [isFocused1, setIsFocused1] = useState(false)

  const handleFocus1 = () => {
    setIsFocused1(true)
  }

  const handleBlur1 = () => {
    setIsFocused1(false)
  }

  const placeholderStyle1 = {
    fontWeight: '300',
    color: '#6d6d6d',
    fontSize: '13px',
  }

  const [isFocused2, setIsFocused2] = useState(false)

  const handleFocus2 = () => {
    setIsFocused2(true)
  }

  const handleBlur2 = () => {
    setIsFocused2(false)
  }

  const placeholderStyle2 = {
    fontWeight: '300',
    color: '#6d6d6d',
    fontSize: '13px',
  }
  const [isHovered1, setIsHovered1] = useState(false)

  const handleMouseEnter1 = () => {
    setIsHovered1(true)
  }

  const handleMouseLeave1 = () => {
    setIsHovered1(false)
  }

  const [isHovered2, setIsHovered2] = useState(false)

  const handleMouseEnter2 = () => {
    setIsHovered2(true)
  }

  const handleMouseLeave2 = () => {
    setIsHovered2(false)
  }

  return (
    <div
      style={{
        backgroundColor: '#141518',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: height * 0.08,
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            marginTop: height * 0.013,
            marginLeft: width * 0.005,
            height: height * 0.065,
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <img
            src={images.thu}
            style={{
              height: 26,
              marginLeft: 5,
              alignSelf: 'center',
            }}
          />
          <span
            style={{
              marginLeft: 3,
              marginRight: 8,
              fontSize: 14,
              fontWeight: '500',
              alignSelf: 'center',
              color: '#e5ffbc',
            }}
          >
            Back to T&C
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          height: height * 0.18,
          width: width,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={'https://i.imgur.com/hPbfzZ2.png'}
          alt="Logo image T&C"
          style={{
            height: height * 0.09,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          height: height * 0.58,
          width: width,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: height * 0.51,
            width: width * 0.26,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: '400',
              color: '#eaeaea',
              marginTop: 6,
              marginBottom: 7,
            }}
          >
            Sign In with
          </span>

          <div
            style={{
              height: height * 0.09,
              width: width * 0.228,
              backgroundColor: '#2c2f34',
              borderRadius: 6,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: width * 0.05,
                height: height * 0.055,
                backgroundColor: '#212121',
                marginRight: 8,
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  flex: 1,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  backgroundColor: isHovered1 ? '#3588e8' : '',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={handleMouseEnter1}
                onMouseLeave={handleMouseLeave1}
              >
                <img
                  src={images.facebook}
                  style={{
                    height: height * 0.03,
                    filter: 'invert(100%)',
                  }}
                />
              </div>
              <div
                style={{
                  width: width * 0.05,
                  height: height * 0.007,
                  backgroundColor: '#3588e8',
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
              ></div>
            </div>
            <div
              style={{
                width: width * 0.05,
                height: height * 0.055,
                backgroundColor: '#212121',
                marginLeft: 8,
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  flex: 1,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  backgroundColor: isHovered2 ? '#bf3989' : '',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onMouseEnter={handleMouseEnter2}
                onMouseLeave={handleMouseLeave2}
              >
                <img
                  src={images.google}
                  style={{
                    height: height * 0.03,
                    filter: 'invert(100%)',
                  }}
                />
              </div>
              <div
                style={{
                  width: width * 0.05,
                  height: height * 0.007,
                  backgroundColor: '#bf3989',
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              marginTop: 7,
              marginBottom: 7,
              width: width * 0.228,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                marginLeft: 25,
                marginRight: 8,
                height: 0.3,
                backgroundColor: '#4b4d54',
                flex: 1,
                opacity: 0.5,
              }}
            ></div>
            <span
              style={{
                fontSize: 13,
                fontWeight: '400',
                color: '#eaeaea',
              }}
            >
              or With T&C
            </span>
            <div
              style={{
                marginLeft: 8,
                marginRight: 25,
                height: 0.5,
                backgroundColor: '#4b4d54',
                flex: 1,
                opacity: 0.5,
              }}
            ></div>
          </div>
          <div
            style={{
              height: height * 0.142,
              width: width * 0.228,
              backgroundColor: '#2c2f34',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <input
              type="text"
              placeholder={'Username or Email'}
              onFocus={handleFocus1}
              onBlur={handleBlur1}
              style={{
                marginTop: 10,
                backgroundColor: '#191919',
                color: '#fff',
                border: isFocused1
                  ? '1px solid #4ce09b'
                  : '1px solid transparent',
                outline: 'none',
                padding: 8,
                width: width * 0.197,
                borderRadius: 5,
                textAlign: 'left',
                justifyContent: 'center',
                paddingLeft: 10,
              }}
            />

            <style>{`input::placeholder {
            color: ${placeholderStyle1.color};
            font-weight: ${placeholderStyle1.fontWeight};
            fontSize: ${placeholderStyle1.fontSize};

            }`}</style>

            <input
              type="password"
              placeholder={'Password'}
              onFocus={handleFocus2}
              onBlur={handleBlur2}
              style={{
                marginBottom: 10,
                backgroundColor: '#191919',
                color: '#fff',
                border: isFocused2
                  ? '1px solid #4ce09b'
                  : '1px solid transparent',
                outline: 'none',
                padding: 8,
                width: width * 0.197,
                borderRadius: 5,
                textAlign: 'left',
                justifyContent: 'center',
                paddingLeft: 10,
              }}
            />

            <style>{`input::placeholder {
            color: ${placeholderStyle2.color};
            font-weight: ${placeholderStyle2.fontWeight};
            fontSize: ${placeholderStyle2.fontSize};

            }`}</style>
          </div>
          <div
            style={{
              width: width * 0.228,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: '300',
                color: '#67eab1',
                marginTop: 3,
              }}
            >
              Forgot Password?
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              width: width * 0.228,
              height: height * 0.065,
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: height * 0.065,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontWeight: '500',
                  fontSize: 15,
                  color: '#f2f2f2',
                  marginLeft: 5,
                  marginRight: 8,
                }}
              >
                Need an account?
              </span>
            </div>
            <div
              style={{
                width: width * 0.058,
                height: height * 0.065,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  height: height * 0.055,
                  width: width * 0.05,
                  border: '3px solid #00e0d8',
                  borderRadius: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#0fc6c6',
                  }}
                >
                  Sign in
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: height * 0.16 - 30,
          width: width,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            height: height * 0.08,
            width: width * 0.18,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div
            style={{
              height: height * 0.05,
              width: width * 0.038,
              marginLeft: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: '#dbdbdb',
                fontWeight: '400',
              }}
            >
              terms
            </span>
          </div>
          <div
            style={{
              height: height * 0.05,
              width: width * 0.038,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: '#dbdbdb',
                fontWeight: '400',
              }}
            >
              privacy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginAccount
