// src/context/AuthContext.js

import React, { createContext, useState } from "react";
import axios from "axios";
import config from "../config/extra"; // <-- central API base url

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 Register new user
  const registerUser = async (email, password, name, phone) => {
    try {
      const res = await axios.post(`${config.apiBaseUrl}/users/register`, {
        email,
        passwordHash: password, // backend hashes internally
        name,
        phone,
      });
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err.response?.data || err.message;
    }
  };

  // 🔹 Login user
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${config.apiBaseUrl}/users/login`, {
        email,
        password,
      });
      setUser(res.data); // save logged-in user
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data || err.message;
    }
  };

  // 🔹 Get current user
  const getUser = () => user;

  // 🔹 Logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        loginUser,
        getUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
