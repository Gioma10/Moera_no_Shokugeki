"use client";

import { getRecipes } from "@/api/recipes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { match } from "ts-pattern";

export default function Home() {
  const recipesQueryResult = useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  return (
    <div className="flex h-screen items-center justify-center">
      {match(recipesQueryResult)
        .with({ status: "error" }, () => <div>Error...</div>)
        .with({ status: "pending" }, () => <div>Skeleton...</div>)
        .with({ status: "success" }, () => (
          <div>
            {recipesQueryResult.data?.map((recipe) => {
              return (
                <Card key={recipe.title}>
                  <CardHeader className="w-full h-12">
                    <Image src={recipe.image ?? ''} alt="Recipe Image" fill/>
                  </CardHeader>
                  <CardContent className="">
                    <h3>{recipe.title}</h3>
                    <span>{recipe.description}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))
        .exhaustive()}
    </div>
  );
}
