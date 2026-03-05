"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserAccount {
  username: string;
  email: string;
  password: string;
  isDefault: boolean;
  skinType?: string;
  concerns?: string[];
  plan?: string;
  avatar?: string; // first letter fallback
  joinedAt: number;
}

interface AuthContextType {
  user: UserAccount | null;
  login: (
    username: string,
    password: string,
  ) => { ok: boolean; error?: string };
  signup: (
    username: string,
    email: string,
    password: string,
  ) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<UserAccount>) => void;
}

// ── Default account ───────────────────────────────────────────────────────────

const DEFAULT_ACCOUNT: UserAccount = {
  username: "Tulip",
  email: "tulip@newface.app",
  password: "NewFace123",
  isDefault: true,
  skinType: "Combination",
  concerns: ["Acne", "Dry patches"],
  plan: "Free plan",
  avatar: "T",
  joinedAt: 0,
};

// ── Storage helpers ───────────────────────────────────────────────────────────

const USERS_KEY = "nf_users";
const SESSION_KEY = "nf_session";

function getStoredUsers(): UserAccount[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function saveSession(username: string) {
  localStorage.setItem(SESSION_KEY, username);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function findUser(username: string): UserAccount | null {
  if (username.toLowerCase() === DEFAULT_ACCOUNT.username.toLowerCase()) {
    return DEFAULT_ACCOUNT;
  }
  return (
    getStoredUsers().find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    ) ?? null
  );
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);

  // Restore session on mount
  useEffect(() => {
    const saved = getSession();
    if (saved) {
      const found = findUser(saved);
      if (found) setUser(found);
    }
  }, []);

  function login(username: string, password: string) {
    const found = findUser(username);
    if (!found)
      return { ok: false, error: "Account not found. Please sign up first." };
    if (found.password !== password)
      return { ok: false, error: "Incorrect password. Try again." };
    saveSession(found.username);
    setUser(found);
    return { ok: true };
  }

  function signup(username: string, email: string, password: string) {
    if (!username.trim()) return { ok: false, error: "Username is required." };
    if (!email.includes("@"))
      return { ok: false, error: "Please enter a valid email address." };
    if (password.length < 6)
      return { ok: false, error: "Password must be at least 6 characters." };

    // Block duplicate usernames
    if (findUser(username)) {
      return {
        ok: false,
        error: "That username is already taken. Try another.",
      };
    }

    const newUser: UserAccount = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      isDefault: false,
      skinType: undefined,
      concerns: [],
      plan: "Free plan",
      avatar: username.trim()[0].toUpperCase(),
      joinedAt: Date.now(),
    };

    const users = getStoredUsers();
    users.push(newUser);
    saveUsers(users);
    saveSession(newUser.username);
    setUser(newUser);
    return { ok: true };
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  function updateProfile(updates: Partial<UserAccount>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (!updated.isDefault) {
      const users = getStoredUsers().map((u) =>
        u.username === updated.username ? updated : u,
      );
      saveUsers(users);
    }
    saveSession(updated.username);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
