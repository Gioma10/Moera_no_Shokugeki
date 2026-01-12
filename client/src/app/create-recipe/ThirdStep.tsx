import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { UseFormReturn } from "react-hook-form";
import {
  Note,
  Preparation,
} from "@/components/CreateRecipe/PreparationAndNote";
import { Method } from "@/components/CreateRecipe/Method";
import { Master } from "@/components/CreateRecipe/Master";

export const ThirdStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex gap-5  justify-between">
        <Preparation name="preparation" control={form.control} />
        <Note name="note" control={form.control} />
      </div>
      <div className="flex justify-between">
          <Method name="method" control={form.control} />
        <div className="">
        <Master name="master" control={form.control} />
        </div>
      </div>
    </div>
  );
};
