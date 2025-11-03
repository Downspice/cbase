"use client";

import { useState, useEffect, useCallback } from "react";
import { authService, User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tbase_user_auth") {
        checkAuth();
      }
    };

    // Listen for custom auth-change events (for same-tab sync)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [checkAuth]);

  const login = (email: string, password: string) => {
    const result = authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
    }
    return result;
  };

  const signup = (email: string, password: string, name?: string) => {
    const result = authService.signup(email, password, name);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoading(false);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };
}

