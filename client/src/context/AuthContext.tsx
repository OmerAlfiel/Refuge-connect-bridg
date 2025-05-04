
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: "refugee-1",
    name: "Ahmed Hassan",
    role: "refugee",
    language: "ar",
    verified: true,
    avatar: "/avatars/refugee.png",
    email: "ahmed.hassan@example.com",
  },
  {
    id: "volunteer-1",
    name: "Sarah Miller",
    role: "volunteer",
    language: "en",
    verified: true,
    avatar: "/avatars/volunteer.png",
    email: "sarah.miller@example.com",
  },
  {
    id: "ngo-1",
    name: "Global Aid Initiative",
    role: "ngo",
    language: "en",
    verified: true,
    avatar: "/avatars/ngo.png",
    email: "contact@globalaidinitiative.org",
  },
  {
    id: "admin-1",
    name: "Admin User",
    role: "admin",
    language: "en",
    verified: true,
    email: "admin@refugelink.org",
  },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem("refugelink-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("refugelink-user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("refugelink-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("refugelink-user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Helper function to get sample user by role - for demo purposes only
export const getSampleUserByRole = (role: UserRole): User | undefined => {
  return sampleUsers.find(user => user.role === role);
};
