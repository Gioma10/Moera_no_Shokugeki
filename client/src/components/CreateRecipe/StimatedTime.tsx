import { formatMinutes, TIME_OPTIONS } from "@/lib/time";
import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const StimatedTime: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <Select
            value={field.value ? String(field.value) : ""}
            onValueChange={(value) => field.onChange(Number(value))}
          >
            <FormControl>
              <SelectTrigger
                aria-label="Tempo di preparazione"
                className="w-full bg-muted/40 border-0 focus:ring-1 focus:ring-orange-400"
              >
                <SelectValue placeholder="Tempo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72">
              {/* Older recipes may hold a time outside the 30-minute steps: keep it visible. */}
              {field.value && !TIME_OPTIONS.includes(field.value) && (
                <SelectItem value={String(field.value)}>
                  {formatMinutes(field.value)}
                </SelectItem>
              )}
              {TIME_OPTIONS.map((minutes) => (
                <SelectItem key={minutes} value={String(minutes)}>
                  {formatMinutes(minutes)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
