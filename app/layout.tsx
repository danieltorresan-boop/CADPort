import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CADPort - Free DWG to DXF Converter",
  description: "Convert DWG files to DXF format instantly in your browser. 100% free, secure, and private. No file uploads, all processing happens locally.",
  keywords: ["DWG", "DXF", "CAD", "converter", "AutoCAD", "free", "online"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Script src="/libdxfrw.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
