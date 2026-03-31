"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteRecipe, type RecipeFromServer } from "@/api/recipes";
import { useShoppingListBuilder } from "@/context/ShoppingListBuilderContext";
import { cn } from "@/lib/utils";

const categoryLabel: Record<string, string> = {
  firstCourse: "Primo",
  secondCourse: "Secondo",
  dessert: "Dolce",
  starter: "Antipasto",
};

const masterColor: Record<string, string> = {
  moe: "bg-rose-400",
  nowy: "bg-orange-400",
};

const STAR_KEYS = ["star-0", "star-1", "star-2", "star-3", "star-4"] as const;

export const RecipeCard = ({ recipe }: { recipe: RecipeFromServer }) => {
  const queryClient = useQueryClient();
  const { isBuilding, addRecipe, removeRecipe, selectedRecipes } =
    useShoppingListBuilder();
  const isAdded = selectedRecipes.some((r) => r.title === recipe.title);

  const { mutate: onDelete } = useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer aspect-3/4">
        {/* Immagine */}
        {recipe.image && (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge in alto */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full px-2.5 py-1 border border-white/20">
            {categoryLabel[recipe.category] ?? recipe.category}
          </span>
          {recipe.master && (
            <span
              className={cn(
                "text-xs font-bold text-white rounded-full px-2.5 py-1",
                masterColor[recipe.master],
              )}
            >
              {recipe.master === "moe" ? "🌸 Moe" : "🔥 Nowy"}
            </span>
          )}
        </div>

        {/* Info in basso */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1">
            {STAR_KEYS.map((key, i) => (
              <Star
                key={key}
                className={cn(
                  "w-3.5 h-3.5",
                  i < recipe.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-white/20 text-white/20",
                )}
              />
            ))}
          </div>

          {isBuilding ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isAdded
                  ? removeRecipe(recipe.title)
                  : addRecipe({
                      title: recipe.title,
                      ingredients: recipe.ingredients,
                    });
              }}
              className={cn(
                "absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 active:scale-95",
                isAdded
                  ? "bg-brand text-white shadow-lg"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-brand",
              )}
            >
              {isAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(recipe.id);
              }}
              className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export const RecipeCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden aspect-3/4 bg-muted animate-pulse" />
);
