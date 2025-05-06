import { useAuth } from '@/context/AuthContext';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const useApi = () => {
  const { token } = useAuth();
  
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  };
  
  return { apiCall };
};