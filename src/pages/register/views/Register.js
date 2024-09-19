import React, { useReducer, useRef } from 'react';
import { Button, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../../../constants';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerReducer, initialState, actionTypes, validateForm, validateField } from '../redux/registerReducer';

function Register () {
    const height = useRef( window.innerHeight ).current;
    const [ state, dispatch ] = useReducer( registerReducer, initialState );
    const navigate = useNavigate();

    const handleChange = ( field ) => ( e ) => {
        const value = e.target.value;
        dispatch( { type: actionTypes.SET_FIELD, field, value } );
        const error = validateField( field, value, state );
        dispatch( { type: actionTypes.SET_ERROR, field: `${ field }Error`, error } );
        dispatch( { type: actionTypes.SET_BUTTON_DISABLED, value: validateForm( { ...state, [ field ]: value } ) } );
    };

    const handleRegister = async () => {
        dispatch( { type: actionTypes.SET_LOADING, payload: true } );
        try
        {
            const response = await axios.post( `http://localhost:8080/api/v1/authen/send-otp?email=${ state.email }&username=${ state.username }` );
            dispatch( { type: actionTypes.SET_SUCCESS, payload: true } );
            toast.success( response.data.message );
            navigate( '/VerifyRegister', {
                state: {
                    username: state.username,
                    email: state.email,
                    password: state.password
                }
            } );
        } catch ( error )
        {
            console.log( error.massage );
        } finally
        {
            dispatch( { type: actionTypes.SET_LOADING, payload: false } );
        }
    };

    return (
        <ThemeProvider theme={ theme }>
            <div className="bg-[#141518] min-h-screen flex flex-col">
                {/* Header */ }
                <div className="flex gap-2 items-center p-5">
                    <img
                        src={ images.imgOpenBook }
                        alt="Logo Open Book"
                        style={ {
                            height: height * 0.09 - 32,
                            marginLeft: 15,
                            marginRight: 15,
                        } }
                    />
                    <Link to="/">
                        <span className="text-sm font-medium text-[#e5ffbc]">Back to ReadHub</span>
                    </Link>
                </div>

                {/* Main content */ }
                <div className="flex-grow flex flex-col items-center justify-center">
                    <img src={ images.imgOpenBook } className="h-[9vh] mb-5" alt="Open Book" />

                    <div className="w-[26vw] bg-[#2c2f34] rounded-lg p-7">
                        <h2 className="text-3xl font-bold text-[#f2f2f2] mb-7 text-center">REGISTER</h2>

                        { [ 'username', 'email', 'password', 'confirmPassword' ].map( ( field, index ) => (
                            <div key={ field } className="relative mb-4">
                                <input
                                    type={ field.includes( 'password' ) || field.includes( 'confirmPassword' ) ? ( state[ `isShow${ field.charAt( 0 ).toUpperCase() + field.slice( 1 ) }` ] ? 'text' : 'password' ) : 'text' }
                                    placeholder={ field.charAt( 0 ).toUpperCase() + field.slice( 1 ) }
                                    value={ state[ field ] }
                                    onChange={ handleChange( field ) }
                                    onFocus={ () => dispatch( { type: actionTypes.SET_FOCUS, field: `isFocused${ index + 1 }`, value: true } ) }
                                    onBlur={ () => dispatch( { type: actionTypes.SET_FOCUS, field: `isFocused${ index + 1 }`, value: false } ) }
                                    className={ `bg-[#191919] text-white border ${ state[ `isFocused${ index + 1 }` ] ? 'border-[#4ce09b]' : 'border-transparent' } outline-none p-2.5 w-full rounded-md` }
                                />
                                { state[ `${ field }Error` ] && <p className="text-red-500 text-sm mt-1">{ state[ `${ field }Error` ] }</p> }
                                { ( field.includes( 'password' ) || field.includes( 'confirmPassword' ) ) && (
                                    <button
                                        type="button"
                                        onClick={ () => dispatch( { type: field === 'confirmPassword' ? actionTypes.TOGGLE_CONFIRM_PASSWORD : actionTypes.TOGGLE_PASSWORD } ) }
                                        className="absolute right-2 top-2.5 text-[#67eab1]"
                                    >
                                        { state[ `isShow${ field.charAt( 0 ).toUpperCase() + field.slice( 1 ) }` ] ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon /> }
                                    </button>
                                ) }
                            </div>
                        ) ) }

                        <Button
                            variant="contained"
                            className="w-full h-[6.5vh] mt-5 text-white font-bold"
                            color="buttonRegister"
                            onClick={ handleRegister }
                            disabled={ state.buttonDisabled || state.loading }
                        >
                            { state.loading ? <CircularProgress size={ 24 } color="inherit" /> : 'REGISTER' }
                        </Button>

                        <div className="mt-4 flex items-center justify-center">
                            <span className="text-lg text-[#f2f2f2] mr-2">Already have an account?</span>
                            <Link to="/loginAccount">
                                <Button className="text-[#0fc6c6]">Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */ }
                <div className="flex justify-center items-center p-5">
                    <span className="text-base text-[#dbdbdb] mx-3">terms</span>
                    <span className="text-base text-[#dbdbdb] mx-3">privacy</span>
                </div>
            </div>
        </ThemeProvider>
    );
}

const theme = createTheme( {
    palette: {
        buttonRegister: {
            main: '#51bd8e',
            light: '#67eab1',
            dark: '#4ce09b',
            contrastText: '#ffffff',
        },
    },
} );

export default Register;