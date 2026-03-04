import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ShoppingListBuilderProvider } from "@/context/ShoppingListBuilderContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moera no Shokugeki",
  description: "Il ricettario di Moe e Nowy",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-orange-50 via-white to-rose-50 min-h-screen`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ShoppingListBuilderProvider>
              {children}
            </ShoppingListBuilderProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
