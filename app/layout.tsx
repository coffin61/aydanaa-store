// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // جایگزین فونت Geist
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aydanaa Store",
  description: "Online store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa">
      <body className={inter.className}>{children}</body>
    </html>
  );
}