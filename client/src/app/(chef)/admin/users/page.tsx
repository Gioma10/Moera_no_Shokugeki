"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AssertAuthenticated } from "@/components/auth/AssertAuthenticated";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

// ─── Tipi ────────────────────────────────────────────────────────────────────

type PendingUser = {
  uid: string;
  email: string;
  displayName: string;
  createdAt: { _seconds: number };
};

// ─── API ─────────────────────────────────────────────────────────────────────

async function fetchPendingUsers(token: string): Promise<PendingUser[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/pending`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.json();
}

async function approveUser(uid: string, token: string) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${uid}/approve`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

async function rejectUser(uid: string, token: string) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${uid}/reject`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

function AdminUsersContent() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    auth.currentUser?.getIdToken().then(setToken);
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["pending-users"],
    queryFn: () => fetchPendingUsers(token as string),
    enabled: !!token,
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (uid: string) => approveUser(uid, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["pending-users-count"] });
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: (uid: string) => rejectUser(uid, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["pending-users-count"] });
    },
  });

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <Link
          href="/"
          className="page-card flex-none rounded-full p-2 hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold tracking-tight">
            Revisiona utenti
          </h1>
        </div>
      </div>

      {/* Lista utenti */}
      <div className="w-full max-w-2xl space-y-4">
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && users.length === 0 && (
          <div className="page-card p-12 flex flex-col items-center gap-4 text-center">
            <CheckCircle className="w-14 h-14 text-green-400" />
            <p className="text-lg font-semibold text-gray-900">
              Tutto in ordine!
            </p>
            <p className="page-description">
              Nessun utente in attesa di approvazione.
            </p>
          </div>
        )}

        {users.map((user) => {
          const createdAt = user.createdAt?._seconds
            ? new Date(user.createdAt._seconds * 1000).toLocaleDateString(
                "it-IT",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              )
            : "—";

          return (
            <div
              key={user.uid}
              className="page-card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar iniziali */}
                <div className="bg-brand-light rounded-full w-10 h-10 flex-none flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">
                    {user.displayName?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="page-description truncate">{user.email}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    {createdAt}
                  </p>
                </div>
              </div>

              {/* Azioni */}
              <div className="flex gap-2 flex-none">
                <Button
                  size="sm"
                  onClick={() => reject(user.uid)}
                  disabled={isRejecting || isApproving}
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl"
                >
                  <UserX className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Rifiuta</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => approve(user.uid)}
                  disabled={isApproving || isRejecting}
                  className="btn-brand rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Approva</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AssertAuthenticated
      roles={["admin"]}
      fallback={
        <p className="p-8 text-center text-muted-foreground">Accesso negato.</p>
      }
    >
      <AdminUsersContent />
    </AssertAuthenticated>
  );
}
