"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

export type Role = "admin" | "approved" | "pending" | "rejected";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role;
};

type AuthContextType = {
  currentUser: AuthUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = userDoc.data();
          const role: Role = data?.role ?? "pending";

          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
          });

          redirectByRole(role, pathname, router);
        } else {
          setCurrentUser(null);
        }

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function redirectByRole(
  role: Role,
  pathname: string,
  router: ReturnType<typeof useRouter>,
) {
  switch (role) {
    case "admin":
    case "approved":
      if (["/login", "/pending", "/rejected"].includes(pathname)) {
        router.replace("/");
      }
      break;
    case "pending":
      if (pathname !== "/pending") router.replace("/pending");
      break;
    case "rejected":
      if (pathname !== "/rejected") router.replace("/rejected");
      break;
  }
}

// ─── useAuth ─────────────────────────────────────────────────────────────────

type AuthState =
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated"; user: null }
  | { status: "loading"; user: null };

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  const { currentUser, loading } = context;

  if (loading) return { status: "loading", user: null };
  if (!currentUser) return { status: "unauthenticated", user: null };
  return { status: "authenticated", user: currentUser };
}
