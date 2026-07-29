import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Horizon Stays — Hotels & Resorts",
  description: "Book your next escape at a handpicked collection of hotels and resorts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-sand text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
