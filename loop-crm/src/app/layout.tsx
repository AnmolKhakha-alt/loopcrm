import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "LoopCRM - WhatsApp CRM for Local Businesses",
  description: "Manage customers, track follow-ups, and increase repeat customers using WhatsApp reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}