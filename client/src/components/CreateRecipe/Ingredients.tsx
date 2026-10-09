import { ClipboardPlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, type ControllerRenderProps } from "react-hook-form";
import type { ControllerProps } from "@/types/controllerProps";
import type { IngredientData } from "@/types/recipes";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const AddIngredient: React.FC<ControllerProps> = ({ name, control }) => {
  const [ingredient, setIngredient] =
    useState<IngredientData["ingredient"]>("");
  const [quantity, setQuantity] = useState<IngredientData["quantity"]>("");
  const [unit, setUnit] = useState<IngredientData["unit"]>("q.b.");

  const onAdd = (field: ControllerRenderProps) => {
    if (!ingredient || !unit) return;
    if (unit !== "q.b." && (!quantity || Number(quantity) <= 0)) return;
    if (unit === "q.b." && quantity) return;

    const newList = [...(field.value || []), { ingredient, quantity, unit }];
    field.onChange(newList);
    setIngredient("");
    setQuantity("");
    setUnit("q.b.");
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2 w-full">
          {/* Ingredient name */}
          <Input
            type="text"
            aria-label="Nuovo ingrediente"
            placeholder="Ingrediente..."
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd(field);
              }
            }}
            className="bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-orange-400"
          />

          {/* Quantity + Unit + Add button */}
          <div className="flex gap-2">
            <Input
              type="text"
              aria-label="Quantità del nuovo ingrediente"
              placeholder="Quantità"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*([.,]\d*)?$/.test(val)) setQuantity(val.replace(",", "."));
              }}
              className="bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-orange-400 flex-1 min-w-0"
            />

            <Select
              value={unit}
              onValueChange={(v) => setUnit(v as IngredientData["unit"])}
            >
              <SelectTrigger className="w-22 cursor-pointer bg-muted/40 border-0">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q.b.">q.b.</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="l">l</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="pcs">pcs</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer shrink-0 bg-orange-500 hover:bg-orange-600 text-white border-0"
              aria-label="Aggiungi ingrediente"
              onClick={() => onAdd(field)}
            >
              <ClipboardPlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export const PreviewIngredients: React.FC<ControllerProps> = ({ name, control }) => (
  <FormField name={name} control={control} render={({ field, fieldState }) => (
    <FormItem>
      <Card className="p-4 bg-muted/30 border-0 rounded-2xl">
        <h3 className="text-sm font-semibold">Ingredienti da controllare</h3>
        {!field.value?.length ? <p className="text-muted-foreground text-sm">Nessun ingrediente aggiunto.</p> : (
          <ul className="space-y-4">
            {field.value.map((_: unknown, index: number) => (
              // Rows have no local state: their index is the form's array path.
              // biome-ignore lint/suspicious/noArrayIndexKey: indexed react-hook-form field paths
              <li key={index} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                <FormField name={`${name}.${index}.ingredient`} control={control} render={({ field }) => (
                  <FormItem><FormControl><Input {...field} value={field.value ?? ""} aria-label={`Ingrediente ${index + 1}`} placeholder="Nome ingrediente" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex items-start gap-2">
                  <FormField name={`${name}.${index}.quantity`} control={control} render={({ field }) => (
                    <FormItem className="min-w-0 flex-1"><FormControl><Input {...field} value={field.value ?? ""} inputMode="decimal" aria-label={`Quantità ingrediente ${index + 1}`} placeholder="Quantità" onChange={event => field.onChange(event.target.value.replace(",", "."))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name={`${name}.${index}.unit`} control={control} render={({ field }) => (
                    <FormItem className="w-28"><Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger aria-label={`Unità ingrediente ${index + 1}`} className="w-full"><SelectValue placeholder="Unità" /></SelectTrigger></FormControl>
                      <SelectContent>{["g", "l", "ml", "pcs", "q.b."].map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="outline" aria-label={`Elimina ingrediente ${index + 1}`} onClick={() => field.onChange(field.value.filter((_: unknown, i: number) => i !== index))}><Trash2 className="size-4" aria-hidden="true" /></Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {fieldState.invalid && !fieldState.error?.message && <p className="text-sm text-destructive">Controlla i dati degli ingredienti prima di continuare.</p>}
      </Card>
      <FormMessage />
    </FormItem>
  )} />
);
