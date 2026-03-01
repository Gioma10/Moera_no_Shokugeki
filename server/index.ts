import "dotenv/config";
import express from "express";
import cors from "cors";
import { admin, db } from "./firebase.ts";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.ts";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

// Server Test
// app.get("/api/home", (req, res) => {
//   res.json({ message: "Hello" });
// });

// Check email
app.post("/api/auth/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await admin.auth().getUserByEmail(email).catch(() => null);
  res.json({ exists: !!user });
});

// Get Recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const querySnapshot = await db.collection("recipes").get();

    const recipes = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    // console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Error on recipes visualization" });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a recipe
app.post("/api/recipes", upload.single("image"), async (req, res) => {
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
    };

    const docRef = await db.collection("recipes").add(newRecipe);

    res.status(201).json({ id: docRef.id, ...newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Error on recipe creation" });
  }
});

// Delete recipe
app.delete("/api/recipes/:id", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Get single recipe
app.get("/api/recipes/:id", async (req, res) => {
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
