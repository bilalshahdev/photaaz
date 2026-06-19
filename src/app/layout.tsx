import type { Metadata } from "next";
import "./globals.css";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
