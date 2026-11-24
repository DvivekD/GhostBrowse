import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostBrowser — Autonomous Zero-Click Web Execution Engine",
  description: "Beyond the Browser: Autonomous AI Swarm navigating the web into 1-Action Approval Cards with verified DOM proof.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
