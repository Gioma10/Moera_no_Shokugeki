import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const methods = [
  "Raw",
  "Boiled",
  "Simmered",
  "Steamed",
  "Stir-fried",
  "Sautéed",
  "Fried",
  "Deep-fried",
  "Grilled",
  "Griddle cooked",
  "Baked",
  "Roasted",
  "Braised",
  "Stewed",
  "Cooked in sauce",
  "Smoked",
  "Marinated",
  "Sous-vide",
  "Bain-marie",
  "Slow cooked",
  "Quick cooked",
  "Microwaved",
  "Blended",
  "Minced",
  "Kneaded",
  "Fermented",
  "Caramelized",
  "Glazed",
  "Gratinated",
];

export const Method: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Metodo di cottura
              </span>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-muted/40 border-0 focus:ring-1 focus:ring-orange-400">
                  <SelectValue placeholder="Seleziona un metodo" />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((met) => (
                    <SelectItem key={met} value={met}>
                      {met}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
