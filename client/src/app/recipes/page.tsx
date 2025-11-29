"use client";

import { getRecipes } from "@/api/recipes";
import { RecipeCard, RecipeCardSkeleton } from "@/components/RecipeCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { match } from "ts-pattern";

export default function Recipes() {
  const recipesQueryResult = useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  return (
    <div className="flex flex-col gap-10 pt-20">
      <div className="flex items-center justify-center">
        <Link
          href="/"
          className="border-2 rounded-full p-2 hover:shadow flex-none"
        >
          <ArrowLeftIcon />
        </Link>

        <div className="flex-">Search bar</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-5">
        {match(recipesQueryResult)
          .with({ status: "error" }, () => <div>Error...</div>)
          .with({ status: "pending" }, () => {
            const count = recipesQueryResult.data?.length ?? 4;

            return Array.from({ length: count }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ));
          })
          .with({ status: "success" }, () =>
            recipesQueryResult.data?.map((recipe) => (
              <RecipeCard recipe={recipe} />
            ))
          )
          .exhaustive()}
      </div>
    </div>
  );
}
