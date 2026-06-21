import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getItem('session');
    if (session) {
      const users = getItem('users') || [];
      const user = users.find(u => u.id === session.userId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name, role = 'customer') => {
    const users = getItem('users') || [];
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: generateId(),
      email,
      password,
      name,
      role,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setItem('users', users);
    
    const session = { userId: newUser.id, createdAt: new Date().toISOString() };
    setItem('session', session);
    setCurrentUser(newUser);
    
    return newUser;
  };

  const login = async (email, password) => {
    const users = getItem('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const session = { userId: user.id, createdAt: new Date().toISOString() };
    setItem('session', session);
    setCurrentUser(user);
    
    return user;
  };

  const logout = () => {
    removeItem('session');
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const isStoreOwner = currentUser?.role === 'store_owner';
  const isCustomer = currentUser?.role === 'customer';

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isAdmin,
      isStoreOwner,
      isCustomer,
      loading,
      signup,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};