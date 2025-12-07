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
import { FormSteps } from "@/components/CreateRecipe/FromSteps";
import { FirstStep } from "./FirstStep";
import { match } from "ts-pattern";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";
import { RecipeSchema } from "@/types/recipes";

const steps = ["first", "second", "third"] as const;
export type Step = (typeof steps)[number]; // "first" | "second" | "third"

const CreateRecipe = () => {
  const [step, setStep] = useState<Step>("second");

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

  const stepFields: Record<Step, (keyof z.infer<typeof RecipeSchema>)[]> = {
    first: ["image", "title", "rating", "difficulty"],
    second: ["ingredients"],
    third: [],
  };

  // Navigation
  const goNext = async () => {
    const fieldsToValidate = stepFields[step];
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return;

    setStep(
      (prev) => steps[Math.min(steps.indexOf(prev) + 1, steps.length - 1)]
    );
  };

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
      <h2 className="text-3xl font-bold uppercase">Create a new recipe</h2>
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
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step === "third" ? (
                <Button type="submit" className="cursor-pointer">
                  Create
                </Button>
              ) : (
                <Button
                  onClick={goNext}
                  type="button"
                  className="cursor-pointer"
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateRecipe;
