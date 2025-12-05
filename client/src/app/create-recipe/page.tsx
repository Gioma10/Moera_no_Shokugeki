"use client";

import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/api/recipes";
import { useRouter } from "next/navigation";
import ImageInput from "@/components/ImageInput";
import { RatingInput } from "@/components/RatingInput";
import { Difficulty } from "@/components/Difficulty";
import { useState } from "react";
import { FormSteps } from "@/components/FromSteps";

const RecipeSchema = z.object({
  image: z.union([z.instanceof(File), z.instanceof(Blob)], {
error: "Image is required",
  }),
  title: z.string().min(1, "Title is required"),
  rating: z.number().min(1),
  difficulty: z.string().min(1, "Difficulty is required"),
  // description: z.string(),
  // category: z.string(),
  // ingredients: z.array(z.string().min(1, "L'ingrediente non può essere vuoto")).min(1, "Inserisci almeno un ingrediente"),
  // preparation: z.string(),
  // coockingTime: z.number(),
  // preparationTime: z.number(),

});

const CreateRecipe = () => {
  const [step, setStep] = useState<number>(1);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RecipeSchema),
    mode:"onChange",
    defaultValues: {
      image: undefined,
      title: "",
      rating: 0,
      difficulty: "",
    },
  });

  const { mutate: onCreate } = useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      console.log("Ricetta creata con successo!", data);
      form.reset();
      router.push("/recipes");
    },
    onError: (error: any) => {
      console.error("Errore:", error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof RecipeSchema>) => {
    
    const payload = new FormData();
    payload.append("image", data.image);
    payload.append("title", data.title);
    payload.append("rating", String(data.rating));
    payload.append("difficulty", data.difficulty);
    
    console.log("Here the data", data);

    // onCreate(payload);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-10">
      <h2 className="text-3xl font-bold uppercase">Crea una nuova ricetta</h2>
      <FormSteps step={step} />
      <Card className=" py-5 px-10 sm:p-10 mx-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
                    <Input
                      className="py-5 sm:py-6"
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer" >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateRecipe;
