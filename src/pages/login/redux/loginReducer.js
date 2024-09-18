export const initialState = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  isShowPassword: false,
  isFocused1: false,
  isFocused2: false,
  buttonDisabled: true,
  loading: false,
  success: false,
};

export const actionTypes = {
  SET_EMAIL: 'SET_EMAIL',
  SET_PASSWORD: 'SET_PASSWORD',
  TOGGLE_PASSWORD_VISIBILITY: 'TOGGLE_PASSWORD_VISIBILITY',
  SET_FOCUS1: 'SET_FOCUS1',
  SET_FOCUS2: 'SET_FOCUS2',
  SET_BUTTON_DISABLED: 'SET_BUTTON_DISABLED',
  SET_EMAIL_ERROR: 'SET_EMAIL_ERROR',
  SET_PASSWORD_ERROR: 'SET_PASSWORD_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_SUCCESS: 'SET_SUCCESS',
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_EMAIL:
      return { ...state, email: action.payload };
    case actionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case actionTypes.TOGGLE_PASSWORD_VISIBILITY:
      return { ...state, isShowPassword: !state.isShowPassword };
    case actionTypes.SET_FOCUS1:
      return { ...state, isFocused1: action.payload };
    case actionTypes.SET_FOCUS2:
      return { ...state, isFocused2: action.payload };
    case actionTypes.SET_BUTTON_DISABLED:
      return { ...state, buttonDisabled: action.payload };
    case actionTypes.SET_EMAIL_ERROR:
      return { ...state, emailError: action.payload };
    case actionTypes.SET_PASSWORD_ERROR:
      return { ...state, passwordError: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_SUCCESS:
      return { ...state, success: action.payload };
    default:
      return state;
  }
};