import { Router } from "express";
import { admin } from "../firebase.ts";

const router = Router();

router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await admin.auth().getUserByEmail(email).catch(() => null);
  res.json({ exists: !!user });
});

export default router;