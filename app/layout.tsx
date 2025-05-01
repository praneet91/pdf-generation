import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webpage to PDF Converter",
  description: "Convert any webpage to PDF using Browserless and Puppeteer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
