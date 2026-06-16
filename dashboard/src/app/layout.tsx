import type { Metadata } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "EV INDONESIA - Tren, Tantangan & Kesiapan",
  description: "Dashboard statistik perkembangan kendaraan listrik di Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${openSans.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased bg-brand-bg text-brand-navy min-h-screen">
        {children}
      </body>
    </html>
  );
}
