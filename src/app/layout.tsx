import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabNav from "@/components/TabNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMA Market Intelligence",
  description: "Dashboard inmobiliario - San Martín de los Andes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <header className="bg-white border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <h1 className="text-xl font-bold text-zinc-900">
              SMA Market Intelligence
            </h1>
            <p className="text-sm text-zinc-500">
              San Martín de los Andes — Precios publicados vs. precios de cierre
            </p>
          </div>
        </header>
        <TabNav />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
