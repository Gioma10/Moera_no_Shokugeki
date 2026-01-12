import { ControllerProps } from "@/types/controllerProps";
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
      render={({ field }) => {
        console.log(field.value)
        return (
          <FormItem>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Method"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {methods.map((met) => (
                    <SelectItem value={met}>{met}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
