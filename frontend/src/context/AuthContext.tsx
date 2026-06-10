import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const UserRole = {
  ROOT_ADMIN: 'root_admin',
  CONTROLLER: 'controller',
  ASSOCIATE: 'associate',
  EMPLOYEE: 'employee', // Legacy support
  MANAGER: 'manager',   // Legacy support
  ADMIN: 'admin',       // Legacy support
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRoleType;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // CRITICAL: Validate that userData is a valid object and not a legacy string
          if (userData && typeof userData === 'object' && userData.role) {
            setUser(userData);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            console.warn("Invalid user data detected in session. Purging...");
            logout();
          }
        } catch (e) {
          console.error("Auth init failed", e);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData: any) => {
    // Standardize user object if necessary (e.g. mapping _id to id)
    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(normalizedUser);
  };

  const logout = () => {
    // Aggressively clear all session data
    localStorage.clear();
    sessionStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
