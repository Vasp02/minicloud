
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const navigate = useNavigate();

  const login = (token, username) => {
    if (token){
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
        setUsername(username);
    } 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
