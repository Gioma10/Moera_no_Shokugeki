import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moera no Shokugeki",
    short_name: "Moera",
    description: "Il ricettario di Moe e Nowy",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#fff7ed",
    icons: [
      {
        src: "/images/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}