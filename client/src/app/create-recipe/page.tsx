"use client";
import Input from "../../components/Input";
import Image from "next/image";
import SomaOn from "../../assets/soma-kun-on.png";
import SomaOff from "../../assets/soma-kun-off.png";
import { useState } from "react";

const CreateRecipe = () => {
  const [votes, setVotes] = useState(() => Array(5).fill(SomaOff));

  const handleSelectVote = (i: number) => {
    setVotes((prevVotes) => {
      const updateVotes = prevVotes.map((el, index) => {
        if (index <= i) {
          return el === SomaOn ? SomaOff : SomaOn;
        } else {
          return el;
        }
      });
      console.log(updateVotes);
      return updateVotes;
    });
  };
  return (
    <div className="h-screen flex justify-center flex-col items-center gap-5">
      <h2 className="text-5xl">Crea una ricetta</h2>
      <form action="" className="p-10 bg-amber-50 rounded-4xl">
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-2">
            <Input type="text" placeholder="Title" input="input" />
            <Input type="" placeholder="Type" input="select" />
          </div>
          <div className="flex flex-col gap-2">
            <img
              src="https://picsum.photos/200/200"
              alt="Recipe photo"
              className=" rounded-2xl"
            />
            <div className="flex gap-2 max-w-10">
              {votes.map((item, index) => {
                return (
                  <Image
                    key={index}
                    src={item}
                    alt="votes images"
                    className="cursor-pointer"
                    onClick={() => handleSelectVote(index)}
                  ></Image>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
