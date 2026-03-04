"use client";

import { createContext, useContext, useMemo, useState } from "react";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type IngredientData = {
  ingredient: string;
  quantity: string;
  unit: "g" | "l" | "ml" | "pcs" | "q.b.";
};

export type RecipeForList = {
  title: string;
  ingredients: IngredientData[];
};

export type MergedIngredient = {
  ingredient: string;
  quantity: number | null; // null = q.b.
  unit: "g" | "l" | "ml" | "pcs" | "q.b.";
};

export type ShoppingList = {
  name: string;
  dateFrom: Date;
  dateTo: Date;
  items: MergedIngredient[];
};

type ShoppingListBuilderContextType = {
  isBuilding: boolean;
  startBuilding: () => void;
  stopBuilding: () => void;
  selectedRecipes: RecipeForList[];
  addRecipe: (recipe: RecipeForList) => void;
  removeRecipe: (title: string) => void;
  mergedIngredients: MergedIngredient[];
  clearAll: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ShoppingListBuilderContext = createContext<ShoppingListBuilderContextType | null>(null);

// ─── Merge ingredienti ────────────────────────────────────────────────────────

function mergeIngredients(recipes: RecipeForList[]): MergedIngredient[] {
    const result: MergedIngredient[] = [];
  
    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        const isQB = ing.unit === "q.b." || ing.quantity === "";
  
        if (isQB) {
          const exists = result.find(
            (i) => i.ingredient.toLowerCase() === ing.ingredient.toLowerCase()
          );
          if (!exists) {
            result.push({ ingredient: ing.ingredient, quantity: null, unit: "q.b." });
          }
        } else {
          const parsed = parseFloat(ing.quantity);
          const existing = result.find(
            (i) => i.ingredient.toLowerCase() === ing.ingredient.toLowerCase() && i.unit === ing.unit
          );
          if (existing && existing.quantity !== null) {
            existing.quantity += parsed;
          } else {
            result.push({ ingredient: ing.ingredient, quantity: isNaN(parsed) ? null : parsed, unit: ing.unit });
          }
        }
      }
    }
  
    return result;
  }


  // ─── Provider ─────────────────────────────────────────────────────────────────

export function ShoppingListBuilderProvider({ children }: { children: React.ReactNode }) {
    const [isBuilding, setIsBuilding] = useState(false);
    const [selectedRecipes, setSelectedRecipes] = useState<RecipeForList[]>([]);
  
    const mergedIngredients = useMemo(() => mergeIngredients(selectedRecipes), [selectedRecipes]);
  
    function startBuilding() {
      setIsBuilding(true);
    }
  
    function stopBuilding() {
      setIsBuilding(false);
      setSelectedRecipes([]);
    }
  
    function addRecipe(recipe: RecipeForList) {
      setSelectedRecipes((prev) => {
        if (prev.find((r) => r.title === recipe.title)) return prev;
        return [...prev, recipe];
      });
    }
  
    function removeRecipe(title: string) {
      setSelectedRecipes((prev) => prev.filter((r) => r.title !== title));
    }
  
    function clearAll() {
      setSelectedRecipes([]);
    }
  
    return (
      <ShoppingListBuilderContext.Provider
        value={{ isBuilding, startBuilding, stopBuilding, selectedRecipes, addRecipe, removeRecipe, mergedIngredients, clearAll }}
      >
        {children}
      </ShoppingListBuilderContext.Provider>
    );
  }
  
  // ─── Hook ─────────────────────────────────────────────────────────────────────
  
  export function useShoppingListBuilder() {
    const context = useContext(ShoppingListBuilderContext);
    if (!context) throw new Error("useShoppingListBuilder must be used inside ShoppingListBuilderProvider");
    return context;
  }