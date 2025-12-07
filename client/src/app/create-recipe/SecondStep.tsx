import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { Ingredients } from "@/components/CreateRecipe/Ingredients";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SecondStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex gap-10">
      <Ingredients name="ingredients" control={form.control} />

      <FormField
        name="category"
        control={form.control}
        render={({ field }) => {
          return (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Category"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="firstCourse">First Course</SelectItem>
                <SelectItem value="secondCourse">Second Course</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />

      {/* <FormField name="stimatedTime" control={form.control} render={({field})}/>  */}
    </div>
  );
};
