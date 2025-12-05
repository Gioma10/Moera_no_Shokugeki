import z from "zod";
import { RecipeSchema } from "./page";
import { UseFormReturn } from "react-hook-form";

export const ThirdStep = ({form}: {form: UseFormReturn<z.infer<typeof RecipeSchema>>}) => {
  return <div>Third step</div>;
};
