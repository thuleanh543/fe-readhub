import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class BaseApi {
    constructor () {
        this.axios = axios.create( {
            baseURL: process.env.REACT_APP_API_BASE_URL || '',
            headers: {
                'Content-Type': 'application/json',
            },
        } );
    }

    async get ( endpoint, config = {} ) {
        if ( Date.now() >= localStorage.getItem( 'tokenExpiration' ) )
        {
            this.toastError( 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' );
            return;
        }

        try
        {
            const token = localStorage.getItem( 'token' );
            const response = await this.axios.get( endpoint, {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${ token }`,
                },
            } );
            return response.data;
        } catch ( error )
        {
            this.toastError( error );
        }
    }

    async post ( endpoint, data = {}, config = {} ) {
        if ( Date.now() >= localStorage.getItem( 'tokenExpiration' ) && localStorage.getItem( 'tokenExpiration' ) !== null )
        {
            this.toastError( 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' );
            return;
        }

        try
        {
            const token = localStorage.getItem( 'token' );
            const response = await this.axios.post( endpoint, data, {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${ token }`,
                },
            } );
            return response.data;
        } catch ( error )
        {
            this.toastError( error );
        }
    }

    async put ( endpoint, data = {} ) {
        if ( Date.now() >= localStorage.getItem( 'tokenExpiration' ) )
        {
            this.toastError( 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' );
            return;
        }

        try
        {
            const token = localStorage.getItem( 'token' );
            const response = await this.axios.put( endpoint, data, {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            } );
            return response.data;
        } catch ( error )
        {
            this.toastError( error );
        }
    }

    async delete ( endpoint, data = {} ) {
        if ( Date.now() >= localStorage.getItem( 'tokenExpiration' ) )
        {
            this.toastError( 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' );
            return;
        }

        try
        {
            const token = localStorage.getItem( 'token' );
            const response = await this.axios.delete( endpoint, {
                data,
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            } );
            return response.data;
        } catch ( error )
        {
            this.toastError( error );
        }
    }

    toastError ( error ) {
        if ( axios.isAxiosError( error ) )
        {
            const { response } = error;

            if ( response && response.data && response.data.error )
            {
                toast.error( response.data.error.message );

                if ( response.data.error.fields )
                {
                    throw response.data.error.fields;
                }
            }

            if ( response && response.status === 403 )
            {
                // Xử lý khi gặp lỗi 403, ví dụ như chuyển hướng người dùng
                toast.error( 'Bạn không có quyền truy cập.' );
            }
        } else
        {
            toast.error( 'An unexpected error occurred.' );
        }

        throw error;
    }
}
