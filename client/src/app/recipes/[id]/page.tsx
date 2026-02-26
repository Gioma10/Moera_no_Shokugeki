"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  ChefHat,
  Clock,
  Flame,
  Snowflake,
  Star,
  StickyNote,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { match } from "ts-pattern";
import { getRecipe } from "@/api/recipes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Recipe } from "@/types/recipes";

const CATEGORY_LABELS: Record<string, string> = {
  firstCourse: "Primo Piatto",
  secondCourse: "Secondo Piatto",
  dessert: "Dessert",
  starter: "Antipasto",
};

const MASTER_LABELS: Record<string, string> = {
  moe: "Moe",
  nowy: "Nowy",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => `star-${i + 1}`).map((key, i) => (
        <Star
          key={key}
          className={`w-4 h-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const imageUrl =
    recipe.image instanceof File || recipe.image instanceof Blob
      ? URL.createObjectURL(recipe.image)
      : undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-80 bg-muted shadow-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-rose-100">
            <UtensilsCrossed className="w-20 h-20 text-orange-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 space-y-2">
          <Badge className="bg-white/20 text-white backdrop-blur-sm border-0">
            {CATEGORY_LABELS[recipe.category] ?? recipe.category}
          </Badge>
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-3">
            <StarRating rating={recipe.rating} />
            <span className="text-white/80 text-sm">{recipe.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <InfoCard
          icon={<Clock className="w-5 h-5 text-blue-500" />}
          label="Tempo"
          value={`${recipe.stimatedTime} min`}
          bg="bg-blue-50"
        />
        <InfoCard
          icon={<ChefHat className="w-5 h-5 text-violet-500" />}
          label="Difficoltà"
          value={recipe.difficulty}
          bg="bg-violet-50"
        />
        <InfoCard
          icon={
            recipe.temperature === "hot" ? (
              <Flame className="w-5 h-5 text-rose-500" />
            ) : (
              <Snowflake className="w-5 h-5 text-sky-500" />
            )
          }
          label="Temperatura"
          value={recipe.temperature === "hot" ? "Caldo" : "Freddo"}
          bg={recipe.temperature === "hot" ? "bg-rose-50" : "bg-sky-50"}
        />
        <InfoCard
          icon={<ChefHat className="w-5 h-5 text-amber-500" />}
          label="Chef"
          value={MASTER_LABELS[recipe.master] ?? recipe.master}
          bg="bg-amber-50"
        />
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Ingredients */}
        <Card className="md:col-span-2 shadow-sm border-0 bg-muted/40">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              Ingredienti
            </h2>
            <Separator />
            <ul className="space-y-3">
              {recipe.ingredients.map((item) => (
                <li
                  key={item.ingredient}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-foreground capitalize">
                    {item.ingredient}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {item.quantity} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Method + Preparation */}
        <div className="md:col-span-3 space-y-6">
          {recipe.method && (
            <Card className="shadow-sm border-0 bg-muted/40">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  Metodo
                </h2>
                <Separator />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recipe.method}
                </p>
              </CardContent>
            </Card>
          )}

          {recipe.preparation && (
            <Card className="shadow-sm border-0 bg-muted/40">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  Preparazione
                </h2>
                <Separator />
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {recipe.preparation}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Notes */}
      {recipe.note && (
        <Card className="shadow-sm border-0 bg-amber-50 border-l-4 border-amber-400">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-amber-700">
              <StickyNote className="w-5 h-5" />
              Note
            </h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              {recipe.note}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div
      className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}
    >
      {icon}
      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className="text-sm font-semibold capitalize">{value}</span>
    </div>
  );
}

export default function RecipePage() {
  const params = useParams<{ id: string }>();

  const { data: recipe, status } = useQuery<Recipe>({
    queryKey: ["recipe", params.id],
    queryFn: () => getRecipe(params.id),
  });

  return match(status)
    .with("error", () => (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-12">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Si è verificato un errore nel caricamento della ricetta.
        </AlertDescription>
      </Alert>
    ))
    .with("pending", () => (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="w-full h-80 rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => `skeleton-info-${i}`).map(
            (key) => (
              <Skeleton key={key} className="h-24 rounded-2xl" />
            ),
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <Skeleton className="md:col-span-2 h-64 rounded-2xl" />
          <div className="md:col-span-3 space-y-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    ))
    .with("success", () => {
      if (!recipe) return null;
      return <RecipeDetail recipe={recipe} />;
    })
    .exhaustive();
}
