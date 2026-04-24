import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.ttf",
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVEX - Crypto Exchange",
  description: "Buy & sell directly with Novex P2P",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${clashDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
