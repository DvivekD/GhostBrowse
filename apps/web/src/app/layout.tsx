import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostBrowser — Autonomous Zero-Click Web Execution Engine",
  description: "Swiss minimalist autonomous execution engine converting natural language intent into 1-Action Approval Cards with verified cryptographic DOM proof.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#fafafa] text-[#09090b] antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
