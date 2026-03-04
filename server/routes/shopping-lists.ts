import { Router } from "express";
import { db } from "../firebase.ts";

const router = Router();

// Get all shopping lists by userId
router.get("/", async (req, res) => {
  try {
    const { userId, limit: limitParam, cursor } = req.query;
    const limit = parseInt(limitParam as string) || 10;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    let query = db
      .collection("shopping-lists")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit + 1);

    if (cursor) {
      const docRef = await db.collection("shopping-lists").doc(cursor as string).get();
      query = query.startAfter(docRef);
    }

    const snapshot = await query.get();
    const hasMore = snapshot.docs.length > limit;
    const docs = snapshot.docs.slice(0, limit);

    res.status(200).json({
      items: docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      next: hasMore ? docs.at(-1)?.id : undefined,
      count: docs.length,
      limit,
    });
  } catch (error) {
    console.error("Shopping lists error:", error);
    res.status(500).json({ error: "Error fetching shopping lists" });
  }
});

// Create a shopping list
router.post("/", async (req, res) => {
  try {
    const { userId, dateFrom, dateTo, items } = req.body;

    if (!userId || !dateFrom || !dateTo || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newList = {
      userId,
      dateFrom,
      dateTo,
      items, // MergedIngredient[] con checked: false
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("shopping-lists").add(newList);

    res.status(201).json({ id: docRef.id, ...newList });
  } catch (error) {
    res.status(500).json({ error: "Error creating shopping list" });
  }
});

// Get single shopping list
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docSnap = await db.collection("shopping-lists").doc(id).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: "Error fetching shopping list" });
  }
});

// Save list items
router.put("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    await db.collection("shopping-lists").doc(id).update({ items });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Errore nel salvataggio" });
  }
});

// Delete shopping list
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("shopping-lists").doc(id).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting shopping list" });
  }
});

export default router;