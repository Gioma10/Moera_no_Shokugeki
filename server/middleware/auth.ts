import type { Request, Response, NextFunction } from "express";
import { admin, db } from "../firebase.ts";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const role = userDoc.data()?.role;

    if (role !== "admin") {
      return res.status(403).json({ error: "Accesso negato" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token non valido" });
  }
}