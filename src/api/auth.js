import { BaseApi } from './base';
import { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '../firebaseConfig';
import { toast } from 'react-toastify';

export class AuthAPI extends BaseApi {

    // Register method to match API
    async register ( email, username, password ) {
        try
        {
            const response = await this.post( '/register', { email, username, password } );

            if ( response.success )
            {
                toast.success( 'Đăng ký thành công!' );
            } else if ( response.message === 'Email đã tồn tại' )
            { // Replace with your actual validation message
                toast.error( 'Đăng ký thất bại. Email đã tồn tại.' );
            } else
            {
                toast.error( 'Đăng ký thất bại. ' + response.message );
            }
        } catch ( error )
        {
            toast.error( 'Đăng ký thất bại. ' + error.message );
            throw error;
        }
    }

    // Login method to match API
    async login ( email, password ) {
        try
        {
            // Call your backend API for login
            const response = await this.post( '/login', { email, password } );

            if ( response.success )
            {
                // Save token to local storage
                localStorage.setItem( 'authToken', response.token );
                toast.success( 'Đăng nhập thành công!' );
            } else
            {
                toast.error( 'Đăng nhập thất bại. ' + response.message );
            }
        } catch ( error )
        {
            toast.error( 'Đăng nhập thất bại. ' + error.message );
            throw error;
        }
    }

    async logout () {
        try
        {
            await signOut( auth );

            // Remove token from local storage
            localStorage.removeItem( 'authToken' );
            toast.success( 'Đăng xuất thành công!' );
        } catch ( error )
        {
            toast.error( 'Đăng xuất thất bại. ' + error.message );
            throw error;
        }
    }

    getToken () {
        return localStorage.getItem( 'authToken' );
    }
}
