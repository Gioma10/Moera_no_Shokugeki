import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Creiamo una ricetta
export const createRecipe = async (data: any) => {
  const docRef = await addDoc(collection(db, "recipes"), data);
  return { id: docRef.id, ...data };
};

// Visualizziamo tutte le ricette create
export const getAllRecipes = async () => {
  const querySnapshot = await getDocs(collection(db, "recipes"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
