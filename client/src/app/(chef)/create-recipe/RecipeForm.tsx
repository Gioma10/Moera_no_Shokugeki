"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import { match } from "ts-pattern";
import { RecipePhotoImport } from "@/components/CreateRecipe/RecipePhotoImport";
import { StepsBar } from "@/components/CreateRecipe/StepsBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { mergeRecipeImport } from "@/lib/recipe-import";
import { type Recipe, RecipeSchema } from "@/types/recipes";
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

const stepFields: Record<Step, (keyof Recipe)[]> = {
  first: ["image", "title", "rating", "difficulty"],
  second: ["ingredients", "category", "stimatedTime", "temperature"],
  third: ["preparation", "note", "method", "master"],
};

const EMPTY_RECIPE: DefaultValues<Recipe> = {
  image: undefined,
  title: "",
  rating: 0,
  difficulty: "",
  ingredients: [],
  preparation: "",
  note: "",
  method: "",
};

type Props = {
  title: string;
  backHref: string;
  submitLabel: string;
  defaultValues?: DefaultValues<Recipe>;
  /** Shows the photo scan used to prefill a new recipe. */
  withScan?: boolean;
  isPending: boolean;
  saveFailed: boolean;
  onSubmit: (data: Recipe) => void;
};

/** The three-step recipe form shared by create and edit. */
export function RecipeForm({
  title,
  backHref,
  submitLabel,
  defaultValues = EMPTY_RECIPE,
  withScan = false,
  isPending,
  saveFailed,
  onSubmit,
}: Props) {
  const [step, setStep] = useState<Step>("first");
  const authState = useAuth();
  const isAdmin = authState.user?.role === "admin";

  const form = useForm<Recipe>({
    resolver: zodResolver(RecipeSchema),
    mode: "onChange",
    defaultValues,
  });

  const goNext = async () => {
    const isValid = await form.trigger(stepFields[step]);
    if (!isValid) return;
    setStep(
      (prev) => steps[Math.min(steps.indexOf(prev) + 1, steps.length - 1)],
    );
  };

  const goPrev = () =>
    setStep((prev) => steps[Math.max(steps.indexOf(prev) - 1, 0)]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          href={backHref}
          className="page-card flex-none rounded-full p-2 hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>

      {withScan && (
        <RecipePhotoImport
          onApply={(recipe, overwrite) => {
            form.reset(mergeRecipeImport(form.getValues(), recipe, overwrite), {
              keepDefaultValues: true,
            });
            setStep("first");
          }}
          onUseAsCover={(file) =>
            form.setValue("image", file, { shouldValidate: true })
          }
        />
      )}

      {/* Step indicator */}
      <div className="w-full max-w-3xl">
        <StepsBar step={step} />
        <p className="page-description mt-3 text-center font-medium">
          {STEP_LABELS[step]}
        </p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-3xl rounded-3xl border-0 shadow-sm bg-white p-6 sm:p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              const firstInvalid = steps.find((step) =>
                stepFields[step].some((field) => errors[field]),
              );
              if (firstInvalid) setStep(firstInvalid);
            })}
            className="flex flex-col gap-6"
          >
            {match(step)
              .with("first", () => <FirstStep form={form} />)
              .with("second", () => <SecondStep form={form} />)
              .with("third", () => <ThirdStep form={form} isAdmin={isAdmin} />)
              .exhaustive()}

            {saveFailed && (
              <p role="alert" className="text-sm text-destructive">
                Salvataggio non riuscito. I dati sono ancora nel form: riprova.
              </p>
            )}
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
                // Distinct keys: reusing the "Avanti" element would turn its click into a submit.
                <Button
                  key="submit"
                  type="submit"
                  disabled={isPending}
                  className="btn-brand rounded-full gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  {isPending ? "Salvataggio..." : submitLabel}
                </Button>
              ) : (
                <Button
                  key="next"
                  onClick={goNext}
                  type="button"
                  className="btn-brand rounded-full gap-2"
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
}
