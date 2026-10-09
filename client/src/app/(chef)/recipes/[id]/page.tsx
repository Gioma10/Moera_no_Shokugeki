"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeftIcon,
  BookOpen,
  ChefHat,
  Clock,
  Flame,
  Snowflake,
  Star,
  StickyNote,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { match } from "ts-pattern";
import { deleteRecipe, getRecipe } from "@/api/recipes";
import { Category } from "@/components/CreateRecipe/Category";
import { Difficulty } from "@/components/CreateRecipe/Difficulty";
import ImageInput from "@/components/CreateRecipe/ImageInput";
import {
  AddIngredient,
  PreviewIngredients,
} from "@/components/CreateRecipe/Ingredients";
import { Master } from "@/components/CreateRecipe/Master";
import { Method } from "@/components/CreateRecipe/Method";
import {
  Note,
  Preparation,
} from "@/components/CreateRecipe/PreparationAndNote";
import { RatingInput } from "@/components/CreateRecipe/RatingInput";
import { StimatedTime } from "@/components/CreateRecipe/StimatedTime";
import { Temperature } from "@/components/CreateRecipe/Temperature";
import { DeleteRecipeDialog } from "@/components/DeleteRecipeDialog";
import { EditBlockDialog } from "@/components/RecipeDetail/EditBlockDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
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

function RecipeDetail({ id, recipe }: { id: string; recipe: Recipe }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authState = useAuth();
  const isAdmin = authState.user?.role === "admin";
  const block = { id, recipe };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    mutate: onDelete,
    isPending: isDeleting,
    isError: deleteFailed,
    reset: resetDelete,
  } = useMutation({
    mutationFn: () => deleteRecipe(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push("/recipes");
    },
  });

  const imageUrl =
    typeof recipe.image === "string"
      ? recipe.image
      : recipe.image instanceof File || recipe.image instanceof Blob
        ? URL.createObjectURL(recipe.image)
        : undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/recipes"
          className="page-card inline-flex p-2 rounded-full hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              resetDelete();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Elimina
          </Button>
        </div>
      </div>
      <DeleteRecipeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        recipeTitle={recipe.title}
        isPending={isDeleting}
        failed={deleteFailed}
        onConfirm={() => onDelete()}
      />

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
        <EditBlockDialog
          {...block}
          title="Foto, titolo, categoria e voto"
          fields={["image", "title", "category", "rating"]}
          onDark
          className="absolute top-4 right-4"
        >
          {(form) => (
            <>
              <div className="flex flex-row gap-4 items-start">
                <ImageInput name="image" control={form.control} />
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                  <RatingInput name="rating" control={form.control} />
                  <Category name="category" control={form.control} />
                </div>
              </div>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        aria-label="Titolo della ricetta"
                        placeholder="Nome della ricetta..."
                        className="rounded-xl bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-orange-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </EditBlockDialog>
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
          action={
            <EditBlockDialog
              {...block}
              title="Tempo"
              fields={["stimatedTime"]}
              className="size-8"
            >
              {(form) => (
                <StimatedTime name="stimatedTime" control={form.control} />
              )}
            </EditBlockDialog>
          }
        />
        <InfoCard
          icon={<ChefHat className="w-5 h-5 text-violet-500" />}
          label="Difficoltà"
          value={recipe.difficulty}
          bg="bg-violet-50"
          action={
            <EditBlockDialog
              {...block}
              title="Difficoltà"
              fields={["difficulty"]}
              className="size-8"
            >
              {(form) => (
                <Difficulty name="difficulty" control={form.control} />
              )}
            </EditBlockDialog>
          }
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
          action={
            <EditBlockDialog
              {...block}
              title="Temperatura di servizio"
              fields={["temperature"]}
              className="size-8"
            >
              {(form) => (
                <Temperature name="temperature" control={form.control} />
              )}
            </EditBlockDialog>
          }
        />
        {/* Only admins assign a chef, as in the create form. */}
        {(recipe.master || isAdmin) && (
          <InfoCard
            icon={<ChefHat className="w-5 h-5 text-amber-500" />}
            label="Chef"
            value={
              recipe.master
                ? (MASTER_LABELS[recipe.master] ?? recipe.master)
                : "—"
            }
            bg="bg-amber-50"
            action={
              isAdmin && (
                <EditBlockDialog
                  {...block}
                  title="Chef"
                  fields={["master"]}
                  className="size-8"
                >
                  {(form) => <Master name="master" control={form.control} />}
                </EditBlockDialog>
              )
            }
          />
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Ingredients */}
        <Card className="md:col-span-2 shadow-sm border-0 bg-muted/40">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                Ingredienti
              </h2>
              <EditBlockDialog
                {...block}
                title="Ingredienti"
                fields={["ingredients"]}
              >
                {(form) => (
                  <>
                    <AddIngredient name="ingredients" control={form.control} />
                    <PreviewIngredients
                      name="ingredients"
                      control={form.control}
                    />
                  </>
                )}
              </EditBlockDialog>
            </div>
            <Separator />
            <ul className="space-y-3">
              {recipe.ingredients.map((item, index) => (
                <li
                  key={`${index}-${item.ingredient}`}
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
          <Card className="shadow-sm border-0 bg-muted/40">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  Metodo
                </h2>
                <EditBlockDialog
                  {...block}
                  title="Metodo di cottura"
                  fields={["method"]}
                >
                  {(form) => <Method name="method" control={form.control} />}
                </EditBlockDialog>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {recipe.method || "Nessun metodo indicato."}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-muted/40">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  Preparazione
                </h2>
                <EditBlockDialog
                  {...block}
                  title="Preparazione"
                  fields={["preparation"]}
                >
                  {(form) => (
                    <Preparation name="preparation" control={form.control} />
                  )}
                </EditBlockDialog>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {recipe.preparation || "Nessuna preparazione indicata."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes */}
      <Card className="shadow-sm border-0 bg-amber-50 border-l-4 border-amber-400">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-amber-700">
              <StickyNote className="w-5 h-5" />
              Note
            </h2>
            <EditBlockDialog {...block} title="Note" fields={["note"]}>
              {(form) => <Note name="note" control={form.control} />}
            </EditBlockDialog>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">
            {recipe.note || "Nessuna nota."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  bg,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`${bg} relative rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}
    >
      {action && <div className="absolute top-2 right-2">{action}</div>}
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
      return <RecipeDetail id={params.id} recipe={recipe} />;
    })
    .exhaustive();
}
