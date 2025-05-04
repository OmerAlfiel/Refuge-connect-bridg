import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (userData: {user: User, access_token: string}) => void;
  logout: () => void;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem("refugelink-user");
    const savedToken = localStorage.getItem("refugelink-token");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("refugelink-user");
        localStorage.removeItem("refugelink-token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: {user: User, access_token: string}) => {
    setUser(userData.user);
    setToken(userData.access_token);
    localStorage.setItem("refugelink-user", JSON.stringify(userData.user));
    localStorage.setItem("refugelink-token", userData.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("refugelink-user");
    localStorage.removeItem("refugelink-token");
  };

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    role: user?.role || null,
    login,
    logout,
    loading,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}