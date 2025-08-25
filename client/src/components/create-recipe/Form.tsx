"use client";

import { useState } from "react";
import { steps } from "../../utils/formSteps";
import ImageInput from "./ImageInput";
import { motion } from "motion/react";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { shakeError } from "../../animation/transition";
import CategoryBtns from "./CategoryBtns";

export type FormValues = {
  image: FileList;
  title: string;
  category: string;
};

const Form: React.FC = () => {
  const [indexSteps, setIndexSteps] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const form = useForm<FormValues>();
  const { setValue, trigger, handleSubmit, register, control } = form;

  const handleNextStep = async () => {
    const currentStep = steps[indexSteps];

    const isValid = await trigger(currentStep.name);

    if (isValid) {
      setIndexSteps((prevStep) => prevStep + 1);
      setError(false);
    } else {
      setShakeKey((prev) => prev + 1);
      setError(true);
    }
  };

  console.log(indexSteps);

  const onSubmit = async (data: FormValues) => {
    console.log("save data", data);

    try {
      const payload = {
        ...data,
        image: imageUrl,
      };

      const res = await fetch("http://localhost:3001/api/recipes/create-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Errore nella creazione della ricetta");
      }

      const savedRecipe = await res.json();
      console.log("Ricetta salvata:", savedRecipe);

    } catch (error) {
      console.log(error);
    }
  };

  console.log(error);

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center gap-5"
      >
        <h3 className="text-4xl text-center">{steps[indexSteps].title}</h3>

        {/* Only Image  */}
        {steps[indexSteps].kindOfStep === "file" && (
          <ImageInput name={steps[indexSteps].name} register={register} />
        )}

        {/* Title Input  */}
        {steps[indexSteps].kindOfStep === "text" && (
          <div className="flex flex-col gap-2">
            <input
              type={steps[indexSteps].kindOfStep}
              className="border outline-none px-2 rounded-xl"
              {...register(steps[indexSteps].name, {
                required: "Title is required",
              })}
            />
          </div>
        )}

        {/* Choose Category  */}
        {steps[indexSteps].kindOfStep === "buttons" && (
          <CategoryBtns setValue={setValue} />
        )}

        {/* Next step button  */}
        {indexSteps < steps.length - 1 ? (
          <motion.button
            key={shakeKey}
            animate={error ? shakeError() : undefined}
            type="submit"
            className="p-2 border cursor-pointer"
            onClick={handleNextStep}
          >
            Next
          </motion.button>
        ) : (
          <button type="submit" className="p-2 cursor-pointer border">
            Submit
          </button>
        )}
      </motion.form>
      <DevTool control={control} />
    </>
  );
};

export default Form;
