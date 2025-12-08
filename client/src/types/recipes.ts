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
  stimatedTime: z.string().refine((val) => val === "" || !isNaN(Number(val)), {
    message: "Quantity must be a number",
  }),
  temperature: z.enum(["cold", "hot"]),
  category: z.enum(["firstCourse", "secondCourse", "dessert", "starter"]),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1, "L'ingrediente non può essere vuoto"),
        quantity: z
          .string()
          .refine((val) => val === "" || !isNaN(Number(val)), {
            message: "Quantity must be a number",
          }),
        unit: z.enum(["g", "l", "ml", "pcs", "q.b."]),
      })
    )
    .min(1, "Inserisci almeno un ingrediente"),
  // preparation: z.string(),
});

export type IngredientData = {
  ingredient: string;
  quantity: string;
  unit: "g" | "l" | "ml" | "pcs" | "q.b.";
};