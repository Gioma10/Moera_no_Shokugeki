"use client";
import { useEffect, useRef, useState } from "react";
import { scaleUp, titleHome } from "@/animation/transition";
import Switcher from "@/components/Switcher";

export default function Home() {
  const [introEnd, setIntroEnd] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntroEnd(false);
    if (!titleRef.current) return;
    titleHome(titleRef.current, setIntroEnd);
  }, []);

  useEffect(() => {
    if (introEnd && menuRef.current) {
      scaleUp(menuRef.current); // ✅ ora è presente nel DOM
    }
  }, [introEnd]);

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Title animated */}
      <h1 ref={titleRef} className="text-8xl font-bold justify-center fixed">
        Moera no Shokugeki
      </h1>

      {introEnd && (
        <div className="flex items-center justify-around">
          {/* Text and subtext */}
          <div ref={menuRef} className="border">
            <h2>Tutte le ricette</h2>
            <h4>
              Qui troverai tutte le ricette accumulate nel corso del tempo.
              Piano piano diventeranno tantissime !!!
            </h4>
          </div>

          {/* Switcher */}
          <Switcher />
        </div>
      )}
    </div>
  );
}
