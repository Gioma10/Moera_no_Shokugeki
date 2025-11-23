import express from "express";
import cors from "cors";
import { db } from "./firebase.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = "8080";

// Server Test
// app.get("/api/home", (req, res) => {
//   res.json({ message: "Hello" });
// });

// Create a recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const newRecipe = req.body;
    const docRef = await db.collection("recipes").add(newRecipe);
    res.status(201).json({ id: docRef.id, ...newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della ricetta" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
