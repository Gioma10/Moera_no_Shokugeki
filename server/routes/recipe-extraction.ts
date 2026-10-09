import { Router, type RequestHandler } from "express";
import multer from "multer";
import { MAX_IMPORT_BYTES, IMPORT_MIME_TYPES } from "../types/extracted-recipe.ts";
import { extractRecipe, detectImageType, ExtractionError } from "../services/extract-recipe.ts";

// A small, per-process throttle. Provider quotas remain the project-wide limit.
export function createExtractionRouter(authorize: RequestHandler, extract = extractRecipe) {
  const router = Router();
  const windows = new Map<string, { started: number; count: number; active: boolean }>();
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMPORT_BYTES, files: 1, fields: 0 },
    fileFilter: (_req, file, callback) => {
      // Many browsers send HEIC as application/octet-stream: allow it by extension, the bytes are checked after upload.
      const untypedHeic = file.mimetype === "application/octet-stream" && /\.(heic|heif)$/i.test(file.originalname);
      if (!untypedHeic && !(IMPORT_MIME_TYPES as readonly string[]).includes(file.mimetype)) return callback(new ExtractionError(415, "Scegli una foto JPG, PNG, WebP o HEIC."));
      callback(null, true);
    },
  }).single("image");
  
  router.post("/extract", authorize, (req, res) => {
    const now = Date.now();
    for (const [key, value] of windows) if (!value.active && now - value.started >= 60000) windows.delete(key);
    const uid = req.user?.uid;
    if (!uid) { res.status(401).json({ error: "Accedi per importare una ricetta." }); return; }
    const window = windows.get(uid) ?? { started: now, count: 0, active: false };
    if (window.active || window.count >= 3) { res.setHeader("Retry-After", "60"); res.status(429).json({ error: "Attendi un minuto prima di importare un’altra foto." }); return; }
    window.count++; window.active = true; windows.set(uid, window);
    res.once("close", () => { window.active = false; });
    upload(req, res, async error => {
      try {
        if (error) {
          if (error instanceof ExtractionError) throw error;
          if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") throw new ExtractionError(413, "La foto supera 8 MB. Scegli un file più piccolo.");
          throw new ExtractionError(400, "Invia una sola foto nel campo image (massimo 8 MB).");
        }
        if (!req.file) throw new ExtractionError(400, "Seleziona una foto da leggere.");
        const detected = detectImageType(req.file.buffer);
        if (!detected) throw new ExtractionError(415, "Il file non è una foto JPG, PNG, WebP o HEIC valida.");
        const data = await extract(req.file.buffer, detected);
        res.setHeader("Cache-Control", "no-store");
        res.json(data);
      } catch (error) {
        const known = error instanceof ExtractionError;
        res.status(known ? error.status : 500).json({ error: known ? error.message : "Importazione non riuscita. Riprova tra poco." });
      } finally { window.active = false; }
    });
  });
  return router;
}
