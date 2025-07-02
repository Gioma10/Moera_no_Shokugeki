import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

const Switcher = () => {
  const [activeSwitch, setActiveSwitch] = useState<string>("recipes");
  const bgSwitch = useRef(null);

  useEffect(() => {
    let yValue;

    if (activeSwitch === "recipes") {
      yValue = 0;
    } else if (activeSwitch === "classification") {
      yValue = "4.5rem"; // ad esempio 4.5rem in px
    } else if (activeSwitch === "plus") {
      yValue = "9rem";
    } else {
      yValue = 0;
    }
    if (bgSwitch.current) {
      gsap.to(bgSwitch.current, {
        y: yValue,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [activeSwitch]);

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
    <div className="border overflow-hidden flex flex-col absolute hover:bg-gray-500/ top-1/2 right-0 -translate-y-1/2 rounded-4xl">
      {icons.map((item, index) => {
        return (
          <div
            className={`w-18 h-18 transition-all duration-300 flex items-center justify-center cursor-pointer hover:text-black`}
            key={index}
            onClick={() => setActiveSwitch(item.title)}
          >
            <item.Icon />
          </div>
        );
      })}
      <div
        ref={bgSwitch}
        className="absolute top-0 w-18 h-18 left-0 bg-[#fab18a] -z-20"
      ></div>
    </div>
  );
};

export default Switcher;
