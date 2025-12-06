'use client'

import { Difficulty } from "@/components/CreateRecipe/Difficulty";
import ImageInput from "@/components/CreateRecipe/ImageInput";
import { RatingInput } from "@/components/CreateRecipe/RatingInput";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RecipeSchema } from "@/types/recipes";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

export const FirstStep = ({form}: {form: UseFormReturn<z.infer<typeof RecipeSchema>>}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        <ImageInput name="image" control={form.control} />
        <div className="flex flex-col gap-5">
          <RatingInput name="rating" control={form.control} />
          <Difficulty name="difficulty" control={form.control} />
        </div>
      </div>

      <FormField
        name="title"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input className="py-5 sm:py-6" placeholder="Title" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
