import { auth } from "@/lib/firebase";
import { shrinkForReading } from "@/lib/recipe-import";
import { isRecipeExtraction } from "@/types/recipe-extraction";
import type { IngredientData } from "@/types/recipes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type RecipeFromServer = {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: IngredientData[];
  rating: number;
  category: "firstCourse" | "secondCourse" | "dessert" | "starter";
  master?: "moe" | "nowy";
  difficulty: string;
  stimatedTime: number;
};

export type RecipesPage = {
  items: RecipeFromServer[];
  next: string | undefined;
  count: number;
  limit: number;
};

// Get recipes
export const getRecipes = async (
  userId: string,
  cursor?: string,
  limit = 10,
): Promise<RecipesPage> => {
  const params = new URLSearchParams({ userId, limit: String(limit) });
  if (cursor) params.append("cursor", cursor);
  const res = await fetch(`${BASE_URL}/api/recipes?${params}`);
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

export async function extractRecipePhoto(image: File, signal?: AbortSignal) {
  const user = auth.currentUser;
  if (!user) throw new Error("Accedi per importare una ricetta.");
  const token = await user.getIdToken();
  const body = new FormData();
  body.append("image", await shrinkForReading(image));
  const response = await fetch(`${BASE_URL}/api/recipes/extract`, {
    method: "POST", headers: { Authorization: `Bearer ${token}` }, body, signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Importazione non riuscita. Riprova tra poco.");
  if (!isRecipeExtraction(data)) throw new Error("La risposta ricevuta non è valida. Riprova tra poco.");
  return data;
}
