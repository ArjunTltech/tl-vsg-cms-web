import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const subURL = import.meta.env.VITE_API_SUB_URL;

const axiosInstance = axios.create({
  baseURL: baseURL + subURL,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData) {
      userData = JSON.parse(sessionStorage.getItem('user'));
    }

    if (userData && userData.token) {
      config.headers['Authorization'] = `Bearer ${userData.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        // case 500:
        //   window.location.href = '/error/500';
        //   break;
        case 503:
          window.location.href = '/error/503';
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;