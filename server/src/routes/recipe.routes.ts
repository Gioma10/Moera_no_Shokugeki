import express from "express";
import { createRecipe, getAllRecipe } from "../controllers/recipes.controller";

const router = express.Router();

router.post("/create-recipe", createRecipe);
router.get("/recipes", getAllRecipe);

export default router;
