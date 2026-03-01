"use client";

import { ChefHat, PlusCircle, UtensilsCrossed, LogOut, User } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const router = useRouter();
  const authState = useAuth();

  async function handleLogout() {
    await auth.signOut();
    router.replace("/login");
  }

  const user = authState.status === "authenticated" ? authState.user : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center px-4">

      {/* Profile icon top right */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white border border-orange-100 rounded-full p-2.5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200">
              <User className="w-5 h-5 text-orange-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-sm font-semibold -mt-1">
              {user?.displayName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer focus:text-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logo / Hero */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 text-center mb-8 sm:mb-14">
        <div className="bg-orange-100 rounded-full p-4 sm:p-6 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 sm:w-14 sm:h-14 text-orange-500" />
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Moera <span className="text-orange-500">No Shokugeki</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-sm text-center">
            Tutte le ricette di Moe e Nowy in un unico posto.
          </p>
        </div>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Link href="/recipes" className="group">
          <div className="flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200">
            <div className="bg-orange-50 rounded-2xl p-3 sm:p-4 group-hover:bg-orange-100 transition-colors">
              <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Ricette</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sfoglia il ricettario
              </p>
            </div>
          </div>
        </Link>

        <Link href="/create-recipe" className="group">
          <div className="flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 rounded-3xl bg-orange-500 shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-200">
            <div className="bg-orange-400 rounded-2xl p-3 sm:p-4 group-hover:bg-orange-500 transition-colors">
              <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-sm sm:text-base">Crea Ricetta</p>
              <p className="text-xs text-orange-100 mt-1">
                Aggiungi una nuova ricetta
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-16">
        Made with ❤️ by Gioma
      </p>
    </div>
  );
}