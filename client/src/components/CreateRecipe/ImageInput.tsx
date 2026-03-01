"use client";

import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import type { ControllerProps } from "@/types/controllerProps";
import { fileCompression } from "@/utils/fileCompression";
import { FormControl, FormField, FormItem } from "../ui/form";

const ImageInput: React.FC<ControllerProps> = ({ name, control }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const preview = field.value ? URL.createObjectURL(field.value) : null;
        const removeImage = (field: ControllerRenderProps) => {
          field.onChange(null);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        };

        return (
          <FormItem>
            <FormControl>
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 shrink-0 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 group overflow-hidden">
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(field)}
                      className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500 hover:text-white"
                    >
                      <XIcon size={12} />
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor="file"
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-2 text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="text-xs font-medium">Foto</span>
                  </label>
                )}
                <input
                  id="file"
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const compressed = await fileCompression(file);
                      field.onChange(compressed);
                    }
                  }}
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default ImageInput;
