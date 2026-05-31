import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences } from '../types';
import * as authService from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = authService.authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const newUser = authService.createUser(email, username, password);
      authService.logoutUser();
      const authenticatedUser = authService.authenticateUser(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logoutUser();
    setUser(null);
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (user) {
      authService.updateUserPreferences(user.id, preferences);
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
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