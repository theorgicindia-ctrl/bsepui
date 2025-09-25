import React, { createContext, useState } from "react";
import axios from "axios";
import config from "../extra";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const registerUser = async (email, password, name, phone) => {
    try {
      const res = await axios.post(`${config.apiBaseUrl}/users/register`, {
        email,
        passwordHash: password, // backend will hash
        name,
        phone,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${config.apiBaseUrl}/users/login`, {
        email,
        password,
      });
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const logout = () => setUser(null);
  const getUser = () => user;

  return (
    <AuthContext.Provider value={{ user, registerUser, loginUser, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
