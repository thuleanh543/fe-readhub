import {isValidEmail, isValidPassword} from '../../../utils/Validatations'

export const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  usernameError: '',
  emailError: '',
  passwordError: '',
  confirmPasswordError: '',
  isShowPassword: false,
  isShowConfirmPassword: false,
  isFocused1: false,
  isFocused2: false,
  isFocused3: false,
  isFocused4: false,
  buttonDisabled: true,
  otp: '',
  otpError: '',
  countdown: 60,
  loading: false,
  success: false,
}

export const actionTypes = {
  SET_FIELD: 'SET_FIELD',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_PASSWORD: 'TOGGLE_PASSWORD',
  TOGGLE_CONFIRM_PASSWORD: 'TOGGLE_CONFIRM_PASSWORD',
  SET_FOCUS: 'SET_FOCUS',
  SET_BUTTON_DISABLED: 'SET_BUTTON_DISABLED',
  SET_OTP: 'SET_OTP',
  SET_OTP_ERROR: 'SET_OTP_ERROR',
  SET_COUNTDOWN: 'SET_COUNTDOWN',
  SET_LOADING: 'SET_LOADING',
  SET_SUCCESS: 'SET_SUCCESS',
}

export const registerReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return {...state, [action.field]: action.value}
    case actionTypes.SET_ERROR:
      return {...state, [action.field]: action.error}
    case actionTypes.TOGGLE_PASSWORD:
      return {...state, isShowPassword: !state.isShowPassword}
    case actionTypes.TOGGLE_CONFIRM_PASSWORD:
      return {...state, isShowConfirmPassword: !state.isShowConfirmPassword}
    case actionTypes.SET_FOCUS:
      return {...state, [action.field]: action.value}
    case actionTypes.SET_BUTTON_DISABLED:
      return {...state, buttonDisabled: action.value}
    case actionTypes.SET_OTP:
      return {...state, otp: action.payload}
    case actionTypes.SET_OTP_ERROR:
      return {...state, otpError: action.payload}
    case actionTypes.SET_COUNTDOWN:
      return {...state, countdown: action.payload}
    case actionTypes.SET_LOADING:
      return {...state, loading: action.payload}
    case actionTypes.SET_SUCCESS:
      return {...state, success: action.payload}
    default:
      return state
  }
}

export const validateForm = state => {
  const isValid =
    isValidEmail(state.email) &&
    isValidPassword(state.password) &&
    state.username.length >= 6 &&
    state.password === state.confirmPassword
  return !isValid
}

export const validateField = (field, value, state) => {
  let error = ''
  switch (field) {
    case 'username':
      if (value === '') error = 'Username is required'
      else if (value.length < 6)
        error = 'Username must be at least 6 characters long'
      break
    case 'email':
      if (value === '') error = 'Email is required'
      else if (!isValidEmail(value)) error = 'Invalid email address'
      break
    case 'password':
      if (value === '') error = 'Password is required'
      else if (!isValidPassword(value))
        error =
          'Password must be at least 8 characters long, include a letter, a number, and a special character'
      break
    case 'confirmPassword':
      if (value === '') error = 'Please confirm your password'
      else if (value !== state.password) error = 'Passwords do not match'
      break
  }
  return error
}
