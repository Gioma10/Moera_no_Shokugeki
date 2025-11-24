import { RecipeFormData } from "@/types/recipes";

// Get recipes

export const getRecipes = async ()=>{
  
}

// Create a recipe
export const createRecipe = async (newRecipe: RecipeFormData) => {
  const res = await fetch("http://localhost:8080/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecipe),
  });
  if (!res.ok) throw new Error("Errore nella creazione della ricetta");
  return res.json();
};
