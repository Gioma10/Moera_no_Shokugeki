import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { Ingredients } from "@/components/CreateRecipe/Ingredients";

export const SecondStep = ({form}: {form: UseFormReturn<z.infer<typeof RecipeSchema>>}) => {
    return <div>
      
      <Ingredients name="ingredients" control={form.control}/>
    </div>;
  };
  