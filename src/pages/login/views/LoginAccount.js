import React, {useReducer, useRef} from 'react'
import {images} from '../../../constants'
import {
  isValidEmailOrUsername,
  isValidPassword,
} from '../../../utils/Validatations'
import {Button} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {Link, useNavigate} from 'react-router-dom'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import {toast} from 'react-toastify'
import axios from 'axios'
import {loginReducer, initialState, actionTypes} from '../redux/loginReducer'
import {useUser} from '../../../contexts/UserProvider'

const theme = createTheme({
  palette: {
    buttonLogin: {
      main: '#51bd8e',
      light: '#67eab1',
      dark: '#4ce09b',
      contrastText: '#ffffff',
    },
  },
})

const LoginAccount = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState)
  const navigate = useNavigate()
  const height = useRef(window.innerHeight).current
  const {loginUser} = useUser()

  const validateForm = (email, password) => {
    const isFormValid =
      isValidEmailOrUsername(email) && isValidPassword(password)
    dispatch({type: actionTypes.SET_BUTTON_DISABLED, payload: !isFormValid})
  }

  const handleChangeEmail = e => {
    const value = e.target.value
    dispatch({type: actionTypes.SET_EMAIL, payload: value})

    if (!value) {
      dispatch({
        type: actionTypes.SET_EMAIL_ERROR,
        payload: 'Email is required',
      })
    } else if (!isValidEmailOrUsername(value)) {
      dispatch({
        type: actionTypes.SET_EMAIL_ERROR,
        payload: 'Invalid email address or username',
      })
    } else {
      dispatch({type: actionTypes.SET_EMAIL_ERROR, payload: ''})
    }

    validateForm(value, state.password)
  }

  const handleChangePassword = e => {
    const value = e.target.value
    dispatch({type: actionTypes.SET_PASSWORD, payload: value})

    if (!value) {
      dispatch({
        type: actionTypes.SET_PASSWORD_ERROR,
        payload: 'Password is required',
      })
    } else if (!isValidPassword(value)) {
      dispatch({
        type: actionTypes.SET_PASSWORD_ERROR,
        payload:
          'Password must be at least 8 characters long, include a letter, a number, and a special character',
      })
    } else {
      dispatch({type: actionTypes.SET_PASSWORD_ERROR, payload: ''})
    }

    validateForm(state.email, value)
  }

  const handleLogin = async () => {
    if (state.emailError || state.passwordError) return

    dispatch({type: actionTypes.SET_LOADING, payload: true})

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/authen/login?email=${state.email}&password=${state.password}`,
      )

      if (response.data.success) {
        // Lưu role cho admin routing
        localStorage.setItem('role', response.data.role)

        // Login với token và update user state
        const success = await loginUser(response.data.token)

        if (success) {
          dispatch({type: actionTypes.SET_SUCCESS, payload: true})
          toast.success(response.data.message)

          // Redirect dựa trên role
          if (response.data.role === 'ADMIN') {
            navigate('/admin/dashboard')
          } else {
            navigate('/')
          }
        }
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Email or password is incorrect!')
      console.error('Login error:', error)
    } finally {
      dispatch({type: actionTypes.SET_LOADING, payload: false})
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

        {/* Login Form */}
        <div className='flex-grow flex flex-col items-center justify-center'>
          <img
            src={images.imgOpenBook}
            className='h-[9vh] mb-5'
            alt='Open Book'
          />
          <div className='w-[26vw] bg-[#2c2f34] rounded-lg p-7'>
            <h2 className='text-3xl font-bold text-[#f2f2f2] mb-7 text-center'>
              LOGIN
            </h2>

            {/* Email/Username Input */}
            <input
              type='text'
              placeholder='Username or Email'
              value={state.email}
              onChange={handleChangeEmail}
              onFocus={() =>
                dispatch({type: actionTypes.SET_FOCUS1, payload: true})
              }
              onBlur={() =>
                dispatch({type: actionTypes.SET_FOCUS1, payload: false})
              }
              className={`w-full p-2.5 rounded-md text-white bg-[#191919] border ${
                state.emailError ? 'border-red-500' : 'border-transparent'
              } focus:border-[#4ce09b] outline-none`}
            />
            {state.emailError && (
              <p className='text-red-500 text-sm mt-1'>{state.emailError}</p>
            )}

            {/* Password Input */}
            <div className='relative mt-3 w-full'>
              <input
                type={state.isShowPassword ? 'text' : 'password'}
                placeholder='Password'
                value={state.password}
                onChange={handleChangePassword}
                onFocus={() =>
                  dispatch({type: actionTypes.SET_FOCUS2, payload: true})
                }
                onBlur={() =>
                  dispatch({type: actionTypes.SET_FOCUS2, payload: false})
                }
                className={`w-full p-2.5 rounded-md text-white bg-[#191919] border ${
                  state.passwordError ? 'border-red-500' : 'border-transparent'
                } focus:border-[#4ce09b] outline-none`}
              />
              <button
                type='button'
                onClick={() =>
                  dispatch({type: actionTypes.TOGGLE_PASSWORD_VISIBILITY})
                }
                className='absolute inset-y-0 right-2 flex items-center text-[#67eab1]'>
                {state.isShowPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </button>
            </div>
            {state.passwordError && (
              <p className='text-red-500 text-sm mt-1'>{state.passwordError}</p>
            )}

            {/* Forgot Password */}
            <div className='w-full flex justify-end mt-3 mb-3'>
              <span className='text-sm text-[#67eab1] cursor-pointer'>
                Forgot Password?
              </span>
            </div>

            {/* Login Button */}
            <Button
              variant='contained'
              className='w-full h-12 mt-4 text-white font-bold'
              color='buttonLogin'
              onClick={handleLogin}
              disabled={state.buttonDisabled || state.loading}>
              {state.loading ? 'Logging in...' : 'LOGIN'}
            </Button>

            {/* Register Link */}
            <div className='mt-4 flex items-center justify-center'>
              <span className='text-lg text-[#f2f2f2] mr-2'>
                Need an account?
              </span>
              <Link to='/register'>
                <Button className='text-[#0fc6c6]'>Sign in</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='w-full flex justify-center mt-5'>
          <span className='text-base text-[#dbdbdb] mx-3'>terms</span>
          <span className='text-base text-[#dbdbdb] mx-3'>privacy</span>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default LoginAccount
