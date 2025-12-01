import { ControllerProps } from "@/types/controllerProps";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";

export const RatingInput: React.FC<ControllerProps> = ({ control, name }) => {
  const [vote, setVote] = useState<number>(0);

  const onSelect = (value: number, field: ControllerRenderProps) => {
    const newValue = value + 1;
    setVote(newValue);
    field.onChange(newValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => {
              const isActive = i < vote;
              return (
                <StarIcon
                  fill={` ${isActive ? "yellow" : "white"}`}
                  onClick={() => onSelect(i, field)}
                  className={`cursor-pointer ${
                    isActive ? "text-yellow-400" : "text-gray-400"
                  }`}
                />
              );
            })}
          </div>
        );
      }}
    />
  );
};
