"use client";

import { UtensilsCrossed } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();

  async function handleLogout() {
    await auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center mb-10">
        <div className="bg-orange-100 rounded-full p-5 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Moera <span className="text-orange-500">No Shokugeki</span>
        </h1>
      </div>

      <div className="w-full max-w-sm bg-white border border-orange-100 rounded-3xl shadow-sm p-8 space-y-4 text-center">
        <p className="text-2xl">⏳</p>
        <h2 className="text-lg font-bold text-gray-900">Account in attesa</h2>
        <p className="text-sm text-muted-foreground">
          La tua registrazione è avvenuta con successo! <br />
          Attendi che l'admin approvi il tuo account.
        </p>
        <button
          onClick={handleLogout}
          className="text-xs text-orange-500 hover:underline mt-2"
        >
          Logout
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-10">Made with ❤️ by Gioma</p>
    </div>
  );
}