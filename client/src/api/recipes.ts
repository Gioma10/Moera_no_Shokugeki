import { IngredientData } from "@/types/recipes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type RecipeFromServer = {
  id: string;
  title: string;
  description: string;
  image: string; // URL di Cloudinary
  ingredients: IngredientData[];
};

// Get recipes
export const getRecipes = async (
  userId: string,
): Promise<RecipeFromServer[]> => {
  const res = await fetch(`${BASE_URL}/api/recipes?userId=${userId}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Errore on recipes visualization");
  return res.json();
};

// Create a recipe
export const createRecipe = async (newRecipe: FormData) => {
  const res = await fetch(`${BASE_URL}/api/recipes`, {
    method: "POST",
    body: newRecipe,
  });

  if (!res.ok) throw new Error("Errore on recipe creation");

  return res.json();
};

// Delete recipe
export const deleteRecipe = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/recipes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Errore on recipe creation");

  return res.json();
};

// Get recipe
export const getRecipe = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/recipes/${id}`);

  if (!res.ok) throw new Error(`Error on get recipe: ${id} `);

  return res.json();
};
