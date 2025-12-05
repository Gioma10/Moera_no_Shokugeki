import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { RecipeSchema } from "./page";

export const SecondStep = ({form}: {form: UseFormReturn<z.infer<typeof RecipeSchema>>}) => {
    return <div>Second step</div>;
  };
  