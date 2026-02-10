"use client";

import { getRecipe } from "@/api/recipes";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/types/recipes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { match } from "ts-pattern";

export default function RecipePage() {
  const params = useParams<{ id : string}>();

  const { data: recipe, status } = useQuery<Recipe>({
    queryKey: ["recipe", params.id],
    queryFn: () => getRecipe(params.id),
  });

  return match(status)
    .with("error", () => (
      <Alert variant="destructive">
        {" "}
        <span>Error to render recipe</span>
      </Alert>
    ))
    .with("pending", () => <Skeleton className="w-full h-36"></Skeleton>)
    .with("success", () => <div>{recipe?.title}</div>)
    .exhaustive();
}
