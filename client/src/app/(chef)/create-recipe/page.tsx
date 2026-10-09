"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createRecipe, recipeToFormData } from "@/api/recipes";
import { useAuth } from "@/context/AuthContext";
import { RecipeForm } from "./RecipeForm";

const CreateRecipe = () => {
  const router = useRouter();

  const authState = useAuth();
  const userId =
    authState.status === "authenticated" ? authState.user.uid : null;

  const {
    mutate: onCreate,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => router.push("/recipes"),
  });

  return (
    <RecipeForm
      title="Nuova Ricetta"
      backHref="/"
      submitLabel="Crea Ricetta"
      withScan
      isPending={isPending}
      saveFailed={isError}
      onSubmit={(data) => {
        if (!userId) return;
        const payload = recipeToFormData(data);
        payload.append("userId", userId);
        onCreate(payload);
      }}
    />
  );
};

export default CreateRecipe;
