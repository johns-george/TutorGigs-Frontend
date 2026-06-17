import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api"; // axios instance with interceptor
import { jwtDecode } from "jwt-decode";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAuth,
} from "../tokenUtils";

export interface User {
  id?: string;
  username: string;
  role: "STUDENT" | "TUTOR";
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshAccessToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decode user from JWT token
  const decodeUserFromToken = (token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.user || decoded;
    } catch {
      return null;
    }
  };

  // Login
  const login = (newAccess: string, newRefresh: string, userData: User) => {
    saveAccessToken(newAccess);
    saveRefreshToken(newRefresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    clearAuth();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Update user info
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) {
      logout();
      return false;
    }

    try {
      const { data } = await api.post("/auth/refresh", { refreshToken: storedRefresh });
      if (data.accessToken) {
        saveAccessToken(data.accessToken);
        setAccessToken(data.accessToken);

        // Optionally decode user again if encoded
        const decodedUser = decodeUserFromToken(data.accessToken);
        if (decodedUser) setUser(decodedUser);

        return true;
      }
      logout();
      return false;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Restore tokens and user from localStorage on mount
  useEffect(() => {
    const storedAccess = getAccessToken();
    const storedRefresh = getRefreshToken();
    const storedUser = localStorage.getItem("user");

    if (storedAccess && storedUser) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        updateUser,
        refreshAccessToken,
        isAuthenticated: !!accessToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
