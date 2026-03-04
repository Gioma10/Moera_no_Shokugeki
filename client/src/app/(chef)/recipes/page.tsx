"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeftIcon,
  ChevronDown,
  Search,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { match } from "ts-pattern";
import { getRecipes } from "@/api/recipes";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useShoppingListBuilder } from "@/context/ShoppingListBuilderContext";
import { cn } from "@/lib/utils";
import { ShoppingListPanel } from "./ShoppingListPanel";

export default function Recipes() {
  const [search, setSearch] = useState("");
  const { isBuilding, startBuilding } = useShoppingListBuilder();

  const authState = useAuth();
  const userId =
    authState.status === "authenticated" ? authState.user.uid : null;

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recipes", userId],
      queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
        getRecipes(userId!, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: !!userId,
    });

  const allRecipes = data?.pages.flatMap((p) => p.items) ?? [];
  const filtered = allRecipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  const recipesMatch = { status, data: filtered };

  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-4 py-8 space-y-8 transition-all duration-300",
        isBuilding && "md:mr-80",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="page-card flex-none p-2 rounded-full hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca una ricetta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
        <Button
          onClick={startBuilding}
          size="sm"
          className="flex-none gap-2 rounded-full"
          disabled={isBuilding}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Crea lista</span>
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-7 h-7 text-brand" />
          Le Ricette
        </h1>
        {status === "success" && (
          <p className="page-description">
            {filtered.length} ricett{filtered.length === 1 ? "a" : "e"} trovat
            {filtered.length === 1 ? "a" : "e"}
          </p>
        )}
      </div>

      {/* Grid */}
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full gap-4",
          isBuilding && "pb-[55vh] md:pb-0",
        )}
      >
        {match(recipesMatch)
          .with({ status: "error" }, () => (
            <div className="col-span-full">
              <Alert variant="destructive" className="max-w-xl">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Si è verificato un errore nel caricamento delle ricette.
                </AlertDescription>
              </Alert>
            </div>
          ))
          .with({ status: "pending" }, () =>
            Array.from({ length: 8 }, (_, i) => <RecipeCardSkeleton key={i} />),
          )
          .with({ status: "success" }, ({ data }) =>
            data.length > 0 ? (
              data.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                <UtensilsCrossed className="w-14 h-14 opacity-20" />
                <p className="text-lg font-medium">Nessuna ricetta trovata</p>
                <p className="page-description">
                  Prova con un altro termine di ricerca
                </p>
              </div>
            ),
          )
          .exhaustive()}
      </div>

      {/* Paginazione */}
      {hasNextPage && (
        <div className="flex justify-center pb-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="cursor-pointer flex items-center gap-3 px-8 py-3 rounded-full border-2 border-brand/30 hover:border-brand bg-white hover:bg-brand/5 transition-all duration-300 text-brand font-semibold shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <ChevronDown
              className={cn("w-4 h-4", isFetchingNextPage && "animate-bounce")}
            />
            {isFetchingNextPage ? "Caricamento..." : "Carica altre ricette"}
          </button>
        </div>
      )}

      {isBuilding && <ShoppingListPanel />}
    </div>
  );
}
