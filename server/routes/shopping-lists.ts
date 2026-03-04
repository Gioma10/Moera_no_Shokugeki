import { Router } from "express";
import { db } from "../firebase.ts";

const router = Router();

// Get all shopping lists by userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const snapshot = await db
      .collection("shopping-lists")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const lists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shopping lists" });
  }
});

// Create a shopping list
router.post("/", async (req, res) => {
  try {
    const { userId, name, dateFrom, dateTo, items } = req.body;

    if (!userId || !name || !dateFrom || !dateTo || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newList = {
      userId,
      name,
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

// Update checked state of an item
router.patch("/:id/items/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const { checked } = req.body;

    const docSnap = await db.collection("shopping-lists").doc(id).get();
    if (!docSnap.exists) return res.status(404).json({ error: "List not found" });

    const list = docSnap.data() as any;
    list.items[Number(index)].checked = checked;

    await db.collection("shopping-lists").doc(id).update({ items: list.items });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
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