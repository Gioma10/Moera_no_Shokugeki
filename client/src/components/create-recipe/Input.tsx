"use client";

import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import { RecipeFormData } from "../../types/recipes";
import { motion } from "framer-motion";

interface InputProps {
  type?: string;
  placeholder?: string;
  input?: string;
  register?: UseFormRegister<RecipeFormData>;
  name?: keyof RecipeFormData;
  rows?: number;
  errors?: FieldErrors<RecipeFormData>;
  rules?: RegisterOptions<RecipeFormData, keyof RecipeFormData>;
}

const Input: React.FC<InputProps> = ({
  input,
  register,
  name,
  errors,
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

  const generalClass = `rounded-4xl border focus:outline-none  px-5 py-3 text-xl ${
    errorMessage ? "border-red-700 text-red-700" : "border-gray-800 text-black"
  }`;
  return (
    <>
      {/* Inserire l'immagine  */}
      {input === "file" && (
        <motion.div
          className={`relative w-80 cursor-pointer h-56 rounded-4xl border focus:outline-none text-black text-xl`}
        >
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
              <RiImageAddFill size={50} />
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
        </motion.div>
      )}
      {/* Inserire il procedimento  */}
      {input === "textarea" && (
        <motion.div>
          <textarea
            {...InputProps}
            {...(register && name ? register(name) : {})}
            className={generalClass}
          ></textarea>
        </motion.div>
      )}

      {/* Selezionare la tipologia */}
      {input === "select" && (
        <motion.div className={generalClass}>
          <select
            className="focus:outline-none cursor-pointer"
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
        </motion.div>
      )}

      {/* Inserire tutti gli input normali  */}
      {input === "input" && (
        <div className="flex flex-col gap-1 justify-center relative ">
          <motion.input
            {...InputProps}
            className={generalClass}
            {...(register && name ? register(name) : {})}
          />
        </div>
      )}
    </>
  );
};
export default Input;
