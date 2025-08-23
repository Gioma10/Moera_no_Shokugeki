type stepsObject = {
  id: number;
  title: string;
  kindOfInput: string;
};

export const steps: stepsObject[] = [
  { id: 1, title: "Put Your Image", kindOfInput: "file" },
  { id: 2, title: "Title", kindOfInput: "text" },
  { id: 3, title: "Category", kindOfInput: "select" },
  { id: 4, title: "Ingredients", kindOfInput: "select" },
  { id: 5, title: "Cooking Time", kindOfInput: "file" },
  { id: 6, title: "Preparation", kindOfInput: "file" },
  { id: 7, title: "Preparation Time", kindOfInput: "file" },
  { id: 8, title: "Vote", kindOfInput: "file" },
];
