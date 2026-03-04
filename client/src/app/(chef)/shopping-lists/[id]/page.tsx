"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { AlertCircle, ArrowLeftIcon, Save, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getShoppingList, saveShoppingListItems } from "@/api/shopping-lists";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const DETAIL_SKELETON_KEYS = [
  "detail-skeleton-0",
  "detail-skeleton-1",
  "detail-skeleton-2",
  "detail-skeleton-3",
  "detail-skeleton-4",
  "detail-skeleton-5",
] as const;

export default function ShoppingListDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const listQuery = useQuery({
    queryKey: ["shopping-list", id],
    queryFn: () => getShoppingList(id),
  });

  const [localItems, setLocalItems] = useState(listQuery.data?.items ?? []);
  const [isDirty, setIsDirty] = useState(false);

  // Inizializza localItems quando i dati arrivano dal server
  useEffect(() => {
    if (listQuery.data) {
      setLocalItems(listQuery.data.items);
    }
  }, [listQuery.data]);

  const { mutate: saveItems, isPending } = useMutation({
    mutationFn: () => saveShoppingListItems(id, localItems),
    onSuccess: () => setIsDirty(false),
  });

  function toggleItem(index: number) {
    setLocalItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
    setIsDirty(true);
  }

  if (listQuery.status === "pending") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {DETAIL_SKELETON_KEYS.map((key) => (
          <div key={key} className="h-14 rounded-xl bg-muted animate-pulse" />
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
  const unchecked = localItems.filter((i) => !i.checked);
  const checked = localItems.filter((i) => i.checked);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/shopping-lists"
          className="page-card flex-none p-2 rounded-full hover:shadow-md transition-shadow"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <span className="text-2xl font-bold">
            {format(new Date(list.dateFrom), "dd MMM", { locale: it })} →{" "}
            {format(new Date(list.dateTo), "dd MMM yyyy", { locale: it })}
          </span>
        </div>
      </div>

      {/* Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {checked.length} di {localItems.length} ingredienti
          </span>
          <span>{Math.round((checked.length / localItems.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${(checked.length / localItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Items da prendere */}
      {unchecked.length > 0 && (
        <ul className="space-y-2">
          {unchecked.map((item) => {
            const index = localItems.indexOf(item);
            return (
              <li
                key={`${item.ingredient}-${String(item.quantity)}-${item.unit}`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border bg-background cursor-pointer hover:border-brand hover:shadow-sm transition-all active:scale-[0.98] text-left"
                >
                  <span className="text-base font-medium">
                    {item.ingredient}
                  </span>
                  <span className="text-sm text-muted-foreground shrink-0 ml-2">
                    {item.quantity !== null ? (
                      `${item.quantity} ${item.unit}`
                    ) : (
                      <span className="italic">q.b.</span>
                    )}
                  </span>
                </button>
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
              const index = localItems.indexOf(item);
              return (
                <li
                  key={`${item.ingredient}-${String(item.quantity)}-${item.unit}-checked`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border/50 bg-muted/30 cursor-pointer opacity-50 hover:opacity-70 transition-all active:scale-[0.98] text-left"
                  >
                    <span className="text-base font-medium line-through">
                      {item.ingredient}
                    </span>
                    <span className="text-sm text-muted-foreground shrink-0 ml-2 line-through">
                      {item.quantity !== null ? (
                        `${item.quantity} ${item.unit}`
                      ) : (
                        <span className="italic">q.b.</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Tutto completato */}
      {unchecked.length === 0 && localItems.length > 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 text-brand opacity-80" />
          <p className="text-lg font-semibold text-foreground">
            Spesa completata! 🎉
          </p>
          <p className="text-sm">Hai preso tutti gli ingredienti</p>
        </div>
      )}

      {/* Bottone salva — fisso in basso, visibile solo se ci sono modifiche */}
      <div
        className={cn(
          "fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 transition-all duration-300",
          isDirty
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={() => saveItems()}
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand text-white font-semibold shadow-xl hover:bg-brand/90 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Salvataggio..." : "Salva progressi"}
        </button>
      </div>
    </div>
  );
}
