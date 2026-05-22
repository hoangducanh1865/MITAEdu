"use client";

import { useEffect, useState } from "react";
import { getSavedUser, isAuthenticated, removeToken } from "@/lib/auth";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(getSavedUser<User>());
    setLoading(false);
  }, [router]);

  function logout() {
    removeToken();
    router.push("/login");
  }

  return { user, loading, logout };
}
