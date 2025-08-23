"use client";

import { useState } from "react";
import { steps } from "../../utils/formSteps";
import ImageInput from "./ImageInput";

const Form: React.FC = () => {
  const [indexSteps, setIndexSteps] = useState<number>(0);

  const handleNextStep = () => {
    setIndexSteps((prevStep) => prevStep + 1);
  };

  console.log(indexSteps);

  return (
    <form className="flex flex-col gap-5">
      {steps[indexSteps].kindOfInput === "file" && <ImageInput />}
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-4xl text-center">
          {steps[indexSteps].title}
        </label>
        <input
          type={steps[indexSteps].kindOfInput}
          className="border outline-none px-2 rounded-xl"
        />
      </div>

      {indexSteps < steps.length - 1 && (
        <button type="button" className="p-2 border" onClick={handleNextStep}>
          Next
        </button>
      )}
    </form>
  );
};

export default Form;
