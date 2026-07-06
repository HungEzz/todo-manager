import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Todo List",
  description: "Manage your daily tasks",
  icons: {
    icon: "https://srtgroup.vn/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
