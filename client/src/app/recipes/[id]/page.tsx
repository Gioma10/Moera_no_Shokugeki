"use client"

import { getRecipe } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

export default function RecipePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const  recipeQueryResult  = useQuery({
    queryKey: ["recipe", id],
    queryFn: ()=> getRecipe(id),
  })
console.log(recipeQueryResult)
  return <div>

    Pagina dettaglio di {id}
  </div>;
}
