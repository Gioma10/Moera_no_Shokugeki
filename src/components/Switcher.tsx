import { useState } from "react";
import { IconType } from "react-icons";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

const Switcher = () => {
  const [activeSwitch, setActiveSwitch] = useState("");
  const icons: { title: string; Icon: IconType }[] = [
    {
      title: "recipes",
      Icon: FaBook,
    },
    {
      title: "classification",
      Icon: FaTrophy,
    },
    {
      title: "plus",
      Icon: FaPlusCircle,
    },
  ];
  return (
    <div  className="border overflow-hidden flex flex-col absolute hover:bg-gray-500/ top-1/2 right-0 -translate-y-1/2 rounded-4xl">
      {icons.map((item, index) => {
        return (
          <div
            className={`p-5 transition-all duration-500 cursor-pointer ${
              item.title === activeSwitch
                ? "bg-[#fab18a]"
                : "hover:bg-gray-500/30"
            }`}
            key={index}
            onClick={() => setActiveSwitch(item.title)}
          >
            <item.Icon />
          </div>
        );
      })}
    </div>
  );
};

export default Switcher;
