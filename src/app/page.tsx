"use client";
import { useEffect, useRef, useState } from "react";
import { scaleUp, titleHome } from "@/animation/transition";
import Switcher from "@/components/Switcher";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { IconType } from "react-icons";
import Soma from "../assets/soma-kun.png";
import Image from "next/image";

type SwitcherItem = {
  id: number;
  title: string;
  subTitle: string;
  isActive: boolean;
  icon: IconType;
};

const initialSwitcherElements: SwitcherItem[] = [
  {
    id: 1,
    title: "Tutte le ricette",
    subTitle: "Qui troverai tutte le ricette accumulate nel corso del tempo.",
    isActive: true,
    icon: FaBook,
  },
  {
    id: 2,
    title: "Aggiungi una ricetta",
    subTitle:
      "Qui potrai creare nuove ricette da aggiungere al tuo ricettario.",
    isActive: false,
    icon: FaPlusCircle,
  },
  {
    id: 3,
    title: "Classifica",
    subTitle:
      "Qui vedrai la classifica delle ricette migliori votate dagli utenti.",
    isActive: false,
    icon: FaTrophy,
  },
];

export default function Home() {
  const [introEnd, setIntroEnd] = useState(false);
  const [switcherElements, setSwitcherElements] = useState(
    initialSwitcherElements
  );
  const titleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntroEnd(false);
    if (!titleRef.current) return;
    titleHome(titleRef.current, setIntroEnd);
  }, []);

  useEffect(() => {
    if (introEnd && menuRef.current) {
      scaleUp(menuRef.current); // ✅ ora è presente nel DOM
    }
  }, [introEnd]);

  const handleSwitch = (id: number) => {
    setSwitcherElements((prev) =>
      prev.map((el) => ({
        ...el,
        isActive: el.id === id,
      }))
    );
  };
  console.log(switcherElements);

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Title animated */}
      <h1 ref={titleRef} className="text-8xl font-bold justify-center fixed">
        Moera no Shokugeki
      </h1>
      {introEnd && (
        <div className="flex items-center justify-around">
          {/* Text and subtext */}
          <div ref={menuRef} className="border">
            {switcherElements.map((el) => {
              return (
                <div key={el.id}>
                  {el.isActive && (
                    <div className="flex ">
                      {/* Title and Subtitle  */}
                      <div>
                        <h2 className="text-7xl">{el.title}</h2>
                        <h4 className="text-2xl">{el.subTitle}</h4>
                      </div>

                      {/* Image  */}
                      <div>
                        <Image src={Soma} alt="Soma" className="w-20" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Switcher */}
          <Switcher elements={switcherElements} onSwitch={handleSwitch} />
        </div>
      )}
    </div>
  );
}
