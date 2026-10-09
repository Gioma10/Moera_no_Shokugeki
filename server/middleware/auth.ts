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

// Extraction consumes the shared AI quota, so only approved members may use it.
export async function requireApproved(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return res.status(401).json({ error: "Accedi per importare una ricetta." });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await db.collection("users").doc(decoded.uid).get();
    if (!["admin", "approved"].includes(user.data()?.role)) {
      return res.status(403).json({ error: "Il tuo account non è abilitato all’importazione." });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Sessione scaduta. Accedi di nuovo." });
  }
}
