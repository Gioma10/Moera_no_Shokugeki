import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { AssertAuthenticated } from "@/components/auth/AssertAuthenticated";
import { RedirectToLogin } from "@/components/auth/RedirectToLogin";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-orange-50 via-white to-rose-50 min-h-screen`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <AssertAuthenticated
              roles={["admin", "approved"]}
              fallback={
                <Suspense>
                  <RedirectToLogin />
                </Suspense>
              }
              loader={
                <div className="flex h-screen items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-orange-500" />
                </div>
              }
            >
              {children}
            </AssertAuthenticated>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
