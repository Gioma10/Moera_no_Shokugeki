"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <h1 className="text-8xl font-bold justify-center fixed top-[30px] left-[30px] text-[50px] cursor-pointer">
      <Link href="/">Moera no Shokugeki</Link>
    </h1>
  );
}
