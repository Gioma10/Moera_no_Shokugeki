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
    <div className="flex flex-col gap-2">
      <div className="flex gap-10">
        {/* Ingredients */}
        <AddIngredient name="ingredients" control={form.control} />

        <div className="flex flex-col gap-2">
          {/* Category */}
          <Category name="category" control={form.control} />

          <div className="flex gap-2">
            {/* Stimated Time  */}
            <StimatedTime name="stimatedTime" control={form.control} />

            {/* Temperature */}
            <Temperature name="temperature" control={form.control} />
          </div>
        </div>
      </div>

      <PreviewIngredients name="ingredients" control={form.control} />
    </div>
  );
};
