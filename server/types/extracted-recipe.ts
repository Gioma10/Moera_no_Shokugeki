// Contract of POST /api/recipes/extract. The client keeps a type-only copy in
// client/src/types/recipe-extraction.ts: no imports cross client/ and server/.
export const INGREDIENT_UNITS = ["g", "l", "ml", "pcs", "q.b."] as const;
export const DIFFICULTIES = ["easy", "medium", "hard", "impossible"] as const;
export const CATEGORIES = ["firstCourse", "secondCourse", "dessert", "starter"] as const;
export const TEMPERATURES = ["cold", "hot"] as const;
export const METHODS = ["Crudo", "Bollito", "Sobbollito", "Al vapore", "Saltato in padella", "Soffritto", "Fritto", "Fritto in olio profondo", "Grigliato", "Cotto sulla piastra", "Al forno", "Arrosto", "Brasato", "In umido", "In salsa", "Affumicato", "Marinato", "Sous-vide", "A bagnomaria", "Cotto a fuoco lento", "Cotto velocemente", "Al microonde", "Frullato", "Tritato", "Impastato", "Fermentato", "Caramellato", "Glassato", "Gratinato"] as const;
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
export const IMPORT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;

export type ExtractedIngredient = {
  ingredient: string | null;
  quantity: string | null;
  unit: (typeof INGREDIENT_UNITS)[number] | null;
};
export type ExtractedRecipe = {
  title: string | null;
  difficulty: (typeof DIFFICULTIES)[number] | null;
  stimatedTime: number | null;
  temperature: (typeof TEMPERATURES)[number] | null;
  category: (typeof CATEGORIES)[number] | null;
  ingredients: ExtractedIngredient[] | null;
  preparation: string | null;
  note: string | null;
  method: (typeof METHODS)[number] | null;
};
export type RecipeExtraction = { isRecipe: boolean; recipe: ExtractedRecipe; warnings: string[] };

const RECIPE_KEYS = ["title", "difficulty", "stimatedTime", "temperature", "category", "ingredients", "preparation", "note", "method"] as const;

// Gemini structured output (responseJsonSchema). Nullable enums use anyOf so the
// enum itself contains only strings.
const nullableText = { type: ["string", "null"] };
const nullableEnum = (values: readonly string[]) => ({ anyOf: [{ type: "string", enum: [...values] }, { type: "null" }] });
export const EXTRACTION_JSON_SCHEMA = {
  type: "object",
  required: ["isRecipe", "recipe", "warnings"],
  properties: {
    isRecipe: { type: "boolean", description: "True only for a legible written recipe, not a photograph of food alone." },
    recipe: {
      type: "object",
      required: [...RECIPE_KEYS],
      properties: {
        title: nullableText,
        difficulty: nullableEnum(DIFFICULTIES),
        stimatedTime: { type: ["integer", "null"], description: "Total minutes." },
        temperature: nullableEnum(TEMPERATURES),
        category: nullableEnum(CATEGORIES),
        ingredients: {
          type: ["array", "null"],
          items: {
            type: "object",
            required: ["ingredient", "quantity", "unit"],
            properties: { ingredient: nullableText, quantity: nullableText, unit: nullableEnum(INGREDIENT_UNITS) },
          },
        },
        preparation: nullableText,
        note: nullableText,
        method: nullableEnum(METHODS),
      },
    },
    warnings: { type: "array", items: { type: "string" } },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? sentenceCase(value.trim().slice(0, 20000)) : null;
}
// Recipes copied from cards or handwriting often come back in ALL CAPS even when told otherwise.
function sentenceCase(value: string): string {
  const letters = value.match(/\p{L}/gu) ?? [];
  const upper = letters.filter(l => l !== l.toLowerCase()).length;
  if (letters.length < 4 || upper / letters.length < 0.7) return value;
  return value.toLowerCase().replace(/(^|[.!?]\s+|\n\s*(?:\d+[.)]\s*)?)(\p{L})/gu, (_, before: string, letter: string) => before + letter.toUpperCase())
    .replace(/°c\b/g, "°C");
}
function capitalized(value: string | null): string | null {
  return value && value.charAt(0).toUpperCase() + value.slice(1);
}
function oneOf<T extends string>(value: unknown, values: readonly T[]): T | null {
  return typeof value === "string" && (values as readonly string[]).includes(value) ? (value as T) : null;
}
function quantity(value: unknown): string | null {
  const normalized = typeof value === "string" ? value.trim().replace(",", ".") : typeof value === "number" ? String(value) : "";
  return /^\d+(\.\d+)?$/.test(normalized) && Number(normalized) > 0 ? normalized : null;
}

/**
 * Validates model output at the boundary. A broken shape throws; a single
 * unusable field becomes null, so one odd value does not discard the whole read.
 */
export function parseExtraction(value: unknown): RecipeExtraction {
  if (!isRecord(value) || typeof value.isRecipe !== "boolean" || !isRecord(value.recipe)) throw new Error("Invalid extraction");
  const r = value.recipe;
  const minutes = typeof r.stimatedTime === "number" && Number.isFinite(r.stimatedTime) && r.stimatedTime >= 1 && r.stimatedTime <= 525600
    ? Math.round(r.stimatedTime) : null;
  const ingredients = Array.isArray(r.ingredients)
    ? r.ingredients.filter(isRecord).slice(0, 100).map(i => ({
        ingredient: capitalized(text(i.ingredient)),
        quantity: quantity(i.quantity),
        // A missing or non-metric unit (bustine, spicchi, a bare count) is counted in pieces.
        unit: oneOf(i.unit, INGREDIENT_UNITS) ?? "pcs",
      }))
    : null;
  return {
    isRecipe: value.isRecipe,
    recipe: {
      title: capitalized(text(r.title)),
      difficulty: oneOf(r.difficulty, DIFFICULTIES),
      stimatedTime: minutes,
      temperature: oneOf(r.temperature, TEMPERATURES),
      category: oneOf(r.category, CATEGORIES),
      ingredients,
      preparation: text(r.preparation),
      note: text(r.note),
      method: oneOf(r.method, METHODS),
    },
    warnings: Array.isArray(value.warnings)
      ? value.warnings.filter((w): w is string => typeof w === "string" && w.trim() !== "").slice(0, 30).map(w => w.slice(0, 2000))
      : [],
  };
}
