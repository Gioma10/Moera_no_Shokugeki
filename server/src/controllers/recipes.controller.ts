import { Request, Response } from "express";
import * as recipesService from "../services/recipe.service";

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const newRecipe = await recipesService.createRecipe(req.body);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Errore nel creare la ricetta" });
  }
};

export const getAllRecipe = async (req: Request, res: Response) => {
  try {
    const recipes = await recipesService.getAllRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare le ricette" });
  }
};
