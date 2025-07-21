export interface RecipeFormData {
  title: string;
  category: string;
  ingredients: string;
  preparations: string;
  image: FileList;
  rating: number;
  preparationTime?: string;
  cookingTime?: string;
}