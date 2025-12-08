import { ClipboardPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { ControllerProps } from "@/types/controllerProps";
import { motion } from "framer-motion";
import { DotX } from "../DotX";
import { IngredientData } from "@/types/recipes";

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

  // const onDelete = (i: number, field: ControllerRenderProps) => {
  //   const newList = field.value.filter(
  //     (_: IngredientData, index: number) => i !== index
  //   );

  //   field.onChange(newList);
  // };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex items-stretch gap-2">
            {/* Set Single Ingredients */}
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Put an ingredient"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAdd(field);
                  }
                }}
              />

              <div className=" flex gap-2">
                <Input
                  type="text"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => {
                    // permette solo numeri
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setQuantity(val);
                  }}
                />

                <Select
                  value={unit}
                  onValueChange={(v) => setUnit(v as IngredientData["unit"])}
                >
                  <SelectTrigger className="cursor-pointer">
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
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onAdd(field)}
            >
              <ClipboardPlusIcon />
            </Button>
          </div>
        );
      }}
    />
  );
};
