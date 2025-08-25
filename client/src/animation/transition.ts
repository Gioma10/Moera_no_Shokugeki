"use client";
import gsap from "gsap";

export const titleHome = (
  ref: HTMLDivElement,
  setIntroEnd: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const tl = gsap.timeline({
    onComplete: () => {
      setIntroEnd(true); // ✅ Questo ora avviene solo alla fine di TUTTA la timeline
    },
  });

  tl.from(ref, {
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  });

  tl.to(ref, {
    top: 30,
    left: 30,
    duration: 1.5,
    fontSize: 50,
    ease: "power2.out",
  });
};

export const scaleUp = (ref: HTMLDivElement | null) => {
  gsap.from(ref, {
    opacity: 0,
    scale: 0.7,
    duration: 0.5,
  });
};

export const shakeError = () => ({
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 },
  border: "1px solid red",
  color: 'red'
});
