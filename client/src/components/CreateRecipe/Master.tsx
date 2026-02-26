import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";

export const Master: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Chef
              </span>
              <div className="flex flex-row gap-2">
                {[
                  { value: "nowy", src: "/images/nowy.png", alt: "Nowy" },
                  { value: "moe", src: "/images/moe.png", alt: "Moe" },
                ].map((master) => (
                  <button
                    key={master.value}
                    type="button"
                    onClick={() => field.onChange(master.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      field.value === master.value
                        ? "border-orange-400 bg-orange-50"
                        : "border-transparent bg-muted/40 opacity-50",
                    )}
                  >
                    <Image
                      src={master.src}
                      alt={master.alt}
                      width={40}
                      height={40}
                      className={cn(
                        "transition-all duration-300 rounded-full",
                        field.value !== master.value && "grayscale",
                      )}
                    />
                    <span className="text-xs font-medium">{master.alt}</span>
                  </button>
                ))}
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};