import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import { Master } from "@/components/CreateRecipe/Master";
import { Method } from "@/components/CreateRecipe/Method";
import {
  Note,
  Preparation,
} from "@/components/CreateRecipe/PreparationAndNote";
import type { RecipeSchema } from "@/types/recipes";

export const ThirdStep = ({
  form,
  isAdmin,
}: {
  isAdmin: boolean;
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Preparation + Note */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Preparation name="preparation" control={form.control} />
        </div>
        <div className="sm:w-40">
          <Note name="note" control={form.control} />
        </div>
      </div>

      {/* Method + Master */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 w-full">
          <Method name="method" control={form.control} />
        </div>
        {isAdmin && (
          <div className="shrink-0">
            <Master name="master" control={form.control} />
          </div>
        )}
      </div>
    </div>
  );
};
