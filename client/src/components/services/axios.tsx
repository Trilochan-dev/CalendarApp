import axios from 'axios';

// Create an Axios interceptor to set the Authorization token in the header
axios.interceptors.request.use(
    (config) => {
        // Retrieve the token from local storage or any other storage mechanism
        const token = localStorage.getItem('login_token');

        // If the token exists, set it in the request header
        if (token) {
            config.headers.Authorization = JSON.parse(token);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;