"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeftIcon,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { match } from "ts-pattern";
import { getRecipes } from "@/api/recipes";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function Recipes() {
  const [search, setSearch] = useState("");

  const authState = useAuth();
  const userId =
    authState.status === "authenticated" ? authState.user.uid : null;

  const recipesQueryResult = useQuery({
    queryKey: ["recipes", userId],
    queryFn: () => getRecipes(userId!),
    enabled: !!userId,
  });

  const filtered = recipesQueryResult.data?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
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
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-7 h-7 text-brand" />
          Le Ricette
        </h1>
        {recipesQueryResult.status === "success" && (
          <p className="page-description">
            {filtered?.length ?? 0} ricett{filtered?.length === 1 ? "a" : "e"}{" "}
            trovat{filtered?.length === 1 ? "a" : "e"}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-5">
        {match(recipesQueryResult)
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
            Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
              <RecipeCardSkeleton key={key} />
            )),
          )
          .with({ status: "success" }, () =>
            filtered && filtered.length > 0 ? (
              filtered.map((recipe) => (
                <RecipeCard key={recipe.title} recipe={recipe} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                <UtensilsCrossed className="w-14 h-14 text-brand-light" />
                <p className="text-lg font-medium">Nessuna ricetta trovata</p>
                <p className="page-description">
                  Prova con un altro termine di ricerca
                </p>
              </div>
            ),
          )
          .exhaustive()}
      </div>
    </div>
  );
}
