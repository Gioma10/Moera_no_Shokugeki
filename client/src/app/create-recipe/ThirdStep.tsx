import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { UseFormReturn } from "react-hook-form";
import { Note, Preparation } from "@/components/CreateRecipe/PreparationAndNote";
import { Method } from "@/components/CreateRecipe/Method";

export const ThirdStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <Preparation name="preparation" control={form.control} />
        <Note name="note" control={form.control}/>
      </div>
      <div className="flex gap-5">
        <div className="flex-1">

        <Method name="method" control={form.control}/>
        </div>
        <Note name="note" control={form.control}/>
      </div>
    </div>
  );
};
