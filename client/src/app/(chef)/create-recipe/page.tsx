"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";
import type * as z from "zod";
import { createRecipe } from "@/api/recipes";
import { StepsBar } from "@/components/CreateRecipe/StepsBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RecipeSchema } from "@/types/recipes";
import { FirstStep } from "./FirstStep";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";

const steps = ["first", "second", "third"] as const;
export type Step = (typeof steps)[number];

const STEP_LABELS: Record<Step, string> = {
  first: "Informazioni base",
  second: "Ingredienti",
  third: "Preparazione",
};

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

  const { mutate: onCreate, isPending } = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      form.reset();
      router.push("/recipes");
    },
  });

  const stepFields: Record<Step, (keyof z.infer<typeof RecipeSchema>)[]> = {
    first: ["image", "title", "rating", "difficulty"],
    second: ["ingredients", "category", "stimatedTime", "temperature"],
    third: ["preparation", "note", "method", "master"],
  };

  const goNext = async () => {
    const isValid = await form.trigger(stepFields[step]);
    if (!isValid) return;
    setStep(
      (prev) => steps[Math.min(steps.indexOf(prev) + 1, steps.length - 1)],
    );
  };

  const goPrev = () =>
    setStep((prev) => steps[Math.max(steps.indexOf(prev) - 1, 0)]);

  const onSubmit = (data: z.infer<typeof RecipeSchema>) => {
    const payload = new FormData();
    payload.append("image", data.image);
    payload.append("title", data.title);
    payload.append("rating", String(data.rating));
    payload.append("difficulty", data.difficulty);
    payload.append("ingredients", JSON.stringify(data.ingredients));
    payload.append("category", data.category);
    payload.append("stimatedTime", String(data.stimatedTime));
    payload.append("temperature", String(data.temperature));
    payload.append("preparation", data.preparation);
    payload.append("note", data.note ?? "");
    payload.append("method", data.method);
    payload.append("master", data.master);
    onCreate(payload);
  };

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          href="/"
          className="flex-none border-2 rounded-full p-2 hover:shadow-md transition-shadow bg-white"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold tracking-tight">Nuova Ricetta</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="w-full max-w-3xl">
        <StepsBar step={step} />
        <p className="text-sm text-muted-foreground mt-3 text-center font-medium">
          {STEP_LABELS[step]}
        </p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-3xl rounded-3xl border-0 shadow-sm bg-white p-6 sm:p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {match(step)
              .with("first", () => <FirstStep form={form} />)
              .with("second", () => <SecondStep form={form} />)
              .with("third", () => <ThirdStep form={form} />)
              .exhaustive()}

            {/* Navigation */}
            <div className="flex justify-between pt-2 border-t">
              {step !== "first" ? (
                <Button
                  onClick={goPrev}
                  type="button"
                  variant="outline"
                  className="rounded-full gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Indietro
                </Button>
              ) : (
                <div />
              )}

              {step === "third" ? (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <CheckIcon className="w-4 h-4" />
                  {isPending ? "Salvataggio..." : "Crea Ricetta"}
                </Button>
              ) : (
                <Button
                  onClick={goNext}
                  type="button"
                  className="rounded-full gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  Avanti
                  <ArrowRightIcon className="w-4 h-4" />
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
