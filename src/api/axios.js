import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

if (!API_URL) {
    console.error('CRITICAL: VITE_API_URL is not defined. API requests will fail on cross-origin deployments.');
}

const api = axios.create({
    baseURL: API_URL,
    timeout: 6000, // Fail fast — don't hang indefinitely on bad connections
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { API_URL };
