import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (!config.url?.includes('auth/local')) {
    const token = localStorage.getItem('token');
    config.headers['Authorization'] = `${token}`;
  }
  return config;
});

export { axiosInstance };
