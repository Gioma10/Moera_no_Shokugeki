"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ShoppingCart, RotateCcw } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { use } from "react";
import { getShoppingList, updateShoppingListItem } from "@/api/shopping-lists";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShoppingListDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["shopping-list", id],
    queryFn: () => getShoppingList(id),
  });

  const { mutate: toggleItem } = useMutation({
    mutationFn: ({ index, checked }: { index: number; checked: boolean }) =>
      updateShoppingListItem(id, index, checked),
    onMutate: async ({ index, checked }) => {
      // Optimistic update — aggiorna la UI prima della risposta del server
      await queryClient.cancelQueries({ queryKey: ["shopping-list", id] });
      const previous = queryClient.getQueryData(["shopping-list", id]);
      queryClient.setQueryData(["shopping-list", id], (old: any) => ({
        ...old,
        items: old.items.map((item: any, i: number) =>
          i === index ? { ...item, checked } : item
        ),
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["shopping-list", id], context?.previous);
    },
  });

  const { mutate: resetAll } = useMutation({
    mutationFn: async () => {
      const list = listQuery.data!;
      await Promise.all(
        list.items.map((item, i) =>
          item.checked ? updateShoppingListItem(id, i, false) : Promise.resolve()
        )
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list", id] }),
  });

  if (listQuery.status === "pending") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (listQuery.status === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>Lista non trovata.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const list = listQuery.data;
  const unchecked = list.items.filter((i) => !i.checked);
  const checked = list.items.filter((i) => i.checked);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/shopping-lists"
          className="page-card flex-none p-2 rounded-full hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{list.name}</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(list.dateFrom), "dd MMM", { locale: it })} →{" "}
            {format(new Date(list.dateTo), "dd MMM yyyy", { locale: it })}
          </p>
        </div>
        {checked.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => resetAll()}
            className="gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{checked.length} di {list.items.length} ingredienti</span>
          <span>{Math.round((checked.length / list.items.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${(checked.length / list.items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Items da prendere */}
      {unchecked.length > 0 && (
        <ul className="space-y-2">
          {unchecked.map((item) => {
            const index = list.items.indexOf(item);
            return (
              <li
                key={index}
                onClick={() => toggleItem({ index, checked: true })}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-background cursor-pointer hover:border-brand hover:shadow-sm transition-all active:scale-98"
              >
                <span className="text-base font-medium">{item.ingredient}</span>
                <span className="text-sm text-muted-foreground shrink-0 ml-2">
                  {item.quantity !== null
                    ? `${item.quantity} ${item.unit}`
                    : <span className="italic">q.b.</span>
                  }
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Items già presi */}
      {checked.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Nel carrello
          </p>
          <ul className="space-y-2">
            {checked.map((item) => {
              const index = list.items.indexOf(item);
              return (
                <li
                  key={index}
                  onClick={() => toggleItem({ index, checked: false })}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-border/50 bg-muted/30 cursor-pointer opacity-50 hover:opacity-70 transition-all active:scale-98"
                >
                  <span className="text-base font-medium line-through">{item.ingredient}</span>
                  <span className="text-sm text-muted-foreground shrink-0 ml-2 line-through">
                    {item.quantity !== null
                      ? `${item.quantity} ${item.unit}`
                      : <span className="italic">q.b.</span>
                    }
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Tutto completato */}
      {unchecked.length === 0 && list.items.length > 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 text-brand opacity-80" />
          <p className="text-lg font-semibold text-foreground">Spesa completata! 🎉</p>
          <p className="text-sm">Hai preso tutti gli ingredienti</p>
        </div>
      )}
    </div>
  );
}