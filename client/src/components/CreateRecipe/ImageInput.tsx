"use client";

import React, { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import { fileCompression } from "@/utils/fileCompression";
import { XIcon } from "lucide-react";
import { ControllerProps } from "@/types/controllerProps";

const ImageInput: React.FC<ControllerProps> = ({ name, control }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeImage = (field: any) => {
    field.onChange(null);
    setPreview(null);

    // resettare il valore dell'input per poter selezionare lo stesso file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className=" relative w-30 h-30 sm:w-40 sm:h-40 md:w-60 md:h-60 border rounded-lg group">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mb-4 sm:max-w-40 md:max-w-60 z-50 object-contain rounded-lg"
            />
          )}
          {preview && (
            <div
              onClick={() => removeImage(field)}
              className="border border-primary rounded-3xl p-1 bg-white absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 hidden group-hover:block cursor-pointer hover:bg-red-500"
            >
              <XIcon size={15} />
            </div>
          )}

          <label
            htmlFor="file"
            className={`absolute top-0 w-full h-full flex items-center justify-center cursor-pointer ${
              preview ? "pointer-events-none" : ""
            }`}
          >
            {preview ? "" : "Add"}
          </label>
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

                const url = URL.createObjectURL(file);
                setPreview(url);
              }
            }}
          />
        </div>
      )}
    />
  );
};

export default ImageInput;
