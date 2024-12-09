import React, {useReducer, useEffect, useRef} from 'react'
import {Button, createTheme, ThemeProvider} from '@mui/material'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {images} from '../../../constants'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  registerReducer,
  initialState,
  actionTypes,
} from '../redux/registerReducer'

function VerifyRegister() {
  const height = useRef(window.innerHeight).current
  const [state, dispatch] = useReducer(registerReducer, initialState)
  const navigate = useNavigate()
  const location = useLocation()
  const {username, email, fullName, password} = location.state || {}

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({type: actionTypes.SET_COUNTDOWN, payload: state.countdown - 1})
    }, 1000)

    if (state.countdown === 0) {
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [state.countdown])

  const handleChangeOTP = e => {
    const value = e.target.value
    dispatch({type: actionTypes.SET_OTP, payload: value})

    if (value === '') {
      dispatch({type: actionTypes.SET_OTP_ERROR, payload: 'OTP is required'})
      dispatch({type: actionTypes.SET_BUTTON_DISABLED, value: true})
    } else if (value.length !== 6) {
      dispatch({
        type: actionTypes.SET_OTP_ERROR,
        payload: 'OTP must be 6 digits',
      })
      dispatch({type: actionTypes.SET_BUTTON_DISABLED, value: true})
    } else {
      dispatch({type: actionTypes.SET_OTP_ERROR, payload: ''})
      dispatch({type: actionTypes.SET_BUTTON_DISABLED, value: false})
    }
  }

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/authen/register?email=${email}&fullName=${fullName}&username=${username}&password=${password}&otp=${state.otp}`,
      )
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('tokenExpiration', Date.now() + 86400000)
      toast.success(response.data.message)
      navigate('/')
    } catch (error) {
      toast.error('OTP verification failed. Please try again.')
    }
  }

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/authen/send-otp?email=${email}&username=${username}`,
      )
      toast.success(response.data.message)
      dispatch({type: actionTypes.SET_COUNTDOWN, payload: 60})
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='bg-[#141518] min-h-screen flex flex-col'>
        {/* Header */}
        <div className='flex gap-2 items-center p-5'>
          <img
            src={images.imgOpenBook}
            alt='Logo Open Book'
            style={{
              height: height * 0.09 - 32,
              marginLeft: 15,
              marginRight: 15,
            }}
          />
          <Link to='/'>
            <span className='text-sm font-medium text-[#e5ffbc]'>
              Back to ReadHub
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div className='flex-grow flex flex-col items-center justify-center'>
          <img
            src={images.imgOpenBook}
            className='h-[9vh] mb-5'
            alt='Open Book'
          />

          <div className='w-[26vw] bg-[#2c2f34] rounded-lg p-7'>
            <h2 className='text-3xl font-bold text-[#f2f2f2] mb-7 text-center'>
              VERIFY OTP
            </h2>
            <input
              type='text'
              className='w-full h-12 bg-[#3b3e45] rounded-lg pl-5 text-[#f2f2f2] text-lg mb-4'
              placeholder='OTP'
              value={state.otp}
              onChange={handleChangeOTP}
            />
            {state.otpError && (
              <span className='text-[#f44336] text-sm'>{state.otpError}</span>
            )}
            <Button
              variant='contained'
              color='buttonRegister'
              className='w-full h-12 mt-5'
              disabled={state.buttonDisabled}
              onClick={handleVerify}>
              Verify
            </Button>
            <div className='flex justify-between mt-5'>
              <span className='text-[#dbdbdb] text-sm'>
                Didn't receive OTP?
              </span>
              <span
                className='text-[#67eab1] text-sm cursor-pointer'
                onClick={handleResendOTP}>
                Resend OTP
              </span>
              <span className='text-[#dbdbdb] text-sm'>{state.countdown}s</span>
            </div>
          </div>
        </div>
        <div className='h-[16vh] flex flex-row items-end w-full justify-center'>
          <div className='h-[8vh] flex flex-row items-center gap-5'>
            <div className='h-[5vh] ml-5 flex justify-center items-center'>
              <span className='text-base text-[#dbdbdb] font-normal'>
                terms
              </span>
            </div>
            <div className='h-[5vh] flex justify-center items-center'>
              <span className='text-base text-[#dbdbdb] font-normal'>
                privacy
              </span>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
const theme = createTheme({
  palette: {
    buttonRegister: {
      main: '#51bd8e',
      light: '#67eab1',
      dark: '#4ce09b',
      contrastText: '#ffffff',
    },
  },
})
export default VerifyRegister
