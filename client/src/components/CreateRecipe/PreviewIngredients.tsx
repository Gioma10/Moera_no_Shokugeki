import { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Card } from "../ui/card";
import { IngredientData } from "@/types/recipes";
import { DotX } from "../DotX";
import { motion } from "framer-motion";
import { ControllerRenderProps } from "react-hook-form";

export const PreviewIngredients: React.FC<ControllerProps> = ({
  name,
  control,
}) => {
  const onDelete = (i: number, field: ControllerRenderProps) => {
    const newList = field.value.filter(
      (_: IngredientData, index: number) => i !== index
    );

    field.onChange(newList);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <Card className="p-5  overflow-y-scroll no-scrollbar h-80">
                <h3 className="text-xl font-semibold">List of ingredients</h3>
                {!field.value || field.value.length === 0 ? (
                  <p className="text-gray-400">No ingredient...</p>
                ) : (
                  <ul>
                    {(field.value || []).map(
                      (ing: IngredientData, i: number) => {
                        return (
                          <motion.li
                            key={i}
                            className="text-gray-500 py-1 px-4 cursor-pointer hover:bg-gray-200 rounded-xl flex items-center gap-3 relative"
                            style={{ color: "#6b7280" }}
                            initial="idle"
                            whileHover="hover"
                            onClick={() => onDelete(i, field)}
                          >
                            {/* ICON WRAPPER */}
                            <DotX />

                            {/* TEXT */}
                            <div className="flex-1">
                              <div className="flex gap-2 items-baseline">
                                <span>{ing.ingredient}</span>
                                <span className="text-sm ">
                                  {ing.unit === "q.b."
                                    ? ing.unit
                                    : `${ing.quantity}${ing.unit}`}
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      }
                    )}
                  </ul>
                )}
              </Card>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
