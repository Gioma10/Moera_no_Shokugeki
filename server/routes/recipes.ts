import { createExtractionRouter } from "./recipe-extraction.ts";
import { requireApproved } from "../middleware/auth.ts";
import { Router } from "express";
import multer from "multer";
import cloudinary from "../cloudinaryConfig.ts";
import { db } from "../firebase.ts";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get Recipes
router.get("/", async (req, res) => {
  try {
    const { userId, limit: limitParam, cursor } = req.query;
    const limit = parseInt(limitParam as string) || 12;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    let query = db
      .collection("recipes")
      .where("userId", "==", userId)
      .orderBy("title", "asc")
      .limit(limit + 1);

    if (cursor) {
      const docRef = await db.collection("recipes").doc(cursor as string).get();
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
    console.error("Recipes error:", error);
    res.status(500).json({ error: "Error on recipes visualization" });
  }
});

// Create a recipe
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const {
      title,
      rating,
      difficulty,
      stimatedTime,
      temperature,
      category,
      ingredients,
      preparation,
      note,
      method,
      master,
      userId,
    } = req.body;

    if (!file) return res.status(400).json({ error: "Missing file" });

    // Upload on Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "recipes" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    let parsedIngredients;
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch {
      return res
        .status(400)
        .json({ error: "Ingredients must be a valid JSON array" });
    }

    const newRecipe = {
      image: result.secure_url,
      public_id: result.public_id,
      title,
      rating: Number(rating),
      difficulty,
      stimatedTime: Number(stimatedTime),
      temperature,
      category,
      ingredients: parsedIngredients,
      preparation,
      note: note || "",
      method,
      master,
      userId
    };

    const docRef = await db.collection("recipes").add(newRecipe);

    res.status(201).json({ id: docRef.id, ...newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Error on recipe creation" });
  }
});

router.use(createExtractionRouter(requireApproved));

// Update a recipe. The image is optional: without a new file the current one is kept.
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    // The multer middleware widens the params type; ":id" is always present here.
    const docRef = db.collection("recipes").doc(req.params.id as string);
    const current = (await docRef.get()).data();
    if (!current) return res.status(404).json({ error: "Recipe not found" });

    const {
      title,
      rating,
      difficulty,
      stimatedTime,
      temperature,
      category,
      ingredients,
      preparation,
      note,
      method,
      master,
    } = req.body;

    let parsedIngredients;
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch {
      return res
        .status(400)
        .json({ error: "Ingredients must be a valid JSON array" });
    }

    let image = { image: current.image, public_id: current.public_id };
    if (req.file) {
      const file = req.file;
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "recipes" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });
      image = { image: result.secure_url, public_id: result.public_id };
    }

    const updated = {
      ...image,
      title,
      rating: Number(rating),
      difficulty,
      stimatedTime: Number(stimatedTime),
      temperature,
      category,
      ingredients: parsedIngredients,
      preparation,
      note: note || "",
      method,
      master,
    };
    await docRef.update(updated);

    // Remove the replaced image only once the recipe points to the new one.
    if (req.file && current.public_id) {
      await cloudinary.uploader.destroy(current.public_id).catch(error => console.error(error));
    }

    res.status(200).json({ id: docRef.id, ...current, ...updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error on recipe update" });
  }
});

// Delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Recupera il documento per avere il public_id
    const docSnap = await db.collection("recipes").doc(id).get();
    const recipe = docSnap.data();

    // Cancella l’immagine da Cloudinary
    if (recipe?.public_id) {
      await cloudinary.uploader.destroy(recipe.public_id);
    }

    // Cancella il documento Firestore
    await db.collection("recipes").doc(id).delete();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting recipe" });
  }
});

// Get single recipe
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const docSnap = await db.collection("recipes").doc(id).get();

    if (!docSnap) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    res.status(500).json({ error: `Error on get recipe: ${id} ` });
  }
});

export default router;
