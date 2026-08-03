import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pacienti — Ārsta palīgs",
  description:
    "AI palīgs ārstiem pacienta informācijas kopsavilkuma sagatavošanai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lv" className={`${inter.variable} h-full overflow-x-hidden antialiased`}>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
