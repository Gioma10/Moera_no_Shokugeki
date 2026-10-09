"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calculator, Loader2, RefreshCw } from "lucide-react";
import { estimateRecipeCalories } from "@/api/recipes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Recipe } from "@/types/recipes";

export function CaloriesCard({
  id,
  kcalPer100g,
}: {
  id: string;
  kcalPer100g?: number;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => estimateRecipeCalories(id),
    onSuccess: ({ kcalPer100g }) =>
      queryClient.setQueryData<Recipe>(
        ["recipe", id],
        (recipe) => recipe && { ...recipe, kcalPer100g },
      ),
  });
  const hasValue = kcalPer100g !== undefined;

  return (
    <Card className="shadow-sm border-0 bg-emerald-50">
      <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            Calorie
          </h2>
          {hasValue ? (
            <p className="text-sm text-emerald-900">
              <span className="text-2xl font-bold tabular-nums">
                {kcalPer100g}
              </span>{" "}
              kcal ogni 100 g
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Calcola una stima delle kcal ogni 100 g a partire dagli
              ingredienti.
            </p>
          )}
          {hasValue && (
            <p className="text-xs text-muted-foreground">
              Stima di Gemini sugli ingredienti crudi.
            </p>
          )}
          {error && !isPending && (
            <p role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant={hasValue ? "outline" : "default"}
          className={`rounded-full gap-2 shrink-0 ${hasValue ? "" : "btn-brand"}`}
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending ? (
            <Loader2
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : hasValue ? (
            <RefreshCw className="size-4" aria-hidden="true" />
          ) : (
            <Calculator className="size-4" aria-hidden="true" />
          )}
          {isPending ? "Calcolo…" : hasValue ? "Ricalcola" : "Calcola calorie"}
        </Button>
      </CardContent>
    </Card>
  );
}
