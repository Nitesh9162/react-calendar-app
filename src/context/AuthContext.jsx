import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('calendarUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('calendarUsers') || '[]');
    
    const emailExists = users.find(u => u.email === userData.email);
    if (emailExists) {
      return { success: false, message: 'Email already registered' };
    }
    
    const usernameExists = users.find(u => u.username === userData.username);
    if (usernameExists) {
      return { success: false, message: 'Username already taken' };
    }

    const newUser = { id: Date.now(), ...userData };
    users.push(newUser);
    localStorage.setItem('calendarUsers', JSON.stringify(users));
    
    const { password: _, securityAnswer: __, ...userWithoutSensitive } = newUser;
    setUser(userWithoutSensitive);
    localStorage.setItem('calendarUser', JSON.stringify(userWithoutSensitive));
    return { success: true };
  };

  const login = (emailOrUsername, password) => {
    const users = JSON.parse(localStorage.getItem('calendarUsers') || '[]');
    const found = users.find(
      u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid credentials' };
    }
    const { password: _, securityAnswer: __, ...userWithoutSensitive } = found;
    setUser(userWithoutSensitive);
    localStorage.setItem('calendarUser', JSON.stringify(userWithoutSensitive));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('calendarUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
