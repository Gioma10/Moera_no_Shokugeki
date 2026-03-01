import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import { Category } from "@/components/CreateRecipe/Category";
import {
  AddIngredient,
  PreviewIngredients,
} from "@/components/CreateRecipe/Ingredients";
import { StimatedTime } from "@/components/CreateRecipe/StimatedTime";
import { Temperature } from "@/components/CreateRecipe/Temperature";
import type { RecipeSchema } from "@/types/recipes";

export const SecondStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top section — Ingredients + Category/Time/Temp */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Ingredients */}
        <div className="flex-1">
          <AddIngredient name="ingredients" control={form.control} />
        </div>

        {/* Category + Time + Temperature */}
        <div className="flex flex-row sm:flex-col gap-2 sm:w-48">
          <div className="flex-1 sm:flex-none">
            <Category name="category" control={form.control} />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <StimatedTime name="stimatedTime" control={form.control} />
            </div>
            <Temperature name="temperature" control={form.control} />
          </div>
        </div>
      </div>

      {/* Ingredients list */}
      <PreviewIngredients name="ingredients" control={form.control} />
    </div>
  );
};
