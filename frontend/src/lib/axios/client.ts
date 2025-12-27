import axios, { AxiosError, type AxiosResponse} from 'axios';
import { API_CONFIG } from '../../api/config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout:200000
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {    
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Log error
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      // Clear tokens
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);      
      // Redirect to login
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      // Redirect or show forbidden message
      return Promise.reject(new Error('Access forbidden'));
    }
    
    // Extract error message
    const errorMessage = (error.response?.data as any)?.message || 
                         error.message || 
                         'An error occurred';

    console.log(errorMessage)
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;