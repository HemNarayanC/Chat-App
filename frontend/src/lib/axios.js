import axios from 'axios';
const BASE_URL = import.meta.env.MODE === "development"
  ? `${import.meta.env.VITE_SERVER_URL}/api`
  : "/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export default axiosInstance