import { StarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerProps } from "@/types/controllerProps";

export const RatingInput: React.FC<ControllerProps> = ({ control, name }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex gap-0.5 justify-center sm:justify-start">
            {Array.from({ length: 5 }, (_, i) => {
              const starNumber = i + 1; // 1, 2, 3, 4, 5
              const isActive = i < field.value;
              return (
                <StarIcon
                  key={starNumber} // ← usa starNumber invece di i
                  fill={`${isActive ? "yellow" : "white"}`}
                  onClick={() => field.onChange(starNumber)}
                />
              );
            })}
          </div>
        );
      }}
    />
  );
};
