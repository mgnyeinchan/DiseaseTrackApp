import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  timeout: 10000,
});

// 🔐 Request interceptor (auto attach token)
API.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout';
    }

    if (!error.response) {
      error.message = 'Network error';
    }

    console.log('API ERROR:', error?.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default API;