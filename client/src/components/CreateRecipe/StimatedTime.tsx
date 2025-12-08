import { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

export const StimatedTime: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                placeholder="Stimated Time"
                value={field.value || 0}
                min={0}
                step={30} // every time +30
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                min
              </span>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
