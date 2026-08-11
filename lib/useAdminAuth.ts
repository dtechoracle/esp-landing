"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/backend-client";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Client-side admin guard: redirects to /admin/login when no backend JWT is
 * stored or when the token has expired.
 */
export function useAdminAuth(): string | null {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace("/admin/login");
    } else if (isTokenExpired(t)) {
      clearToken();
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const t = getToken();
      if (!t || isTokenExpired(t)) {
        clearToken();
        router.replace("/admin/login");
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [token, router]);

  return token;
}
