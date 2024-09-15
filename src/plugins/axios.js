import axios from 'axios';
import { stringify } from 'qs';

export default defineNuxtPlugin( () => {
    const runtimeConfig = useRuntimeConfig();
    const baseUrl = runtimeConfig.public.apiBase;

    const client = axios.create( {
        baseURL: baseUrl,
        timeout: 10000, // 10s
        // withCredentials: true,
    } );

    client.interceptors.request.use( ( config ) => {
        const { data } = useAuth();
        const token = data.value?.jwt;
        if ( token )
        {
            // @ts-ignore
            config.headers.Authorization = `Bearer ${ token }`;
        }

        config.paramsSerializer = ( params ) => stringify( params, { encode: false, arrayFormat: 'comma' } );

        return config;
    } );

    client.interceptors.response.use(
        ( response ) => {
            return response;
        },
        ( error ) => {
            const { signOut } = useAuth();

            const code = error.response?.status;
            if ( code === 401 )
            {
                signOut( { callbackUrl: '/auth/login' } );
            }

            throw error;
        }
    );

    return {
        provide: {
            axios: client,
        },
    };
} );
