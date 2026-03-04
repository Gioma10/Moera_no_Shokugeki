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

// Get all shopping lists
export const getShoppingLists = async (userId: string): Promise<ShoppingListFromServer[]> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists?userId=${userId}`);
  if (!res.ok) throw new Error("Errore nel caricamento delle liste");
  return res.json();
};

// Get single shopping list
export const getShoppingList = async (id: string): Promise<ShoppingListFromServer> => {
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

// Update item checked state
export const updateShoppingListItem = async (
  listId: string,
  itemIndex: number,
  checked: boolean
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists/${listId}/items/${itemIndex}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checked }),
  });
  if (!res.ok) throw new Error("Errore nell'aggiornamento");
};

// Delete shopping list
export const deleteShoppingList = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/shopping-lists/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Errore nell'eliminazione");
};