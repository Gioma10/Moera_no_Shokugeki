import { FormValues } from "../components/create-recipe/Form";

type stepsObject = {
  id: number;
  title: string;
  kindOfStep: string;
  name: keyof FormValues;
};

export const steps: stepsObject[] = [
  { id: 1, title: "Put Your Image", kindOfStep: "file", name: "image" },
  { id: 2, title: "Title", kindOfStep: "text", name: "title" },
  { id: 3, title: "Category", kindOfStep: "buttons", name: "category" },
  //   { id: 4, title: "Ingredients", kindOfStep: "select", name: "ingredients" },
  //   { id: 5, title: "Cooking Time", kindOfStep: "number", name: "cookingTime" },
  //   { id: 6, title: "Preparation", kindOfStep: "textArea", name: "preparation" },
  //   { id: 7, title: "Preparation Time", kindOfStep: "number", name: "preparationTime" },
  //   { id: 8, title: "Vote", kindOfStep: "", name: "vote" },
];
