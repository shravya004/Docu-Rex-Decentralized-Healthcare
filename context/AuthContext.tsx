
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockLogin } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

// FIX: Export AuthContext so it can be used in other files, like the useAuth hook.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('docu-rex-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('docu-rex-user');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const loggedInUser = await mockLogin(email, pass);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('docu-rex-user', JSON.stringify(loggedInUser));
    }
    setLoading(false);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docu-rex-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
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
