"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useCurrentUser } from "@/features/auth/api/auth.queries";
import type { SessionUser } from "@/features/auth/api/auth.types";

type AuthContextValue = {
  user: SessionUser | null;
  company: SessionUser["company"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useCurrentUser();
  const user = data?.data ?? null;

  const value: AuthContextValue = {
    user,
    company: user?.company ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
