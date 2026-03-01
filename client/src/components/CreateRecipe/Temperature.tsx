import { FlameIcon, SnowflakeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";

export const Temperature: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex rounded-xl overflow-hidden border border-muted h-9 w-20 shrink-0">
              <button
                type="button"
                onClick={() => field.onChange("cold")}
                className={cn(
                  "flex-1 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-cyan-100",
                  field.value === "cold"
                    ? "bg-cyan-200 text-cyan-700"
                    : "text-muted-foreground",
                )}
              >
                <SnowflakeIcon size={15} />
              </button>

              <div className="w-px bg-muted" />

              <button
                type="button"
                onClick={() => field.onChange("hot")}
                className={cn(
                  "flex-1 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-100",
                  field.value === "hot"
                    ? "bg-red-200 text-red-600"
                    : "text-muted-foreground",
                )}
              >
                <FlameIcon size={15} />
              </button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
