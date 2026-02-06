import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS_DATA } from '../services/MockData'; // Import your initial data

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('dashboard_users');
    return savedUsers ? JSON.parse(savedUsers) : USERS_DATA;
  });

  useEffect(() => {
    localStorage.setItem('dashboard_users', JSON.stringify(users));
  }, [users]);

  const updateUser = (id, updatedFields) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, ...updatedFields } : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);