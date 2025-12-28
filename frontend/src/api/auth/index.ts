
import apiClient from '../../lib/axios/client';
import { ENDPOINTS } from '../endpoints';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, JSON.stringify(credentials));
  },
  
  register: async (userData: any) => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  },
  
  logout: async () => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('token');
    return response;
  },
  
  getCurrentUser: async () => {
    return apiClient.get(ENDPOINTS.AUTH.ME);
  },

};