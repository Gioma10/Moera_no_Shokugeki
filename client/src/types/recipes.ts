import z from "zod";

export const RecipeSchema = z.object({
  // A string is the URL of the image already saved (editing keeps it unless replaced).
  image: z.union([z.instanceof(File), z.instanceof(Blob), z.string().min(1)], {
    error: "Aggiungi una foto della ricetta",
  }),
  title: z.string().trim().min(1, "Inserisci il nome della ricetta"),
  rating: z.number().min(1, "Dai un voto alla ricetta"),
  difficulty: z.string().min(1, "Scegli una difficoltà"),
  stimatedTime: z
    .number({ error: "Scegli il tempo" })
    .min(30, { message: "Scegli il tempo" })
    .multipleOf(30, { message: "Scegli un tempo a passi di 30 minuti" }),
  temperature: z.enum(["cold", "hot"], { error: "Scegli caldo o freddo" }),
  category: z.enum(["firstCourse", "secondCourse", "dessert", "starter"], {
    error: "Scegli una categoria",
  }),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1, "L'ingrediente non può essere vuoto"),
        quantity: z
          .string()
          .refine((val) => val === "" || !Number.isNaN(Number(val)), {
            message: "La quantità deve essere un numero",
          }),
        unit: z
          .enum(["g", "l", "ml", "pcs", "q.b.", ""])
          .refine((value) => value !== "", "Scegli un’unità"),
      }),
    )
    .min(1, "Inserisci almeno un ingrediente"),
  preparation: z.string(),
  note: z.string().optional(),
  method: z.string(),
  master: z.enum(["moe", "nowy"]).optional(),
  // Set by the server's calorie estimate; never edited in the form.
  kcalPer100g: z.number().optional(),
});

export type IngredientData = {
  ingredient: string;
  quantity: string;
  unit: "g" | "l" | "ml" | "pcs" | "q.b.";
};

export type Recipe = z.infer<typeof RecipeSchema>;
