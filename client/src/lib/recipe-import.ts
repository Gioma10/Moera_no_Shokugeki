import type { ExtractedRecipe } from "@/types/recipe-extraction";
import type { Recipe } from "@/types/recipes";

/** Missing AI values never erase manual input; importing is an explicit user action. */
export function mergeRecipeImport(current: Partial<Recipe>, extracted: ExtractedRecipe, overwrite: boolean): Partial<Recipe> {
  const next: Partial<Recipe> = { ...current };
  for (const key of ["title", "difficulty", "stimatedTime", "temperature", "category", "preparation", "note", "method"] as const) {
    const value = extracted[key];
    const existing = current[key];
    if (value !== null && (overwrite || existing === undefined || existing === null || existing === "" || existing === 0)) {
      Object.assign(next, { [key]: value });
    }
  }
  if (extracted.ingredients?.length && (overwrite || !current.ingredients?.length)) {
    next.ingredients = extracted.ingredients.map(ingredient => ({
      ingredient: ingredient.ingredient ?? "", quantity: ingredient.quantity ?? "", unit: ingredient.unit ?? "",
    }));
  }
  return next;
}

const READ_MAX_SIDE = 2048;

/**
 * Downscales a phone photo to a JPEG that keeps text legible but uploads fast.
 * Falls back to the original when the browser cannot decode it (HEIC outside Safari).
 */
export async function shrinkForReading(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, READ_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
