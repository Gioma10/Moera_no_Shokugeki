import { useState } from "react";
import Image from "next/image";
import { RiImageAddFill } from "react-icons/ri";
import { motion } from "motion/react";

const ImageInput: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };
  return (
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
        id="imageUpload"
        type="file"
        accept="image/*"
        className="w-full h-full hidden"
        onChange={handleImageChange}
      />
    </motion.div>
  );
};

export default ImageInput;
