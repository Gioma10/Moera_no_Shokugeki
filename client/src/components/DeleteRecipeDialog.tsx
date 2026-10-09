"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  isPending: boolean;
  failed: boolean;
  onConfirm: () => void;
};

export function DeleteRecipeDialog({
  open,
  onOpenChange,
  recipeTitle,
  isPending,
  failed,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
    >
      <DialogContent showCloseButton={false} className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Eliminare “{recipeTitle}”?</DialogTitle>
          <DialogDescription>
            La ricetta e la sua foto verranno cancellate definitivamente. Non
            potrai recuperarla.
          </DialogDescription>
        </DialogHeader>
        {failed && (
          <p role="alert" className="text-sm text-destructive">
            Eliminazione non riuscita. Riprova.
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
            type="button"
            variant="destructive"
            className="rounded-full gap-2"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
            {isPending ? "Eliminazione…" : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
