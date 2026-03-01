import { Router } from "express";
import { db } from "../../firebase.ts";
import { requireAdmin } from "../../middleware/auth.ts";

const router = Router();

router.get("/pending", requireAdmin, async (req, res) => {
  const snapshot = await db.collection("users").where("role", "==", "pending").get();
  const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  res.json(users);
});

router.post("/:uid/approve", requireAdmin, async (req, res) => {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: "UID mancante" });
    await db.collection("users").doc(uid).update({ role: "approved" });
    res.json({ success: true });
  });
  
  router.post("/:uid/reject", requireAdmin, async (req, res) => {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: "UID mancante" });
    await db.collection("users").doc(uid).update({ role: "rejected" });
    res.json({ success: true });
  });

export default router;