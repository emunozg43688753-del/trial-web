"use client";

import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Account, SignupProfile } from "@/lib/account/types";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import { captureAttribution, getAttribution, track } from "@/lib/growth/client";

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  account: Account | null;
  accountError: string | null;
  /** True right after the account was created (first login) — triggers the welcome promo. */
  justCreated: boolean;
  dismissWelcome: () => void;
  setPendingProfile: (profile: SignupProfile) => void;
  authedFetch: (path: string, init?: RequestInit) => Promise<Response>;
  setAccount: (account: Account) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(isFirebaseClientConfigured);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState(false);
  const pendingProfile = useRef<SignupProfile>({});

  useEffect(() => {
    captureAttribution();
    const auth = getFirebaseAuth();
    if (!auth) return;

    return onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (!next) {
        setAccount(null);
        setLoading(false);
        return;
      }
      try {
        const token = await next.getIdToken();
        const res = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ profile: pendingProfile.current, attribution: getAttribution() }),
        });
        const data = (await res.json()) as { account?: Account; created?: boolean; error?: string };
        if (!res.ok || !data.account) throw new Error(data.error ?? "No pudimos cargar tu cuenta");
        setAccount(data.account);
        setAccountError(null);
        if (data.created) {
          setJustCreated(true);
          track("sign_up", { method: next.providerData[0]?.providerId ?? "password" });
        } else {
          track("login");
        }
      } catch (error) {
        setAccountError(error instanceof Error ? error.message : "Error de cuenta");
      } finally {
        pendingProfile.current = {};
        setLoading(false);
      }
    });
  }, []);

  const authedFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const token = await user?.getIdToken();
      return fetch(path, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isFirebaseClientConfigured,
      loading,
      user,
      account,
      accountError,
      justCreated,
      dismissWelcome: () => setJustCreated(false),
      setPendingProfile: (p) => {
        pendingProfile.current = p;
      },
      authedFetch,
      setAccount,
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (auth) await fbSignOut(auth);
      },
    }),
    [loading, user, account, accountError, justCreated, authedFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
