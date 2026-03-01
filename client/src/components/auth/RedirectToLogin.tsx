"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
