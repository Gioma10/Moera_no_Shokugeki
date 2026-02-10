"use client";

import { getRecipe } from "@/api/recipes";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/types/recipes";
import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";

export default function RecipePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: recipe, status } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
  });

  return match(status)
    .with("error", () => (
      <Alert variant="destructive">
        {" "}
        <span>Error to render recipe</span>
      </Alert>
    ))
    .with("pending", () => <Skeleton className="w-full h-36"></Skeleton>)
    .with("success", () => <div>kjadsnfkjansdkjlfnksdajnf</div>)
    .exhaustive();
}
