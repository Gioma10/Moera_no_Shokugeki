import { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import { FlameIcon, SnowflakeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Temperature: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        console.log(field.value);
        return (
          <FormItem>
            <FormControl>
              <div className="flex items-center relative w-18 rounded-md shadow-xs">
                <div
                  onClick={() => field.onChange("cold")}
                  className={cn(
                    "py-2 ps-2 pe-5  hover:bg-cyan-300 border border-e-0 h-full top-0 cursor-pointer rounded-s-md absolute left-0 transition-all duration-300",
                    field.value === "cold" && "bg-cyan-300"
                  )}
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
                  }}
                >
                  <SnowflakeIcon size={17} />
                </div>

                <div
                  onClick={() => field.onChange("hot")}
                  className={cn(
                    "pe-2 ps-5 py-2 hover:bg-red-300 border border-s-0 top-0 cursor-pointer  h-full rounded-e-md absolute right-0 transition-all duration-300",
                    field.value === "hot" && "bg-red-300"
                  )}
                  style={{
                    clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  <FlameIcon size={17} />
                </div>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
