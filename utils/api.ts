import axios, { AxiosInstance, AxiosError } from 'axios';
import { parse, serialize } from 'cookie';
import { getSession } from 'next-auth/react';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        //Set session token
        const session = await getSession()
        if (session) {
            config.headers.Authorization = `Bearer ${session.token}`;
        }

        // Set the necessary CORS headers
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Headers'] =
            'Origin, X-Requested-With, Content-Type, Accept';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';

        return config;
    },

    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401) {
                const cookies = parse(document.cookie);
                const persistRoot = cookies?.['persist%3A_nextjs'];
                const auth = persistRoot ? JSON.parse(JSON.parse(persistRoot).auth) : null;


                if (auth) {
                    auth.token = '';
                    const updatedPersistRoot = JSON.stringify({
                        ...JSON.parse(persistRoot),
                        auth,
                    });

                    document.cookie = serialize('persist%3A_nextjs', updatedPersistRoot, {
                        path: '/login',
                    });
                    if (!window.location.pathname.includes('login')) {
                        window.location.href = '/login';
                    }
                }
                if (!window.location.pathname.includes('login')) {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }

        return Promise.reject(error);
    },
);

export default api;
