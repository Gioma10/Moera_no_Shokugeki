import type { Control, FieldValues } from "react-hook-form";

export type ControllerProps = {
  name: string;
  control: Control<FieldValues>;
};
