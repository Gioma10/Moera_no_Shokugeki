"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button asChild>
        <Link href="/recipes">Ricette</Link>
      </Button>
      <Button asChild>
        <Link href="/create-recipe">Crea ricetta</Link>
      </Button>
    </div>
  );
}
