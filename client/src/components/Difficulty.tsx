import { useState } from "react";
import { Button } from "./ui/button";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { ControllerProps } from "@/types/controllerProps";

export const Difficulty: React.FC<ControllerProps> = ({ name, control }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const levels = [
    { color: "green", label: "easy" },
    { color: "yellow", label: "medium" },
    { color: "red", label: "hard" },
    { color: "black", label: "impossible" },
  ];

  const handleSelect = (label: string, field: ControllerRenderProps) => {
    const activeValue = label;
    setSelected(activeValue);
    field.onChange(activeValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="grid grid-cols-2 gap-2">
            {levels.map((lv) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSelect(lv.label, field)}
                className={` ${
                  selected === lv.label ? "border-2" : "opacity-40 "
                } cursor-pointer border-primary md:text-base md:p-5 sm:text-sm sm:p-2 text-xs p-1`}
                key={lv.label}
              >
                {lv.label}
              </Button>
            ))}
          </div>
        );
      }}
    />
  );
};
