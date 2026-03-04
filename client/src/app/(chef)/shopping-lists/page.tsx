"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ShoppingCart, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { match } from "ts-pattern";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { getShoppingLists, deleteShoppingList } from "@/api/shopping-lists";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ShoppingLists() {
  const authState = useAuth();
  const userId = authState.status === "authenticated" ? authState.user.uid : null;
  const queryClient = useQueryClient();

  const listsQuery = useQuery({
    queryKey: ["shopping-lists", userId],
    queryFn: () => getShoppingLists(userId!),
    enabled: !!userId,
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: (id: string) => deleteShoppingList(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-lists"] }),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="page-card flex-none p-2 rounded-full hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-7 h-7 text-brand" />
          Le mie liste
        </h1>
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-4">
        {match(listsQuery)
          .with({ status: "error" }, () => (
            <Alert variant="destructive" className="max-w-xl">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Si è verificato un errore nel caricamento delle liste.
              </AlertDescription>
            </Alert>
          ))
          .with({ status: "pending" }, () =>
            Array.from({ length: 3 }, (_, i) => (
              <Card key={i} className="animate-pulse h-24" />
            ))
          )
          .with({ status: "success" }, ({ data: lists }) =>
            lists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                <ShoppingCart className="w-14 h-14 opacity-20" />
                <p className="text-lg font-medium">Nessuna lista salvata</p>
                <p className="text-sm">Crea la tua prima lista dalla pagina ricette</p>
              </div>
            ) : (
              lists.map((list) => (
                <Card key={list.id} className="shadow border-2 border-secondary hover:border-primary transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold">{list.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(list.dateFrom), "dd MMM", { locale: it })} →{" "}
                          {format(new Date(list.dateTo), "dd MMM yyyy", { locale: it })}
                        </p>
                      </div>
                      <span className="text-xs bg-muted rounded-full px-2 py-1 shrink-0">
                        {list.items.length} ingredienti
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/shopping-lists/${list.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Apri lista
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(list.id)}
                        className="gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Elimina
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )
          .exhaustive()}
      </div>
    </div>
  );
}