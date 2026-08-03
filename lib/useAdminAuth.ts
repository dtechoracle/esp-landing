"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/backend-client";

/**
 * Client-side admin guard: redirects to /admin/login when no backend JWT is
 * stored, and returns the token once the user is authenticated.
 */
export function useAdminAuth(): string | null {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
  }, [router]);

  return token;
}
