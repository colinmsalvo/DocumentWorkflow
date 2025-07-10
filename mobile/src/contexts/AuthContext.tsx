import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { mobileApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  companyId: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // Verify token with backend
        const userData = await mobileApi.verifyToken();
        setUser(userData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid, clear it
      await SecureStore.deleteItemAsync('auth_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await mobileApi.login(email, password);
      
      if (response.token) {
        await SecureStore.setItemAsync('auth_token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      // No server logout needed for mobile tokens
    } catch (error) {
      // Continue with logout even if server request fails
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}