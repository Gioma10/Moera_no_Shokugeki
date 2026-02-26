"use client";

import { ChefHat, PlusCircle, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center px-4">
			{/* Logo / Hero */}
			<div className="flex flex-col items-center gap-6 text-center mb-14">
				<div className="bg-orange-100 rounded-full p-6 shadow-inner">
					<UtensilsCrossed className="w-14 h-14 text-orange-500" />
				</div>

				<div className="space-y-3 flex flex-col items-center">
					<h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
						Moera <span className="text-orange-500">No Shokugeki</span>
					</h1>
					<p className="text-muted-foreground text-lg max-w-sm text-center">
						Tutte le ricette di Moe e Nowy in un unico posto.
					</p>
				</div>
			</div>

			{/* CTA Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
				<Link href="/recipes" className="group">
					<div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200">
						<div className="bg-orange-50 rounded-2xl p-4 group-hover:bg-orange-100 transition-colors">
							<ChefHat className="w-8 h-8 text-orange-500" />
						</div>
						<div className="text-center">
							<p className="font-semibold text-gray-900">Ricette</p>
							<p className="text-xs text-muted-foreground mt-1">
								Sfoglia il ricettario
							</p>
						</div>
					</div>
				</Link>

				<Link href="/create-recipe" className="group">
					<div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-orange-500 shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-200">
						<div className="bg-orange-400 rounded-2xl p-4 group-hover:bg-orange-500 transition-colors">
							<PlusCircle className="w-8 h-8 text-white" />
						</div>
						<div className="text-center">
							<p className="font-semibold text-white">Crea Ricetta</p>
							<p className="text-xs text-orange-100 mt-1">
								Aggiungi una nuova ricetta
							</p>
						</div>
					</div>
				</Link>
			</div>

			{/* Footer */}
			<p className="text-xs text-muted-foreground mt-16">
				Made with ❤️ by Gioma
			</p>
		</div>
	);
}
