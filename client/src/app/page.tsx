"use client";
import { useEffect, useRef, useState } from "react";
import { scaleUp, titleHome } from "../animation/transition";
import Switcher from "../components/Switcher";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { IconType } from "react-icons";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
// import Soma from "../assets/soma-kun.png";
// import Image from "next/image";

type SwitcherItem = {
  id: number;
  title: string;
  subTitle: string;
  isActive: boolean;
  path: string;
  icon: IconType;
};

const initialSwitcherElements: SwitcherItem[] = [
  {
    id: 1,
    title: "Tutte le ricette",
    subTitle: "Qui troverai tutte le ricette accumulate nel corso del tempo.",
    isActive: true,
    path: "/recipes",
    icon: FaBook,
  },
  {
    id: 2,
    title: "Aggiungi una ricetta",
    subTitle:
      "Qui potrai creare nuove ricette da aggiungere al tuo ricettario.",
    isActive: false,
    path: "/create-recipe",
    icon: FaPlusCircle,
  },
  {
    id: 3,
    title: "Classifica",
    subTitle:
      "Qui vedrai la classifica delle ricette migliori votate dagli utenti.",
    isActive: false,
    path: "*",
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
  }, [introEnd, switcherElements]);

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
          <div ref={menuRef} className="border rounded-4xl p-10 me-20">
            {switcherElements.map((el) => {
              return (
                <div key={el.id}>
                  {el.isActive && (
                    <div className="flex items-center">
                      {/* Title and Subtitle  */}
                      <div className="flex gap-3 flex-col">
                        <h2 className="text-7xl font-bold">{el.title}</h2>
                        <h4 className="text-2xl italic">{el.subTitle}</h4>
                        <div>
                          <Link href={el.path}>
                            <button className="justify-center flex gap-2 items-center cursor-pointer border py-2 px-4 rounded-4xl hover:bg-white hover:text-[#c6aa93] transition-all duration-300">
                              Scopri
                              <IoIosArrowForward />
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Image  */}
                      {/* <div>
                        <Image src={Soma} alt="Soma" className="w-96" />
                      </div> */}
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
