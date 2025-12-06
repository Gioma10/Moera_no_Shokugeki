import { ControllerProps } from "@/types/controllerProps";
import { StarIcon } from "lucide-react";
import { Controller,  } from "react-hook-form";

export const RatingInput: React.FC<ControllerProps> = ({ control, name }) => {
 

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex gap-0.5 justify-center sm:justify-start">
            {Array.from({ length: 5 }, (_, i) => {
              const isActive = i < field.value;
              return (
                <StarIcon
                  key={i}
                  fill={` ${isActive ? "yellow" : "white"}`}
                  onClick={() => field.onChange(i + 1)}
                  className={`cursor-pointer text-gray-400 ${
                    isActive && "text-yellow-400"
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
