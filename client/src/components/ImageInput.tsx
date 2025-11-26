"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { fileCompression } from "@/utils/fileCompression";

interface Props {
  name: string;
  control: any;
}

const ImageInput: React.FC<Props> = ({ name, control }) => {
 

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const compressed = await fileCompression(file);
              field.onChange(compressed);
            }
          }}
        />
      )}
    />
  );
};

export default ImageInput;
