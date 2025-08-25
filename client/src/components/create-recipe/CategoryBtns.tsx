import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "./Form";

interface CategoryBtnsProps {
  setValue: UseFormSetValue<FormValues>;
}

const CategoryBtns: React.FC<CategoryBtnsProps> = ({ setValue }) => {
  const [catSelected, setCatSelected] = useState<string>("");
  const handleCategorySelected = (c: string) => {
    setValue("category", c, { shouldValidate: true });
    setCatSelected(c);
  };
  return (
    <div className="flex gap-3">
      {["Starter", "Main dish", "Dessert"].map((cat) => (
        <button
          key={cat}
          type="button"
          className={`border p-2 rounded-4xl ${
            catSelected === cat
              ? "bg-white text-black"
              : "hover:text-black hover:bg-white"
          }  transition-all duration-300 cursor-pointer`}
          onClick={() => handleCategorySelected(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBtns;
