"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  church: string;
  pastor: string;
  whatsapp: string;
  password?: string;
};

type AuthContextType = {
  user: User | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, logout: () => {} });

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cookieUser = getCookie("user");
    if (cookieUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(cookieUser)));
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }
  }, []);

  const logout = () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
