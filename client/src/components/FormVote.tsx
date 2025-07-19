"use client";
import Image from "next/image";
import { useState } from "react";
import SomaOn from "../assets/soma-kun-on.png";
import SomaOff from "../assets/soma-kun-off.png";

const FormVote = () => {
  const [votes, setVotes] = useState(() => Array(5).fill(SomaOff));

  const handleSelectVote = (i: number) => {
    setVotes((prevVotes) => {
      const updateVotes = prevVotes.map((el, index) => {
        if (index <= i) {
          return SomaOn;
        } else {
          return SomaOff;
        }
      });
      return updateVotes;
    });
  };
  return (
    <div className="gap-2 grid grid-cols-5">
      {votes.map((item, index) => {
        return (
          <Image
            key={index}
            src={item}
            alt="votes images"
            className="cursor-pointer max-w-14"
            onClick={() => handleSelectVote(index)}
          ></Image>
        );
      })}
    </div>
  );
};

export default FormVote;
