"use client";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/api/recipes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormSteps } from "@/components/FromSteps";
import { FirstStep } from "./FirstStep";
import { match } from "ts-pattern";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";

export const RecipeSchema = z.object({
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

const steps = ["first", "second", "third"] as const;
export type Step = (typeof steps)[number]; // "first" | "second" | "third"

const CreateRecipe = () => {
  const [step, setStep] = useState<Step>("first");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RecipeSchema),
    mode: "onChange",
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

  // Navigation
  const goNext = () =>
    setStep(
      (prev) => steps[Math.min(steps.indexOf(prev) + 1, steps.length - 1)]
    );
  const goPrev = () =>
    setStep((prev) => steps[Math.max(steps.indexOf(prev) - 1, 0)]);

  // Submit
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
            {match(step)
              .with("first", () => <FirstStep form={form} />)
              .with("second", () => <SecondStep form={form} />)
              .with("third", () => <ThirdStep form={form} />)
              .exhaustive()}

            <div className="flex justify-between">
              {step !== "first" ? (
                <Button
                  onClick={goPrev}
                  type="button"
                  className="cursor-pointer"
                >
                  Indietro
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={goNext} type="button" className="cursor-pointer">
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
