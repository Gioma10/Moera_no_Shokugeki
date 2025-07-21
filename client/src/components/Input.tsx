"use client";

import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import { RecipeFormData } from "../types/recipes";

interface InputProps {
  type?: string;
  placeholder?: string;
  input?: string;
  register?: UseFormRegister<RecipeFormData>;
  name?: keyof RecipeFormData;
  rows?: number;
  errors?: FieldErrors<RecipeFormData>;
  validation?: RegisterOptions<RecipeFormData, keyof RecipeFormData>; // regole di validazione dinamiche
}

const Input: React.FC<InputProps> = ({
  input,
  register,
  name,
  errors,
  validation,
  ...InputProps
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const errorMessage = errors && name && errors[name]?.message;

  const generalClass =
    "rounded-4xl border border-gray-800 focus:outline-none text-black px-5 py-3 text-xl";
  return (
    <>
      {/* Inserire l'immagine  */}
      {input === "file" && (
        <div className="relative w-80 cursor-pointer h-56 rounded-4xl border border-gray-800 focus:outline-none text-black text-xl">
          <label
            htmlFor="imageUpload"
            className="absolute w-full h-full flex justify-center items-center cursor-pointer"
          >
            {previewImage ? (
              <Image
                fill
                src={previewImage}
                alt="Preview Image"
                className="object-cover rounded-4xl"
              />
            ) : (
              <RiImageAddFill size={50} className="text-gray-500 border" />
            )}
          </label>
          <input
            {...(register && name ? register(name) : {})}
            id="imageUpload"
            type="file"
            accept="image/*"
            className="w-full h-full hidden"
            onChange={handleImageChange}
          />
        </div>
      )}
      {/* Inserire il procedimento  */}
      {input === "textarea" && (
        <textarea
          {...InputProps}
          {...(register && name ? register(name) : {})}
          className={generalClass}
        ></textarea>
      )}

      {/* Selezionare la tipologia */}
      {input === "select" && (
        <select
          className={generalClass}
          id="typeRecipe"
          {...(register && name ? register(name) : {})}
        >
          <option hidden className="text-amber-300" value="">
            Scegli la tipologia
          </option>
          <option value="primo">Primo</option>
          <option value="secondo">Secondo</option>
          <option value="dessert">Dessert</option>
        </select>
      )}

      {/* Inserire tutti gli input normali  */}
      {input === "input" && (
        <>
          <input
            {...InputProps}
            className={generalClass}
            {...(register && name ? register(name, validation) : {})}
          />
          {errorMessage && <span> {errorMessage.toString()}</span>}
        </>
      )}
    </>
  );
};
export default Input;
