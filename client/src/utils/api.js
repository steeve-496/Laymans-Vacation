import axios from 'axios';

const api = axios.create({
    baseURL: 'https://laymans-server.onrender.com/api', // Changed to production server
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

api.getCached = async (url, config = {}) => {
    const cacheKey = url + JSON.stringify(config);
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return Promise.resolve(cached.data);
    }

    const response = await api.get(url, config);
    cache.set(cacheKey, {
        timestamp: Date.now(),
        data: response
    });
    return response;
};

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
