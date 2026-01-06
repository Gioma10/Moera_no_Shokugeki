import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { UseFormReturn } from "react-hook-form";
import { Note, Preparation } from "@/components/CreateRecipe/PreparationAndNote";

export const ThirdStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5">
        <Preparation name="preparation" control={form.control} />
        <Note name="note" control={form.control}/>
      </div>
      <div className="flex gap-5">
        
        <Note name="note" control={form.control}/>
      </div>
    </div>
  );
};
