import { motion } from "framer-motion";
import { ClipboardPlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, type ControllerRenderProps } from "react-hook-form";
import type { ControllerProps } from "@/types/controllerProps";
import type { IngredientData } from "@/types/recipes";
import { DotX } from "../DotX";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FormControl, FormField, FormItem } from "../ui/form";
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
              placeholder="Quantità"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setQuantity(val);
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

export const PreviewIngredients: React.FC<ControllerProps> = ({
  name,
  control,
}) => {
  const onDelete = (i: number, field: ControllerRenderProps) => {
    const newList = field.value.filter(
      (_: IngredientData, index: number) => i !== index,
    );
    field.onChange(newList);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Card className="p-4 overflow-y-auto no-scrollbar h-48 sm:h-56 bg-muted/30 border-0 rounded-2xl">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Ingredienti aggiunti
              </h3>
              {!field.value || field.value.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nessun ingrediente...
                </p>
              ) : (
                <ul className="space-y-1">
                  {(field.value || []).map((ing: IngredientData, i: number) => (
                    <motion.li
                      key={ing.ingredient}
                      className="py-1.5 px-3 cursor-pointer hover:bg-red-50 rounded-xl flex items-center gap-3"
                      initial="idle"
                      whileHover="hover"
                      onClick={() => onDelete(i, field)}
                    >
                      <DotX />
                      <div className="flex-1 flex gap-2 items-baseline">
                        <span className="text-sm font-medium">
                          {ing.ingredient}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ing.unit === "q.b."
                            ? ing.unit
                            : `${ing.quantity}${ing.unit}`}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </Card>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
