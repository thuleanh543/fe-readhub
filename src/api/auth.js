import { BaseApi } from './base';
import { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '../firebaseConfig';
import { toast } from 'react-toastify';

export class AuthAPI extends BaseApi {

    async register ( email, password ) {
        try
        {
            await createUserWithEmailAndPassword( auth, email, password );
            toast.success( 'Đăng ký thành công!' );
        } catch ( error )
        {
            toast.error( 'Đăng ký thất bại. ' + error.message );
            throw error;
        }
    }

    async login ( email, password ) {
        try
        {
            const userCredential = await signInWithEmailAndPassword( auth, email, password );
            const user = userCredential.user;

            // Lấy token từ user
            const token = await user.getIdToken();

            // Lưu token vào local storage
            localStorage.setItem( 'authToken', token );

            toast.success( 'Đăng nhập thành công!' );
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

            // Xóa token từ local storage
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
