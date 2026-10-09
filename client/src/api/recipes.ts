import { auth } from "@/lib/firebase";
import { shrinkForReading } from "@/lib/recipe-import";
import { isRecipeExtraction } from "@/types/recipe-extraction";
import type { IngredientData, Recipe } from "@/types/recipes";

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

export function recipeToFormData(data: Recipe) {
  const payload = new FormData();
  // An unchanged image is the saved URL: only a new file is uploaded.
  if (data.image instanceof Blob) payload.append("image", data.image);
  payload.append("title", data.title);
  payload.append("rating", String(data.rating));
  payload.append("difficulty", data.difficulty);
  payload.append("ingredients", JSON.stringify(data.ingredients));
  payload.append("category", data.category);
  payload.append("stimatedTime", String(data.stimatedTime));
  payload.append("temperature", data.temperature);
  payload.append("preparation", data.preparation);
  payload.append("note", data.note ?? "");
  payload.append("method", data.method);
  payload.append("master", data.master ?? "");
  return payload;
}

// Update a recipe
export const updateRecipe = async ({ id, data }: { id: string; data: FormData }) => {
  const res = await fetch(`${BASE_URL}/api/recipes/${id}`, {
    method: "PUT",
    body: data,
  });

  if (!res.ok) throw new Error("Errore on recipe update");

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
