import { useRef, useState } from 'react'
import { images } from '../constants'

function PushImage() {
  const width = useRef(window.innerWidth).current
  const height = useRef(window.innerHeight).current
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const placeholderStyle = {
    fontWeight: 'bold',
    color: '#dfdfdf',
    fontSize: '14px',
  }
  return (
    <div
      style={{
        height: height - 0.1,
        width: width,
        backgroundColor: '#17191f',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <img
        src={'https://i.imgur.com/hPbfzZ2.png'}
        alt="Logo image T&C"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          height: height * 0.09 - 32,
          marginTop: 18,
          marginBottom: 13,
          marginLeft: 10,
          marginRight: 13,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          height: height * 0.07,
          width: width * 0.2,
          paddingTop: 4,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <p
          style={{
            alignSelf: 'center',
            fontSize: 14,
            color: '#aaaaaa',
            fontWeight: '500',
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          the joker
        </p>
        <img
          src={images.user}
          style={{
            height: height * 0.09 - 33,
            alignSelf: 'center',
            marginRight: 15,
          }}
        />
      </div>

      <div
        style={{
          width: width * 0.68,
          height: height * 0.46,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'row',
          marginTop: 15,
        }}
      >
        <div
          style={{
            width: width * 0.34,
            height: height * 0.45,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            backgroundImage: `url(${images.gojobg})`,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: width * 0.23,
              height: height * 0.11,
              border: '3px dashed #78a0bc',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <p
              style={{
                fontWeight: '500',
                color: '#d9e4ec',
                fontSize: 17,
              }}
            >
              Thả hình ảnh vào đây
            </p>
          </div>
        </div>
        <div
          style={{
            width: width * 0.34,
            height: height * 0.45,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            backgroundColor: '#3c424b',
            flexDirection: 'column',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <div
            style={{
              height: height * 0.05,
              width: width * 0.23,
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={images.choseimage}
              style={{
                height: height * 0.09 - 44,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 6,
                marginRight: 6,
                filter: 'invert(100%)',
              }}
            />
            <span
              style={{
                fontSize: 14,
                marginLeft: 6,
                marginBottom: 3,
                color: '#dfdfdf',
                fontWeight: 'bold',
              }}
            >
              Choose Photo/Video
            </span>
          </div>
          <div
            style={{
              height: height * 0.05,
              width: width * 0.23,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                height: 1,
                width: 50,
                backgroundColor: '#888888',
              }}
            ></div>
            <span
              style={{
                fontSize: 14,
                marginLeft: 8,
                marginRight: 8,
                marginBottom: 3,
                color: '#dfdfdf',
                fontWeight: 'bold',
              }}
            >
              or
            </span>
            <div
              style={{
                backgroundColor: '#888888',
                height: 1,
                width: 50,
              }}
            ></div>
          </div>

          <input
            type="text"
            placeholder={isFocused ? '' : 'Paste image or URL'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              marginTop: 3,
              backgroundColor: '#272a33',
              color: '#fff',
              border: isFocused ? '1px solid #9baee6' : '1px solid transparent',
              outline: 'none',
              padding: 10,
              width: width * 0.2,
              borderRadius: 3,
              textAlign: 'center',
            }}
          />

          <style>{`input::placeholder {
            color: ${placeholderStyle.color};
            font-weight: ${placeholderStyle.fontWeight};
            fontSize: ${placeholderStyle.fontSize};

            }`}</style>

          <div
            style={{
              marginTop: 20,
              height: height * 0.15,
              width: width * 0.23,
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                height: height * 0.095,
                width: width * 0.055,
                marginRight: 20,
              }}
            >
              <div
                style={{
                  height: height * 0.07,
                  width: width * 0.055,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={images.meme}
                  style={{
                    height: height * 0.05,
                  }}
                />
              </div>

              <div
                style={{
                  width: width * 0.055,
                  height: height * 0.025,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: '#efefef',
                  }}
                >
                  Meme
                </span>
              </div>
            </div>
            <div
              style={{
                height: height * 0.095,
                width: width * 0.06,
                marginLeft: 23,
                marginRight: 23,
              }}
            >
              <div
                style={{
                  height: height * 0.07,
                  width: width * 0.06,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={images.videotogit}
                  style={{
                    height: height * 0.05,
                  }}
                />
              </div>

              <div
                style={{
                  width: width * 0.06,
                  height: height * 0.025,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: '#efefef',
                  }}
                >
                  Video to git
                </span>
              </div>
            </div>
            <div
              style={{
                height: height * 0.095,
                width: width * 0.055,
                marginLeft: 20,
              }}
            >
              <div
                style={{
                  height: height * 0.07,
                  width: width * 0.055,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={images.myimage}
                  style={{
                    height: height * 0.05,
                  }}
                />
              </div>

              <div
                style={{
                  width: width * 0.055,
                  height: height * 0.025,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: '#efefef',
                  }}
                >
                  My image
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            top: -20,
            right: 20,
            width: 40,
            height: 38,
            background: '#3c424b',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)',
            borderRadius: 25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={images.close}
            style={{
              height: 14,
              filter: 'invert(100%)',
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: height * 0.03,
          width: width * 0.5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#bcbcbc',
            fontWeight: '500',
          }}
        >
          By creating a post, you agree to Imgur's
        </span>
        &nbsp;
        <span
          style={{
            fontSize: 12,
            color: '#1689b7',
            fontWeight: '500',
          }}
        >
          Terms of Service
        </span>
        &nbsp;
        <span
          style={{
            fontSize: 12,
            color: '#bcbcbc',
            fontWeight: '500',
          }}
        >
          and
        </span>
        &nbsp;
        <span
          style={{
            fontSize: 12,
            color: '#1689b7',
            fontWeight: '500',
          }}
        >
          Privacy Policy
        </span>
      </div>
    </div>
  )
}
export default PushImage
