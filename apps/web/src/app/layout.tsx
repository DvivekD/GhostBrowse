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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] antialiased selection:bg-emerald-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
