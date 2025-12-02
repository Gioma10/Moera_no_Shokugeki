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
  image: z.union([z.instanceof(File), z.instanceof(Blob)]),
  title: z.string(),
  // description: z.string(),
  // category: z.string(),
  // ingredients: z.array(z.string().min(1, "L'ingrediente non può essere vuoto")).min(1, "Inserisci almeno un ingrediente"),
  // preparation: z.string(),
  // coockingTime: z.number(),
  // preparationTime: z.number(),
  rating: z.number().min(1).max(5),
  difficulty: z.string(),
});


const CreateRecipe = () => {
  const [step, setStep] = useState<number>(3)

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RecipeSchema),
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
    console.log("Here the data", data);

    // const payload = new FormData();
    // payload.append("image", data.image);
    // payload.append("title", data.title);
    // payload.append("description", data.description);
    // onCreate(payload);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <FormSteps step={step}/>
      <Card className=" py-5 px-10 sm:p-10 m-5">
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
            {/* <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
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
