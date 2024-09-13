import { useRef, useState } from 'react'
import { images } from '../../constants'
import { isValidEmail, isValidPassword } from '../../utils/Validatations'
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { light } from '@mui/material/styles/createPalette';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function LoginAccount () {
  const width = useRef( window.innerWidth ).current;
  const height = useRef( window.innerHeight ).current;
  const [ isShowPassword, setIsShowPassword ] = useState( false );

  const [ isFocused1, setIsFocused1 ] = useState( false );
  const [ isFocused2, setIsFocused2 ] = useState( false );

  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );

  const [ emailError, setEmailError ] = useState( '' );
  const [ passwordError, setPasswordError ] = useState( '' );

  const handleFocus1 = () => {
    setIsFocused1( true );
  };

  const handleBlur1 = () => {
    setIsFocused1( false );
    if ( !isValidEmail( email ) )
    {
      setEmailError( 'Invalid email address' );
    } else
    {
      setEmailError( '' );
    }
  };

  const handleFocus2 = () => {
    setIsFocused2( true );
  };

  const handleBlur2 = () => {
    setIsFocused2( false );
    if ( !isValidPassword( password ) || password.length < 6 )
    {
      setPasswordError( 'Password must be at least 6 characters long' );
    } else
    {
      setPasswordError( '' );
    }
  };

  const handleChangeEmail = ( e ) => {
    setEmail( e.target.value );
    if ( emailError ) setEmailError( '' ); // Clear error when typing
  };

  const handleChangePassword = ( e ) => {
    setPassword( e.target.value );
    if ( passwordError ) setPasswordError( '' ); // Clear error when typing
  };

  return (
    <ThemeProvider theme={ theme } >
      <div className="bg-[#141518] " style={ { height: height } }>
        <div
          className=" top-0 left-0 right-0 flex h-[8vh] items-center ml-5"
        >
          <img
            src={ images.thu }
            className="h-6 ml-1"
          />
          <Link to="/">
            <span className="ml-1 mr-2 text-sm font-medium text-[#e5ffbc]">
              Back to T&C
            </span>
          </Link>
        </div>
        <div
          className="mt-2.5 h-[7vh] w-full flex justify-center items-center"
        >
          <img
            src={ images.imgOpenBook }
            className="h-[9vh]"
          />
        </div>
        <div
          className="mt-5 h-[58vh] w-full flex items-center justify-center"
        >
          <div
            className="w-[26vw] flex flex-col items-center justify-center bg-[#2c2f34] rounded-lg"
          >
            <span className="text-3xl font-bold text-[#f2f2f2] mt-7">
              LOGIN
            </span>
            <input
              type="text"
              placeholder="Username or Email"
              onFocus={ handleFocus1 }
              onChange={ handleChangeEmail }
              onBlur={ handleBlur1 }
              className={ `mt-7 bg-[#191919] text-white border ${ isFocused1 ? 'border-[#4ce09b]' : 'border-transparent'
                } outline-none p-2.5 w-[19.7vw] rounded-md text-left pl-2` }
            />
            { emailError &&
              <div className=" flex w-[19.7vw] justify-start mt-1">
                <span className="text-red-500 text-sm">{ emailError }</span>
              </div>
            }

            <div className="relative mt-3 w-[19.7vw] ">
              <input
                type={ isShowPassword ? 'text' : 'password' }
                placeholder="Password"
                onFocus={ handleFocus2 }
                onBlur={ handleBlur2 }
                onChange={ handleChangePassword }
                className={ `bg-[#191919] text-white border ${ isFocused2 ? 'border-[#4ce09b]' : 'border-transparent'
                  } outline-none p-2.5 w-full rounded-md text-left pl-2` }
              />
              {/* Toggle password visibility */ }
              <button
                type="button"
                onClick={ () => setIsShowPassword( !isShowPassword ) }
                className="absolute inset-y-0 right-2 flex items-center text-sm text-[#67eab1]"
              >
                { isShowPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />
                }
              </button>
            </div>
            { passwordError &&
              <div className=" flex w-[19.7vw] justify-start mt-1">
                <span className="text-red-500 text-sm">{ passwordError }</span>
              </div>
            }


            <div
              className=" flex w-[19.7vw] justify-end mt-1"
            >
              <span className="text-s font-light text-[#67eab1] mt-1 mb-3">
                Forgot Password?
              </span>
            </div>
            <Button variant="contained" className=" w-[19.7vw] h-[6.5vh] text-white font-bold" color="buttonLogin">
              LOGIN
            </Button>

            <div
              className="mt-2.5 w-[22.8vw] h-[6.5vh] flex justify-end items-center mb-5"
            >
              <div
                className="flex h-[6.5vh] items-center justify-center"
              >
                <span className="font-medium text-lg text-[#f2f2f2] mx-1.5">
                  Need an account?
                </span>
              </div>
              <div
                className="w-[5.8vw] h-[6.5vh] flex justify-center items-center"
              >
                <div
                  className="h-[5.5vh] w-[5vw] border-3 border-[#00e0d8] rounded-md flex justify-center items-center"
                >
                  <Link to="/register">
                    <span className="font-normal text-lg text-[#0fc6c6]">
                      Sign in
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="h-[16vh] flex flex-row items-end w-full justify-center"
        >
          <div
            className="h-[8vh]  flex flex-row items-center gap-5"
          >
            <div
              className="h-[5vh] ml-5 flex justify-center items-center"
            >
              <span className="text-base text-[#dbdbdb] font-normal">
                terms
              </span>
            </div>
            <div
              className="h-[5vh] flex justify-center items-center"
            >
              <span className="text-base text-[#dbdbdb] font-normal">
                privacy
              </span>
            </div>
          </div>
        </div>
      </div >
    </ThemeProvider>
  )
}

const theme = createTheme( {
  palette: {
    buttonLogin: {
      main: '#51bd8e',
      light: '#67eab1',
      dark: '#4ce09b',
      contrastText: '#ffffff',
    },
  },
} );

export default LoginAccount
