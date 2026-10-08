import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string, phone?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('citytrack_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to sample passenger for immediate smooth browsing experience
    return {
      id: 'user-p1',
      name: 'Priya Rajendran',
      email: 'priya@gmail.com',
      phone: '+91 98401 12345',
      role: 'passenger'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('citytrack_token') || 'demo-token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('citytrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('citytrack_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('citytrack_token', token);
    } else {
      localStorage.removeItem('citytrack_token');
    }
  }, [token]);

  const login = async (email: string, password: string = 'password123'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error communicating with server' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string = 'password123',
    phone: string = '+91 98000 00000',
    role: UserRole = 'passenger'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const quickLogin = (roleToSet: UserRole) => {
    if (roleToSet === 'admin') {
      const adminUser: User = {
        id: 'user-admin',
        name: 'Divya Sundaram (Chief Controller)',
        email: 'admin@citytrack.in',
        phone: '+91 94422 99000',
        role: 'admin'
      };
      setUser(adminUser);
      setToken('admin-token');
    } else if (roleToSet === 'driver') {
      const driverUser: User = {
        id: 'user-driver-1',
        name: 'Murugan Selvam',
        email: 'murugan.driver@citytrack.in',
        phone: '+91 98421 11001',
        role: 'driver'
      };
      setUser(driverUser);
      setToken('driver-token');
    } else {
      const passUser: User = {
        id: 'user-p1',
        name: 'Priya Rajendran',
        email: 'priya@gmail.com',
        phone: '+91 98401 12345',
        role: 'passenger'
      };
      setUser(passUser);
      setToken('passenger-token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'passenger',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
