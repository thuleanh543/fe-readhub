import React from 'react'
import { useRef, useState } from 'react';
import { images } from '../../constants';
import { isValidEmail, isValidPassword } from '../../utils/Validatations';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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
function VerifyRegister () {
    const height = useRef( window.innerHeight ).current;
    const [ isShowPassword, setIsShowPassword ] = useState( false );
    const [ isFocused1, setIsFocused1 ] = useState( false );
    const [ isFocused2, setIsFocused2 ] = useState( false );
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ emailError, setEmailError ] = useState( '' );
    const [ passwordError, setPasswordError ] = useState( '' );
    const [ buttonDisabled, setButtonDisabled ] = useState( true );
    const navigate = useNavigate();

    const validateForm = ( e, p ) => {
        if ( isValidEmail( e ) && isValidPassword( p ) )
        {
            setButtonDisabled( false );
        } else
        {
            setButtonDisabled( true );
        }
    };

    const handleFocus1 = () => {
        setIsFocused1( true );
    };

    const handleBlur1 = () => {
        setIsFocused1( false );
    };

    const handleFocus2 = () => {
        setIsFocused2( true );
    };

    const handleBlur2 = () => {
        setIsFocused2( false );
    };

    const handleChangeEmail = ( e ) => {
        setEmail( e.target.value )
        if ( e.target.value === '' ) setEmailError( 'Email is required' )
        else if ( !isValidEmail( e.target.value ) ) setEmailError( 'Invalid email address' )
        else setEmailError( '' );
        validateForm( e.target.value, password );

    };

    const handleChangePassword = ( e ) => {
        setPassword( e.target.value );
        if ( e.target.value === '' ) setPasswordError( 'Password is required' )
        else if ( !isValidPassword( e.target.value ) ) setPasswordError( 'Password must be at least 8 characters long, include a letter, a number, and a special character' )
        else setPasswordError( '' );
        validateForm( email, e.target.value );
    };

    const handleLogin = async () => {
        if ( email === '' ) setEmailError( 'Email is required' );
        else if ( password === '' ) setPasswordError( 'Password is required' );
        else if ( !isValidEmail( email ) ) setEmailError( 'Invalid email address' );
        else if ( !isValidPassword( password ) ) setPasswordError( 'Password must be at least 8 characters long, include a letter, a number, and a special character' );
        else
        {
            await axios.post( `http://localhost:8080/api/v1/authen/login?email=${ email }&password=${ password }` ).then( ( response ) => {
                localStorage.setItem( 'token', response.data.token );
                localStorage.setItem( 'tokenExpiration', Date.now() + 86400000 );
                toast.success( response.data.message );
                navigate( '/' );
            } )
                .catch( () => {
                    toast.error( 'Email hoặc mật khẩu không đúng!' );
                } );
        }
    };

    return (
        <ThemeProvider theme={ theme }>
            <div className="bg-[#141518]" style={ { height } }>
                <div className="top-0 left-0 right-0 flex h-[8vh] items-center ml-5">
                    <img src={ images.thu } className="h-6 ml-1" alt="Logo" />
                    <Link to="/">
                        <span className="ml-1 mr-2 text-sm font-medium text-[#e5ffbc]">Back to T&C</span>
                    </Link>
                </div>
                <div className="mt-2.5 h-[7vh] w-full flex justify-center items-center">
                    <img src={ images.imgOpenBook } className="h-[9vh]" alt="Open Book" />
                </div>
                <div className="mt-5 h-[58vh] w-full flex items-center justify-center">
                    <div className="w-[26vw] flex flex-col items-center justify-center bg-[#2c2f34] rounded-lg">
                        <span className="text-3xl font-bold text-[#f2f2f2] mt-7">LOGIN</span>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            onFocus={ handleFocus1 }
                            onChange={ handleChangeEmail }
                            onBlur={ handleBlur1 }
                            value={ email }
                            className={ `mt-7 bg-[#191919] text-white border ${ isFocused1 ? 'border-[#4ce09b]' : 'border-transparent'
                                } outline-none p-2.5 w-[19.7vw] rounded-md text-left pl-2` }
                        />
                        { emailError && (
                            <div className="flex w-[19.7vw] justify-start mt-1">
                                <span className="text-red-500 text-sm">{ emailError }</span>
                            </div>
                        ) }

                        <div className="relative mt-3 w-[19.7vw]">
                            <input
                                type={ isShowPassword ? 'text' : 'password' }
                                placeholder="Password"
                                onFocus={ handleFocus2 }
                                onBlur={ handleBlur2 }
                                onChange={ handleChangePassword }
                                value={ password }
                                className={ `bg-[#191919] text-white border ${ isFocused2 ? 'border-[#4ce09b]' : 'border-transparent'
                                    } outline-none p-2.5 w-full rounded-md text-left pl-2` }
                            />
                            <button
                                type="button"
                                onClick={ () => setIsShowPassword( !isShowPassword ) }
                                className="absolute inset-y-0 right-2 flex items-center text-sm text-[#67eab1]"
                            >
                                { isShowPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon /> }
                            </button>
                        </div>
                        { passwordError && (
                            <div className="flex w-[19.7vw] justify-start mt-1">
                                <span className="text-red-500 text-sm">{ passwordError }</span>
                            </div>
                        ) }

                        <div className="flex w-[19.7vw] justify-end mt-1">
                            <span className="text-s font-light text-[#67eab1] mt-1 mb-3">Forgot Password?</span>
                        </div>
                        <Button
                            variant="contained"
                            className="w-[19.7vw] h-[6.5vh] text-white font-bold"
                            color="buttonLogin"
                            onClick={ handleLogin }
                            disabled={ buttonDisabled }
                        >
                            LOGIN
                        </Button>

                        <div className="mt-2.5 w-full h-[6.5vh] flex justify-end mr-20 mb-5">
                            <div className="flex items-center justify-center">
                                <span className="font-medium text-lg text-[#f2f2f2] mx-1.5">Need an account?</span>
                            </div>
                            <div className=" h-[6.5vh] flex justify-center items-center">
                                <div className="h-[5.5vh] w-[5vw] border-3 border-[#00e0d8] rounded-md flex justify-center items-center">
                                    <Link to="/register">
                                        <Button >
                                            <span className="font-normal text-lg text-[#0fc6c6] normal-case ">Sign in</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[16vh] flex flex-row items-end w-full justify-center">
                    <div className="h-[8vh] flex flex-row items-center gap-5">
                        <div className="h-[5vh] ml-5 flex justify-center items-center">
                            <span className="text-base text-[#dbdbdb] font-normal">terms</span>
                        </div>
                        <div className="h-[5vh] flex justify-center items-center">
                            <span className="text-base text-[#dbdbdb] font-normal">privacy</span>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
export default VerifyRegister