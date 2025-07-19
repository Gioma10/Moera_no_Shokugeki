"use client";
import FormVote from "../../components/FormVote";
import Input from "../../components/Input";
import { IoAdd } from "react-icons/io5";
import { TbArrowBigRightFilled } from "react-icons/tb";
import { motion } from "framer-motion";

const CreateRecipe = () => {
  return (
    <div className="h-screen flex justify-center flex-col items-center gap-5">
      <h2 className="text-5xl">Crea una ricetta</h2>
      <form
        action=""
        className="p-10 bg-amber-50 flex flex-col gap-10 rounded-4xl shadow-2xl"
      >
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="Title" input="input" />
              <Input input="select" />
            </div>
            <div className="relative w-full overflow-hidden rounded-4xl">
              <Input input="input" placeholder="Ingredienti" type="text" />
              <IoAdd
                size={30}
                className="border-l border-black text-black right-0 top-1/2 -translate-y-1/2 h-full absolute cursor-pointer transition-all duration-300 hover:bg-cyan-900 hover:text-amber-100"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Input input="file" />
            <FormVote />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="relative ">
            <motion.div initial={{ y: -4 }} whileTap={{ y: 0 }}>
              <TbArrowBigRightFilled
                size={30}
                className="text-red-700 absolute top-0 -z-0 cursor-pointer"
              />
            </motion.div>
            <TbArrowBigRightFilled size={30} className="text-black z-20" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
