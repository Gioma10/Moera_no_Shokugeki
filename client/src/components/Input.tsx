"use client";

import { RiImageAddFill } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";

interface InputProps {
  type?: string;
  placeholder?: string;
  input?: string;
}

const Input: React.FC<InputProps> = ({ input, ...InputProps }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

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
                className="object-cover"
              />
            ) : (
              <RiImageAddFill size={50} className="text-gray-500 border" />
            )}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="w-full h-full hidden"
            onChange={handleImageChange}
          />
        </div>
      )}
      {/* Inserire il procedimento  */}
      {input === "textarea" && <textarea className={generalClass}></textarea>}

      {/* Selezionare la tipologia e gli ingredienti */}
      {input === "select" && (
        <select
          className={generalClass}
          name="typeRecipe"
          id="typeRecipe"
          defaultValue="Scegli la tipologia"
        >
          <option value="scegli la tipologia" className="text-gray-500" disabled>
            Scegli la tipologia
          </option>
          <option value="primo">Primo</option>
          <option value="secondo">Secondo</option>
          <option value="dessert">Dessert</option>
        </select>
      )}

      {/* Inserire tutti gli input normali  */}
      {input === "input" && <input {...InputProps} className={generalClass} />}
    </>
  );
};
export default Input;
