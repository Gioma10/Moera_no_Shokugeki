import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";

export const Preparation: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Preparazione
              </span>
              <Textarea
                className="w-full h-36 resize-none bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-orange-400"
                placeholder="Descrivi la preparazione..."
                {...field}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export const Note: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Note
              </span>
              <Textarea
                className="w-full h-36 resize-none bg-amber-50 border-0 focus-visible:ring-1 focus-visible:ring-amber-400"
                placeholder="Note aggiuntive..."
                {...field}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};