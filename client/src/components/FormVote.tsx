"use client";
import Image from "next/image";
import { useState } from "react";
import SomaOn from "../assets/soma-kun-on.png";
import SomaOff from "../assets/soma-kun-off.png";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { RecipeFormData } from "../types/recipes";

interface FormVoteProps {
  register: UseFormRegister<RecipeFormData>;
  setValue: UseFormSetValue<RecipeFormData>;
}

const FormVote: React.FC<FormVoteProps> = ({ register, setValue }) => {
  const [votes, setVotes] = useState(() => Array(5).fill(SomaOff));

  const handleSelectVote = (i: number) => {
    setVotes((prevVotes) => {
      const updateVotes = prevVotes.map((el, index) =>
        index <= i ? SomaOn : SomaOff
      );
      return updateVotes;
    });

    if (setValue) {
    setValue("rating", i + 1); // perché parte da 0
  }
  };
  return (
    <div className="gap-2 grid grid-cols-5">
      <h5 className="text-black col-span-5">Vota il piatto:</h5>
      {votes.map((item, index) => {
        return (
          <Image
            key={index}
            src={item}
            alt="votes images"
            className="cursor-pointer max-w-14 "
            onClick={() => handleSelectVote(index)}
          ></Image>
        );
      })}
      <input type="hidden" {...(register && register("rating"))} />
    </div>
  );
};

export default FormVote;
