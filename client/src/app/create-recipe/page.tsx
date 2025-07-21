"use client";
import FormVote from "../../components/FormVote";
import Input from "../../components/Input";
import { IoAdd } from "react-icons/io5";
import { TbArrowBigRightFilled, TbArrowBigLeftFilled } from "react-icons/tb";
import { FaCircleCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RecipeFormData } from "../../types/recipes";

const CreateRecipe = () => {
  const [step, setStep] = useState<number>(1);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RecipeFormData>();
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleAddIngredients = () => {
    const currentIngredient = getValues("ingredients");

    setIngredients((prevIngredients) => {
      return [...prevIngredients, currentIngredient];
    });
  };

  const nextStep = async () => {
    const isValid = await trigger([
      "title",
      "category",
      "ingredients",
      "image",
      "rating",
    ]);
    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const backStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data: RecipeFormData) => {
    console.log(data);
  };

  return (
    <div className="h-screen flex justify-center flex-col items-center gap-5">
      <h2 className="text-5xl">Crea una ricetta</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-10 bg-amber-50 flex flex-col gap-10 rounded-4xl shadow-2xl"
      >
        {step === 1 && (
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-5 h-full">
              {/* Title and type of food */}
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Title"
                  input="input"
                  register={register}
                  name="title"
                  errors={errors}
                  validation={{ required: "Title is required" }}
                />
                <Input input="select" register={register} name="category" />
              </div>

              {/* Ingredients Input*/}
              <div className="relative w-full overflow-hidden rounded-4xl">
                <Input
                  name="ingredients"
                  input="input"
                  placeholder="Ingredients"
                  type="text"
                  register={register}
                />
                <IoAdd
                  size={30}
                  className="border-l border-black text-black right-0 top-1/2 -translate-y-1/2 h-full absolute cursor-pointer transition-all duration-300 hover:bg-cyan-900 hover:text-amber-100"
                  onClick={() => handleAddIngredients()}
                />
              </div>
              {/* Ingredients container*/}
              <div>
                {ingredients.map((ing, index) => {
                  return (
                    <span key={index} className="p-2 bg-cyan-700 rounded-4xl">
                      {ing}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Photo e rating  */}
            <div className="flex flex-col gap-2 justify-center items-center">
              <Input input="file" register={register} name="image" />
              <FormVote setValue={setValue} register={register} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-10">
            <div className="relative ">
              <motion.div initial={{ y: -4 }} whileTap={{ y: 0 }}>
                <TbArrowBigLeftFilled
                  onClick={backStep}
                  size={30}
                  className="text-red-700 absolute top-0 -z-0 cursor-pointer"
                />
              </motion.div>
              <TbArrowBigLeftFilled size={30} className="text-black z-20" />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                input="textarea"
                name="preparations"
                register={register}
                rows={7}
                placeholder="Preparation..."
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Cooking time"
                  type="number"
                  input="input"
                  register={register}
                  name="cookingTime"
                />
                <Input
                  placeholder="Preparation Time"
                  type="number"
                  input="input"
                  register={register}
                  name="preparationTime"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {/* Arrow to go step 2  */}
          {step === 1 && (
            <div className="relative ">
              <motion.div initial={{ y: -4 }} whileTap={{ y: 0 }}>
                <TbArrowBigRightFilled
                  onClick={nextStep}
                  size={30}
                  className="text-red-700 absolute top-0 -z-0 cursor-pointer"
                />
              </motion.div>
              <TbArrowBigRightFilled size={30} className="text-black z-20" />
            </div>
          )}
          {step === 2 && (
            <button type="submit" className="relative ">
              <motion.div initial={{ y: -4 }} whileTap={{ y: 0 }}>
                <FaCircleCheck
                  size={30}
                  className="text-red-700 absolute top-0 -z-0 cursor-pointer"
                />
              </motion.div>
              <FaCircleCheck size={30} className="text-black z-20" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
