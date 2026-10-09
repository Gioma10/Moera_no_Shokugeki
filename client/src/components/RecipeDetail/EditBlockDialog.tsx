"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { type ReactNode, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { recipeToFormData, updateRecipe } from "@/api/recipes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { type Recipe, RecipeSchema } from "@/types/recipes";

type Props = {
  id: string;
  recipe: Recipe;
  title: string;
  /** The fields this block edits: only these are validated before saving. */
  fields: (keyof Recipe)[];
  /** Light pencil for dark backgrounds (the hero image). */
  onDark?: boolean;
  className?: string;
  children: (form: UseFormReturn<Recipe>) => ReactNode;
};

function formValues(recipe: Recipe): Recipe {
  return {
    ...recipe,
    ingredients: recipe.ingredients ?? [],
    preparation: recipe.preparation ?? "",
    note: recipe.note ?? "",
    method: recipe.method ?? "",
    // Older recipes store "" when no chef was chosen.
    master: recipe.master || undefined,
  };
}

/** A pencil that edits one block of a recipe in a dialog and saves the whole recipe. */
export function EditBlockDialog({
  id,
  recipe,
  title,
  fields,
  onDark = false,
  className,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<Recipe>({
    resolver: zodResolver(RecipeSchema),
    mode: "onChange",
    defaultValues: formValues(recipe),
  });

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: updateRecipe,
    onSuccess: async (updated) => {
      queryClient.setQueryData(["recipe", id], updated);
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setOpen(false);
    },
  });

  // Validates only this block, so an old recipe with an invalid field elsewhere stays editable.
  const save = async () => {
    if (!(await form.trigger(fields))) return;
    mutate({ id, data: recipeToFormData(form.getValues()) });
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Modifica ${title.toLowerCase()}`}
        onClick={() => {
          form.reset(formValues(recipe));
          reset();
          setOpen(true);
        }}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full transition-colors cursor-pointer",
          onDark
            ? "bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
            : "bg-white text-muted-foreground shadow-sm hover:text-orange-500",
          className,
        )}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </button>

      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
              className="flex flex-col gap-4"
            >
              {children(form)}
              {isError && (
                <p role="alert" className="text-sm text-destructive">
                  Salvataggio non riuscito. Riprova.
                </p>
              )}
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={isPending}
                  >
                    Annulla
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="btn-brand rounded-full gap-2"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2
                      className="size-4 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  )}
                  {isPending ? "Salvataggio…" : "Salva"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
