import { Controller } from "react-hook-form";
import type { ControllerProps } from "@/types/controllerProps";
import { Button } from "../ui/button";

export const Difficulty: React.FC<ControllerProps> = ({ name, control }) => {
  const levels = [
    { label: "easy", color: "text-emerald-600" },
    { label: "medium", color: "text-amber-500" },
    { label: "hard", color: "text-rose-500" },
    { label: "impossible", color: "text-gray-900" },
  ];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Difficoltà
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {levels.map((lv) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => field.onChange(lv.label)}
                className={`text-xs py-1.5 h-auto cursor-pointer transition-all ${
                  field.value === lv.label
                    ? `border-2 border-primary font-semibold ${lv.color}`
                    : "opacity-50"
                }`}
                key={lv.label}
              >
                {lv.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    />
  );
};