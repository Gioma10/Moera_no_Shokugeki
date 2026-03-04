"use client";

import { useState } from "react";
import { X, ShoppingCart, Trash2, Save } from "lucide-react";
import { useShoppingListBuilder } from "@/context/ShoppingListBuilderContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShoppingListPanel() {
  const [activeTab, setActiveTab] = useState<"ingredients" | "recipes">(
    "ingredients",
  );
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
      
      {/* Tabs */}
      <div className="flex border-b shrink-0">
        <button
          onClick={() => setActiveTab("ingredients")}
          className={cn(
            "flex-1 text-sm py-2 font-medium transition-colors",
            activeTab === "ingredients"
              ? "border-b-2 border-brand text-brand"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Ingredienti
          {!isEmpty && (
            <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
              {mergedIngredients.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("recipes")}
          className={cn(
            "flex-1 text-sm py-2 font-medium transition-colors",
            activeTab === "recipes"
              ? "border-b-2 border-brand text-brand"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Ricette
          {!isEmpty && (
            <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
              {selectedRecipes.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenuto */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground py-8">
            <ShoppingCart className="w-10 h-10 opacity-30" />
            <p className="text-sm text-center">
              Clicca <strong>+</strong> su una ricetta per iniziare
            </p>
          </div>
        ) : activeTab === "ingredients" ? (
          <ul className="divide-y divide-border/50">
            {mergedIngredients.map((item, i) => (
              <li
                key={`${item.ingredient}-${i}`}
                className="flex items-center justify-between py-2 gap-2"
              >
                <span className="text-sm font-medium">{item.ingredient}</span>
                <span className="text-sm text-muted-foreground shrink-0">
                  {item.quantity !== null ? (
                    <>
                      <span className="text-foreground font-semibold">
                        {item.quantity}
                      </span>{" "}
                      {item.unit}
                    </>
                  ) : (
                    <span className="italic text-xs">q.b.</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="divide-y divide-border/50">
            {selectedRecipes.map((recipe) => (
              <li
                key={recipe.title}
                className="flex items-center justify-between py-2 gap-2"
              >
                <span className="text-sm font-medium">{recipe.title}</span>
                <button
                  onClick={() => removeRecipe(recipe.title)}
                  className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1"
          onClick={clearAll}
          disabled={isEmpty}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Svuota
        </Button>
        <Button
          size="sm"
          className="flex-1 gap-1"
          onClick={() => {
            /* lo gestiamo dopo */
          }}
          disabled={isEmpty}
        >
          <Save className="w-3.5 h-3.5" />
          Salva lista
        </Button>
      </div>
    </div>
  );
}
