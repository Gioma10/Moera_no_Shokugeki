import { RecipeFromServer } from "@/api/recipes";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export const RecipeCard = ({ recipe }: { recipe: RecipeFromServer }) => {
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
      <CardContent className="">
        <div className="flex flex-col leading-4">
          <h4 className="text-md ">Descrizione</h4>
          <span className="text-sm font-light">{recipe.description}</span>
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
          <Skeleton className="w-full h-40"/>
        </div>
        <h3 className="text-xl font-bold mt-3">
          <Skeleton className="w-3/4 h-6" />
        </h3>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col leading-4">
          <h4 className="text-md mb-2">
            <Skeleton className="w-1/4 h-4"/>
          </h4>

          <div className="space-y-2">
            <Skeleton className="w-full h-3"/>
            <Skeleton className="w-5/6 h-3"/>
            <Skeleton className="w-2/3 h-3"/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
