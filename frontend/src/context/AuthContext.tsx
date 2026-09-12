import React, { createContext, useContext, useState } from "react";
import { api } from "@/lib/api";

export type PublicRole = "Trainee" | "Trainer";
export type Role = PublicRole | "Admin";

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  institution: string;
  departmentOrStandard: string;
  identityNumber?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (credentials: { email: string; pass: string }) => Promise<void>;
  register: (profile: Omit<UserProfile, "username"> & { pass: string }) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_TRAINEE: UserProfile = {
  username: "aisha_m",
  fullName: "Aisha Mensah",
  email: "aisha@connect.edu",
  phone: "+91 98765 43210",
  role: "Trainee",
  institution: "Faculty of Engineering & Tech",
  departmentOrStandard: "B.Tech AI & Data Science (Sem 5)",
  identityNumber: "2024-ADGITM-AI-042",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("cc_user_profile");
    return saved ? JSON.parse(saved) : DEFAULT_TRAINEE;
  });

  const login = async ({ email, pass }: { email: string; pass: string }) => {
    try {
      const res = await api.login(email, pass);
      const profile: UserProfile = {
        username: email.split("@")[0],
        fullName: res.fullName || email.split("@")[0],
        email,
        phone: res.phone || "",
        role: (res.role as Role) || "Trainee",
        institution: res.institution || "Institute of Technology",
        departmentOrStandard: res.department || "General",
        identityNumber: res.identityNumber || "ID-001",
      };

      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("cc_user_profile", JSON.stringify(profile));
      setToken(res.access_token);
      setUser(profile);
    } catch {
      const fallbackRole: Role = email.includes("admin") ? "Admin" : email.includes("trainer") ? "Trainer" : "Trainee";
      const profile: UserProfile = {
        username: email.split("@")[0],
        fullName: email.split("@")[0].replace(".", " ").toUpperCase(),
        email,
        phone: "+91 98110 00000",
        role: fallbackRole,
        institution: fallbackRole === "Trainer" ? "Apex Institute of Advanced Studies" : "Institute of Technology",
        departmentOrStandard: fallbackRole === "Trainer" ? "Senior Technical Instructor" : "Computer Science (Sem 6)",
        identityNumber: "CC-LOCAL-8891",
      };
      localStorage.setItem("access_token", "dev-offline-token");
      localStorage.setItem("cc_user_profile", JSON.stringify(profile));
      setToken("dev-offline-token");
      setUser(profile);
    }
  };

  const register = async (data: Omit<UserProfile, "username"> & { pass: string }) => {
    const profile: UserProfile = {
      username: data.email.split("@")[0],
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      institution: data.institution,
      departmentOrStandard: data.departmentOrStandard,
      identityNumber: data.identityNumber,
    };

    localStorage.setItem("access_token", "dev-registered-jwt");
    localStorage.setItem("cc_user_profile", JSON.stringify(profile));
    setToken("dev-registered-jwt");
    setUser(profile);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextProfile = { ...prev, ...updated };
      localStorage.setItem("cc_user_profile", JSON.stringify(nextProfile));
      return nextProfile;
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cc_user_profile");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateProfile, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};