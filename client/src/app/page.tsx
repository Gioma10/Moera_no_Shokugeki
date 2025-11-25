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
          <div className="flex gap-2">
            {recipesQueryResult.data?.map((recipe) => {
              return (
                <Card key={recipe.id} className="w-80 h-96">
                  <CardHeader>
                    <div className="w-full h-40 relative">
                      {recipe.image && (
                        <Image src={recipe.image} alt="Recipe Image" fill />
                      )}
                    </div>
                    <h3 className="text-xl font-bold">
                      {recipe.title.toUpperCase()}
                    </h3>
                  </CardHeader>
                  <CardContent className="">
                    <div className="flex flex-col leading-4">
                      <h4 className="text-md ">Descrizione</h4>
                      <span className="text-sm font-light">{recipe.description}</span>
                    </div>
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
