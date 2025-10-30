import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Nunito } from "next/font/google";
import QueryProvider from "@/providers/QueryClient";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CBASE",
  description: "The top tier customer management system",
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
        className={`${nunito.className} antialiased`}
      >
        <QueryProvider> {children}</QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
