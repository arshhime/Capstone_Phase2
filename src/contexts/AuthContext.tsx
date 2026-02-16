import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  solvedProblems: number;
  accuracy: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = 'http://localhost:5001';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Logic for Social Login Redirects (Google/GitHub)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setUser(parsedUser);
        
        // Clean the URL so the token isn't visible/re-processed
        window.history.replaceState({}, document.title, "/dashboard");
      } catch (error) {
        console.error('Failed to parse social login data:', error);
      }
    } else {
      // 2. Logic for Standard Page Refresh (Existing Session)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Ensure these keys match the destructuring in your index.js
      body: JSON.stringify({ name, email, password }), 
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to sign up');

    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

const logout = () => {
    setUser(null);
    localStorage.clear(); // Clears user, token, and any other cached data
    window.location.href = '/login'; // Force redirect to the login screen
};

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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