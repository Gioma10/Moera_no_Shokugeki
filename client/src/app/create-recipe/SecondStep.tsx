import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { RecipeSchema } from "@/types/recipes";
import { AddIngredient } from "@/components/CreateRecipe/AddIngredient";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Temperature } from "@/components/CreateRecipe/Temperature";
import { PreviewIngredients } from "@/components/CreateRecipe/PreviewIngredients";

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
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="firstCourse">
                          First Course
                        </SelectItem>
                        <SelectItem value="secondCourse">
                          Second Course
                        </SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className="flex gap-2">
            {/* Stimated Time  */}
            <FormField
              name="stimatedTime"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Stimated Time"
                          value={field.value}
                          onChange={
                            (e) => field.onChange(e.target.value) // solo numeri
                          }
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="pr-12" // spazio per l’unità
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          min
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            {/* Temperature */}
            <Temperature name="temperature" control={form.control} />
          </div>
        </div>
      </div>

      <PreviewIngredients name="ingredients" control={form.control} />
    </div>
  );
};
