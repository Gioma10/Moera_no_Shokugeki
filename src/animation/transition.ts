"use client";
import gsap from "gsap";

export const titleHome = (ref: HTMLDivElement) => {
  gsap.from(ref, {
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(ref, {
        y: -350,
        duration: 1.5,
        fontSize: 50,
        ease: "power2.out",
      });
    },
  });
};
