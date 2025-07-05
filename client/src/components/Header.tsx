'use client';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) return null;

  return (
    <h1 className="text-8xl font-bold justify-center fixed top-[30px] left-[30px] text-[50px]">
      Moera no Shokugeki
    </h1>
  );
}