import axios from "axios";

const axiosInstance = axios.create({
    baseUrl: 'http://localhost:8801',
    withCredentials: true
});

export default axiosInstance;