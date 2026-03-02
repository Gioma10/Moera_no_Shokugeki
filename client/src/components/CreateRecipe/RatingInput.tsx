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
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Voto
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const starNumber = i + 1;
                const isActive = i < field.value;
                return (
                  <StarIcon
                    key={starNumber}
                    className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-transform active:scale-110"
                    fill={isActive ? "gold" : "white"}
                    stroke={isActive ? "gold" : "currentColor"}
                    onClick={() => field.onChange(starNumber)}
                  />
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
};
