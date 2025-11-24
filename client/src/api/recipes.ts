import { RecipeFormData } from "@/types/recipes";
const localurl = "http://localhost:8080"

// Get recipes
export const getRecipes = async (): Promise<RecipeFormData[]>=>{
  const res = await fetch(`${localurl}/api/recipes`, {
    method: "GET",
  })
  if (!res.ok) throw new Error("Errore on recipes visualization");
  return res.json()
}

// Create a recipe
export const createRecipe = async (newRecipe: RecipeFormData) => {
  const res = await fetch(`${localurl}/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecipe),
  });
  if (!res.ok) throw new Error("Errore on recipe creation");
  return res.json();
};
