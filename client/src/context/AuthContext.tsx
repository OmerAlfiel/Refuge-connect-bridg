import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { apiBaseUrl } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean; // Make sure this is exposed
  loading: boolean; // Add loading state
  login: (data: { user: User; access_token: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to fetch user profile on token changes or component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If profile fetch fails, token is probably invalid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = (data: { user: User; access_token: string }) => {
    
    // Ensure user has a name property
    if (data.user && !data.user.name) {
      if (data.user.organizationName) {
        data.user.name = data.user.organizationName;
      } else if (data.user.email) {
        data.user.name = data.user.email.split('@')[0];
      } else {
        data.user.name = 'User';
      }
    }
    
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);