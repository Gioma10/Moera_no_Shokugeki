"use client";

import type { ReactNode } from "react";
import { match } from "ts-pattern";
import { useAuth, type AuthUser, type Role } from "@/context/AuthContext";

export const AssertAuthenticated = ({
  children,
  roles,
  fallback = null,
  loader = null,
}: {
  fallback?: ReactNode;
  loader?: ReactNode;
  roles?: Role[];
  children: ReactNode | ((user: AuthUser) => ReactNode);
}) => {
  const auth = useAuth();

  return match(auth)
    .with({ status: "loading" }, () => loader)
    .with({ status: "unauthenticated" }, () => fallback)
    .with({ status: "authenticated" }, ({ user }) => {
      const isAllowed = roles ? roles.includes(user.role) : true;

      if (!isAllowed) return fallback;

      return typeof children === "function" ? children(user) : children;
    })
    .exhaustive();
};