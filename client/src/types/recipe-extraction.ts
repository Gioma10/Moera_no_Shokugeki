// Response of POST /api/recipes/extract. Mirrors server/types/extracted-recipe.ts,
// which validates the model output; keep the two in sync.
export const METHODS = ["Crudo", "Bollito", "Sobbollito", "Al vapore", "Saltato in padella", "Soffritto", "Fritto", "Fritto in olio profondo", "Grigliato", "Cotto sulla piastra", "Al forno", "Arrosto", "Brasato", "In umido", "In salsa", "Affumicato", "Marinato", "Sous-vide", "A bagnomaria", "Cotto a fuoco lento", "Cotto velocemente", "Al microonde", "Frullato", "Tritato", "Impastato", "Fermentato", "Caramellato", "Glassato", "Gratinato"] as const;
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
export const IMPORT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;
// Extensions too: Chrome and Windows often give HEIC files an empty type.
export const IMPORT_ACCEPT = [...IMPORT_MIME_TYPES, ".heic", ".heif"].join(",");

export function isHeic(file: File) {
  return file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name);
}

export function isImportableImage(file: File) {
  return (IMPORT_MIME_TYPES as readonly string[]).includes(file.type) || isHeic(file);
}

export type ExtractedIngredient = {
  ingredient: string | null;
  quantity: string | null;
  unit: "g" | "l" | "ml" | "pcs" | "q.b." | null;
};
export type ExtractedRecipe = {
  title: string | null;
  difficulty: "easy" | "medium" | "hard" | "impossible" | null;
  stimatedTime: number | null;
  temperature: "cold" | "hot" | null;
  category: "firstCourse" | "secondCourse" | "dessert" | "starter" | null;
  ingredients: ExtractedIngredient[] | null;
  preparation: string | null;
  note: string | null;
  method: (typeof METHODS)[number] | null;
};
export type RecipeExtraction = { isRecipe: boolean; recipe: ExtractedRecipe; warnings: string[] };

export const EXTRACTION_LABELS: Record<keyof ExtractedRecipe, string> = {
  title: "Titolo", difficulty: "Difficoltà", stimatedTime: "Tempo", temperature: "Temperatura di servizio",
  category: "Categoria", ingredients: "Ingredienti", preparation: "Preparazione", note: "Note", method: "Metodo di cottura",
};

export function isRecipeExtraction(value: unknown): value is RecipeExtraction {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.isRecipe === "boolean" && typeof v.recipe === "object" && v.recipe !== null && Array.isArray(v.warnings);
}
