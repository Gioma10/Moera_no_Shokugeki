"use client";

import { getRecipes } from "@/api/recipes";
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
    <div className="flex flex-col gap-2 pt-20">
      <div>
        <Link href="/" className="border-2 rounded-full p-2">
          <ArrowLeftIcon />
        </Link>
      </div>
      {match(recipesQueryResult)
        .with({ status: "error" }, () => <div>Error...</div>)
        .with({ status: "pending" }, () => <div>Skeleton...</div>)
        .with({ status: "success" }, () => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-5">
            {recipesQueryResult.data?.map((recipe) => {
              return (
                <Card
                  key={recipe.id}
                  className="shadow border-2 border-secondary hover:shadow-2xl hover:border-primary transition-all duration-300 hover:-translate-y-5 cursor-pointer"
                >
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
                      <span className="text-sm font-light">
                        {recipe.description}
                      </span>
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
