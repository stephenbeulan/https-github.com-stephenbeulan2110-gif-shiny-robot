import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }
    setLoading(false);

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const signup = async (email, password, passwordConfirm, name) => {
    const data = {
      email,
      password,
      passwordConfirm,
      name,
    };
    const record = await pb.collection('users').create(data);
    return record;
  };

  const value = {
    user,
    login,
    logout,
    signup,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};