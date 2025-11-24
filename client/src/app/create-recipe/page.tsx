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

const RecipeSchema = z.object({
  image: z.string().url("Inserisci un URL valido"),
  title: z.string(),
  description: z.string(),
  // category: z.string(),
  // ingredients: z.array(z.string().min(1, "L'ingrediente non può essere vuoto")).min(1, "Inserisci almeno un ingrediente"),
  // preparation: z.string(),
  // coockingTime: z.number(),
  // preparationTime: z.number(),
  // rating: z.number().min(1).max(5),
});

const CreateRecipe = () => {
  const form = useForm({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      image: "",
      title: "",
      description: "",
    },
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      console.log("Ricetta creata con successo!", data);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Errore:", error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof RecipeSchema>) => {
    console.log("Here the data", data);
    create(data)
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Create</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateRecipe;
