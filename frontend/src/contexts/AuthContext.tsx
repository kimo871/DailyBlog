import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthState, User } from "../types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  createdAt: new Date(),
};

export function AuthProvider({ children }: any) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        token,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (token,user) => {
    // Mock login - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (name && email && password) {
      const newUser: User = {
        ...mockUser,
        id: Date.now().toString(),
        name,
        email,
      };

      const token = "mock_jwt_token_" + Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
      });
    } else {
      throw new Error("Please fill all fields");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
