// Authentication utility functions using local storage

export interface User {
  email: string;
  name?: string;
  tokens: number;
  role?: "user" | "tipster";
}

const AUTH_KEY = "tbase_user_auth";
const DEFAULT_TOKENS = 50; // Default tokens for new users

export const authService = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const authData = localStorage.getItem(AUTH_KEY);
    return !!authData;
  },

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    try {
      const user = JSON.parse(authData);
      // Handle legacy users without tokens
      if (user && typeof user.tokens === "undefined") {
        user.tokens = DEFAULT_TOKENS;
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  },

  // Login user
  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    // Simple validation - in a real app, this would make an API call
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!email.includes("@")) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // In a real app, you would verify credentials with an API
    // For demo purposes, we'll accept any valid email/password combo
    const existingUser = this.getCurrentUser();
    // Hardcoded tipster credentials
    const isTipster = email.toLowerCase() === "tipster@demo.com" && password === "tipster123";
    const user: User = {
      email,
      name: email.split("@")[0],
      tokens: existingUser?.tokens ?? DEFAULT_TOKENS,
      role: isTipster ? "tipster" : "user",
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    // Dispatch custom event to sync auth state across components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }
    return { success: true, user };
  },

  // Signup user
  signup(email: string, password: string, name?: string): { success: boolean; error?: string; user?: User } {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!email.includes("@")) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Check if user already exists (in a real app, this would be an API call)
    const existingUser = this.getCurrentUser();
    if (existingUser && existingUser.email === email) {
      return { success: false, error: "An account with this email already exists" };
    }

    const user: User = {
      email,
      name: name || email.split("@")[0],
      tokens: DEFAULT_TOKENS,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    // Dispatch custom event to sync auth state across components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }
    return { success: true, user };
  },

  // Logout user
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_KEY);
    // Dispatch custom event to sync auth state across components
    window.dispatchEvent(new Event("auth-change"));
  },

  // Deduct tokens for tip generation
  deductTokens(amount: number = 5): { success: boolean; error?: string; remainingTokens?: number } {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    if (user.tokens < amount) {
      return { success: false, error: `Insufficient tokens. You need ${amount} tokens but only have ${user.tokens}` };
    }

    const updatedUser: User = {
      ...user,
      tokens: user.tokens - amount,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }

    return { success: true, remainingTokens: updatedUser.tokens };
  },

  // Add tokens (top up)
  addTokens(amount: number): { success: boolean; error?: string; newBalance?: number } {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const updatedUser: User = {
      ...user,
      tokens: user.tokens + amount,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }

    return { success: true, newBalance: updatedUser.tokens };
  },

  // Get remaining tokens
  getRemainingTokens(): number {
    const user = this.getCurrentUser();
    return user?.tokens ?? 0;
  },
};

