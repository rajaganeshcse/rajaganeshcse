import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAdmin(true);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await axios.post(
      `${API_URL}/auth/login/`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    localStorage.setItem('adminToken', res.data.access);
    setIsAdmin(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
