import z from "zod";

export interface RecipeFormData {
  id?: string;
  image: File;
  title: string;
  // category: string;
  // ingredients: string;
  // preparations: string;
  rating: number;
  // preparationTime?: string;
  // cookingTime?: string;
}


export const RecipeSchema = z.object({
  image: z.union([z.instanceof(File), z.instanceof(Blob)], {
    error: "Image is required",
  }),
  title: z.string().min(1, "Title is required"),
  rating: z.number().min(1),
  difficulty: z.string().min(1, "Difficulty is required"),
  // description: z.string(),
  // category: z.string(),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1, "L'ingrediente non può essere vuoto"),
        quantity: z.number().optional(),
        type: z.enum(["g", "l", "ml", "pcs", "q.b."]),
      })
    )
    .min(1, "Inserisci almeno un ingrediente"),
  // preparation: z.string(),
  // coockingTime: z.number(),
  // preparationTime: z.number(),
});

// export const IngredientSchema = z.object({
//   ingredient: z.string().min(1, "Required"),
//   quantity: z.number().min(0, "Quantity must be ≥ 0"),
//   type: z.enum(["g", "l", "ml", "pcs", "q.b."]),    
// })