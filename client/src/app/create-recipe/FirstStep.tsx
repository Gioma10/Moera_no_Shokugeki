"use client";

import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import { Difficulty } from "@/components/CreateRecipe/Difficulty";
import ImageInput from "@/components/CreateRecipe/ImageInput";
import { RatingInput } from "@/components/CreateRecipe/RatingInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RecipeSchema } from "@/types/recipes";

export const FirstStep = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 items-start">
        <ImageInput name="image" control={form.control} />

        <div className="flex flex-col gap-4 flex-1 min-w-0">
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
              <Input
                className="rounded-xl py-5 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-orange-400 text-base"
                placeholder="Nome della ricetta..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
