"use client";
import { useEffect, useRef } from "react";
import { titleHome } from "@/animation/transition";

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    titleHome(titleRef.current);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 ref={titleRef} className="text-8xl font-bold justify-center">
        Moera no Shokugeki
      </h1>
    </div>
  );
}
