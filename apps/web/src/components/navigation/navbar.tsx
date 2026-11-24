"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Moon, Sun, ArrowUpRight, ShieldCheck, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/github-icon";

interface NavbarProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onScrollToEngine?: () => void;
}

export function Navbar({ audioEnabled, onToggleAudio, onScrollToEngine }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial dark mode from document or system
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const scrollToCommandCenter = () => {
    if (onScrollToEngine) {
      onScrollToEngine();
    } else {
      const el = document.getElementById("command-center");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs font-mono">
            GB
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight font-sans">
                GhostBrowser
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-mono border-zinc-800 text-zinc-400">
                v1.0 • Live CDP
              </Badge>
            </div>
            <span className="text-[10px] text-zinc-500 font-sans hidden sm:block">
              Zero-Click Autonomous Web Execution
            </span>
          </div>
        </div>

        {/* Live System Fleet Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-zinc-300 text-[11px] font-mono">
              Steel.dev CDP Fleet: ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-zinc-300 text-[11px] font-mono">
              W3C C14N Merkle Proof
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Audio Commentary Toggle */}
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition shadow-xs"
            title={audioEnabled ? "Voice Commentary Enabled" : "Voice Commentary Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition shadow-xs"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/DvivekD/GhostBrowse"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition shadow-xs"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Direct CTA */}
          <button
            onClick={scrollToCommandCenter}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-tight transition flex items-center gap-1 shadow-xs"
          >
            <span>Launch Engine</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
