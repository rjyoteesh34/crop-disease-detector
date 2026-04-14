import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/users/register/', data);
export const loginUser = (data) => API.post('/users/login/', data);
export const getProfile = () => API.get('/users/profile/');

// Disease APIs
export const uploadScan = (formData) => API.post('/disease/upload/', formData);
export const getScanHistory = () => API.get('/disease/history/');
export const getDiseases = () => API.get('/disease/diseases/');