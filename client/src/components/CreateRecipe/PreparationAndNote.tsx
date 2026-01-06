import { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";

export const Preparation: React.FC<ControllerProps> = ({ name, control }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <Textarea
                className="w-[400px] h-[200px]"
                placeholder="Preparation"
                {...field}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export const Note: React.FC<ControllerProps> = ({name, control})=>{
    return (
        <FormField
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormControl>
                <Textarea
                  className="w-[200px] h-[200px]"
                  placeholder="Note something..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          );
        }}
      />
    )
}