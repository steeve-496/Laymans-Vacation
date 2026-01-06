import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxied by Vite in dev, nginx/serve in prod
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
