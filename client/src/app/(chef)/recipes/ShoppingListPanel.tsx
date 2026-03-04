"use client";

import { useState } from "react";
import { X, ShoppingCart, Trash2, Save } from "lucide-react";
import { useShoppingListBuilder } from "@/context/ShoppingListBuilderContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShoppingListPanel() {
  const {
    selectedRecipes,
    mergedIngredients,
    removeRecipe,
    clearAll,
    stopBuilding,
  } = useShoppingListBuilder();

  const isEmpty = selectedRecipes.length === 0;

  return (
    <div
      className={cn(
        // Mobile: bottom sheet fisso
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-background border-t shadow-2xl rounded-t-2xl",
        "max-h-[55vh] flex flex-col",
        // Desktop: sidebar destra
        "md:top-0 md:bottom-0 md:left-auto md:right-0",
        "md:w-80 md:border-t-0 md:border-l md:rounded-none md:max-h-screen",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand" />
          <span className="font-semibold text-sm">Lista in costruzione</span>
          {!isEmpty && (
            <span className="bg-brand text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {mergedIngredients.length}
            </span>
          )}
        </div>
        <button
          onClick={stopBuilding}
          className="p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
