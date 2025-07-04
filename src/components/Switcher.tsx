import gsap from "gsap";
import { useEffect, useRef } from "react";
import { IconType } from "react-icons";

type SwitcherProps = {
  elements: {
    id: number;
    title: string;
    subTitle: string;
    isActive: boolean;
    icon: IconType;
  }[];
  onSwitch: (id: number) => void;
};

const Switcher: React.FC<SwitcherProps> = ({ elements, onSwitch }) => {
  const bgSwitch = useRef(null);

  useEffect(() => {
    let yValue;

    if (elements[0].isActive) {
      yValue = 0;
    } else if (elements[1].isActive) {
      yValue = "4.5rem";
    } else if (elements[2].isActive) {
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
  }, [elements]);

  return (
    <div className="border overflow-hidden flex flex-col absolute hover:bg-gray-500/ top-1/2 right-0 -translate-y-1/2 rounded-4xl">
      {elements.map((element) => {
        return (
          <div
            className={`w-18 h-18 transition-all duration-300 flex items-center justify-center cursor-pointer hover:text-black`}
            key={element.id}
            onClick={() => onSwitch(element.id)}
          >
            <element.icon />
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
