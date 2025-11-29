import { deleteRecipe, RecipeFromServer } from "@/api/recipes";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const RecipeCard = ({ recipe }: { recipe: RecipeFromServer }) => {
  const queryClient = useQueryClient();

  const { mutate: onDelete } = useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ["recipes"] })
  });
  return (
    <Card
      key={recipe.id}
      className="shadow border-2 border-secondary hover:shadow-2xl hover:border-primary transition-all duration-300 hover:-translate-y-5 cursor-pointer"
    >
      <CardHeader>
        <div className="w-full h-40 relative">
          {recipe.image && <Image src={recipe.image} alt="Recipe Image" fill />}
        </div>
        <h3 className="text-xl font-bold">{recipe.title.toUpperCase()}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col leading-4">
            <h4 className="text-md ">Descrizione</h4>
            <span className="text-sm font-light">{recipe.description}</span>
          </div>
          <div className="flex">
            <Button
              onClick={() => onDelete(recipe.id)}
              variant="destructive"
              className="cursor-pointer hover:bg-red-400"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RecipeCardSkeleton = () => {
  return (
    <Card className="shadow border-2 border-secondary text-secondary animate-pulse transition-all duration-300">
      <CardHeader>
        <div className="w-full h-40 relative overflow-hidden rounded-md">
          <Skeleton className="w-full h-40" />
        </div>
        <h3 className="text-xl font-bold mt-3">
          <Skeleton className="w-3/4 h-6" />
        </h3>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col leading-4">
          <h4 className="text-md mb-2">
            <Skeleton className="w-1/4 h-4" />
          </h4>

          <div className="space-y-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-5/6 h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
