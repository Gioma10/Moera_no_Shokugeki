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
  "Crudo",
  "Bollito",
  "Sobbollito",
  "Al vapore",
  "Saltato in padella",
  "Soffritto",
  "Fritto",
  "Fritto in olio profondo",
  "Grigliato",
  "Cotto sulla piastra",
  "Al forno",
  "Arrosto",
  "Brasato",
  "In umido",
  "In salsa",
  "Affumicato",
  "Marinato",
  "Sous-vide",
  "A bagnomaria",
  "Cotto a fuoco lento",
  "Cotto velocemente",
  "Al microonde",
  "Frullato",
  "Tritato",
  "Impastato",
  "Fermentato",
  "Caramellato",
  "Glassato",
  "Gratinato",
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
