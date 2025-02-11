import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
}

export default axiosInstance;