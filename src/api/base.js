import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthAPI } from './authAPI';

toast.configure();

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
        try
        {
            const token = new AuthAPI().getToken(); // Lấy token
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
        try
        {
            const token = new AuthAPI().getToken(); // Lấy token
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
        try
        {
            const token = new AuthAPI().getToken(); // Lấy token
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
        try
        {
            const token = new AuthAPI().getToken(); // Lấy token
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
            }
        } else
        {
            toast.error( 'An unexpected error occurred.' );
        }

        throw error;
    }
}
