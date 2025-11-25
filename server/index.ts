import express from "express";
import cors from "cors";
import { db } from "./firebase.ts";
import multer from "multer"

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

// Server Test
// app.get("/api/home", (req, res) => {
//   res.json({ message: "Hello" });
// });

// Get Recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const querySnapshot= await db.collection("recipes").get();
    
    const recipes = querySnapshot.docs.map((doc)=> {
      return {id: doc.id, ...doc.data()}
    })
    // console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Error on recipes visualization" });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a recipe
app.post("/api/recipes",upload.single("image"), async (req, res) => {
  try {
    const img = req.file
    const newRecipe = req.body;
    const docRef = await db.collection("recipes").add(newRecipe);
    res.status(201).json({ id: docRef.id, image: img, ...newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Error on recipe creation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
