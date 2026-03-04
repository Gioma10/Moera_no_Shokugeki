const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type ShoppingListItem = {
  ingredient: string;
  quantity: number | null;
  unit: "g" | "l" | "ml" | "pcs" | "q.b.";
  checked: boolean;
};

export type ShoppingListFromServer = {
  id: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  items: ShoppingListItem[];
  createdAt: string;
};

export type ShoppingListsPage = {
  items: ShoppingListFromServer[];
  next: string | undefined;
  count: number;
  limit: number;
};

// Get all shopping lists
export const getShoppingLists = async (
  userId: string,
  cursor?: string,
  limit = 10,
): Promise<ShoppingListsPage> => {
  const params = new URLSearchParams({ userId, limit: String(limit) });
  if (cursor) params.append("cursor", cursor);

  const res = await fetch(`${BASE_URL}/api/shopping-lists?${params}`);
  if (!res.ok) throw new Error("Errore nel caricamento delle liste");
  return res.json();
};

// Get single shopping list
export const getShoppingList = async (
  id: string,
): Promise<ShoppingListFromServer> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists/${id}`);
  if (!res.ok) throw new Error("Errore nel caricamento della lista");
  return res.json();
};

// Create shopping list
export const createShoppingList = async (payload: {
  userId: string;
  dateFrom: string;
  dateTo: string;
  items: ShoppingListItem[];
}): Promise<ShoppingListFromServer> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Errore nel salvataggio della lista");
  return res.json();
};

// api/shopping-lists.ts
export const saveShoppingListItems = async (
  id: string,
  items: ShoppingListItem[],
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists/${id}/items`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("Errore nel salvataggio");
};

// Delete shopping list
export const deleteShoppingList = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Errore nell'eliminazione");
};
